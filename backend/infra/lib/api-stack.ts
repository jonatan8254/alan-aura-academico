import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "node:path";

export interface ApiStackProps extends StackProps {
  tablaTitular: dynamodb.Table;
}

/**
 * API Gateway REST, no HTTP API v2: ARQ-01-D5 fija el límite de 3/min de
 * /chat vía un "plan de uso" (usage plan + throttling por clave), que es un
 * mecanismo de API Gateway REST — HTTP API v2 no lo tiene en esos términos.
 *
 * Esta pasada monta /api/v1/health y las 4 rutas de auth (vertical slice) —
 * el resto de las 13 rutas de ARQ-01-D3 se añade handler por handler,
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

    // SESSION_SECRET: TODO antes de desplegar — sacar de Secrets Manager/SSM,
    // no de una env var. Ver backend/src/lib/sesion.ts.
    const entornoDeSesion = {
      SESSION_SECRET: process.env.SESSION_SECRET ?? "dev-secret-cambiar-antes-de-desplegar",
    };

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

    // Un rol de ejecución por función (ARQ-01-D5) — grant puntual, no compartido.
    // logout no toca la tabla: solo verifica la firma de la cookie.
    props.tablaTitular.grantReadWriteData(registro);
    props.tablaTitular.grantReadData(login);
    props.tablaTitular.grantReadData(loginAdmin);

    const auth = v1.addResource("auth");
    auth.addResource("registro").addMethod("POST", new apigateway.LambdaIntegration(registro));
    auth.addResource("login").addMethod("POST", new apigateway.LambdaIntegration(login));
    auth
      .addResource("login-admin")
      .addMethod("POST", new apigateway.LambdaIntegration(loginAdmin));
    auth.addResource("logout").addMethod("POST", new apigateway.LambdaIntegration(logout));
  }

  private crearHandler(
    id: string,
    archivoRelativo: string,
    environment?: Record<string, string>,
  ): NodejsFunction {
    return new NodejsFunction(this, id, {
      entry: path.join(__dirname, "..", "..", "src", "handlers", archivoRelativo),
      handler: "handler",
      runtime: Runtime.NODEJS_22_X, // CAPSULA_CONTEXTO.md: "AWS Lambda (Node 22 / TypeScript)"
      timeout: Duration.seconds(5),
      environment,
    });
  }
}
