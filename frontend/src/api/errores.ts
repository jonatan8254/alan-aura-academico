import type { Fallo } from "./resultado";

/**
 * errores.ts — traduce un código HTTP crudo (+ contexto de la ruta) a un `Fallo` tipado.
 * Función pura: mismo `status`/`contexto`/`esperarSegundos` de entrada, mismo `Fallo` de
 * salida, sin leer `fetch`/`Response` aquí — eso es responsabilidad exclusiva de cliente.ts.
 *
 * Un caso por status, incluyendo 409 y 502 aunque el tipo `*Status` de una ruta puntual no
 * los declare (p.ej. RegistroStatus no tiene 409 propio del kill switch, pero si el backend
 * real alguna vez lo devolviera ahí, esta función igual sabe qué `Fallo` producir en vez de
 * caer al catch-all "desconocido").
 */

/**
 * Discrepancia #2 del plan de Fase 0b ("403 sobrecargado"): el 403 de /api/v1/chat
 * (ECU-06 FE-09, "consentimiento base revocado") y el 403 de cualquier otra ruta
 * (rol insuficiente — RN-03.7, P-04 login admin; o consentimiento revocado fuera del chat)
 * comparten el mismo código HTTP y el mismo *shape* de `Fallo` (`{ tipo: "sin_permiso",
 * estado: 403 }`) — el contrato nunca los separó y no hay forma de distinguirlos desde el
 * código de estado solo. `contexto` existe para que el LLAMADOR (endpoints.ts, que sabe si
 * está pegándole a /chat o a otra ruta) declare la intención; se recibe y se documenta aquí
 * a propósito, pero el `Fallo` que devuelve es intencionalmente el mismo en ambos casos.
 * La disambiguación real — qué COPIA mostrar ("tu consentimiento fue revocado" vs. "no
 * tienes permiso") — es trabajo de la pantalla que consume el `Fallo`, en una fase
 * posterior; `mapStatus` se mantiene "tonto" (código -> tipo), no código -> texto.
 *
 * FASE 3 — la fase posterior es esta, y resultó que `contexto` no bastaba. `contexto`
 * distingue rutas ("este 502 es de /chat, aquel de /auth/registro"), pero los dos 403 de
 * ECU-06 salen de la MISMA ruta: sin mirar el cuerpo son indistinguibles y FE-09 no se
 * puede implementar. De ahí el cuarto parámetro `detalle`, que cliente.ts extrae del cuerpo
 * y que solo se propaga en los códigos donde algo depende de él (400/403/409/429).
 *
 * Los dos mecanismos se reparten el trabajo y conviene no confundirlos:
 *   - `contexto`  → ambigüedad ENTRE rutas. La resuelve `copia/fallos.ts`.
 *   - `detalle`   → ambigüedad DENTRO de una ruta. La resuelve quien consume el `Fallo`.
 * `detalle` no se renderiza jamás; ver la nota en resultado.ts.
 */
export type ContextoDeError = "chat" | "general";

export function mapStatus(
  status: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contexto: ContextoDeError = "general",
  esperarSegundos: number | null = null,
  detalle?: string,
): Fallo {
  switch (status) {
    case 400:
      return { tipo: "entrada_invalida", estado: 400, detalle };
    case 401:
      return { tipo: "sin_sesion", estado: 401 };
    case 403:
      return { tipo: "sin_permiso", estado: 403, detalle };
    case 409:
      return { tipo: "conflicto", estado: 409, detalle };
    case 429:
      return { tipo: "limite_de_tasa", estado: 429, esperarSegundos, detalle };
    case 502:
      return { tipo: "proveedor_caido", estado: 502 };
    case 504:
      return { tipo: "tiempo_agotado", estado: 504 };
    default:
      // Cubre 500 (ReiniciarPerfilStatus/EliminarCuentaStatus) y cualquier código que
      // ninguna ruta del contrato anticipó — nunca revienta, siempre produce un Fallo.
      return { tipo: "desconocido", estado: status };
  }
}
