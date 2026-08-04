# CP-00 — Índice de casos de prueba y matriz de cobertura

**ID:** CP-00 · **Familia:** CP (pruebas derivadas de secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.4 (SD-35: ya no hay nada sin `CP` por un hallazgo abierto). v1.3 (SD-34: §6 deja de citar `PER-H5` —cerrado— y pasa a `PER-H2`). v1.2 · **Estado:** Propuesto.
**Propósito:** índice de los **181 casos de prueba** derivados de los **150 Controladores** de `DR-01…DR-14`, con la matriz de cobertura por caso de uso y por operador de fragmento.
**Insumos:** `DR-01…DR-14 v2.0`, `DS-01…DS-14 v1.0`, `ECU-01…ECU-14 v2.0` (sus criterios de aceptación), `HECHOS_CANONICOS`.
**Generado con:** skill `uml-sequence-diagram`. Borradores por subagentes, **auditados por el orquestador** contra los `.puml`.
**Consumidores:** pruebas unitarias y de integración de la fase de construcción, `TRZ-DS-01`, el CDR.

---

## 1. La regla de derivación

**La unidad de derivación es el Controlador**, no el mensaje ni el requisito. Cada controlador de
un diagrama de robustez rinde **al menos un** `CP`. Derivar del mensaje acoplaría la prueba al
diseño concreto; derivar del controlador la ata al **comportamiento**, que es lo que debe
sobrevivir a un refactor.

**La comprobación de cobertura son los caminos**, y es independiente de la derivación: el curso
básico y **cada** `FA`/`FE` deben quedar cubiertos, con las dos ramas de cada `opt`.

## 2. Los 14 archivos

| Archivo | Caso de uso | Rango | `CP` | Controladores |
|---|---|---|---:|---|
| [CP-01](CP-01_pruebas_consultar_presentacion.md) | CU-01 Consultar presentación | `CP-501…507` | 7 | 7/7 |
| [CP-02](CP-02_pruebas_registrar_cuenta.md) | CU-02 Registrar cuenta | `CP-601…607` | 7 | 7/7 |
| [CP-03](CP-03_pruebas_iniciar_y_cerrar_sesion.md) | CU-03 Iniciar y cerrar sesión | `CP-701…712` | 12 | 12/12 |
| [CP-04](CP-04_pruebas_eliminar_cuenta.md) | CU-04 Eliminar cuenta | `CP-801…813` | 13 | 12/12 |
| [CP-05](CP-05_pruebas_consentimiento_caracterizacion.md) | CU-05 Consentimiento y cápsula | `CP-201…218` | 18 | 16/16 |
| [**CP-06**](CP-06_pruebas_conversar_con_el_acompanante.md) | CU-06 **Conversar con el acompañante** | `CP-001…034` | **34** | 25/25 |
| [**CP-07**](CP-07_pruebas_derivar_ante_peligro.md) | CU-07 **Derivar ante peligro** | `CP-101…121` | 21 | 12/12 |
| [CP-08](CP-08_pruebas_consultar_directorio.md) | CU-08 Consultar directorio | `CP-901…908` | 8 | 8/8 |
| [CP-09](CP-09_pruebas_consultar_metricas.md) | CU-09 Consultar métricas | `CP-1001…1008` | 8 | 8/8 |
| [CP-10](CP-10_pruebas_habilitar_deshabilitar_chatbot.md) | CU-10 Habilitar/deshabilitar el chatbot | `CP-1101…1114` | 14 | 11/11 |
| [CP-11](CP-11_pruebas_reiniciar_la_caracterizacion.md) | CU-11 Reiniciar la caracterización | `CP-1201…1213` | 13 | 11/11 |
| [CP-12](CP-12_pruebas_revocar_la_personalizacion.md) | CU-12 Revocar la personalización | `CP-1301…1311` | 11 | 9/9 |
| [CP-13](CP-13_pruebas_cambiar_de_acompanante.md) | CU-13 Cambiar de acompañante | `CP-301…308` | 8 | 6/6 |
| [CP-14](CP-14_pruebas_elegir_acompanante.md) | CU-14 Elegir acompañante | `CP-401…407` | 7 | 6/6 |
| | **Total** | | **181** | **150/150** |

**Numeración global y correlativa**, no reiniciada por caso de uso: un identificador de prueba es
único en todo el proyecto. Los rangos se asignaron en **orden de construcción**, no de numeración
de caso de uso — por eso `CU-06` ocupa `CP-001…` (fue el piloto) y `CU-01` ocupa `CP-501…`.

**181 casos para 150 controladores.** La cota inferior se respeta con holgura: los controladores que
rinden más de uno son aquellos cuyos `opt` exigen probar la rama tomada **y** la no tomada.

## 3. Cobertura de caminos, desagregada por operador

No basta «curso básico + cada `FA`/`FE`», que solo cubre la semántica de `alt`:

| Operador | Regla de cobertura | Dónde se aplicó |
|---|---|---|
| `alt` | Un camino por operando, más el implícito si no hay `else` | Los 14 |
| `opt` y `break` | **Dos**: tomado y no tomado | 31 pares de `CP` en el paquete |
| `loop(min,max)` | Los **valores frontera** | `CP-010` (primer mensaje) y `CP-029` (mensaje 20) en `CU-06` |
| `par` | Los entrelazados relevantes | No aplica: ningún `DS` usa `par` |

**Fronteras de contenido probadas**, además de las de control: `H-01` 2.500 caracteres (`CP-010`,
`CP-011` con 2.501) · `H-02` 20 mensajes (`CP-028`, `CP-029`) · `H-03` 350 *tokens* (`CP-026`) ·
`H-04` 3/min (`CP-012`, `CP-013`) · `H-05` 20 s (`CP-020`, `CP-023`) · `H-06` ≤ 4 intercambios
(`CP-018`).

## 4. Los casos que prueban ausencias

Son los más difíciles de escribir y los más fáciles de romper en la implementación. Se agrupan aquí
porque son los que sostienen el canon del proyecto:

| Qué se prueba | Caso | Regla |
|---|---|---|
| El turno de peligro **nunca** llega al Proveedor LLM | `CP-102` | `I-1`, `RN-05`, `C-3`, `SEG-R2` |
| La ruta de seguridad opera **completa** con el proveedor caído | `CP-104`, y `CP-105` exige que el resultado sea **indistinguible** con el proveedor disponible | `I-2a`, `RC-01` = 100 % |
| Siempre hay ruta a ayuda humana **aunque falle la configuración** | `CP-115` (sin recursos), `CP-119` (sin texto de contención) | `I-2b` |
| No se conserva contenido ni se puntúa riesgo | `CP-114`, `CP-030` | `I-3`, `PRIV-R2`, `PRIV-R7` |
| El registro pide **solo tres campos**; contraseña hasheada; rol en servidor | `CP-601`, `CP-606` | `RN-04.1`, `PRIV-R12`, `RNF-08` |
| El mensaje de credenciales inválidas es **idéntico** en ambos fallos | `CP-703` | `CA-06` de `ECU-03` |
| El Administrador **no puede** descender al individuo | `CP-908`, `CP-1007` — ambos verifican además que **no hay escrituras** | `PER-T3`, `RN-03.5`, `PRIV-R10` |
| La auditoría guarda **solo autor y fecha** | `CP-1112` | `PER-T2` |
| El Visitante **no crea sesión ni deja rastro** | `CP-505` | `RN-04.5` |
| La cápsula se arma **sin *defaults*** | `CP-216` | `RN-01.4` |
| `FA-01` de `CU-14` **no deja rastro** del personaje descartado | `CP-403` | `RN-01.6` |
| **Ninguna escritura persistida** al cambiar de acompañante | `CP-305` | Invariante de `ECU-13` §7 |

## 5. Dos pares que solo funcionan juntos

**`CP-1213` y `CP-1311`** prueban el contraste que `PER-T7` obliga a distinguir: tras **reiniciar**
(`CU-11`) el chat queda **inhabilitado**; tras **revocar** (`CU-12`) **sigue disponible**. Cada uno
cita al otro; por separado ninguno demuestra el contraste.

**`CP-209` y `CP-213`** hacen lo mismo dentro de `CU-05`: retirar la **capa base** finaliza el
onboarding sin cápsula; retirar solo la **personalización** lo continúa. Efectos opuestos, dos
casos.

## 6. Lo único que NO tiene caso de prueba, y por qué

**Ya no hay nada sin caso de prueba por un hallazgo abierto.** `PER-H2` cerró en SD-35
(`ADR-004-D1`: la supresión es física e inmediata) y `PER-H5` en SD-33 (`ADR-003`: sin respaldo).
Con ambas cerradas, **`RF-24` pasa a cumplirse** y `CP-801…813` cubren su cascada por completo.

**Lo que sigue sin `CP`, y es de otra naturaleza:** la **inmediatez** de la supresión no se prueba
aquí porque exige una implementación que aún no existe — es fase 4, no un hueco de diseño. Y `V6-b`,
la validación legal, no se prueba con un caso: la resuelve una persona con criterio jurídico.

> El otro hueco que este índice declaraba —`CA-11` de `ECU-04` sin controlador— **quedó cerrado
> en SD-30**: `DR-04 v2.1` incorporó la entidad y el controlador que `ECU-04 §7` ya declaraba, y
> de ahí deriva `CP-813`.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. Índice de los 177 casos derivados de los 149 controladores, con la cobertura desagregada por operador y el inventario de los casos que prueban ausencias. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** entra `CP-813`; 178 casos y 150/150 controladores. `CA-11` deja de figurar como hueco. |
| v1.3 | 2026-08-04 | J. Sánchez | **SD-34.** §6 decía que lo único sin caso de prueba era `PER-H5` —los respaldos en S3 escapando a la cascada—. `ADR-003` lo cerró **quitando el respaldo**, así que dejó de haber nada que probar por esa vía. Lo único sin `CP` pasa a ser **`PER-H2`**, la ventana de «+30 días», que es **retención y no comportamiento**. **Los 181 casos no cambian.** |
| v1.2 | 2026-08-01 | J. Sánchez | **SD-30, hallazgo `H-1a`.** `CU-06` pasa de 31 a **34** casos: la granularidad por turno obligó a fijar el volumen en la frontera (`CP-032`) y a decidir **qué llamadas cuentan** para `MET-07` — la fallida sí (`CP-033`), la cortada por límite de tasa no (`CP-034`). Total **181**; 150/150 controladores sin cambio. |
