import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { leerBorrador } from "@/onboarding/borrador";
import { espiarFetch, PISTA_USUARIO, renderConSesion } from "@/pruebas/dobles";
import { leerPista } from "@/sesion/pista";

import { Edad } from "./Edad";

/**
 * El gate de edad — `ECU-05 FE-01` y `RF-02`.
 *
 * Lo que esta suite protege es una invariante fácil de romper sin darse cuenta: responder
 * «No» NO PUEDE llamar a `POST /onboarding` bajo ninguna circunstancia. `OnboardingRequest`
 * declara `esAdulto: true` como literal precisamente porque el `false` no tiene a dónde ir;
 * si alguien «unificara» el flujo mandando `esAdulto: false`, el tipo se lo impediría, pero
 * si lo hiciera con un `as`, esto lo cazaría.
 *
 * Y protege el fail-closed: el bloqueo se completa igual aunque el logout falle. `FE-01` dice
 * que «el Sistema cierra la sesión sin esperar acción del Usuario», así que no puede quedar
 * colgando de que la red funcione.
 */

const pista = { ...PISTA_USUARIO, onboardingCompleto: false };
const ruta = () => screen.getByTestId("ruta-actual").textContent;

describe("P-06 · declaración de edad", () => {
  it("«No» cierra sesión, no toca /onboarding y lleva a la pantalla de bloqueo", async () => {
    const llamadas = espiarFetch([
      { ruta: /\/auth\/logout$/, estado: 200, cuerpo: { estado: "sesion_cerrada" } },
    ]);
    renderConSesion(<Edad />, { rutaInicial: "/onboarding/edad", pista });

    await userEvent.click(screen.getByRole("button", { name: /^No$/ }));

    await waitFor(() => expect(ruta()).toBe("/onboarding/no-disponible"));
    expect(llamadas.map((l) => l.url)).toEqual(["/api/v1/auth/logout"]);
    expect(llamadas.some((l) => l.url.includes("/onboarding"))).toBe(false);
    expect(leerPista()).toBeNull();
    expect(sessionStorage.getItem("borrador-onboarding")).toBeNull();
  });

  it("«No» completa el bloqueo aunque el logout responda 401", async () => {
    // Un 401 aquí significa que la sesión ya no existía: el estado deseado ya se cumple.
    // Depende de que /auth/logout esté fuera de la redirección global del 401 en cliente.ts;
    // si volviera a entrar, esta prueba aterrizaría en /login/?motivo=sesion_expirada.
    espiarFetch([{ ruta: /\/auth\/logout$/, estado: 401, cuerpo: { error: "sesión ausente" } }]);
    renderConSesion(<Edad />, { rutaInicial: "/onboarding/edad", pista });

    await userEvent.click(screen.getByRole("button", { name: /^No$/ }));

    await waitFor(() => expect(ruta()).toBe("/onboarding/no-disponible"));
    expect(leerPista()).toBeNull();
  });

  it("«No» completa el bloqueo aunque la red esté caída", async () => {
    espiarFetch([{ ruta: /\/auth\/logout$/, estado: 0, rechaza: true }]);
    renderConSesion(<Edad />, { rutaInicial: "/onboarding/edad", pista });

    await userEvent.click(screen.getByRole("button", { name: /^No$/ }));

    await waitFor(() => expect(ruta()).toBe("/onboarding/no-disponible"));
    expect(leerPista()).toBeNull();
  });

  it("«Sí» no llama a nada y avanza al consentimiento", async () => {
    const llamadas = espiarFetch([]);
    renderConSesion(<Edad />, { rutaInicial: "/onboarding/edad", pista });

    await userEvent.click(screen.getByRole("button", { name: /mayor de 18/i }));

    await waitFor(() => expect(ruta()).toBe("/onboarding/consentimiento"));
    expect(llamadas).toHaveLength(0);
    expect(leerBorrador().esAdulto).toBe(true);
  });
});
