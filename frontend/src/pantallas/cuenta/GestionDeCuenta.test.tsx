import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { espiarFetch, PISTA_USUARIO, renderConSesion } from "@/pruebas/dobles";
import { leerPista } from "@/sesion/pista";

import { GestionDeCuenta } from "./GestionDeCuenta";

/**
 * P-13 — que nada irreversible ocurra sin confirmación explícita.
 *
 * Es la suite que evita la peor regresión posible del producto: que un clic en «Eliminar»
 * borre la cuenta sin diálogo. `ECU-04 §11` paso 2 y `ECU-11 RE-01` lo exigen, y el contrato
 * lo respalda con `confirmacion: true` — pero el campo del cable no impide que la pantalla lo
 * mande sola.
 *
 * También fija la corrección `PDR-01 D-02`: el diálogo de reiniciar tiene que ADVERTIR. El
 * mockup dice «puedes rehacerlo cuando quieras», que es lo contrario de una advertencia, y
 * es exactamente el texto que alguien podría reintroducir copiándolo.
 */

const ruta = () => screen.getByTestId("ruta-actual").textContent;
const dialogo = () => screen.getByRole("dialog");

describe("P-13 · gestión de cuenta", () => {
  it("ninguna de las tres acciones dispara petición sin confirmar", async () => {
    const llamadas = espiarFetch([]);
    renderConSesion(<GestionDeCuenta />, { rutaInicial: "/cuenta/", pista: PISTA_USUARIO });

    for (const etiqueta of ["Reiniciar", "Revocar", "Eliminar"]) {
      await userEvent.click(screen.getByRole("button", { name: etiqueta }));
      expect(llamadas, `«${etiqueta}» no debe llamar al servidor`).toHaveLength(0);
      await userEvent.click(within(dialogo()).getByRole("button", { name: "Cancelar" }));
    }
    expect(llamadas).toHaveLength(0);
  });

  it("confirmar eliminar dispara exactamente una petición y sale a la landing", async () => {
    const llamadas = espiarFetch([
      {
        ruta: /\/cuenta\/eliminar$/,
        estado: 200,
        cuerpo: {
          alcance: {
            registrosQueDesapareceran: ["perfil"],
            esIrreversible: true,
            dejaraSinAccesoAlChat: true,
          },
        },
      },
    ]);
    renderConSesion(<GestionDeCuenta />, { rutaInicial: "/cuenta/", pista: PISTA_USUARIO });

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    await userEvent.click(within(dialogo()).getByRole("button", { name: "Sí, eliminar" }));

    await waitFor(() => expect(ruta()).toBe("/?motivo=cuenta_eliminada"));
    expect(llamadas).toHaveLength(1);
    expect(llamadas[0]!.cuerpo).toEqual({ confirmacion: true });
    // El orden importa: si se navegara antes de limpiar, SoloInvitados rebotaría a /chat/ y
    // el aviso de ECU-04 §11 paso 4 no se vería nunca.
    expect(leerPista()).toBeNull();
  });

  it("un 500 al eliminar NO navega ni limpia la sesión, y ofrece reintento", async () => {
    // ECU-04 FE-04: la supresión queda PARCIAL y declarada. Navegar aquí dejaría a la
    // persona fuera creyendo que terminó, cuando parte de sus datos siguen ahí.
    espiarFetch([
      {
        ruta: /\/cuenta\/eliminar$/,
        estado: 500,
        cuerpo: { error: "no pudimos terminar de eliminar tu cuenta" },
      },
    ]);
    renderConSesion(<GestionDeCuenta />, { rutaInicial: "/cuenta/", pista: PISTA_USUARIO });

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    await userEvent.click(within(dialogo()).getByRole("button", { name: "Sí, eliminar" }));

    await waitFor(() => expect(screen.queryByText(/parte de tus datos/i)).not.toBeNull());
    expect(ruta()).toBe("/cuenta/");
    expect(leerPista()).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Reintentar" })).not.toBeNull();
  });

  it("el diálogo de reiniciar ADVIERTE de que es irreversible (D-02)", async () => {
    espiarFetch([]);
    renderConSesion(<GestionDeCuenta />, { rutaInicial: "/cuenta/", pista: PISTA_USUARIO });

    await userEvent.click(screen.getByRole("button", { name: "Reiniciar" }));

    const texto = dialogo().textContent ?? "";
    expect(texto).toMatch(/no se puede deshacer/i);
    expect(texto).toMatch(/no podrás conversar/i);
    // El texto del mockup, que DIS-00 §3 declara falso. Si reaparece, esto lo caza.
    expect(texto).not.toMatch(/puedes rehacerlo cuando quieras/i);
  });

  it("reiniciar deja la pista sin onboarding y manda a la caracterización", async () => {
    espiarFetch([
      {
        ruta: /\/perfil\/reiniciar$/,
        estado: 200,
        cuerpo: { estado: "caracterizacion_reiniciada" },
      },
    ]);
    renderConSesion(<GestionDeCuenta />, { rutaInicial: "/cuenta/", pista: PISTA_USUARIO });

    await userEvent.click(screen.getByRole("button", { name: "Reiniciar" }));
    await userEvent.click(within(dialogo()).getByRole("button", { name: "Sí, reiniciar" }));

    await waitFor(() => expect(ruta()).toBe("/onboarding/caracterizacion"));
    // Mitigación del bug del backend: sin esto, RequiereOnboarding dejaría pasar al chat, que
    // respondería 403 con un mensaje que en ese estado es falso.
    expect(leerPista()?.onboardingCompleto).toBe(false);
  });

  it("revocar también confirma, pero sin tono destructivo (ECU-12)", async () => {
    const llamadas = espiarFetch([
      {
        ruta: /\/personalizacion\/revocar$/,
        estado: 200,
        cuerpo: { estado: "personalizacion_revocada" },
      },
    ]);
    renderConSesion(<GestionDeCuenta />, { rutaInicial: "/cuenta/", pista: PISTA_USUARIO });

    await userEvent.click(screen.getByRole("button", { name: "Revocar" }));
    const texto = dialogo().textContent ?? "";
    expect(texto).toMatch(/podrás seguir conversando/i);
    expect(texto).not.toMatch(/no se puede deshacer/i);

    await userEvent.click(within(dialogo()).getByRole("button", { name: "Sí, revocar" }));
    await waitFor(() => expect(llamadas).toHaveLength(1));
    // Asimetría deliberada del contrato: RevocarPersonalizacionRequest va vacío.
    expect(llamadas[0]!.cuerpo).toEqual({});
    // Se queda en la pantalla: revocar es la única de las tres que no expulsa.
    expect(ruta()).toBe("/cuenta/");
  });
});
