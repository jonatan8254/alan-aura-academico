import type { Character } from "contrato-api";

/**
 * personajes.ts — las fichas de Alan y Aura, con los textos literales del mockup p09.
 *
 * Viven aquí y no dentro de la pantalla porque tres sitios los necesitan: P-09 (elegir),
 * P-10 (la cabecera del chat y el diálogo de CU-13) y la copia de fallo del chat, que nombra
 * al acompañante. Que el nombre se escriba una vez es lo que evita «Aura» en una pantalla y
 * «aura» en otra.
 *
 * Las frases van SIN comillas: `TarjetaDePersonaje` ya las añade. El mockup las trae dentro
 * del texto, y copiarlas tal cual produciría comillas dobles.
 */

export interface FichaDePersonaje {
  character: Character;
  nombre: string;
  /** Subtítulo de la tarjeta: qué hace, en dos palabras. */
  rol: string;
  /** Muestra de tono, en la serif de voz. Es lo que permite comparar sin fricción (RF-06). */
  frase: string;
  /** Línea de pie con su icono. */
  tono: string;
  /** Etiqueta del botón que cierra el onboarding con esta elección. */
  ctaFinal: string;
}

export const PERSONAJES: readonly FichaDePersonaje[] = [
  {
    character: "aura",
    nombre: "Aura",
    rol: "calma y regulación",
    frase: "Vamos a tu ritmo. Aquí puedes soltar lo que traes, sin prisa.",
    tono: "meditación serena · tono pausado",
    ctaFinal: "Empezar a conversar con Aura",
  },
  {
    character: "alan",
    nombre: "Alan",
    rol: "activación práctica",
    frase: "¿Damos un primer paso, pequeño y realizable? Yo te acompaño.",
    tono: "meditación activa · tono directo",
    ctaFinal: "Empezar a conversar con Alan",
  },
];

export const TITULO_ELEGIR_PERSONAJE = "¿Con quién quieres conversar hoy?";

/**
 * Del mockup p09. Es cierto y hay que poder sostenerlo: RF-12 / CU-13 permite alternar
 * durante la conversación, y `character` viaja por petición en `ChatRequestV1`.
 */
export const SUBTITULO_ELEGIR_PERSONAJE =
  "Puedes cambiar cuando quieras, incluso a mitad de camino.";

/** Nunca devuelve undefined: `Character` solo tiene dos valores y los dos están arriba. */
export function fichaDe(character: Character): FichaDePersonaje {
  const ficha = PERSONAJES.find((p) => p.character === character);
  if (!ficha) throw new Error(`personaje sin ficha: ${character}`);
  return ficha;
}
