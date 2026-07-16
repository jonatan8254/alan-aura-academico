# ECU-03 — Especificación de caso de uso: «Iniciar sesión» (CU-03)
**ID documento:** DOC-CU-03 · **Caso de uso:** CU-03 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** DCU-01, MV-01, MD-01, REQ-01, VIS-01, plan §3.1/§3.2/§4.13.
**Forma:** **ágil** (núcleo ICONIX / plantilla §23). Nota: este CU **satisface el gate de acceso/autenticación** del sistema (DCU-01 decisión 4); por eso la autenticación aparece como el objetivo del CU, y la protección de rutas admin como flujo de excepción/requisito especial, no como `<<include>>`.
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Identificación
**ID:** CU-03 · **Nombre:** Iniciar sesión · **Paquete:** Acceso y cuenta · **Actor primario:** Usuario adulto (variante: Administrador de plataforma, acceso separado — ver FA-01) · **Nivel:** Usuario · **Prioridad:** Alta · **Frecuencia:** Alta · **Criticidad:** Media · **Estado:** Propuesto.

## 2. Núcleo del caso de uso (versión resumida §23)
| Campo | Valor |
|---|---|
| Objetivo | Autenticar al Usuario (o al Administrador, por acceso separado) y establecer una sesión con el rol validado en el servidor. |
| Disparador | El Usuario abre la página de inicio de sesión e ingresa sus credenciales. |
| Precondiciones | PRE-01 (Datos): el Usuario tiene una cuenta creada (CU-02 «Registrar cuenta»). · PRE-02 (Autorización): el rol se determina y valida en el servidor; no es seleccionable desde el cliente. |
| Conceptos del dominio | Usuario, Administrador (se consultan para autenticar). |
| Postcondición de éxito | La sesión queda establecida con el rol validado en el servidor: el Usuario accede a su onboarding o conversación; el Administrador, por el acceso separado, accede al panel administrativo. |
| Casos relacionados | Sigue a CU-02 «Registrar cuenta». Habilita, para el Usuario: CU-04 «Gestionar cuenta y datos personales», CU-05 «Otorgar consentimiento y caracterizar el perfil» y CU-06 «Conversar con el acompañante». Habilita, para el Administrador: CU-08 «Consultar directorio de usuarios», CU-09 «Consultar métricas de uso» y CU-10 «Habilitar o deshabilitar el chatbot». |

### 2.1 Flujo básico (curso normal)
| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema |
|---|---|---|---|---|
| 1 | Usuario | Abre la página de inicio de sesión. | — | Muestra el formulario de credenciales (frontera: Página de inicio de sesión). |
| 2 | Usuario | Ingresa sus credenciales en el formulario y lo envía. | Usuario | Verifica las credenciales y determina el rol (usuario o administrador) en el servidor. |
| 3 | Sistema | Establece la sesión con el rol validado en el servidor. | Usuario | Redirige al Usuario al área correspondiente (onboarding o conversación). |

### 2.2 Flujos alternativos
| ID | Nombre | Condición | Resultado |
|---|---|---|---|
| FA-01 | Login de Administrador | El actor accede por el inicio de sesión separado de administrador e ingresa sus credenciales (plan §3.2). | Si el servidor confirma `rol=admin`, el sistema establece la sesión y lo lleva al panel administrativo; si no confirma ese rol, no obtiene privilegios de administrador (ver FE-02). |
| FA-02 | Cerrar sesión | El Usuario o el Administrador, con sesión activa, elige cerrar sesión. | El sistema termina la sesión activa (logout). |

### 2.3 Flujos de excepción
| ID | Error/evento | Causa | Respuesta del sistema | Estado final |
|---|---|---|---|---|
| FE-01 | Credenciales inválidas | En el paso 2 (o en FA-01), el usuario o la contraseña ingresados no coinciden con ninguna cuenta registrada. | Muestra un mensaje genérico de «credenciales incorrectas» (sin revelar qué campo falló) y no crea la sesión. | Sin sesión. |
| FE-02 | Rol insuficiente en ruta administrativa | Un Usuario ordinario (rol=user) intenta acceder a una ruta administrativa, aunque manipule el cliente. | Responde `403` o aplica una redirección segura; no concede privilegios de administrador. | Sin acceso; el rol no se altera. |
| FE-03 | Sesión ausente | Se intenta operar una función protegida sin una sesión activa. | Responde `401`. | Sin acceso. |

## 3. Reglas de negocio (por ID)
| ID | Regla | Fuente |
|---|---|---|
| RN-03.7 | El acceso administrativo es por login separado y el rol se valida en el servidor (no alterable desde el cliente). | MV-01 §7.4 (REQ-01 RF-14; plan §3.2/§2.6) |
| RNF-08 | El rol (usuario/administrador) se determina y valida en el servidor; no seleccionable ni alterable desde el cliente. | REQ-01 §2 |
| RNF-09 | Las claves/tokens (LLM, sesión) no llegan al navegador ni al repositorio. | REQ-01 §2 |

## 4. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Seguridad | El rol se determina y valida en el servidor (RNF-08); las rutas administrativas están protegidas ante rol insuficiente (403); los mensajes de error de autenticación no revelan qué campo falló. | Manipular el cliente (por ejemplo, alterar un valor de rol en el navegador) no cambia el rol efectivo de la sesión; una solicitud a ruta administrativa sin rol=admin responde 403 o redirección segura; el mensaje de credenciales inválidas es genérico, sin indicar si falló el usuario o la contraseña. |

## 5. Criterios de aceptación (Dado/Cuando/Entonces)
| ID | Criterio | Flujo |
|---|---|---|
| CA-01 | Dado un Usuario con credenciales válidas, cuando inicia sesión, entonces obtiene una sesión con su rol determinado por el servidor. | Flujo básico (§2.1) |
| CA-02 | Dado un Administrador que ingresa por el acceso separado, cuando el servidor confirma rol=admin, entonces accede al panel administrativo. | FA-01 (§2.2) |
| CA-03 | Dado un Usuario ordinario que manipula el cliente, cuando visita una ruta administrativa, entonces recibe 403 o una redirección segura, sin obtener privilegios. | FE-02 (§2.3) |

## 6. Trazabilidad
| Elemento | Referencia |
|---|---|
| Requisito funcional | RF-14, RF-21 → OBJ-6/OBJ-7 |
| Reglas de negocio | RN-03.7, RNF-08, RNF-09 |
| Modelo de dominio | Usuario, Administrador (MD-01) |
| Caso de uso (diagrama) | DCU-01 «Iniciar sesión» (paquete Acceso y cuenta) |
| Interfaz técnica (referencia, no es paso) | Endpoints `POST /login/`, `POST /logout/`, `POST /plataforma-admin/login/` (referencia) |
| Criterios de aceptación | CA-01, CA-02, CA-03 |
| Diseño (planificado) | DR-03/DS-03 (robustez/secuencia, pendientes) |

## 7. Checklist de revisión §22 (evidencia del gate) — 20 ítems
| # | Criterio | Cumple |
|---|---|---|
| 1 | Objetivo único | ✅ Un solo objetivo: autenticar y establecer una sesión con el rol validado en el servidor (cubre al Usuario y, por acceso separado, al Administrador). |
| 2 | Nombre infinitivo + objeto | ✅ «Iniciar sesión» (infinitivo «iniciar» + objeto «sesión»). |
| 3 | Actor primario | ✅ Usuario adulto, con variante Administrador de plataforma por acceso separado (FA-01), no un segundo actor primario. |
| 4 | Actores externos | ✅ Ninguno; no interviene el Proveedor LLM (la autenticación es previa a la conversación y no depende de él). |
| 5 | Flujo básico completo | ✅ 3 pasos, desde que el Usuario abre la página de inicio de sesión hasta que el sistema establece la sesión con el rol validado (§2.1). |
| 6 | Alternativos suficientes | ✅ FA-01 (login de Administrador) y FA-02 (cerrar sesión) cubren las variantes relevantes de acceso y salida (§2.2). |
| 7 | Excepciones relevantes | ✅ FE-01 (credenciales inválidas), FE-02 (rol insuficiente en ruta administrativa) y FE-03 (sesión ausente) cubren los errores de autenticación/autorización (§2.3). |
| 8 | Términos MD-01 | ✅ Usuario y Administrador son clases de MD-01 («Actor/rol + clase de dominio», MD-01 §2); no se introducen clases nuevas. |
| 9 | Sin sinónimos ambiguos | ✅ «Usuario»/«Administrador» se usan según MD-01; «sesión» y «rol» son conceptos de acceso (RNF-08), no clases de MD-01, y no se mezclan con «cuenta» (creada en CU-02) ni con «perfil»/«cápsula». |
| 10 | Interfaces nombradas | ✅ «Página de inicio de sesión» nombrada como frontera en el paso 1; el acceso separado de administrador se nombra en FA-01. |
| 11 | Reglas por ID | ✅ RN-03.7, RNF-08, RNF-09 en la sección 3, no incrustadas en los pasos. |
| 12 | Requisitos especiales separados | ✅ RE-01 (seguridad) en la sección 4, aparte de las reglas de negocio de la sección 3. |
| 13 | Postcondiciones verificables | ✅ «sesión establecida con el rol validado en el servidor; el Usuario accede a onboarding o conversación; el Administrador accede al panel» es observable y se verifica en CA-01/CA-02. |
| 14 | Sin implementación | ✅ Sin SQL, controladores, Django ni endpoints como pasos; los endpoints aparecen solo como referencia en la trazabilidad (§6). |
| 15 | Auth como precondición/regla (no CU incluido) | ✅ Este es el propio CU de acceso: no hay «iniciar sesión» como `<<include>>` de otro caso de uso; la protección de rutas administrativas es un flujo de excepción (FE-02) y una regla (RNF-08), no un caso de uso incluido. |
| 16 | Trazabilidad RF/OBJ/RN/CA | ✅ Sección 6: RF-14, RF-21 → OBJ-6/OBJ-7, reglas de negocio, modelo de dominio y CA-01…03 enlazados. |
| 17 | Criterios Dado/Cuando/Entonces | ✅ CA-01, CA-02, CA-03 en ese formato exacto (§5). |
| 18 | Base robustez/secuencia | ✅ El flujo distingue actor, frontera (página de inicio de sesión / panel administrativo) y concepto de dominio (Usuario, Administrador), listo para robustez (DR-03/DS-03 planificados). |
| 19 | Comprensible | ✅ Redactado en voz activa, tiempo presente, sin jerga técnica. |
| 20 | Coherente con DCU-01 y canon §5 | ✅ Actor, nombre y traza (RF-14/RF-21 → OBJ-6/OBJ-7) coinciden con DCU-01 §2 y con la decisión de modelado 4 de DCU-01 («Iniciar sesión» sí es caso de uso); sin sobre-claim clínico ni captura de datos fuera de canon. |

**Fin de ECU-03.**
