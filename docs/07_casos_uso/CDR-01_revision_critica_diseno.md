# CDR-01 — Acta de Revisión Crítica del Diseño (CDR)
**ID:** CDR-01 · **Familia:** CDR (compuerta ICONIX entre el diseño detallado y el código) · **Hogar:** `docs/07_casos_uso/` · **Fecha:** 2026-08-04 · **Versión:** v1.3 (SD-39: §6 deja de declarar la regla #2 y la revisión visual como no ejecutadas — ambas se cerraron en el retrabajo). v1.2 (SD-39: el retrabajo queda **aplicado y registrado** —§8-ter y §8-quater—, con dos etiquetas y la aritmética de `H-01` corregidas; **el veredicto no se toca**: lo determina la verificación independiente). v1.1 (cobertura completa: 14/14 especificaciones, 168/168 obligaciones emparejadas, los 8 validadores sobre los 31 `.puml`, y tres comprobaciones cruzadas nuevas. **7 hallazgos nuevos, uno de ellos Mayor**; `H-01` crece de 12 a 18 instancias). v1.0 (compuerta inicial, 13 hallazgos) · **Estado:** vigente.
**Modalidad:** completa — las diez reglas, con ciclo de deliberación. Sesión de dos roles: el orquestador conduce, registra y recomienda; el **líder del proyecto** determina (IEEE 1028 §5.2.1) y ejerce la regla #4 por el equipo.
**Generado con:** skill `iconix-cdr-review`. **Naturaleza:** revisión **técnica** (IEEE 1028 cláusula 5), no inspección. El cliente no participa: Rosenberg 4545 lo excluye expresamente del CDR.
**Paquete revisado:** el diseño detallado del subproyecto «Alan & Aura Académico» al cierre de `SD-32` — modelo de clases de diseño, 14 diagramas de secuencia y sus artefactos derivados.
**Nota de nomenclatura:** `RPD-01` es la compuerta **anterior** (*Preliminary Design Review*, análisis → diseño detallado). Esta es la siguiente y última antes del código.

---

## 1. Insumos recibidos — los tres niveles

**Todos los insumos de la tabla de la skill existían.** Ninguna regla quedó sin ejecutar por falta de material.

| Insumo | Nivel | Reglas que habilitó | Estado |
|---|---|---|---|
| 14 diagramas de secuencia `DS-01…14` | **Obligatorio** | 10, 9, 8, 6 | Recibido |
| Modelo de clases `MC-01` + matriz de procedencia | **Obligatorio** | 8, 7, 3, 2 | Recibido |
| 14 especificaciones `ECU-01…14` | **Obligatorio** | 10, 9, 5 | Recibido |
| Plan de pruebas `CP-01…14` (los 14, no solo el índice) | Recomendado | 1 | Recibido |
| `REQ-01` (26 RF + 10 RNF) y `MV-01` (reglas `RN-XX`) | Recomendado | 5 | Recibido |
| Modelo de dominio `MD-01` | Recomendado | 7 | Recibido |
| 14 diagramas de robustez `DR-01…14` | Recomendado | 6, 1 y **el recorrido fino** | Recibido |
| Veredicto del PDR `RPD-01` | Recomendado | Costura hacia atrás | Recibido — *Aceptado con verificación de retrabajo*, **no** *Reinspección*: no dispara aviso |
| Diagrama de casos de uso `DCU-01` | Opcional | Alcance del release | Recibido |
| Wireframes `DIS-00`/`DIS-01` + 16 pantallas | Opcional | Contexto de #7 y #10 | Recibido |
| Arquitectura `ADR-002`/`ADR-003`/`ADR-004` | Opcional | Contexto de #6 | Recibido. `ARQ-01` **no existe**: va después de esta compuerta |
| Glosario (`MV-01 §11`, `MD-01.md`) | Opcional | Deriva de vocabulario | Recibido |
| `PER-01`, `PRIV-01`, `SEG-01` | *Añadido del proyecto*, fuera de la tabla de la skill | Contexto de #5 y #6 | Recibido |

## 2. Criterio de entrada — cumplido

IEEE 1028 §5.4.2 obliga a revisar **solo** con los insumos disponibles; Rosenberg 4556 exige las secuencias completas y el modelo estático ya actualizado con las operaciones asignadas.

- **14/14** diagramas de secuencia del alcance del release, contrastados contra los 14 casos de uso de `DCU-01`.
- Modelo de clases con las **200 operaciones** asignadas reflejadas en el modelo estático.
- `validate_cdr.py` sobre el paquete completo: **0 errores**.

**Se revisó.**

## 3. Preparación mecánica — y la calibración que la precede

Wiegers sitúa hasta el **75 %** de los defectos en la preparación individual. Antes de creerle nada a la herramienta, se la calibró.

### 3.1 Calibración del validador contra `tests/examples/` (16 fixtures)

| Fixture | Esperado | Obtenido |
|---|---|---|
| `bueno` | sin señales | 0 señales · `ACEPTADO` ✅ |
| `falsos_positivos` | **sin señales** | 0 señales · `ACEPTADO` ✅ |
| Los **14** de defecto | disparar | los 14 disparan; `criterio_entrada`, `flujo_sin_disenar`, `modelo_vacio` y `operacion_huerfana` con código de salida 1 ✅ |

Esto no es ceremonia: `MC-00 §5.2` registra que este mismo validador emitió `LISTO PARA EL CDR` con **0 operaciones parseadas**. Un validador roto y uno sano dan la misma salida sobre material correcto, y por eso se comprueba que distingue.

### 3.2 El marco de la primera corrida estaba mal, y se corrigió

La invocación inicial dio **55 advertencias**. Al pasarle el plan de pruebas **completo** —los 14 `CP`, no solo el índice `CP-00`, porque `--pruebas` acepta un archivo— bajaron a **13**:

| Bloque | 1.ª corrida | Corregida | Diagnóstico |
|---|---:|---:|---|
| Regla #1 — controladores sin caso de prueba | 30 | **0** | Artefacto de invocación. Los `CP` cubren cada controlador por **alias** PlantUML (`C_VerificarUnicidadDeUsername`), no por la etiqueta en prosa que empareja el validador |
| Regla #1 — flujos `FA`/`FE` sin caso de prueba | 12 | **0** | Mismo artefacto |
| Regla #7 — entidades sin atributos | 6 | 6 | Sobreviven; todas con causa escrita en el `.puml` |
| Regla #7 — candidatas a clase Dios | 3 | 3 | Sobreviven |
| Multiplicidades ausentes | 1 | 1 | Sobrevive → `H-07` |
| Regla #5 — `RNF-01`/`RNF-02` sin léxico común | 2 | 2 | Comportamiento esperado: los RNF se trazan a decisiones, no a clases |
| Presupuesto | 1 | 1 | Aviso |
| **Total** | **55** | **13** | **42 eran artefactos** |

**Ningún artefacto del repositorio se modificó para conseguirlo.** Corregir hallazgos antes de la compuerta la anularía y rompería la separación revisor/autor de §6.5.6.5.

**Artefacto residual declarado:** el validador cuenta los **11 enumerados como clases** (informa 48). El canon `H-25` dice **37 clases + 11 enumerados**, y el canon manda.

### 3.3 Conteos canónicos reproducidos contra los `.puml`

No citados de `TRZ-DS-01`: contados sobre la fuente.

| Hecho | Canon | Medido |
|---|---:|---:|
| `H-21` controladores de robustez | 150 | **150** ✅ |
| `H-22` mensajes de secuencia | 282 | **282** ✅ |
| `H-24` casos de prueba | 181 | **181** ✅ |
| `H-25` clases de `MC-01` | 37 | **37** ✅ |
| Enumerados | 11 | **11** ✅ |
| `H-26` operaciones (pares clase-operación) | 200 | **200** ✅ |
| `H-11` clases de dominio | 16 | **16** ✅ |
| `H-13` casos de uso | 14 | **14** ✅ |

`verificar_procedencia_mc01.py` (verificador **exacto** del propio repositorio): **0 discrepancias**, código 0.

### 3.4 Triaje 5/20/80 (Ebert & Dumke §9.3.3)

Reparto de atención, no umbral de calidad. Orden por tamaño (operaciones + atributos) y acoplamiento (relaciones entrantes + salientes); **la fórmula de orden es convención de esta skill** — la fuente ordena por complejidad e historial de cambios, que no existen antes de codificar.

| Tramo | Clases | Tratamiento aplicado |
|---|---|---|
| **5 %** (2) | `CapsulaDePerfil` (27) · `Usuario` (26) | Candidatas a rediseño; grupo propio en la deliberación |
| **20 %** (5 más) | `Chat con el acompanante (P-10)` (24) · `Consentimiento` (22) · `Gestion de cuenta (P-13)` (21) · `Conversacion` (21) · `TitularDeCuenta` (16) | Inspección detallada de cada operación y relación |
| **80 %** (30) | el resto | Comprobaciones mecánicas |

De las métricas CK se usaron **DIT** y una aproximación a **CBO**. **`WMC` y `RFC` no se calculan** —exigen la complejidad de cada método, que un modelo de diseño no tiene— y **`LCOM` tampoco**: su fórmula está corrupta en el corpus de la skill y no se implementa desde ahí.

**Corrección de una medición propia, declarada:** el primer extractor de relaciones emparejó **51 de 73** porque su expresión regular no admitía la multiplicidad entrecomillada entre el extremo y el conector (`Usuario "1" -- "0..1" CapsulaDePerfil`) — descartaba justo las 9 relaciones que **sí** la declaran. Corregido, empareja **60 clase-clase + 11 a enumerados + 2 conectores entre notas = 73**. Ver `H-13`.

## 4. Presupuesto de la sesión

| Concepto | Valor | Procedencia |
|---|---|---|
| Material de diseño | **35,1 páginas equivalentes** | Convención de la skill: 1 página ≈ 40 líneas efectivas de `.puml` |
| Plan de pruebas | 18,7 páginas | ídem |
| Ritmo de diseño detallado | **3-4 pág/hora** | IEEE 1028 §6.5.2, fila *Detailed design* — **normativo** |
| Ritmo de plan de pruebas | 5-7 pág/hora | ídem, fila *Test plan* |
| Estimación | **11,4 a 15,4 horas** | derivada |
| **Reparto propuesto** | **2 sesiones**, por caso de uso | El material supera las **20 páginas** recomendadas (no las 50 inservibles). IEEE 1028 §5.1 autoriza varias reuniones |

Wiegers: reservar **≥ 50 %** del tiempo de reunión para preparación individual, y ninguna reunión de más de **dos horas**.

## 5. Autocomprobación de la revisión — la compuerta de tasa base

Se calcula **antes** del veredicto, para que el acta no pueda cerrarse sin confrontarla.

| Magnitud | v1.0 | **v1.1** |
|---|---|---|
| Tasa base medida en documentos de diseño (GQM, caso RITME) | 0,4 hallazgos/página | 0,4 |
| Esperados para 35,1 páginas | ~14 | ~14 |
| Suelo de sospecha (convención de la skill: ¼ de la tasa base) | ~4 | ~4 |
| **Obtenidos** | 13 | **20** |
| **Tasa** | 0,37 / página | **0,57 / página** |

**Ambas dentro de lo razonable, pero la lectura cambia.** La v1.0, con 0,37, quedaba justo por debajo de la tasa base — compatible con un diseño maduro **y también** con una revisión que no había mirado todo. La v1.1, con cobertura completa, sube a **0,57: por encima de la base**. La interpretación honesta no es que el diseño empeorara, sino que **la cobertura parcial de la v1.0 estaba escondiendo hallazgos** — exactamente lo que la compuerta de tasa base existe para detectar, funcionando en la dirección menos cómoda.

No procede la advertencia del anti-patrón #20 (revisión sin hallazgos), y tampoco la contraria: 0,57 no llega al terreno de «artefacto inmaduro que no debió convocar el CDR».

## 6. Cobertura de las diez reglas

| # | Regla | Estado | Evidencia o razón |
|---|---|---|---|
| 10 | Secuencia ↔ texto (resaltador) | **Ejecutada** | Recorrido grueso por los 14 títulos contra `DCU-01`; fino por los 150 controladores. Fan-out de 6 extractores sobre las obligaciones fuera de las tablas de flujo — ver §7 |
| 9 | Cursos básicos **y** alternativos | **Ejecutada** | 0 flujos sin fragmento (mecánico). La comprobación **semántica** del operador destapó `H-01` |
| 8 | Operaciones bien asignadas | **Ejecutada** | Directa: `verificar_procedencia_mc01.py`, 0 discrepancias. Inversa (técnica del `Queue`): destapó `H-03`; las 3 rutas de borrado de `CapsulaDePerfil` se comprobaron trazadas |
| 7 | Atributos y operaciones apropiados | **Ejecutada** | Triaje 5/20/80; 6 entidades sin atributos con causa escrita en el `.puml`; 3 candidatas a clase Dios juzgadas de forma independiente |
| 6 | Diseño real, sin magia | **Ejecutada** | Destapó `H-02`. **Cero patrones introducidos** — ninguna factoría, repositorio ni *singleton* |
| 5 | Trazar requisitos a casos de uso y clases | **Ejecutada** | Ambas direcciones. Destapó `H-05` y `H-06` |
| 4 | Los programadores validan que es construible | **Ejecutada** | La ejerció el **líder por el equipo**. Veredicto sustantivo: `H-02` **no es construible como está dibujado**; se opta por cambiar la promesa (§8) |
| 3 | Tipos, parámetros y retornos | **Ejecutada** | 0 tipos vagos (`Object`/`var`), 0 nombres sin intención. Resolubilidad: destapó `H-04` y `H-08` |
| 2 | Generar cabeceras e inspeccionarlas | **Ejecutada en `SD-39`** (v1.1: *no ejecutada, diferida con disparador*) | Se difirió por decisión del líder hasta aplicar las correcciones, porque `H-04` la bloqueaba: sin forma para los tipos de retorno, las cabeceras habrían salido con `???`. **Al ejercerse no salió ningún `???`, pero destapó `H-26`** —20 de las 43 clases con nombre que no es identificador válido, por un defecto del generador, no del modelo—. Las cabeceras pasaron revisión del líder y **se versionan**. Con esto, **las diez reglas están ejecutadas** |
| 1 | Revisar el plan de pruebas | **Ejecutada** | 150/150 controladores con caso de prueba y 0 flujos sin caso, con el plan completo (§3.2) |

**Capa adicional, declarada no ejecutada en la v1.1 y CERRADA en `SD-39`:** la **revisión visual** del `.svg` de `MC-01`. El render se aplazó **a propósito** —a la espera de que el `.puml` estuviera firme, por si el CDR obligaba a tocarlo— y la cautela resultó correcta: **seis** hallazgos acabaron tocándolo. Ya está **generado y mirado** (`MC-00 §4.2`), y la inspección visual dio **tres hallazgos que ninguna comprobación estructural podía dar**: falta de título, proporción 5:1 y los tipos de transferencia sin relación. **La primera rasterización salió cortada** —PlantUML topa en 4096 px y el diagrama mide 10918—, el mismo modo de fallo que `PDR-01 §7` documenta.

## 7. El fan-out de la regla #10 y su auditoría

Seis extractores, uno por especificación (`ECU-01`, `04`, `06`, `07`, `10`, `13`), cada uno leyendo **su `ECU` entero** y **ninguno su `DS`** — lo que los hace estructuralmente incapaces de emitir el juicio que `CLAUDE.md §1` prohíbe delegar. El emparejamiento lo hizo el orquestador.

| Capa de auditoría | Resultado |
|---|---|
| (a) Esquema con `archivo:línea` + cita literal | 72 filas, todas con localizador |
| (b) **Replay del 100 %** contra la línea citada | **72/72 verificadas · precisión 100 %** |
| (c) Cobertura de la forma «ágil» | `ECU-13` devolvió `SECCIONES DETECTADAS: ## 5. Flujo básico` y `## 6. Flujos alternativos y de excepción` — la trampa de cortar por número de sección (que habría truncado 7 de 14 en silencio) se sorteó |

**Corrección de una medición propia:** el replay marcó inicialmente 1 fila descartada; al inspeccionarla resultó ser un defecto del **normalizador del verificador**, que sustituía el marcado `**` por un espacio y convertía `**tono**,` en `tono ,`. Corregido, la precisión es 100 %. Se declara porque un recall falseado en el acta sería peor que no medirlo.

**Emparejamientos verificados uno a uno** (muestra de obligaciones de alto riesgo):

| Obligación | Realización | Veredicto |
|---|---|---|
| `ECU-07:74` «el turno **nunca** llega al Proveedor LLM» | `DS-07` no declara línea de vida del proveedor | ✅ realizada por ausencia |
| `ECU-13:81` «`character` no cambia» | `DS-13:51` `consultarCharacterSinReescribirlo()` | ✅ el nombre codifica la obligación |
| `ECU-04:218` «borrado en cascada **atómico**» | `DS-04:85` `deshacerLoSuprimido()` | ❌ **`H-02`** |
| `ECU-10:179` «la petición de apertura recibe `409`» | solo una nota en `DS-10:84`; ningún mensaje | ⚠️ **`H-09`** |

## 7-bis. Ampliación de cobertura (v1.1)

La v1.0 dejó dos huecos declarados: el fan-out cubrió **6 de 14** especificaciones, y de las 72 obligaciones extraídas **solo 4 se emparejaron**. Ambos quedan cerrados.

### 7-bis.1 · Los ocho validadores sobre los 31 `.puml` y las 14 `ECU`

| Validador | Alcance | Resultado |
|---|---|---|
| `validate_domain_puml.py` | `MD-01` | **0 errores / 0 advertencias** |
| `validate_use_case_puml.py` | `DCU-01` | **0 errores / 0 advertencias** |
| `validate_robustness_puml.py … --domain MD-01` | los **14** `DR` | **0 errores en los 14** |
| `validate_sequence_puml.py --secuencia --robustez --spec --dominio` | los **14** `DS` | **0 errores · 6 advertencias** (la línea base exacta de `E-2`) |
| `validate_use_case_spec.py` | las 14 `ECU` | línea base: 0/0 |
| `validate_design_class_puml.py` | `MC-01` | línea base: 0 errores / 9 advertencias |
| `verificar_procedencia_mc01.py` | `DS ↔ MC-01 ↔ MD-01` | **0 discrepancias** |
| `validate_cdr.py` | el paquete | **0 errores** |

**Las cuatro banderas que `DS-00` afirma haber usado y nunca transcribió, quedan escritas.** Y ejecutan cuatro capas de cierre que ningún script del repositorio hace: *participantes contra `DR-XX`* · *entidades contra el dominio* · *cobertura de controladores* · *cobertura de flujos alternativos*. **En los 14: 0 controladores sin cubrir y 0 flujos sin fragmento.** Con eso, el «participantes DR↔DS 14/14» deja de ser una afirmación heredada y pasa a ser medición propia.

### 7-bis.2 · Tres comprobaciones cruzadas que nadie había hecho

| # | Comprobación | Resultado |
|---|---|---|
| **B-1** | Los **150 controladores** de los `DR` contra las etiquetas de mensaje de los `DS` — `DOP-01` llevaba esta tabla **a mano** y ningún script la comprobaba | **150/150 con eco.** Limpio |
| **B-2** | Barrido de nombres entre los 14 `DR` | **0 alias con más de una etiqueta**: el defecto `H-D`, hallado *de rebote* en `SD-32`, está **cerrado y ahora verificado por barrido**. Pero **3 etiquetas con alias divergente** → `H-20` |
| **B-3** | Etiquetas `boundary` de los `DR` contra las 16 pantallas de `DIS-00` | **16/16 presentes.** Los dos `boundary` sin código de pantalla —`Dialogo de confirmacion del cambio` y `Frontera con el Proveedor LLM`— son legítimos y declarados |

### 7-bis.3 · Fan-out completo y su auditoría

- **14/14 especificaciones extraídas** (6 en v1.0 + 8 en v1.1), **168 obligaciones**.
- **Replay del 100 %:** 72/72 en el primer lote · **95/96** en el segundo. La fila descartada (`ECU-11:218`) **no fue una fabricación**: el extractor elidió la cláusula «con el rol validado allí», que es sustantiva. Descartada según la regla, y la obligación **recuperada por lectura directa del orquestador** — que es distinto de reparar la fila ajena. **Precisión de extracción: 167/168 = 99,4 %.**
- **Cobertura de las dos formas:** el cortador por título se validó antes de usarse — 6/6 títulos en las 5 ágiles, 7/7 en las 3 completas. La trampa está confirmada en el sitio: `ECU-11:86` es `## 5. Actores`, no «Flujo básico». Cortar por número habría truncado tres especificaciones **en silencio**.
- **168/168 obligaciones emparejadas** contra su `DS`, cada una en uno de tres estados: realizada · no realizada (hallazgo) · no verificable en este nivel.

**Lo que el emparejamiento confirmó, y merece decirse:** el paquete realiza sistemáticamente sus prohibiciones **como ausencias declaradas**, no tácitas — `DS-02:16-19` («RN-04.1 se realiza como una AUSENCIA»), `DS-03:24-26`, `DS-08:34-38`, `DS-09:44-47`, `DS-13:39-42`. Y crea operaciones cuyo único fin es hacer verificable lo que **no** cambia: `permanecerIntacta()`, `permanecerConSusDosCapas()`, `conservarCharacter()`, `dejarSinDefaultsLosOmitidos()`, `noContabilizarClasificacionDeRiesgo()`. **`ECU-07` cierra 12/12** — el más riguroso del paquete, y es el de seguridad.

### 7-bis.4 · Tres errores de instrumentación propios, declarados

Ninguno llegó al tablero, y por eso conviene decir que existieron: sin la regla de releer cada hallazgo mecánico en su línea, los tres habrían producido **90 hallazgos falsos**.

| Error | Efecto si no se detecta |
|---|---|
| El comparador `B-1` no partía el **camelCase** (`verificarSesionYRolDeAdministrador` frente a «Verificar la sesión y el rol») | **78 controladores** reportados como huérfanos. Corregido: **0** |
| El segundo barrido de `break` aceptó el patrón `reintent`, que casa con «**Termina**; el Visitante reintenta más tarde» — que es uso *correcto* | **6 falsos positivos** de 12. `H-01` habría crecido a 24 en vez de a 18 |
| El extractor de relaciones perdía las 9 con multiplicidad entrecomillada *(ya declarado en §3.4)* | Acoplamiento mal medido en el triaje |

## 8. Tablero de hallazgos

Severidad del paquete y su mapeo declarado a IEEE 1028 §6.8.3: **Crítico**→*Catastrophic* · **Mayor**→*Critical* · **Moderado**→*Marginal* · **Menor**→*Negligible*. Las dos escalas no miden lo mismo: la de la norma mide impacto en operación; ésta mide aptitud del diseño para pasar a código.

| # | Sev. | Categoría §6.8.2 | Hallazgo | Ubicación | Disposición acordada | Destinatario | Estado |
|---|---|---|---|---|---|---|---|
| **H-01** | **Mayor** | *Incorrect* | **12 fragmentos `break` sobre flujos cuyo texto declara «Vuelve al paso N».** `break` abandona el fragmento envolvente (UML 2.5); el texto pide reintento. Es sistemático: el operador se eligió por **categoría** (`FE`→`break`), no por desenlace — prueba de ello es que los **15** `break` sobre flujos que sí terminan son correctos | `DS-04:48,84` · `DS-05:63,97` · `DS-06:71,77,100,105` · `DS-10:66` · `DS-11:54,67` · `DS-12:53` (y sus filas en `ECU-04:180,181` · `ECU-05:164,165` · `ECU-06:168,170,171,172` · `ECU-10:170` · `ECU-11:181,182` · `ECU-12:169`) | **Corregir ahora** — sustituir por `opt` | `/uml-sequence-diagram` | Abierto |
| **H-02** | **Mayor** | *Unachievable* | **La atomicidad prometida no tiene mecanismo.** `ECU-04 RE-04` exige «todo o nada»; el diseño lo realiza con una auto-llamada `deshacerLoSuprimido()`. Sin transacción, compensación ni bitácora: «magia» en el sentido de Rosenberg 4612. Colisiona con `ADR-002-D5` (DynamoDB no revierte escrituras confirmadas fuera de `TransactWriteItems`), con la cascada repartida en **4 mensajes a 4 entidades**, y con `ADR-003` (sin respaldo del almacén) | `DS-04:84-85`; obligación en `ECU-04:218` | **Reabrir el artefacto anterior.** La promesa pasa de «atómico todo-o-nada» a **borrado ordenado, tolerante a fallo parcial y reintentable** (consentimiento primero → dependientes → titular al final). El fragmento de `DS-04` pasa de deshacer a **reintentar** | `/use-case-specifier` (`ECU-04`) + `/uml-sequence-diagram` (`DS-04`) | Abierto |
| **H-03** | Moderado | *Risk-prone* | **P-13 con 17 operaciones en tres familias paralelas del mismo comportamiento**: `denegarPorPermisoSinSuprimirNada` / `…SinBorrarNada` / `…SinCambios`; `advertirQueLaAccionEsIrreversible` / `advertirDelAlcanceIrreversible`; `cancelarDejandoLaCuentaIntacta` / `…LaCapsulaCompleta` / `…SinModificarElConsentimiento`. El `.puml` declara que sirve CU-04/11/12 | `MC-01:407-426` | **Diferir con riesgo aceptado.** Funciona; partirla alcanza tres casos de uso, sus secuencias y sus casos de prueba. Se revisa si la pantalla crece | `/uml-design-class-model` | Diferido |
| **H-04** | Moderado | *Ambiguous* | **7 de los 8 tipos de retorno con nombre no tienen forma definida en ningún artefacto.** `matriz_procedencia §5` los declara deliberados pero **argumenta solo `ContextoInicialConversacionalV1`**. **Bloquea la regla #2**: la generación de cabeceras emitiría `???` | `MC-01:92` (`Sesion`), `:110,431` (`FilaDeDirectorio`), `:112` (`AgregadoDeCuentas`), `:162` (`AlcanceDeBorrado`), `:200,207,208,213,214` (`Persona`), `:231` (`ReferenciaDeDerivacion`), `:440` (`AgregadoDeUso`) | **Corregir ahora** | `/uml-design-class-model` | Abierto |
| **H-05** | Moderado | *Missing* | **Los 10 RNF no tienen fila de trazabilidad en ningún artefacto.** `TRZ-01 §2` traza los 26 RF exhaustivamente; los RNF solo asoman como origen en `REQ-01` y de refilón vía `RC-09`/`RC-10`. La regla #5 dice *"functional **(and nonfunctional)**"*, y los no funcionales se trazan a **decisiones de diseño**, no a clases | `TRZ-01:15-42` (matriz sin RNF), `:68-69` | **Corregir ahora** | `TRZ-01` | Abierto |
| **H-06** | Moderado | *Missing* | **Ningún artefacto recorre `RF-XX → clase de `MC-01`.** Exige empalmar `TRZ-01 §5.2` + `TRZ-DS-01 §2` + `matriz_procedencia`, y `TRZ-01 §5.1` sigue congelado en las **16** clases de `MD-01`, sin noticia de las **37** de diseño. La pregunta de control «¿qué requisito implementa esta clase?» no es contestable para las 21 de solución desde un solo artefacto | `TRZ-01:91-112` | **Corregir ahora** | `TRZ-01` + `/uml-design-class-model` | Abierto |
| **H-07** | Moderado | *Missing* | **4 relaciones sin multiplicidad.** Rosenberg 4864 las sitúa exigibles **en esta etapa**: sin ellas no se sabe si un campo es una referencia o una colección | `MC-01:546,550,551,554` | **Corregir ahora** | `/uml-design-class-model` | Abierto |
| **H-08** | Menor | *Incorrect* | `matriz_procedencia §5` dice «**cuatro** tipos de retorno con nombre» y a continuación **lista ocho** | `MC-01_matriz_procedencia.md §5` | **Corregir ahora** | `/uml-design-class-model` | Abierto |
| **H-09** | Menor | *Missing* | **Los códigos HTTP que las `ECU` comprometen (400/401/403/409/429/504) no los lleva ningún mensaje** de los 14 `DS`; `409` aparece **una sola vez y dentro de una nota**. No es comportamiento ausente —`informarIndisponibilidadTemporal()` lo realiza— sino un compromiso que ningún artefacto de diseño transporta | `DS-10:84` (única aparición); obligaciones en `ECU-06:169`, `ECU-10:179` | ***Management issue*** → `ARQ-01` lo hereda como requisito | `ARQ-01` | Abierto |
| **H-10** | Menor | *Inconsistent* | `MC-00 §6` marca **9** hallazgos como ✅ Aplicado y `MC-00 §12` dice «Los 14 hallazgos de §6: Reportados, **ninguno aplicado**» | `MC-00 §6` vs `§12` | **Corregir ahora** | `/uml-design-class-model` | Abierto |
| **H-11** | Menor | *Inconsistent* | Asimetría de firma entre operaciones hermanas: `revocarCapaDePersonalizacion(fecha : DateTime)` registra fecha; `revocarCapaBase()` no | `MC-01:131-132` | **Corregir ahora** | `/uml-design-class-model` | Abierto |
| **H-12** | Menor | *Editorial* | Párrafo duplicado casi idéntico | `MC-00:260` y `:262` | **Corregir ahora** | `/uml-design-class-model` | Abierto |
| **H-13** | Menor | *Incorrect* | **El conteo canónico de 73 relaciones incluye 2 conectores entre notas**, que no son relaciones del modelo. Las reales son **71** = 4 generalizaciones + 1 composición + 12 asociaciones + 54 dependencias | `MC-01:663-664` (`N_Infraestructura .. N_PER_H5`, `N_PER_H5 .. N_Ausencias`) | **Corregir ahora**; si el valor entra a `HECHOS_CANONICOS`, es **decisión**, no edición | `/uml-design-class-model` + `HECHOS_CANONICOS` | Abierto |

### 8-bis. Hallazgos añadidos en la v1.1

| # | Sev. | Categoría §6.8.2 | Hallazgo | Ubicación | Disposición | Destinatario |
|---|---|---|---|---|---|---|
| **H-14** | **Mayor** | *Missing* | **La auditoría del reinicio de caracterización no existe.** `ECU-11 RE-06` exige que «el reinicio queda **fechado y auditable** sin registrar contenido de conversación». `DS-11` **no declara ningún participante de auditoría** —ni `AccionAdministrativa`, ni `EventoOperativo`, ni nada— y **ningún mensaje registra el reinicio**. El contraste lo hace evidente: `DS-10:53` sí escribe `registrarAccion(autor, fecha)` para el *kill switch*. Aquí se borra la `CapsulaDePerfil` entera **sin dejar traza** | `ECU-11:221` sin realización en `DS-11` (los 7 participantes son `ACT_Usuario`, tres `boundary`, `E_Usuario`, `E_CapsulaDePerfil`, `E_Consentimiento`) | **Pendiente de tu decisión** | `/uml-sequence-diagram` + `/uml-design-class-model` |
| **H-15** | Moderado | *Incorrect* | **`DS-11:46-48` modela un estado que no puede existir.** `deshacerElBorradoIncompleto()` protege contra un «borrado a medias» de **una sola entidad**. Es el reverso de `H-02`: allí la atomicidad era **imposible** (4 entidades, sin transacción); aquí es **innecesaria** — borrar un ítem único o pasa o no pasa. La rama `FE-04` diseña una recuperación para un fallo que no ocurre | `DS-11:46-48`; obligación en `ECU-11:193` | **Pendiente** | `/uml-sequence-diagram` |
| **H-16** | Moderado | *Incorrect* | **`ECU-05 CA-10` no tiene realización, y es el patrón de `H-02` en un tercer sitio.** «nada de lo no confirmado quedó escrito». Pero `DS-05:51` crea el `Consentimiento` **antes** de que `:72` arme la cápsula, y `FE-04` (`:48-50`) solo redirige a reingreso. Si la sesión expira entre esas dos líneas, **el `Consentimiento` ya está escrito** | `ECU-05:253` frente a `DS-05:48-51` | **Pendiente** | `/use-case-specifier` + `/uml-sequence-diagram` |
| **H-17** | Moderado | *Ambiguous* | **`ECU-08 RE` es incumplible por construcción.** Exige que «la combinación de columnas **no debe permitir señalar a una persona concreta** (`PRIV-R10`)». Pero un **directorio de usuarios** señala personas por definición: cada fila **es** una persona, con su alias. La obligación, tal como está redactada, no puede cumplirse — probablemente quiso decir «no debe exponer datos sensibles», que sí se cumple | `ECU-08:113` | **Pendiente** | `/use-case-specifier` |
| **H-18** | Menor | *Missing* | **El diálogo del *kill switch* no nombra el efecto antes de confirmar.** `ECU-10 RE` lo exige; `DS-10:42` dice `solicitarConfirmacionDeLaAccion()`, que **pide** confirmación pero no **nombra el efecto**. `DS-11:32` sí lo hace bien, con `advertirDelAlcanceIrreversible()` | `ECU-10:208` frente a `DS-10:42` | **Pendiente** | `/uml-sequence-diagram` |
| **H-19** | Menor | *Missing* | **Nadie puede comprobar que la ventana de 7 días no exceda la retención.** `ECU-09 RE` lo exige, pero **ni `DS-09` ni `PER-01` fijan la retención de `EventoOperativo`**. La obligación no es verificable en ningún artefacto vigente | `ECU-09:121` | ***Management issue*** → `ARQ-01` | `ARQ-01` |
| **H-20** | Menor | *Inconsistent* | **Tres etiquetas con alias divergente entre diagramas.** `Gestion de cuenta (P-13)`: `B_GestionCuenta` / `B_PaginaGestionCuenta` · `Onboarding - consentimiento capa base (P-07)`: `B_OnboardingCapaBase` / `B_PantallaConsentimiento` · **`Inicio de sesion de administracion (P-04)`: `B_LoginAdmin` / `B_PaginaInicioSesionAdmin`**. `MC-00` reportó las dos primeras como «menos graves» y **no las aplicó**; **la de P-04 es nueva** — el barrido sistemático encontró lo que el hallazgo de rebote no vio. *(La cuarta divergencia, `Visitante` como `ACT_` y `E_`, es la excepción declarada `H-N`.)* **CORRECCIÓN DE ALCANCE (SD-39): eran SEIS archivos, no tres.** Este acta asignó el hallazgo solo a los `DR`; al medir las **dos familias completas** apareció que el alias minoritario de **P-04** había llegado hasta **`MC-01.puml`** y **`COD-01`** —el insumo con el que la regla #2 genera las cabeceras, así que la clase habría nacido en el código con el nombre que solo usaba un diagrama— y que **`DOP-01 §2`** nombraba una receptora con el alias de `DR-06` en vez del de `DS-06:46`. **Y hay un argumento retroactivo que solo se vio en el Bloque 7:** si el alias acaba siendo el identificador de la clase en el código, esta divergencia nunca fue cosmética. | Barrido `B-2` sobre los 14 `DR`, ampliado en SD-39 a los 14 `DS`, `MC-01`, `COD-01` y `DOP-01` | **Pendiente** | `/uml-robustness-diagram` + `/uml-sequence-diagram` + `/uml-design-class-model` |

> **`H-01` crece de 12 a 18 instancias.** Al adjudicar los **23 fragmentos `break` que la v1.0 dejó «sin desenlace legible»** aparecieron **6 más**, y forman un sub-patrón propio: `break` sobre flujos de **cancelación** (`FA-02`/`FA-03`) cuyo texto dice «**Cancela** y **vuelve** al paso 1» — `DS-04:38` · `DS-10:62` · `DS-11:50` · `DS-12:49` — más `DS-03:41` («Vuelve al paso 2»). Cancelar debe devolver al inicio, no terminar la interacción.

> **CORRECCIÓN DE ESTE ACTA (SD-39): son 17, no 18, y el reparto es 33/17.** La v1.1 contaba también `DS-03:53` como defectuoso, afirmando que su `ECU` decía «Continúa en el paso 5». **Es falso, y se comprobó releyendo la fila:** `ECU-03:80` dice «**Termina** sin acceso administrativo», así que ese `break` es **correcto** y no se tocó. La aritmética que publicó la v1.1 tampoco cerraba: decía «26 correctos y 18 defectuosos» sobre **50** fragmentos, lo que deja 6 sin clasificar, y los llamaba «falsos positivos míos» como si fueran una tercera categoría — **no lo son: son correctos**. **Reparto final, verificado sobre los 14 `.puml` tras el retrabajo: 50 = 33 `break` correctos (`Termina`) + 17 sustituidos por `opt`.** Contado de forma independiente al cerrar: quedan **33 `break`** y los `opt` pasan de 17 a **34**, que cierra exacto. Este número se equivocó **tres veces** antes de fijarse, y siempre por confiar en una heurística de extracción en vez de releer la fila de la `ECU`.

### 8-ter. Estado del retrabajo (SD-39) — **aplicado, no verificado**

> **Lee esta distinción antes que la tabla.** Lo que sigue dice qué se **aplicó**, y lo escribe **quien lo aplicó**. **No es una verificación.** El veredicto de §13 sigue siendo el de la v1.1 y **no se actualiza aquí a propósito**: la verificación del retrabajo se hace en **sesión aparte**, por decisión del líder, para que quien verifique no arrastre el anclaje de quien corrigió. Sigue sin satisfacer `IEEE 1028 §6.5.6.5` —*«rework verified by other than the author»*—, porque el verificador seguirá siendo el mismo modelo: mitiga el sesgo de **recuerdo**, no lo sustituye por independencia real. La única independencia verdadera es que lo revise el equipo humano de `CLAUDE.md §2`.

| # | Estado tras `SD-39` | Dónde comprobarlo |
|---|---|---|
| `H-01` | **Aplicado** — 17 `break` → `opt` en 7 `DS`. **No 18:** ver la corrección de arriba | `DS-03/04/05/06/10/11/12`; 33 `break` y 34 `opt` al cerrar |
| `H-02` | **Aplicado** — `ECU-04 v2.4` cambia la promesa a borrado **ordenado y reintentable**; `DS-04` reordena la cascada (`Consentimiento` primero, `Usuario` al final) y `FE-04` conserva en vez de deshacer | `ECU-04 §14`, `RE-04`, `CA-10`; `DS-04:66-68,96-98` |
| `H-03` | **Diferido con riesgo aceptado**, sin cambio | Acordado en el Acto II |
| `H-04` | **Aplicado con seis de los siete tipos.** `Sesion` queda **sin declarar por decisión**: sus campos *son* el mecanismo que `E-1`/`ADR-002 §1` difieren a `ARQ-01` | `MC-01` paquete «Tipos de transferencia»; `COD-01 §6.1` |
| `H-05` | **Aplicado** — `TRZ-01 §3.1`, los 10 RNF trazados a su **decisión de diseño**, no a clases | `TRZ-01 §3.1` y §5 |
| `H-06` | **Aplicado** — `TRZ-01 §5.3`, las **43** clases con su RF; 26/26 RF realizados | `TRZ-01 §5.3 A/B/C` |
| `H-07` | **Aplicado** — las 4 multiplicidades | `MC-01` |
| `H-08` | **Aplicado** — «cuatro» → **ocho**, y reescrito porque `H-04` lo dejó obsoleto | `MC-01_matriz_procedencia §5` |
| `H-09` | ***Management issue*** → `ARQ-01`, sin cambio | — |
| `H-10` | **Aplicado** — §12 decía «14 hallazgos, ninguno aplicado»; son **18** y ahora los 18 llevan estado | `MC-00 §6` y §12 |
| `H-11` | **Aplicado** — `revocarCapaBase(fecha : DateTime)` | `MC-01` |
| `H-12` | **Aplicado** — párrafo duplicado eliminado | `MC-00 §11` |
| `H-13` | **Aplicado** — 73 → 71 relaciones… **y después a 80**, al dibujar las 9 dependencias que el modelo debía por su propia regla. Entra como hecho canónico **`H-29`**, que no existía | `HECHOS_CANONICOS H-29`; `MC-00 §3` |
| `H-14` | **Aplicado** — obligación **retirada** de `ECU-11`; era `RE-06`, no `RE-05` | `ECU-11 §RE` |
| `H-15` | **Aplicado** — `FE-04` informa el fallo sin haber suprimido nada | `ECU-11`, `DS-11:69-71` |
| `H-16` | **Aplicado** — `CA-10` (no `CA-12`) declara que el `Consentimiento` **sí** puede quedar escrito | `ECU-05 CA-10` |
| `H-17` | **Aplicado** — reformulado a «no expone dato sensible ni contenido individual» | `ECU-08 RE-04` |
| `H-18` | **Aplicado** — el diálogo nombra el efecto antes de confirmar | `DS-10:63` |
| `H-19` | ***Management issue*** → `ARQ-01`, sin cambio | — |
| `H-20` | **Aplicado en los seis archivos**, no en tres | `DR-06/10/12`, `DS-10`, `MC-01`, `COD-01`, `DOP-01` |

**Resumen: 17 aplicados · 1 diferido con riesgo aceptado (`H-03`) · 2 heredados por `ARQ-01` (`H-09`, `H-19`).** Ninguno abierto sin destino.

### 8-quater. Hallazgos que el propio retrabajo destapó (SD-39)

No estaban en la v1.1. Se listan porque una revisión que solo publica lo que encontró en su primera pasada oculta el rendimiento real del retrabajo.

| # | Sev. | Hallazgo | Estado |
|---|---|---|---|
| `H-21` | Menor | **`MC-00 §6` no daba estado a `H-E`, `H-I` ni `H-O`** — se contaban 15 de 18, y esos tres son justo los que siguen **abiertos** | Aplicado |
| `H-22` | Menor | La matriz remitía «los **seis** casos sin procedencia» a `§6`: son **siete** y están en `§9` (`§6` son los enumerados) | Aplicado |
| `H-23` | Menor | La matriz daba «**37** dependencias del espacio de la solución» — era el número de **clases**. Son **42 + 12 = 54**, e **idéntico antes y después de `H-04`**, medido contra `HEAD`: estuvo mal desde `v1.0`. Tras las 9 nuevas, **44 + 19 = 63** | Aplicado |
| `H-24` | **Moderado** | **`INDICE_MAESTRO` declaraba `TRZ-DS-01` en `v1.1` y `v1.0`** cuando su ficha va por `v1.3` — **y el bloque 4 de `verificar_coherencia.py` no puede verlo**: su regex de ID lee `TRZ-DS-01` como `DS-01` y atribuye la versión a otro artefacto, que además es un `.puml` sin ficha, así que la comparación se **salta en silencio**. Es el **único ID compuesto** del repositorio | **Dato corregido; el script NO.** Arreglar el instrumento es decisión aparte |
| `H-25` | Menor | `COD-01` no tenía fila `v1.2` en su historial pese a declararla en la ficha; el historial de `DOP-01` tenía `v0.1` **por encima** de `v1.2`, y el de `HECHOS_CANONICOS`, `v1.0` entre `v1.4` y `v1.3` | Aplicado |
| `H-26` | **Moderado** | **La regla #2 destapó que 20 de las 43 clases se emitían con nombre que NO es identificador válido** (`public class Presentacion / landing (P-01) {`). El generador de la skill usa la **etiqueta** y no el **alias**; **las 20 tienen alias válido**, así que el defecto es del generador, no del modelo | **Aplicado** con herramienta propia y versionada (`scripts/generar_cabeceras_mc01.py`); el defecto se reporta al mantenedor de la skill, como `H-M`/`H-M2` |
| `H-27` | Menor | `MC-01`, `MD-01` y `DCU-01` **no declaraban `title`**, así que sus `.svg` salían sin identificarse — el mismo defecto que `PDR-01 §7` cazó en 9 de 14 | Aplicado en los tres |
| `H-28` | Menor | **`COD-01` no reflejaba las 6 clases que `H-04` añadió**: seguía afirmando que «los siete tipos con nombre no tienen clase que los declare», ya falso para seis | Aplicado — nueva `COD-01 §6.1` |

**Fecha objetivo de todo lo abierto:** antes del inicio de la **fase 3** (construcción); `H-09` y `H-19` antes de `ARQ-01`. La fecha de calendario la asigna el líder del proyecto — este acta fija el hito, no el día.

**Responsable de todos los puntos de acción:** Jonatan Estiven Sánchez Vargas (líder), con reparto al equipo a su criterio. §5.5.6 deja la asignación al seguimiento de gestión, no a la revisión.

## 9. Verificaciones que salieron limpias — y se dicen

Una revisión que solo lista defectos no informa de lo que sí se comprobó.

- Validador **calibrado** contra los 16 fixtures antes de usarlo.
- **150/150** controladores de robustez con caso de prueba; **0** flujos sin caso.
- Los **8 conteos canónicos** reproducidos exactos contra los `.puml`.
- `verificar_procedencia_mc01.py`: **0 discrepancias** (emparejamiento exacto, no por bolsa de palabras).
- **Las 16 pantallas de `DIS-00` tienen clase frontera** (16 + el diálogo de confirmación = 17 de las 21 de solución). Contraste que ningún validador hace.
- **21/21** clases de solución marcadas `<<solucion>>` con justificación en `matriz_procedencia §4` — que es exactamente lo que la regla #5 acepta como andamiaje legítimo. **Dirección «sobra diseño»: sin hallazgos.**
- **26/26** RF con caso de uso propio y único, diagrama de secuencia y rango de casos de prueba. **Dirección «falta funcionalidad»: sin hallazgos.**
- Las **6 entidades sin atributos** llevan su causa escrita **dentro del `.puml`**, no solo en el certificado.
- Las **3 rutas de borrado** de `CapsulaDePerfil` (`borrarCompleta`, `dejarDeExistir`, `suprimir`) están **todas trazadas** a un mensaje: ninguna operación huérfana.
- **0** tipos vagos (`Object`, `var`), **0** nombres sin intención (`doStuff`, `process`).
- **Cero patrones introducidos**: ninguna factoría, ningún repositorio, ningún *singleton*. No hubo patronización prematura.

## 10. Las siete determinaciones de IEEE 1028 §5.5.6

| Determinación | Respuesta |
|---|---|
| ¿El producto está **completo**? | **Sí** en cobertura: criterio de entrada cumplido, 9 de 10 reglas ejecutadas, la #2 diferida con razón declarada |
| ¿**Conforma** a normas, planes y procedimientos? | **Con dos desviaciones**: `H-01` (semántica del operador UML) y `H-07` (multiplicidades exigibles en esta etapa) |
| ¿Los **cambios** están bien implementados y afectan solo lo previsto? | **Sí.** Costura con `RPD-01` (*Aceptado con verificación de retrabajo*) sin regresiones; los conteos canónicos no se movieron |
| ¿Es **adecuado para su uso previsto**? | **No sin corregir `H-02`.** La regla #4, ejercida por el líder, concluye que la reversión dibujada no es construible sobre `ADR-002-D5` + `ADR-003` |
| **¿Está listo para la siguiente actividad (codificar)?** | **No todavía.** Dos mayores con corrección acordada y no aplicada. Lo estará al verificarse el retrabajo |
| ¿Obligan los hallazgos a **mover el calendario**? | **No.** Las correcciones son acotadas: 12 sustituciones de operador, un párrafo de `ECU-04`, definiciones de tipo y filas de trazabilidad. Ninguna toca la arquitectura |
| ¿Hay **anomalías en otros elementos**? | **Sí, una**: `H-09`, los códigos HTTP que ningún artefacto de diseño transporta hacia `ARQ-01` |

## 11. *Management issues* (§5.7 los exige aparte)

1. **`H-09`** — `ARQ-01` hereda los códigos de estado comprometidos por las `ECU` sin que ningún artefacto de diseño se los entregue.
2. ~~**La regla #2 queda diferida con disparador.**~~ ✅ **Ejercida en `SD-39`.** `H-04` era prerrequisito y se cumplió, así que **no salió ningún `???`** — pero salió algo que ningún validador había visto: **20 de las 43 clases se emitían con nombre que no es identificador válido**, porque el generador toma la etiqueta y no el alias (`H-26` de §8-quater). Las cabeceras pasaron revisión del líder y **se versionan** (`MC-01_cabeceras.txt`), con un bloque de frescura en `verificar_coherencia.py` para que no se desincronicen.
3. ~~**El render de `MC-01.svg` sigue sin generarse.**~~ ✅ **Generado y mirado en `SD-39`**, después del retrabajo como estaba previsto. El aplazamiento resultó acertado —seis hallazgos acabaron tocando el `.puml`—, y la inspección visual dio **tres hallazgos que ninguna comprobación estructural podía dar**.
4. **La revisión se hizo con dos roles**, no con el equipo técnico completo en sesión. La regla #4 se ejerció por delegación del líder, y así queda declarado — es la misma limitación que `RPD-01` registró en su hallazgo `H-05`.

## 12. Informe de decisiones (ISO/IEC/IEEE 12207 §6.3.3)

La salida (d) —*«resolution, decision rationale and assumptions»*— es la que suele perderse, y la que hace auditable la decisión meses después.

| Asunto | Alternativas examinadas | Elección | Razonamiento y supuestos |
|---|---|---|---|
| **`H-02`** | (A) cambiar la promesa por orden seguro + reintento · (B) `TransactWriteItems` · (C) diferir a `ARQ-01` con riesgo declarado · (D) declarar la regla #4 no ejecutada | **(A)** | La garantía que importa al usuario no es «atómico» en sentido técnico sino *«al borrar mi cuenta dejo de poder usar el sistema y mis datos desaparecen»*. Un orden de borrado que empieza por el `Consentimiento` la entrega sin transacciones, funciona sobre cualquier almacén y **no adelanta `ARQ-01`**. (B) compra una garantía más cara de la que el MVP necesita y obliga a decidir claves —`ADR-002 §1`: «fijar claves antes de esa convergencia produce retrabajo garantizado»—, además de chocar con el tope de 100 ítems de `TransactWriteItems` frente a un `ContadorDeUsoDiario` **por día de uso**. **Supuesto declarado:** que el borrado en DynamoDB es idempotente, de modo que reintentar es seguro |
| **`H-01`** | corregir ahora · diferir · falso positivo | **Corregir ahora** | Es la correspondencia texto↔diseño que la compuerta protege, y cuesta 12 sustituciones de operador. **Supuesto:** que la semántica UML de `break` es la que rige; `DS-00` **no declara** una convención propia que la sustituya — si se declarara, `H-01` pasaría a falso positivo y habría que escribirla |
| **`H-03`** | corregir · diferir · reabrir · falso positivo | **Diferir con riesgo aceptado** | Delegado por el líder al revisor. Funciona; partir P-13 alcanza tres casos de uso, sus secuencias y sus casos de prueba, y el CDR es una compuerta, no un rediseño. **Condición de revisión:** si P-13 gana operaciones o un cuarto caso de uso, se reabre. ISO 90003 §8.3.4.1 se cumple: la consecuencia está entendida |
| **`H-04` a `H-08`, `H-10` a `H-13`** | corregir · diferir | **Corregir ahora** | Baratos y de destinatario único. `H-04` además **desbloquea la regla #2**, que el líder quiere ejercer después |
| **Regla #2** | generar ahora · generar tras las correcciones · no generar | **Generar tras las correcciones**, con revisión humana previa al versionado | Decisión del líder. Coherente con `CLAUDE.md §6` («no se escribe código todavía») y con `H-04`, que hoy las haría salir con `???` |

## 13. Veredicto

**Propuesto por la revisión: `REINSPECCIÓN REQUERIDA`.**

> **Sigue vigente en la v1.2, y no por inercia.** El retrabajo de `SD-39` está **aplicado** —§8-ter—, pero **aplicar no es verificar**, y quien aplicó no puede firmar que lo hizo bien sin arrastrar su propio anclaje. Por decisión del líder, la **verificación del retrabajo y el veredicto que resulte se hacen en sesión aparte**, sobre los artefactos y este acta, no sobre el razonamiento de quien corrigió. Hasta entonces el veredicto **no se toca**: cambiarlo aquí sería exactamente la anti-ratificación que la regla #9 prohíbe. **Y la limitación de fondo se declara igual:** el verificador seguirá siendo el mismo modelo, así que se mitiga el sesgo de **recuerdo**, no se alcanza la independencia que `IEEE 1028 §6.5.6.5` pide. Esa la da el equipo humano de `CLAUDE.md §2`, y este acta no la sustituye.

**Condición que lo justifica:** se hallaron **tres anomalías Mayores** (`H-01`, `H-02` y, nueva en la v1.1, **`H-14`**). La escala de disposición de IEEE 1028 §6.5.6.5 reserva *Accept with rework verification* a los paquetes con **solo** moderados o menores; con un mayor abierto corresponde *Reinspect* — *"The software product cannot be accepted. Once anomalies have been resolved a reinspection should be scheduled to verify rework."*

**El veredicto no mejoró por haber revisado más, y así estaba previsto.** La ampliación de cobertura de la v1.1 se emprendió sabiendo que podía empeorarlo, y lo empeoró: de dos Mayores a tres, y de 13 hallazgos a 20. Registrarlo importa, porque la tentación contraria —dar por bueno lo que costó esfuerzo— es justo lo que la skill advierte que no se negocie.

**Y sigue sin ser un rechazo del paquete.** Las verificaciones limpias de §9 y §7-bis describen un diseño que hace bien lo difícil: **150/150** controladores con eco y con caso de prueba, **16/16** pantallas trazadas, **0** flujos sin fragmento, prohibiciones realizadas como **ausencias declaradas** en vez de tácitas, y `ECU-07` —el caso de uso de seguridad— cerrando **12/12**. Lo que la escala refleja es que **tres defectos afectan al comportamiento**, no a la forma.

**Alcance de la reinspección: acotado, aunque más ancho que en la v1.0.** Modo *Verificar retrabajo* sobre `DS-03`, `DS-04`, `DS-05`, `DS-06`, `DS-10`, `DS-11`, `DS-12`, `ECU-04`, `ECU-05`, `ECU-08`, `ECU-09`, `ECU-10`, `ECU-11`, `MC-01`, `MC-00`, `TRZ-01` y los `DR` que toca `H-20`. No procede repetir la revisión: las diez reglas ya corrieron **con cobertura completa** y sus resultados están aquí.

**Quien verifica el retrabajo no puede ser quien lo hizo** (§6.5.6.5: *"other than the author"*). Si las correcciones se aplican con las skills hermanas, la verificación vuelve a esta compuerta.

**El veredicto lo determina el líder del proyecto**, no esta skill (§5.2.1). Lo anterior es la propuesta de la revisión con su condición.

> **Freno declarado (Wiegers):** no se pide revisar el mismo material más de **tres veces**. Ésta es la primera pasada del CDR. Si a la tercera el paquete sigue sin pasar, el problema no es la revisión: es el artefacto o su alcance, y eso también sería un hallazgo.

## 14. Certificado de auditoría interna del acta

| Criterio de parada | Estado |
|---|---|
| 0 hallazgos críticos **en el acta** | ✅ |
| 0 hallazgos mayores **en el acta** | ✅ |
| ≤ 2 menores documentados | ✅ **1**: la revisión se hizo con **dos roles**, no con el equipo técnico en sesión. **El menor «(a) el fan-out cubrió 6 de 14» queda CERRADO en la v1.1**: son 14/14 y 168/168 obligaciones emparejadas |
| Cada `H-XX` con severidad, categoría, ubicación verificable, corrección y destinatario | ✅ **20/20** |
| Cada regla declarada ejecutada o no ejecutada, sin huecos | ✅ 10/10 |
| Dos pasadas consecutivas sin hallazgos nuevos | ✅ |

**Estado: `AUDITORÍA SUPERADA`**, con **un** menor declarado.

**Cinco correcciones de medición propia quedan declaradas** —dos de la v1.0 (§3.4 y §7) y tres de la v1.1 (§7-bis.4)—, porque una revisión que no publica sus propios errores de instrumentación no merece crédito por los ajenos. Juntas habrían producido **más de noventa hallazgos falsos** si la regla de releer cada hallazgo mecánico en su `archivo:línea` no existiera:

| Error | Falsos que habría producido |
|---|---|
| El extractor de relaciones perdía las 9 con multiplicidad entrecomillada | Acoplamiento mal medido en el triaje 5/20/80 |
| El normalizador del replay convertía `**tono**,` en `tono ,` | 1 fila válida descartada, recall falseado |
| El comparador `B-1` no partía el camelCase | **78** controladores como huérfanos |
| El barrido de `break` aceptó `reintent`, que casa con «Termina; reintenta más tarde» | **6** de 12 |
| *(v1.0)* Se invocó `validate_cdr.py` con el índice `CP-00` en vez del plan completo | **42** advertencias |

**La lección que el acta se lleva, y que vale más que cualquiera de los 20 hallazgos:** en esta revisión, **la herramienta se equivocó más veces que el diseño revisado**. Ningún error llegó al tablero, y no fue por suerte: fue por la regla de que **todo hallazgo mecánico se relee en su línea antes de admitirse**, y de que **la fila que falla se descarta, no se repara**.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.3 | 2026-08-05 | J. Sánchez | **Corrección de una contradicción interna de la v1.2.** §6 seguía declarando la regla **#2** como «NO EJECUTADA — diferida con disparador» y la **revisión visual del `.svg`** como capa no ejecutada, cuando `SD-39` cerró las dos: la #2 se ejerció y destapó `H-26`, y el render está generado y mirado. La v1.2 actualizó §14 y §8-ter pero **no la tabla de cobertura**, que es donde un lector comprueba si la compuerta corrió entera. **Con esto, las diez reglas quedan ejecutadas.** Hallada al preparar el encargo de la verificación independiente: se corrige antes de entregarlo, en vez de dejar un defecto conocido para que lo encuentre el revisor. |
| v1.1 | 2026-08-04 | J. Sánchez | **Cobertura completa.** Los dos huecos declarados en la v1.0 quedan cerrados: **14/14** especificaciones extraídas y **168/168 obligaciones emparejadas** (eran 6/14 y 4/72). Añadidos los **8 validadores sobre los 31 `.puml`** —con las cuatro banderas del de secuencia, que `DS-00` nunca transcribió— y **tres comprobaciones cruzadas nuevas**: los 150 controladores contra los mensajes de los `DS` (**150/150**), barrido de nombres entre los 14 `DR` (**`H-D` cerrado**, 3 alias divergentes → `H-20`) y las 16 pantallas de `DIS-00` contra los `boundary` (**16/16**). Adjudicados los **23 `break`** que quedaron sin desenlace legible: `H-01` pasa de **12 a 18** instancias. **7 hallazgos nuevos** (`H-14`…`H-20`), uno **Mayor**: `H-14`, la auditoría del reinicio de caracterización **no existe** en `DS-11`. Total **20 hallazgos, 3 mayores**; tasa de **0,57/página** frente a 0,37 — la cobertura parcial escondía hallazgos. **El veredicto empeoró por revisar más, y estaba previsto que pudiera.** Se declaran **tres errores de instrumentación propios** más (78 + 6 falsos positivos evitados). |
| v1.0 | 2026-08-04 | J. Sánchez | Creación (`SD-37`). Compuerta CDR ejecutada en modo completo: 10 reglas (9 ejecutadas, la #2 diferida con disparador), 13 hallazgos, 2 mayores. Validador calibrado contra los 16 fixtures; 55 → 13 advertencias al corregir el marco de invocación; 8 conteos canónicos reproducidos; fan-out con 72/72 filas verificadas. Veredicto propuesto: **Reinspección requerida**, con alcance acotado al retrabajo. |
