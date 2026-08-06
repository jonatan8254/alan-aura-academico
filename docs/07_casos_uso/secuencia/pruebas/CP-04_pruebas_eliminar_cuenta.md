# CP-04 — Casos de prueba de CU-04 «Eliminar cuenta»

**ID:** CP-04 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.6 (SD-41: `CP-811` deja de exigir que se **deshaga** el borrado y pasa a exigir que se **conserve** y se ofrezca reintento — `VI-02`; se repone la fila `v1.3` que faltaba y se reordena el historial). v1.3 (SD-35: las dos excepciones de `RF-24` cerradas). v1.2 (SD-34: `PER-H5` cerrado; la cascada que estos casos prueban es toda la que existe). v1.1 · **Estado:** Propuesto.
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
| CP-807 | `C_MsgPeticionInvalida` | **FE-03** | Alcance mostrado. | Envía solicitud mal formada o **sin confirmación explícita**. | HTTP 400; **no ejecuta la supresión**; la cuenta queda intacta; vuelve al **paso 2**. | CA-03 · CA-09 |
| CP-808 | `C_CerrarConversacionAbierta` | **FA-02** | Titularidad comprobada; hay una `Conversacion` en curso. | Se confirma con la conversación abierta. | La conversación se cierra y **su contenido se descarta antes** de suprimir la cuenta; una inspección posterior **no lo encuentra en ninguna parte**. | CA-05 |
| CP-809 | `C_EliminarEnCascada` | Básico p.3 — **existen los tres dependientes** | Existen `CapsulaDePerfil`, `Consentimiento` y `ContadorDeUsoDiario`. | Ejecuta el borrado en cascada. | El `Usuario` **y los tres dependientes dejan de existir**; una inspección del almacenamiento **no encuentra ninguno de los cuatro**. | CA-01 |
| CP-810 | `C_EliminarEnCascada` | **FA-01** | La cuenta **nunca completó el onboarding**: sin cápsula ni consentimiento. | Ejecuta el borrado en cascada. | La supresión del `Usuario` y su contador **termina con éxito**; la ausencia de los otros dos **no provoca error**; continúa al paso 4. | CA-04 |
| CP-811 | `C_ConservarYOfrecerReintento` | **FE-04** | La cascada está en curso cuando el almacenamiento falla a mitad. | El fallo ocurre tras suprimir el `Consentimiento` y antes de suprimir el `Usuario`. | El sistema **conserva lo ya suprimido** —el `Consentimiento` **sigue borrado**, no se restaura—, **no confirma** la eliminación, informa que quedó a medias y **ofrece reintentar**. Una inspección inmediata muestra el `Usuario` **aún presente**, que es lo que permite al reintento saber qué falta borrar; vuelve al **paso 1**, con el reintento disponible (`ECU-04 FE-04`). | CA-10 |
| CP-812 | `C_CerrarSesionYConfirmar` | Básico p.4 | Borrado completado (`CP-809` o `CP-810`). | El sistema cierra la sesión. | Sesión cerrada; P-01 confirma; **las credenciales anteriores ya no dan acceso**; la persona queda en la condición de `Visitante`. | CA-02 |
| CP-813 | `C_ConservarTelemetriaSinIdentidad` | Básico p.3 · **`RE-06`** | Cuenta ya eliminada, con `EventoOperativo` anteriores a la supresión. | Se inspecciona la telemetría superviviente. | Los `EventoOperativo` **permanecen** —la cascada no los alcanza— y **ninguno lleva alias ni username**; cruzarlos entre sí **no permite reconstruir que esa cuenta existió ni qué hizo**. | CA-11 · RE-06 · PER-T2 |

*(Trazabilidad completa: `CU-04 → DR-04 → DS-04 → CP-8NN`.)*

## Cobertura

**12/12 controladores** — `C_EliminarEnCascada` rinde dos (`CP-809` básico y `CP-810` para `FA-01`), y `C_ConservarTelemetriaSinIdentidad` rinde `CP-813`.
Básico ✓ · `FA-01` (810) · `FA-02` (808) · `FA-03` tomado (805) y no tomado (804) ·
`FE-01` tomado (803) y no tomado (801) · `FE-02` (806) · `FE-03` (807) · `FE-04` (811).

## `CP-811` es el caso que más importa

`FE-04` es la única ruta en que el sistema puede quedar **a medias**, y lo que `RF-24` no admite es
que se **confirme** una eliminación que no ocurrió. El caso exige dos cosas simultáneas: que
**conserve** lo ya suprimido —sin intentar restaurarlo— y que **no confirme** la eliminación. Un
sistema que confirmara dejaría a la persona creyendo que su cuenta desapareció cuando sigue ahí.

**Por qué conservar y no deshacer** (`H-02` del `CDR-01`, propagado aquí en `SD-41` por `VI-02`).
La versión anterior de este caso exigía **deshacer** lo suprimido, y eso **ningún mecanismo puede
implementarlo**: la cascada toca cuatro entidades, `ADR-002-D5` fija DynamoDB —que no revierte
escrituras confirmadas fuera de `TransactWriteItems`— y `ADR-003` deja el almacén **sin respaldo**.
Lo borrado no vuelve. **La garantía la da el orden, no la reversión:** el `Consentimiento` se
suprime primero, así que desde ese instante el Sistema ya no tiene base para procesar a esa
persona aunque la cascada no haya terminado; y el `Usuario` se suprime al final, de modo que
mientras exista, el reintento sabe a quién le falta borrar. Por eso el caso ahora **verifica que el
`Usuario` sigue presente** en vez de verificar una restauración imposible.

## Un hueco cerrado y otro que sigue abierto

**`CA-11` ya tiene `CP` — `H-9` está resuelto (SD-30).** `ECU-04 §7` declaraba que el
`EventoOperativo` **permanece** fuera de la cascada «y por eso debe ser irreidentificable»
(`RE-06`), pero `DR-04` había omitido ese concepto. Se corrigió: `DR-04 v2.1` gana la entidad y el
controlador `C_ConservarTelemetriaSinIdentidad`, `DS-04` gana el mensaje `conservarSinIdentidad()`
y de ahí deriva **`CP-813`**.

**Las dos excepciones de `RF-24` están cerradas.** `PER-H5` en `ADR-003` (SD-33): el almacén
operativo **no se respalda**, así que la cascada que estos trece casos prueban es **toda la que
existe**. `PER-H2` en `ADR-004-D1` (SD-35): la supresión es **física e inmediata**, sin ventana de
gracia. **`RF-24` pasa a cumplirse** según el diseño.
**La inmediatez, sin embargo, no la prueba ninguno de estos casos**, y no por un hueco: exige una
implementación contra la que medir. Es fase 4.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.6 | 2026-08-05 | J. Sánchez | `CVI-03` del `CDR-01 v1.7`: `CP-811` fija el punto de reentrada —**paso 1, con el reintento disponible**, el que declara `ECU-04 FE-04`—. El acta v1.6 dio por completa la alineacion de los CP y quedaban seis sin fijar. |
| v1.5 | 2026-08-05 | J. Sánchez | `TVI-02` del `CDR-01 v1.6`: `CP-807` fija el punto de reentrada —**paso 2**, el que declara `ECU-04 FE-03`—. |
| v1.4 | 2026-08-05 | J. Sánchez | **SD-41 — `VI-02` del `CDR-01 v1.4`.** `CP-811` verificaba `C_DeshacerCascada` y exigía que el sistema **deshiciera** lo ya suprimido. Esa reversión es la que `H-02` declaró **sin mecanismo posible**: cuatro entidades, DynamoDB sin `TransactWriteItems` (`ADR-002-D5`) y sin respaldo (`ADR-003`). El caso pasa a verificar la semántica que `ECU-04` y `DS-04` ya tenían desde `SD-39`: **conserva** lo suprimido, **no confirma** la eliminación, informa que quedó a medias y **ofrece reintentar** — y comprueba que el `Usuario` **sigue presente**, que es lo que permite al reintento saber qué falta borrar. Se reescribe también el párrafo de justificación, que seguía razonando sobre deshacer. **Se repone la fila `v1.3`**, que la ficha declaraba y el historial no tenía, y **se reordena el historial**, que iba v1.0-v1.2-v1.1. |
| v1.3 | 2026-08-04 | J. Sánchez | **SD-35.** `ADR-004-D1` cierra `PER-H2` y `ADR-003` había cerrado `PER-H5`: las **dos excepciones de `RF-24`** quedan cerradas, así que estos casos dejan de probar una cascada con salvedades. *(Fila repuesta en `SD-41`: la versión existía en la ficha y el historial nunca la registró — el mismo defecto que `H-25` catalogó en otros tres artefactos.)* |  había cerrado : las **dos excepciones de ** quedan cerradas, así que estos casos dejan de probar una cascada con salvedades. *(Fila repuesta en : la versión existía en la ficha y el historial nunca la registró — el mismo defecto que  catalogó en otros tres artefactos.)* |
| v1.2 | 2026-08-04 | J. Sánchez | **SD-34.** El bloque decía «`PER-H5` sigue abierto: los respaldos en S3 escapan al borrado en cascada». `ADR-003` lo cerró quitando el respaldo del almacén operativo, así que **la cascada que estos trece casos prueban es toda la que existe**. Lo que sigue abierto es `PER-H2`, y por eso `RF-24` no se cumple de forma **inmediata**. **Ningún caso de prueba cambia.** |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** entra `CP-813` desde el controlador nuevo `C_ConservarTelemetriaSinIdentidad` de `DR-04 v2.1`. `CA-11` deja de estar sin prueba; el hallazgo `H-9` queda cerrado. Quedan 13 casos y 12/12 controladores. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 12 casos desde los 11 controladores de `DR-04`, con `FE-04` verificando deshacer **y** no confirmar. |
