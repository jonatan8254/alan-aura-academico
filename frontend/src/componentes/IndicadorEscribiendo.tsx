import { cn } from "@/lib/utils";

/**
 * IndicadorEscribiendo — DIS-01 §6 "latido lento" (E6): tres puntos con opacidad pulsante a
 * 1.4s, escalonados. `motion-safe:` (no la regla global `!important` de base.css) es lo que
 * realmente decide "estático" aquí: bajo `prefers-reduced-motion`, la clase `animate-pulse`
 * ni se aplica, así que los puntos quedan de verdad quietos en su opacidad de reposo, en vez
 * de una animación de 0.01ms que igual podría parpadear.
 */
export function IndicadorEscribiendo({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Escribiendo…"
      className={cn("flex items-center gap-1", className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 rounded-full bg-suave motion-safe:animate-pulse"
          style={{ animationDuration: "1.4s", animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
