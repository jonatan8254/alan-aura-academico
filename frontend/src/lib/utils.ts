import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `cn` — clsx para condicionales, tailwind-merge para que la última clase gane.
 *
 * El `extend` NO es opcional, y viene de un defecto que costó encontrar. La escala
 * tipográfica de `DIS-01 §3` vive en `tema.css` como `--text-display|h1|h2|cuerpo|caption`,
 * así que las utilidades se llaman `text-cuerpo`, `text-caption`… Con la configuración de
 * fábrica, tailwind-merge no reconoce esos nombres como tamaños de fuente y los clasifica
 * como COLOR. Consecuencia: en `cn("… text-primary-foreground …", "text-cuerpo")` decide que
 * las dos son colores en conflicto, se queda con la última y BORRA el color.
 *
 * En la práctica eso dejaba el texto de los botones primarios del color heredado de la
 * página —casi negro— sobre un fondo casi negro: invisible. Y sin ningún error: el typecheck
 * pasa, el build pasa y las pruebas pasan, porque el texto está en el DOM. Solo se ve
 * mirando la pantalla.
 *
 * Declarar aquí el grupo `font-size` arregla toda la aplicación de una vez y evita que el
 * mismo error vuelva cada vez que alguien combine un tamaño con un color.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "cuerpo", "caption"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
