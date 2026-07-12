# TRZ-01 — Matriz de trazabilidad del MVP
**ID:** TRZ-01 · **Hogar:** `docs/04_trazabilidad/` · **Fecha:** 2026-07-12 · **Versión:** v1.2 (SD-15: +RF-19…26 cuenta/acceso y sesión; admin realineado; MD-01 disponible · SD-17: RF-25/26 con límites de tasa exactos y RN-02.9).
**Insumos:** VIS-01 (OBJ-1…OBJ-7), MV-01 (vistas), contrato, REQ-01 (RF-01…26/RNF/RC/RN), PRIV-01, SEG-01, NORM-01, MD-01 (dominio).
**Consumidores:** verificación de cobertura; fase 2 (CU/dominio) y fase 4 (pruebas).
**Criterio de cierre:** **cero requisitos huérfanos** — todo RF traza a ≥1 objetivo, ≥1 regla y ≥1 prueba planificada; todo objetivo tiene ≥1 RF; todo RC tiene ≥1 RF **o RNF**.
**Columnas de fase posterior** (`Caso de uso`, `Dominio`, `Prueba ejecutada`): marcadas **⏳ pendiente** — planificadas, no producidas (fuera de alcance de esta fase).

---

## 1. Cadena de trazabilidad (forma canónica)
`Objetivo (VIS-01) → Actor → Modelo verbal (MV) → Regla (RN) → Requisito funcional (RF) → Requisito de calidad (RC) → Norma (NORM-01) → Prueba planificada → [CU ⏳ → Dominio ⏳ → Prueba ejecutada ⏳]`

## 2. Matriz principal (RF)

| RF | Objetivo | Actor | MV | Regla(s) | RC | Norma | Prueba planificada | CU/Dominio |
|---|---|---|---|---|---|---|---|---|
| RF-01 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-09, RN-01.1 | RC-06 | §3.4 | Verificar *disclosure* previo a captura | ⏳ |
| RF-02 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-01, RN-10, RN-01.2 | — | — | Caso <18 no continúa | ⏳ |
| RF-03 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-02, RN-07, RN-01.5 | RC-04 | Security | Otorgar/revocar consentimiento | ⏳ |
| RF-04 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-01.3, RN-01.4 | RC-04 | Security | Completar con campos opcionales vacíos | ⏳ |
| RF-05 | OBJ-1/OBJ-4 | Usuario | MV-01 §Onboarding | RN-03 | RC-04 | Security | Inspección de contenido de la cápsula | ⏳ |
| RF-06 | OBJ-1 | Usuario | MV-01 §Conversación | — | RC-06 | §3.4 | Presentación de Alan y Aura visible | ⏳ |
| RF-07 | OBJ-2 | Usuario | MV-01 §Conversación | RN-02.6 | RC-08 | Func. suitability | Iniciar con personaje elegido | ⏳ |
| RF-08 | OBJ-2 | Usuario / LLM | MV-01 §Conversación | RN-02.2 | RC-05, RC-08 | Perf. / Func. | Intercambio de turnos coherentes | ⏳ |
| RF-09 | OBJ-2/OBJ-4 | LLM (gobernado) | MV-01 §Conversación | RN-02.2, RN-03 | RC-04 | Security | Inspección del *payload* al LLM | ⏳ |
| RF-10 | OBJ-3 | Sistema | MV-01 §Conversación | RN-02.1, RN-05 | RC-02 | §3.9.2 | Gate evaluado en cada mensaje | ⏳ |
| RF-11 | OBJ-3 | Sistema | MV-01 §Conversación/SEG-01 | RN-05, RN-11 | RC-01, RC-03 | §3.9.3/.1 | Fallback con LLM deshabilitado | ⏳ |
| RF-12 | OBJ-2 | Usuario | MV-01 §Conversación | RN-02.6 | RC-08 | Func. suitability | Cambio de personaje | ⏳ |
| RF-13 | OBJ-4 | Sistema | MV-01 §Conversación | RN-04, RN-02.5 | RC-04 | Security | No hay registro tras cerrar | ⏳ |
| RF-14 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.7 | RC-04 | Security | Usuario en ruta admin → 403; rol validado en servidor | ⏳ |
| RF-15 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.2 | RC-04 | Security | Directorio muestra solo campos mínimos (ID truncado) | ⏳ |
| RF-16 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.3 | RC-07 | Reliability | Métricas agregadas; sin datos por usuario | ⏳ |
| RF-17 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.4, RN-02.7 | RC-07 | Reliability | Con chatbot deshabilitado, nadie inicia conversación | ⏳ |
| RF-18 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.4 | RC-04 | Security | El kill switch queda auditado (autor/fecha) | ⏳ |
| RF-19 | OBJ-7 | Visitante | MV-01 §Cuenta | RN-04.5 | RC-06 | §3.4 | Landing visible sin autenticar; sin acceso a chat/datos | ⏳ |
| RF-20 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.1 | RC-04 | Security | Registro pide solo username/alias/contraseña | ⏳ |
| RF-21 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-03.7, RN-04.6 | RC-04 | Security | Login/logout; rol no seleccionable desde cliente | ⏳ |
| RF-22 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.3 | RC-04 | Security | Borrar perfil elimina la cápsula | ⏳ |
| RF-23 | OBJ-7/OBJ-4 | Usuario | MV-01 §Cuenta | RN-04.3, RN-07 | RC-04 | Security | Revocada la personalización, la cápsula no alimenta | ⏳ |
| RF-24 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.4 | RC-04 | Security | Eliminar cuenta → borrado en cascada, sin remanentes | ⏳ |
| RF-25 | OBJ-2 | Sistema | MV-01 §Conversación | RN-02.8 | RC-07 | Reliability | Alcanzados 20 mensajes/1.500 caracteres/350 tokens, invita a cerrar sin error | ⏳ |
| RF-26 | OBJ-2 | Sistema | MV-01 §Conversación | RN-02.9, plan §2.4/§4.13 | RC-07 | Reliability | Solicitud 4/min y 31/día → `429`; timeout 20s → `504`, sin romper la UI | ⏳ |

## 3. Cobertura de requisitos de calidad (RC → RF)
| RC | Cubierto por | ¿≥1 RF? |
|---|---|---|
| RC-01 *fail safe* | RF-11 | ✅ |
| RC-02 *risk identification* | RF-10 | ✅ |
| RC-03 *operational constraint* | RF-11 (guardas) | ✅ |
| RC-04 minimización/security | RF-03/04/05/09/13/14/15/18/20/21/22/23/24 | ✅ |
| RC-05 performance | RF-08 | ✅ |
| RC-06 interaction capability | RF-01/06/19 | ✅ |
| RC-07 reliability | RF-08/11/16/17/25/26 | ✅ |
| RC-08 func. suitability | RF-07/08/12 | ✅ |
| RC-09 flexibility | RNF-02 (despliegue) | ✅ |
| RC-10 maintainability | RNF-05 (recursos/textos por entorno) | ✅ |

## 4. Cobertura de objetivos (OBJ → RF)
| OBJ | RF que lo realizan |
|---|---|
| OBJ-1 (onboarding/consentimiento/cápsula) | RF-01…RF-06 |
| OBJ-2 (conversación gobernada) | RF-07, RF-08, RF-09, RF-12, RF-25, RF-26 |
| OBJ-3 (gate de seguridad) | RF-10, RF-11 |
| OBJ-4 (minimización/no persistencia) | RF-05, RF-09, RF-13, RF-23 |
| OBJ-5 (calidad medible) | RC-01…RC-10 (todos con umbral en REQ-01) |
| OBJ-6 (administración: 3 funciones) | RF-14…RF-18 |
| OBJ-7 (cuenta y acceso) | RF-19…RF-24 |

## 5. Verificación de huérfanos
- **RF sin regla:** solo RF-06 (presentación) no invoca una RN de restricción — es un requisito de presentación derivado de OBJ-1/MV-01 §Conversación; **no es huérfano** (traza a objetivo y prueba). Todos los demás RF (incluidos RF-14…RF-26) tienen ≥1 RN. ✅
- **RF sin prueba planificada:** ninguno (columna «Prueba planificada» completa para RF-01…RF-26). ✅
- **RC sin RF/RNF:** ninguno (§3); RC-09 traza vía RNF-02 y RC-10 vía RNF-05 (concerns de despliegue/entorno, no funciones). ✅
- **OBJ sin RF:** ninguno; OBJ-6 (admin) y OBJ-7 (cuenta) ya cubiertos (§4). ✅
- **RN sin RF:** RN-08 (uso no punitivo) es transversal (PRIV-R5/R6) — traza vía PRIV-01, **regla transversal**, no huérfana. ✅

> **Resultado: cero requisitos huérfanos.** Las únicas casillas abiertas son las columnas de **fase posterior** (CU/Dominio/Prueba ejecutada), marcadas ⏳ por diseño.

## 6. Cierre
- **Confirmadas:** cobertura completa objetivo↔RF↔RC↔norma.
- **Recomendaciones:** al abrir fase 2, poblar la columna CU desde MV-01 (vistas) y MD-01; al abrir fase 4, ejecutar las pruebas planificadas y medir umbrales.
- **Pendientes:** columnas ⏳ (fase posterior).

**Fin de TRZ-01.**
