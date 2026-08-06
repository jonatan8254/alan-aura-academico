import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "node:path";

/**
 * API Gateway REST, no HTTP API v2: ARQ-01-D5 fija el límite de 3/min de
 * /chat vía un "plan de uso" (usage plan + throttling por clave), que es un
 * mecanismo de API Gateway REST — HTTP API v2 no lo tiene en esos términos.
 *
 * Esta pasada solo monta /api/v1/health, para dejar establecido el patrón
 * (NodejsFunction sin Docker, un rol de ejecución por función — ARQ-01-D5)
 * antes de añadirle el resto de las 13 rutas de ARQ-01-D3 handler por handler.
 */
export class ApiStack extends Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.api = new apigateway.RestApi(this, "AlanAuraApi", {
      restApiName: "alan-aura-api",
      deployOptions: { stageName: "v1" },
    });

    const health = new NodejsFunction(this, "HealthHandler", {
      entry: path.join(__dirname, "..", "..", "src", "handlers", "health.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_22_X, // CAPSULA_CONTEXTO.md: "AWS Lambda (Node 22 / TypeScript)"
      timeout: Duration.seconds(5),
    });

    const v1 = this.api.root.addResource("api").addResource("v1");
    v1.addResource("health").addMethod("GET", new apigateway.LambdaIntegration(health));
  }
}
