import type { ReactNode } from "react";
import { IconAlertTriangle, IconCircleCheck, IconHeartHandshake } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { Icono, type ComponenteIcono } from "./Icono";

const VARIANTES: Record<
  "exito" | "aviso" | "crisis",
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
export function BannerInformativo({ tipo, children, className }: BannerInformativoProps) {
  const v = VARIANTES[tipo];
  return (
    <div
      role={tipo === "crisis" ? "alert" : "status"}
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
