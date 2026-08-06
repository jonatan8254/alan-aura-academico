import { useId, useState, type ReactNode } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Icono } from "./Icono";

/**
 * CampoDeFormulario — etiqueta arriba, ayuda debajo, error en línea (DIS-01 §6).
 *
 * Existe porque P-02, P-03 y P-04 montan entre dos y tres campos cada una con exactamente la
 * misma estructura, incluido el cableado de `aria-describedby`/`aria-invalid` que es fácil
 * de olvidar en la tercera copia. Los tamaños (`h-11`, `text-cuerpo`) están aquí y no en cada
 * pantalla para que el objetivo táctil de ≥44px de DIS-01 §1.6 no dependa de acordarse.
 */

interface CampoProps {
  etiqueta: string;
  valor: string;
  onCambiar: (valor: string) => void;
  tipo?: "text" | "password";
  ayuda?: ReactNode;
  /** Mensaje de error en línea. Su presencia marca el campo como inválido. */
  error?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  deshabilitado?: boolean;
}

export function CampoDeFormulario({
  etiqueta,
  valor,
  onCambiar,
  tipo = "text",
  ayuda,
  error,
  autoComplete,
  autoFocus,
  deshabilitado,
}: CampoProps) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const [verContrasena, setVerContrasena] = useState(false);

  const esContrasena = tipo === "password";
  const tipoEfectivo = esContrasena && verContrasena ? "text" : tipo;
  const descrito = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-cuerpo text-texto">
        {etiqueta}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={tipoEfectivo}
          value={valor}
          onChange={(evento) => onCambiar(evento.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={deshabilitado}
          aria-invalid={error ? true : undefined}
          aria-describedby={descrito || undefined}
          className={cn(
            "h-11 text-cuerpo",
            esContrasena && "pr-12",
            error && "border-destructivo",
          )}
        />
        {esContrasena ? (
          // El Input de shadcn no tiene ranura para adornos, así que el botón se posiciona
          // encima. size-11 = 44px, el mismo objetivo táctil que el campo.
          <button
            type="button"
            onClick={() => setVerContrasena((v) => !v)}
            aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute inset-y-0 right-0 flex size-11 items-center justify-center rounded-control text-suave hover:text-texto"
          >
            <Icono icono={verContrasena ? IconEyeOff : IconEye} size={18} />
          </button>
        ) : null}
      </div>
      {ayuda ? (
        <p id={idAyuda} className="text-caption text-tenue">
          {ayuda}
        </p>
      ) : null}
      {error ? (
        <p id={idError} className="text-caption text-destructivo">
          {error}
        </p>
      ) : null}
    </div>
  );
}
