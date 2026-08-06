# Cápsula de contexto — Subproyecto «Alan & Aura Académico»
**Objetivo:** entender el subproyecto en 5 minutos. **Naturaleza:** síntesis operativa (no normativa). **Fecha de creación:** 2026-07-12 · **Última actualización:** 2026-08-06 (`SD-53`: **el sistema está construido y en línea**. Esta cápsula iba doce decisiones por detrás —seguía dando el `CDR` por «Reinspección requerida» y el diseño físico por diferido—; ahora refleja el veredicto determinado, `ARQ-01` implementado, la Fase 3 desplegada y los seis defectos que la construcción encontró.)

---

## En una frase
Un **MVP conversacional de apoyo emocional** con los personajes **Alan** (activación) y **Aura** (calma), pensado como entrega de la materia *Diseño y Construcción de Productos de Software* (UNAL Medellín), con el mismo rigor de trazabilidad y seguridad que su origen profesional.

## Independencia (innegociable desde SD-18)
Este es un **repositorio independiente**, extraído el 2026-07-12 del macroproyecto profesional Smart-AID/TalentTrack (repositorio separado, no incluido aquí). **No depende de él**: no hay rutas, imports ni referencias funcionales hacia sus artefactos. Debe poder clonarse, construirse y desplegarse sin acceso al repositorio del macroproyecto. Las menciones al macroproyecto en este subproyecto son **citas de procedencia** de la fase documental previa a la extracción (ver «De dónde salió el alcance»), nunca una dependencia viva. Detalle completo: `CLAUDE.md` §0 (raíz).

## Qué hace el MVP (rebanada vertical)
1. **Onboarding emocional simplificado:** consentimiento **granular por dos capas** (base: habilita conversar; personalización: habilita que la cápsula oriente la conversación) + *disclosure* de IA (adultos), unos pocos autorreportes de perfil, elección de Alan o Aura, y armado de una **cápsula de perfil mínima**.
2. **Conversación Alan/Aura v1:** chat con un LLM gobernado; la cápsula (no el historial bruto) alimenta el modelo; el usuario elige y puede cambiar de personaje en sesión.
3. **Gate de seguridad binario:** ante señales de **peligro explícito**, la personalidad se subordina a un **fallback determinista** (mensaje de contención + derivación a recursos configurables), que opera incluso con el LLM caído. No es detección clínica ni exhaustiva; se declara con honestidad.
4. **Administración mínima:** tres funciones — directorio de usuarios, métricas agregadas, *kill switch* del chatbot —, sin analítica invasiva.
5. **Gestión de cuenta:** registrar, iniciar/cerrar sesión, reiniciar la caracterización (irreversible), revocar la personalización (reversible, no punitivo) y eliminar la cuenta con borrado en cascada.

## Qué NO hace (por diseño, no por estar pendiente)
- No diagnostica, no hace terapia, no gestiona urgencias en autonomía.
- **No persiste el chat.** No maneja menores. No usa sensórica, NMA, federación, dashboards ni triaje S0-S5 completo.
- **Está construido y en línea** en `https://alan-aura-academico.vercel.app`, sobre un servidor sin servidor dedicado en AWS: ver «Dónde estamos».

## Stack decidido (a re-verificar antes del release)
**Interfaz:** React 19 + Vite + TypeScript, con Tailwind CSS v4 y shadcn/ui sobre Base UI, desplegada en **Vercel**. **Backend:** sin servidor — AWS Lambda (Node 22 / TypeScript) tras API Gateway, **DynamoDB** como base operativa y **S3** para configuración versionada, activos y respaldos. **Autenticación propia** (Argon2id + sesión en cookie firmada). **Motor conversacional:** Groq API (`gpt-oss-20b`), sin cambios. **Control de versiones:** GitHub. Español (Colombia).

Detalle, alternativas y condiciones de reversa en **`ADR-002`**, que supera a `ADR-001-D1/D2/D5` (Django · SQLite · PythonAnywhere). Ninguna condición de reversa declarada disparó el cambio: fue decisión del equipo (SD-29). El **diseño físico** se escribió en `ARQ-01` (`SD-50`) y está implementado: 4 tablas DynamoDB, 13 rutas REST servidas por 14 métodos, un bucket S3 e infraestructura como código en TypeScript (`ADR-005`).

~~**Hallazgo abierto que este cambio introdujo (`PER-H5`, canon):**~~ ✅ **CERRADO en `ADR-003`** (SD-33): el MVP **no respalda** el almacén de datos personales, así que el segundo lugar donde vivía el dato deja de existir y la cascada de `PER-T1` vuelve a ser completa. Precio declarado: perder ese almacén es irrecuperable. **Texto original del hallazgo:** el respaldo de la base de datos vive en S3 y **escapa al borrado en cascada** — hasta que se cierre en `ARQ-01`, «eliminar la cuenta» no borra el respaldo. Detalle en `PER-01` §8.

## Canon heredado (innegociable)
No sobre-claim clínico · minimización (cápsula, no historial) · consentimiento granular y revocable (dos capas) · uso no punitivo · divulgación mínima · seguridad emocional > engagement · no persistencia del chat · solo adultos con *disclosure*.

## Dónde estamos (detalle en `ESTADO_PIPELINE.md`)
Fases 1, 2 y 3 **cerradas**; la 4 en curso, a falta de la entrega académica. En la Fase 2 se produjeron el modelo de dominio (`MD-01`, 16 clases), el diagrama de casos de uso (`DCU-01`, 14 casos de uso), las 14 especificaciones (`ECU-00…14`), los 14 diagramas de robustez (`DR-00…14`), la compuerta `RPD-01`, los 14 **diagramas de secuencia** (`DS-00…14`, 283 mensajes, 193 operaciones, 181 casos de prueba), el **modelo de clases de diseño** (`MC-00`/`MC-01`/`COD-01`, SD-32) —**43 clases**, **201 operaciones**, 51 atributos, 11 enumerados, 80 relaciones— y el **CDR** (`CDR-01`, SD-37), la compuerta entre el diseño detallado y el código.

**El CDR cerró con veredicto `Aceptado con verificación de retrabajo`**, determinado por el líder el 2026-08-05 con **cero Críticos y cero Mayores**, tras cinco verificaciones independientes (`SD-40`…`SD-47`), todas con encuadre adversarial y todas ejecutadas por un modelo distinto del que aplicó el retrabajo. Su primera pasada había encontrado 13 hallazgos con dos Mayores, y 20 con tres al ampliar a cobertura total: el veredicto empeoró por revisar más, no porque el diseño empeorara. La saga completa —tres verificaciones que refutaron su propia corrección, el freno de Wiegers, y la convención de desenlaces de `SD-44`— está en `CDR-01 v2.0`.

**Ninguna capa queda declarada sin ejecutar.** La de infraestructura, que era la última, se diseñó en `ARQ-01` y se implementó en la fase 3. El render del `.svg` de `MC-01` y las demás se cerraron en `SD-39`.

**Fase 3: construido y desplegado** entre el 5 y el 6 de agosto de 2026. Servidor con **14 handlers** sobre las **13 rutas REST** de `ARQ-01-D3`, 4 tablas DynamoDB y un bucket S3, con la infraestructura escrita en TypeScript. Cliente con las **16 pantallas** de `DIS-00` y **38 pruebas**. Entre ambos, un contrato compartido de **68 tipos** que ambos importan en vez de declarar por su cuenta: si el documento y el paquete discrepan, manda el paquete, porque al paquete lo comprueba el compilador.

**Lo más útil que dejó la construcción son seis defectos que el diseño no podía ver**, todos cerrados: el presupuesto de *tokens* se agotaba razonando y devolvía respuestas vacías; el historial se capó a 4 mensajes en vez de a 4 intercambios —que son 8 mensajes—; un `429` estaba declarado y nunca se emitía; reiniciar el perfil dejaba estado inconsistente; un valor inválido daba `502` donde el contrato pedía `400`; y faltaba una ruta que `P-16` necesitaba. Ninguno era detectable leyendo artefactos, pese a dos compuertas y cinco verificaciones. Están en `INF-01 §9.5`.

## Qué queda abierto

**Cuatro pendientes abiertos, todos declarados, en `ESTADO_PIPELINE.md §Pendientes declarados`** — la
tabla dice quién cierra cada uno y qué bloquea. **Ninguno bloquea nada**: dos son propagaciones
documentales, uno es la revisión de nivel 6 que el usuario tiene abierta desde la Fase 1, y uno una
sobrepromesa viva en `VIS-01`. Lo que falta para terminar es la **entrega académica** y la evaluación formal de `RC-08`.
Los otros ocho son diseño físico (`ARQ-01`), construcción, propagación documental o validación del
usuario, y ninguno tiene plazo material. Dos más merecen saberse de memoria:

- ~~**`PER-H2`**~~ ✅ **cerrado en SD-35** (`ADR-004`): la supresión es física e inmediata. **Ya ningún pendiente roza un requisito vigente: `RF-24` se cumple.** Texto original: la ventana de «+30 días» del plan
  §4.14 impide que **`RF-24` se cumpla de forma inmediata**. Se cierra junto con `V6-b`, la frontera
  legal, que es quien decide si esa ventana es siquiera admisible.
  *(Hasta SD-33 este puesto lo ocupaba `PER-H5` —el respaldo escapaba al borrado en cascada—, y era
  peor: rompía el requisito de extremo a extremo. `ADR-003` lo cerró quitando el respaldo.)*
- ~~**`COD-01`**~~ ✅ **cerrado en SD-32** y ampliado en `SD-39` con la capa de tipos de transferencia:
  **43 clases en 6 capas**, con firma completa. Era una espera con motivo —su columna de firma exigía
  tipos, y los tipos los fija el diagrama de clases—, y ya no espera nada.

## De dónde salió el alcance
De un **plan generado con Codex** (auditado en `../../00_AUDITORIA_PLAN_CODEX.md`) y, **como cita histórica de procedencia** de la fase documental previa a la extracción (SD-18), del corpus del macroproyecto Smart-AID (Release 0.1/0.2, doc 8 plan metodológico, arquitectura LLM D22, personajes/onboarding). Esos artefactos **no están en este repositorio** y no se consultan de forma viva: el subproyecto ya es autosuficiente.

## Mapa rápido
`01_vision/` visión y decisiones · `02_modelos_verbales/` MV + contrato · `03_requisitos/` RF-RNF-calidad-reglas, privacidad, seguridad, persistencia · `04_trazabilidad/` norma y trazabilidad · `05_plan/` cronograma · `06_dominio/` modelo de dominio (`MD-01`) · `07_casos_uso/` diagrama de casos de uso (`DCU-01`), especificaciones (`ECU-00…14`), robustez (`DR-00…14`), la compuerta `RPD-01` · `08_diseno/` inventario de pantallas, sistema de diseño y mockups · `09_informe/` informe académico `INF-01`, en Markdown versionado · `10_arquitectura/` diseño físico `ARQ-01` y contrato de la interfaz de programación. El código construido vive fuera de `docs/`, en `backend/`, `frontend/` y `packages/contrato-api/`. Índice completo en `INDICE_MAESTRO.md`.

## Grafo de conocimiento (navegación, no entregable)
`grafo/` (SD-27) es un mapa de relaciones sobre los documentos de `docs/` + el corpus de conocimiento (libros y normas) — 2.876 nodos a la fecha de su construcción (2026-07-25), consultable por terminal (`graphify query/explain/path`) o visualmente en Obsidian (`grafo/vault/`). **No se ha regenerado desde entonces**: no refleja los artefactos de la fase 2 ni de `PDR-01`/`RPD-01`. No sustituye a `docs/` ni se edita a mano. Instructivo completo: `GUIA_USO_GRAFO_Y_VAULT.md` (raíz).
