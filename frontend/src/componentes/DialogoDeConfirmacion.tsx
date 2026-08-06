import type { ReactNode } from "react";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Icono, type ComponenteIcono } from "./Icono";

const TONOS: Record<
  "destructivo" | "aviso",
  { icono: ComponenteIcono; insignia: string; boton: "destructive" | "default" }
> = {
  destructivo: { icono: IconTrash, insignia: "bg-destructivo/10 text-destructivo", boton: "destructive" },
  aviso: { icono: IconAlertTriangle, insignia: "bg-aviso/10 text-aviso", boton: "default" },
};

interface DialogoDeConfirmacionProps {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  tono: keyof typeof TONOS;
  titulo: string;
  children: ReactNode;
  textoConfirmar: string;
  onConfirmar: () => void;
  confirmando?: boolean;
}

/**
 * DialogoDeConfirmacion — envoltura sobre `<Dialog>` de shadcn/ui (Base UI) para las dos
 * confirmaciones de alto impacto del sistema: eliminar cuenta (CU-04, "destructivo") y el
 * kill switch de admin (CU-10 / P-16, "aviso"). Para cualquier otra cosa, un
 * BannerInformativo basta — este componente es a propósito solo para decisiones
 * irreversibles o de gran alcance.
 */
export function DialogoDeConfirmacion({
  abierto,
  onCambiarAbierto,
  tono,
  titulo,
  children,
  textoConfirmar,
  onConfirmar,
  confirmando = false,
}: DialogoDeConfirmacionProps) {
  const t = TONOS[tono];
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          <span className={cn("flex size-10 items-center justify-center rounded-full", t.insignia)}>
            <Icono icono={t.icono} size={22} />
          </span>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription className="text-cuerpo text-suave">{children}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onCambiarAbierto(false)} disabled={confirmando}>
            Cancelar
          </Button>
          <Button variant={t.boton} onClick={onConfirmar} disabled={confirmando}>
            {textoConfirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
