import type { Character } from "contrato-api";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Icono, type ComponenteIcono } from "./Icono";

interface TarjetaDePersonajeProps {
  character: Character;
  nombre: string;
  frase: string;
  /** Subtítulo bajo el nombre («calma y regulación»). Del mockup p09. */
  rol?: string;
  /** Línea de pie con el estilo de meditación y de tono («meditación serena · tono pausado»). */
  detalle?: string;
  /** Avatar: `IconCat` para Aura, `IconDog` para Alan (DIS-01 §5, coherente con 🐈/🐕). */
  icono?: ComponenteIcono;
  seleccionado?: boolean;
  onSeleccionar: () => void;
}

/**
 * TarjetaDePersonaje — P-09 (CU-14 "Elegir acompañante"): una tarjeta por personaje, coloreada
 * vía `[data-persona]` (tema.css). El isotipo de dos círculos aquí es de UN solo color (el de
 * este personaje) — a diferencia de MarcaAlanAura, que combina los dos; aquí sí es la "marca"
 * de ESE personaje en particular (DIS-01 §2.2/§2.3: "marca Aura"/"marca Alan").
 */
export function TarjetaDePersonaje({
  character,
  nombre,
  frase,
  rol,
  detalle,
  icono,
  seleccionado = false,
  onSeleccionar,
}: TarjetaDePersonajeProps) {
  return (
    <article
      data-persona={character}
      className={cn(
        "flex flex-col items-center gap-3 rounded-tarjeta border p-6 text-center transition-colors duration-rapido",
        seleccionado ? "border-persona-500 bg-persona-tinte" : "border-borde bg-superficie",
      )}
    >
      {/*
        El mockup p09 hace clicable la tarjeta entera con una insignia de check. Aquí el
        control sigue siendo el <Button> de abajo, a propósito: un botón real trae foco,
        rol y `aria-pressed` de fábrica, mientras que un <article> clicable hay que
        reconstruirlo entero a mano y casi siempre queda peor para teclado.
      */}
      {icono ? (
        <span className="flex size-12 items-center justify-center rounded-full bg-persona-tinte">
          {/* Sin `rotulo`: el avatar es decorativo, el nombre del personaje va en el <h3>. */}
          <Icono icono={icono} size={26} className="text-persona-500" />
        </span>
      ) : (
        <span className="relative block h-10 w-14" aria-hidden="true">
          <span className="absolute left-0 top-0 size-8 rounded-full bg-persona-500" />
          <span className="absolute left-5 top-2 size-8 rounded-full bg-persona-500 opacity-60" />
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-h2 font-medium text-persona-texto">{nombre}</h3>
        {rol ? <p className="text-caption text-suave">{rol}</p> : null}
      </div>
      <p className="font-voz text-cuerpo text-persona-texto">&ldquo;{frase}&rdquo;</p>
      {detalle ? <p className="text-caption text-tenue">{detalle}</p> : null}
      <Button onClick={onSeleccionar} aria-pressed={seleccionado} className="h-11 px-5 text-cuerpo">
        {seleccionado ? "Seleccionado" : "Elegir"}
      </Button>
    </article>
  );
}
