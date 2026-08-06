import type { ReactNode } from "react";
import { IconLock } from "@tabler/icons-react";

import type { ResultadoDeConsulta } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { EstadoVacio } from "@/componentes/EstadoVacio";
import { Button } from "@/components/ui/button";
import { copiaDeFallo, type ContextoDeCopia } from "@/copia/fallos";

/**
 * EstadoDeConsultaAdmin — el patrón cargando/fallo que comparten P-14, P-15 y P-16.
 *
 * Existe para que las tres se comporten igual ante los mismos desenlaces, que es lo que
 * `ECU-08/09/10 FE-01/FE-02` describen con las mismas palabras. Tres copias divergirían.
 *
 * El 403 va aparte y SIN reintento: `FE-02` dice «Termina», y ofrecer un botón que no puede
 * funcionar es peor que no ofrecer ninguno. El 401 no pinta nada — `cliente.ts` ya limpió la
 * pista y navegó, ahora a la puerta administrativa correcta.
 */
export function EstadoDeConsultaAdmin<T>({
  consulta,
  contexto,
  children,
}: {
  consulta: ResultadoDeConsulta<T>;
  contexto: ContextoDeCopia;
  children: ReactNode;
}) {
  if (consulta.estado === "cargando") {
    // Sin spinner animado: DIS-01 §4 (evidencia E6) pide movimiento mínimo y respetar
    // `prefers-reduced-motion`. Un texto sobrio cumple lo mismo sin coste.
    return (
      <p aria-busy="true" className="py-8 text-center text-cuerpo text-suave">
        Cargando…
      </p>
    );
  }

  if (consulta.estado === "fallo" && consulta.fallo) {
    if (consulta.fallo.tipo === "sin_sesion") return null;

    if (consulta.fallo.tipo === "sin_permiso") {
      return (
        <EstadoVacio icono={IconLock} titulo="No tienes permiso para ver esta sección." />
      );
    }

    const copia = copiaDeFallo(consulta.fallo, contexto);
    return (
      <BannerInformativo tipo="aviso">
        <p className="font-medium">{copia.titulo}</p>
        {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
        {copia.accion.tipo === "reintentar" ? (
          <Button
            variant="outline"
            onClick={() => void consulta.recargar()}
            className="mt-3 h-11 px-4 text-cuerpo"
          >
            {copia.accion.etiqueta}
          </Button>
        ) : null}
      </BannerInformativo>
    );
  }

  return <>{children}</>;
}
