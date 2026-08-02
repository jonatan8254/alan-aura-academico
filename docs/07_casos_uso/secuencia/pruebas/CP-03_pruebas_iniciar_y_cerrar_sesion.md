# CP-03 — Casos de prueba de CU-03 «Iniciar y cerrar sesión»

**ID:** CP-03 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Insumos:** `DR-03 v2.0` (12 controladores), `DS-03 v1.0`, `ECU-03 v2.0` (`CA-01…CA-08`), `REQ-01` (`RNF-08`).
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-03` ocupa **`CP-701`…`CP-712`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-701 | `C_SolicitarCredenciales` | Básico p.1 | Titular sin sesión; cuenta creada por CU-02. | Abre P-03. | P-03 solicita únicamente `username` y `contraseña`; **ningún control de selección de rol** aparece. | CA-01 |
| CP-702 | `C_VerificarCredenciales` | Básico p.2 · **FE-01 no tomado** | Credenciales correctas. | Las envía. | No aparece el mensaje de credenciales incorrectas; continúa hacia la determinación del rol. | — |
| CP-703 | `C_MsgCredencialesIncorrectas` | **FE-01** | Se prueban **los dos casos por separado**: username inexistente y contraseña incorrecta. | Envía cualquiera de los dos. | El texto de error es **idéntico** en ambos casos y **no revela cuál campo falló**; no se establece sesión. | CA-06 |
| CP-704 | `C_DeterminarRolEnElServidor` | Básico p.2 | Credenciales válidas de una cuenta con `rol=usuario`. | El sistema determina el rol. | La sesión queda con `rol=usuario`, determinado **en el servidor**; **manipular el envío del cliente pidiendo otro rol no cambia el resultado**. | CA-01 |
| CP-705 | `C_EstablecerSesion` | Básico p.3 | Rol ya determinado. | El sistema establece la sesión. | Existe sesión activa con ese rol; una petición a función protegida **ya no responde 401**. | CA-01 |
| CP-706 | `C_ComprobarOnboardingCompleto` | Básico p.4 · **FA-01 no tomado** | Existen `Consentimiento` con capa base y `CapsulaDePerfil` con `character`. | El sistema comprueba el onboarding. | **No se desvía** a P-05: continúa hacia el enrutamiento a la conversación. | CA-02 |
| CP-707 | `C_DirigirAlOnboarding` | **FA-01** | Falta la capa base otorgada **o** la cápsula con `character`. | El sistema comprueba el onboarding. | Dirige a P-05 en vez de a P-10; continúa en CU-05. | CA-04 |
| CP-708 | `C_DirigirAConversacion` | Básico p.4 (cierre) | Onboarding completo. | El sistema enruta. | P-10 muestra la conversación abierta; continúa en CU-06. | CA-02 |
| CP-709 | `C_DirigirAlPanelAdministrativo` | **FA-02** | Entra por P-04 y el servidor determina `rol=administrador`. | Envía credenciales por la ruta administrativa. | Sesión con `rol=administrador`; dirige a P-14 **sin pasar por el onboarding**. | CA-05 |
| CP-710 | `C_DenegarAccesoAdministrativo` | **FE-02** | Sesión activa con `rol=usuario`. | Pide una ruta administrativa, **aun manipulando el cliente**. | HTTP 403 o redirección segura; **no concede privilegio alguno**; la sesión sigue con su rol original. | CA-07 |
| CP-711 | `C_CerrarSesion` | Básico p.5 | Sesión activa (usuario o administrador). | Cierra sesión desde P-10 o P-14. | La sesión queda invalidada **en el servidor**; una petición posterior responde 401 y **volver atrás en el navegador no restituye el acceso**. | CA-03 |
| CP-712 | `C_SolicitarAutenticacion` | **FE-03** | Sesión expirada o inexistente. | Opera una función protegida. | HTTP 401; **no cierra ni cambia nada**; pide reingresar por el paso 1. | CA-08 |

*(Trazabilidad completa: `CU-03 → DR-03 → DS-03 → CP-7NN`.)*

## Cobertura

**12/12 controladores.** Básico ✓ · `FA-01` tomado (707) y no tomado (706) · `FA-02` (709) ·
`FE-01` tomado (703) y no tomado (702) · `FE-02` (710) · `FE-03` (712).

## Los tres casos de canon

**`CP-703`** es el más fino: exige que el mensaje sea **idéntico** para username inexistente y para
contraseña incorrecta. Un sistema que los distinga —aunque sea por el tiempo de respuesta— filtra
qué cuentas existen.

**`CP-704` y `CP-710`** prueban `RNF-08` desde los dos lados: que el rol se determine en el servidor
**aunque el cliente pida otro**, y que un usuario con rol correcto no obtenga privilegios
administrativos **aunque manipule el cliente**.

**`CP-711`** verifica que la invalidación es **en el servidor**: volver atrás en el navegador no
debe restituir el acceso. Es la diferencia entre borrar una cookie y cerrar una sesión.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 12 casos desde los 12 controladores de `DR-03`, con `RNF-08` probado desde ambos lados y el mensaje genérico verificado como idéntico. |
