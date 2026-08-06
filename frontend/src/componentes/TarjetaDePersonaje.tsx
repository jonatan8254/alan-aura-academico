import type { Character } from "contrato-api";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TarjetaDePersonajeProps {
  character: Character;
  nombre: string;
  frase: string;
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
      <span className="relative block h-10 w-14" aria-hidden="true">
        <span className="absolute left-0 top-0 size-8 rounded-full bg-persona-500" />
        <span className="absolute left-5 top-2 size-8 rounded-full bg-persona-500 opacity-60" />
      </span>
      <h3 className="text-h2 font-medium text-persona-texto">{nombre}</h3>
      <p className="font-voz text-cuerpo text-persona-texto">&ldquo;{frase}&rdquo;</p>
      <Button onClick={onSeleccionar} aria-pressed={seleccionado}>
        {seleccionado ? "Seleccionado" : "Elegir"}
      </Button>
    </article>
  );
}
