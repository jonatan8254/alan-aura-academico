# CONTRATO_API_v1 — Contrato de las 13 rutas de `/api/v1`

**ID:** CONTRATO_API_v1 · **Hogar:** `docs/10_arquitectura/` · **Fecha:** 2026-08-06.
**Insumos:** `ARQ-01-D3` (tabla de rutas), `MC-01_cabeceras.txt` (tipos), `packages/contrato-api`.
**Consumidores:** `backend/mock/server.ts`, la implementación real de los handlers, y el equipo de
frontend al construir las 17 pantallas.
**Naturaleza:** operacionalización de `ARQ-01_diseno_fisico.md §ARQ-01-D3` con los tipos TypeScript
exactos. Si este documento y `packages/contrato-api` divergen, **`contrato-api` gana** — este
documento es su proyección legible, no una fuente independiente.

**Actualización 2026-08-06 — verificación exhaustiva del pendiente declarado en `ARQ-01 §N+1` punto
3.** Una pasada independiente cruzó los códigos de esta tabla contra los flujos `FA`/`FE` de las 14
`ECU`, uno a uno. Encontró 5 rutas con códigos citados literalmente en su `ECU` que la tabla no
tenía — el hallazgo mayor es `/api/v1/chat`, al que le faltaban `409` (kill switch activo,
`ECU-06 FE-04`/`ECU-13 FE-01`) y `502` (proveedor LLM caído, `ECU-06 FE-06`), ambos ya asumidos por
las pantallas de error de `DR-06`. La tabla de abajo y `packages/contrato-api/src/rutas.ts` ya
incorporan la corrección; **el artefacto de gobernanza `ARQ-01_diseno_fisico.md` en sí no se tocó**
—sigue con su tabla original— y su propio dueño debe decidir si registra esta corrección con un
`SD-*` formal, como es el ritual del proyecto para artefactos cerrados.

**Actualización 2026-08-06 (segunda) — el hueco de la declaración de edad, resuelto.** `ECU-05 §17`
nunca listó el paso 3 (declarar edad) como parte de `POST /onboarding/` — solo los pasos 5, 7 y 8. Y
`FE-01` (menor de edad) no crea nada: "el Sistema cierra la sesión sin esperar acción del Usuario".
Se resuelve **enteramente en el frontend**: la pantalla de edad nunca llama a `/onboarding` si la
respuesta es "menor" — llama directo a `POST /api/v1/auth/logout` (ya existente). `OnboardingRequest`
gana `esAdulto: true` (literal, igual que `consentimientoBase`) y `versionDisclosure: string`, que
viajan en el mismo POST final para el camino de éxito. Consecuencia: el `403` que esta tabla
especulaba para `OnboardingStatus` **se retira** — ningún flujo de `ECU-05` lo respalda una vez que
`FE-01` no llega al servidor (mismo patrón que el `409` sin respaldo retirado de `/cuenta/eliminar`).
Decisión del usuario, no unilateral.

**Actualización 2026-08-06 (tercera) — los 4 autorreportes pasan a opcionales.**
`OnboardingRequest` los declaraba obligatorios; `RN-01.4` de `ECU-05` dice literal *"Ningún
autorreporte de la caracterización es obligatorio; el usuario puede omitir los 4. Obligatorios son
solo edad, capa base del consentimiento y `character`"*. Corregido en `moodSelfReport`,
`energySelfReport`, `conversationGoal` y `responseStyle` (ahora `?:`); el mock ajustó su validación
en consecuencia.

**Actualización 2026-08-06 (cuarta) — `ChatRequestV1` gana `history` y `clientRequestId`.**
`ECU-06 §17` lista el *endpoint* con los campos *"character, message, history (≤4),
client_request_id"* y solo `character`/`texto` estaban en el contrato. Sin `history` el LLM no
tiene memoria del turno anterior (rompe `RN-02.2`: cápsula + persona + hasta 4 intercambios +
turno). No hay persistencia server-side (`RF-13`): el cliente reenvía el historial en cada turno.
Nuevo tipo `ChatIntercambio { rol, texto }`.

**Actualización 2026-08-06 (quinta) — `ReiniciarPerfilRequest` gana `confirmacion`.**
`ECU-11 RE-01`/`FE-03` exigen confirmación **explícita** del usuario antes de borrar la cápsula
("confirmación ausente o petición mal formada" → `400`) — el request estaba vacío. `confirmacion:
true` literal, mismo patrón que `consentimientoBase`. `RevocarPersonalizacionRequest` (CU-12) se
queda vacío a propósito: su `FE-03` no liga el `400` a una confirmación ausente, solo a "petición
mal formada" — asimetría real entre las dos ECU, no un descuido.

**Actualización 2026-08-06 (sexta) — `EliminarCuentaRequest` gana `confirmacion`.**
Mismo patrón: `ECU-04 FE-03` liga el `400` a "solicitud mal formada **o sin confirmación
explícita**". El endpoint solo cubre los pasos 2–3 de `ECU-04` (confirmar + ejecutar) — el paso 1
(mostrar el alcance antes de confirmar) es un texto fijo del lado del cliente, sin llamada al
servidor; `alcance` en la respuesta confirma lo ya ejecutado, no una vista previa.

**Actualización 2026-08-06 (séptima) — `MetricasResponse` gana `agregadoDeCuentas`.**
`ECU-09 §5` exige **cuatro** cifras: total de cuentas y onboardings completados (cardinalidades de
`Usuario`) además de llamadas al chat en 7 días y tasa técnica (de `EventoOperativo`) — el contrato
solo tenía las dos últimas. `AgregadoDeCuentas` ya existía (lo usa `DirectorioResponse`); se reusa,
no se duplica el tipo.

**Actualización 2026-08-06 (octava) — `ChatAccessRequest` gana `confirmacion`.**
`ECU-10 RN-03.4` exige confirmación explícita del *kill switch*, y `FE-03` liga el `400` a "sin la
confirmación exigida" — mismo patrón que `ReiniciarPerfilRequest`/`EliminarCuentaRequest`.

---

| Método | Ruta | Origen | Auth | Request | Response | Códigos |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/health` | infra | No | — | `HealthResponse` | `200` |
| `POST` | `/api/v1/auth/registro` | CU-02 | No | `RegistroRequest` | `RegistroResponse` | `201`, `400`, `409` |
| `POST` | `/api/v1/auth/login` | CU-03 | No | `LoginRequest` | `LoginResponse` | `200`, `400`ⁿ, `401`, `429`ⁿ |
| `POST` | `/api/v1/auth/login-admin` | CU-03 (admin) | No | `LoginAdminRequest` | `LoginAdminResponse` | `200`, `400`ⁿ, `401`, `429`ⁿ |
| `POST` | `/api/v1/auth/logout` | CU-03 — cierra `RA-01` | Sí | `LogoutRequest` (vacío) | `LogoutResponse` | `200`, `401` |
| `POST` | `/api/v1/onboarding` | CU-05 (incl. `character` de CU-14) | Sí | `OnboardingRequest` | `OnboardingResponse` | `200`, `400`, `401` |
| `POST` | `/api/v1/chat` | CU-06, CU-07 (`extend`), CU-13 (`character` por petición) | Sí | `ChatRequestV1` | `ChatResponseV1` | `200`, `400`, `401`, `403`, `409`, `429`, `502`, `504` |
| `POST` | `/api/v1/perfil/reiniciar` | CU-11 | Sí | `ReiniciarPerfilRequest` (vacío) | `ReiniciarPerfilResponse` | `200`, `400`, `401`, `403`, `500` |
| `POST` | `/api/v1/perfil/personalizacion/revocar` | CU-12 — cierra `RA-01` | Sí | `RevocarPersonalizacionRequest` (vacío) | `RevocarPersonalizacionResponse` | `200`, `400`, `401`, `403` |
| `POST` | `/api/v1/cuenta/eliminar` | CU-04 | Sí | `EliminarCuentaRequest` (vacío) | `EliminarCuentaResponse` | `200`, `400`, `401`, `403`, `500` |
| `GET` | `/api/v1/admin/directorio` | CU-08 | Sí (admin) | — | `DirectorioResponse` | `200`, `401`, `403` |
| `GET` | `/api/v1/admin/metricas` | CU-09 | Sí (admin) | — | `MetricasResponse` | `200`, `401`, `403` |
| `POST` | `/api/v1/admin/chat-access` | CU-10 | Sí (admin) | `ChatAccessRequest` | `ChatAccessResponse` | `200`, `400`, `401`, `403` |

ⁿ Sin cita textual en `ECU-03` (ni `FA` ni `FE` la mencionan) — higiene REST estándar
(validación de esquema, freno de fuerza bruta), no un hueco verificado. No bloquea.

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
