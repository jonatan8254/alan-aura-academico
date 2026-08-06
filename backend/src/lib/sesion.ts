import { createHmac, timingSafeEqual } from "node:crypto";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import type { Rol } from "contrato-api";

export const NOMBRE_COOKIE = "alan_aura_sesion";
const DURACION_MS = 1000 * 60 * 60 * 12; // 12h

const smClient = new SecretsManagerClient({});
let secretoCache: Promise<string> | null = null;

/**
 * El secreto vive en Secrets Manager (backend/infra/lib/api-stack.ts,
 * "SessionSecret"), nunca en el código ni en una env var en claro — solo su
 * ARN llega por env var (SESSION_SECRET_ARN), que no es sensible. Se cachea
 * en memoria del proceso: los entornos de ejecución de Lambda se reusan
 * entre invocaciones, así que solo el primer arranque en frío paga la
 * llamada a Secrets Manager.
 */
function obtenerSecreto(): Promise<string> {
  if (!secretoCache) {
    secretoCache = smClient
      .send(new GetSecretValueCommand({ SecretId: process.env.SESSION_SECRET_ARN }))
      .then((respuesta) => {
        if (!respuesta.SecretString) {
          throw new Error("SessionSecret sin SecretString");
        }
        return respuesta.SecretString;
      });
  }
  return secretoCache;
}

export interface Sesion {
  titularId: string;
  rol: Rol;
}

async function firmar(payload: string): Promise<string> {
  const secreto = await obtenerSecreto();
  return createHmac("sha256", secreto).update(payload).digest("base64url");
}

export async function firmarSesion(sesion: Sesion): Promise<string> {
  const payload = Buffer.from(
    JSON.stringify({ ...sesion, exp: Date.now() + DURACION_MS }),
  ).toString("base64url");
  return `${payload}.${await firmar(payload)}`;
}

export async function verificarSesion(cookieHeader: string | undefined | null): Promise<Sesion | null> {
  if (!cookieHeader) return null;
  const cookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${NOMBRE_COOKIE}=`));
  if (!cookie) return null;

  const token = cookie.slice(NOMBRE_COOKIE.length + 1);
  const [payload, firma] = token.split(".");
  if (!payload || !firma) return null;

  const esperada = await firmar(payload);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const datos = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof datos.exp !== "number" || Date.now() > datos.exp) return null;
    if (typeof datos.titularId !== "string" || typeof datos.rol !== "string") return null;
    return { titularId: datos.titularId, rol: datos.rol };
  } catch {
    return null;
  }
}
