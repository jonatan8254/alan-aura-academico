import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Icono, type ComponenteIcono } from "./Icono";

interface ChipProps {
  children: ReactNode;
  icono?: ComponenteIcono;
  className?: string;
}

/** Chip — pill de etiqueta/estado corto (p.ej. el estado de una fila de P-14, directorio
 * admin). Tinte medio (`superficie-alt`), nunca uno de los tintes semánticos fuertes — para
 * esos casos usar BannerInformativo, no forzar este componente. */
export function Chip({ children, icono, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-superficie-alt px-2.5 py-1 text-caption font-medium text-suave",
        className,
      )}
    >
      {icono ? <Icono icono={icono} size={14} /> : null}
      {children}
    </span>
  );
}
