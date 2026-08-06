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
frontend si el contrato de `contrato-api` no cambió.
