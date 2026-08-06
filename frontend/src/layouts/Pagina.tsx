import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Pagina.tsx — el contenedor que centra el contenido bajo el encabezado.
 *
 * Existe porque `Encabezado.tsx` ya lo daba por hecho: su cabecera dice «la barra es de
 * ancho completo y quien centra el contenido es `Pagina`», pero el componente nunca se
 * escribió. (`CONTINUAR_AQUI.md §8` afirma lo contrario —que centrar es cosa de cada
 * pantalla—; gana el comentario que está junto al código que lo asume.)
 *
 * Tres anchos porque los mockups usan tres medidas distintas y no por gusto: un formulario
 * de tres campos leído a 900px obliga a la vista a saltar de un lado a otro de la pantalla.
 * El techo de `lectura` es la medida de ≤66 caracteres de DIS-01 §3.
 */

const ANCHOS = {
  /** P-02, P-03, P-04: formularios cortos. */
  formulario: "max-w-md",
  /** P-05…P-09: los pasos del onboarding, con su barra y su texto de consentimiento. */
  onboarding: "max-w-xl",
  /** P-01, P-13, P-14, P-15, P-16: contenido ancho, tablas y tarjetas. */
  panel: "max-w-3xl",
} as const;

export type AnchoDePagina = keyof typeof ANCHOS;

export function Pagina({
  children,
  ancho = "panel",
  className,
}: {
  children: ReactNode;
  ancho?: AnchoDePagina;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto w-full px-4 py-8 sm:px-6 sm:py-10", ANCHOS[ancho], className)}>
      {children}
    </main>
  );
}
