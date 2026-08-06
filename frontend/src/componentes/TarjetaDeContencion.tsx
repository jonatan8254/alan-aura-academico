import type { ReactNode, RefObject } from "react";
import { IconHeartHandshake } from "@tabler/icons-react";

import { Icono } from "./Icono";

interface TarjetaDeContencionProps {
  titulo: string;
  children: ReactNode;
  /**
   * Ranura de foco sobre el título. Existe para que P-12 pueda llevar el foco aquí al
   * entrar en contención —el único punto de la app donde robarlo está justificado, porque
   * garantiza que la ruta hacia ayuda humana se anuncie y quede en pantalla—. Sin esta
   * prop, la pantalla tendría que duplicar el título en un `sr-only` propio y el lector lo
   * leería dos veces.
   */
  refTitulo?: RefObject<HTMLHeadingElement | null>;
}

/**
 * TarjetaDeContencion — el contenedor de P-12 (contención + derivación, respuesta
 * `safety_fallback` de CU-07). E3: tono contenedor, *grounding*, NUNCA rojo de alarma — el
 * tinte y el borde salen de los roles `crisis-*` de tema.css, que ya son cálidos-terrosos
 * a propósito, no de alarma.
 */
export function TarjetaDeContencion({ titulo, children, refTitulo }: TarjetaDeContencionProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-tarjeta border border-crisis-borde bg-crisis-tinte p-6 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-crisis-borde bg-superficie text-crisis">
        <Icono icono={IconHeartHandshake} size={24} />
      </span>
      <h2
        ref={refTitulo}
        tabIndex={refTitulo ? -1 : undefined}
        className="text-h2 font-medium text-crisis-texto outline-none"
      >
        {titulo}
      </h2>
      <div className="max-w-lectura text-cuerpo text-crisis-texto">{children}</div>
    </div>
  );
}
