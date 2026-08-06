import { cn } from "@/lib/utils";

const RAYAS = {
  exito: "bg-exito",
  aviso: "bg-aviso",
  crisis: "bg-crisis",
  sistema: "bg-sistema",
} as const;

interface TarjetaDeMetricaProps {
  valor: string | number;
  etiqueta: string;
  color?: keyof typeof RAYAS;
}

/**
 * TarjetaDeMetrica — P-15 (métricas admin agregadas, RF-16). SIEMPRE un agregado, nunca un
 * dato por usuario (RN-03.3) — esa garantía la da quien arma la pantalla, no este primitivo
 * visual, que solo dibuja lo que recibe.
 *
 * `RAYAS` es un mapa ESTÁTICO a propósito (no `bg-${color}` interpolado): Tailwind v4
 * escanea el código fuente en busca de nombres de clase literales para generar el CSS —
 * una clase armada por interpolación de string nunca aparecería en el bundle final.
 */
export function TarjetaDeMetrica({ valor, etiqueta, color }: TarjetaDeMetricaProps) {
  return (
    <div className="relative overflow-hidden rounded-tarjeta border border-borde bg-superficie p-4">
      {color ? <span className={cn("absolute inset-y-0 left-0 w-1", RAYAS[color])} /> : null}
      <p className="num-tabular text-display font-medium text-texto">{valor}</p>
      <p className="text-caption text-suave">{etiqueta}</p>
    </div>
  );
}
