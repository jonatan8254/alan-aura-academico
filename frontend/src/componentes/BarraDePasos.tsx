import { cn } from "@/lib/utils";

const PASOS = 5;

interface BarraDePasosProps {
  /** 1..5 */
  pasoActual: number;
  etiquetas?: readonly string[];
  /** Renderiza «Paso N de 5» como texto visible, no solo para lectores de pantalla. */
  mostrarEtiqueta?: boolean;
  className?: string;
}

/**
 * BarraDePasos — progreso del onboarding (P-05..P-09, CU-05/CU-14), 5 pasos fijos. El acento
 * es el de sistema, neutral: ninguna de las dos rampas de personaje, porque el onboarding es
 * previo a elegir Alan/Aura (P-09 es el último paso).
 *
 * Fase 3 — dos cambios respecto de la versión de Fase 0b, los dos por fidelidad al mockup:
 * eran puntos y los cinco mockups dibujan BARRAS (`height:4px; flex:1`), y el rótulo
 * «Paso N de 5» solo existía en el `aria-label` cuando los mockups lo pintan visible encima
 * de la barra. Lo segundo importa más de lo que parece: en un flujo de consentimiento, saber
 * cuánto falta es parte de no sentirse atrapado.
 */
export function BarraDePasos({
  pasoActual,
  etiquetas,
  mostrarEtiqueta = false,
  className,
}: BarraDePasosProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {mostrarEtiqueta ? (
        <p className="text-caption text-tenue">
          Paso {pasoActual} de {PASOS}
        </p>
      ) : null}
      <ol className="flex items-center gap-1.5" aria-label={`Paso ${pasoActual} de ${PASOS}`}>
        {Array.from({ length: PASOS }, (_, indice) => indice + 1).map((paso) => {
          const completado = paso < pasoActual;
          const actual = paso === pasoActual;
          return (
            <li key={paso} className="flex-1" aria-current={actual ? "step" : undefined}>
              <span
                title={etiquetas?.[paso - 1]}
                className={cn(
                  "block h-1 rounded-full transition-colors duration-lento",
                  actual && "bg-sistema",
                  completado && !actual && "bg-sistema/50",
                  !completado && !actual && "bg-borde-fuerte",
                )}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
