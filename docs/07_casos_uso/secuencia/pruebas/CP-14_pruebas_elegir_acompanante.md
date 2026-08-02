# CP-14 — Casos de prueba de CU-14 «Elegir acompañante (Alan o Aura)»

**ID:** CP-14 · **Familia:** CP (pruebas derivadas de secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Propósito:** derivar los casos de prueba de `CU-14` **desde los 6 Controladores** de `DR-14`.
**Insumos:** `DR-14 v2.0`, `DS-14 v1.0`, `ECU-14 v1.0` (§11 `CA-01…CA-04`), `MV-01` `RN-01.6`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-14` ocupa **`CP-401`…`CP-407`**.

---

## 1. Los 7 casos

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-401 | `C_PresentarPersonajes` | Básico p.1 | CU-05 completó su paso 8 —con, con parte, o **sin ninguno** de los cuatro autorreportes— y la cápsula aún no tiene `character`. | CU-05 invoca CU-14 por `<<include>>`. | P-09 muestra a Alan como **activación** y a Aura como **calma**, cada uno con su rol y su estilo, **antes** de aceptar cualquier confirmación. | CA-01 |
| CP-402 | `C_SolicitarReingreso` | **FE-01** | P-09 mostrada. | La sesión expira durante la presentación, antes de confirmar. | HTTP 401; redirige a P-03; `character` **no se escribió** y la cápsula queda **exactamente como estaba** antes de entrar. | CA-04 |
| CP-403 | `C_SustituirSeleccion` | **FA-01 tomado** | P-09 mostrada; marcó a Alan como selección tentativa, sin confirmar. | Cambia a Aura antes de confirmar. | La interfaz muestra a Aura como vigente; **ningún valor de `character` se escribió todavía** —ni Alan ni Aura—; **nada indica que Alan fue alguna vez seleccionado**. | CA-03 |
| CP-404 | `C_RecibirEleccion` | Básico p.2 · **FA-01 no tomado** | P-09 mostrada. | Selecciona a Aura y confirma **directamente**, sin cambiar de opción. | Identifica a Aura como interlocutor y continúa al paso 3; **ninguna sustitución previa queda registrada**. | CA-01 |
| CP-405 | `C_EscribirCharacter` | Básico p.3 · **con autorreportes** | Interlocutor identificado; la cápsula trae los cuatro autorreportes del paso 8 de CU-05. | Se fija la elección. | La cápsula muestra `character = Aura` **junto con** los cuatro autorreportes ya presentes; el caso de uso finaliza. | CA-01 · RN-01.6 |
| CP-406 | `C_EscribirCharacter` | Básico p.3 · **cero autorreportes** | CU-05 llegó aquí por su `FA-01` (rechazó la personalización) y **nunca pasó por «armar la cápsula»**. | Se fija la elección. | La cápsula **existe** con `character = Aura` como **único campo de contenido**; la ausencia de autorreportes **no impidió** que se completara. | CA-02 · RN-01.6 |
| CP-407 | `C_DevolverControlAlOnboarding` | Básico (cierre) | `character` ya escrito. | El sistema termina y retorna. | El control regresa a CU-05, que puede completar su postcondición; la interfaz avanza más allá de P-09 y **ningún mensaje de este caso de uso se dirigió al Proveedor LLM ni al gate**. | CA-01 |

## 2. Verificación de cobertura

**6/6 controladores.** `C_PresentarPersonajes`→401 · `C_RecibirEleccion`→404 ·
`C_EscribirCharacter`→405, 406 · `C_DevolverControlAlOnboarding`→407 · `C_SustituirSeleccion`→403 ·
`C_SolicitarReingreso`→402.

**Caminos.** Básico ✓ · `FA-01` tomado (403) y no tomado (404) · `FE-01` (402).

## 3. `CP-406` es el caso que sostiene toda la invariante

`RN-01.6` afirma que la `CapsulaDePerfil` **siempre existe con `character`** tras el onboarding.
La ruta que más fácilmente la rompería es aquella en que el Usuario **rechazó la personalización** y
por tanto CU-05 **nunca ejecutó «armar la cápsula»**. `CP-406` prueba exactamente esa ruta: si la
cápsula existe ahí, la invariante se sostiene en todas las demás.

`CP-403` prueba la otra mitad: que `FA-01` **no deja rastro**. Verifica una ausencia — que el
personaje descartado no exista en ninguna parte —, y por eso su resultado esperado está redactado
como «nada indica que…», no como «el valor es X».

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 7 casos desde los 6 controladores de `DR-14`, con la invariante `RN-01.6` probada en su ruta más exigente (cero autorreportes) y `FA-01` verificada como ausencia. |
