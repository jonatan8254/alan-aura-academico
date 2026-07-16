# ECU-06 — Especificación de caso de uso: «Conversar con el acompañante» (CU-06)
**ID documento:** DOC-CU-06 · **Caso de uso:** CU-06 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23) — caso de uso **central y canon-sensible** (conversación gobernada, minimización, no persistencia, gate de seguridad).
**Insumos:** DCU-01, MV-01 §Vista Conversación, MD-01, REQ-01 (RF-07…13/25/26), contrato conversacional, SEG-01, PRIV-01, plan §3.4/§4.9/§4.10/§4.11/§4.13. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-06 |
| Versión | v1.0 |
| Autor | Jonatan Estiven Sánchez Vargas (subproyecto) |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-16 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |

## 2. Entradas esperadas
| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Conversación (RN-02.x) | Disponible |
| Modelo de dominio | MD-01 (Conversacion, Mensaje, Personaje, CapsulaDePerfil, DisponibilidadDelChatbot, EventoDeSeguridad) | Disponible |
| Diagrama de casos de uso | DCU-01 (CU «Conversar con el acompañante») | Disponible |
| Caso de uso seleccionado | CU-06 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Actor secundario | Proveedor LLM (Groq), sistema externo | Disponible |
| Reglas de negocio | RN-02.1…RN-02.9, RN-03, RN-04, RN-05; contrato C-1…C-10 | Disponible |
| Requisitos funcionales | RF-07…RF-13, RF-25, RF-26 | Disponible |
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
| CapsulaDePerfil | Resumen mínimo | Orienta la conversación (vía LLM) | preferenciaDePersonaje, focoEmocional, tonoPreferido | CapsulaDePerfil–Conversacion (orienta) |
| DisponibilidadDelChatbot | Estado global habilitado/deshabilitado | Condiciona el inicio | estado | DisponibilidadDelChatbot–Conversacion (condiciona) |
| EventoDeSeguridad | Ocurrencia de peligro explícito | Puede originarse de un Mensaje | — | Mensaje–EventoDeSeguridad (origina) |

**Control terminológico**

| Término oficial | Significado | Prohibidos | Observación |
|---|---|---|---|
| Conversacion | Sesión efímera; **no** persiste | «chat guardado», «historial» | RF-13 |
| CapsulaDePerfil | Contexto mínimo al LLM | «historial bruto», «perfil completo» | PRIV-R1 |
| Gate de seguridad | Filtro determinista de peligro explícito | «clasificador clínico» | Mecanismo (SEG-01), **no** clase de dominio |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| `<<extend>>` | CU-07 Derivar ante peligro | Es extendido por | Ante peligro explícito, el flujo se **desvía** al *fallback* determinista (condicional, puede no ocurrir, observable). Coherente con DCU-01. |
| Dependencia funcional | CU-05 Otorgar consentimiento y caracterizar el perfil | Depende de | Requiere consentimiento vigente y cápsula. |
| Dependencia funcional | CU-10 Habilitar/deshabilitar el chatbot | Condicionado por | Si el chatbot está deshabilitado, no se inicia (409). |
| `<<include>>` | — | — | Ninguno. El gate, la construcción del contexto y la invocación al LLM son **comportamiento interno**, no subservicios observables compartidos (DCU-01). |

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → 401) |
| PRE-02 | El rol es «usuario» validado en servidor. | Autorización | Sí (si no → 403) |
| PRE-03 | El Usuario es adulto y tiene **consentimiento vigente** (no revocado). | Negocio | Sí |
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
| 2 | Usuario | Escribe y envía un `Mensaje` (≤1.500 caracteres) | Mensaje | Valida longitud y estructura del turno | Interfaz de chat |
| 3 | Sistema | Evalúa el **gate de seguridad determinista** sobre el mensaje **antes** de responder | EventoDeSeguridad (posible) | Decide {no-peligro / peligro-explícito} | — |
| 4 | Sistema | (no-peligro) Construye el **contexto mínimo** (cápsula + persona + hasta 4 intercambios de la sesión actual + turno) y lo solicita al Proveedor LLM | CapsulaDePerfil | Envía el contexto mínimo al LLM | Frontera con el Proveedor LLM |
| 5 | Proveedor LLM | Genera el texto de la respuesta | — | Devuelve el texto al sistema | Frontera con el Proveedor LLM |
| 6 | Sistema | Aplica las **guardas de salida** (no riesgo, no claim clínico) y limita a 350 tokens | — | Muestra la respuesta del personaje | Interfaz de chat |
| 7 | Usuario | Intercambia turnos (repite 2–6), hasta 20 mensajes de usuario | Mensaje | Mantiene la conversación coherente de personaje | Interfaz de chat |
| 8 | Usuario | Cierra la conversación | Conversacion | **Descarta** el contenido (no persistencia); registra solo evento operativo sin contenido | Interfaz de chat |

## 12. Flujos alternativos
| ID | Nombre | Punto | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Cambiar de personaje | Cualquier turno | El Usuario alterna Alan/Aura | Continúa sin reiniciar el onboarding | Al paso 2 | RN-02.6, RF-12 |
| FA-02 | Límite de sesión alcanzado | Paso 7 | 20 mensajes / 1.500 caracteres / 350 tokens | El sistema informa el estado e invita a cerrar/reiniciar (sin error crudo) | Fin controlado | RN-02.8, RF-25 |
| FA-03 | Salida insegura del LLM | Paso 6 | La postvalidación detecta salida de riesgo/claim clínico | El sistema **sustituye** la salida por una respuesta segura/fallback | Al paso 6 | RN-02.3, RC-03, C-3 |

## 13. Flujos de excepción
> Tabla de códigos = plan §4.13; degradación con gracia = RF-26.

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Estado final | Recuperación |
|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Paso 1–2 | Sin sesión | `401`; solicita reingresar | Sin conversación | CU-03 |
| FE-02 | Permiso insuficiente | Paso 1 | Rol no autorizado | `403` | Sin acceso | — |
| FE-03 | Entrada inválida | Paso 2 | Mensaje mal formado o >1.500 | `400`; pide corregir | Turno no enviado | Reintentar |
| FE-04 | Chat deshabilitado | Paso 1 | Kill switch activo | `409`; informa indisponibilidad temporal | Sin conversación | Reintentar luego |
| FE-05 | Límite superado | Paso 2 | Rate limit (3/min, 30/día) | `429`; respeta `Retry-After`, reintento manual | Turno no procesado | Esperar/reintentar |
| FE-06 | Proveedor no disponible | Paso 5 | Groq caído | `502`; informa y permite reintento (máx. 1 reintento a fallos transitorios) | Sin respuesta del LLM | Reintento manual |
| FE-07 | Timeout | Paso 5 | Sin respuesta en 20 s | `504`; informa sin romper la UI | Sin respuesta | Reintento manual |
| FE-08 | Peligro explícito | Paso 3 | Mensaje con peligro manifiesto | `200` + `safety_fallback` → **se desvía a CU-07 (Derivar)** | Chat ordinario suspendido en la sesión | Iniciar nueva sesión |

> Regla de excepción transversal: no se retornan errores crudos ni *stack traces*, claves, el *prompt* ni metadatos de razonamiento (plan §4.13).

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El usuario recibió respuestas coherentes de personaje | Observación / rúbrica (RC-08) |
| Fallo controlado | Ante error del LLM, la UI informa el estado y permite reintento; no se rompe | Prueba de fallos (RF-26) |
| Datos creados | Ninguno de contenido; solo evento operativo sin contenido (latencia, modelo, versión, estado) | Inspección |
| Datos consultados | `CapsulaDePerfil` (para orientar), estado del kill switch | Inspección |
| Datos eliminados | **El contenido de la conversación se descarta al cerrar** (no persistencia) | Inspección de BD/logs = sin contenido |
| Cambios de estado | `Conversacion` → cerrada | Traza |
| Efectos visibles | Sin registro recuperable del diálogo | Inspección (RF-13) |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-02.1 | Todo mensaje pasa el gate antes de generar respuesta del LLM. | Habilitador | Paso 3 | MV-01 §7.3 |
| RN-02.2 | El LLM recibe cápsula + persona + hasta 4 intercambios de la sesión actual + turno; nunca historial de sesiones previas. | Restricción | Paso 4 | MV-01 §7.3, plan §3.4 |
| RN-02.3 | La respuesta del LLM se filtra por guardas (no riesgo, no claim clínico). | Restricción | Paso 6, FA-03 | MV-01 §7.3 |
| RN-02.4 | La personalidad (Alan/Aura) modula el tono, no las reglas de seguridad. | Restricción | Paso 6 | MV-01 §7.3 |
| RN-02.5 | La conversación se descarta al cerrar; no se reúsa entre sesiones. | Restricción | Paso 8 | MV-01 §7.3 |
| RN-02.6 | El usuario puede cambiar de personaje durante o entre conversaciones. | Habilitador | FA-01 | MV-01 §7.3 |
| RN-02.7 | No se inicia conversación si el chatbot está deshabilitado. | Restricción | PRE-04, FE-04 | MV-01 §7.3 |
| RN-02.8 | Hasta 20 mensajes/sesión, 1.500 caracteres/mensaje, 350 tokens de salida. | Restricción | FA-02, FE-03 | MV-01 §7.3 |
| RN-02.9 | Rate limit 3/min, 30/día; timeout 20 s. | Restricción | PRE-05, FE-05/FE-07 | MV-01 §7.3 |
| RN-05 | Ante peligro explícito, responde el *fallback*, no el LLM. | Habilitador | Paso 3, FE-08 | MV-01 §7.1, SEG-01 |
| C-1…C-10 | Cláusulas del contrato conversacional (disclosure, no claim clínico, minimización, no persistencia, no instrucciones de riesgo…). | Restricción | Todo el flujo | CONTRATO |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | Minimización: el LLM solo recibe cápsula + turno + ≤4 intercambios; nunca username/alias/ID/rol/contraseña/historial previo (PRIV-R1/R9, RNF-04). | Inspección de *payload*: 0 campos prohibidos (RC-04) |
| RE-02 | Privacidad | El contenido del chat no se persiste en BD ni logs (RNF-03). | Inspección: sin contenido en BD/logs |
| RE-03 | Seguridad (safety) | La ruta de seguridad opera aunque el LLM falle (RNF-06). | *Fallback* con LLM deshabilitado (RC-01 = 100 %) |
| RE-04 | Rendimiento | Respuesta en tiempo aceptable pese al servicio externo. | p95 ≤ 5 s (RC-05) [dependiente del LLM] |
| RE-05 | Fiabilidad | Degradación con gracia ante indisponibilidad/timeout/cuota. | ≥95 % de peticiones OK o *fallback* (RC-07) |
| RE-06 | Seguridad | Rol en servidor; claves/tokens fuera del cliente y del repo (RNF-08/09). | Inspección |
| RE-07 | Auditoría | Se registra evento operativo (latencia, modelo, versión, estado) **sin contenido**. | Inspección de eventos |

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | Interfaz de chat | Conversar con Alan/Aura | mensaje, selector de personaje | Enviar, Cambiar personaje, Cerrar | 1–8 |
| Endpoint visible | `POST /api/chat/` | Ejecutar una conversación (ChatRequestV1 → ChatResponseV1) | character, message, history (≤4), client_request_id | Enviar | 2–6 |

> `ChatRequestV1` no acepta perfil ni *prompt* desde el cliente, ni roles `system`/`developer`; el historial es entrada no confiable (plan §4.9). Prototipos gráficos: **[Pendiente]**.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| Conversacion | estado | Crear / Cancelar | Paso 1, 8 | Efímera; se descarta al cerrar (RF-13) |
| Mensaje | contenido del turno | Crear / Validar | Paso 2 | ≤1.500 caracteres; no se persiste |
| CapsulaDePerfil | 3 campos | Consultar | Paso 4 | Solo esos campos viajan al LLM |
| Contexto al LLM (`ContextoInicialConversacionalV1`) | cápsula + persona + ≤4 intercambios + turno | Construir / Enviar | Paso 4 | Sin datos identificatorios (PRIV-R9) |
| EventoDeSeguridad | señal de peligro | Validar | Paso 3 | Determinista; deriva a CU-07 |

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación |
|---|---|---|
| Requisito funcional | RF-07, RF-08, RF-09, RF-10, RF-12, RF-13, RF-25, RF-26 | Realizados por este CU |
| Objetivo de negocio | OBJ-2, OBJ-4 | Conversación gobernada; minimización/no persistencia |
| Regla de negocio | RN-02.1…2.9, RN-05; C-1…C-10 | Gobiernan el flujo |
| Requisito de calidad | RC-04, RC-05, RC-07, RC-08 | Anclas de calidad |
| Modelo de dominio | Conversacion, Mensaje, Personaje/Alan/Aura, CapsulaDePerfil, DisponibilidadDelChatbot, EventoDeSeguridad | Conceptos manipulados |
| Diagrama de casos de uso | DCU-01 «Conversar con el acompañante» (+ `<<extend>>` CU-07) | Origen |
| Caso de prueba | CP-06 | Planificado |
| Robustez / secuencia | DR-06 / DS-06 | Planificados (DS-06 detalla los 18 pasos) |
| Criterio de aceptación | CA-01…CA-06 | Verificación |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario con consentimiento vigente, cuando envía un mensaje, entonces el sistema evalúa el gate antes de responder. | Flujo básico (paso 3) | Traza técnica |
| CA-02 | Dado un turno sin peligro, cuando el sistema invoca al LLM, entonces el *payload* contiene solo cápsula + persona + ≤4 intercambios + turno (0 campos prohibidos). | Flujo básico (paso 4) | Inspección de *payload* (RC-04) |
| CA-03 | Dado un mensaje de peligro explícito de prueba, cuando pasa el gate, entonces responde el *fallback* (CU-07), aunque el LLM esté deshabilitado. | FE-08 / CU-07 | Prueba fail-safe (RC-01) |
| CA-04 | Dada una conversación cerrada, cuando se inspecciona BD/logs, entonces no hay registro recuperable del diálogo. | Postcondición (RF-13) | Inspección |
| CA-05 | Dado un usuario que alcanza 20 mensajes/1.500 caracteres, cuando lo supera, entonces el sistema informa el estado sin error crudo. | FA-02 (RF-25) | Prueba de límites |
| CA-06 | Dado un fallo del LLM (401/403/400/409/429/502/504), cuando ocurre, entonces la UI muestra estado y permite reintento sin romperse. | §13 (RF-26) | Prueba de fallos simulados |

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad | Nº de campos que recibe el LLM: la cápsula canónica (RN-01.3/PRIV-R1) son **3**; el plan §3.4 (`ContextoInicialConversacionalV1`) lista **5 autorreportes + personaje + versión**. | Define el *payload* real (CA-02) | Seguir el canon (3 campos); reconciliar con el plan §3.4 (compartida con CU-05 RA-01). | **Abierto** |
| RA-02 | Riesgo | El gate binario no detecta peligro **implícito** (limitación declarada, SEG-01 §2). | Alcance de seguridad | Declarado con honestidad; solo se garantiza el explícito. | Aceptado |
| RA-03 | Riesgo | Latencia del LLM podría incumplir RC-05 (p95 ≤ 5 s). | Rendimiento | Medir en construcción; umbral revisable [N6]. | Abierto (R-6) |
| RA-04 | Riesgo | Disponibilidad de Groq `gpt-oss-20b`/free tier (V6-a). | Operación | Diseño agnóstico de proveedor (ADR-001-D3). | Abierto |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Conversar gobernado |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Conversar con el acompañante» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Proveedor LLM en la frontera |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 8 pasos observables |
| 6 | Flujos alternativos suficientes | ✅ | FA-01…FA-03 |
| 7 | Flujos de excepción relevantes | ✅ | Tabla completa 401…504 + peligro |
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
| 20 | Coherente con DCU-01 y canon §5 | ✅ | `<<extend>>` CU-07; minimización; no persistencia |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto (sistema externo: Proveedor LLM) |
| Objetivo | Conversar con Alan/Aura, LLM gobernado, gate por mensaje, sin persistencia. |
| Disparador | El usuario envía un mensaje al personaje. |
| Precondiciones | Sesión, rol usuario, consentimiento vigente, chatbot habilitado, dentro de límites. |
| Conceptos del dominio | Conversacion, Mensaje, Personaje/Alan/Aura, CapsulaDePerfil, DisponibilidadDelChatbot, EventoDeSeguridad. |
| Flujo básico | Gate → contexto mínimo → LLM → guardas → respuesta; repetir; cerrar y descartar. |
| Flujos alternativos | Cambiar personaje; límite de sesión; sustituir salida insegura. |
| Flujos de excepción | 401/403/400/409/429/502/504; peligro → CU-07. |
| Postcondición de éxito | Diálogo coherente; contenido descartado al cerrar. |
| Reglas de negocio | RN-02.1…2.9, RN-05, C-1…C-10. |
| Criterios de aceptación | CA-01…CA-06. |
| Casos relacionados | CU-05 (precede), CU-07 (`<<extend>>`), CU-10 (condiciona). |

**Fin de ECU-06.**
