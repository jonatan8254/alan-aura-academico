import { Outlet, useLocation } from "react-router";

import {
  EncabezadoAdmin,
  EncabezadoDeSesion,
  EncabezadoPublico,
} from "@/componentes/Encabezado";
import { useSesion } from "@/sesion/SesionProvider";

import { BotonDeCerrarSesion } from "./BotonDeCerrarSesion";
import { NavAdmin } from "./NavAdmin";
import { Pagina, type AnchoDePagina } from "./Pagina";

/**
 * Layouts.tsx — un layout por contexto de actor, montados como layout routes en rutas.tsx.
 *
 * Se hace aquí y no importando el encabezado desde cada pantalla por tres razones concretas:
 * el `omitir` del encabezado público depende de la ruta actual (y calcularlo en cada
 * pantalla es repetir la misma condición cinco veces), la guarda de administración se
 * repetiría en sus tres rutas, y el botón de cerrar sesión —que `ECU-03 RA-01` ancla en dos
 * pantallas de dos grupos distintos— tiene que aparecer de forma consistente o no aparecer.
 * Con layout routes hay un sitio por grupo; con imports hay dieciséis y ninguna garantía.
 *
 * El onboarding tiene su propio layout (`LayoutDeOnboarding`) y NO usa ninguno de estos:
 * el público le ofrecería «Registrarse» a alguien ya autenticado, el de sesión metería el
 * avatar del alias en mitad de un flujo de consentimiento, y los mockups P-05…P-09 no
 * dibujan barra superior — solo el contador de pasos.
 */

/** P-01, P-02, P-03. El enlace a la pantalla en la que ya estás se esconde solo. */
export function LayoutPublico() {
  const { pathname } = useLocation();
  const omitir =
    pathname.startsWith("/registro") ? "registro" : pathname.startsWith("/login") ? "login" : undefined;

  return (
    <>
      <EncabezadoPublico omitir={omitir} />
      <Pagina ancho={pathname === "/" ? "panel" : "formulario"}>
        <Outlet />
      </Pagina>
    </>
  );
}

/**
 * P-13 y (con su propio contenedor) P-10. El chat no usa el `Pagina` de aquí porque necesita
 * ocupar el alto de la ventana para anclar el compositor abajo; por eso `ancho` es
 * configurable y el chat monta su propio contenedor bajo el mismo encabezado.
 */
export function LayoutDeSesion({ ancho = "panel" }: { ancho?: AnchoDePagina }) {
  const { sesion } = useSesion();

  return (
    <>
      <EncabezadoDeSesion alias={sesion?.alias ?? ""} derecha={<BotonDeCerrarSesion />} />
      <Pagina ancho={ancho}>
        <Outlet />
      </Pagina>
    </>
  );
}

/**
 * P-14, P-15, P-16. `bg-admin-pagina` en el contenedor exterior porque `base.css` pinta el
 * body con `bg-pagina` y la administración usa su propio neutro (DIS-01 §2.3).
 *
 * El administrador vuelve a `/plataforma-admin/login/`, no a `/login/`. La lectura literal
 * de `ECU-03 RA-01` («retorno a P-03») lo mandaría a la puerta de usuario, donde
 * `SoloInvitados` lo rebotaría; se diverge a propósito, y `RN-03.7` respalda que cada rol
 * tenga su acceso separado.
 */
export function LayoutAdmin() {
  return (
    <div className="min-h-dvh bg-admin-pagina">
      <EncabezadoAdmin
        derecha={<BotonDeCerrarSesion destino="/plataforma-admin/login/" />}
      />
      <NavAdmin />
      <Pagina ancho="panel">
        <Outlet />
      </Pagina>
    </div>
  );
}

/** P-04: es `SoloInvitados` como el resto del acceso, pero con el cromo de administración. */
export function LayoutAdminPublico() {
  return (
    <div className="min-h-dvh bg-admin-pagina">
      <EncabezadoAdmin />
      <Pagina ancho="formulario">
        <Outlet />
      </Pagina>
    </div>
  );
}
