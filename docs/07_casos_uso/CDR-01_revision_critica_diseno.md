# CDR-01 — Acta de Revisión Crítica del Diseño (CDR)
**ID:** CDR-01 · **Familia:** CDR (compuerta ICONIX entre el diseño detallado y el código) · **Hogar:** `docs/07_casos_uso/` · **Fecha:** 2026-08-04 · **Versión:** v1.9 (verificación independiente acotada del material nuevo de `SD-45`/`SD-46`; ver §8-nonies). v1.8 (**el líder determina el veredicto: `Aceptado con verificación de retrabajo`**, tras cerrarse en `SD-45`/`SD-46` los cuatro Mayores y los tres Moderados de la cuarta verificación; ver §13). v1.7 (cuarta verificación independiente y adversarial de `SD-44`; incluye en la misma versión las tres correcciones del acta; ver §8-octies y §13). v1.6 (tercera verificación independiente y adversarial del retrabajo `SD-43`; ver §8-septies y §13). v1.5 (segunda verificación independiente y adversarial del retrabajo `SD-40…SD-42`; ver §8-sexies y §13). v1.4 (verificación independiente y adversarial del retrabajo de `SD-39`; ver §8-quinquies y §13). v1.3 (SD-39: §6 deja de declarar la regla #2 y la revisión visual como no ejecutadas — ambas se cerraron en el retrabajo). v1.2 (SD-39: el retrabajo queda **aplicado y registrado** —§8-ter y §8-quater—, con dos etiquetas y la aritmética de `H-01` corregidas; **el veredicto no se toca**: lo determina la verificación independiente). v1.1 (cobertura completa: 14/14 especificaciones, 168/168 obligaciones emparejadas, los 8 validadores sobre los 31 `.puml`, y tres comprobaciones cruzadas nuevas. **7 hallazgos nuevos, uno de ellos Mayor**; `H-01` crece de 12 a 18 instancias). v1.0 (compuerta inicial, 13 hallazgos) · **Estado:** **CERRADA** (compuerta determinada por el líder el 2026-08-05).
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

> **Instantánea histórica del paquete que entró al CDR en v1.0/v1.1.** Las cifras de §2–§5
> describen lo recibido antes de `SD-39`; no son el estado vigente posterior al retrabajo. Los
> recuentos actuales y autoritativos de v1.4 están en §8-quinquies y siguen a
> `HECHOS_CANONICOS`.

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

> **Lee esta distinción antes que la tabla.** Lo que sigue dice qué se **aplicó**, y lo escribió **quien lo aplicó**. **No era una verificación.** En v1.2 el veredicto de §13 se conservó a propósito y se anunció una sesión aparte. Esa versión suponía que el verificador sería otra sesión del mismo modelo; la ejecución real de v1.4 fue distinta —GPT-5/Codex verificó el retrabajo de Claude Opus— y se registra en §8-quinquies. Aun así, no satisface `IEEE 1028 §6.5.6.5` —*«rework verified by other than the author»*—: la independencia real la aporta el equipo humano.

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
| `H-20` | **Aplicado en los siete archivos**, no en tres. La v1.2 decía seis aunque enumeraba siete; `VI-04` lo corrige | `DR-06/10/12`, `DS-10`, `MC-01`, `COD-01`, `DOP-01` |

**Resumen: 17 aplicados · 1 diferido con riesgo aceptado (`H-03`) · 2 heredados por `ARQ-01` (`H-09`, `H-19`).** Ninguno abierto sin destino.

### 8-quater. Hallazgos que el propio retrabajo destapó (SD-39)

No estaban en la v1.1. Se listan porque una revisión que solo publica lo que encontró en su primera pasada oculta el rendimiento real del retrabajo.

| # | Sev. | Hallazgo | Estado |
|---|---|---|---|
| `H-21` | Menor | **`MC-00 §6` no daba estado a `H-E`, `H-I` ni `H-O`** — se contaban 15 de 18, y esos tres son justo los que siguen **abiertos** | Aplicado |
| `H-22` | Menor | La matriz remitía «los **seis** casos sin procedencia» a `§6`: son **siete** y están en `§9` (`§6` son los enumerados) | Aplicado |
| `H-23` | Menor | La matriz daba «**37** dependencias del espacio de la solución» — era el número de **clases**. Son **42 + 12 = 54**, e **idéntico antes y después de `H-04`**, medido contra `HEAD`: estuvo mal desde `v1.0`. Tras las 9 nuevas, **44 + 19 = 63** | Aplicado |
| `H-24` | **Moderado** | **`INDICE_MAESTRO` declaraba `TRZ-DS-01` en `v1.1` y `v1.0`** cuando su ficha va por `v1.3` — **y el bloque 4 de `verificar_coherencia.py` no puede verlo**: su regex de ID lee `TRZ-DS-01` como `DS-01` y atribuye la versión a otro artefacto, que además es un `.puml` sin ficha, así que la comparación se **salta en silencio**. Es el **único ID compuesto** del repositorio | **Estado histórico en `SD-39`: dato corregido; script no. Estado vigente: CERRADO por `SD-42`**, que añadió el regex de ID compuesto; ejercitado en v1.7. |
| `H-25` | Menor | `COD-01` no tenía fila `v1.2` en su historial pese a declararla en la ficha; el historial de `DOP-01` tenía `v0.1` **por encima** de `v1.2`, y el de `HECHOS_CANONICOS`, `v1.0` entre `v1.4` y `v1.3` | Aplicado |
| `H-26` | **Moderado** | **La regla #2 destapó que 20 de las 43 clases se emitían con nombre que NO es identificador válido** (`public class Presentacion / landing (P-01) {`). El generador de la skill usa la **etiqueta** y no el **alias**; **las 20 tienen alias válido**, así que el defecto es del generador, no del modelo | **Aplicado** con herramienta propia y versionada (`scripts/generar_cabeceras_mc01.py`); el defecto se reporta al mantenedor de la skill, como `H-M`/`H-M2` |
| `H-27` | Menor | `MC-01`, `MD-01` y `DCU-01` **no declaraban `title`**, así que sus `.svg` salían sin identificarse — el mismo defecto que `PDR-01 §7` cazó en 9 de 14 | Aplicado en los tres |
| `H-28` | Menor | **`COD-01` no reflejaba las 6 clases que `H-04` añadió**: seguía afirmando que «los siete tipos con nombre no tienen clase que los declare», ya falso para seis | Aplicado — nueva `COD-01 §6.1` |

### 8-quinquies. Verificación independiente del retrabajo (v1.4)

**Desviación declarada.** El modo normal de verificar retrabajo parte de un veredicto previo
`Aceptado con verificación de retrabajo`. Esta verificación parte de **`Reinspección requerida`**.
Se ejecuta igualmente porque su objeto no es repetir el CDR, sino intentar refutar cada corrección
de `SD-39` contra el *diff* y los artefactos resultantes.

**Identidad y límite de independencia.** La verificación la realizó **OpenAI Codex, modelo GPT-5,
invocado mediante la herramienta Codex**, distinto de **Claude Opus**, el modelo que aplicó el
retrabajo. Un modelo distinto es mejor que una sesión nueva del mismo modelo porque no comparte
necesariamente sus puntos ciegos. **No satisface, sin embargo, IEEE 1028 §6.5.6.5:** la independencia
real la aporta la revisión del equipo humano del proyecto. Esta acta propone; el líder determina.

**Primera escritura, tras verificar los tres Mayores.** Se deja deliberadamente antes de terminar
los barridos restantes, para que el resultado sustantivo no dependa de completar trabajo mecánico.

| Objeto intentado refutar | Resultado | Severidad · categoría | Ubicación verificable | Evidencia independiente |
|---|---|---|---|---|
| `H-01` — 17 `break` sustituidos | **REFUTADO** | **Mayor · Inconsistent** | `DS-03:43`; `DS-04:41,51,95`; `DS-05:64,98`; `DS-06:73,79,102,107`; `DS-10:75,79`; `DS-11:52,56,69`; `DS-12:50,54`, frente a las filas homónimas de sus `ECU` | El *diff* sí contiene exactamente **17** sustituciones y las 17 filas textuales dicen «Vuelve» o «Cancela y vuelve». Pero un fragmento `opt` solo ejecuta o salta su cuerpo: **no vuelve al paso indicado ni excluye el sufijo de éxito que sigue**. Ejemplos decisivos: tras cancelar en `DS-04:41-43` se comprueba titularidad y se entra al borrado; tras `FE-03` en `:51-53` ocurre lo mismo. En `DS-06`, un mensaje inválido o limitado continúa hacia el *gate* y el proveedor; un fallo/timeout del proveedor continúa hacia «texto generado». En `DS-10`, `DS-11` y `DS-12`, cancelar continúa respectivamente hacia el cambio global, el borrado y la revocación. La corrección cambió el callejón sin salida por una **caída al flujo de éxito**. |
| `H-02` — borrado ordenado y reintentable | **REFUTADO en su realización de secuencia** | **Mayor · Inconsistent** | `ECU-04 FE-04`, `RE-04`, `CA-10`; `DS-04:61-115` | La especificación sí retiró la atomicidad imposible y exige informar un estado parcial, conservar lo ya borrado y reintentar. `DS-04:95-99` lo dibuja dentro de un `opt`, pero al cerrarlo continúa sin alternativa excluyente a `:112-115`: pasa al paso 4 y `cerrarSesionYConfirmarQueNoQuedaDatoRecuperable()`. Así, el diseño confirma éxito aun en el fallo parcial que `ECU-04` ordena **no confirmar**. La misma causa que refuta `H-01` mantiene abierto este Mayor. |
| `H-14` — auditoría del reinicio | **CONFIRMADO** | — | `REQ-01 RF-18/RF-22`; `ECU-11 RE-06`; `DS-11` | `RF-22` exige que la cápsula deje de existir; no exige auditar. `RF-18` limita la auditoría al *kill switch* y prohíbe datos de usuario. El barrido de requisitos no encontró otra obligación vigente de auditar el reinicio. Retirar la exigencia autoimpuesta de `ECU-11`, en vez de inventar persistencia personal, vuelve a alinear texto y secuencia con minimización. |

**Hallazgo de la verificación `VI-01`.** Las sustituciones `break` → `opt` son una corrección
sintáctica que no implementa el desenlace textual. El defecto afecta siete secuencias y mantiene
abiertos `H-01` y la realización de `H-02`. **Disposición propuesta:** rediseñar cada rama con una
estructura que haga mutuamente excluyentes el reintento/cancelación/fallo y el sufijo de éxito
(`loop`/`alt` o equivalente UML explícito), regenerar los SVG y reinspeccionar las 17 ramas contra
su fila de `ECU`. **Responsable:** Jonatan Estiven Sánchez Vargas, con reparto al equipo.
**Fecha objetivo:** antes de iniciar la fase 3.

#### Resultado sobre los veinte hallazgos originales

| Hallazgo | Resultado adversarial | Evidencia sobre el artefacto resultante |
|---|---|---|
| `H-01` | **REFUTADO** | Es `VI-01`: los 17 `opt` caen al sufijo de éxito. El recuento 33/17 sí es correcto; la semántica, no. |
| `H-02` | **REFUTADO** | `ECU-04` cambió correctamente la promesa, pero `DS-04` confirma éxito tras `FE-04`; además, la robustez, el delta, la proyección para código y la prueba conservan la reversión antigua (`VI-02`). |
| `H-03` | **CONFIRMADO como diferimiento legítimo** | P-13 mantiene 17 operaciones para CU-04/11/12. El riesgo, el disparador —que crezca o gane un cuarto CU— y el responsable están declarados; no se silenció el anti-patrón. |
| `H-04` | **CONFIRMADO con la excepción declarada** | `MC-01:490-531` define las seis clases de transferencia; `ContextoInicialConversacionalV1` carece de línea de vida y `Sesion` pertenece al mecanismo `E-1`/`ARQ-01`. La ausencia está escrita en el modelo y en la matriz. |
| `H-05` | **CONFIRMADO** | `TRZ-01 §3.1` tiene una fila para cada `RNF-01…RNF-10` y distingue lo realizado, lo comprobable después y lo heredado por `ARQ-01`. |
| `H-06` | **CONFIRMADO** | `TRZ-01 §5.3` contiene 27 filas de solución y 16 del problema; su cierre da 43/43 clases y 26/26 RF. |
| `H-07` | **CONFIRMADO** | Las cuatro relaciones señaladas llevan multiplicidad; el recuento independiente del modelo da 80 relaciones reales. |
| `H-08` | **CONFIRMADO** | `MC-01_matriz_procedencia §5` dice ocho, lista ocho y justifica los dos que siguen sin clase. |
| `H-09` | **CONFIRMADO como herencia explícita** | Los códigos HTTP siguen fuera de los mensajes, pero el hallazgo permanece visible como *management issue* cuyo receptor es `ARQ-01`; no se presentó como corregido. |
| `H-10` | **CONFIRMADO** | `MC-00 §6` clasifica los 18 hallazgos y §12 reproduce el mismo inventario y sus estados. |
| `H-11` | **CONFIRMADO** | `MC-01` declara `revocarCapaBase(fecha : DateTime)`. |
| `H-12` | **CONFIRMADO** | El cierre duplicado ya no está en `MC-00 §11`. |
| `H-13` | **CONFIRMADO** | Recuento de primera mano: 80 = 17 relaciones heredadas del dominio + 63 dependencias; estas últimas se reparten 44 desde solución y 19 desde problema. |
| `H-14` | **CONFIRMADO** | `RF-22` exige que desaparezca la cápsula, no auditoría; `RF-18` limita la auditoría al *kill switch*. Retirar `RE-06` de `ECU-11` evita inventar persistencia personal. |
| `H-15` | **REFUTADO** | `DS-11:69-72` informa que la cápsula sigue intacta, pero el `opt` se cierra y el flujo continúa a `:87-90`, donde declara inhabilitado el chat y ofrece rehacer la caracterización. `DR-11`, `DOP-01`, `COD-01` y `CP-11` conservan además `C_DeshacerBorrado` (`VI-02`). |
| `H-16` | **REFUTADO por propagación incompleta** | `ECU-05 CA-10` sí admite que el consentimiento confirmado permanezca. Sin embargo, `DS-05:68-72` ubica la expiración “en cualquier paso” únicamente antes de crear el consentimiento, y `CP-05:24` no comprueba ni que el chat quede inhabilitado ni que la capa base confirmada pueda permanecer. El estado corregido no tiene realización ni prueba completa (`VI-02`). |
| `H-17` | **REFUTADO parcialmente** | `ECU-08 RE-04` fue corregido, pero el mismo documento mantiene las afirmaciones vivas “ID truncado… no permite señalar a una persona” (`:32`), “sin conocer a nadie en particular” (`:92`) y “sin acceso a datos individuales” (`:147`). Contradicen la precisión de que cada fila identifica un titular (`VI-03`). |
| `H-18` | **CONFIRMADO** | `DS-10:62-70` nombra explícitamente el efecto antes de confirmar y `CP-10:17` verifica el texto observable. El `opt` de cancelación sigue afectado por `VI-01`, pero no refuta esta adición. |
| `H-19` | **CONFIRMADO como herencia explícita** | La retención de `EventoOperativo` continúa sin fijar y sigue enrutada a `ARQ-01`; no fue tapada ni contada como corrección. |
| `H-20` | **CONFIRMADO en sustancia; REFUTADA su cifra original** | Los alias quedaron unificados y no quedan usos vivos de `B_OnboardingCapaBase`, `B_LoginAdmin` ni `B_GestionCuenta`. La v1.2 decía “seis archivos” y enumeraba **siete**: tres `DR`, un `DS`, `MC-01`, `COD-01` y `DOP-01`. §8-ter queda corregido en v1.4 (`VI-04`). |

#### Resultado sobre los ocho hallazgos del propio retrabajo

| Hallazgo | Resultado adversarial | Evidencia sobre el artefacto resultante |
|---|---|---|
| `H-21` | **CONFIRMADO** | La tabla de `MC-00 §6` da estado a `H-E`, `H-I` y `H-O`; son los tres abiertos. |
| `H-22` | **CONFIRMADO** | La matriz remite los **siete** casos sin procedencia a §9. |
| `H-23` | **CONFIRMADO** | Recuento independiente sobre `MC-01`: 63 dependencias = 44 desde clases de solución + 19 desde clases del problema. |
| `H-24` | **CONFIRMADO en v1.4; CERRADO después por `SD-42`** | En esta pasada el dato de `INDICE_MAESTRO` estaba corregido y el regex aún capturaba `DS-01`. `SD-42` añadió `(?:-[A-Z]{2,4})?` en `verificar_coherencia.py:303`. Ejercitado de nuevo en v1.7: ante `TRZ-DS-01 v1.2`, el patrón anterior captura `DS-01`; el vigente captura `TRZ-DS-01`. La fila 16 del tablero está correctamente cerrada. |
| `H-25` | **CONFIRMADO en sus tres destinatarios; aparece un caso análogo en esta acta** | Los historiales de `COD-01`, `DOP-01` y `HECHOS_CANONICOS` tienen el orden/fila corregidos. `CDR-01`, en cambio, declaraba v1.2 en la ficha y omitía su fila de historial; se corrige en esta v1.4 y se registra como `VI-05`. |
| `H-26` | **CONFIRMADO sobre la salida; NO plenamente verificado en ejecución** | `MC-01_cabeceras.txt` tiene 54 declaraciones —43 clases + 11 enumerados—, cero nombres inválidos y ningún `???` operativo; las 20 sustituciones conservan la etiqueta. El código contiene las tres guardas y retorna 3 ante error. No se pudieron provocar ejecutando el script: el entorno de esta sesión no expone un *runtime* Python utilizable ni la herramienta `generate_code_headers.py` de la skill. |
| `H-27` | **CONFIRMADO** | Los tres `.puml` declaran `title` y sus tres `.svg` contienen el título renderizado. |
| `H-28` | **CONFIRMADO en §6.1; la proyección completa sigue inconsistente** | `COD-01 §6.1` contiene las seis clases. No obstante, `COD-01 §2` conserva un total vivo de 37 y dos operaciones de reversión que ya no existen en `MC-01`; queda incluido en `VI-02`/`VI-06`. |

#### Hallazgos nuevos de la verificación independiente

| # | Sev. | Categoría §6.8.2 | Ubicación verificable | Evidencia y disposición propuesta |
|---|---|---|---|---|
| **`VI-01`** | **Mayor** | **Inconsistent** | Los 17 `opt` citados en la primera tabla; sufijos de éxito de sus siete `DS` | Los desenlaces de retorno/cancelación/fallo no son excluyentes del éxito. **Corregir antes de fase 3** con fragmentos UML que modelen rutas mutuamente excluyentes y reinspeccionar las 17 contra su `ECU`. Responsable: líder, con reparto al equipo. |
| **`VI-02`** | **Mayor** | **Inconsistent** | `DR-04:28,71-73`; `DR-11:26,58-60`; `DOP-01:140`; `COD-01:78,128`; `CP-04:23`; `CP-11:22`; `DS-05:68-72`; `CP-05:24` | El retrabajo cambió `ECU`/`DS`/`MC` pero no propagó la nueva semántica a robustez, delta, proyección para código y pruebas: esos artefactos aún mandan “deshacer” borrados, y la expiración corregida de CU-05 no está realizada ni probada después del consentimiento. **Reabrir los artefactos dueños, no corregirlos desde esta acta**, y repetir la costura `ECU→DR→DS→MC→COD/CP`. Responsable y fecha: líder/equipo, antes de fase 3. |
| **`VI-03`** | Moderado | **Inconsistent** | `ECU-08:32,92,113,147` | La precisión válida de `RE-04` convive con tres sobrepromesas viejas en el mismo artefacto. **Alinear el lenguaje de minimización** sin retirar el directorio mínimo acordado. Responsable y fecha: líder/equipo, antes de fase 3. |
| **`VI-04`** | Menor | **Incorrect** | `CDR-01 §8-ter`, fila `H-20` | Son siete archivos, no seis. Se deja corregido en la lectura de v1.4; no altera el resultado sustantivo de `H-20`. |
| **`VI-05`** | Menor | **Not conforming to standards** | Ficha e historial de `CDR-01` | Faltaba la fila v1.2 pese a que la ficha la declaraba. Esta v1.4 repone la fila; queda cerrado dentro del único archivo que el revisor puede editar. |
| **`VI-06`** | **Mayor** | **Inconsistent** | `AGENTS.md:39`; `CLAUDE.md:35`; `DOP-01 §8`; `COD-01 §2`; `HECHOS_CANONICOS:73`; `ESTADO_PIPELINE:126,169` y su cierre tras la tabla; `INDICE_MAESTRO:78` | Las afirmaciones vivas discrepan del canon: 192/37/21/200/35 frente a **193/43/27/201/51**; la tabla de obsoletos llama vigente a 21; el tablero todavía dice 21/21, ordena emitir v1.3 y concluye “once abiertos/dos nuevos” aunque el recuento de sus filas es **6 cerrados + 9 abiertos + 3 declarados sin acción inmediata**. `DOP-01`, además, es el artefacto dueño de `H-23` y él mismo sigue diciendo 192. Al subir esta acta a v1.4, el índice queda declarando `CDR-01 v1.3` y conserva como vigente que los 20 hallazgos están resueltos. **Propagar el canon, el resultado del CDR y la versión del acta antes de fase 3.** Responsable: líder/equipo. |
| **`VI-07`** | Moderado | **Risk-prone** | `scripts/verificar_coherencia.py:352-397` y `:428-470` | Los bloques 3 y 5 dependen de `git diff --name-only HEAD`: son útiles como guardas precommit para archivos rastreados modificados, pero en una rama ya comiteada pasan en verde sin revisar nada y omiten archivos no rastreados. Prueba fuera del repositorio: tras añadir un `.md` no rastreado, `git status --short` lo mostró y `git diff --name-only HEAD` devolvió vacío. **No usar esos bloques como evidencia de una reinspección de commits**; añadir un modo con base/rango explícito si se decide ampliar el instrumento. Responsable: líder/mantenedor del script; hito: antes de volver a citar los bloques como evidencia de una rama. |
| **`VI-08`** | Moderado | **Risk-prone** | `scripts/verificar_coherencia.py:123-129` | `VALORES_OBSOLETOS` solo vigila cuatro hechos y no cubre 192→193, 37→43, 21→27, 200→201 ni 35→51. Por eso no detecta `VI-06`. **Ampliar el conjunto o añadir comprobaciones dirigidas en los consumidores canónicos**, sin convertir bloques históricos en falsos positivos. Responsable: líder/mantenedor del script; hito: junto con el cierre de `VI-06`, antes de fase 3. |

#### Recuentos, reglas e instrumentos

- Recuento directo de `MC-01`: **43 clases = 16 problema + 27 solución; 201 pares (clase, operación) = 193 nombres distintos + 8 repeticiones; 51 atributos; 11 enumerados; 80 relaciones = 17 + 63; 63 dependencias = 44 + 19**.
- Recuento directo de los 14 `DS`: **283 mensajes, 33 `break`, 34 `opt`**. Los catorce `.svg` declaran los mismos 283 mensajes y ninguno es más antiguo que su `.puml`. Los 14 pares de robustez tampoco tienen derivado más antiguo.
- Las **diez reglas de §6 sí tienen evidencia de haber sido ejecutadas**. La afirmación 10/10 se confirma, pero no equivale a que el paquete pase: las reglas 9/10 producen `VI-01`; las 6/8, `VI-02`; la 5, `VI-06`; y la regla 2 solo pudo verificarse de forma estática en esta sesión.
- Los cuatro conteos nuevos de `verificar_coherencia.py` usan patrones que reproducen 43/201/51/80 sobre la fuente y fallarían al variar cualquiera de esos totales. El bloque 5 compara correctamente fechas **solo** para `.puml` rastreados y sin comitear; `VI-07` delimita su utilidad real.

**No plenamente verificado en forma dinámica, y por qué.** Los ocho validadores externos que §7-bis
nombra no viven en este repositorio ni en las skills disponibles de esta sesión. Además, `python` no
está en `PATH`; `py -0p` informa que no hay *runtimes* registrados, y la única instalación localizada
está fuera de las rutas ejecutables de la sesión. Por ello no se volvieron a ejecutar las líneas base
0/0, 0/6 y 0/9 ni se provocaron los fallos Python del generador/verificador. Sí se contrastaron de
primera mano las fuentes, sus recuentos, los regex y la frescura. La reproducción del bloque 4 sí
detecta **un error inevitable bajo el alcance de escritura**: `INDICE_MAESTRO` declara `CDR-01 v1.3`
y esta acta debe quedar en v1.4. Corregirlo exigiría editar un segundo archivo, expresamente
prohibido en esta verificación; se incorpora a `VI-06`. Esta limitación **no mejora ni degrada** el
veredicto: aun en el mejor resultado posible de los validadores quedan Mayores abiertos.

**Fecha objetivo de todo lo abierto:** antes del inicio de la **fase 3** (construcción); `H-09` y `H-19` antes de `ARQ-01`. La fecha de calendario la asigna el líder del proyecto — esta acta fija el hito, no el día.

**Responsable de todos los puntos de acción:** Jonatan Estiven Sánchez Vargas (líder), con reparto al equipo a su criterio. §5.5.6 deja la asignación al seguimiento de gestión, no a la revisión.

### 8-sexies. Segunda verificación independiente del retrabajo (v1.5)

**Objeto y encuadre.** Se intentaron refutar los seis commits de `f11988c..HEAD`
(`7d6b95f`, `6cb11b9`, `8e837ee`, `d732c9a`, `239c019`, `0a38639`), no sus
mensajes. La evidencia fue el *diff*, las filas vigentes de las `ECU`, los `.puml`
resultantes y ejecuciones sobre copias temporales fuera del repositorio.

**Identidad y límite de independencia.** Esta verificación la realizó **OpenAI Codex,
modelo GPT-5, invocado mediante la herramienta Codex**, distinto de **Claude Opus**,
modelo que aplicó `SD-39`, `SD-41` y `SD-42`. Un modelo distinto es mejor que otra
sesión del mismo modelo, pero **no satisface IEEE 1028 §6.5.6.5**. La independencia
real la aporta el equipo humano del proyecto. Esta acta propone; el líder determina.

#### Tablero de la segunda verificación

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **SVI-01** | **Mayor** | **Inconsistent** | Trece `break` de `DS-03:50`, `DS-04:48,58,102`, `DS-05:77,124`, `DS-10:82,86`, `DS-11:59,63,76`, `DS-12:57,61`; filas vigentes `ECU-03:79`, `ECU-04:175,183,184`, `ECU-05:166,167`, `ECU-10:161,170`, `ECU-11:174,182,183`, `ECU-12:161,169`; propagación falsa en `CHANGELOG:33`, `ESTADO_PIPELINE:112`, `REGISTRO_DECISIONES` `SD-41` y `DS-00 §12` | **`SD-41` queda refutado en 13/17 ramas.** Se abrieron y contrastaron una por una las diecisiete filas: las diecisiete dicen **«Vuelve»** o **«Cancela y vuelve»**; ninguna de estas diecisiete dice «Termina». Los cuatro `alt` de `DS-06` sí excluyen el sufijo de éxito y el `loop` realiza el retorno. En las otras trece, `break` ejecuta su operando en lugar del resto de la interacción y **termina el intento**: no modela volver a un paso anterior. `SD-41` confundió «no ejecutar el remanente» con «volver». **Reabrir `VI-01`, rediseñar esas trece ramas con iteración/alternativas explícitas y repetir ECU↔DS antes de fase 3.** Responsable: líder/equipo. |
| **SVI-02** | Moderado | **Risk-prone** | `scripts/verificar_coherencia.py:66-83,88-102,234-235` | Las exenciones de `CDR-01` como archivo histórico y de toda línea `**Insumos:**` son **globales**, no acotadas al pasaje histórico. Sabotaje idéntico en copias: con la versión anterior (`239c019`), `**Insumos:** estado vigente saboteado: 1.500 caracteres` y `CDR-01:2 estado vigente saboteado: 1.500 caracteres` producen `[H-01]` y código 1; con `0a38639`, ambos pasan con «RESULTADO: sin errores». En el árbol real, los valores obsoletos encontrados en `MC-00:5`, `TRZ-DS-01:5` y los pasajes de `CDR-01` son procedencia/historia legítima; **no se encontró un defecto vivo actualmente silenciado**, pero el regex puede silenciarlo. **Acotar la exención a citas versionadas y secciones históricas, no al archivo/línea completos.** Responsable: mantenedor del script; antes de usar el bloque 1 como compuerta de otra propagación. |
| **SVI-03** | Menor | **Incorrect** | `REGISTRO_DECISIONES` `SD-42` y comentario de `comprobar_historial()` | Recuento reproducido sobre el padre de `SD-42` (`239c019`) con el mismo regex `FILA_HISTORIAL` y comparación semántica de versiones: **21 descendentes, 3 ascendentes y 7 mixtos**, no **23/3/5**. Los siete mixtos eran `PER-01`, `MD-01`, `ECU-04`, `ECU-05`, `ECU-08`, `ECU-09`, `CP-00`; los tres ascendentes, `ECU-02`, `ECU-03`, `CP-01`. La mayoría descendente sigue sosteniendo la convención, pero su medición publicada es incorrecta. **Corregir la cifra de procedencia al propagar esta acta.** Responsable: dueño de gobernanza. |

#### Adjudicación rama por rama de `VI-01`

| Rama | Texto vigente de la ECU | Fragmento actual | Resultado adversarial |
|---|---|---|---|
| `DS-03 FE-01` | `ECU-03`: **Vuelve al paso 2** | `break` | **REFUTADO**: termina; no vuelve |
| `DS-04 FA-03` | `ECU-04`: **Cancela y vuelve al paso 1** | `break` | **REFUTADO** |
| `DS-04 FE-03` | `ECU-04`: **Vuelve al paso 2** | `break` | **REFUTADO** |
| `DS-04 FE-04` | `ECU-04`: **Vuelve al paso 1**, con reintento | `break` | **REFUTADO**; tampoco realiza el reintento |
| `DS-05 FE-02` | `ECU-05`: **Vuelve al paso 4** | `break` | **REFUTADO** |
| `DS-05 FE-03` | `ECU-05`: **Vuelve al paso 8** | `break` | **REFUTADO** |
| `DS-06 FE-03` | `ECU-06`: **Vuelve al paso 2** | rama de `alt` dentro de `loop` | **CONFIRMADO** |
| `DS-06 FE-05` | `ECU-06`: **Vuelve al paso 2** tras espera | rama de `alt` dentro de `loop` | **CONFIRMADO** |
| `DS-06 FE-06` | `ECU-06`: **Vuelve al paso 4** | rama de `alt` dentro de `loop` | **CONFIRMADO** |
| `DS-06 FE-07` | `ECU-06`: **Vuelve al paso 4** | rama de `alt` dentro de `loop` | **CONFIRMADO** |
| `DS-10 FA-02` | `ECU-10`: **Cancela y vuelve al paso 1** | `break` | **REFUTADO** |
| `DS-10 FE-03` | `ECU-10`: **Vuelve al paso 2** | `break` | **REFUTADO** |
| `DS-11 FA-03` | `ECU-11`: **Cancela y vuelve al paso 1** | `break` | **REFUTADO** |
| `DS-11 FE-03` | `ECU-11`: **Vuelve al paso 2** | `break` | **REFUTADO** |
| `DS-11 FE-04` | `ECU-11`: **Vuelve al paso 1** | `break` | **REFUTADO** |
| `DS-12 FA-03` | `ECU-12`: **Cancela y vuelve al paso 1** | `break` | **REFUTADO** |
| `DS-12 FE-03` | `ECU-12`: **Vuelve al paso 2** | `break` | **REFUTADO** |

#### Resultado sobre `VI-02…VI-08`

| Objeto | Resultado | Evidencia de primera mano |
|---|---|---|
| `VI-02` | **CONFIRMADO en la costura aplicada, pero afectado aguas arriba por `SVI-01`** | `DR-04` conserva/reintenta sin prometer atomicidad; `DR-11` informa sin deshacer; `DOP-01` usa `dejarDeExistir()`; `COD-01` proyecta `conservarLoYaSuprimido()` y `revocarCapaBase(fecha : DateTime)`; `CP-04/05/11` prueban la semántica nueva. `verificar_procedencia_mc01.py` dio **SIN DISCREPANCIAS**. No obstante, los `break` de `DS-04 FE-04` y `DS-11 FE-04` vuelven a contradecir el retorno de sus ECU: es el mismo `SVI-01`, no un cuarto hallazgo. |
| `VI-03` | **CONFIRMADO** | Barrido conceptual de `ECU-08`: las menciones restantes de reidentificación/datos individuales son historial, negación explícita o la cita literal de `VIS-01` acompañada por su lectura correcta. `RA-07` mantiene visible la sobrepromesa externa; no se recortaron las cinco columnas de `RF-15`. |
| `VI-04…VI-06` | **CONFIRMADOS** | Los siete archivos de alias quedaron unificados; ficha/historial de `CDR-01 v1.4` existen; el canon propagado cuadra con los recuentos reproducidos de abajo. |
| `VI-07` | **CONFIRMADO con alcance declarado** | `python scripts/verificar_coherencia.py --base f11988c` ejecutó los bloques 3 y 5 contra los seis commits y dio cero errores. Sabotajes separados demostraron que el bloque 3 detecta ficha e historial omitidos y el 5 un `.svg` más antiguo. |
| `VI-08` | **CONFIRMADO en cobertura de patrones; aparece `SVI-02` por las exenciones** | Los cinco patrones nuevos dispararon al insertar sus unidades obsoletas; `H-28` se comprobó por estructura, no por afirmación: las seis clases `FilaDeDirectorio`, `AgregadoDeCuentas`, `AgregadoDeUso`, `AlcanceDeBorrado`, `Persona` y `ReferenciaDeDerivacion` existen en `MC-01` y no aparecen en ningún `DS` ni en el delta de secuencia. Por tanto **27 en MC-01 y 21 en DS/DOP son medidas distintas y correctas**. |
| `SD-40-H1` | **CONFIRMADO dinámicamente** | Modelo temporal con `as B_Landing-P01`: el regex nuevo capturó el alias completo y la guarda lo rechazó como identificador inválido; con `B_Landing_P01` corrigió la etiqueta; una referencia externa a la etiqueta activó la tercera guarda. Cero escrituras en el repositorio. |

#### Sabotaje de los seis bloques y recuentos de no regresión

| Bloque | Sabotaje en copia temporal | Resultado observado |
|---|---|---|
| 1. Hechos canónicos | `README`: afirmación viva «282 mensajes» | `[H-22]`, código 1 |
| 2. Residuos de stack | `README`: «Stack vigente: Django» | `[STACK]`, código 1 |
| 3. Disciplina de ficha | Cambio de título de `CDR-01` sin versión ni historial | dos `[FICHA]`, código 1 |
| 4. Versiones declaradas | `TRZ-DS-01 v9.9` en `INDICE_MAESTRO` | `[VERSION]` contra su ficha `v1.4`, código 1; confirma el ID compuesto |
| 5. Artefactos derivados | Cambio de `DS-03.puml` sin regenerar SVG | `[DERIVADO]`, código 1 |
| 6. Historial completo | ficha `v9.9` sin fila; luego fila `v0.0` fuera de orden | `[HISTORIAL]` en ambos sabotajes, código 1 |

Recuentos ejecutados sobre las fuentes actuales, no citados: robustez **262 =
15 actores + 38 bordes + 150 controladores + 59 entidades**; secuencia **283
mensajes**; `MC-01` **43 clases, 201 operaciones, 51 atributos y 80 relaciones**;
**193 nombres de operación distintos + 8 repeticiones**. El generador de robustez
en modo `--verificar` dio 14/14 sin colisiones y reprodujo 262; el de secuencia
dio 14/14 sin colisiones y sus mensajes suman 283; la procedencia de `MC-01`
terminó sin discrepancias.

**No plenamente verificado, y por qué.** `validate_robustness_puml.py` y
`validate_sequence_puml.py`, citados por el paquete, no están en este repositorio
ni en las skills expuestas a esta sesión; por eso no se reproducen como propios
sus «0 errores / 10 advertencias». Sí se ejecutaron los verificadores propios
disponibles y los dos generadores en modo de solo verificación. No se marca la
capa ausente como verde.

**Resultado final real de `python scripts/verificar_coherencia.py`.** Código **1**,
con **dos** errores, ambos del bloque 4: `INDICE_MAESTRO:2` y `:78` siguen
declarando `CDR-01 v1.4` mientras esta acta ya declara `v1.5`. Los bloques 1, 2,
3, 5 y 6 dieron «ERRORES: ninguno». Corregir el índice exigiría modificar un
segundo archivo y está expresamente fuera del alcance de escritura de esta
verificación; el rojo se declara, no se oculta.

### 8-septies. Tercera verificación independiente del retrabajo (v1.6)

**Objeto y encuadre.** Se intentó refutar el único commit `a23f9c4` (`SD-43`)
contra su padre `9cf81cd`. El mensaje del commit y la entrada `SD-43` se usaron
solo como mapa; la evidencia fue el *diff*, las filas vigentes de las `ECU`, los
`.puml` resultantes y las ejecuciones registradas abajo. Esta sección se escribió
incrementalmente después de cada foco; ningún estado parcial se cuenta como pase.

**Identidad y límite de independencia.** Esta tercera verificación la realizó
**OpenAI Codex, modelo GPT-5, invocado mediante la herramienta Codex**, distinto
de **Claude Opus**, modelo que aplicó `SD-39`, `SD-41`, `SD-42` y `SD-43`. Un
modelo distinto es mejor que otra sesión del mismo modelo, pero **no satisface
IEEE 1028 §6.5.6.5**. La independencia real la aporta el equipo humano del
proyecto. Esta acta propone; el líder determina.

#### Foco 1 — adjudicación rama por rama de `SVI-01`

Se abrieron las trece filas vigentes y sus seis `.puml`; no se aceptó el recuento
de `SD-43`. Resultado parcial tras el primer foco: **5 ramas confirmadas y 8
refutadas**. El `alt` sí evita la caída al éxito en los ciclos de confirmación,
pero dos ramas posteriores siguen cayendo al sufijo de éxito y cuatro retornos
no reentran en el paso exigido.

| Rama | Desenlace literal vigente | Fragmento resultante y punto de reentrada | Resultado adversarial |
|---|---|---|---|
| `DS-03 FE-01` | `ECU-03:79`: «Vuelve al paso 2» | `loop` `:49-62`, cuyo primer mensaje repetido es escribir y enviar credenciales (paso 2), con `alt` `:58-61` | **CONFIRMADO** |
| `DS-04 FA-03` | `ECU-04:175`: «Cancela y vuelve al paso 1» | `loop` `:50-62`, que deja fuera la solicitud de eliminar y la verificación de sesión/rol (`:43-48`) y empieza en la respuesta del sistema dentro del paso 1; `alt` `:56-61` | **REFUTADO**: no reentra al inicio exacto del paso 1 |
| `DS-04 FE-03` | `ECU-04:183`: «Vuelve al paso 2» | Comparte el bucle anterior y por tanto reentra en el paso 1, no en el 2; la nota `:71-78` reconoce los dos destinos, pero no declara la aproximación | **REFUTADO** |
| `DS-04 FE-04` | `ECU-04:184`: «Vuelve al paso 1, con el reintento disponible» | Solo `alt` `:121-126`, **sin `loop`**; al cerrarse ejecuta `:139-142`, queda como `Visitante` y confirma que no queda dato recuperable aunque la supresión quedó parcial | **REFUTADO** |
| `DS-05 FE-02` | `ECU-05:166`: «Vuelve al paso 4» | `loop` propio `:81-89`, que vuelve a presentar la capa base (paso 4), con `alt` `:85-88` | **CONFIRMADO** |
| `DS-05 FE-03` | `ECU-05:167`: «Vuelve al paso 8» | `loop` propio `:132-139`, que repite los autorreportes del paso 8, con `alt` `:135-138` | **CONFIRMADO** |
| `DS-10 FA-02` | `ECU-10:161`: «Cancela y vuelve al paso 1» | `loop` `:76-96` reentra en la confirmación del paso 2, no en la lectura/elección del paso 1; no hay nota de aproximación | **REFUTADO** |
| `DS-10 FE-03` | `ECU-10:170`: «Vuelve al paso 2» | El bucle sí reentra en el paso 2, pero el mensaje `:93` se llama `rechazarConfirmacionInvalidaYVolverAlPaso1()`, en contradicción con la ECU y con el propio fragmento | **CONFIRMADO en control; nomenclatura inconsistente** |
| `DS-11 FA-03` | `ECU-11:174`: «Cancela y vuelve al paso 1» | `loop` `:62-73` repite advertencia/confirmación, pero deja fuera elegir el reinicio y enumerar su alcance (`:46-56`), que forman el paso 1 | **REFUTADO** |
| `DS-11 FE-03` | `ECU-11:182`: «Vuelve al paso 2» | El mismo bucle reejecuta parte del paso 1 antes de confirmar; no vuelve exactamente al paso 2 ni declara aproximación | **REFUTADO** |
| `DS-11 FE-04` | `ECU-11:183`: «Vuelve al paso 1» | Solo `alt` `:84-88`, **sin `loop`**; la nota `:104-108` lo interpreta como «nueva invocación», pero el `.puml` continúa a los pasos 4 y 5 (`:111-119`) e informa éxito tras el fallo | **REFUTADO** |
| `DS-12 FA-03` | `ECU-12:161`: «Cancela y vuelve al paso 1» | `loop` `:61-71` reentra en el paso 2. La nota `:86-89` sí declara la aproximación | **REFUTADO**: una nota no realiza el retorno textual |
| `DS-12 FE-03` | `ECU-12:169`: «Vuelve al paso 2» | El mismo bucle reentra exactamente en la confirmación del paso 2 | **CONFIRMADO** |

Las guardas de los cinco ciclos son prosa, pero expresan predicados comprobables:
credenciales coincidentes, confirmación explícita/válida, capa base otorgada y
autorreportes bien formados. No se abre hallazgo por verificabilidad de la guarda.
La aproximación por destinos distintos solo está declarada explícitamente en
`DS-12`; falta en `DS-04`, `DS-10` y `DS-11`. Aun donde está declarada, cambia la
conducta que la ECU prescribe y no puede degradarse a legibilidad.

#### Tablero de hallazgos de la tercera verificación — parcial tras el foco 1

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`TVI-01`** | **Mayor** | **Inconsistent** | `DS-04:121-142` frente a `ECU-04:184`; `DS-11:84-119` frente a `ECU-11:183` | `FE-04` quedó en un `alt` sin iteración. En ambas secuencias, cerrar el `alt` ejecuta mensajes de éxito posteriores; en `DS-04` se confirma borrado total después de una cascada parcial y en `DS-11` se declara el chat inhabilitado y se ofrece rehacer una caracterización que sigue intacta. **Rediseñar antes de fase 3 y añadir/ajustar las pruebas derivadas si cambia el comportamiento observable.** |
| **`TVI-02`** | **Mayor** | **Inconsistent** | `DS-04:43-62`, `DS-10:76-96`, `DS-11:62-73`, `DS-12:61-71`; filas `ECU-04:175,183`, `ECU-10:161,170`, `ECU-11:174,182`, `ECU-12:161,169`; `CP-10:21`; `CP-11:19` | Un solo bucle representa dos destinos distintos y ejecuta uno solo, o empieza dentro del paso: quedan refutadas `DS-04 FA-03/FE-03`, `DS-10 FA-02`, `DS-11 FA-03/FE-03` y `DS-12 FA-03`. Solo `DS-12` lo llama aproximación. Las pruebas propagan dos destinos falsos: `CP-1109` y `CP-1207` esperan paso 1 donde sus ECU dicen paso 2. Declararlo no restaura la correspondencia ECU↔DS: **modelar los retornos exactos y alinear las pruebas existentes antes de fase 3**. |
| **`TVI-03`** | Menor | **Inconsistent** | `DS-10:92-93` frente a `ECU-10:170` y al `loop` `:76-96` | El control vuelve efectivamente al paso 2, pero la operación afirma `VolverAlPaso1()`. **Renombrar al corregir `TVI-02`** para que la operación no contradiga su flujo. |

#### Foco 2 — `SD-43-H1` y anidamiento contado con Python

Un analizador de pila sobre los fragmentos PlantUML contó cada `break` y su
profundidad de `loop`; después se contrastaron las seis filas implicadas de
`ECU-06` y los mensajes `DS-06:158-160`.

**Adjudicación de `SD-43-H1`: confirmado en sustancia, refutado en su recuento.**
`DS-06` contiene seis `break`, pero solo **tres** están dentro de `loop 1..20`
(`FE-01 :73`, `FE-08 :90`, `FA-01 :126`); `FE-02 :45`, `FE-09 :51` y `FE-04
:57` están antes del bucle. Los tres internos tienen desenlace textual terminal:
`ECU-06:166` dice «Termina» para `FE-01`, `:173` «Termina la sesión» para
`FE-08` y `:156` «Finaliza» para `FA-01`. En UML, sus `break` salen del bucle y
continúan en `DS-06:158-160`: el Usuario todavía «cierra la conversación» y solo
después el sistema ejecuta `cerrar()` y `descartarContenido()`. El cierre técnico
y el descarte podrían ser limpieza común legítima, pero el primer mensaje es una
nueva acción normal del actor después de que la ECU ya terminó la sesión; el
diagrama no distingue limpieza obligatoria de continuación del flujo básico.

La decisión de **no corregirlo al final de `SD-43` es defendible**: resolverlo
exige decidir rama por rama qué limpieza debe ejecutarse y no autoriza un parche
por cansancio. Lo que no es defendible es cerrar la compuerta con ese Mayor
conocido. **Mientras siga abierto, bloquea el paso al código.**

**Pregunta gemela sobre los seis diagramas tocados.** El mismo analizador contó
**16**, no 22, `break`: `DS-03` 2, `DS-04` 2, `DS-05` 3, `DS-10` 3, `DS-11` 3
y `DS-12` 3. Los **16/16** tienen profundidad de `loop` **0**. Por tanto `SD-43`
**no sembró `SD-43-H1` en ninguno de los seis bucles nuevos**. Sí hay mensajes
después de todos esos bucles —15, 14, 14/3, 5, 9 y 8 respectivamente—, pero no
pueden alcanzarse por un `break` interno porque no hay ninguno. La cifra «22»
solo aparece al sumar los 16 de esos seis diagramas y los seis de `DS-06`; no
describe los seis diagramas tocados ni significa que los 22 estén fuera de todo
`loop`.

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`TVI-04`** | **Mayor** | **Inconsistent** | `DS-06:69-160`; `ECU-06:156,166,173` | Python contó tres `break` internos; los tres desenlaces terminan/finalizan, pero el `.puml` continúa al paso 8 y exige «cerrar la conversación» al Usuario. **Separar la limpieza común del flujo normal y adjudicar qué se ejecuta tras cada terminación antes de fase 3.** |
| **`TVI-05`** | Menor | **Incorrect** | `ESTADO_PIPELINE:176,182`; `DS-00` historial `v1.9`; `CHANGELOG` `SD-43`; `REGISTRO_DECISIONES` `SD-43` | Las afirmaciones dicen seis `break` dentro del `loop` de `DS-06`; son tres. En los seis diagramas tocados hay 16, no 22. **Corregir los recuentos al propagar el retrabajo, sin borrar el registro histórico del error.** |

#### Foco 3 — `SVI-02` y `SVI-03` provocados y recontados

**`SVI-02`: CONFIRMADO.** Se archivó `HEAD` fuera del repositorio y se ejecutó
allí `verificar_coherencia.py --sin-git`. La copia basal dio código 0. En otra
copia se añadieron tres afirmaciones vivas: «1.500 caracteres» en una línea
`**Insumos:**`, y bajo `## 13` una subsección `####` con «1.500 caracteres» y
«282 mensajes». La ejecución produjo exactamente **tres** errores (`H-01`,
`H-22`, `H-01`) y código 1. Por el lado contrario, las citas versionadas reales
de `MC-00` —`DS v1.1 (282 mensajes)` y `DOP v1.1 (192 operaciones)`— no dieron
falso positivo. Una copia adicional añadió «282 mensajes» bajo un `####`
subordinado a `### 8-sexies`; dio código 0, porque seguía dentro de la sección
histórica.

El seguimiento que solo reinicia en `^#{2,3}\s` es **correcto para esta
jerarquía**: `####` no abre una sección de primer nivel del acta, sino una
subsección que debe heredar el carácter histórico o vivo de su madre. La prueba
gemela lo confirmó: el `####` bajo §13 vivo disparó y el `####` bajo §8 histórico
no. No se encontró una cita de procedencia legítima convertida en falso positivo.

**`SVI-03`: cifra CONFIRMADA; propagación histórica incompleta.** Sobre un
`git archive` de `239c019`, con el mismo `FILA_HISTORIAL` y excluyendo `grafo/`
como hace el verificador, Python reprodujo **21 descendentes, 3 ascendentes y 7
mixtos**. Los tres ascendentes fueron `ECU-02`, `ECU-03` y `CP-01`; los siete
mixtos, `PER-01`, `MD-01`, `ECU-04`, `ECU-05`, `ECU-08`, `ECU-09` y `CP-00`.
Las correcciones prometidas están en `REGISTRO_DECISIONES SD-42`, `CHANGELOG` y
el comentario del bloque 6. Sin embargo, el barrido por concepto encontró dos
filas históricas no rectificadas que todavía presentan **23/3/5 como hecho**:
`MD-01` historial `v1.8` y `CP-01` historial `v1.2`. No son afirmaciones vivas
del estado actual —el bloque 1 las exime con razón—, pero tampoco están tachadas
ni etiquetadas como medición falsa; el registro histórico quedó incorrecto.

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`TVI-06`** | Menor | **Incorrect** | `MD-01_modelo_dominio.md`, historial `v1.8`; `CP-01_pruebas_consultar_presentacion.md`, historial `v1.2` | El barrido exacto de 23/3/5 halló dos afirmaciones históricas sin rectificación. **Tachar la cifra y anotar 21/3/7 como corrección posterior**, preservando que `SD-42` publicó el valor viejo. |

#### Foco 4 — no regresión estructural, validadores y propagación

**Recuentos ejecutados sobre las fuentes.** Un extractor de mensajes sobre los 14
`DS` sumó **283** (12/16/21/23/24/49/26/13/13/21/19/17/16/13). Las declaraciones
de los 14 `DR` sumaron **262 = 15 actores + 38 bordes + 150 controladores + 59
entidades**. Los regex canónicos sobre `MC-01` dieron **43 clases, 201 operaciones,
51 atributos y 80 relaciones**; sus nombres de operación distintos fueron
**193**. El recuento independiente de invocaciones en los `DS` dio 214
invocaciones y los mismos **193 nombres distintos**, que reproduce `DOP-01`.
Las filas cuyo primer campo empieza por `CP-` sumaron **181** en `CP-01…CP-14`.

El rediseño no introduce un escenario nuevo: las trece ramas ya tienen caso de
prueba y el total **181** no necesita crecer. Sí exige corregir o completar los
resultados esperados existentes. En particular, `CP-1109` y `CP-1207` dicen
«vuelve al paso 1» aunque `ECU-10 FE-03` y `ECU-11 FE-03` dicen paso 2;
`CP-807`, `CP-703` y `CP-1306` no fijan todos el punto exacto de reentrada. El
problema es de correspondencia de las pruebas existentes, no de ausencia de un
caso adicional.

**Validadores ejecutados.** Con Python 3.13 y las rutas externas entregadas por
el líder, `validate_robustness_puml.py --domain MD-01` pasó **14/14, 0 errores**.
`validate_sequence_puml.py` con `--secuencia`, `--robustez`, `--spec` y
`--dominio` pasó **14/14, 0 errores y 10 advertencias**: 1 en `DS-02`, 4 en
`DS-06` y 1 en `DS-09/11/12/13/14`. El validador exacto de procedencia de
`MC-01` terminó **SIN DISCREPANCIAS**, con 43 clases, 27 de solución y 201
operaciones. Estos validadores comprueban estructura y cobertura; su propio
informe declara que la correspondencia fina y la asignación correcta no son
mecanizables, por lo que el verde no refuta `TVI-01/02/04`.

**Propagación barrida por concepto.** No queda ninguna afirmación viva de
`SD-41` que sostenga que los trece `break` estaban bien: en `CHANGELOG`,
`ESTADO_PIPELINE`, `REGISTRO_DECISIONES SD-41` y `DS-00` el texto está tachado o
marcado expresamente como falso. Los bloques históricos que conservan el valor
viejo están correctamente etiquetados y no se borran. Lo que sí queda vivo es
la promesa nueva de `SD-43`: «13/13 corregidos», «primer intento correcto» y
«los 22 `break` fuera de los bucles». La evidencia de esta v1.6 la refuta: seis
de trece ramas pasan, siete no; `DS-06` tiene tres `break` internos, no seis; y
`SD-43-H1` permanece Mayor.

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`TVI-07`** | **Mayor** | **Incorrect** | `ESTADO_PIPELINE` ficha y fila 19; `CHANGELOG` entrada `SD-43`; `REGISTRO_DECISIONES SD-43`; `DS-00` ficha e historial `v1.9` | La gobernanza declara `VI-01` cerrado y 13/13 ramas corregidas; la adjudicación de primera mano da **5 confirmadas / 8 refutadas** y tres Mayores abiertos. **Reabrir la fila 19 y propagar el resultado de esta acta antes de fase 3.** |

**Completitud y honestidad.** Se abrieron las trece ECU/DS, `DS-06`, las pruebas
afectadas, el instrumental y los artefactos de propagación; se ejecutaron las
cuatro capas solicitadas. No queda una capa pedida sin verificar. El resultado
final de `verificar_coherencia.py` se registra después de cerrar ficha, historial
y veredicto de esta acta, para no presentar como final un rojo transitorio.

**Resultado final real de `python scripts/verificar_coherencia.py`.** Código
**1**, con **un** error en el bloque 4: `INDICE_MAESTRO:78` declara `CDR-01 v1.5`
y esta acta ya declara `v1.6`. Los bloques 1, 2, 3, 5 y 6 dieron «ERRORES:
ninguno». Corregir el índice exigiría modificar un segundo archivo, prohibido por
el alcance de esta verificación; el rojo se declara y queda para la propagación.

### 8-octies. Cuarta verificación independiente de `SD-44` (v1.7)

**Objeto y encuadre.** Se intentan refutar los commits `c6b3351` (`SD-44`) y
`6aa158f` (cabos de gobernanza) contra sus padres. `c3f4025`, que contiene esta
misma acta v1.6, no es objeto de verificación. Los mensajes de commit y las
entradas `SD-43`/`SD-44` se usan solo como mapa. La evidencia admisible es el
*diff*, la fuente vigente, copias de sabotaje fuera del repositorio y ejecuciones
reproducibles. Esta sección se vuelca por foco; ningún resultado parcial es un
veredicto.

**Identidad y límite de independencia.** Esta cuarta verificación la realiza
**OpenAI Codex, modelo GPT-5, invocado mediante la herramienta Codex**, distinto
de **Claude Opus**, modelo que aplicó `SD-39`, `SD-41`, `SD-42`, `SD-43` y
`SD-44`. Un modelo distinto reduce puntos ciegos compartidos, pero **no satisface
IEEE 1028 §6.5.6.5**. La independencia real la aporta el equipo humano. Esta acta
propone; el líder determina (IEEE 1028 §5.2.1).

#### Foco 1 — desenlaces concretos: `TVI-01`, `TVI-03`, `TVI-04` y R4

**`TVI-01` queda confirmado como cerrado, no desplazado.** En `DS-04:132-142`,
los dos mensajes del paso 4 están dentro del operando `else la cascada se
completa`; `FE-04` solo conserva lo ya suprimido, informa el estado parcial y
ofrece reintento. En `DS-11:95-106`, los cuatro mensajes de los pasos 4 y 5 viven
dentro de `else el borrado se ejecuta`; `FE-04` solo informa que la cápsula sigue
intacta. No quedó ningún mensaje de éxito de esas dos ramas fuera de su `alt`.

**`TVI-04` queda confirmado como cerrado.** Python y lectura estructural
reproducen tres `break` internos en `DS-06` (`FE-01 :79`, `FE-08 :96`, `FA-01
:132`). Tras el `loop`, la acción normal del actor está acotada por `opt
:175-177`; solo `cerrar()` y `descartarContenido()` quedan fuera (`:179-180`).
Esto concuerda con la ECU: la `Conversacion` ya fue abierta antes de los tres
desenlaces; `FE-01` deja una conversación sin sesión, `FE-08` suspende el chat
ordinario y `FA-01` finaliza la sesión. Cerrar el objeto efímero y descartar su
contenido realiza `RF-13`/`RNF-03` en los tres casos y no es una nueva acción del
actor. No se encontró flujo normal disfrazado de limpieza.

**`TVI-03` queda confirmado como cerrado y propagado.** `DS-10:104`,
`MC-01_modelo_clases_diseno.puml:469`, `MC-01_cabeceras.txt:384` y el SVG dicen
`rechazarConfirmacionInvalidaYVolverAlPaso2()`. Un barrido por el nombre viejo
solo conserva operaciones distintas y correctas de `DS-04`/`DS-11`, además de
las citas históricas de esta acta; no queda una firma viva de la operación de
`DS-10` con `Paso1`.

**R4 queda confirmada en sus cuatro instancias.** Las guardas de `DS-04:61`,
`DS-10:87`, `DS-11:73` y `DS-12:72` nombran expresamente la cancelación además
de la confirmación válida. Antes, el operando de cancelación no satisfacía la
condición textual de salida del ciclo; ahora sí. La corrección elimina esa lectura
de iteración indefinida, aunque no decide todavía si R3 preserva la
correspondencia del punto exacto de retorno.

#### Foco 2 — sabotaje adversarial de `barrido_desenlaces.py`

**Ejecución basal.** `python docs/07_casos_uso/secuencia/scripts/barrido_desenlaces.py`
dio R1 = **0**, R2 = **0** e inventario `20 alt / 8 loop / 33 break` sobre los
14 DS. Ese verde describe el árbol actual; no demuestra por sí solo que el
instrumento sostenga la convención.

Se copió el script a `C:\Temp\sd44-adversarial`, se parametrizó **solo esa
copia** para apuntar a directorios sintéticos y se ejecutó un caso por carpeta.
Resultados provocados:

| Caso adversarial | Resultado real | Adjudicación |
|---|---|---|
| `alt` defectuoso anidado en otro `alt` | R1 = **1** | Lo caza, aunque cuenta también mensajes de un operando hermano al medir la continuación |
| `alt` defectuoso anidado en `loop` | R1 = **1** | Lo caza |
| defecto equivalente con `opt` | R1 = **0** | **Falso negativo**: el instrumento ignora `opt`, aunque esa fue precisamente la forma anterior de la caída al éxito |
| `break` interno seguido por acción del actor dentro de `alt` | R2 = **0** | **Falso negativo**: cualquier fragmento la oculta, aunque R2 exige específicamente `opt` |
| el mismo caso dentro de `critical` | R2 = **0** | **Falso negativo** |
| continuación con flecha `->>` | R1 = **0** | **Falso negativo** del regex `MENSAJE` |
| continuación con flechas `-\` y `\-` | R1 = **0** | **Falsos negativos** del regex `MENSAJE` |
| mensaje a `self` con `->` | R1 = **1** | Lo reconoce |
| mensaje entrante `[->` | R1 = **1** | Lo reconoce por coincidencia de `\S+` + `->` |
| `note over` normal dentro del `loop` | R2 = **1** | Lo caza |
| `note over`/`note right of` cuyo texto contiene una línea `end` | R2 = **0** | **Falso negativo**: el `while` que intenta saltar la nota modifica el índice de un `for`, pero el `for` vuelve a recorrer su cuerpo y toma ese `end` textual por cierre UML |
| `rnote over` con el mismo contenido | R2 = **0** | **Falso negativo**: `NOTA_INI` solo reconoce `note` |
| éxito correcto contenido en `group`, con continuación común fuera | R1 = **1** | **Falso positivo**: los mensajes se cargan solo al marco superior de la pila; el operando exterior se considera vacío |
| operando de éxito sin mensajes seguido solo por limpieza técnica común | R1 = **1** | **Falso positivo**: el regex no puede distinguir sufijo de éxito de limpieza común |

`par`, `critical` y `group` sí están en `APERTURA` y por tanto alteran la
profundidad. Deben contar como fragmentos para hallar el cierre del marco; el
defecto es tratarlos a todos como una guarda equivalente a `opt` para R2 y no
atribuir al operando exterior los mensajes válidos de un `group` anidado para
R1.

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`CVI-01`** | **Moderado** | **Risk-prone** | `barrido_desenlaces.py:10-17,20-58,119-145` | Sabotajes a–f producen falsos negativos y falsos positivos reproducibles. El instrumento **decora la convención más de lo que la sostiene**: da evidencia útil sobre el dialecto actual, pero no puede respaldar una afirmación general de R1/R2. Corregir el parser y añadir estos casos como regresión versionada antes de usar su verde como evidencia de cierre. |
| **`CVI-02`** | **Moderado** | **Not conforming to standards** | `barrido_desenlaces.py:8` frente a `AGENTS.md §0` | La ruta absoluta `C:/GitHub/alan-aura-academico/...` viola el check de independencia del repositorio y falla al clonar en otra ubicación. Resolver la ruta desde `__file__` o recibirla por argumento. |

**Veredicto del foco 2:** el comprobador actual **no sostiene por sí solo la
convención; la decora**. Sus 0/0 no quedan anulados como observación del árbol
vigente, pero sí queda refutada la sobrelectura de que «caza lo que dice cazar»
como clase general de defectos.

#### Foco 3 — R3: la fuente, los cinco CP y la información que el DS pierde

**La fuente no sostiene la conclusión fuerte de `SD-44`.** Rosenberg y Fowler
sostienen que el propósito principal del DS es asignar comportamiento y mostrar
interacciones, no definir con precisión toda la lógica de control. Eso justifica
no convertirlo en un diagrama de flujo. Pero la misma skill exige un diagrama por
caso de uso con curso básico y alternos, y su guía #6 exige correspondencia entre
texto y mensajes. Ninguna cita dice que el punto de reentrada **no sea cosa del
DS**. Al contrario, una vez que se dibuja un `loop`, su operando tiene un inicio
concreto y UML lo repite desde ese inicio. Dibujar una reentrada y declarar en una
nota que no se pretende dibujarla no elimina la semántica del fragmento.

**Los cinco CP que `SD-44` nombra sí quedaron corregidos.** Se abrieron sus filas
y las ECU dueñas: `CP-703` fija paso 2 para `ECU-03 FE-01`; `CP-807`, paso 2 para
`ECU-04 FE-03`; `CP-1109`, paso 2 para `ECU-10 FE-03`; `CP-1207`, paso 2 para
`ECU-11 FE-03`; y `CP-1306`, paso 2 para `ECU-12 FE-03`. Los dos destinos falsos
de `CP-1109`/`CP-1207` están corregidos.

**El barrido por concepto refuta que los CP capturen siempre el punto exacto.**
Quedan sin fijarlo `CP-811` (`ECU-04 FE-04`: paso 1), `CP-1108` (`ECU-10 FA-02`:
dice P-16, pero no comprueba que se repita el paso 1), y cuatro casos de `CU-06`:
`CP-011`/`CP-013` no dicen que `FE-03`/`FE-05` vuelven al paso 2, mientras
`CP-022`/`CP-023` no dicen que `FE-06`/`FE-07` vuelven al paso 4. `CP-207` y
`CP-217` sí fijan el destino observable mediante P-07/paso 8 y no se cuentan como
hueco.

**Se pierde información verificable al no dibujarla.** En `DS-04`, el mismo
`loop :61-73` reentra por la presentación del alcance (paso 1) tanto para
`FA-03` —correcto— como para `FE-03`, cuya ECU manda paso 2. En `DS-10`, el
`loop :87-107` reentra en la confirmación del paso 2 también para `FA-02`, cuya
ECU manda paso 1. `DS-11:73-84` y `DS-12:72-82` hacen lo mismo: un único inicio
para dos destinos. `DS-12:99-102` lo admite expresamente como «aproximación» y
afirma que el ciclo reentra por paso 2. El barrido por concepto encontró además
el mismo hueco preexistente en `DS-06:75-139`: el `loop` reentra por el paso 2
también para `FE-06`/`FE-07`, cuyas ECU mandan volver al paso 4. Los CP pueden probar el resultado
esperado de otra fuente, pero no vuelven verdadero el comportamiento que el DS
dibujó ni permiten derivarlo desde el DS.

**Visibilidad insuficiente.** `DS-10` y `DS-12` muestran la limitación en una
nota renderizada. En `DS-04` y `DS-11`, R3 queda principalmente en comentarios
de cabecera del `.puml`, que no aparecen en el SVG; un lector del diagrama no la
ve. La nota de `DS-11` explica `FE-04` como nueva invocación, pero no declara la
aproximación del `loop` compartido de `FA-03`/`FE-03`.

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`CVI-03`** | **Mayor** | **Inconsistent** | `DS-04:61-73`, `DS-06:75-139`, `DS-10:87-107`, `DS-11:73-84`, `DS-12:72-102` frente a sus filas `ECU`; CP citados arriba | R3 convierte una limitación legítima de propósito en licencia para conservar cinco `loop` con una reentrada concreta distinta de una o más de sus ECU. Además, seis CP no materializan la garantía general que R3 publica. **`TVI-02` sigue abierto y el barrido por concepto añade el caso preexistente de `DS-06`: R3 es una evasión bien documentada, no su solución.** Rediseñar la representación o retirar del DS el fragmento que afirma el retorno equivocado; después alinear todos los CP de retorno por concepto. |

#### Foco 4 — propagación por concepto

**`TVI-07`: la propagación de la refutación anterior sí está hecha.** En
`CHANGELOG`, `REGISTRO_DECISIONES SD-43`, `DS-00` y `ESTADO_PIPELINE` las
afirmaciones «13/13 corregidos», «22 `break`» y el cierre anterior aparecen como
historia refutada, tachada o corregida por `SD-44`. No queda una afirmación viva
de que la solución de `SD-43` pasó la tercera verificación. La fila 19 y la ficha
de `ESTADO_PIPELINE` sí declaran ahora cerrado por `SD-44`; tras `CVI-03` esa
afirmación vigente vuelve a quedar refutada y deberá reabrirse fuera del alcance
de escritura de esta acta.

**`TVI-05`: recuentos propagados.** Las cifras vivas son 16 `break` en los seis
DS tocados y tres internos en `DS-06`. Las apariciones de 22 y seis que describen
`SD-43` están tachadas o acompañadas por su corrección; no se encontró otra
afirmación vigente con esos valores.

**`TVI-06`: ocho historiales rectificados, sin noveno.** Se abrieron
`MD-01`, `ECU-02`, `ECU-03`, `ECU-04`, `ECU-05`, `ECU-08`, `ECU-09` y `CP-01`.
En los ocho, 23/3/5 está tachado y 21/3/7 identificado como corrección posterior.
Las demás coincidencias viven en `CHANGELOG`, `REGISTRO_DECISIONES`,
`ESTADO_PIPELINE` y esta acta, donde están explícitamente etiquetadas como
medición falsa o histórica. No se encontró un noveno historial sin rectificar.

No se abre un hallazgo nuevo por propagación histórica. La única afirmación viva
que vuelve a ser incorrecta nace del resultado de esta cuarta verificación:
`ESTADO_PIPELINE` fila 19 dice que `TVI-02` cerró y `CVI-03` lo refuta.

#### Foco 5 — no regresión, validadores y artefacto derivado

**Recuentos ejecutados sobre las fuentes, con un extractor independiente.** Los
14 DS suman **283 mensajes**
(`12/16/21/23/24/49/26/13/13/21/19/17/16/13`). Los 14 DR suman **262 = 15
actores + 38 bordes + 150 controladores + 59 entidades**. `MC-01` contiene **43
clases, 201 operaciones, 51 atributos y 80 relaciones**, con **193 nombres de
operación distintos**. Las filas de caso en `CP-01…CP-14` suman **181**.

**Validadores ejecutados.** Con Python 3.13 y las rutas entregadas:

- robustez: **14/14, 0 errores** con `--domain MD-01`;
- secuencia: **14/14, 0 errores y 10 advertencias** —DS-02 1, DS-06 4,
  DS-09/11/12/13/14 una cada uno—, idéntico a la línea base;
- `verificar_procedencia_mc01.py`: **SIN DISCREPANCIAS**, 43 clases, 27 de
  solución y 201 operaciones;
- `barrido_desenlaces.py`: R1 = **0**, R2 = **0**, con las limitaciones
  demostradas en el foco 2.

**`H-24` ejercitado, no solo leído.** Ante la cadena `TRZ-DS-01 v1.2`, el patrón
anterior captura `DS-01`; el regex vigente de `verificar_coherencia.py:302-303`
captura `TRZ-DS-01` y `v1.2`. `H-24` está cerrado por `SD-42`; la referencia de
§8-quinquies que lo dejaba abierto queda corregida retrospectivamente en esta
v1.7.

**El SVG de `MC-01` no es equivalente a una regeneración íntegra.** La comparación
byte a byte entre el padre de `c6b3351` y el commit demuestra que el nuevo SVG es
exactamente el anterior con una sola sustitución visible, `Paso1()` → `Paso2()`;
la etiqueta conserva `textLength="285.873"` y `lengthAdjust="spacing"`, por lo
que el dibujo visible es aceptable. Pero el bloque `<?plantuml-src ...?>` quedó
idéntico al anterior y por tanto conserva el fuente PlantUML embebido previo. El
artefacto se ve bien, pero ya no es internamente fiel a su fuente ni regenerable
desde su metadato. La ausencia de PlantUML explica la limitación; no la convierte
en regeneración.

| # | Severidad | Categoría §6.8.2 | Ubicación verificable | Evidencia ejecutada y disposición propuesta |
|---|---|---|---|---|
| **`CVI-04`** | **Moderado** | **Inconsistent** | `MC-01_modelo_clases_diseno.svg` frente a `.puml:469`; diff de `c6b3351` | El texto visible fue parcheado con equivalencia gráfica demostrada, pero el `plantuml-src` embebido quedó obsoleto. Regenerar el SVG con PlantUML 1.2026.6 cuando la herramienta esté disponible; no usar el parche manual como precedente. |

**Capas no verificadas.** PlantUML no está instalado: no se regeneró ni se hizo
una nueva inspección visual de `MC-01.svg`. Sí se verificó el diff exacto y la
integridad textual descrita arriba. No se presenta esa comprobación limitada como
render ejecutado.

**Resultado final real de `python scripts/verificar_coherencia.py`.** Código
**1**, con **un** error en el bloque 4: `INDICE_MAESTRO:78` declara `CDR-01 v1.6`
y la ficha de esta acta ya dice `v1.7`. Los bloques 1, 2, 3, 5 y 6 dieron
«ERRORES: ninguno». El índice no se corrige aquí porque el alcance de escritura
autoriza únicamente esta acta; el rojo queda declarado, no convertido en pase.

#### Pronunciamiento sobre el freno de Wiegers

`SD-44` **sí es material nuevo y sí es un replanteo real**, no un cuarto parche
disfrazado: fija R1–R4, cambia el reparto de autoridad ECU/DS/CP e instala un
instrumento versionado. Por eso esta cuarta verificación no repitió la
adjudicación rama por rama de v1.6, sino que intentó refutar la convención y el
comprobador. Sin embargo, el replanteo **no converge todavía**: R1, R2 y R4
resuelven sus clases concretas; R3 evade `TVI-02`, y el instrumento no sostiene
la generalidad que su verde sugiere. El freno no se viola al revisar material
nuevo, pero tampoco autoriza cerrar un Mayor que el material nuevo conserva.

### 8-nonies. Verificación independiente acotada de `SD-45`/`SD-46` (v1.9)

**Alcance.** Solo se verifican (1) el rediseño de `DS-04`, `DS-06`, `DS-10`,
`DS-11` y `DS-12` contra las filas ECU afectadas y (2) el comprobador
`barrido_desenlaces.py` con sus 17 *fixtures* y sabotaje nuevo sobre copias. No
se reabre la auditoría del paquete ni se revisan `CVI-04`, `ECU-06 FE-07`, la
gobernanza o los demás recuentos canónicos.

#### Segmento 1 — los cuatro `loop` y las notas de `DS-06`

**Resultado conductual: sostenido.** En `DS-04:72`, `DS-11:83` y `DS-12:81`
el `loop` abre exactamente en el mensaje del Actor que realiza el paso 2; en
`DS-10:94-111` incluye además `solicitarConfirmacionDeLaAccion()` y
`nombrarElEfectoSobreLasConversacionesAntesDeConfirmar()`, que son el lado del
Sistema del paso 2 de `ECU-10`. `RI-1` quedó corregido. Las cuatro guardas
nombran las dos respuestas y sus mensajes permiten confirmar o cancelar; las
cancelaciones `FA-03`/`FA-02` están fuera del bucle y alcanzan un `alt` cuyo
operando de éxito contiene toda la continuación. `RI-2` quedó corregido. No se
encontraron mensajes perdidos, duplicados o desplazados ni ramas de error que
caigan al sufijo de éxito.

| # | Severidad IEEE 1028 §6.8.3 | Categoría §6.8.2 | Ubicación | Evidencia y disposición |
|---|---|---|---|---|
| **`VRI-01`** | **Menor** | **Inconsistent** | `DS-06:156-157,170-173`; `DS-12:109-112,146-155` | La conducta vigente es correcta, pero las notas no convergieron: `DS-06` aún dice que `FE-07` vuelve al paso 4 y que es una discrepancia de la ECU, aunque `ECU-06 FE-07` ya vuelve al paso 2; `DS-12` aún declara una «aproximación» inmediatamente antes de afirmar que la cancelación es una nueva invocación y que la reentrada es exacta. Retirar o reescribir esas afirmaciones históricas; no afecta el flujo ejecutable del diagrama. |

**Evidencia ejecutada.** Extractor independiente sobre los 14 `.puml`:
**283 mensajes** (`12/16/21/23/24/49/26/13/13/21/19/17/16/13`). Balance de
fragmentos en los cinco DS: **5/5 sin aperturas ni cierres huérfanos**. Validador
de secuencia con cada `DR` y `ECU`: **14/14, 0 errores y 11 advertencias**; la
advertencia adicional de `DS-12` es el falso positivo declarado sobre tres
autollamadas que no comparten camino.

#### Segmento 2 — comprobador reescrito

**Resultado: la regresión versionada pasa, pero no agota el dialecto.**
`--autoprueba` ejecutó los **17/17** *fixtures* con el resultado esperado; el
barrido basal dio **R1 = 0, R2 = 0**. Sobre una fuente sintética fuera del
repositorio se introdujo un `actor "Usuario adulto"` sin alias y, después de un
`break` interno en un `loop`, la acción no acotada
`"Usuario adulto" -> Pantalla : cerrar la operacion`. El validador de secuencia
aceptó el sabotaje con **0 errores y 0 advertencias**, pero el comprobador dio
**R2 = 0**.

| # | Severidad IEEE 1028 §6.8.3 | Categoría §6.8.2 | Ubicación | Evidencia y disposición |
|---|---|---|---|---|
| **`VRI-02`** | **Moderado** | **Risk-prone** | `barrido_desenlaces.py:45-46,123-145` | **Falso negativo nuevo:** `ACTOR` solo reconoce emisores `ACT_\w+`; PlantUML también admite actores citados con espacios, que `MENSAJE` tampoco reconoce. Generalizar la detección a participantes declarados como `actor` —con o sin alias— y versionar este sabotaje. El 17/17 demuestra regresión sobre los defectos conocidos, no suficiencia general. |

**Pronunciamiento acotado.** No se hallaron Críticos ni Mayores. Esta
verificación **sostiene** —no determina— `Aceptado con verificación de
retrabajo`; el límite declarado de **IEEE 1028 §6.5.6.5 para `SD-45`/`SD-46`
queda cubierto por esta verificación independiente acotada**. `VRI-01` y
`VRI-02` no alteran la conducta de los cuatro rediseños ni obligan a reabrir el
veredicto determinado por el líder en §13.

## 9. Verificaciones que salieron limpias — y se dicen

Una revisión que solo lista defectos no informa de lo que sí se comprobó.

- Validador **calibrado** contra los 16 fixtures antes de usarlo.
- **150/150** controladores de robustez con caso de prueba; **0** flujos sin caso.
- Los **8 conteos canónicos** reproducidos exactos contra los `.puml`.
- `verificar_procedencia_mc01.py`: **0 discrepancias** (emparejamiento exacto, no por bolsa de palabras).
- **Las 16 pantallas de `DIS-00` tienen clase frontera** (16 + el diálogo de confirmación = 17 fronteras de presentación; se suman una frontera externa, dos controles, una clase de auditoría y seis tipos de transferencia para las 27 de solución). Contraste que ningún validador hace.
- **27/27** clases de solución marcadas `<<solucion>>` con justificación en `matriz_procedencia §4` — que es exactamente lo que la regla #5 acepta como andamiaje legítimo. **Dirección «sobra diseño»: sin hallazgos en el modelo; sí hay propagación documental pendiente (`VI-06`).**
- **26/26** RF con caso de uso propio y único, diagrama de secuencia y rango de casos de prueba. **Dirección «falta funcionalidad»: sin hallazgos.**
- Las **6 entidades sin atributos** llevan su causa escrita **dentro del `.puml`**, no solo en el certificado.
- Las **3 rutas de borrado** de `CapsulaDePerfil` (`borrarCompleta`, `dejarDeExistir`, `suprimir`) están **todas trazadas** a un mensaje: ninguna operación huérfana.
- **0** tipos vagos (`Object`, `var`), **0** nombres sin intención (`doStuff`, `process`).
- **Cero patrones introducidos**: ninguna factoría, ningún repositorio, ningún *singleton*. No hubo patronización prematura.

## 10. Las siete determinaciones de IEEE 1028 §5.5.6

| Determinación | Respuesta |
|---|---|
| ¿El producto está **completo**? | **Sí en cobertura de revisión; no en consistencia del paquete.** Se ejecutaron los cinco focos, pero `CVI-03` mantiene una contradicción ECU↔DS↔CP. |
| ¿**Conforma** a normas, planes y procedimientos? | **No todavía.** R3 excede lo que sostienen las fuentes y conserva retornos inconsistentes; el comprobador usa una ruta absoluta contra `AGENTS.md §0`; el SVG derivado conserva metadato obsoleto. |
| ¿Los **cambios** están bien implementados y afectan solo lo previsto? | **Parcialmente.** R1, R2, R4 y `TVI-03` están bien implementados; R3 desplaza `TVI-02`; el comprobador presenta falsos negativos/positivos. |
| ¿Es **adecuado para su uso previsto**? | **No para autorizar código.** La asignación estructural cierra, pero cinco `loop` siguen dibujando un retorno distinto de una o más de sus ECU. |
| **¿Está listo para la siguiente actividad (codificar)?** | **No.** Queda un hallazgo Mayor abierto (`CVI-03`, continuidad de `TVI-02`). |
| ¿Obligan los hallazgos a **mover el calendario**? | **Lo determina el líder.** La reinspección debe ocurrir antes de fase 3; esta revisión no dispone de un calendario para cuantificar el movimiento. |
| ¿Hay **anomalías en otros elementos**? | **Sí.** Seis CP no fijan el retorno exacto que R3 les atribuye; `ESTADO_PIPELINE` fila 19 vuelve a quedar refutada; el comprobador y el SVG requieren retrabajo. `H-24`, en cambio, está cerrado por `SD-42`. |

## 11. *Management issues* (§5.7 los exige aparte)

1. **`H-09`** — `ARQ-01` hereda los códigos de estado comprometidos por las `ECU` sin que ningún artefacto de diseño se los entregue.
2. **`H-19`** — `ARQ-01` hereda la definición de retención de `EventoOperativo`; sin ella no puede demostrarse que la ventana de siete días esté dentro del plazo.
3. ~~**La regla #2 queda diferida con disparador.**~~ ✅ **Ejercida en `SD-39`.** `H-04` era prerrequisito y se cumplió, así que **no salió ningún `???` operativo** — pero salió algo que ningún validador había visto: **20 de las 43 clases se emitían con nombre que no es identificador válido**, porque el generador toma la etiqueta y no el alias (`H-26` de §8-quater). Las cabeceras se versionan; `VI-07` limita el bloque de frescura a cambios rastreados y sin comitear.
4. ~~**El render de `MC-01.svg` sigue sin generarse.**~~ ✅ **Generado y mirado en `SD-39`**, después del retrabajo como estaba previsto. El aplazamiento resultó acertado —seis hallazgos acabaron tocando el `.puml`—, y la inspección visual dio **tres hallazgos que ninguna comprobación estructural podía dar**.
5. **La revisión se hizo con dos roles**, no con el equipo técnico completo en sesión. La regla #4 se ejerció por delegación del líder, y así queda declarado — es la misma limitación que `RPD-01` registró en su hallazgo `H-05`.
6. **La independencia de `IEEE 1028 §6.5.6.5` sigue pendiente de revisión humana.** Que GPT-5/Codex verifique el retrabajo de Claude Opus reduce puntos ciegos compartidos, pero no sustituye a un integrante humano distinto del autor.

## 12. Informe de decisiones (ISO/IEC/IEEE 12207 §6.3.3)

La salida (d) —*«resolution, decision rationale and assumptions»*— es la que suele perderse, y la que hace auditable la decisión meses después.

| Asunto | Alternativas examinadas | Elección | Razonamiento y supuestos |
|---|---|---|---|
| **`H-02`** | (A) cambiar la promesa por orden seguro + reintento · (B) `TransactWriteItems` · (C) diferir a `ARQ-01` con riesgo declarado · (D) declarar la regla #4 no ejecutada | **(A)** | La garantía que importa al usuario no es «atómico» en sentido técnico sino *«al borrar mi cuenta dejo de poder usar el sistema y mis datos desaparecen»*. Un orden de borrado que empieza por el `Consentimiento` la entrega sin transacciones, funciona sobre cualquier almacén y **no adelanta `ARQ-01`**. (B) compra una garantía más cara de la que el MVP necesita y obliga a decidir claves —`ADR-002 §1`: «fijar claves antes de esa convergencia produce retrabajo garantizado»—, además de chocar con el tope de 100 ítems de `TransactWriteItems` frente a un `ContadorDeUsoDiario` **por día de uso**. **Supuesto declarado:** que el borrado en DynamoDB es idempotente, de modo que reintentar es seguro |
| **`H-01`** | corregir ahora · diferir · falso positivo | **Corregir ahora; solución de `SD-39` refutada** | Es la correspondencia texto↔diseño que la compuerta protege. Fueron 17 sustituciones, no 12. El supuesto sobre `break` era válido; el nuevo supuesto implícito —que `opt` modelaba volver o terminar— fue refutado por `VI-01`: el fragmento permite caer al sufijo de éxito. |
| **`H-03`** | corregir · diferir · reabrir · falso positivo | **Diferir con riesgo aceptado** | Delegado por el líder al revisor. Funciona; partir P-13 alcanza tres casos de uso, sus secuencias y sus casos de prueba, y el CDR es una compuerta, no un rediseño. **Condición de revisión:** si P-13 gana operaciones o un cuarto caso de uso, se reabre. ISO 90003 §8.3.4.1 se cumple: la consecuencia está entendida |
| **`H-04` a `H-08`, `H-10` a `H-13`** | corregir · diferir | **Corregir ahora** | Baratos y de destinatario único. `H-04` además **desbloquea la regla #2**, que el líder quiere ejercer después |
| **Regla #2** | generar ahora · generar tras las correcciones · no generar | **Generar tras las correcciones**, con revisión humana previa al versionado | Decisión del líder. Coherente con `CLAUDE.md §6` («no se escribe código todavía») y con `H-04`, que hoy las haría salir con `???` |

## 13. Veredicto

**DETERMINADO POR EL LÍDER DEL PROYECTO, 2026-08-05: `ACEPTADO CON VERIFICACIÓN DE RETRABAJO`.**

> **Esta determinación es del líder, no de la revisión** (`IEEE 1028 §5.2.1`). Se registra
> aquí, separada y encima de la propuesta técnica que la precede, porque el acta **propone**
> y el líder **determina**. La propuesta vigente cuando se determinó era `Reinspección
> requerida`, y su condición era que quedaban cuatro Mayores abiertos.
>
> **Qué cambió entre la propuesta y la determinación.** `SD-45` cerró `CVI-03` —el `loop` se
> acota al paso que manda su `ECU` y la cancelación sale del bucle— y `CVI-01`/`CVI-02`. Una
> revisión interna con dos modelos distintos encontró y corrigió `RI-1`, `RI-2` y `RI-3`,
> tres defectos que la propia corrección de `CVI-03` había introducido. Y `SD-46` cerró los
> dos Moderados que quedaban: `CVI-04`, decodificando y regenerando el `plantuml-src`
> embebido **sin PlantUML**, con verificación de ida y vuelta; y `ECU-06 FE-07`, por su skill
> dueña, con la propagación a `CP-023` y a la nota de `DS-06`.
>
> **Condición que la sostiene: cero Críticos y cero Mayores abiertos.** Los Moderados no se
> difirieron: se cerraron. Lo que queda en el tablero —nueve filas— **no es del `CDR`**: tres
> van a `ARQ-01`, una a construcción, dos a las fases D.5 y D.6, una al dueño de `VIS-01`,
> una al usuario y una a la entrega del informe.
>
> **Límite declarado, sin adornarlo.** `SD-45` y `SD-46` los aplicó Claude Opus, el mismo
> modelo que aplicó todo el retrabajo anterior, y **no pasaron por una verificación
> independiente formal** — sí por una revisión interna con dos modelos, que encontró tres
> defectos reales. `IEEE 1028 §6.5.6.5` pide verificador distinto del autor: ese requisito
> **no está plenamente satisfecho para `SD-45` y `SD-46`**, y el líder determina el veredicto
> conociéndolo. El **freno de Wiegers**, activado en la tercera pasada, desaconsejaba una
> quinta revisión del mismo material.
>
> **Verificación de retrabajo, que es lo que el estado exige:** la ejercen los seis bloques de
> `verificar_coherencia.py`, el barrido `R1`/`R2` con sus 17 fixtures, los validadores de
> secuencia y robustez, `verificar_procedencia_mc01.py` y el trinquete — todos en verde y
> versionados, así que el retrabajo queda comprobado **de forma continua y reproducible**, no
> por una firma puntual.

---

**Propuesto por la revisión (v1.7, previo a la determinación): `REINSPECCIÓN REQUERIDA`.**

> **Resultado de la verificación v1.7.** Los commits `c6b3351` (`SD-44`) y
> `6aa158f` fueron contrastados adversarialmente por **OpenAI Codex, modelo GPT-5,
> invocado mediante Codex**, distinto de Claude Opus, que aplicó el retrabajo. El
> cambio de modelo reduce puntos ciegos compartidos, pero **no satisface IEEE 1028
> §6.5.6.5**. La independencia real la aporta el equipo humano.

**Condición que lo justifica:** `CVI-03` queda abierto con severidad **Mayor**.
R3 no resuelve `TVI-02`: cinco `loop` dibujan un único punto de reentrada para
dos destinos distintos y seis CP adicionales no fijan el retorno exacto que la
convención les atribuye. Conforme al contrato, **cualquier Mayor abierto exige
`Reinspección requerida`**.

`TVI-01`, `TVI-03`, `TVI-04`, R4, `TVI-05` y `TVI-06` quedan confirmados como
cerrados en su objeto concreto. Se registran tres Moderados: `CVI-01` (el
comprobador tiene falsos negativos y positivos), `CVI-02` (ruta absoluta contra
la independencia) y `CVI-04` (SVG visible correcto con `plantuml-src` obsoleto).
Ninguno de esos Moderados sustituye ni reduce el Mayor de R3.

**No es un rechazo del paquete.** Los recuentos cierran y los validadores pasan:
283 mensajes; robustez 262 = 15/38/150/59; `MC-01` 43/201/51/80; 193 operaciones
distintas; 181 pruebas; robustez 14/14 en 0 errores; secuencia 14/14 en 0 errores
y 10 advertencias; procedencia sin discrepancias. La escala refleja errores de
comportamiento y correspondencia que los validadores estructurales declaran fuera
de su capacidad mecánica.

**Alcance de la corrección.** Rediseñar la representación de los retornos
múltiples o retirar el `loop` que afirma una reentrada equivocada; alinear por
concepto los seis CP restantes; reparar y probar el comprobador con la batería
adversarial; resolver su ruta desde el repositorio; regenerar `MC-01.svg` con
PlantUML y propagar la reapertura de la fila 19. No se requiere aumentar los 181
casos: los escenarios existen y deben precisar su expectativa.

**Freno de Wiegers — respetado, pero el material aún no converge.** `SD-44` es el
replanteo solicitado y esta revisión juzgó su convención e instrumento, no volvió
a repetir la adjudicación de trece ramas. R1, R2 y R4 convergen; R3 es una evasión
del Mayor. Que el material sea nuevo permite revisarlo; no obliga a aceptarlo.

**Definición de los tres estados y condición de entrada:**

- **Aceptado:** cero Críticos, cero Mayores y ningún Moderado/Menor que requiera
  retrabajo pendiente de verificar.
- **Aceptado con verificación de retrabajo:** cero Críticos y cero Mayores; solo
  Moderados o Menores, todos con corrección acordada y responsable asignado.
- **Reinspección requerida:** al menos un Crítico o Mayor abierto.

**El veredicto lo determina el líder del proyecto**, no esta revisión
(IEEE 1028 §5.2.1). Lo anterior es la propuesta técnica con su condición.

## 14. Certificado de auditoría interna del acta

| Criterio de parada | Estado |
|---|---|
| 0 hallazgos críticos en el paquete verificado | ✅ |
| 0 hallazgos mayores en el paquete verificado | ❌ **1**: `CVI-03` (`TVI-02` sigue abierto) |
| Hallazgos moderados/menores documentados | ✅ **3 Moderados**: `CVI-01`, `CVI-02`, `CVI-04`; 0 Menores nuevos |
| R1/R2/R4 y renombre contrastados contra ECU/DS/MC | ✅ `TVI-01`, `TVI-03`, `TVI-04` y R4 confirmados como cerrados |
| Sabotajes a–f del comprobador en copias externas | ✅ falsos negativos y positivos reproducidos; el 0/0 basal no se sobreinterpreta |
| R3 respaldada por fuente y CP | ❌ la fuente no autoriza ignorar la semántica del `loop`; 6 CP adicionales no fijan el retorno |
| Propagación histórica barrida por concepto | ✅ recuentos y 8 historiales rectificados; sin noveno; la fila 19 vuelve a quedar refutada por esta v1.7 |
| Conteos estructurales reproducidos sobre las fuentes | ✅ 262 robustez · 283 mensajes · 43/201/51/80 en `MC-01` · 193 nombres de operación · 181 CP |
| Validadores solicitados ejecutados | ✅ robustez 14/14, 0 errores · secuencia 14/14, 0 errores/10 advertencias · procedencia sin discrepancias · barrido basal 0/0 |
| `H-24` ejercitado | ✅ regex vigente captura `TRZ-DS-01`; cerrado por `SD-42` |
| SVG de `MC-01` regenerado e inspeccionado | ❌ PlantUML no disponible; diff visible verificado, `plantuml-src` obsoleto (`CVI-04`) |
| Freno de Wiegers | ⚠️ revisión legítima de material nuevo; el replanteo existe, pero R3 no converge |

**Estado del acta v1.7: `CUARTA VERIFICACIÓN REGISTRADA`; estado del paquete:
`REINSPECCIÓN REQUERIDA`.** Python 3.13 y los dos validadores externos estuvieron
disponibles. La única capa pedida que no pudo ejecutarse fue la regeneración
PlantUML de `MC-01.svg`; se declara sin convertir la inspección del diff en render.
El verde estructural no cubre la correspondencia semántica que sus propios
informes declaran no mecanizable.

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
| v1.9 | 2026-08-05 | OpenAI Codex (GPT-5), revisor | **Segmento 1 — verificación acotada del rediseño de los cuatro `loop`.** Contrastados `DS-04`, `DS-10`, `DS-11` y `DS-12` contra sus filas ECU: el paso 2 y, en `DS-10`, sus dos mensajes del Sistema están dentro; las cancelaciones son alcanzables fuera del bucle y la continuación completa queda en el éxito. `DS-06` conserva el `loop` genuino. Recuento independiente: 283 mensajes; balance 5/5; validador 14/14 con 0 errores y 11 advertencias. Se registra `VRI-01` (Menor, notas desactualizadas de `DS-06`/`DS-12`).<br>**Segmento 2 — comprobador reescrito.** `--autoprueba`: 17/17; basal R1=0/R2=0. Sabotaje nuevo fuera del repositorio con actor citado y espacios: el validador de secuencia da 0/0, pero el barrido omite la acción no acotada y da R2=0 (`VRI-02`, Moderado). **Cero Críticos y cero Mayores:** la verificación sostiene el veredicto determinado y cubre el límite de §6.5.6.5 declarado para `SD-45`/`SD-46`; §13 no se modifica. |
| v1.8 | 2026-08-05 | J. Sánchez, líder | **Determinación del veredicto — no es una verificación más, es la decisión de la compuerta** (`IEEE 1028 §5.2.1`: el acta propone, el líder determina). **`ACEPTADO CON VERIFICACIÓN DE RETRABAJO`**, con **cero Críticos y cero Mayores**. Entre la propuesta de `v1.7` y esta determinación se cerraron: `CVI-03` y `CVI-01`/`CVI-02` en `SD-45`; `RI-1`, `RI-2` y `RI-3` —tres defectos que la propia corrección de `CVI-03` introdujo, hallados por una revisión interna con dos modelos distintos—; y los dos Moderados restantes en `SD-46`: `CVI-04`, regenerando el `plantuml-src` embebido **sin PlantUML** y comprobándolo por ida y vuelta, y `ECU-06 FE-07`, por su skill dueña. **Los Moderados no se difirieron: se cerraron.** **Límite declarado:** `SD-45` y `SD-46` los aplicó el mismo modelo que el retrabajo anterior y no pasaron por verificación independiente formal — sí por revisión interna, que encontró tres defectos reales—; `§6.5.6.5` no queda plenamente satisfecho para ellos, y el líder determina conociéndolo, con el **freno de Wiegers** activo desde la tercera pasada. **La compuerta entre el diseño detallado y el código queda cerrada; siguiente hito, `ARQ-01`.** |
| v1.7 | 2026-08-05 | OpenAI Codex (GPT-5), revisor | **Segmento 1 — cuarta verificación adversarial de `c6b3351`/`6aa158f`.** Se confirma el cierre concreto de `TVI-01`, `TVI-03`, `TVI-04`, R4, `TVI-05` y `TVI-06`; se refuta R3 como solución de `TVI-02` (`CVI-03`, Mayor): cinco `loop` conservan una reentrada incompatible con una o más de sus ECU —incluido el caso preexistente de `DS-06`— y seis CP adicionales no fijan el retorno exacto. El comprobador se provoca sobre copias con casos a–f y exhibe falsos negativos/positivos (`CVI-01`) más una ruta absoluta contra la independencia (`CVI-02`). `SD-44` se reconoce como replanteo real y material nuevo, no parche disfrazado, pero el paquete no converge y el veredicto propuesto sigue en **Reinspección requerida**.<br>**Segmento 2 — no regresión y correcciones del acta.** Recuentos: 283 mensajes; robustez 262 = 15/38/150/59; `MC-01` 43/201/51/80 y 193 operaciones distintas; 181 CP. Validadores: robustez 0 errores, secuencia 0 errores/10 advertencias, procedencia sin discrepancias, barrido basal 0/0 con alcance refutado. El SVG visible cambia un token, pero su `plantuml-src` queda obsoleto (`CVI-04`). Se actualiza §10, se corrige 7→8 ramas refutadas, `H-24` queda cerrado y ejercitado, y se definen las condiciones de entrada de los tres estados. GPT-5/Codex es distinto de Claude Opus, pero solo el equipo humano satisface plenamente IEEE 1028 §6.5.6.5. |
| v1.6 | 2026-08-05 | OpenAI Codex (GPT-5), revisor | **Segmento 1 — tercera verificación adversarial de `a23f9c4` (`SD-43`).** Se contrastan 13/13 ramas: 5 se confirman y 8 se refutan; `DS-04/11 FE-04` todavía caen al éxito, seis retornos no vuelven al inicio exacto del paso de su ECU y `SD-43-H1` se confirma en sustancia con el recuento corregido a tres `break` internos + tres externos. Se registran cuatro Mayores (`TVI-01`, `TVI-02`, `TVI-04`, `TVI-07`) y tres Menores (`TVI-03`, `TVI-05`, `TVI-06`); el veredicto propuesto sigue en **Reinspección requerida** y se activa el freno de Wiegers: el material no converge y debe replantearse el artefacto/alcance antes de otra presentación.<br>**Segmento 2 — instrumental y no regresión ejecutados.** `SVI-02` se confirma mediante sabotaje con tres detecciones y controles sin falsos positivos; `SVI-03` reproduce 21/3/7 y deja dos registros históricos adicionales por rectificar. Recuentos: 283 mensajes, robustez 262 = 15/38/150/59, `MC-01` 43/201/51/80, 193 operaciones distintas y 181 CP. Validadores: robustez 14/14 en 0 errores, secuencia 14/14 en 0 errores y 10 advertencias, procedencia sin discrepancias. GPT-5/Codex es distinto de Claude Opus, pero solo el equipo humano satisface plenamente IEEE 1028 §6.5.6.5. |
| v1.5 | 2026-08-05 | OpenAI Codex (GPT-5), revisor | **Segunda verificación independiente y adversarial de los seis commits `SD-40…SD-42`.** Las 17 ramas de `VI-01` se releen contra sus ECU: las 17 dicen «Vuelve» o «Cancela y vuelve»; se confirman los cuatro `alt` de `DS-06` y se refutan los trece `break` restaurados, que terminan la interacción sin realizar el retorno (`SVI-01`, Mayor). Los seis bloques de `verificar_coherencia.py` se hacen fallar en copias; se demuestra que las nuevas exenciones de `**Insumos:**` y del archivo CDR son demasiado amplias (`SVI-02`, Moderado); el recuento anterior a `SD-42` da 21 historiales descendentes, 3 ascendentes y 7 mixtos, no 23/3/5 (`SVI-03`, Menor). Se confirman `VI-02…VI-08` y `SD-40-H1` en su objeto concreto; `H-28` queda validado como 27 clases en MC frente a 21 en secuencia. Recuentos ejecutados: 262 elementos de robustez, 283 mensajes, 43 clases, 201 operaciones, 51 atributos, 80 relaciones y 193 nombres de operación. El veredicto propuesto permanece en **Reinspección requerida** por el Mayor abierto. Se declara que GPT-5/Codex es distinto de Claude Opus, pero que solo el equipo humano satisface plenamente IEEE 1028 §6.5.6.5. |
| v1.4 | 2026-08-05 | OpenAI Codex (GPT-5), revisor | **Verificación independiente y adversarial del retrabajo de `SD-39`.** Se contrastan 28/28 objetos de §8-ter/§8-quater contra los artefactos: se refutan `H-01`, `H-02`, `H-15`, `H-16` y parcialmente `H-17`; se registran `VI-01…VI-08`, con tres Mayores abiertos. Recuentos de primera mano: 43 = 16 + 27 clases, 201 = 193 + 8 operaciones, 51 atributos, 80 = 17 + 63 relaciones, 63 = 44 + 19 dependencias y 283 mensajes; 33 `break`/34 `opt`. El veredicto propuesto permanece en **Reinspección requerida**, ahora por evidencia de la verificación y no por espera. Se declara que GPT-5/Codex es distinto de Claude Opus, pero que solo la revisión humana satisface la independencia de IEEE 1028 §6.5.6.5. También se declaran la imposibilidad de reejecutar los validadores Python en esta sesión y el error de versión que el bloque 4 debe producir mientras `INDICE_MAESTRO` siga en v1.3; no se presentan como pase. |
| v1.3 | 2026-08-05 | J. Sánchez | **Corrección de una contradicción interna de la v1.2.** §6 seguía declarando la regla **#2** como «NO EJECUTADA — diferida con disparador» y la **revisión visual del `.svg`** como capa no ejecutada, cuando `SD-39` cerró las dos: la #2 se ejerció y destapó `H-26`, y el render está generado y mirado. La v1.2 actualizó §14 y §8-ter pero **no la tabla de cobertura**, que es donde un lector comprueba si la compuerta corrió entera. **Con esto, las diez reglas quedan ejecutadas.** Hallada al preparar el encargo de la verificación independiente: se corrige antes de entregarlo, en vez de dejar un defecto conocido para que lo encuentre el revisor. |
| v1.2 | 2026-08-05 | J. Sánchez | **Retrabajo de `SD-39` aplicado, todavía no verificado.** §8-ter registra la disposición de los 20 hallazgos originales y §8-quater los ocho que destapó el retrabajo; se corrigen la identificación de `H-14`/`H-16` y el reparto de `H-01` a 33 `break` correctos + 17 sustituidos. El veredicto no cambia, a la espera de una verificación distinta de quien aplicó. **Fila repuesta en v1.4:** la versión constaba en la ficha, pero faltaba en este historial (`VI-05`). |
| v1.1 | 2026-08-04 | J. Sánchez | **Cobertura completa.** Los dos huecos declarados en la v1.0 quedan cerrados: **14/14** especificaciones extraídas y **168/168 obligaciones emparejadas** (eran 6/14 y 4/72). Añadidos los **8 validadores sobre los 31 `.puml`** —con las cuatro banderas del de secuencia, que `DS-00` nunca transcribió— y **tres comprobaciones cruzadas nuevas**: los 150 controladores contra los mensajes de los `DS` (**150/150**), barrido de nombres entre los 14 `DR` (**`H-D` cerrado**, 3 alias divergentes → `H-20`) y las 16 pantallas de `DIS-00` contra los `boundary` (**16/16**). Adjudicados los **23 `break`** que quedaron sin desenlace legible: `H-01` pasa de **12 a 18** instancias. **7 hallazgos nuevos** (`H-14`…`H-20`), uno **Mayor**: `H-14`, la auditoría del reinicio de caracterización **no existe** en `DS-11`. Total **20 hallazgos, 3 mayores**; tasa de **0,57/página** frente a 0,37 — la cobertura parcial escondía hallazgos. **El veredicto empeoró por revisar más, y estaba previsto que pudiera.** Se declaran **tres errores de instrumentación propios** más (78 + 6 falsos positivos evitados). |
| v1.0 | 2026-08-04 | J. Sánchez | Creación (`SD-37`). Compuerta CDR ejecutada en modo completo: 10 reglas (9 ejecutadas, la #2 diferida con disparador), 13 hallazgos, 2 mayores. Validador calibrado contra los 16 fixtures; 55 → 13 advertencias al corregir el marco de invocación; 8 conteos canónicos reproducidos; fan-out con 72/72 filas verificadas. Veredicto propuesto: **Reinspección requerida**, con alcance acotado al retrabajo. |
