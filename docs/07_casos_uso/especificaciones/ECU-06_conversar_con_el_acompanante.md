# ECU-06 — Especificación de caso de uso: «Conversar con el acompañante» (CU-06)
**ID documento:** DOC-CU-06 · **Caso de uso:** CU-06 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Alias en DCU-01:** `CU_Chat` · **Fecha:** 2026-08-01 · **Versión:** v2.2 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23) — caso de uso **central y canon-sensible** (conversación gobernada, minimización, no persistencia, gate de seguridad).
**Insumos:** DCU-01 v2.1, MV-01 §Vista Conversación, MD-01 v1.4, REQ-01 (RF-07…RF-11, RF-13, RF-25, RF-26), contrato conversacional, SEG-01, PRIV-01, plan §3.4/§4.9/§4.10/§4.11/§4.13. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-06 |
| Versión | v2.1 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-08-01 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v2.2 | 2026-08-05 | J. Sánchez | **`SD-45`, fila 34 del tablero — enrutado a `/use-case-specifier` por ser la dueña de las `ECU`.** `FE-07` declaraba «**Vuelve** al paso 4» pero su respuesta —«informa sin romper la interfaz»— **no declaraba ningún mecanismo** que llevara allí: nada reconstruía el contexto ni reintentaba, así que el desenlace no era alcanzable con lo que la propia fila describe. Pasa a **paso 2**, y se hace explícito el mecanismo que sí existe: la interfaz queda viva y el Usuario reenvía. **Lo confirma `CA-06`**, que para `FE-07` exige «permite reintento sin romperse» — el reintento *del Usuario por la interfaz*, no el automático del Sistema, que solo `FE-06` declara («máx. 1 reintento») y que `DS-06` realiza con `reintentarUnaVez()`. Y lo confirma el diseño: un reintento automático tras 20 s duplicaría la espera que **`RN-02.9`** acota. **`FE-06` no se toca.** Barridas las **once** filas `FA`/`FE` por concepto —desenlace declarado sin mecanismo que lo realice—: `FE-07` era la única. Las demás o terminan, o vuelven al paso 2, que es una **acción del Usuario** siempre alcanzable con la interfaz viva. |
| v2.1 | 2026-08-01 | J. Sánchez | **SD-30, hallazgos `H-1a` y `H-2` de `DS-00`.** El `EventoOperativo` pasa de crearse **al cerrar** (paso 8) a crearse **en cada turno** (paso 6), tras mostrar la respuesta: sus campos —latencia, resultado, modelo, versión— son valores **de una llamada**, y `MET-07` mide peticiones, no conversaciones. Afecta a §7, §11 (pasos 6 y 8), §14, §16 `RE-07` y §18. Se **unifica la nomenclatura de campos**, que este documento llevaba en dos listas incompatibles: manda el plan §4.15, que distingue «resultado técnico» de «código de estado» como campos distintos; el «estado» de §14/§16 era el **resultado**, y los tres campos restantes del plan son de persistencia (`PER-01 §3.6`). Y se hace explícito que el **paso 3 del plan §4.11** («verificar mayoría de edad») quedó **absorbido en `PRE-03`** — estaba cubierto, no dicho (`H-2`). |
| v2.0 | 2026-07-30 | J. Sánchez | **PDR-01, fase D.3, tanda 1.** El flujo alternativo «Cambiar de personaje» sale a **CU-13** vía `<<extend>>`, y los dos restantes se renumeran. Se añade **FE-09** para la capa base del consentimiento retirada, que cierra el hallazgo D-01. El límite por mensaje pasa de 1.500 a **2.500 caracteres** y el criterio que lo verificaba se parte en dos, uno por disparador (D-08). Se declara `Consentimiento` como concepto del dominio de este CU, y se define localmente toda regla citada. |
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |

## 2. Entradas esperadas
| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Conversación (familia RN-02.1…RN-02.9) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`Conversacion`, `Mensaje`, `Personaje`, `CapsulaDePerfil`, `Consentimiento`, `DisponibilidadDelChatbot`, `EventoDeSeguridad`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Chat` | Disponible |
| Caso de uso seleccionado | CU-06 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Actor secundario | Proveedor LLM (Groq), sistema externo | Disponible |
| Reglas de negocio | Familia RN-02.1…RN-02.9; RN-05; RN-07; contrato C-1…C-10. Las familias de administración y de cuenta se consultan pero **no gobiernan** este CU | Disponible |
| Requisitos funcionales | RF-07…RF-11, RF-13, RF-25, RF-26 (RF-12 pasa a CU-13) | Disponible |
| Requisitos especiales | RNF-03/04/06/08/09/10, RC-04/05/07/08, PRIV-R1/R2/R9 | Disponible |
| Restricciones | Canon: minimización, no persistencia, seguridad > engagement | Disponible |
| Prototipos / GUI | Interfaz de chat | [Pendiente] (fase de construcción) |

## 3. Identificación
| Campo | Valor |
|---|---|
| ID | CU-06 |
| Nombre | Conversar con el acompañante |
| Paquete funcional | Acompañamiento |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Alta |
| Criticidad | **Alta** (gobierno del LLM, minimización, seguridad emocional) |
| Estado | Propuesto |

## 4. Propósito
| Campo | Descripción |
|---|---|
| Objetivo | Sostener un diálogo de acompañamiento con **Alan** o **Aura**, gobernando el LLM (cápsula + persona + guardas) y evaluando un **gate de seguridad en cada mensaje**, con minimización y sin persistencia. |
| Descripción breve | El usuario intercambia mensajes con el personaje; el sistema evalúa el gate, construye un contexto mínimo, invoca al LLM, aplica guardas de salida y descarta el contenido al cerrar. |
| Valor funcional | Entrega el núcleo del MVP —acompañar con seguridad— demostrando gobierno del LLM y protección de datos. |
| Resultado observable | El usuario recibe respuestas coherentes de personaje; ante peligro explícito se activa el *fallback* (CU-07); al cerrar no queda registro del diálogo. |

## 5. Actores
| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Persona ≥18 con consentimiento vigente | Elige personaje, envía y recibe mensajes, cierra la conversación |
| Sistema externo | Proveedor LLM (Groq) | Genera el texto de la respuesta, **bajo el gobierno del sistema** (cápsula + guardas + gate) | Recibe el contexto mínimo y devuelve texto; no inicia el CU ni decide de forma autónoma |
| Stakeholder relacionado | Rol Calidad | Vela por coherencia de personaje y umbrales (RC-05/07/08) | Define pruebas |

## 6. Alcance y contexto
| Campo | Valor |
|---|---|
| Alcance funcional | Conversación Alan/Aura v1 con LLM gobernado, gate de seguridad, límites y degradación con gracia. |
| Límite del sistema | El sistema gobierna al LLM; **no** le entrega historial bruto ni datos identificatorios. |
| Incluye | Gate de seguridad por mensaje, construcción del contexto mínimo, guardas de salida, límites de sesión, manejo de errores del LLM. |
| Excluye | Persistencia del chat, historial de sesiones previas, diagnóstico, escalamiento graduado S0-S5. |
| Suposiciones | El usuario completó el onboarding (CU-05) y el chatbot está habilitado (CU-10). |

## 7. Modelo de dominio involucrado
| Concepto/clase | Descripción | Participación | Atributos (reserva) | Relaciones |
|---|---|---|---|---|
| Conversacion | Sesión efímera de acompañamiento (no persiste) | Se abre y se descarta | estado ∈ {activa, cerrada} | Usuario–Conversacion (mantiene); Conversacion*--Mensaje |
| Mensaje | Turno dentro de la conversación | Se intercambia | — | Conversacion*--Mensaje; Mensaje–EventoDeSeguridad |
| Personaje (Alan, Aura) | Estilo de acompañamiento | Conduce la conversación | — | Conversacion–Personaje (acompañada por) |
| CapsulaDePerfil | Resumen mínimo (`ContextoInicialConversacionalV1`) | Orienta la conversación (vía LLM) | mood_self_report, energy_self_report, conversation_goal, response_style, character (+ schema_version, consent_version) | CapsulaDePerfil–Conversacion (orienta) |
| DisponibilidadDelChatbot | Estado global habilitado/deshabilitado | Condiciona el inicio | estado | DisponibilidadDelChatbot–Conversacion (condiciona) |
| `EventoDeSeguridad` | Ocurrencia de peligro explícito | Documenta lo detectado en un `Mensaje` | — | `Mensaje -- EventoDeSeguridad : se documenta con` |
| `Consentimiento` | Aceptación granular por capas y revocable | **Se consulta**: la capa base condiciona el acceso; la de personalización, si los autorreportes orientan | capa ∈ {base, personalizacion}, estado | `Usuario -- Consentimiento : otorga` |
| `EventoOperativo` | Telemetría **sin contenido** de **una llamada** al Proveedor LLM | Se **crea en cada turno** (paso 6), tras mostrar la respuesta | momento, resultado, latencia, modelo, versión | `Conversacion -- EventoOperativo : se documenta con` |

**Control terminológico**

| Término oficial | Significado | Prohibidos | Observación |
|---|---|---|---|
| Conversacion | Sesión efímera; **no** persiste | «chat guardado», «historial» | RF-13 |
| CapsulaDePerfil | Contexto mínimo al LLM | «historial bruto», «perfil completo» | PRIV-R1 |
| Gate de seguridad | Filtro determinista de peligro explícito | «clasificador clínico» | Mecanismo (SEG-01), **no** clase de dominio |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Se usa por calidez en el nombre de este caso de uso y en la interfaz; el término trazable al dominio es `Personaje` |
| Capa del `Consentimiento` | `base` o `personalizacion` | prohibido: «consentimiento» a secas al hablar de revocar | La **base** habilita conversar; la de **personalización**, que la cápsula oriente |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| `<<extend>>` | CU-07 Derivar ante peligro | Es extendido por | Ante peligro explícito, el flujo se **desvía** al *fallback* determinista (condicional, puede no ocurrir, observable). Coherente con DCU-01. |
| Dependencia funcional | CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | Depende de | Requiere la capa base del consentimiento y una cápsula con `character`. |
| Dependencia funcional | CU-10 Habilitar/deshabilitar el chatbot | Condicionado por | Si el chatbot está deshabilitado, no se inicia (409). |
| `<<extend>>` | CU-13 «Cambiar de acompañante» | **Es extendido por** | Comportamiento **opcional que el Usuario pide deliberadamente**; este CU se completa sin él; el cambio de tono es observable; y extraerlo hace visible RF-12, que estaba sepultado como flujo alternativo. |
| Dependencia funcional | CU-12 «Revocar la personalización» | Consume su efecto | Si la capa de personalización está revocada, la cápsula **no orienta** la conversación y este CU sigue funcionando. |
| `<<include>>` | — | — | Ninguno. El gate, la construcción del contexto y la invocación al LLM son **comportamiento interno**, no subservicios observables compartidos (DCU-01). |

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → 401) |
| PRE-02 | El rol es «usuario» validado en servidor. | Autorización | Sí (si no → 403) |
| PRE-03 | El Usuario es adulto y tiene vigente la **capa base** del `Consentimiento`. | Negocio | Sí (si no → `FE-09`) |
| PRE-03.1 | La **capa de personalización** puede estar otorgada o revocada. **No condiciona el acceso**: si está revocada, la conversación transcurre sin que la cápsula la oriente. | Negocio | Sí |
| PRE-04 | El chatbot está **habilitado** (kill switch, DisponibilidadDelChatbot). | Negocio | Sí (si no → 409) |
| PRE-05 | El Usuario no ha superado los límites de tasa (3/min, 30/día). | Datos | Sí (si no → 429) |

## 10. Disparador
| Campo | Valor |
|---|---|
| Evento inicial | El Usuario envía un mensaje al personaje (Alan o Aura) en una conversación abierta. |
| Generado por | Actor (Usuario). |
| Condición inicial observable | El sistema recibe el turno y comienza a evaluarlo (gate) antes de responder. |

## 11. Flujo básico / curso normal
> Nivel caja negra funcional. El detalle interno de 18 pasos (plan §4.11) se refleja en el diagrama de secuencia **DS-06** (planificado), no aquí.

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Usuario | Elige personaje (Alan/Aura) e inicia la conversación | Conversacion, Personaje | Abre la `Conversacion` (chatbot habilitado) | Interfaz de chat |
| 2 | Usuario | Escribe y envía un `Mensaje` (≤2.500 caracteres) | `Mensaje` | Comprueba la longitud y la estructura del turno | Interfaz de chat |
| 3 | Sistema | Evalúa el **gate de seguridad determinista** sobre el `Mensaje` **antes** de responder | EventoDeSeguridad (posible) | Decide {no-peligro / peligro-explícito} | — |
| 4 | Sistema | (no-peligro) Construye el **contexto mínimo** —`character` siempre, los **cuatro autorreportes** de la cápsula solo si la capa de personalización está otorgada, persona, hasta 4 intercambios de la sesión actual y el turno— y lo solicita al Proveedor LLM | `CapsulaDePerfil`, `Consentimiento` | Envía el contexto mínimo al Proveedor LLM | Frontera con el Proveedor LLM |
| 5 | Proveedor LLM | Genera el texto de la respuesta | — | Devuelve el texto al sistema | Frontera con el Proveedor LLM |
| 6 | Sistema | Aplica las **guardas de salida** (no riesgo, no claim clínico), limita a 350 tokens y **registra el `EventoOperativo` de esa llamada** | `EventoOperativo` | Muestra la respuesta del personaje y deja el evento **sin contenido** (momento, resultado, latencia, modelo, versión) | Interfaz de chat |
| 7 | Usuario | Intercambia turnos (repite 2–6), hasta 20 mensajes de usuario | Mensaje | Mantiene la conversación coherente de personaje | Interfaz de chat |
| 8 | Usuario | Cierra la conversación | Conversacion | **Descarta** el contenido (no persistencia). **No registra nada aquí**: los `EventoOperativo` ya se escribieron turno a turno en el paso 6 | Interfaz de chat |

> **Por qué el evento operativo es por turno y no por cierre.** Sus campos —latencia, resultado,
> modelo, versión— son **valores de una llamada**. Al cerrar no existe una latencia única que
> registrar, y `MET-07` (`RC-07`) mide «peticiones OK + *fallback* / totales»: su denominador son
> **peticiones**, no conversaciones. Una conversación de veinte turnos con resultados distintos
> entre sí no cabe en un solo registro escalar. Corregido en `v2.1` (hallazgo `H-1a` de `DS-00`),
> que también hace explícito lo que ya estaba decidido: el **paso 3 del plan §4.11** («verificar
> mayoría de edad») no es un paso de este caso de uso porque quedó **absorbido en `PRE-03`**, que
> exige ser adulto **y** tener vigente la capa base. Está cubierto; lo que faltaba era decirlo
> (`H-2`).

## 12. Flujos alternativos
| ID | Nombre | Punto | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Límite de mensajes por sesión | Paso 7 | El Usuario alcanza los 20 mensajes de la sesión | Informa el estado e invita a cerrar o iniciar otra sesión, sin error crudo | **Finaliza** de forma controlada | RN-02.8, RF-25 |
| FA-02 | Salida insegura del Proveedor LLM | Paso 6 | La postvalidación detecta salida de riesgo o *claim* clínico | **Sustituye** la salida por una respuesta segura de *fallback* | **Continúa** en el paso 6 con la respuesta sustituida | RN-02.3, RC-03, C-3 |

> **El flujo alternativo «Cambiar de personaje» de v1.0 salió a CU-13** (`<<extend>>`), y los dos restantes se renumeraron. Los otros dos disparadores de límite —2.500 caracteres por mensaje y 350 *tokens* de salida— **no son flujos alternativos**: el de entrada es la excepción `FE-03` y el de salida es un recorte que el paso 6 aplica sin interrumpir el flujo. Agruparlos en un solo flujo con tres disparadores era el hallazgo **D-08**.

## 13. Flujos de excepción
> Tabla de códigos = plan §4.13; degradación con gracia = RF-26.

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Estado final | Recuperación |
|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Paso 1–2 | Sin sesión | `401`; solicita reingresar | Sin conversación | **Termina**; reingresar por CU-03 |
| FE-02 | Permiso insuficiente | Paso 1 | Rol no autorizado | `403` | Sin acceso | **Termina** |
| FE-03 | Entrada inválida | Paso 2 | `Mensaje` mal formado o de más de 2.500 caracteres | `400`; pide corregir | Turno no enviado | **Vuelve** al paso 2 |
| FE-04 | Chat deshabilitado | Paso 1 | *Kill switch* activo | `409`; informa indisponibilidad temporal | Sin conversación | **Termina**; reintentar más tarde |
| FE-05 | Límite de tasa superado | Paso 2 | Rate limit (3/min, 30/día) | `429`; respeta `Retry-After` | Turno no procesado | **Vuelve** al paso 2 tras la espera |
| FE-06 | Proveedor no disponible | Paso 5 | El Proveedor LLM no responde | `502`; informa y permite reintento (máx. 1 reintento ante fallos transitorios) | Sin respuesta del Proveedor LLM | **Vuelve** al paso 4 |
| FE-07 | *Timeout* | Paso 5 | Sin respuesta en 20 s | `504`; informa sin romper la interfaz y **deja el turno disponible para que el Usuario lo reenvíe** — **sin reintento automático**, que duplicaría la espera que `RN-02.9` acota en 20 s | Sin respuesta | **Vuelve** al paso 2 |
| FE-08 | Peligro explícito | Paso 3 | `Mensaje` con peligro manifiesto | `200` + `safety_fallback`; el flujo se **desvía a CU-07** | Chat ordinario suspendido en la sesión | **Termina** la sesión; iniciar otra |
| **FE-09** | **Capa base del consentimiento revocada** | **Paso 1** | El Usuario retiró la capa base durante el onboarding (flujo alternativo de CU-05) y accede al chat directamente | `403`; **no abre la `Conversacion`** y redirige a CU-05 para otorgarla | Sin conversación | **Termina**; rehacer CU-05 |

> Regla de excepción transversal: no se retornan errores crudos ni *stack traces*, claves, el *prompt* ni metadatos de razonamiento (plan §4.13).

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El usuario recibió respuestas coherentes de personaje | Observación / rúbrica (RC-08) |
| Fallo controlado | Ante error del LLM, la UI informa el estado y permite reintento; no se rompe | Prueba de fallos (RF-26) |
| Datos creados | Ninguno de contenido; **un `EventoOperativo` por llamada al Proveedor LLM** (momento, resultado, latencia, modelo, versión), sin contenido | Inspección |
| Datos consultados | `CapsulaDePerfil`: `character` **siempre**, los cuatro autorreportes solo con la capa de personalización otorgada; estado de las capas del `Consentimiento`; `DisponibilidadDelChatbot` | Inspección |
| Datos eliminados | **El contenido de la conversación se descarta al cerrar** (no persistencia) | Inspección de BD/logs = sin contenido |
| Cambios de estado | `Conversacion` → cerrada | Traza |
| Efectos visibles | Sin registro recuperable del diálogo | Inspección (RF-13) |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-02.1 | Todo mensaje pasa el gate antes de generar respuesta del LLM. | Habilitador | Paso 3 | MV-01 §7.3 |
| RN-02.2 | El LLM recibe cápsula + persona + hasta 4 intercambios de la sesión actual + turno; nunca historial de sesiones previas. | Restricción | Paso 4 | MV-01 §7.3, plan §3.4 |
| RN-02.3 | El Sistema filtra la respuesta del Proveedor LLM con las guardas de salida (no riesgo, no *claim* clínico). | Restricción | Paso 6, FA-02 | MV-01 §7.3 |
| RN-02.4 | La personalidad (Alan/Aura) modula el tono, no las reglas de seguridad. | Restricción | Paso 6 | MV-01 §7.3 |
| RN-02.5 | La conversación se descarta al cerrar; no se reúsa entre sesiones. | Restricción | Paso 8 | MV-01 §7.3 |
| RN-02.6 | El usuario puede cambiar de `Personaje` durante o entre conversaciones. El cambio **en sesión** es CU-13; aquí gobierna la elección con la que se abre la conversación en el paso 1. | Habilitador | Paso 1 | MV-01 §7.3 |
| RN-02.7 | No se inicia conversación si el chatbot está deshabilitado. | Restricción | PRE-04, FE-04 | MV-01 §7.3 |
| RN-02.8 | Hasta 20 mensajes por sesión, **2.500 caracteres** por mensaje y 350 *tokens* de salida. | Restricción | FA-01, FE-03, paso 6 | MV-01 §7.3 **modificado por el PDR-01**: la fuente aguas arriba aún dice 1.500, igual que RF-25 en REQ-01. La divergencia es **deliberada y está declarada** en `RA-07`; propagarla a MV-01 y REQ-01 es la fase D.5 |
| RN-02.9 | Rate limit 3/min, 30/día; *timeout* 20 s. | Restricción | PRE-05, FE-05, FE-07 | MV-01 §7.3 |
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. Aplicado por capas: sin la **base** no hay conversación; sin la de **personalización** se conversa sin que la cápsula oriente. | Restricción | PRE-03, PRE-03.1, FE-09, paso 4 | MV-01 §7.1 |
| RN-05 | Ante peligro explícito, responde el *fallback*, no el LLM. | Habilitador | Paso 3, FE-08 | MV-01 §7.1, SEG-01 |
| C-1…C-10 | Cláusulas del contrato conversacional (disclosure, no claim clínico, minimización, no persistencia, no instrucciones de riesgo…). | Restricción | Todo el flujo | CONTRATO |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | Minimización: el Proveedor LLM solo recibe cápsula + turno + ≤4 intercambios; nunca username, alias, identificador, rol, contraseña ni historial previo (PRIV-R1/R9, RNF-04). **Si la capa de personalización está revocada, tampoco recibe los cuatro autorreportes** — pero sí `character`, sin el cual no habría `Personaje` que conduzca la conversación. | Inspección de *payload*: 0 campos prohibidos (RC-04) |
| RE-02 | Privacidad | El contenido del chat no se persiste en BD ni logs (RNF-03). | Inspección: sin contenido en BD/logs |
| RE-03 | Seguridad (safety) | La ruta de seguridad opera aunque el LLM falle (RNF-06). | *Fallback* con LLM deshabilitado (RC-01 = 100 %) |
| RE-04 | Rendimiento | Respuesta en tiempo aceptable pese al servicio externo. | p95 ≤ 5 s (RC-05) [dependiente del LLM] |
| RE-05 | Fiabilidad | Degradación con gracia ante indisponibilidad/timeout/cuota. | ≥95 % de peticiones OK o *fallback* (RC-07) |
| RE-06 | Seguridad | Rol en servidor; claves/tokens fuera del cliente y del repo (RNF-08/09). | Inspección |
| RE-07 | Auditoría | El Sistema registra **un `EventoOperativo` por cada llamada** al Proveedor LLM (momento, resultado, latencia, modelo, versión), **sin contenido**. | Inspección de eventos: su número coincide con el de llamadas del turno |

> **Nomenclatura de los campos, unificada en `v2.1`.** Este documento usaba dos listas distintas
> —§7/§18 decían *momento, resultado, latencia, modelo, versión*; §14/§16 decían *latencia, modelo,
> versión, **estado***—. Manda el **plan §4.15**, que distingue «**resultado técnico**» de «**código
> de estado**»: son campos **distintos**, no sinónimos. Lo que §14/§16 llamaban «estado» era el
> **resultado técnico** ({ok, *fallback*, error}), y así queda en todo el documento. El **código de
> estado** (HTTP), el ***request ID*** y el **entorno** completan los ocho campos del plan, pero son
> de **persistencia**: viven en `PER-01 §3.6`, no aquí — la misma frontera que `MD-01 §6` traza para
> los atributos de esta clase.

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | **Interfaz de chat** (P-10, P-11) | Conversar con `Alan` o `Aura` | mensaje, selector de `Personaje` | Enviar, Cerrar | 1–8 |

> El selector de `Personaje` y la acción de alternar viven en la misma pantalla, pero pertenecen a **CU-13**, que extiende a este.
| Endpoint visible | `POST /api/chat/` | Ejecutar una conversación (ChatRequestV1 → ChatResponseV1) | character, message, history (≤4), client_request_id | Enviar | 2–6 |

> `ChatRequestV1` no acepta perfil ni *prompt* desde el cliente, ni roles `system`/`developer`; el historial es entrada no confiable (plan §4.9). **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantallas P-10 y P-11) y `DIS-01_sistema_diseno.md` (sistema de diseño: tokens, doble voz Alan/Aura, componentes). Mockups renderizados en claro y oscuro con estados no-felices. Los prototipos gráficos de producción quedan pendientes de la fase de construcción.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| Conversacion | estado | Crear / Cancelar | Paso 1, 8 | Efímera; se descarta al cerrar (RF-13) |
| `Mensaje` | contenido del turno | Crear / Comprobar | Paso 2 | ≤2.500 caracteres; no persiste |
| `CapsulaDePerfil` | `character` (siempre) + los 4 autorreportes (solo con la capa de personalización otorgada) + metadatos | Consultar | Paso 4 | Solo esos campos viajan al Proveedor LLM. **`character` no depende de la capa de personalización**: por `RN-01.6` es precondición funcional y lo cubre la capa base |
| `Consentimiento` | capa, estado | Consultar | Paso 1, paso 4 | La capa base condiciona el acceso (`FE-09`); la de personalización, si los autorreportes orientan |
| `EventoOperativo` | momento, resultado, latencia, modelo, versión | Crear (**uno por llamada**) | Paso 6, en cada turno | **Sin contenido del diálogo** (`RE-07`, RNF-03). Los otros tres campos del plan §4.15 —*request ID*, código de estado, entorno— son de persistencia (`PER-01 §3.6`) |
| Contexto al LLM (`ContextoInicialConversacionalV1`) | cápsula (5 campos, incluye `character`) + system prompt de personalidad + ≤4 intercambios + turno | Construir / Enviar | Paso 4 | Sin datos identificatorios (PRIV-R9) |
| EventoDeSeguridad | señal de peligro | Validar | Paso 3 | Determinista; deriva a CU-07 |

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Chat` (DCU-01 v2.1) ↔ **CU-06** | Correspondencia explícita; el número sigue el orden de declaración del diagrama |
| Requisito funcional | RF-07, RF-08, RF-09, RF-10, RF-13, RF-25, RF-26 | Realizados por este CU, exactamente los que le asigna DCU-01 v2.1 §2. **RF-12 pasa a CU-13**; **RF-11 es de CU-07**, que extiende a este pero lo realiza él |
| Objetivo de negocio | OBJ-2, OBJ-4 | Conversación gobernada; minimización/no persistencia |
| Regla de negocio | Familia RN-02.1…RN-02.9; RN-05; RN-07; contrato C-1…C-10 | Gobiernan el flujo. Toda regla citada queda **definida en §15**: v1.0 invocaba las familias de administración y de cuenta sin definirlas |
| Requisito de calidad | RC-04, RC-05, RC-07, RC-08 | Anclas de calidad |
| Modelo de dominio | `Conversacion`, `Mensaje`, `Personaje`/`Alan`/`Aura`, `CapsulaDePerfil`, `Consentimiento`, `DisponibilidadDelChatbot`, `EventoDeSeguridad`, `EventoOperativo` | Conceptos manipulados. Las tres últimas familias faltaban en v1.0 pese a usarse en el flujo |
| Diagrama de casos de uso | `CU_Deriv ..> CU_Chat` y `CU_Cambiar ..> CU_Chat`, ambos `<<extend>>` | Origen de las relaciones |
| Caso de uso que lo extiende | CU-07 «Derivar ante peligro»; CU-13 «Cambiar de acompañante» | **Es extendido por** ambos |
| Caso de uso relacionado | CU-12 «Revocar la personalización» | Produce el estado que el paso 4 consulta |
| Caso de prueba | CP-06 | Planificado |
| Robustez / secuencia | DR-06 / DS-06 | Planificados (DS-06 detalla los 18 pasos) |
| Criterio de aceptación | CA-01…CA-11 | Verificación. v1.0 declaraba «CA-01…CA-06»; los tres criterios que añade esta tanda quedaban fuera de la trazabilidad |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario con consentimiento vigente, cuando envía un mensaje, entonces el sistema evalúa el gate antes de responder. | Flujo básico (paso 3) | Traza técnica |
| CA-02 | Dado un turno sin peligro, cuando el sistema invoca al LLM, entonces el *payload* contiene solo cápsula + persona + ≤4 intercambios + turno (0 campos prohibidos). | Flujo básico (paso 4) | Inspección de *payload* (RC-04) |
| CA-03 | Dado un mensaje de peligro explícito de prueba, cuando pasa el gate, entonces responde el *fallback* (CU-07), aunque el Proveedor LLM esté deshabilitado. | FE-08 / CU-07 | Prueba *fail-safe* (RC-01) |
| CA-08 | Dado un usuario con la **capa base** del consentimiento revocada, cuando intenta abrir una conversación, entonces recibe `403` y el sistema lo redirige a CU-05, sin abrir la `Conversacion`. | FE-09 | Prueba de acceso con la capa base revocada |
| CA-09 | Dado un usuario con la **capa de personalización** revocada, cuando envía un mensaje, entonces **puede conversar**, el *payload* al Proveedor LLM **no contiene ningún autorreporte** y **sí contiene `character`**. | PRE-03.1, paso 4 | Inspección de *payload* |
| CA-04 | Dada una conversación cerrada, cuando se inspecciona BD/logs, entonces no hay registro recuperable del diálogo. | Postcondición (RF-13) | Inspección |
| CA-05 | Dado un usuario que alcanza los **20 mensajes** de la sesión, cuando lo supera, entonces el sistema informa el estado sin error crudo y la sesión finaliza de forma controlada. | FA-01 (RF-25) | Prueba de límite de sesión |
| CA-07 | Dado un mensaje de más de **2.500 caracteres**, cuando el usuario lo envía, entonces el sistema responde `400` y el turno no llega al Proveedor LLM. | FE-03 | Prueba de límite de entrada |
| CA-06 | Dado cualquiera de los fallos de sesión, permiso, indisponibilidad, tasa o proveedor, cuando ocurre, entonces la interfaz muestra el estado y permite reintento sin romperse ni exponer el error crudo. | FE-01, FE-02, FE-04, FE-05, FE-06, FE-07 (RF-26) | Prueba de fallos simulados, uno por código |
| CA-10 | Dada una salida del Proveedor LLM que la postvalidación marca como insegura, cuando el sistema la sustituye, entonces el Usuario recibe la respuesta segura y **nunca** la original. | FA-02 | Prueba con salida insegura inyectada |
| CA-11 | Dada una respuesta del Proveedor LLM más larga que el límite, cuando el sistema la entrega, entonces queda recortada a 350 *tokens* sin cortar el sentido de la última frase. | Paso 6 (`RN-02.8`, tercer disparador) | Prueba de límite de salida |

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad (histórica) | Nº de campos que recibe el LLM: la cápsula canónica nombraba **3**; el plan §3.4 (`ContextoInicialConversacionalV1`) lista **5 de contenido + metadatos**. | Define el *payload* real (CA-02) | **Resuelto (SD-22):** se adoptan los **5 campos del plan** + `schema_version`/`consent_version`; el *payload* del paso 4 usa `ContextoInicialConversacionalV1`. | **Resuelto** |
| RA-02 | Riesgo | El gate binario no detecta peligro **implícito** (limitación declarada, SEG-01 §2). | Alcance de seguridad | Declarado con honestidad; solo se garantiza el explícito. | Aceptado |
| RA-03 | Riesgo | Latencia del LLM podría incumplir RC-05 (p95 ≤ 5 s). | Rendimiento | Medir en construcción; umbral revisable [N6]. | Abierto (R-6) |
| RA-04 | Riesgo | Disponibilidad de Groq `gpt-oss-20b`/free tier (V6-a). | Operación | Diseño agnóstico de proveedor (ADR-001-D3). | Abierto |
| RA-05 | Contradicción (hallazgo **D-01**) | La precondición de «consentimiento vigente (no revocado)» estaba marcada «Verificable: Sí» **sin ningún curso de excepción asociado**, mientras las otras cuatro sí lo tenían. Un usuario con el consentimiento retirado **entraba al chat sin obstáculo** en el modelo. | Coherencia del canon de privacidad | **Resuelto:** el `Consentimiento` se separa en capas (CU-12 §4.1); la base gana `FE-09` con `403` y redirección a CU-05; la de personalización pasa a `PRE-03.1`, que **no** bloquea. | **Resuelto** |
| RA-06 | Ambigüedad (hallazgo **D-08**) | Un solo flujo alternativo declaraba **tres disparadores** de límite —20 mensajes, caracteres por mensaje y *tokens* de salida— y pedía informar «sin error crudo», lo que chocaba con el `400` de la excepción de entrada. | Verificabilidad de RF-25 | **Resuelto:** el límite de sesión se queda en `FA-01`; el de entrada es `FE-03` con su `400`; el de salida es un recorte del paso 6. El criterio que los agrupaba se parte en dos. | **Resuelto** |
| RA-07 | Decisión aplicada | El límite por mensaje sube de 1.500 a **2.500 caracteres**. | Alcance de la entrada | Decisión del líder del proyecto en la primera pasada del PDR. Propagada a `RN-02.8`, `FE-03`, §18 y `CA-07`. | **Aplicada** |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Conversar gobernado |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Conversar con el acompañante» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Proveedor LLM en la frontera |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 8 pasos observables |
| 6 | Flujos alternativos suficientes | ✅ | FA-01 y FA-02; el tercero de v1.0 salió a CU-13 |
| 7 | Flujos de excepción relevantes | ✅ | 401, 403, 400, 409, 429, 502, 504, peligro y **capa base revocada** |
| 8 | Términos del dominio (MD-01) usados | ✅ | Conversacion, Mensaje, Personaje… |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | Interfaz de chat + `/api/chat/` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | §14 (no persistencia) |
| 14 | Sin detalle de implementación | ✅ | 18 pasos → DS-06, no aquí |
| 15 | Auth como precondición/regla, no CU incluido | ✅ | PRE-01/02 |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19 |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ✅ | DR-06/DS-06 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | `<<extend>>` de CU-07 y de CU-13; minimización; no persistencia |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto (sistema externo: Proveedor LLM) |
| Objetivo | Conversar con Alan/Aura, LLM gobernado, gate por mensaje, sin persistencia. |
| Disparador | El usuario envía un mensaje al personaje. |
| Precondiciones | Sesión, rol usuario, **capa base** del consentimiento vigente, chatbot habilitado, dentro de límites. |
| Conceptos del dominio | Conversacion, Mensaje, Personaje/Alan/Aura, CapsulaDePerfil, DisponibilidadDelChatbot, EventoDeSeguridad. |
| Flujo básico | Gate → contexto mínimo → LLM → guardas → respuesta; repetir; cerrar y descartar. |
| Flujos alternativos | Límite de mensajes por sesión; sustituir salida insegura. |
| Flujos de excepción | 401/403/400/409/429/502/504; peligro → CU-07; capa base revocada → CU-05. |
| Postcondición de éxito | Diálogo coherente; contenido descartado al cerrar. |
| Reglas de negocio | Familia RN-02.1…RN-02.9; RN-05; RN-07; contrato C-1…C-10. |
| Criterios de aceptación | CA-01…CA-11. |
| Casos relacionados | CU-05 (precede), CU-07 y CU-13 (`<<extend>>`), CU-10 (condiciona), CU-12 (produce el estado del paso 4). |

**Fin de ECU-06.**
