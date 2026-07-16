# ECU-07 — Especificación de caso de uso: «Derivar ante peligro» (CU-07)
**ID documento:** DOC-CU-07 · **Caso de uso:** CU-07 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23) — caso de uso **de seguridad (safety), criticidad máxima**. Es la **`<<extend>>`** de CU-06.
**Insumos:** DCU-01, MV-01 §Vista Seguridad, MD-01, REQ-01 (RF-11), SEG-01, contrato (C-3/C-7/C-10), NORM-01 (§3.9), plan §3.8/§4.13. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-07 |
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
| Modelo verbal | MV-01 §Vista Seguridad | Disponible |
| Modelo de dominio | MD-01 (EventoDeSeguridad, RecursoDeAyuda) | Disponible |
| Diagrama de casos de uso | DCU-01 (CU «Derivar ante peligro», `<<extend>>` de CU-06) | Disponible |
| Caso de uso seleccionado | CU-07 | Disponible |
| Actor principal (beneficiario) | Usuario adulto | Disponible |
| Protocolo de seguridad | SEG-01 (gate binario + fallback) | Disponible |
| Reglas de negocio | RN-05, RN-11, RN-06; contrato C-3/C-7/C-10 | Disponible |
| Requisitos funcionales | RF-11 | Disponible |
| Requisitos especiales | RC-01/02/03, RNF-05/06 | Disponible |
| Plantilla de fallback | plan §3.8 (citada, recursos por entorno) | Disponible |

## 3. Identificación
| Campo | Valor |
|---|---|
| ID | CU-07 |
| Nombre | Derivar ante peligro |
| Paquete funcional | Acompañamiento (Seguridad) |
| Nivel de abstracción | Usuario (subfunción de seguridad, `<<extend>>` de CU-06) |
| Actor primario (beneficiario) | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Eventual (solo ante peligro explícito) |
| Criticidad | **Máxima** (*safety*; el MVP debe garantizarlo al 100 %) |
| Estado | Propuesto |

## 4. Propósito
| Campo | Descripción |
|---|---|
| Objetivo | Ante **peligro explícito**, producir una respuesta de **contención + derivación** mediante un ***fallback* determinista**, independiente del LLM. |
| Descripción breve | El gate detecta peligro explícito → el sistema suspende la respuesta ordinaria, muestra un mensaje fijo de contención con recursos de ayuda (por entorno) y suspende el chat de la sesión. |
| Valor funcional | Prioriza la seguridad sobre el *engagement*; ruta segura que opera **aunque el LLM falle** (*fail safe*). |
| Resultado observable | El usuario ve la contención y la derivación; el chat ordinario queda suspendido en esa sesión; no se almacena contenido ni se clasifica riesgo. |

## 5. Actores
| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario (beneficiario) | Usuario adulto | Recibe la contención y la derivación | **No lo solicita**; es beneficiario del disparo automático |
| Sistema externo | — | El **LLM no participa** (el *fallback* es determinista y local) | No aplica |
| Salida (no actor) | Recursos de derivación | Líneas/servicios de ayuda **configurables por entorno** | Se muestran al usuario; no interactúan con el sistema |

## 6. Alcance y contexto
| Campo | Valor |
|---|---|
| Alcance funcional | Gate binario de peligro explícito + *fallback* determinista con derivación. |
| Límite del sistema | Filtro determinista sobre señales **explícitas**; ruta segura sin dependencia del LLM. |
| Incluye | Suspensión de la respuesta ordinaria, mensaje fijo de contención, derivación a recursos (por entorno), `mode=safety_fallback`, suspensión del chat en la sesión. |
| Excluye | Escala graduada S0-S5, clasificación clínica, estimación de severidad, diagnóstico, notificación a terceros, decisiones de hospitalización, registro individual para el admin, detección de peligro **implícito**. |
| Suposiciones | El conjunto de señales explícitas configurado cubre los casos de prueba (SEG-01). |

## 7. Modelo de dominio involucrado
| Concepto/clase | Descripción | Participación | Atributos (reserva) | Relaciones |
|---|---|---|---|---|
| EventoDeSeguridad | Ocurrencia cuando un mensaje presenta peligro explícito | Se origina y dispara la derivación | — | Mensaje–EventoDeSeguridad (origina); EventoDeSeguridad–RecursoDeAyuda (remite a) |
| RecursoDeAyuda | Referencia de derivación configurable por entorno | Se muestra al usuario | — | EventoDeSeguridad–RecursoDeAyuda |
| Mensaje | Turno del usuario que dispara el gate | Es evaluado | — | Mensaje–EventoDeSeguridad |
| Conversacion | Sesión en curso | Se suspende (chat ordinario) | estado | Conversacion*--Mensaje |

**Control terminológico**

| Término oficial | Significado | Prohibidos | Observación |
|---|---|---|---|
| EventoDeSeguridad | Evento del gate binario (peligro explícito) | «triaje», «monitor de crisis», «diagnóstico» | Alcance honesto (SEG-01 §2) |
| RecursoDeAyuda | Referencia de derivación **por entorno** | números embebidos en código o documento | RN-06, SD-12 |
| Fallback determinista | Respuesta local sin LLM | «respuesta del bot» | Independiente del LLM (RNF-06) |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| `<<extend>>` | CU-06 Conversar con el acompañante | **Este CU extiende a** CU-06 | Es **condicional** (solo peligro explícito), **puede no ocurrir** (la conversación se completa sin él) y es **observable** (contención + derivación). Punto de extensión = evaluación del gate (paso 3 de CU-06). |
| `<<include>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | Existe una `Conversacion` activa (CU-06 en curso). | Funcional | Sí |
| PRE-02 | El usuario envió un `Mensaje` que es evaluado por el gate. | Funcional | Sí |
| PRE-03 | El gate de seguridad y los recursos están aprovisionados (por entorno). | Datos | Sí |

## 10. Disparador
| Campo | Valor |
|---|---|
| Evento inicial | El gate de seguridad detecta **peligro explícito** (RN-11) en un mensaje del usuario. |
| Generado por | **Sistema** (evento de negocio detectado por el gate), **no** una petición del actor. |
| Condición inicial observable | El sistema suspende la respuesta ordinaria del turno. |

## 11. Flujo básico / curso normal
> Fuente: SEG-01 §4 + plan §3.8 (10 pasos). El *fallback* es determinista y **local**: opera aunque el LLM/red estén caídos.

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Sistema | Detecta peligro explícito y **suspende** la respuesta ordinaria | EventoDeSeguridad | Origina el `EventoDeSeguridad` | — |
| 2 | Sistema | **No** interpreta clínicamente ni hace preguntas exploratorias | — | Mantiene el modo seguro | — |
| 3 | Sistema | Muestra un **mensaje fijo de contención** (sin humor ni metáforas) | — | Presenta la contención | Pantalla de contención |
| 4 | Sistema | Orienta a emergencias y apoyo humano mostrando los `RecursoDeAyuda` (por entorno) | RecursoDeAyuda | Deriva a recursos configurables | Pantalla de contención |
| 5 | Sistema | Devuelve `mode=safety_fallback` | — | Marca el turno como *fallback* | — |
| 6 | Sistema | **Bloquea** el chat ordinario para esa sesión | Conversacion | Suspende el diálogo normal | Interfaz de chat |
| 7 | Usuario | (posterior) Puede iniciar una **nueva** sesión | Conversacion | Permite reabrir chat en sesión nueva | Interfaz de chat |
| 8 | Sistema | **No** almacena el contenido ni contabiliza una clasificación de riesgo | — | Sin persistencia ni *scoring* | — |

## 12. Flujos alternativos
| ID | Nombre | Punto | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Recursos no configurados | Paso 4 | Los recursos por entorno no están disponibles | El sistema muestra la contención y una orientación genérica a emergencias/apoyo humano, **sin números embebidos** | Continúa paso 5 | RN-06, SD-12 |

## 13. Flujos de excepción
| ID | Error o evento | Punto | Causa | Respuesta del sistema | Estado final | Recuperación |
|---|---|---|---|---|---|---|
| FE-01 | LLM/red caídos | Cualquiera | Groq o la red no responden | El *fallback* **igual opera** (determinista/local): muestra contención + derivación | Contención mostrada | N/A (es el diseño *fail-safe*) |
| FE-02 | Falla al leer recursos | Paso 4 | Configuración ausente/errónea | Aplica FA-01 (contención + orientación genérica); nunca rompe la UI | Contención mostrada | Revisar configuración de entorno |

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | Se mostró la contención + derivación; el chat ordinario quedó suspendido en la sesión | Observación |
| Fallo | (No hay «fallo» funcional: la ruta es *fail-safe*; si algo falla, se degrada a orientación genérica) | Prueba fail-safe |
| Datos creados | Ninguno de contenido; **no** se almacena el mensaje ni el evento con contenido individual | Inspección |
| Datos consultados | `RecursoDeAyuda` (de configuración por entorno) | Inspección |
| Cambios de estado | Chat ordinario de la sesión → suspendido; `mode=safety_fallback` | Traza |
| Efectos visibles | El usuario ve la contención y los recursos; puede abrir una sesión nueva | Observación |
| No efectos | No hay clasificación de riesgo, ni registro individual para el admin, ni notificación a terceros | Inspección |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-05 | Ante peligro explícito, la respuesta la produce el *fallback* determinista, no el LLM. | Habilitador | Paso 1–5 | MV-01 §7.1, SEG-01 |
| RN-11 | «Peligro explícito» = mensaje que expresa de forma manifiesta intención o riesgo de daño a sí mismo o a terceros. | Término | Paso 1 | MV-01 §7.1 |
| RN-06 | Los recursos de ayuda se leen de configuración por entorno, no de código. | Restricción | Paso 4, FA-01 | MV-01 §7.1, SD-12 |
| C-3 | Gate de seguridad previo: ante peligro explícito, el turno lo produce SEG-01, no el LLM. | Restricción | Paso 1 | CONTRATO |
| C-7 | No instrucciones de riesgo: no da medios ni métodos de daño. | Restricción | Todo el flujo | CONTRATO |
| C-10 | En modo seguridad se suspende la personalidad: sin humor, juego ni metáforas. | Restricción | Paso 3 | CONTRATO |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Seguridad (*fail safe*) | La ruta de seguridad opera aunque el LLM falle (RNF-06, §3.9.3). | *Fallback* con LLM deshabilitado en el 100 % de los casos de prueba (RC-01) |
| RE-02 | Seguridad (*risk identification*) | Detectar el peligro **explícito** del conjunto de prueba (§3.9.2). | *Recall* ≥ 0,90 sobre el set definido (RC-02) — honesto: explícito, no clínico |
| RE-03 | Seguridad (*operational constraint*) | Las guardas impiden salidas de riesgo (§3.9.1). | ≥ 0,95 de *prompts* adversarios bloqueados/seguros (RC-03) |
| RE-04 | Mantenibilidad | Señales y recursos configurables por entorno, no *hardcodeados* (RNF-05). | Grep del código: cero recursos/números embebidos |
| RE-05 | Seguridad (*hazard warning*) | La derivación advierte el riesgo y ofrece recursos (§3.9.4). | El mensaje ofrece emergencias + apoyo humano |

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | Pantalla de contención/derivación | Mostrar contención + recursos | mensaje fijo, recursos (por entorno) | Iniciar nueva sesión | 3–7 |
| Endpoint visible | `POST /api/chat/` (respuesta `mode=safety_fallback`) | Devolver el *fallback* | reply (fijo), mode | — | 5 |

> **Texto del *fallback*:** se aprovisiona por entorno; la plantilla de referencia (con marcadores `[línea de emergencia, config]`, `[línea de apoyo local, config]`) vive citada en SEG-01 §5 y en el plan §3.8. **No** se reproducen números fijos en este artefacto (RN-06/SD-12). Prototipos gráficos: **[Pendiente]**.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| EventoDeSeguridad | señal de peligro explícito | Validar / Confirmar | Paso 1 | Determinista; sin contenido individual almacenado |
| RecursoDeAyuda | referencia de derivación | Consultar | Paso 4 | Por entorno (RN-06); nunca embebido |
| Mensaje | turno disparador | Consultar (no persiste) | Paso 1 | No se almacena |
| Conversacion | estado del chat | Actualizar (suspender) | Paso 6 | Chat ordinario suspendido en la sesión |

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación |
|---|---|---|
| Requisito funcional | RF-11 | Realizado por este CU |
| Objetivo de negocio | OBJ-3 | Gate de seguridad / derivación |
| Regla de negocio | RN-05, RN-11, RN-06; C-3/C-7/C-10 | Gobiernan el flujo |
| Requisito de calidad | RC-01, RC-02, RC-03 | Anclas *safety* |
| Norma | ISO/IEC 25010:2023 §3.9.1/.2/.3/.4 (vía NORM-01) | Safety |
| Requisitos de seguridad | SEG-R1…SEG-R6 (SEG-01) | Realizados |
| Modelo de dominio | EventoDeSeguridad, RecursoDeAyuda, Mensaje, Conversacion | Conceptos |
| Diagrama de casos de uso | DCU-01 «Derivar ante peligro» (`<<extend>>` de CU-06) | Origen |
| Caso de prueba | CP-07 | Planificado |
| Robustez / secuencia | DR-07 / DS-07 | Planificados |
| Criterio de aceptación | CA-01…CA-04 | Verificación |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un mensaje de peligro explícito de prueba, cuando pasa el gate, entonces responde el *fallback* (no el LLM). | Flujo básico | Prueba de gate |
| CA-02 | Dado el LLM **deshabilitado**, cuando llega un mensaje de peligro, entonces el *fallback* igual se muestra. | FE-01 | Prueba fail-safe (RC-01 = 100 %) |
| CA-03 | Dado el modo *fallback*, cuando se muestra la respuesta, entonces no usa humor ni metáforas y ofrece recursos de config. | Flujo básico (paso 3–4) | Inspección del mensaje (C-10) |
| CA-04 | Dado un *fallback* activado, cuando se inspecciona el sistema, entonces no se almacena contenido ni se contabiliza clasificación de riesgo. | Postcondición | Inspección |

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Riesgo | El gate binario **no** detecta peligro implícito, ambiguo o encubierto. | Cobertura de seguridad | Declarado con honestidad (SEG-01 §2); solo se garantiza el explícito. | Aceptado |
| RA-02 | Decisión pendiente | El texto del *fallback* y los recursos (p. ej. líneas de Medellín) deben **revalidarse** antes del release. | Correctitud operativa | Por entorno; revalidación en gate de release (plan §3.8). | Abierto |
| RA-03 | Riesgo | Revisión por perfil de salud mental (nivel 6, deseable). | Calidad del protocolo | Recomendada en fase posterior (SEG-01 §9). | Abierto |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Contención + derivación |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Derivar ante peligro» |
| 3 | Actor primario identificado | ✅ | Usuario (beneficiario); disparo del sistema explicitado |
| 4 | Actores externos al sistema | ✅ | LLM **no** participa; recursos son salida |
| 5 | Flujo básico = escenario completo | ✅ | 8 pasos (plan §3.8) |
| 6 | Flujos alternativos suficientes | ✅ | FA-01 (recursos ausentes) |
| 7 | Flujos de excepción relevantes | ✅ | FE-01/FE-02 (fail-safe) |
| 8 | Términos del dominio (MD-01) usados | ✅ | EventoDeSeguridad, RecursoDeAyuda |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | Pantalla de contención + `/api/chat/` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | §14 |
| 14 | Sin detalle de implementación | ✅ | Caja negra |
| 15 | Auth como precondición/regla | ✅ | Hereda contexto de CU-06 |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19 (+ SEG-R, norma §3.9) |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ✅ | DR-07/DS-07 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | `<<extend>>` de CU-06; no sobre-claim; sin números embebidos |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto (beneficiario; disparo del sistema) |
| Objetivo | Contención + derivación por *fallback* determinista ante peligro explícito. |
| Disparador | El gate detecta peligro explícito (evento del sistema). |
| Precondiciones | Conversación activa; mensaje evaluado por el gate; recursos por entorno. |
| Conceptos del dominio | EventoDeSeguridad, RecursoDeAyuda, Mensaje, Conversacion. |
| Flujo básico | Suspende respuesta → contención fija → recursos → `safety_fallback` → suspende chat de la sesión → no almacena. |
| Flujos alternativos | Recursos no configurados → orientación genérica. |
| Flujos de excepción | LLM/red caídos → el *fallback* igual opera (fail-safe). |
| Postcondición de éxito | Contención mostrada; chat suspendido; sin contenido almacenado ni clasificación. |
| Reglas de negocio | RN-05, RN-11, RN-06; C-3/C-7/C-10. |
| Criterios de aceptación | CA-01…CA-04. |
| Casos relacionados | `<<extend>>` de CU-06. |

**Fin de ECU-07.**
