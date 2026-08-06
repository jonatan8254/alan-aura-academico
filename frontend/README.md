# frontend — arranque para desarrollo en paralelo

El scaffold real de la app (Vite + React + TypeScript + Tailwind v4 + shadcn/ui, per `ADR-002`) es
trabajo del equipo de frontend — ver `CONTINUAR_AQUI.md` para el estado exacto de esa
implementación (qué pantallas, qué componentes, qué falta). Este archivo cubre solo cómo se
conecta al backend.

## Cómo conectar con el backend

**El backend de las 13 rutas de `/api/v1` está desplegado y verificado end-to-end contra AWS real**
(2026-08-06) — `frontend/vite.config.ts` ya apunta ahí por defecto (`server.proxy`), así que
`npm run dev -w frontend` habla con el backend real sin ningún paso adicional.

Para volver a trabajar contra el mock (sin AWS, con datos de ejemplo fijos en
`backend/mock/fixtures.ts`):

```bash
npm install
npm run mock          # levanta las 13 rutas en http://localhost:4000
```

y cambiar `API_TARGET` en `frontend/vite.config.ts` a `"http://localhost:4000"` (y el
`destination` de `frontend/vercel.json` si también se prueba el *rewrite* de producción).

## Cómo consumir el contrato

Importa los tipos de request/response desde `contrato-api` (workspace `packages/contrato-api`) en
vez de declararlos de nuevo:

```ts
import type { LoginRequest, LoginResponse } from "contrato-api";
```

El contrato completo, ruta por ruta, está documentado en
`docs/10_arquitectura/CONTRATO_API_v1.md`.

## `vercel.json`

El `rewrite` de `/api/*` ya apunta al API Gateway real (mismo mecanismo que el `server.proxy` de
Vite en desarrollo, `ARQ-01-D1`), así que la app nunca necesita saber si habla con el mock o con el
backend real: siempre pide a `/api/v1/...` en el mismo origen. No hay cambios de código en el
frontend si el contrato de `contrato-api` no cambió. Tiene además un catch-all a `/index.html`
**como segunda regla, después del de `/api`** — con `BrowserRouter`, sin él un refresh en `/chat/`
daría 404 en producción; invertir el orden haría que toda llamada al backend devolviera el HTML de
la app en vez de JSON.

## Estado (2026-08-06): las 16 pantallas están implementadas

Registro, login, los 5 pasos del onboarding, el chat (conectado a Groq real), gestión de cuenta y
las 3 pantallas de administración — con sus estados no-felices (401/403/409/429/502/504,
`safety_fallback`) y 37 pruebas (`npm run test -w frontend`). Verificado en navegador contra el
backend real de punta a punta: registro → login → onboarding → conversación → eliminación de
cuenta confirmada en DynamoDB. `frontend/src/copia/fallos.ts` es el único sitio donde un `Fallo` se
vuelve texto — no repetir esa lógica en una pantalla nueva.

**`CONTINUAR_AQUI.md` quedó desactualizado por esta corrida**: sigue describiendo las 16 pantallas
como stubs de Fase 0b. Es el documento del equipo de frontend, no se toca desde aquí — pero quien
lo lea debe saber que el estado real es este README, no ese archivo.

### Decisiones cerradas (no reabrir sin que el usuario lo pida)

- **Sin modo oscuro.** No es deuda pendiente: es una decisión tomada el 2026-08-06. `DIS-00 §5`/
  `DIS-01 §2` lo piden, pero `tema.css` no tiene los tokens oscuros de `DIS-01 §2.3` y el equipo
  decidió no implementarlo. No proponer un conmutador ni tokens oscuros salvo que se reabra
  explícitamente.

### Estado tras el deploy del backend (2026-08-06) — si vienes a verificar, lee esto primero

**El backend está desplegado con los dos bugs del chat corregidos y verificado en producción —
no hace falta volver a probarlo.** Detalle completo, con la evidencia de la auditoría
post-deploy, en `backend/CONTINUAR_AQUI.md`. Dos cosas que afectan directamente a lo que ves en
pantalla:

- **El chat ya no pierde memoria a la mitad de camino ni pinta burbujas vacías.** Ambos bugs
  —uno de contrato (`history` capaba a 4 mensajes en vez de 8), uno del proveedor (`gpt-oss-20b`
  agotaba tokens razonando y devolvía texto vacío— están corregidos en el backend y reforzados en
  el frontend (`Chat.tsx`: nunca pinta una respuesta vacía, la trata como fallo con reintento).
- **Los prompts son v3**, con las cláusulas `C-11`/`C-12`/`C-13` nuevas y sin las tres fallas que
  encontraron las sondas de v2 (Markdown crudo, género incorrecto de Aura, síntomas listados tras
  rechazar un diagnóstico). Verificado con 11 llamadas contra el API Gateway real tras el deploy.

### Pendientes conocidos

- **Sin desplegar a Vercel todavía.** El único pendiente operativo de todo el proyecto en este
  momento. Todo lo demás —backend y frontend— está verificado en producción.
- Un hueco de contrato que el frontend tuvo que recortar en pantalla (`recursos` de
  `ChatResponseV1`, P-12) — diferido a fase posterior por decisión explícita, detalle en
  `backend/CONTINUAR_AQUI.md`.
