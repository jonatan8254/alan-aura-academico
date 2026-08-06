# CP-06 — Casos de prueba de CU-06 «Conversar con el acompañante»

**ID:** CP-06 · **Familia:** CP (pruebas derivadas de secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.2 · **Estado:** Propuesto.
**Propósito:** derivar los casos de prueba de `CU-06` **desde los Controladores** de `DR-06`, no desde el código ni desde el diagrama de secuencia. La unidad de derivación es el Controlador; la comprobación de cobertura son los caminos.
**Insumos:** `DR-06 v2.1` (25 controladores), `DS-06 v1.1`, `ECU-06 v2.1` (§20, `CA-01…CA-11`), `HECHOS_CANONICOS` (`H-01…H-06`).
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador** contra los `.puml` (canon `CLAUDE.md` §1).
**Consumidores:** `CP-00`, pruebas unitarias y de integración de la fase de construcción, `TRZ-DS-01`.

---

## 1. Numeración

Los `CP` llevan numeración **global y correlativa** en todo el proyecto: no reinicia por caso de
uso, para que un identificador de prueba sea único. `CU-06` ocupa **`CP-001`…`CP-034`**.

## 2. Los 34 casos

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazabilidad |
|---|---|---|---|---|---|---|
| CP-001 | `C_VerificarSesionYRol` | Curso básico | Usuario autenticado con sesión activa y rol «usuario» validado en servidor (`PRE-01`, `PRE-02`); aún no eligió personaje. | Elige a Aura y pulsa iniciar conversación. | No devuelve 401 ni 403; el flujo continúa hacia la verificación del consentimiento sin mostrar P-11. | CU-06 → DR-06 → DS-06 → CP-001 |
| CP-002 | `C_DenegarPorRol` | FE-02 | Sesión activa pero con un rol distinto de «usuario». | Intenta iniciar una conversación con Alan. | HTTP 403; P-11 muestra «sin acceso»; ninguna `Conversacion` queda abierta. | … → CP-002; CA-06 |
| CP-003 | `C_VerificarConsentimiento` | Curso básico | Sesión y rol válidos; capa base del consentimiento vigente (`PRE-03`). | Inicia la conversación. | No aparece 403 por capa base revocada; el flujo continúa hacia la verificación de disponibilidad. | … → CP-003 |
| CP-004 | `C_DenegarPorCapaBaseRevocada` | FE-09 | El usuario retiró la capa base durante el onboarding (flujo alternativo de CU-05). | Intenta iniciar una conversación. | HTTP 403; redirige a P-07 para rehacer CU-05; ninguna `Conversacion` queda abierta. | … → CP-004; CA-08 |
| CP-005 | `C_VerificarDisponibilidad` | Curso básico | Sesión, rol y capa base válidos; `DisponibilidadDelChatbot` = habilitado (`PRE-04`). | Inicia la conversación. | No aparece 409; el flujo continúa hacia la apertura de la `Conversacion`. | … → CP-005 |
| CP-006 | `C_InformarIndisponibilidad` | FE-04 | El chatbot está deshabilitado por el *kill switch*. | Intenta iniciar una conversación. | HTTP 409; P-11 informa indisponibilidad temporal; ninguna `Conversacion` queda abierta. | … → CP-006; CA-06 |
| CP-007 | `C_IniciarConversacion` | Curso básico | Las cuatro verificaciones de apertura ya pasaron. | El sistema abre la `Conversacion` con Aura. | P-10 muestra el diálogo abierto con Aura visiblemente identificada como personaje activo. | … → CP-007 |
| CP-008 | `C_VerificarSesionYRol` | Curso básico | `Conversacion` abierta, con al menos un turno previo intercambiado. | Envía un nuevo mensaje. | No devuelve 401 ni 403 en la revalidación del turno; continúa hacia la validación de longitud. | … → CP-008 |
| CP-009 | `C_SolicitarReingreso` | FE-01 | La sesión vence o se invalida antes del siguiente turno. | Intenta enviar un mensaje con la sesión vencida. | HTTP 401; solicita reingresar por CU-03; el mensaje no se procesa. | … → CP-009; CA-06 |
| CP-010 | `C_ValidarTurno` | Curso básico · **frontera: primer mensaje del `loop`** | `Conversacion` recién abierta, cero mensajes enviados. | Envía el primer mensaje, con exactamente **2.500 caracteres** bien formados. | Se acepta; continúa hacia la verificación de límites de tasa sin aviso de entrada inválida. | … → CP-010 |
| CP-011 | `C_InformarEntradaInvalida` | FE-03 | `Conversacion` abierta, dentro de los límites de tasa. | Envía un mensaje de **2.501 caracteres**. | HTTP 400; P-11 pide corregir; el turno **no llega al gate ni al Proveedor LLM**; vuelve al **paso 2** (`ECU-06 FE-03`). | … → CP-011; CA-07 |
| CP-012 | `C_VerificarLimitesDeTasa` | Curso básico · **frontera: 3.ª solicitud/minuto** | Ya envió 2 mensajes dentro del minuto en curso. | Envía un tercero en el mismo minuto. | No aparece 429; se procesa y el contador diario sube a 3. | … → CP-012 |
| CP-013 | `C_InformarLimiteDeTasa` | FE-05 | Ya alcanzó **3 solicitudes** dentro del minuto. | Envía una cuarta en el mismo minuto. | HTTP 429 con `Retry-After`; el turno no llega al gate; vuelve al **paso 2** tras la espera (`ECU-06 FE-05`). | … → CP-013; CA-06 |
| CP-014 | `C_EvaluarGate` | Curso básico | Mensaje bien formado, dentro de los límites de tasa. | Envía un mensaje sin peligro explícito. | Continúa hacia la construcción del contexto mínimo; no se documenta ningún `EventoDeSeguridad` ni se desvía a CU-07. | … → CP-014; CA-01 |
| CP-015 | `C_DesviarADerivacion` | FE-08 | Gate operativo, **incluso con el Proveedor LLM deshabilitado**. | Envía un mensaje con peligro explícito del catálogo de `SEG-01`. | HTTP 200 con `safety_fallback`; el chat ordinario queda suspendido en la sesión y el turno pasa a CU-07. | … → CP-015; CA-03 |
| CP-016 | `C_ConstruirContextoMinimo` | Curso básico | Capa de personalización otorgada. | El sistema arma el contexto del turno. | El *payload* capturado trae exactamente `character`, `mood_self_report`, `energy_self_report`, `conversation_goal` y `response_style`, más hasta 4 intercambios y el turno; **cero campos de identificación**. | … → CP-016; CA-02 |
| CP-017 | `C_ConstruirContextoMinimo` | Curso básico · `PRE-03.1` | Capa de personalización **revocada**; capa base vigente. | Envía un mensaje. | El *payload* contiene `character` pero **no** los cuatro autorreportes; la conversación continúa con normalidad. | … → CP-017; CA-09 |
| CP-018 | `C_ConstruirContextoMinimo` | Curso básico · **frontera: `H-06` = ≤ 4** | La sesión acumuló 6 intercambios previos. | Envía un séptimo mensaje. | El *payload* incluye únicamente **los últimos 4 intercambios** más el turno; ninguno anterior aparece. | … → CP-018 |
| CP-019 | `C_SolicitarGeneracion` | Curso básico | Contexto mínimo ya construido. | El sistema solicita la generación. | Se emite una solicitud saliente con el contexto mínimo como cuerpo; **ninguna clave ni token figura en él**. | … → CP-019 |
| CP-020 | `C_ControlarTiempoDeEspera` | Curso básico | Solicitud enviada a la frontera del proveedor. | El proveedor responde a los 8 s (dentro de los **20 s**). | Se procesa con normalidad; ningún aviso de fallo. | … → CP-020 |
| CP-021 | `C_ReintentarUnaVez` | FE-06 | Contexto mínimo ya enviado. | El proveedor no responde a la primera solicitud (fallo transitorio). | El sistema emite **una única** segunda solicitud, sin que el usuario reenvíe el mensaje. | … → CP-021 |
| CP-022 | `C_InformarFalloDelProveedor` | FE-06 | El reintento único de `CP-021` también falla. | El proveedor tampoco responde al reintento. | HTTP 502 en P-11 con reintento manual visible; **sin rastro ni detalle interno del proveedor**; vuelve al **paso 4** (`ECU-06 FE-06`). | … → CP-022; CA-06 |
| CP-023 | `C_ControlarTiempoDeEspera` | FE-07 | Contexto mínimo ya enviado. | Transcurren **20 segundos** sin respuesta. | HTTP 504 en P-11 sin romper la interfaz, con opción de reintentar; vuelve al **paso 4** (`ECU-06 FE-07`). | … → CP-023; CA-06 |
| CP-024 | `C_AplicarGuardas` | Curso básico · **`opt FA-02` no tomado** | El proveedor devolvió texto sin riesgo ni *claim* clínico. | El sistema aplica las guardas de salida. | El texto se conserva sin alteración (antes del recorte); no aparece la respuesta de *fallback*. | … → CP-024 |
| CP-025 | `C_SustituirSalidaInsegura` | FA-02 · **tomado** | El proveedor devolvió texto que la postvalidación marca como riesgo o *claim* clínico. | El sistema procesa esa salida antes de mostrarla. | P-10 muestra la respuesta segura; **el texto original no aparece en ningún momento**. | … → CP-025; CA-10 |
| CP-026 | `C_AplicarGuardas` | Curso básico · **frontera: `H-03` = 350** | El texto admitido equivale a más de **350 tokens**. | El sistema aplica el límite de salida. | El texto mostrado equivale a 350 tokens o menos, termina en cierre de oración y ninguna palabra queda cortada. | … → CP-026; CA-11 |
| CP-027 | `C_MostrarRespuesta` | Curso básico | Respuesta ya procesada por guardas y límite. | El sistema la muestra. | P-10 muestra el texto asociado visiblemente a Aura, dentro del hilo actual. | … → CP-027 |
| CP-028 | `C_InformarLimiteDeSesion` | Curso básico · **`FA-01` no tomado, frontera 19** | La sesión tiene 18 mensajes enviados y respondidos. | Envía el mensaje 19. | Muestra la respuesta 19 y permite seguir escribiendo; **no** aparece el aviso de límite. | … → CP-028 |
| CP-029 | `C_InformarLimiteDeSesion` | FA-01 · **tomado, frontera `H-02` = 20** | La sesión tiene 19 mensajes enviados y respondidos. | Envía el mensaje **20**. | Tras la respuesta 20, P-10 informa el límite e invita a cerrar o iniciar otra sesión, **sin código de error crudo**; finaliza de forma controlada. | … → CP-029; CA-05 |
| CP-030 | `C_CerrarYDescartar` | Curso básico | `Conversacion` abierta con varios turnos. | Cierra la conversación. | Una inspección de base de datos y registros **no encuentra ningún fragmento de texto** de la conversación; `Conversacion` queda cerrada. | … → CP-030; CA-04 |
| CP-031 | `C_RegistrarEventoOperativo` | Básico p.6 — **un turno** | Conversación abierta; el proveedor responde. | Se completa **un** turno (pasos 2-6). | Existe **exactamente un** `EventoOperativo` nuevo, con momento, resultado, latencia, modelo y versión; **el campo de contenido está ausente**. | … → CP-031 |
| CP-032 | `C_RegistrarEventoOperativo` | Básico p.6 — **frontera de volumen** | Conversación abierta. | Se completan **20** turnos y se cierra. | Hay **20** `EventoOperativo`, uno por llamada — **no uno solo**; el cierre **no añade ninguno**. | `H-02` · `MET-07` |
| CP-033 | `C_InformarFalloDelProveedor` | **FE-06 / FE-07 — la llamada fallida cuenta** | El proveedor no responde, o se agotan los 20 s. | Se agota el reintento único. | Se registra un `EventoOperativo` con **resultado de error**: la llamada entra en el **denominador** de `MET-07`, que si no mediría solo los éxitos. | `RC-07` · `MET-07` |
| CP-034 | `C_InformarLimiteDeTasa` | **FE-05 — la que NO cuenta** | El Usuario supera 3/min o 30/día. | Intenta enviar el turno. | **No se registra ningún `EventoOperativo`**: el corte ocurre antes de tocar al proveedor, así que no hubo petición que medir. Contarla falsearía la tasa técnica a la baja. | `H-04` · `PER-T2` |

*(La columna de trazabilidad se abrevia con «…» a partir de `CP-002`: en todas las filas es `CU-06 → DR-06 → DS-06 → CP-XXX`, más el `CA-XX` cuando se indica.)*

---

## 3. Verificación de cobertura

Comprobada por el orquestador contra `DR-06_robustez_conversar_con_el_acompanante.puml`, no
aceptada del borrador.

**Derivación — los 25 controladores, cada uno con al menos un `CP`:**

| Controlador | CP | | Controlador | CP |
|---|---|---|---|---|
| `C_VerificarSesionYRol` | 001, 008 | | `C_InformarLimiteDeSesion` | 028, 029 |
| `C_VerificarConsentimiento` | 003 | | `C_SustituirSalidaInsegura` | 025 |
| `C_VerificarDisponibilidad` | 005 | | `C_SolicitarReingreso` | 009 |
| `C_IniciarConversacion` | 007 | | `C_DenegarPorRol` | 002 |
| `C_ValidarTurno` | 010 | | `C_InformarEntradaInvalida` | 011 |
| `C_VerificarLimitesDeTasa` | 012 | | `C_InformarIndisponibilidad` | 006 |
| `C_EvaluarGate` | 014 | | `C_InformarLimiteDeTasa` | 013 |
| `C_ConstruirContextoMinimo` | 016, 017, 018 | | `C_ReintentarUnaVez` | 021 |
| `C_SolicitarGeneracion` | 019 | | `C_InformarFalloDelProveedor` | 022, **033** |
| `C_ControlarTiempoDeEspera` | 020, 023 | | `C_DesviarADerivacion` | 015 |
| `C_AplicarGuardas` | 024, 026 | | `C_DenegarPorCapaBaseRevocada` | 004 |
| `C_MostrarRespuesta` | 027 | | `C_CerrarYDescartar` | 030 |
| `C_RegistrarEventoOperativo` | **031, 032** | | `C_InformarLimiteDeTasa` | 013, **034** |

**25/25.** Cota inferior respetada: 34 ≥ 25.

**Cobertura de caminos, desagregada por operador** (no basta «básico + cada FA/FE»):

| Camino | Operador | Cubierto por |
|---|---|---|
| Curso básico | — | 001, 003, 005, 007, 008, 010, 012, 014, 016, 019, 020, 027, 030, 031 |
| `FA-01` | `break` · tomado y no tomado | **029** (tomado) · **028** (no tomado) |
| `FA-02` | `opt` · tomado y no tomado | **025** (tomado) · **024** (no tomado) |
| `FE-01` … `FE-09` | `break` · cada uno tomado | 009, 002, 011, 006, 013, 021+022, 023, 015, 004 |
| `loop 1..20` | fronteras | **010** (primer mensaje) · **029** (mensaje 20) · 028 (19) |
| `H-06` ≤ 4 intercambios | frontera de contenido | **018** |
| `H-03` 350 *tokens* | frontera de salida | **026** |

**11/11 flujos no básicos cubiertos.** Las dos fronteras del `loop` y las dos ramas de cada
`opt` están explícitas.

### Los tres casos que entran en `v1.1` — y por qué el par `033`/`034` es inseparable

`H-1a` movió el `EventoOperativo` del cierre al turno, y eso abrió una pregunta que antes no
existía: **cuántos eventos, y de qué llamadas**. `CP-032` fija el volumen en la frontera —veinte
turnos deben dejar **veinte** registros, no uno—, que es exactamente lo que la granularidad
anterior no podía dar.

Los otros dos hay que leerlos juntos, porque solos no demuestran nada:

- **`CP-033`** exige que una llamada **fallida** (`FE-06`/`FE-07`) **sí** se registre. Sin él, un
  sistema que solo anotara los éxitos pasaría las pruebas y reportaría una tasa técnica del
  100 % — `MET-07` se define como «peticiones OK + *fallback* / **totales**», y ese denominador
  necesita los fallos.
- **`CP-034`** exige que un corte por límite de tasa (`FE-05`) **no** se registre. Sin él, un
  sistema que anotara todo inflaría el denominador con peticiones que **nunca se le hicieron al
  proveedor**, hundiendo la tasa por un motivo ajeno a su salud.

Uno pide registrar, el otro pide no registrar. La regla que satisface a ambos es la única
correcta: **un evento por llamada efectivamente hecha al proveedor**.

## 4. Cifras usadas

Todas contrastadas contra `HECHOS_CANONICOS`: **2.500** caracteres (`H-01`, y 2.501 para forzar
`FE-03`), **20** mensajes por sesión (`H-02`), **350** *tokens* (`H-03`), **3/min** y **30/día**
(`H-04`), **20 s** (`H-05`), **≤ 4** intercambios (`H-06`). **Cero apariciones del valor obsoleto
1.500.**

## 5. Nota sobre los resultados esperados

Todos son **observables**: un código HTTP, un texto en pantalla, un campo presente o ausente en
el *payload*, un registro que no aparece en una inspección. Ninguno afirma que «un método
devuelve verdadero». Es la regla que hace que estas pruebas sobrevivan a un cambio de diseño.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.2 | 2026-08-05 | J. Sánchez | `CVI-03` del `CDR-01 v1.7`: `CP-011`, `CP-013`, `CP-022` y `CP-023` fijan el punto de reentrada que declaran `ECU-06 FE-03/FE-05/FE-06/FE-07` —pasos 2, 2, 4 y 4—. Si `SD-44 R3` traslada el retorno al `CP`, tiene que estar **en** el `CP`. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30, hallazgo `H-1a`.** `CP-031` deja de probar «el evento de cierre» y pasa a probar **un turno**. Entran tres casos que la granularidad nueva hace necesarios: **`CP-032`** fija el volumen en la frontera (20 turnos → **20** eventos, no uno), y el par **`CP-033`/`CP-034`** fija qué llamadas cuentan — la fallida **sí** (o `MET-07` mediría solo éxitos), la cortada por límite de tasa **no** (nunca llegó al proveedor). De 31 a **34** casos; siguen 25/25 controladores. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 31 casos derivados de los 25 controladores de `DR-06`, con cobertura de caminos desagregada por operador y las seis cifras canónicas verificadas. |
