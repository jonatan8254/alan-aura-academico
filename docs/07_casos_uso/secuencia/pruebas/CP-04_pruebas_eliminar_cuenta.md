# CP-04 — Casos de prueba de CU-04 «Eliminar cuenta»

**ID:** CP-04 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 · **Estado:** Propuesto.
**Insumos:** `DR-04 v2.1` (12 controladores), `DS-04 v1.0`, `ECU-04 v2.1` (`CA-01…CA-11`), `PER-01 v1.2` (`PER-T1`), `PRIV-01`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-04` ocupa **`CP-801`…`CP-813`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-801 | `C_VerificarSesionYRol` | Básico p.1 · **FE-01 no tomado** | Sesión activa y rol de usuario validado en servidor. | Solicita eliminar su cuenta desde P-13. | Continúa hacia la presentación del alcance sin mostrar el aviso de sesión expirada. | — |
| CP-802 | `C_PresentarAlcanceSupresion` | Básico p.1 | Sesión y rol verificados. | El sistema presenta el alcance. | P-13 **enumera** qué registros desaparecerán (`CapsulaDePerfil`, `Consentimiento`, `ContadorDeUsoDiario`) y advierte que la acción es **irreversible**, **sin fricción de retención añadida**. | — |
| CP-803 | `C_SolicitarReingreso` | **FE-01** | La sesión expira en cualquier punto. | Continúa operando con la sesión expirada. | HTTP 401; **ninguna cuenta se toca**; reingresa por CU-03. | CA-07 |
| CP-804 | `C_ComprobarTitularidad` | Básico p.2 · **FA-03 no tomado** | Alcance mostrado; es el titular autenticado. | Confirma explícitamente. | Continúa hacia el borrado, sin desviarse a cancelación ni a denegación. | — |
| CP-805 | `C_CancelarEliminacion` | **FA-03** | Alcance mostrado. | No confirma y cancela. | **No se suprime nada**; la cuenta y todos sus registros quedan intactos; vuelve al paso 1. | CA-06 |
| CP-806 | `C_DenegarPorPermiso` | **FE-02** | Rol no autorizado, **o la solicitud apunta a una cuenta ajena**. | Confirma la eliminación sobre esa cuenta. | HTTP 403; **ninguna cuenta cambia**. | CA-08 |
| CP-807 | `C_MsgPeticionInvalida` | **FE-03** | Alcance mostrado. | Envía solicitud mal formada o **sin confirmación explícita**. | HTTP 400; **no ejecuta la supresión**; la cuenta queda intacta. | CA-03 · CA-09 |
| CP-808 | `C_CerrarConversacionAbierta` | **FA-02** | Titularidad comprobada; hay una `Conversacion` en curso. | Se confirma con la conversación abierta. | La conversación se cierra y **su contenido se descarta antes** de suprimir la cuenta; una inspección posterior **no lo encuentra en ninguna parte**. | CA-05 |
| CP-809 | `C_EliminarEnCascada` | Básico p.3 — **existen los tres dependientes** | Existen `CapsulaDePerfil`, `Consentimiento` y `ContadorDeUsoDiario`. | Ejecuta el borrado en cascada. | El `Usuario` **y los tres dependientes dejan de existir**; una inspección del almacenamiento **no encuentra ninguno de los cuatro**. | CA-01 |
| CP-810 | `C_EliminarEnCascada` | **FA-01** | La cuenta **nunca completó el onboarding**: sin cápsula ni consentimiento. | Ejecuta el borrado en cascada. | La supresión del `Usuario` y su contador **termina con éxito**; la ausencia de los otros dos **no provoca error**; continúa al paso 4. | CA-04 |
| CP-811 | `C_DeshacerCascada` | **FE-04** | La cascada está en curso cuando el almacenamiento falla a mitad. | El fallo ocurre tras suprimir parte de los registros. | El sistema **deshace lo ya suprimido** —la cuenta queda como antes, **sin registros a medio borrar**— **y no confirma** la eliminación. | CA-10 |
| CP-812 | `C_CerrarSesionYConfirmar` | Básico p.4 | Borrado completado (`CP-809` o `CP-810`). | El sistema cierra la sesión. | Sesión cerrada; P-01 confirma; **las credenciales anteriores ya no dan acceso**; la persona queda en la condición de `Visitante`. | CA-02 |
| CP-813 | `C_ConservarTelemetriaSinIdentidad` | Básico p.3 · **`RE-06`** | Cuenta ya eliminada, con `EventoOperativo` anteriores a la supresión. | Se inspecciona la telemetría superviviente. | Los `EventoOperativo` **permanecen** —la cascada no los alcanza— y **ninguno lleva alias ni username**; cruzarlos entre sí **no permite reconstruir que esa cuenta existió ni qué hizo**. | CA-11 · RE-06 · PER-T2 |

*(Trazabilidad completa: `CU-04 → DR-04 → DS-04 → CP-8NN`.)*

## Cobertura

**12/12 controladores** — `C_EliminarEnCascada` rinde dos (`CP-809` básico y `CP-810` para `FA-01`), y `C_ConservarTelemetriaSinIdentidad` rinde `CP-813`.
Básico ✓ · `FA-01` (810) · `FA-02` (808) · `FA-03` tomado (805) y no tomado (804) ·
`FE-01` tomado (803) y no tomado (801) · `FE-02` (806) · `FE-03` (807) · `FE-04` (811).

## `CP-811` es el caso que más importa

`FE-04` es la única ruta en que el sistema puede quedar **a medias**, y `RF-24` no admite medias
tintas. El caso exige dos cosas simultáneas: que **deshaga** lo ya suprimido y que **no confirme**
la eliminación. Un sistema que deshiciera pero confirmara dejaría a la persona creyendo que su
cuenta desapareció cuando sigue ahí; uno que confirmara sin deshacer dejaría registros huérfanos.

## Un hueco cerrado y otro que sigue abierto

**`CA-11` ya tiene `CP` — `H-9` está resuelto (SD-30).** `ECU-04 §7` declaraba que el
`EventoOperativo` **permanece** fuera de la cascada «y por eso debe ser irreidentificable»
(`RE-06`), pero `DR-04` había omitido ese concepto. Se corrigió: `DR-04 v2.1` gana la entidad y el
controlador `C_ConservarTelemetriaSinIdentidad`, `DS-04` gana el mensaje `conservarSinIdentidad()`
y de ahí deriva **`CP-813`**.

**`PER-H5` sigue abierto:** los respaldos en S3 escapan al borrado en cascada, así que `RF-24`
tampoco se cumple de extremo a extremo por esa vía. Se cierra en `ARQ-01`, antes de cualquier uso
con personas reales. Ninguno de estos trece casos lo cubre porque el respaldo es diseño físico.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 12 casos desde los 11 controladores de `DR-04`, con `FE-04` verificando deshacer **y** no confirmar. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** entra `CP-813` desde el controlador nuevo `C_ConservarTelemetriaSinIdentidad` de `DR-04 v2.1`. `CA-11` deja de estar sin prueba; el hallazgo `H-9` queda cerrado. Quedan 13 casos y 12/12 controladores. |
