import { useId } from "react";
import { IconSend2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { Icono } from "./Icono";

const LIMITE = 2500;
const UMBRAL_AVISO = Math.floor(LIMITE * 0.9); // 2250

interface CompositorDeMensajeProps {
  valor: string;
  onCambiar: (valor: string) => void;
  onEnviar: () => void;
  deshabilitado?: boolean;
  placeholder?: string;
}

/**
 * CompositorDeMensaje — el textarea de /chat/ (P-10, RF-25). Nunca trunca lo que el usuario
 * ya escribió: al llegar a 2500 caracteres se deja de ACEPTAR más entrada (`maxLength`) y el
 * botón de enviar se deshabilita, pero el texto existente queda intacto. El contador de
 * caracteres solo aparece desde el 90% del límite (2250) — contar antes de eso es ruido, no
 * ayuda.
 */
export function CompositorDeMensaje({
  valor,
  onCambiar,
  onEnviar,
  deshabilitado = false,
  placeholder = "Escribe aquí…",
}: CompositorDeMensajeProps) {
  const idContador = useId();
  const longitud = valor.length;
  const enLimite = longitud >= LIMITE;
  const mostrarContador = longitud >= UMBRAL_AVISO;

  return (
    <div className="flex flex-col gap-1.5 rounded-tarjeta border border-borde bg-superficie p-2">
      <textarea
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        maxLength={LIMITE}
        disabled={deshabilitado}
        placeholder={placeholder}
        aria-describedby={mostrarContador ? idContador : undefined}
        rows={2}
        className="resize-none bg-transparent px-2 py-1.5 text-cuerpo text-texto outline-none placeholder:text-tenue disabled:opacity-50"
      />
      <div className="flex items-center justify-between px-2">
        {mostrarContador ? (
          <span
            id={idContador}
            className={cn(
              "num-tabular text-caption",
              enLimite ? "text-destructivo" : "text-suave",
            )}
          >
            {longitud}/{LIMITE}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onEnviar}
          disabled={deshabilitado || longitud === 0}
          aria-label="Enviar mensaje"
          className="flex size-8 items-center justify-center rounded-control text-suave transition-colors duration-rapido hover:bg-superficie-alt disabled:pointer-events-none disabled:opacity-40"
        >
          <Icono icono={IconSend2} />
        </button>
      </div>
    </div>
  );
}
