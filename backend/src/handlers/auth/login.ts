import type { APIGatewayProxyHandler } from "aws-lambda";
import type { LoginRequest, LoginResponse } from "contrato-api";
import { autenticar, tieneOnboardingCompleto } from "../../lib/autenticacion.js";
import { dentroDelLimiteDeIntentosDeLogin } from "../../lib/limites.js";
import { firmarSesion } from "../../lib/sesion.js";
import { json, jsonConCookie } from "../../lib/respuestas.js";

export const handler: APIGatewayProxyHandler = async (event) => {
  let cuerpo: LoginRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }
  if (!cuerpo.username || !cuerpo.contrasena) {
    return json(400, { error: "username y contrasena son requeridos" });
  }

  // Bug real, corregido: LoginStatus declara 429 desde el contrato original
  // y nunca se emitía — no había ningún freno de fuerza bruta.
  if (!(await dentroDelLimiteDeIntentosDeLogin(cuerpo.username))) {
    return json(429, { error: "demasiados intentos; espera un momento" });
  }

  const perfil = await autenticar(cuerpo.username, cuerpo.contrasena);
  if (!perfil) return json(401, { error: "credenciales inválidas" });

  const onboardingCompleto = await tieneOnboardingCompleto(perfil.titularId);
  const token = await firmarSesion({ titularId: perfil.titularId, rol: perfil.rol });

  return jsonConCookie(
    200,
    {
      titularId: perfil.titularId,
      alias: perfil.alias,
      onboardingCompleto,
    } satisfies LoginResponse,
    token,
  );
};
