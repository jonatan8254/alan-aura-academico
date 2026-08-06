import type { Character } from "contrato-api";

import { cn } from "@/lib/utils";

interface BurbujaDeChatProps {
  texto: string;
  autor: "usuario" | "personaje";
  /** Requerido cuando `autor === "personaje"` — decide el scope `[data-persona]`. */
  character?: Character;
}

/**
 * BurbujaDeChat — DIS-01 §6: usuario neutro alineado a la derecha; Alan/Aura con su color
 * (dos paradas de la rampa: `persona-500` de borde + `persona-tinte` de fondo) y voz en
 * serif (`font-voz`, SOLO aquí — nunca UI general). Esquina asimétrica (16px arriba / 4px
 * abajo, del lado de quien habla) marca "de quién viene" sin depender solo de color o
 * alineación, para no perder esa señal con daltonismo.
 */
export function BurbujaDeChat({ texto, autor, character }: BurbujaDeChatProps) {
  const esUsuario = autor === "usuario";
  return (
    <div
      data-persona={esUsuario ? undefined : character}
      className={cn("flex", esUsuario ? "justify-end" : "justify-start")}
    >
      <p
        className={cn(
          "max-w-lectura px-4 py-3 text-cuerpo",
          esUsuario
            ? "rounded-tl-tarjeta rounded-tr-tarjeta rounded-bl-tarjeta rounded-br-control border border-borde bg-superficie-alt text-texto"
            : "font-voz rounded-tr-tarjeta rounded-bl-tarjeta rounded-br-tarjeta rounded-tl-control border border-persona-500 bg-persona-tinte text-persona-texto",
        )}
      >
        {texto}
      </p>
    </div>
  );
}
