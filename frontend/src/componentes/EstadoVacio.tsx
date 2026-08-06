import type { ReactNode } from "react";

import { Icono, type ComponenteIcono } from "./Icono";

interface EstadoVacioProps {
  icono: ComponenteIcono;
  titulo: string;
  children?: ReactNode;
}

/** EstadoVacio — el "sin datos" de los paneles admin (P-14 directorio vacío, P-15 sin datos
 * agregados aún) y de cualquier lista que pueda no tener filas todavía. */
export function EstadoVacio({ icono, titulo, children }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-tarjeta border border-dashed border-borde p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-superficie-alt text-tenue">
        <Icono icono={icono} size={24} />
      </span>
      <h3 className="text-h2 font-medium text-texto">{titulo}</h3>
      {children ? <p className="max-w-lectura text-cuerpo text-suave">{children}</p> : null}
    </div>
  );
}
