import { createHmac, timingSafeEqual } from "node:crypto";
import type { Rol } from "contrato-api";

export const NOMBRE_COOKIE = "alan_aura_sesion";
const DURACION_MS = 1000 * 60 * 60 * 12; // 12h

/**
 * TODO antes de desplegar: sacar de AWS Secrets Manager/SSM Parameter Store,
 * no de una variable de entorno en claro. El valor de abajo es solo para que
 * `cdk synth`/desarrollo local no rompan sin secreto configurado.
 */
const SECRETO = process.env.SESSION_SECRET ?? "dev-secret-cambiar-antes-de-desplegar";

export interface Sesion {
  titularId: string;
  rol: Rol;
}

function firmar(payload: string): string {
  return createHmac("sha256", SECRETO).update(payload).digest("base64url");
}

export function firmarSesion(sesion: Sesion): string {
  const payload = Buffer.from(
    JSON.stringify({ ...sesion, exp: Date.now() + DURACION_MS }),
  ).toString("base64url");
  return `${payload}.${firmar(payload)}`;
}

export function verificarSesion(cookieHeader: string | undefined | null): Sesion | null {
  if (!cookieHeader) return null;
  const cookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${NOMBRE_COOKIE}=`));
  if (!cookie) return null;

  const token = cookie.slice(NOMBRE_COOKIE.length + 1);
  const [payload, firma] = token.split(".");
  if (!payload || !firma) return null;

  const esperada = firmar(payload);
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
