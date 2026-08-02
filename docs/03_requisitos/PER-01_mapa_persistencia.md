# PER-01 — Mapa de persistencia del MVP «Alan & Aura Académico»
**ID:** PER-01 · **Familia:** requisitos de datos · **Hogar:** `docs/03_requisitos/` · **Fecha:** 2026-08-01 · **Versión:** v1.3 (SD-30: granularidad de `OperationalEvent` fijada **por llamada**, y su §3.6 deja de reclamar las cuatro cifras de CU-09) · **Estado:** Propuesto.
**Insumos:** `00_PLAN_CODEX_ORIGINAL.md` §4.14 (almacenamiento y retención) y §4.15 (telemetría) — fuente primaria; PRIV-01 §2/§3 (inventario y requisitos de privacidad); **`ADR-002-D5`/`D6` (DynamoDB y S3)**, que superan a ADR-001-D2 (SQLite); MD-01 (vocabulario de dominio); ECU-02/04/05/06/08/09/10 (qué crea, lee y borra cada caso de uso); REQ-01 (RF-13/18/20/22/23/24, RNF-03/08/09).
**Consumidores:** análisis de robustez (`DR-XX`), diseño de clases y **modelo de datos** (fase 2 tardía), `ARQ-01` (diseño de claves e inventario físico, tras el CDR), construcción, pruebas de privacidad (RC-04), TRZ-01.
**Naturaleza:** **inventario consolidado de persistencia** — reúne en un solo lugar lo que hoy está disperso entre el plan, PRIV-01 y las ECU. **No es** diseño de esquema físico, ni modelo de clases, ni DDL: no fija tipos, claves, índices, tablas intermedias ni nombres de columnas. Esas decisiones pertenecen a la fase de diseño (CLAUDE.md §6, «no adelantar»). **No introduce requisitos nuevos**: todo lo que afirma está trazado a un artefacto existente.
**Marcas:** [E1] evidencia literal en un artefacto · [I2] interpretación o derivación del orquestador · [P5] propuesta a decidir.
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Honestidad (§4.9):** este documento se construyó **leyendo** los artefactos citados; ningún esquema fue implementado ni probado. Las filas marcadas [I2] son derivaciones, no hechos verificados. Los huecos detectados se declaran como **hallazgos abiertos** (§8), no se resuelven aquí.

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.3 | 2026-08-01 | J. Sánchez | **SD-30, hallazgos `H-1a` y `H-1b` de `DS-00`.** §3.6 decía que `OperationalEvent` era «la **única** fuente de las métricas agregadas» y enumeraba **las cuatro** de CU-09 — contradiciendo a `ECU-09` `RE-02`, que declara el total de cuentas y los onboardings como cardinalidades de `User`. Se **acota a las dos** que dependen de la ventana temporal. Y se fija la **granularidad**, que ningún artefacto había especificado: **un evento por llamada al proveedor**, no uno por conversación, porque `request_id`, `latencia` y código de estado son valores de una petición y `MET-07` mide peticiones sobre el total. Las llamadas que no llegan al proveedor —*kill switch*, límite de tasa— **no generan evento**. Sin cambios en el inventario: siguen siendo **7 entidades y 6 excluidas**. |
| v1.2 | 2026-08-01 | J. Sánchez | **SD-29: cambio de motor de persistencia** (`ADR-002`). SQLite → **DynamoDB**; aparece un **segundo almacén**, S3 versionado, para configuración, activos y respaldos. Nueva **§1.0 «Dónde vive cada cosa»**, que reparte lo ya inventariado entre los dos almacenes y declara la **caché de conversación como no-objetivo** —guardar pares mensaje→respuesta sería persistir el chat—. `PER-T5` gana instrumento nativo (expiración por tiempo de vida). Actualizada la fila de secretos. **Ninguna entidad nueva: siguen siendo 7 y 6.** `PER-H2` y `PER-H4` **siguen abiertos**: son diseño de esquema y su sitio es `ARQ-01`, posterior al CDR. **Nuevo hallazgo — `PER-H5` (contradicción de canon):** el respaldo en S3 que introduce esta misma versión escapa al borrado en cascada de `PER-T1`; ninguna regla vigente lo alcanza. Abierto, con implicación directa en `RF-24`; debe cerrarse en `ARQ-01` antes de cualquier uso con personas reales. |
| v1.1 | 2026-07-25 | J. Sánchez | **SD-26:** cierre de **PER-H1** (la cápsula siempre existe con `character` como mínimo; `character` reclasificado como precondición funcional ⇒ nueva **RN-01.6**) y de **PER-H3** (`estado` del directorio ∈ {activo, sin consentimiento vigente}, derivado de `ConsentRecord`). PER-H2 y PER-H4 siguen abiertos por decisión. Propagado a MV-01 v2.5, REQ-01 v1.4, PRIV-01 v1.4, ECU-04 v1.1, ECU-05 v1.1, ECU-08 v1.1. |
| v1.0 | 2026-07-25 | J. Sánchez | Creación (SD-25). Consolida el inventario de persistencia disperso en plan §4.14/§4.15, PRIV-01 §2 y las ECU; declara 4 hallazgos abiertos (PER-H1…PER-H4). |

---

## 1. Principio rector

**Se persiste lo mínimo para operar; el acompañamiento no deja rastro.** [E1]

El MVP guarda **7 entidades** y ninguna de ellas contiene lenguaje del usuario. El plan §4.14 lo fija de forma explícita y cerrada:

> **Entidades previstas:** `User` · `ConsentRecord` · `InitialConversationProfile` · `PlatformSetting` · `DailyUsageCounter` · `OperationalEvent` · `AdministrativeAction`.
> **No existirán:** `Conversation` · `Message` · `Diagnosis` · `RiskScore` · `PsychometricResult` · `Intervention`. [E1]

Motor: **DynamoDB** (`ADR-002-D5`), justificado porque el volumen es mínimo, el acceso es siempre por titular de cuenta o clave única, y *el chat no se persiste*. La no-persistencia es **requisito** (RF-13, RNF-03, PRIV-R2), no un efecto colateral de la elección de motor — y por eso **sobrevivió sin cambios** a la sustitución de SQLite por DynamoDB (`ADR-002` supera `ADR-001-D2`). [E1]

### 1.0 Dónde vive cada cosa

El cambio a una arquitectura sin servidor introduce un **segundo almacén**. Ninguna entidad nueva: solo se reparte lo que ya estaba inventariado. [E1]

| Almacén | Qué guarda | Fundamento |
|---|---|---|
| **DynamoDB** | Las **7 entidades** de §2, sin excepción ni añadido. Incluye el hash de contraseña (PER-T6). | `ADR-002-D5` |
| **S3 versionado** | **Configuración y activos, que no son dato de usuario**: plantillas de *system prompt* con su versión, textos de consentimiento y *disclosure* por versión, catálogo de `RecursoDeAyuda` y texto de contención del *fallback*, y banco de casos de evaluación. | `ADR-002-D6`, RNF-05, RC-10 |
| **S3 — respaldos** | **Sí contienen dato personal**, porque un respaldo de DynamoDB *es* el contenido de las 7 entidades. Se separan a propósito de la fila anterior: **no comparten régimen**. Ver `PER-H5`. | `ADR-002-D6`, PER-T1, PRIV-R11 |
| **Gestor de secretos / variables de entorno** | Clave de la API del proveedor del LLM y clave de firma de sesión. Nunca en el repositorio ni en el cliente. | RNF-09, PRIV-R12 |
| **Ningún almacén, nunca** | El contenido de la conversación. **Sin caché de respuestas del LLM**: guardar pares mensaje→respuesta *es* persistir el chat y viola PRIV-R2, RNF-03 y RF-13. Declarado como no-objetivo en `ADR-002-D6` para que no reaparezca en construcción como «optimización». | RF-13, RNF-03, PRIV-R2 |

**Lo que sí puede cachearse** sin tocar el canon: la configuración leída de S3, en la memoria del contenedor de la función entre invocaciones. No contiene dato de usuario y reduce latencia (RC-05). El **historial de la sesión en curso** (≤ 4 intercambios) no es caché ni persistencia: vive en la memoria del navegador y viaja en cada petición (`ADR-002 §2`). [E1]

### 1.1 Qué es y qué no es este documento

| Sí | No |
|---|---|
| Inventario de **qué** información sobrevive a la sesión y **por cuánto tiempo**. | Esquema físico, tipos, claves, índices, DDL o migraciones. |
| Reglas transversales que el esquema **deberá** cumplir (cascada, retención, segregación). | Diagrama de clases de diseño ni mapeo ORM. |
| Trazabilidad de cada dato a su regla, RF y caso de uso. | Requisitos nuevos: **cero** requisitos originales. |

---

## 2. Mapa general — las 7 entidades

> **Correspondencia con el modelo de dominio (añadida en el PDR-01).** Los nombres de esta columna son de **persistencia**, no del dominio, y **no** deben usarse en las especificaciones de casos de uso, que hablan el vocabulario de `MD-01 v1.4`:
> `User` = `Usuario` · `ConsentRecord` = `Consentimiento` · `InitialConversationProfile` = `CapsulaDePerfil` · `PlatformSetting` = `DisponibilidadDelChatbot` · `DailyUsageCounter` = `ContadorDeUsoDiario` · `OperationalEvent` = `EventoOperativo` · `AdministrativeAction` = **sin clase de dominio**, por decisión declarada (auditoría de operación, no concepto del problema).
> Usar `ConsentRecord` en una especificación fue el hallazgo **D-11**, corregido en `ECU-08`.

| # | Entidad | Qué guarda | Origen (CU que la crea) | Va al LLM | Retención |
|---|---|---|---|---|---|
| 1 | `User` | Cuenta, rol, declaración de adultez | CU-02 «Registrar cuenta» | **No** | Hasta eliminación o cierre **+ 30 días** [E1] |
| 2 | `ConsentRecord` | Consentimiento otorgado/revocado, **por capas** (base y personalización) | CU-05; **CU-12** revoca la de personalización | **No** | Igual que la cuenta [E1] |
| 3 | `InitialConversationProfile` | La **cápsula** (`ContextoInicialConversacionalV1`) | CU-05 (paso 8) + **CU-14** escribe `character` | **Sí** (único) | Hasta reinicio, revocación o eliminación [E1] |
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
| `estado` ∈ {activo, sin consentimiento vigente} | [E1] | RN-03.2, RF-15, PRIV-R10 (SD-26) | **Derivado** de `ConsentRecord`, no editable ni almacenado aparte; **no** es suspensión (fuera de alcance, VIS-01 §5). Resuelto en **PER-H3** |

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
- **La cápsula siempre existe** al terminar el onboarding, con `character` como contenido mínimo (**RN-01.6**, SD-26). `character` no es un autorreporte de perfil sino la **elección de interlocutor** —precondición funcional del chat, del mismo rango que el consentimiento—, por eso su obligatoriedad no contradice la minimización. La cardinalidad `User–InitialConversationProfile` es, por tanto, **1 a 1 tras el onboarding** (0 antes). [E1]
- **Sin *defaults*** para los campos omitidos: la cápsula se arma solo con lo respondido (RN-01.3, FA-01/FA-02 de ECU-05). Un campo omitido **no se guarda**; no se guarda vacío ni con valor por defecto. Omitir los 4 autorreportes deja la cápsula con **un solo campo de contenido**. [E1]
- **Ningún autorreporte es obligatorio** (RN-01.4, precisada en SD-26): el usuario puede omitir los cuatro sin perder el acceso al chat.
- El valor persistido de `character` es la **última elección** y actúa como predeterminado; el personaje es **cambiable por sesión** (RN-02.6) sin reescribir la cápsula. [E1]
- **Reiniciar la caracterización borra también `character`** ⇒ el usuario queda sin poder conversar hasta rehacer CU-05 (**CU-11**, que en el PDR-01 dejó de ser un flujo alternativo de ECU-04 y pasó a caso de uso propio; RF-22). Consecuencia deliberada de RN-01.6. [E1]
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

Es la **única** fuente de las **dos cifras de CU-09 que dependen de la ventana temporal** —llamadas al chat en 7 días y tasa técnica de éxito/error—, y por eso la ventana consultada (7) nunca puede exceder su retención (**30 días**). Las otras dos cifras del administrador, total de cuentas y onboardings completados, **no salen de aquí**: son **cardinalidades de `User`**, como `ECU-09` `RE-02` ya declaraba.

> **Corregido en `v1.3` (SD-30, hallazgo `H-1b`).** Esta línea decía «única fuente de las métricas agregadas» y enumeraba **las cuatro**, lo que contradecía a `ECU-09` `RE-02` desde que se escribió. Se acota a las dos que le corresponden. En la misma pasada se precisa la **granularidad**, que ningún artefacto había fijado: se escribe **un `OperationalEvent` por llamada al proveedor** —no uno por conversación—, porque `request_id`, `latencia` y código de estado son valores de una petición y `MET-07` mide peticiones sobre el total (`H-1a`, ver `ECU-06 §7` y `DR-06`). Las llamadas que **no llegan al proveedor** —*kill switch*, límite de tasa— **no generan evento**: no son peticiones y no pueden entrar en el denominador.

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
| Contraseña en claro, clave de la API del proveedor del LLM, clave de firma de sesión | Gestor de secretos / variables de entorno | RNF-09, PRIV-R12, plan §4.16, ADR-002-D7 [E1] |

> **Alcance de PRIV-R2:** «no se persiste **en BD ni en logs**». La prohibición cubre el *logging* de aplicación, no solo el modelo de datos. Un `logger.info(mensaje_usuario)` viola PRIV-R2 igual que una tabla `Message`. [E1]

**Composición en el dominio.** MD-01 modela `Conversacion *-- Mensaje` como **composición** precisamente por esto: los mensajes no se comparten y mueren con la conversación (MD-01 §4). El modelo de dominio ya codifica la no-persistencia; el modelo de datos solo debe no contradecirla. [E1]

---

## 5. Reglas transversales que el esquema deberá cumplir

| ID | Regla | Traza |
|---|---|---|
| **PER-T1** | **Borrado en cascada:** eliminar `User` suprime `ConsentRecord` + `InitialConversationProfile` + `DailyUsageCounter` de ese usuario. **Desde `ADR-002` esta regla tiene un hueco declarado**: no alcanza a los **respaldos** en S3 ni a las versiones anteriores de los objetos versionados — ver `PER-H5`, abierto. | PRIV-R11, RN-04.4, RF-24, **primer criterio de aceptación de ECU-04 v2.0** —se cita en prosa porque la renumeración del PDR-01 cambió los identificadores— [E1] |
| **PER-T2** | **No reidentificación de la telemetría:** `OperationalEvent` y `AdministrativeAction` no deben permitir reconstruir qué hizo un usuario concreto (no llevan alias ni username; plan §4.15). | plan §4.15, PRIV-R10 [E1] |
| **PER-T3** | **Segregación del administrador:** ninguna consulta administrativa puede alcanzar `InitialConversationProfile`, contenido, respuestas de encuesta, personaje elegido ni conteos por usuario. | PRIV-R7, PRIV-R10, RN-03.5 [E1] |
| **PER-T4** | **Directorio truncado:** CU-08 expone únicamente alias, **ID truncado**, fecha de registro, **`estado` ∈ {activo, sin consentimiento vigente}** (derivado, no almacenado aparte) y flag de onboarding. | RN-03.2, RF-15, SD-26 [E1] |
| **PER-T5** | **Purga por ventana:** retenciones heterogéneas (30 días para contadores y eventos; vigencia para cuenta) exigen un mecanismo de purga programada, no solo un campo de fecha. **Desde `ADR-002-D5` existe instrumento nativo** —la expiración por tiempo de vida de DynamoDB—, lo que convierte esta exigencia en configurable en lugar de programable a mano. La regla no cambia; gana mecanismo. | plan §4.14, ADR-002-D5 [I2] |
| **PER-T6** | **Hash de contraseña** en almacenamiento; jamás en claro, en el cliente ni accesible al admin. | PRIV-R12, RNF-09 [E1] |
| **PER-T7** | **Reinicio ≠ revocación:** «reiniciar caracterización» (RF-22) **borra** la cápsula; «revocar personalización» (RF-23) hace que **deje de alimentar** la conversación. Son dos operaciones distintas sobre estados distintos. | RN-04.3, RN-07, **ECU-11 y ECU-12** — antes flujos alternativos de ECU-04, hoy casos de uso propios [E1] |

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
| **PER-H1** | Contradicción | **FA-01 de ECU-05** decía que quien omite la caracterización «continúa **sin cápsula** de preferencias» y elige personaje en el paso 8; pero `character` es campo **obligatorio** de la cápsula (RN-01.3, PRIV-01 §2) y **RN-01.4** afirmaba que ningún campo de perfil es obligatorio salvo edad y consentimiento. Las tres afirmaciones no podían ser simultáneamente ciertas. | Definía la cardinalidad `User–InitialConversationProfile` y el borrado de RF-22. | **Resuelto (SD-26).** La cápsula **siempre existe** tras el onboarding, con `character` como contenido mínimo. `character` se reclasifica como **precondición funcional** (elección de interlocutor), no como autorreporte de perfil ⇒ **RN-01.4 precisada** y **RN-01.6 añadida** (MV-01 v2.5). Cardinalidad: **1 a 1 tras el onboarding**. Consecuencia aceptada: reiniciar la caracterización inhabilita el chat hasta rehacer CU-05. **No reabre SD-22**: lo que recibe el LLM (RN-01.3) queda intacto. Propagado a REQ-01 v1.4, PRIV-01 v1.4, ECU-04 v1.1, ECU-05 v1.1 (RA-04). |
| **PER-H2** | Ambigüedad | RF-24 exige que tras eliminar la cuenta «no quede dato asociado recuperable», pero plan §4.14 fija «hasta eliminación o cierre **+ 30 días**». Ya registrada como RA-01 en ECU-04 §21. | Define si la eliminación es borrado físico inmediato o borrado lógico con purga diferida — y por tanto si el esquema necesita marca de baja. | **Abierto por decisión (SD-26):** se resuelve en construcción, cuando se sepa si el hosting hace respaldos. No bloquea robustez. |
| **PER-H3** | Hueco | El campo **`estado`** del usuario aparecía en el directorio administrativo (RN-03.2, RF-15, plan §4.9) pero **su dominio de valores no estaba definido en ningún artefacto**. No se sabía si era {activo, eliminado}, {activo, suspendido} u otra cosa — y el plan excluye explícitamente la suspensión individual (VIS-01 §5). | Sin dominio de valores no se podía mostrar el campo que CU-08 exige. | **Resuelto (SD-26).** `estado` ∈ **{activo, sin consentimiento vigente}**, **derivado** de `ConsentRecord` — **no** es un campo editable, ni almacenado aparte, ni una suspensión. Es lo único operativamente útil para el admin sin exponer dato sensible (compatible con PRIV-R10). Propagado a REQ-01 v1.4 (RF-15), PRIV-01 v1.4 (PRIV-R10), ECU-08 v1.1. |
| **PER-H4** | Hueco menor | `DailyUsageCounter` está nombrada y acotada (por usuario, diaria, ≤30 días) pero **sus campos y su llave no están especificados** en ningún artefacto. | Detalle de diseño; se resuelve en la fase de modelo de datos, sin decisión de canon. | **Abierto por decisión (SD-26):** puro detalle de diseño. No bloquea robustez. |
| **PER-H5** | **Contradicción — canon** | `ADR-002-D6` crea un **segundo lugar donde vive el dato personal**: el respaldo exportado en S3. Ninguna regla vigente lo alcanza. `PER-T1` y `PRIV-R11` enumeran el borrado en cascada sobre `ConsentRecord`, `InitialConversationProfile` y `DailyUsageCounter` — escritas cuando no había respaldos—. Y el **versionado**, que `ADR-002-D6` adopta por sus ventajas sobre los textos legales, significa que **borrar un objeto no lo borra**: sobreviven las versiones anteriores. | Define la retención y el borrado de los respaldos, y si el versionado se aplica al mismo contenedor que los datos personales o solo al de configuración. Sin eso, un usuario puede ejercer `RF-24` («no queda dato asociado recuperable») y sus datos **seguir existiendo** en el respaldo. | **ABIERTO — nuevo en SD-29.** Es el hueco de canon que abre esta pasada y **se declara en vez de disimularse**. No bloquea los diagramas de secuencia (no toca comportamiento), pero **debe cerrarse antes de cualquier uso con personas reales**, junto con `V6-b`. Su sitio es `ARQ-01`. |

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
| Decisión técnica | `ADR-002-D5` (DynamoDB) y `ADR-002-D6` (S3), que superan a ADR-001-D2 | Motor de persistencia y almacén de configuración |
| Modelo de dominio | MD-01 (`Usuario`, `Consentimiento`, `CapsulaDePerfil`, `DisponibilidadDelChatbot`; `Conversacion`/`Mensaje` **sin** contraparte persistida) | Vocabulario; PER-01 no lo contradice |
| Casos de uso | ECU-02 (crea `User`), ECU-05 (crea `ConsentRecord` + cápsula), ECU-11 (borra la cápsula entera), ECU-12 (revoca la capa de personalización y marca los autorreportes para descarte), ECU-06 (crea `OperationalEvent`/`DailyUsageCounter`; **no** persiste contenido), ECU-04 (borra/revoca/cascada), ECU-08/09 (leen agregados), ECU-10 (escribe `PlatformSetting` + `AdministrativeAction`) | Quién crea, lee y borra cada entidad |
| Validación pendiente | **V6-a** (retención/ZDR de Groq) · **V6-b** (frontera legal, Ley 1581) | Fuera del alcance resoluble aquí |
| Consumidor futuro | Diseño de clases / modelo de datos (fase 2 tardía), `ARQ-01` y construcción (fase 3) | PER-01 es su insumo consolidado |

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
- [x] Revisión del usuario sobre **PER-H1** y **PER-H3** — **resueltas en SD-26** y propagadas a MV-01, REQ-01, PRIV-01, ECU-04/05/08.

---

## 11. Cierre

- **Confirmado:** 7 entidades persistidas, **ninguna** con contenido conversacional; 3 de ellas con purga a 30 días; 1 sola (`InitialConversationProfile`) alcanza al proveedor LLM. El inventario tiene fuente primaria verificable dentro del repositorio (plan §4.14/§4.15).
- **Hallazgos cerrados (SD-26):** **PER-H1** — la cápsula siempre existe con `character` como mínimo; cardinalidad `User–InitialConversationProfile` = **1 a 1 tras el onboarding**. **PER-H3** — `estado` ∈ {activo, sin consentimiento vigente}, derivado de `ConsentRecord`. Ambas se resolvieron **antes** del análisis de robustez, para que `DR-04`/`DR-05`/`DR-06` no hereden la contradicción.
- **Hallazgos abiertos:** `PER-H2`, `PER-H4` y **`PER-H5`, nuevo**. Sobre `PER-H2`: `ADR-002-D6` resuelve **dónde** viven los respaldos, pero la pregunta de fondo —si la eliminación es borrado físico inmediato o lógico con purga diferida, y por tanto si el esquema necesita marca de baja— **sigue abierta**, y ahora arrastra a `PER-H5`. `PER-H4` (campos y llave de `ContadorDeUsoDiario`) igual. Los tres son diseño de esquema y su sitio es `ARQ-01`; ninguno bloquea los diagramas de secuencia. **`PER-H5` es el único con implicación de canon**: hasta cerrarlo, `RF-24` y `PRIV-R11` no se cumplen de extremo a extremo.
- **Pendiente (fuera de alcance):** el modelo de datos propiamente dicho, el **diseño de claves de DynamoDB**, el inventario físico de S3 y la tabla de endpoints (§4.9 del plan, diferida a `ARQ-01` desde SD-17). `ARQ-01` llega **después del diagrama de clases de diseño y de su CDR**, no antes: fijar claves mientras el diagrama de clases aún puede mover atributos y operaciones garantiza retrabajo (`ADR-002 §1`).

**Fin de PER-01.**
