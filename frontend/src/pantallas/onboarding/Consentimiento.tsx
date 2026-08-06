import { useState } from "react";
import { useNavigate } from "react-router";
import { IconChevronDown } from "@tabler/icons-react";

import { BannerInformativo } from "@/componentes/BannerInformativo";
import { Icono } from "@/componentes/Icono";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CONSENTIMIENTO, SIN_CAPA_BASE } from "@/dominio/consentimiento";
import { actualizarBorrador, leerBorrador } from "@/onboarding/borrador";

/**
 * P-07 Onboarding · consentimiento granular — `/onboarding/consentimiento` (CU-05, RF-03).
 *
 * LOS DOS TOGGLES ARRANCAN APAGADOS, contra lo que dibuja el mockup p07 (que muestra la capa
 * base encendida). `DIS-01 §2` evidencia `E4` y `DIS-00 §2` piden «toggles apagados por
 * defecto» y «sin casillas premarcadas»: el mockup está enseñando un estado ya interactuado,
 * no un valor inicial.
 *
 * Sin la capa base NO se avanza, y el botón primario **no se deshabilita**: al pulsarlo
 * explica por qué, con el literal de `ECU-05 FE-02` («Sin consentimiento no es posible
 * conversar»). Un botón muerto sin explicación es peor accesibilidad y roza el dark pattern
 * que `DIS-01 §1` prohíbe — y quedarse en el paso ES el «vuelve al paso 4» de FE-02.
 *
 * `FA-03` (retirar la capa base tras otorgarla) y `FA-04` (retirar solo la personalización)
 * no necesitan flujo propio: como el POST es único y terminal, apagar un toggle antes de
 * continuar no deja nada que des-escribir. `FA-03` se implementa como no llamar al endpoint.
 */
export function Consentimiento() {
  const inicial = leerBorrador();
  const [base, setBase] = useState(inicial.consentimientoBase);
  const [personalizacion, setPersonalizacion] = useState(inicial.consentimientoPersonalizacion);
  const [avisoSinBase, setAvisoSinBase] = useState(false);
  const navegar = useNavigate();

  function otorgar() {
    if (!base) {
      setAvisoSinBase(true);
      return;
    }
    actualizarBorrador({
      consentimientoBase: true,
      consentimientoPersonalizacion: personalizacion,
    });
    navegar("/onboarding/caracterizacion");
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-medium text-texto">{CONSENTIMIENTO.titulo}</h1>
        <p className="max-w-lectura text-cuerpo text-suave">{CONSENTIMIENTO.subtitulo}</p>
      </header>

      {avisoSinBase ? (
        <BannerInformativo tipo="aviso">
          <p className="font-medium">{SIN_CAPA_BASE}</p>
          <p className="text-suave">Puedes otorgarlo cuando quieras.</p>
        </BannerInformativo>
      ) : null}

      <div className="flex flex-col gap-3">
        <Capa
          capa={CONSENTIMIENTO.base}
          activa={base}
          onCambiar={(v) => {
            setBase(v);
            if (v) setAvisoSinBase(false);
          }}
        />
        <Capa
          capa={CONSENTIMIENTO.personalizacion}
          activa={personalizacion}
          onCambiar={setPersonalizacion}
        />
      </div>

      <p className="text-caption text-tenue">{CONSENTIMIENTO.nota}</p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={otorgar} className="h-11 px-5 text-cuerpo">
          {CONSENTIMIENTO.otorgar}
        </Button>
        {/* «Ahora no» es FA-03/FE-02: mismo aviso, sin navegar y sin tocar los toggles. */}
        <Button
          variant="outline"
          onClick={() => setAvisoSinBase(true)}
          className="h-11 px-5 text-cuerpo"
        >
          {CONSENTIMIENTO.ahoraNo}
        </Button>
      </div>
    </div>
  );
}

/**
 * Una capa de consentimiento con su resumen y su «ver detalle» plegable.
 *
 * `<details>/<summary>` nativos y no un estado propio: traen teclado y lector de pantalla de
 * fábrica, y `DIS-01 §2 E4` pide precisamente el patrón «resumen + expandir» (consentimiento
 * por capas, just-in-time).
 */
function Capa({
  capa,
  activa,
  onCambiar,
}: {
  capa: { titulo: string; nota: string; detalle: string };
  activa: boolean;
  onCambiar: (activa: boolean) => void;
}) {
  return (
    <div className="rounded-tarjeta border border-borde bg-superficie p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-cuerpo text-texto">{capa.titulo}</p>
          <p className="text-caption text-tenue">{capa.nota}</p>
        </div>
        <Switch
          checked={activa}
          onCheckedChange={onCambiar}
          aria-label={capa.titulo}
          className="mt-1 shrink-0"
        />
      </div>
      <details className="group mt-3">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-control py-1.5 text-caption text-sistema">
          ver detalle
          <Icono
            icono={IconChevronDown}
            size={14}
            className="transition-transform duration-rapido group-open:rotate-180"
          />
        </summary>
        <p className="max-w-lectura pt-2 text-caption text-suave">{capa.detalle}</p>
      </details>
    </div>
  );
}
