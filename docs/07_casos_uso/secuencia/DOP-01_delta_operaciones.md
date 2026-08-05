# DOP-01 — Delta de operaciones

**ID:** DOP-01 · **Familia:** DS (secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/` · **Fecha:** 2026-08-01 · **Versión:** v1.4 (SD-40: §8 decía **192** operaciones distintas cuando `H-23` va por **193** desde `SD-39` — y este es el artefacto **dueño** del hecho, contradiciendo su propia §8 bis; se precisa además que sus **21** clases de solución son las del delta de secuencia y no las 27 de `MC-01`). v1.3 (SD-39: retrabajo del `CDR-01` — `H-20`). v1.2 (SD-32: desviarADerivacionDeCU07 cambia de receptora y §8 corrige el recuento del espacio de la solución a 21). v1.1 · **Estado:** Propuesto — cubre los **14** diagramas.
**Propósito:** registrar, operación por operación, **qué clase la recibe y por qué**. Es la entrada del diagrama de clases de diseño y la única parte del paso 4 que queda auditable.
**Insumos:** `DR-01…DR-14` v2.0 (los **150** controladores), `DS-01…DS-14` v1.0, `MD-01 v1.4`, `SEG-01 v1.2`, `PER-01 v1.2`, `MV-01 §7`.
**Generado con:** skill `uml-sequence-diagram` (modo Generar). **Validador:** `validate_sequence_puml.py` con las cuatro banderas → **0 errores** en los 14.
**Consumidores:** `uml-design-class-model` (diagrama de clases de diseño), `COD-01`, el CDR.
**Fundamentos:** Rosenberg & Stephens, *Use Case Driven Object Modeling with UML*, cap. 8; Fowler, *UML Distilled* 3ª ed., cap. 4; ISO/IEC 12207:2017 §6.4.5. Se citan, no se reproducen.

---

## 1. Cómo leer esta tabla

La regla que gobierna cada fila es una sola: **el comportamiento va donde está el conocimiento.**
La fuente cuantifica el reparto esperable — *«80 % or so of the controllers […] can be
implemented as one or more operations on the entity and boundary classes»*— y advierte que **una
clase controladora es la excepción, que hay que justificar**.

**No hay biyección.** Un controlador rinde **una o varias** operaciones, y algunos cambian de
nombre al convertirse en operación de una clase concreta. Una correspondencia perfecta uno a uno
sería la señal del anti-patrón «se quedó en robustez».

**Espacio:** `problema` = la clase está en `MD-01 v1.4`. `solución` = clase nueva del diseño
detallado. Lo segundo **no es un defecto de trazabilidad**: es el resultado esperado, porque en
diseño detallado los dos espacios convergen.

---

## 2. `DS-06` — Conversar con el acompañante (25 controladores → 32 operaciones)

| Controlador de `DR-06` | Operación | Clase receptora | Espacio | Por qué ahí |
|---|---|---|---|---|
| `C_VerificarSesionYRol` | `verificarSesionYRol()` — **una sola operación, invocada dos veces** (apertura y cada turno) | `B_InterfazDeChat` | solución | **Salto declarado.** `DR-06` no le da ningún arco a entidad: en el análisis este controlador no lee nada del dominio, porque la sesión **no es un concepto del problema**. Con D-1 la sesión es infraestructura y su mecanismo va a `ARQ-01`. El borde que recibe la petición es el único participante que legítimamente conoce su contexto. Registrado en `E-1` de `DS-00`. **Prefactorizado:** el primer borrador tenía dos operaciones (`verificarSesionYRol` y `revalidarSesionYRolDelTurno`) para el mismo comportamiento; `DR-06` da **un** controlador con dos invocaciones, así que se unificó |
| `C_VerificarConsentimiento` | `estaVigenteLaCapaBase()` | `Consentimiento` | problema | El conocimiento de qué capas están otorgadas es suyo y de nadie más (`RN-07`, dos capas) |
| `C_VerificarDisponibilidad` | `estaHabilitado()` | `DisponibilidadDelChatbot` | problema | Es literalmente el estado que esa clase encarna (`RN-02.7`) |
| `C_IniciarConversacion` | `abrir()` · `fijarPersonajeDeLaSesion()` | `Conversacion` | problema | **Un controlador, cuatro operaciones.** La conversación gestiona su propio ciclo de vida y su asociación con el personaje |
| ↳ | `obtenerPersona()` | `Personaje` | problema | La persona (tono, límites) es conocimiento del personaje |
| ↳ | `abrirDialogoConElPersonaje()` | `B_InterfazDeChat` | solución | La presentación del diálogo es del borde |
| `C_ValidarTurno` | `validarLongitudYEstructura(2.500)` | `Mensaje` | problema | **La entidad se valida a sí misma.** Longitud y estructura son propiedades del mensaje; ponerlo en un controlador produciría el modelo anémico (`H-01` = 2.500) |
| `C_VerificarLimitesDeTasa` | `dentroDeLimites(3/min, 30/dia)` · `registrarSolicitud()` | `ContadorDeUsoDiario` | problema | El contador **es** el conocimiento del consumo; decidir y registrar van juntos (`H-04`) |
| `C_EvaluarGate` | `evaluarPeligroExplicito(mensaje)` | **`C_GateDeSeguridad`** | **solución** | **La clase controladora justificada.** `SEG-01` lo define como componente binario con seis requisitos propios (`SEG-R1…R6`), obligatorio antes de toda llamada al LLM (`RN-02.1`), determinista y local. Ponerlo en `Mensaje` haría que el mensaje fuese responsable de la política de seguridad y dispersaría el gate por el modelo, justo lo contrario de lo que `SEG-R6` (configurable) y `SEG-R1` (evaluado en cada mensaje) exigen |
| ↳ | `obtenerTextoDelTurno()` | `Mensaje` | problema | El gate pide el texto, no lo posee |
| ↳ | `documentarSinContenidoIndividual()` | `EventoDeSeguridad` | problema | El evento sabe documentarse sin conservar contenido (`PRIV-R7`) |
| `C_ConstruirContextoMinimo` | `materializarContextoV1()` | `CapsulaDePerfil` | problema | **`RN-01.3` lo dice literalmente:** «la `CapsulaDePerfil` **se materializa** al LLM como `ContextoInicialConversacionalV1`». La cápsula sabe materializarse; ningún constructor externo hace falta |
| ↳ | `estaOtorgadaLaPersonalizacion()` | `Consentimiento` | problema | Decide si los cuatro autorreportes viajan (`PRE-03.1`) |
| ↳ | `obtenerPersona()` | `Personaje` | problema | Reutiliza la misma operación del paso 1 |
| ↳ | `ultimosIntercambiosDeLaSesion(4)` | `Mensaje` | problema | El historial acotado es conocimiento del mensaje (`H-06` = ≤ 4) |
| `C_SolicitarGeneracion` | `generar(contexto minimo)` | `B_FronteraProveedorLLM` | solución | La frontera con el sistema externo es quien habla con él |
| `C_ControlarTiempoDeEspera` | `vigilarPlazoDeEspera(20 s)` | `B_FronteraProveedorLLM` | solución | El plazo pertenece a la llamada, no al dominio (`H-05`) |
| `C_AplicarGuardas` | `extraerSoloContenidoFinal()` · `limitarA350Tokens()` | `B_FronteraProveedorLLM` | solución | **Contención en la frontera:** la salida cruda es del borde. «Solo contenido final» realiza la prohibición de exponer razonamiento interno (plan §4.10); `H-03` = 350 |
| ↳ | `aplicarGuardasDeSalida(texto)` | **`C_GateDeSeguridad`** | solución | `SEG-R4` pone las guardas en la misma familia que el gate. Reunirlas mantiene **una sola sede** para la política de seguridad |
| `C_MostrarRespuesta` | `mostrarRespuestaDelPersonaje()` | `B_InterfazDeChat` | solución | Presentación pura |
| `C_CerrarYDescartar` | `cerrar()` | `Conversacion` | problema | Cambio de estado propio |
| ↳ | `descartarContenido()` | `Mensaje` | problema | **Realiza `RF-13`/`PRIV-R2`:** el mensaje sabe descartarse |
| `C_RegistrarEventoOperativo` | `registrarSinContenido(momento, resultado, latencia, modelo, version)` | `EventoOperativo` | problema | Los cinco campos son suyos, y son **valores de una llamada**: por eso la operación se invoca **dentro del `loop`**, una vez por petición al proveedor, y no al cerrar (`v1.1`, hallazgo `H-1a`). Los otros tres del plan §4.15 —*request ID*, código de estado, entorno— son de persistencia y viven en `PER-01 §3.6`, la misma frontera que `MD-01 §6` traza |
| `C_InformarLimiteDeSesion` | `alcanzoElLimiteDeSesion()` | `Conversacion` | problema | La conversación cuenta sus propios turnos (`H-02` = 20) |
| ↳ | `informarLimiteDeSesionSinErrorCrudo()` | `B_InterfazDeChat` | solución | `FA-01` termina de forma controlada, no con error |
| `C_SustituirSalidaInsegura` | `sustituirPorRespuestaSegura()` | `C_GateDeSeguridad` | solución | La sustitución es decisión de seguridad, no de presentación (`FA-02`, `CA-10`) |
| `C_SolicitarReingreso` | `solicitarReingresoPorCU03()` | `B_EstadosDeError` | solución | `FE-01`, 401 |
| `C_DenegarPorRol` | `denegarAcceso()` | `B_EstadosDeError` | solución | `FE-02`, 403 |
| `C_InformarEntradaInvalida` | `informarEntradaInvalida()` | `B_EstadosDeError` | solución | `FE-03`, 400 |
| `C_InformarIndisponibilidad` | `informarIndisponibilidadTemporal()` | `B_EstadosDeError` | solución | `FE-04`, 409 |
| `C_InformarLimiteDeTasa` | `informarLimiteYTiempoDeEspera()` | `B_EstadosDeError` | solución | `FE-05`, 429, respeta `Retry-After` |
| `C_ReintentarUnaVez` | `reintentarUnaVez()` | `B_FronteraProveedorLLM` | solución | `FE-06`: el reintento vive donde vive la llamada |
| `C_InformarFalloDelProveedor` | `informarFalloDelProveedor()` | `B_EstadosDeError` | solución | `FE-06`/`FE-07`, 502/504 |
| `C_DesviarADerivacion` | `desviarADerivacionDeCU07()` | `B_InterfazDeChat` | solución | `FE-08`: **hand-off, no reimplementación.** Quien materializa la contención es `DS-07`. **v1.2, hallazgo `H-A` de `MC-00`:** la receptora era `C_GateDeSeguridad` en v1.1, pero `DS-06:87` dibuja `C_GateDeSeguridad -> B_InterfazDeChat`, así que la operación aterriza en el borde. Manda la flecha, que es la fuente de verdad (`DS-00 §3`) |
| `C_DenegarPorCapaBaseRevocada` | `redirigirParaOtorgarCapaBase()` | `B_PantallaConsentimiento` | solución | `FE-09`, 403 y vuelta a CU-05. **v1.3 (`H-20`):** la receptora se nombraba con el alias de `DR-06`, no con el de `DS-06:46`, que es donde está dibujada la flecha |

## 3. `DS-07` — Derivar ante peligro (12 controladores → 18 operaciones)

| Controlador de `DR-07` | Operación | Clase receptora | Espacio | Por qué ahí |
|---|---|---|---|---|
| `C_DetectarPeligro` | `activar(veredicto de peligro explicito)` | **`C_FallbackDeSeguridad`** | **solución** | **Segunda clase controladora justificada.** `SEG-01` define el *fallback* como componente **determinista y local** con requisitos propios (`SEG-R2`, `SEG-R3`, `SEG-R5`) que debe operar con el LLM y la red caídos. Es un coordinador con nombre, del tipo que la fuente admite como el 20 % legítimo. `DR-00 §5 E-1` ya había declarado que esta cadena **es** una ruta de seguridad y que distribuirla inventaría estructura que el texto no tiene |
| ↳ | `suspenderRespuestaOrdinariaDelTurno()` | `Mensaje` | problema | El turno sabe que queda suspendido (`I-1`) |
| ↳ | `documentarSinConservarElTexto()` | `EventoDeSeguridad` | problema | Documenta sin contenido (`I-3`, `PRIV-R7`) |
| `C_MantenerModoSeguro` | `mantenerModoSeguro()` | `C_FallbackDeSeguridad` | solución | Paso 2 es una **abstención doble y observable** (`ECU-07 §11.1`): ni interpretación clínica ni preguntas exploratorias. No se parte en dos |
| ↳ | `continuarSinDegradacion()` | `C_FallbackDeSeguridad` | solución | `FE-01`. La ruta no consulta al proveedor en ningún paso, así que `RC-01` = 100 % se sostiene **por construcción** |
| `C_MostrarContencion` | `presentarContencionYDerivacion()` · `resolverTextoFijoDeContencion()` · `mostrarContencionQueDeclaraSerUnaIA()` | `B_PantallaContencion` | solución | **La pantalla busca lo que presenta**, en vez de recibirlo masticado. Este movimiento es el que bajó el control centralizado del 69 % a rango aceptable |
| `C_DerivarARecursos` | `obtenerAprovisionadosPorEntorno()` | `RecursoDeAyuda` | problema | `RN-06`: por entorno, nunca embebido. **Lectura local** (`SEG-01 v1.2`) |
| ↳ | `mostrarRecursosDeDerivacion()` | `B_PantallaContencion` | solución | Presentación |
| `C_MarcarFallback` | `marcarTurnoComoSafetyFallback()` | `EventoDeSeguridad` | problema | La marca `mode=safety_fallback` es del evento |
| `C_BloquearChatOrdinario` | `suspenderChatOrdinario()` | `Conversacion` | problema | Cambio de estado propio |
| ↳ | `impedirSeguirConversandoEnLaSesion()` | `B_InterfazDeChat` | solución | Efecto visible |
| `C_PermitirSesionNueva` | `abrirNuevaSesionDeAcompanamiento()` | `Conversacion` | problema | La conversación se abre a sí misma |
| ↳ | `reabrirElAcompanamiento()` | `B_InterfazDeChat` | solución | Efecto visible |
| `C_DescartarContenido` | `descartarContenidoDelTurno()` | `Mensaje` | problema | `I-3` |
| ↳ | `noContabilizarClasificacionDeRiesgo()` | `EventoDeSeguridad` | problema | **Operación que afirma una prohibición.** Existe para que la ausencia de *scoring* sea visible y verificable, no tácita |
| `C_OrientacionSinRecursos` | `orientarAEmergenciasSinNumerosEmbebidos()` | `B_PantallaContencion` | solución | `FA-01`, sostiene `I-2b` |
| `C_OrientacionMinimaInvariable` | `presentarOrientacionMinimaInvariable()` | `B_PantallaContencion` | solución | `FE-02`. **La única excepción declarada a «todo por entorno»**: es conducta de último recurso, sin recurso, línea ni número, y sin ella `I-2b` no se sostiene |
| `C_CompletarPeseAKillSwitch` | `consultarEstadoGlobalSinObedecerlo()` | `DisponibilidadDelChatbot` | problema | `FE-03`. El nombre dice la decisión: **consulta y no obedece**, lo contrario de CU-06 |

---

## 4. Clases nuevas del espacio de la solución

| Clase | Estereotipo | Por qué es legítima | Riesgo vigilado |
|---|---|---|---|
| `C_GateDeSeguridad` | control | `SEG-R1…R6` la definen como componente propio: binaria, determinista, configurable, evaluada en **cada** mensaje antes de responder | Que absorba comportamiento ajeno. Hoy recibe **3** operaciones, todas de política de seguridad (entrada y salida). Ninguna de dominio. *(v1.2: eran 4; `desviarADerivacionDeCU07()` sale por `H-A`)* |
| `C_FallbackDeSeguridad` | control | `SEG-R2`, `SEG-R3`, `SEG-R5`: ruta determinista y local que debe operar con el proveedor y la red caídos | El control centralizado. Se midió: pasó del 69 % al rango admisible tras mover la presentación a `B_PantallaContencion` |

**Dos clases controladoras sobre 37 controladores = 5 %.** Muy por debajo del 20 % que la fuente
considera el techo razonable, y ninguna es un `XController` por entidad — el anti-patrón que la
propia fuente advierte que los *frameworks* inducen.

> **Aviso de alcance de esta sección (v1.2, hallazgo `H-B` de `MC-00`).** Esta tabla cuenta **clases
> controladoras**, que es la métrica del 20 % de la fuente. **No** es el inventario del espacio de la
> solución. Las clases de **frontera** —las 16 pantallas de `DIS-00`, el diálogo de confirmación y la
> frontera con el proveedor— también son espacio de la solución: son pantallas y adaptadores, no
> conceptos del problema, y ninguna está en `MD-01`. El inventario completo, **21 clases**, vive en
> `MC-01_matriz_procedencia.md §4`. Leer esta tabla como «solo hay 3 clases nuevas» fue el error que
> `MC-00 §6` reporta.

## 5. Comprobación de modelo anémico

Ninguna entidad recibe solo `obtener`/`asignar`. Todas toman decisiones o cambian su propio estado:

`Consentimiento` decide sobre sus dos capas · `DisponibilidadDelChatbot` decide · `Conversacion`
abre, cierra, suspende y cuenta sus turnos · `Mensaje` se valida, se descarta y entrega su
historial acotado · `ContadorDeUsoDiario` decide y registra · `CapsulaDePerfil` **se materializa
a sí misma** · `EventoDeSeguridad` documenta, marca y afirma una prohibición · `EventoOperativo`
registra · `Personaje` entrega su persona · `RecursoDeAyuda` resuelve su aprovisionamiento.

## 6. Los 12 diagramas restantes — asignaciones no obvias

Las asignaciones mecánicas (un controlador de presentación → una operación sobre su borde) no se
enumeran una por una: son 113 y su justificación es siempre la misma. Se registran aquí **las que
exigieron juicio**, que son las que el CDR tendrá que revisar.

| Operación | Clase receptora | Espacio | Por qué ahí |
|---|---|---|---|
| `promoverATitularDeCuenta(...)` | `Visitante` | problema | **`MD-01` modela `Visitante -- TitularDeCuenta : precede a`** y `DR-02` dice que el Visitante *pasa a* titular al crear la cuenta. El primer borrador tenía al formulario creando el `Usuario` directamente: eso ignoraba una transición de dominio que el modelo sí declara |
| `crearCuenta(rol asignado en el servidor)` | `Usuario` | problema | El hasheo (`PRIV-R12`) y la asignación de rol (`RNF-08`) son **restricciones de esta operación**, no pasos aparte: sacarlos a mensajes propios habría metido mecanismo en un diagrama que aún no decide infraestructura |
| `determinarRolEnElServidor()` | `Usuario` · `Administrador` | problema | `RNF-08` exige que el rol se determine **en servidor**. La operación vive en el rol concreto, y el formulario no la invoca: la invoca `TitularDeCuenta`, que es quien sabe qué cuenta es |
| `establecerSesionConElRolDeterminado()` · `invalidarSesionEnElServidor()` | `TitularDeCuenta` | problema | En el **supertipo**, no duplicadas por rol: `FA-02` de `CU-03` establece que el cierre del paso 5 aplica igual al Administrador |
| `suprimirEnCascada()` | `Usuario` | problema | **`PER-T1`.** Quien conoce sus dependientes es el titular del dato. Repartir la cascada desde el borde habría acoplado la interfaz al esquema |
| `escribirCharacter()` | `CapsulaDePerfil`, invocada por `Personaje` | problema | El `Personaje` identificado **se instala a sí mismo** en la cápsula. La primera versión tenía a la pantalla haciendo de intermediaria sin aportar nada |
| `cambiarPersonajeSinCerrarse()` | `Conversacion` | problema | **`MD-01` modela `Conversacion -- Personaje : acompañada por`**: la asociación es de la conversación, así que el cambio también. Bajó el control centralizado de `DS-13` del 86 % al 71 % *y* mejoró el diseño |
| `consultarCharacterSinReescribirlo()` | `CapsulaDePerfil` | problema | El nombre **es** el invariante: `RN-01.6` exige que `character` no cambie al cambiar de acompañante en sesión |
| `dejarSinDefaultsLosOmitidos()` | `CapsulaDePerfil` | problema | **Operación que afirma una prohibición**, como `noContabilizarClasificacionDeRiesgo` en `DS-07`. Existe para que `FA-02` sea verificable, no tácita |
| `borrarCompleta()` · `deshacerElBorradoIncompleto()` | `CapsulaDePerfil` | problema | `RE-04` de `ECU-11`: **sin estados intermedios**. O desaparece entera o queda como estaba, con `character` |
| `revocarCapaDePersonalizacion(fecha)` · `conservarLaCapaBaseOtorgada()` | `Consentimiento` | problema | Las dos capas son estado suyo. La segunda operación existe para hacer visible que **la base no se toca**: es lo que hace que revocar **no sea punitivo** |
| `derivarEstadoDeConsentimientoVigente()` | `Consentimiento` | problema | **`PER-T4`, `SD-26`:** el `estado` del directorio es **derivado**, no almacenado. La operación lo dice en su nombre |
| `registrarAccion(autor, fecha)` | **`AccionAdministrativa`** | **solución** | **Fuera de `MD-01` por decisión declarada** (`DR-00 §6`, `RPD-01` H-02): auditoría de operación, no concepto del problema. Se declara `participant`, **no `entity`**, para no producir un falso hallazgo de trazabilidad. Su firma —autor y fecha, nada más— realiza `PER-T2` |
| `aplicarNuevoEstadoDeInmediato()` | `Conversacion` | problema | El efecto del *kill switch* lo sufre la conversación, así que la operación es suya |

## 7. Cobertura del modelo de dominio

**Las 16 clases de `MD-01 v1.4` reciben al menos una operación.** Ninguna queda huérfana en el
diseño detallado, y ninguna recibe solo `obtener`/`asignar`:

`Visitante` · `TitularDeCuenta` · `Usuario` · `Administrador` · `Consentimiento` ·
`CapsulaDePerfil` · `Conversacion` · `Mensaje` · `Personaje` · `Alan` · `Aura` ·
`EventoDeSeguridad` · `RecursoDeAyuda` · `DisponibilidadDelChatbot` · `ContadorDeUsoDiario` ·
`EventoOperativo`.

`Alan` y `Aura` aparecen **solo en `DS-13` y `DS-14`**, y es correcto: son los dos únicos puntos del
sistema donde los personajes se distinguen como objetos. En el resto gobierna el supertipo
`Personaje`, que es lo que se fija en la cápsula.

## 8. Cifras finales

| Magnitud | Valor |
|---|---|
| Diagramas | **14** |
| Controladores cubiertos | **150 / 150** |
| Operaciones distintas | **193** |
| Clases del problema con operaciones | **16 / 16** |
| Clases nuevas del espacio de la solución **en el delta de secuencia** | **21** — 2 de control, 1 de auditoría y 18 de frontera *(v1.2, `H-B`)*. **No son las 27 de `H-28`:** ese hecho cuenta `MC-01`, que sumó **6 tipos de transferencia** en `H-04` del `CDR-01`. Ningún diagrama de secuencia los contiene, así que aquí **21 es el valor correcto** y no una cifra sin propagar |
| — de ellas, **clases controladoras** | **2** — `C_GateDeSeguridad`, `C_FallbackDeSeguridad` |
| — de ellas, auditoría de operación | **1** — `AccionAdministrativa` |
| — de ellas, **fronteras** | **18** — 16 pantallas de `DIS-00` + el diálogo de confirmación de P-16 + la frontera con el proveedor |

**Dos clases controladoras sobre 150 controladores = 1,3 %.** Muy por debajo del 20 % que la fuente
considera el techo razonable para clases controladoras, y ninguna es un `XController` por entidad.

> **Corregido en v1.2 (`H-B` de `MC-00`).** Hasta v1.1 esta fila decía «**3** clases nuevas» y
> nombraba las dos de control más la de auditoría. Era un recuento de **clases controladoras**
> presentado como recuento del espacio de la solución. Las 18 fronteras que los catorce `.puml`
> declaran reciben **88 de las 193 operaciones** y ninguna está en `MD-01`: son espacio de la
> solución con todas las letras. `TRZ-DS-01 §3` arrastraba el mismo error, con una lista distinta.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.4 | 2026-08-05 | J. Sánchez | **SD-40 — la cifra que este artefacto era dueño de vigilar y llevaba mal.** §8 declaraba **192** operaciones distintas cuando `H-23` vale **193** desde `SD-39`, y lo hacía **contradiciendo su propia §8 bis**, que ya decía 193 trece líneas más abajo. Que el defecto viviera en el **dueño del hecho** es lo que lo hacía grave: cualquier consumidor que lo citara heredaba el error. Se corrige a **193**. En la misma pasada se precisa la fila de clases de solución: sus **21** son las del **delta de secuencia** (2 control + 1 auditoría + 18 frontera) y **no** las 27 de `H-28`, que cuentan `MC-01` con los seis tipos de transferencia que `H-04` añadió — ningún diagrama de secuencia contiene uno, así que 21 es aquí el valor correcto y no una cifra sin propagar. |
| v1.3 | 2026-08-04 | J. Sánchez | **SD-39 — retrabajo del `CDR-01`, hallazgo `H-20`.** §2 nombraba la receptora de `redirigirParaOtorgarCapaBase()` con el alias que usa `DR-06`, no con el que dibuja `DS-06:46` — y **manda la flecha del `DS`**, como ya estableció `v1.2` para `desviarADerivacionDeCU07()`. Al unificarse el alias de P-07 en `DR-06`, las dos familias vuelven a decir lo mismo. **Las 192 operaciones no cambian**: ninguna se añade, se quita ni cambia de dueño; cambia el **nombre con que se escribe** la receptora. *(En esta versión se reordena también el historial: la fila `v0.1` estaba en cabeza, por encima de `v1.2`.)* |
| v1.2 | 2026-08-04 | J. Sánchez | **SD-32, hallazgos `H-A` y `H-B` de `MC-00`.** `desviarADerivacionDeCU07()` cambia de clase receptora —de `C_GateDeSeguridad` a `B_InterfazDeChat`— porque `DS-06:87` dibuja la flecha hacia el borde y **manda la flecha**; `C_GateDeSeguridad` pasa de 4 a **3** operaciones. Y §8 deja de contar «3 clases nuevas del espacio de la solución»: eran las **controladoras**, no el espacio entero. El inventario real es **21** (2 de control + 1 de auditoría + 18 de frontera). **Las 192 operaciones no cambian**: ninguna se añade ni se quita, una cambia de dueño. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30, hallazgo `H-1a`.** `registrarSinContenido()` cambia de firma —`(momento, resultado, latencia, modelo, version)`, unificada contra el plan §4.15— y de sitio: se invoca **dentro del `loop`**, una vez por llamada al proveedor, no al cerrar la conversación. Misma clase receptora, mismo espacio: **192 operaciones sin cambio**. |
| v1.0 | 2026-08-01 | J. Sánchez | Cierre con los 14 diagramas: **150 controladores → 192 operaciones** sobre las **16 clases** de `MD-01` y **3** del espacio de la solución. Añadidas §6 (asignaciones que exigieron juicio), §7 (cobertura del dominio) y §8 (cifras). |
| v0.1 | 2026-08-01 | J. Sánchez | Creación con el piloto: 37 controladores de `DR-06`/`DR-07` repartidos en 50 operaciones sobre 13 clases del problema y 2 nuevas del espacio de la solución. |
