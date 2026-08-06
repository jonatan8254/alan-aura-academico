import type { ReactNode } from "react";
import { IconHeartHandshake } from "@tabler/icons-react";

import { Icono } from "./Icono";

interface TarjetaDeContencionProps {
  titulo: string;
  children: ReactNode;
}

/**
 * TarjetaDeContencion — el contenedor de P-12 (contención + derivación, respuesta
 * `safety_fallback` de CU-07). E3: tono contenedor, *grounding*, NUNCA rojo de alarma — el
 * tinte y el borde salen de los roles `crisis-*` de tema.css, que ya son cálidos-terrosos
 * a propósito, no de alarma.
 */
export function TarjetaDeContencion({ titulo, children }: TarjetaDeContencionProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-tarjeta border border-crisis-borde bg-crisis-tinte p-6 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-crisis-borde bg-superficie text-crisis">
        <Icono icono={IconHeartHandshake} size={24} />
      </span>
      <h2 className="text-h2 font-medium text-crisis-texto">{titulo}</h2>
      <div className="max-w-lectura text-cuerpo text-crisis-texto">{children}</div>
    </div>
  );
}
