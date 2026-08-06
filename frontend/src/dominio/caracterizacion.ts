import type {
  ConversationGoal,
  EnergySelfReport,
  MoodSelfReport,
  ResponseStyle,
} from "contrato-api";

/**
 * caracterizacion.ts — las preguntas de P-08, con sus etiquetas en español.
 *
 * Van en `dominio/` y no en `copia/` porque cada etiqueta es 1:1 con un valor del enum del
 * contrato: separar el valor de su etiqueta en dos archivos es el camino directo a que se
 * desincronicen. Textos literales del mockup p08.
 *
 * SON CUATRO PREGUNTAS, no cinco. El mockup p08 dibuja «¿Con quién quieres conversar?» como
 * quinto grupo, pero `ECU-05 §17` es explícito: «P-09 ya no pertenece a este CU: es la
 * interfaz de CU-14». `character` se captura UNA vez, en P-09. `DIS-00 §2` habla de «5
 * preguntas» refiriéndose a los cinco campos de contenido de la cápsula, no a los campos de
 * esta pantalla.
 *
 * El matiz de «sin defaults» (RN-01.3, CA-05) que es fácil equivocar: una pregunta que la
 * persona NO TOCA se omite del request; elegir «Prefiero no responder» SÍ es una respuesta y
 * se envía. Son dos cosas distintas, y por eso el estado de la pantalla arranca en `null` en
 * vez de en el valor de escape.
 */

export interface OpcionDeAutorreporte<T extends string> {
  valor: T;
  etiqueta: string;
}

export const PREGUNTA_ANIMO = "¿Cómo te sientes ahora?";
export const OPCIONES_ANIMO: readonly OpcionDeAutorreporte<MoodSelfReport>[] = [
  { valor: "muy_mal", etiqueta: "Muy mal" },
  { valor: "mal", etiqueta: "Mal" },
  { valor: "neutral", etiqueta: "Neutral" },
  { valor: "bien", etiqueta: "Bien" },
  { valor: "muy_bien", etiqueta: "Muy bien" },
  { valor: "prefiero_no_responder", etiqueta: "Prefiero no responder" },
];

export const PREGUNTA_ENERGIA = "¿Cómo está tu energía?";
export const OPCIONES_ENERGIA: readonly OpcionDeAutorreporte<EnergySelfReport>[] = [
  { valor: "baja", etiqueta: "Baja" },
  { valor: "media", etiqueta: "Media" },
  { valor: "alta", etiqueta: "Alta" },
  { valor: "prefiero_no_responder", etiqueta: "Prefiero no responder" },
];

export const PREGUNTA_OBJETIVO = "¿Qué te gustaría de esta conversación?";
export const OPCIONES_OBJETIVO: readonly OpcionDeAutorreporte<ConversationGoal>[] = [
  { valor: "sentirme_escuchado", etiqueta: "Sentirme escuchado" },
  { valor: "calmarme", etiqueta: "Calmarme" },
  { valor: "ordenar_ideas", etiqueta: "Ordenar ideas" },
  { valor: "dar_un_paso_pequeno", etiqueta: "Dar un paso pequeño" },
  { valor: "recibir_una_sugerencia_breve", etiqueta: "Una sugerencia breve" },
  // El mockup p08 omite esta opción en esta pregunta y solo en esta. El enum la tiene y
  // DIS-00 §3 P-08 exige que «"prefiero no responder" [esté] siempre visible»; gana el canon.
  { valor: "prefiero_no_responder", etiqueta: "Prefiero no responder" },
];

export const PREGUNTA_ESTILO = "¿Cómo prefieres que te respondan?";
export const OPCIONES_ESTILO: readonly OpcionDeAutorreporte<ResponseStyle>[] = [
  { valor: "breve_y_directo", etiqueta: "Breve y directo" },
  { valor: "equilibrado", etiqueta: "Equilibrado" },
  { valor: "pausado_y_reflexivo", etiqueta: "Pausado y reflexivo" },
  // `ResponseStyle` no tiene "prefiero_no_responder": su escape es "sin_preferencia", que es
  // un valor legítimo del enum. No se inventa nada.
  { valor: "sin_preferencia", etiqueta: "Sin preferencia" },
];

export const TITULO_CARACTERIZACION = "Cuéntanos un poco";
export const SUFIJO_OPCIONAL = "(opcional)";

/** El mockup dice «Cinco preguntas rápidas»; con `character` fuera de esta pantalla, son cuatro. */
export const SUBTITULO_CARACTERIZACION =
  "Cuatro preguntas rápidas para acompañarte mejor. Puedes omitir las que quieras.";

/** RNF-04 hecho promesa visible: es lo único que viaja al modelo. */
export const NOTA_MINIMIZACION =
  "Solo estas respuestas viajan al modelo para orientar la conversación. " +
  "Nunca tu nombre, tu historial ni el contenido de tus chats.";
