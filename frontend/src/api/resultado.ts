/**
 * resultado.ts — el tipo de retorno único de toda la capa de API (Fase 0b).
 *
 * `cliente.ts` NUNCA lanza (ver su cabecera): toda petición HTTP, exitosa o no, termina en un
 * `Resultado<T>`. Quien llama decide con una comprobación de `ok`, nunca con try/catch — eso
 * es justo lo que evita que un componente de pantalla olvide manejar un fallo de red o un
 * cuerpo de respuesta corrupto.
 */

export interface ResultadoOk<T> {
  ok: true;
  datos: T;
  estado: number;
}

export interface ResultadoFallo {
  ok: false;
  fallo: Fallo;
}

export type Resultado<T> = ResultadoOk<T> | ResultadoFallo;

/**
 * Fallo — unión discriminada por `tipo`, una variante por cada forma de fallo que la capa de
 * API distingue. El campo `estado` (cuando existe) es el código HTTP crudo que lo originó;
 * las variantes sin `estado` (`red`, `respuesta_ilegible`) nunca llegaron a tener uno.
 *
 * NOTA: no existe una variante para 500 — ninguna ruta del contrato lo declara como parte de
 * su tipo `*Status` público salvo como caso interno de servidor (ReiniciarPerfilStatus,
 * EliminarCuentaStatus). `errores.ts` lo resuelve como `desconocido` con `estado: 500`, igual
 * que cualquier código que el contrato no anticipó — ver su cabecera.
 */
/**
 * `detalle` — REGLA DURA: no se renderiza NUNCA, en ninguna pantalla.
 *
 * Es la frase que el servidor puso en el cuerpo del error, y existe aquí por una sola
 * razón: hay códigos que significan dos cosas distintas y el status no las separa. El caso
 * que obliga a tenerlo es el 403 de `/api/v1/chat`, que es "consentimiento base no
 * otorgado" (ECU-06 FE-09 → rehacer el onboarding) o "rol no autorizado" (FE-02 → termina).
 * Sin leer el cuerpo, FE-09 es inimplementable.
 *
 * Por qué no se muestra: el texto es vocabulario de servidor ("username y contrasena son
 * requeridos" nombra campos que la interfaz llama Usuario y Contraseña), y cuando el error
 * lo genera API Gateway en vez de un handler llega en inglés ("Internal server error").
 * Mostrarlo es exactamente la jerga que RF-26 prohíbe. La copia se decide en
 * `copia/fallos.ts`, a partir del `tipo` y del contexto de la pantalla.
 *
 * Tampoco es un discriminador de fiar: el cuerpo `{"error": "..."}` es convención de los
 * handlers, no contrato — CONTRATO_API_v1.md no lo declara. Por eso quien lo consulte debe
 * usar coincidencia tolerante y caer siempre a la rama segura si no reconoce nada.
 */
export type Fallo =
  | { tipo: "entrada_invalida"; estado: 400; detalle?: string }
  | { tipo: "sin_sesion"; estado: 401 }
  | { tipo: "sin_permiso"; estado: 403; detalle?: string }
  | { tipo: "conflicto"; estado: 409; detalle?: string }
  | { tipo: "limite_de_tasa"; estado: 429; esperarSegundos: number | null; detalle?: string }
  | { tipo: "proveedor_caido"; estado: 502 }
  | { tipo: "tiempo_agotado"; estado: 504 }
  | { tipo: "red" }
  | { tipo: "respuesta_ilegible" }
  | { tipo: "desconocido"; estado: number };
