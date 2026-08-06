import type { ReactNode } from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconHeartHandshake,
  IconInfoCircle,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { Icono, type ComponenteIcono } from "./Icono";

const VARIANTES: Record<
  "exito" | "aviso" | "crisis" | "info",
  { icono: ComponenteIcono; bg: string; borde: string; texto: string }
> = {
  exito: {
    icono: IconCircleCheck,
    bg: "bg-exito-tinte",
    borde: "border-exito",
    texto: "text-exito-texto",
  },
  // DIS-01 §2.5: "preferir borde+icono, sin relleno grande" — por eso, a diferencia de
  // éxito/crisis, "aviso" NO lleva tinte de fondo.
  aviso: { icono: IconAlertTriangle, bg: "bg-superficie", borde: "border-aviso", texto: "text-texto" },
  crisis: {
    icono: IconHeartHandshake,
    bg: "bg-crisis-tinte",
    borde: "border-crisis-borde",
    texto: "text-crisis-texto",
  },
  // Fase 3: las tres pantallas de administración abren con una tira que declara el alcance
  // de la vista («solo cifras agregadas», «no se muestra el usuario completo»). No es un
  // estado ni un resultado — es una nota permanente, y por eso abajo se renderiza SIN `role`.
  info: {
    icono: IconInfoCircle,
    bg: "bg-sistema-tinte",
    borde: "border-borde",
    texto: "text-sistema-texto",
  },
};

interface BannerInformativoProps {
  tipo: keyof typeof VARIANTES;
  children: ReactNode;
  className?: string;
}

/**
 * BannerInformativo — banner de estado genérico (éxito/aviso/crisis), reutilizado entre
 * pantallas (confirmaciones, degradación del chat P-11, etc.) en vez de que cada una
 * reinvente su propio recuadro de color.
 */
/**
 * `role` según lo que el banner ES, no según su color: `alert` interrumpe al lector de
 * pantalla y `status` espera turno, así que anunciar una nota fija como región viva la
 * repetiría en cada re-render sin que nada haya cambiado. Por eso `info` no lleva ninguno.
 */
function rolDe(tipo: BannerInformativoProps["tipo"]): "alert" | "status" | undefined {
  if (tipo === "crisis") return "alert";
  if (tipo === "info") return undefined;
  return "status";
}

export function BannerInformativo({ tipo, children, className }: BannerInformativoProps) {
  const v = VARIANTES[tipo];
  return (
    <div
      role={rolDe(tipo)}
      className={cn(
        "flex items-start gap-3 rounded-tarjeta border p-4 text-cuerpo",
        v.bg,
        v.borde,
        v.texto,
        className,
      )}
    >
      <Icono icono={v.icono} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
