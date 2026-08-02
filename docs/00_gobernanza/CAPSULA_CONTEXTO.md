# Cápsula de contexto — Subproyecto «Alan & Aura Académico»
**Objetivo:** entender el subproyecto en 5 minutos. **Naturaleza:** síntesis operativa (no normativa). **Fecha de creación:** 2026-07-12 · **Última actualización:** 2026-08-01 (`ADR-002`: reversión del stack a React + Vercel + AWS serverless, SD-29).

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
- No tiene código ni pilotos todavía: la fase 2 (análisis y diseño ICONIX) está en curso: ver «Dónde estamos».

## Stack decidido (a re-verificar antes del release)
**Interfaz:** React 19 + Vite + TypeScript, con Tailwind CSS v4 y shadcn/ui sobre Base UI, desplegada en **Vercel**. **Backend:** sin servidor — AWS Lambda (Node 22 / TypeScript) tras API Gateway, **DynamoDB** como base operativa y **S3** para configuración versionada, activos y respaldos. **Autenticación propia** (Argon2id + sesión en cookie firmada). **Motor conversacional:** Groq API (`gpt-oss-20b`), sin cambios. **Control de versiones:** GitHub. Español (Colombia).

Detalle, alternativas y condiciones de reversa en **`ADR-002`**, que supera a `ADR-001-D1/D2/D5` (Django · SQLite · PythonAnywhere). Ninguna condición de reversa declarada disparó el cambio: fue decisión del equipo (SD-29). El **diseño físico** —claves de DynamoDB, tabla de *endpoints*, inventario de S3— sigue diferido a `ARQ-01`, **posterior al diagrama de clases y su CDR**.

**Hallazgo abierto que este cambio introdujo (`PER-H5`, canon):** el respaldo de la base de datos vive en S3 y **escapa al borrado en cascada** — hasta que se cierre en `ARQ-01`, «eliminar la cuenta» no borra el respaldo. Detalle en `PER-01` §8.

## Canon heredado (innegociable)
No sobre-claim clínico · minimización (cápsula, no historial) · consentimiento granular y revocable (dos capas) · uso no punitivo · divulgación mínima · seguridad emocional > engagement · no persistencia del chat · solo adultos con *disclosure*.

## Dónde estamos (detalle en `ESTADO_PIPELINE.md`)
Fase 2 ICONIX **avanzada**: producidos el modelo de dominio (`MD-01 v1.6`, 16 clases), el diagrama de casos de uso (`DCU-01 v2.2`, 14 casos de uso), las 14 especificaciones textuales (`ECU-00…14`), los 14 diagramas de robustez (`DR-00…14`, 262 elementos) y los **14 diagramas de secuencia** (`DS-00…14`, SD-30): **282 mensajes** en 0 errores, el delta de **192 operaciones** (`DOP-01`), **181 casos de prueba** derivados de los 150 controladores (`CP-00…14`) y la matriz `TRZ-DS-01`. El conjunto pasó una **primera pasada de correcciones** (`PDR-01`, motivada por retroalimentación docente) y la **compuerta ICONIX** entre análisis y diseño detallado (`RPD-01`, veredicto: *Aceptado con verificación de retrabajo*). Los **cinco** validadores del pipeline están en 0 errores. Siguiente artefacto: **el diagrama de clases de diseño**, y tras él el **CDR**.

## Qué queda abierto

**Once pendientes, todos declarados, en `ESTADO_PIPELINE.md §Pendientes declarados`** — la tabla
dice quién cierra cada uno y qué bloquea. Dos merecen saberse de memoria:

- **`PER-H5`** es el único que **rompe un requisito vigente**: el respaldo en S3 escapa al borrado
  en cascada, así que **`RF-24` no se cumple de extremo a extremo**. Se cierra en `ARQ-01`, y su
  plazo no es de calendario sino material: **antes de que haya personas reales**.
- **`COD-01`** no rompe nada. Es una espera con motivo: su columna de firma exige tipos, y los tipos
  los fija el diagrama de clases.

## De dónde salió el alcance
De un **plan generado con Codex** (auditado en `../../00_AUDITORIA_PLAN_CODEX.md`) y, **como cita histórica de procedencia** de la fase documental previa a la extracción (SD-18), del corpus del macroproyecto Smart-AID (Release 0.1/0.2, doc 8 plan metodológico, arquitectura LLM D22, personajes/onboarding). Esos artefactos **no están en este repositorio** y no se consultan de forma viva: el subproyecto ya es autosuficiente.

## Mapa rápido
`01_vision/` visión y decisiones · `02_modelos_verbales/` MV + contrato · `03_requisitos/` RF-RNF-calidad-reglas, privacidad, seguridad, persistencia · `04_trazabilidad/` norma y trazabilidad · `05_plan/` cronograma · `06_dominio/` modelo de dominio (`MD-01`) · `07_casos_uso/` diagrama de casos de uso (`DCU-01`), especificaciones (`ECU-00…14`), robustez (`DR-00…14`), la compuerta `RPD-01` · `08_diseno/` inventario de pantallas, sistema de diseño y mockups · `09_informe/` informe académico (pendiente de refrescar a este estado). Índice completo en `INDICE_MAESTRO.md`.

## Grafo de conocimiento (navegación, no entregable)
`grafo/` (SD-27) es un mapa de relaciones sobre los documentos de `docs/` + el corpus de conocimiento (libros y normas) — 2.876 nodos a la fecha de su construcción (2026-07-25), consultable por terminal (`graphify query/explain/path`) o visualmente en Obsidian (`grafo/vault/`). **No se ha regenerado desde entonces**: no refleja los artefactos de la fase 2 ni de `PDR-01`/`RPD-01`. No sustituye a `docs/` ni se edita a mano. Instructivo completo: `GUIA_USO_GRAFO_Y_VAULT.md` (raíz).
