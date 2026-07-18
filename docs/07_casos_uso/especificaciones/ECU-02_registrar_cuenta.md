# ECU-02 — Especificación de caso de uso: «Registrar cuenta» (CU-02)
**ID documento:** DOC-CU-02 · **Caso de uso:** CU-02 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** DCU-01, MV-01, MD-01, REQ-01, VIS-01, PRIV-01, plan §3.1/§4.9.
**Forma:** **ágil** (núcleo ICONIX / plantilla §23 de la skill `use-case-specifier`).
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Identificación
| Campo | Valor |
|---|---|
| ID | CU-02 |
| Nombre | Registrar cuenta |
| Paquete | Acceso y cuenta |
| Actor primario | Visitante (pasa a Usuario al crear la cuenta) |
| Nivel | Usuario |
| Prioridad | Alta |
| Frecuencia | Media |
| Criticidad | Media |
| Estado | Propuesto |

## 2. Núcleo del caso de uso (versión resumida §23)
| Campo | Valor |
|---|---|
| Objetivo | Crear una cuenta con datos mínimos (username, alias, contraseña) para poder acceder al servicio. |
| Disparador | El Visitante elige «Registrarse» y abre el formulario de registro. |
| Precondiciones | PRE-01 (Funcional) El Visitante no tiene sesión activa. · PRE-02 (Datos) El username propuesto no está en uso (se valida). |
| Conceptos del dominio | Usuario (se crea). |
| Postcondición de éxito | Se crea un Usuario con username, alias y contraseña (hasheada), con rol=user asignado en el servidor; aún sin Consentimiento ni CapsulaDePerfil asociados. |
| Casos relacionados | Sigue a CU-01 «Consultar presentación del servicio»; precede a CU-03 «Iniciar sesión» y a CU-05 «Otorgar consentimiento y caracterizar el perfil» (onboarding). |

### 2.1 Flujo básico (curso normal)
| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema |
|---|---|---|---|---|
| 1 | Visitante | Abre el formulario de registro. | — | Muestra el formulario de registro (frontera: Formulario de registro) con los campos username, alias y contraseña. |
| 2 | Visitante | Ingresa username, alias y contraseña en el formulario de registro, y lo envía. | Usuario | Valida el formato de los campos y la unicidad del username. |
| 3 | Sistema | Crea la cuenta de Usuario con la contraseña protegida (hasheada) y el rol de usuario asignado en el servidor. | Usuario | Confirma el registro e invita a iniciar sesión. |

### 2.2 Flujos alternativos
| ID | Nombre | Condición | Resultado |
|---|---|---|---|
| FA-01 | Username ya en uso | En el paso 2, el username propuesto ya existe (PRE-02). | El sistema indica que el username está en uso y solicita otro; el flujo retorna al paso 2. |

### 2.3 Flujos de excepción
| ID | Error/evento | Causa | Respuesta del sistema | Estado final |
|---|---|---|---|---|
| FE-01 | Entrada inválida | Campos incompletos o con formato incorrecto en el paso 2. | Responde `400` y muestra el error de validación sin crear la cuenta. | Sin cuenta creada. |

## 3. Reglas de negocio (por ID)
| ID | Regla | Fuente |
|---|---|---|
| RN-04.1 | El registro pide solo username, alias y contraseña; no nombre legal, documento, correo, teléfono, dirección ni fecha de nacimiento. | MV-01 §7.5 (REQ-01 RF-20) |
| RN-04.6 | No hay recuperación de contraseña por correo ni verificación de correo. | MV-01 §7.5 |
| RNF-08 | El rol (usuario/administrador) se determina y valida en el servidor; no seleccionable ni alterable desde el cliente. | REQ-01 §2 |
| PRIV-R12 | La contraseña se almacena hasheada; nunca en claro, en el cliente ni accesible al admin. | PRIV-01 |

## 4. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | Minimización de datos: el registro captura únicamente los 3 campos definidos (username, alias, contraseña), conforme a RN-04.1. | El registro no solicita ni almacena datos identificatorios adicionales (nombre legal, documento, correo, teléfono, dirección, fecha de nacimiento). |
| RE-02 | Seguridad | La contraseña se almacena hasheada (PRIV-R12); el rol se asigna y valida en el servidor (RNF-08); los secretos no llegan al cliente (RNF-09). | La contraseña nunca se persiste en claro ni se transmite al cliente; el rol no es alterable desde el cliente. |

## 5. Criterios de aceptación (Dado/Cuando/Entonces)
| ID | Criterio | Flujo |
|---|---|---|
| CA-01 | Dado un Visitante, cuando registra una cuenta con username, alias y contraseña válidos, entonces el sistema crea la cuenta sin pedir datos identificatorios adicionales y con la contraseña hasheada. | Flujo básico |
| CA-02 | Dado un username ya existente, cuando el Visitante intenta registrarlo, entonces el sistema lo rechaza y solicita otro. | FA-01 |
| CA-03 | Dada una entrada inválida, cuando se envía el formulario de registro, entonces el sistema responde `400` sin crear la cuenta. | FE-01 |

## 6. Trazabilidad
| Elemento | Referencia |
|---|---|
| Requisito funcional | RF-20 → OBJ-7 (REQ-01) |
| Reglas de negocio | RN-04.1, RN-04.6, RNF-08, RNF-09, PRIV-R12 |
| Modelo de dominio | Usuario (MD-01) |
| Caso de uso (diagrama) | DCU-01 «Registrar cuenta» (paquete Acceso y cuenta) |
| Interfaz técnica (referencia, no es paso) | Endpoint `POST /registro/` |
| Criterios de aceptación | CA-01, CA-02, CA-03 |
| Diseño (planificado) | DR-02/DS-02 (robustez/secuencia, pendientes) |
| Diseño (mockup) | DIS-00 P-02 + DIS-01 |

## 7. Checklist de revisión §22 (evidencia del gate)
| # | Criterio | Cumple |
|---|---|---|
| 1 | Objetivo único | ✅ Un solo objetivo: crear la cuenta con datos mínimos para acceder al servicio. |
| 2 | Nombre infinitivo + objeto | ✅ «Registrar cuenta». |
| 3 | Actor primario | ✅ Visitante (pasa a Usuario al crear la cuenta). |
| 4 | Actores externos | ✅ Ninguno además del actor primario; no interviene el Proveedor LLM ni el Administrador. |
| 5 | Flujo básico completo | ✅ 3 pasos, desde el disparador hasta la postcondición de éxito. |
| 6 | Alternativos suficientes | ✅ FA-01 cubre la única variación relevante del flujo (unicidad de username). |
| 7 | Excepciones relevantes | ✅ FE-01 cubre la entrada inválida (`400`). |
| 8 | Términos MD-01 | ✅ Usuario es el único concepto de dominio involucrado; vocabulario alineado con MD-01. |
| 9 | Sin sinónimos ambiguos | ✅ Se usa «Usuario» según MD-01 (actor/rol + clase de dominio); no se mezcla con «perfil» ni «cápsula». |
| 10 | Interfaces nombradas | ✅ Formulario de registro nombrado como objeto de frontera en el paso 1. |
| 11 | Reglas separadas por ID | ✅ RN-04.1, RN-04.6, RNF-08, PRIV-R12 en la sección 3, no incrustadas en los pasos. |
| 12 | Requisitos especiales separados | ✅ RE-01 (privacidad) y RE-02 (seguridad) en la sección 4. |
| 13 | Postcondiciones verificables | ✅ Usuario creado con username/alias/contraseña hasheada y rol=user asignado en servidor; verificable por inspección. |
| 14 | Sin detalle de implementación | ✅ Sin SQL, controladores, Django ni endpoints como pasos; el endpoint aparece solo como referencia en la trazabilidad (§6). |
| 15 | Auth como precondición/regla | ✅ Iniciar sesión no es un paso de este CU; PRE-01 exige ausencia de sesión activa y RNF-08 gobierna el rol como regla, no como paso. |
| 16 | Trazabilidad RF/OBJ/RN/CA | ✅ Sección 6: RF-20 → OBJ-7, reglas de negocio, modelo de dominio y CA-01…03. |
| 17 | Criterios Dado/Cuando/Entonces | ✅ CA-01, CA-02, CA-03 en formato Dado/Cuando/Entonces. |
| 18 | Base para robustez/secuencia | ✅ Flujo de 3 pasos + 1 alternativo + 1 excepción, suficiente para derivar objetos de frontera/control/entidad. |
| 19 | Comprensible | ✅ Redactado en voz activa, tiempo presente, sin jerga técnica. |
| 20 | Coherente con DCU-01 y canon §5 | ✅ Actor, nombre y traza (RF-20 → OBJ-7) coinciden con DCU-01 §2; sin sobre-claim clínico ni captura de dato fuera de RN-04.1. |

**Fin de ECU-02.**
