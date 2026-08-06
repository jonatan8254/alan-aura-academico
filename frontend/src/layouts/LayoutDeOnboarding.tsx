import { Navigate, Outlet, useLocation } from "react-router";

import { BarraDePasos } from "@/componentes/BarraDePasos";
import { MarcaAlanAura } from "@/componentes/MarcaAlanAura";
import { leerBorrador } from "@/onboarding/borrador";
import { pasoDe, primerPasoIncompleto, sePuedeEstarEn } from "@/onboarding/pasos";

import { BotonDeCerrarSesion } from "./BotonDeCerrarSesion";
import { Pagina } from "./Pagina";

/**
 * LayoutDeOnboarding — el marco común de P-05…P-09 y la guarda de pasos.
 *
 * NO usa ninguna de las tres variantes de `Encabezado`, a propósito: la pública le ofrecería
 * «Registrarse» a alguien ya autenticado, la de sesión metería el avatar del alias en mitad
 * de un flujo de consentimiento (ruido, contra el `E4` de DIS-01), y los mockups P-05…P-09
 * no dibujan barra superior — solo la marca y el contador de pasos.
 *
 * El botón de salir no es decorativo, es la ÚNICA puerta. Un usuario autenticado con el
 * onboarding incompleto no puede alcanzar `/`, `/login/` ni `/registro/` (`SoloInvitados` lo
 * manda a `/chat/`, y de ahí `RequiereOnboarding` lo devuelve aquí): sin este control
 * quedaría encerrado entre terminar el onboarding o cerrar la pestaña. El mockup P-05 ya lo
 * dibujaba; aquí está en los cinco pasos por eso.
 */
export function LayoutDeOnboarding() {
  const { pathname } = useLocation();
  const paso = pasoDe(pathname);
  const borrador = leerBorrador();

  // Ruta bajo /onboarding/ que no es uno de los cinco pasos: al primero pendiente.
  if (!paso) return <Navigate to={primerPasoIncompleto(borrador).ruta} replace />;
  if (!sePuedeEstarEn(paso, borrador)) {
    return <Navigate to={primerPasoIncompleto(borrador).ruta} replace />;
  }

  return (
    <>
      <div className="border-b border-borde">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <span className="inline-flex items-center gap-2">
            <MarcaAlanAura tamano="sm" />
            <span className="font-medium">Alan &amp; Aura</span>
          </span>
          <BotonDeCerrarSesion etiqueta="Salir" />
        </div>
      </div>
      <Pagina ancho="onboarding">
        <div className="flex flex-col gap-8">
          <BarraDePasos pasoActual={paso.numero} mostrarEtiqueta />
          <Outlet />
        </div>
      </Pagina>
    </>
  );
}
