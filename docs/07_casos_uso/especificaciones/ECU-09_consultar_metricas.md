# ECU-09 — Especificación de caso de uso: «Consultar métricas de uso» (CU-09)
**ID documento:** DOC-CU-09 · **Caso de uso:** CU-09 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** DCU-01, MV-01, MD-01, REQ-01, PRIV-01, VIS-01, plan §3.2/§3.7.
**Forma:** **ágil** (núcleo ICONIX / plantilla §23).
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Identificación
| Campo | Valor |
|---|---|
| ID | CU-09 |
| Nombre | Consultar métricas de uso |
| Paquete | Administración de plataforma |
| Actor primario | Administrador de plataforma |
| Nivel | Usuario |
| Prioridad | Media |
| Frecuencia | Baja |
| Criticidad | Media |
| Estado | Propuesto |

## 2. Núcleo del caso de uso (versión resumida §23)
| Campo | Valor |
|---|---|
| Objetivo | Que el Administrador de plataforma consulte métricas agregadas de uso del servicio, sin acceder a ningún dato individual por usuario, para operar la plataforma con información suficiente sin comprometer la privacidad. |
| Disparador | El Administrador de plataforma, ya autenticado, abre la vista de métricas dentro del panel administrativo. |
| Precondiciones | **PRE-01 (Autorización):** existe una sesión vigente con rol = administrador, validado en el **servidor** (RNF-08); el rol no es seleccionable ni alterable desde el cliente. |
| Conceptos del dominio | **`MétricaDeUso`** — **no es una clase del dominio**: es una **vista derivada** (MV-01 §13.2; MD-01 §2) sobre datos operativos agregados (contadores), sin contenido individual. Se deriva de `Usuario` y `Conversacion` (MV-01 §13.2); no se dibuja como caja en el modelo de dominio ni se persiste como clase propia. Clases de dominio referenciadas: `Administrador` (MD-01 §2, único actor de este caso de uso) y `Usuario` (origen agregado de las cifras). |
| Postcondición de éxito | El Administrador de plataforma visualiza las cifras agregadas (total de cuentas, onboardings completados, llamadas al chat en los últimos 7 días y tasa técnica de éxito/error); el sistema no expone ningún conteo, dato ni contenido por usuario individual. |
| Casos relacionados | Requiere **CU-03** (Iniciar sesión — acceso administrativo por login separado, RF-14/RF-21). Hermano de **CU-08** (Consultar directorio de usuarios) y **CU-10** (Habilitar o deshabilitar el chatbot): las otras dos funciones del Administrador de plataforma (RN-03.1). |

### 2.1 Flujo básico
| Paso | Responsable | Acción | Concepto | Respuesta |
|---|---|---|---|---|
| 1 | Administrador de plataforma | Abre la vista de métricas de uso en el panel administrativo. | Panel administrativo (métricas) — frontera | El sistema muestra los agregados vigentes: total de cuentas, onboardings completados, llamadas al chat en los últimos 7 días y tasa técnica de éxito/error. |
| 2 | Administrador de plataforma | Revisa las cifras agregadas mostradas. | `MétricaDeUso` — vista derivada | El sistema no presenta, en ningún momento de este flujo, datos ni conteos por usuario ni contenido de conversaciones. |

### 2.2 Flujos alternativos
| ID | Nombre | Condición | Resultado |
|---|---|---|---|
| — | No aplica | El MVP ofrece una única vista de agregados (RN-03.3); no hay filtros, rangos ni variantes de presentación en esta fase. | No aplica — el flujo básico cubre el objetivo completo. |

### 2.3 Flujos de excepción
| ID | Error | Causa | Respuesta | Estado final |
|---|---|---|---|---|
| FE-01 | Sesión ausente | Quien solicita la vista no tiene una sesión autenticada vigente. | El sistema responde `401` y no muestra ninguna cifra. | El caso de uso no se inicia; el solicitante permanece fuera del panel de métricas. |
| FE-02 | Rol insuficiente | Quien solicita la vista tiene sesión vigente, pero su rol validado en servidor no es administrador. | El sistema responde `403` y no muestra ninguna cifra. | El caso de uso no se inicia; el solicitante permanece fuera del panel de métricas. |

## 3. Reglas de negocio (por ID)
| ID | Regla | Fuente |
|---|---|---|
| RN-03.1 | El administrador tiene exactamente tres funciones: directorio mínimo, métricas agregadas y kill switch. | MV-01 §7.4 |
| RN-03.3 | Las métricas visualizadas son **agregadas** — total de cuentas, onboardings, llamadas al chat en 7 días y tasa técnica de éxito/error —; nunca individuales. | MV-01 §7.4; REQ-01 (RF-16) |
| RN-03.5 | El administrador **no** ve: username completo, respuestas de encuesta, cápsula, mensajes, respuestas, personaje elegido, conteos por usuario, contraseñas ni tokens. | MV-01 §7.4 |
| PRIV-R10 | El administrador ve solo **agregados** y el **directorio truncado** (alias, ID truncado, estado, onboarding); nunca contenido, respuestas de encuesta, personaje elegido ni conteos por usuario. | PRIV-01 §3 |

## 4. Requisitos especiales
| ID | Categoría | Requisito | Criterio |
|---|---|---|---|
| RE-01 | Privacidad | Las cifras se presentan exclusivamente en forma agregada, con anti-reidentificación (PRIV-R10). | Ninguna cifra, conteo ni dato desagregado por usuario aparece en la vista, bajo ninguna condición. |
| RE-02 | Fiabilidad | La tasa técnica de éxito/error se expone como indicador operativo del servicio (RC-07). | La tasa mostrada corresponde a peticiones OK + fallback sobre el total de peticiones (MET-07). |
| RE-03 | Seguridad | El rol de administrador se determina y valida en el servidor, nunca en el cliente (RNF-08). | Alterar el cliente no habilita el acceso a la vista de métricas; toda solicitud revalida el rol en servidor. |

## 5. Criterios de aceptación (Dado/Cuando/Entonces)
| ID | Criterio | Flujo |
|---|---|---|
| CA-01 | **Dado** un Administrador de plataforma autenticado con sesión vigente, **cuando** consulta la vista de métricas de uso, **entonces** el sistema muestra cifras agregadas (total de cuentas, onboardings completados, llamadas al chat en 7 días y tasa técnica de éxito/error) sin ningún dato por usuario. | Flujo básico (§2.1) |
| CA-02 | **Dado** un solicitante sin sesión vigente o cuyo rol validado en servidor no es administrador, **cuando** intenta acceder a la vista de métricas, **entonces** el sistema responde `401` o `403` según corresponda y no muestra ninguna cifra. | Flujos de excepción (§2.3, FE-01/FE-02) |

## 6. Trazabilidad
| Elemento | Referencia |
|---|---|
| Requisito funcional → objetivo | RF-16 → OBJ-6 (Administración de plataforma, VIS-01) |
| Reglas de negocio | RN-03.1, RN-03.3, RN-03.5 (MV-01 §7.4) |
| Privacidad | PRIV-R10 (PRIV-01 §3) |
| Requisito de calidad | RC-07 (REQ-01 §3, GQM: MET-07, umbral ≥ 95 %) |
| Modelo de dominio | `MétricaDeUso` — vista derivada, **no** clase de dominio (MV-01 §13.2; MD-01 §2) |
| Diagrama de casos de uso | DCU-01, «Consultar métricas de uso» (paquete Administración de plataforma; RF-16 → OBJ-6) |
| Interfaz (referencia preliminar) | `GET /plataforma-admin/` — referencial; la tabla formal de endpoints queda diferida a ARQ-01, fase de construcción (ver `docs/00_gobernanza/ESTADO_PIPELINE.md`) |
| Criterios de aceptación | CA-01, CA-02 |
| Próximos artefactos ICONIX | DR-09 (robustez), DS-09 (secuencia) — planificados, no producidos en esta fase |
| Diseño (mockup) | DIS-00 P-15 + DIS-01 |

## 7. Checklist de revisión §22 (20 ítems)
| # | Criterio | Cumple |
|---|---|---|
| 1 | Objetivo único | ✅ Un solo objetivo: consultar métricas agregadas de uso (§2). |
| 2 | Nombre infinitivo + objeto | ✅ «Consultar métricas de uso», igual a DCU-01. |
| 3 | Actor primario | ✅ Administrador de plataforma; único actor humano (§1). |
| 4 | Actores externos | ✅ Ninguno; el Proveedor LLM (Groq) no interviene en esta vista de agregados. |
| 5 | Flujo básico completo | ✅ Dos pasos cubren apertura y visualización de agregados (§2.1). |
| 6 | Alternativos suficientes | ✅ «No aplica» documentado a propósito: vista única de agregados (RN-03.3), no una omisión (§2.2). |
| 7 | Excepciones relevantes | ✅ FE-01 (sesión ausente, `401`) y FE-02 (rol insuficiente, `403`), acorde con RNF-08 (§2.3). |
| 8 | Términos MD-01 | ✅ `MétricaDeUso` declarada explícitamente como vista derivada (MV-01 §13.2 / MD-01 §2), no como clase; `Administrador` conforme a MD-01 §2. |
| 9 | Sin sinónimos | ✅ «Administrador de plataforma» (identificación) y «Administrador» (narrativa) son la misma forma abreviada que usan DCU-01/MD-01, no un sinónimo nuevo. |
| 10 | Interfaces nombradas | ✅ «Panel administrativo (métricas)» como frontera (§2.1); `GET /plataforma-admin/` referenciado como interfaz preliminar (§6). |
| 11 | Reglas por ID | ✅ RN-03.1, RN-03.3, RN-03.5, PRIV-R10, cada una con fuente (§3). |
| 12 | Requisitos especiales separados | ✅ RE-01/RE-02/RE-03 en tabla propia (§4), distinta de las reglas de negocio (§3). |
| 13 | Postcondiciones verificables | ✅ Postcondición de éxito observable por inspección: cifras agregadas visibles, cero datos por usuario (§2). |
| 14 | Sin implementación | ✅ Caja negra funcional: no se especifica framework, plantilla ni consulta; el endpoint (§6) se marca explícitamente como referencia preliminar, no como diseño. |
| 15 | Auth como precondición | ✅ PRE-01 (sesión con rol = administrador validado en servidor) es precondición, no un paso del flujo básico (§2). |
| 16 | Trazabilidad RF/OBJ/RN/CA | ✅ RF-16 → OBJ-6, RN-03.1/.3/.5, CA-01/CA-02 enlazados en §6. |
| 17 | Criterios Dado/Cuando/Entonces | ✅ CA-01 y CA-02 en formato Dado/Cuando/Entonces explícito (§5). |
| 18 | Base robustez/secuencia | ✅ Flujo numerado y conceptos nombrados (frontera, vista derivada) dan base a DR-09/DS-09; ambos quedan **planificados**, no producidos en esta fase (§6). |
| 19 | Comprensible | ✅ Redacción en dos pasos, sin jerga técnica innecesaria, voz activa en presente. |
| 20 | Coherente con DCU-01 y canon §5 | ✅ Mismo nombre, actor y traza (RF-16 → OBJ-6) que DCU-01; preserva minimización, anti-reidentificación y uso no punitivo (RN-03.5, PRIV-R10). |

**Fin de ECU-09.**
