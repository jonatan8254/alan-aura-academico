import { useId, type KeyboardEvent } from "react";
import { IconSend2 } from "@tabler/icons-react";

import { MAX_CARACTERES_POR_MENSAJE } from "@/dominio/limites";
import { cn } from "@/lib/utils";

import { Icono } from "./Icono";

// El 2500 vivía aquí como literal y también en el handler del backend. Ahora sale de
// dominio/limites.ts, por el mismo motivo por el que los colores salen de tema.css: un
// número de negocio repetido en tres archivos ya divergió, solo que todavía no se sabe.
const LIMITE = MAX_CARACTERES_POR_MENSAJE;
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
  const puedeEnviar = !deshabilitado && valor.trim().length > 0;

  /**
   * Enter envía, Shift+Enter salta línea — la convención que cualquiera espera de un chat.
   * Sin esto el mensaje solo se puede enviar con el ratón, que en la pantalla más usada del
   * producto es una barrera de accesibilidad, no una comodidad ausente.
   *
   * Va aquí y no en la pantalla porque es comportamiento del compositor: dejarlo fuera
   * obligaría a que quien lo monte se acuerde de cablearlo, y la firma pública no cambia.
   */
  function alTeclear(evento: KeyboardEvent<HTMLTextAreaElement>) {
    if (evento.key !== "Enter" || evento.shiftKey) return;
    // No interceptamos la composición de un IME: durante ella, Enter confirma el candidato.
    if (evento.nativeEvent.isComposing) return;
    evento.preventDefault();
    if (puedeEnviar) onEnviar();
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-tarjeta border border-borde bg-superficie p-2">
      <textarea
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        onKeyDown={alTeclear}
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
        {/* size-11 = 44px: el objetivo táctil mínimo de DIS-01 §1.6. Y `valor.trim()` en vez
            de `longitud === 0`, para que un mensaje de puros espacios no salga hacia un 400. */}
        <button
          type="button"
          onClick={onEnviar}
          disabled={!puedeEnviar}
          aria-label="Enviar mensaje"
          className="flex size-11 items-center justify-center rounded-control text-suave transition-colors duration-rapido hover:bg-superficie-alt disabled:pointer-events-none disabled:opacity-40"
        >
          <Icono icono={IconSend2} />
        </button>
      </div>
    </div>
  );
}
