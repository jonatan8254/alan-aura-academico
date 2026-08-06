import { IconCheck, IconClock, IconEyeOff, IconUsers } from "@tabler/icons-react";
import type { FilaDeDirectorio } from "contrato-api";

import { obtenerDirectorio } from "@/api/endpoints";
import { useConsulta } from "@/api/hooks";
import { Chip } from "@/componentes/Chip";
import { EstadoVacio } from "@/componentes/EstadoVacio";
import { Icono } from "@/componentes/Icono";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BannerInformativo } from "@/componentes/BannerInformativo";

import { EstadoDeConsultaAdmin } from "./EstadoDeConsultaAdmin";

/**
 * P-14 Directorio de usuarios — `/plataforma-admin/` (CU-08, RF-15).
 *
 * CINCO COLUMNAS Y NINGUNA ACCIÓN POR FILA. `RF-15` fija exactamente qué se muestra —alias,
 * ID truncado, fecha, estado y onboarding— y `PRIV-R10` prohíbe el resto: nunca el username
 * completo, nunca la cápsula, nunca contenido de conversación. Que no haya acciones por fila
 * no es una omisión: `ECU-08 RE-03` deja la vista en solo lectura, y el uso no punitivo del
 * canon es lo que la sostiene.
 *
 * «Sin consentimiento» se pinta en NEUTRO, nunca en aviso ni destructivo. Una persona que no
 * otorgó consentimiento no es una incidencia que haya que resaltar; `estado` es un dato
 * derivado (`RF-15`: «no editable»), no una alerta.
 *
 * No se antepone `u_` al ID como hace el mockup: el backend devuelve los primeros 8
 * caracteres del UUID sin prefijo, e inventarlo haría creer que forma parte del
 * identificador. La elipsis sí se conserva — señala el truncado, que es una garantía.
 */
export function Directorio() {
  const consulta = useConsulta(obtenerDirectorio, []);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-h1 font-medium text-texto">Directorio de usuarios</h1>
        {consulta.datos ? (
          <p className="num-tabular text-caption text-suave">
            {consulta.datos.agregado.totalDeCuentas}{" "}
            {consulta.datos.agregado.totalDeCuentas === 1 ? "cuenta" : "cuentas"}
          </p>
        ) : null}
      </header>

      <BannerInformativo tipo="info">
        <span className="flex items-start gap-2">
          <Icono icono={IconEyeOff} size={18} className="mt-0.5 shrink-0" />
          Vista mínima: alias, ID truncado, registro, estado (activo / sin consentimiento) y
          onboarding. No se muestra el usuario completo, la cápsula ni contenido de
          conversación.
        </span>
      </BannerInformativo>

      <EstadoDeConsultaAdmin consulta={consulta} contexto="admin_directorio">
        {consulta.datos && consulta.datos.filas.length === 0 ? (
          // ECU-08 FA-01 / CA-03: el directorio vacío es un aviso sobrio, no un error.
          <EstadoVacio icono={IconUsers} titulo="Todavía no hay cuentas registradas">
            Cuando alguien se registre, aparecerá aquí.
          </EstadoVacio>
        ) : consulta.datos ? (
          <div className="overflow-x-auto rounded-tarjeta border border-admin-borde bg-superficie">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alias</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consulta.datos.filas.map((fila) => (
                  <Fila key={fila.idTruncado} fila={fila} />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </EstadoDeConsultaAdmin>
    </div>
  );
}

function Fila({ fila }: { fila: FilaDeDirectorio }) {
  const activo = fila.estado === "activo";
  return (
    <TableRow>
      <TableCell className="text-cuerpo text-texto">{fila.alias}</TableCell>
      <TableCell className="num-tabular text-caption text-suave">
        {fila.idTruncado}…
      </TableCell>
      <TableCell className="text-caption text-suave">{fecha(fila.fechaDeRegistro)}</TableCell>
      <TableCell>
        <Chip className={activo ? "bg-exito-tinte text-exito-texto" : undefined}>
          {activo ? "Activo" : "Sin consentimiento"}
        </Chip>
      </TableCell>
      <TableCell>
        {/* Con `rotulo`: el color por sí solo no es información accesible. */}
        <Icono
          icono={fila.completoElOnboarding ? IconCheck : IconClock}
          size={18}
          rotulo={fila.completoElOnboarding ? "Onboarding completo" : "Onboarding pendiente"}
          className={fila.completoElOnboarding ? "text-exito" : "text-tenue"}
        />
      </TableCell>
    </TableRow>
  );
}

/** Si la fecha no parsea se devuelve cruda: preferible a un «Invalid Date» en pantalla. */
function fecha(crudo: string): string {
  const valor = new Date(crudo);
  if (Number.isNaN(valor.getTime())) return crudo;
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(valor);
}
