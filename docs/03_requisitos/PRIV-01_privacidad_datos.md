# PRIV-01 — Privacidad y manejo de datos del MVP
**ID:** PRIV-01 · **Hogar:** `docs/03_requisitos/` · **Fecha:** 2026-07-16 · **Versión:** v1.3 (SD-22: cápsula = `ContextoInicialConversacionalV1` de 5 campos + 2 metadatos en el inventario §2 y PRIV-R1; PRIV-R9 intacta; SD-15: cuenta, contadores operativos y qué NO ve el admin; SD-17: inventario mapeado 1:1 a las 7 entidades exactas del plan).
**Insumos:** canon de dominio; MV-01 §Onboarding y §Cuenta (cápsula/consentimiento/cuenta); ADR-001-D2 (SQLite); plan §3.4 (exclusiones al LLM), §3.7 (qué no ve el admin); Ley 1581/2012 + Decreto 1377/2013 (citadas, no reproducidas).
**Consumidores:** REQ-01 (RNF-03/04, RC-04), SEG-01, TRZ-01.
**Naturaleza:** requisitos de privacidad y minimización. **Honestidad §4.9:** la validación de frontera legal (Ley 1581) es **nivel 6** — se formula, no se resuelve aquí (V6-b).

---

## 1. Principio rector
**Minimización antes que funcionalidad.** El MVP recolecta y expone el **mínimo** dato necesario para acompañar; ante la duda, no se recolecta. La información de bienestar **nunca** se usa con fines punitivos ni se divulga más allá de lo estrictamente necesario.

## 2. Inventario de datos (qué se maneja y con qué alcance)
Mapeado 1:1 a las **entidades exactas del plan** (§4.14): `User` · `ConsentRecord` · `InitialConversationProfile` · `PlatformSetting` · `DailyUsageCounter` · `OperationalEvent` · `AdministrativeAction`.

| Dato | Entidad (plan) | Se recolecta | Se persiste | Va al LLM | Retención |
|---|---|---|---|---|---|
| **Cuenta** (username, alias, contraseña hasheada, rol) | `User` | Sí | Sí | **No** | Hasta eliminación de cuenta (+ 30 días, plan §4.14) |
| Declaración de edad (≥18) + versión de disclosure | `User` | Sí (booleana) | Sí | **No** | Igual que cuenta |
| Consentimiento (otorgado/revocado + fecha) | `ConsentRecord` | Sí | Sí | **No** | Igual que cuenta |
| Cápsula (`ContextoInicialConversacionalV1`): `mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style` (autorreportes opcionales), `character` (obligatorio) + metadatos `schema_version`/`consent_version` | `InitialConversationProfile` | Opcional (los 4 autorreportes; `character` obligatorio) | Sí (asociada al usuario) | **Sí** (los 5 campos con valor + metadatos) | Hasta reinicio, revocación o eliminación |
| **Contenido de la conversación (mensajes)** | *(no existe entidad — plan excluye `Conversation`/`Message`)* | En memoria de sesión | **No (nunca)** | Turno actual + hasta 4 intercambios de la sesión | **Se descarta al cerrar** |
| Contador diario de uso (llamadas/día por usuario) | `DailyUsageCounter` | Sí | Sí | **No** | Máx. 30 días (plan §4.14) |
| Evento técnico (latencia, modelo, versión de prompt, estado — **sin contenido**) | `OperationalEvent` | Sí | Sí | **No** | 30 días; base de las métricas **agregadas** del admin |
| Estado de disponibilidad del chatbot (kill switch) | `PlatformSetting` | Sí (admin) | Sí | **No** | Vigencia |
| Acción administrativa (quién/cuándo activó el kill switch) | `AdministrativeAction` | Sí (automático) | Sí | **No** | Vigencia del curso + 30 días |
| Biomarcadores / diario / ítems clínicos / diagnóstico / puntaje de riesgo | *(no existe entidad — plan excluye `Diagnosis`/`RiskScore`/`PsychometricResult`/`Intervention`)* | **No** | **No** | **No** | N/A (fuera de alcance) |
| Recursos de ayuda / textos / parámetros del gate | *(configuración de entorno, no entidad de negocio)* | Sí (**por entorno**, no admin) | Sí (config de entorno) | **No** | Vigente por entorno |

## 3. Requisitos de privacidad
| ID | Requisito | Traza |
|---|---|---|
| PRIV-R1 | El LLM recibe **solo** la cápsula (`ContextoInicialConversacionalV1`: 5 campos de contenido + `schema_version`/`consent_version`) + hasta 4 intercambios de la sesión actual + el turno; **nunca** historial de sesiones previas. | RN-03, RN-02.2, RNF-04, RC-04, plan §3.4 |
| PRIV-R2 | El contenido del chat **no** se persiste en BD ni en logs. | RN-04, RNF-03 |
| PRIV-R3 | El consentimiento es granular y **revocable**; al revocar cesa el uso de la cápsula y se marca para descarte. | RN-07, RN-01.5 |
| PRIV-R4 | No se recolectan datos de categorías especiales (salud detallada, biomarcadores, menores). | canon, SD-08 | 
| PRIV-R5 | Divulgación mínima: solo el fallback de seguridad expone recursos externos; ningún dato del usuario se comparte con terceros salvo el turno al LLM. | RN-08, canon |
| PRIV-R6 | Uso no punitivo: los datos de bienestar no alimentan evaluación, ranking ni sanción. | RN-08 |
| PRIV-R7 | El administrador no accede a cápsulas ni conversaciones. | RN-03.5 |
| PRIV-R8 | *Disclosure* y consentimiento preceden a cualquier captura y a la primera conversación. | RN-09, RF-01 |
| PRIV-R9 | El LLM **no** recibe: username, alias, ID, rol, contraseña, historial previo a la sesión, puntajes, datos biométricos/laborales/clínicos, campos no respondidos, inferencias, fecha de registro ni métricas. | RN-03, plan §3.4 |
| PRIV-R10 | El administrador ve solo **agregados** y el **directorio truncado** (alias, ID truncado, estado, onboarding); nunca contenido, respuestas de encuesta, personaje elegido ni conteos por usuario. | RN-03.2/.3/.5 |
| PRIV-R11 | La **eliminación de cuenta** borra en **cascada** todos los datos asociados (cápsula, consentimiento, contadores del usuario). | RN-04.4 |
| PRIV-R12 | La contraseña se almacena **hasheada**; nunca en claro, en el cliente ni accesible al admin. | RNF-09, plan §3.7 |

## 4. Seguridad mínima de datos (proporcional al MVP)
- Autenticación del administrador por **login separado** (RF-14); acceso administrativo limitado a las 3 funciones; rol validado en servidor (RNF-08).
- **Contraseñas hasheadas** (nunca en claro); claves/tokens fuera del cliente y del repo (RNF-09).
- Cápsula asociada al usuario, sin datos de contacto innecesarios; **eliminación en cascada** al borrar la cuenta.
- Transporte HTTPS hacia el LLM; la clave de API vive en configuración por entorno, no en código (ADR-001-D6).
- Sin analítica de terceros ni *trackers* en el flujo emocional.

## 5. Frontera legal (pendiente nivel 6 — V6-b)
El diseño **se alinea** con los principios de la **Ley 1581/2012** y el **Decreto 1377/2013** (finalidad, consentimiento, datos sensibles, seguridad), pero:
> **La validación jurídica de la frontera de datos y del texto de consentimiento requiere un experto legal (nivel 6).** PRIV-01 formula la solicitud; **no** la resuelve. El texto de consentimiento (aprovisionado **por entorno**) debe revisarse antes de cualquier uso con personas reales. La política de **retención de Groq** debe verificarse antes del release (V6-a).

## 6. Trazabilidad
`canon + Ley 1581 + plan §3.4/§3.7 → PRIV-R1..R12 → RNF-03/04/08/09 + RC-04 + SEG-01 → NORM-01 (security/safety) → TRZ-01`.

## 7. Cierre
- **Decisiones confirmadas:** minimización estricta, no persistencia del chat, no categorías especiales, no menores.
- **Recomendaciones:** revisión legal del consentimiento antes de piloto con personas reales.
- **Supuestos:** el identificador de sesión de prueba no constituye dato sensible.
- **Pendientes:** V6-b (validación legal).

**Fin de PRIV-01.**
