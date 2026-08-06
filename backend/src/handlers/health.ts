import type { APIGatewayProxyHandler } from "aws-lambda";
import type { HealthResponse } from "contrato-api";

export const handler: APIGatewayProxyHandler = async () => {
  const cuerpo: HealthResponse = { estado: "ok" };
  return { statusCode: 200, body: JSON.stringify(cuerpo) };
};
