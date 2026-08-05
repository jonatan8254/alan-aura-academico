# Hechos canónicos del subproyecto «Alan & Aura Académico»
**ID:** HC-01 · **Familia:** gobernanza · **Hogar:** `docs/00_gobernanza/` · **Fecha:** 2026-08-04 · **Versión:** v1.6 (SD-39: seis hechos se mueven por el retrabajo del `CDR-01`, entra `H-29` y los cuatro conteos de `MC-01` pasan a comprobarse por script). v1.5 (SD-34: el respaldo de la base de datos entra como valor obsoleto). v1.4 (SD-32: entran `H-25`…`H-28`, los conteos del modelo de clases de diseño, y dos filas nuevas de valor obsoleto). v1.3 (SD-31: se documenta el **cuarto bloque** del validador —`VERSIONES DECLARADAS`— y por qué su alcance es deliberadamente estrecho). v1.2: H-20 en **262**, H-21 en **150** y tres hechos nuevos del paquete de secuencia · **Estado:** vigente.
**Propósito:** ser la **fuente única** de las cifras y conteos que aparecen repetidos en varios artefactos. Cuando dos documentos discrepan, **manda esta tabla**.
**Insumos:** `MD-01`, `DCU-01`, `REQ-01`, `PER-01`, `PRIV-01`, `DR-00` — contados directamente, no citados de segunda mano.
**Consumidores:** `scripts/verificar_coherencia.py`, y cualquier pasada de edición que toque cifras.
**Naturaleza:** registro de conteos verificables. **No interpreta**, por eso no lleva marcas de evidencia salvo H-07, que depende de servicios externos y va `[N6]`.
**DoD:** cada fila tiene valor, dueño y al menos un consumidor; cada valor obsoleto tiene declarado dónde puede aparecer legítimamente; los conteos estructurales se reproducen con los comandos de §Verificación.

---

## Por qué existe

Las mismas cifras viven repetidas en cinco o seis documentos sin nadie que las concilie. Eso ya produjo una divergencia real: cuando el `PDR-01` elevó el límite por mensaje de 1.500 a 2.500 caracteres, la propagación quedó a medias durante un tiempo y hubo que registrarla como pendiente. Nadie lo detectó al editar; lo detectó una persona leyendo, semanas después.

Esta tabla convierte «revisar coherencia» en algo comprobable.

**Qué comprueba automáticamente `scripts/verificar_coherencia.py`, y qué no.** Comprueba **ocho** de los veinticuatro hechos: H-01, H-04, H-05, H-10 (que ningún valor obsoleto sobreviva como afirmación viva) y H-11, H-12, H-13, H-14 (contando directamente sobre los `.puml`). Los demás —H-02, H-03, H-06 a H-09 y H-15 a H-24— **son responsabilidad del lector**: están aquí para que exista una fuente única, no porque una máquina los vigile. **Desde `SD-31` hay un cuarto bloque, `VERSIONES DECLARADAS`,** que contrasta el inventario de `INDICE_MAESTRO` contra la ficha de cada artefacto. Nació de un error real: el inventario decía `DS-00…14 v1.0` cuando `DS-00` iba por v1.3, y una lectura a ojo no lo vio. Su alcance es **deliberadamente estrecho**: una primera versión miraba toda mención `ARTEFACTO vX.Y` del corpus y dio **202 hallazgos, casi ninguno un defecto** —la inmensa mayoría son procedencia, «`Visitante` | Clase de `MD-01 v1.4`», que es legítimamente histórica—. Un bloque con esa relación señal/ruido no se lee: se ignora, y entonces no vigila nada. El inventario, en cambio, **sí afirma el estado actual**, y ahí una versión mal se propaga a quien lo consulte.

Además el script **solo recorre archivos `.md`**: quedan fuera los `.puml`, los `.html` de *mockups* y el `.docx` del informe. Decirlo importa porque un «verde» que se cree más amplio de lo que es resulta peor que no tener validador.

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
| H-20 | Elementos de los diagramas de robustez | **262** = 15 actores / 38 bordes / 150 controladores / 59 entidades | `DR-00` | `ESTADO_PIPELINE`, `RPD-01` |
| H-21 | Controladores de robustez (cota inferior de casos de prueba) | **150** | `DR-00` | `ESTADO_PIPELINE` |
| H-22 | Mensajes de los diagramas de secuencia | **283** | `DS-00` | `DOP-01`, `REGISTRO_DECISIONES` |
| H-23 | Operaciones asignadas (delta de `DOP-01`) | **193** sobre 16 clases de `MD-01` + las del espacio de la solución | `DOP-01` | `DS-00`, el diagrama de clases |
| H-24 | Casos de prueba derivados de los controladores | **181** | `CP-00` | `DS-00`, `TRZ-DS-01` |
| H-25 | Clases del modelo de clases de diseño | **43** = 16 del problema + 27 de solución | `MC-01` | `MC-00`, `COD-01`, `ESTADO_PIPELINE` |
| H-26 | Operaciones del modelo de clases | **201** pares (clase, operación) = **193 nombres distintos** + 8 repeticiones | `MC-01` | `MC-00`, `COD-01`, `DOP-01` |
| H-27 | Atributos del modelo de clases | **51** propios de clase (+ 34 literales de enumerado = 85, que es lo que cuenta el validador) | `MC-01` | `MC-00`, `COD-01` |
| H-28 | Clases del espacio de la solución | **27** = 2 de control + 1 de auditoría + 18 de frontera + 6 tipos de transferencia | `MC-01_matriz_procedencia.md §4` | `DOP-01 §8`, `TRZ-DS-01 §3`, `DS-00 §7` |
| H-29 | Relaciones del modelo de clases de diseño | **80** reales = 4 generalizaciones + 1 composición + 12 asociaciones (**las 17 de `MD-01`**) + 63 dependencias. El `.puml` dibuja **2 conectores entre notas** que **no** son relaciones y no se cuentan | `MC-01` | `MC-00 §3`, `MC-01_matriz_procedencia §7` |

## Valores obsoletos y dónde SÍ pueden aparecer

Esta sección es tan importante como la anterior: sin ella, un barrido automático marca como error lo que es memoria legítima del proyecto.

| Valor obsoleto | Valor vigente | Puede aparecer en | Nunca en |
|---|---|---|---|
| 1.500 caracteres | **2.500** (H-01) | `CHANGELOG`, `REGISTRO_DECISIONES` (SD-17), `PDR-01`, bloques de «Cambio vX.Y» de `MV-01`, y las notas de `ECU-06` que documentan el cambio | Ninguna regla, requisito o criterio de aceptación vigente |
| 12 clases · 12 relaciones | **16 · 17** (H-11, H-12) | `CHANGELOG`, `PDR-01`, `ESTADO_PIPELINE` §PDR-01 | `MD-01`, `TRZ-01` |
| 10 casos de uso | **14** (H-13) | `CHANGELOG`, `PDR-01`, `REGISTRO_DECISIONES` (SD-28) | `DCU-01`, `ECU-00`, `TRZ-01` |
| 263 elementos · 60 entidades | **262 · 59** (H-20) | `CHANGELOG`, `REGISTRO_DECISIONES` (SD-30), y el bloque `v1.1` de esta misma tabla | `DR-00`, `HECHOS_CANONICOS`, `ESTADO_PIPELINE`, `INDICE_MAESTRO`, el generador de SVG |
| 177 · 178 casos de prueba | **181** (H-24) | `CHANGELOG`, changelogs de `CP-00`/`CP-06` | `CP-00`, `DS-00`, `TRZ-DS-01` |
| 3 campos de cápsula | **5 + 2** (H-10) | `REGISTRO_DECISIONES` (SD-22), `ESTADO_PIPELINE` | `PRIV-01`, `PER-01`, `REQ-01` |
| Django · SQLite · PythonAnywhere | React · DynamoDB · Vercel + AWS (`ADR-002`) | `00_PLAN_CODEX_ORIGINAL`, `00_AUDITORIA_PLAN_CODEX`, `ADR-001` (superada), `CHANGELOG`, `REGISTRO_DECISIONES`, `MANIFIESTO_FUENTES` | Cualquier afirmación vigente sobre qué se va a construir |

| 3 clases del espacio de la solución | **21** (H-28) | `CHANGELOG`, `REGISTRO_DECISIONES` (SD-30), y los bloques de corrección de `DOP-01 v1.2`, `TRZ-DS-01 v1.1` y `DS-00 v1.4` que documentan el cambio | `DOP-01 §8`, `TRZ-DS-01 §3`, `DS-00 §7` como afirmación vigente |
| 1.500 caracteres en la **Parte A** de `MV-01` | **2.500** (H-01) | Solo `MV-01:66`, que es un bloque de cambio | La descripción del sistema de la Parte A — corregido en SD-32 |

| «backup verificable de SQLite» · respaldo de la base de datos · `backup_sqlite.py` | **Sin respaldo del almacén operativo** (`ADR-003`, SD-33/SD-34) | `00_PLAN_CODEX_ORIGINAL` (fuente primaria verbatim, no se edita), `CHANGELOG`, `REGISTRO_DECISIONES`, y los bloques históricos de `ADR-002` y `PER-01` que documentan el cambio | **Cualquier afirmación vigente sobre qué se construye, cualquier DoD y cualquier plan de trabajo.** El MVP **no** respalda el almacén operativo, y no se replanteará en construcción |

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
| v1.6 | 2026-08-05 | J. Sánchez | **SD-39, retrabajo del `CDR-01`.** Se mueven **seis** hechos, todos remedidos de primera mano contra los `.puml` antes de escribirlos: `H-22` 282 → **283**, `H-23` 192 → **193**, `H-25` 37 → **43** (16 + **27** de solución), `H-26` 200 → **201**, `H-27` 35 → **51**, `H-28` 21 → **27**. Entra **`H-29`, las relaciones de `MC-01`**: **80** reales, sin los 2 conectores entre notas. Ese hecho **no existía**, y es exactamente por eso que la cifra se movió **tres veces** —73 → 71 (`H-13`) → 80 (las 9 dependencias)— sin que nada la vigilara: se copiaba de artefacto en artefacto. **Lo que de verdad cambia esta versión no es la tabla, es cómo se comprueba:** los cuatro conteos de `MC-01` —clases, operaciones, atributos y relaciones— entran en `CONTEOS` de `verificar_coherencia.py`, así que a partir de aquí **se cuentan sobre el modelo** en cada ejecución en vez de creerse. Hasta ahora ninguno se contrastaba. En la misma pasada se reordena el historial: la fila `v1.0` estaba entre `v1.4` y `v1.3` — tercera vez que aparece este mismo defecto en el repositorio, tras el `CHANGELOG` y `DOP-01`. |
| v1.5 | 2026-08-04 | J. Sánchez | **SD-34.** Entra el **respaldo de la base de datos** en la tabla de valores obsoletos: «backup verificable de SQLite», `backup_sqlite.py` y todo respaldo del almacén operativo pasan a ser **historia legítima** en el plan archivado y el changelog, y **defecto** en cualquier afirmación vigente, DoD o plan de trabajo. Es el mecanismo que el proyecto ya tenía para deprecar un valor sin editar la fuente primaria verbatim. |
| v1.4 | 2026-08-04 | J. Sánchez | **SD-32.** Entran cuatro hechos del modelo de clases de diseño: `H-25` (37 clases), `H-26` (200 operaciones = 192 nombres distintos + 8 repeticiones), `H-27` (35 atributos) y `H-28` (**21 clases del espacio de la solución**). Y dos filas de valor obsoleto: «3 clases del espacio de la solución», que `DOP-01 §8` y `TRZ-DS-01 §3` afirmaban con **listas distintas entre sí**; y el «1.500 caracteres» de la **Parte A de `MV-01`**, que sobrevivió a dos pasadas porque estaba escrito **en letras** y este validador busca cifras. |
| v1.3 | 2026-08-02 | J. Sánchez | **SD-31.** Se documenta el **cuarto bloque** de `verificar_coherencia.py`, `VERSIONES DECLARADAS`, y —más importante— **por qué su alcance es estrecho**: la primera versión miraba toda mención `ARTEFACTO vX.Y` del corpus y dio **202 hallazgos con casi ningún defecto**, porque la mayoría son procedencia legítima. Un bloque con esa señal/ruido se ignora, y entonces no vigila nada. Acotado al inventario de `INDICE_MAESTRO`, que sí afirma el estado actual, encontró **un error real** en su primera ejecución. **Ninguna cifra de la tabla se mueve.** |
| v1.2 | 2026-08-01 | J. Sánchez | **SD-30, hallazgo `H-1b` de `DS-00`.** `H-20` baja de **263** a **262** y las entidades de 60 a **59**: `DR-09` contaba las «llamadas al chat de los últimos 7 días» desde `Conversacion`, que **no se persiste**, y al reapuntar ese arco a `EventoOperativo` la entidad quedó sin ningún arco. `H-21` **no cambia** (150). Entran tres hechos nuevos del paquete de secuencia: **`H-22`** 282 mensajes, **`H-23`** 192 operaciones, **`H-24`** 181 casos de prueba —181 y no 178 porque `H-1a` obligó a tres casos nuevos: el volumen por turno y el par que fija qué llamadas cuentan para `MET-07`—. Propagado a `DR-00`, `generar_svg_robustez.py`, `ESTADO_PIPELINE`, `INDICE_MAESTRO`, `DS-00`, `DOP-01` y `CP-00`. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** `H-20` pasa de **261** a **263** elementos y `H-21` de **149** a **150** controladores, por la corrección de `DR-04` (entra `EventoOperativo` con su controlador `C_ConservarTelemetriaSinIdentidad`, hallazgo `H-9` de `DS-00`). Propagado a `DR-00`, `generar_svg_robustez.py` —cuyos conteos estaban grabados a fuego—, `ESTADO_PIPELINE`, `INDICE_MAESTRO` y al paquete de secuencia. **Cambiar un valor de esta tabla es una decisión, no una edición:** por eso queda registrada en `REGISTRO_DECISIONES` como SD-30. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación (SD-29). 21 hechos canónicos verificados contra los artefactos, tabla de valores obsoletos con su ámbito legítimo, y registro del pendiente D.5 sobre el límite de caracteres, que ya estaba resuelto en los documentos pero seguía declarado como abierto. |
