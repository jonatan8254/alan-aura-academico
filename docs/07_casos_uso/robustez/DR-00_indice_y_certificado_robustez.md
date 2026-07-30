# DR-00 — Análisis de robustez: índice, certificado de auditoría, desambiguación, delta y trazabilidad

**ID:** DR-00 · **Familia:** DR (análisis de robustez, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/robustez/` · **Fecha:** 2026-07-30 · **Versión:** v1.0 · **Estado:** Propuesto.
**Propósito:** índice de los **10 diagramas de robustez** (`DR-01…DR-10`) derivados de `ECU-01…ECU-10`, más los cuatro entregables que los acompañan: certificado de auditoría, informe de desambiguación, delta de *object discovery* y matriz de trazabilidad.
**Insumos:** ECU-00…ECU-10 (insumo dominante), MD-01 (dominio), DCU-01 (actores y casos), MV-01, REQ-01, PRIV-01, SEG-01, PER-01, CONTRATO conversacional, DIS-00/DIS-01 + los 16 mockups (fuente de los objetos tipo Borde).
**Consumidores:** diagramas de secuencia (`DS-01…DS-10`), casos de prueba (`CP-XX`), diseño de clases y fase de construcción.
**Generado con:** skill `uml-robustness-diagram`. **Validador:** `validate_robustness_puml.py` → **0 errores en los 10 diagramas**.
**Naturaleza:** diseño preliminar conceptual. **No** es diseño detallado: no asigna operaciones a clases, no dibuja herencia y no aplica patrones.

---

## 1. Los 10 diagramas

| DR | Caso de uso | Archivo (`.puml` / `.svg`) | Actor primario | Elem. | Act/Bor/Ctrl/Ent | FA | FE |
|---|---|---|---|---|---|---|---|
| **DR-01** | CU-01 Consultar presentación del servicio | [`.puml`](DR-01_robustez_consultar_presentacion.puml) · [`.svg`](DR-01_robustez_consultar_presentacion.svg) | Visitante | 9 | 1/3/5/0 | 2 | 1 |
| **DR-02** | CU-02 Registrar cuenta | [`.puml`](DR-02_robustez_registrar_cuenta.puml) · [`.svg`](DR-02_robustez_registrar_cuenta.svg) | Visitante | 11 | 1/2/7/1 | 1 | 1 |
| **DR-03** | CU-03 Iniciar sesión | [`.puml`](DR-03_robustez_iniciar_sesion.puml) · [`.svg`](DR-03_robustez_iniciar_sesion.svg) | Usuario (var. Administrador) | 19 | 2/5/10/2 | 2 | 3 |
| **DR-04** | CU-04 Gestionar cuenta y datos personales | [`.puml`](DR-04_robustez_gestionar_cuenta.puml) · [`.svg`](DR-04_robustez_gestionar_cuenta.svg) | Usuario | 21 | 1/5/11/4 | 3 | 2 |
| **DR-05** | CU-05 Otorgar consentimiento y caracterizar el perfil | [`.puml`](DR-05_robustez_consentimiento_caracterizacion.puml) · [`.svg`](DR-05_robustez_consentimiento_caracterizacion.svg) | Usuario | 28 | 1/6/15/6 | 3 | 4 |
| **DR-06** | CU-06 Conversar con el acompañante | [`.puml`](DR-06_robustez_conversar_con_el_acompanante.puml) · [`.svg`](DR-06_robustez_conversar_con_el_acompanante.svg) | Usuario · Proveedor LLM | 38 | 2/3/25/8 | 3 | 8 |
| **DR-07** | CU-07 Derivar ante peligro (`<<extend>>`) | [`.puml`](DR-07_robustez_derivar_ante_peligro.puml) · [`.svg`](DR-07_robustez_derivar_ante_peligro.svg) | Usuario (disparo del sistema) | 15 | 1/2/8/4 | 1 | 2 |
| **DR-08** | CU-08 Consultar directorio de usuarios | [`.puml`](DR-08_robustez_consultar_directorio.puml) · [`.svg`](DR-08_robustez_consultar_directorio.svg) | Administrador | 10 | 1/1/6/2 | 0 | 2 |
| **DR-09** | CU-09 Consultar métricas de uso | [`.puml`](DR-09_robustez_consultar_metricas.puml) · [`.svg`](DR-09_robustez_consultar_metricas.svg) | Administrador | 11 | 1/1/6/3 | 0 | 2 |
| **DR-10** | CU-10 Habilitar o deshabilitar el chatbot | [`.puml`](DR-10_robustez_habilitar_deshabilitar_chatbot.puml) · [`.svg`](DR-10_robustez_habilitar_deshabilitar_chatbot.svg) | Administrador | 17 | 1/3/9/4 | 2 | 2 |
| | | | **Total** | **179** | 12/31/102/34 | **17** | **27** |

**Render acompañante:** los 10 `.svg` son vistas estáticas autocontenidas construidas con el **mismo sistema visual que `MD-01_modelo_dominio.svg` y `DCU-01_casos_uso.svg`** — lienzo de ancho fijo (1000 px), `role="img"` con `<title>`/`<desc>`, tipografía única heredada de la raíz, sin `<defs>` ni `<style>`, y las mismas cinco tríadas de color (relleno pastel / borde saturado / texto oscuro). **No** son salida directa de PlantUML: el render mecánico producía lienzos de hasta 5271 px de ancho (7,8× de reducción para caber en columna, texto ilegible), porque `left to right direction` convierte cada eslabón de una cadena de controladores en una columna.

Los genera [`scripts/generar_svg_robustez.py`](scripts/generar_svg_robustez.py) desde los propios `.puml`, con la disposición canónica de BCE en cuatro carriles verticales (Actor · Borde · Controlador · Entidad) y los pasos fluyendo hacia abajo. El script verifica que emite exactamente los elementos declarados en cada `.puml` (179 en total, 12/31/102/34).

Igual que en MD-01 y DCU-01: **el `.puml` es la fuente de verdad**; ante cualquier discrepancia manda el `.puml`, y el `.svg` se regenera con `python scripts/generar_svg_robustez.py`.

| Codificación visual del `.svg` | Significado |
|---|---|
| Azul · icono ⊢○ | Objeto tipo Borde (pantalla real de DIS-00, con su `P-XX`) |
| Verde · icono ↻ | Controlador |
| Violeta · icono ○̲ | Entidad del modelo de dominio |
| **Terracota** | Objeto que participa **solo** en un curso alternativo o de excepción (sustituye al `#LightCoral` del `.puml`) |
| Violeta con **borde punteado** | Entidad **descubierta** en robustez, ausente de MD-01 (§4) |
| Chip (`3`, `FA-01`, `FE-06/07`) | Paso del texto y/o identificador del curso al que responde el arco |

**Cobertura:** 10 CU de 10 · 44 cursos no básicos (17 FA + 27 FE), todos dibujados en el mismo diagrama que su curso básico y verificados por script.

### Convenciones del paquete
- **Conexión sin dirección (`--`).** En robustez los arcos son asociaciones de comunicación; el orden temporal es del diagrama de secuencia.
- **Color.** `#LightCoral` = objeto que participa **solo** en un curso alternativo o de excepción. `#PaleGreen` = entidad **descubierta** en robustez, ausente de MD-01 (§4).
- **Etiquetas numeradas** con el paso del texto (`1`, `2`…) o el ID del flujo (`FA-01`, `FE-03`), para que el *highlighter test* sea legible en el propio diagrama.
- **Objetos tipo Borde = pantallas reales de DIS-00**, con su identificador (`P-01`…`P-16`) en el rótulo. No se inventó ninguna pantalla.
- **Entidades = nombres exactos de MD-01**, para que la trazabilidad al dominio sea verificable por script.

---

## 2. Certificado de auditoría

**Alcance:** los 10 diagramas. **Pasadas ejecutadas:** 5 de 5 (tope duro alcanzado).
**Estado final: CONVERGIDO CON EXCEPCIONES.**

**Cierre:** críticos **0** · mayores **0** · menores abiertos **2** (documentados en §2.3) · cursos trazados **100 %** (44/44 FA+FE, más los 10 cursos básicos) · pasadas consecutivas sin hallazgos nuevos **2** (capa 1); la capa 2 se re-verificó de forma dirigida, no exhaustiva (§2.4).

### 2.1 Capas del gate

| Capa | Resultado | Nota |
|---|---|---|
| 1. Sintaxis y reglas duras (script) | ✅ **0 errores** en los 10 · 19 advertencias, todas atendidas o justificadas (§2.2) | `validate_robustness_puml.py … --domain MD-01_modelo_dominio.puml` |
| 2. Texto ↔ diagrama ↔ interfaz (*highlighter test*) | ✅ con excepciones | Ejecutada por auditores independientes sobre los 10 pares DR↔ECU y contra DIS-00 §2. Residuos resueltos; los que quedan son defectos **del texto**, no del diagrama → §3 |
| 3. Guías de método (6 pasos + revisión de diseño preliminar) | ✅ | Sin *design-pattern-itis*; sin nivel de detalle de secuencia; todos los cursos alternativos dibujados |
| 4. Anti-patrones | ✅ ninguno sin justificar | Barridos los 20 del catálogo; ver §2.2 y §2.3 |
| 5. Trazabilidad | ✅ sin huérfanos | Matriz en §5; cero elementos sin origen y cero pasos sin elemento |
| 6. Calidad del ítem de información | ✅ 7/7 | No ambiguo · completo · verificable (script + *highlighter*) · consistente con MD-01/DIS-00 · modificable (alias regulares) · trazable · presentable |
| 7. Conformidad entrada ↔ salida | ✅ | Nada inventado: cada elemento tiene procedencia en ECU, MD-01, DCU-01 o DIS-00 |

### 2.2 Excepciones declaradas (advertencias del script justificadas, no silenciadas)

| Advertencia | Dónde | Justificación |
|---|---|---|
| **Sin objetos tipo Entidad** | DR-01 | ECU-01 declara «ninguno persistente» y su postcondición afirma que no se captura ningún dato. La ausencia es fiel al texto. |
| **Racimos controlador-controlador** (5–24 enlaces) | los 10 | La fuente admite la conexión verbo-verbo y advierte que un racimo así es candidato a clase gestora *más adelante*. Se deja constancia: `C_EvaluarGate` + `C_AplicarGuardas` + `C_ConstruirContextoMinimo` de DR-06 son el candidato natural a gestor de conversación en diseño. |
| **Tamaño > 25 elementos** | DR-05 (28), DR-06 (38) | **No procede partir el caso de uso.** El criterio ICONIX para partir es que los cursos alternativos tengan subalternos, o que el curso básico persiga varios objetivos: no ocurre ninguna de las dos. El volumen viene de la *anchura* (la tabla de códigos de RF-26 aporta ~14 de los 38 elementos de DR-06) y de la carga de canon. Partirlos contradiría además SD-20/SD-21 y la correspondencia 1:1 con DCU-01. CU-06 ya delega su rama crítica en CU-07 vía `<<extend>>`. |
| **Object discovery: 3 entidades fuera de MD-01** | DR-04, DR-06, DR-09, DR-10 | Intencional: es la salida esperada de la técnica. Ver §4. |

### 2.3 Hallazgos menores que quedan abiertos (≤2, documentados)

1. **DR-06 — `C_ValidarTurno` con grado 6.** Concentra la entrada de todo turno (paso 2, bucle del paso 7, FE-03 y el retorno de FA-01). Está en el límite del umbral del script sin superarlo. Se acepta: es el punto único de entrada de cada turno y repartirlo crearía controladores artificiales.
2. **DR-07 — la etiqueta del paso 2 lleva dos semánticas** (las dos prohibiciones del paso 2 y la propiedad global FE-01). Se acepta porque mover FE-01 a una nota lo dejaría fuera de la verificación de cobertura por script, que es una garantía más valiosa que la limpieza de la etiqueta.

### 2.4 Correcciones aplicadas, por pasada (registro honesto)

| Pasada | Qué se hizo | Hallazgos cerrados |
|---|---|---|
| **1 → 2** | Construcción de los 10 y capa 1. Corregido un falso positivo de cobertura en DR-08 (citar `CU-03 FA-01` en una precondición hacía que el script leyera un FA propio de CU-08 sin dibujar). | 1 |
| **2 → 3** | Auditoría independiente de las capas 2, 4 y 7 sobre los 10 pares DR↔ECU (5 auditores). **2 críticos** (ramas FE huérfanas sin punto de decisión en DR-06 y DR-10), **~12 mayores** y ~40 menores. Correcciones principales: controladores de verificación de sesión/rol donde faltaban; el arco Controlador→Borde que realizaba la respuesta del paso 1 en DR-08/09/10; `PRE-03` (consentimiento vigente) realizada en DR-06; el contexto mínimo leyendo también persona e intercambios; detección separada de 502 y 504; borde P-11 para los estados de error; `C_DerivarAntePeligro` convertido en hand-off de `<<extend>>` en vez de reimplementar CU-07; eliminación en DR-07 de un atajo que permitía mostrar la contención **sin** suspender el modo seguro (violaba C-10 en el CU más crítico); ruteo del paso 4 de DR-04 fuera de una pantalla inalcanzable sin sesión. | 2 críticos + ~12 mayores |
| **3 → 4** | Verificación independiente de las correcciones. **3 mayores** nuevos, dos de ellos *creados por las propias correcciones*: en DR-10, al dar origen a FE-01/FE-02 quedó activo un destino imposible (devolvían al panel que exige la sesión ausente) → se añadió P-04; en DR-06, FE-01 cubría solo el paso 1 y ECU-06 §13 dice «paso 1-2». Retirada además una acusación **espuria** a ECU-10 §12 (mi nota decía que FA-02 estaba mal anclada; §11 asigna el diálogo al paso 2, así que la ECU tiene razón) y corregido un *non sequitur* sobre RA-01. | 3 mayores |
| **4 → 5** | Capa 1 + verificación de cierre. Una regresión de cobertura (citar «FA-03» de DR-04 dentro de una nota de DR-10) y **1 mayor introducido por mí**: el arco de reintento manual que añadí en DR-06 dejaba al Usuario alcanzar al Proveedor LLM **saltándose el gate de seguridad (RN-02.1) y el límite de tasa (RN-02.9)**. Se eliminó el atajo: el reintento es el reenvío normal por el bucle del paso 7. | 1 mayor + 1 regresión |

### 2.5 Qué NO se pudo verificar (declarado, no omitido)

- **La capa 2 no se re-auditó de forma exhaustiva tras la pasada 4.** La verificación final fue **dirigida** a los siete cambios de esa pasada, no un nuevo *highlighter test* completo de los 10 diagramas. La capa 1 sí se re-ejecutó entera y limpia dos veces.
- **El grafo (`grafo/`) se consultó y aportó poco a este artefacto.** Confirmó la cadena ICONIX y la presencia de `Robustness Diagram` en las dos fuentes de Rosenberg del corpus de conocimiento, pero las ECU están representadas con solo 1–3 nodos cada una: para el texto de los flujos la fuente es `docs/`, no el grafo. Es coherente con lo que declara `GUIA_USO_GRAFO_Y_VAULT.md` §1 («es un mapa hacia los documentos, no los documentos»).

---

## 3. Informe de desambiguación — **pendiente de tu confirmación**

Dibujar los diagramas sacó a la luz defectos del **texto** de las especificaciones y del inventario de pantallas. **No he modificado ninguna ECU, ni DIS-00, ni MD-01**: el texto es artefacto de otra etapa. Cada fila trae la corrección concreta propuesta.

### 3.1 Crítico para el canon — decide antes de los diagramas de secuencia

| # | Artefacto | Frase / hueco | Por qué obliga a adivinar | Corrección propuesta |
|---|---|---|---|---|
| **D-01** | ECU-06 §9 / §13 | `PRE-03` «adulto con **consentimiento vigente** (no revocado)», marcada «Verificable: Sí», **sin ningún curso de excepción asociado**. Las otras cuatro precondiciones sí mapean a 401/403/409/429. | CU-04 permite **revocar** el consentimiento y CU-05 otorgarlo, de modo que «sesión válida + consentimiento revocado» es un estado alcanzable y no manejado. Hoy ese usuario entraría al chat sin obstáculo en el modelo. Toca directamente el canon (consentimiento revocable, RN-07). | Añadir `FE-09 Consentimiento revocado (paso 1) → 403; redirige a CU-05`, y listar `Consentimiento` en ECU-06 §7 y §18. **DR-06 ya dibuja el controlador de verificación**, pero deliberadamente sin rama de fallo, porque inventarla sería añadir un requisito. |
| **D-02** | ECU-04 §12 / RE-02 · DIS-00 §3 | `RE-02` exige confirmación **solo** para eliminar la cuenta. Pero `FA-01` (reiniciar caracterización) **también es irreversible**: borra `character` y, por RN-01.6, deja al Usuario sin poder conversar hasta rehacer CU-05. DIS-00 §3 P-13 dice literalmente «todo claro y **reversible salvo eliminar**», lo cual es falso para FA-01. | Una acción destructiva sin confirmación ni rama de cancelación, y una afirmación de diseño que la contradice. | Extender `RE-02` a `FA-01` con advertencia («perderás el acceso al chat hasta rehacer la caracterización») y corregir la frase de DIS-00 §3 P-13. |

### 3.2 Huecos de especificación

| # | Artefacto | Frase / hueco | Corrección propuesta |
|---|---|---|---|
| D-03 | ECU-03 §2.1 paso 3 | «Redirige al Usuario al **área correspondiente (onboarding o conversación)**» — bifurca sin declarar el criterio. | Precisar: «…según haya completado o no el onboarding (ECU-05 PRE-02)». DR-03 dibuja las dos ramas con el texto literal y **no inventa** el criterio. |
| D-04 | ECU-02 §2.1 paso 3 | «Confirma el registro e invita a iniciar sesión» ocurre sobre una pantalla **sin nombre**; DIS-00 §2 no declara estado de éxito ni para P-02 («vacío · error 400 · username en uso») ni para P-03. | Añadir el estado «cuenta creada» a P-02 **o** a P-03 en DIS-00 §2 y en el mockup, y nombrarlo en ECU-02. |
| D-05 | ECU-04 §11 pasos 3 y 4 | Ambos asignan «Página de gestión de cuenta» como interfaz, pero en el paso 4 la cuenta ya fue suprimida y la sesión cerrada: P-13 exige sesión activa. El paso 4 nombra una interfaz «Confirmación» que no existe en §17 ni en DIS-00. | Declarar la pantalla de destino tras la eliminación. DR-04 rutea a P-01 por ser pública; falta darle a P-01 el estado «cuenta eliminada» en DIS-00 §2. |
| D-06 | ECU-05 §12 FA-03 | «Punto de inicio: **Paso 5+**» — «5+» no es un paso concreto, y §17 no lista ninguna acción «Revocar» entre las de la página de onboarding. | Enumerar los pasos (5, 6-7, 8-9) y añadir la acción «Revocar» a §17. DR-05 ancla la revocación en las tres pantallas por esa lectura. |
| D-07 | ECU-05 §13 FE-01 | Bloqueo por minoría de edad: «Recuperación: **Cerrar sesión**» sin decir si lo hace el sistema o el usuario, ni si `esAdulto=falso` se persiste (§14 solo prevé `esAdulto=verdadero`). | Precisar el actor del cierre de sesión y el destino del dato. |
| D-08 | ECU-06 §12 FA-02 vs §13 FE-03 | FA-02 declara tres disparadores (20 mensajes / 1.500 caracteres / 350 tokens) y pide informar «sin error crudo», pero los 1.500 caracteres están también en FE-03, que responde **400**. El mismo hecho tiene dos tratamientos incompatibles. | Decidir cuál manda: si 1.500 caracteres es límite de sesión (FA-02, informativo) o entrada inválida (FE-03, 400). |
| D-09 | ECU-07 §12 / §13 | `FA-01` («recursos no disponibles») y `FE-02` («configuración ausente o errónea») tienen el mismo disparador (paso 4) y el mismo resultado («aplica FA-01»). La distinción no se define. | Fusionarlos, o definir qué separa «no disponible» de «ausente o erróneo». DR-07 los dibuja como una sola rama. |
| D-10 | ECU-07 §11 | La nota dice «Fuente: SEG-01 §4 + plan §3.8 (**10 pasos**)» pero la tabla tiene **8**, y el checklist §22 confirma 8. | Corregir la cifra o recuperar los dos pasos que falten del protocolo fuente. |

### 3.3 Vocabulario y trazabilidad

| # | Artefacto | Hueco | Corrección propuesta |
|---|---|---|---|
| D-11 | ECU-08 §2.1 / §3 | Usa `ConsentRecord` (nombre de persistencia del plan §4.14) donde MD-01 dice `Consentimiento`; y `Consentimiento` no figura en «Conceptos del dominio» de §2 pese a que el `estado` se deriva de él. | Unificar a `Consentimiento` y añadirlo a los conceptos del CU. |
| D-12 | MV-01 §13.2 vs PER-01 §3 | MV-01 agrupa `MétricaDeUso` y `EventoOperativo` como «vista derivada (**no clase**)». PER-01 (posterior, SD-25) trata `OperationalEvent` como **entidad persistida** con 8 campos. Las dos fuentes se contradicen. | Resolver a favor de PER-01 (que es posterior y más específico) y corregir MV-01 §13.2. DR-09 sigue PER-01 y lo declara. |
| D-13 | DIS-00 §2 vs §3 | El «límite de sesión» aparece en los estados de **P-10** (§2) y también en los de **P-11** (§3). | Fijar §2 como tabla autoritativa. DR-06 sigue §2. |
| D-14 | ECU-05 §19 · ECU-06 §19 | ECU-05 §19 lista «RN-01.1…1.5» omitiendo **RN-01.6** (la regla decisiva de SD-26) e invoca RN-07 sin definirla en §15. ECU-06 §19 omite RF-11 mientras §2 lo incluye en el rango. | Actualizar ambas secciones de trazabilidad. |
| D-15 | ECU-05 | Encabezado dice «v1.1» y §1 «Control del documento» dice «v1.0». | Unificar la versión. |

---

## 4. Delta de *object discovery* — propuesta a MD-01

El método asume que el modelo de dominio inicial está incompleto y trata la robustez como el mecanismo que lo completa. **No he modificado MD-01**: es artefacto de `/uml-domain-modeler`.

### 4.1 Clases nuevas descubiertas (3)

| Clase propuesta | Aparece en | Frase que la justifica | Equivalente en PER-01 / plan §4.14 | Recomendación |
|---|---|---|---|---|
| **`ContadorDeUsoDiario`** | DR-04, DR-06 | ECU-04 paso 3: «borrado en cascada de los datos asociados (cápsula, consentimiento, **contadores del usuario**)»; ECU-06 PRE-05/RN-02.9: «rate limit 3/min, 30/día» | `DailyUsageCounter` | **Incorporar.** Es un sustantivo del problema con identidad y ciclo de vida, participa en el borrado en cascada (PRIV-R11, PER-T1) y condiciona el inicio de un turno. Relaciones sugeridas: `Usuario -- ContadorDeUsoDiario : acumula`. |
| **`EventoOperativo`** | DR-06, DR-09 | ECU-06 paso 8: «registra solo **evento operativo** sin contenido»; §14: «latencia, modelo, versión, estado». Es la fuente de MET-07 en CU-09 | `OperationalEvent` (8 campos, 8 exclusiones) | **Decidir.** Choca con MV-01 §13.2, que lo declara vista derivada — ver hallazgo **D-12**. PER-01 §3 lo trata como entidad persistida. Si se resuelve a favor de PER-01, incorporar. |
| **`AccionAdministrativa`** | DR-10 | ECU-10 paso 3: «cambia el estado global y **registra la acción** (autor + fecha)»; §14 «Datos creados»; §18 operación «Crear»; RF-18 y CA-02 la verifican | `AdministrativeAction` | **No incorporar como clase de dominio** — ECU-10 §21 RA-01 ya decidió tratarla como registro operativo y está aceptada. Se dibuja en robustez porque el texto la crea y persiste, y RF-18 se perdería si no apareciera. La tensión queda declarada. |

> **Nomenclatura.** Se castellanizan (`AccionAdministrativa`, `EventoOperativo`, `ContadorDeUsoDiario`) para respetar MD-01 §1 («español, un término por concepto»). El alias con el nombre inglés del plan queda declarado en cada diagrama.

### 4.2 Atributos nuevos para clases existentes

Ninguno que MD-01 §6 no tenga ya en reserva. La robustez confirmó, sin añadir: `Usuario.{esAdulto, versionDisclosure}`, `CapsulaDePerfil.{mood_self_report, energy_self_report, conversation_goal, response_style, character, schema_version, consent_version}`, `Consentimiento.{estado, fecha, versionDisclosure}`, `DisponibilidadDelChatbot.estado`.

### 4.3 Frontera respetada

- **No se asignaron operaciones** a ninguna clase: eso es diseño detallado y llega con los diagramas de secuencia.
- **Ningún objeto tipo Borde ni actor entró al modelo de dominio**: pertenecen al espacio de la solución. Las 31 pantallas/fronteras y los 12 actores de los diagramas no son candidatos.
- **`MétricaDeUso` NO se propone como clase**: MD-01 §2 la declara vista derivada y DR-09 la respeta, representándola como el cálculo sobre las entidades reales.

### 4.4 Clases del dominio no usadas por ningún caso de uso

Las 12 clases de MD-01 aparecen al menos una vez en el paquete. Cobertura completa: `Usuario` (DR-02/03/04/05/08/09), `Administrador` (DR-03/10), `DisponibilidadDelChatbot` (DR-06/10), `Consentimiento` (DR-04/05/06/08), `CapsulaDePerfil` (DR-04/05/06), `Personaje` (DR-05/06), `Alan` y `Aura` (DR-05), `Conversacion` (DR-06/07/09/10), `Mensaje` (DR-02… DR-06/07), `EventoDeSeguridad` (DR-07), `RecursoDeAyuda` (DR-07).

---

## 5. Matriz de trazabilidad

**Cadena completa del pipeline:** `RF-XX` → `CU-XX` → paso del flujo (`FA-XX`/`FE-XX`) → **`DR-XX`** + elemento (`B-`/`C-`/`E-`) → mensaje de `DS-XX` → caso de prueba `CP-XX`.

### 5.1 Resumen por diagrama (sin huérfanos)

| DR | CU | RF realizados | Pantallas (DIS-00) | Entidades (MD-01 + delta) | Controladores → casos de prueba |
|---|---|---|---|---|---|
| DR-01 | CU-01 | RF-19 | P-01; P-02/P-03 continuación | — (ninguna, por diseño) | 5 → CP-01.1…5 |
| DR-02 | CU-02 | RF-20 | P-02; P-03 | Usuario | 7 → CP-02.1…7 |
| DR-03 | CU-03 | RF-14, RF-21 | P-03, P-04; P-05/P-10/P-14 | Usuario, Administrador | 10 → CP-03.1…10 |
| DR-04 | CU-04 | RF-22, RF-23, RF-24 | P-13; P-08/P-03/P-01 | Usuario, CapsulaDePerfil, Consentimiento, **ContadorDeUsoDiario** | 11 → CP-04.1…11 |
| DR-05 | CU-05 | RF-01…RF-06 | P-05…P-09; P-03 | Usuario, Consentimiento, CapsulaDePerfil, Personaje, Alan, Aura | 15 → CP-05.1…15 |
| DR-06 | CU-06 | RF-07…RF-10, RF-12, RF-13, RF-25, RF-26 | P-10, P-11 | Conversacion, Mensaje, Personaje, CapsulaDePerfil, Consentimiento, DisponibilidadDelChatbot, **ContadorDeUsoDiario**, **EventoOperativo** | 25 → CP-06.1…25 |
| DR-07 | CU-07 | RF-11 | P-12, P-10 | Mensaje, EventoDeSeguridad, RecursoDeAyuda, Conversacion | 8 → CP-07.1…8 |
| DR-08 | CU-08 | RF-15 | P-14 | Usuario, Consentimiento | 6 → CP-08.1…6 |
| DR-09 | CU-09 | RF-16 | P-15 | Usuario, Conversacion, **EventoOperativo** | 6 → CP-09.1…6 |
| DR-10 | CU-10 | RF-17, RF-18 | P-16; P-04 | DisponibilidadDelChatbot, Administrador, **AccionAdministrativa**, Conversacion | 9 → CP-10.1…9 |

**Cobertura de RF: 26/26, cero huérfanos** — idéntica a la de `ECU-00` §5, ahora extendida hasta el nivel de elemento de robustez.

### 5.2 Verificación bidireccional

| Criterio | Resultado |
|---|---|
| Cada objeto tipo Entidad procede de MD-01 **o** está en el delta (§4) | ✅ 34 apariciones · 31 de MD-01 · 3 clases nuevas declaradas |
| Cada actor procede de DCU-01 | ✅ Visitante, Usuario adulto, Administrador de plataforma, Proveedor LLM (Groq) — los 4 de DCU-01, ninguno inventado |
| Cada objeto tipo Borde corresponde a una pantalla real de DIS-00 | ✅ 16/16 pantallas del inventario usadas, más 2 diálogos de confirmación nombrados en ECU-04 §11 y ECU-10 §11, y 1 frontera con el sistema externo (MD-01 §3.9) |
| Cada elemento rastrea a una frase concreta de la especificación | ✅ verificado por *highlighter test* (capa 2) |
| Cada paso, FA y FE del texto tiene elemento | ✅ 100 % · los residuos que quedan son defectos del texto → §3 |

---

## 6. Trazabilidad hacia adelante

La correspondencia con el siguiente artefacto es casi mecánica:

| Elemento de robustez | → Diagrama de secuencia (`DS-XX`) | → Pruebas |
|---|---|---|
| Objeto tipo **Borde** (31) | Instancia de objeto / *lifeline* | — |
| Objeto tipo **Entidad** (34 apariciones, 15 clases) | Instancia de objeto / *lifeline* | Inspección de datos |
| Objeto tipo **Controlador** (102) | **Mensaje** entre *lifelines*; más tarde, método de una clase | **1 caso de prueba por controlador** → 102 `CP` planificados |

**Cómo usarlo:** recorre los controladores uno a uno, dibuja su mensaje en la secuencia y márcalo. Lo que quede sin marcar es comportamiento que se está quedando fuera del diseño — y lo que se queda implícito aquí, no se implementa después.

**Prioridad sugerida para `DS-XX`:** `DS-06` (nuclear, y el único que debe desplegar los 18 pasos internos del plan §4.11) → `DS-07` (*fail-safe*, canon) → `DS-05` (consentimiento y cápsula) → `DS-04` (borrado en cascada) → `DS-10` → el resto.

---

## 7. Definición de terminado (DoD)

- [x] Un diagrama por caso de uso, con curso básico **y todos** los cursos alternativos y de excepción en el mismo diagrama.
- [x] Validador de la skill: **0 errores** en los 10.
- [x] Texto del caso de uso adjunto a cada diagrama como `note` (tres zonas: texto · diagrama · pantalla de DIS-00 citada por identificador).
- [x] Certificado de auditoría con estado honesto y capas no ejecutadas declaradas (§2.5).
- [x] Informe de desambiguación con corrección concreta por hallazgo, **sin** modificar las ECU.
- [x] Delta de *object discovery* con 3 clases propuestas y la frontera respetada (sin operaciones, sin bordes ni actores en el dominio).
- [x] Matriz de trazabilidad sin huérfanos y cadena `RF → CU → flujo → DR → DS → CP` cerrada.
- [ ] **Pendiente de ti:** decisión sobre los 15 hallazgos de desambiguación (§3) y sobre las 3 clases del delta (§4.1).
- [x] Render `.svg` de los 10 diagramas (PlantUML v1.2026.6, coincide 1:1 con cada `.puml`).

**Fin de DR-00.**
