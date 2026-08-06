# CP-10 — Casos de prueba de CU-10 «Habilitar o deshabilitar el chatbot»

**ID:** CP-10 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 · **Estado:** Propuesto.
**Insumos:** `DR-10 v2.0` (11 controladores), `DS-10 v1.0`, `ECU-10 v2.0` (`CA-01…CA-09`), `PER-01 v1.2` (`PER-T2`), `MV-01` `RN-03.4`/`RN-03.7`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-10` ocupa **`CP-1101`…`CP-1114`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-1101 | `C_VerificarSesionYRol` | Básico p.1 | Sesión por el login separado de administración; rol validado en servidor. | Abre P-16. | No es rechazada (sin 401/403 ni redirección a P-04); continúa a leer el estado global. | CA-01 |
| CP-1102 | `C_SolicitarReingreso` | **FE-01** | La sesión expiró justo antes o durante la petición. | Llega una petición sin sesión válida. | HTTP 401; dirige a reingresar por P-04; **el estado global no cambia**. | CA-07 |
| CP-1103 | `C_DenegarPorRol` | **FE-02** | Rol distinto de administrador, **aunque el cliente declare lo contrario**. | Pide P-16 o envía un cambio de estado. | HTTP 403 o redirección segura; **la respuesta no expone el estado global ni ningún dato**. | CA-08 |
| CP-1104 | `C_MostrarEstadoActual` | Básico p.1 | Acceso concedido; estado vigente = habilitado. | El sistema lee `DisponibilidadDelChatbot`. | P-16 muestra «habilitado» y el último cambio (autor y fecha); **cero campos de conversación, cápsula o dato de un Usuario concreto**. | CA-03 |
| CP-1105 | `C_SolicitarConfirmacion` | Básico p.2 · **FA-01 no tomado** | Estado vigente = habilitado. | Elige «Deshabilitar». | Se abre el diálogo con el texto «ningún usuario podrá iniciar una conversación hasta que lo vuelvas a habilitar»; **el estado aún no cambió**. | CA-01 · RE-05 |
| CP-1106 | `C_SolicitarConfirmacion` | **FA-01 tomado** | Estado vigente = deshabilitado. | Elige «Habilitar». | Mismo diálogo, ahora anunciando que los Usuarios podrán volver a conversar; **el estado aún no cambió**. | CA-04 |
| CP-1107 | `C_InformarEstadoYaVigente` | **FA-03** | Estado vigente = deshabilitado. | Elige «Deshabilitar» **de nuevo**. | Informa que ese estado ya rige; **la traza no muestra ninguna `AccionAdministrativa` nueva**; el estado no cambia. | CA-06 |
| CP-1108 | `C_CancelarCambio` | **FA-02** | Diálogo abierto. | Pulsa «Cancelar». | Vuelve a P-16; el estado queda intacto; **ninguna `AccionAdministrativa` nueva**. | CA-05 |
| CP-1109 | `C_RechazarConfirmacionInvalida` | **FE-03** | Diálogo mostrado. | Llega una petición **sin la confirmación exigida**, o mal formada. | HTTP 400; **el estado no cambia**; vuelve al **paso 2** y puede confirmar de nuevo. | CA-09 |
| CP-1110 | `C_CambiarEstadoGlobal` | Básico p.3 | Confirmó explícitamente. | Llega la confirmación válida. | Una relectura inmediata muestra «deshabilitado»; P-16 refleja el cambio. | CA-01 |
| CP-1111 | `C_RegistrarAccion` | Básico p.3-4 · **`RN-03.4`** | Cambio recién aplicado. | El sistema registra inmediatamente después de cambiar. | La traza muestra **exactamente una** `AccionAdministrativa` nueva **y** el estado cambiado en el mismo evento; **ningún cambio sin su registro, ni registro sin cambio**. | CA-02 |
| CP-1112 | `C_RegistrarAccion` | Básico p.4 · **`PER-T2`** | Existe una `AccionAdministrativa` recién creada. | Se inspecciona el registro de auditoría. | Contiene **únicamente autor y fecha**; **cero campos de alias, username o cualquier dato de Usuario** (inspección campo a campo). | CA-02 |
| CP-1113 | `C_AplicarNuevoEstado` | Básico p.5 · **FA-01 no tomado** | Estado recién cambiado a deshabilitado. | Un Usuario intenta abrir una `Conversacion`. | **HTTP 409**; no logra iniciarla. | CA-01 |
| CP-1114 | `C_AplicarNuevoEstado` | **FA-01 tomado (efecto)** | Estado recién cambiado a habilitado. | Un Usuario intenta abrir una `Conversacion`. | Prospera con normalidad; **ningún 409 por causa del *kill switch***; CU-06 vuelve a estar disponible. | CA-04 |

*(Trazabilidad completa: `CU-10 → DR-10 → DS-10 → CP-11NN`.)*

## Cobertura

**11/11 controladores.** Básico ✓ · `FA-01` tomado (1106, 1114) y no tomado (1105, 1113) ·
`FA-02` (1108) · `FA-03` (1107) · `FE-01` (1102) · `FE-02` (1103) · `FE-03` (1109).

## Los dos casos de canon

**`CP-1111` prueba `RN-03.4` como una conjunción, no como dos requisitos.** El cambio exige
confirmación **y** registro. El caso verifica que no hay cambio sin su registro correlativo **ni**
registro sin cambio: una implementación que registrara la intención antes de aplicar el cambio
—y luego fallara— dejaría la traza mintiendo.

**`CP-1112` prueba `PER-T2` campo a campo.** El registro guarda **autor y fecha, nada más**. Si
contuviera alias o username, la telemetría permitiría reconstruir qué hizo una persona concreta,
que es exactamente lo que la regla prohíbe.

**`CP-1107` fija que la idempotencia no registra.** Elegir el estado que ya rige informa y **no
crea** `AccionAdministrativa`: la auditoría registra cambios, no intenciones.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.1 | 2026-08-05 | J. Sánchez | `TVI-02` del `CDR-01 v1.6`: `CP-1109` decía «vuelve al paso 1» y `ECU-10 FE-03` dice **paso 2**. La prueba propagaba un destino falso. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 14 casos desde los 11 controladores de `DR-10`, con `RN-03.4` probado como conjunción y `PER-T2` verificado campo a campo. |
