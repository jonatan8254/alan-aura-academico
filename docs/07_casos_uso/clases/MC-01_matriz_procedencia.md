# MC-01 — Matriz de procedencia

**ID:** MC-01-PROC · **Familia:** MC (clases de diseño, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/clases/` · **Fecha:** 2026-08-04 · **Versión:** v1.2 (SD-39: propagación de cifras — 27 de solución, 44+19=63 dependencias, 80 relaciones). v1.1 (SD-39: retrabajo del `CDR-01` — `H-08`). v1.0 · **Estado:** Propuesto.
**Propósito:** decir, elemento por elemento, **de qué artefacto viene y dónde está escrito**. Es lo que hace verificable la regla que gobierna la skill `uml-design-class-model`; sin esta matriz el modelo sería una afirmación, no una derivación.
**Insumos:** `DS-01…DS-14 v1.1`, `DOP-01 v1.1`, `MD-01 v1.4/v1.6`, `ECU-01…ECU-14 v2.1`, `PER-01 v1.3`, `MV-01 §13`, `ECU-12 §4.1`, `DIS-00`, `SEG-01 v1.2`, `PRIV-01 v1.5`.
**Consumidores:** el **CDR** (hito 3), `COD-01`, `ARQ-01`.
**Naturaleza:** registro de trazabilidad. No interpreta salvo donde lo dice expresamente, y esos casos van marcados `[I2]` o `[P5]`.
**DoD:** cada clase, cada atributo y cada operación con artefacto de origen y localizador; cada elemento sin procedencia declarado como hallazgo, no rellenado.

---

## 1. El reparto de trabajo que manda aquí

La fuente reparte explícitamente de dónde sale cada cosa (Rosenberg & Stephens, 4363):

| Elemento | Procede de | Cómo se comprobó en este modelo |
|---|---|---|
| **Operaciones** | Los mensajes de `DS-XX` | Emparejamiento **exacto** por línea de vida — `scripts/verificar_procedencia_mc01.py` §1 y §2 |
| **Relaciones** | `MD-01`, más las que exige una operación | Las 17 de `MD-01` intactas; las de solución solo donde una operación navega |
| **Atributos** | La especificación y sus *supplementary specs* | `PER-01 §3`, `MV-01 §13.1`, `ECU-12 §7` — tabla §3 |
| **Clases nuevas** | El espacio de la **solución**, descubierto al diseñar | Las 21, marcadas `<<solucion>>` — tabla §4 |

**Lo que no traza no se rellena.** Los **siete** casos sin procedencia están en **§9** de este archivo y en `MC-00 §6`, con el artefacto al que hay que volver.

## 2. Clases del espacio del problema — 16/16

Todas proceden de `MD-01 v1.4` con **nombre idéntico** (comprobado por script, §3 del verificador). Ninguna se renombró, así que no hay deriva de vocabulario que declarar.

| Clase | En `MD-01` | Ops | Origen de las operaciones (`DS-XX`) |
|---|---|---:|---|
| `Visitante` | L22 | 5 | `DS-01`, `DS-02`, `DS-04` |
| `TitularDeCuenta` `{abstract}` | L23 | 7 | `DS-02`, `DS-03` |
| `Usuario` | L24 | 13 | `DS-02`, `DS-03`, `DS-04`, `DS-05`, `DS-08`, `DS-09`, `DS-11`, `DS-12` |
| `Administrador` | L25 | 2 | `DS-03`, `DS-10` |
| `Consentimiento` | L29 | 12 | `DS-03`…`DS-06`, `DS-08`, `DS-11`, `DS-12` |
| `CapsulaDePerfil` | L30 | 14 | `DS-03`…`DS-06`, `DS-11`…`DS-14` |
| `Conversacion` | L34 | 10 | `DS-04`, `DS-06`, `DS-07`, `DS-10`, `DS-12`, `DS-13` |
| `Mensaje` | L35 | 6 | `DS-06`, `DS-07` |
| `Personaje` `{abstract}` | L36 | 3 | `DS-06`, `DS-13`, `DS-14` |
| `Alan` | L37 | 2 | `DS-13`, `DS-14` |
| `Aura` | L38 | 2 | `DS-13`, `DS-14` |
| `EventoDeSeguridad` | L42 | 4 | `DS-06`, `DS-07` |
| `RecursoDeAyuda` | L43 | 1 | `DS-07` |
| `DisponibilidadDelChatbot` | L47 | 6 | `DS-06`, `DS-07`, `DS-09`, `DS-10`, `DS-13` |
| `ContadorDeUsoDiario` | L48 | 3 | `DS-04`, `DS-06` |
| `EventoOperativo` | L49 | 4 | `DS-04`, `DS-06`, `DS-09` |

**Dos clases se declaran `abstract`, y no estaba en `MD-01`.** Es una decisión de diseño con fundamento: Fowler define la clase abstracta como *«a class that cannot be directly instantiated»*, y ni `TitularDeCuenta` ni `Personaje` pueden instanciarse sin ser una de sus especializaciones — no existe un titular que no sea `Usuario` o `Administrador`, ni un personaje que no sea `Alan` o `Aura`. `MD-01` no lo marca porque el modelo conceptual no distingue instanciabilidad. **Marcado `[I2]`.**

## 3. Atributos — procedencia una por una

`MD-01` **no tiene ni un atributo**: declara `hide fields` y su decisión 10 dice «estados y atributos → diferidos». Por eso la fuente de los atributos es `PER-01 §3` con `MV-01 §13.1`, que son exactamente las *supplementary specs* que la fuente nombra.

| Clase.atributo | Tipo | Procede de | Localizador |
|---|---|---|---|
| `TitularDeCuenta.username` `{readOnly}` | String | `PER-01 §3.1` — «Único; nunca visible al administrador» | `PER-01:82`, `RN-04.1` |
| `TitularDeCuenta.alias` | String | `PER-01 §3.1` — «lo único identificable que el admin sí ve» | `PER-01:83`, `RN-04.1` |
| `TitularDeCuenta.contrasenaHash` | String | `PER-01 §3.1`, `PER-T6`, `PRIV-R12` | `PER-01:84`, `ADR-002-D7` (Argon2id) |
| `TitularDeCuenta.rol` | Rol | `PER-01 §3.1` — «asignado y validado en servidor» | `PER-01:85`, `RNF-08`, `RN-03.7` |
| `Usuario.esAdulto` `{readOnly}` | Boolean | `PER-01 §3.1` — «declaración, no fecha de nacimiento» | `PER-01:86`, `RN-04.2` |
| `Usuario.versionDisclosure` `{readOnly}` | String | `PER-01 §3.1` | `PER-01:87`, `RN-04.2`, `RN-09` |
| `Usuario.fechaDeRegistro` `{readOnly}` | Date | `PER-01 §3.1` — «el directorio la muestra ⇒ se persiste» | `PER-01:88`, `RN-03.2` |
| `Usuario.estado` `{derived}` | EstadoDirectorio | `PER-01 §3.1` — **derivado**, no almacenado aparte | `PER-01:89`, `PER-T4`, `SD-26` |
| `Consentimiento.capa` | CapaConsentimiento | `ECU-12 §7`, `MD-01 §6` | `ECU-12:103` |
| `Consentimiento.estado` | EstadoConsentimiento | `PER-01 §3.2`, `MV-01 §13.1` | `PER-01:97` |
| `Consentimiento.fecha` | DateTime | `PER-01 §3.2`, `ECU-05 §18` | `PER-01:98` |
| `Consentimiento.version` | String | `PER-01 §3.2` — versión del texto de consentimiento | `PER-01:99` |
| `CapsulaDePerfil.moodSelfReport` `[0..1]` | MoodSelfReport | `PER-01 §3.3`, `RN-01.3` | `PER-01:111` |
| `CapsulaDePerfil.energySelfReport` `[0..1]` | EnergySelfReport | `PER-01 §3.3`, `RN-01.3` | `PER-01:112` |
| `CapsulaDePerfil.conversationGoal` `[0..1]` | ConversationGoal | `PER-01 §3.3`, `RN-01.3` | `PER-01:113` |
| `CapsulaDePerfil.responseStyle` `[0..1]` | ResponseStyle | `PER-01 §3.3`, `RN-01.3` | `PER-01:114` |
| `CapsulaDePerfil.character` `{readOnly}` | Character | `PER-01 §3.3` — **obligatorio** | `PER-01:115`, `RN-01.6` |
| `CapsulaDePerfil.schemaVersion` | String | `PER-01 §3.3` (metadato) | `PER-01:116` |
| `CapsulaDePerfil.consentVersion` | String | `PER-01 §3.3` (metadato) | `PER-01:117` |
| `Conversacion.estado` | EstadoConversacion | `MV-01 §13.1` | `MV-01:294` |
| `Mensaje.texto` | String | `RN-02.8` (≤ 2.500 caracteres, `H-01`) | `MV-01 §7.3` |
| `Mensaje.momento` | DateTime | `RN-02.2` (ventana de ≤ 4 intercambios, `H-06`) | `MV-01 §7.3` |
| `Personaje.persona` | String | Contrato conversacional P-1…P-8 | `CONTRATO §tabla` |
| `Personaje.tono` | String | Contrato P-1…P-8, `RN-02.4` | `CONTRATO §tabla` |
| `EventoDeSeguridad.momento` | DateTime | `SEG-01`, `DS-07` `marcarTurnoComoSafetyFallback` | `SEG-01 §5` |
| `EventoDeSeguridad.modo` | String | `DS-07` — marca `mode=safety_fallback` | `DOP-01 §3` |
| `DisponibilidadDelChatbot.estado` | EstadoDisponibilidad | `PER-01 §3.4`, `MV-01 §13.1` | `PER-01:132`, `RN-02.7` |
| `EventoOperativo.momento` | DateTime | `PER-01 §3.6` (`timestamp`) | `PER-01:149`, plan §4.15 |
| `EventoOperativo.resultado` | String | `PER-01 §3.6` («resultado técnico») | `PER-01:149` |
| `EventoOperativo.latencia` | Integer | `PER-01 §3.6` | `PER-01:149` |
| `EventoOperativo.modelo` | String | `PER-01 §3.6` | `PER-01:149` |
| `EventoOperativo.versionPrompt` | String | `PER-01 §3.6` (`version_prompt`) | `PER-01:149` |
| `AccionAdministrativa.autor` | String | `PER-01 §3.7` | `PER-01:161`, `RN-03.4` |
| `AccionAdministrativa.fecha` | DateTime | `PER-01 §3.7` | `PER-01:162`, `RF-18` |
| `AccionAdministrativa.accion` | String | `PER-01 §3.7` — **el único campo `[I2]` de todo `PER-01`** | `PER-01:163` |

**Tres campos de `EventoOperativo` que `PER-01 §3.6` sí lista NO están en el modelo**: `request_id`, código de estado y `entorno`. No es un olvido: `MD-01 §6` traza la frontera y los sitúa como **de persistencia**, no de dominio. Se declara para que el CDR no los eche en falta.

**El reparto en la jerarquía de cuenta NO es inferencia: está declarado.** `MD-01 §6` lo escribe literalmente al diferir los atributos — *«`TitularDeCuenta.{username, alias, contrasena, rol}` · `Usuario.{esAdulto, versionDisclosure}`»*—, que es exactamente el reparto de `MC-01`. `PER-01 §3.1` los pone todos en una sola entidad `User` porque describe el patrón *rol-como-atributo* de **persistencia**, y `MD-01 §3.1` ya avisa de que ambas formas «son compatibles». Se sigue a `MD-01 §6` por ser el artefacto de dominio, y coincide con el criterio con que `RET-01 §2` justificó el supertipo. **`[E1]`, no `[I2]`.**

**`Usuario.fechaDeRegistro` es la única excepción:** `MD-01 §6` no la lista, y viene solo de `PER-01 §3.1` («el directorio la muestra ⇒ se persiste»).

## 4. Clases del espacio de la solución — 27

Ninguna procede de un artefacto anterior, **por definición**: nacen aquí o en las secuencias. Por eso se declaran, y la declaración *es* su procedencia. Todas llevan `<<solucion>>` (comprobado, §4 del verificador).

| Clase | Tipo en `DS-XX` | Justificación | Ops |
|---|---|---|---:|
| `Gate de seguridad` | `control` | `SEG-R1…R6` la definen como componente propio: binaria, determinista, configurable, evaluada en **cada** mensaje | 3 |
| `Fallback de seguridad` | `control` | `SEG-R2`, `SEG-R3`, `SEG-R5`: ruta determinista y local que opera con el proveedor y la red caídos | 3 |
| `AccionAdministrativa` | `participant` | Fuera de `MD-01` por decisión declarada (`DR-00 §6`, `RPD-01` H-02): auditoría de operación, no concepto del problema | 1 |
| `Frontera con el Proveedor LLM` | `boundary` | Frontera con el único sistema externo aprobado (`DR-06`) | 5 |
| 17 clases de pantalla | `boundary` | Una por pantalla de `DIS-00` (P-01…P-16), más el diálogo de confirmación | 88 |
| **6 tipos de transferencia** | — | **Entran en SD-39** (`H-04` del `CDR-01`): eran tipos de retorno **con nombre y sin forma**, y una firma que devuelve lo que nadie declara deja la cabecera de código emitiendo `???`. Sus atributos se leyeron de la `ECU` que origina cada uno. Detalle en §5 y en `COD-01 §6.1` | 0 |

**`Dialogo de confirmacion del cambio` no es una pantalla de `DIS-00`.** Es el estado *«modal de confirmación»* que `DIS-00` inventaría dentro de **P-16**. Se modela como clase propia porque `DS-10` le da línea de vida propia y le dirige un mensaje. **Marcado `[I2]`.**

**Dos clases controladoras sobre 150 controladores de robustez = 1,3 %**, muy por debajo del 20 % que la fuente considera el techo, y ninguna es un `XController` por entidad.

## 5. Tipos — aporte del diseño, y se dice

**Ningún artefacto del proyecto declara tipos primitivos.** `PER-01 §1.1` los excluye expresamente de su alcance: *«no fija tipos, claves, índices, tablas intermedias ni nombres de columnas»*. Las dos únicas anotaciones de tipo en todo el corpus son `esAdulto` «(booleano)» y la contraseña «hasheada» con Argon2id.

Por tanto los tipos de `MC-01` **no se copian de ninguna fuente, porque no existe ninguna de la que copiarlos**: son aporte de este artefacto, que es exactamente lo que `ESTADO_PIPELINE §Pendientes #2` esperaba de él —«la columna de firma exige tipos, y los tipos los fija el diagrama de clases»—. Se marcan `[P5]` en bloque.

Conjunto usado, deliberadamente neutral respecto del lenguaje: `String`, `Boolean`, `Integer`, `Decimal`, `Date`, `DateTime`, `void`, `List<T>`, más los **11 enumerados** y **ocho tipos de retorno con nombre** — `ContextoInicialConversacionalV1`, `Persona`, `FilaDeDirectorio`, `AgregadoDeCuentas`, `AgregadoDeUso`, `AlcanceDeBorrado`, `ReferenciaDeDerivacion` y `Sesion`.

> **La cifra decía «cuatro» y la lista traía ocho** (`H-08` del `CDR-01`). Contados sobre el `.puml`, son **ocho**.

**Seis de los ocho ya tienen forma; dos siguen sin ella, y por motivos distintos** (`H-04`). El acta observó que un tipo de retorno sin clase que lo declare deja la **regla #2 del CDR** —generar las cabeceras de código e inspeccionarlas— emitiendo `???` en la firma, así que los que podían definirse se definieron **leyendo sus campos de la `ECU` que los origina**, no inventándolos: `FilaDeDirectorio`, `AgregadoDeCuentas`, `AgregadoDeUso`, `AlcanceDeBorrado`, `Persona` y `ReferenciaDeDerivacion` son hoy clases `<<solucion>>` del paquete «Tipos de transferencia» de `MC-01`. Los dos restantes **no se declaran a propósito**:

| Tipo | Por qué sigue sin clase |
|---|---|
| `ContextoInicialConversacionalV1` | Es la materialización de la cápsula que `RN-01.3` nombra, y **ningún `DS` le da línea de vida**. Declararla sería inventar una clase para la que no hay mensaje — justo lo que la regla de esta skill prohíbe. Va al **delta al modelo de dominio** (`MC-00 §9`), que es donde la fuente dice que va lo que el diseño descubre |
| `Sesion` | Sus campos **son** el mecanismo de sesión, y ese mecanismo está diferido a `ARQ-01` por `E-1` de `MC-00` y la frontera que fija `ADR-002 §1`. Definirla aquí habría revertido una exclusión que el propio `CDR-01` validó. Queda **marcada en su sitio** dentro de `MC-01`, junto a `TitularDeCuenta.establecerSesionConElRolDeterminado()`, para que la ausencia se lea como decisión y no como olvido |

## 6. Enumerados — 11

| Enumerado | Valores | Procede de |
|---|---|---|
| `Character` | alan, aura | `MV-01 §13.1`, `RN-01.3`, `RN-01.6` |
| `MoodSelfReport` | 6 valores | `MV-01 §13.1` literal |
| `EnergySelfReport` | 4 valores | `MV-01 §13.1` literal |
| `ConversationGoal` | 6 valores | `MV-01 §13.1` literal |
| `ResponseStyle` | 4 valores | `MV-01 §13.1` literal |
| `EstadoConsentimiento` | otorgado, revocado | `MV-01 §13.1` |
| `EstadoConversacion` | activa, cerrada | `MV-01 §13.1` |
| `EstadoDisponibilidad` | habilitado, deshabilitado | `MV-01 §13.1` |
| `CapaConsentimiento` | base, personalizacion | **NO está en `MV-01 §13.1`** — `ECU-12 §7`, `ECU-06 §7`, `MD-01 §6` |
| `Rol` | usuario, administrador | **NO está en `MV-01 §13.1`** — `PER-01 §3.1`, `MD-01 §3.1` |
| `EstadoDirectorio` | activo, sin_consentimiento_vigente | **NO está en `MV-01 §13.1`** — `RN-03.2`, `RF-15`, `PER-01 §3.1` (`PER-H3`, cerrado en `SD-26`) |

Los tres últimos **no viven en la sección que el proyecto reserva para dominios de valor**, aunque están declarados con sus valores en otros artefactos. Es un hueco de propagación de `MV-01 §13.1`, reportado como `H-F2` en `MC-00`.

## 7. Relaciones

**Las 17 de `MD-01 v1.4`, intactas**: 4 generalizaciones, 1 composición (`Conversacion *-- Mensaje`) y 12 asociaciones, con sus etiquetas conceptuales sin tocar.

**Multiplicidades: solo donde existen declaradas.** `MV-01 §13.3` las llama expresamente «candidatas (diferidas)» y avisa: *«una ausencia significa "diferida", no 1»*. Se respeta.

| Relación | Multiplicidad | Procede de |
|---|---|---|
| `Usuario — Consentimiento` | `1` — `1..2` | **Derivada.** `MV-01 §13.3` dice `(1–1)`, pero es **anterior** a la decisión de las dos capas (`ECU-12 §4.1`), que da a `Consentimiento` un atributo `capa`: una instancia por capa, la base obligatoria y la de personalización opcional. `[I2]` |
| `Usuario — CapsulaDePerfil` | `1` — `1` | `PER-01 §11:310`: «1 a 1 **tras el onboarding**», con su fundamento en `§3.3:120` («la cápsula siempre existe»). Supera al `(1–0..1)` de `MV-01 §13.3:301`, no propagado tras `SD-26` — hallazgo `H-F` |
| `Usuario — Conversacion` | `1` — `0..*` | `MV-01 §13.3` |
| `Conversacion *— Mensaje` | `1` — `1..*` | `MV-01 §13.3` + `PER-01 §4`: los mensajes no se comparten y mueren con la conversación |
| `Conversacion — Personaje` | `0..*` — `1` | `MV-01 §13.3` |
| `Mensaje — EventoDeSeguridad` | `1` — `0..1` | `MV-01 §13.3` |
| `EventoDeSeguridad — RecursoDeAyuda` | `1` — `1..*` | `MV-01 §13.3` |
| `Administrador — DisponibilidadDelChatbot` | `1` — `1` | `MV-01 §13.3` |
| `DisponibilidadDelChatbot — Conversacion` | `1` — `0..*` | `MV-01 §13.3` |
| `Visitante — TitularDeCuenta` | **sin multiplicidad** | `MD-01` la modela sin cardinalidad y `MV-01 §13.3` no la declara. **No se supone** |
| `Usuario — ContadorDeUsoDiario` | **sin multiplicidad** | Ídem. Además `PER-H4` deja la granularidad abierta |
| `Conversacion — EventoOperativo` | **sin multiplicidad** | Ídem. `PER-01 §3.6` fija «un evento por llamada al proveedor», que no es cardinalidad de esta asociación |

**Composición y agregación.** El método difiere esta distinción hasta esta etapa (*«it's too early to worry about this distinction»*, guía #9 de la revisión de requisitos). Aplicada la prueba de dependencia existencial, **solo `Conversacion *-- Mensaje` la supera**: `PER-01 §4` dice que los mensajes «no se comparten y mueren con la conversación», que es la regla de no compartición de Fowler. **Ninguna agregación (`o--`) entra al modelo**, y así se evita el choque con Fowler, que la considera *«strictly meaningless»* y recomienda ignorarla. La discrepancia entre fuentes queda declarada en `references/notation-rules.md` de la skill.

**Relaciones del espacio de la solución: 44 dependencias**, todas de presentación o control **hacia** el dominio o hacia un tipo de transferencia, nunca al revés. Cada una existe porque una operación concreta la navega. Fowler: mostrarlas todas sería *«an exercise in futility»*, así que no se dibujan las transitivas. Las **19** restantes de las **63** que el `.puml` dibuja salen de una clase del problema hacia un enumerado (`Usuario ..> EstadoDirectorio`, `TitularDeCuenta ..> Rol`…) o hacia un tipo que esa clase devuelve: son uso de dominio de valor y de retorno, no acoplamiento de la solución.

> **Estas cifras se movieron en SD-39, y por eso ahora las cuenta un script.** Eran **42 + 12 = 54** hasta que se dibujaron las **9 dependencias** hacia los tipos de transferencia — 7 desde clases del problema y 2 desde pantallas—, porque el modelo las debía por su propia regla: una operación que **devuelve** un tipo navega hacia él. El total de relaciones pasa de **71** a **80** y entra como hecho canónico **`H-29`**, que no existía: es justo por eso que esa cifra se movió tres veces sin que nada la vigilara.

> **Aquí ponía 37, y era el número de clases, no el de dependencias.** Defecto encontrado al retrabajar `H-08`; contado sobre el `.puml`, son **42 desde la solución + 12 desde el problema = 54**, que es exactamente el desglose que `MC-00 §3` ya declaraba. **No lo movió `H-04`:** medido contra `HEAD`, el reparto 42/12/54 es idéntico antes y después de añadir los seis tipos de transferencia —esos seis se alcanzan por firma de operación, no por flecha—, así que el 37 estuvo mal desde `v1.0`.

## 8. Reconciliaciones aplicadas — decisiones sobre defectos de los insumos

El paquete de secuencia tiene tres inconsistencias reales. `MC-01` las resuelve, y el verificador comprueba que las resuelve **como está escrito**, no de cualquier manera. Están declaradas en `scripts/verificar_procedencia_mc01.py`, no ocultas en el código.

| # | Qué | Cómo se resolvió | Alcance |
|---|---|---|---|
| **H-D** | Dos pantallas con **etiqueta divergente** entre diagramas | Unificadas por número de pantalla, que es la identidad que `DIS-00` posee; se conserva la etiqueta mayoritaria | 5 mensajes: 4 de P-10, 1 de P-08 |
| **H-C** | Mensajes dirigidos a un **actor**, que no es clase de diseño | Reasignados a la **frontera emisora**, que es quien realiza la conducta | 10 operaciones sobre 4 pantallas |
| **H-N** | `actor "Visitante"` y `entity "Visitante"` con **etiqueta idéntica** | Desambiguados por el prefijo del alias (`ACT_` frente a `E_`) | 5 mensajes |

## 9. Elementos SIN procedencia — el informe que la fuente exige

*«use it as an indication that you need to revisit your previous diagrams, not that you need to second-guess yourself and add detail arbitrarily»*. Ninguno de estos se rellenó.

| Elemento | Por qué parecía necesario | A qué artefacto hay que volver |
|---|---|---|
| Campos de `ContadorDeUsoDiario` | La clase persiste cuota por usuario y sin campos no se puede implementar | `PER-H4`, abierto por decisión. Se cierra en `ARQ-01` |
| Definición de «ID truncado» | `PER-T4` y `RN-03.2` exigen mostrarlo en el directorio; seis artefactos lo nombran y **ninguno lo acota** | `RA-05` de `ECU-08` → `/use-case-specifier` |
| Formato de `username`, `alias`, `contrasena` | Los tipos son `String` sin restricción porque no hay política declarada | `RA-02` de `ECU-02` → `/use-case-specifier` |
| Identificadores y llaves de toda entidad | `PER-01 §1.1` los excluye de su alcance | `ARQ-01`, tras el CDR. **No se inventan aquí** |
| Referencias de propiedad entre entidades | La cascada de `PER-T1` las necesita | Se modelan como **asociación UML con multiplicidad**, no como atributo. Las claves son `ARQ-01` |
| Campo de capa en `ConsentRecord` | `PER-01 §3.2` declara un solo `estado` pese a que las dos capas son canónicas | `H-E` → `/use-case-specifier` |
| `flag de onboarding` de `Usuario` | `PER-T4` y `PRIV-R10` dicen que el directorio lo expone; `PER-01 §3.1` **no lo lista** | `H-O` → `/use-case-specifier`. Se modela como derivado de la existencia de la cápsula, **no** como campo |

## 10. Verificación reproducible

```bash
# Validador de la skill — 4 banderas, con PER-01 y MV-01 como supplementary specs
python ~/.claude/skills/uml-design-class-model/scripts/validate_design_class_puml.py \
  --clases docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml \
  --dominio docs/06_dominio/MD-01_modelo_dominio.puml \
  --secuencia docs/07_casos_uso/secuencia/puml/DS-*.puml \
  --spec docs/07_casos_uso/especificaciones/ECU-*.md \
  --spec docs/03_requisitos/PER-01_mapa_persistencia.md \
  --spec docs/02_modelos_verbales/MV-01_modelo_verbal_general.md

# Verificacion EXACTA de procedencia — la que el validador NO hace
python docs/07_casos_uso/clases/scripts/verificar_procedencia_mc01.py
```

Salida literal al cierre de esta versión:

```
clases sin procedencia ..... 0   (meta: 0)
operaciones sin mensaje .... 0   (meta: 0)
ERRORES: ninguno          ADVERTENCIAS: 9

[1] Operaciones del modelo sin mensaje dirigido a esa misma clase ..... ninguna
[2] Operaciones de los DS que NO aterrizaron en el modelo ............. ninguna
[3] Cobertura del modelo de dominio ................... 16/16, nombre identico
[4] Clases fuera del dominio sin declarar <<solucion>> ................ ninguna
RESULTADO: SIN DISCREPANCIAS
```

**Por qué hacen falta los dos.** El validador de la skill compara la procedencia de operaciones por **bolsa de palabras**: le basta con que alguna palabra del nombre coincida con el vocabulario dirigido a esa clase. Con esa regla `mostrarSelectorDePersonaje()` valida contra `mostrarRespuestaDelPersonaje()` —comparten «mostrar» y «personaje»— aunque el mensaje real fuera a otra línea de vida. El script propio hace el emparejamiento **exacto**. Su primera ejecución encontró **19 discrepancias** que el validador no vio; de ellas, **una era un defecto real de este modelo** —`marcarLosCuatroAutorreportesParaDescarte()` estaba puesta en `Consentimiento` cuando `DS-12:62` la dirige a `CapsulaDePerfil`— y las otras 18, las tres inconsistencias de los insumos que la §8 declara.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.2 | 2026-08-05 | J. Sánchez | **SD-39 — propagación de las cifras que el retrabajo movió**, todas remedidas contra el `.puml` antes de escribirse. §4 pasa de **21 a 27** clases de solución y gana la fila de los **6 tipos de transferencia**, que `H-04` dotó de forma. §7 pasa de «42 + 12 = 54» a **44 + 19 = 63** dependencias, por las **9** flechas que el modelo debía por su propia regla —7 desde clases del problema, 2 desde pantallas—, con lo que las relaciones van de **71 a 80**. Esa cifra entra además como hecho canónico **`H-29`**, que **no existía**: es exactamente por eso que se movió tres veces (73 → 71 → 80) sin que nada la vigilara, y desde ahora la cuenta `verificar_coherencia.py` sobre el modelo. |
| v1.1 | 2026-08-04 | J. Sánchez | **SD-39 — retrabajo del `CDR-01`.** `H-08`: §5 anunciaba «**cuatro** tipos de retorno con nombre» y enumeraba **ocho**; se corrige la cifra y se reescribe la justificación, porque `H-04` la dejó obsoleta: **seis** de los ocho ya son clases `<<solucion>>` del paquete «Tipos de transferencia» de `MC-01`, con atributos leídos de la `ECU` que los origina, y solo `ContextoInicialConversacionalV1` y `Sesion` siguen sin declararse, cada uno con su motivo en tabla. **Dos defectos más, encontrados al retrabajar y no registrados en el acta:** §1 remitía «los **seis** casos sin procedencia» a «§6» —son **siete** y están en **§9**; §6 son los enumerados—; y §7 daba «**37** dependencias del espacio de la solución», que era el número de **clases**: contadas sobre el `.puml` son **42 desde la solución + 12 desde el problema = 54**, el mismo desglose que `MC-00 §3` ya declaraba, e idéntico antes y después de `H-04` (medido contra `HEAD`). **Ninguna cifra canónica se mueve aquí:** las que `H-04` desplazó —incluidas las **21** clases de solución de §4, hoy **27**— se propagan con `SD-39` en el cierre del retrabajo. |
| v1.0 | 2026-08-04 | J. Sánchez | Creación. Procedencia de las 37 clases, los 69 atributos, las 200 operaciones, los 11 enumerados y las 73 relaciones, con localizador. Siete elementos sin procedencia declarados y enrutados en vez de rellenados. |
