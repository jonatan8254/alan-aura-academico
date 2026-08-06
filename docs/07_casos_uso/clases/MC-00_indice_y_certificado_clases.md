# MC-00 — Índice y certificado del modelo de clases de diseño

**ID:** MC-00 · **Familia:** MC (clases de diseño, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/clases/` · **Fecha:** 2026-08-04 · **Versión:** v2.1 (SD-45, `SD-45-H1`: `informarPeticionInvalidaYVolverAlPaso1()` contradecía sus dos `ECU`, que dicen paso 2; renombrada. **Es un renombre: ninguna cifra se mueve**). v2.0 (SD-44: `TVI-03` — `rechazarConfirmacionInvalidaYVolverAlPaso1()` contradecía su propio flujo, que vuelve al paso 2; renombrada en `MC-01` y en `DS-10`. **Ninguna cifra se mueve**: es un renombre). v1.9 (SD-39: §4 arrastraba dos cifras que §3 ya había movido). v1.8 (SD-39: propagación de cifras — 43 clases, 201 operaciones, 51 atributos, 80 relaciones, 11 paquetes). v1.7 (SD-39: `MC-01_cabeceras.txt` se versiona y `verificar_coherencia.py` gana el bloque 5 de frescura). v1.6 (SD-39: regla #2 ejecutada — §5.4, y `scripts/generar_cabeceras_mc01.py`). v1.5 (SD-39: título en los tres diagramas de PlantUML y las 9 dependencias a los tipos de transferencia — relaciones **71 → 80**). v1.4 (SD-39: `E-2` cerrado — el `.svg` está generado y mirado). v1.3 (SD-39: retrabajo del `CDR-01` — `H-10` y `H-12`). v1.2 (SD-35: `PER-H2` cerrado tras emitir el modelo). v1.1 (SD-33: `PER-H5` cerrado por `ADR-003` tras emitir este modelo). v1.0 · **Estado:** Propuesto.
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
├── MC-01_modelo_clases_diseno.svg          vista derivada (SD-39; PlantUML 1.2026.6)
├── MC-01_matriz_procedencia.md             elemento ↔ artefacto ↔ localizador
├── COD-01_insumos_para_codigo.md           clase · atributo · operación · firma · capa
├── MC-01_cabeceras.txt                     regla #2 del CDR: cabeceras para inspección (SD-39)
├── scripts/verificar_procedencia_mc01.py   verificación EXACTA de procedencia
└── scripts/generar_cabeceras_mc01.py       regla #2 del CDR, con el alias como identificador (SD-39)
```

El `.puml` es la **fuente de verdad**. `COD-01` es una **proyección tabular suya**, no una segunda fuente.

## 3. El modelo, en cifras

| Magnitud | Valor |
|---|---|
| Clases | **43** (+ 11 enumerados = 54 declaraciones) |
| — del espacio del **problema** | **16 / 16** de `MD-01 v1.4`, con nombre idéntico |
| — del espacio de la **solución** | **27**, todas marcadas `<<solucion>>` |
| Atributos | **51** propios de clase (+ 34 literales de enumerado = 85, que es lo que cuenta el validador) |
| Operaciones | **201** |
| Relaciones | **80** reales = 4 generalizaciones + 1 composición + 12 asociaciones (**las 17 de `MD-01`**) + 63 dependencias. El `.puml` dibuja además **2 conectores entre notas** que **no** son relaciones (`H-13`) |
| Paquetes | **11** |
| Enumerados con dominio de valor | **11** |
| Clases sin procedencia | **0** |
| Operaciones sin mensaje | **0** |

**Por qué 201 operaciones y `DOP-01` dice 193 — y la respuesta cuadra al número exacto.** Las dos cifras son correctas y cuentan cosas distintas: `DOP-01` cuenta operaciones **distintas por nombre**; `MC-01` cuenta pares **(clase, operación)**, que es lo que un modelo estático contiene. Contados sobre el `.puml`: **193 nombres distintos + 8 repeticiones = 201 pares.** Los 193 nombres distintos **son exactamente los 193 de `DOP-01`**, y esa coincidencia numérica es el mejor indicio de que el volcado del delta no perdió ni añadió nada. *(Eran 192 y 200 hasta SD-39: el retrabajo del `CDR-01` retiró una operación y añadió dos — ver §5.4 y el historial.)*

Los **seis** nombres que viven legítimamente en más de una clase, y por qué ninguno es duplicación:

| Operación | Clases | Por qué está en varias |
|---|---|---|
| `describirRolYEstilo()` | `Alan`, `Aura` | Cada personaje describe **su** rol. `DS-14` les manda un mensaje a cada uno |
| `determinarRolEnElServidor()` | `Usuario`, `Administrador` | `RNF-08`: el rol se determina en servidor, en el rol concreto. `DS-03` lo manda a las dos |
| `verificarSesionYRol()` | P-10, P-13 | Dos pantallas distintas que comprueban su propia sesión (`DS-06`, `DS-04`) |
| `verificarSesionYRolDeAdministrador()` | P-14, P-15, P-16 | Las tres pantallas administrativas, en `DS-08`, `DS-09` y `DS-10` |
| `solicitarReingresoPorCU03()` | P-03, P-04, P-11 | Tres destinos de reingreso distintos: usuario, administración y el panel de error del chat |
| `informarIndisponibilidadTemporal()` | P-10, P-11 | `DS-13` la presenta en el chat; `DS-06` la delega al panel de error |

**Por qué 27 clases de solución y `DOP-01 §8` dice 3.** Es un hallazgo, no una discrepancia de este modelo — ver `H-B` en §6. *(Eran 21 hasta SD-39, cuando `H-04` dio forma a los 6 tipos de transferencia.)*

## 4. Certificado de auditoría — capas ejecutadas y NO ejecutadas

Ninguna capa queda en silencio. Esa es la exigencia del método y el motivo de esta tabla.

| # | Capa | Resultado |
|---|---|---|
| 1 | Notación y contrato de salida | ✅ Las tres directivas obligatorias; **sin `hide methods`**; sin *getters* ni *setters*; toda operación con retorno y toda lista de parámetros tipada |
| 2 | Procedencia de **clases** | ✅ **0 sin procedencia.** 16/16 del dominio con nombre idéntico — sin deriva de vocabulario que declarar; **27** de solución, todas marcadas |
| 3 | Procedencia de **operaciones** | ✅ **0 sin mensaje**, y comprobado de forma **exacta** por línea de vida, no por bolsa de palabras — ver §5 |
| 4 | Procedencia de **atributos** | ✅ Los **85** con localizador en `MC-01_matriz_procedencia.md §3` |
| 5 | Procedencia de **relaciones** | ✅ Las 17 de `MD-01` intactas; las de solución solo donde una operación navega |
| 6 | Anemia y responsabilidades | ✅ Ninguna entidad recibe solo `obtener`/`asignar`; ninguna clase del dominio queda sin operaciones |
| 7 | Granularidad (clase Dios / enjambre) | ⚠️ **3 avisos, con juicio aplicado** — §7 |
| 8 | Entidades sin atributos | ⚠️ **6 avisos, las seis con causa declarada aguas arriba** — §7 |
| 9 | Anti-patrones 1-16 | ✅ Revisados uno a uno — §8 |
| 10 | Cobertura del delta `DOP-01` | ✅ Criterio de entrada del CDR satisfecho de forma exacta |
| — | **Arquitectura / infraestructura** | ⛔ **NO EJECUTADA, por decisión declarada** — §4.1 |
| — | **Render del `.svg`** | ✅ **EJECUTADO y mirado** en el retrabajo del `CDR-01` (SD-39) — §4.2 |

### 4.1 `E-1` de `MC-00` · La capa de infraestructura no se ejecuta

Hereda `E-1` de `DS-00` y la frontera que fija `ADR-002 §1`: el diseño físico —claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM y red— es **`ARQ-01`**, posterior a este modelo **y a su CDR**. No hay ninguna clase `INF_`, ni repositorio, ni DAO, ni sesión como clase (comprobado).

**El coste, declarado y no disimulado.** La fuente **no** avala omitir la infraestructura sin más: el ejercicio 8-3 advierte que produce *«leaps of logic»*. Lo que sí avala es el **orden** (anti-patrón #6): primero el comportamiento del dominio, después la infraestructura que ese reparto necesite. Este modelo ejecuta la primera mitad. **Qué la cierra:** `ARQ-01`.

**Consecuencia visible en el modelo:** `TitularDeCuenta.establecerSesionConElRolDeterminado()` devuelve `Sesion`, un tipo con nombre y **sin clase que lo declare**. Es deliberado: `DOP-01 §2` ya había declarado que la sesión no es concepto del problema y que su mecanismo va a `ARQ-01`.

### 4.2 `E-2` de `MC-00` · CERRADO — el `.svg` está generado **y mirado**

> **`E-2` queda cerrado en el retrabajo del `CDR-01` (SD-39).** Se instaló `plantuml.jar` **1.2026.6**
> —la misma versión con la que se generó `MD-01_modelo_dominio.svg`, para que el render sea
> consistente con el resto del corpus— **en el directorio temporal de trabajo, no en el repositorio**;
> solo entra a git el `.svg`. `MC-01_modelo_clases_diseno.svg`: **264 KB**, `10918 × 2131 px`, firma
> `<?plantuml 1.2026.6?>`, **cero errores de sintaxis** y las **54 declaraciones dibujadas** (43 clases
> + 11 enumerados), comprobado sobre el propio `.svg`.
>
> **Y se miró, que era el punto.** Se rasterizó y se inspeccionó, primero el diagrama entero y después
> el tercio derecho por separado. **La primera rasterización salió cortada** —PlantUML aplica un tope
> de 4096 px por defecto (`PLANTUML_LIMIT_SIZE`) y el diagrama mide 10918—, así que la mitad derecha
> no se había visto; se repitió con el tope elevado. Es exactamente el modo de fallo que `PDR-01 §7`
> documenta: *mirar* puede dar por bueno lo que no se vio entero.
>
> **Tres cosas que la inspección visual encontró, y que la comprobación estructural no podía ver.
> Las dos primeras ya están CORREGIDAS, con tu aprobación; la tercera no procede tocarla:**
> 1. ✅ **El diagrama no llevaba título** — el mismo defecto que `PDR-01 §7` cazó en nueve de catorce.
>    **Corregido en los tres artefactos que se renderizan con PlantUML**, no solo en este: `MC-01`,
>    `MD-01` y `DCU-01`. Arreglar uno solo habría cambiado un defecto compartido por una inconsistencia
>    nueva. Toca `MD-01`, que es de `/uml-domain-modeler`, y por eso se declara. **Antes de editarlo se
>    comprobó que este PlantUML reproduce los dos `.svg` existentes byte a byte**, para que el único
>    cambio en el diff fuera el título y nada más.
> 2. **La proporción es de 5:1** (`10918 × 2131`) con mucho blanco. **Medido, no supuesto:** se renderizó
>    una copia de ensayo con el paquete ya conectado y el ancho baja a `9347` —**un 14 %**, de 5,1:1 a
>    4,2:1—. O sea que la isla explica **una séptima parte** del ancho, no el ancho. El resto es
>    intrínseco: **18 clases de pantalla en fila**. No hay maquetación que arregle eso, y el
>    anti-patrón 16 prohíbe intentarlo; si el CDR pide legibilidad, la salida es la **vista reducida**
>    que el anti-patrón 13 ya anticipó, no mover cajas.
> 3. ✅ **Esos tipos no tenían dependencia, y la regla del propio modelo la exige.** `MC-01_matriz_procedencia §1`
>    dice que las relaciones de solución van *«solo donde una operación navega»*, y una operación que
>    **devuelve** `FilaDeDirectorio` navega hacia ella: el modelo **incumplía su propia regla**. Ese es
>    el argumento, no la legibilidad. **Corregido con tu aprobación: 9 flechas, no 6** —seis son los
>    tipos y nueve las clases que los devuelven, porque `Persona` la devuelven tres—, de modo que las
>    relaciones pasan de **71 a 80**. Es **cifra**, así que se registra en `SD-39` y se propaga; no se
>    movió en silencio. `Sesion` y `ContextoInicialConversacionalV1` **no reciben flecha**: no están
>    declarados, por la decisión que `E-1` y `ADR-002 §1` sostienen.
>    **Verificado tras aplicarlo:** validador de clases **0 errores / 9 advertencias** —línea base
>    exacta—, procedencia **sin discrepancias**, los 14 `DR` y los 14 `DS` sin cambio, y el ancho baja
>    de `10918` a **`9347` px**.
>
> El texto original de `E-2`, que describía por qué **no** se pudo, se conserva abajo como registro de
> lo que se declaró en su momento.

#### Texto original de `E-2` (v1.0) — se conserva como registro

**PlantUML no está disponible en el entorno de esta pasada.** Se comprobó: no hay ejecutable `plantuml` en el `PATH`, no hay `plantuml.jar` bajo las extensiones de VS Code, y el módulo `plantuml` de Python no está instalado. Hay Java, pero sin el `jar` no sirve. `MD-01_modelo_dominio.svg` lleva la firma `<?plantuml 1.2026.6?>`, así que en su día se generó con una herramienta que aquí no está.

**Lo que sí se hizo, y lo que no.** Se ejecutó una comprobación **estructural** del `.puml` —`@startuml`/`@enduml`, las tres directivas, llaves balanceadas (59/59), toda clase abriendo cuerpo en su misma línea, sin accesores, todo atributo tipado y toda operación con retorno— y pasó. **Eso no es un render.** Que PlantUML lo dibuje sin colisiones y que se lea bien queda **SIN VERIFICAR**, y este proyecto tiene motivo para no darlo por hecho: `PDR-01 §7` registra que **nueve de catorce SVG salieron sin título** y que solo se descubrió al rasterizar y mirar.

**Cómo cerrarlo:** `java -jar plantuml.jar -tsvg MC-01_modelo_clases_diseno.puml`, o la extensión PlantUML de VS Code, y **mirar el resultado**. Hasta entonces la fila queda ⛔.

## 5. Lo que la verificación encontró y la lectura no

**Tres defectos los cazó una herramienta, no la revisión** — y uno de ellos era mío.

1. **El validador de la skill dio `LISTO PARA EL CDR` con 0 operaciones parseadas.** La primera versión del `.puml` llevaba el color en línea (`class X #E6F1FB;line:...  {`, la misma forma que usa `MD-01`). Con ella, `cuerpo_de_clase()` aborta —busca `{` inmediatamente tras el nombre y encuentra `#`— y descarta el cuerpo entero **en silencio**: el informe decía «Operaciones: 0» y aun así imprimía veredicto favorable. `MD-01` nunca lo sufrió porque declara `hide fields`/`hide methods` y no tiene cuerpos. Corregido pasando el color a estereotipo; el conteo saltó de 0 a 200. Reportado como `H-M`.

2. **`marcarLosCuatroAutorreportesParaDescarte()` estaba en la clase equivocada — error de este modelo.** La puse en `Consentimiento`; `DS-12:62` dibuja `E_Consentimiento -> E_CapsulaDePerfil`, así que la receptora es `CapsulaDePerfil`. Es **exactamente la técnica inversa del CDR** —*«You can find most sequence diagram errors by looking at the class diagram»*— funcionando en contra de quien escribe. Corregido.

3. **La comprobación de operaciones del validador es por bolsa de palabras, y eso la deja pasar cosas.** Su propio código lo declara. Con esa regla, `mostrarSelectorDePersonaje()` valida contra `mostrarRespuestaDelPersonaje()` porque comparten «mostrar» y «personaje», aunque el mensaje fuera a otra línea de vida. Por eso se escribió `scripts/verificar_procedencia_mc01.py`, que empareja **exacto**: su primera ejecución encontró **19 discrepancias que el validador no vio**.

> El «0 errores» del validador no probaba nada sobre este punto. Es el mismo aprendizaje que `PDR-01 §3` registró sobre las etiquetas de relación de `MD-01`.

### 5.4 La regla #2 encontró lo que ningún validador vio (SD-39)

Al ejecutar por fin la **regla #2 del CDR** —*«generate the code headers for your classes, and inspect them closely»*— apareció un defecto que los ocho validadores del pipeline habían dejado pasar: **20 de las 43 clases se emitían con un nombre que no es un identificador válido.**

```
public class Presentacion / landing (P-01) {   // <<solucion>>
public class Kill switch - control de disponibilidad (P-16) {
```

**La causa no está en el modelo, y se comprobó una a una.** En PlantUML, `class "Etiqueta" as Alias` declara **dos** nombres: la etiqueta lleva el significado y se dibuja; el alias es el identificador. `MC-01` usa esa forma **a propósito** en las clases de pantalla y de control. `generate_code_headers.py` toma siempre la etiqueta — acierta en las 23 clases cuyo nombre ya es identificador y falla en las 20 que tienen alias. **Las 20 tienen alias válido.**

**Por qué importa más de lo que parece.** Este archivo es el insumo de la fase de construcción: esos nombres serían los de las clases del código. Y es el argumento retroactivo de por qué `H-20` no era cosmético — si el alias acaba siendo el identificador, tenerlo divergente entre diagramas no era un detalle de estilo.

**Cómo se resolvió, y por qué no parcheando la skill.** Un parche local a una herramienta compartida es invisible para el equipo y se pierde en la siguiente actualización del plugin. El proyecto ya resolvió este mismo dilema con `verificar_procedencia_mc01.py` (§5.3): herramienta **propia, versionada y auditable**, y el defecto se reporta igualmente al mantenedor. Se escribió **`scripts/generar_cabeceras_mc01.py`**, que ejecuta el generador de la skill **sin modificarlo** y sustituye la etiqueta por el alias **solo** en la línea de declaración y **solo** cuando la etiqueta no es un identificador. **La etiqueta no se pierde**: queda como comentario en la misma línea, porque quien inspeccione tiene que poder volver del identificador a la pantalla que nombra.

**Aborta en vez de tapar.** Si una etiqueta inválida no tiene alias, si el alias tampoco es válido, o si la etiqueta aparece fuera de su declaración —lo que dejaría una referencia rota—, el script **falla con código 3** y dice que se corrija el **modelo**, no él. **Las tres guardas están probadas** con cuatro modelos sintéticos: `3 / 3 / 3` en los casos malos y `0` en el bueno. Un instrumento cuyos caminos de fallo nunca se ejecutan no está verificado.

**Resultado tras corregir:** 43 clases con **0 nombres inválidos**, y **exactamente 20 líneas** distintas del original — todas declaraciones de clase. Operaciones (**201**), atributos (**76** campos) y enumerados (**11**) idénticos: la corrección no tocó nada más.

**Se versiona, y con red.** `MC-01_cabeceras.txt` entra al repositorio por decisión del líder: da evidencia revisable de que la regla #2 se ejecutó, sin obligar a nadie a correr nada. El riesgo de un artefacto derivado versionado es conocido —se desincroniza en silencio del modelo— y por eso **no se acepta a pelo**: `verificar_coherencia.py` gana un **bloque 5, «ARTEFACTOS DERIVADOS»**, que falla si un `.svg` o estas cabeceras quedan más antiguos que su `.puml`.

Dos decisiones de ese bloque que conviene no perder, porque parecen detalles y no lo son:

- **Mira la fecha, no el contenido.** Un cambio en el `.puml` puede no alterar el `.svg` ni un byte —renombrar un alias no cambia lo que se dibuja, porque el dibujo lleva la **etiqueta**—, y comparar contenidos daría un falso aviso justo ahí. Pasó en el `H-20` de este mismo retrabajo, con tres diagramas de robustez.
- **Solo mira lo que tiene cambios sin comitear**, igual que el bloque 3 y por la misma razón declarada: git no conserva las fechas de modificación, así que tras un clon reciente una comprobación de frescura sobre el árbol entero sería ruido puro.

**El bloque se probó haciéndolo fallar**, no solo pasar: se retrasaron a mano los dos derivados de `MC-01`, el verificador los señaló y devolvió código 1; se regeneraron y volvió a verde. Una comprobación que nunca se ha visto disparar no está verificada — que es la lección que este mismo retrabajo repitió tres veces.

## 6. Hallazgos sobre los artefactos de entrada

Se redactaron primero y se aplicaron **después de la confirmación del líder del proyecto**, como pide la skill. **Son 18, y los 18 llevan estado** — contados sobre este archivo: 17 con fila propia en las cuatro tablas de abajo, más `H-P`, que apareció al medir y se describe en prosa.

| Estado | Hallazgos | Nº |
|---|---|---:|
| ✅ **Aplicado** | `H-A`, `H-B`, `H-D`, `H-F`, `H-F2`, `H-G`, `H-H`, `H-J`, `H-P` | 9 |
| ⛔ **Evaluado y NO aplicado, con la medición que lo justifica** | `H-C` — ver abajo | 1 |
| 📌 **Declarado como excepción; no tiene arreglo limpio** | `H-N` | 1 |
| 📋 **Reportado como observación; corregirlo exigiría inventar clases** | `H-K`, `H-L` | 2 |
| 📤 **Reportado y ABIERTO**, enrutado a `/use-case-specifier`; ninguno se rellenó aquí | `H-E`, `H-I`, `H-O` | 3 |
| ↗️ **Fuera de este repositorio** | `H-M`, `H-M2` — van al mantenedor de la skill | 2 |
| | **Total** | **18** |

**La fila de los abiertos es nueva, y la ausencia era el defecto.** `H-E`, `H-I` y `H-O` tenían fila en la tabla de especificación pero **ningún estado declarado** en este resumen: quien leyera solo esta tabla contaba 15 de 18 y no sabía que tres seguían abiertos. Los tres son los mismos que `MC-01_matriz_procedencia.md §9` lista como elementos sin procedencia, así que el hueco era de este resumen, no del paquete. Detectado durante el retrabajo del `CDR-01`, al corregir `H-10`.

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
| 13 | Exceso de detalle | ⚠️ **Asumido y declarado.** Fowler avisa: *«comprehensiveness is the enemy of comprehensibility»*. **43** clases y **201** operaciones son mucho para un vistazo. Se asume porque el CDR exige completitud; se mitiga con **11 paquetes**. **Y desde SD-39 está medido, no supuesto:** el `.svg` sale en `9347 × 2208 px`, proporción **4,2:1**, y el ancho es intrínseco —18 clases de pantalla en fila—, no de maquetación. Si el CDR pide legibilidad, la salida es una **vista reducida**, no borrar operaciones ni mover cajas |
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
2. **El `.svg` ya está generado y mirado** (§4.2, `E-2` cerrado en SD-39). La inspección visual dejó **tres hallazgos nuevos** que el CDR debe considerar en la reinspección: el diagrama **sin título**, la proporción de 5:1, y —la de fondo— que los **seis tipos de transferencia no tienen ninguna relación** pese a que el propio modelo dice que las de solución van «solo donde una operación navega».
3. **Las dos excepciones de `RF-24` se cerraron después de emitir este modelo** — `PER-H5` en `ADR-003` (SD-33) y `PER-H2` en `ADR-004` (SD-35), así que **el requisito pasa a cumplirse** según el diseño.
 `Usuario.suprimirEnCascada()` alcanza ahora **todo lo que existe y lo hace de inmediato**: el almacén operativo no se respalda (`ADR-003`) y la supresión es física, sin ventana de gracia ni marca de baja (`ADR-004-D1`). **Con la precisión que el CDR debe conservar:** se cumple **según el diseño**; la inmediatez solo se verifica contra una implementación, y eso es fase 4. El `.puml` lo lleva escrito dentro.

## 11. Ciclo de auditoría interna — resultado

**Condición de cierre:** cero críticos, cero mayores, ≤2 menores documentados, cada elemento con procedencia, cada capa declarada, y **dos pasadas consecutivas sin hallazgos nuevos**.

| Pasada | Qué encontró |
|---|---|
| 1 | **Crítico:** el validador imprimía veredicto favorable con **0 operaciones parseadas** (`H-M`). **Mayor:** `marcarLosCuatroAutorreportesParaDescarte()` en la clase equivocada. **Mayor:** las dos clases de control no ligaban con su línea de vida por diferencia de etiqueta. **Menor:** `-/estado` no parseable (`H-M2`) |
| 2 | **Mayor:** la comprobación del validador es por **bolsa de palabras** y deja pasar operaciones colocadas en clase ajena → se escribe el verificador exacto, que destapa **19 discrepancias**. **Menor:** tres de las seis entidades sin atributos no tenían su causa escrita dentro del `.puml` |
| 3 | **Auditoría de la salida de los subagentes**, exigida por `CLAUDE.md §1`. **Mayor:** dos citas con número de línea eran incorrectas (`PER-01:120` por `:310`) o irrastreables por `grep`. **Mayor, a favor:** `MD-01 §6` **ya declara** el reparto de atributos en la jerarquía, así que lo que se había marcado `[I2]` es `[E1]`. **Menor:** el desglose de las 73 relaciones no cuadraba; el conteo de atributos confundía miembros de clase con literales de enumerado |
| 4 | **Comprobación cruzada de cifras entre los cuatro archivos.** **Mayor:** la explicación de «200 frente a 192» afirmaba diez nombres repetidos y uno de ellos no lo era; los reales son **seis**. Al medirlo apareció algo mejor: los **192 nombres distintos coinciden exactamente** con los 192 de `DOP-01` |
| 5 | **Sin hallazgos nuevos.** Los dos validadores en 0 errores y 0 discrepancias; las cifras de los cuatro archivos cuadran contra el `.puml` por script |

**Estado final: `AUDITORÍA SUPERADA`** — 0 críticos, 0 mayores abiertos, **2 menores documentados** (anti-patrones 12 y 13, ambos con decisión declarada en §8), procedencia completa y —a la fecha de emisión— **dos capas declaradas NO ejecutadas** (§4.1 y §4.2). **Desde SD-39 queda una sola:** `E-2` (el render) está **cerrado**; `E-1` (la infraestructura) sigue abierta por decisión y la cierra `ARQ-01`.

**Una salvedad sobre la condición de cierre, dicha y no maquillada.** La regla pide **dos pasadas consecutivas sin hallazgos nuevos** y el tope duro es cinco. Aquí solo hay **una** pasada limpia, la quinta, porque las cuatro anteriores encontraron algo cada una. No se declara un sexto ciclo que no se ejecutó: se declara que la condición se cumplió **parcialmente** —cero críticos y cero mayores abiertos, que es la parte sustantiva— y que la confirmación de estabilidad queda para el CDR, que es precisamente la revisión independiente que sigue. Sostener lo contrario sería el certificado optimista que la propia regla prohíbe.

**La degradación llega al veredicto, no solo al informe:** este modelo está **listo para el CDR con una capa no ejecutada declarada —`E-1`, la infraestructura— y una condición de cierre cumplida a medias**. No está listo para `ARQ-01` ni para código, y no lo pretende. *(Hasta SD-39 eran **dos** capas: `E-2`, el render del `.svg`, se cerró en el retrabajo del `CDR-01` — §4.2.)*

## 12. Qué queda abierto

| Asunto | Estado |
|---|---|
| ~~Render del `.svg` y su revisión visual~~ | ✅ **Cerrado en SD-39** — `MC-01_modelo_clases_diseno.svg`, PlantUML 1.2026.6, generado **y mirado** (§4.2). Deja tres hallazgos nuevos: sin título · 5:1 · los seis tipos de transferencia sin relación |
| Los **18** hallazgos de §6 | **9 aplicados** con confirmación del líder (`H-A`, `H-B`, `H-D`, `H-F`, `H-F2`, `H-G`, `H-H`, `H-J`, `H-P`); `H-C` medido y revertido; `H-N` excepción declarada; `H-K` y `H-L` observaciones; `H-M`/`H-M2` fuera de este repositorio. **Abiertos: 3** — `H-E`, `H-I`, `H-O`, enrutados a `/use-case-specifier` |
| ~~`PER-H5`~~ | ✅ **Cerrado en `ADR-003`** (SD-33), y **antes de `ARQ-01`**: resultó ser un no-objetivo declarado, no diseño físico. Se cerró **quitando** el respaldo del almacén operativo, no acotándolo |
| ~~`PER-H2`~~ | ✅ **Cerrado en `ADR-004-D1`** (SD-35): la supresión es física e inmediata. Con sus dos excepciones cerradas, **`RF-24` pasa a cumplirse** según el diseño |
| `PER-H4` | Abierto. Deja `ContadorDeUsoDiario` sin atributos |
| ~~Propagación de gobernanza~~ | ✅ **Cerrada en SD-39.** `REGISTRO_DECISIONES` (`SD-39`), `HECHOS_CANONICOS v1.6` —seis hechos movidos y **`H-29`** creado—, `INDICE_MAESTRO`, `ESTADO_PIPELINE`, `CAPSULA_CONTEXTO` y `CHANGELOG v0.22.0`. Las cifras de `MC-01` **ya no se copian: las cuenta `verificar_coherencia.py`** sobre el modelo |
| **Verificación independiente del retrabajo** | ⏳ **Abierta, y es la que queda.** Lo de `SD-39` está **aplicado**, no verificado: quien aplicó no puede firmarlo. Se hace en sesión aparte, con encuadre adversarial, y de ahí sale la siguiente versión del acta |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v2.1 | 2026-08-05 | J. Sánchez | **SD-45 — `SD-45-H1`: el mismo defecto de `TVI-03`, en dos diagramas que la cuarta verificación dio por correctos.** `informarPeticionInvalidaYVolverAlPaso1()` la usaban `DS-04` y `DS-11`, y `ECU-04 FE-03` y `ECU-11 FE-03` dicen **paso 2**. Renombrada a `…YVolverAlPaso2()`. **43 clases, 201 operaciones, 51 atributos, 80 relaciones y 193 nombres distintos se quedan donde estaban**; lo confirma `verificar_procedencia_mc01.py`. |
| v2.0 | 2026-08-05 | J. Sánchez | **SD-44 — `TVI-03` del `CDR-01 v1.6`: una operación que contradecía su flujo.** `rechazarConfirmacionInvalidaYVolverAlPaso1()` vivía en un `loop` que reentra en el **paso 2**, y `ECU-10 FE-03` dice paso 2. Renombrada a `…YVolverAlPaso2()` aquí y en `DS-10`. **Es un renombre: 43 clases, 201 operaciones, 51 atributos, 80 relaciones y 193 nombres distintos se quedan donde estaban**, y lo confirma `verificar_procedencia_mc01.py` sin discrepancias. |
| v1.9 | 2026-08-05 | J. Sánchez | **SD-39 — se cierra la propagación dentro del propio archivo.** §3 se actualizó en v1.8 pero **§4, el certificado de auditoría, no**: seguía diciendo «21 de solución» y «los 69 atributos». Es el mismo defecto que `H-10` corrigió entre §6 y §12 — dos secciones del mismo documento contando cosas distintas—, y aparecio al preparar el encargo de la verificación independiente. Se corrige antes de entregarlo, en vez de dejar un defecto conocido para que lo encuentre el revisor. |
| v1.8 | 2026-08-05 | J. Sánchez | **SD-39 — propagación de las cifras que el retrabajo movió.** §3 pasa a **43 clases** (16 + **27** de solución) + 11 enumerados = **54 declaraciones**, **51 atributos** propios (+34 literales = 85), **201 operaciones**, **80 relaciones** reales (4+1+12+**63**, sin los 2 conectores de nota) y gana la fila de **11 paquetes**. La explicación de «200 frente a 192» pasa a **201 frente a 193**; el anti-patrón 13 se actualiza y, además, **deja de suponer**: la proporción del `.svg` está **medida** en `9347 × 2208 px`, 4,2:1, y el ancho es intrínseco —18 pantallas en fila—, no de maquetación. **Las seis cifras se remidieron una a una contra el `.puml` antes de escribirse**, y desde ahora cuatro de ellas las cuenta `verificar_coherencia.py` sobre el modelo en cada ejecución: hasta `SD-39` ninguna se contrastaba, se copiaba de artefacto en artefacto, que es por lo que las relaciones se movieron tres veces. |
| v1.7 | 2026-08-05 | J. Sánchez | **SD-39 — las cabeceras se versionan, con red.** `MC-01_cabeceras.txt` entra al repositorio por decisión del líder: da evidencia revisable de la regla #2 sin obligar a ejecutar nada. Como todo derivado versionado se desincroniza en silencio, **no se acepta a pelo**: `verificar_coherencia.py` gana el **bloque 5, «ARTEFACTOS DERIVADOS»**, que falla si un `.svg` o estas cabeceras quedan más antiguos que su `.puml`. Compara **fechas y no contenidos** —renombrar un alias no cambia el dibujo ni un byte, y comparar contenidos daría un falso aviso justo ahí, como pasó con tres `DR` en `H-20`— y **solo mira lo que tiene cambios sin comitear**, igual que el bloque 3, porque git no conserva fechas y tras un clon reciente la frescura del árbol entero sería ruido. **Probado haciéndolo fallar:** se retrasaron los dos derivados de `MC-01`, el verificador los señaló y devolvió código 1; regenerados, volvió a verde. §2 y §5.4 actualizadas. |
| v1.6 | 2026-08-05 | J. Sánchez | **SD-39 — se ejecuta la regla #2 del CDR** (cabeceras de código), que `H-04` había desbloqueado, y aparece un defecto que los **ocho validadores del pipeline dejaron pasar**: **20 de las 43 clases se emitían con nombre que no es un identificador válido**, porque el generador de la skill toma la **etiqueta** y no el **alias**. Las 20 tienen alias válido: **el defecto es del generador, no del modelo**. Se resuelve con herramienta **propia y versionada** —`scripts/generar_cabeceras_mc01.py`, mismo criterio que `verificar_procedencia_mc01.py` en §5.3— en vez de parchear la skill, porque un parche local es invisible para el equipo y se pierde al actualizar el plugin; el defecto se reporta igualmente al mantenedor. El script **aborta con código 3** si una etiqueta inválida no tiene alias, si el alias tampoco vale o si la etiqueta aparece fuera de su declaración, y **sus tres guardas están probadas** con cuatro modelos sintéticos. Resultado: **0 nombres inválidos** y **exactamente 20 líneas** distintas del original, todas declaraciones; 201 operaciones, 76 campos y 11 enumerados **idénticos**. Nueva §5.4. **Ninguna cifra del modelo se mueve.** |
| v1.5 | 2026-08-05 | J. Sánchez | **SD-39 — se cierran los dos hallazgos que dejó la inspección visual de v1.4, con aprobación expresa.** **(a) Título:** `MC-01`, `MD-01` y `DCU-01` ganan `title`; los tres se renderizaban con PlantUML y ninguno se identificaba, que es el defecto de `PDR-01 §7`. Se corrigen **los tres**, no solo este: arreglar uno habría cambiado un defecto compartido por una inconsistencia. Antes de tocarlos se comprobó que este PlantUML **reproduce sus `.svg` byte a byte**, para que el único cambio del diff fuera el título. Toca `MD-01`, de `/uml-domain-modeler`, y se declara. **(b) Dependencias:** se dibujan las **9** flechas hacia los tipos de transferencia, porque `MC-01_matriz_procedencia §1` fija que las relaciones de solución van «solo donde una operación navega» y una operación que los **devuelve** navega hacia ellos — el modelo incumplía su propia regla. **Relaciones 71 → 80**, cifra que `SD-39` registra y propaga. Efecto colateral medido: el diagrama pasa de `10918` a **`9347` px** de ancho (−14 %). **Verificado tras aplicar:** clases **0 errores / 9 advertencias**, procedencia **sin discrepancias**, 14 `DR` y 14 `DS` en su línea base, 31 pares `.puml`/`.svg` frescos, `verificar_coherencia.py` en 0. |
| v1.4 | 2026-08-04 | J. Sánchez | **SD-39 — `E-2` cerrado: el `.svg` está generado y mirado.** Se instaló `plantuml.jar` **1.2026.6** —la misma versión que produjo `MD-01_modelo_dominio.svg`— **en el directorio temporal de trabajo, nunca en el repositorio**; a git solo entra el `.svg`. Resultado: **264 KB**, `10918 × 2131 px`, sin errores de sintaxis y con las **54 declaraciones dibujadas**. La inspección visual se hizo en dos pasadas porque **la primera salió cortada**: PlantUML topa en 4096 px por defecto y el diagrama mide 10918, así que la mitad derecha no se había visto — el mismo modo de fallo que `PDR-01 §7` documenta. §4, §4.2, §10, §11 y §12 se actualizan; **el texto original de `E-2` se conserva** bajo su propio encabezado, porque describe correctamente lo que se declaró entonces. **Tres hallazgos nuevos, ninguno corregido aquí:** el diagrama **sin título** (`MD-01` y `DCU-01` tampoco lo llevan, así que arreglarlo solo aquí crearía una inconsistencia y tocaría artefacto ajeno); la proporción **5:1**; y la causa de fondo — los **seis tipos de transferencia de `H-04` no tienen ni una relación**, pese a que `MC-01_matriz_procedencia §1` fija que las de solución van «solo donde una operación navega» y una operación que los **devuelve** navega hacia ellos. Serían **9 flechas** (seis tipos, nueve clases que los devuelven — `Persona` la devuelven tres), o sea relaciones **71 → 80**: es decisión y va a la reinspección. Ensayado en copia: el validador aguanta en **0 errores / 9 advertencias** y el ancho baja un 14 %. **Ninguna cifra se mueve en esta versión.** |
| v1.3 | 2026-08-04 | J. Sánchez | **SD-39 — retrabajo del `CDR-01`.** `H-10`: §12 decía «los **14** hallazgos de §6, **ninguno aplicado**» y §6 marcaba **9** como aplicados; el conteo real, verificado sobre este archivo, es **18**, y ahora los 18 llevan estado. Al reconciliarlo apareció un defecto que el acta no registraba: `H-E`, `H-I` y `H-O` tenían fila propia pero **ningún estado** en la tabla resumen de §6 —se contaban 15 de 18— y son precisamente los tres que siguen **abiertos**; se les añade fila y se declaran como tales. `H-12`: se elimina el párrafo duplicado del cierre de §11, que repetía el veredicto **omitiendo** «una condición de cierre cumplida a medias» y por tanto deshacía la salvedad que el propio §11 acababa de declarar. **Ninguna cifra del modelo se mueve en esta versión**: las que `H-04` desplazó (clases, operaciones, atributos, relaciones) se propagan con `SD-39` en el cierre del retrabajo, no aquí. |
| v1.2 | 2026-08-04 | J. Sánchez | **SD-35.** `ADR-004-D1` cierra `PER-H2` **después** de emitirse este modelo: la supresión de cuenta es **física e inmediata**, sin ventana de gracia ni marca de baja — resultó ser una ambigüedad sintáctica del plan §4.14, no un hueco de diseño. §10 y §12 se actualizan: con sus **dos** excepciones cerradas, **`RF-24` pasa a cumplirse** según el diseño, con la precisión de que la inmediatez solo se verifica contra una implementación (fase 4). La nota del `.puml` se reescribe en el mismo sentido. **Ninguna cifra del modelo cambia.** *(Fila añadida en v1.3: la versión constaba en la ficha desde SD-35 pero nunca se escribió aquí — hueco de propagación, cerrado.)* |
| v1.1 | 2026-08-04 | J. Sánchez | **SD-33.** `ADR-003` cierra `PER-H5` **después** de emitirse este modelo. §10 y §12 se actualizan: lo que el CDR debe saber ya no es «`PER-H5` rompe `RF-24` de extremo a extremo» sino que **`PER-H2`** lo impide de forma *inmediata*. La nota del `.puml` se reescribe en el mismo sentido. **Ninguna cifra del modelo cambia**: 37 clases, 200 operaciones, 35 atributos, 73 relaciones. |
| v1.0 | 2026-08-04 | J. Sánchez | Creación. 37 clases (16 del problema + 21 de solución), 200 operaciones, 69 atributos, 11 enumerados; los dos validadores en 0 errores y 0 discrepancias. Dos capas declaradas **no ejecutadas**: infraestructura (por decisión) y render del SVG (por falta de herramienta). 14 hallazgos sobre los insumos, enrutados y no aplicados. |
