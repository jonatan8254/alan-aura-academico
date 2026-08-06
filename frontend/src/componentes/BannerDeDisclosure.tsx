import { useId } from "react";
import { IconInfoCircle } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { Icono } from "./Icono";

interface BannerDeDisclosureProps {
  aceptado: boolean;
  onCambiar: (aceptado: boolean) => void;
  className?: string;
}

/**
 * BannerDeDisclosure — P-05 (disclosure de IA, E1/PRIV-R8): "hablas con una IA de
 * acompañamiento, no un profesional", visible ANTES de capturar cualquier dato. El checkbox
 * real es `sr-only` (invisible pero funcional: teclado, lector de pantalla); lo que se ve es
 * el `<label>` estilizado como casilla vía `peer-checked:` — así no se pierde el
 * comportamiento nativo de un checkbox por controlar su apariencia.
 */
export function BannerDeDisclosure({ aceptado, onCambiar, className }: BannerDeDisclosureProps) {
  const id = useId();
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-tarjeta border border-borde bg-sistema-tinte p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icono icono={IconInfoCircle} className="mt-0.5 shrink-0 text-sistema" />
        <p className="text-cuerpo text-sistema-texto">
          Hablas con una inteligencia artificial de acompañamiento, no con un profesional de la
          salud.
        </p>
      </div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2 text-cuerpo text-sistema-texto"
      >
        <input
          id={id}
          type="checkbox"
          checked={aceptado}
          onChange={(evento) => onCambiar(evento.target.checked)}
          className="peer sr-only"
        />
        <span className="flex size-5 shrink-0 items-center justify-center rounded-control border border-borde-fuerte bg-superficie peer-checked:border-sistema peer-checked:bg-sistema peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sistema" />
        Entiendo y quiero continuar.
      </label>
    </div>
  );
}
