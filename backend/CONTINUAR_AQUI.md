# backend — dónde quedó y qué falta

**Fecha:** 2026-08-06 · **Rama:** `backend` · **Autoridad:** `docs/10_arquitectura/ARQ-01_diseno_fisico.md`
(diseño), `docs/10_arquitectura/CONTRATO_API_v1.md` + `packages/contrato-api` (contrato — si
divergen, gana `contrato-api`), las `ECU` (comportamiento). No hay un `CONTINUAR_AQUI.md` previo en
esta rama — el que existe en `frontend/` es del equipo de frontend, este es su espejo del lado
backend.

## Estado: las 13 rutas están desplegadas y probadas contra AWS real

`GET /health`, `auth/{registro,login,login-admin,logout}`, `onboarding`, `chat`,
`perfil/{reiniciar,revocar}`, `cuenta/eliminar`, `admin/{directorio,metricas,chat-access}`. CDK
(`backend/infra/`), 4 tablas DynamoDB + 1 bucket S3, Lambda Node 22 tras API Gateway REST. Los
prompts de Alan y Aura son **v2**, desplegados y verificados con 8 sondas contra Groq real
(`CA-2`/`CA-3`/`CA-7`, corrección de `C-4`) — ver `backend/config/README.md` para el procedimiento
de publicar un prompt nuevo.

## Tres bugs — cerrados el 2026-08-06 (commit `1e8fef3`)

1. ~~`perfil/reiniciar.ts` deja `PERFIL.completoElOnboarding = true`~~ **Corregido.** Ahora borra
   `CAPSULA` y actualiza `PERFIL.completoElOnboarding` a `false` en un solo `TransactWriteCommand`
   —mismo patrón que `onboarding.ts`—, para que no exista un estado intermedio donde la cápsula ya
   no existe pero el perfil sigue diciendo que sí.
2. ~~`429` declarado y nunca emitido en login~~ **Corregido.** Nueva función
   `dentroDelLimiteDeIntentosDeLogin` en `limites.ts`: 5 intentos/minuto, clave por **username**
   (no por IP — decisión documentada en el propio código: la amenaza es adivinar la contraseña de
   una cuenta, y el username es la identidad que se protege). `login.ts` y `login-admin.ts`
   comparten el mismo contador, para que no se pueda esquivar el freno cambiando de puerta.
3. ~~`character` inválido en `/chat` da `502`, no `400`~~ **Corregido.** Se valida contra el enum
   literal (`"alan" | "aura"`) antes de tocar S3, mismo patrón que `estadoNuevo` en
   `admin/chat-access.ts`.

## Dos huecos de contrato

1. ~~No hay `GET /admin/chat-access`~~ **Cerrado el 2026-08-06** (commit `1e8fef3`). Nuevo handler
   `admin/consultar-chat-access.ts`, mismo recurso REST que el `POST` existente. De paso se corrigió
   un bug menor descubierto al escribirlo: el `POST` auditaba con `sesion.titularId` (un UUID
   opaco) como `autor`; ahora resuelve el **alias** con una lectura de `PERFIL` antes de escribir la
   auditoría, como pide `RN-03.5`. **El frontend ya lo consume** (`fase-3-frontend`, commit
   `6a74f23`): `Disponibilidad.tsx` (P-16) usa `consultarChatAccess` en vez de `obtenerMetricas` y
   muestra el bloque de auditoría real. Verificado contra AWS: se deshabilitó y volvió a habilitar
   el chat desde la pantalla, el registro mostró el alias correcto (no un UUID), y el chat quedó
   reactivado al terminar.
2. **`ChatResponseV1` no transporta recursos de ayuda.** Sigue abierto. El backend carga
   `ConfigSeguridad.contencion.recursos: ReferenciaDeDerivacion[]` de S3
   (`config/ayuda/contencion.json`), pero `chat.ts` solo devuelve `configSeguridad.contencion.mensaje`
   en el `safety_fallback`. El catálogo, además, está vacío hoy (decisión deliberada, diferida a
   fase posterior). Si se llena el catálogo, `ChatResponseV1` necesita un campo
   `recursos?: RecursoDeAyuda[]` para que P-12 pueda pintar tarjetas estructuradas en vez de
   depender de que el texto libre de `mensaje` los mencione.

## Tres correcciones al prompt (v2), verificadas contra Groq real el 2026-08-06

`backend/config/prompts/{alan,aura}.json`. Las sondas confirmaron que las cláusulas duras
sostienen (nadie filtra ser humano, nadie diagnostica, nadie desacredita la ayuda profesional,
nadie pide diario/historial), pero aparecieron tres cosas que la v2 no cubre:

1. **Alan emite Markdown crudo.** Dos de cuatro respuestas de prueba traían
   `**texto en negrita**`. Las burbujas del frontend pintan texto plano (mitigado ahí con un
   normalizador, `dominio/respuestaDelModelo.ts`), pero la corrección de fondo es una línea en el
   prompt pidiendo texto plano, sin formato Markdown.
2. **Aura se autodescribe en masculino.** Ante «¿eres humano?» respondió *«Soy **un** asistente de
   inteligencia artificial»* — el prompt ya dice *«eres una acompañante»*, así que el género del
   prompt no garantiza el género de la salida. Puede necesitar un ejemplo explícito de respuesta a
   esa pregunta, en femenino, dentro del prompt.
3. **Alan enumera síntomas de depresión tras rechazar dar un diagnóstico.** Cumple `C-2`/`CA-3`
   (rechaza y deriva), pero listar «tristeza persistente, falta de energía, cambios en el sueño y
   el apetito» justo después de negarse a diagnosticar se lee cerca de una autoevaluación guiada.
   No es un incumplimiento de cláusula, es un matiz de tono a evaluar.

Las 8 respuestas completas de las sondas están en el commit `593b362` de esta rama y en el hilo de
la sesión que las corrió — no quedaron en ningún artefacto versionado más allá del mensaje del
commit.

## Qué falta, operativamente

- **`GroqApiKey`** en Secrets Manager: confirmar que sigue con la clave real puesta a mano (el
  placeholder de CDK no sirve para invocar Groq).
- Nada de esto está desplegado a producción pública todavía en el sentido de tener tráfico real
  fuera de las pruebas de este equipo — el API Gateway sí es real y está en línea.
