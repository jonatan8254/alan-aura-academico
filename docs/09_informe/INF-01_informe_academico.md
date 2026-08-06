<!-- PORTADA -->
UNIVERSIDAD NACIONAL DE COLOMBIA
Sede Medellín · Facultad de Minas
Diseño y Construcción de Productos de Software

# Alan & Aura Académico

## Diseño y documentación de un MVP conversacional de apoyo emocional no clínico, con seguridad auditable

**Informe académico del proyecto**

**Integrantes**

| | |
|---|---|
| Jonatan Estiven Sánchez Vargas | ideación, liderazgo y arquitectura |
| Santiago Bedoya García | *backend* e infraestructura |
| Luis Fernando Montoya Rodríguez | *frontend* y experiencia de usuario |
| Santiago Eusse Gil | calidad, datos y privacidad |

Profesor: Albeiro Espinosa Bedoya, Ph.D., M.Sc.

Grupo 5 · Período académico 2026-1
Medellín, 6 de agosto de 2026
<!-- /PORTADA -->

**ID:** INF-01 · **Familia:** INF (entrega académica) · **Hogar:** `docs/09_informe/` · **Fecha:** 2026-08-06 · **Versión:** v1.0 (reescritura completa en Markdown versionado; sustituye a `Informe_Academico_Alan_Aura.docx` del 2026-07-18, que quedó obsoleto en cuatro afirmaciones sustantivas. Documenta hasta el cierre de la compuerta `CDR-01`) · **Estado:** vigente.

**Insumos:** los 83 artefactos versionados de `docs/`, con sus fichas leídas en el momento de generar este informe · `HECHOS_CANONICOS.md v1.9` · `REGISTRO_DECISIONES.md` (`SD-01`…`SD-48`) · `RPD-01` y `CDR-01 v2.0`.

**Consumidores:** la evaluación de la asignatura; el equipo, como estado consolidado del proyecto al cierre de la Fase 2.

---

## 1. Resumen

Este informe documenta la concepción, especificación y diseño de «Alan & Aura Académico». El producto es un Producto Mínimo Viable (MVP) de acompañamiento conversacional de apoyo emocional no clínico, dirigido a personas adultas hispanohablantes y encarnado en dos personajes complementarios: Alan, orientado a la activación práctica, y Aura, a la calma y la regulación.

El trabajo siguió un proceso derivado de ICONIX. Su propiedad central es que encadena los artefactos de modo que cada uno se deriva del anterior y puede verificarse contra él: del modelo verbal salen el vocabulario y el comportamiento; de ahí, el modelo de dominio, los casos de uso y su especificación textual; de esa especificación, el análisis de robustez; de los controladores de robustez, los diagramas de secuencia y los casos de prueba; y de los mensajes de secuencia, el modelo de clases de diseño. Dos compuertas formales de revisión técnica según `IEEE 1028` separan las etapas: `RPD-01`, entre el análisis y el diseño detallado, y `CDR-01`, entre el diseño detallado y el código.

El estado al cierre de la Fase 2 se resume en once medidas verificables: 16 clases de dominio, 14 casos de uso, 26 requisitos funcionales, 262 elementos de robustez, 283 mensajes de secuencia, 193 operaciones asignadas, 181 casos de prueba, y un modelo de clases de diseño con 43 clases, 201 operaciones, 51 atributos y 80 relaciones. La matriz de trazabilidad no deja requisitos huérfanos.

El sistema no tiene código en el alcance de este informe. Se encuentra, por diseño, en una etapa de análisis y diseño cuya salida es un paquete documental verificable.

Lo que distingue este proyecto de un ejercicio académico convencional es el aseguramiento de la calidad, y en particular su resultado incómodo: la compuerta `CDR-01` requirió **cinco verificaciones independientes**, cada una ejecutada por un revisor distinto del que había aplicado el retrabajo, y las cinco encontraron defectos. Un único defecto de semántica UML resistió cinco intentos de corrección antes de cerrarse. La sección 11 lo documenta con sus cifras, porque el proceso que produjo esos hallazgos es tan resultado del trabajo como los artefactos que revisó.

---

## 2. Introducción

### 2.1 Contexto y motivación

La salud emocional ocupa hoy un lugar central en la conversación pública, impulsada por un entorno pospandémico que dejó a muchas personas adultas conviviendo con estrés sostenido, desregulación emocional y bajones anímicos. Entre «estar bien» y «necesitar atención clínica» existe una franja amplia y desatendida: personas que solo requieren un espacio de primer apoyo, disponible y no punitivo, donde ser escuchadas y ordenar lo que sienten antes de que un malestar cotidiano escale.

Los modelos de lenguaje hacen viable una experiencia de acompañamiento de calidad conversacional alta. En un dominio sensible, sin embargo, esa viabilidad técnica solo se convierte en ventaja si el producto se construye con seguridad emocional por encima del *engagement*, minimización estricta de datos y transparencia sobre lo que es y lo que no es.

### 2.2 Problema

El problema que aborda el proyecto no es técnico sino de diseño responsable: cómo ofrecer acompañamiento conversacional útil sin incurrir en sobre-promesa clínica, sin acumular datos personales innecesarios y sin fallar en el momento en que aparece una señal de peligro, que es exactamente cuando un sistema de este tipo debe dejar de conversar y derivar.

### 2.3 Objetivo y estructura de este informe

El informe documenta el proyecto desde su concepción hasta el cierre de la compuerta `CDR-01`, ocurrido el 2026-08-05. El diseño físico de la infraestructura (`ARQ-01`) y la construcción, que comenzaron después de esa fecha, quedan fuera del alcance y solo se mencionan como trabajo en curso en la sección 13.

La estructura conserva el esqueleto del informe de avance entregado el 2026-07-18, que la asignatura ya revisó, y lo extiende en los puntos donde el proyecto creció: el proceso ICONIX completo hasta el modelo de clases (sección 7), las decisiones de arquitectura y su reversión (sección 8) y el aseguramiento de la calidad (sección 11), que no existía.

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

**`IEEE 1028`** aporta el procedimiento de revisión. El proyecto ejecutó dos revisiones técnicas formales, con su escala de severidad de cuatro niveles —Crítico [*Catastrophic*], Mayor [*Critical*], Moderado [*Marginal*] y Menor [*Negligible*]—, su taxonomía de anomalías y sus tres disposiciones posibles: `Aceptado`, `Aceptado con verificación de retrabajo` y `Reinspección requerida`. Dos cláusulas de la norma resultaron determinantes en la práctica y se discuten en la sección 11: la §5.2.1, que atribuye la determinación del veredicto al líder del proyecto y no a la revisión, y la §6.5.6.5, que exige que el retrabajo lo verifique alguien distinto de quien lo aplicó.

**`ISO/IEC 25010:2023`** aporta el modelo de calidad. Los requisitos de calidad se organizan por sus características, incluida *safety*, incorporada en la edición de 2023 y particularmente pertinente en este dominio. Cada requisito de calidad lleva una métrica asociada con umbral obligatorio, siguiendo el método *Goal-Question-Metric*.

---

## 5. Alcance del MVP y canon ético

### 5.1 Qué entra en el MVP

El producto permite a una persona adulta registrarse, otorgar consentimiento granular, construir una cápsula de perfil mínima mediante autorreportes, conversar con Alan o con Aura dentro de límites explícitos, consultar un directorio de usuarios, y ejercer control efectivo sobre sus datos: reiniciar la caracterización, revocar la personalización o eliminar la cuenta por completo. Un rol administrativo puede habilitar o deshabilitar globalmente el acceso al chat y consultar métricas operativas agregadas.

Los límites de la conversación son numéricos y están fijados como hechos canónicos del proyecto: 2.500 caracteres por mensaje, 20 mensajes de usuario por sesión, 350 tokens de salida del modelo, un límite de tasa de 3 solicitudes por minuto y 30 diarias, y una espera máxima de 20 segundos ante el proveedor del modelo antes de responder con un error controlado.

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

Un elemento de esa especificación resultó decisivo mucho después. Cada fila de flujo alternativo o de excepción declara su **desenlace**: si el caso de uso termina o si vuelve a un paso concreto. Esa columna, que en el momento de escribirse parecía una formalidad, se convirtió en el criterio que zanjó el defecto más persistente del proyecto, documentado en la sección 11.3.

### 7.3 Análisis de robustez

Los diagramas `DR-01` a `DR-14` traducen cada especificación a objetos de frontera, control y entidad. El conjunto suma 262 elementos: 15 actores, 38 objetos de frontera, 150 controladores y 59 entidades. La cifra de controladores importa porque establece la cota inferior de casos de prueba: cada controlador debe rendir al menos uno.

### 7.4 Compuerta `RPD-01`

La primera revisión técnica formal evaluó el paquete de análisis antes de autorizar el diseño detallado. Sobre 106,1 páginas equivalentes levantó 5 hallazgos: 1 Mayor, 2 Moderados y 2 Menores. Veredicto: `Aceptado con verificación de retrabajo`.

La compuerta atendió además las cuatro observaciones del profesor recogidas en `RET-01`: la relación entre los roles de usuario y administrador, el tratamiento de los actores como objetos del dominio, los requisitos funcionales no reflejados en el diagrama de casos de uso, y la verificación cruzada entre el modelo de dominio y los casos de uso.

### 7.5 Diagramas de secuencia y delta de operaciones

Los diagramas `DS-01` a `DS-14` constituyen el diseño detallado del comportamiento. Suman 283 mensajes, y cada mensaje es una operación asignándose a la clase que lo recibe: ese es su propósito, no ilustrar un flujo. El delta consolidado `DOP-01` registra 193 nombres de operación distintos con la clase que los recibe y la justificación de por qué van ahí.

De los controladores se derivaron 181 casos de prueba (`CP-01` a `CP-14`), con cobertura comprobada de todos los caminos: curso básico, flujos alternativos y flujos de excepción.

### 7.6 Modelo de clases de diseño

`MC-01` consolida 43 clases: 16 del espacio del problema, con nombre idéntico al de `MD-01`, y 27 del espacio de la solución. Contiene 201 operaciones, 51 atributos propios, 11 enumerados y 80 relaciones. La convergencia entre el espacio del problema y el de la solución se verifica mediante una matriz de procedencia que exige que cada elemento trace a su artefacto de origen.

### 7.7 Compuerta `CDR-01`

La segunda revisión técnica formal evaluó si el diseño detallado autorizaba el paso a la construcción. Ejecutó las diez reglas del método sobre el paquete completo y levantó 20 hallazgos: 3 Mayores, 8 Moderados y 9 Menores. La tasa de 0,57 hallazgos por página supera la tasa base de 0,4 medida en documentos de diseño, lo cual se interpreta como cobertura adecuada de la revisión y no como deficiencia del paquete. Veredicto inicial: `Reinspección requerida`.

El proceso que siguió a esa disposición ocupa la sección 11 y es, con diferencia, la parte más instructiva del proyecto.

---

## 8. Arquitectura y decisiones técnicas

`ADR-001` fijó la primera pila tecnológica del proyecto, hoy superada y citada aquí como antecedente: Django sobre SQLite, desplegado en PythonAnywhere, con Groq como proveedor del modelo de lenguaje. Era una elección razonable para el contexto: mínima curva de aprendizaje y despliegue gratuito.

`ADR-002` la revirtió. La arquitectura vigente es React con Vite y TypeScript sobre Vercel para el cliente, y un backend sin servidor en AWS —funciones Lambda tras API Gateway, DynamoDB como almacén y S3 para objetos—, con Tailwind y shadcn/ui en la capa de presentación, autenticación propia y Groq mantenido como proveedor del modelo. La decisión no respondió a una condición de reversa prevista, sino a una elección del equipo, y así queda declarado en la propia ADR.

Esa misma ADR estableció una frontera temporal que gobernó el resto de la Fase 2: el diseño físico —claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM y red— quedaba diferido hasta después del modelo de clases y su compuerta. El motivo se enunció sin rodeos: el modelo de clases aún podía mover atributos y operaciones, y fijar claves antes de esa convergencia produciría retrabajo garantizado. La frontera se respetó hasta el cierre de `CDR-01`.

`ADR-003` eliminó el respaldo del almacén de datos personales, convirtiéndolo en un no-objetivo declarado con su precio escrito: la pérdida de ese almacén sería irrecuperable. La decisión cierra de raíz una vía de reidentificación, y tuvo una consecuencia que reapareció mucho después, al elegir la herramienta de infraestructura como código: sin respaldo, cualquier operación que pueda reemplazar un recurso con estado exige salvaguardas explícitas.

`ADR-004` fijó la supresión inmediata de los datos al eliminar la cuenta, sin ventana de gracia ni marca de baja lógica, y el estado inicial del interruptor de disponibilidad del chat.

---

## 9. Trazabilidad

`TRZ-01` mantiene la correspondencia entre requisitos, casos de uso y clases. `TRZ-DS-01` extiende la cadena hacia el diseño detallado, ligando cada paso del texto de un caso de uso con su mensaje de secuencia, la operación resultante, la clase receptora y el caso de prueba que lo cubre.

La propiedad que ambas matrices garantizan es la ausencia de requisitos huérfanos: todo requisito funcional llega a un caso de uso, y todo elemento de diseño procede de un artefacto anterior identificable. Los 150 controladores del análisis de robustez tienen cobertura completa de casos de prueba.

---

## 10. Requisitos de calidad

Los 10 requisitos de calidad se organizan según las características de `ISO/IEC 25010:2023` e incluyen *safety*, incorporada en esa edición. Cada uno lleva una métrica con umbral obligatorio bajo el método GQM, de modo que la afirmación «el sistema es seguro» se sustituye por una medición con criterio de aceptación.

Las reglas de negocio se clasifican con la taxonomía de Wiegers, que distingue hechos, restricciones, activadores de acción, inferencias y cálculos. La distinción tiene efecto práctico: una restricción se verifica de manera distinta a una inferencia, y confundirlas produce pruebas que no prueban lo que dicen.

---

## 11. Aseguramiento de la calidad

Esta sección documenta el proceso de revisión y sus resultados, incluidos los desfavorables. Se incluye porque el proceso es un resultado del trabajo, y porque su parte más útil para quien lea este informe no son los aciertos sino los cinco intentos fallidos que se describen en 11.3.

### 11.1 Las dos compuertas

| | `RPD-01` | `CDR-01` |
|---|---|---|
| Separa | análisis → diseño detallado | diseño detallado → código |
| Material revisado | 106,1 páginas equivalentes | 35,1 páginas de diseño |
| Hallazgos | 5 | 20 |
| Severidades | 1 Mayor · 2 Moderados · 2 Menores | 3 Mayores · 8 Moderados · 9 Menores |
| Tasa por página | no declarada | 0,57 (base GQM: 0,4) |
| Veredicto | `Aceptado con verificación de retrabajo` | inicial: `Reinspección requerida` |

El retrabajo de los 20 hallazgos de `CDR-01` cerró 17 de ellos, difirió 1 con riesgo aceptado y disparador declarado, y heredó 2 al diseño físico posterior. En el proceso destapó **8 hallazgos nuevos**, lo cual es un resultado esperable: corregir un artefacto obliga a mirarlo con un detalle que la revisión original no alcanzó.

### 11.2 Las cinco verificaciones independientes

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

### 11.3 Caso de estudio: el defecto que resistió cinco intentos

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

### 11.4 El instrumental de verificación

El proyecto construyó sus propias herramientas de comprobación, versionadas en el repositorio y ejecutables por cualquiera que lo clone.

`verificar_coherencia.py` recorre los artefactos en seis bloques: cifras canónicas desactualizadas, residuos de arrastre, disciplina de ficha y versión, versiones declaradas frente a versiones reales, frescura de los artefactos derivados y orden de los historiales de cambios. `barrido_desenlaces.py` comprueba las reglas `R1` y `R2` de la convención descrita arriba, y lleva 18 casos de regresión versionados que se ejercitan con una opción propia de autoprueba. A ellos se suman los validadores de robustez, secuencia y procedencia del modelo de clases.

El instrumental fue a su vez objeto de hallazgos, y esa es la parte instructiva. La cuarta verificación demostró con catorce sabotajes que la primera versión del comprobador de desenlaces decoraba la convención más de lo que la sostenía: cualquier fragmento ocultaba una violación de `R2`, tres formas de flecha escapaban a su expresión regular, y una nota cuyo texto contuviera la palabra `end` descuadraba el recorrido. La quinta encontró un falso negativo adicional que los 18 casos de regresión no cubrían, con una observación que quedó escrita en la cabecera del propio script: los casos de regresión los había escrito el autor a partir de la lista del revisor, de modo que demostraban regresión sobre los defectos **conocidos**, no suficiencia general.

### 11.5 Lecciones

Dos conclusiones del proceso son transferibles fuera de este proyecto.

La primera es que **quien aplica no firma**. La separación entre autor y verificador no es una formalidad burocrática de la norma: en este expediente detectó defectos en cinco de cinco ocasiones, incluida una en que el defecto vivía dentro de la corrección del defecto anterior.

La segunda es que **una convención sin comprobador es una intención**. Las cuatro primeras pasadas sobre el mismo defecto fracasaron mientras la corrección dependía de que alguien aplicara bien un criterio; la quinta funcionó cuando el criterio se convirtió en código ejecutable con casos de prueba propios. El corolario incómodo, que la quinta verificación dejó por escrito, es que un comprobador escrito por el autor a partir de defectos ya conocidos demuestra menos de lo que aparenta: gana cobertura real solo cuando alguien distinto intenta romperlo.

---

## 12. Resultados y estado actual

El paquete al cierre de `CDR-01` queda descrito por las siguientes medidas, todas verificables contra los artefactos que las producen y vigiladas de forma automática frente a desactualización.

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

El veredicto de la compuerta `CDR-01`, determinado por el líder del proyecto el 2026-08-05 conforme a `IEEE 1028 §5.2.1` y sostenido por una quinta verificación independiente, es **`Aceptado con verificación de retrabajo`**, con cero hallazgos Críticos y cero Mayores abiertos.

La forma de la disposición es deliberada. «Con verificación de retrabajo» no describe una firma pendiente, sino que la comprobación es continua: los seis bloques del verificador de coherencia, el comprobador de desenlaces con sus 18 casos de regresión, los validadores de robustez, secuencia y procedencia, y el trinquete de cifras canónicas se ejecutan sobre el repositorio en cualquier momento y por cualquiera.

---

## 13. Conclusiones y trabajo futuro

El proyecto produjo un paquete de análisis y diseño completo, coherente y verificable, sometido a dos compuertas formales de revisión técnica y a cinco verificaciones independientes del retrabajo. El diseño está autorizado para pasar a construcción.

La conclusión metodológica que el equipo extrae no está en los artefactos sino en el proceso. Un proyecto documental de este tamaño acumula afirmaciones que dejan de ser ciertas sin que nadie lo note, y la disciplina que funcionó no fue revisar más veces, sino convertir cada criterio en algo ejecutable. El caso extremo lo aportó el propio informe que este documento sustituye: pasó tres semanas afirmando cifras que ya eran falsas —diez casos de uso y doce clases, cuando eran catorce y dieciséis— junto a una pila tecnológica abandonada, precisamente porque era el único artefacto que ningún validador recorría.

**Trabajo en curso.** Con posterioridad al cierre documentado en este informe, el equipo fijó la herramienta de infraestructura como código, produjo el diseño físico `ARQ-01` —claves de DynamoDB, contrato de la API, inventario de S3 e IAM— e inició la construcción con un contrato compartido y un servidor de simulación que permite trabajar en paralelo el cliente y el servidor. Ese trabajo queda fuera del alcance de este documento y se informará por separado.

**Trabajo pendiente declarado.** Nueve puntos permanecen abiertos en el tablero de pendientes del proyecto, ninguno de ellos bloqueante para la construcción: tres corresponden al diseño físico, uno a la fase de construcción, dos a fases posteriores de verificación documental, uno a la propagación de una corrección hacia el documento de visión, uno a validaciones que requieren decisión del equipo sobre servicios externos y frontera legal, y uno a la entrega académica.

---

## 14. Referencias

International Organization for Standardization. (2023). *ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*. ISO.

Institute of Electrical and Electronics Engineers. (2008). *IEEE Std 1028-2008 — IEEE Standard for Software Reviews and Audits*. IEEE.

Object Management Group. (2017). *OMG Unified Modeling Language (OMG UML), Version 2.5.1*. OMG.

Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language* (3.ª ed.). Addison-Wesley.

Rosenberg, D., & Stephens, M. (2007). *Use Case Driven Object Modeling with UML: Theory and Practice*. Apress.

Rosenberg, D., Stephens, M., & Collins-Cope, M. (2005). *Agile Development with ICONIX Process: People, Process, and Pragmatism*. Apress.

Wiegers, K., & Beatty, J. (2013). *Software Requirements* (3.ª ed.). Microsoft Press.

---

## 15. Anexos

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
| `MV-01` | `02_modelos_verbales/MV-01_modelo_verbal_general.md` | v2.7 |
| `CONV-CONTRATO-01` | `02_modelos_verbales/CONTRATO_conversacional.md` | v1.2 |
| `REQ-01` | `03_requisitos/REQ-01_requisitos.md` | v1.7 |
| `PER-01` | `03_requisitos/PER-01_mapa_persistencia.md` | v1.7 |
| `PRIV-01` | `03_requisitos/PRIV-01_privacidad_datos.md` | v1.8 |
| `SEG-01` | `03_requisitos/SEG-01_protocolo_seguridad.md` | v1.2 |
| `TRZ-01` | `04_trazabilidad/TRZ-01_trazabilidad.md` | v2.1 |
| `NORM-01` | `04_trazabilidad/NORM-01_puente_normativo.md` | v1.0 |
| `PLAN-01` | `05_plan/PLAN-01_plan_proyecto.md` | v1.2 |
| `DIS-00` | `08_diseno/DIS-00_inventario_y_plan.md` | v1.1 |
| `DIS-01` | `08_diseno/DIS-01_sistema_diseno.md` | v1.1 |

Cuatro artefactos citables carecen de campo `Versión` en su ficha: `ADR-002`, `ADR-003`, `ADR-004` y `RPD-01`. Es una inconsistencia menor de la disciplina documental del proyecto, detectada al preparar este informe y registrada aquí en lugar de corregirse sobre la marcha, porque la corrección corresponde a la revisión de esos artefactos y no a su cita.

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

### Gobernanza

| Artefacto | Función | Versión |
|---|---|---|
| `HECHOS_CANONICOS` | tabla de cifras canónicas del proyecto | v1.9 |
| `ESTADO_PIPELINE` | estado de fase y tablero de pendientes | v3.9 |
| `REGISTRO_DECISIONES` | las 48 decisiones documentadas en el anexo D | — |
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

Las 48 decisiones documentadas del proyecto hasta el cierre de la compuerta `CDR-01`. Cada una consta en `REGISTRO_DECISIONES.md` con su justificación completa, su estado de confirmación y su propagación a los artefactos afectados.

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

Las decisiones `SD-41` a `SD-47` corresponden en su totalidad al ciclo de corrección y verificación de la compuerta `CDR-01` descrito en la sección 11. Siete decisiones para cerrar una compuerta es una cifra alta, y la sección 11.3 explica por qué hicieron falta.

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
| v1.0 | 2026-08-06 | Equipo Alan & Aura Académico | **Reescritura completa.** Sustituye al `.docx` del 2026-07-18, que afirmaba 10 casos de uso, 12 clases y la pila Django/SQLite/PythonAnywhere, ninguna de las cuatro cosas cierta desde `ADR-002` y la ampliación de la especificación. El informe pasa a Markdown versionado para que entre en el barrido de `verificar_coherencia.py`, que solo recorre `.md` y por eso nunca detectó la desactualización. Entra la sección 11, aseguramiento de la calidad, que documenta las dos compuertas, las cinco verificaciones independientes y el defecto que resistió cinco intentos. Alcance: hasta el cierre de `CDR-01`; `ARQ-01` y la construcción quedan fuera. |
