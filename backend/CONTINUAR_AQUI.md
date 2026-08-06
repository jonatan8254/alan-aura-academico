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

## Tres bugs reales, verificados, no bloqueantes

1. **`perfil/reiniciar.ts` deja `PERFIL.completoElOnboarding = true`.** Borra el ítem `CAPSULA`
   (línea 34) pero nunca toca `completoElOnboarding` en `PERFIL`. Consecuencia: tras reiniciar,
   `/chat` empieza a devolver `403 "consentimiento base no otorgado"` —correcto según el estado
   real— pero `LoginResponse.onboardingCompleto` y `DirectorioResponse` siguen diciendo `true`
   hasta el próximo login (`tieneOnboardingCompleto()` mira la presencia de `CAPSULA`, no ese
   campo). El frontend lo mitiga escribiendo `onboardingCompleto: false` en la pista local tras un
   reinicio exitoso, pero esa mitigación no sobrevive a un re-login y el campo en DynamoDB sigue
   mintiendo. **Arreglo:** que `reiniciar.ts` también actualice `PERFIL.completoElOnboarding` a
   `false` en el mismo `UpdateCommand`/`DeleteCommand`.
2. **`429` declarado y nunca emitido en login.** `LoginStatus`/`LoginAdminStatus` en
   `packages/contrato-api/src/rutas.ts` incluyen `429`, y así lo documenta `CONTRATO_API_v1.md`.
   Verificado: ni `auth/login.ts` ni `auth/login-admin.ts` importan `limites.ts` — no hay ningún
   freno de fuerza bruta en el login. `limites.ts` (3/min, 30/día) solo se usa en `chat.ts`. Si se
   implementa, debe decidirse el umbral y si es por IP o por username (ARQ-01 no lo especifica).
3. **`character` inválido en `/chat` da `502`, no `400`.** `chat.ts:83` pasa `cuerpo.character`
   sin validar contra el enum `Character` (`"alan" | "aura"`) directamente a la key de S3
   `config/prompts/${character}.json`. Un valor fuera del enum no encuentra el objeto, lanza, y
   sale como `502 "el proveedor no está disponible"` — copia engañosa para lo que en realidad es
   una entrada mal formada. **Arreglo:** validar `character` contra el enum antes del paso 11 del
   orden de verificación (ver la tabla en la cabecera de `chat.ts`), devolviendo `400`.

## Dos huecos de contrato, documentados, no cerrados

1. **No hay `GET /admin/chat-access`.** El kill switch solo tiene `POST` (`api-stack.ts`). El
   backend sí escribe `AccionAdministrativa` (autor + fecha) en cada cambio, pero no hay ruta para
   leerla de vuelta. `ECU-10 §11` paso 1 exige que P-16 muestre «el último cambio registrado, con
   autor y fecha» — el frontend tuvo que recortar ese bloque de su pantalla porque no hay de dónde
   sacarlo. Si se implementa: leer el último ítem de `AccionAdministrativa` por
   `fechaAccionId` descendente, exponer `{estado, ultimoCambio: {autor, fecha}}`. El `autor` debe
   ser el **alias** del administrador, no el `username` (`RN-03.5`) — el mockup `p16` lo dibuja
   como username y está mal.
2. **`ChatResponseV1` no transporta recursos de ayuda.** El backend carga
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
