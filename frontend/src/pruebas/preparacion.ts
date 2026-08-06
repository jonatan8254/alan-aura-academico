import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

/**
 * preparacion.ts — el `setupFiles` de Vitest.
 *
 * Cubre los huecos concretos de jsdom que ESTE stack pisa. No es una lista genérica copiada
 * de internet: cada stub está aquí porque algo del producto lo llama y jsdom no lo trae.
 *
 * No se usa `@testing-library/jest-dom`. Las aserciones van con `expect(...).not.toBeNull()`
 * y compañía, que son un poco más ruidosas pero evitan añadir una dependencia —y con ella un
 * cambio de `package-lock.json`— a una rama que el equipo comparte.
 */

beforeEach(() => {
  // `pista.ts` y `borrador.ts` viven aquí: sin limpiar, un test contamina al siguiente.
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// Chat.tsx hace autoscroll al último turno.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

// Base UI (los diálogos de P-13, P-16 y el selector de personaje del chat) llama a la API de
// captura de puntero, que jsdom no implementa.
for (const metodo of ["hasPointerCapture", "setPointerCapture", "releasePointerCapture"] as const) {
  if (!(metodo in HTMLElement.prototype)) {
    Object.defineProperty(HTMLElement.prototype, metodo, {
      value: () => false,
      writable: true,
    });
  }
}

if (!("ResizeObserver" in globalThis)) {
  Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (consulta: string) => ({
      matches: false,
      media: consulta,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Chat.tsx genera `clientRequestId` y los ids de turno con esto.
if (!globalThis.crypto?.randomUUID) {
  let contador = 0;
  Object.defineProperty(globalThis, "crypto", {
    writable: true,
    value: {
      ...globalThis.crypto,
      randomUUID: () => `id-de-prueba-${++contador}`,
    },
  });
}
