import { useEffect, useState } from "react";
import { IconHistory } from "@tabler/icons-react";
import type { EstadoDisponibilidad, UltimoCambioDeAcceso } from "contrato-api";

import { cambiarAccesoAlChat, consultarChatAccess } from "@/api/endpoints";
import { useComando, useConsulta } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { DialogoDeConfirmacion } from "@/componentes/DialogoDeConfirmacion";
import { Icono } from "@/componentes/Icono";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { copiaDeFallo } from "@/copia/fallos";
import { cn } from "@/lib/utils";

import { EstadoDeConsultaAdmin } from "./EstadoDeConsultaAdmin";

/**
 * P-16 Disponibilidad del chatbot — `/plataforma-admin/disponibilidad/` (CU-10, RF-17/18).
 *
 * El estado y el último cambio auditado se leen de `GET /admin/chat-access`
 * (`consultarChatAccess`, backend commit `1e8fef3`) — antes de esa ruta, esta pantalla leía
 * `estadoDelChatbot` de `/admin/metricas` porque era la única fuente, y el bloque de
 * auditoría de `ECU-10 §11` paso 1 no se podía mostrar (no había de dónde leerlo). Las dos
 * cosas quedan cerradas con la misma llamada.
 *
 * UN SOLO CONTROL. El mockup dibuja el toggle Y un botón «Deshabilitar el chatbot» debajo;
 * dos disparadores para una acción global duplican la superficie de accidente sin añadir
 * nada. Se conserva el toggle, que es el que muestra el estado vigente.
 *
 * El `Switch` NO cambia nada por sí mismo: abre el diálogo con el estado destino. Si se
 * cancela, nunca se movió — que es literalmente `ECU-10 FA-02` («no cambia el estado global
 * ni registra AccionAdministrativa alguna»). `tono="aviso"` y no `destructivo`: DIS-01 §2.5
 * reserva el destructivo a eliminar cuenta, y esto es reversible con un clic.
 */
export function Disponibilidad() {
  const consulta = useConsulta(consultarChatAccess, []);
  const { enviando, fallo, ejecutar } = useComando(cambiarAccesoAlChat);
  const [estado, setEstado] = useState<EstadoDisponibilidad | null>(null);
  const [ultimoCambio, setUltimoCambio] = useState<UltimoCambioDeAcceso | null>(null);
  const [destino, setDestino] = useState<EstadoDisponibilidad | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    if (consulta.datos) {
      setEstado(consulta.datos.estado);
      setUltimoCambio(consulta.datos.ultimoCambio);
    }
  }, [consulta.datos]);

  async function confirmar() {
    if (!destino) return;
    const yaRegia = estado === destino;
    const resultado = await ejecutar({ estadoNuevo: destino, confirmacion: true });
    setDestino(null);
    if (!resultado.ok) return;

    // Se toma la respuesta como verdad nueva, no el destino que pedimos.
    setEstado(resultado.datos.estado);
    // Recarga también `ultimoCambio`: `POST /admin/chat-access` no devuelve quién ni cuándo
    // hizo el cambio, solo el estado resultante — `consultarChatAccess` es la única fuente
    // para refrescar el bloque de auditoría tras confirmar.
    void consulta.recargar();
    // ECU-10 FA-03: con dos administradores a la vez, el estado pedido puede ya regir. El
    // backend responde 200 idéntico haya escrito o no, así que la única forma de detectarlo
    // es comparar con lo que esta pantalla mostraba. Se dice, no se finge que hubo cambio.
    setAviso(
      yaRegia
        ? "Ese estado ya regía."
        : resultado.datos.estado === "habilitado"
          ? "El chat quedó habilitado."
          : "El chat quedó deshabilitado.",
    );
  }

  const habilitado = estado === "habilitado";
  const copia = fallo ? copiaDeFallo(fallo, "admin_kill_switch") : null;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-medium text-texto">Disponibilidad del chatbot</h1>

      <EstadoDeConsultaAdmin consulta={consulta} contexto="admin_kill_switch">
        {estado !== null ? (
          <div className="flex flex-col gap-4">
            {aviso ? <BannerInformativo tipo="exito">{aviso}</BannerInformativo> : null}

            {copia ? (
              <BannerInformativo tipo="aviso">
                <p className="font-medium">{copia.titulo}</p>
                {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
              </BannerInformativo>
            ) : null}

            <div className="flex items-center justify-between gap-4 rounded-tarjeta border border-admin-borde bg-superficie p-5">
              <div className="flex items-start gap-3">
                {/* `aviso` y no `destructivo` para el apagado: deshabilitar el chat es una
                    medida operativa reversible, no una destrucción. */}
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    habilitado ? "bg-exito" : "bg-aviso",
                  )}
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="kill-switch" className="text-cuerpo font-medium text-texto">
                    {habilitado ? "Habilitado" : "Deshabilitado"}
                  </Label>
                  <p id="efecto-kill-switch" className="text-caption text-suave">
                    {habilitado
                      ? "Los usuarios pueden conversar con normalidad."
                      : "Ningún usuario puede iniciar una conversación."}
                  </p>
                </div>
              </div>
              <Switch
                id="kill-switch"
                checked={habilitado}
                // No cambia el estado: solo propone el destino y abre el diálogo.
                onCheckedChange={(activo) => setDestino(activo ? "habilitado" : "deshabilitado")}
                disabled={enviando}
                aria-describedby="efecto-kill-switch"
              />
            </div>

            {/*
              ECU-10 §11 paso 1: «presenta el estado global vigente y el último cambio
              registrado, con autor y fecha». `autor` es el ALIAS del administrador
              (RN-03.5) — lo resuelve el backend antes de auditar (chat-access.ts), esta
              pantalla no recibe ni necesita el username.
            */}
            <div className="flex items-start gap-2 text-caption text-suave">
              <Icono icono={IconHistory} size={16} className="mt-0.5 shrink-0" />
              {ultimoCambio ? (
                <p>
                  Último cambio: {ultimoCambio.autor} · {formatoDeFecha(ultimoCambio.fecha)}. Sin
                  datos de usuario.
                </p>
              ) : (
                // El kill switch nunca se tocó desde que existe la tabla de auditoría —
                // distinto de un fallo de lectura, que EstadoDeConsultaAdmin ya intercepta
                // arriba y nunca deja llegar hasta aquí.
                <p>Todavía no se ha registrado ningún cambio. Sin datos de usuario.</p>
              )}
            </div>
          </div>
        ) : null}
      </EstadoDeConsultaAdmin>

      <DialogoDeConfirmacion
        abierto={destino !== null}
        onCambiarAbierto={(abierto) => !abierto && setDestino(null)}
        tono="aviso"
        titulo={destino === "deshabilitado" ? "¿Deshabilitar el chatbot?" : "¿Habilitar el chatbot?"}
        textoConfirmar={destino === "deshabilitado" ? "Deshabilitar" : "Habilitar"}
        confirmando={enviando}
        onConfirmar={confirmar}
      >
        {/* ECU-10 RE-05: el diálogo nombra el efecto ANTES de confirmar. */}
        {destino === "deshabilitado"
          ? "Ningún usuario podrá iniciar una conversación hasta que lo vuelvas a habilitar. La acción queda registrada con tu usuario y la fecha."
          : "Los usuarios podrán volver a iniciar conversaciones. La acción queda registrada con tu usuario y la fecha."}
      </DialogoDeConfirmacion>
    </div>
  );
}

/** Si la fecha no parsea se devuelve cruda: preferible a un «Invalid Date» en pantalla de auditoría. */
function formatoDeFecha(crudo: string): string {
  const valor = new Date(crudo);
  if (Number.isNaN(valor.getTime())) return crudo;
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(
    valor,
  );
}
