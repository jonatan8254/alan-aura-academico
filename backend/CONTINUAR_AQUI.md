# backend — dónde quedó y qué falta

**Fecha:** 2026-08-06 · **Rama:** `backend` · **Autoridad:** `docs/10_arquitectura/ARQ-01_diseno_fisico.md`
(diseño), `docs/10_arquitectura/CONTRATO_API_v1.md` + `packages/contrato-api` (contrato — si
divergen, gana `contrato-api`), las `ECU` (comportamiento). No hay un `CONTINUAR_AQUI.md` previo en
esta rama — el que existe en `frontend/` es del equipo de frontend, este es su espejo del lado
backend.

## Estado: todo verificado tras el deploy, nada pendiente en este repo

**Si vienes a confirmar que el backend funciona, no hace falta que vuelvas a probar nada — ya
está hecho, con evidencia, en la sección de abajo.**

Las 13 rutas de `GET /health`, `auth/{registro,login,login-admin,logout}`, `onboarding`, `chat`,
`perfil/{reiniciar,revocar}`, `cuenta/eliminar`, `admin/{directorio,metricas,chat-access}` están
desplegadas (CDK en `backend/infra/`, 4 tablas DynamoDB + 1 bucket S3, Lambda Node 22 tras API
Gateway REST) y los prompts de Alan y Aura son **v3**, en S3 y con `PROMPTS_VERSION: "v3"`
desplegada (commit `d90deb8`, deploy confirmado por el usuario el 2026-08-06).

**Lo único que queda de todo el trabajo de esta fase es el deploy del frontend a Vercel —
ninguna otra pieza del backend ni del frontend está pendiente.** Ver `frontend/README.md` para
ese lado.

## Todo lo que estaba roto y ya está cerrado (con evidencia)

Seis hallazgos, los seis corregidos y verificados con llamadas reales contra el API Gateway
desplegado — no solo con `typecheck`/`cdk synth`.

1. **`perfil/reiniciar.ts` dejaba `PERFIL.completoElOnboarding = true`.** Ahora borra `CAPSULA`
   y actualiza ese campo a `false` en un solo `TransactWriteCommand` —mismo patrón que
   `onboarding.ts`—, sin estado intermedio inconsistente.
2. **`429` declarado y nunca emitido en login.** Nueva función
   `dentroDelLimiteDeIntentosDeLogin` en `limites.ts`: 5 intentos/minuto por **username** (no
   por IP: la amenaza es adivinar la contraseña de una cuenta). `login.ts` y `login-admin.ts`
   comparten el contador.
3. **`character` inválido en `/chat` daba `502`, no `400`.** Se valida contra el enum literal
   antes de tocar S3.
4. **No había `GET /admin/chat-access`.** Nuevo handler `admin/consultar-chat-access.ts`, mismo
   recurso REST que el `POST`. De paso: el `POST` auditaba con `sesion.titularId` (un UUID) como
   `autor`; ahora resuelve el **alias** vía `PERFIL` (`RN-03.5`). El frontend ya lo consume
   (`fase-3-frontend` commit `6a74f23`, P-16/`Disponibilidad.tsx`) — verificado deshabilitando y
   reactivando el chat real desde la pantalla, con el alias correcto en el registro.
5. **Respuestas vacías del chat.** `gpt-oss-20b` es un modelo de razonamiento: `max_tokens: 350`
   (el límite de RN-02.8) contaba también lo que el modelo razonaba antes de responder, y ante
   mensajes ambiguos o que pedían comparar opciones agotaba el presupuesto pensando y devolvía
   `content: ""` con HTTP 200 — una burbuja en blanco. El presupuesto de generación sube a 2000
   tokens (`groq.ts`); RN-02.8 lo sigue haciendo cumplir `limitarTokensDeSalida()` sobre la
   salida ya generada, que es donde toca. Una respuesta vacía ahora se trata como fallo del
   proveedor (ruta de reintento de `FE-06`). El frontend además nunca pinta una burbuja vacía,
   por si acaso (`fase-3-frontend` commit `569d6b0`).
6. **Memoria a la mitad.** `RN-02.2` concede «hasta 4 **intercambios**» (una ida y vuelta = 2
   mensajes); el código capaba `history` a 4 **elementos** — la mitad de la memoria permitida.
   `MAX_MENSAJES_HISTORIAL` pasa a 8 en `chat.ts`, mismo cambio en el frontend.

**Commits:** bugs 1–3 y hueco 4 en `1e8fef3`; bugs 5–6 en `d6eb374`; el merge con los prompts v3
del líder en `d90deb8` (limpio, sin conflicto — el líder solo tocó `PROMPTS_VERSION` en
`api-stack.ts`).

**Verificación post-deploy** (auditoría de 11 llamadas contra el API Gateway real, 2026-08-06,
tras el `cdk deploy` que el usuario confirmó haber corrido):

- Las 3 sondas que antes volvían vacías en 2 de 3 casos respondieron completas (hasta 2107
  caracteres).
- 8 mensajes de historial se aceptan (`200`); 9 se rechazan (`400 "history admite hasta 8
  mensajes (4 intercambios)"`).
- **Prompts v3** (subidos por el líder en `678a45f`, con las cláusulas `C-11`/`C-12`/`C-13` del
  `CONTRATO_conversacional` v1.3) verificados contra las tres correcciones que las sondas de v2
  habían encontrado:
  - `CA-2` (¿eres humano?): los dos revelan ser IA sin ambigüedad; Aura ya no se autodescribe en
    masculino.
  - `CA-3` (pedir un diagnóstico): los dos rechazan y derivan a un profesional, **sin** la lista
    de síntomas que aparecía en v2.
  - `CA-7` (mismo mensaje a los dos personajes): Alan tira a acción concreta, Aura a nombrar y
    sostener — el contraste de tono se mantiene.
  - **Cero marcas `(C-n)`/`(P-n)` filtradas y cero Markdown** en las 6 respuestas.

Las 11 llamadas completas quedaron en el hilo de la sesión que las corrió, no en un artefacto
versionado — este resumen es la fuente que queda en el repo.

**Esto no es la evaluación formal de `RC-08`** (rúbrica de coherencia de persona, n≥10, ≥4,0/5):
son 11 llamadas dirigidas a criterios puntuales, no una muestra estadística. Esa evaluación
sigue sin hacerse, ver más abajo.

## Lo único que sigue realmente pendiente

- **`ChatResponseV1` no transporta recursos de ayuda estructurados.** Diferido a una fase
  posterior a la Fase 3 — decisión explícita del usuario, no un olvido: por ahora la contención
  se resuelve con el texto libre de `mensaje` («no puedo atender esto, busca ayuda humana»), sin
  tarjetas de líneas telefónicas. El backend ya carga
  `ConfigSeguridad.contencion.recursos: ReferenciaDeDerivacion[]` de S3, pero `chat.ts` no lo
  devuelve, y el catálogo sigue vacío. **Cuando se retome:** `ChatResponseV1` necesita
  `recursos?: RecursoDeAyuda[]`, y hay que llenar el catálogo (decisión de contenido, no solo de
  código).
- **`RC-08` formal** — la rúbrica de n≥10 con evaluadores, no la auditoría dirigida de arriba.
- **Deploy del frontend a Vercel** — el único pendiente operativo de todo el proyecto ahora
  mismo. Ver `frontend/README.md`.
