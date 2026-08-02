# CP-02 — Casos de prueba de CU-02 «Registrar cuenta»

**ID:** CP-02 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** `DR-02 v2.0` (7 controladores), `DS-02 v1.0`, `ECU-02 v2.0` (`CA-01…CA-06`), `PRIV-01` (`PRIV-R12`), `REQ-01` (`RNF-08`), `MV-01` `RN-04.1`/`RN-04.6`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-02` ocupa **`CP-601`…`CP-607`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-601 | `C_MostrarFormularioRegistro` | Básico p.1 | Visitante sin sesión; accede a la ruta pública de registro. | Abre el formulario. | P-02 solicita **únicamente** `username`, `alias` y `contraseña`; **ningún** campo de correo, teléfono, documento, nombre legal ni fecha de nacimiento aparece. | RN-04.1 |
| CP-602 | `C_ValidarFormatoDeCampos` | Básico p.2 · **FE-01 no tomado** | Formulario mostrado. | Envía los tres campos bien formados. | No aparece el error de entrada inválida; continúa hacia la verificación de unicidad. | — |
| CP-603 | `C_MsgEntradaInvalida` | **FE-01** | Formulario mostrado. | Envía con algún campo vacío o mal formado. | HTTP 400; explica el rechazo en P-02; **ninguna cuenta queda creada**; retorna al paso 2. | CA-06 |
| CP-604 | `C_VerificarUnicidadDeUsername` | Básico p.2 · **FA-01 no tomado** | El `username` propuesto no lo tiene tomado ningún titular. | Envía ese `username`. | El aviso de «username en uso» **no aparece**; continúa hacia la creación. | — |
| CP-605 | `C_MsgUsernameEnUso` | **FA-01** | Otro `TitularDeCuenta` ya tiene ese `username`. | Envía ese `username`. | **No se crea cuenta alguna**; indica que está en uso y solicita otro; retorna al paso 2. | CA-05 |
| CP-606 | `C_CrearCuentaDeUsuario` | Básico p.3 | Formato válido y username disponible. | El sistema crea la cuenta. | Se crea un `Usuario` con la contraseña **hasheada**; el rol queda en «usuario» —**determinado en el servidor incluso si el envío manipulado pedía «administrador»**—; una inspección de lo persistido **no halla la contraseña en claro** ni ningún campo prohibido. | CA-02 · CA-04 |
| CP-607 | `C_ConfirmarRegistro` | Básico p.3 (cierre) | Cuenta recién creada. | El sistema confirma el alta. | P-02 confirma y ofrece el paso a P-03; una consulta inmediata muestra que ese `Usuario` **todavía no tiene `Consentimiento` ni `CapsulaDePerfil`**. | CA-01 · CA-03 |

*(Trazabilidad completa: `CU-02 → DR-02 → DS-02 → CP-6NN`.)*

## Cobertura

**7/7 controladores.** Básico ✓ · `FA-01` tomado (605) y no tomado (604) · `FE-01` tomado (603) y
no tomado (602).

## `CP-606` es el caso de canon de este caso de uso

Verifica **tres cosas de una vez**, y las tres son ausencias o propiedades no observables desde la
interfaz: la contraseña **no está en claro** (`PRIV-R12`), el rol se determinó **en el servidor**
aunque el cliente pidiera otro (`RNF-08`), y **ningún campo prohibido** llegó a persistirse
(`RN-04.1`). Un registro que pasara la prueba funcional y fallara aquí sería un fallo de canon, no
de funcionalidad.

`CP-607` cierra la frontera con CU-05: al registrarse **no hay consentimiento ni cápsula todavía**.
Confundir ambos momentos es el error que este caso previene.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 7 casos desde los 7 controladores de `DR-02`, con `CP-606` verificando hash, rol en servidor y ausencia de campos prohibidos. |
