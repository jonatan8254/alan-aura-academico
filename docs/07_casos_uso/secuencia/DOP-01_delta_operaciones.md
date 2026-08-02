# DOP-01 — Delta de operaciones

**ID:** DOP-01 · **Familia:** DS (secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto — cubre los **14** diagramas.
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
| `C_RegistrarEventoOperativo` | `registrarSinContenido(latencia, modelo, version, estado)` | `EventoOperativo` | problema | Los cuatro campos son suyos (`PER-01`, plan §4.15) |
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
| `C_DesviarADerivacion` | `desviarADerivacionDeCU07()` | `C_GateDeSeguridad` | solución | `FE-08`: **hand-off, no reimplementación.** Quien materializa la contención es `DS-07` |
| `C_DenegarPorCapaBaseRevocada` | `redirigirParaOtorgarCapaBase()` | `B_OnboardingCapaBase` | solución | `FE-09`, 403 y vuelta a CU-05 |

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
| `C_GateDeSeguridad` | control | `SEG-R1…R6` la definen como componente propio: binaria, determinista, configurable, evaluada en **cada** mensaje antes de responder | Que absorba comportamiento ajeno. Hoy recibe 4 operaciones, todas de política de seguridad (entrada y salida). Ninguna de dominio |
| `C_FallbackDeSeguridad` | control | `SEG-R2`, `SEG-R3`, `SEG-R5`: ruta determinista y local que debe operar con el proveedor y la red caídos | El control centralizado. Se midió: pasó del 69 % al rango admisible tras mover la presentación a `B_PantallaContencion` |

**Dos clases controladoras sobre 37 controladores = 5 %.** Muy por debajo del 20 % que la fuente
considera el techo razonable, y ninguna es un `XController` por entidad — el anti-patrón que la
propia fuente advierte que los *frameworks* inducen.

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
| Operaciones distintas | **192** |
| Clases del problema con operaciones | **16 / 16** |
| Clases nuevas del espacio de la solución | **3** — `C_GateDeSeguridad`, `C_FallbackDeSeguridad`, `AccionAdministrativa` |

**3 clases nuevas sobre 150 controladores = 2 %.** Muy por debajo del 20 % que la fuente considera
el techo razonable para clases controladoras, y ninguna es un `XController` por entidad.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v0.1 | 2026-08-01 | J. Sánchez | Creación con el piloto: 37 controladores de `DR-06`/`DR-07` repartidos en 50 operaciones sobre 13 clases del problema y 2 nuevas del espacio de la solución. |
| v1.0 | 2026-08-01 | J. Sánchez | Cierre con los 14 diagramas: **150 controladores → 192 operaciones** sobre las **16 clases** de `MD-01` y **3** del espacio de la solución. Añadidas §6 (asignaciones que exigieron juicio), §7 (cobertura del dominio) y §8 (cifras). |
