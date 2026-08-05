# CP-05 — Casos de prueba de CU-05 «Otorgar consentimiento y crear la cápsula de perfil»

**ID:** CP-05 · **Familia:** CP (pruebas derivadas de secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 (SD-41: `CP-208` afirmaba que «nada de lo no confirmado quedó escrito», que `H-16` declaró falso — el `Consentimiento` de la capa base **sí** puede permanecer; `VI-02`). v1.0 · **Estado:** Propuesto.
**Propósito:** derivar los casos de prueba de `CU-05` **desde los 16 Controladores** de `DR-05`.
**Insumos:** `DR-05 v2.0`, `DS-05 v1.0`, `ECU-05 v2.0` (§20 `CA-01…CA-10`), `PER-01 v1.2` (`PER-T7`), `MV-01 §7`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador** contra los `.puml`.
**Consumidores:** `CP-00`, pruebas de construcción, `TRZ-DS-01`.

Numeración global: `CU-05` ocupa **`CP-201`…`CP-218`**.

---

## 1. Los 18 casos

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-201 | `C_PresentarDisclosure` | Básico p.1 | Adulto con sesión activa que no completó el onboarding. | Inicia el onboarding (entra a P-05). | P-05 muestra el *disclosure*; **ningún campo de captura aparece** ni se registra solicitud antes de que confirme haberlo leído. | CA-01 |
| CP-202 | `C_SolicitarDeclaracionEdad` | Básico p.2 | P-05 mostrada. | Lee y pulsa continuar. | Navega a P-06 con el campo de declaración; P-07 todavía no aparece. | — |
| CP-203 | `C_RegistrarDeclaracionEdad` | Básico p.3 | P-06 mostrada. | Declara ser mayor de 18 y confirma. | El registro `Usuario` muestra `esAdulto = verdadero` con una versión de *disclosure*, **nunca una fecha de nacimiento**; navega a P-07. | CA-01 · RN-04.2 |
| CP-204 | `C_CerrarSesionPorMinoriaDeEdad` | **FE-01** | P-06 mostrada. | Declara ser menor de 18. | La sesión queda cerrada **por el sistema**, sin esperar acción; una inspección **no encuentra `Consentimiento` ni `CapsulaDePerfil`** para ese intento. | CA-02 |
| CP-205 | `C_PresentarCapaBase` | Básico p.4 | Edad registrada como adulto. | El sistema recibe el evento. | P-07 muestra el alcance de la capa base **antes** de solicitar su otorgamiento. | — |
| CP-206 | `C_RegistrarCapaBase` | Básico p.5 | P-07 mostrada. | Otorga la capa base. | `Consentimiento` creado con la capa base «otorgada»; navega a P-08. | CA-03 |
| CP-207 | `C_ImpedirAvanceSinCapaBase` | **FE-02** | P-07 mostrada. | Intenta continuar sin otorgarla. | No navega a P-08; permanece en P-07; **ninguna inspección encuentra un `Consentimiento` creado**. | CA-03 |
| CP-208 | `C_SolicitarReingreso` | **FE-04** | Onboarding en curso, con la capa base **ya otorgada** en el paso 5 (P-07 o P-08). | La sesión expira antes de terminar la caracterización. | HTTP 401; redirige a P-03; al reingresar, **el chat NO queda habilitado** y **ningún autorreporte sin confirmar quedó escrito** — pero el `Consentimiento` con su **capa base sí permanece**, porque el paso 5 ya la había otorgado explícitamente. | CA-10 |
| CP-209 | `C_RetirarCapaBase` | **FA-03** | Acaba de otorgar la capa base en P-07. | La retira sin salir de P-07. | Capa base «revocada»; el onboarding **finaliza** sin navegar a P-08; **ninguna `CapsulaDePerfil` llega a crearse**. | CA-07 |
| CP-210 | `C_OfrecerPersonalizacion` | Básico p.6 | Capa base otorgada. | El sistema recibe el evento. | P-08 muestra el alcance de la personalización y los **cuatro autorreportes como opcionales**. | — |
| CP-211 | `C_RegistrarCapaPersonalizacion` | Básico p.7 · **FA-01 no tomado** | P-08 mostrada. | Otorga la capa de personalización. | Capa de personalización «otorgada» junto a la base; continúa al paso 8. | CA-06 (contraste) |
| CP-212 | `C_OmitirCaracterizacion` | **FA-01** | P-08 mostrada. | No otorga la personalización y rechaza la caracterización. | `Consentimiento` con **solo la capa base**; continúa igualmente al paso 8 y arma la cápsula **sin ningún autorreporte**. | CA-05 · CA-06 |
| CP-213 | `C_RetirarCapaPersonalizacion` | **FA-04 tomado** | Personalización recién otorgada en P-08. | La retira sin tocar la capa base. | Personalización «revocada» y **capa base sigue otorgada**; el onboarding **continúa** al paso 8 — a diferencia de `CP-209`, no finaliza. | CA-08 |
| CP-214 | `C_RegistrarCapaPersonalizacion` | **FA-04 no tomado** | Personalización recién otorgada. | No la retira y continúa. | Personalización **todavía** «otorgada» (sin transición); continúa al paso 8 con los autorreportes habilitados. | — |
| CP-215 | `C_ArmarCapsula` | Básico p.8 · **FA-02 no tomado** | Personalización otorgada; P-08 mostrada. | Responde los **cuatro** autorreportes y confirma. | La cápsula muestra los cuatro valores enviados más `schema_version` y `consent_version`; **ningún campo con un valor que el Usuario no envió**. | CA-04 |
| CP-216 | `C_ArmarCapsula` | **FA-02 tomado** | Personalización otorgada. | Responde **2 de 4** y omite los otros dos. | La cápsula muestra **únicamente los dos respondidos**; los omitidos **no aparecen**, ni vacíos ni con valor por defecto. | CA-05 |
| CP-217 | `C_MsgDatosInvalidos` | **FE-03** | P-08 mostrada. | Envía un autorreporte fuera del catálogo permitido. | HTTP 400 y «Revisa tus respuestas»; permanece en el paso 8 y **no se pierde lo válido**. | CA-09 |
| CP-218 | `C_InvocarEleccionAcompanante` | Básico p.8 (cierre) | La cápsula quedó armada: con los cuatro (`CP-215`), con algunos (`CP-216`) o **sin ninguno** (`CP-212`). | El sistema pasa el control a CU-14. | Navega a P-09; al regresar, `character` **está presente en los tres escenarios**, incluido el de cero autorreportes — la capa de personalización **no condiciona su existencia**. | CA-04 · RN-01.6 |

## 2. Verificación de cobertura

**16/16 controladores.** `C_PresentarDisclosure`→201 · `C_SolicitarDeclaracionEdad`→202 ·
`C_RegistrarDeclaracionEdad`→203 · `C_CerrarSesionPorMinoriaDeEdad`→204 · `C_PresentarCapaBase`→205 ·
`C_RegistrarCapaBase`→206 · `C_ImpedirAvanceSinCapaBase`→207 · `C_SolicitarReingreso`→208 ·
`C_RetirarCapaBase`→209 · `C_OfrecerPersonalizacion`→210 · `C_RegistrarCapaPersonalizacion`→211, 214 ·
`C_OmitirCaracterizacion`→212 · `C_RetirarCapaPersonalizacion`→213 · `C_ArmarCapsula`→215, 216 ·
`C_MsgDatosInvalidos`→217 · `C_InvocarEleccionAcompanante`→218.

**Caminos, por operador.** Básico ✓ · `FA-01` tomado (212) y no tomado (211) · `FA-02` tomado (216) y
no tomado (215) · `FA-03` (209) · `FA-04` tomado (213) y no tomado (214) · `FE-01` (204) · `FE-02` (207) ·
`FE-03` (217) · `FE-04` (208). **4 FA + 4 FE, todos cubiertos, y los `opt` con sus dos ramas.**

## 3. El contraste que estos casos existen para probar

**`FA-03` y `FA-04` tienen efectos opuestos**, y por eso van separados desde el `PDR-01`:
`CP-209` verifica que retirar la **capa base finaliza** el onboarding sin cápsula; `CP-213` verifica
que retirar solo la **personalización continúa** y conserva la base. Un solo caso de prueba no podría
distinguirlos.

**`CP-218` es el más exigente**: prueba que la cápsula **siempre existe con `character`** incluso por
la ruta en que el Usuario rechazó la personalización y nunca pasó por «armar la cápsula». Es la
invariante `RN-01.6`, y se cumple en `CU-14`, no aquí.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.1 | 2026-08-05 | J. Sánchez | **SD-41 — `VI-02` del `CDR-01 v1.4`.** `CP-208` exigía que tras expirar la sesión «**nada de lo no confirmado quedó escrito**». `H-16` mostró que eso es **falso por construcción**: `DS-05` crea el `Consentimiento` con su capa base **en el paso 5**, porque el Usuario ya la otorgó explícitamente, así que una expiración posterior lo encuentra escrito — y **debe** dejarlo, porque retirarlo sería descartar una decisión que la persona sí tomó. El caso pasa a verificar lo que `ECU-05 CA-10` dice ahora: el chat **no** queda habilitado, ningún autorreporte sin confirmar quedó escrito, **pero la capa base sí permanece**. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 18 casos desde los 16 controladores de `DR-05`, con las dos ramas de cada `opt` y el contraste `FA-03`/`FA-04` probado por separado. |
