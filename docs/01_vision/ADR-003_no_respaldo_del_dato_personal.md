# ADR-003 — El MVP **no respalda** el almacén de datos personales

**ID:** ADR-003 · **Hogar:** `docs/01_vision/` · **Fecha:** 2026-08-04 · **Estado:** aceptada (con verificaciones pendientes).
**Insumos:** `PER-H5` (hallazgo de canon abierto desde SD-29), `ADR-002-D5`/`D6`, `PER-01 §1.0`/§5/§8, `PRIV-01` (`PRIV-R11`), `REQ-01` (`RF-24`, `RN-04.4`), `PLAN-01` (riesgo `R-11`), `00_PLAN_CODEX_ORIGINAL` (DoD de release y tabla de riesgos), decisión del líder del proyecto (SD-33).
**Consumidores:** `PER-01` (§1.0, `PER-T1`, `PER-H5`), `PRIV-01` (`PRIV-R11`), `REQ-01` (`RF-24`), `PLAN-01` (`R-11`), `ARQ-01` (futuro), fase de construcción.
**Naturaleza:** registro de decisión de arquitectura. **Acota:** `ADR-002-D6` — no lo supera; le quita una de las tres cosas que guardaba. **Supera:** el ítem de respaldo del DoD de release del plan de Codex, **por completo** — el MVP no respalda **ninguna** de las siete entidades. El alcance pasó de parcial a total en **SD-34**, y el motivo es el real y no una justificación técnica retroactiva: **velocidad de entrega**. El equipo confirmó que no se implementará ningún respaldo (ver §0.2 y `HECHOS_CANONICOS §Valores obsoletos`).
**Regla de honestidad (§4.9):** la durabilidad real del motor de persistencia elegido **no se ha verificado aquí** y va marcada `[N6]`. Lo que sí se verificó, por lectura directa de los artefactos, es que **ningún requisito de este proyecto promete respaldo, durabilidad ni recuperación** (§4).

## Escala de verificación de hechos externos

| Marca | Significado |
|---|---|
| **[N1]** | Hecho interno del subproyecto (verificable en estos artefactos). |
| **[N5]** | **Decisión de plan** sobre un servicio externo: adoptada, **no verificada** aquí — verificar antes del release. |
| **[N6]** | **Hecho externo volátil** (durabilidad declarada, capa gratuita, comportamiento de un servicio): además de verificar, **monitorear**. |

---

## §0 — Por qué existe esta ADR

### §0.1 — El hueco, dicho sin rodeos

`ADR-002-D6` puso los respaldos de la base de datos en S3 versionado, y con ello creó **un segundo lugar donde vive el dato personal**. Ninguna regla vigente lo alcanzaba: `PER-T1` y `PRIV-R11` enumeran la cascada de borrado sin mencionarlo, porque se escribieron cuando no había respaldos. Eso es `PER-H5`. [N1]

**Son dos huecos, no uno**, y conviene separarlos porque tienen soluciones distintas:

1. **El respaldo.** Una exportación del almacén operativo **es** el contenido de las siete entidades. Borrar al usuario hoy no lo borra del respaldo de ayer.
2. **El versionado.** `ADR-002-D6` lo eligió por una razón buena y escrita —historia de los textos de consentimiento y *disclosure*, que tienen implicaciones legales— pero significa que **borrar un objeto no lo borra**: sobreviven sus versiones anteriores.

**Consecuencia medida:** `RF-24` promete que «no queda dato asociado recuperable», y su criterio de aceptación tuvo que debilitarse a «**desde la aplicación**» con el respaldo como excepción declarada. Es el **único RF del proyecto en esa situación**, y `PLAN-01` lo lleva como riesgo `R-11` de impacto **alto (canon/legal)**. [N1]

### §0.2 — Lo que esta decisión revierte, y no se disimula

**El plan de Codex sí pide un respaldo, y es fuente primaria archivada** (SD-16). Aparece en tres sitios: [N1]

- El **DoD de release**: *«Exista un backup verificable de SQLite.»* — motor **superado por** `ADR-002-D5`.
- La **tabla de riesgos**: *«Pérdida SQLite | Backup | Restaurar desde backup»* — riesgo de un motor **superado por** `ADR-002-D5`.
- El **inventario de scripts**: `backup_sqlite.py`, y `OPS-01` cubriendo «instalación, despliegue, backup, demo y reversa».

Los tres están atados a un motor **superado por** `ADR-002-D5`, y no por casualidad: el riesgo que mitigaban era perder **un archivo único** en un alojamiento gratuito frágil. El motor pasa de un archivo en disco → un servicio gestionado, y con él desapareció el modo de fallo concreto que el plan temía. [N1]

**Pero eso no convierte esta decisión en la ejecución de un plan previsto.** Es una reversión de un ítem de la fuente primaria, y queda declarada como tal, igual que `ADR-002 §0` declaró que ninguna condición de reversa había disparado el cambio de stack. Presentarla como continuidad falsearía la trazabilidad.

**Lo que sí se conserva es la intención del plan.** El plan quería que **el servicio fuera recuperable**. Lo que rompe el canon es que **el dato personal sobreviva a su propio borrado**. Son cosas separables, y esta ADR las separa:

| Qué | ¿Se respalda? | Por qué |
|---|---|---|
| **Configuración y activos** — plantillas de *system prompt*, textos de consentimiento y *disclosure*, catálogo de `RecursoDeAyuda`, texto de contención, banco de evaluación | **Sí**, y con versionado | Es caro de recrear, tiene peso legal, y **no es dato personal**. Es la razón por la que `ADR-002-D6` eligió S3 |
| **Almacén operativo** — las 7 entidades | **No** | Es dato personal, y es **barato de recrear**: los usuarios se vuelven a registrar |

El servicio sigue siendo recuperable. Lo que deja de ser recuperable es la cuenta de una persona que pidió que desapareciera — que es exactamente lo que `RF-24` promete.

---

## ADR-003-D1 — El almacén operativo **no se respalda**

- **Contexto:** el almacén operativo contiene las siete entidades de `PER-01 §2` y **solo** eso. El contenido conversacional **nunca se persiste** (`RF-13`, `RNF-03`, `PRIV-R2`), así que lo que está en juego es: `username`, alias, hash de contraseña, la declaración booleana de edad, la versión del *disclosure*, la fecha de registro, el registro de consentimiento, la cápsula de cinco autorreportes y unos contadores de uso. [N1]
- **Decisión:** **no habilitar respaldos, exportaciones ni recuperación a un punto en el tiempo sobre el almacén operativo.** No se produce ninguna copia de su contenido fuera de él. [N5]
- **Alcance:** solo el almacén de las siete entidades. La configuración y los activos **siguen respaldados y versionados** en S3, sin cambio.
- **Efecto sobre `PER-H5`:** el segundo lugar donde vivía el dato personal **deja de existir**, y `PER-T1` vuelve a ser completa. El hallazgo se cierra. [N1]
- **Condición de reversa:** si el subproyecto pasa a tener **usuarios reales** cuyos datos no puedan recrearse, o si aparece un requisito de continuidad que hoy no existe (§4), esta decisión se revisa — y entonces la salida **no es volver a respaldar sin más**, sino la opción acotada o el cifrado por usuario que §3 deja preparadas.

## ADR-003-D2 — El versionado se queda **solo donde no hay dato personal**

- **Contexto:** el versionado es la razón declarada por la que `ADR-002-D6` eligió S3, y su valor es real: da historia de los textos de consentimiento y *disclosure* sin inventar un mecanismo propio. [N1]
- **Decisión:** el versionado se mantiene sobre **configuración y activos**, y **no** se aplica a ningún contenedor que llegue a alojar dato personal. [N5]
- **Por qué importa decirlo aunque D1 ya quite los respaldos:** sin esta cláusula, cualquier futuro contenedor de dato personal heredaría el versionado por costumbre y **reabriría `PER-H5` en silencio**. La regla se escribe para que el próximo que toque la infraestructura la encuentre.
- **Condición de reversa:** ninguna prevista. Si algún día hay que versionar dato personal, exige reabrir esta ADR y `PRIV-R11`.

---

## §1 — Frontera de esta ADR

Esta ADR decide **qué se respalda y qué no**. **No** decide cómo. Quedan fuera, diferidos a **`ARQ-01`**:

- Nombres de contenedores, prefijos y políticas concretas.
- Reglas de ciclo de vida, expiración y `TTL`.
- IAM y permisos.
- El *runbook* de despliegue y de reversa.

**Por qué esta ADR sí puede tomarse ahora, sin romper `CLAUDE.md §6`.** La regla prohíbe adelantar el **diseño físico**. «El MVP no respalda el almacén de datos personales» **no es diseño físico**: es un **no-objetivo declarado**, de la misma clase que «no cachear respuestas del LLM», que `ADR-002-D6` ya declaró sin que nadie lo considerase un adelanto. No fija claves, ni *endpoints*, ni IAM. Dice **qué hace el sistema**, que es materia de ADR. [N1]

---

## §2 — Lo que esta decisión **no** cierra

Ser preciso aquí importa más que quedar bien.

**Actualización (SD-35): `ADR-004` cerró también `PER-H2`, así que `RF-24` pasa a cumplirse.** Lo que sigue decía la situación al emitirse esta ADR, y se conserva por trinquete: **`RF-24` sigue sin cumplirse de forma inmediata, y la causa es `PER-H2`, no `PER-H5`.** El plan §4.14 fija la retención de la cuenta en «hasta eliminación o cierre **+ 30 días**». Mientras esa ventana exista y no se decida si el borrado es **físico inmediato** o **lógico con purga diferida**, queda dato durante 30 días después de que el usuario pida su eliminación. [N1]

Es decir: `RF-24` pasa de **dos excepciones abiertas a una**.

| Antes de esta ADR | Después |
|---|---|
| `PER-H5` — el respaldo escapa a la cascada | ✅ **cerrado** |
| `PER-H2` — la ventana de +30 días | ✅ **cerrado en `ADR-004`** (SD-35) |

**Y `V6-b` sigue abierta.** La frontera legal bajo la Ley 1581/2012 es la que decide si «+30 días» es siquiera admisible, y `PRIV-01` la formula sin resolverla. Los tres —`PER-H5`, `PER-H2`, `V6-b`— eran el mismo nudo; esta ADR desata **uno**.

---

## §3 — Alternativas consideradas

| | Qué hacía | Por qué no se eligió |
|---|---|---|
| **B. Respaldos acotados y sin versionar** | Contenedor separado del de configuración, versionado apagado ahí, y expiración a N días | **Acota el hueco, no lo cierra.** Obligaría a que `RF-24` prometiera «no recuperable **a los N días**» en vez de «no recuperable». Y exige decidir contenedores y ciclo de vida, que es `ARQ-01`: no podría tomarse ahora |
| **C. *Crypto-shredding*** | Cifrar los campos personales con una clave por usuario, fuera del respaldo; eliminar la cuenta borra la clave y el respaldo queda como texto cifrado inservible | Es la **respuesta correcta del problema general** y quedaría bien en el informe. Pero exige gestión de claves, y el almacén de claves pasa a ser el punto único que hay que proteger y respaldar con cuidado. **Desproporcionado** para un MVP académico de un mes cuyo dato en juego es un alias y cinco autorreportes |
| **D. Reescribir `RF-24` y declarar los respaldos fuera de alcance** | Aceptar el hueco por escrito | **No cierra nada**: lo legitima. Y contradice el canon, que exige cerrar `PER-H5` «antes de cualquier uso con personas reales» |

**B y C quedan preparadas, no descartadas.** Son la salida si se dispara la condición de reversa de `D1`.

---

## §4 — Consecuencias

**Nueva, y es el precio de esta decisión:** un fallo del almacén operativo es **irrecuperable**. Se pierden las cuentas, los consentimientos, las cápsulas y los contadores, y los usuarios tienen que volver a registrarse y rehacer el *onboarding*. [N1]

**Por qué es asumible aquí, y solo aquí:**

- **No hay usuarios reales ni piloto.** El proyecto no tiene código todavía, por diseño.
- **El dato de cuenta es recreable por su propio titular** en unos minutos: registro, consentimiento y cinco autorreportes opcionales. **Pero no todo lo es, y v1.0 afirmaba de más:** `AdministrativeAction` —la auditoría del *kill switch*— y `OperationalEvent` —la telemetría de una ventana pasada— **no los puede recrear nadie**. Ver el riesgo residual de `RF-18`, abajo.
- **Lo caro de recrear no se pierde:** los textos de consentimiento y *disclosure*, las plantillas de *prompt* y el catálogo de recursos siguen versionados en S3.
- **Nada lo prohíbe.** Verificado por lectura directa el 2026-08-04: `REQ-01` **no** contiene ningún requisito de respaldo, durabilidad, recuperación ni continuidad — la única aparición de «respaldo» en todo el archivo es el criterio de aceptación de `RF-24`, que es la excepción que esta ADR elimina. `VIS-01` tampoco lo pide. [N1]

**Riesgo residual sobre `RF-18`, aceptado y declarado (SD-34).** `RF-18` promete que «cada cambio de disponibilidad queda con autor y fecha». **El registro existe en operación normal**, que es lo que el requisito exige, y por eso `RF-18` no se toca. Lo que **no** sobrevive es la pérdida del almacén: `AdministrativeAction` tiene la retención más larga de las siete entidades —«vigencia del curso + 30 días»— y ahora no tiene respaldo. Una traza de auditoría que puede evaporarse sin dejar rastro es peor que no tenerla, porque se cree que existe; se asume por velocidad de entrega y se deja escrito para que el CDR lo vea. **Consecuencia hermana en `CU-09`:** tras una pérdida, `DS-09` presenta los ceros como **cifra válida** (`mostrarLosAgregadosEnCeroComoCifraValida()`), así que el administrador **no puede distinguir** una semana sin actividad de un almacén vaciado.

**Riesgo `R-11` reformulado, no cerrado.** Deja de ser «los respaldos escapan a la cascada» —que era de canon y legal, impacto alto— y pasa a ser «la pérdida del almacén operativo es irrecuperable» —operativo, impacto medio, probabilidad baja—. **Es un riesgo peor de gestionar y mejor de tener**: afecta a la disponibilidad del demo, no a los derechos de una persona.

**Lo que no cambia:** ninguna clase, ninguna operación, ningún flujo. `MC-01`, los 14 `DS` y las 14 `ECU` quedan intactos. `Usuario.suprimirEnCascada()` ya alcanzaba todo lo alcanzable desde la aplicación; lo que cambia es que ahora **eso es todo lo que hay**.

---

## §5 — Verificaciones pendientes

| # | Qué verificar | Marca | Cuándo |
|---|---|---|---|
| 1 | **Qué recuperación trae activada por defecto** el motor de persistencia elegido, y cómo se desactiva. Una decisión de «no respaldar» que el proveedor deshaga por defecto no vale nada | **[N6]** | Antes de crear el recurso |
| 2 | Que el contenedor de configuración **no reciba** ninguna exportación de dato personal por descuido | **[N1]** | `ARQ-01` y revisión de despliegue |
| 3 | La **durabilidad declarada** del motor, para dimensionar honestamente el riesgo `R-11` reformulado | **[N6]** | Junto con `V6-a` |
| 4 | Si aparece cualquier requisito de continuidad durante la construcción, **esta ADR se revisa** antes de implementarlo | **[N1]** | Continuo |

**Se acumula a `V6-a`**, que ya pregunta por los servicios gratuitos y sus límites: la verificación 1 y la 3 se responden en la misma sesión.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-04 | J. Sánchez | Creación (SD-33). Cierra `PER-H5` quitando el segundo lugar donde vivía el dato personal, en vez de acotarlo. Declara la reversión del ítem de respaldo del DoD del plan de Codex —atado a SQLite y superado por `ADR-002-D5`— y conserva su intención separando «servicio recuperable» de «dato personal recuperable». Deja `PER-H2` y `V6-b` expresamente abiertos: `RF-24` pasa de dos excepciones a una. |
