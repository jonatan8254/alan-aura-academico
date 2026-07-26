# PER-01 — Mapa de persistencia del MVP «Alan & Aura Académico»
**ID:** PER-01 · **Familia:** requisitos de datos · **Hogar:** `docs/03_requisitos/` · **Fecha:** 2026-07-25 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** `00_PLAN_CODEX_ORIGINAL.md` §4.14 (almacenamiento y retención) y §4.15 (telemetría) — fuente primaria; PRIV-01 §2/§3 (inventario y requisitos de privacidad); ADR-001-D2 (SQLite); MD-01 (vocabulario de dominio); ECU-02/04/05/06/08/09/10 (qué crea, lee y borra cada caso de uso); REQ-01 (RF-13/18/20/22/23/24, RNF-03/08/09).
**Consumidores:** análisis de robustez (`DR-XX`), diseño de clases y **modelo de datos** (fase 2 tardía), construcción (migraciones Django), pruebas de privacidad (RC-04), TRZ-01.
**Naturaleza:** **inventario consolidado de persistencia** — reúne en un solo lugar lo que hoy está disperso entre el plan, PRIV-01 y las ECU. **No es** diseño de esquema físico, ni modelo de clases, ni DDL: no fija tipos, claves, índices, tablas intermedias ni nombres de columnas. Esas decisiones pertenecen a la fase de diseño (CLAUDE.md §6, «no adelantar»). **No introduce requisitos nuevos**: todo lo que afirma está trazado a un artefacto existente.
**Marcas:** [E1] evidencia literal en un artefacto · [I2] interpretación o derivación del orquestador · [P5] propuesta a decidir.
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Honestidad (§4.9):** este documento se construyó **leyendo** los artefactos citados; ningún esquema fue implementado ni probado. Las filas marcadas [I2] son derivaciones, no hechos verificados. Los huecos detectados se declaran como **hallazgos abiertos** (§8), no se resuelven aquí.

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-07-25 | J. Sánchez | Creación (SD-25). Consolida el inventario de persistencia disperso en plan §4.14/§4.15, PRIV-01 §2 y las ECU; declara 4 hallazgos abiertos (PER-H1…PER-H4). |

---

## 1. Principio rector

**Se persiste lo mínimo para operar; el acompañamiento no deja rastro.** [E1]

El MVP guarda **7 entidades** y ninguna de ellas contiene lenguaje del usuario. El plan §4.14 lo fija de forma explícita y cerrada:

> **Entidades previstas:** `User` · `ConsentRecord` · `InitialConversationProfile` · `PlatformSetting` · `DailyUsageCounter` · `OperationalEvent` · `AdministrativeAction`.
> **No existirán:** `Conversation` · `Message` · `Diagnosis` · `RiskScore` · `PsychometricResult` · `Intervention`. [E1]

Motor: **SQLite** (ADR-001-D2), justificado precisamente porque el volumen es mínimo y *el chat no se persiste*. La no-persistencia es **requisito** (RF-13, RNF-03, PRIV-R2), no un efecto colateral de la elección de motor. [E1]

### 1.1 Qué es y qué no es este documento

| Sí | No |
|---|---|
| Inventario de **qué** información sobrevive a la sesión y **por cuánto tiempo**. | Esquema físico, tipos, claves, índices, DDL o migraciones. |
| Reglas transversales que el esquema **deberá** cumplir (cascada, retención, segregación). | Diagrama de clases de diseño ni mapeo ORM. |
| Trazabilidad de cada dato a su regla, RF y caso de uso. | Requisitos nuevos: **cero** requisitos originales. |

---

## 2. Mapa general — las 7 entidades

| # | Entidad | Qué guarda | Origen (CU que la crea) | Va al LLM | Retención |
|---|---|---|---|---|---|
| 1 | `User` | Cuenta, rol, declaración de adultez | CU-02 «Registrar cuenta» | **No** | Hasta eliminación o cierre **+ 30 días** [E1] |
| 2 | `ConsentRecord` | Consentimiento otorgado/revocado | CU-05 «Otorgar consentimiento…» | **No** | Igual que la cuenta [E1] |
| 3 | `InitialConversationProfile` | La **cápsula** (`ContextoInicialConversacionalV1`) | CU-05 (paso 7) | **Sí** (único) | Hasta reinicio, revocación o eliminación [E1] |
| 4 | `PlatformSetting` | Estado del kill switch | CU-10 «Habilitar/deshabilitar…» | **No** | Vigencia [E1] |
| 5 | `DailyUsageCounter` | Llamadas/día por usuario (cuota) | CU-06 (efecto lateral) | **No** | **Máx. 30 días** [E1] |
| 6 | `OperationalEvent` | Telemetría técnica **sin contenido** | CU-06 (efecto lateral) | **No** | **30 días** [E1] |
| 7 | `AdministrativeAction` | Auditoría del kill switch | CU-10 (paso 3) | **No** | Vigencia del curso **+ 30 días** [E1] |

> **Lectura clave:** solo **una** de las siete (`InitialConversationProfile`) llega al proveedor LLM, y solo en sus 5 campos de contenido + 2 metadatos (PRIV-R1). Las otras seis nunca salen del backend.

---

## 3. Detalle por entidad

### 3.1 `User` — cuenta e identidad mínima

| Dato | Marca | Fuente | Nota |
|---|---|---|---|
| `username` | [E1] | RN-04.1, ECU-02 §2 | Único; **nunca** visible al administrador (RN-03.5) |
| `alias` | [E1] | RN-04.1, ECU-02 §2 | Lo único identificable que el admin sí ve (CU-08) |
| contraseña **hasheada** | [E1] | PRIV-R12, RNF-09 | Nunca en claro, nunca en el cliente, nunca accesible al admin |
| `rol` ∈ {usuario, administrador} | [E1] | RNF-08, ECU-02 §2 | Asignado y validado **en servidor**; no alterable desde el cliente |
| `esAdulto` (booleano) | [E1] | RN-04.2, ECU-05 §14 | Declaración, **no** fecha de nacimiento |
| `versionDisclosure` | [E1] | RN-04.2, ECU-05 §14 | Qué versión del aviso de IA aceptó |
| fecha de registro | [E1] | RN-03.2, plan §4.9 (directorio) | El directorio la muestra ⇒ se persiste |
| `estado` | [I2] | RN-03.2, plan §4.9 (directorio) | **Dominio de valores sin definir** → ver **PER-H3** |

**Prohibido almacenar** (RN-04.1, [E1]): nombre legal, documento de identidad, correo, teléfono, dirección, fecha de nacimiento. Sin recuperación de contraseña por correo ni verificación de correo (RN-04.6).

### 3.2 `ConsentRecord` — consentimiento informado

| Dato | Marca | Fuente |
|---|---|---|
| `estado` ∈ {otorgado, revocado} | [E1] | MD-01 §6, ECU-05 §18 |
| `fecha` | [E1] | ECU-05 §18 |
| versión del texto de consentimiento | [E1] | ECU-05 §18 |

Es el **gate binario de todo el chat**: sin `estado = otorgado` no hay conversación (RN-02; FE-02 de ECU-05). Revocable en cualquier momento (RN-07, RN-01.5, PRIV-R3); al revocar, **cesa el uso de la cápsula y esta se marca para descarte**.

> El texto de consentimiento **no es un dato de esta entidad**: se aprovisiona **por entorno** y requiere revisión legal antes de uso con personas reales (V6-b, PRIV-01 §5).

### 3.3 `InitialConversationProfile` — la cápsula

`ContextoInicialConversacionalV1` (plan §3.4; adoptada en **SD-22**):

| Campo | Obligatorio | Va al LLM | Marca |
|---|---|---|---|
| `mood_self_report` | No | Sí | [E1] |
| `energy_self_report` | No | Sí | [E1] |
| `conversation_goal` | No | Sí | [E1] |
| `response_style` | No | Sí | [E1] |
| `character` ∈ {alan, aura} | **Sí** | Sí | [E1] |
| `schema_version` (metadato) | — | Sí | [E1] |
| `consent_version` (metadato) | — | Sí | [E1] |

Reglas que el almacenamiento debe respetar:
- **Sin *defaults*** para los campos omitidos: la cápsula se arma solo con lo respondido (RN-01.3, FA-02 de ECU-05). Un campo omitido **no se guarda**; no se guarda vacío ni con valor por defecto. [E1]
- **Ningún campo de perfil es obligatorio** salvo edad y consentimiento (RN-01.4) — lo que colisiona con `character` obligatorio → ver **PER-H1**.
- Es el **único** origen de datos que viaja al proveedor LLM (PRIV-R1).
- El administrador **no** puede alcanzarla por ninguna vía (PRIV-R7, RN-03.5).

### 3.4 `PlatformSetting` — kill switch

| Dato | Marca | Fuente |
|---|---|---|
| `estado` ∈ {habilitado, deshabilitado} | [E1] | MD-01 (`DisponibilidadDelChatbot`), ECU-10 §7 |

Estado **global** (no por usuario). Con `deshabilitado`, ninguna conversación puede iniciarse — CU-06 responde `409` (RN-02.7, CA-01 de ECU-10). [E1]

### 3.5 `DailyUsageCounter` — cuota de uso

Contador diario de llamadas al chat **por usuario**, que materializa los límites de RN-02.9 (3 solicitudes/min, 30/día). [E1]
Campos concretos y granularidad: **no especificados** en ningún artefacto → ver **PER-H4** [I2].

Acceso: solo backend. Retención: **máximo 30 días**. Se borra en **cascada** con la cuenta (PRIV-R11).

### 3.6 `OperationalEvent` — telemetría sin contenido

El plan **§4.15** es explícito en ambas direcciones:

| Sí almacena | No almacena |
|---|---|
| `timestamp` · `request_id` · resultado técnico · `latencia` · `modelo` · `version_prompt` · código de estado · `entorno` [E1] | mensaje · respuesta · perfil · alias · username · **motivo textual del fallback** · texto de error del proveedor · **categoría emocional** [E1] |

Es la **única** fuente de las métricas agregadas del administrador (CU-09: total de cuentas, onboardings completados, llamadas al chat en 7 días, tasa técnica de éxito/error). Retención: **30 días**.

> Nota fuerte: la lista de exclusiones incluye el *motivo textual del fallback* y la *categoría emocional*. Es decir, **ni siquiera se guarda por qué se activó el gate de seguridad** — solo que la petición terminó en `safety_fallback`. Esto es coherente con el canon de uso no punitivo (PRIV-R6) y debe respetarse al diseñar el logging.

### 3.7 `AdministrativeAction` — auditoría del kill switch

| Dato | Marca | Fuente |
|---|---|---|
| autor (administrador) | [E1] | RN-03.4, RF-18, ECU-10 §7/§16 |
| fecha | [E1] | RN-03.4, RF-18 |
| acción / nuevo estado | [I2] | ECU-10 §11 paso 3 (derivado: «registra la acción») |

Exigencia verificable (RE-01 de ECU-10): cada cambio del kill switch queda registrado con autor y fecha, **sin datos de usuario**. [E1]
Retención: vigencia del curso + 30 días.

---

## 4. Lo que NUNCA toca la base de datos

| Dato | Dónde vive realmente | Regla |
|---|---|---|
| **Contenido de la conversación (mensajes y respuestas)** | Memoria de sesión; se descarta al cerrar | RF-13, RNF-03, **PRIV-R2**, RN-04 [E1] |
| Historial de sesiones previas | No existe | PRIV-R1 [E1] |
| Motivo textual del fallback, categoría emocional | No se registra | plan §4.15 [E1] |
| Riesgo individual / puntaje de riesgo | «No persistir» (literal del plan §4.14) | PRIV-R4 [E1] |
| Biomarcadores, diario, ítems clínicos, diagnóstico | Fuera de alcance del MVP | PRIV-R4, VIS-01 §5 [E1] |
| Recursos de ayuda, textos, *prompts*, parámetros del gate | **Configuración por entorno** | SD-12, MD-01 §3.2, plan §4.16 [E1] |
| Contraseña en claro, `GROQ_API_KEY`, `DJANGO_SECRET_KEY` | Variables de entorno | RNF-09, PRIV-R12, plan §4.16 [E1] |

> **Alcance de PRIV-R2:** «no se persiste **en BD ni en logs**». La prohibición cubre el *logging* de aplicación, no solo el modelo de datos. Un `logger.info(mensaje_usuario)` viola PRIV-R2 igual que una tabla `Message`. [E1]

**Composición en el dominio.** MD-01 modela `Conversacion *-- Mensaje` como **composición** precisamente por esto: los mensajes no se comparten y mueren con la conversación (MD-01 §4). El modelo de dominio ya codifica la no-persistencia; el modelo de datos solo debe no contradecirla. [E1]

---

## 5. Reglas transversales que el esquema deberá cumplir

| ID | Regla | Traza |
|---|---|---|
| **PER-T1** | **Borrado en cascada:** eliminar `User` suprime `ConsentRecord` + `InitialConversationProfile` + `DailyUsageCounter` de ese usuario. | PRIV-R11, RN-04.4, RF-24, CA-01 de ECU-04 [E1] |
| **PER-T2** | **No reidentificación de la telemetría:** `OperationalEvent` y `AdministrativeAction` no deben permitir reconstruir qué hizo un usuario concreto (no llevan alias ni username; plan §4.15). | plan §4.15, PRIV-R10 [E1] |
| **PER-T3** | **Segregación del administrador:** ninguna consulta administrativa puede alcanzar `InitialConversationProfile`, contenido, respuestas de encuesta, personaje elegido ni conteos por usuario. | PRIV-R7, PRIV-R10, RN-03.5 [E1] |
| **PER-T4** | **Directorio truncado:** CU-08 expone únicamente alias, **ID truncado**, fecha de registro, estado y flag de onboarding. | RN-03.2, RF-15 [E1] |
| **PER-T5** | **Purga por ventana:** retenciones heterogéneas (30 días para contadores y eventos; vigencia para cuenta) exigen un mecanismo de purga programada, no solo un campo de fecha. | plan §4.14 [I2] |
| **PER-T6** | **Hash de contraseña** en almacenamiento; jamás en claro, en el cliente ni accesible al admin. | PRIV-R12, RNF-09 [E1] |
| **PER-T7** | **Reinicio ≠ revocación:** «reiniciar caracterización» (RF-22) **borra** la cápsula; «revocar personalización» (RF-23) hace que **deje de alimentar** la conversación. Son dos operaciones distintas sobre estados distintos. | RN-04.3, RN-07, FA-01/FA-02 de ECU-04 [E1] |

---

## 6. Mapa de relaciones (conceptual, sin multiplicidades)

```
                         ┌──────────────────────┐
                         │  AdministrativeAction│  (auditoría; sin FK a usuario)
                         └──────────┬───────────┘
                                    │ registra
                         ┌──────────▼───────────┐
   Administrador ───────▶│    PlatformSetting   │  (kill switch, global)
                         └──────────┬───────────┘
                                    │ condiciona el inicio de
   ┌────────────────┐               ▼
   │      User      │        ( Conversacion )  ◀── EFÍMERA, no persiste
   └───┬────┬───┬───┘               ▲
       │    │   │                   │ orienta
       │    │   └──────────────────┐ │
       │    │                ┌─────┴─▼───────────────────────┐
       │    │                │ InitialConversationProfile    │──▶ ÚNICA que viaja al LLM
       │    │                └───────────────────────────────┘
       │    │  ┌────────────────────┐
       │    └─▶│   ConsentRecord    │  (gate binario del chat)
       │       └────────────────────┘
       │       ┌────────────────────┐
       └──────▶│  DailyUsageCounter │  (cuota; purga a 30 días)
               └────────────────────┘

               ┌────────────────────┐
               │  OperationalEvent  │  (sin contenido, sin identidad → métricas agregadas)
               └────────────────────┘

   Borrado en cascada al eliminar User (PER-T1):
   User ⇒ ConsentRecord + InitialConversationProfile + DailyUsageCounter
```

`Conversacion` y `Mensaje` aparecen entre paréntesis porque **son clases del dominio (MD-01) sin contraparte persistida**: existen como vocabulario y como objetos en memoria, nunca como tablas. Es la distinción entre modelo de dominio y modelo de datos, y aquí es deliberada.

---

## 7. Frontera externa: retención en el proveedor LLM

La no-persistencia es una propiedad **de este sistema**; no de la cadena completa. El plan §4.14 lo advierte de forma explícita:

> Groq informa una retención estándar de 30 días y permite gestionar *Zero Data Retention* desde Data Controls. **Antes del release deberá verificarse si ZDR está activado realmente**; si no lo está, el *disclosure* deberá declararlo sin prometer retención cero. [E1]

**Consecuencia para PER-01:** aunque nuestra BD no guarde ni un carácter del chat, el turno enviado al proveedor puede vivir 30 días fuera de nuestro control. Esto **no invalida** PRIV-R2 (que habla de nuestra BD y nuestros logs), pero **sí condiciona el texto del *disclosure*** (RF-01) y refuerza el valor de PRIV-R1/R9: cuanto menos identificable sea el turno, menos importa dónde acabe. Verificación pendiente: **V6-a**. [E1]

---

## 8. Hallazgos abiertos

| ID | Tipo | Descripción | Impacto en el modelo de datos | Estado |
|---|---|---|---|---|
| **PER-H1** | Contradicción | **FA-01 de ECU-05** dice que quien omite la caracterización «continúa **sin cápsula** de preferencias» y elige personaje en el paso 8; pero `character` es campo **obligatorio** de la cápsula (RN-01.3, PRIV-01 §2) y **RN-01.4** afirma que ningún campo de perfil es obligatorio salvo edad y consentimiento. Las tres afirmaciones no pueden ser simultáneamente ciertas. | Decide si `InitialConversationProfile` **siempre existe** tras el onboarding (con `character` como mínimo) o si `character` debe vivir en `User`. Afecta la cardinalidad `User–InitialConversationProfile` y el borrado de RF-22. | **Abierto** |
| **PER-H2** | Ambigüedad | RF-24 exige que tras eliminar la cuenta «no quede dato asociado recuperable», pero plan §4.14 fija «hasta eliminación o cierre **+ 30 días**». Ya registrada como RA-01 en ECU-04 §21. | Define si la eliminación es borrado físico inmediato o borrado lógico con purga diferida — y por tanto si el esquema necesita marca de baja. | **Abierto** (heredado de ECU-04 RA-01) |
| **PER-H3** | Hueco | El campo **`estado`** del usuario aparece en el directorio administrativo (RN-03.2, RF-15, plan §4.9) pero **su dominio de valores no está definido en ningún artefacto**. No se sabe si es {activo, eliminado}, {activo, suspendido} u otra cosa — y el plan excluye explícitamente la suspensión individual (VIS-01 §5). | Sin dominio de valores no se puede persistir el campo que CU-08 debe mostrar. | **Abierto** |
| **PER-H4** | Hueco menor | `DailyUsageCounter` está nombrada y acotada (por usuario, diaria, ≤30 días) pero **sus campos y su llave no están especificados** en ningún artefacto. | Detalle de diseño; se resuelve en la fase de modelo de datos, sin decisión de canon. | **Abierto** (bajo) |

> **Corrección de un falso hallazgo (honestidad §4.9).** En la conversación que originó este documento se afirmó que «`plan §4.14` no existe en este repositorio» y que el inventario de entidades carecía de fuente verificable. **Es falso:** §4.14 y §4.15 están en [`00_PLAN_CODEX_ORIGINAL.md`](../../00_PLAN_CODEX_ORIGINAL.md), la fuente primaria archivada en **SD-16**. El error vino de buscar en `PLAN-01_plan_proyecto.md`, que es otro artefacto. La regla de independencia (CLAUDE.md §0) **se cumple**: la fuente está dentro del repositorio.

---

## 9. Trazabilidad

| Tipo de elemento | Referencia | Relación con PER-01 |
|---|---|---|
| Fuente primaria | plan §4.14 (almacenamiento y retención), §4.15 (telemetría), §4.16 (variables de entorno) | Origen literal de las 7 entidades, las retenciones y los campos de telemetría |
| Requisito funcional | RF-13 (no persistencia), RF-15 (directorio), RF-18 (auditoría), RF-20 (registro mínimo), RF-22 (reinicio), RF-23 (revocación), RF-24 (eliminación en cascada) | Requisitos que el esquema debe satisfacer |
| Requisito no funcional | RNF-03 (no persistencia), RNF-08 (rol en servidor), RNF-09 (secretos fuera del cliente) | Restricciones de almacenamiento |
| Privacidad | PRIV-R1, R2, R3, R4, R6, R7, R10, R11, R12 | Gobiernan qué se guarda, quién lo ve y cuándo se borra |
| Regla de negocio | RN-01.3, RN-01.4, RN-02.7, RN-02.9, RN-03.2, RN-03.4, RN-03.5, RN-04.1, RN-04.2, RN-04.3, RN-04.4, RN-04.6, RN-07 | Reglas materializadas en el inventario |
| Requisito de calidad | RC-04 (security/minimización) | Ancla verificable: inspección de BD y logs |
| Decisión técnica | ADR-001-D2 (SQLite) | Motor de persistencia |
| Modelo de dominio | MD-01 (`Usuario`, `Consentimiento`, `CapsulaDePerfil`, `DisponibilidadDelChatbot`; `Conversacion`/`Mensaje` **sin** contraparte persistida) | Vocabulario; PER-01 no lo contradice |
| Casos de uso | ECU-02 (crea `User`), ECU-05 (crea `ConsentRecord` + cápsula), ECU-06 (crea `OperationalEvent`/`DailyUsageCounter`; **no** persiste contenido), ECU-04 (borra/revoca/cascada), ECU-08/09 (leen agregados), ECU-10 (escribe `PlatformSetting` + `AdministrativeAction`) | Quién crea, lee y borra cada entidad |
| Validación pendiente | **V6-a** (retención/ZDR de Groq) · **V6-b** (frontera legal, Ley 1581) | Fuera del alcance resoluble aquí |
| Consumidor futuro | Diseño de clases / modelo de datos (fase 2 tardía), migraciones Django (fase 3) | PER-01 es su insumo consolidado |

**Cadena:** `plan §4.14/§4.15 + PRIV-01 + ECU-XX → PER-01 (este) → modelo de datos → migraciones → pruebas de privacidad (RC-04)`.

---

## 10. Verificación aplicada

| Criterio | Resultado |
|---|---|
| Las 7 entidades coinciden **literalmente** con plan §4.14 | ✅ verificado contra `00_PLAN_CODEX_ORIGINAL.md` líneas 705–722 |
| Las exclusiones coinciden con plan §4.14 | ✅ `Conversation`/`Message`/`Diagnosis`/`RiskScore`/`PsychometricResult`/`Intervention` |
| Los campos de telemetría coinciden con plan §4.15 | ✅ 8 campos incluidos / 8 exclusiones declaradas |
| Cada fila del inventario tiene traza a un artefacto | ✅ §9; las derivaciones van marcadas [I2] |
| Cero requisitos nuevos introducidos | ✅ PER-01 consolida, no legisla |
| No se adelanta diseño (CLAUDE.md §6) | ✅ sin tipos, claves, índices, DDL ni diagrama de clases |
| Canon §5 respetado | ✅ minimización · no persistencia del chat · uso no punitivo · admin sin datos individuales |
| Honestidad §4.9 | ✅ ningún esquema fue implementado ni probado; falso hallazgo previo corregido en §8 |

### DoD de este artefacto
- [x] Ficha de encabezado completa (ID / Insumos / Consumidores / Hogar / Estado / Changelog).
- [x] Marcas de evidencia aplicadas ([E1]/[I2]/[P5]).
- [x] Trazabilidad sin afirmaciones huérfanas (§9).
- [x] Hallazgos abiertos declarados con ID (§8), no silenciados.
- [x] Canon de dominio verificado (§10).
- [ ] Revisión del usuario sobre **PER-H1** y **PER-H3** (bloquean el modelo de datos).

---

## 11. Cierre

- **Confirmado:** 7 entidades persistidas, **ninguna** con contenido conversacional; 3 de ellas con purga a 30 días; 1 sola (`InitialConversationProfile`) alcanza al proveedor LLM. El inventario tiene fuente primaria verificable dentro del repositorio (plan §4.14/§4.15).
- **Hallazgo más relevante:** **PER-H1** — la contradicción sobre `character` obligatorio vs. «continúa sin cápsula» debe resolverse **antes** del modelo de datos, porque cambia la cardinalidad `User–InitialConversationProfile` y el comportamiento de RF-22.
- **Recomendación:** resolver PER-H1 y PER-H3 con el usuario; PER-H2 puede esperar al diseño; PER-H4 es de detalle.
- **Pendiente (fuera de alcance):** el modelo de datos propiamente dicho, las migraciones y la tabla de endpoints (§4.9 del plan, ya diferida a ARQ-01 en SD-17).

**Fin de PER-01.**
