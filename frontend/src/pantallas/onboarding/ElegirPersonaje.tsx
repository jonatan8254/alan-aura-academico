import { useState } from "react";
import { useNavigate } from "react-router";
import { IconCat, IconDog } from "@tabler/icons-react";
import type { Character } from "contrato-api";

import { enviarOnboarding } from "@/api/endpoints";
import { useComando } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { TarjetaDePersonaje } from "@/componentes/TarjetaDePersonaje";
import { Button } from "@/components/ui/button";
import { copiaDeFallo } from "@/copia/fallos";
import {
  fichaDe,
  PERSONAJES,
  SUBTITULO_ELEGIR_PERSONAJE,
  TITULO_ELEGIR_PERSONAJE,
} from "@/dominio/personajes";
import { aPeticion, escribirBorrador, leerBorrador } from "@/onboarding/borrador";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * P-09 Onboarding · elegir a Alan o Aura — `/onboarding/personaje` (CU-14, RF-06).
 *
 * LA ÚNICA ESCRITURA DE TODO EL ASISTENTE. `POST /api/v1/onboarding` viaja aquí, con todo lo
 * acumulado en el borrador. Consecuencia que conviene tener escrita: hasta este botón, nada
 * se ha escrito en el servidor, así que `CA-10` («lo no confirmado no queda escrito») se
 * cumple en su forma fuerte — más de lo que su propia `ECU-05 v2.2` llegó a exigir tras
 * `H-16`, que la debilitó porque el diseño de entonces escribía el consentimiento en el paso 5.
 *
 * SIN PRESELECCIÓN, aunque el mockup muestre a Aura marcada: su propio pie dice «Aura
 * seleccionada», o sea que ilustra un estado, no un valor inicial. Elegir por la persona
 * sería el mismo error que las casillas premarcadas de P-07.
 *
 * El botón primario no se deshabilita sin selección: avisa. Misma decisión que en P-07, por
 * coherencia dentro del asistente.
 */
export function ElegirPersonaje() {
  const [seleccionado, setSeleccionado] = useState<Character | null>(leerBorrador().character);
  const [avisoSinSeleccion, setAvisoSinSeleccion] = useState(false);
  const { enviando, fallo, ejecutar } = useComando(enviarOnboarding);
  const { sesion, escribirSesion } = useSesion();
  const navegar = useNavigate();

  const copia = fallo ? copiaDeFallo(fallo, "onboarding") : null;

  async function empezar() {
    if (!seleccionado) {
      setAvisoSinSeleccion(true);
      return;
    }
    const peticion = aPeticion({ ...leerBorrador(), character: seleccionado });
    if (!peticion) {
      // Solo alcanzable si el borrador se manipuló a mano en sessionStorage: la guarda de
      // pasos ya impide llegar aquí sin edad ni capa base.
      navegar("/onboarding/", { replace: true });
      return;
    }

    const resultado = await ejecutar(peticion);
    if (!resultado.ok) return;

    // ORDEN OBLIGATORIO: primero la pista, luego limpiar, luego navegar. Si se navegara
    // antes de escribir `onboardingCompleto: true`, `RequiereOnboarding` leería la pista
    // vieja y devolvería al asistente a alguien que acaba de terminarlo.
    if (sesion) {
      escribirSesion({ ...sesion, onboardingCompleto: true, character: seleccionado });
    }
    escribirBorrador(null);
    navegar("/chat/", { replace: true });
  }

  const cta = seleccionado ? fichaDe(seleccionado).ctaFinal : "Empezar a conversar";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-medium text-texto">{TITULO_ELEGIR_PERSONAJE}</h1>
        {/* Es cierto y hay que poder sostenerlo: RF-12/CU-13 permite alternar a mitad. */}
        <p className="max-w-lectura text-cuerpo text-suave">{SUBTITULO_ELEGIR_PERSONAJE}</p>
      </header>

      {avisoSinSeleccion && !seleccionado ? (
        <BannerInformativo tipo="aviso">
          Elige a Alan o a Aura para continuar.
        </BannerInformativo>
      ) : null}

      {copia ? (
        <BannerInformativo tipo="aviso">
          <p className="font-medium">{copia.titulo}</p>
          {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
        </BannerInformativo>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {PERSONAJES.map((p) => (
          <TarjetaDePersonaje
            key={p.character}
            character={p.character}
            nombre={p.nombre}
            rol={p.rol}
            frase={p.frase}
            detalle={p.tono}
            icono={p.character === "aura" ? IconCat : IconDog}
            seleccionado={seleccionado === p.character}
            onSeleccionar={() => {
              setSeleccionado(p.character);
              setAvisoSinSeleccion(false);
            }}
          />
        ))}
      </div>

      {/* `data-persona` en el contenedor para que el primario tome el sólido del personaje
          elegido, como en el mockup (que lo pinta con el 700 de Aura). */}
      <div data-persona={seleccionado ?? undefined} className="flex flex-wrap gap-3 pt-2">
        <Button
          onClick={empezar}
          disabled={enviando}
          className="h-11 px-5 text-cuerpo"
        >
          {enviando ? "Un momento…" : cta}
        </Button>
      </div>
    </div>
  );
}
