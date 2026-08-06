# frontend — arranque para desarrollo en paralelo

Este workspace está vacío de intención (solo `package.json` placeholder): el scaffold real de la
app (Vite + React + TypeScript + Tailwind v4 + shadcn/ui, per `ADR-002`) es trabajo del equipo de
frontend, no de esta pasada. Lo que sí queda listo es cómo se conecta al backend.

## Cómo levantar el backend mientras desarrollas

Desde la raíz del repo:

```bash
npm install
npm run mock
```

Esto levanta el mock de las 13 rutas de `/api/v1` en `http://localhost:4000`, con datos de ejemplo
(`backend/mock/fixtures.ts`). No requiere AWS ni ninguna cuenta en la nube.

## Cómo consumir el contrato

Importa los tipos de request/response desde `contrato-api` (workspace `packages/contrato-api`) en
vez de declararlos de nuevo:

```ts
import type { LoginRequest, LoginResponse } from "contrato-api";
```

El contrato completo, ruta por ruta, está documentado en
`docs/10_arquitectura/CONTRATO_API_v1.md`.

## `vercel.json`

El `rewrite` de `/api/*` ya apunta al mock local (`http://localhost:4000`) — es el mismo mecanismo
que en producción apuntará al API Gateway real (`ARQ-01-D1`), así que la app nunca necesita saber
si habla con el mock o con el backend real: siempre pide a `/api/v1/...` en el mismo origen.

**Único cambio para producción:** actualizar `destination` en `vercel.json` (o moverlo a una
variable de entorno de Vercel) con la URL del API Gateway desplegado. No hay cambios de código en
el frontend si el contrato de `contrato-api` no cambió.
