import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import * as path from "node:path";

export interface ApiStackProps extends StackProps {
  tablaTitular: dynamodb.Table;
  tablaConfiguracion: dynamodb.Table;
  tablaEventoOperativo: dynamodb.Table;
  bucketConfiguracion: s3.Bucket;
}

/**
 * API Gateway REST, no HTTP API v2: ARQ-01-D5 fija el límite de 3/min de
 * /chat vía un "plan de uso" (usage plan + throttling por clave), que es un
 * mecanismo de API Gateway REST — HTTP API v2 no lo tiene en esos términos.
 *
 * Esta pasada monta /api/v1/health, las 4 rutas de auth, /onboarding y
 * /chat — el resto de las rutas de ARQ-01-D3 se añade handler por handler,
 * repitiendo el mismo patrón (NodejsFunction sin Docker, un rol de
 * ejecución por función, ARQ-01-D5).
 */
export class ApiStack extends Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.api = new apigateway.RestApi(this, "AlanAuraApi", {
      restApiName: "alan-aura-api",
      deployOptions: { stageName: "v1" },
    });

    const v1 = this.api.root.addResource("api").addResource("v1");

    const health = this.crearHandler("HealthHandler", "health.ts");
    v1.addResource("health").addMethod("GET", new apigateway.LambdaIntegration(health));

    // Clave de firma de la cookie de sesión. Generada por CDK, nunca en
    // código ni en una env var en claro — los handlers la leen en runtime
    // por su ARN (backend/src/lib/sesion.ts). No lleva RemovalPolicy.RETAIN
    // (a diferencia de las tablas, ADR-005-D2): perderla solo invalida las
    // sesiones activas, no es la pérdida de dato irreversible que ADR-003
    // declaró sin respaldo.
    const secretoDeSesion = new secretsmanager.Secret(this, "SessionSecret", {
      description: "Clave HMAC para firmar la cookie de sesión (alan-aura, ARQ-01-D1).",
      generateSecretString: { passwordLength: 64, excludePunctuation: true },
    });
    const entornoDeSesion = { SESSION_SECRET_ARN: secretoDeSesion.secretArn };

    const registro = this.crearHandler("RegistroHandler", "auth/registro.ts", {
      TABLA_TITULAR: props.tablaTitular.tableName,
    });
    const login = this.crearHandler("LoginHandler", "auth/login.ts", {
      TABLA_TITULAR: props.tablaTitular.tableName,
      ...entornoDeSesion,
    });
    const loginAdmin = this.crearHandler("LoginAdminHandler", "auth/login-admin.ts", {
      TABLA_TITULAR: props.tablaTitular.tableName,
      ...entornoDeSesion,
    });
    const logout = this.crearHandler("LogoutHandler", "auth/logout.ts", entornoDeSesion);
    const onboarding = this.crearHandler("OnboardingHandler", "onboarding.ts", {
      TABLA_TITULAR: props.tablaTitular.tableName,
      ...entornoDeSesion,
    });

    // Un rol de ejecución por función (ARQ-01-D5) — grant puntual, no compartido.
    // logout no toca la tabla: solo verifica la firma de la cookie.
    props.tablaTitular.grantReadWriteData(registro);
    props.tablaTitular.grantReadData(login);
    props.tablaTitular.grantReadData(loginAdmin);
    props.tablaTitular.grantReadWriteData(onboarding);

    secretoDeSesion.grantRead(login);
    secretoDeSesion.grantRead(loginAdmin);
    secretoDeSesion.grantRead(logout);
    secretoDeSesion.grantRead(onboarding);

    const auth = v1.addResource("auth");
    auth.addResource("registro").addMethod("POST", new apigateway.LambdaIntegration(registro));
    auth.addResource("login").addMethod("POST", new apigateway.LambdaIntegration(login));
    auth
      .addResource("login-admin")
      .addMethod("POST", new apigateway.LambdaIntegration(loginAdmin));
    auth.addResource("logout").addMethod("POST", new apigateway.LambdaIntegration(logout));

    v1.addResource("onboarding").addMethod("POST", new apigateway.LambdaIntegration(onboarding));

    // API key de Groq: secreto externo (no generado por CDK, a diferencia
    // de SessionSecret). El placeholder que CDK genera al crearlo se
    // reemplaza a mano tras el deploy (aws secretsmanager put-secret-value
    // con la key real, nunca escrita en código ni en este repo).
    const groqApiKey = new secretsmanager.Secret(this, "GroqApiKey", {
      description: "API key de Groq (motor conversacional, CAPSULA_CONTEXTO.md). Placeholder hasta poblarla a mano.",
    });

    const chat = this.crearHandler(
      "ChatHandler",
      "chat.ts",
      {
        TABLA_TITULAR: props.tablaTitular.tableName,
        TABLA_CONFIGURACION: props.tablaConfiguracion.tableName,
        TABLA_EVENTO_OPERATIVO: props.tablaEventoOperativo.tableName,
        BUCKET_CONFIGURACION: props.bucketConfiguracion.bucketName,
        GROQ_API_KEY_ARN: groqApiKey.secretArn,
        ...entornoDeSesion,
      },
      // API Gateway REST tiene un tope duro de integración de 29s — el
      // handler debe terminar antes. El presupuesto de Groq (RN-02.9,
      // incl. el reintento de FE-06) ya está acotado a 20s total en
      // groq.ts; 28s deja margen para las lecturas de DynamoDB/S3 alrededor
      // sin arriesgar el corte de API Gateway.
      Duration.seconds(28),
    );
    props.tablaTitular.grantReadWriteData(chat);
    props.tablaConfiguracion.grantReadData(chat);
    props.tablaEventoOperativo.grantWriteData(chat);
    props.bucketConfiguracion.grantRead(chat);
    groqApiKey.grantRead(chat);
    secretoDeSesion.grantRead(chat);

    v1.addResource("chat").addMethod("POST", new apigateway.LambdaIntegration(chat));
  }

  private crearHandler(
    id: string,
    archivoRelativo: string,
    environment?: Record<string, string>,
    timeout: Duration = Duration.seconds(5),
  ): NodejsFunction {
    return new NodejsFunction(this, id, {
      entry: path.join(__dirname, "..", "..", "src", "handlers", archivoRelativo),
      handler: "handler",
      runtime: Runtime.NODEJS_22_X, // CAPSULA_CONTEXTO.md: "AWS Lambda (Node 22 / TypeScript)"
      timeout,
      environment,
    });
  }
}
