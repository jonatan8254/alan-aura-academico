# CP-12 — Casos de prueba de CU-12 «Revocar la personalización»

**ID:** CP-12 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 · **Estado:** Propuesto.
**Insumos:** `DR-12 v2.0` (9 controladores), `DS-12 v1.0`, `ECU-12 v2.0` (`CA-01…CA-09`), `PRIV-01` (`PRIV-R3`), `PER-01 v1.2` (`PER-T7`), `MV-01` `RN-07`/`RN-08`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-12` ocupa **`CP-1301`…`CP-1311`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-1301 | `C_PresentarAlcance` | Básico p.1 | Sesión y rol válidos; capa de personalización otorgada. | Elige «Revocar la personalización» en P-13. | P-13 muestra que la cápsula dejará de orientar la conversación **y que el chat seguirá disponible**, antes de pedir confirmación. | CA-02 · RE-02 |
| CP-1302 | `C_SolicitarReingreso` | **FE-01** | La sesión expira durante la revocación. | Llega una petición sin sesión válida. | HTTP 401; el `Consentimiento` **sin cambios, con ambas capas iguales**. | CA-07 |
| CP-1303 | `C_DenegarPorPermiso` | **FE-02** | Rol no autorizado. | Llega una petición de revocación. | HTTP 403; **el `Consentimiento` no cambió**. | CA-08 |
| CP-1304 | `C_InformarYaRevocada` | **FA-01** | La capa de personalización **ya está revocada**. | Elige «Revocar» de nuevo. | Informa que ya está revocada y **no repite el cambio**; **la fecha de revocación es la misma de antes** — sin escritura nueva. | CA-04 |
| CP-1305 | `C_CancelarRevocacion` | **FA-03** | Alcance presentado, en espera de confirmación. | Cancela en vez de confirmar. | El `Consentimiento` **intacto en ambas capas**; vuelve al paso 1. | CA-05 |
| CP-1306 | `C_MsgPeticionInvalida` | **FE-03** | Alcance presentado. | Llega la petición mal formada. | HTTP 400; **el `Consentimiento` no cambió**; vuelve al **paso 2** y puede reintentar. | CA-09 |
| CP-1307 | `C_RevocarCapaPersonalizacion` | Básico p.3 | Confirmó la revocación. | El sistema marca la capa como revocada, con fecha. | Una inspección muestra **a la vez** la personalización en «revocado» con fecha **y la capa base en «otorgado», sin tocar**. | CA-01 |
| CP-1308 | `C_MarcarAutorreportesParaDescarte` | Básico p.3 · **FA-02 no tomado** | Capa recién revocada; cápsula con al menos un autorreporte. | El sistema ejecuta el marcado. | Los cuatro autorreportes aparecen **marcados para descarte**, no eliminados de inmediato; **`character` intacto, sin marca alguna**. | CA-03 · PRIV-R3 |
| CP-1309 | `C_MarcarAutorreportesParaDescarte` | **FA-02 tomado** | Cápsula con **únicamente** `character`. | El sistema ejecuta el mismo marcado. | **No encuentra autorreportes que marcar** (efecto observable nulo); la capa queda revocada igualmente; `character` intacto. | CA-06 |
| CP-1310 | `C_ConfirmarChatDisponible` | Básico p.4 · **invariante esencial** | Revocación aplicada. | Abre o continúa una `Conversacion`. | **Prospera con normalidad**, sin 401/403 ni aviso de bloqueo; el *payload* del turno siguiente tiene **cero campos de autorreporte**. | CA-02 |
| CP-1311 | `C_ConfirmarChatDisponible` | Básico · **contraste `PER-T7`** | Revocación completada. | Intenta abrir o continuar una `Conversacion`. | La apertura **SÍ prospera** — el chat sigue disponible. El mismo intento tras **reiniciar** en CU-11 (`CP-1213`) **no prospera**. | CA-02 · PER-T7 |

*(Trazabilidad completa: `CU-12 → DR-12 → DS-12 → CP-13NN`.)*

## Cobertura

**9/9 controladores.** Básico ✓ · `FA-01` (1304) · `FA-02` tomado (1309) y no tomado (1308) ·
`FA-03` (1305) · `FE-01` (1302) · `FE-02` (1303) · `FE-03` (1306).

## `CP-1310` es el invariante entero de este caso de uso

Revocar la personalización **no es punitivo** (`RN-08`). El caso lo prueba con dos afirmaciones
simultáneas: la conversación **prospera** —sin 401, sin 403, sin aviso de bloqueo— **y** el
*payload* del turno siguiente tiene **cero autorreportes**. Si solo se probara la primera, un
sistema que siguiera enviando los autorreportes pasaría; si solo la segunda, uno que bloqueara el
chat también.

## `CP-1308` distingue marcar de borrar

`PRIV-R3` dice **marcar para descarte**, no eliminar en el acto. El caso verifica exactamente ese
verbo: los autorreportes aparecen marcados, **no ausentes**. El momento del descarte físico es
diseño de retención y su sitio es `ARQ-01`.

## `CP-1311` es la otra mitad del par

Junto con `CP-1213` de `CU-11` prueba el contraste que `PER-T7` obliga a distinguir: **revocar deja
el chat disponible; reiniciar lo deja inhabilitado**. Es la diferencia entre una operación
reversible y no punitiva y otra irreversible que cuesta el acceso.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.1 | 2026-08-05 | J. Sánchez | `TVI-02` del `CDR-01 v1.6`: `CP-1306` fija el punto de reentrada —**paso 2**, el que declara `ECU-12 FE-03`—. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 11 casos desde los 9 controladores de `DR-12`, con el invariante de no-punitividad probado por sus dos mitades y `CP-1311` formando par con `CP-1213`. |
