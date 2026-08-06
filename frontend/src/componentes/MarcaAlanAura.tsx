import { cn } from "@/lib/utils";

const TAMANOS = {
  sm: { punto: "size-3", solapa: "-ml-1.5" },
  md: { punto: "size-4", solapa: "-ml-2" },
  lg: { punto: "size-6", solapa: "-ml-3" },
  xl: { punto: "size-8", solapa: "-ml-4" },
} as const;

export type TamanoDeMarca = keyof typeof TAMANOS;

interface MarcaAlanAuraProps {
  tamano?: TamanoDeMarca;
  className?: string;
}

/**
 * MarcaAlanAura — el isotipo del sistema: dos círculos superpuestos, uno por rampa de
 * personaje (Aura teal / Alan ámbar, tema.css Tier 1) — la única marca que combina ambos
 * colores fuera de un scope `[data-persona]" único. Puramente decorativa (`aria-hidden`):
 * el texto "Alan & Aura" que la acompaña en cada pantalla lleva el significado accesible.
 */
export function MarcaAlanAura({ tamano = "md", className }: MarcaAlanAuraProps) {
  const { punto, solapa } = TAMANOS[tamano];
  return (
    <span aria-hidden="true" className={cn("inline-flex items-center", className)}>
      <span className={cn("rounded-full bg-aura-500", punto)} />
      <span className={cn("rounded-full bg-alan-500 mix-blend-multiply", punto, solapa)} />
    </span>
  );
}
