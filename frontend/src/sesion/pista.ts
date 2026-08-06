import type { Rol } from "contrato-api";

/**
 * pista.ts — la "pista de sesión" optimista que vive en `sessionStorage`.
 *
 * NO es la sesión real: la sesión real es la cookie `httpOnly` que el backend fija (ARQ-01),
 * invisible e inaccesible para este código a propósito. Esta pista es solo lo que el
 * frontend necesita para decidir qué RENDERIZAR sin esperar un round-trip (p.ej. "¿muestro
 * el layout de admin o el de usuario mientras carga la primera pantalla protegida?").
 * `sessionStorage` (no `localStorage`) porque la pista debe morir con la pestaña, igual que
 * la sesión que refleja.
 *
 * Toda decisión de AUTORIZACIÓN real la sigue haciendo el backend en cada petición — un 401
 * de cualquier endpoint (ver api/cliente.ts) limpia esta pista aunque estuviera "vigente".
 */
export interface PistaDeSesion {
  titularId: string;
  alias: string;
  rol: Rol;
  onboardingCompleto: boolean;
}

const CLAVE = "pista-sesion";

export function leerPista(): PistaDeSesion | null {
  const crudo = sessionStorage.getItem(CLAVE);
  if (!crudo) return null;
  try {
    return JSON.parse(crudo) as PistaDeSesion;
  } catch {
    // Pista corrupta (p.ej. un cambio de forma entre versiones) — se trata como ausente en
    // vez de reventar el arranque de la app.
    sessionStorage.removeItem(CLAVE);
    return null;
  }
}

export function escribirPista(pista: PistaDeSesion | null): void {
  if (pista) {
    sessionStorage.setItem(CLAVE, JSON.stringify(pista));
  } else {
    sessionStorage.removeItem(CLAVE);
  }
}
