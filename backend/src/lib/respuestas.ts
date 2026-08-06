import type { APIGatewayProxyResult } from "aws-lambda";
import { NOMBRE_COOKIE } from "./sesion.js";

export function json(statusCode: number, cuerpo: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(cuerpo),
    headers: { "Content-Type": "application/json" },
  };
}

/** ARQ-01-D1: SameSite=Strict sin token CSRF, porque Vercel intermedia sin origen cruzado. */
export function jsonConCookie(
  statusCode: number,
  cuerpo: unknown,
  token: string,
): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(cuerpo),
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${NOMBRE_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`,
    },
  };
}

export function limpiarCookie(statusCode: number, cuerpo: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(cuerpo),
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${NOMBRE_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    },
  };
}
