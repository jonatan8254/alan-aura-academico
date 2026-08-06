import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// `defineConfig` viene de "vitest/config" (no de "vite") para que la sección `test` de
// abajo tenga tipos — es un superconjunto tipado de la config normal de Vite, nada más.
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Debe coincidir exactamente con "paths" de tsconfig.json (@/* -> ./src/*).
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    // `vercel.json` (rewrite) solo aplica en despliegue — Vite no lo lee en local, así que
    // este proxy es el equivalente para `npm run dev`. Apunta al mismo mock local que
    // `npm run mock` levanta en :4000 (ver frontend/README.md).
    //
    // `changeOrigin: false` es DELIBERADO, no un descuido: preservar el mismo origen es lo
    // que permite que la cookie de sesión declare `SameSite=Strict` (ARQ-01). No "corregir"
    // a `true`.
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: false,
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
  },
});
