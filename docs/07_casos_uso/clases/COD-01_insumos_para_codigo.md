# COD-01 — Insumos estructurados para código

**ID:** COD-01 · **Familia:** MC (clases de diseño, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/clases/` · **Fecha:** 2026-08-04 · **Versión:** v1.6 (SD-41, `VI-02`: la proyección declaraba **tres** operaciones que `MC-01` ya no tiene o tiene con otra firma — `deshacerLoSuprimido`, `deshacerElBorradoIncompleto` y `revocarCapaBase` sin su parámetro). v1.5 (SD-40: la tabla de capas de §2 seguía sumando **37** y sin la fila de tipos de transferencia que la ficha ya declaraba desde v1.4). v1.4 (SD-39: entra §6.1, la capa de tipos de transferencia — **43** clases). v1.3 (SD-39: retrabajo del `CDR-01` — `H-20`). v1.2 (SD-35: borrado físico sin marca de baja). v1.1 (SD-33: `PER-H5` cerrado — la cascada de `suprimirEnCascada()` es completa; queda `PER-H2`). v1.0 · **Estado:** Propuesto.
**Propósito:** clase · atributos · operaciones con firma · capa, en forma tabular, para que la fase de construcción y el CDR trabajen sobre una lista y no sobre un diagrama.
**Insumos:** **`MC-01_modelo_clases_diseno.puml` y nada más.**
**Consumidores:** el **CDR** (guía #2, *«generate the code headers for your classes»*), la fase de construcción, `ARQ-01`.
**Naturaleza:** **proyección tabular de `MC-01`, no una segunda fuente.** Ver §1.
**DoD:** las **43** clases con su capa; toda operación con firma completa; los huecos de tipo declarados con su hallazgo; **esta skill no genera código**.

---

## 1. Por qué existe ahora, y por qué no antes

`ESTADO_PIPELINE §Pendientes #2` declaraba `COD-01` bloqueado, con dos motivos escritos:

> *«la columna de firma exige tipos, y los tipos los fija el diagrama de clases. Escribirlos ahora sería inventarlos, y además `iconix-cdr-review` los genera desde el modelo de clases, con lo que habría dos fuentes en conflicto»* — **«Lo cierra: el diagrama de clases de diseño.»**

**El primer motivo está resuelto:** `MC-01` fija los tipos, y son suyos porque ningún artefacto previo los declara (`PER-01 §1.1` los excluye de su alcance expresamente).

**El segundo se neutraliza por construcción, no por buena voluntad.** Este archivo **no decide nada**: es una proyección mecánica de `MC-01`. Si discrepan, manda `MC-01`, y la discrepancia es un defecto de este archivo. El CDR sigue generando las cabeceras desde `MC-01`, no desde aquí.

**Esta skill no genera código.** Lo que sigue son insumos.

## 2. Capas

La palabra «capa» aquí significa **capa de diseño**, no capa física: el diseño físico es `ARQ-01` y no se ha ejecutado (`E-1` de `MC-00`).

| Capa | Qué contiene | Clases |
|---|---|---:|
| **Dominio** | El espacio del problema: las 16 clases de `MD-01 v1.4` | 16 |
| **Control** | Coordinadores con nombre, justificados en `SEG-01` | 2 |
| **Frontera · presentación** | Una por pantalla de `DIS-00` (P-01…P-16) + el diálogo de confirmación | 17 |
| **Frontera · sistema externo** | La única aprobada, en `DR-06` | 1 |
| **Auditoría de operación** | Fuera de `MD-01` por decisión declarada | 1 |
| **Tipos de transferencia** | Los seis que `H-04` del `CDR-01` dio forma; detalle en §6.1. `Sesion` queda **sin declarar a propósito** (su mecanismo es `ARQ-01`) | 6 |
| | | **43** |

**Ninguna capa de infraestructura**, y es deliberado: sin repositorios, sin DAO, sin sesión como clase. `ARQ-01` la añadirá tras el CDR.

## 3. Capa de dominio — 16 clases

### `Visitante` — sin atributos (`RN-04.5`)
```
+identificarComoSinCuentaNiSesion() : void
+identificarComoAunSinCuenta() : void
+promoverATitularDeCuenta(username : String, alias : String, contrasenaHash : String) : TitularDeCuenta
+quedarEnLaCondicionDeVisitante() : void
+dejarLaPresentacionSinCrearSesionNiRastro() : void
```

### `TitularDeCuenta` `{abstract}`
```
-username : String {readOnly}      -alias : String
-contrasenaHash : String           -rol : Rol
+solicitarUsernameYContrasena() : void
+estaTomadoElUsername(username : String) : Boolean
+reservarUsername(username : String) : void
+contrastarConLaCuentaRegistrada(username : String, contrasena : String) : Boolean
+establecerSesionConElRolDeterminado(rol : Rol) : Sesion
+invalidarSesionEnElServidor() : void
-dejarDeReconocerAlTitular() : void
```

### `Usuario` — especializa `TitularDeCuenta`
```
-esAdulto : Boolean {readOnly}     -versionDisclosure : String {readOnly}
-fechaDeRegistro : Date {readOnly} -estado : EstadoDirectorio {derived}
+crearCuenta(rol : Rol) : Usuario
+determinarRolEnElServidor() : Rol
+registrarDeclaracionDeEdad(esAdulto : Boolean, versionDisclosure : String) : void
+comprobarTitularidadEnServidor() : Boolean
+enumerarRegistrosQueDesapareceran() : List<String>
+suprimirEnCascada() : void
+reunirAliasIdTruncadoFechaYOnboarding() : List<FilaDeDirectorio>
+contarTotalDeCuentasYOnboardingsCompletados() : AgregadoDeCuentas
+identificarTitularDelConsentimiento() : Usuario
+permanecerIntacta() : void
-noHayDependientesQueSuprimir() : Boolean
-conservarLoYaSuprimido() : void
-marcarLaFilaConEseEstadoSinExcluirla(estado : EstadoDirectorio) : void
```
> `estado` es **derivado**, no almacenado (`PER-T4`, `SD-26`). Al generar la cabecera debe salir como propiedad calculada, no como campo.
> `suprimirEnCascada()` **alcanza todo lo que existe y lo hace de inmediato**: `ADR-003` quitó el respaldo (`PER-H5`) y `ADR-004-D1` fijó la supresión como **física e inmediata**, sin marca de baja (`PER-H2`). **`RF-24` cumplido** según el diseño. Al generar la cabecera: **borrado físico, sin bandera de baja lógica**.

### `Administrador` — especializa `TitularDeCuenta`, sin atributos propios
```
+determinarRolEnElServidor() : Rol
+identificarAlAutorDelCambio() : Administrador
```

### `Consentimiento`
```
-capa : CapaConsentimiento         -estado : EstadoConsentimiento
-fecha : DateTime                  -version : String
+crearConCapaBaseOtorgada() : Consentimiento
+anadirCapaDePersonalizacion() : void
+conservarSoloLaCapaBase() : void
+conservarLaCapaBaseOtorgada() : void
+revocarCapaBase(fecha : DateTime) : void
+revocarCapaDePersonalizacion(fecha : DateTime) : void
+existeLaCapaBaseOtorgada() : Boolean
+estaVigenteLaCapaBase() : Boolean
+estaOtorgadaLaPersonalizacion() : Boolean
+derivarEstadoDeConsentimientoVigente() : EstadoDirectorio
+permanecerConSusDosCapas() : void
+suprimirConSusDosCapas() : void
```
> **Una instancia por capa** (`ECU-12 §4.1`). `conservarLaCapaBaseOtorgada()` existe para hacer visible que revocar la personalización **no es punitivo** (`RN-08`).

### `CapsulaDePerfil`
```
-moodSelfReport : MoodSelfReport [0..1]      -energySelfReport : EnergySelfReport [0..1]
-conversationGoal : ConversationGoal [0..1]  -responseStyle : ResponseStyle [0..1]
-character : Character {readOnly}            -schemaVersion : String
-consentVersion : String
+armarConLoRespondido(schemaVersion : String, consentVersion : String) : CapsulaDePerfil
+escribirCharacter(character : Character) : void
+consultarCharacterSinReescribirlo() : Character
+conservarCharacter() : void
+marcarLosCuatroAutorreportesParaDescarte() : void
+existeConCharacter() : Boolean
+materializarContextoV1() : ContextoInicialConversacionalV1
+dejaraDeOrientarLaConversacion() : void
+enumerarQueElBorradoAlcanzaTambienCharacter() : AlcanceDeBorrado
+borrarCompleta() : void
+suprimir() : void
-dejarSinDefaultsLosOmitidos() : void
-dejarDeExistir() : void
```
> **`[0..1]` significa ausente, no nulo.** `PER-01 §3.3`: «un campo omitido **no se guarda**; no se guarda vacío ni con valor por defecto». `dejarSinDefaultsLosOmitidos()` existe para que esa prohibición sea verificable.
> `borrarCompleta()` (CU-11) y `suprimir()` (cascada de CU-04) **no son duplicado**: `PER-T7` distingue reiniciar de eliminar.

### `Conversacion`
```
-estado : EstadoConversacion
+abrir() : Conversacion                       +cerrar() : void
+fijarPersonajeDeLaSesion(personaje : Personaje) : void
+cambiarPersonajeSinCerrarse(personaje : Personaje) : void
+alcanzoElLimiteDeSesion() : Boolean          +suspenderChatOrdinario() : void
+abrirNuevaSesionDeAcompanamiento() : Conversacion
+cerrarYDescartarSuContenido() : void
+aplicarNuevoEstadoDeInmediato(estado : EstadoDisponibilidad) : void
+desdeElTurnoSiguienteLosAutorreportesNoViajanAlProveedor() : void
```
> **No se persiste** (`RF-13`, `PRIV-R2`, `RNF-03`). Vive en memoria de sesión.

### `Mensaje`
```
-texto : String        -momento : DateTime
+validarLongitudYEstructura(maxCaracteres : Integer) : Boolean
+obtenerTextoDelTurno() : String
+ultimosIntercambiosDeLaSesion(maxIntercambios : Integer) : List<Mensaje>
+descartarContenido() : void
+descartarContenidoDelTurno() : void
+suspenderRespuestaOrdinariaDelTurno() : void
```
> `maxCaracteres` = **2.500** (`H-01`), `maxIntercambios` = **4** (`H-06`). Van como parámetro y no como literal porque `RNF-10` los declara configurables por entorno.
> **No se persiste**, y tampoco en *logs*: `PER-01 §4` avisa de que `logger.info(mensaje_usuario)` viola `PRIV-R2` igual que una tabla.

### `Personaje` `{abstract}` · `Alan` · `Aura`
```
Personaje:  -persona : String   -tono : String
            +obtenerPersona() : Persona
            +identificarInterlocutorElegido() : Personaje
            +sustituirInterlocutorDeLaSesion(personaje : Personaje) : void
Alan:       +describirRolYEstilo() : Persona   +ofrecerseComoActivacion() : Persona
Aura:       +describirRolYEstilo() : Persona   +ofrecerseComoCalma() : Persona
```
> `RN-02.4`: el personaje modula el **tono**, nunca las reglas de seguridad.

### `EventoDeSeguridad`
```
-momento : DateTime    -modo : String
+documentarSinContenidoIndividual() : void
+documentarSinConservarElTexto() : void
+marcarTurnoComoSafetyFallback() : void
+noContabilizarClasificacionDeRiesgo() : void
```
> `noContabilizarClasificacionDeRiesgo()` **afirma una prohibición**. No hay *scoring* de riesgo, y esta operación lo hace verificable en vez de tácito (`PRIV-R4`).

### `RecursoDeAyuda` — sin atributos persistidos (`RN-06`)
```
+obtenerAprovisionadosPorEntorno() : List<ReferenciaDeDerivacion>
```
> Aprovisionado **por entorno** (`SD-12`). Nunca embebido en código, ni siquiera al citar la plantilla.

### `DisponibilidadDelChatbot`
```
-estado : EstadoDisponibilidad
+estaHabilitado() : Boolean
+leerEstadoGlobal() : EstadoDisponibilidad
+consultarEstadoGlobal() : EstadoDisponibilidad
+consultarEstadoGlobalSinObedecerlo() : EstadoDisponibilidad
+contrastarConElEstadoGlobal(estadoElegido : EstadoDisponibilidad) : Boolean
+cambiarEstadoGlobal(estadoNuevo : EstadoDisponibilidad) : void
```
> `consultarEstadoGlobalSinObedecerlo()` es de `DS-07`: la derivación de seguridad consulta el *kill switch* y **no lo obedece**. El nombre es la decisión.

### `ContadorDeUsoDiario` — **sin atributos: `PER-H4` abierto**
```
+dentroDeLimites(porMinuto : Integer, porDia : Integer) : Boolean
+registrarSolicitud() : void
+suprimirLosContadoresDelUsuario() : void
```
> **No implementable tal cual.** Campos y llave sin especificar en ningún artefacto. `porMinuto` = 3, `porDia` = 30 (`H-04`). **Se cierra en `ARQ-01`.**

### `EventoOperativo`
```
-momento : DateTime    -resultado : String    -latencia : Integer
-modelo : String       -versionPrompt : String
+registrarSinContenido(momento : DateTime, resultado : String, latencia : Integer,
                       modelo : String, versionPrompt : String) : void
+conservarSinIdentidad() : void
+contarLlamadasAlChatDeLosUltimos7Dias() : Integer
+calcularTasaTecnicaDeExitoYError() : Decimal
```
> **Uno por llamada al proveedor**, no uno por conversación (`SD-30`, `H-1a`). Las llamadas que no llegan al proveedor —*kill switch*, límite de tasa— **no generan evento**.
> **Nunca** guarda el motivo textual del *fallback* ni la categoría emocional (plan §4.15, `PRIV-R6`).
> `conservarSinIdentidad()` afirma que la cascada de `PER-T1` **no** lo alcanza, y que por eso debe ser irreidentificable (`PER-T2`).

## 4. Capa de control — 2 clases

### `C_GateDeSeguridad` — display `"Gate de seguridad"`
```
+evaluarPeligroExplicito(mensaje : Mensaje) : Boolean
+aplicarGuardasDeSalida(texto : String) : String
-sustituirPorRespuestaSegura() : String
```
> `SEG-R1…R6`. Binario, determinista, configurable, evaluado en **cada** mensaje antes de responder.
> **`DOP-01` le asigna una cuarta operación, `desviarADerivacionDeCU07()`, que `DS-06:87` dirige a P-10.** Ver `H-A`.

### `C_FallbackDeSeguridad` — display `"Fallback de seguridad"`
```
+activar(veredictoDePeligroExplicito : Boolean) : void
-mantenerModoSeguro() : void
-continuarSinDegradacion() : void
```
> `SEG-R2`, `SEG-R3`, `SEG-R5`: **determinista y local**, debe operar con el proveedor y la red caídos. Ninguna operación de esta clase sale a la red, y por eso `RC-01` = 100 % se sostiene por construcción y no por manejo de error.

## 5. Capa de frontera — 18 clases

| Clase | Pantalla | Ops |
|---|---|---:|
| `B_PaginaPresentacion` | P-01 Presentación / landing | 5 |
| `B_FormularioRegistro` | P-02 Registro | 6 |
| `B_PaginaInicioSesion` | P-03 Inicio de sesión de usuario | 6 |
| `B_PaginaInicioSesionAdmin` | P-04 Inicio de sesión de administración | 2 |
| `B_PantallaDisclosure` | P-05 Onboarding · disclosure de IA | 2 |
| `B_PantallaEdad` | P-06 Onboarding · declaración de edad | 2 |
| `B_PantallaConsentimiento` | P-07 Onboarding · consentimiento capa base | 4 |
| `B_PantallaCaracterizacion` | P-08 Onboarding · caracterización | 4 |
| `B_PantallaEleccionPersonaje` | P-09 Onboarding · elegir Alan o Aura | 3 |
| `B_InterfazDeChat` | P-10 Chat con el acompañante | 12 |
| `B_EstadosDeError` | P-11 Chat · error y degradación | 6 |
| `B_PantallaContencion` | P-12 Contención y derivación | 7 |
| `B_PaginaGestionCuenta` | **P-13** Gestión de cuenta — sirve **CU-04, CU-11 y CU-12** | **17** |
| `B_DirectorioDeUsuarios` | P-14 Directorio de usuarios | 6 |
| `B_MetricasDeUso` | P-15 Métricas de uso | 6 |
| `B_ControlDisponibilidad` | P-16 Kill switch | 5 |
| `B_DialogoConfirmacion` | *modal de confirmación* de P-16 | 1 |
| `B_FronteraProveedorLLM` | — (sistema externo, `DR-06`) | 5 |

Las firmas completas están en `MC-01_modelo_clases_diseno.puml`. No se repiten aquí: duplicarlas crearía la segunda fuente que §1 se compromete a no crear.

**Tres avisos para quien implemente:**
- **P-13 acumula 17 operaciones** porque `DIS-00` le asigna tres casos de uso. Candidata a partirse (`H-K`), pero partirla exigiría clases que ningún `DS` dibuja.
- **`B_FronteraProveedorLLM` es la única salida a la red del sistema.** Ninguna otra clase habla con un servicio externo. Es lo que hace auditable `RNF-06`.
- **Las operaciones `-` son auto-llamadas** del diagrama de secuencia. Se listan porque el criterio de entrada del CDR exige reflejar toda operación asignada; al generar cabeceras pueden quedar privadas.

## 6. Capa de auditoría — 1 clase

### `AccionAdministrativa`
```
-autor : String    -fecha : DateTime    -accion : String
+registrarAccion(autor : Administrador, fecha : DateTime) : void
```
> **Fuera de `MD-01` por decisión declarada** (`RPD-01` H-02): auditoría de operación, no concepto del problema.
> **`PER-T2` se realiza como una ausencia:** la firma recibe autor y fecha **y nada más**. Ningún alias, ningún username. La telemetría no puede reconstruir qué hizo una persona concreta.
> `accion` es el **único campo `[I2]`** de todo `PER-01`: no está declarado en ningún artefacto, se derivó de «registra la acción».

## 6.1 Capa de tipos de transferencia — 6 clases

Entran en **SD-39** por el hallazgo `H-04` del `CDR-01`: eran tipos de retorno **con nombre y sin forma**, y una firma que devuelve un tipo que nadie declara deja la cabecera de código emitiendo `???`. Los atributos **no se inventaron**: se leyeron de la `ECU` que origina cada uno.

### `FilaDeDirectorio` — devuelto por `Usuario` y `B_DirectorioDeUsuarios`
```
-alias : String {readOnly}            -idTruncado : String {readOnly}
-fechaDeRegistro : Date {readOnly}    -estado : EstadoDirectorio {derived}
-completoElOnboarding : Boolean {readOnly}
```
> Las **cinco columnas mínimas** de `ECU-08` y ni una más (`RN-03.2`, `PRIV-R10`). Que sean cinco *es* la garantía de minimización: añadir una sexta rompe `RF-15`.

### `AgregadoDeCuentas` — devuelto por `Usuario`
```
-totalDeCuentas : Integer {readOnly}    -onboardingsCompletados : Integer {readOnly}
```
> Las dos cardinalidades de `Usuario` que `ECU-09` pide, **sin desglose por persona** (`RN-03.3`).

### `AgregadoDeUso` — devuelto por `B_MetricasDeUso`
```
-llamadasAlChatEnSieteDias : Integer {readOnly}    -tasaTecnicaDeExitoYError : Decimal {readOnly}
```
> Las dos cifras dependientes de la ventana, derivadas de **`EventoOperativo`** y no de `Conversacion`, que no se persiste (`H-1b` de `DS-00`).

### `AlcanceDeBorrado` — devuelto por `CapsulaDePerfil`
```
-registrosQueDesapareceran : List<String> {readOnly}    -esIrreversible : Boolean {readOnly}
-dejaraSinAccesoAlChat : Boolean {readOnly}
```
> Lo que el paso 1 enumera **antes** de confirmar (`ECU-04 RE-05`, `ECU-11 RE-01`). Es el objeto de la advertencia previa, no del borrado.

### `Persona` — devuelto por `Personaje`, `Alan` y `Aura`
```
-rol : String {readOnly}    -tono : String {readOnly}
```
> Rol y estilo con que un `Personaje` se presenta (contrato conversacional P-1…P-8).

### `ReferenciaDeDerivacion` — devuelto por `RecursoDeAyuda`
```
-nombreDelRecurso : String {readOnly}    -formaDeContacto : String {readOnly}
```
> `SD-12`: se aprovisiona **por entorno** y nunca se embebe en el artefacto. Es lo que realiza `RNF-05`, y la razón de que `RecursoDeAyuda` no tenga atributos propios.

## 7. Tipos

**Neutrales respecto del lenguaje, y aporte de este modelo.** Ningún artefacto previo declara tipos (`PER-01 §1.1`), así que no se copian: se fijan aquí, que es lo que `ESTADO_PIPELINE §Pendientes #2` esperaba.

| Tipo | Uso |
|---|---|
| `String`, `Boolean`, `Integer`, `Decimal`, `Date`, `DateTime`, `void` | Primitivos |
| `List<T>` | Colecciones |
| 11 enumerados | Dominios de valor — `MC-01_matriz_procedencia.md §6` |
| `ContextoInicialConversacionalV1` | La cápsula materializada al LLM (`RN-01.3`) — **sin clase** |
| `Sesion` | Devuelto por `TitularDeCuenta.establecerSesionConElRolDeterminado()` — **sin clase** |
| `Persona`, `FilaDeDirectorio`, `AgregadoDeCuentas`, `AgregadoDeUso`, `AlcanceDeBorrado`, `ReferenciaDeDerivacion` | Tipos de retorno con nombre **que desde SD-39 sí tienen clase** — §6.1 |

**De los ocho tipos con nombre, seis ya tienen clase y dos no, cada uno por su motivo** (`H-04` del `CDR-01`; hasta SD-39 no la tenía ninguno). Los dos que siguen sin ella **no son un olvido**: `ContextoInicialConversacionalV1` no tiene línea de vida en ningún `DS` —declararlo sería inventar una clase sin mensaje que la origine— y va al **delta al modelo de dominio** (`MC-00 §9`) junto con `Autorreporte`; `Sesion` es el **mecanismo de sesión**, que `E-1` y `ADR-002 §1` difieren a `ARQ-01`, así que declararla aquí revertiría una exclusión que el propio CDR validó.

> **Consecuencia para quien genere código:** las cabeceras **no compilan tal cual**, y eso es la foto honesta de un diseño con `E-1` abierta, no un descuido. Son los únicos dos tipos sin resolver.

## 8. Lo que NO se puede implementar todavía

Honestidad antes que completitud: esto **no** está listo para escribir código de extremo a extremo.

| Hueco | Qué bloquea | Lo cierra |
|---|---|---|
| **`ContadorDeUsoDiario` sin campos** (`PER-H4`) | La clase entera | `ARQ-01` |
| **Sin identificadores ni llaves** en ninguna entidad | Toda persistencia | `ARQ-01`, tras el CDR |
| **Sin referencias de propiedad (FK)** | La cascada de `PER-T1` | `ARQ-01` |
| **«ID truncado» sin definir** (`RA-05` de `ECU-08`) | `reunirAliasIdTruncadoFechaYOnboarding()` | `/use-case-specifier` |
| **Formato de `username`/`alias`/`contrasena`** (`RA-02` de `ECU-02`) | `validarFormatoDeLosCampos()` | Construcción |
| **`Sesion` sin mecanismo** | Todo lo de autenticación | `ARQ-01` |
| **CSRF sin construir** | Toda petición con efecto | `ARQ-01` |
| ~~`PER-H5`~~ | ✅ **Cerrado** en `ADR-003` (SD-33): sin respaldo del almacén operativo no hay copia que escape a la cascada | — |
| ~~`PER-H2`~~ | ✅ **Cerrado** en `ADR-004-D1` (SD-35): la supresión es **física e inmediata**, sin marca de baja. `ARQ-01` hereda la restricción, no la pregunta: **nada de `deletedAt` ni borrado lógico** en el esquema | — |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.6 | 2026-08-05 | J. Sánchez | **SD-41 — `VI-02`, y una tercera desviación que el acta no había visto.** Este artefacto se declara **proyección tabular de `MC-01`, no fuente propia**, así que toda desviación es defecto por definición. Había tres: `Usuario` proyectaba `deshacerLoSuprimido()` —retirada por `H-02`— cuando `MC-01` declara `conservarLoYaSuprimido()`; `CapsulaDePerfil` proyectaba `deshacerElBorradoIncompleto()`, retirada por `H-15`; y **la tercera no estaba en `VI-02`**: `Consentimiento` proyectaba `revocarCapaBase()` **sin parámetro**, cuando `H-11` le añadió `fecha : DateTime` y `SD-39` lo aplicó en `MC-01` sin propagarlo aquí. **Encontrada comparando clase por clase**, no leyendo. Las tres corregidas; `H-25`/`H-26` no se mueven, porque `MC-01` no se toca. |
| v1.5 | 2026-08-05 | J. Sánchez | **SD-40 — la tabla de capas contradecía a la ficha del propio archivo.** §2 seguía listando **cinco** capas y sumando **37**, mientras la ficha y el DoD ya decían **43** desde `v1.4`. `SD-39` añadió §6.1 con los seis tipos de transferencia pero **no tocó la tabla que los cuenta**, así que el archivo afirmaba dos totales distintos a treinta líneas de distancia. Entra la sexta fila —**Tipos de transferencia · 6**, con `Sesion` declarada como ausencia deliberada— y el total pasa a **43**. **No se toca `:78` ni `:128`**, las dos operaciones de reversión que `VI-02` marca: ésas son rework de diseño y van a su skill dueña, no a una pasada de propagación. |
| v1.4 | 2026-08-05 | J. Sánchez | **SD-39 — entra §6.1, la capa de tipos de transferencia.** `H-04` del `CDR-01` dio forma a **seis** tipos que hasta entonces eran retorno **con nombre y sin clase**, y este archivo —que es la proyección de `MC-01` y el insumo de la construcción— seguía describiéndolos en §7 como *«los siete tipos con nombre no tienen clase que los declare»*, afirmación **ya falsa para seis de ellos**. Se añade una sección con los seis y sus atributos, **leídos de la `ECU` que origina cada uno**, no inventados; §7 se reescribe para decir cuáles tienen clase y cuáles no; el conteo del DoD pasa de **37 a 43**. Los dos que siguen sin clase se declaran con su motivo: `ContextoInicialConversacionalV1` no tiene línea de vida en ningún `DS` y `Sesion` es el mecanismo de sesión, diferido a `ARQ-01` por `E-1`. **Consecuencia dicha, no disimulada:** con esos dos sin resolver, las cabeceras de la regla #2 no compilan tal cual. |
| v1.3 | 2026-08-04 | J. Sánchez | **SD-39 — retrabajo del `CDR-01`, hallazgo `H-20`.** La fila de P-04 nombraba la clase con el alias **minoritario**, heredado de `MC-01`, que a su vez lo heredaba de `DR-10`. Pasa al mayoritario, el que usan `DR-03`, `DS-03` y `DS-10`. **Es el único de los tres alias divergentes que llegaba hasta aquí, y por eso importaba más que los otros dos:** este archivo es el insumo con el que la **regla #2 del CDR** genera las cabeceras de código, así que la clase habría nacido en el código con el nombre que solo usaba un diagrama. La etiqueta «P-04 Inicio de sesión de administración» no cambia. **Ninguna clase, atributo, operación ni firma cambia**, y ninguna cifra se mueve. |
| v1.2 | 2026-08-04 | J. Sánchez | **SD-35.** `ADR-004-D1` cierra `PER-H2`: la supresión de cuenta es **física e inmediata**, sin ventana de gracia ni marca de baja. §8 retira la fila de `PER-H2` y `RF-24` pasa a cumplirse según el diseño, con sus dos excepciones cerradas. **Ninguna clase, atributo, operación ni firma cambia.** *(Fila añadida en v1.3: la versión constaba en la ficha desde SD-35 pero nunca se escribió aquí — mismo hueco de propagación que tenía `MC-00`, cerrado en la misma pasada.)* |
| v1.1 | 2026-08-04 | J. Sánchez | **SD-33.** `ADR-003` cierra `PER-H5`: la nota de `suprimirEnCascada()` deja de decir «no alcanza el respaldo en S3» y pasa a decir que **alcanza todo lo que existe**. §8 sustituye la fila de `PER-H5` por la de `PER-H2`, que es la que ahora impide cumplir `RF-24` de forma inmediata. **Ninguna clase, atributo, operación ni firma cambia.** |
| v1.0 | 2026-08-04 | J. Sánchez | Creación. Cierra el pendiente #2 de `ESTADO_PIPELINE`. 37 clases en 5 capas de diseño, 35 atributos y 200 operaciones con firma completa, proyectados de `MC-01` como fuente única. Ocho huecos declarados que impiden implementar de extremo a extremo. |
