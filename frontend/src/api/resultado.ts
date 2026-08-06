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
export type Fallo =
  | { tipo: "entrada_invalida"; estado: 400; detalle?: string }
  | { tipo: "sin_sesion"; estado: 401 }
  | { tipo: "sin_permiso"; estado: 403 }
  | { tipo: "conflicto"; estado: 409; detalle?: string }
  | { tipo: "limite_de_tasa"; estado: 429; esperarSegundos: number | null }
  | { tipo: "proveedor_caido"; estado: 502 }
  | { tipo: "tiempo_agotado"; estado: 504 }
  | { tipo: "red" }
  | { tipo: "respuesta_ilegible" }
  | { tipo: "desconocido"; estado: number };
