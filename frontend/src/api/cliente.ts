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

/**
 * En estas rutas un 401 NO significa "tu sesión expiró", así que el efecto global de abajo
 * no debe dispararse.
 *
 * En login y login-admin es "credenciales inválidas" (Fase 0b). `/auth/logout` se añadió en
 * Fase 3 y responde a otra cosa: ahí un 401 significa "la sesión ya no existía", es decir,
 * el estado que se quería alcanzar YA se cumple. Redirigir sería contraproducente en los dos
 * únicos flujos que llaman a logout: el bloqueo de menores de ECU-05 FE-01 acabaría en
 * `/login/?motivo=sesion_expirada` en vez de en `/onboarding/no-disponible`, y el botón de
 * cerrar sesión le diría "tu sesión expiró" a quien la cerró a propósito.
 */
const RUTAS_SIN_REDIRECCION_401 = new Set([
  "/auth/login",
  "/auth/login-admin",
  "/auth/logout",
]);

/**
 * Extrae el motivo que el servidor puso en el cuerpo de un error, para DISCRIMINAR — nunca
 * para mostrar (ver la nota de `detalle` en resultado.ts).
 *
 * Hay dos formas posibles y ninguna está en el contrato: los handlers propios mandan
 * `{"error": "..."}` y API Gateway, cuando el error lo genera él (ruta inexistente, Lambda
 * que lanzó), manda `{"message": "..."}`. Se aceptan las dos.
 *
 * No lanza en ningún caso: un 502 de API Gateway sin cuerpo, el HTML de un proxy o una
 * respuesta vacía devuelven `undefined`, y quien consuma el `Fallo` cae a su rama segura.
 * Esto preserva la invariante de la cabecera — `pedir()` sigue sin poder lanzar.
 */
async function leerMotivoDeError(resp: Response): Promise<string | undefined> {
  try {
    const cuerpo: unknown = await resp.json();
    if (cuerpo !== null && typeof cuerpo === "object") {
      const campos = cuerpo as Record<string, unknown>;
      if (typeof campos.error === "string") return campos.error;
      if (typeof campos.message === "string") return campos.message;
    }
  } catch {
    // Cuerpo ausente, vacío o no-JSON. No es excepcional: pasa siempre que el error viene
    // de la infraestructura y no de un handler.
  }
  return undefined;
}

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
    // El cuerpo se consume UNA sola vez, y solo en esta rama: la de éxito lo lee más abajo,
    // y las dos son excluyentes. El `await` va después del clearTimeout, así que no
    // interactúa con el AbortController.
    const detalle = await leerMotivoDeError(resp);
    const fallo = mapStatus(resp.status, contexto, esperarSegundos, detalle);
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
