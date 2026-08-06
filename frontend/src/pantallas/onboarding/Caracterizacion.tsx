import { useState } from "react";
import { useNavigate } from "react-router";
import { IconLock } from "@tabler/icons-react";

import { BannerInformativo } from "@/componentes/BannerInformativo";
import { GrupoDeChips } from "@/componentes/GrupoDeChips";
import { Icono } from "@/componentes/Icono";
import { Button } from "@/components/ui/button";
import {
  NOTA_MINIMIZACION,
  OPCIONES_ANIMO,
  OPCIONES_ENERGIA,
  OPCIONES_ESTILO,
  OPCIONES_OBJETIVO,
  PREGUNTA_ANIMO,
  PREGUNTA_ENERGIA,
  PREGUNTA_ESTILO,
  PREGUNTA_OBJETIVO,
  SUBTITULO_CARACTERIZACION,
  SUFIJO_OPCIONAL,
  TITULO_CARACTERIZACION,
} from "@/dominio/caracterizacion";
import { actualizarBorrador, leerBorrador } from "@/onboarding/borrador";

/**
 * P-08 Onboarding · caracterización — `/onboarding/caracterizacion` (CU-05, RF-04/05).
 *
 * CUATRO PREGUNTAS, NO CINCO. El mockup p08 dibuja «¿Con quién quieres conversar?» como
 * quinto grupo, pero `ECU-05 §17` es explícito: «P-09 ya no pertenece a este CU: es la
 * interfaz de CU-14». `character` se captura una sola vez, en P-09. Las «5 preguntas» de
 * `DIS-00 §2` son los cinco campos de contenido de la cápsula, no los campos de esta
 * pantalla — las dos lecturas se reconcilian así sin declarar erróneo a DIS-00.
 *
 * EL MATIZ DE «SIN DEFAULTS» (`RN-01.3`, `CA-05`) que es fácil equivocar: una pregunta que
 * NO se toca omite su clave del request; elegir «Prefiero no responder» SÍ es una respuesta
 * y viaja. Son dos cosas distintas, y por eso el estado arranca en `null` en vez de en el
 * valor de escape. `GrupoDeChips` no permite deseleccionar, y está bien: los cuatro enums
 * traen su propia opción de escape.
 *
 * Los dos botones llevan al mismo sitio. «Omitir por ahora» no escribe nada, que es
 * exactamente `ECU-05 FA-01`: la cápsula se arma sin autorreportes y el flujo continúa.
 */
export function Caracterizacion() {
  const inicial = leerBorrador();
  const [animo, setAnimo] = useState(inicial.moodSelfReport ?? null);
  const [energia, setEnergia] = useState(inicial.energySelfReport ?? null);
  const [objetivo, setObjetivo] = useState(inicial.conversationGoal ?? null);
  const [estilo, setEstilo] = useState(inicial.responseStyle ?? null);
  const navegar = useNavigate();

  const esReinicio = inicial.origen === "reinicio";

  function continuar() {
    // `?? undefined`: una pregunta sin tocar deja la clave AUSENTE, no en null.
    actualizarBorrador({
      moodSelfReport: animo ?? undefined,
      energySelfReport: energia ?? undefined,
      conversationGoal: objetivo ?? undefined,
      responseStyle: estilo ?? undefined,
    });
    navegar("/onboarding/personaje");
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-medium text-texto">
          {TITULO_CARACTERIZACION}{" "}
          <span className="text-h2 text-tenue">{SUFIJO_OPCIONAL}</span>
        </h1>
        <p className="max-w-lectura text-cuerpo text-suave">{SUBTITULO_CARACTERIZACION}</p>
      </header>

      {/*
        Modo reinicio (llegada desde P-13/CU-11). Es la pieza de honestidad del atajo: el
        borrador reafirma edad y consentimiento base sin volver a preguntarlos —ECU-11 RE-05
        prohíbe los pasos intermedios— y la persona tiene derecho a saber que eso va a viajar
        cuando confirme en P-09.
      */}
      {esReinicio ? (
        <BannerInformativo tipo="info">
          Tu consentimiento sigue vigente. Solo vuelves a responder la caracterización y a
          elegir acompañante.
        </BannerInformativo>
      ) : null}

      <div className="flex flex-col gap-7">
        <GrupoDeChips
          nombre="animo"
          rotulo={PREGUNTA_ANIMO}
          opciones={OPCIONES_ANIMO}
          valorSeleccionado={animo}
          onCambiar={setAnimo}
        />
        <GrupoDeChips
          nombre="energia"
          rotulo={PREGUNTA_ENERGIA}
          opciones={OPCIONES_ENERGIA}
          valorSeleccionado={energia}
          onCambiar={setEnergia}
        />
        <GrupoDeChips
          nombre="objetivo"
          rotulo={PREGUNTA_OBJETIVO}
          opciones={OPCIONES_OBJETIVO}
          valorSeleccionado={objetivo}
          onCambiar={setObjetivo}
        />
        <GrupoDeChips
          nombre="estilo"
          rotulo={PREGUNTA_ESTILO}
          opciones={OPCIONES_ESTILO}
          valorSeleccionado={estilo}
          onCambiar={setEstilo}
        />
      </div>

      <div className="flex items-start gap-3 rounded-tarjeta border border-borde bg-superficie-alt p-4">
        <Icono icono={IconLock} size={20} className="mt-0.5 shrink-0 text-suave" />
        {/* RNF-04 hecho promesa visible: es lo único que viaja al modelo. */}
        <p className="text-caption text-suave">{NOTA_MINIMIZACION}</p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={continuar} className="h-11 px-5 text-cuerpo">
          Continuar
        </Button>
        <Button
          variant="outline"
          onClick={() => navegar("/onboarding/personaje")}
          className="h-11 px-5 text-cuerpo"
        >
          Omitir por ahora
        </Button>
      </div>
    </div>
  );
}
