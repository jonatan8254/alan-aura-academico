import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { render, type RenderResult } from "@testing-library/react";
import { vi } from "vitest";

import { escribirPista, type PistaDeSesion } from "@/sesion/pista";
import { SesionProvider } from "@/sesion/SesionProvider";

/**
 * dobles.tsx — utilidades compartidas por las pruebas.
 *
 * SE MOCKEA `fetch`, NO `endpoints.ts`. La razón es concreta: la desambiguación de los dos
 * 403 del chat vive DENTRO de `cliente.ts` (leer el cuerpo del error) y de `errores.ts`
 * (propagarlo). Mockear más arriba saltaría justo el código que hay que verificar, y un test
 * verde no significaría nada. Con `fetch` mockeado, un test puede decir literalmente «el
 * backend respondió 403 con este cuerpo», que es lo que se verificó contra AWS real.
 */

export interface Llamada {
  url: string;
  metodo: string;
  cuerpo: unknown;
}

interface Respuesta {
  /** Se compara contra la ruta relativa (`/api/v1/...`). */
  ruta: RegExp;
  estado: number;
  cuerpo?: unknown;
  cabeceras?: Record<string, string>;
  /** Si se indica, `fetch` rechaza en vez de responder (simula la red caída). */
  rechaza?: boolean;
}

/**
 * Instala un `fetch` falso y devuelve el registro de llamadas, que se va llenando.
 *
 * El guion se recorre en orden y gana la primera coincidencia; una ruta sin entrada devuelve
 * 404, que es más fácil de diagnosticar en un test que un `undefined` a medio camino.
 */
export function espiarFetch(guion: readonly Respuesta[]): Llamada[] {
  const llamadas: Llamada[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, opciones?: RequestInit) => {
      const cuerpo = opciones?.body ? JSON.parse(String(opciones.body)) : undefined;
      llamadas.push({ url, metodo: opciones?.method ?? "GET", cuerpo });

      const entrada = guion.find((r) => r.ruta.test(url));
      if (!entrada) {
        return new Response(JSON.stringify({ error: `sin guion para ${url}` }), { status: 404 });
      }
      if (entrada.rechaza) throw new TypeError("Failed to fetch");

      return new Response(entrada.cuerpo === undefined ? null : JSON.stringify(entrada.cuerpo), {
        status: entrada.estado,
        headers: { "Content-Type": "application/json", ...entrada.cabeceras },
      });
    }),
  );

  return llamadas;
}

/** Deja visible la ruta actual, para poder afirmar sobre las redirecciones. */
export function RutaActual() {
  const { pathname, search } = useLocation();
  return <span data-testid="ruta-actual">{pathname + search}</span>;
}

export function renderConSesion(
  ui: ReactNode,
  { rutaInicial = "/", pista = null }: { rutaInicial?: string; pista?: PistaDeSesion | null } = {},
): RenderResult {
  // Antes de montar: `SesionProvider` lee la pista en su estado inicial.
  escribirPista(pista);
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <SesionProvider>
        <RutaActual />
        {ui}
      </SesionProvider>
    </MemoryRouter>,
  );
}

/** Igual que el anterior pero montando un árbol de rutas, para probar guardas y navegación. */
export function renderConRutas(
  rutas: ReactNode,
  { rutaInicial = "/", pista = null }: { rutaInicial?: string; pista?: PistaDeSesion | null } = {},
): RenderResult {
  escribirPista(pista);
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <SesionProvider>
        <RutaActual />
        <Routes>
          {rutas}
          <Route path="*" element={<span data-testid="sin-ruta" />} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
}

export const PISTA_USUARIO: PistaDeSesion = {
  titularId: "t-1",
  alias: "Lucía",
  rol: "usuario",
  onboardingCompleto: true,
};

export const PISTA_ADMIN: PistaDeSesion = {
  titularId: "a-1",
  alias: "Admin",
  rol: "administrador",
  onboardingCompleto: true,
};
