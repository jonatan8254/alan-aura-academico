import { cn } from "@/lib/utils";

const PASOS = 5;

interface BarraDePasosProps {
  /** 1..5 */
  pasoActual: number;
  etiquetas?: readonly string[];
  className?: string;
}

/**
 * BarraDePasos — progreso del onboarding (P-05..P-09, CU-05/CU-14), 5 pasos fijos: un punto
 * por pantalla del flujo, el actual resaltado con el acento de sistema — neutral, ninguna de
 * las dos rampas de personaje, porque el onboarding es previo a elegir Alan/Aura (P-09 es el
 * último paso).
 */
export function BarraDePasos({ pasoActual, etiquetas, className }: BarraDePasosProps) {
  return (
    <ol
      className={cn("flex items-center gap-2", className)}
      aria-label={`Paso ${pasoActual} de ${PASOS}`}
    >
      {Array.from({ length: PASOS }, (_, indice) => indice + 1).map((paso) => {
        const completado = paso < pasoActual;
        const actual = paso === pasoActual;
        return (
          <li key={paso} aria-current={actual ? "step" : undefined}>
            <span
              title={etiquetas?.[paso - 1]}
              className={cn(
                "block size-2.5 rounded-full transition-colors duration-lento",
                actual && "bg-sistema",
                completado && !actual && "bg-sistema/50",
                !completado && !actual && "bg-borde-fuerte",
              )}
            />
          </li>
        );
      })}
    </ol>
  );
}
