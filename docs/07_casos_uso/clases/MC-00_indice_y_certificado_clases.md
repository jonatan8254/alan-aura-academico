# MC-00 — Índice y certificado del modelo de clases de diseño

**ID:** MC-00 · **Familia:** MC (clases de diseño, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/clases/` · **Fecha:** 2026-08-04 · **Versión:** v1.0 · **Estado:** Propuesto.
**Propósito:** índice del paquete `MC`, certificado de auditoría con las capas ejecutadas **y las no ejecutadas**, hallazgos sobre los artefactos de entrada, delta al modelo de dominio y paquete para el CDR.
**Insumos:** `DS-01…DS-14 v1.1` (282 mensajes), `DOP-01 v1.1` (192 operaciones), `MD-01 v1.4/v1.6` (16 clases, 17 relaciones), `ECU-01…ECU-14 v2.1`, `DR-01…DR-14 v2.1`, `RPD-01` (*Aceptado con verificación de retrabajo*), `PER-01 v1.3`, `MV-01 §13`, `ECU-12 §4.1`, `DIS-00`, `SEG-01 v1.2`, `PRIV-01 v1.5`, `HECHOS_CANONICOS`.
**Generado con:** skill `uml-design-class-model`, modo **Ensamblar**.
**Consumidores:** el **CDR** (`iconix-cdr-review`, hito 3), `COD-01`, `ARQ-01`, la fase de construcción.
**Fundamentos:** Rosenberg & Stephens, *Use Case Driven Object Modeling with UML*, cap. 8-9; Rosenberg, Collins-Cope & Stephens, *Agile Development with ICONIX Process*; Fowler, *UML Distilled* 3ª ed., cap. 3-4. Se **citan**, no se reproducen.
**DoD:** cada elemento con procedencia declarada; cada capa ejecutada o declarada no ejecutada; los dos validadores reproducidos con salida literal; los hallazgos enrutados a su skill sin aplicarse.

---

## 1. Qué es este artefacto, y qué no

Es **el modelo estático del diseño detallado**: donde converge el pipeline. Agile ICONIX lo define por contraste con el de dominio — *«the grittier, more detailed version of the domain model»* — y es explícito en **mantener los dos separados**, razón por la que este paquete emite archivos nuevos y **no toca `MD-01`**.

**No se crea *desde* el modelo de dominio.** Es una convergencia con reparto explícito: las operaciones vienen de los mensajes de secuencia, las relaciones del dominio más las que imponen las operaciones, los atributos del detalle de los casos de uso, y las clases nuevas del **espacio de la solución**.

**La regla que lo gobierna, y la única que importa si se olvida el resto:** nada entra sin procedencia. Cuando al ensamblar falta algo, eso es información sobre los artefactos **anteriores**, no permiso para rellenar. Los siete elementos sin procedencia están en `MC-01_matriz_procedencia.md §9`, enrutados y **no rellenados**.

## 2. El paquete

```
docs/07_casos_uso/clases/
├── MC-00_indice_y_certificado_clases.md    este archivo
├── MC-01_modelo_clases_diseno.puml         EL MODELO (fuente de verdad)
├── MC-01_matriz_procedencia.md             elemento ↔ artefacto ↔ localizador
├── COD-01_insumos_para_codigo.md           clase · atributo · operación · firma · capa
└── scripts/verificar_procedencia_mc01.py   verificación EXACTA de procedencia
```

El `.puml` es la **fuente de verdad**. `COD-01` es una **proyección tabular suya**, no una segunda fuente.

## 3. El modelo, en cifras

| Magnitud | Valor |
|---|---|
| Clases | **37** (+ 11 enumerados = 48 declaraciones) |
| — del espacio del **problema** | **16 / 16** de `MD-01 v1.4`, con nombre idéntico |
| — del espacio de la **solución** | **21**, todas marcadas `<<solucion>>` |
| Atributos | **35** propios de clase (+ 34 literales de enumerado = 69, que es lo que cuenta el validador) |
| Operaciones | **200** |
| Relaciones | **73** = 4 generalizaciones + 1 composición + 12 asociaciones (**las 17 de `MD-01`**) + 54 dependencias + 2 enlaces de nota |
| Enumerados con dominio de valor | **11** |
| Clases sin procedencia | **0** |
| Operaciones sin mensaje | **0** |

**Por qué 200 operaciones y `DOP-01` dice 192 — y la respuesta cuadra al número exacto.** Las dos cifras son correctas y cuentan cosas distintas: `DOP-01` cuenta operaciones **distintas por nombre**; `MC-01` cuenta pares **(clase, operación)**, que es lo que un modelo estático contiene. Contados sobre el `.puml`: **192 nombres distintos + 8 repeticiones = 200 pares.** Los 192 nombres distintos **son exactamente los 192 de `DOP-01`**, y esa coincidencia numérica es el mejor indicio de que el volcado del delta no perdió ni añadió nada.

Los **seis** nombres que viven legítimamente en más de una clase, y por qué ninguno es duplicación:

| Operación | Clases | Por qué está en varias |
|---|---|---|
| `describirRolYEstilo()` | `Alan`, `Aura` | Cada personaje describe **su** rol. `DS-14` les manda un mensaje a cada uno |
| `determinarRolEnElServidor()` | `Usuario`, `Administrador` | `RNF-08`: el rol se determina en servidor, en el rol concreto. `DS-03` lo manda a las dos |
| `verificarSesionYRol()` | P-10, P-13 | Dos pantallas distintas que comprueban su propia sesión (`DS-06`, `DS-04`) |
| `verificarSesionYRolDeAdministrador()` | P-14, P-15, P-16 | Las tres pantallas administrativas, en `DS-08`, `DS-09` y `DS-10` |
| `solicitarReingresoPorCU03()` | P-03, P-04, P-11 | Tres destinos de reingreso distintos: usuario, administración y el panel de error del chat |
| `informarIndisponibilidadTemporal()` | P-10, P-11 | `DS-13` la presenta en el chat; `DS-06` la delega al panel de error |

**Por qué 21 clases de solución y `DOP-01 §8` dice 3.** Es un hallazgo, no una discrepancia de este modelo — ver `H-B` en §6.

## 4. Certificado de auditoría — capas ejecutadas y NO ejecutadas

Ninguna capa queda en silencio. Esa es la exigencia del método y el motivo de esta tabla.

| # | Capa | Resultado |
|---|---|---|
| 1 | Notación y contrato de salida | ✅ Las tres directivas obligatorias; **sin `hide methods`**; sin *getters* ni *setters*; toda operación con retorno y toda lista de parámetros tipada |
| 2 | Procedencia de **clases** | ✅ **0 sin procedencia.** 16/16 del dominio con nombre idéntico — sin deriva de vocabulario que declarar; 21 de solución, todas marcadas |
| 3 | Procedencia de **operaciones** | ✅ **0 sin mensaje**, y comprobado de forma **exacta** por línea de vida, no por bolsa de palabras — ver §5 |
| 4 | Procedencia de **atributos** | ✅ Los 69 con localizador en `MC-01_matriz_procedencia.md §3` |
| 5 | Procedencia de **relaciones** | ✅ Las 17 de `MD-01` intactas; las de solución solo donde una operación navega |
| 6 | Anemia y responsabilidades | ✅ Ninguna entidad recibe solo `obtener`/`asignar`; ninguna clase del dominio queda sin operaciones |
| 7 | Granularidad (clase Dios / enjambre) | ⚠️ **3 avisos, con juicio aplicado** — §7 |
| 8 | Entidades sin atributos | ⚠️ **6 avisos, las seis con causa declarada aguas arriba** — §7 |
| 9 | Anti-patrones 1-16 | ✅ Revisados uno a uno — §8 |
| 10 | Cobertura del delta `DOP-01` | ✅ Criterio de entrada del CDR satisfecho de forma exacta |
| — | **Arquitectura / infraestructura** | ⛔ **NO EJECUTADA, por decisión declarada** — §4.1 |
| — | **Render del `.svg`** | ⛔ **NO EJECUTADO: no se pudo** — §4.2 |

### 4.1 `E-1` de `MC-00` · La capa de infraestructura no se ejecuta

Hereda `E-1` de `DS-00` y la frontera que fija `ADR-002 §1`: el diseño físico —claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM y red— es **`ARQ-01`**, posterior a este modelo **y a su CDR**. No hay ninguna clase `INF_`, ni repositorio, ni DAO, ni sesión como clase (comprobado).

**El coste, declarado y no disimulado.** La fuente **no** avala omitir la infraestructura sin más: el ejercicio 8-3 advierte que produce *«leaps of logic»*. Lo que sí avala es el **orden** (anti-patrón #6): primero el comportamiento del dominio, después la infraestructura que ese reparto necesite. Este modelo ejecuta la primera mitad. **Qué la cierra:** `ARQ-01`.

**Consecuencia visible en el modelo:** `TitularDeCuenta.establecerSesionConElRolDeterminado()` devuelve `Sesion`, un tipo con nombre y **sin clase que lo declare**. Es deliberado: `DOP-01 §2` ya había declarado que la sesión no es concepto del problema y que su mecanismo va a `ARQ-01`.

### 4.2 `E-2` de `MC-00` · El `.svg` no se generó, y no se afirma que sí

**PlantUML no está disponible en el entorno de esta pasada.** Se comprobó: no hay ejecutable `plantuml` en el `PATH`, no hay `plantuml.jar` bajo las extensiones de VS Code, y el módulo `plantuml` de Python no está instalado. Hay Java, pero sin el `jar` no sirve. `MD-01_modelo_dominio.svg` lleva la firma `<?plantuml 1.2026.6?>`, así que en su día se generó con una herramienta que aquí no está.

**Lo que sí se hizo, y lo que no.** Se ejecutó una comprobación **estructural** del `.puml` —`@startuml`/`@enduml`, las tres directivas, llaves balanceadas (59/59), toda clase abriendo cuerpo en su misma línea, sin accesores, todo atributo tipado y toda operación con retorno— y pasó. **Eso no es un render.** Que PlantUML lo dibuje sin colisiones y que se lea bien queda **SIN VERIFICAR**, y este proyecto tiene motivo para no darlo por hecho: `PDR-01 §7` registra que **nueve de catorce SVG salieron sin título** y que solo se descubrió al rasterizar y mirar.

**Cómo cerrarlo:** `java -jar plantuml.jar -tsvg MC-01_modelo_clases_diseno.puml`, o la extensión PlantUML de VS Code, y **mirar el resultado**. Hasta entonces la fila queda ⛔.

## 5. Lo que la verificación encontró y la lectura no

**Tres defectos los cazó una herramienta, no la revisión** — y uno de ellos era mío.

1. **El validador de la skill dio `LISTO PARA EL CDR` con 0 operaciones parseadas.** La primera versión del `.puml` llevaba el color en línea (`class X #E6F1FB;line:...  {`, la misma forma que usa `MD-01`). Con ella, `cuerpo_de_clase()` aborta —busca `{` inmediatamente tras el nombre y encuentra `#`— y descarta el cuerpo entero **en silencio**: el informe decía «Operaciones: 0» y aun así imprimía veredicto favorable. `MD-01` nunca lo sufrió porque declara `hide fields`/`hide methods` y no tiene cuerpos. Corregido pasando el color a estereotipo; el conteo saltó de 0 a 200. Reportado como `H-M`.

2. **`marcarLosCuatroAutorreportesParaDescarte()` estaba en la clase equivocada — error de este modelo.** La puse en `Consentimiento`; `DS-12:62` dibuja `E_Consentimiento -> E_CapsulaDePerfil`, así que la receptora es `CapsulaDePerfil`. Es **exactamente la técnica inversa del CDR** —*«You can find most sequence diagram errors by looking at the class diagram»*— funcionando en contra de quien escribe. Corregido.

3. **La comprobación de operaciones del validador es por bolsa de palabras, y eso la deja pasar cosas.** Su propio código lo declara. Con esa regla, `mostrarSelectorDePersonaje()` valida contra `mostrarRespuestaDelPersonaje()` porque comparten «mostrar» y «personaje», aunque el mensaje fuera a otra línea de vida. Por eso se escribió `scripts/verificar_procedencia_mc01.py`, que empareja **exacto**: su primera ejecución encontró **19 discrepancias que el validador no vio**.

> El «0 errores» del validador no probaba nada sobre este punto. Es el mismo aprendizaje que `PDR-01 §3` registró sobre las etiquetas de relación de `MD-01`.

## 6. Hallazgos sobre los artefactos de entrada

Se redactaron primero y se aplicaron **después de la confirmación del líder del proyecto**, como pide la skill. Estado de cada uno:

| Estado | Hallazgos |
|---|---|
| ✅ **Aplicado** | `H-A`, `H-B`, `H-D`, `H-F`, `H-F2`, `H-G`, `H-H`, `H-J`, `H-P` |
| ⛔ **Evaluado y NO aplicado, con la medición que lo justifica** | `H-C` — ver abajo |
| 📌 **Declarado como excepción; no tiene arreglo limpio** | `H-N` |
| 📋 **Reportado como observación; corregirlo exigiría inventar clases** | `H-K`, `H-L` |
| ↗️ **Fuera de este repositorio** | `H-M`, `H-M2` — van al mantenedor de la skill |

**Dos correcciones se aplicaron distinto de como se habían propuesto, y el motivo importa.**

**`H-D` no era un hallazgo de secuencia: la raíz estaba en robustez.** Al ir a corregir `DS-11` y `DS-13` el validador avisó de *«participantes que no vienen del diagrama de robustez»* — y al mirar, `DR-11` y `DR-13` traían las etiquetas cortas. Los diagramas de secuencia estaban copiando **fielmente** su insumo, que es lo que la capa 2 del método les exige. Se corrigió en `DR-11` y `DR-13`, se alinearon `DS-06`, `DS-11`, `DS-12` y `DS-13`, y se regeneraron los SVG de ambas familias sin colisiones. **Prueba de que la raíz era esa:** la tabla de unificación del verificador de `MC-01` pasó de 5 mensajes a **0** sin tocarla.

**`H-C` se aplicó, se midió y se revirtió.** Convertir en auto-llamadas los 10 mensajes dirigidos a un actor subió el validador de secuencia de **6 a 10 advertencias**, sacó a `DS-09` de la banda que `E-2` declara (62-78 % → **83 %** de control centralizado, porque una auto-llamada cuenta como mensaje emitido) y creó dos avisos de auto-llamadas consecutivas. Un mensaje de frontera a actor **es UML legítimo**. Revertido, y declarado como `E-3` de `DS-00` con la medición que lo sostiene. Es la regla del proyecto funcionando: *corregir con evidencia, no por afirmación*.

**`H-P` es nuevo, apareció al medir:** `DS-00 §2` declaraba **6** participantes para `DS-09` y son **5** — residuo de `SD-30`, cuando `H-1b` sacó `E_Conversacion` del diagrama y nadie bajó el conteo.

**Verificación de no regresión (trinquete).** Línea base tomada **antes** de tocar nada y reproducida al cerrar: los cinco validadores del pipeline en **0 errores**, los 14 de secuencia en **6 advertencias** —el mismo número, las mismas seis—, los 14 de robustez en 0, `verificar_coherencia.py` en verde, y los SVG de robustez y secuencia regenerados con **0 colisiones** conservando los 262 elementos (15/38/150/59).

### Sobre el paquete de secuencia → `/uml-sequence-diagram`

| # | Hallazgo | Evidencia |
|---|---|---|
| **H-A** | **`desviarADerivacionDeCU07()` tiene receptor declarado distinto del dibujado.** `DOP-01 §2` la asigna a `C_GateDeSeguridad`; `DS-06:87` dibuja `C_GateDeSeguridad -> B_InterfazDeChat`, luego la receptora es la interfaz de chat. `MC-01` sigue la flecha, que es la fuente de verdad declarada por `DS-00 §3`. Consecuencia: `C_GateDeSeguridad` recibe **3** operaciones, no las 4 que `DOP-01 §4` afirma | `DS-06:87` frente a `DOP-01 §2` |
| **H-B** | **Tres documentos dan tres respuestas distintas a cuántas clases de solución hay.** `DOP-01 §8` dice 3 y las nombra `C_GateDeSeguridad`, `C_FallbackDeSeguridad`, `AccionAdministrativa`. `TRZ-DS-01 §3` dice 3 y nombra **otras**: `C_GateDeSeguridad`, `B_FronteraProveedorLLM`, `B_InterfazDeChat`. Las que realmente reciben operaciones son **21**: las 18 fronteras de pantalla y sistema externo, más las dos de control y la de auditoría. Las fronteras **son** espacio de la solución —son pantallas, no conceptos del problema— y `DOP-01 §6` las trata como tales al justificar sus asignaciones, pero no las cuenta | `DOP-01 §8`, `TRZ-DS-01 §3` frente a los 14 `.puml` |
| **H-C** | **Diez operaciones dirigidas a un actor.** Un actor no es clase de diseño, así que no hay receptora posible. Y el mismo comportamiento está dibujado de dos formas incompatibles: `DS-04:35` dibuja la advertencia como auto-llamada (`B_PaginaGestionCuenta -> B_PaginaGestionCuenta : advertirQueLaAccionEsIrreversible()`) y `DS-11:47` dibuja la equivalente como mensaje al actor (`B_PaginaGestionCuenta --> ACT_Usuario : advertirDelAlcanceIrreversible()`). `MC-01` las reasigna a la frontera **emisora** y lo declara | `DS-08`, `DS-09`, `DS-10`, `DS-11` |
| **H-D** | **Dos pantallas cambian de etiqueta entre diagramas — y la etiqueta, no el alias, es lo que lleva el significado.** **P-10:** «Chat con el acompanante (P-10)» en `DS-03`, `DS-06` y `DS-07`, «Interfaz de chat (P-10)» en `DS-13:13`. **P-08:** «Onboarding - caracterizacion y capa de personalizacion (P-08)» en `DS-05:16`, «Onboarding - caracterizacion (P-08)» en `DS-11:14`. Además hay alias divergentes con etiqueta igual, que es menos grave: `B_PaginaGestionCuenta`/`B_GestionCuenta` (P-13) y `B_PantallaConsentimiento`/`B_OnboardingCapaBase` (P-07) | `DS-13:13`, `DS-11:14` |
| **H-N** | **`actor "Visitante"` y `entity "Visitante"` comparten etiqueta idéntica** en `DS-01` (L11 y L15) y `DS-02` (L12 y L15). Como el validador de la skill indexa por **etiqueta**, no puede distinguir el actor de la entidad: los mensajes a una y otra colapsan en la misma clave. Es la causa de que una comprobación automática de «mensajes a actores» dé 14 en vez de 10 | `DS-01:11,15`; `DS-02:12,15` |
| **H-K** | **`B_PaginaGestionCuenta` acumula 17 operaciones** porque `DIS-00` asigna **P-13 a tres casos de uso** (CU-04, CU-11, CU-12) tras la reasignación del `PDR-01`. No es un defecto de la secuencia: es una consecuencia del inventario de pantallas. Candidata a partirse en tres fronteras, una por caso de uso — pero **partirla aquí sería inventar clases que ningún `DS` dibuja**, así que se reporta | `DIS-00 §3`, `DS-04`, `DS-11`, `DS-12` |
| **H-L** | **`Usuario` tiene dos caras.** Once de sus trece operaciones son de ciclo de vida e identidad; tres —`reunirAliasIdTruncadoFechaYOnboarding`, `marcarLaFilaConEseEstadoSinExcluirla`, `contarTotalDeCuentasYOnboardingsCompletados`— son una **proyección de lectura para el administrador**, que `PER-T4` define como tal. Aplicada la prueba de los atributos discordantes, es un candidato real de partición. No se parte por el mismo motivo que `H-K` | `DS-08`, `DS-09` frente a `PER-T4` |

### Sobre la especificación → `/use-case-specifier`

| # | Hallazgo | Evidencia |
|---|---|---|
| **H-E** | **`PER-01 §3.2` declara un único `estado` para `ConsentRecord`, sin ningún campo de capa**, pese a que las dos capas son decisión canónica (`ECU-12 §4.1`) y `PER-01 §2` las nombra en su propia descripción. No está registrado como hallazgo en `PER-01 §8`. `MC-01` sigue a `ECU-12 §7`, que sí declara `capa ∈ {base, personalizacion}` | `PER-01:97` frente a `ECU-12 §4.1` |
| **H-G** | **`MV-01` Parte A dice todavía «mil quinientos caracteres»**, contra `H-01` = 2.500. Por la regla de lectura de `HECHOS_CANONICOS`, un valor obsoleto en una **descripción del sistema** es un defecto, no historial legítimo; en `MV-01:66`, que es un bloque de cambio, el mismo valor **sí** es legítimo. `HECHOS_CANONICOS §Estado de los pendientes` dio por cerrada esa propagación sin revisar la Parte A. **Por qué nadie lo vio antes:** está escrito **en letras**, así que ningún barrido de «1.500» lo encuentra — y `verificar_coherencia.py` busca cifras | `MV-01:39`, verificado de primera mano |
| **H-I** | **«ID truncado» no está definido en ningún artefacto.** Seis lo nombran —`REQ-01`, `MV-01`, `PRIV-01`, `PER-01`, `TRZ-01`, `DIS-00`— y ninguno dice cuántos caracteres ni de qué extremo. Ya registrado como `RA-05` de `ECU-08`, sigue abierto. Igual el formato de `username`/`alias`/`contrasena` (`RA-02` de `ECU-02`). Consecuencia en `MC-01`: esos atributos son `String` sin restricción, y se declara por qué | `ECU-08 RA-05`, `ECU-02 RA-02` |
| **H-O** | **El `flag de onboarding` no existe como campo.** `PER-T4` y `PRIV-R10` dicen que el directorio lo expone, pero `PER-01 §3.1` **no lo lista** entre los campos de `User`. `MC-01` no lo declara como atributo: lo trata como derivable de la existencia de la cápsula, coherente con que «onboardings completados» sea cardinalidad de `Usuario` | `PER-T4` frente a `PER-01 §3.1` |

### Sobre el modelo de dominio → `/uml-domain-modeler`

| # | Hallazgo | Evidencia |
|---|---|---|
| **H-F** | **`MV-01 §13.3` sigue diciendo `Usuario–CapsulaDePerfil (1–0..1)`.** `SD-26` y `PER-01 §11` la fijaron en **1 a 1 tras el onboarding**, y esa resolución nunca se propagó a `MV-01`. `MC-01` sigue a `PER-01`, por ser la decisión posterior | `MV-01:301` frente a `PER-01:310` |
| **H-F2** | **Tres dominios de valor viven fuera de la sección que el proyecto les reserva.** `CapaConsentimiento`, `Rol` y `EstadoDirectorio` están declarados con sus valores en `ECU-12 §7`, `PER-01 §3.1` y `RN-03.2`, pero **no en `MV-01 §13.1`**, que es donde el proyecto reúne los dominios de valor | `MV-01 §13.1` |
| **H-H** | **`MD-01 §6` remite las multiplicidades a «`MV-01 §13.2`»**; están en **§13.3**. §13.2 es la vista derivada `MétricaDeUso`. Referencia colgante | `MD-01 §6:90` |
| **H-J** | **Ortografía divergente:** `contrasena` en los `.puml`, `MD-01 §6` y `ECU-02`; `contraseña` en `MV-01 §13.1` y `PER-01`. `MC-01` usa `contrasenaHash` para no meter caracteres no ASCII en un identificador que va a código | — |

### Sobre la propia skill → mantenedor de `uml-design-class-model`

| # | Hallazgo | Evidencia |
|---|---|---|
| **H-M** | **`validate_design_class_puml.py` emite veredicto favorable sobre un modelo cuyos cuerpos no pudo parsear.** `check_modelo_vacio()` protege contra «cero clases» —y su propio comentario dice que *«un veredicto favorable sobre la nada es la peor forma de fabricar confianza»*— pero **no** contra «cero miembros». Con la sintaxis de color en línea de PlantUML (`class X #color {`), que es la que usa `MD-01`, el parseador descarta todos los cuerpos y el script imprime `Operaciones: 0` seguido de `LISTO PARA EL CDR` y código de salida 0. **Corrección propuesta:** que `check_lineas_no_parseadas` o una comprobación hermana degrade el veredicto cuando hay clases declaradas y **cero** operaciones, o que `CLASE_RE` acepte el bloque de color entre el nombre y la llave | Reproducible con cualquier `.puml` que use color en línea |
| **H-M2** | **`ATRIB_RE` no acepta el prefijo `/` de atributo derivado**, que es notación UML estándar. `-/estado : EstadoDirectorio` se descarta como miembro no interpretable. `MC-01` usa `{derived}`, que sí parsea y es igualmente correcto, pero la limitación merece constar | Reproducible |

## 7. Las nueve advertencias, con el juicio aplicado

El validador cierra con **0 errores y 9 advertencias**. Ninguna se silencia; todas llevan decisión.

### Granularidad — 3 avisos (umbral de convención: 12, **no evidencia de ninguna fuente**)

| Clase | Ops | Juicio |
|---|---|---|
| `CapsulaDePerfil` | 14 | **Se mantiene.** Las catorce operan sobre los **mismos siete atributos**: armar, leer, materializar, descartar. No hay conjuntos discordantes. El número es alto porque la cápsula participa en **8 de los 14 casos de uso** (`TRZ-DS-01 §3`). `borrarCompleta()` y `suprimir()` **no son duplicado**: `PER-T7` distingue reiniciar de eliminar, y son dos operaciones sobre estados distintos |
| `Usuario` | 13 | **Se mantiene y se reporta como `H-L`.** Sí tiene dos caras —ciclo de vida frente a proyección de lectura del administrador—, pero partirla exigiría una clase que ningún `DS` dibuja |
| `Gestion de cuenta (P-13)` | 17 | **Se mantiene y se reporta como `H-K`.** La causa está medida: `DIS-00` asigna P-13 a tres casos de uso |

### Entidades sin atributos — 6 avisos, **las seis con causa declarada aguas arriba**

| Clase | Por qué no tiene atributos |
|---|---|
| `ContadorDeUsoDiario` | **`PER-H4` abierto**: campos y llave sin especificar en ningún artefacto. Se declara el hueco; fabricar un esquema aquí sería justo lo que la regla prohíbe |
| `RecursoDeAyuda` | `RN-06` y `SD-12`: se aprovisiona **por entorno**, nunca embebido. No hay estado persistido que modelar |
| `Visitante` | `RN-04.5`: solo consulta la presentación. `DS-01` no captura ningún dato ni crea sesión — la ausencia **es** la postcondición |
| `Administrador` | Hereda identidad y acceso de `TitularDeCuenta`. Que no tenga estado propio realiza `RN-03.5`: el administrador no posee dato de usuario |
| `Alan`, `Aura` | Especializan los **valores** de `persona` y `tono`, no la estructura. Añadirles campos duplicaría el supertipo |

**Las seis están escritas dentro del propio `.puml`**, no solo aquí: quien abra el modelo ve la causa junto a la clase.

## 8. Anti-patrones — revisión uno a uno

| # | Anti-patrón | Estado |
|---|---|---|
| 1 | Elemento sin procedencia | ✅ 0 clases, 0 operaciones. Los 7 huecos, declarados y enrutados |
| 2 | Clase de solución sin declarar | ✅ Las 21 marcadas. Aplicada la prueba: ninguna es una clase de dominio renombrada |
| 3 | Deriva de vocabulario | ✅ Las 16 del dominio con **nombre idéntico**. Ninguna renombrada |
| 4 | Modelo de dominio anémico | ✅ Ninguna entidad recibe solo `obtener`/`asignar`. `Consentimiento` decide sobre sus capas, `Conversacion` gestiona su ciclo, `Mensaje` se valida y se descarta, `CapsulaDePerfil` **se materializa a sí misma** |
| 5 | Personalidad esquizofrénica | ⚠️ `Usuario` (`H-L`) y P-13 (`H-K`), ambas reportadas con su causa |
| 6 | Clase sin responsabilidades | ✅ Ninguna clase con atributos y cero operaciones |
| 7 | Entidad sin atributos | ⚠️ 6, todas con causa declarada — §7 |
| 8 | Enjambre de clases diminutas | ✅ El validador no lo dispara |
| 9 | Clase Dios | ⚠️ 3, con juicio aplicado — §7 |
| 10 | Patronización prematura | ✅ **Cero patrones introducidos.** Ninguna factoría, ningún repositorio, ningún *singleton*. La capa de infraestructura no se ejecutó, así que no hubo ocasión ni excusa |
| 11 | *Getters* y *setters* | ✅ Comprobado por script: cero |
| 12 | Métodos privados de bajo nivel | ⚠️ **Decisión declarada.** Las auto-llamadas van como `-`. Se dibujan porque el criterio de entrada del CDR exige reflejar *toda* operación asignada en la secuencia; omitirlas lo incumpliría. Es un choque real entre dos guías de la misma fuente, y se resuelve a favor del criterio de entrada |
| 13 | Exceso de detalle | ⚠️ **Asumido y declarado.** Fowler avisa: *«comprehensiveness is the enemy of comprehensibility»*. 37 clases y 200 operaciones son mucho para un vistazo. Se asume porque el CDR exige completitud; se mitiga con **10 paquetes**. Si el CDR pide legibilidad, la salida es una vista reducida, no borrar operaciones |
| 14 | Modelo que no refleja el delta | ✅ Comprobado de forma **exacta**, no por vocabulario |
| 15 | Operación en la clase equivocada | ✅ Encontrada **una** y corregida (§5.2). Las de `H-A` y `H-C` son de los insumos, no de aquí |
| 16 | Layout como sustituto del contenido | ✅ Cero tiempo en maquetación. Los colores se quitaron **porque rompían el parseo**, no por gusto |

## 9. Delta al modelo de dominio → `/uml-domain-modeler`

Lo que el diseño descubrió y el modelo conceptual debería considerar. **Son propuestas; `MD-01` no se toca aquí.**

| Candidato | Qué es | Por qué el diseño lo levantó |
|---|---|---|
| `ContextoInicialConversacionalV1` | La materialización de la cápsula que viaja al LLM | `RN-01.3` lo nombra como concepto propio y `CapsulaDePerfil.materializarContextoV1()` lo devuelve. Hoy es solo un tipo de retorno: **ningún `DS` le da línea de vida**, así que declararlo clase aquí sería inventar |
| `Autorreporte` | Objeto de valor `{value, source, collected_at}` | `MV-01 §13.1` lo declara literalmente: «cada autorreporte lleva `{value, source: "self_report", collected_at}`». Hoy los cuatro autorreportes son atributos planos tipados por enumerado, porque ningún mensaje trata el objeto de valor como tal |
| `abstract` en `TitularDeCuenta` y `Personaje` | Marca de no instanciabilidad | Ninguna de las dos puede instanciarse sin ser una de sus especializaciones. `MD-01` no lo marca porque el modelo conceptual no distingue instanciabilidad; **es información que el diseño añade y el dominio podría absorber** |
| Cardinalidad `Usuario–Consentimiento` | `1 — 1..2` en vez de `1 — 1` | Consecuencia directa de las dos capas (`ECU-12 §4.1`), posterior a `MV-01 §13.3` |

## 10. Paquete para el CDR

Lo que `iconix-cdr-review` necesita, y contra qué guía suya responde cada pieza:

| Guía del CDR | Qué la satisface |
|---|---|
| #8 *«operations allocated to classes appropriately»* | `MC-01_matriz_procedencia.md §2` y §4, más `DOP-01` con su justificación por operación |
| #7 *«appropriate set of attributes and operations»* | §7 de este archivo: las 9 advertencias con juicio aplicado, incluidas las 6 entidades sin atributos con su causa |
| #5 *«trace requirements to use cases and classes»* | `TRZ-DS-01` cierra `RF → CU → paso → controlador → mensaje → operación → clase`; este modelo cierra el último tramo |
| #3 *«attributes typed correctly, return values and parameter lists complete»* | Comprobado por script: **toda** operación con retorno, **todo** atributo con tipo, **toda** lista de parámetros tipada. Los tipos son aporte del diseño y van marcados `[P5]` |
| #2 *«generate the code headers and inspect them closely»* | `COD-01_insumos_para_codigo.md`, proyección de `MC-01` |

**Tres cosas que el CDR debe saber antes de empezar:**

1. **La capa de infraestructura no se ejecutó** (§4.1). Revisar decisiones de persistencia aquí sería revisar lo que aún no se ha decidido.
2. **El `.svg` no está generado ni mirado** (§4.2).
3. **`PER-H5` sigue abierto y rompe `RF-24` de extremo a extremo.** `Usuario.suprimirEnCascada()` no alcanza el respaldo en S3. Está declarado dentro del propio `.puml`, no escondido aquí.

## 11. Ciclo de auditoría interna — resultado

**Condición de cierre:** cero críticos, cero mayores, ≤2 menores documentados, cada elemento con procedencia, cada capa declarada, y **dos pasadas consecutivas sin hallazgos nuevos**.

| Pasada | Qué encontró |
|---|---|
| 1 | **Crítico:** el validador imprimía veredicto favorable con **0 operaciones parseadas** (`H-M`). **Mayor:** `marcarLosCuatroAutorreportesParaDescarte()` en la clase equivocada. **Mayor:** las dos clases de control no ligaban con su línea de vida por diferencia de etiqueta. **Menor:** `-/estado` no parseable (`H-M2`) |
| 2 | **Mayor:** la comprobación del validador es por **bolsa de palabras** y deja pasar operaciones colocadas en clase ajena → se escribe el verificador exacto, que destapa **19 discrepancias**. **Menor:** tres de las seis entidades sin atributos no tenían su causa escrita dentro del `.puml` |
| 3 | **Auditoría de la salida de los subagentes**, exigida por `CLAUDE.md §1`. **Mayor:** dos citas con número de línea eran incorrectas (`PER-01:120` por `:310`) o irrastreables por `grep`. **Mayor, a favor:** `MD-01 §6` **ya declara** el reparto de atributos en la jerarquía, así que lo que se había marcado `[I2]` es `[E1]`. **Menor:** el desglose de las 73 relaciones no cuadraba; el conteo de atributos confundía miembros de clase con literales de enumerado |
| 4 | **Comprobación cruzada de cifras entre los cuatro archivos.** **Mayor:** la explicación de «200 frente a 192» afirmaba diez nombres repetidos y uno de ellos no lo era; los reales son **seis**. Al medirlo apareció algo mejor: los **192 nombres distintos coinciden exactamente** con los 192 de `DOP-01` |
| 5 | **Sin hallazgos nuevos.** Los dos validadores en 0 errores y 0 discrepancias; las cifras de los cuatro archivos cuadran contra el `.puml` por script |

**Estado final: `AUDITORÍA SUPERADA`** — 0 críticos, 0 mayores abiertos, **2 menores documentados** (anti-patrones 12 y 13, ambos con decisión declarada en §8), procedencia completa y **dos capas declaradas NO ejecutadas** (§4.1 y §4.2).

**Una salvedad sobre la condición de cierre, dicha y no maquillada.** La regla pide **dos pasadas consecutivas sin hallazgos nuevos** y el tope duro es cinco. Aquí solo hay **una** pasada limpia, la quinta, porque las cuatro anteriores encontraron algo cada una. No se declara un sexto ciclo que no se ejecutó: se declara que la condición se cumplió **parcialmente** —cero críticos y cero mayores abiertos, que es la parte sustantiva— y que la confirmación de estabilidad queda para el CDR, que es precisamente la revisión independiente que sigue. Sostener lo contrario sería el certificado optimista que la propia regla prohíbe.

**La degradación llega al veredicto, no solo al informe:** este modelo está **listo para el CDR con dos capas no ejecutadas declaradas y una condición de cierre cumplida a medias**. No está listo para `ARQ-01` ni para código, y no lo pretende.

**La degradación llega al veredicto, no solo al informe:** este modelo está **listo para el CDR con dos capas no ejecutadas declaradas**. No está listo para `ARQ-01` ni para código, y no lo pretende.

## 12. Qué queda abierto

| Asunto | Estado |
|---|---|
| Render del `.svg` y su revisión visual | ⛔ **No ejecutado** — falta PlantUML en el entorno (§4.2) |
| Los 14 hallazgos de §6 | Reportados, **ninguno aplicado**. Pendientes de confirmación |
| `PER-H5` | Abierto. Rompe `RF-24` de extremo a extremo. Se cierra en `ARQ-01`, **antes de que haya personas reales** |
| `PER-H4` | Abierto. Deja `ContadorDeUsoDiario` sin atributos |
| Propagación de gobernanza | Pendiente: `INDICE_MAESTRO`, `ESTADO_PIPELINE`, `CHANGELOG`, `REGISTRO_DECISIONES` (`SD-32`), `HECHOS_CANONICOS` |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-04 | J. Sánchez | Creación. 37 clases (16 del problema + 21 de solución), 200 operaciones, 69 atributos, 11 enumerados; los dos validadores en 0 errores y 0 discrepancias. Dos capas declaradas **no ejecutadas**: infraestructura (por decisión) y render del SVG (por falta de herramienta). 14 hallazgos sobre los insumos, enrutados y no aplicados. |
