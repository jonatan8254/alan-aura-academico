import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);
const LONGITUD_CLAVE = 64;

/**
 * CAPSULA_CONTEXTO.md / ADR-002 fijan Argon2id para el hash de contraseñas.
 * Se sustituye por scrypt (nativo de Node, sin binding nativo que compilar)
 * en esta pasada: los paquetes de Argon2id en npm (argon2, @node-rs/argon2)
 * distribuyen binarios nativos por plataforma, y esta Mac no produce el
 * binario linux-x64 que corre en Lambda sin Docker o un paso de instalación
 * cruzada — justo lo que ADR-005-D1 evita al usar NodejsFunction. Es una
 * sustitución declarada, no silenciosa: falta decidir si se invierte en
 * empaquetar Argon2id correctamente antes de producción.
 */
export async function hashContrasena(contrasena: string): Promise<string> {
  const sal = randomBytes(16);
  const clave = (await scrypt(contrasena, sal, LONGITUD_CLAVE)) as Buffer;
  return `${sal.toString("hex")}:${clave.toString("hex")}`;
}

export async function verificarContrasena(contrasena: string, hash: string): Promise<boolean> {
  const [salHex, claveHex] = hash.split(":");
  if (!salHex || !claveHex) return false;
  const sal = Buffer.from(salHex, "hex");
  const claveEsperada = Buffer.from(claveHex, "hex");
  const claveCalculada = (await scrypt(contrasena, sal, claveEsperada.length)) as Buffer;
  return claveCalculada.length === claveEsperada.length && timingSafeEqual(claveCalculada, claveEsperada);
}
