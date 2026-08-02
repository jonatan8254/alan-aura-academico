# CP-13 — Casos de prueba de CU-13 «Cambiar de acompañante»

**ID:** CP-13 · **Familia:** CP (pruebas derivadas de secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Propósito:** derivar los casos de prueba de `CU-13` **desde los 6 Controladores** de `DR-13`.
**Insumos:** `DR-13 v2.0`, `DS-13 v1.0`, `ECU-13 v1.0` (§11 `CA-01…CA-06`, §7 invariante), `PER-01 v1.2` (`PER-T7`).
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-13` ocupa **`CP-301`…`CP-308`**.

---

## 1. Los 8 casos

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-301 | `C_MostrarSelectorPersonaje` | Básico p.1 | Sesión y rol válidos, capa base vigente, chatbot habilitado y una `Conversacion` abierta que conduce Alan. | Solicita cambiar de acompañante desde P-10. | P-10 muestra el selector con Alan como activación y Aura como calma; la conversación **sigue abierta** en ese instante. | CA-01 |
| CP-302 | `C_SolicitarReingreso` | **FE-02** | Acaba de solicitar el cambio. | La sesión expira antes de mostrarse el selector. | HTTP 401; redirige a P-03; el `Personaje` que conducía la conversación **no cambió**. | CA-06 |
| CP-303 | `C_MantenerPersonajeEnCurso` | **FA-01 tomado** | Selector mostrado; conduce Alan. | Confirma **a Alan de nuevo**. | **Sin cambio observable de tono** en el turno siguiente; ninguna escritura nueva en `Conversacion` ni en `CapsulaDePerfil`; continúa en el paso 2 de CU-06. | CA-04 |
| CP-304 | `C_SustituirPersonaje` | Básico p.2 · **FA-01 no tomado** | Selector mostrado; conduce Alan; chatbot habilitado. | Confirma a **Aura**. | El `Personaje` que conduce la conversación es ahora Aura; la conversación **permanece abierta** — no se cierra ni se crea otra. | CA-01 |
| CP-305 | `C_SustituirPersonaje` | Básico · **invariante de no escritura** | Igual que `CP-304`, justo antes de confirmar. | Se completa la sustitución. | `CapsulaDePerfil.character` tiene **el mismo valor antes y después**; y el registro de escrituras **de todo el caso de uso** —de la solicitud a la confirmación— **no muestra ninguna operación de escritura**: solo cambia el personaje de la sesión. | CA-02 · §7 |
| CP-306 | `C_InformarIndisponibilidad` | **FE-01** | Confirmó Aura; el *kill switch* se activa entre la solicitud y la sustitución. | El sistema encuentra el chatbot deshabilitado. | HTTP 409; P-10 informa indisponibilidad **sin exponer detalle técnico**; la `Conversacion` queda **cerrada** y el personaje no se sustituyó. | CA-05 |
| CP-307 | `C_ConfirmarCambio` | Básico p.3 | Sustitución aplicada; chatbot habilitado. | El sistema completa el cambio. | P-10 confirma y muestra a Aura como interlocutor; el foco vuelve al paso 2 de CU-06 **sin que la conversación se haya cerrado en ningún momento**. | CA-01 |
| CP-308 | `C_ConfirmarCambio` | Básico · **el gate no interviene** | Cambio confirmado; conversación con turnos previos. | Envía el siguiente mensaje tras el cambio. | El gate de seguridad se evalúa **exactamente igual** que antes del cambio, sin atajo ni endurecimiento; **ningún mensaje de este caso de uso alcanzó el gate ni al Proveedor LLM** — esas fronteras pertenecen solo a CU-06. | CA-03 · RE-01 |

## 2. Verificación de cobertura

**6/6 controladores.** `C_MostrarSelectorPersonaje`→301 · `C_SustituirPersonaje`→304, 305 ·
`C_ConfirmarCambio`→307, 308 · `C_MantenerPersonajeEnCurso`→303 · `C_InformarIndisponibilidad`→306 ·
`C_SolicitarReingreso`→302.

**Caminos.** Básico ✓ · `FA-01` tomado (303) y no tomado (304) · `FE-01` (306) · `FE-02` (302).

## 3. Los dos casos que justifican este caso de uso

**`CP-305` prueba una ausencia**, que es lo difícil de verificar y lo fácil de romper: **ninguna
escritura persistida en todo el caso de uso**. `PER-T7` distingue reiniciar de revocar; aquí la
distinción es aún más fina — cambiar de acompañante **no escribe nada**. Si algún día ese registro
muestra una escritura, el invariante `RN-01.6` se rompió.

**`CP-308` prueba que el gate sigue igual.** Cambiar de personaje **modula el tono, no las reglas de
seguridad** (`RN-02.4`). Es el caso que detectaría a alguien que, al implementar el cambio, tocara
la ruta de seguridad «de paso».

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 8 casos desde los 6 controladores de `DR-13`, incluidos los dos que prueban ausencias: cero escrituras persistidas y gate inalterado. |
