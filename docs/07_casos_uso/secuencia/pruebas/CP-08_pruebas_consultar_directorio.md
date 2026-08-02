# CP-08 — Casos de prueba de CU-08 «Consultar directorio de usuarios»

**ID:** CP-08 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** `DR-08 v2.0` (8 controladores), `DS-08 v1.0`, `ECU-08 v2.0` (`CA-01…CA-08`), `PER-01 v1.2` (`PER-T3`, `PER-T4`), `PRIV-01` (`PRIV-R10`), `MV-01` `RN-03.2`/`RN-03.5`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-08` ocupa **`CP-901`…`CP-908`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-901 | `C_VerificarSesionYRol` | Básico p.1 · **FE-01/FE-02 no tomados** | Administrador con sesión y rol validados en servidor. | Abre P-14. | Continúa hacia la lectura de cuentas sin mostrar 401 ni 403. | — |
| CP-902 | `C_DenegarPorSesionAusente` | **FE-01** | Sin sesión activa. | Solicita abrir P-14. | HTTP 401; **no arma la vista ni devuelve fila alguna**. | CA-05 |
| CP-903 | `C_DenegarPorRol` | **FE-02** | Sesión activa, pero el servidor no reconoce el rol de administrador. | Solicita abrir P-14, **aunque el cliente afirme tener el rol**. | HTTP 403; **no arma la vista ni devuelve fila alguna**. | CA-06 |
| CP-904 | `C_ReunirDatosDelDirectorio` | Básico p.1 · **FA-01 no tomado** | Al menos una cuenta registrada. | El sistema arma la vista. | El listado trae, por cada `Usuario`, alias, ID truncado, fecha de registro y si completó el onboarding; **no queda vacío**. | — |
| CP-905 | `C_InformarDirectorioVacio` | **FA-01** | Ninguna cuenta registrada. | Abre el directorio. | Presenta el listado **vacío con un aviso sobrio, sin error**; termina con cero filas. | CA-03 |
| CP-906 | `C_DerivarEstadoConsentimiento` | Básico p.2 · **FA-02 no tomado** | El `Usuario` tiene vigente la **capa base**. | El sistema deriva el estado. | La fila muestra `estado = activo`, **con independencia de si otorgó o no la capa de personalización**. | CA-08 |
| CP-907 | `C_MarcarSinConsentimiento` | **FA-02** | El `Usuario` **no** tiene vigente la capa base. | El sistema deriva el estado. | La fila muestra `estado = «sin consentimiento vigente»` y **sigue apareciendo** en el listado, **sin excluirse ni ofrecer acción alguna**. | CA-04 |
| CP-908 | `C_RestringirAlConjuntoMinimo` | Básico p.3-4 | Directorio armado con una o más filas. | El Administrador recorre el listado. | Cada fila muestra **únicamente** alias, ID truncado, fecha, `estado` y onboarding; una inspección campo por campo **no encuentra** username completo, respuestas de encuesta, `CapsulaDePerfil`, `Mensaje`, `Personaje` ni conteos por usuario; **comparar el almacenamiento antes y después no muestra ninguna escritura**. | CA-01 · CA-02 · CA-07 |

*(Trazabilidad completa: `CU-08 → DR-08 → DS-08 → CP-9NN`.)*

## Cobertura

**8/8 controladores.** Básico ✓ · `FA-01` tomado (905) y no tomado (904) · `FA-02` tomado (907) y
no tomado (906) · `FE-01` (902) · `FE-02` (903).

## `CP-908` prueba dos ausencias a la vez

`PER-T3` y `RN-03.5` no se verifican mirando lo que se muestra, sino **inspeccionando que ciertos
datos no aparecen en ninguna parte**. `CP-908` recorre campo por campo y además compara el
almacenamiento antes y después: una consulta administrativa **no debe escribir nada**. La segunda
mitad es la que detectaría, por ejemplo, un registro de auditoría que dejara rastro de qué
administrador miró a qué usuario.

**`CP-906` cierra una confusión fácil:** el `estado` deriva de la **capa base**, no de la de
personalización. Un usuario que revocó la personalización sigue apareciendo como **activo** —revocar
no es punitivo (`RN-08`)—, y este caso lo fija.

> **Nota heredada de `DS-08`.** `CP-905` y `CP-907` derivan de `FA-01` y `FA-02`, que `DR-08` **sí
> dibuja** aunque su nota en prosa diga «cero cursos alternativos». La contradicción interna está
> registrada como **`H-7` en `DS-00`**; aquí se sigue a las flechas y a `ECU-08` §6, que coinciden.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 8 casos desde los 8 controladores de `DR-08`, con `CP-908` verificando la segregación administrativa por inspección **y** la ausencia de escrituras. |
