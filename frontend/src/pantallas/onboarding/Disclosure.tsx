import { useNavigate } from "react-router";
import { IconHeartHandshake } from "@tabler/icons-react";

import { Icono } from "@/componentes/Icono";
import { Button } from "@/components/ui/button";
import { DISCLOSURE, VERSION_DISCLOSURE } from "@/dominio/consentimiento";
import { actualizarBorrador } from "@/onboarding/borrador";

/**
 * P-05 Onboarding · disclosure de IA — `/onboarding/` (CU-05, RF-01).
 *
 * Es la PRIMERA pantalla del onboarding y precede a cualquier captura de dato: eso es
 * literalmente `RF-01` («el disclosure aparece en la primera pantalla; ningún campo se
 * captura antes») y `RN-01.1`/`RN-09`.
 *
 * SIN casilla de aceptación, aunque `BannerDeDisclosure` exista y traiga una. El mockup no
 * la dibuja, y el requisito es que el disclosure PRECEDA la captura, no que se marque una
 * casilla: el acto de aceptación es pulsar «Entendido, continuar». Añadir una casilla sería
 * fricción sin fuente que la respalde. (Consecuencia: `BannerDeDisclosure` no tiene
 * consumidor en el onboarding — el suyo es el disclosure discreto y persistente de P-10.)
 *
 * Aquí se sella `versionDisclosure`. Registrarla en el mismo sitio donde se muestra el texto
 * es lo que impide que lo leído y lo enviado divergan (`RN-04.2`).
 */
export function Disclosure() {
  const navegar = useNavigate();

  function continuar() {
    actualizarBorrador({ disclosureAceptado: true, versionDisclosure: VERSION_DISCLOSURE });
    navegar("/onboarding/edad");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 font-medium text-texto">{DISCLOSURE.titulo}</h1>

      <p className="max-w-lectura text-cuerpo text-suave">
        {DISCLOSURE.cuerpoAntes}
        {/* El énfasis del mockup es de COLOR, no de peso: solo hay pesos 400 y 500 cargados. */}
        <span className="text-texto">{DISCLOSURE.cuerpoEnfasis}</span>
        {DISCLOSURE.cuerpoDespues}
      </p>

      <div className="flex items-start gap-3 rounded-tarjeta border border-borde bg-superficie-alt p-4">
        <Icono icono={IconHeartHandshake} size={20} className="mt-0.5 shrink-0 text-sistema" />
        <p className="text-cuerpo text-texto">{DISCLOSURE.notaDeRiesgo}</p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={continuar} className="h-11 px-5 text-cuerpo">
          {DISCLOSURE.continuar}
        </Button>
        {/* «Salir» lo pone el layout (BotonDeCerrarSesion): es la única puerta de salida del
            asistente, y tiene que estar en los cinco pasos, no solo aquí. */}
      </div>
    </div>
  );
}
