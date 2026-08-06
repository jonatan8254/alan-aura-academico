import type { APIGatewayProxyHandler } from "aws-lambda";
import type { LoginAdminRequest, LoginAdminResponse } from "contrato-api";
import { autenticar } from "../../lib/autenticacion.js";
import { firmarSesion } from "../../lib/sesion.js";
import { json, jsonConCookie } from "../../lib/respuestas.js";

/**
 * Mismo 401 genérico si la cuenta no es admin que si las credenciales son
 * inválidas — no revela por qué falló (RE-02), igual que /auth/login.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  let cuerpo: LoginAdminRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }
  if (!cuerpo.username || !cuerpo.contrasena) {
    return json(400, { error: "username y contrasena son requeridos" });
  }

  const perfil = await autenticar(cuerpo.username, cuerpo.contrasena);
  if (!perfil || perfil.rol !== "administrador") {
    return json(401, { error: "credenciales inválidas" });
  }

  const token = await firmarSesion({ titularId: perfil.titularId, rol: perfil.rol });

  return jsonConCookie(
    200,
    { titularId: perfil.titularId, alias: perfil.alias } satisfies LoginAdminResponse,
    token,
  );
};
