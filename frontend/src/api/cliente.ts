import type { Resultado } from "./resultado";
import { mapStatus, type ContextoDeError } from "./errores";

/**
 * cliente.ts — el único sitio del frontend que llama `fetch` contra `/api/v1`. NUNCA lanza:
 * toda rama (red caída, timeout, JSON corrupto, status no-2xx) termina en un
 * `Resultado<T>` con `ok: false`, nunca en una excepción no capturada — así endpoints.ts,
 * hooks.ts y cada pantalla pueden tratar cualquier fallo con una comprobación de `ok`, sin
 * try/catch propio.
 *
 * Timeout: 25s, por encima del límite de 20s del servidor (ver ARQ-01/backend) — así un
 * timeout del cliente casi siempre significa que el servidor YA respondió con su propio
 * 504, y esa rama (`resp.ok === false`, status 504) se procesa igual que cualquier fallo de
 * status; el `AbortController` de aquí es la red de seguridad para cuando el servidor ni
 * eso llega a hacer.
 */

const TIMEOUT_MS = 25_000;

const RUTAS_SIN_REDIRECCION_401 = new Set(["/auth/login", "/auth/login-admin"]);

let alExpirarSesion: (() => void) | null = null;

/**
 * Registrado por `SesionProvider` en el montaje de la app (ver sesion/SesionProvider.tsx).
 * Es el "un efecto secundario global" que pide la Fase 0b: cuando CUALQUIER petición (fuera
 * de login/login-admin, donde un 401 es "credenciales inválidas", no "sesión expirada")
 * recibe un 401, `pedir()` limpia la pista de sesión y navega a
 * `/login/?motivo=sesion_expirada` sin que cada pantalla tenga que repetirlo.
 *
 * cliente.ts deliberadamente NO importa react-router (mantiene la capa de API agnóstica de
 * framework de ruteo) — SesionProvider es quien tiene acceso a `useNavigate()` y registra
 * aquí un callback plano.
 */
export function registrarCallback401(fn: (() => void) | null): void {
  alExpirarSesion = fn;
}

function leerRetryAfter(resp: Response): number | null {
  const crudo = resp.headers.get("Retry-After");
  if (crudo === null) return null;
  const numero = Number(crudo);
  // El mock (backend/mock/server.ts) nunca manda esta cabecera — por eso en desarrollo
  // `esperarSegundos` siempre sale `null` y la copia de un 429 no puede nombrar un número
  // que no tiene. Un backend real que sí la mande queda cubierto igual.
  return Number.isFinite(numero) && numero >= 0 ? numero : null;
}

export async function pedir<T>(
  metodo: "GET" | "POST",
  ruta: string,
  cuerpo?: unknown,
  contexto: ContextoDeError = "general",
): Promise<Resultado<T>> {
  const controlador = new AbortController();
  const idTimeout = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  let resp: Response;
  try {
    resp = await fetch(`/api/v1${ruta}`, {
      method: metodo,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: controlador.signal,
    });
  } catch (error) {
    clearTimeout(idTimeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, fallo: { tipo: "tiempo_agotado", estado: 504 } };
    }
    return { ok: false, fallo: { tipo: "red" } };
  }
  clearTimeout(idTimeout);

  if (!resp.ok) {
    const esperarSegundos = leerRetryAfter(resp);
    const fallo = mapStatus(resp.status, contexto, esperarSegundos);
    if (resp.status === 401 && !RUTAS_SIN_REDIRECCION_401.has(ruta) && alExpirarSesion) {
      alExpirarSesion();
    }
    return { ok: false, fallo };
  }

  let datos: unknown;
  try {
    datos = await resp.json();
  } catch {
    return { ok: false, fallo: { tipo: "respuesta_ilegible" } };
  }

  if (datos === null || typeof datos !== "object") {
    return { ok: false, fallo: { tipo: "respuesta_ilegible" } };
  }

  return { ok: true, datos: datos as T, estado: resp.status };
}
