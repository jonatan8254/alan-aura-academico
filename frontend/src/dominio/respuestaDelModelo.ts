/**
 * respuestaDelModelo.ts — normaliza el texto que devuelve el LLM antes de pintarlo.
 *
 * NO es paranoia teórica: en las sondas contra Groq del 2026-08-06, dos de las cuatro
 * respuestas de Alan traían Markdown («**Respira profundo durante 5 segundos**»). Las
 * burbujas de chat pintan texto plano, así que eso se vería con los asteriscos a la vista.
 *
 * El arreglo de fondo es una línea en el system prompt pidiendo texto plano, y está
 * reportado. Esto es la otra mitad, la que no se puede omitir: la salida de un modelo es
 * ENTRADA NO CONFIABLE (`ECU-06 §17` lo dice del historial, y con más razón vale para lo que
 * el modelo genera). El cliente tiene que aguantarla venga como venga, incluso después de
 * que el prompt cambie, porque un prompt no es una garantía.
 *
 * Se quitan los MARCADORES, nunca el contenido: el objetivo es que se lea bien, no censurar.
 * No se interpreta el Markdown ni se convierte a HTML — hacerlo abriría una superficie de
 * inyección donde hoy no hay ninguna, y `React` ya escapa el texto por defecto.
 */

/** Marcadores de énfasis alrededor de texto: `**x**`, `__x__`, `*x*`, `_x_`. */
const ENFASIS = /(\*\*|__)(.+?)\1|(?<![\w*])[*_](?!\s)([^*_\n]+?)(?<!\s)[*_](?![\w*])/g;
/** Encabezados ATX al principio de línea y comillas de bloque. */
const ENCABEZADO = /^[ \t]*(#{1,6}|>)[ \t]+/gm;
/** Marcadores de código: los backticks sueltos y las vallas. */
const CODIGO = /```[a-z]*\n?|`/g;

export function textoPlano(crudo: string): string {
  return crudo
    .replace(ENCABEZADO, "")
    .replace(ENFASIS, (_coincidencia, _cerca, conCerca, suelto) => conCerca ?? suelto ?? "")
    .replace(CODIGO, "")
    // El backend ya trunca a 350 palabras y añade «…»; aquí solo se limpian los bordes.
    .trim();
}
