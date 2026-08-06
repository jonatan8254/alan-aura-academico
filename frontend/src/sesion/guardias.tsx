import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useSesion } from "./SesionProvider";

/**
 * guardias.tsx — cuatro componentes de guarda para rutas/rutas.tsx. Todos leen la PISTA de
 * sesión (sesion/pista.ts), no la sesión real — son una redirección optimista para no
 * mostrar un layout equivocado por un instante; la autorización de verdad la hace el backend
 * en cada petición (un 401/403 real todavía puede pasar aunque la guarda haya dejado pasar).
 */

/** Rutas de visitante puro (P-01/P-02/P-03/P-04): si ya hay pista de sesión, no tiene sentido
 * mostrar login/registro — se manda a la pantalla que le toca según su rol. */
export function SoloInvitados({ children }: { children: ReactNode }) {
  const { sesion } = useSesion();
  if (sesion) {
    return (
      <Navigate to={sesion.rol === "administrador" ? "/plataforma-admin/" : "/chat/"} replace />
    );
  }
  return children;
}

/** Cualquier ruta que exija estar autenticado (onboarding, chat, cuenta). */
export function RequiereSesion({ children }: { children: ReactNode }) {
  const { sesion } = useSesion();
  if (!sesion) {
    return <Navigate to="/login/?motivo=sesion_requerida" replace />;
  }
  return children;
}

/** Solo /chat/ — el onboarding (CU-05) debe estar completo antes de hablar con Alan/Aura.
 * Se compone DESPUÉS de RequiereSesion en rutas.tsx, nunca sola. */
export function RequiereOnboarding({ children }: { children: ReactNode }) {
  const { sesion } = useSesion();
  if (!sesion?.onboardingCompleto) {
    return <Navigate to="/onboarding/?motivo=requerido" replace />;
  }
  return children;
}

/** Rutas de /plataforma-admin/ (excepto su propio login). Un usuario no-admin nunca ve
 * siquiera el intento de fetch: se redirige antes al login de admin, sobrio, sin revelar
 * si la ruta existe (RN-03.7). */
export function RequiereAdmin({ children }: { children: ReactNode }) {
  const { sesion } = useSesion();
  if (sesion?.rol !== "administrador") {
    return <Navigate to="/plataforma-admin/login/" replace />;
  }
  return children;
}
