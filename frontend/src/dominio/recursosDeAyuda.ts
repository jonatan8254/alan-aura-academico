import type { ReferenciaDeDerivacion } from "contrato-api";

/**
 * recursosDeAyuda.ts — el catálogo de líneas de apoyo, hoy VACÍO a propósito.
 *
 * Decisión ya tomada: los recursos de ayuda quedan diferidos a una fase posterior del
 * proyecto, fuera de la Fase 3. Este archivo existe para que esa decisión tenga una sola
 * costura y no dos pantallas con el mismo hueco resuelto de formas distintas.
 *
 * Quien lo consuma debe comprobar la longitud y NO renderizar el bloque si está vacío. Es
 * exactamente lo que manda `ECU-07 FA-01` cuando la configuración no entrega ningún recurso
 * presentable: «mantiene la contención y orienta a emergencias y a apoyo humano **en
 * términos genéricos, sin números ni líneas embebidos** en el producto».
 *
 * Los mockups p06 y p12 dibujan una caja con el marcador `[configurada por entorno]`. Ese
 * marcador NO se renderiza: enseñarle a alguien vulnerable un producto a medio terminar,
 * donde debería haber un teléfono, es peor que no enseñar la caja. Y `RE-04` de `SEG-01` es
 * explícito en que no puede haber números embebidos en el código.
 *
 * Cuando la decisión aterrice, se llena aquí y las dos pantallas empiezan a pintarlo solas.
 */
export const LINEAS_DE_APOYO: readonly ReferenciaDeDerivacion[] = [];
