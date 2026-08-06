<!-- PORTADA -->
UNIVERSIDAD NACIONAL DE COLOMBIA
Sede Medellín · Facultad de Minas
Diseño y Construcción de Productos de Software

# Alan & Aura Académico

## Diseño, construcción y despliegue de un MVP conversacional de apoyo emocional no clínico, con seguridad auditable

**Informe académico del proyecto**

**Integrantes**

| Integrante | Rol en el equipo | Contribución a lo que documenta este informe |
|---|---|---|
| Jonatan Estiven Sánchez Vargas | Ideación, liderazgo y arquitectura | **La concepción del proyecto**: la idea, el concepto de producto y su propuesta de valor; la creación de Alan y Aura como personajes, con su identidad, su doble voz y el contrato de comportamiento que la gobierna; el canon ético y el alcance; y la planificación del trabajo. Sobre esa base: la estructura del proyecto y su gobernanza; modelo de dominio, casos de uso y especificación textual; análisis de robustez; diagramas de secuencia y casos de prueba; las dos compuertas de revisión, con su retrabajo y sus cinco verificaciones; los artefactos de calidad, privacidad y seguridad; el desarrollo de los agentes especializados descritos en §4.1; y el despliegue del cliente |
| Santiago Bedoya García | *Backend* e infraestructura | Acompañamiento en la toma de decisiones durante el modelado. En la construcción: el servidor completo y su infraestructura como código —las cuatro tablas, el almacén de configuración y los catorce controladores desplegados—, la implementación de las dieciséis pantallas sobre los cimientos del cliente, las cinco suites de pruebas, y el recorrido de verificación contra el sistema desplegado que encontró seis defectos que ninguna revisión documental había visto |
| Luis Fernando Montoya Rodríguez | *Frontend* y experiencia de usuario | Acompañamiento en la toma de decisiones durante el modelado. En la construcción: la **planeación del cliente** y sus cimientos —el andamiaje del proyecto, los componentes base, la traducción de los tokens de diseño de `DIS-01` a código, la capa de acceso a la interfaz de programación, el estado de sesión con sus guardas y el ruteo—, sobre los que se levantaron después las pantallas |
| Santiago Eusse Gil | Modelado | Modelo de clases de diseño |

La tercera columna recoge la contribución a **lo que este informe documenta**, que llega hasta el sistema desplegado. Se redactó describiendo lo construido y contrastándolo con el historial del repositorio, no contando aportes: el número de cambios registrados mide mal el diseño, la revisión y el trabajo en pareja. `PLAN-01 §7` enuncia los roles como estructura y no como nómina —«este plan sugiere la estructura, no la nómina»—, así que la segunda columna refleja el reparto que el equipo ejerció, no una designación formal.

Profesor: Albeiro Espinosa Bedoya, Ph.D., M.Sc.

Grupo 5 · Período académico 2026-1
Medellín, 6 de agosto de 2026
<!-- /PORTADA -->

| Campo | |
|---|---|
| **ID:** | `INF-01` · familia INF (entrega académica) · hogar `docs/09_informe/` |
| **Fecha:** | 2026-08-06 · **Versión:** v1.6 · **Estado:** vigente |
| **Insumos:** | Los artefactos versionados de `docs/`, con sus fichas leídas al generar este informe · `HECHOS_CANONICOS.md v2.0` · `REGISTRO_DECISIONES.md` (`SD-01`…`SD-53`) · `RPD-01` y `CDR-01 v2.0` · `ARQ-01` y el contrato de la interfaz de programación · el código de `backend/`, `frontend/` y `packages/contrato-api/`, contado y ejecutado, no citado |
| **Consumidores:** | La evaluación de la asignatura; el equipo, como estado consolidado del proyecto con el sistema ya desplegado |
| **Historial:** | Siete versiones, de la v1.0 a la v1.6. El motivo de cada una está en **Historial de cambios**, al final del documento |

---

## 1. Resumen

Este informe documenta la concepción, especificación, diseño, construcción y despliegue de «Alan & Aura Académico». El producto es un Producto Mínimo Viable (MVP) de acompañamiento conversacional de apoyo emocional no clínico, dirigido a personas adultas hispanohablantes y encarnado en dos personajes complementarios: Alan, orientado a la activación práctica, y Aura, a la calma y la regulación.

El trabajo siguió un proceso derivado de ICONIX. Su propiedad central es que encadena los artefactos de modo que cada uno se deriva del anterior y puede verificarse contra él: del modelo verbal salen el vocabulario y el comportamiento; de ahí, el modelo de dominio, los casos de uso y su especificación textual; de esa especificación, el análisis de robustez; de los controladores de robustez, los diagramas de secuencia y los casos de prueba; y de los mensajes de secuencia, el modelo de clases de diseño. Dos compuertas formales de revisión técnica según `IEEE 1028` separan las etapas: `RPD-01`, entre el análisis y el diseño detallado, y `CDR-01`, entre el diseño detallado y el código.

El diseño se resume en once medidas verificables: 16 clases de dominio, 14 casos de uso, 26 requisitos funcionales, 262 elementos de robustez, 283 mensajes de secuencia, 193 operaciones asignadas, 181 casos de prueba, y un modelo de clases de diseño con 43 clases, 201 operaciones, 51 atributos y 80 relaciones. La matriz de trazabilidad no deja requisitos huérfanos.

Ese diseño se construyó después, y está en línea. El servidor corre sin servidor dedicado sobre la nube de Amazon —catorce controladores tras una pasarela de interfaz de programación, cuatro tablas y un almacén de configuración—, el cliente cubre las 16 pantallas especificadas con 38 pruebas automatizadas, y ambos se despliegan en `https://alan-aura-academico.vercel.app`. La sección 9 documenta esa construcción, y con ella lo más útil que produjo: seis defectos que solo aparecieron al ejecutar el sistema, ninguno de los cuales podía haber encontrado una revisión documental por minuciosa que fuera.

Lo que distingue este proyecto de un ejercicio académico convencional es el aseguramiento de la calidad, y en particular su resultado incómodo: la compuerta `CDR-01` requirió **cinco verificaciones independientes**, cada una ejecutada por un revisor distinto del que había aplicado el retrabajo, y las cinco encontraron defectos. Un único defecto de semántica UML resistió cinco intentos de corrección antes de cerrarse. La sección 12 lo documenta con sus cifras, porque el proceso que produjo esos hallazgos es tan resultado del trabajo como los artefactos que revisó.

---

## 2. Introducción

### 2.1 Contexto y motivación

La salud emocional ocupa hoy un lugar central en la conversación pública, impulsada por un entorno pospandémico que dejó a muchas personas adultas conviviendo con estrés sostenido, desregulación emocional y bajones anímicos. Entre «estar bien» y «necesitar atención clínica» existe una franja amplia y desatendida: personas que solo requieren un espacio de primer apoyo, disponible y no punitivo, donde ser escuchadas y ordenar lo que sienten antes de que un malestar cotidiano escale.

Los modelos de lenguaje hacen viable una experiencia de acompañamiento de calidad conversacional alta. En un dominio sensible, sin embargo, esa viabilidad técnica solo se convierte en ventaja si el producto se construye con seguridad emocional por encima del *engagement*, minimización estricta de datos y transparencia sobre lo que es y lo que no es.

### 2.2 Problema

El problema que aborda el proyecto no es técnico sino de diseño responsable: cómo ofrecer acompañamiento conversacional útil sin incurrir en sobre-promesa clínica, sin acumular datos personales innecesarios y sin fallar en el momento en que aparece una señal de peligro, que es exactamente cuando un sistema de este tipo debe dejar de conversar y derivar.

### 2.3 Objetivo y estructura de este informe

El informe documenta el proyecto desde su concepción hasta el sistema desplegado. Las secciones 6 y 7 cubren el paquete documental y el proceso ICONIX con sus dos compuertas; la 8, las decisiones técnicas y el diseño físico de la infraestructura; y la 9, la construcción y el despliegue. El corte de la versión anterior —que llegaba hasta el cierre de la compuerta `CDR-01`, el 2026-08-05— se retiró cuando el sistema pasó a estar en producción, porque un informe que se detiene en el diseño describe un proyecto que ya no es este.

La estructura conserva el esqueleto del informe de avance entregado el 2026-07-18, que la asignatura ya revisó, y lo extiende en los puntos donde el proyecto creció: el método instrumental y los modelos empleados (§4.1), el proceso ICONIX completo hasta el modelo de clases (sección 7), la retroalimentación docente y su atención (§7.4), las decisiones de arquitectura y su reversión (sección 8), la construcción y el despliegue (sección 9) y el aseguramiento de la calidad (sección 12), que no existía.

Conviene declarar una limitación de partida. El equipo no dispone de una rúbrica de evaluación escrita, y su ausencia figura desde el inicio como decisión pendiente en el plan archivado del proyecto, junto con la fecha exacta de entrega. La estructura de este informe responde, por tanto, a un criterio propio: cubrir el proceso completo con trazabilidad hacia los artefactos, de modo que cualquier afirmación pueda comprobarse en el repositorio. La única exigencia docente registrada de manera explícita son las cuatro observaciones sobre la Fase 2 recogidas en `RET-01`, atendidas en su totalidad durante la compuerta `RPD-01`.

### 2.4 Sobre los diagramas de este documento

Los 31 diagramas incluidos están embebidos en formato vectorial (SVG), no como imágenes rasterizadas. El lector puede **ampliar cuanto necesite** en el visor de PDF sin pérdida de calidad, lo cual importa: varios diagramas de secuencia y el modelo de clases de diseño superan los 3.000 píxeles de ancho y su texto resulta ilegible al tamaño de una página impresa. Cuando el cuerpo del informe discute una región concreta de un diagrama grande, se acompaña de un recorte ampliado de esa región. El anexo B recoge el conjunto completo.

---

## 3. Objetivos del proyecto

### 3.1 Objetivo general

Concebir, especificar y diseñar, con estándares profesionales de ingeniería de software, un MVP de acompañamiento conversacional de apoyo emocional no clínico para personas adultas hispanohablantes, cuyo paquete de análisis y diseño sea completo, coherente y verificable antes de escribir código.

### 3.2 Objetivos específicos

1. Construir un modelo verbal del dominio y derivar de él un modelo conceptual en UML que fije el vocabulario del proyecto.
2. Especificar el comportamiento del sistema como casos de uso con sus flujos alternativos y de excepción, en un nivel de detalle que permita derivar diseño y pruebas.
3. Establecer requisitos funcionales, no funcionales y de calidad, estos últimos según `ISO/IEC 25010:2023` y con métricas de umbral obligatorio bajo el método GQM.
4. Diseñar el comportamiento detallado mediante análisis de robustez y diagramas de secuencia, asignando cada operación a una clase concreta.
5. Consolidar un modelo de clases de diseño trazable hacia los artefactos que lo originan.
6. Someter el paquete a compuertas formales de revisión técnica según `IEEE 1028`, con verificación independiente del retrabajo.
7. Garantizar que el diseño respeta un canon ético innegociable en materia de alcance clínico, privacidad y seguridad emocional.

---

## 4. Marco metodológico

El proyecto combina tres marcos, cada uno con una función distinta.

**ICONIX** aporta el proceso de análisis y diseño. Se eligió por una propiedad que lo distingue de alternativas más pesadas: encadena artefactos de manera que cada uno se deriva del anterior y puede verificarse contra él. El modelo de dominio fija los sustantivos; la especificación textual de los casos de uso los usa; el análisis de robustez identifica objetos de frontera, control y entidad a partir de ese texto; los diagramas de secuencia convierten los controladores en mensajes y asignan cada uno a una clase; y el modelo de clases de diseño recoge esas asignaciones. La cadena permite preguntar, en cualquier punto, de dónde salió un elemento.

**`IEEE 1028`** aporta el procedimiento de revisión. El proyecto ejecutó dos revisiones técnicas formales, con su escala de severidad de cuatro niveles —Crítico [*Catastrophic*], Mayor [*Critical*], Moderado [*Marginal*] y Menor [*Negligible*]—, su taxonomía de anomalías y sus tres disposiciones posibles: `Aceptado`, `Aceptado con verificación de retrabajo` y `Reinspección requerida`. Dos cláusulas de la norma resultaron determinantes en la práctica y se discuten en la sección 12: la §5.2.1, que atribuye la determinación del veredicto al líder del proyecto y no a la revisión, y la §6.5.6.5, que exige que el retrabajo lo verifique alguien distinto de quien lo aplicó.

**`ISO/IEC 25010:2023`** aporta el modelo de calidad. Los requisitos de calidad se organizan por sus características, incluida *safety*, incorporada en la edición de 2023 y particularmente pertinente en este dominio. Cada requisito de calidad lleva una métrica asociada con umbral obligatorio, siguiendo el método *Goal-Question-Metric*.

Las normas fijan el qué; la bibliografía de apoyo resolvió el cómo, y conviene nombrarla porque cada obra entró por una necesidad concreta y no como adorno académico.

| Obra | Qué resolvió en este proyecto |
|---|---|
| Rosenberg & Stephens, *Use Case Driven Object Modeling with UML* (2007) | El encadenamiento de artefactos de ICONIX y el criterio de cuándo un caso de uso está listo para pasar a robustez |
| Rosenberg, Stephens & Collins-Cope, *Agile Development with ICONIX Process* (2005) | La versión acotada del proceso, que es la que cabe en un proyecto de un mes |
| Fowler, *UML Distilled* (2003) | El uso mínimo y consistente de la notación, y el criterio de no dibujar más de lo que aporta |
| Wiegers & Beatty, *Software Requirements* (2013) | La taxonomía de reglas de negocio de la sección 11.3, los atributos de requisito, y el criterio de parada de revisiones que se ejerció en la cuarta pasada del `CDR` |
| Basili, Caldiera & Rombach, *Goal Question Metric* (1994) | La estructura meta→pregunta→métrica→umbral de los diez requisitos de calidad, y la base contra la que se contrastó la tasa de hallazgos por página |

De Wiegers salieron dos cosas distintas que conviene no confundir: una taxonomía para clasificar reglas, y un criterio de cuándo dejar de revisar. El segundo se ejerció de verdad, y la sección 12.3 cuenta con qué resultado.

### 4.1 Método instrumental: agentes especializados y modelos

El proyecto no produjo los artefactos a mano. Cada uno lo generó un **agente especializado** con sus propias reglas verificables, su ciclo de auditoría interna y su validador por script. Los agentes son de autoría del líder del proyecto y residen fuera de este repositorio, publicados en `https://github.com/jonatan8254/iconix-uml-skills`. Eso explica una expresión que aparece en la gobernanza: cuando un defecto pertenece a la herramienta y no al artefacto, se enruta «al mantenedor» y se marca como ajeno al repositorio, no como ajeno al equipo.

Que estén publicados importa para el argumento de este informe. Las ocho herramientas son reutilizables por cualquier proyecto que siga ICONIX, y su código es inspeccionable: la afirmación de que cada artefacto se generó con reglas verificables y validador propio deja de pedirse por confianza y pasa a poderse comprobar.

| Agente | Artefacto que produce |
|---|---|
| `uml-domain-modeler` | `MD-01` |
| `uml-use-case-diagram` | `DCU-01` |
| `use-case-specifier` | `ECU-00`…`ECU-14` |
| `uml-robustness-diagram` | `DR-00`…`DR-14` |
| `uml-sequence-diagram` | `DS-00`…`DS-14`, `DOP-01` y los `CP-00`…`CP-14` |
| `uml-design-class-model` | `MC-00`, `MC-01` y `COD-01` |
| `iconix-pdr-review` | `RPD-01` |
| `iconix-cdr-review` | `CDR-01` |

Que el instrumental sea propio tuvo una consecuencia medible: los agentes también acumularon defectos, y el proyecto los encontró y los reportó. Tres quedaron registrados en el tablero de pendientes, y uno de ellos —el generador de cabeceras de código, que tomaba la etiqueta de una clase en lugar de su alias— obligó a escribir un rodeo propio dentro de este repositorio mientras la herramienta se corregía.

**Los modelos de lenguaje y su papel.** El orquestador que razona, decide y responde no tiene modelo predeterminado: lo selecciona la persona por sesión. Los agentes de apoyo ejecutan tareas mecánicas y su salida se audita antes de incorporarse; el juicio final nunca se les delega.

En el aseguramiento de la calidad la elección de modelo dejó de ser indiferente y pasó a ser parte del método, porque `IEEE 1028 §6.5.6.5` exige que el retrabajo lo verifique alguien distinto de quien lo aplicó:

| Actividad | Ejecutada por |
|---|---|
| Retrabajo de los hallazgos del `CDR-01` | Claude Opus |
| Primera verificación independiente | Codex `gpt-5.6-sol` |
| Verificaciones segunda a quinta | Codex GPT-5 |
| Revisión interna previa al veredicto | Claude Opus y Claude Sonnet |

El límite de esta práctica se declara en el acta y se repite aquí sin suavizarlo: que un modelo verifique el trabajo de otro **reduce puntos ciegos compartidos, pero no sustituye a un integrante humano distinto del autor**. La independencia real la aporta el equipo, y el veredicto lo determina el líder.

Por último, la autoría de los commits es del equipo humano y de nadie más. La regla la hace cumplir un *hook* versionado en el repositorio, que retira cualquier atribución de herramienta antes de que el commit exista.

---

## 5. Alcance del MVP y canon ético

### 5.1 Qué entra en el MVP

El producto permite a una persona adulta registrarse, otorgar consentimiento granular, construir una cápsula de perfil mínima mediante autorreportes, conversar con Alan o con Aura dentro de límites explícitos, consultar un directorio de usuarios, y ejercer control efectivo sobre sus datos: reiniciar la caracterización, revocar la personalización o eliminar la cuenta por completo. Un rol administrativo puede habilitar o deshabilitar globalmente el acceso al chat y consultar métricas operativas agregadas.

Los límites de la conversación son numéricos y están fijados como hechos canónicos del proyecto: 2.500 caracteres por mensaje, 20 mensajes de usuario por sesión, 350 tokens de respuesta visible del modelo, un límite de tasa de 3 solicitudes por minuto y 30 diarias, y una espera máxima de 20 segundos ante el proveedor del modelo antes de responder con un error controlado. La precisión de «respuesta visible» no es un matiz de redacción: la sección 9.5 cuenta cómo confundirla con el presupuesto de generación produjo un defecto real en producción.

### 5.2 Qué queda fuera

El MVP no persiste el contenido de las conversaciones. No atiende a menores de edad. No ofrece diagnóstico, terapia ni manejo autónomo de urgencias. No implementa recuperación de contraseña por correo, ni respaldo del almacén de datos personales, ambas ausencias decididas de forma deliberada y documentada.

### 5.3 Canon ético de dominio

Cinco reglas gobiernan todo artefacto del proyecto y ninguna es negociable por conveniencia de implementación: no incurrir en sobre-promesa clínica; minimizar los datos, de modo que el modelo de lenguaje reciba una cápsula de perfil mínima y nunca el historial en bruto; consentimiento granular y revocable; uso no punitivo de los datos; y seguridad emocional por encima del *engagement*.

La última regla tiene una consecuencia de diseño concreta y contraintuitiva desde el punto de vista de producto: cuando la evaluación de seguridad detecta peligro explícito, el sistema deja de conversar y deriva. No intenta contener, no continúa el hilo y no optimiza la permanencia del usuario.

---

## 6. Fase 1 — El paquete documental

La primera fase produjo los artefactos que fijan qué se va a construir y bajo qué restricciones, antes de tocar UML.

`VIS-01` establece la visión, el alcance y los objetivos del producto. `MV-01` es el modelo verbal del dominio: la descripción en prosa estructurada de la que se derivan tanto el vocabulario como el comportamiento. Su profundidad se acotó de forma explícita a un subconjunto de once rasgos del estándar E8, con una lista de comprobación verificable al final, decisión registrada como `SD-04`.

`REQ-01` recoge 26 requisitos funcionales, 10 no funcionales y 10 requisitos de calidad con sus 10 métricas asociadas, bajo una convención de identificadores de guion único (`RF-01`, `RNF-03`, `RC-05`). `PER-01` consolida el mapa de persistencia: qué se guarda, qué nunca se persiste y siete reglas transversales de esquema (`PER-T1` a `PER-T7`). `PRIV-01` desarrolla 14 reglas de privacidad. `SEG-01` define el protocolo de seguridad, cuyo núcleo es una compuerta binaria: ante peligro explícito, respuesta determinista de derivación.

`TRZ-01` establece la trazabilidad entre requisitos, casos de uso y clases, y `NORM-01` tiende el puente hacia las normas aplicables. `PLAN-01` organiza el trabajo en cuatro semanas con compuertas `G1` a `G4` y un backlog priorizado con MoSCoW. `DIS-00` y `DIS-01` aportan la base de diseño de interfaz: un inventario de 16 pantallas y un sistema de diseño con contraste AA y doble voz para los dos personajes.

Una decisión de esta fase merece mención porque condicionó todo lo demás. El proyecto es un derivado académico de un proyecto profesional mayor, y en `SD-18` se extrajo a un repositorio independiente, con la exigencia de que pudiera clonarse, construirse y desplegarse sin acceso al repositorio de origen. Esa regla de independencia se ha comprobado desde entonces de forma recurrente, y llegó a producir un hallazgo formal durante la compuerta `CDR-01` cuando un script del proyecto incorporó una ruta absoluta.

---

## 7. Fase 2 — El proceso ICONIX

### 7.1 Modelo de dominio

`MD-01` fija 16 clases conceptuales y 17 relaciones. Es un modelo del espacio del problema: sin operaciones, sin detalles de implementación y sin decisiones de persistencia. Su función es normativa sobre el vocabulario, de modo que un sustantivo que aparezca en cualquier artefacto posterior deba existir aquí o justificarse como clase del espacio de la solución.

### 7.2 Diagrama y especificación de casos de uso

`DCU-01` identifica 14 casos de uso y 5 actores. La especificación textual `ECU-01` a `ECU-14` desarrolla cada uno con su curso básico, sus flujos alternativos (`FA-xx`) y sus flujos de excepción (`FE-xx`), redactados como diálogo entre el actor y el sistema.

Un elemento de esa especificación resultó decisivo mucho después. Cada fila de flujo alternativo o de excepción declara su **desenlace**: si el caso de uso termina o si vuelve a un paso concreto. Esa columna, que en el momento de escribirse parecía una formalidad, se convirtió en el criterio que zanjó el defecto más persistente del proyecto, documentado en la sección 12.3.

### 7.3 Análisis de robustez

Los diagramas `DR-01` a `DR-14` traducen cada especificación a objetos de frontera, control y entidad. El conjunto suma 262 elementos: 15 actores, 38 objetos de frontera, 150 controladores y 59 entidades. La cifra de controladores importa porque establece la cota inferior de casos de prueba: cada controlador debe rendir al menos uno.

### 7.4 La retroalimentación docente y su atención

El 31 de julio de 2026 el profesor formuló cuatro observaciones sobre la Fase 2. Quedaron registradas literalmente en `RET-01` y se atendieron bajo la decisión `SD-28`, antes de la compuerta `RPD-01`. La tabla recoge cada observación en sus palabras y lo que se hizo.

| Observación | Qué se hizo |
|---|---|
| «Los objetos usuario y administrador deben tener relación, ya que, el administrador es un tipo de usuario» | `MD-01` gana el supertipo `TitularDeCuenta`, del que descienden ambos, y `DCU-01` refleja el rol general |
| «Los actores que aparecen en el diagrama deberían estar representados en un objeto del dominio: Visitante y usuario adulto» | `Visitante` pasa a ser clase del modelo de dominio, y participa en `CU-01`, `CU-02` y `CU-04` con sus diagramas de robustez |
| «Los requisitos funcionales especificados no se ven reflejados en su totalidad en el diagrama de casos de uso presentado» | `DCU-01` pasa de **10 a 14** casos de uso. La medición previa fue contundente: **13 de los 26 requisitos funcionales, la mitad, no tenían ninguna manifestación gráfica**. Tras la corrección, los 26 tienen caso de uso propio |
| «Realizar verificación de los objetos del dominio, deben verse reflejados en los casos de uso» | Se publicó la matriz de verificación en `TRZ-01 §5.1`. Comprobada por script, halló **4 de 16 filas discrepantes** y destapó que `DR-06` omitía la entidad `EventoDeSeguridad` |

Dos aspectos de esta pasada merecen mencionarse porque condicionaron el resto del proyecto.

**Una de las cuatro observaciones se atendió rechazando su solución literal.** La primera sugería que el administrador es un tipo de usuario, lo cual invitaba a una herencia directa entre ambos. Esa herencia no pasa el test de sustitución: un administrador no es sustituible por un usuario en los casos de uso de conversación, porque no tiene cápsula de perfil ni consentimiento. La corrección introdujo un supertipo común en lugar de la herencia sugerida, y la razón quedó escrita. Atender una observación no consiste en obedecerla.

**La primera pasada de correcciones se hizo mal y hubo que rehacerla.** `PDR-01` lo admite por escrito: las dos primeras correcciones se aplicaron sin cargar los agentes especializados que gobiernan esos artefactos, de modo que se hicieron a ojo. Ese episodio es el origen documentado de una disciplina que el proyecto sostuvo después sin excepción: cada artefacto lo modifica el agente que lo posee, y lo que no se puede comprobar no se da por hecho.

### 7.5 Compuerta `RPD-01`

La primera revisión técnica formal evaluó el paquete de análisis antes de autorizar el diseño detallado. Sobre 106,1 páginas equivalentes levantó 5 hallazgos: 1 Mayor, 2 Moderados y 2 Menores. Veredicto: `Aceptado con verificación de retrabajo`.

### 7.6 Diagramas de secuencia y delta de operaciones

Los diagramas `DS-01` a `DS-14` constituyen el diseño detallado del comportamiento. Suman 283 mensajes, y cada mensaje es una operación asignándose a la clase que lo recibe: ese es su propósito, no ilustrar un flujo. El delta consolidado `DOP-01` registra 193 nombres de operación distintos con la clase que los recibe y la justificación de por qué van ahí.

De los controladores se derivaron 181 casos de prueba (`CP-01` a `CP-14`), con cobertura comprobada de todos los caminos: curso básico, flujos alternativos y flujos de excepción.

### 7.7 Modelo de clases de diseño

`MC-01` consolida 43 clases: 16 del espacio del problema, con nombre idéntico al de `MD-01`, y 27 del espacio de la solución. Contiene 201 operaciones, 51 atributos propios, 11 enumerados y 80 relaciones. La convergencia entre el espacio del problema y el de la solución se verifica mediante una matriz de procedencia que exige que cada elemento trace a su artefacto de origen.

### 7.8 Compuerta `CDR-01`

La segunda revisión técnica formal evaluó si el diseño detallado autorizaba el paso a la construcción. Ejecutó las diez reglas del método sobre el paquete completo y levantó 20 hallazgos: 3 Mayores, 8 Moderados y 9 Menores. La tasa de 0,57 hallazgos por página supera la tasa base de 0,4 medida en documentos de diseño, lo cual se interpreta como cobertura adecuada de la revisión y no como deficiencia del paquete. Veredicto inicial: `Reinspección requerida`.

El proceso que siguió a esa disposición ocupa la sección 12 y es, con diferencia, la parte más instructiva del proyecto.

---

## 8. Arquitectura y decisiones técnicas

`ADR-001` fijó la primera pila tecnológica del proyecto, hoy superada y citada aquí como antecedente: Django sobre SQLite, desplegado en PythonAnywhere, con Groq como proveedor del modelo de lenguaje. Era una elección razonable para el contexto: mínima curva de aprendizaje y despliegue gratuito.

`ADR-002` la revirtió. La arquitectura vigente es React con Vite y TypeScript sobre Vercel para el cliente, y un backend sin servidor en AWS —funciones Lambda tras API Gateway, DynamoDB como almacén y S3 para objetos—, con Tailwind y shadcn/ui en la capa de presentación, autenticación propia y Groq mantenido como proveedor del modelo. La decisión no respondió a una condición de reversa prevista, sino a una elección del equipo, y así queda declarado en la propia ADR.

Esa misma ADR estableció una frontera temporal que gobernó el resto de la Fase 2: el diseño físico —claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM y red— quedaba diferido hasta después del modelo de clases y su compuerta. El motivo se enunció sin rodeos: el modelo de clases aún podía mover atributos y operaciones, y fijar claves antes de esa convergencia produciría retrabajo garantizado. La frontera se respetó hasta el cierre de `CDR-01`.

`ADR-003` eliminó el respaldo del almacén de datos personales, convirtiéndolo en un no-objetivo declarado con su precio escrito: la pérdida de ese almacén sería irrecuperable. La decisión cierra de raíz una vía de reidentificación, y tuvo una consecuencia que reapareció mucho después, al elegir la herramienta de infraestructura como código: sin respaldo, cualquier operación que pueda reemplazar un recurso con estado exige salvaguardas explícitas.

`ADR-004` fijó la supresión inmediata de los datos al eliminar la cuenta, sin ventana de gracia ni marca de baja lógica, y el estado inicial del interruptor de disponibilidad del chat.

`ADR-005` cerró la última decisión que faltaba antes de escribir infraestructura: la herramienta con que se declara. Se eligió el kit de desarrollo de la nube de Amazon en TypeScript, que permite escribir la infraestructura en el mismo lenguaje que el resto del sistema y comprobarla con el mismo compilador. La decisión llevaba dos frenos declarados, y el segundo es consecuencia directa de `ADR-003`: como no hay respaldo del almacén, cualquier operación capaz de reemplazar un recurso con estado debe declararse de forma explícita, nunca aceptarse por omisión.

Con `ARQ-01` se escribió el diseño físico que `ADR-002` había diferido: las claves de las cuatro tablas, la tabla de rutas de la interfaz de programación, el inventario del almacén de objetos, los permisos y el procedimiento de despliegue. Ese documento cerró tres cuestiones que llevaban abiertas desde la Fase 1. La más interesante es la del falseo de petición entre sitios: al pasar todo el tráfico del navegador por el mismo origen mediante reescritura, deja de existir origen cruzado real, y con él la necesidad de un mecanismo antifalseo. La protección no se implementó; se volvió innecesaria por la topología, que es una forma más barata y más segura de resolverla. La contrapartida quedó declarada en el documento de privacidad: el proveedor del alojamiento pasa a ser encargado del tratamiento, porque todas las credenciales y toda la cápsula de perfil atraviesan su infraestructura.

---

## 9. Fase 3 — Construcción y despliegue

El diseño autorizado en `CDR-01` se construyó entre el 5 y el 6 de agosto de 2026. Esta sección documenta qué se construyó, cómo se verificó y —lo que más valor tiene para un informe de ingeniería— qué le enseñó la ejecución al diseño.

### 9.1 El contrato compartido

La primera pieza no fue ni el servidor ni el cliente, sino el contrato entre ambos: un paquete de TypeScript, `contrato-api`, con 68 tipos (14 entidades, 11 enumerados y 43 de solicitud y respuesta) que ambos lados importan en vez de declarar por su cuenta. La jerarquía se declaró por escrito, y es lo que evita la deriva silenciosa: si el documento de contrato y el paquete discrepan, manda el paquete, porque el compilador lo comprueba y a un documento no lo comprueba nadie.

Junto al contrato se escribió un servidor de simulación con las mismas rutas. Su función fue permitir que cliente y servidor avanzaran en paralelo sin bloquearse, y cumplió mientras el servidor real no existía. Su historia es también una advertencia: cuando el servidor real estuvo desplegado, la simulación había divergido —no validaba sesión, ni rol, ni confirmación en casi ninguna ruta protegida— y el cliente pasó a consumir directamente el sistema real. Una simulación que no se mantiene deja de ser una ayuda y se convierte en una fuente de falsos negativos.

### 9.2 El servidor

El servidor sigue el diseño físico sin desviarse: 14 controladores sobre entorno de ejecución Node 22, tras una pasarela de interfaz de programación, con cuatro tablas de base de datos y un almacén de objetos para la configuración. La infraestructura completa está escrita como código, de modo que el despliegue es reproducible y su diferencia con el estado actual, inspeccionable antes de aplicarla.

Dos piezas del canon viajaron del documento al código sin perder nada. El filtro determinista de peligro se evalúa **antes** de cualquier llamada al modelo de lenguaje, de forma que un mensaje de riesgo explícito nunca llega al proveedor y la respuesta la produce el propio sistema; esa ruta funciona aunque el proveedor esté caído, que era justo lo que el protocolo de seguridad exigía. Y las guardas de salida filtran la respuesta antes de entregarla. El texto que gobierna la conducta de Alan y de Aura vive fuera del código, en el almacén de configuración y versionado, precisamente para que cambiarlo no exija tocar el programa.

### 9.3 El cliente

El cliente cubre las 16 pantallas especificadas en `DIS-00`. Se implementan en 17 archivos porque el chat resuelve tres de ellas (la conversación, su degradación y la contención ante peligro) como tres estados de una misma pantalla, que es como se comporta de verdad para quien la usa. Sobre los cimientos del proyecto se levantaron 17 componentes propios y siete primitivas de la biblioteca base.

Una decisión de esa capa merece constancia porque es reutilizable: la traducción de un fallo del servidor a un texto para la persona ocurre en un único módulo. Ninguna pantalla decide por su cuenta qué decir ante un error. Eso es lo que hace verificable el requisito de no mostrar códigos crudos, en vez de dejarlo a la disciplina de quien escriba la siguiente pantalla.

Quedan dos desviaciones declaradas. No hay modo oscuro, pese a que el sistema de diseño lo especifica y los mockups lo dibujan: fue una decisión consciente del equipo, no un olvido. Y la respuesta del chat no transporta todavía los recursos de ayuda como datos estructurados, así que la pantalla de contención depende del texto libre del mensaje; el catálogo de líneas de ayuda reales quedó diferido de forma explícita.

### 9.4 El despliegue

El servidor está en la nube de Amazon, en una región declarada provisional hasta que se resuelva la cuestión de residencia de datos que el proyecto tiene abierta desde la Fase 1. El cliente está en `https://alan-aura-academico.vercel.app`.

La pieza que une ambos es una regla de reescritura, y su orden es lo que la hace correcta: las peticiones a la interfaz de programación se reescriben hacia la pasarela, y todo lo demás cae en una regla general que devuelve el documento de la aplicación. Invertirlas haría que cada llamada al servidor devolviera la página en vez de datos. La segunda regla tampoco es opcional: sin ella, recargar el navegador en una ruta interna daría un error de página no encontrada.

Esa reescritura es la materialización de la decisión de topología descrita en la sección 8. El navegador habla con un solo origen, y por eso la cookie de sesión puede ser estricta y no hace falta mecanismo antifalseo.

### 9.5 Lo que la construcción le enseñó al diseño

Esta es la parte que justifica haber construido y no solo diseñado. Al ejecutar el sistema aparecieron seis defectos, y **ninguno de ellos era detectable leyendo los artefactos**. Todos habían sobrevivido a dos compuertas formales, cinco verificaciones independientes y un análisis de robustez de 262 elementos.

| Defecto | Qué falló | Por qué el diseño no podía verlo |
|---|---|---|
| Respuestas vacías del chat | El presupuesto de generación se agotaba antes de emitir texto | El requisito decía «tokens de salida» dando por hecho que era una sola magnitud. En un modelo que razona antes de responder, el razonamiento consume el mismo presupuesto |
| Memoria a la mitad | El historial se limitaba a cuatro mensajes, no a cuatro intercambios | Un intercambio son dos mensajes. La regla era correcta; su lectura, no |
| Freno de intentos declarado y nunca emitido | El contrato prometía una respuesta que el código no producía | Un contrato describe lo que debería ocurrir; solo una llamada real revela si ocurre |
| Estado intermedio inconsistente al reiniciar el perfil | La cápsula se borraba y el perfil seguía diciendo que existía | La especificación describe el resultado, no la atomicidad de los pasos intermedios |
| Error de servidor donde el contrato pedía error de petición | Un valor inválido se detectaba demasiado tarde | El orden de validación es una decisión de implementación |
| Una ruta que el diseño no tenía | La pantalla de disponibilidad necesitaba consultar el estado, no solo cambiarlo | La tabla de rutas se derivó de las acciones, y omitió la consulta que la pantalla requería |

El patrón es consistente: **el diseño detallado eliminó los defectos de coherencia, y dejó intactos los de encuentro con la realidad**. Los cuatro primeros nacen de supuestos que el documento no podía comprobar —cómo consume tokens un modelo de razonamiento, qué es un intercambio, si una promesa se cumple, si una operación es atómica—. Los dos últimos son cosas que un diseño no determina y que solo se ven al intentar usarlo: en qué orden se valida la entrada, y una consulta que la tabla de rutas no previó porque se derivó de las acciones.

Ninguna cantidad adicional de revisión documental los habría encontrado, y merece decirse con claridad porque este informe dedica su sección 12 a defender el valor de la revisión. Revisar y ejecutar no compiten: encuentran clases distintas de defecto. La lección del `CDR` —que una convención sin comprobador es una intención— tiene aquí su continuación natural: **un diseño sin ejecución es una hipótesis**, por bien revisado que esté.

La verificación posterior al despliegue lo confirma en el otro sentido. Once llamadas dirigidas contra el sistema en línea comprobaron que las correcciones funcionaban y que el contrato conversacional se sostenía: el personaje revela ser una inteligencia artificial cuando se le pregunta, rechaza dar un diagnóstico y deriva, y los dos personajes mantienen tonos distinguibles. Esa verificación tiene un límite que conviene declarar en vez de disimular: **no es la evaluación formal de coherencia de personaje** que los requisitos de calidad exigen, con rúbrica y muestra de al menos diez diálogos. Son sondas dirigidas a criterios puntuales. La evaluación formal sigue pendiente.

---

## 10. Trazabilidad

`TRZ-01` mantiene la correspondencia entre requisitos, casos de uso y clases. `TRZ-DS-01` extiende la cadena hacia el diseño detallado, ligando cada paso del texto de un caso de uso con su mensaje de secuencia, la operación resultante, la clase receptora y el caso de prueba que lo cubre.

La propiedad que ambas matrices garantizan es la ausencia de requisitos huérfanos: todo requisito funcional llega a un caso de uso, y todo elemento de diseño procede de un artefacto anterior identificable. Los 150 controladores del análisis de robustez tienen cobertura completa de casos de prueba.

---

## 11. Requisitos de calidad

El encuadre es la familia `SQuaRE` (`ISO/IEC 25000`). El modelo de producto lo aporta `ISO/IEC 25010:2023`, y la estructura de medición se apoya en tres normas de la misma familia: `ISO/IEC 25030` para el marco de requisitos de calidad, `ISO/IEC 25023` para la medición de producto y `ISO/IEC 25022` para la calidad en uso. La edición de 2023 no es un detalle bibliográfico: es la que incorpora *safety* como característica propia, y citar la anterior habría dejado sin cobertura normativa precisamente la parte que a este proyecto más le importa.

### 11.1 Diez requisitos con umbral obligatorio

Cada requisito de calidad se construye con el método GQM —meta, pregunta, métrica, umbral—, y esa estructura no es una cita metodológica sino la forma material de la tabla de `REQ-01 §3`: cada columna es uno de los cuatro elementos. El efecto buscado es sustituir la afirmación «el sistema es seguro» por una medición con criterio de aceptación.

| ID | Característica (25010:2023) | Métrica | Umbral |
|---|---|---|---|
| `RC-01` | Safety · *fail safe* §3.9.3 | Fallbacks correctos sobre casos de peligro con el modelo apagado | 100 % |
| `RC-02` | Safety · *risk identification* §3.9.2 | Verdaderos positivos sobre el conjunto de prueba | ≥ 0,90 |
| `RC-03` | Safety · *operational constraint* §3.9.1 | Salidas seguras sobre *prompts* adversarios | ≥ 0,95 |
| `RC-04` | Security · confidencialidad | *Payloads* con fuga sobre *payloads* inspeccionados | 0 fugas |
| `RC-05` | Performance efficiency · *time behaviour* | p95 de latencia extremo a extremo, arranque en frío incluido | ≤ 5 s |
| `RC-06` | Interaction capability §3.4 | Usuarios que completan el onboarding, n≥5 | ≥ 80 % |
| `RC-07` | Reliability · disponibilidad | Peticiones correctas o degradadas con gracia sobre el total | ≥ 95 % |
| `RC-08` | Functional suitability · corrección | Rúbrica de coherencia de personaje, n≥10 diálogos | ≥ 4,0 / 5 |
| `RC-09` | Flexibility · instalabilidad | Despliegue reproducible según el procedimiento | 1 corrida documentada |
| `RC-10` | Maintainability · modificabilidad | Cambios por configuración sobre cambios totales | 100 % |

Tres de los diez apuntan a **sub-cláusulas distintas de *safety***, no a la característica genérica. La granularidad es deliberada: el fallback determinista, la identificación del riesgo y la restricción de la salida del modelo son mecanismos separados, fallan por separado y se miden por separado.

### 11.2 El puente normativo y sus tres niveles de honestidad

`NORM-01` mapea cada requisito de calidad a su cláusula, y hace algo que rara vez se ve en trabajo académico: **declara con qué grado de verificación se afirma cada correspondencia**.

| Nivel | Qué significa | Filas |
|---|---|---|
| `[V-cláusula]` | El texto de la norma se abrió y se citó literalmente | 6 |
| `[V-estructura]` | La edición y la estructura están confirmadas; la cláusula exacta de la sub-característica queda pendiente de abrir | 7 |
| `[V-índice]` | La ubicación se conoce; el texto no se ha abierto | — |

Las seis filas a `[V-cláusula]` son las cinco de *safety* más *interaction capability*. Sobre el fallback que sostiene `RC-01`, la norma pide que el sistema pase automáticamente a un modo de operación seguro ante un fallo; sobre la restricción que sostiene `RC-03`, que acote su operación a parámetros seguros al encontrar un peligro operacional. Las otras siete se declaran a `[V-estructura]` en vez de presentarse como citadas, y el propio artefacto recomienda elevarlas al preparar la evaluación.

Esa distinción es el rasgo metodológico que este informe más querría defender. Una matriz que afirmara trece correspondencias verificadas sería más vistosa y menos cierta.

### 11.3 Reglas de negocio: la taxonomía y sus casillas vacías

Las reglas se clasifican con la taxonomía de Wiegers, que distingue **término, hecho, restricción, habilitador de acción, inferencia y cálculo**. La distinción tiene efecto práctico inmediato: una restricción se verifica de manera distinta a un habilitador, y confundirlos produce pruebas que no prueban lo que dicen.

Lo revelador del reparto está en lo que falta. Las categorías de inferencia y de cálculo quedaron **vacías a propósito**, y esa ausencia es una decisión de dominio y no un descuido de clasificación: el filtro de peligro es determinista, y las métricas de administración son contadores operativos agregados, nunca puntuaciones sobre la persona. Un MVP de acompañamiento emocional que hubiera llenado esas dos casillas habría empezado a perfilar a sus usuarios.

La categoría **término** sostiene las dos definiciones de las que cuelga todo el canon ético: qué cuenta como persona adulta y qué cuenta como peligro explícito.

### 11.4 La revisión también se hizo contra norma

Las secciones anteriores tratan la calidad del producto. La del **proceso** que la comprueba tiene su propio fundamento normativo, y merece quedar documentado aquí además de narrado en la sección 12. Las dos compuertas no fueron reuniones de criterio: son revisiones técnicas conducidas contra cláusulas concretas de `IEEE Std 1028-2008`.

| Cláusula | Qué fija | Cómo se ejerció |
|---|---|---|
| §5.1 | La revisión técnica admite varias reuniones | El `CDR-01` se ejecutó en rondas sucesivas en vez de en una sesión única |
| §5.2.1 | El veredicto lo determina el líder del proyecto, no la revisión | El acta propone; la disposición la firmó el líder el 2026-08-05 |
| §5.4.2 | Se revisa **solo** con los insumos disponibles | Fijó qué material entraba en cada compuerta y evitó revisar contra artefactos aún inexistentes |
| §5.5.6 | La ejecución pasa al seguimiento de gestión | El retrabajo salió del acta al tablero de pendientes, donde es rastreable |
| §6.5.2 | Tabla de esfuerzo de revisión, fila *Detailed design* — **normativa** | Dio la base contra la que se contrastó el material revisado por hora |
| §6.5.6.5 | El retrabajo lo verifica alguien distinto de quien lo aplicó; define *accept with rework verification* | Produjo las cinco verificaciones independientes y el veredicto vigente |
| §6.8.2 y §6.8.3 | Taxonomía de anomalías y escala de severidad | Crítico → *Catastrophic*, Mayor → *Critical*, Moderado → *Marginal*, Menor → *Negligible* |

`ISO/IEC/IEEE 12207` aporta dos cláusulas más, en frentes distintos. La §6.3.3 rige el **informe de decisiones**, y de ella sale la exigencia de registrar la resolución junto con su razón y sus supuestos, que es la forma que tiene el registro de decisiones de este proyecto. La §6.4.5 sustenta la capa de diseño detallado de la que salen los diagramas de secuencia.

Un último apunte, que pertenece a esta sección aunque su historia esté en la 12.3: la norma que zanjó el defecto más persistente del proyecto no fue de calidad ni de revisión, sino `OMG UML 2.5.1`. Cuatro pasadas discutieron qué operador de fragmento combinado usar antes de que abrir la especificación mostrara que la pregunta correcta era otra —qué envuelve el operador—. El caso ilustra algo que ninguna de las normas anteriores puede dar por sí sola: **tener la norma no basta si no se abre en el punto exacto donde la duda vive**.

### 11.5 Accesibilidad

El sistema de diseño fija el nivel `AA` de `WCAG 2.1` como criterio de cierre de cada pantalla, con los contrastes calculados y registrados: el texto sobre página alcanza una razón aproximada de 13:1, y los dos colores de personaje sobre blanco quedan por encima de 5:1. La accesibilidad no se agota ahí. El sistema declara foco visible, objetivos táctiles de al menos 44 píxeles y respeto de `prefers-reduced-motion`, esto último con su fundamento citado en el criterio 2.3.3 de la norma, porque el movimiento no esencial perjudica a personas con trastornos vestibulares.

La implementación lo recogió: el apagado de animación por preferencia del sistema existe en la hoja de estilos base, y el indicador de escritura del chat es un latido lento que queda estático cuando esa preferencia está activa. Lo que **no** se hizo es una auditoría de accesibilidad ejecutada, con herramienta automática o con lector de pantalla.

### 11.6 Qué se midió y qué no

El proyecto midió con rigor la calidad del proceso, y no midió la **calidad del producto**.

| Dimensión | Estado |
|---|---|
| Tasa de hallazgos por página en el `CDR-01` | 0,57 contra una base GQM de 0,4 |
| Verificaciones independientes que encontraron defectos | 5 de 5 |
| Requisitos huérfanos en la trazabilidad | 0 |
| Cobertura de controladores por casos de prueba | 150 de 150 |
| Requisitos de calidad con umbral definido | 10 de 10 |
| **Requisitos de calidad medidos contra su umbral** | **0 de 10** |
| Casos de prueba diseñados frente a ejecutados | 181 diseñados, 0 ejecutados |

Los umbrales existen y los instrumentos de medición se diseñaron —la clase de evento operativo se creó para que la disponibilidad de `RC-07` fuera computable, y el procedimiento de despliegue para que `RC-09` fuera reproducible—, pero la evaluación no se ha ejecutado. Dos casos los declara el propio corpus por escrito: `RC-05`, cuyo umbral de cinco segundos puede verse comprometido por el arranque en frío de las funciones sin servidor, magnitud que nadie ha medido; y `RC-08`, la rúbrica de coherencia de personaje, que las once sondas dirigidas contra el sistema desplegado **no sustituyen**, por ser comprobaciones puntuales y no una muestra.

Queda una frontera que no es técnica. El diseño **se alinea** con los principios de la Ley 1581 de 2012 y su decreto reglamentario, y el informe no afirma cumplimiento: esa validación exige criterio jurídico y está declarada como pendiente de nivel 6 desde la Fase 1. De ella depende, entre otras cosas, la región definitiva de alojamiento, hoy provisional.

---

## 12. Aseguramiento de la calidad

Esta sección documenta el proceso de revisión y sus resultados, incluidos los desfavorables. Se incluye porque el proceso es un resultado del trabajo, y porque su parte más útil para quien lea este informe no son los aciertos sino los cinco intentos fallidos que se describen en 11.3.

### 12.1 Las dos compuertas

| | `RPD-01` | `CDR-01` |
|---|---|---|
| Separa | análisis → diseño detallado | diseño detallado → código |
| Material revisado | 106,1 páginas equivalentes | 35,1 páginas de diseño |
| Hallazgos | 5 | 20 |
| Severidades | 1 Mayor · 2 Moderados · 2 Menores | 3 Mayores · 8 Moderados · 9 Menores |
| Tasa por página | no declarada | 0,57 (base GQM: 0,4) |
| Veredicto | `Aceptado con verificación de retrabajo` | inicial: `Reinspección requerida` |

El retrabajo de los 20 hallazgos de `CDR-01` cerró 17 de ellos, difirió 1 con riesgo aceptado y disparador declarado, y heredó 2 al diseño físico posterior. En el proceso destapó **8 hallazgos nuevos**, lo cual es un resultado esperable: corregir un artefacto obliga a mirarlo con un detalle que la revisión original no alcanzó.

### 12.2 Las cinco verificaciones independientes

La cláusula §6.5.6.5 de `IEEE 1028` exige que el retrabajo lo verifique alguien distinto de quien lo aplicó. El proyecto la aplicó de forma estricta: cada verificación se encargó con encuadre adversarial explícito —el objetivo era refutar las correcciones, no confirmarlas— y ninguna la ejecutó el mismo agente que había hecho el trabajo.

| Verificación | Verifica | Hallazgos | Resultado |
|---|---|---|---|
| Primera | el retrabajo inicial | `VI-01`…`VI-08`, 3 Mayores | refutó dos correcciones dadas por cerradas |
| Segunda | la corrección de la primera | `SVI-01`…`SVI-03`, 1 Mayor | refutó el cierre de `VI-01` |
| Tercera | la corrección de la segunda | `TVI-01`…`TVI-07`, 4 Mayores | refutó 8 de 13 ramas; activó el freno de la tercera pasada |
| Cuarta | el replanteo | `CVI-01`…`CVI-04`, 1 Mayor | confirmó el replanteo, refutó una de sus reglas |
| Quinta | lo que faltaba por verificar | `VRI-01`, `VRI-02`, 0 Mayores | sostuvo el veredicto |

**Las cinco encontraron defectos.** Una de ellas los encontró dentro de la corrección de lo que la anterior había encontrado. El dato que se desprende de la tabla es el argumento empírico a favor de la regla: en este expediente, separar a quien aplica de quien verifica acertó cinco veces de cinco.

El freno que menciona la tercera fila procede de Wiegers y establece no revisar el mismo material más de tres veces: si a la tercera no converge, el problema deja de estar en la revisión y pasa a estar en el artefacto o en su alcance. Se activó, y forzó el cambio de enfoque que se describe a continuación.

### 12.3 Caso de estudio: el defecto que resistió cinco intentos

El defecto es el siguiente. Diecisiete flujos de excepción declaran en su especificación que el caso de uso «vuelve al paso N», y sus diagramas de secuencia no volvían a ninguna parte.

La secuencia de intentos, cada uno refutado por una verificación independiente:

1. **Estado inicial**: fragmento `break`. En UML 2.5, `break` ejecuta su operando *en lugar del resto del fragmento envolvente*, de modo que construía un callejón sin salida donde el texto pedía reintento.
2. **Primera corrección**: se sustituyó por `opt`. El resultado fue peor. Un `opt` ejecuta o salta su cuerpo y después *cae al flujo que sigue*, así que cancelar un borrado seguía ejecutando el borrado.
3. **Segunda corrección**: se restauró `break` en trece de los diecisiete casos, argumentando que sus especificaciones decían «Termina». La afirmación era falsa: las diecisiete filas decían «Vuelve» o «Cancela y vuelve».
4. **Tercera corrección**: `loop` + `alt`. El `alt` hacía mutuamente excluyentes el error y el éxito, y el `loop` debía realizar el retorno. Seguía mal, y por una razón que ninguna de las tres pasadas anteriores había mirado: **el operando de éxito quedaba vacío y la continuación fuera del fragmento**, de modo que el sufijo de éxito se ejecutaba igual. Era el defecto del `opt` con otro nombre.
5. **Cuarta corrección**: se acotó cada bucle al paso que su especificación nombra y se sacó la cancelación fuera, porque cancelar nunca fue una iteración. Una revisión interna encontró dos defectos graves *dentro de esta corrección*: en un diagrama el bucle abría en el paso equivocado, y en otros tres la rama de cancelación había quedado inalcanzable.

La figura siguiente muestra la estructura resultante en `DS-04`, que es donde el defecto tenía la consecuencia más grave: el operando de éxito contiene ahora el paso 4 —cierre de sesión y confirmación de que no queda dato recuperable—, de modo que esos mensajes solo se ejecutan cuando la cascada de borrado se completó. En la versión anterior quedaban fuera del fragmento y se ejecutaban también tras un borrado a medias.

<!-- RECORTE docs/07_casos_uso/secuencia/svg/DS-04_secuencia_eliminar_cuenta.svg | FE-04 el almacenamiento falla | Recorte de `DS-04`: el fragmento `alt FE-04`, con el paso 4 dentro del operando de éxito -->

La causa raíz es la misma en los cuatro primeros intentos, y se enuncia mejor en negativo: **cada pasada discutía qué operador usar, cuando el problema era qué envuelve el operador**. La pregunta correcta no era `break` frente a `opt` frente a `loop`, sino dónde vive la continuación del flujo de éxito.

Lo que finalmente resolvió el defecto no fue elegir mejor, sino cambiar de instrumento: se fijó una convención de cuatro reglas y se instaló como **comprobador versionado** que recorre los catorce diagramas y falla si alguna se incumple. Las reglas se enuncian aquí en su forma literal:

> **R1** — El sufijo de éxito vive DENTRO del operando de éxito de su `alt`. Un operando de éxito vacío con la continuación FUERA del fragmento es el defecto de `opt` con otro nombre.
> **R2** — Un `break` dentro de un `loop` sale del bucle y sigue ejecutando, así que solo vale si lo que sigue al bucle es limpieza común.
> **R3** — El `loop` modela iteración genuina. El punto exacto de reentrada es normativo en la especificación y verificable en el caso de prueba.
> **R4** — La guarda del `loop` nombra todas sus salidas, incluida la cancelación.

La regla `R3` merece una nota, porque su primera formulación fue refutada. Se enunció inicialmente como que el diagrama no dibuja el punto de reentrada y lo delega a la especificación y al caso de prueba. La cuarta verificación la rechazó con un argumento que no admite réplica: dibujar una reentrada y declarar en una nota que no se pretende dibujarla no elimina la semántica del fragmento, porque un `loop` tiene un inicio concreto y UML repite desde ahí. La regla quedaba **afirmada, no implementada**. La corrección consistió en acotar cada bucle al paso que su especificación nombra, de modo que el diagrama diga la verdad en lugar de disculparse por no decirla.

### 12.4 El instrumental de verificación

El proyecto construyó sus propias herramientas de comprobación, versionadas en el repositorio y ejecutables por cualquiera que lo clone.

`verificar_coherencia.py` recorre los artefactos en seis bloques: cifras canónicas desactualizadas, residuos de arrastre, disciplina de ficha y versión, versiones declaradas frente a versiones reales, frescura de los artefactos derivados y orden de los historiales de cambios. `barrido_desenlaces.py` comprueba las reglas `R1` y `R2` de la convención descrita arriba, y lleva 18 casos de regresión versionados que se ejercitan con una opción propia de autoprueba. A ellos se suman los validadores de robustez, secuencia y procedencia del modelo de clases.

Dos instrumentos más nacieron con este informe y con la construcción. `verificar_estilo.py` mide siete marcadores de escritura automática que sí admiten medida —densidad de rayas, series retóricas de tres elementos, fórmulas de relleno, aperturas metatextuales, exceso de negrita, uniformidad de longitud de párrafo y proporción de viñetas frente a prosa—, con 11 casos de regresión que documentan los falsos positivos aceptados; cazó tics propios en su primera ejecución. Y el cliente lleva 38 pruebas automatizadas en cinco suites, que cubren lo que no puede comprobarse contra el sistema real sin efectos: los caminos de error, las guardas de ruta y la traducción de fallos a texto.

Un límite que conviene declarar: **el servidor no tiene pruebas automatizadas**. Su verificación fue por llamadas dirigidas contra el sistema desplegado, que es una forma legítima de comprobar pero no una red de regresión. Es la deuda más clara que deja la Fase 3.

El instrumental fue a su vez objeto de hallazgos, y esa es la parte instructiva. La cuarta verificación demostró con catorce sabotajes que la primera versión del comprobador de desenlaces decoraba la convención más de lo que la sostenía: cualquier fragmento ocultaba una violación de `R2`, tres formas de flecha escapaban a su expresión regular, y una nota cuyo texto contuviera la palabra `end` descuadraba el recorrido. La quinta encontró un falso negativo adicional que los 18 casos de regresión no cubrían, con una observación que quedó escrita en la cabecera del propio script: los casos de regresión los había escrito el autor a partir de la lista del revisor, de modo que demostraban regresión sobre los defectos **conocidos**, no suficiencia general.

### 12.5 Lecciones

Tres conclusiones del proceso son transferibles fuera de este proyecto.

La primera es que **quien aplica no firma**. La separación entre autor y verificador no es una formalidad burocrática de la norma: en este expediente detectó defectos en cinco de cinco ocasiones, incluida una en que el defecto vivía dentro de la corrección del defecto anterior.

La segunda es que **una convención sin comprobador es una intención**. Las cuatro primeras pasadas sobre el mismo defecto fracasaron mientras la corrección dependía de que alguien aplicara bien un criterio; la quinta funcionó cuando el criterio se convirtió en código ejecutable con casos de prueba propios. El corolario incómodo, que la quinta verificación dejó por escrito, es que un comprobador escrito por el autor a partir de defectos ya conocidos demuestra menos de lo que aparenta: gana cobertura real solo cuando alguien distinto intenta romperlo.

La tercera la aportó la construcción, y acota a las dos anteriores: **un diseño sin ejecución es una hipótesis**. Los seis defectos de la sección 9.5 sobrevivieron a todo el aparato descrito en esta sección, porque nacían de supuestos sobre el mundo que ningún documento puede contrastar. La consecuencia práctica no es revisar menos, sino dejar de esperar que revisar encuentre lo que solo encuentra ejecutar.

---

## 13. Resultados y estado actual

El proyecto queda descrito por las siguientes medidas, todas verificables contra los artefactos o el código que las producen, y vigiladas frente a desactualización desde la tabla de hechos canónicos.

**Del diseño:**

| Medida | Valor |
|---|---|
| Clases del modelo de dominio | 16 |
| Relaciones del dominio | 17 |
| Casos de uso | 14 |
| Actores | 5 |
| Requisitos funcionales | 26 |
| Requisitos no funcionales | 10 |
| Requisitos de calidad y métricas | 10 + 10 |
| Elementos de robustez | 262 = 15 actores + 38 fronteras + 150 controladores + 59 entidades |
| Mensajes de los diagramas de secuencia | 283 |
| Operaciones asignadas (delta `DOP-01`) | 193 |
| Casos de prueba derivados | 181 |
| Clases del modelo de diseño | 43 = 16 del problema + 27 de la solución |
| Operaciones de `MC-01` | 201 |
| Atributos propios de `MC-01` | 51 |
| Relaciones de `MC-01` | 80 |

**Del sistema construido:**

| Medida | Valor |
|---|---|
| Recursos de la interfaz de programación | 13, servidos por 14 métodos |
| Controladores desplegados | 14 |
| Tablas del almacén | 4, más un almacén de objetos |
| Tipos del contrato compartido | 68 = 14 entidades + 11 enumerados + 43 de rutas |
| Pantallas implementadas | 16, en 17 archivos |
| Componentes propios del cliente | 17, más 7 primitivas de la biblioteca base |
| Pruebas automatizadas | 38 en 5 suites, todas del cliente |
| Defectos encontrados al ejecutar | 6, ninguno detectable en los artefactos |
| Sistema en línea | `https://alan-aura-academico.vercel.app` |

El veredicto de la compuerta `CDR-01`, determinado por el líder del proyecto el 2026-08-05 conforme a `IEEE 1028 §5.2.1` y sostenido por una quinta verificación independiente, es **`Aceptado con verificación de retrabajo`**, con cero hallazgos Críticos y cero Mayores abiertos.

La forma de la disposición es deliberada. «Con verificación de retrabajo» no describe una firma pendiente, sino que la comprobación es continua: los seis bloques del verificador de coherencia, el comprobador de desenlaces con sus 18 casos de regresión, los validadores de robustez, secuencia y procedencia, y el trinquete de cifras canónicas se ejecutan sobre el repositorio en cualquier momento y por cualquiera.

---

## 14. Conclusiones y trabajo futuro

El proyecto produjo un paquete de análisis y diseño completo, coherente y verificable, sometido a dos compuertas formales de revisión técnica y a cinco verificaciones independientes del retrabajo; y sobre él construyó y desplegó el sistema que ese diseño especificaba.

La conclusión metodológica que el equipo extrae no está en los artefactos sino en el proceso. Un proyecto documental de este tamaño acumula afirmaciones que dejan de ser ciertas sin que nadie lo note, y la disciplina que funcionó no fue revisar más veces, sino convertir cada criterio en algo ejecutable. El caso extremo lo aportó el propio informe que este documento sustituye: pasó tres semanas afirmando cifras que ya eran falsas —diez casos de uso y doce clases, cuando eran catorce y dieciséis— junto a una pila tecnológica abandonada, precisamente porque era el único artefacto que ningún validador recorría.

Construir le puso un límite a esa conclusión, y es lo que documenta la sección 9. La disciplina de hacer ejecutable cada criterio agotó los defectos de coherencia, que son los que un documento puede contener; los seis que quedaron nacían de supuestos sobre el mundo, y ningún validador documental podía contrastarlos. De ahí la tercera lección de la sección 12.5, que no invita a revisar menos sino a dejar de pedirle a la revisión lo que solo da la ejecución.

**Trabajo pendiente declarado.** Cuatro puntos permanecen abiertos en el tablero del proyecto, ninguno bloqueante: dos requieren decisión del equipo sobre servicios externos y sobre la frontera legal de los datos, uno es la propagación de una corrección hacia el documento de visión, y uno la entrega académica.

A ellos se suman tres deudas que deja la construcción, declaradas aquí y no disimuladas. El servidor no tiene pruebas automatizadas, así que su verificación depende de llamadas dirigidas y no de una red de regresión. La evaluación formal de coherencia de personaje que exigen los requisitos de calidad, con rúbrica y muestra de al menos diez diálogos, sigue sin hacerse. Y el catálogo de recursos de ayuda está vacío, de modo que la pantalla de contención deriva con texto y no con líneas de atención reales; esta última pesa más que las otras dos, porque es la única que afecta a lo que una persona en riesgo recibiría.

---

## 15. Referencias

International Organization for Standardization. (2023). *ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*. ISO.

Institute of Electrical and Electronics Engineers. (2008). *IEEE Std 1028-2008 — IEEE Standard for Software Reviews and Audits*. IEEE.

Object Management Group. (2017). *OMG Unified Modeling Language (OMG UML), Version 2.5.1*. OMG.

International Organization for Standardization / Institute of Electrical and Electronics Engineers. (2017). *ISO/IEC/IEEE 12207:2017 — Systems and software engineering — Software life cycle processes*. ISO/IEEE.

Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (3.ª ed.). Addison-Wesley.

Rosenberg, D., & Stephens, M. (2007). *Use Case Driven Object Modeling with UML: Theory and Practice*. Apress.

Rosenberg, D., Stephens, M., & Collins-Cope, M. (2005). *Agile Development with ICONIX Process: People, Process, and Pragmatism*. Apress.

Wiegers, K., & Beatty, J. (2013). *Software Requirements* (3.ª ed.). Microsoft Press.

International Organization for Standardization. (2019). *ISO/IEC 25030:2019 — SQuaRE — Quality requirements framework*. ISO.

International Organization for Standardization. (2016). *ISO/IEC 25023:2016 — SQuaRE — Measurement of system and software product quality*. ISO.

International Organization for Standardization. (2016). *ISO/IEC 25022:2016 — SQuaRE — Measurement of quality in use*. ISO.

Basili, V. R., Caldiera, G., & Rombach, H. D. (1994). The Goal Question Metric approach. En *Encyclopedia of Software Engineering*. Wiley.

World Wide Web Consortium. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C.

Congreso de la República de Colombia. (2012). *Ley 1581 de 2012 — Régimen General de Protección de Datos Personales*.

Presidencia de la República de Colombia. (2013). *Decreto 1377 de 2013*, reglamentario de la Ley 1581 de 2012.

---

## 16. Anexos

---

## Anexo A. Artefactos del proyecto

Versiones leídas de la ficha de cada artefacto en el momento de generar este informe. El generador comprueba esta tabla contra las fichas reales y falla si alguna diverge, de modo que no puede quedar desactualizada sin que se note.

### Fase 1 — paquete documental

| Artefacto | Archivo | Versión |
|---|---|---|
| `VIS-01` | `01_vision/VIS-01_vision_alcance.md` | v1.2 |
| `ADR-001` | `01_vision/ADR-001_decisiones_tecnicas.md` | v1.1 |
| `ADR-002` | `01_vision/ADR-002_reversion_stack_serverless.md` | — |
| `ADR-003` | `01_vision/ADR-003_no_respaldo_del_dato_personal.md` | — |
| `ADR-004` | `01_vision/ADR-004_supresion_inmediata_y_estado_inicial.md` | — |
| `ADR-005` | `01_vision/ADR-005_herramienta_de_infraestructura_como_codigo.md` | — |
| `MV-01` | `02_modelos_verbales/MV-01_modelo_verbal_general.md` | v2.7 |
| `CONV-CONTRATO-01` | `02_modelos_verbales/CONTRATO_conversacional.md` | v1.3 |
| `REQ-01` | `03_requisitos/REQ-01_requisitos.md` | v1.7 |
| `PER-01` | `03_requisitos/PER-01_mapa_persistencia.md` | v1.7 |
| `PRIV-01` | `03_requisitos/PRIV-01_privacidad_datos.md` | v1.8 |
| `SEG-01` | `03_requisitos/SEG-01_protocolo_seguridad.md` | v1.2 |
| `TRZ-01` | `04_trazabilidad/TRZ-01_trazabilidad.md` | v2.1 |
| `NORM-01` | `04_trazabilidad/NORM-01_puente_normativo.md` | v1.0 |
| `PLAN-01` | `05_plan/PLAN-01_plan_proyecto.md` | v1.4 |
| `DIS-00` | `08_diseno/DIS-00_inventario_y_plan.md` | v1.1 |
| `DIS-01` | `08_diseno/DIS-01_sistema_diseno.md` | v1.1 |

Seis artefactos citables carecen de campo `Versión` en su ficha: `ADR-002`, `ADR-003`, `ADR-004`, `ADR-005`, `RPD-01` y el contrato de la interfaz de programación. Es una inconsistencia menor de la disciplina documental del proyecto, detectada al preparar este informe y registrada aquí en lugar de corregirse sobre la marcha, porque la corrección corresponde a la revisión de esos artefactos y no a su cita.

### Fase 2 — proceso ICONIX

| Artefacto | Archivo | Versión |
|---|---|---|
| `MD-01` | `06_dominio/MD-01_modelo_dominio.md` | v1.9 |
| `DCU-01` | `07_casos_uso/DCU-01_casos_uso.md` | v2.2 |
| `ECU-00` | `07_casos_uso/especificaciones/ECU-00_indice_especificaciones.md` | v2.1 |
| `ECU-01`…`ECU-14` | `07_casos_uso/especificaciones/` | v1.0 a v2.6 |
| `DR-00` | `07_casos_uso/robustez/DR-00_indice_y_certificado_robustez.md` | v2.2 |
| `DR-01`…`DR-14` | `07_casos_uso/robustez/` | v2.0 a v2.2 |
| `RPD-01` | `07_casos_uso/RPD-01_revision_preliminar_diseno.md` | — |
| `DS-00` | `07_casos_uso/secuencia/DS-00_indice_y_certificado_secuencia.md` | v2.1 |
| `DS-01`…`DS-14` | `07_casos_uso/secuencia/puml/` | v1.0 a v1.7 |
| `DOP-01` | `07_casos_uso/secuencia/DOP-01_delta_operaciones.md` | v1.5 |
| `TRZ-DS-01` | `07_casos_uso/secuencia/TRZ-DS-01_matriz_trazabilidad.md` | v1.4 |
| `CP-00` | `07_casos_uso/secuencia/pruebas/CP-00_indice_casos_prueba.md` | v1.5 |
| `CP-01`…`CP-14` | `07_casos_uso/secuencia/pruebas/` | v1.0 a v1.6 |
| `MC-00` | `07_casos_uso/clases/MC-00_indice_y_certificado_clases.md` | v2.1 |
| `MC-01` | `07_casos_uso/clases/MC-01_modelo_clases_diseno.puml` | v1.1 |
| `COD-01` | `07_casos_uso/clases/COD-01_insumos_para_codigo.md` | v1.6 |
| `CDR-01` | `07_casos_uso/CDR-01_revision_critica_diseno.md` | v2.0 |

### Fase 3 — construcción y despliegue

| Artefacto | Archivo | Versión |
|---|---|---|
| `ARQ-01` | `10_arquitectura/ARQ-01_diseno_fisico.md` | v1.1 |
| `CONTRATO-API` | `10_arquitectura/CONTRATO_API_v1.md` | — |

El código construido no se inventaría aquí porque no es un artefacto documental: vive en `backend/`, `frontend/` y `packages/contrato-api/` del mismo repositorio, y su estado se comprueba compilando y ejecutando, no leyendo una ficha.

### Gobernanza

| Artefacto | Función | Versión |
|---|---|---|
| `HECHOS_CANONICOS` | tabla de cifras canónicas del proyecto | v2.0 |
| `ESTADO_PIPELINE` | estado de fase y tablero de pendientes | v3.11 |
| `REGISTRO_DECISIONES` | las 53 decisiones documentadas en el anexo D | — |
| `INDICE_MAESTRO` | inventario de artefactos con sus versiones | — |
| `CHANGELOG` | historial del paquete documental | — |
| `RET-01` | retroalimentación docente sobre la Fase 2 | v1.0 |

---

## Anexo B. Diagramas

Los 31 diagramas del proyecto, embebidos en formato vectorial. **El lector puede ampliar cuanto necesite sin pérdida de calidad**, y en varios casos necesitará hacerlo: los diagramas de secuencia de los casos de uso más extensos y el modelo de clases de diseño superan con holgura el ancho de una página, y su texto no es legible a escala completa. El modelo de clases mide 9.347 × 2.208 píxeles, una proporción de 4,2 a 1 equivalente a dieciocho pantallas en fila.

El orden sigue el del proceso: modelo de dominio, casos de uso, los catorce de robustez, los catorce de secuencia y el modelo de clases de diseño.

<!-- DIAGRAMAS -->

---

## Anexo C. Trazabilidad

Las matrices completas viven en `TRZ-01` y `TRZ-DS-01`. Este anexo recoge su forma y el resultado agregado.

`TRZ-01` enlaza cada requisito funcional con el caso de uso que lo realiza y con las clases de dominio implicadas. `TRZ-DS-01` extiende la cadena hacia el diseño detallado con cinco columnas por fila: paso del texto del caso de uso, mensaje de secuencia, operación resultante, clase receptora y caso de prueba que lo cubre.

| Comprobación | Resultado |
|---|---|
| Requisitos funcionales sin caso de uso | 0 |
| Controladores de robustez sin caso de prueba | 0 de 150 |
| Operaciones de secuencia sin clase receptora | 0 de 193 |
| Clases de `MC-01` sin artefacto de procedencia | 0 de 43 |

---

## Anexo D. Registro de decisiones

Las 53 decisiones documentadas del proyecto. Cada una consta en `REGISTRO_DECISIONES.md` con su justificación completa, su estado de confirmación y su propagación a los artefactos afectados.

| ID | Decisión |
|---|---|
| SD-01 | El subproyecto es un hijo académico simplificado del proyecto profesional de origen |
| SD-02 | Doble horizonte |
| SD-03 | Sin default de modelo de razonamiento |
| SD-04 | Profundidad de los modelos verbales: subconjunto de 11 rasgos de E8, con lista de comprobación |
| SD-05 | Seguridad como compuerta binaria ante peligro explícito, sin escala graduada |
| SD-06 | Pila inicial Django · SQLite · PythonAnywhere (superada por SD-29) |
| SD-07 | No persistencia del chat |
| SD-08 | Solo adultos |
| SD-09 | Idioma español de Colombia |
| SD-10 | Consolidar |
| SD-11 | Diferir |
| SD-12 | Recursos de ayuda y líneas de crisis configurables por entorno, nunca fijados en el código |
| SD-13 | Consolidar |
| SD-14 | Generar el modelo de dominio |
| SD-15 | Corrección de alcance: alinear al plan de Codex |
| SD-16 | Archivar el texto completo (verbatim) del plan de Codex |
| SD-17 | Reconciliar 5 discrepancias |
| SD-18 | Extraer el subproyecto a este repositorio independiente |
| SD-19 | Adoptar el formato de entrega del curso en MV-01 |
| SD-20 | Producir el diagrama de casos de uso |
| SD-21 | Producir la especificación textual de los casos de uso *(el título original decía «los 10»; hoy son 14)* |
| SD-22 | Reconciliar RA-01: adoptar la cápsula de 5 campos del plan |
| SD-23 | Producir la base de diseño de interfaz |
| SD-24 | Corregir SD-23: persistir los 16 mockups + style-tile como archivos HTML reales |
| SD-25 | Consolidar el mapa de persistencia en un artefacto propio |
| SD-26 | Resolver PER-H1 y PER-H3 |
| SD-27 | Incorporar un grafo de conocimiento propio del subproyecto |
| SD-28 | Ejecutar `PDR-01`, la primera pasada completa de correcciones sobre la fase 2 |
| SD-29 | Revertir el stack a una arquitectura sin servidor |
| SD-30 | Producir los diagramas de secuencia `DS-01…DS-14` |
| SD-31 | Corregir la causa raiz del defecto de legibilidad de los SVG de robustez y consolidar los pendientes |
| SD-32 | Producir el modelo de clases de diseño |
| SD-33 | Cerrar `PER-H5`: el MVP no respalda el almacén de datos personales |
| SD-34 | Marcar el respaldo de la base de datos como obsoleto y cerrar el registro de `RF-24` |
| SD-35 | Cerrar `PER-H2` y el estado inicial del *kill switch |
| SD-36 | Cerrar la propagación que `SD-35` dejó a medias |
| SD-37 | Ejecutar el CDR, la compuerta entre el diseño detallado y el código |
| SD-38 | Los commits de este repositorio los firma el equipo humano y nadie mas |
| SD-39 | Ejecutar el retrabajo de los 20 hallazgos del `CDR-01` |
| SD-40 | Verificar el retrabajo del `CDR-01` con un modelo distinto, y cerrar la propagación del canon que ese barrido destapó |
| SD-41 | Corregir los dos hallazgos Mayores que la verificación independiente dejó abiertos |
| SD-42 | Reparar el instrumental de verificación, que es la causa de que los defectos de propagación se repitieran |
| SD-43 | Corregir lo que la segunda verificación independiente refutó, y cerrar el retrabajo del CDR |
| SD-44 | Fijar la convención de desenlaces antes de volver a tocar una rama, y hacerla exigible con un comprobador |
| SD-45 | Hacer verdadera la regla R3 en vez de afirmarla, y devolverle al comprobador la capacidad de sostener lo que dice |
| SD-46 | Cerrar los dos Moderados que quedaban y determinar el veredicto del `CDR-01` |
| SD-47 | Cerrar los dos hallazgos de la quinta verificación, con lo que el límite de `IEEE 1028 §6.5.6.5` deja de existir |
| SD-48 | Completar el expediente del `CDR` y poner al día todo lo que la gobernanza seguía anunciando como futuro |
| SD-49 | Fijar AWS CDK en TypeScript como herramienta de infraestructura como código, con dos frenos declarados |
| SD-50 | `ARQ-01`, el diseño físico: topología de origen, 4 tablas, tabla de rutas, inventario de objetos, permisos y procedimiento |
| SD-51 | Reescribir el informe académico como artefacto versionado en Markdown, dentro del barrido del verificador |
| SD-52 | El contrato conversacional recupera cuatro reglas que su importación original no trajo, y los *prompts* pasan a v3 |
| SD-53 | El informe cubre la Fase 3, y los cuatro documentos de gobernanza dejan de describir un proyecto sin código |

Las decisiones `SD-41` a `SD-47` corresponden en su totalidad al ciclo de corrección y verificación de la compuerta `CDR-01` descrito en la sección 12. Siete decisiones para cerrar una compuerta es una cifra alta, y la sección 12.3 explica por qué hicieron falta.

---

## Anexo E. Inventario de pantallas

`DIS-00` inventaría 16 pantallas del MVP, con sus prototipos de alta fidelidad en `docs/08_diseno/mockups/`. Cada pantalla se corresponde con al menos un objeto de frontera del análisis de robustez, correspondencia verificada durante la compuerta `CDR-01`.

| Grupo | Pantallas |
|---|---|
| Acceso y cuenta | presentación, registro, inicio de sesión, gestión de cuenta |
| Consentimiento y caracterización | consentimiento granular, autorreportes, elección de acompañante |
| Conversación | interfaz de chat, estados de error, derivación ante peligro |
| Consulta | directorio de usuarios, métricas operativas |
| Administración | disponibilidad del chat, diálogo de confirmación |

---

## Anexo F. Glosario

| Término | Definición |
|---|---|
| **Cápsula de perfil** | Conjunto mínimo de datos que se envía al modelo de lenguaje: cinco campos de contenido y dos de metadatos. Nunca incluye el historial de conversación en bruto. |
| **Caso de uso** | Objetivo funcional observable que un actor persigue con el sistema. Se especifica con curso básico, flujos alternativos y flujos de excepción. |
| **Compuerta** | Revisión técnica formal según `IEEE 1028` que decide si un conjunto de artefactos autoriza el paso a la etapa siguiente. |
| **Controlador** | En el análisis de robustez, el verbo que coordina un paso del caso de uso. Se convierte en mensajes durante el diseño de secuencia y rinde al menos un caso de prueba. |
| **Desenlace** | Columna de la especificación textual que declara, para cada flujo alternativo o de excepción, si el caso de uso termina o vuelve a un paso concreto. |
| **Espacio del problema y de la solución** | Las clases del primero describen conceptos del dominio y existen en `MD-01`; las del segundo aparecen al diseñar y solo existen en `MC-01`. |
| **Fragmento combinado** | Región de un diagrama de secuencia con semántica propia. Los usados en este proyecto son `alt` (alternativas excluyentes), `opt` (ejecuta o salta), `loop` (itera) y `break` (ejecuta en lugar del resto del fragmento envolvente). |
| **GQM** | *Goal-Question-Metric*. Método que liga cada objetivo de calidad a preguntas y a métricas con umbral. |
| **Objeto de frontera** | Elemento con el que el actor interactúa: una pantalla, un diálogo, una interfaz con un sistema externo. |
| **Retrabajo** | Conjunto de correcciones aplicadas a los hallazgos de una compuerta. `IEEE 1028 §6.5.6.5` exige que lo verifique alguien distinto de quien lo aplicó. |
| **Tasa base** | Hallazgos por página esperables en una revisión de documentos de diseño. El valor de referencia usado es 0,4. Una tasa muy inferior sugiere revisión insuficiente, no artefacto impecable. |
| **Trinquete** | Regla del proyecto que impide degradar lo ya construido: las cifras canónicas no se mueven sin decisión explícita, y un comprobador lo verifica. |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio |
|---|---|---|---|
| v1.6 | 2026-08-06 | Equipo Alan & Aura Académico | **La ficha de cabecera era un muro y repetía el historial.** Había acumulado el motivo de las seis versiones en un solo párrafo de 2.795 caracteres, que es lo primero que encontraba quien abriera el documento —antes del resumen— y que además **duplicaba** la tabla de Historial de cambios del final, donde ese detalle ya vivía. Pasa a tabla de seis filas con los campos que identifican el artefacto, y el motivo de cada versión queda en un solo sitio. |
| v1.5 | 2026-08-06 | Equipo Alan & Aura Académico | **La portada acreditaba la ejecución y no la concepción.** Listaba los artefactos producidos por el líder sin nombrar lo que los origina: la idea del proyecto, el concepto de producto y su propuesta de valor, la creación de Alan y Aura como personajes —con su identidad, su doble voz y el contrato de comportamiento que la gobierna—, el canon ético que ninguna decisión posterior puede relajar, y la planificación del trabajo. Sin esa capa, las 43 clases y los 283 mensajes no tendrían de dónde derivarse. **Y un defecto del instrumental, encontrado al preparar esta entrega:** `generar_informe.py` comprobaba que el PDF **existiera**, no que se hubiera **escrito**, de modo que informaba `OK` sobre el archivo de una corrida anterior cuando un visor abierto lo bloqueaba. Se detectó con un `.md` que iba 31 minutos por delante de su PDF, ya commiteado. Ahora compara la marca de tiempo y falla diciendo la causa; probado haciéndolo fallar. |
| v1.4 | 2026-08-06 | Equipo Alan & Aura Académico | **La sección de calidad cubría el producto y no el proceso.** Entra `§11.4`: las dos compuertas no fueron reuniones de criterio sino revisiones conducidas contra cláusulas concretas, y ahora están tabuladas —`IEEE 1028` §5.1, §5.2.1, §5.4.2, §5.5.6, §6.5.2, §6.5.6.5, §6.8.2 y §6.8.3, cada una con cómo se ejerció— junto con `ISO/IEC/IEEE 12207` §6.3.3, de donde sale la forma del registro de decisiones, y §6.4.5, que sustenta el diseño detallado. Se cierra con `OMG UML 2.5.1`, la norma que zanjó el defecto que resistió cinco intentos, y con lo que ese caso enseña: tener la norma no basta si no se abre en el punto donde vive la duda. **`§4` deja de nombrar solo los tres marcos** y acredita la bibliografía que resolvió el cómo, con qué aportó cada obra; de Wiegers salieron dos cosas distintas —una taxonomía y un criterio de parada— y se separan para no confundirlas. |
| v1.3 | 2026-08-06 | Equipo Alan & Aura Académico | **Pasada de lectura completa, que es lo que los comprobadores no hacen.** Encontró **cinco referencias cruzadas rotas** que la renumeración de la v1.2 había dejado apuntando a la sección 11 —el propio comprobador no las ve, porque son prosa y no cifras—, y un resumen que seguía anunciando solo «concepción, especificación y diseño». **La §11 era el hueco de fondo:** 102 palabras para todo el fundamento de calidad, cuando el corpus sostiene bastante más — familia `SQuaRE` con `ISO/IEC 25030`/`25023`/`25022`, la tabla de los diez `RC` con métrica y umbral, los tres niveles de verificación de `NORM-01` (`[V-cláusula]`, `[V-estructura]`, `[V-índice]`), las sub-cláusulas de *safety*, la taxonomía de Wiegers con sus **seis** categorías (faltaba «término») y su argumento de las casillas vacías a propósito, `WCAG 2.1 AA` con los contrastes medidos, y la declaración honesta de que se midió el proceso y no el producto: **10 de 10 umbrales definidos, 0 de 10 medidos**. `§12.5` gana la tercera lección, la que aportó construir. Se documentan y enlazan las skills de ICONIX, lo que hace comprobable una afirmación que antes se pedía por confianza. Y el PDF baja de **73 a 68 páginas**: cada sección numerada forzaba página nueva, con secciones de siete líneas detrás. |
| v1.2 | 2026-08-06 | Equipo Alan & Aura Académico | **El informe deja de detenerse en el diseño.** La v1.0 se cortó en el cierre del `CDR-01` por decisión declarada (`SD-51 D4`), y ese corte era correcto mientras no hubiera código. Dejó de serlo el 2026-08-06, cuando el sistema quedó desplegado: un informe que termina en el diseño describe un proyecto que ya no es este. Entra la **§9, construcción y despliegue** —contrato compartido, servidor, cliente, despliegue— y con ella **§9.5**, que es lo que justifica haber construido: los seis defectos que apareció la ejecución, ninguno detectable en los artefactos pese a dos compuertas, cinco verificaciones independientes y 262 elementos de robustez. La conclusión que se saca de ahí no contradice a la §12 sino que la acota: revisar y ejecutar encuentran clases distintas de defecto, y un diseño sin ejecución es una hipótesis. Se retira el corte de alcance de los **catorce sitios** donde aparecía, se acredita en portada la construcción de Bedoya y Montoya —redactada describiendo lo construido y contrastada con el historial del repositorio, no contando aportes—, y el subtítulo pasa a nombrar la construcción y el despliegue. Se corrige de paso un **`7.5` duplicado** que la v1.1 dejó al renumerar, y se precisa que los 350 *tokens* son de respuesta visible: confundirlos con el presupuesto de generación fue uno de los seis defectos. |
| v1.1 | 2026-08-06 | Equipo Alan & Aura Académico | **Tres correcciones, ninguna cosmética.** *(a)* La tabla de integrantes confundía el **rol** con la **contribución a la fase documentada**: repetía los roles que `PLAN-01 §7` prevé para la construcción, posterior a lo que este informe cubre. Al corregirla en un primer intento se degradó sin base el rol de dos integrantes; ahora se separan en dos columnas, de modo que los roles quedan intactos y la contribución dice la verdad. El modelo de clases de diseño es de Santiago Eusse Gil. *(b)* Entra **§4.1**, método instrumental: los ocho agentes especializados que producen cada artefacto —de autoría del líder y residentes fuera de este repositorio— y los modelos empleados con su papel. Sin esa sección, la afirmación de §12.2 de que cada verificación la hizo «un revisor distinto» **no se podía comprobar**; ahora dice cuál hizo cada una y declara el límite: un modelo distinto no sustituye a un revisor humano. *(c)* Entra **§7.4**, la retroalimentación docente: los cuatro puntos del profesor citados literalmente y lo que se hizo con cada uno, incluidos los dos que dan credibilidad al resto — que una de las cuatro se atendió **rechazando su solución literal** por no pasar el test de sustitución, y que la primera pasada de correcciones se hizo sin cargar los agentes y hubo que rehacerla. |
| v1.0 | 2026-08-06 | Equipo Alan & Aura Académico | **Reescritura completa.** Sustituye al `.docx` del 2026-07-18, que afirmaba 10 casos de uso, 12 clases y la pila Django/SQLite/PythonAnywhere, ninguna de las cuatro cosas cierta desde `ADR-002` y la ampliación de la especificación. El informe pasa a Markdown versionado para que entre en el barrido de `verificar_coherencia.py`, que solo recorre `.md` y por eso nunca detectó la desactualización. Entra la sección de aseguramiento de la calidad —la 11 entonces, hoy la 12—, que documenta las dos compuertas, las cinco verificaciones independientes y el defecto que resistió cinco intentos. Alcance: hasta el cierre de `CDR-01`; `ARQ-01` y la construcción quedan fuera. |
