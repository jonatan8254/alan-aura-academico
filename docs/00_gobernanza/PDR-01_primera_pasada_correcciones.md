# PDR-01 — Primera pasada de correcciones
**ID:** PDR-01 · **Familia:** PDR (gobernanza) · **Hogar:** `docs/00_gobernanza/` · **Fecha:** 2026-07-31 · **Versión:** v1.0 · **Estado:** Cerrado.
**Propósito:** registrar la primera pasada completa de correcciones sobre la fase 2 (ICONIX) — qué la motivó, qué se cambió, qué encontró cada auditoría y qué queda abierto.
**Detonantes:** la [retroalimentación docente](RET-01_retroalimentacion_docente.md) (4 puntos) y los 15 hallazgos de desambiguación del certificado de robustez.
**Consumidores:** revisión docente, informe académico, fases posteriores.

---

## 1. Qué motivó la pasada

Dos cosas a la vez:

1. **La retroalimentación del profesor** sobre el modelo de dominio y el diagrama de casos de uso — cuatro puntos, registrados literalmente y con su evidencia en [`RET-01`](RET-01_retroalimentacion_docente.md).
2. **Los 15 hallazgos de desambiguación** que el propio análisis de robustez había producido al dibujarse. Es el resultado esperable del método: la robustez existe, entre otras cosas, para destapar lo que el texto de los casos de uso deja ambiguo.

Y una tercera que apareció al empezar: **las skills del proyecto se habían actualizado**, y las nuevas versiones traían validadores ejecutables y compuertas que las versiones anteriores no tenían.

## 2. Las seis fases

| Fase | Qué hizo | Commits |
|---|---|---|
| **Tanda 0** | Ejecutar por primera vez las compuertas de `uml-domain-modeler` y `uml-use-case-diagram` sobre MD-01 y DCU-01 | `34b529c` |
| **D.3** | Rehacer las 14 especificaciones de casos de uso + el índice, en cinco tandas | `e01f40d`, `94c0670`, `8e6d56e` |
| **D.4** | Rehacer los 10 diagramas de robustez y crear 4, en tres tandas; regenerar los 14 SVG; reescribir DR-00 | `667cf0e`, `6463241`, `b76f898` |
| **D.5** | Propagar aguas arriba: MV-01, REQ-01, TRZ-01, PER-01, PRIV-01, DIS-00, gobernanza | `35f7549`, `065641b`, `3a5e9dd` |
| **D.6** | Esta evidencia documental | — |

Metodología en todas: **construir → validar → auditar → refutar → corregir → comitear**, con un commit por tanda como punto de reversión.

## 3. La deuda de método que la tanda 0 saldó

Las dos primeras correcciones (MD-01 v1.3 y DCU-01 v2.0) se hicieron **sin cargar sus skills**: se trabajó desde los artefactos, los validadores y reglas de segunda mano. Se comprobó en la transcripción de la sesión.

Al cargarlas y pasar sus **Final Quality Gates** completas aparecieron **cuatro defectos que ni el validador ni la auditoría independiente habían señalado**, todos etiquetas de relación de MD-01 que la regla «*procedural labels have been rewritten when possible*» prohíbe:

| Relación | Corrección |
|---|---|
| `Visitante -- TitularDeCuenta : se convierte en` | → **`precede a`** (era una transición de ciclo de vida, no una relación de dominio) |
| `Conversacion -- EventoOperativo : origina` | → **`se documenta con`** |
| `Mensaje -- EventoDeSeguridad : origina` | → **`se documenta con`** |
| `Administrador -- DisponibilidadDelChatbot : controla` | → **`tiene a cargo`** |

Se corrigió además **una afirmación falsa** que MD-01 v1.3 tenía en su sección de Verificación —«etiquetas conceptuales, revisadas a mano»—: esa revisión no se había hecho contra el rubro de la skill.

> **El 0/0 del validador no probaba nada sobre este punto.** Su lista de verbos es literal y cerrada (`valida`, `calcula`, `genera`…) y ninguna de las cuatro etiquetas estaba en ella.

Y una compuerta **respaldó** activamente lo hecho: la *CRUD rule* dice que si el modelo verbal nombra explícitamente crear/borrar/aprobar, esas van como casos de uso separados. `REQ-01` nombra RF-22, RF-23 y RF-24 por separado — es decir, **el «Gestionar cuenta» anterior violaba esa regla y el desglose la cumple**.

## 4. Los 15 hallazgos de desambiguación y su destino

| # | Dónde estaba | Resuelto en |
|---|---|---|
| D-01 | Precondición de «consentimiento vigente» **sin ningún curso de excepción**: un usuario con el consentimiento retirado entraba al chat sin obstáculo en el modelo | **ECU-12 §4.1** (las dos capas) + `FE-09` de ECU-06 |
| D-02 | La confirmación se exigía **solo** para eliminar la cuenta; reiniciar la caracterización es igual de irreversible y no tenía ninguna | ECU-11 `RE-01` · DIS-00 §3 |
| D-03 | «Redirige al área correspondiente» bifurcaba **sin declarar el criterio** | ECU-03 · DR-03 |
| D-04 | La confirmación del registro ocurría sobre una pantalla **sin nombre** | ECU-02 (se **declara** el hueco de DIS-00, no se inventa la pantalla) |
| D-05 | Los pasos 3 y 4 asignaban una pantalla que **exige sesión activa**, ya cerrada en el paso 4 | ECU-04 · DR-04 |
| D-06 | Flujo alternativo anclado a «Paso 5+», que no es un paso concreto | ECU-05 `FA-03`/`FA-04` |
| D-07 | La excepción de minoría de edad no decía **quién** cierra la sesión | ECU-05 `FE-01` |
| D-08 | Un flujo con **tres disparadores** de límite y un criterio que los agrupaba | ECU-06 (partido por disparador) |
| D-09 | Un flujo alternativo y uno de excepción con **el mismo disparador** | ECU-07 · DR-07 |
| D-10 | Recuento de pasos contradictorio (nota decía 10, tabla 8) | ECU-07 §11.1 |
| D-11 | `ConsentRecord` —nombre de persistencia— usado como término de dominio | ECU-08 · tabla de correspondencia en PER-01 |
| D-12 | `MV-01` llamaba «vista derivada, no clase» a `EventoOperativo`; `PER-01` lo trataba como entidad | **MV-01 §13.2** (a favor de PER-01) |
| D-13 | El límite de sesión aparecía en los estados de **dos pantallas** | DIS-00 §3 (a favor de la tabla de inventario) |
| D-14 | La trazabilidad omitía `RN-01.6` e invocaba `RN-07` sin definirla | ECU-05 §19 |
| D-15 | Encabezado y control del documento declaraban **versiones distintas** | ECU-05 §1 |

## 5. Las decisiones nuevas

**Las dos capas del `Consentimiento`** (definición canónica en `ECU-12` §4.1). La **capa base** autoriza procesar lo mínimo para conversar —edad, `character`, el turno—: sin ella no hay conversación. La **capa de personalización** autoriza que los **cuatro autorreportes** de la cápsula orienten la conversación: sin ella se conversa igual. `character` pertenece a la base, por `RN-01.6`. Es lo que hace que **revocar la personalización no sea punitivo**.

**El límite por mensaje sube de 1.500 a 2.500 caracteres** (decisión del líder del proyecto). Propagado a `MV-01`, `REQ-01`, `TRZ-01`, `ECU-06` y `DR-06`.

**«Acompañante» se declara alias de producto en uso activo de `Personaje`**, en la tabla de alias de `MV-01` §11. Nombra tres casos de uso y la interfaz por su calidez; el término trazable al dominio sigue siendo `Personaje`. Es el mismo trato que el proyecto ya daba a Alan/Alanus y Aura/Pandora, con una diferencia declarada: este **sí** está en uso.

**`FE-01` y `FE-02` de ECU-07 se restituyen** a la semántica que `DR-07` ya usaba, en vez de renumerarlos.

## 6. Lo que encontraron las auditorías

Cada documento pasó por un auditor que no lo escribió y por un escéptico encargado de **refutar** sus hallazgos.

| Fase | Hallazgos | Refutados | Sostenidos |
|---|---|---|---|
| D.3 tanda 1 | 57 | 13 | **44** (ningún crítico sobrevivió) |
| D.3 tandas 2-4 | 89 | 57 | **32**, 11 de ellos mayores |

**Los once mayores de las tandas 2-4 eran todos la misma falta: afirmar más de lo que la fuente sostiene.**

- `ECU-04` decía materializar «el derecho de cancelación de la Ley 1581» cuando `PRIV-01` declara esa frontera jurídica **sin validar**.
- `ECU-10` afirmaba que el *mockup* del *kill switch* está en claro y oscuro con los dos estados. Tiene una hoja de estilo y un estado.
- `ECU-08` daba `DR-08` por «planificado» estando comiteado, y afirmaba que el plan del macroproyecto no está en el repositorio para justificar no verificar ninguna cita. **Sí está.**
- `ECU-07`, la ruta de seguridad, reclamaba como propios el gate y las guardas de salida que él mismo asigna a CU-06.

## 7. Lo que encontró la herramienta y la lectura no

Vale la pena separarlo, porque es el argumento de por qué el gate no es ceremonia:

1. **`DR-05`** tenía un controlador con 8 conexiones absorbiendo comportamiento ajeno.
2. **`DR-06`** declaraba un flujo en su nota que ya no existía en los arcos: al renumerar se actualizaron los arcos y no el texto.
3. **`DR-09`** tenía una entidad con **dos sufijos de color**, lo que invalidaba la declaración entera.
4. **Nueve de los catorce SVG salieron sin título.** Ni el validador ni el generador fallan por ello: el primero no mira el `.svg` y el segundo produce el archivo igual. Solo apareció **al rasterizar con Chrome y mirarlo**.
5. **La matriz clase ↔ caso de uso discrepaba en 4 de 16 filas** cuando se comprobó contra los `.puml`. Esa comprobación destapó que `DR-06` omitía una entidad que su especificación nombra.
6. **La tabla de `DR-00` se contradecía consigo misma** —fila 39, total 260— porque dos sustituciones no aplicaron.

> «El script no falló» y «se ve bien» no son lo mismo, y «lo escribí con cuidado» no es lo mismo que «lo comprobé».

## 8. Estado al cierre, medido

| Artefacto | Antes | Después |
|---|---|---|
| `MD-01` | v1.2, 12 clases, 12 relaciones | **v1.4**, 16 clases, 17 relaciones, validador 0/0 |
| `DCU-01` | v1.0, 4 actores, 10 casos de uso, 0 `<<include>>` | **v2.1**, 5 actores, 14 casos de uso, 1 `<<include>>` + 2 `<<extend>>`, validador 0/0 |
| Especificaciones | 10 + índice, **18 errores y 50 advertencias** | **14 + índice, 0 errores y 0 advertencias** |
| Cobertura de flujos | ~40 % | **76/76 (100 %)** con criterio de aceptación asociado |
| Robustez | 10 diagramas, 179 elementos | **14 diagramas, 260 elementos**, 0 errores, cobertura completa |
| RF con caso de uso propio | 13 de 26 | **26 de 26**, ninguno duplicado |
| Clases manifestadas en casos de uso | 14 de 16 | **16 de 16** |
| Enlaces rotos en `docs/` | — | **cero** |

**Reproducible.** Salida literal de los cuatro validadores, ejecutados al cerrar la pasada:

```
$ validate_domain_puml.py  docs/06_dominio/MD-01_modelo_dominio.puml
ERRORS: none
WARNINGS: none

$ validate_use_case_puml.py  docs/07_casos_uso/DCU-01_casos_uso.puml
ERRORS: none
WARNINGS: none

$ validate_use_case_spec.py  (las 14 especificaciones)
ECU-01 … ECU-14   ERRORES: ninguno   ADVERTENCIAS: ninguna     (14 de 14)

$ validate_robustness_puml.py --domain MD-01  (los 14 diagramas)
DR-01 … DR-14     ERRORES: ninguno                             (14 de 14)
```

Y las comprobaciones que **ningún validador hace**, verificadas con scripts propios: **76/76** flujos con criterio de aceptación asociado; **26/26** RF con caso de uso propio y único; **16/16** clases del dominio manifestadas en casos de uso y en robustez, contrastadas contra los `.puml`; **cero** enlaces rotos en `docs/`; y la tabla de conteos de `DR-00` cuadrando con la suma de sus filas.

## 9. Qué queda abierto

| Asunto | Estado |
|---|---|
| **`PER-H4`** — campos de `ContadorDeUsoDiario` | Abierto |
| **`AccionAdministrativa`** fuera de `MD-01` | Decisión declarada; marcada en `DR-10` para que siga siendo discutible |
| **Frontera jurídica** (Ley 1581) | **Sin validar**; el diseño se *alinea* con sus principios, no se afirma cumplimiento |
| **Diagramas de secuencia** `DS-01…DS-14` y **casos de prueba** `CP-01…CP-14` | Planificados. Con 148 controladores en robustez, esa es la cota inferior de casos de prueba |
| **Informe académico** `.docx` | Sin actualizar a este estado |

**Fin de PDR-01.**
