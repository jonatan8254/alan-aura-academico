import type { APIGatewayProxyHandler } from "aws-lambda";
import type { LogoutResponse } from "contrato-api";
import { verificarSesion } from "../../lib/sesion.js";
import { json, limpiarCookie } from "../../lib/respuestas.js";

/** CU-03, cierra RA-01. */
export const handler: APIGatewayProxyHandler = async (event) => {
  const cookieHeader = event.headers?.Cookie ?? event.headers?.cookie;
  const sesion = await verificarSesion(cookieHeader);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" });

  return limpiarCookie(200, { estado: "sesion_cerrada" } satisfies LogoutResponse);
};
