/**
 * estados.ts — el superconjunto local de códigos HTTP que la capa de API sabe manejar.
 *
 * Discrepancia #1 del plan de Fase 0b ("chat sin 409/502"): VERIFICADA contra
 * packages/contrato-api/src/rutas.ts línea 113 antes de escribir este archivo.
 *
 *   export type ChatStatus = 200 | 400 | 401 | 403 | 409 | 429 | 502 | 504;
 *
 * `ChatStatus` YA incluye 409 (kill switch activo) y 502 (proveedor LLM caído) — el
 * contrato no llegó a esta fase con el defecto que el plan documentaba, así que aquí NO
 * hace falta ensanchar el tipo con un union local. Lo que sí se deja es la aserción de abajo:
 * si contrato-api alguna vez retrocede y ChatStatus deja de incluir 409 o 502, esto deja de
 * compilar exactamente en este archivo — la regresión se detecta en la capa de API, no en
 * tiempo de ejecución en una pantalla de chat.
 *
 * `errores.ts`, aparte, mapea CUALQUIER código HTTP (400/401/403/409/429/502/504 y lo que
 * sobre) sin depender de qué tan angosto sea el tipo `*Status` de cada ruta — `pedir()` en
 * cliente.ts recibe `resp.status: number`, no un literal, así que la protección real contra
 * una respuesta inesperada del backend vive ahí, no en el sistema de tipos.
 */
import type { ChatStatus } from "contrato-api";

export type { ChatStatus };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _AsegurarQueChatIncluye409 = 409 extends ChatStatus ? true : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _AsegurarQueChatIncluye502 = 502 extends ChatStatus ? true : never;

// Las dos líneas de abajo son el chequeo en sí: si algún día `409 extends ChatStatus`
// dejara de ser `true`, esta asignación de tipo deja de compilar.
const _chequeoDiscrepancia1a: _AsegurarQueChatIncluye409 = true;
const _chequeoDiscrepancia1b: _AsegurarQueChatIncluye502 = true;
void _chequeoDiscrepancia1a;
void _chequeoDiscrepancia1b;

/**
 * Todos los códigos de fallo HTTP que aparecen en algún tipo `*Status` de contrato-api,
 * más los que el chat necesita aunque el resto de rutas no los declare. Es documentación
 * ejecutable de la superficie que `mapStatus` (errores.ts) cubre con un caso dedicado — no
 * se usa para angostar el tipo de `pedir()`, que sigue aceptando cualquier `number`.
 */
export const CODIGOS_DE_FALLO_CONOCIDOS = [400, 401, 403, 409, 429, 502, 504] as const;
export type CodigoDeFalloConocido = (typeof CODIGOS_DE_FALLO_CONOCIDOS)[number];
