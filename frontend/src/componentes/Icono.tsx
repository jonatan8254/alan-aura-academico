import type { ComponentType, SVGProps } from "react";

/**
 * Icono.tsx — envoltorio único sobre @tabler/icons-react (la única librería de iconos del
 * sistema, DIS-01 §6). @tabler/icons-react no exporta sus tipos `Icon`/`IconProps` (son
 * internos, ver dist/tabler-icons-react.d.ts) — `ComponenteIcono` replica su forma real
 * (SVG + size/stroke/title) solo para poder tipar la prop `icono` sin depender de un tipo
 * que el paquete no expone.
 */
export type ComponenteIcono = ComponentType<
  Omit<SVGProps<SVGSVGElement>, "stroke"> & {
    size?: string | number;
    stroke?: string | number;
    title?: string;
  }
>;

interface IconoProps extends Omit<SVGProps<SVGSVGElement>, "stroke"> {
  icono: ComponenteIcono;
  /** Si se pasa, el icono deja de ser decorativo: se vuelve el único texto accesible
   * (`role="img"` + `aria-label`). Sin `rotulo`, es `aria-hidden` — el caso por defecto,
   * porque casi siempre acompaña texto visible que ya dice lo mismo. */
  rotulo?: string;
  // `size`/`stroke` NO son atributos SVG nativos (por eso no vienen ya en SVGProps) — son
  // la extensión propia de @tabler/icons-react, hay que declararlos a mano para poder
  // fijarles un valor por defecto.
  size?: string | number;
  stroke?: string | number;
}

export function Icono({
  icono: IconoTabler,
  rotulo,
  size = 20,
  stroke = 1.5,
  ...resto
}: IconoProps) {
  return rotulo ? (
    <IconoTabler size={size} stroke={stroke} role="img" aria-label={rotulo} {...resto} />
  ) : (
    <IconoTabler size={size} stroke={stroke} aria-hidden="true" {...resto} />
  );
}
