import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MAX_MENSAJES_POR_SESION } from "@/dominio/limites";
import { espiarFetch, PISTA_USUARIO, renderConSesion, type Llamada } from "@/pruebas/dobles";

import { Chat } from "./Chat";

/**
 * El chat — los desenlaces que no se pueden provocar contra el backend real sin esperar o
 * romper algo, y que por eso solo se verifican aquí.
 *
 * `safety_fallback` es el más importante: llega con HTTP 200, así que un frontend que
 * decidiera por status lo pintaría como una respuesta normal del personaje. La consecuencia
 * de equivocarse no es cosmética — sería seguir la conversación ordinaria después de que el
 * gate de seguridad la haya cortado.
 */

const PISTA = { ...PISTA_USUARIO, character: "aura" as const };
const RUTA_CHAT = /\/api\/v1\/chat$/;

async function escribirYEnviar(texto: string) {
  const compositor = screen.getByRole("textbox");
  await userEvent.type(compositor, texto);
  await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
}

const cuerpos = (llamadas: readonly Llamada[]) =>
  llamadas.filter((l) => l.url.endsWith("/chat")).map((l) => l.cuerpo as Record<string, unknown>);

describe("chat · el turno ordinario", () => {
  it("manda `history: []` en el primer turno y pinta la respuesta", async () => {
    // Omitir `history` o mandar null es un 400 del handler: siempre tiene que ir el array.
    const llamadas = espiarFetch([
      { ruta: RUTA_CHAT, estado: 200, cuerpo: { respuesta: "Te escucho.", modo: "ordinario" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() => expect(screen.queryByText("Te escucho.")).not.toBeNull());
    const [primero] = cuerpos(llamadas);
    expect(primero!.history).toEqual([]);
    expect(primero!.character).toBe("aura");
    expect(String(primero!.clientRequestId).length).toBeGreaterThan(0);
  });

  it("el historial es de 4 ELEMENTOS como máximo, el más reciente al final", async () => {
    // El handler responde 400 a `history.length > 4`, así que interpretar «4 intercambios»
    // como 4 pares (= 8 elementos) sería un 400 garantizado en el quinto turno.
    const llamadas = espiarFetch([
      { ruta: RUTA_CHAT, estado: 200, cuerpo: { respuesta: "ok", modo: "ordinario" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    for (const mensaje of ["uno", "dos", "tres"]) {
      await escribirYEnviar(mensaje);
      await waitFor(() => expect(screen.getAllByText("ok").length).toBeGreaterThan(0));
    }

    const ultimo = cuerpos(llamadas).at(-1)!;
    const historial = ultimo.history as { rol: string; texto: string }[];
    expect(historial.length).toBeLessThanOrEqual(4);
    expect(historial.at(-1)!.texto).toBe("ok");
  });

  it("normaliza el Markdown que el modelo a veces devuelve", async () => {
    // Verificado contra Groq real: Alan emite `**negrita**`. Las burbujas pintan texto plano.
    espiarFetch([
      {
        ruta: RUTA_CHAT,
        estado: 200,
        cuerpo: { respuesta: "Prueba esto: **respira hondo** tres veces.", modo: "ordinario" },
      },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() =>
      expect(screen.queryByText("Prueba esto: respira hondo tres veces.")).not.toBeNull(),
    );
  });
});

describe("chat · contención (ECU-06 FE-08 / CU-07)", () => {
  it("un 200 con `safety_fallback` corta la conversación y suprime el compositor", async () => {
    espiarFetch([
      {
        ruta: RUTA_CHAT,
        estado: 200,
        cuerpo: { respuesta: "No puedo atender una emergencia.", modo: "safety_fallback" },
      },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("un mensaje cualquiera");

    await waitFor(() =>
      expect(screen.queryByText("Lo más importante ahora es tu seguridad")).not.toBeNull(),
    );
    // FA-02: con el chat suspendido no puede salir otra petición. Se cumple por
    // construcción, deshabilitando el compositor, no interceptando el envío.
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(true);
    expect(screen.queryByRole("button", { name: "Iniciar una nueva sesión" })).not.toBeNull();
    // C-10: la personalidad ordinaria queda suspendida — nada de cambiar de acompañante.
    expect(screen.queryByRole("button", { name: /cambiar acompañante/i })).toBeNull();
  });
});

describe("chat · los desenlaces no felices (RF-26)", () => {
  it("un 502 reintenta UNA vez solo (FE-06)", async () => {
    const llamadas = espiarFetch([
      { ruta: RUTA_CHAT, estado: 502, cuerpo: { error: "el proveedor no está disponible" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() => expect(cuerpos(llamadas)).toHaveLength(2));
    // El reintento es el MISMO turno: mismo clientRequestId y mismo historial.
    const [primera, segunda] = cuerpos(llamadas);
    expect(segunda!.clientRequestId).toBe(primera!.clientRequestId);
    // Y no hay un tercero automático: a partir de aquí decide la persona.
    await new Promise((r) => setTimeout(r, 50));
    expect(cuerpos(llamadas)).toHaveLength(2);
  });

  it("un 504 NO reintenta solo (FE-07) y deja el turno disponible", async () => {
    // Reintentar solo duplicaría la espera de 20s que RN-02.9 acota.
    const llamadas = espiarFetch([
      { ruta: RUTA_CHAT, estado: 504, cuerpo: { error: "el proveedor no respondió a tiempo" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() => expect(screen.queryByText(/tardó en responder/i)).not.toBeNull());
    expect(cuerpos(llamadas)).toHaveLength(1);
    // FE-07 dice «vuelve al paso 2»: el compositor sigue habilitado.
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(false);
  });

  it("un 409 deja el chat en mantenimiento, con reintento", async () => {
    espiarFetch([
      { ruta: RUTA_CHAT, estado: 409, cuerpo: { error: "el chat está temporalmente deshabilitado" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() => expect(screen.queryByText(/pausa por mantenimiento/i)).not.toBeNull());
    expect(screen.queryByRole("button", { name: "Reintentar" })).not.toBeNull();
  });

  it("el 403 de consentimiento manda al onboarding; el de rol, no", async () => {
    espiarFetch([
      { ruta: RUTA_CHAT, estado: 403, cuerpo: { error: "consentimiento base no otorgado" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() =>
      expect(screen.getByTestId("ruta-actual").textContent).toContain("/onboarding/"),
    );
  });

  it("el 403 de rol termina, sin reintento y sin redirigir", async () => {
    espiarFetch([{ ruta: RUTA_CHAT, estado: 403, cuerpo: { error: "rol no autorizado" } }]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    await escribirYEnviar("hola");

    await waitFor(() => expect(screen.queryByText(/no tiene acceso al chat/i)).not.toBeNull());
    expect(screen.getByTestId("ruta-actual").textContent).toBe("/chat/");
    expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
  });

  it("un mensaje de más de 2.500 caracteres no llega a salir", async () => {
    const llamadas = espiarFetch([]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    const compositor = screen.getByRole("textbox") as HTMLTextAreaElement;
    // `maxLength` del compositor: el navegador corta la entrada, no se trunca lo escrito.
    expect(compositor.maxLength).toBe(2500);
    expect(llamadas).toHaveLength(0);
  });
});

describe("chat · límite de sesión (RF-25 / FA-01)", () => {
  it("al llegar a 20 turnos finaliza de forma controlada, sin banner de error", async () => {
    espiarFetch([
      { ruta: RUTA_CHAT, estado: 200, cuerpo: { respuesta: "ok", modo: "ordinario" } },
    ]);
    renderConSesion(<Chat />, { rutaInicial: "/chat/", pista: PISTA });

    for (let i = 0; i < MAX_MENSAJES_POR_SESION; i++) {
      await escribirYEnviar(`turno ${i}`);
      await waitFor(() => expect(screen.getAllByText("ok").length).toBe(i + 1));
    }

    await waitFor(() =>
      expect(screen.queryByText(/llegaste al final de esta sesión/i)).not.toBeNull(),
    );
    // Es un estado de P-10, no un error de P-11 (corrección PDR-01 D-13).
    expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Nueva sesión" })).not.toBeNull();
  }, 30_000);
});
