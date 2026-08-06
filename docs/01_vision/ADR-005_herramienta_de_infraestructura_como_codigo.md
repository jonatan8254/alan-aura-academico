# ADR-005 — Infraestructura como código: **AWS CDK en TypeScript**

**ID:** ADR-005 · **Hogar:** `docs/01_vision/` · **Fecha:** 2026-08-05 · **Estado:** aceptada (con verificaciones pendientes).
**Insumos:** `ADR-002 §1` (que difirió esta elección), `ADR-002-D1`/`D4`/`D5`/`D6`/`D7`, `ADR-003`, `ADR-004-D1`, `PER-01 §5` (`PER-T1`, `PER-T5`), `CDR-01 v2.0` (su cierre es lo que desbloquea esta decisión), `PLAN-01`, y la documentación oficial de AWS empaquetada en las skills `aws-cdk`, `aws-serverless` y `aws-cloudformation` (`aws-core 1.1.0`). Decisión del equipo (SD-49).
**Consumidores:** **`ARQ-01`** (destinatario directo: es la herramienta en la que escribirá su diseño físico), fase 3 de construcción, `PLAN-01`.
**Naturaleza:** registro de decisión de arquitectura. **Decide herramienta; no decide esquema.**

**Nota de alojamiento — dicha porque parece una desviación y conviene que no lo parezca.** `ADR-002 §1` difirió esta elección *«a `ARQ-01`»*, junto con IAM, red y *runbook*. Se registra aquí, como ADR propia, por dos motivos: es una decisión de **tecnología con condiciones de reversa**, que es exactamente la forma de una ADR, y mantenerla fuera deja a `ARQ-01` libre para ser lo que debe ser, el diseño físico. **La frontera sustantiva no se cruza:** lo que `ADR-002 §1` protegía era decidir *antes de que `MC-01` convergiera*, y `MC-01` quedó congelado al cerrarse el `CDR` (`SD-46`). `ARQ-01` **cita** esta decisión en lugar de contenerla.

**Regla de honestidad (§4.9).** **No se ejecutó CDK, ni SAM, ni CloudFormation para escribir esto.** Ninguna de las tres está instalada en el entorno y no se desplegó nada. Ninguna cifra ni afirmación de rendimiento aquí está **medida**. Las advertencias operativas que se citan provienen de la documentación oficial de AWS empaquetada en las skills, y van marcadas como tales; los juicios sobre el encaje con este proyecto van `[I2]`.

## Escala de verificación

| Marca | Significado |
|---|---|
| **[E1]** | Evidencia directa, localizable en el artefacto o en la skill oficial citada. |
| **[I2]** | Interpretación del orquestador al cruzar la fuente con el canon del proyecto. Defendible, con su argumento escrito; **no** es lo que la fuente dice literalmente. |
| **[N6]** | Hecho externo volátil: además de verificar, monitorear. |

---

## §0 — Por qué existe esta ADR, y por qué ahora

Porque `ARQ-01` no puede escribir nada sin ella. Sus cuatro entregables —claves de DynamoDB, tabla de *endpoints*, inventario de S3, e IAM y red— se materializan **en** una herramienta de infraestructura como código, y `ADR-002 §1` la dejó sin decidir. `[E1]`

Y ahora, porque la condición que lo bloqueaba se cumplió. `ADR-002 §1` no difería por prudencia genérica sino por una razón concreta: *«el diagrama de clases aún puede mover atributos y operaciones. Fijar claves antes de esa convergencia produce retrabajo garantizado»*. Con el `CDR` cerrado (`SD-46`), `MC-01` queda congelado en **43 clases, 201 operaciones, 51 atributos y 80 relaciones**, y esa razón se agota. `[E1]`

---

## §1 — Frontera de esta ADR

Decide **con qué se escribe** la infraestructura. **No** decide qué se escribe. Siguen íntegramente en `ARQ-01`: `[E1]`

- El diseño de claves de DynamoDB —particiones, ordenación, índices secundarios, TTL, tabla única frente a múltiple.
- La tabla formal de *endpoints* y los contratos de API.
- El inventario físico de contenedores, prefijos y políticas de S3.
- Las políticas IAM concretas, la red y el *runbook* de despliegue.
- Las cuatro deudas heredadas: **CSRF**, el *endpoint* de cierre de sesión (`RA-01` de `ECU-03`), **`PER-H4`** y **`H-09`** del `CDR`.

---

## ADR-005-D1 — La herramienta es **AWS CDK, en TypeScript** `[I2]`

**Contexto.** El backend son funciones Lambda en Node 22 y TypeScript tras API Gateway, con DynamoDB y S3 (`ADR-002-D4/D5/D6`). Es una superficie modesta: sin VPC, sin contenedores, sin colas. Las tres candidatas realistas —CDK, SAM y CloudFormation— tienen skill oficial instalada, así que ninguna queda fuera por falta de soporte. `[E1]`

**Decisión.** Escribir la infraestructura como **código TypeScript con AWS CDK**, sintetizado a CloudFormation. `[N6]`

**Los dos motivos, en orden de peso:**

1. **Coherencia con un beneficio que `ADR-002` ya reclamó.** `ADR-002-D1` justifica TypeScript diciendo que los tipos de `ChatRequestV1`/`ChatResponseV1` se comparten entre cliente y funciones, *«lo que elimina la posibilidad de que diverjan»*, y `ADR-002-D4` declara como consecuencia *«un solo lenguaje en todo el repositorio»*. Una plantilla YAML deja la infraestructura **fuera** de esa propiedad: nombres de tabla, rutas y variables de entorno vuelven a ser cadenas que ningún compilador contrasta. CDK extiende a la infraestructura la garantía que el ADR vigente ya reclamó para el código. `[I2]`

2. **IAM.** Los constructos de nivel 2 conceden permisos mediante métodos `grant*`, que derivan políticas de **mínimo privilegio** a partir del recurso concreto [E1, skill `aws-serverless`]. `ESTADO_PIPELINE` advierte que `ARQ-01` es *«el primero que toca decisiones de seguridad reales»*; que la herramienta derive los permisos en lugar de que cuatro personas sin experiencia previa en IAM los escriban a mano reduce la superficie de error justo donde equivocarse sale más caro. `[I2]`

**Detalle operativo que evita una trampa conocida:** el constructo `NodejsFunction` (`aws-cdk-lib/aws-lambda-nodejs`) **empaqueta TypeScript con esbuild automáticamente y sin Docker** [E1, skill `aws-serverless`]. Es la variante que corresponde a este backend; la equivalente de Python sí exige Docker, y confundirlas es una fuente habitual de fallos de empaquetado.

**Lo que esta decisión cuesta, dicho sin rebajarlo `[I2]`:** CDK tiene la curva más alta de las tres. Añade conceptos propios —*bootstrap*, constructos, identificadores lógicos, síntesis— sobre un equipo que ya está aprendiendo React, TypeScript y AWS a la vez, con un plan de un mes. **SAM habría sido la elección de menor fricción** y es defendible: *«solo `Transform` y `Resources` son obligatorios»*, y `AWS::Serverless::Function` genera la función y su rol IAM en un mismo bloque `[E1]`. Se descarta por el motivo 1, no por capacidad técnica.

---

## ADR-005-D2 — Dos reglas operativas **obligatorias**, no recomendaciones `[I2]`

**Contexto — y es la parte de esta ADR que más importa.** La skill oficial advierte: *«Construct ID changes cause replacement»* — renombrar o mover un constructo cambia su identificador lógico y **CloudFormation reemplaza el recurso, con pérdida de datos en los recursos con estado** [E1, skill `aws-cdk`].

En un proyecto normal eso se repara restaurando un respaldo. **Aquí no hay ninguno:** `ADR-003` estableció que el almacén operativo **no se respalda**, y declaró su precio con estas palabras — *perder ese almacén es irrecuperable*. `[E1]`

Es decir: **el riesgo genérico de CDK y el no-objetivo declarado de `ADR-003` se multiplican.** Un refactor de nombres mal hecho deja de ser un susto y pasa a ser pérdida definitiva. Aceptar `D1` sin cubrir esto sería aceptar solo su mitad agradable.

**Decisión.** Dos reglas, exigibles y no delegadas a la memoria de nadie:

- **R1 — `cdk diff` antes de todo despliegue.** Si el *diff* anuncia **reemplazo** de un recurso con estado, el despliegue **se detiene** y el cambio se revisa. La skill lo formula como obligación: *«Always `cdk diff` before deploy»* `[E1]`.
- **R2 — `RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE` en los recursos con estado, y no `RETAIN` a secas.** La distinción no es cosmética: la documentación oficial de CDK dice que `RETAIN` protege *«when they are requested to be deleted»* — solo el escenario de **borrado**. El escenario que esta regla existe para prevenir es un **reemplazo durante una actualización** (`D2`, contexto), y ese solo lo cubre `RETAIN_ON_UPDATE_OR_DELETE`, que protege explícitamente *«when they need to be replaced due to a stack update request»* `[E1, docs.aws.amazon.com/cdk]`. Con matiz: si el recurso nuevo se crea y el despliegue hace *rollback*, ese recurso nuevo **sí se borra** por no tener datos ni uso; lo que se retiene es el recurso en uso, con datos. Así, ni un `cdk destroy` accidental, ni un reemplazo por renombrar un constructo, se llevan el dato por delante.

**Consecuencia declarada de R2, para que nadie la descubra como sorpresa:** `RETAIN` deja recursos huérfanos al destruir una pila, que hay que limpiar a mano. Es el precio correcto: **un recurso huérfano se borra cuando se decide; un dato borrado no vuelve.** `[I2]`

**Nota adicional sobre S3, hoy sin conflicto y mañana quizá sí.** La skill advierte que los *buckets* no vacíos sobreviven a `destroy` salvo que se fijen `removalPolicy: DESTROY` **y** `autoDeleteObjects: true`, y que *«los versionados son peores: los marcadores de borrado persisten»* `[E1]`. `ADR-002-D6` usa S3 **con versionado**, y `ADR-004-D1` exige supresión física e inmediata. **Hoy no hay conflicto de canon**, porque tras `ADR-003` S3 solo guarda configuración y activos, nunca dato personal. Se deja escrito por si alguien propone guardar otra cosa ahí: esa propuesta tendría que releer esta nota antes. `[I2]`

---

## ADR-005-D3 — Las herramientas de iteración rápida son **solo de desarrollo** `[E1]`

**Contexto.** CDK ofrece `cdk deploy --hotswap` y `cdk watch`, que actualizan el recurso directamente y saltan CloudFormation. La skill es explícita: ambas *«bypass CloudFormation safety and introduce drift»* y son **development-only**.

**Decisión.** Se admiten en desarrollo local y **quedan prohibidas** en cualquier entorno que se presente, evalúe o demuestre. Lo que se entregue se despliega con `cdk deploy` completo, para que el estado desplegado sea el que la pila describe.

**Motivo `[I2]`:** una demostración académica que corre sobre un despliegue con desviación no es reproducible, y `RC-09` exige *«despliegue reproducible según runbook»*. Un `hotswap` invisible convierte ese umbral en una afirmación falsa sin que nadie lo note.

---

## §2 — Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **AWS SAM** | La opción de menor curva y encaje más directo, y **la única descartada con reparo**. Cae por `D1` motivo 1: introduce YAML como segundo lenguaje y deja la infraestructura fuera de la comprobación de tipos que `ADR-002-D1` reclama como beneficio. Si la curva de CDK resultara insostenible, es la reversa (§4). |
| **CloudFormation puro** | Tiene un argumento pedagógico legítimo —CDK y SAM generan CloudFormation de todos modos, y entenderlo tiene valor en una materia de diseño de software— pero es el camino largo: todo explícito, roles IAM incluidos. El plan de un mes no lo regala. |
| **Terraform u otras de terceros** | Añaden un binario y un lenguaje más, un estado remoto que gestionar y **ninguna skill instalada que las cubra**. Su ventaja real —ser agnósticas de proveedor— no le sirve a un proyecto que ya decidió AWS en `ADR-002`. |

---

## §3 — Consecuencias

1. **`ARQ-01` queda desbloqueado** y escribe su diseño físico en constructos de CDK. `[E1]`
2. **Aparece un paso previo por cuenta y región:** `cdk bootstrap aws://$ACCOUNT/$REGION` [E1, skill `aws-cdk`]. **Y arrastra la pregunta de región, que sigue abierta:** `PRIV-01 §4.1` la reserva a `V6-b` por sus consecuencias bajo la Ley 1581. El `bootstrap` **no puede leerse como decisión de residencia**; si se ejecuta antes de `V6-b`, se hace sobre una región provisional y así debe declararse. `[I2]`
3. **El repositorio gana una tercera zona de TypeScript** —interfaz, funciones e infraestructura—, con la ventaja de compartir tipos y el deber de no mezclar dependencias entre ellas.
4. **`ADR-002-D4` no se ve afectado en su nota de alcance:** el instrumental documental (`scripts/verificar_coherencia.py`, `grafo/scripts/`, los generadores de SVG) sigue en Python, porque no es código de producto. Esta ADR tampoco lo cambia. `[E1]`
5. **`PER-T5` gana instrumento:** la expiración nativa por tiempo de vida de DynamoDB se declara en el constructo, de modo que la purga por ventana deja de ser una exigencia sin mecanismo. **Los valores concretos son de `ARQ-01`.** `[E1]`

---

## §4 — Condición de reversa

**Si la curva de CDK resultara insostenible para el plazo**, la salida es **SAM**, y no es traumática por una razón concreta: CDK **sintetiza CloudFormation**, y SAM **es** CloudFormation con una transformación. La plantilla generada por `cdk synth` es una salida legible que puede adoptarse a mano, y la skill `aws-cdk` documenta además `cdk import` para incorporar recursos ya creados. `[I2]`

**Lo que la reversa NO permite:** cambiar de herramienta **con recursos con estado ya desplegados y poblados** sin un plan explícito de importación. Con `ADR-003` vigente, improvisar esa migración es arriesgar el dato. Si la reversa se ejerce, que sea **antes** de que haya datos, o con importación declarada paso a paso.

---

## §5 — Verificaciones pendientes

Ninguna de estas se ha hecho. Se enumeran para que no se den por hechas. `[E1]`

| # | Qué falta verificar | Marca | Dónde |
|---|---|---|---|
| 1 | Que CDK se instala y sintetiza en el entorno del equipo — **no está instalado en ninguna máquina del proyecto a fecha de hoy** | **[E1]** | Inicio de `ARQ-01` |
| 2 | Que `NodejsFunction` empaqueta el backend TypeScript sin Docker, como la skill afirma | **[N6]** | Primera función |
| 3 | Que la región del `bootstrap` es admisible bajo la Ley 1581 | **[N6]** | `V6-b`, antes de cualquier uso con personas reales |
| 4 | Que `R1` y `R2` de `D2` se cumplen en la práctica, con una tabla real desplegada — **la ambigüedad de qué valor de `RemovalPolicy` usar ya se resolvió contra la documentación oficial** (§`D2`), lo que falta es la prueba de que el comportamiento declarado ocurre de verdad al desplegar | **[E1]** | Continuo, desde el primer despliegue |
| 5 | Que la curva de aprendizaje no consume el plazo — es el riesgo declarado de `D1` | **[I2]** | `PLAN-01`, revisión de avance |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-05 | S. Bedoya | Creación (SD-49). `D1` fija **AWS CDK en TypeScript**, por coherencia con el lenguaje único que `ADR-002-D1`/`D4` declaran como beneficio y por el IAM de mínimo privilegio de los constructos L2; SAM se descarta con reparo y queda como condición de reversa. `D2` convierte en **obligatorias** dos reglas —`cdk diff` antes de desplegar y `RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE` en recursos con estado, **no `RETAIN` a secas**, porque solo la primera protege también el reemplazo por actualización y no únicamente el borrado— porque el riesgo genérico de reemplazo por cambio de identificador lógico **se multiplica** con el no-objetivo de `ADR-003`: sin respaldo, un refactor mal hecho es pérdida irrecuperable. `D3` acota las herramientas de iteración rápida a desarrollo, porque introducen desviación y `RC-09` exige despliegue reproducible. **No decide esquema:** claves, *endpoints*, S3 e IAM siguen íntegros en `ARQ-01`. |
