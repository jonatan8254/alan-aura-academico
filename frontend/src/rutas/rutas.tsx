import { Route, Routes } from "react-router";

import {
  LayoutAdmin,
  LayoutAdminPublico,
  LayoutDeSesion,
  LayoutPublico,
} from "@/layouts/Layouts";
import { LayoutDeOnboarding } from "@/layouts/LayoutDeOnboarding";
import { IniciarSesion } from "@/pantallas/acceso/IniciarSesion";
import { Presentacion } from "@/pantallas/acceso/Presentacion";
import { Registro } from "@/pantallas/acceso/Registro";
import { Directorio } from "@/pantallas/admin/Directorio";
import { Disponibilidad } from "@/pantallas/admin/Disponibilidad";
import { IniciarSesionAdmin } from "@/pantallas/admin/IniciarSesionAdmin";
import { Metricas } from "@/pantallas/admin/Metricas";
import { Chat } from "@/pantallas/chat/Chat";
import { GestionDeCuenta } from "@/pantallas/cuenta/GestionDeCuenta";
import { NotFound } from "@/pantallas/NotFound";
import { Caracterizacion } from "@/pantallas/onboarding/Caracterizacion";
import { Consentimiento } from "@/pantallas/onboarding/Consentimiento";
import { Disclosure } from "@/pantallas/onboarding/Disclosure";
import { Edad } from "@/pantallas/onboarding/Edad";
import { ElegirPersonaje } from "@/pantallas/onboarding/ElegirPersonaje";
import { NoDisponible } from "@/pantallas/onboarding/NoDisponible";
import { RequiereAdmin, RequiereOnboarding, RequiereSesion, SoloInvitados } from "@/sesion/guardias";

/**
 * rutas.tsx — las 15 rutas nombradas del inventario de DIS-00 §2 (con el `/onboarding/`
 * único de DIS-00 desplegado en 6 sub-rutas: decisión de ruteo del frontend) más un
 * catch-all `*` que DIS-00 no lista pero ninguna app enrutada puede permitirse omitir.
 *
 * FASE 3 — las pantallas dejan de ser stubs y el ruteo gana LAYOUT ROUTES: el encabezado,
 * el centrado y el control de cierre de sesión son ahora del layout y no de cada pantalla.
 * La guarda pasa al elemento del layout, que es equivalente (las guardas devuelven
 * `children` o un `<Navigate>`, y el layout renderiza un `<Outlet/>`) y deja de repetirse.
 *
 * Reglas de composición que hay que conservar al tocar este archivo:
 *
 *  - `RequiereSesion` SIEMPRE por fuera de `RequiereOnboarding`. Preguntar por el onboarding
 *    de alguien sin sesión no significa nada, y al revés un visitante que pida `/chat/`
 *    aterrizaría en `/onboarding/` en vez de en `/login/`.
 *  - `RequiereOnboarding` envuelve SOLO a `/chat/`, no al layout. `/cuenta/` comparte layout
 *    y no debe exigirlo: tras un CU-11 la persona se queda sin cápsula y aun así tiene que
 *    poder llegar a P-13 (`ECU-04`/`ECU-12` no piden onboarding completo).
 *  - `/onboarding/no-disponible` vive FUERA del layout de onboarding Y de `RequiereSesion`,
 *    a propósito: `ECU-05 FE-01` cierra la sesión ANTES de llegar ahí, así que quien la ve
 *    nunca tiene sesión, no tiene borrador y no tiene barra de pasos que mostrar.
 *  - P-04 va aparte de los otros tres accesos públicos: es `SoloInvitados` igual, pero con
 *    el cromo de administración (`RN-03.7`, `DIS-00 §3`).
 */
export function Rutas() {
  return (
    <Routes>
      {/* Visitante — P-01, P-02, P-03 */}
      <Route
        element={
          <SoloInvitados>
            <LayoutPublico />
          </SoloInvitados>
        }
      >
        <Route path="/" element={<Presentacion />} />
        <Route path="/registro/" element={<Registro />} />
        <Route path="/login/" element={<IniciarSesion />} />
      </Route>

      {/* P-04 — acceso administrativo separado */}
      <Route
        element={
          <SoloInvitados>
            <LayoutAdminPublico />
          </SoloInvitados>
        }
      >
        <Route path="/plataforma-admin/login/" element={<IniciarSesionAdmin />} />
      </Route>

      {/* Onboarding — P-05..P-09 (CU-05 + CU-14) */}
      <Route
        element={
          <RequiereSesion>
            <LayoutDeOnboarding />
          </RequiereSesion>
        }
      >
        <Route path="/onboarding/" element={<Disclosure />} />
        <Route path="/onboarding/edad" element={<Edad />} />
        <Route path="/onboarding/consentimiento" element={<Consentimiento />} />
        <Route path="/onboarding/caracterizacion" element={<Caracterizacion />} />
        <Route path="/onboarding/personaje" element={<ElegirPersonaje />} />
      </Route>

      {/* ECU-05 FE-01 — sin sesión, sin layout, sin barra de pasos */}
      <Route path="/onboarding/no-disponible" element={<NoDisponible />} />

      {/*
        P-10/P-11/P-12 — el chat monta su PROPIO encabezado y no entra en `LayoutDeSesion`.
        Dos razones: el mockup p10 no enseña la marca de la app sino el acompañante con su
        disclosure persistente (`C-1`), y el chat necesita gobernar el alto de la ventana
        para anclar el compositor abajo, cosa que `Pagina` no hace.
      */}
      <Route
        path="/chat/"
        element={
          <RequiereSesion>
            <RequiereOnboarding>
              <Chat />
            </RequiereOnboarding>
          </RequiereSesion>
        }
      />

      {/* P-13 — sí usa el layout de sesión. NO exige onboarding completo: tras un CU-11 la
          persona se queda sin cápsula y aun así tiene que poder llegar aquí. */}
      <Route
        element={
          <RequiereSesion>
            <LayoutDeSesion />
          </RequiereSesion>
        }
      >
        <Route path="/cuenta/" element={<GestionDeCuenta />} />
      </Route>

      {/* Administración — P-14, P-15, P-16 */}
      <Route
        element={
          <RequiereAdmin>
            <LayoutAdmin />
          </RequiereAdmin>
        }
      >
        <Route path="/plataforma-admin/" element={<Directorio />} />
        <Route path="/plataforma-admin/metricas/" element={<Metricas />} />
        <Route path="/plataforma-admin/disponibilidad/" element={<Disponibilidad />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
