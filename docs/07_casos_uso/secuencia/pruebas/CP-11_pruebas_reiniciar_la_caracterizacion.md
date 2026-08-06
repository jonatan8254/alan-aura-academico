# CP-11 — Casos de prueba de CU-11 «Reiniciar la caracterización»

**ID:** CP-11 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.2 (SD-41: `CP-1210` deja de verificar una reversión que `H-15` declaró **innecesaria** y pasa a verificar que el fallo se informa **sin haber suprimido nada** — `VI-02`). v1.0 · **Estado:** Propuesto.
**Insumos:** `DR-11 v2.0` (11 controladores), `DS-11 v1.0`, `ECU-11 v2.0` (`CA-01…CA-11`), `PER-01 v1.2` (`PER-T7`), `MV-01` `RN-01.6`/`RN-04.3`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-11` ocupa **`CP-1201`…`CP-1213`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-1201 | `C_PresentarAdvertencia` | Básico p.1 | Sesión y rol válidos; existe cápsula con `character`. | Elige «Reiniciar la caracterización» en P-13. | P-13 muestra, **en el mismo texto, las tres afirmaciones**: es irreversible, alcanza también `character`, y **perderá el acceso al chat** hasta rehacer CU-05. | CA-04 |
| CP-1202 | `C_SolicitarReingreso` | **FE-01** | La sesión expira en cualquier paso. | Llega una petición sin sesión válida. | HTTP 401; redirige a P-03; **la cápsula sigue completa, con `character`**. | CA-08 |
| CP-1203 | `C_DenegarPorPermiso` | **FE-02** | Rol no autorizado. | Llega una petición de reinicio. | HTTP 403; **la cápsula no cambió**. | CA-09 |
| CP-1204 | `C_InformarSinCaracterizacion` | **FA-01** | **No existe cápsula**: ya se reinició antes y no se ha rehecho. | Elige «Reiniciar» de nuevo. | Informa **sin error** que no hay caracterización que reiniciar y ofrece rehacerla; **la traza no muestra ninguna escritura nueva** — operación **idempotente**. | CA-05 |
| CP-1205 | `C_RecibirConfirmacion` | Básico p.2 | Advertencia mostrada. | Confirma el reinicio de forma explícita. | La confirmación se acepta; **en el instante justo posterior, la cápsula todavía existe completa**. | CA-01 |
| CP-1206 | `C_CancelarReinicio` | **FA-03** | Advertencia mostrada, en espera de confirmación. | Cancela en vez de confirmar. | **Ningún dato se borra**; la cápsula sigue completa y **una apertura de `Conversacion` sigue prosperando**; vuelve al paso 1. | CA-07 |
| CP-1207 | `C_MsgPeticionInvalida` | **FE-03** | Advertencia mostrada. | Llega la petición **sin la confirmación explícita** exigida, o mal formada. | HTTP 400; **ningún registro de cápsula desaparece**; vuelve al **paso 2** y puede confirmar de nuevo. | CA-10 |
| CP-1208 | `C_BorrarCapsulaCompleta` | Básico p.3 · **FA-02 no tomado** | Cápsula con los cuatro autorreportes y `character`. | Ejecuta el borrado completo. | **Cero registros de cápsula** tras la operación: ni los cuatro autorreportes, ni `character`, ni `schema_version`/`consent_version`. | CA-01 |
| CP-1209 | `C_BorrarCapsulaCompleta` | **FA-02 tomado** | Cápsula con **únicamente** `character` y sus metadatos. | Ejecuta el mismo borrado. | Cero registros, **igual que en el caso completo**; un intento posterior de abrir `Conversacion` **no prospera**. | CA-06 |
| CP-1210 | `C_InformarFalloSinSuprimir` | **FE-04** | Cápsula presente y confirmación recibida. | El sistema no logra **ejecutar** el borrado (fallo inducido). | HTTP 500; el sistema **informa el fallo sin haber suprimido nada**, y una inspección inmediata muestra la cápsula **intacta, con `character`, sin campos parciales ni ausentes**; vuelve al paso 1. | CA-11 |
| CP-1211 | `C_DeclararAlcanceDelBorrado` | Básico p.4 | Borrado completado. | El sistema declara el alcance. | Una inspección de `Usuario` y `Consentimiento` **antes/después es idéntica**, con las mismas dos capas; P-13 muestra que el chat queda inhabilitado. | CA-02 |
| CP-1212 | `C_OfrecerRehacerCaracterizacion` | Básico p.5 | Borrado completado; alcance declarado. | El sistema abre el acceso a rehacer. | Se abre P-08 desde el **paso 6 de CU-05**; un intento de abrir `Conversacion` **no prospera** por falta de `character`. | CA-03 |
| CP-1213 | `C_BorrarCapsulaCompleta` | Básico · **contraste `PER-T7`** | Reinicio completado. | Intenta abrir o continuar una `Conversacion`. | La apertura **NO prospera** — el chat queda inhabilitado. El mismo intento tras **revocar** en CU-12 (`CP-1311`) **sí prospera**. | CA-03 · PER-T7 |

*(Trazabilidad completa: `CU-11 → DR-11 → DS-11 → CP-12NN`.)*

## Cobertura

**11/11 controladores.** Básico ✓ · `FA-01` (1204) · `FA-02` tomado (1209) y no tomado (1208) ·
`FA-03` (1206) · `FE-01` (1202) · `FE-02` (1203) · `FE-03` (1207) · `FE-04` (1210).

## `CP-1210` prueba que no hay estados intermedios

`RE-04` de `ECU-11` es tajante: o la cápsula desaparece entera o **queda como estaba, con
`character`**. `CP-1210` verifica que tras un fallo a mitad no hay **campos parciales ni ausentes**.
Una cápsula a medias sería peor que cualquiera de los dos extremos: el usuario no podría conversar
y tampoco sabría por qué.

## `CP-1213` es la mitad de un par

Junto con `CP-1311` de `CU-12`, forma la prueba del contraste que `PER-T7` obliga a distinguir:
**reiniciar deja el chat inhabilitado; revocar lo deja disponible**. Ninguno de los dos casos por
separado demuestra el contraste — hacen falta los dos, y cada uno cita al otro.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.2 | 2026-08-05 | J. Sánchez | `TVI-02` del `CDR-01 v1.6`: `CP-1207` decía «vuelve al paso 1» y `ECU-11 FE-03` dice **paso 2**. La prueba propagaba un destino falso. |
| v1.1 | 2026-08-05 | J. Sánchez | **SD-41 — `VI-02` del `CDR-01 v1.4`.** `CP-1210` verificaba `C_DeshacerBorrado` y una cápsula «completa» tras deshacer un borrado a medias. `H-15` determinó que **ese estado no puede existir**: el borrado alcanza a **una sola entidad**, y sobre una entidad única o la operación pasa o no pasa. Es el reverso de `H-02` — allí la atomicidad era *imposible*, aquí *innecesaria*. El caso pasa a verificar `C_InformarFalloSinSuprimir`: el sistema **informa el fallo sin haber suprimido nada** y la cápsula sigue **intacta**, con `character`. Sustitución 1:1: el conteo de casos no se mueve. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 13 casos desde los 11 controladores de `DR-11`, con `FE-04` verificando la ausencia de estados intermedios y `CP-1213` formando par con `CP-1311` para probar `PER-T7`. |
