# DS-00 — Índice y certificado de los diagramas de secuencia

**ID:** DS-00 · **Familia:** DS (secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/` · **Fecha:** 2026-08-01 · **Versión:** v2.1 (SD-45: la cuarta verificación refutó `R3` —afirmada, no implementada— y los cuatro bucles de confirmación se acotan al paso que manda su `ECU`, con la cancelación fuera; el comprobador se reescribe con 17 fixtures versionados). v2.0 (SD-44, la **convención de desenlaces**: la tercera verificación independiente refutó **8 de 13** ramas de `SD-43` y activó el freno de Wiegers; se fija R1–R4, se instala `barrido_desenlaces.py` y se cierran `TVI-01`, `TVI-02` y `TVI-04`). v1.9 (SD-43, `SVI-01`: la corrección de v1.8 era **falsa** y la refutó la segunda verificación independiente — las diecisiete `ECU` dicen «Vuelve», ninguna «Termina»; las 13 ramas pasan a `loop` + `alt`, y entra `SD-43-H1` sobre los `break` dentro del `loop` de `DS-06`). v1.8 (SD-41: **`VI-01` corregido** — los 17 `opt` se adjudican en dos grupos según si viven dentro de un `loop`; entra §12 con el criterio y `E-5` con su precio. ~~Trece `break` originales resultan correctos: esa parte de `H-01` era falso positivo~~ — **refutado en `SD-43`**). v1.7 (SD-40: la **tabla** de §2 seguía en 282 y su fila de `DS-10` en 20 mensajes, dos líneas por encima de la nota que ya declaraba `H-22` = 283). v1.6 (SD-39: `H-22` 282 → **283** y `H-23` 192 → **193**, por el retrabajo del `CDR-01`). v1.5 (SD-36: `E-3` decía diez mensajes a un actor y son **once**). v1.4 (SD-32: etiquetas de P-08/P-10 corregidas en su raíz de robustez, participantes de DS-09, y E-3/E-4 declaradas). v1.3 (SD-31: §11 pasa de orientación a hecho — los 14 SVG de robustez regenerados en cero colisiones — y §10 corrige el alcance que declaraba al revés). v1.2: SD-30 cerrado, los **siete** hallazgos aplicados; robustez en **262 elementos** y 150 controladores; **181** casos de prueba · **Estado:** Propuesto.
**Propósito:** índice de los **14 diagramas de secuencia** (`DS-01…DS-14`) derivados de `DR-01…DR-14`, con su certificado de auditoría, las capas declaradas, las excepciones y la trazabilidad hacia adelante.
**Insumos:** `DR-01…DR-14 v2.1` (**262 elementos**, **150 controladores**), `ECU-01…ECU-14 v2.1`, `MD-01 v1.4`, `DCU-01 v2.1`, `RPD-01` (*Aceptado con verificación de retrabajo*), `DIS-00`, `SEG-01 v1.2`, `PER-01 v1.2`, `PRIV-01`, `MV-01 §7`, `HECHOS_CANONICOS`.
**Generado con:** skill `uml-sequence-diagram`, modo **Generar**. **Validador:** `validate_sequence_puml.py` con las cuatro banderas → **0 errores en los 14**.
**Consumidores:** `uml-design-class-model` (diagrama de clases de diseño), el **CDR**, la fase de construcción.
**Fundamentos:** Rosenberg & Stephens, *Use Case Driven Object Modeling with UML*, cap. 8; Fowler, *UML Distilled* 3ª ed., cap. 4; Rosenberg, Collins-Cope & Stephens, *Agile Development with ICONIX Process*; ISO/IEC 12207:2017 §6.4.5. Se **citan**, no se reproducen.

---

## 1. Qué es este artefacto y qué no

El diagrama de secuencia es **el vehículo del diseño detallado**, y tiene un propósito único:
**asignar comportamiento a las clases.** Cada mensaje dibujado es una operación colocándose en la
clase que lo recibe. La pregunta que se responde al dibujar no es «¿qué pasa después?» sino
**«¿qué clase debería ser responsable de esto?»**.

**No es un diagrama de flujo.** La fuente le dedica un recuadro entero, y este paquete lo aprendió
por las malas: el primer borrador de `DS-06` modelaba las nueve excepciones como `alt` en cascada y
llegó a **anidamiento de nivel 7**. Ver §5.

## 2. Los 14 diagramas

| DS | Caso de uso | Particip. | Mensajes | Controladores | Validador |
|---|---|---:|---:|---:|---|
| [DS-01](puml/DS-01_secuencia_consultar_presentacion.puml) | CU-01 Consultar presentación del servicio | 5 | 12 | 7/7 | ✅ 0 · 0 |
| [DS-02](puml/DS-02_secuencia_registrar_cuenta.puml) | CU-02 Registrar cuenta | 6 | 16 | 7/7 | ✅ 0 · 1 |
| [DS-03](puml/DS-03_secuencia_iniciar_y_cerrar_sesion.puml) | CU-03 Iniciar y cerrar sesión | 11 | 21 | 12/12 | ✅ 0 · 0 |
| [DS-04](puml/DS-04_secuencia_eliminar_cuenta.puml) | CU-04 Eliminar cuenta | 11 | 23 | 12/12 | ✅ 0 · 0 |
| [DS-05](puml/DS-05_secuencia_consentimiento_caracterizacion.puml) | CU-05 Otorgar consentimiento y crear la cápsula | 9 | 24 | 16/16 | ✅ 0 · 0 |
| [**DS-06**](puml/DS-06_secuencia_conversar_con_el_acompanante.puml) | CU-06 **Conversar con el acompañante** | 16 | 49 | **25/25** | ✅ 0 · 0 |
| [**DS-07**](puml/DS-07_secuencia_derivar_ante_peligro.puml) | CU-07 **Derivar ante peligro** | 9 | 26 | 12/12 | ✅ 0 · 0 |
| [DS-08](puml/DS-08_secuencia_consultar_directorio.puml) | CU-08 Consultar directorio de usuarios | 4 | 13 | 8/8 | ✅ 0 · 0 |
| [DS-09](puml/DS-09_secuencia_consultar_metricas.puml) | CU-09 Consultar métricas de uso | 5 | 13 | 8/8 | ✅ 0 · 1 |
| [DS-10](puml/DS-10_secuencia_habilitar_deshabilitar_chatbot.puml) | CU-10 Habilitar o deshabilitar el chatbot | 8 | 21 | 11/11 | ✅ 0 · 0 |
| [DS-11](puml/DS-11_secuencia_reiniciar_la_caracterizacion.puml) | CU-11 Reiniciar la caracterización | 7 | 19 | 11/11 | ✅ 0 · 1 |
| [DS-12](puml/DS-12_secuencia_revocar_la_personalizacion.puml) | CU-12 Revocar la personalización | 7 | 17 | 9/9 | ✅ 0 · 1 |
| [DS-13](puml/DS-13_secuencia_cambiar_de_acompanante.puml) | CU-13 Cambiar de acompañante | 9 | 16 | 6/6 | ✅ 0 · 1 |
| [DS-14](puml/DS-14_secuencia_elegir_acompanante.puml) | CU-14 Elegir acompañante (Alan o Aura) | 7 | 13 | 6/6 | ✅ 0 · 1 |
| | **Total** | | **283** | **150/150** | **0 errores · 10 advertencias** |

> **Los conteos del paquete son ahora hechos canónicos:** `H-22` (283 mensajes), `H-23` (193
> operaciones) y `H-24` (181 casos de prueba) viven en `HECHOS_CANONICOS`, no aquí. Si discrepan,
> manda esa tabla.

**Un diagrama por caso de uso, con el curso básico y *todos* los alternos en el mismo diagrama.**
Flujos sin fragmento: **0** en los 14.

## 3. Estructura del paquete

```
docs/07_casos_uso/secuencia/
├── DS-00_indice_y_certificado_secuencia.md   este archivo
├── DOP-01_delta_operaciones.md               150 controladores -> 193 operaciones
├── CERT-DS-piloto.md                         certificado del piloto (DS-06, DS-07)
├── puml/    los 14 .puml    (FUENTE DE VERDAD)
├── svg/     los 14 .svg     (vista derivada)
├── pruebas/ CP-00 (índice) + CP-01…CP-14  ->  178 casos de prueba
└── scripts/generar_svg_secuencia.py
```

Los `.puml` son la **fuente de verdad**; los `.svg` se regeneran cuando cambian:

```bash
python scripts/generar_svg_secuencia.py              # regenera los 14
python scripts/generar_svg_secuencia.py --verificar  # solo comprueba
```

## 4. Certificado de auditoría — capas ejecutadas y no ejecutadas

Ninguna capa queda en silencio. Esa es la exigencia del método y el motivo de esta tabla.

| # | Capa | Resultado |
|---|---|---|
| 1 | Notación y estructura | ✅ Las tres directivas obligatorias; alias con prefijo; sin `activate`/`deactivate`; fragmentos etiquetados con su `FA`/`FE`; **anidamiento ≤ 2** en los 14 |
| 2 | Cierre de participantes contra `DR-XX` | ✅ Todo participante viene del diagrama de robustez. **Ningún renombrado silencioso** |
| 3 | Cierre de entidades contra el dominio | ✅ Las **16 clases** de `MD-01 v1.4` reciben operaciones; ninguna huérfana. **21 clases nuevas** del espacio de la solución — 2 de control, 1 de auditoría y 18 de frontera —, inventariadas en `MC-01_matriz_procedencia.md §4`. *(v1.4, `H-B`: hasta v1.3 esta celda decía «3», que era el recuento de clases **controladoras** presentado como el del espacio entero.)* |
| 4 | Cobertura de controladores (guía #7) | ✅ **150/150** |
| 5 | Cobertura de flujos alternativos | ✅ **0 flujos sin fragmento** en los 14 |
| 6 | Barrido texto ↔ mensajes (guía #6) | ✅ Ejecutado **a mano**, línea a línea, contra las 14 `ECU` y contra los **18 pasos del plan §4.11** que `ECU-06` delega expresamente a `DS-06` |
| 7 | Asignación de comportamiento (paso 4) | ✅ `DOP-01` registra las **193 operaciones** con su clase y su justificación |
| 8 | Legibilidad del `.svg` | ✅ Generador propio con verificación geométrica `R9`; **0 colisiones** en los 14; títulos no vacíos |
| 9 | Cifras contra `HECHOS_CANONICOS` | ✅ `H-01` a `H-06` correctas; **cero apariciones del valor obsoleto 1.500** |
| 10 | Derivación de casos de prueba | ✅ **178 `CP`** desde los 150 controladores, en los 14 casos de uso. Cobertura desagregada por operador: `opt`/`break` con rama tomada y no tomada, `loop` con sus fronteras. Índice en [`pruebas/CP-00`](pruebas/CP-00_indice_casos_prueba.md) |
| — | **Arquitectura / infraestructura** | ⛔ **NO EJECUTADA, por decisión declarada.** Ver §6 |

## 5. Lo que las pasadas encontraron y la lectura a ojo no

Seis defectos los cazó el validador o el generador, no la revisión:

1. **`DS-06` llegó a anidamiento de nivel 7.** Las nueve excepciones estaban modeladas como `alt` en
   cascada: eso es **estructura de control, no colaboración**. Se rehizo con `break`, que es lo que
   semánticamente son —guardas que terminan el turno—, y bajó a 2. **De 7 advertencias a 0.**
2. **`DS-06` tenía 3 auto-llamadas consecutivas** sobre la frontera del proveedor. Las guardas de
   salida se movieron a `C_GateDeSeguridad`, donde `SEG-R4` las sitúa; de paso quedó **una sola
   sede** para la política de seguridad.
3. **`DS-07` tenía el control centralizado al 69 %.** Se corrigió cambiando el diseño, no el umbral:
   la pantalla de contención pasó a **buscar lo que presenta**.
4. **`DS-13`/`DS-14` al 86 % y 89 %.** El cambio de personaje se movió a `Conversacion`, que es
   quien **posee esa asociación** en `MD-01`.
5. **`DS-02` al 82 %.** Se descubrió que el diagrama ignoraba la transición `Visitante →
   TitularDeCuenta` que `MD-01` **sí modela**. Darle su mensaje mejoró el diseño *y* la métrica.
6. **`DS-11` con 3 auto-llamadas seguidas.** La advertencia «perderás el acceso al chat» es
   **conocimiento de la cápsula** —ella sabe que contiene `character`—, no del formulario.

> **Patrón propio detectado y anotado.** En **cuatro** ocasiones (`FE-01` de `DS-07`, `FA-02` de
> `DS-05`, `FA-01` de `DS-04`, y antes en `DS-06`) un flujo se dejó **solo en la nota**, sin
> fragmento real. El validador lo cazó las cuatro veces. Queda registrado como el error recurrente
> de esta pasada: **una nota no cubre un flujo; solo un fragmento lo cubre.**

## 6. Excepciones declaradas

> **Numeración local.** `DR-00 §5` ya usa `E-1`, `E-2` y `E-3` con significados propios. Las
> excepciones de la familia `DS` se numeran **en su propio espacio** y se citan siempre
> cualificadas. Estas son `E-1` y `E-2` **de `DS-00`**, no las de `DR-00`.

**`E-1` de `DS-00` · La capa de infraestructura no se ejecuta.**
`ESTADO_PIPELINE` v1.4 lo instruye textualmente y `ADR-002 §1` fija la frontera: el diseño físico
—claves de DynamoDB, tabla de *endpoints*, inventario de S3— va a `ARQ-01`, **después del diagrama
de clases y de su CDR**. No hay ningún participante `INF_` en los 14 (comprobado).

**El coste, declarado y no disimulado.** La fuente **no** avala omitir la infraestructura sin más:
el ejercicio 8-3 (*Plumbing*) advierte que produce *«leaps of logic»*. Lo que sí avala es el
**orden** (anti-patrón #6): primero el comportamiento del dominio, después la infraestructura que
ese reparto necesite. Esta pasada ejecuta la **primera mitad**. **Qué la cierra:** `ARQ-01`, tras
el CDR.

**`E-2` de `DS-00` · Control centralizado en seis diagramas de pantalla única.**
`DS-02`, `DS-09`, `DS-11`, `DS-12`, `DS-13` y `DS-14` quedan entre el 62 % y el 78 %, por encima
del umbral del 60 %. **Se intentó repartir de verdad en los seis**, y los movimientos que mejoraban
el diseño se aplicaron (§5, puntos 4-6). Lo que queda es irreducible: son casos de uso de **una
sola pantalla y tres pasos**, donde el borde *es* el coordinador y el resto son consultas. Repartir
más inventaría estructura que el texto no tiene — el mismo razonamiento que `DR-00 §5 E-1` aplicó
a las cadenas de `DR-07`. El validador lo marca como **advertencia y no como error** precisamente
porque pide criterio, no obediencia.

**`E-3` de `DS-00` · Once mensajes van dirigidos a un actor, y así se quedan.**
`DS-08`, `DS-09`, `DS-10` y `DS-11` dibujan diez operaciones como mensaje de la frontera **hacia el
actor** —`B_MetricasDeUso --> ACT_Administrador : denegarPorRolSinMostrarCifras()`— mientras `DS-04`
dibuja conducta equivalente como **auto-llamada** (`advertirQueLaAccionEsIrreversible()`). La
inconsistencia de estilo es real y la reportó `MC-00 §6` como `H-C`.

**Se probó a unificarlo y se midió el resultado: empeoraba.** Convertir los diez en auto-llamadas
subió el validador de **6 a 10 advertencias**, sacó a `DS-09` de la banda que `E-2` declara
(62-78 % → **83 %** de control centralizado, porque una auto-llamada cuenta como mensaje emitido) y
creó dos avisos de **auto-llamadas consecutivas** en `DS-08` y `DS-09`. **Revertido con evidencia,
no por opinión.** Un mensaje de frontera a actor es UML legítimo —es la salida del sistema llegando
a quien la pide— y el modelo de clases resuelve el punto igual de bien asignando la operación a la
frontera **emisora**, que es lo que `MC-01` hace y declara.

**`E-4` de `DS-00` · `actor "Visitante"` y `entity "Visitante"` comparten etiqueta, y no tiene arreglo limpio.**
En `DS-01` y `DS-02` conviven las dos declaraciones con el mismo texto. El actor se llama así porque
`DCU-01` lo llama así; la entidad, porque `MD-01 v1.4` la llama así — y esa clase existe justamente
porque la retroalimentación docente pidió que el actor tuviera objeto de dominio (`RET-01 §3`).
Renombrar cualquiera de las dos rompe una traza. **Consecuencia práctica, declarada:** toda
herramienta que empareje participantes **por etiqueta** —incluido el validador del modelo de
clases— confunde las dos. La desambiguación se hace por el prefijo del alias (`ACT_` frente a `E_`).

**`E-5` de `DS-00` · `DS-06` anida a 3-4 niveles, y es el precio de `VI-01`.** *(Añadida en `SD-41`.)*
Las cuatro advertencias de anidamiento de `DS-06` son **consecuencia directa** de la corrección de
`VI-01`: hacer mutuamente excluyentes el fallo y la continuación exige un `alt` que **contenga** el
resto del turno, y eso empuja un nivel hacia abajo a los tres fragmentos que ya vivían dentro del
`loop`. El validador sugiere partir el caso de uso; **no se hace**, y no por comodidad: la decisión
de no partir `CU-06` ya está tomada y heredada de `DR-00 §5 E-2` (párrafo siguiente). Contorsionar
el diagrama para bajar el anidamiento sería reintroducir el defecto que `VI-01` señaló.

**Excepción heredada de `DR-00 §5 E-2`, re-declarada sin reabrirse:** `CU-06` **no se parte** pese
a que `DS-06` es el mayor del paquete (16 participantes, 49 mensajes). Sus once flujos no básicos
son de un solo nivel; el tamaño viene de la tabla de códigos HTTP (`RF-26`), no de complejidad
oculta. *(`SD-41` mantiene la decisión y añade el dato nuevo: tras corregir `VI-01`, cuatro de esos
flujos **dejan de ser de un solo nivel**. Eso no reabre la excepción, pero sí es el argumento más
fuerte que ha tenido en contra, y queda escrito para que la próxima revisión lo pese con el dato
delante en vez de heredarlo.)*

## 7. Delta de *object discovery* — tres clases nuevas

| Clase | Estereotipo | Por qué es legítima |
|---|---|---|
| `C_GateDeSeguridad` | control | `SEG-R1…R6` la definen como componente propio: binaria, determinista, configurable, evaluada en **cada** mensaje antes de responder |
| `C_FallbackDeSeguridad` | control | `SEG-R2`, `SEG-R3`, `SEG-R5`: ruta determinista y local que debe operar con el proveedor y la red caídos |
| `AccionAdministrativa` | **`participant`, no `entity`** | **Fuera de `MD-01` por decisión declarada** (`DR-00 §6`, `RPD-01` H-02): auditoría de operación, no concepto del problema. Declararla `entity` habría producido un falso hallazgo de trazabilidad |

**Dos clases controladoras sobre 150 controladores = 1,3 %**, muy por debajo del 20 % que la fuente
considera el techo. Ninguna es un `XController` por entidad — el anti-patrón que los *frameworks*
inducen.

> **El espacio de la solución es mayor que esta tabla, y v1.3 lo decía mal** (`H-B` de `MC-00`).
> Esta sección lista el *object discovery* **de clases con nombre propio**. Pero las **18 fronteras**
> —las 16 pantallas de `DIS-00`, el diálogo de confirmación de P-16 y la frontera con el proveedor—
> también son espacio de la solución: son pantallas y adaptadores, ninguna está en `MD-01`, y entre
> las tres de arriba y ellas reciben las 193 operaciones. **El total es 21**, y el inventario con su
> justificación vive en `MC-01_matriz_procedencia.md §4`.

## 8. Hallazgos sobre los artefactos de entrada

**Dos ya se aplicaron** (`H-8` y `H-9`), con tu confirmación y registrados en **SD-30**. Los siete
restantes se **proponen**, no se aplican.

### Aplicados en SD-30

| # | Hallazgo | Resolución |
|---|---|---|
| **H-8** | **`FE-02` de `CU-01` tenía dos desenlaces incompatibles.** `ECU-01` lo decía **tres veces** —§6, la fila de `FE-02` y `CA-08`—: «**vuelve** a la Presentación / landing con el acceso de registro a la vista» (P-01). `DR-01:37` dirigía a `B_FormularioRegistro` (**P-02**) y decía «**termina**». | **Mandó `ECU-01`**: la especificación es la autoridad del comportamiento del caso de uso, y aquí lo dice en un criterio comprobable. Corregidos `DR-01` (→ **v2.1**), `DS-01` y `CP-507`. Al Visitante **se le ofrece** registrarse, no se le empuja a un formulario que no pidió |
| **H-9** | **`CA-11` de `ECU-04` no tenía de dónde derivar prueba.** El criterio exige que «ningún `EventoOperativo` permita reconstruir que esa cuenta existió», y `EventoOperativo` **no aparecía en `DR-04`** — pese a que `ECU-04 §7` lo declara como concepto que **permanece** fuera de la cascada «y por eso debe ser irreidentificable» (`RE-06`) | **El defecto estaba en `DR-04`, no en el criterio.** `DR-04 v2.1` gana la entidad y el controlador `C_ConservarTelemetriaSinIdentidad`, cuya **no-acción sobre la cascada es la afirmación**; `DS-04` gana `conservarSinIdentidad()` y de ahí deriva **`CP-813`**. Ripple: 261 → **263** elementos, 149 → **150** controladores, propagado a `HECHOS_CANONICOS` (`H-20`, `H-21`), `DR-00`, el generador de SVG de robustez, `ESTADO_PIPELINE` e `INDICE_MAESTRO` |

### Los siete restantes, aplicados en la misma decisión

Todos confirmados y ejecutados. La columna de la derecha dice **qué se hizo**, no a dónde iba.

| # | Hallazgo | Resolución |
|---|---|---|
| **H-1** | **Resultó ser dos defectos con una raíz.** `H-1a`: `ECU-06` creaba el `EventoOperativo` **al cerrar** (paso 8), con campos —latencia, resultado, modelo, versión— que son valores **de una llamada**; al cerrar no hay una latencia única que registrar, y `MET-07` mide «peticiones OK + *fallback* / **totales**». `H-1b`: `DR-09`/`DS-09` contaban las «llamadas al chat de 7 días» desde **`Conversacion`**. | **La raíz común: `Conversacion` no se persiste** (`RF-13`, `PRIV-01 §2`: «No (nunca)»), y `MD-01 §3` creó `EventoOperativo` **precisamente por eso** — «sin esta clase la tasa de 7 días de `ECU-09` sería incomputable». El evento pasa a escribirse **por llamada** (`ECU-06` §7/§11/§14/§16/§18, `DR-06`, `DS-06` dentro del `loop`, `DOP-01`, `MD-01.md`); las dos cifras de ventana pasan a salir de él (`ECU-09`, `PER-01 §3.6`, `DR-09`, `DS-09`, `CP-09`). **Ripple:** `E_Conversacion` quedó huérfana en `DR-09` y sale → **263 → 262** elementos, 60 → **59** entidades; `H-21` sin cambio. **Decisión que el plan no previó:** se registra **una vez por llamada efectivamente hecha al proveedor** — `FE-06`/`FE-07` **sí**, o el denominador de `MET-07` solo tendría éxitos; `FE-04`/`FE-05` **no**, porque cortan antes de tocar al proveedor. De ahí `CP-032`/`CP-033`/`CP-034` y **178 → 181** casos |
| **H-2** | El **paso 3 del plan §4.11** («verificar mayoría de edad») no aparecía modelado. | **Estaba cubierto, no dicho.** Quedó absorbido en `PRE-03` de `ECU-06` («El Usuario es adulto **y** tiene vigente la capa base»). Se hace explícita la absorción en la nota del paso 8 |
| **H-3** | `DS-07` invierte el orden 7↔8 de `ECU-07`. | **Con razón, y así queda declarado en `ECU-07` §11.** El descarte resuelve el turno en curso; reabrir es un acto del Usuario «cuando lo decide», que puede tardar días. Un diagrama de secuencia ordena por **tiempo real**. `DR-07` ya lo modelaba así; la tabla conserva su numeración narrativa |
| **H-4** | `ECU-05` numeraba el armado de la cápsula en el **paso 8** (§11) y en el **7** (§15, §18, `RN-01.3`). | **Manda §11**, el flujo básico: el paso 7 otorga la capa de personalización, el 8 arma la cápsula. Corregidas las tres referencias y añadida la nota que distingue los dos actos. `DS-05` ya lo modelaba así |
| **H-5** | `ECU-13` §12 citaba `RN-02.9` como regla que gobierna el flujo; §8 no la definía. | **Referencia colgante, retirada.** No podía definirse allí: `RN-02.9` es el límite de tasa, que gobierna el envío de mensajes en `CU-06`. Cambiar de acompañante no consume cuota porque **no hay llamada al proveedor**. El motivo queda escrito en §8 |
| **H-6** | `DR-06` afirmaba que `ContadorDeUsoDiario` y `EventoOperativo` «NO son clases de MD-01» y las llamaba «entidades en verde». | **Las dos cosas eran falsas.** Son clases desde `MD-01 v1.4` (líneas 48-49, `DR-00 §6`) y el `#PaleGreen` se había retirado ya en `CERT-D4-tanda1`. Nota reescrita |
| **H-7** | `DR-08` **se contradecía con sus propias flechas**: dibujaba `FA-01` y `FA-02`, y su prosa decía «cero cursos alternativos». | **Error de redacción, no ausencia significativa.** `ECU-08` §6 define ambos con nombre, condición y desenlace. Lo que el MVP no tiene es paginación ni filtros — eso es lo que la nota quería decir. Reescrita, y la misma corrección se aplicó a `DR-09`, que arrastraba el defecto |
| ~~H-8~~ | *(aplicado — ver arriba)* — **`FE-02` de `CU-01` tenía dos desenlaces incompatibles.** `ECU-01` lo dice **tres veces** —§6, la fila de `FE-02` y `CA-08`—: «**vuelve** a la **Presentación / landing** con el acceso de registro a la vista» (P-01). `DR-01:37` dibuja el arco hacia `B_FormularioRegistro` (**P-02**) y dice «**termina**». Difieren en el destino *y* en el desenlace. `DS-01` sigue a `DR-01`, que es su insumo inmediato; si la autoridad es `ECU-01`, hay que corregir `DR-01` **y** `DS-01`. `[E1]` | `/uml-robustness-diagram` |
| ~~H-9~~ | *(aplicado — ver arriba)* — **`CA-11` de `ECU-04` no tenía controlador que la gobierne.** El criterio exige que «ningún `EventoOperativo` permita reconstruir que esa cuenta existió ni qué hizo» (`RE-06`), pero **`EventoOperativo` aparece cero veces en `DR-04`**: ni como entidad ni tocado por controlador alguno. Es **comportamiento declarado que el análisis de robustez nunca modeló**, así que no hay `CP` derivable sin inventar el controlador. No se fabricó uno. `[E1]` | `/uml-robustness-diagram` |

## 9. Trazabilidad hacia adelante

| Elemento de secuencia | Destino |
|---|---|
| Cada **mensaje** | Una operación en la clase receptora → **diagrama de clases de diseño** |
| El **delta** (`DOP-01`) | Entrada directa de `uml-design-class-model` |
| Cada **controlador** | Al menos un `CP-XX` → pruebas de la fase de construcción |
| La **excepción `E-1`** | Se cierra en `ARQ-01`, tras el **CDR** |

Lo que sigue es el **diagrama de clases de diseño** y después el **Critical Design Review**
(Milestone 3), que revisa este diseño antes de codificar.

## 10. Qué queda abierto

| Asunto | Estado |
|---|---|
| `CP-XX` de los 14 casos de uso | ✅ **181 casos** (`H-24`), `CP-00` como índice |
| `COD-01` (insumos para código: clase · operación · firma · capa) | Pendiente |
| `TRZ-DS-01` (matriz paso ↔ mensaje ↔ operación ↔ clase ↔ `CP`) y propagación a `TRZ-01` | Pendiente |
| Propagación de gobernanza: `ESTADO_PIPELINE`, `CHANGELOG`, `REGISTRO_DECISIONES` (**SD-30**), `HECHOS_CANONICOS`, `README`, `INDICE_MAESTRO` | Pendiente |
| Regenerar los SVG con la retícula corregida | ✅ **Hecho (SD-31):** los **14 de robustez**, que eran los afectados —no `MD-01.svg` ni `DCU-01.svg`, que los produce **PlantUML** y no este generador—. Los catorce pasan el pase geométrico en **cero colisiones**. Ver §11 | Hecho |
| Los **9** hallazgos de §8 (`H-1`…`H-9`) | ✅ **Todos aplicados** en SD-30 |

## 11. Los SVG de robustez, regenerados (`SD-31`)

Lo que en `v1.2` era una orientación pendiente **está ejecutado**, y al medirlo resultó ser peor de
lo que esta sección declaraba.

**Alcance real, corregido.** Esta sección citaba `DR-06` como ejemplo. Medida la demanda de los
catorce contra la capacidad de cada canal, **los catorce la desbordaban**: `CANAL_CC` daba **4**
posiciones y `DR-06` pedía **24**; `CANAL_BC` daba 5 para 19; hasta `DR-01`, el más pequeño, pedía
10 donde cabían 5. Y quedan fuera `MD-01.svg` y `DCU-01.svg`, que **los produce PlantUML** —no este
generador— y cuyos `.puml` no cambian: no había nada que regenerar en ellos. Una nota de `§10`
decía lo contrario; era un error.

**Los tres defectos, y por qué el tercero era el que los dejaba pasar:**

1. **Capacidad fija con aritmética modular.** `idx % N` sobre bandas constantes: al dar la vuelta,
   dos arcos compartían coordenada y se dibujaban uno encima del otro.
2. **Anti-solape ciego.** `libre()` comparaba cada etiqueta **solo contra otras etiquetas, nunca
   contra las líneas**. Por construcción no podía ver el defecto que el ojo ve primero. Y si tras
   40 intentos no hallaba hueco, **colocaba igual sin avisar**.
3. **Ninguna verificación.** Nada comprobaba el resultado, así que los dos anteriores llegaron a
   comitearse.

**Cómo se corrigieron.** El ruteo pasa a **coloreado de intervalos** —dos arcos comparten
coordenada si sus tramos verticales no se solapan—, con lo que `DR-06` baja de 24 arcos a **12
pistas**. Pero eso solo no bastaba: 12 pistas en 28 px son 2,3 px de separación. La pieza que
faltaba fue **partir cada hueco entre carriles en dos bandas**, una de etiquetas sin una sola pista
y otra de pistas, de modo que un chip **no puede taparle la línea a nadie: no hay ninguna donde él
está**. Y la altura de cada caja pasó a depender también de **cuántos arcos salen de ella**: con
catorce arcos en una caja de 37 px los anclajes salían a **2,5 px**, y catorce etiquetas de 14 px no podían no
solaparse — ninguna heurística de colocación arregla después un espacio que no existe.

Por último, `verificar_geometria` contrasta todas las cajas de texto contra todas las cajas y todos
los segmentos, y **el lote aborta sin escribir nada** si algo colisiona: se escribe entero o no se
escribe.

**Resultado: los 14 en cero colisiones**, con los `.puml` intactos y los conteos sin moverse
(*262 elementos, 15/38/150/59*). El lienzo pasa de 1.000 a **1.340 px** de ancho y los diagramas
crecen en alto —`DR-06` llega a 2.488 px—, que es el precio de que quepan sin pisarse.

> **Lo que el pase garantiza y lo que no.** Garantiza que **no hay colisiones**. No garantiza que
> el diagrama se **lea bien**: eso se comprobó a ojo sobre `DR-06` y `DR-14`, el más denso y el más
> simple.

## 12. `VI-01`: el criterio con que se eligió el operador, y por qué no fue uno solo (`SD-41`)

La verificación independiente (`CDR-01 v1.4`) encontró que los **17** fragmentos que `SD-39` pasó de
`break` a `opt` estaban mal: `opt` solo salta su cuerpo, así que **el flujo caía al sufijo de éxito**.
El caso que lo prueba sin discusión es `DS-04`: el usuario cancelaba la eliminación y la secuencia
continuaba hasta la cascada de borrado, contra `ECU-04 FA-03` —«El Sistema **no suprime nada**»—.

**Lo que esta pasada añade es que la corrección no es una, sino dos**, y depende de un dato
estructural que ninguna de las dos revisiones anteriores había mirado: **si el fragmento vive dentro
de un `loop`.**

| Grupo | Dónde | Operador | Por qué |
|---|---|---|---|
| **A — 13 fragmentos** | `DS-03`, `DS-04`, `DS-05`, `DS-10`, `DS-11`, `DS-12`, todos a **profundidad 0** | **`break`** | El fragmento envolvente es la interacción entera. UML 2.5: `break` ejecuta su operando **en lugar del resto** del fragmento envolvente — que es exactamente lo que dicen sus filas de `ECU`: «no ejecuta la supresión», «no aplica el cambio», «no modifica el `Consentimiento`», «no permite avanzar» |
| **B — 4 fragmentos** | `DS-06:80,105`, dentro de `loop 1..20` | **`alt`/`else`** | Ahí `break` abandonaría **el `loop`** y terminaría la conversación, contra el «**Vuelve** al paso 2 / al paso 4» de `ECU-06`. `alt` hace excluyentes fallo y continuación **dentro del turno**, y el `loop` ya modela la vuelta |

**Consecuencia que hay que decir, porque corrige a una revisión anterior:** para los **13** del grupo
A, el **`break` original era correcto**, y esa parte de `H-01` fue un **falso positivo**. `H-01` acertó
en el diagnóstico general —el operador se había elegido por categoría (`FE`→`break`) y no por
desenlace— y acertó de lleno en el grupo B, donde `break` sí rompía el reintento. Pero al aplicar un
**único** remedio a los 17, convirtió trece ~~aciertos~~ **supuestos aciertos** en defectos. *(`SD-43`: no eran aciertos — las trece filas dicen «Vuelve».)* `VI-01` cazó el resultado; el
criterio que faltaba es el de esta tabla.

**Lo que no cambió, y se comprobó:** los **33** `break` restantes siguen siendo correctos —sus filas
dicen «Termina»— y **no se tocaron**. Dentro de `DS-06`, los tres que quedan (`FE-01`, `FE-08`,
`FA-01`) sí terminan la conversación, así que siguen siendo `break`.

**Medición de cierre:** **283 mensajes** (`H-22` intacto), 14 diagramas en **0 errores**, y las
advertencias suben de **6 a 10** — las 4 nuevas son el anidamiento de `DS-06` declarado en `E-5`.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v2.1 | 2026-08-05 | J. Sánchez | **SD-45 — `CVI-03`: la cuarta verificación independiente refutó `R3`.** No por el diagnóstico —el `DS` no es un diagrama de flujo— sino porque `SD-44` **conservó los `loop` que afirmaban un retorno falso**: *«dibujar una reentrada y declarar en una nota que no se pretende dibujarla no elimina la semántica del fragmento»*. En `DS-04`, `DS-10`, `DS-11` y `DS-12` el bucle se acota **al paso 2**, que es adonde manda `FE-03`, y **la cancelación sale del bucle**: nunca fue una iteración. `DS-06` no se toca —su `loop 1..20` es iteración genuina— y se declara que el «vuelve al paso 4» de `FE-06` ya lo realiza `reintentarUnaVez()`, mientras el de `FE-07` es una discrepancia de la `ECU` enrutada a su skill. **Seis `CP` fijan ahora el retorno**, y el comprobador se reescribe con **17 fixtures versionados** tras catorce sabotajes que demostraron que decoraba la convención. **283 mensajes intactos**; `DS-04` en 0 errores y 0 advertencias. |
| v2.0 | 2026-08-05 | J. Sánchez | **SD-44 — `TVI-01`, `TVI-02` y `TVI-04`: la convención, después de que la tercera verificación refutara `8 de 13` ramas.** El `loop` + `alt` de `v1.9` **seguía mal**, y no por el operador: el **operando de éxito quedaba vacío** y la continuación **fuera** del `alt`, que es el defecto de `opt` con otro nombre — en `DS-04` se confirmaba «no queda dato recuperable» tras una cascada a medias, y en `DS-11` se ofrecía rehacer una caracterización intacta. **`SD-44` fija cuatro reglas**: el sufijo de éxito vive **dentro** de su operando (R1); un `break` dentro de un `loop` solo vale si lo que sigue es **limpieza común** (R2); el punto exacto de reentrada es normativo en la `ECU` y verificable en el `CP`, y **este certificado deja de afirmar que el `loop` lo realiza** (R3); la guarda nombra todas las salidas (R4). **Las comprueba `scripts/barrido_desenlaces.py`, probado haciéndolo fallar.** **Dos correcciones de recuento de `v1.9`:** los `break` legítimos de los seis diagramas tocados son **16**, no 22, y los internos de `DS-06` son **tres**, no seis. **283 mensajes intactos**; validador en 0 errores y las mismas 10 advertencias; 14 SVG sin colisiones. |
| v1.9 | 2026-08-05 | J. Sánchez | **SD-43 — `SVI-01`: la corrección de `v1.8` era falsa, y la refutó la segunda verificación independiente.** `SD-41` afirmó que **trece** de los diecisiete `opt` correspondían a filas de `ECU` que dicen «Termina» y restauró su `break`. **Ninguna lo dice**: las diecisiete dicen «Vuelve al paso N» o «Cancela y vuelve al paso 1», comprobado abriendo cada fila —incluida `ECU-11 FE-04`, que el barrido de `SD-41` no llegó a leer—. Las **13** pasan a **`loop` + `alt`** en `DS-03/04/05/10/11/12`: el `alt` hace excluyentes error y éxito ~~y el `loop` **realiza el retorno**~~ *(refutado en `SD-44`: `TVI-02` — un `loop` no realiza dos retornos distintos, y el `DS` no debe pretenderlo)*. ~~Los **22 `break` legítimos**~~ *(son **16** en estos seis diagramas; `TVI-05`)* se conservan y quedan **fuera** de los bucles a propósito. **283 mensajes intactos**; validador en 0 errores y las mismas 10 advertencias. **Y un hallazgo nuevo que este certificado debe declarar (`SD-43-H1`):** `DS-06` tiene ~~seis~~ **tres** `break` **dentro** de su `loop` *(`TVI-05`)* y **tres mensajes después** de él, así que salen del bucle y siguen ejecutando el cierre; queda registrado en la fila 26 del tablero, sin corregir, para la próxima verificación independiente. |
| v1.8 | 2026-08-05 | J. Sánchez | **SD-41 — `VI-01` del `CDR-01 v1.4`, y una corrección a `H-01`.** Los **17** fragmentos que `SD-39` pasó de `break` a `opt` estaban mal —`opt` salta su cuerpo y el flujo **cae al éxito**: en `DS-04` el usuario cancelaba la eliminación y la secuencia seguía hasta la cascada—. Pero el remedio **no es uno solo**, y el dato que lo decide no lo había mirado ninguna de las dos revisiones anteriores: **si el fragmento vive dentro de un `loop`**. **Grupo A, 13 fragmentos a profundidad 0** (`DS-03/04/05/10/11/12`) → **`break`**, porque el envolvente es la interacción entera y sus `ECU` dicen que el remanente no se ejecuta. **Grupo B, 4 dentro de `loop 1..20`** (`DS-06`) → **`alt`/`else`**, porque allí `break` terminaría la conversación contra el «Vuelve al paso 2/4» de `ECU-06`. **Consecuencia declarada: para los 13 del grupo A el `break` original era correcto y esa parte de `H-01` fue un falso positivo** — acertó el diagnóstico y falló al aplicar un único remedio a los 17. Entra **§12** con el criterio y **`E-5`** con su precio: el anidamiento de `DS-06` sube a 3-4 niveles y las advertencias de **6 a 10**; no se contorsiona el diagrama para callarlas, porque `CU-06` ya está declarado como no partible. **Verificado:** **283 mensajes** (`H-22` intacto), 14 diagramas en **0 errores**, 14 SVG regenerados sin colisiones. |
| v1.7 | 2026-08-05 | J. Sánchez | **SD-40 — el archivo se contradecía a dos líneas.** `v1.6` movió `H-22` a **283** en la ficha y en la nota de §2, pero **no tocó la tabla**: su fila de totales seguía en **282**, justo encima del párrafo que declara «`H-22` (283 mensajes)». Contado sobre los catorce `.puml`, el total real es **283** y la discrepancia estaba localizada en una sola fila: **`DS-10` declaraba 20 mensajes y tiene 21** — el que añadió `H-18` al hacer que el diálogo del *kill switch* nombre el efecto antes de confirmar. Corregidas la fila y el total. Es la clase de defecto que el `CDR-01 v1.4` no podía ver: su hallazgo `VI-06` listó los consumidores del canon, no las tablas internas de cada artefacto. |
| v1.6 | 2026-08-05 | J. Sánchez | **SD-39 — retrabajo del `CDR-01`.** Dos hechos canónicos del paquete se mueven y se propagan aquí: **`H-22` 282 → 283 mensajes** —`H-01` convirtió 17 `break` en `opt` y `H-02`/`H-15`/`H-18` reescribieron mensajes en `DS-04`, `DS-10` y `DS-11`— y **`H-23` 192 → 193 operaciones**. Los dos **se remidieron de primera mano** antes de escribirlos: los 283 los contó el propio `generar_svg_secuencia.py` al regenerar, no una heurística. **Ningún diagrama pierde ni gana participantes**, y los 14 siguen en **0 errores y 6 advertencias** —la línea base exacta de `E-2`—, con la capa «cierre de participantes contra `DR-XX`» ejecutada 14/14. |
| v1.5 | 2026-08-04 | J. Sánchez | **SD-36.** `E-3` declaraba **diez** mensajes dirigidos a un actor y son **once** — contados por diagrama: `DS-06` 1, `DS-08` 3, `DS-09` 2, `DS-10` 1, `DS-11` 4. La cifra importa más de lo que su magnitud sugiere: `E-3` es una **excepción declarada** cuyo valor entero es que la sostiene una medición, y un número que no cuadra debilita justo eso. |
| v1.4 | 2026-08-04 | J. Sánchez | **SD-32, hallazgos del modelo de clases (`MC-00 §6`).** (a) **`H-D`, corregido en su raíz:** las etiquetas divergentes de P-08 y P-10 nacían en **`DR-11` y `DR-13`**, no aquí — `DS-11` y `DS-13` copiaban fielmente su robustez, que es lo que la capa 2 exige. Corregidas las dos en robustez y alineados `DS-06`, `DS-11`, `DS-12` y `DS-13`; SVG de ambas familias regenerados sin colisiones. (b) **`H-P`:** la tabla de §2 declaraba **6** participantes para `DS-09` y son **5** — residuo de `SD-30`, cuando `H-1b` sacó `E_Conversacion` del diagrama y nadie bajó el conteo. (c) **`H-C` evaluado y NO aplicado:** se propuso convertir en auto-llamadas los 10 mensajes dirigidos a un actor; al medirlo, el validador subió de 6 a 10 advertencias, sacó a `DS-09` de la banda declarada en `E-2` (62-78 % → 83 %) y creó dos avisos de auto-llamadas consecutivas. **Revertido:** un mensaje frontera→actor es UML legítimo. Queda como `E-3`. (d) **`H-N` declarado, no corregible:** `actor "Visitante"` y `entity "Visitante"` comparten etiqueta porque una viene de `DCU-01` y la otra de `MD-01`; renombrar cualquiera rompe una traza. **Verificación: los 14 en 0 errores y 6 advertencias, idéntico a la línea base tomada antes de empezar.** |
| v1.3 | 2026-08-02 | J. Sánchez | **SD-31.** §11 deja de ser una orientación pendiente: **los 14 SVG de robustez están regenerados en cero colisiones**. Al medir la demanda real apareció que el alcance declarado era doblemente erróneo: no era `DR-06` —**los catorce** desbordaban algún canal— y `MD-01.svg`/`DCU-01.svg` **no entraban**, porque los produce PlantUML y no el generador propio. La fila de §10 decía justo lo contrario y queda corregida. |
| v1.2 | 2026-08-01 | J. Sánchez | **SD-30 cerrado.** Se aplican los **siete** hallazgos restantes (`H-1`…`H-7`); §8 deja de tener pendientes. El grande, `H-1`, resultó **dos defectos con una raíz**: el evento operativo se registraba al cerrar y las cifras de ventana se contaban desde `Conversacion` — ambas insostenibles porque **la `Conversacion` no se persiste**, que es la razón por la que `MD-01` creó `EventoOperativo`. Ripple: **263 → 262** elementos y **178 → 181** casos de prueba, estos últimos porque `H-1a` obligó a decidir **qué llamadas cuentan** para `MET-07`. Los conteos del paquete pasan a `HECHOS_CANONICOS` como `H-22`/`H-23`/`H-24`. Entra §11 con la orientación de D-6. |
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30:** se aplican `H-8` (`FE-02` de `CU-01` vuelve a P-01, no dirige a P-02) y `H-9` (`DR-04` incorpora `EventoOperativo` y su controlador). `DR-01` y `DR-04` pasan a v2.1; los conteos suben a 263 elementos y 150 controladores; entra `CP-813`. Quedan 7 hallazgos pendientes de confirmación. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. Los 14 diagramas de secuencia en **0 errores**, **149/149** controladores cubiertos, **191 operaciones** asignadas con justificación, **16/16** clases del dominio con comportamiento, 3 clases nuevas del espacio de la solución, generador SVG propio sin colisiones, y **9 hallazgos** enrutados a sus skills. |
