# ECU-08 — Especificación de caso de uso: «Consultar directorio de usuarios» (CU-08)
**ID documento:** DOC-CU-08 · **Caso de uso:** CU-08 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** DCU-01, MV-01, MD-01, REQ-01, PRIV-01, VIS-01, plan §3.2/§3.7/§4.9.
**Forma:** **ágil** (núcleo ICONIX / plantilla §23).
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Identificación
**ID:** CU-08 · **Nombre:** Consultar directorio de usuarios · **Paquete:** Administración de plataforma · **Actor primario:** Administrador de plataforma · **Nivel:** Usuario · **Prioridad:** Media · **Frecuencia:** Baja · **Criticidad:** Media (privacidad) · **Estado:** Propuesto.

## 2. Núcleo del caso de uso (versión resumida §23)
| Campo | Valor |
|---|---|
| Objetivo | Que el Administrador vea un directorio mínimo de usuarios para operar la plataforma, sin acceder a datos individuales sensibles. |
| Disparador | El Administrador, autenticado, abre la vista de directorio en el panel. |
| Precondiciones | PRE-01 (Autorización): el Administrador tiene sesión con rol=admin validado en servidor (ver CU-03/FA-01). |
| Conceptos del dominio | Usuario (se consulta como vista mínima). |
| Postcondición de éxito | El Administrador ve la lista con campos mínimos; no se expone contenido individual. |
| Casos relacionados | Requiere CU-03 (Iniciar sesión — login admin); hermano de CU-09 (Consultar métricas de uso) y CU-10 (Habilitar o deshabilitar el chatbot). |

### 2.1 Flujo básico
| Paso | Responsable | Acción | Concepto | Respuesta |
|---|---|---|---|---|
| 1 | Administrador | Abre la vista de directorio en el panel administrativo. | Interfaz: Panel administrativo (vista de directorio) | El sistema muestra el directorio mínimo: alias, ID truncado, fecha de registro, estado y si completó el onboarding. |
| 2 | Administrador | Revisa la lista del directorio. | Usuario (vista mínima) | El sistema mantiene ocultos el username completo, las respuestas de encuesta, la CapsulaDePerfil, los Mensajes y el personaje elegido. |

### 2.2 Flujos alternativos
| ID | Nombre | Condición | Resultado |
|---|---|---|---|
| — | No aplica | — | No aplica — vista única en el MVP. El directorio no pagina ni filtra (una sola vista, sin variantes). |

### 2.3 Flujos de excepción
| ID | Error | Causa | Respuesta | Estado final |
|---|---|---|---|---|
| FE-01 | Sesión ausente | Quien intenta abrir el directorio no tiene una sesión activa (no autenticado). | El sistema responde `401` y no muestra el directorio. | Sin acceso. |
| FE-02 | Rol insuficiente | Quien intenta abrir el directorio está autenticado pero no tiene rol=admin (usuario ordinario). | El sistema responde `403` y no muestra el directorio. | Sin acceso. |

## 3. Reglas de negocio (por ID)
| ID | Regla | Fuente |
|---|---|---|
| RN-03.1 | El Administrador tiene exactamente tres funciones (directorio, métricas, kill switch); consultar el directorio es una de ellas. | MV-01 §7.4; REQ-01 §1 |
| RN-03.2 | El directorio muestra únicamente: alias, ID truncado, fecha de registro, estado y si completó el onboarding. | REQ-01 §1 (RF-15); MV-01 §7.2–§7.5 |
| RN-03.5 | El Administrador no ve username completo, respuestas de encuesta, CapsulaDePerfil, Mensajes, personaje elegido, conteos por usuario, contraseñas ni tokens. | REQ-01 §4 (consolidado); MV-01 §7.2–§7.5 |
| PRIV-R10 | El administrador ve solo agregados y el directorio truncado (alias, ID truncado, estado, onboarding); nunca contenido, respuestas de encuesta, personaje elegido ni conteos por usuario. | PRIV-01 §3 |
| RNF-08 | El rol (usuario/administrador) se determina y valida en el servidor; no seleccionable ni alterable desde el cliente. | REQ-01 §2 |

## 4. Requisitos especiales
| ID | Categoría | Requisito | Criterio |
|---|---|---|---|
| RE-01 | Privacidad | El directorio expone solo el conjunto mínimo/truncado de campos (PRIV-R10); principio anti-reidentificación. | En ninguna respuesta del directorio aparece el username completo, contenido de conversación, respuestas de encuesta ni otro dato individual sensible. |
| RE-02 | Seguridad | El rol se valida en el servidor, no en el cliente (RNF-08). | Cualquier solicitud de un actor sin rol=admin recibe `401` (sin sesión) o `403` (rol insuficiente); el directorio no se sirve. |

## 5. Criterios de aceptación (Dado/Cuando/Entonces)
| ID | Criterio | Flujo |
|---|---|---|
| CA-01 | Dado un Administrador autenticado con rol validado en servidor, cuando consulta el directorio de usuarios, entonces el sistema muestra alias, ID truncado, fecha de registro, estado y onboarding completado, y NO muestra username completo ni contenido individual. | Flujo básico (§2.1) |
| CA-02 | Dado un actor no administrador (sin sesión, o autenticado con rol insuficiente), cuando intenta acceder a la vista de directorio, entonces el sistema responde `401` o `403` según el caso y no expone el directorio. | Flujos de excepción FE-01/FE-02 (§2.3) |

## 6. Trazabilidad
| Elemento | Referencia |
|---|---|
| Requisito funcional | RF-15 → OBJ-6 |
| Reglas de negocio | RN-03.2, RN-03.5, PRIV-R10, RNF-08 |
| Modelo de dominio | Usuario (vista mínima) |
| Caso de uso (diagrama) | DCU-01, «Consultar directorio de usuarios» |
| Interfaz de referencia | `GET /plataforma-admin/` (referencia) |
| Criterios de aceptación | CA-01, CA-02 |
| Fases siguientes (planificadas) | DR-08 (robustez), DS-08 (secuencia) |

## 7. Checklist de revisión §22 (20 ítems)
| # | Criterio | Cumple |
|---|---|---|
| 1 | Objetivo único | ✅ — un solo objetivo: ver el directorio mínimo sin acceder a datos individuales. |
| 2 | Nombre infinitivo + objeto | ✅ — «Consultar» (infinitivo) + «directorio de usuarios» (objeto). |
| 3 | Actor primario | ✅ — Administrador de plataforma, único. |
| 4 | Actores externos | ✅ — ninguno; no interviene el Proveedor LLM ni otro actor de sistema. |
| 5 | Flujo básico completo | ✅ — apertura de la vista y ocultamiento explícito de campos sensibles (§2.1). |
| 6 | Alternativos suficientes | ✅ — se documenta «no aplica» con justificación (vista única del MVP, §2.2). |
| 7 | Excepciones relevantes | ✅ — FE-01 (sesión ausente) y FE-02 (rol insuficiente) cubren el acceso indebido. |
| 8 | Términos MD-01 | ✅ — usa «Usuario» tal como está definido en MD-01; no introduce clases nuevas. |
| 9 | Sin sinónimos | ✅ — «Administrador» y «Usuario» se usan de forma consistente, sin variantes. |
| 10 | Interfaces nombradas | ✅ — «Panel administrativo (vista de directorio)» identificado como frontera (§2.1). |
| 11 | Reglas por ID | ✅ — RN-03.1, RN-03.2, RN-03.5, PRIV-R10, RNF-08 (§3). |
| 12 | Requisitos especiales separados | ✅ — RE-01/RE-02 en §4, aparte de las reglas de negocio de §3. |
| 13 | Postcondiciones verificables | ✅ — «ve la lista con campos mínimos; no se expone contenido individual» es observable y se verifica en CA-01. |
| 14 | Sin implementación | ✅ — sin SQL/Django/endpoints como pasos; el endpoint aparece solo como referencia de trazabilidad (§6), no como paso del flujo. |
| 15 | Auth como precondición | ✅ — PRE-01 (Autorización) en §2; «iniciar sesión» no se modela como caso de uso incluido, solo como caso relacionado. |
| 16 | Trazabilidad RF/OBJ/RN/CA | ✅ — RF-15 → OBJ-6, reglas de negocio y CA-01/CA-02 enlazados en §6. |
| 17 | Criterios Dado/Cuando/Entonces | ✅ — CA-01 y CA-02 en ese formato exacto (§5). |
| 18 | Base robustez/secuencia | ✅ — el flujo básico distingue actor, frontera (panel administrativo) y concepto de dominio (Usuario), listo para robustez (DR-08/DS-08 planificados). |
| 19 | Comprensible | ✅ — lenguaje llano, sin jerga técnica innecesaria, verificable por un lector no técnico. |
| 20 | Coherente con DCU-01 y canon §5 | ✅ — mismo nombre, actor y traza RF-15 → OBJ-6 que DCU-01 §2; respeta el canon de minimización, privacidad por defecto y uso no punitivo reflejado en PRIV-01/REQ-01. |

**Fin de ECU-08.**
