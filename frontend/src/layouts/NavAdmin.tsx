import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

/**
 * NavAdmin.tsx — la barra de secciones que los mockups p14/p15/p16 repiten idéntica.
 *
 * NO usa `Tabs` de shadcn, aunque visualmente lo parezca. `Tabs` implica paneles que
 * conviven en el mismo documento y anuncia `role="tab"`; aquí cada «pestaña» es una RUTA
 * distinta, con su propia guarda y su propia petición. Anunciar como pestaña algo que
 * navega fuera de la página es un antipatrón conocido de accesibilidad: quien use lector de
 * pantalla espera que activar un tab cambie el panel de al lado, no que se recargue la vista.
 */

const SECCIONES = [
  // `end` solo en la primera: NavLink casa por prefijo, así que sin él «Directorio»
  // quedaría activo también en /metricas/ y /disponibilidad/.
  { a: "/plataforma-admin/", etiqueta: "Directorio", exacta: true },
  { a: "/plataforma-admin/metricas/", etiqueta: "Métricas", exacta: false },
  { a: "/plataforma-admin/disponibilidad/", etiqueta: "Disponibilidad", exacta: false },
];

export function NavAdmin() {
  return (
    <nav aria-label="Secciones de administración" className="border-b border-admin-borde">
      <div className="mx-auto flex max-w-5xl gap-1 px-4 py-2 sm:px-6">
        {SECCIONES.map(({ a, etiqueta, exacta }) => (
          <NavLink
            key={a}
            to={a}
            end={exacta}
            className={({ isActive }) =>
              cn(
                "rounded-control px-3 py-2.5 text-cuerpo transition-colors",
                isActive
                  ? "bg-texto text-superficie"
                  : "text-suave hover:bg-superficie-alt hover:text-texto",
              )
            }
          >
            {etiqueta}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
