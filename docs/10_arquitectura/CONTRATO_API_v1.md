# CONTRATO_API_v1 — Contrato de las 13 rutas de `/api/v1`

**ID:** CONTRATO_API_v1 · **Hogar:** `docs/10_arquitectura/` · **Fecha:** 2026-08-06.
**Insumos:** `ARQ-01-D3` (tabla de rutas), `MC-01_cabeceras.txt` (tipos), `packages/contrato-api`.
**Consumidores:** `backend/mock/server.ts`, la implementación real de los handlers, y el equipo de
frontend al construir las 17 pantallas.
**Naturaleza:** operacionalización de `ARQ-01_diseno_fisico.md §ARQ-01-D3` con los tipos TypeScript
exactos. Si este documento y `packages/contrato-api` divergen, **`contrato-api` gana** — este
documento es su proyección legible, no una fuente independiente.

---

| Método | Ruta | Origen | Auth | Request | Response | Códigos |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/health` | infra | No | — | `HealthResponse` | `200` |
| `POST` | `/api/v1/auth/registro` | CU-02 | No | `RegistroRequest` | `RegistroResponse` | `201`, `400`, `409` |
| `POST` | `/api/v1/auth/login` | CU-03 | No | `LoginRequest` | `LoginResponse` | `200`, `400`, `401`, `429` |
| `POST` | `/api/v1/auth/login-admin` | CU-03 (admin) | No | `LoginAdminRequest` | `LoginAdminResponse` | `200`, `400`, `401`, `429` |
| `POST` | `/api/v1/auth/logout` | CU-03 — cierra `RA-01` | Sí | `LogoutRequest` (vacío) | `LogoutResponse` | `200`, `401` |
| `POST` | `/api/v1/onboarding` | CU-05 (incl. `character` de CU-14) | Sí | `OnboardingRequest` | `OnboardingResponse` | `200`, `400`, `401`, `403` |
| `POST` | `/api/v1/chat` | CU-06, CU-07 (`extend`), CU-13 (`character` por petición) | Sí | `ChatRequestV1` | `ChatResponseV1` | `200`, `400`, `401`, `403`, `429`, `504` |
| `POST` | `/api/v1/perfil/reiniciar` | CU-11 | Sí | `ReiniciarPerfilRequest` (vacío) | `ReiniciarPerfilResponse` | `200`, `401` |
| `POST` | `/api/v1/perfil/personalizacion/revocar` | CU-12 — cierra `RA-01` | Sí | `RevocarPersonalizacionRequest` (vacío) | `RevocarPersonalizacionResponse` | `200`, `401` |
| `POST` | `/api/v1/cuenta/eliminar` | CU-04 | Sí | `EliminarCuentaRequest` (vacío) | `EliminarCuentaResponse` | `200`, `401`, `409` |
| `GET` | `/api/v1/admin/directorio` | CU-08 | Sí (admin) | — | `DirectorioResponse` | `200`, `401`, `403` |
| `GET` | `/api/v1/admin/metricas` | CU-09 | Sí (admin) | — | `MetricasResponse` | `200`, `401`, `403` |
| `POST` | `/api/v1/admin/chat-access` | CU-10 | Sí (admin) | `ChatAccessRequest` | `ChatAccessResponse` | `200`, `401`, `403` |

## Notas de uso

- **Auth = Sí** significa: el mock y el backend real esperan la cookie de sesión (`ARQ-01-D1`,
  `SameSite=Strict`, sin token CSRF porque Vercel intermedia sin origen cruzado). En el mock, esta
  pasada no valida la cookie — responde igual con o sin ella; validarla es trabajo del backend real.
- **Auth = Sí (admin)** además exige `rol: "administrador"` en la sesión.
- Los tipos completos, con todos los campos, están en `packages/contrato-api/src/rutas.ts` — este
  documento no los reproduce dos veces para no divergir; enlaza a la fuente.
- Los códigos de estado son la primera consolidación que ya declaraba `ARQ-01-D3` (`H-09`), no un
  recorrido exhaustivo verificado contra cada flujo `FA`/`FE` de las 14 `ECU` — ese pendiente sigue
  abierto en `ARQ-01 §N+1`.
- Rutas de React Router del lado del cliente (`/login/`, `/onboarding/`, `/plataforma-admin/`, …)
  son las de `docs/08_diseno/DIS-00_inventario_y_plan.md` y **no** cambian con este documento —
  este contrato es solo el backend (`/api/v1/...`).
