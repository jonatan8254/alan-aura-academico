# TRZ-01 — Matriz de trazabilidad del MVP
**ID:** TRZ-01 · **Hogar:** `docs/04_trazabilidad/` · **Fecha:** 2026-07-25 · **Versión:** v1.6 (SD-29: `RNF-02` y `RC-09` reapuntados a `ADR-002`; **la estructura de la trazabilidad no cambia** —el cambio de stack no crea ni destruye requisitos, y los conteos de §5 siguen siendo 26 RF y 16 clases—. SD-26: **RN-01.6** trazada desde RF-04/RF-05 — la cápsula siempre existe con `character` como mínimo; cero reglas huérfanas · SD-22:  RF-04/05 coherentes con la cápsula de 5 campos = `ContextoInicialConversacionalV1` · SD-21: **columna CU poblada** — cada RF trazado a su especificación `ECU-0X`; dimensión CU cerrada · SD-15: +RF-19…26 cuenta/acceso y sesión; admin realineado; MD-01 disponible · SD-17: RF-25/26 con límites de tasa exactos y RN-02.9).
**Insumos:** VIS-01 (OBJ-1…OBJ-7), MV-01 (vistas), contrato, REQ-01 (RF-01…26/RNF/RC/RN), PRIV-01, SEG-01, NORM-01, MD-01 (dominio).
**Consumidores:** verificación de cobertura; fase 2 (CU/dominio) y fase 4 (pruebas).
**Criterio de cierre:** **cero requisitos huérfanos** — todo RF traza a ≥1 objetivo, ≥1 regla y ≥1 prueba planificada; todo objetivo tiene ≥1 RF; todo RC tiene ≥1 RF **o RNF**.
**Columnas de fase posterior:** el **modelo de dominio** (`Dominio`, MD-01) y los **casos de uso** (`CU`, ECU-00…10) ya están **producidos** — la columna CU de §2 queda **poblada** (SD-21). Solo `Prueba ejecutada` sigue **⏳ pendiente** (fase 4).

---

## 1. Cadena de trazabilidad (forma canónica)
`Objetivo (VIS-01) → Actor → Modelo verbal (MV) → Regla (RN) → Requisito funcional (RF) → Requisito de calidad (RC) → Norma (NORM-01) → Prueba planificada → [CU ✅ (ECU-0X) → Dominio ✅ (MD-01) → Prueba ejecutada ⏳]`

## 2. Matriz principal (RF)

| RF | Objetivo | Actor | MV | Regla(s) | RC | Norma | Prueba planificada | CU (ECU) |
|---|---|---|---|---|---|---|---|---|
| RF-01 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-09, RN-01.1 | RC-06 | §3.4 | Verificar *disclosure* previo a captura | CU-05 |
| RF-02 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-01, RN-10, RN-01.2 | — | — | Caso <18 no continúa | CU-05 |
| RF-03 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-02, RN-07, RN-01.5 | RC-04 | Security | Otorgar/revocar consentimiento | CU-05 |
| RF-04 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-01.3, RN-01.4, RN-01.6 | RC-04 | Security | Completar dejando los 4 autorreportes vacíos; `character` obligatorio | CU-05 |
| RF-05 | OBJ-1/OBJ-4 | Usuario | MV-01 §Onboarding | RN-03, RN-01.6 | RC-04 | Security | Inspección: la cápsula = 5 campos + metadatos (`ContextoInicialConversacionalV1`); **siempre existe** tras el onboarding (mínimo `character`) | CU-05 |
| RF-06 | OBJ-1 | Usuario | MV-01 §Conversación | — | RC-06 | §3.4 | Presentación de Alan y Aura visible | **CU-14** |
| RF-07 | OBJ-2 | Usuario | MV-01 §Conversación | RN-02.6 | RC-08 | Func. suitability | Iniciar con personaje elegido | CU-06 |
| RF-08 | OBJ-2 | Usuario / LLM | MV-01 §Conversación | RN-02.2 | RC-05, RC-08 | Perf. / Func. | Intercambio de turnos coherentes | CU-06 |
| RF-09 | OBJ-2/OBJ-4 | LLM (gobernado) | MV-01 §Conversación | RN-02.2, RN-03 | RC-04 | Security | Inspección del *payload* al LLM | CU-06 |
| RF-10 | OBJ-3 | Sistema | MV-01 §Conversación | RN-02.1, RN-05 | RC-02 | §3.9.2 | Gate evaluado en cada mensaje | CU-06 |
| RF-11 | OBJ-3 | Sistema | MV-01 §Conversación/SEG-01 | RN-05, RN-11 | RC-01, RC-03 | §3.9.3/.1 | Fallback con LLM deshabilitado | **CU-07** |
| RF-12 | OBJ-2 | Usuario | MV-01 §Conversación | RN-02.6 | RC-08 | Func. suitability | Cambio de personaje | **CU-13** |
| RF-13 | OBJ-4 | Sistema | MV-01 §Conversación | RN-04, RN-02.5 | RC-04 | Security | No hay registro tras cerrar | CU-06 |
| RF-14 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.7 | RC-04 | Security | Usuario en ruta admin → 403; rol validado en servidor | CU-03 |
| RF-15 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.2 | RC-04 | Security | Directorio muestra solo campos mínimos (ID truncado) | CU-08 |
| RF-16 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.3 | RC-07 | Reliability | Métricas agregadas; sin datos por usuario | CU-09 |
| RF-17 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.4, RN-02.7 | RC-07 | Reliability | Con chatbot deshabilitado, nadie inicia conversación | CU-10 |
| RF-18 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.4 | RC-04 | Security | El kill switch queda auditado (autor/fecha) | CU-10 |
| RF-19 | OBJ-7 | Visitante | MV-01 §Cuenta | RN-04.5 | RC-06 | §3.4 | Landing visible sin autenticar; sin acceso a chat/datos | CU-01 |
| RF-20 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.1 | RC-04 | Security | Registro pide solo username/alias/contraseña | CU-02 |
| RF-21 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-03.7, RN-04.6 | RC-04 | Security | Login/logout; rol no seleccionable desde cliente | CU-03 |
| RF-22 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.3 | RC-04 | Security | Borrar perfil elimina la cápsula | **CU-11** |
| RF-23 | OBJ-7/OBJ-4 | Usuario | MV-01 §Cuenta | RN-04.3, RN-07 | RC-04 | Security | Revocada la personalización, la cápsula no alimenta | **CU-12** |
| RF-24 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.4 | RC-04 | Security | Eliminar cuenta → borrado en cascada, sin remanentes | CU-04 |
| RF-25 | OBJ-2 | Sistema | MV-01 §Conversación | RN-02.8 | RC-07 | Reliability | Alcanzados 20 mensajes/2.500 caracteres/350 tokens, invita a cerrar sin error | CU-06 |
| RF-26 | OBJ-2 | Sistema | MV-01 §Conversación | RN-02.9, plan §2.4/§4.13 | RC-07 | Reliability | Solicitud 4/min y 31/día → `429`; timeout 20s → `504`, sin romper la UI | CU-06 |

> **Columna CU poblada (SD-21; actualizada en el PDR-01):** cada RF traza a su especificación `ECU-NN`. Los **26 RF** quedan cubiertos por los **14** casos de uso, **cero huérfanos** y **ningún RF realizado por dos casos de uso**. Cuatro cambiaron de dueño al desglosarse el diagrama: RF-06 → CU-14, RF-12 → CU-13, RF-22 → CU-11, RF-23 → CU-12. (Detalle inverso RF→CU en `../07_casos_uso/especificaciones/ECU-00_indice_especificaciones.md` §5.)

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
| RC-09 flexibility | RNF-02 (despliegue en capa gratuita, `ADR-002`) | ✅ |
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

> **Resultado: cero requisitos huérfanos.** La columna **CU** ya está poblada (cada RF → su `ECU-0X`) y el **Dominio** existe (MD-01); la única casilla abierta es `Prueba ejecutada`, ⏳ por diseño (fase 4).

## 5.1 Matriz clase del dominio ↔ caso de uso (punto 4 de la retroalimentación docente)

El profesor pidió **verificar que los objetos del dominio se vean reflejados en los casos de uso**. La comprobación se publica aquí, contra `MD-01 v1.4` (16 clases) y `DCU-01 v2.1` (14 casos de uso). La columna «Robustez» es la evidencia más fuerte: es donde cada clase aparece como **objeto tipo Entidad**, con un arco a un controlador concreto.

| Clase (MD-01 v1.4) | Casos de uso que la manipulan | Robustez |
|---|---|---|
| `Visitante` | CU-01, CU-02, CU-04 (destino tras eliminar) | DR-01, DR-02, DR-04 |
| `TitularDeCuenta` | CU-02, CU-03 | DR-02, DR-03 |
| `Usuario` | CU-03, CU-04, CU-05, CU-08, CU-09, CU-11, CU-12 | DR-02, DR-03, DR-04, DR-05, DR-08, DR-09, DR-11, DR-12 |
| `Administrador` | CU-03, CU-10 | DR-03, DR-10 |
| `Consentimiento` | CU-05, CU-06, CU-08, CU-11, CU-12, CU-04 | DR-03, DR-04, DR-05, DR-06, DR-08, DR-11, DR-12 |
| `CapsulaDePerfil` | CU-05, CU-06, CU-11, CU-12, CU-13, CU-14, CU-04, CU-03 | DR-03, DR-04, DR-05, DR-06, DR-11, DR-12, DR-13, DR-14 |
| `Conversacion` | CU-06, CU-07, CU-09, CU-12, CU-13, CU-04 | DR-04, DR-06, DR-07, DR-09, DR-10, DR-12, DR-13 |
| `Mensaje` | CU-06, CU-07 | DR-06, DR-07 |
| `Personaje` | CU-06, CU-13, CU-14 | DR-06, DR-13, DR-14 |
| `Alan` | CU-13, CU-14 | DR-13, DR-14 |
| `Aura` | CU-13, CU-14 | DR-13, DR-14 |
| `EventoDeSeguridad` | CU-06, CU-07 | DR-06, DR-07 |
| `RecursoDeAyuda` | CU-07 | DR-07 |
| `DisponibilidadDelChatbot` | CU-06, CU-09, CU-10, CU-13, CU-07 | DR-06, DR-07, DR-09, DR-10, DR-13 |
| `ContadorDeUsoDiario` | CU-06, CU-04 | DR-04, DR-06 |
| `EventoOperativo` | CU-06, CU-09 | DR-06, DR-09 |

**Las 16 clases aparecen en al menos un caso de uso y en al menos un diagrama de robustez. Cero clases sin usar.**

> `Alan` y `Aura` eran, antes del PDR-01, las únicas clases sin manifestación en el diagrama de casos de uso. Extraer **CU-14 «Elegir acompañante (Alan o Aura)»** fue precisamente lo que las trajo, y es la razón por la que ese `<<include>>` supera su compuerta pese a que solo lo usa un caso de uso base.

## 5.2 Visibilidad RF → caso de uso

Los **26 RF** tienen ahora **caso de uso propio y único**. Antes del PDR-01, trece no tenían manifestación gráfica y tres casos de uso absorbían diecisiete.

| Caso de uso | RF que realiza | | Caso de uso | RF que realiza |
|---|---|---|---|---|
| CU-01 | RF-19 | | CU-08 | RF-15 |
| CU-02 | RF-20 | | CU-09 | RF-16 |
| CU-03 | RF-14, RF-21 | | CU-10 | RF-17, RF-18 |
| CU-04 | RF-24 | | **CU-11** | **RF-22** |
| CU-05 | RF-01…RF-05 | | **CU-12** | **RF-23** |
| CU-06 | RF-07…RF-10, RF-13, RF-25, RF-26 | | **CU-13** | **RF-12** |
| CU-07 | RF-11 | | **CU-14** | **RF-06** |

Cuando una especificación cita un RF que **no** realiza, lo etiqueta como *cedido*, *relacionado* o *vecino* y dice a quién pertenece — por ejemplo `ECU-08` cita RF-14 aclarando que lo realiza CU-03, y `ECU-07` cita RF-10 aclarando que el gate vive en CU-06.

## 6. Cierre
- **Confirmadas:** cobertura completa objetivo↔RF↔RC↔norma; **columna CU poblada** (RF → `ECU-NN`), cero huérfanos, **16/16 clases del dominio manifestadas en casos de uso** (§5.1) y **26/26 RF con caso de uso propio y único** (§5.2).
- **Recomendaciones:** al abrir fase 4, ejecutar las pruebas planificadas (`CP-XX`) y medir umbrales; encadenar cada `ECU-NN` con su robustez (`DR-NN`, ya producida: 14 diagramas) y secuencia (`DS-XX`).
- **Pendientes:** columna `Prueba ejecutada` ⏳ (fase 4).

**Fin de TRZ-01.**
