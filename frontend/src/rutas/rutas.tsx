import { Route, Routes } from "react-router";

import { RequiereAdmin, RequiereOnboarding, RequiereSesion, SoloInvitados } from "@/sesion/guardias";
import { IniciarSesionAdmin } from "@/pantallas/admin/IniciarSesionAdmin";
import { Directorio } from "@/pantallas/admin/Directorio";
import { Metricas } from "@/pantallas/admin/Metricas";
import { Disponibilidad } from "@/pantallas/admin/Disponibilidad";
import { Presentacion } from "@/pantallas/acceso/Presentacion";
import { Registro } from "@/pantallas/acceso/Registro";
import { IniciarSesion } from "@/pantallas/acceso/IniciarSesion";
import { Disclosure } from "@/pantallas/onboarding/Disclosure";
import { Edad } from "@/pantallas/onboarding/Edad";
import { Consentimiento } from "@/pantallas/onboarding/Consentimiento";
import { Caracterizacion } from "@/pantallas/onboarding/Caracterizacion";
import { ElegirPersonaje } from "@/pantallas/onboarding/ElegirPersonaje";
import { NoDisponible } from "@/pantallas/onboarding/NoDisponible";
import { Chat } from "@/pantallas/chat/Chat";
import { GestionDeCuenta } from "@/pantallas/cuenta/GestionDeCuenta";
import { NotFound } from "@/pantallas/NotFound";

/**
 * rutas.tsx — las 15 rutas nombradas del inventario de Fase 0b (DIS-00 §2, con el onboarding
 * de una sola pantalla `/onboarding/` desplegado en 6 sub-rutas: es una decisión de ruteo del
 * frontend, DIS-00 en cambio agrupa las 5 pasos de CU-05/CU-14 bajo un único `/onboarding/`)
 * más un catch-all `*` que DIS-00 no lista (ninguna app enrutada con react-router puede
 * quedarse sin uno — sin él, una URL mal escrita deja una pantalla en blanco). 15 + 1 = 16;
 * el enunciado de esta fase hablaba de "17 rutas" pero el propio array de ejemplo que
 * detallaba solo enumeraba 15 — ver el reporte final de esta fase para el detalle.
 *
 * Cada pantalla es un stub (Fase 0b no implementa comportamiento de pantalla, solo el
 * armazón de ruteo + guardas). El ORDEN de composición de guardas importa:
 * RequiereSesion SIEMPRE por fuera de RequiereOnboarding (no tiene sentido preguntar por el
 * onboarding de alguien sin sesión) y NoDisponible vive FUERA de RequiereSesion a propósito
 * (ver su propio comentario de cabecera — FE-01 de ECU-05 nunca tiene sesión).
 */
export function Rutas() {
  return (
    <Routes>
      {/* Visitante puro — P-01..P-04 */}
      <Route
        path="/"
        element={
          <SoloInvitados>
            <Presentacion />
          </SoloInvitados>
        }
      />
      <Route
        path="/registro/"
        element={
          <SoloInvitados>
            <Registro />
          </SoloInvitados>
        }
      />
      <Route
        path="/login/"
        element={
          <SoloInvitados>
            <IniciarSesion />
          </SoloInvitados>
        }
      />
      <Route
        path="/plataforma-admin/login/"
        element={
          <SoloInvitados>
            <IniciarSesionAdmin />
          </SoloInvitados>
        }
      />

      {/* Onboarding — P-05..P-09, RequiereSesion (CU-05/CU-14) */}
      <Route
        path="/onboarding/"
        element={
          <RequiereSesion>
            <Disclosure />
          </RequiereSesion>
        }
      />
      <Route
        path="/onboarding/edad"
        element={
          <RequiereSesion>
            <Edad />
          </RequiereSesion>
        }
      />
      <Route
        path="/onboarding/consentimiento"
        element={
          <RequiereSesion>
            <Consentimiento />
          </RequiereSesion>
        }
      />
      <Route
        path="/onboarding/caracterizacion"
        element={
          <RequiereSesion>
            <Caracterizacion />
          </RequiereSesion>
        }
      />
      <Route
        path="/onboarding/personaje"
        element={
          <RequiereSesion>
            <ElegirPersonaje />
          </RequiereSesion>
        }
      />
      {/* FE-01 (menor de edad): SIN RequiereSesion — ver pantallas/onboarding/NoDisponible.tsx */}
      <Route path="/onboarding/no-disponible" element={<NoDisponible />} />

      {/* Chat — P-10/P-11/P-12, RequiereSesion + RequiereOnboarding */}
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

      {/* Cuenta — P-13, RequiereSesion */}
      <Route
        path="/cuenta/"
        element={
          <RequiereSesion>
            <GestionDeCuenta />
          </RequiereSesion>
        }
      />

      {/* Admin — P-14..P-16, RequiereAdmin */}
      <Route
        path="/plataforma-admin/"
        element={
          <RequiereAdmin>
            <Directorio />
          </RequiereAdmin>
        }
      />
      <Route
        path="/plataforma-admin/metricas/"
        element={
          <RequiereAdmin>
            <Metricas />
          </RequiereAdmin>
        }
      />
      <Route
        path="/plataforma-admin/disponibilidad/"
        element={
          <RequiereAdmin>
            <Disponibilidad />
          </RequiereAdmin>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
