import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { IconRefresh, IconShieldOff, IconTrash } from "@tabler/icons-react";

import { eliminarCuenta, reiniciarPerfil, revocarPersonalizacion } from "@/api/endpoints";
import { useComando } from "@/api/hooks";
import type { Fallo } from "@/api/resultado";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { DialogoDeConfirmacion } from "@/componentes/DialogoDeConfirmacion";
import { Icono, type ComponenteIcono } from "@/componentes/Icono";
import { Button } from "@/components/ui/button";
import { copiaDeFallo, type ContextoDeCopia } from "@/copia/fallos";
import { sembrarParaReinicio } from "@/onboarding/borrador";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * P-13 Gestión de cuenta y datos — `/cuenta/` (CU-04, CU-11 y CU-12; RF-22/23/24).
 *
 * EL MOCKUP MIENTE Y NO SE COPIA. `p13` dice «Todo es reversible, salvo eliminar la cuenta»
 * y, de reiniciar, «Puedes rehacerlo cuando quieras». `DIS-00 §3` (corrección PDR-01 D-02)
 * declara eso FALSO: reiniciar la caracterización borra la cápsula entera, `character`
 * incluido, y deja a la persona sin poder conversar hasta rehacer el onboarding
 * (`ECU-11 §14`). DOS de las tres acciones son irreversibles. La única reversible es revocar
 * la personalización — que aun así lleva diálogo, porque `ECU-12 §11` paso 2 y su `FA-03` lo
 * piden: la asimetría está en la ADVERTENCIA, no en la existencia del diálogo.
 *
 * NINGÚN endpoint al montar. `ECU-04 §11` paso 1 enumera qué desaparece ANTES de confirmar y
 * es texto fijo del cliente; el campo `alcance` de la respuesta confirma lo YA ejecutado, no
 * es una vista previa.
 */
export function GestionDeCuenta() {
  const { sesion, escribirSesion } = useSesion();
  const navegar = useNavigate();
  const [dialogo, setDialogo] = useState<null | "reiniciar" | "revocar" | "eliminar">(null);
  const [exito, setExito] = useState<string | null>(null);

  const cmdReiniciar = useComando(reiniciarPerfil);
  const cmdRevocar = useComando(revocarPersonalizacion);
  const cmdEliminar = useComando(eliminarCuenta);

  const cerrar = () => setDialogo(null);

  /**
   * El diálogo se cierra SIEMPRE al resolverse el comando, también cuando falla.
   *
   * No es cosmético: los diálogos son modales, así que dejarlo abierto tras un fallo esconde
   * el banner de error —y su botón de reintento— detrás de una ventana que no dice nada de lo
   * que pasó. El caso que lo hace grave es `ECU-04 FE-04`: la eliminación quedó a medias y la
   * persona tiene que poder leerlo y reintentar.
   */

  async function confirmarReinicio() {
    const r = await cmdReiniciar.ejecutar(undefined);
    cerrar();
    if (!r.ok) return;
    // Mitigación de un bug del backend, no un arreglo: `reiniciar.ts` borra la CAPSULA pero
    // deja `PERFIL.completoElOnboarding` en true, así que /chat empezaría a devolver 403
    // «consentimiento base no otorgado» —que en este estado es factualmente falso—. Con la
    // pista en false, RequiereOnboarding manda al asistente, que es donde ECU-11 §14 dice
    // que hay que estar. NO sobrevive a un re-login: el servidor volvería a decir true.
    if (sesion) escribirSesion({ ...sesion, onboardingCompleto: false, character: undefined });
    sembrarParaReinicio();
    navegar("/onboarding/caracterizacion"); // ECU-11 §11 paso 5.
  }

  async function confirmarRevocacion() {
    const r = await cmdRevocar.ejecutar(undefined);
    cerrar();
    if (!r.ok) return;
    // La copia describe el ESTADO, no el acto: `ECU-12 FA-01` (ya estaba revocada) también
    // responde 200 y la respuesta no trae nada que permita distinguir los dos casos, así
    // que decir «acabamos de revocarla» sería afirmar algo que no se sabe.
    setExito("Listo. Tu caracterización ya no orienta la conversación.");
  }

  async function confirmarEliminacion() {
    const r = await cmdEliminar.ejecutar(undefined);
    cerrar();
    if (!r.ok) return; // FE-04 (500): NO se navega ni se toca la pista. Ver la nota de abajo.
    // ORDEN OBLIGATORIO: limpiar la pista y solo después navegar. Al revés, `SoloInvitados`
    // ve una sesión viva en `/` y rebota a /chat/, con lo que el aviso de ECU-04 §11 paso 4
    // no se ve nunca.
    escribirSesion(null);
    navegar("/?motivo=cuenta_eliminada", { replace: true });
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 font-medium text-texto">Tu cuenta y tus datos</h1>
        {/* Subtítulo corregido: el del mockup afirma algo que DIS-00 §3 D-02 declara falso. */}
        <p className="text-cuerpo text-suave">
          Tú decides sobre tu información. Dos de estas acciones no se pueden deshacer.
        </p>
      </header>

      {exito ? <BannerInformativo tipo="exito">{exito}</BannerInformativo> : null}

      <div className="flex flex-col gap-3">
        <Accion
          icono={IconRefresh}
          titulo="Reiniciar caracterización"
          // Descripción corregida: ECU-11 RE-01/CA-04 exige nombrar las tres cosas a la vez
          // —qué borra, que no se deshace y que deja sin conversar—, y el mockup solo decía
          // «puedes rehacerlo cuando quieras», que es lo contrario de una advertencia.
          descripcion="Borra tu caracterización por completo, incluido el acompañante que elegiste. No se puede deshacer y no podrás conversar hasta rehacerla."
          etiqueta="Reiniciar"
          onAccion={() => setDialogo("reiniciar")}
          fallo={cmdReiniciar.fallo}
          contexto="reiniciar_perfil"
          onReintentar={confirmarReinicio}
        />
        <Accion
          icono={IconShieldOff}
          titulo="Revocar personalización"
          descripcion="Deja de usar tu caracterización para orientar la conversación. Puedes seguir conversando y volver a otorgarla cuando quieras."
          etiqueta="Revocar"
          onAccion={() => setDialogo("revocar")}
          fallo={cmdRevocar.fallo}
          contexto="revocar_personalizacion"
          onReintentar={confirmarRevocacion}
        />
        <Accion
          icono={IconTrash}
          titulo="Eliminar cuenta"
          descripcion="Borra tu cuenta y todos tus datos asociados, sin vuelta atrás."
          etiqueta="Eliminar"
          destructiva
          onAccion={() => setDialogo("eliminar")}
          fallo={cmdEliminar.fallo}
          contexto="eliminar_cuenta"
          onReintentar={confirmarEliminacion}
        />
      </div>

      <p className="text-caption text-suave">
        <Link
          to={sesion?.onboardingCompleto ? "/chat/" : "/onboarding/"}
          className="text-sistema underline-offset-4 hover:underline"
        >
          Volver a la conversación
        </Link>
      </p>

      <DialogoDeConfirmacion
        abierto={dialogo === "reiniciar"}
        onCambiarAbierto={(a) => !a && cerrar()}
        tono="destructivo"
        titulo="¿Reiniciar tu caracterización?"
        textoConfirmar="Sí, reiniciar"
        confirmando={cmdReiniciar.enviando}
        onConfirmar={confirmarReinicio}
      >
        <span className="block">
          Se borra tu caracterización completa, incluido el acompañante que elegiste.
        </span>
        <span className="block pt-2">
          No se puede deshacer, y no podrás conversar hasta que la rehagas.
        </span>
      </DialogoDeConfirmacion>

      <DialogoDeConfirmacion
        abierto={dialogo === "revocar"}
        onCambiarAbierto={(a) => !a && cerrar()}
        tono="aviso"
        titulo="¿Revocar la personalización?"
        textoConfirmar="Sí, revocar"
        confirmando={cmdRevocar.enviando}
        onConfirmar={confirmarRevocacion}
      >
        <span className="block">
          Tu caracterización dejará de orientar la conversación desde el próximo mensaje.
        </span>
        <span className="block pt-2">Podrás seguir conversando con normalidad.</span>
      </DialogoDeConfirmacion>

      <DialogoDeConfirmacion
        abierto={dialogo === "eliminar"}
        onCambiarAbierto={(a) => !a && cerrar()}
        tono="destructivo"
        titulo="¿Eliminar tu cuenta?"
        textoConfirmar="Sí, eliminar"
        confirmando={cmdEliminar.enviando}
        onConfirmar={confirmarEliminacion}
      >
        <span className="block">
          Esto borra en cascada tu perfil, tu consentimiento y todos tus datos asociados. No
          se puede deshacer.
        </span>
        {/*
          `ECU-04 §11` paso 1 y `RE-05` exigen ENUMERAR qué desaparece antes de confirmar.
          La lista espeja `registrosQueDesapareceran` de la respuesta para que el «antes» y
          el «después» digan lo mismo. Van como <span className="block"> y no como <ul>
          porque `DialogDescription` renderiza un <p>, y una lista dentro de un párrafo es
          HTML inválido.
        */}
        <span className="block pt-2 text-tenue">
          Desaparecen: tu perfil · tu consentimiento · tu cápsula de perfil · tus contadores
          de uso.
        </span>
        <span className="block pt-2 text-tenue">
          Tus credenciales dejan de dar acceso.
        </span>
      </DialogoDeConfirmacion>
    </div>
  );
}

/**
 * Una fila de acción con su propio banner de fallo debajo.
 *
 * El fallo se pinta AQUÍ y no arriba porque tres acciones distintas pueden fallar y el
 * mensaje tiene que quedar junto a la que falló. El caso que lo justifica es `ECU-04 FE-04`
 * (500 al eliminar): la supresión quedó PARCIAL, no se navega a ninguna parte, y el
 * reintento tiene que estar al lado de «Eliminar» — el borrado es idempotente y retoma desde
 * donde quedó (`RA-04`).
 */
function Accion({
  icono,
  titulo,
  descripcion,
  etiqueta,
  destructiva = false,
  onAccion,
  fallo,
  contexto,
  onReintentar,
}: {
  icono: ComponenteIcono;
  titulo: string;
  descripcion: string;
  etiqueta: string;
  destructiva?: boolean;
  onAccion: () => void;
  fallo: Fallo | null;
  contexto: ContextoDeCopia;
  onReintentar: () => void;
}): ReactNode {
  const copia = fallo ? copiaDeFallo(fallo, contexto) : null;

  return (
    <div
      className={cnFila(destructiva)}
      // Se tiñe solo el borde, no la fila entera: DIS-01 §2.5 reserva `destructivo` al
      // «mínimo imprescindible», y los cuatro tonos que el mockup usa aquí no son tokens.
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icono
            icono={icono}
            size={20}
            className={destructiva ? "mt-0.5 shrink-0 text-destructivo" : "mt-0.5 shrink-0 text-suave"}
          />
          <div className="flex flex-col gap-1">
            <h2
              className={
                destructiva ? "font-medium text-destructivo" : "font-medium text-texto"
              }
            >
              {titulo}
            </h2>
            <p className="max-w-lectura text-caption text-suave">{descripcion}</p>
          </div>
        </div>
        <Button
          variant={destructiva ? "destructive" : "outline"}
          onClick={onAccion}
          className="h-11 shrink-0 px-4 text-cuerpo"
        >
          {etiqueta}
        </Button>
      </div>

      {copia ? (
        <BannerInformativo tipo="aviso" className="mt-4">
          <p className="font-medium">{copia.titulo}</p>
          {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
          {copia.accion.tipo === "reintentar" ? (
            <Button
              variant="outline"
              onClick={onReintentar}
              className="mt-3 h-11 px-4 text-cuerpo"
            >
              {copia.accion.etiqueta}
            </Button>
          ) : null}
        </BannerInformativo>
      ) : null}
    </div>
  );
}

function cnFila(destructiva: boolean): string {
  return destructiva
    ? "rounded-tarjeta border border-destructivo/30 bg-superficie p-5"
    : "rounded-tarjeta border border-borde bg-superficie p-5";
}
