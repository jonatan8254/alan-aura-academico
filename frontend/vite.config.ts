import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// `defineConfig` viene de "vitest/config" (no de "vite") para que la sección `test` de
// abajo tenga tipos — es un superconjunto tipado de la config normal de Vite, nada más.

// Backend real desplegado y verificado end-to-end (2026-08-06): las 13 rutas de
// ARQ-01-D3 contra AWS real (auth, onboarding, chat con Groq real, perfil, cuenta,
// admin). Para volver a trabajar contra el mock, cambiar a "http://localhost:4000"
// y correr "npm run mock" desde la raíz del repo.
const API_TARGET = "https://ju9xcyfczf.execute-api.us-east-1.amazonaws.com/v1";

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
    // este proxy es el equivalente para `npm run dev`.
    //
    // `changeOrigin: true`: necesario contra un host remoto real — antes era `false` porque
    // el target era `localhost:4000` (el mock), donde no hacía falta. Esto NO reabre el
    // problema de `SameSite=Strict`/ARQ-01-D1: ese flag cambia el header `Host` que Vite le
    // manda AL BACKEND puerta adentro del proxy, no el origen que ve el navegador — el
    // navegador sigue hablando solo con este dev server (mismo origen), que es lo único que
    // `SameSite=Strict` necesita. Sin `changeOrigin: true` aquí, el proxy reenviaría
    // `Host: localhost:...` a API Gateway en vez del host real, lo que puede hacer que
    // rechace o enrute mal la petición.
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
  },
});
