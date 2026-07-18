# ECU-01 — Especificación de caso de uso: «Consultar presentación del servicio» (CU-01)
**ID documento:** DOC-CU-01 · **Caso de uso:** CU-01 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** DCU-01, MV-01, MD-01, REQ-01, VIS-01, plan §3.1/§2.2.
**Forma:** **ágil** (núcleo ICONIX / plantilla §23 de la skill `use-case-specifier`) — caso de uso simple, un escenario soleado.
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Identificación

| Campo | Valor |
|---|---|
| ID | CU-01 |
| Nombre | Consultar presentación del servicio |
| Paquete funcional | Acceso y cuenta |
| Actor primario | Visitante |
| Nivel de abstracción | Usuario |
| Prioridad | Media |
| Frecuencia de uso | Alta |
| Criticidad | Baja |
| Estado | Propuesto |

## 2. Núcleo del caso de uso (versión resumida §23)

| Campo | Valor |
|---|---|
| Objetivo | Que una persona no autenticada conozca el alcance no clínico, los límites y los accesos del servicio antes de decidir registrarse. |
| Disparador | El Visitante abre la página de presentación (landing) pública. |
| Precondiciones | PRE-01 (Funcional): el sistema está desplegado y disponible; no requiere autenticación. |
| Conceptos del dominio | Ninguno persistente — se muestra información del servicio; «Visitante» es actor sin clase de dominio (MV-01 §3). |
| Postcondición de éxito | El Visitante queda informado del alcance, los límites y los accesos; no se captura ningún dato; no se crea sesión. |
| Casos relacionados | Precede a CU-02 (Registrar cuenta) y CU-03 (Iniciar sesión). |

### 2.1 Flujo básico (curso normal)

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema |
|---|---|---|---|---|
| 1 | Visitante | Solicita la página de presentación. | Página de presentación (objeto de frontera). | Muestra la presentación pública: propósito de acompañamiento no clínico, límites (no diagnostica, no atiende urgencias en autonomía) y accesos (registro / inicio de sesión). |
| 2 | Visitante | Lee el alcance y los límites del servicio. | Página de presentación (objeto de frontera). | Mantiene visibles los accesos a registro e inicio de sesión. |
| 3 | Visitante | Elige registrarse o iniciar sesión. | Página de presentación; destino: acceso elegido (registro / inicio de sesión). | Dirige al Visitante al acceso elegido. |

### 2.2 Flujos alternativos

| ID | Nombre | Condición | Resultado |
|---|---|---|---|
| FA-01 | Continuar a registro | El Visitante decide registrarse. | El sistema lo dirige al acceso de registro; continúa en CU-02 (Registrar cuenta). |
| FA-02 | Continuar a inicio de sesión | El Visitante ya tiene cuenta y decide iniciar sesión. | El sistema lo dirige al acceso de inicio de sesión; continúa en CU-03 (Iniciar sesión). |

### 2.3 Flujos de excepción

| ID | Error/evento | Causa | Respuesta del sistema | Estado final |
|---|---|---|---|---|
| FE-01 | Página de presentación no disponible | El servicio está caído o en mantenimiento. | Muestra un estado de indisponibilidad y permite reintentar. | Sin sesión creada; sin datos capturados. |

## 3. Reglas de negocio (por ID)

| ID | Regla | Fuente |
|---|---|---|
| RN-04.5 | El Visitante solo consulta la presentación; no accede a chat ni a datos. | MV-01 §7.5 |
| RN-09 | Disclosure de IA y alcance no clínico visibles antes de capturar cualquier dato. | MV-01 §7.1 |

## 4. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Usabilidad | Interfaz en español (Colombia), con lenguaje claro para adultos (RNF-01). | Los textos de la presentación son comprensibles para el público adulto objetivo. |
| RE-02 | Seguridad | Acceso público de solo lectura; no expone datos ni chat (RN-04.5). | Sin autenticación no hay acceso al chat ni a datos de usuario. |

## 5. Criterios de aceptación (Dado/Cuando/Entonces)

| ID | Criterio | Flujo |
|---|---|---|
| CA-01 | Dado un visitante no autenticado, cuando abre la presentación, entonces ve el alcance no clínico, los límites y los accesos (registro/login) sin poder entrar al chat ni a datos. | Flujo básico |
| CA-02 | Dado un visitante en la presentación, cuando elige registrarse, entonces el sistema lo lleva al registro (CU-02). | FA-01 |

## 6. Trazabilidad

| Elemento | Referencia |
|---|---|
| Requisito funcional | RF-19 |
| Objetivo | OBJ-7 |
| Regla(s) | RN-04.5, RN-09 |
| Modelo de dominio | Actor Visitante (sin clase de dominio) — MV-01 §3 |
| Diagrama de casos de uso | DCU-01 — «Consultar presentación del servicio» |
| Criterio(s) | CA-01, CA-02 |
| Robustez/secuencia planificados | DR-01 / DS-01 (planificados) |
| Diseño (mockup) | DIS-00 P-01 + DIS-01 |

## 7. Checklist de revisión §22 (evidencia del gate)

| # | Criterio | Cumple |
|---|---|---|
| 1 | Objetivo único y claro | ✅ Un solo objetivo: informar el alcance no clínico, los límites y los accesos antes del registro. |
| 2 | Nombre en verbo infinitivo + objeto | ✅ «Consultar presentación del servicio». |
| 3 | Actor primario identificado | ✅ Visitante (DCU-01 §1). |
| 4 | Actores externos al sistema | ✅ Visitante es humano no autenticado, externo al sistema; sin actor de sistema externo en este CU. |
| 5 | Flujo básico = escenario de éxito completo | ✅ 3 pasos, desde la solicitud de la página hasta la elección de acceso. |
| 6 | Flujos alternativos suficientes | ✅ FA-01/FA-02 cubren las dos salidas naturales del escenario (registro e inicio de sesión). |
| 7 | Flujos de excepción relevantes | ✅ FE-01 cubre la indisponibilidad del servicio. |
| 8 | Términos del dominio (MD-01) usados | ✅ «Visitante» conforme a MV-01 §3; sin términos ajenos al vocabulario MD-01. |
| 9 | Sin sinónimos ambiguos | ✅ «Visitante» se usa de forma consistente; no se alterna con «usuario» ni «invitado». |
| 10 | Interfaces nombradas donde aplica | ✅ «Página de presentación» nombrada como objeto de frontera en los 3 pasos. |
| 11 | Reglas de negocio separadas (por ID) | ✅ RN-04.5 y RN-09 en tabla §3, no incrustadas en los pasos del flujo. |
| 12 | Requisitos especiales separados | ✅ RE-01/RE-02 en tabla §4. |
| 13 | Postcondiciones verificables | ✅ «no se captura ningún dato; no se crea sesión», verificable por inspección. |
| 14 | Sin detalle de implementación (caja negra) | ✅ Sin mención de controladores, tablas, SQL, Django ni endpoints. |
| 15 | Auth como precondición/regla, no CU incluido | ✅ PRE-01 declara que no requiere autenticación; no hay caso de uso incluido de login. |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ Tabla §6: RF-19, OBJ-7, RN-04.5/RN-09, CA-01/CA-02. |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ CA-01/CA-02 en tabla §5. |
| 18 | Utilizable como base de robustez y secuencia | ✅ Pasos discretos con objeto de frontera («Página de presentación») listos para DR-01/DS-01. |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ Lenguaje llano, sin jerga técnica. |
| 20 | Coherente con DCU-01 y canon §5 | ✅ Mismo nombre, actor y traza RF-19→OBJ-7 que DCU-01; respeta no sobre-claim clínico y disclosure de IA (RN-09). |

**Fin de ECU-01.**
