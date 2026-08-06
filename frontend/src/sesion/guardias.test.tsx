import { Route } from "react-router";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PISTA_ADMIN, PISTA_USUARIO, renderConRutas } from "@/pruebas/dobles";

import { RequiereAdmin, RequiereOnboarding, RequiereSesion, SoloInvitados } from "./guardias";

/**
 * Las cuatro guardas y —lo que de verdad importa— SU COMPOSICIÓN.
 *
 * El caso que justifica esta suite es el último: un visitante sin sesión que pide `/chat/`
 * tiene que aterrizar en `/login/`, no en `/onboarding/`. Eso depende de que `RequiereSesion`
 * quede por FUERA de `RequiereOnboarding`, y es exactamente lo que se rompería si alguien
 * invirtiera el anidamiento al reorganizar el ruteo — con un typecheck perfectamente verde.
 */

const ruta = () => screen.getByTestId("ruta-actual").textContent;

const ARBOL = (
  <>
    <Route
      path="/"
      element={
        <SoloInvitados>
          <span>landing</span>
        </SoloInvitados>
      }
    />
    <Route path="/login/" element={<span>login</span>} />
    <Route path="/plataforma-admin/login/" element={<span>login admin</span>} />
    <Route path="/onboarding/" element={<span>onboarding</span>} />
    <Route
      path="/chat/"
      element={
        <RequiereSesion>
          <RequiereOnboarding>
            <span>chat</span>
          </RequiereOnboarding>
        </RequiereSesion>
      }
    />
    <Route
      path="/plataforma-admin/"
      element={
        <RequiereAdmin>
          <span>panel</span>
        </RequiereAdmin>
      }
    />
  </>
);

describe("guardias de ruta", () => {
  it("SoloInvitados manda al usuario con sesión a su chat", () => {
    renderConRutas(ARBOL, { rutaInicial: "/", pista: PISTA_USUARIO });
    expect(ruta()).toBe("/chat/");
  });

  it("SoloInvitados manda al administrador a su panel, no al chat", () => {
    renderConRutas(ARBOL, { rutaInicial: "/", pista: PISTA_ADMIN });
    expect(ruta()).toBe("/plataforma-admin/");
  });

  it("SoloInvitados deja pasar a quien no tiene sesión", () => {
    renderConRutas(ARBOL, { rutaInicial: "/", pista: null });
    expect(screen.queryByText("landing")).not.toBeNull();
  });

  it("RequiereSesion manda al login con su motivo", () => {
    renderConRutas(ARBOL, { rutaInicial: "/chat/", pista: null });
    expect(ruta()).toBe("/login/?motivo=sesion_requerida");
  });

  it("RequiereOnboarding manda al asistente si falta la cápsula", () => {
    renderConRutas(ARBOL, {
      rutaInicial: "/chat/",
      pista: { ...PISTA_USUARIO, onboardingCompleto: false },
    });
    expect(ruta()).toBe("/onboarding/?motivo=requerido");
  });

  it("RequiereAdmin manda al login administrativo, sin revelar que la ruta existe", () => {
    // RN-03.7: un usuario ordinario no debe poder distinguir «no tengo permiso» de «esa
    // ruta no existe».
    renderConRutas(ARBOL, { rutaInicial: "/plataforma-admin/", pista: PISTA_USUARIO });
    expect(ruta()).toBe("/plataforma-admin/login/");
  });

  it("EL ORDEN: sin sesión, /chat/ aterriza en el login y NO en el onboarding", () => {
    // Si alguien invirtiera el anidamiento (RequiereOnboarding por fuera), esta ruta
    // acabaría en /onboarding/?motivo=requerido: se le pediría el onboarding a alguien que
    // ni siquiera ha entrado.
    renderConRutas(ARBOL, { rutaInicial: "/chat/", pista: null });
    expect(ruta()).not.toContain("/onboarding/");
    expect(ruta()).toContain("/login/");
  });
});
