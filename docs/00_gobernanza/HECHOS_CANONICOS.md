# Hechos canónicos del subproyecto «Alan & Aura Académico»
**ID:** HC-01 · **Familia:** gobernanza · **Hogar:** `docs/00_gobernanza/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 (SD-30: H-20 261→263 y H-21 149→150, por la corrección de `DR-04`) · **Estado:** vigente.
**Propósito:** ser la **fuente única** de las cifras y conteos que aparecen repetidos en varios artefactos. Cuando dos documentos discrepan, **manda esta tabla**.
**Insumos:** `MD-01`, `DCU-01`, `REQ-01`, `PER-01`, `PRIV-01`, `DR-00` — contados directamente, no citados de segunda mano.
**Consumidores:** `scripts/verificar_coherencia.py`, y cualquier pasada de edición que toque cifras.
**Naturaleza:** registro de conteos verificables. **No interpreta**, por eso no lleva marcas de evidencia salvo H-07, que depende de servicios externos y va `[N6]`.
**DoD:** cada fila tiene valor, dueño y al menos un consumidor; cada valor obsoleto tiene declarado dónde puede aparecer legítimamente; los conteos estructurales se reproducen con los comandos de §Verificación.

---

## Por qué existe

Las mismas cifras viven repetidas en cinco o seis documentos sin nadie que las concilie. Eso ya produjo una divergencia real: cuando el `PDR-01` elevó el límite por mensaje de 1.500 a 2.500 caracteres, la propagación quedó a medias durante un tiempo y hubo que registrarla como pendiente. Nadie lo detectó al editar; lo detectó una persona leyendo, semanas después.

Esta tabla convierte «revisar coherencia» en algo comprobable.

**Qué comprueba automáticamente `scripts/verificar_coherencia.py`, y qué no.** Comprueba **ocho** de los veintiún hechos: H-01, H-04, H-05, H-10 (que ningún valor obsoleto sobreviva como afirmación viva) y H-11, H-12, H-13, H-14 (contando directamente sobre los `.puml`). Los demás —H-02, H-03, H-06 a H-09 y H-15 a H-21— **son responsabilidad del lector**: están aquí para que exista una fuente única, no porque una máquina los vigile. Además el script **solo recorre archivos `.md`**: quedan fuera los `.puml`, los `.html` de *mockups* y el `.docx` del informe. Decirlo importa porque un «verde» que se cree más amplio de lo que es resulta peor que no tener validador.

**Alcance:** cifras y conteos verificables. **No** sustituye a los artefactos: `REQ-01` sigue siendo el dueño de los requisitos y `PER-01` del mapa de persistencia. Esta tabla solo garantiza que todos digan lo mismo.

## Tabla de hechos

Todos los valores fueron **verificados contra los artefactos** el 2026-08-01 (comando en §Verificación).

| # | Hecho | Valor canónico | Dueño | También se afirma en |
|---|---|---|---|---|
| H-01 | Caracteres por mensaje | **2.500** | `REQ-01` RF-25 | `MV-01` RN-02.8, `ECU-06` §15, `TRZ-01` |
| H-02 | Mensajes de usuario por sesión | **20** | `REQ-01` RF-25 | `MV-01` RN-02.8, `ECU-06` §15 |
| H-03 | Tokens de salida del LLM | **350** | `REQ-01` RF-25 | `MV-01` RN-02.8, `ECU-06` §15 |
| H-04 | Límite de tasa | **3/min · 30/día** | `REQ-01` RNF-10 | `MV-01` RN-02.9, `ECU-06` §13, `RF-26` |
| H-05 | Tiempo máximo de espera del LLM | **20 s** → `504` | `REQ-01` RNF-10 | `MV-01` RN-02.9, `ECU-06` FE-07 |
| H-06 | Intercambios de sesión enviados al LLM | **≤ 4** | `REQ-01` RNF-04 | `PRIV-R1`, `MV-01` RN-02.2/RN-03, `ECU-06` §17 |
| H-07 | Latencia objetivo | **p95 ≤ 5 s** `[N6]` | `REQ-01` RC-05 | `PLAN-01` R-6, `ECU-06` RE-04 |
| H-08 | Entidades persistidas | **7** | `PER-01` §2 | `PRIV-01` §2, plan §4.14 |
| H-09 | Entidades que **no** existirán | **6** | `PER-01` §2 | plan §4.14 |
| H-10 | Campos de la cápsula | **5 de contenido + 2 de metadatos** | `PRIV-01` §2 | `PER-01` §3.3, `REQ-01` RF-05, `MD-01` §6 |
| H-11 | Clases del modelo de dominio | **16** | `MD-01` | `ESTADO_PIPELINE`, `TRZ-01` §5.2 |
| H-12 | Relaciones del modelo de dominio | **17** | `MD-01` | `ESTADO_PIPELINE` |
| H-13 | Casos de uso | **14** | `DCU-01` | `ECU-00`, `ESTADO_PIPELINE`, `TRZ-01` |
| H-14 | Actores | **5** | `DCU-01` | `ECU-00` |
| H-15 | Requisitos funcionales | **26** (RF-01…RF-26) | `REQ-01` | `TRZ-01` §5.1, `ECU-00` §5 |
| H-16 | Requisitos no funcionales | **10** (RNF-01…RNF-10) | `REQ-01` | `TRZ-01` |
| H-17 | Requisitos de calidad y sus métricas | **10 RC + 10 MET** | `REQ-01` §3 | `NORM-01`, `TRZ-01` |
| H-18 | Reglas transversales de persistencia | **7** (PER-T1…PER-T7) | `PER-01` §5 | — |
| H-19 | Requisitos de privacidad | **14 reglas** = 12 numeradas (PRIV-R1…R12) + 2 subreglas (R3.1, R3.2) | `PRIV-01` | `PER-01`, `ECU-05`/`ECU-12` |
| H-20 | Elementos de los diagramas de robustez | **263** = 15 actores / 38 bordes / 150 controladores / 60 entidades | `DR-00` | `ESTADO_PIPELINE`, `RPD-01` |
| H-21 | Controladores de robustez (cota inferior de casos de prueba) | **150** | `DR-00` | `ESTADO_PIPELINE` |

## Valores obsoletos y dónde SÍ pueden aparecer

Esta sección es tan importante como la anterior: sin ella, un barrido automático marca como error lo que es memoria legítima del proyecto.

| Valor obsoleto | Valor vigente | Puede aparecer en | Nunca en |
|---|---|---|---|
| 1.500 caracteres | **2.500** (H-01) | `CHANGELOG`, `REGISTRO_DECISIONES` (SD-17), `PDR-01`, bloques de «Cambio vX.Y» de `MV-01`, y las notas de `ECU-06` que documentan el cambio | Ninguna regla, requisito o criterio de aceptación vigente |
| 12 clases · 12 relaciones | **16 · 17** (H-11, H-12) | `CHANGELOG`, `PDR-01`, `ESTADO_PIPELINE` §PDR-01 | `MD-01`, `TRZ-01` |
| 10 casos de uso | **14** (H-13) | `CHANGELOG`, `PDR-01`, `REGISTRO_DECISIONES` (SD-28) | `DCU-01`, `ECU-00`, `TRZ-01` |
| 3 campos de cápsula | **5 + 2** (H-10) | `REGISTRO_DECISIONES` (SD-22), `ESTADO_PIPELINE` | `PRIV-01`, `PER-01`, `REQ-01` |
| Django · SQLite · PythonAnywhere | React · DynamoDB · Vercel + AWS (`ADR-002`) | `00_PLAN_CODEX_ORIGINAL`, `00_AUDITORIA_PLAN_CODEX`, `ADR-001` (superada), `CHANGELOG`, `REGISTRO_DECISIONES`, `MANIFIESTO_FUENTES` | Cualquier afirmación vigente sobre qué se va a construir |

**Regla de lectura:** un valor obsoleto en un *bloque de historial, changelog o registro de decisiones* es **correcto** — describe lo que se decidió entonces. El mismo valor en una *regla, requisito, criterio de aceptación o descripción del sistema* es un **defecto**.

## Estado de los pendientes declarados aguas abajo

Dos discrepancias abiertas, ambas **anteriores a `ADR-002` y ajenas al cambio de arquitectura**. Se documentan aquí porque su dueña es la **fase D.5**, y porque `scripts/verificar_coherencia.py` las exime por nombre: si no constaran, el verde del validador las escondería.

**1. El pendiente de los 1.500 caracteres ya está resuelto en los documentos, pero sigue declarado como abierto.**
`ECU-00` §7 y `ECU-06` (nota de RN-02.8) dicen todavía que *«`MV-01` §7.3 y `RF-25` aún dicen 1.500 caracteres»*. Verificado el 2026-08-01: **`MV-01` RN-02.8 dice 2.500 y `REQ-01` RF-25 dice 2.500**. La propagación se completó; lo que quedó sin actualizar fue el **registro del pendiente**, no los documentos. Corregirlo exige tocar dos especificaciones, y la pasada de `ADR-002` declaró la capa ICONIX intacta.

**2. La matriz de clases candidatas de `MV-01` sigue en 12; `MD-01` tiene 16.**
`MV-01` §4 cierra con *«Las **12 clases candidatas** participan en ≥1 relación: cero clases huérfanas»*, y su matriz lista doce filas. Pero el `PDR-01` llevó `MD-01` de 12 a **16 clases** (entran `Visitante`, `TitularDeCuenta`, `ContadorDeUsoDiario` y `EventoOperativo`) sin actualizar esa matriz. **Es un hueco de propagación del `PDR-01`, no un valor histórico**: la línea es una afirmación de verificación vigente, del tipo que la «Regla de lectura» de arriba clasifica como defecto. Cerrarlo exige añadir las cuatro clases a la matriz y derivar sus relaciones — trabajo de análisis, no un retoque, y por eso no se hizo en la pasada de `ADR-002`.

## Verificación

Los conteos de esta tabla se reproducen con:

```bash
python scripts/verificar_coherencia.py
```

Los valores estructurales se obtuvieron contando directamente sobre los artefactos fuente:

```bash
grep -cE '^\s*class ' docs/06_dominio/MD-01_modelo_dominio.puml                     # H-11 → 16
grep -cE '^\s*usecase ' docs/07_casos_uso/DCU-01_casos_uso.puml                     # H-13 → 14
cat docs/07_casos_uso/robustez/DR-[0-9][0-9]_*.puml | grep -cE '^\s*control '       # H-21 → 150
```

## Mantenimiento

- **Cambiar un valor de esta tabla es una decisión**, no una edición: exige entrada en `REGISTRO_DECISIONES` y propagación a todos los artefactos de la fila.
- Al añadir un hecho nuevo, añadir también su fila de valor obsoleto si sustituye a otro.
- Esta tabla **no lleva marcas de evidencia** porque no interpreta: todo lo que contiene es conteo verificable. La única excepción es H-07, que depende de servicios externos y va marcada `[N6]`.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación (SD-29). 21 hechos canónicos verificados contra los artefactos, tabla de valores obsoletos con su ámbito legítimo, y registro del pendiente D.5 sobre el límite de caracteres, que ya estaba resuelto en los documentos pero seguía declarado como abierto. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** `H-20` pasa de **261** a **263** elementos y `H-21` de **149** a **150** controladores, por la corrección de `DR-04` (entra `EventoOperativo` con su controlador `C_ConservarTelemetriaSinIdentidad`, hallazgo `H-9` de `DS-00`). Propagado a `DR-00`, `generar_svg_robustez.py` —cuyos conteos estaban grabados a fuego—, `ESTADO_PIPELINE`, `INDICE_MAESTRO` y al paquete de secuencia. **Cambiar un valor de esta tabla es una decisión, no una edición:** por eso queda registrada en `REGISTRO_DECISIONES` como SD-30. |
