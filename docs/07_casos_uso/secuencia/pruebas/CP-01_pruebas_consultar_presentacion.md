# CP-01 — Casos de prueba de CU-01 «Consultar presentación del servicio»

**ID:** CP-01 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.3 (`SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.**). v1.2 (SD-42: historial reordenado a descendente; ninguna afirmación cambia). v1.1 · **Estado:** Propuesto.
**Insumos:** `DR-01 v2.1` (7 controladores), `DS-01 v1.0`, `ECU-01` (§11 `CA-01…CA-08`).
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-01` ocupa **`CP-501`…`CP-507`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-501 | `C_MostrarPresentacion` | Básico p.1 | Servicio desplegado; Visitante sin cuenta ni sesión. | Solicita la página de presentación (`/`). | P-01 muestra el propósito **no clínico**, las tres exclusiones del bloque «Qué no es» y los dos accesos, **sin exigir autenticación**. | CA-01 · CA-03 |
| CP-502 | `C_MantenerAccesosVisibles` | Básico p.2 | P-01 mostrada. | Lee el alcance y los límites. | Los accesos de registro e inicio de sesión permanecen visibles; **ningún campo de captura aparece**. | — |
| CP-503 | `C_DirigirARegistro` | **FA-01** | P-01 mostrada. | Elige «registrarse». | Dirige a P-02; el caso de uso **termina** y continúa en CU-02. | CA-04 |
| CP-504 | `C_DirigirAInicioSesion` | **FA-02** | P-01 mostrada; ya tiene cuenta. | Elige «iniciar sesión». | Dirige a P-03; **termina** y continúa en CU-03. | CA-05 |
| CP-505 | `C_SalirSinElegirAcceso` | **FA-03** | P-01 mostrada. | Abandona la página sin elegir acceso. | Una inspección posterior **no encuentra cuenta, sesión ni registro alguno**; **ningún dato quedó capturado** en ningún punto del intento. | CA-02 · CA-06 |
| CP-506 | `C_MostrarIndisponibilidad` | **FE-01** | El servicio está caído o en mantenimiento. | Solicita la página. | P-01 muestra «servicio no disponible» **sin detalle técnico** y permite reintentar; no se crea sesión. | CA-07 |
| CP-507 | `C_ExigirCuentaParaAcompanamiento` | **FE-02** | Visitante sin cuenta ni sesión. | Intenta alcanzar la conversación directamente. | **No se abre ninguna `Conversacion`** ni se concede acceso a dato de cuenta; **vuelve a P-01** con el acceso de registro a la vista. | CA-08 |

*(Trazabilidad completa: `CU-01 → DR-01 → DS-01 → CP-5NN`.)*

## Cobertura

**7/7 controladores.** Básico ✓ · `FA-01` (503) · `FA-02` (504) · `FA-03` (505) · `FE-01` (506) ·
`FE-02` (507).

## `CP-505` prueba una ausencia total

Es el caso que sostiene `RN-04.5` y la postcondición del caso de uso: el Visitante **no crea sesión
ni deja rastro**. Su resultado esperado está redactado como «no encuentra», no como «el valor es X»,
porque lo que se verifica es que **nada existe**.

> **`H-8` resuelto (SD-30), y este caso lo refleja.** `DR-01` dirigía a P-02 y terminaba; `ECU-01`
> dice en tres sitios —§6, la fila de `FE-02` y `CA-08`— que **vuelve a P-01** con el acceso de
> registro a la vista. Mandó la especificación: `DR-01 v2.1`, `DS-01` y este `CP-507` quedan
> alineados. La diferencia importa: al Visitante **se le ofrece** registrarse, no se le empuja.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.3 | 2026-08-05 | J. Sánchez | `SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.** |
| v1.2 | 2026-08-05 | J. Sánchez | **SD-42 — reparación del registro, no del contenido.** El historial iba desordenado y se reordena a **descendente**, que es la convención del repositorio: se estableció **midiendo** —~~23 artefactos descendentes contra 3 ascendentes y 5 sin orden~~ **21 descendentes, 3 ascendentes y 7 mixtos** *(la cifra de `SD-42` estaba mal medida: se contó después de reparar ya `PER-01` y `CP-00`. Corregida en `SD-43`; este historial se rectifica en `SD-44`, `TVI-06`)*— y el `CHANGELOG` ya la había declarado en su `v0.21.1`. **Ninguna afirmación de este artefacto cambia.** El desorden alcanzaba a **ocho** archivos y no lo vigilaba nada; desde esta versión lo comprueba el **bloque 6** de `verificar_coherencia.py`. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** `H-8` resuelto a favor de `ECU-01`; `CP-507` pasa de dirigir a P-02 a volver a P-01. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 7 casos desde los 7 controladores de `DR-01`. |
