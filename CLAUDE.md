# CLAUDE.md — Subproyecto «Alan & Aura Académico»

> **Espejo:** el canon operativo de este bloque está reproducido como _superset_ en `AGENTS.md` (para Codex y agentes que no leen CLAUDE.md). Cambios aquí ⇒ actualizar también `AGENTS.md`. Este archivo **se origina** en las reglas del macroproyecto Smart-AID (repositorio GitHub separado, no incluido aquí) y añade las de independencia; tras la extracción (SD-18), son autosuficientes.

## 0. Regla de oro (independencia — innegociable)
- **Este es un repositorio independiente**, extraído del macroproyecto profesional Smart-AID/TalentTrack (repositorio separado) el 2026-07-12 (SD-18).
- **No depende del macroproyecto.** No hay rutas, imports ni referencias funcionales hacia docs 1–22, `auditoria_fable5/`, `libros_y_normas_markdown/`, `graphify-out/`, `vault_obsidian/` — esos artefactos **no están en este repositorio**; toda mención a ellos es cita de procedencia de la fase documental previa.
- **Check de independencia:** este repositorio debe poder clonarse, construirse y desplegarse sin acceso al repositorio del macroproyecto.

## 1. Modelo de razonamiento (orquestador) — sin default fijo
- **No hay modelo de razonamiento predeterminado.** Lo selecciona el usuario por sesión/mensaje desde su panel o `/model` (Fable 5 / Opus 4.8 / Sonnet 5…), junto con su nivel de esfuerzo. Ningún agente ni archivo de configuración debe fijarlo, asumirlo ni cambiarlo automáticamente.
- El modelo activo en cada momento es el **cerebro/orquestador**: razona, decide, verifica y es el responsable final. Los subagentes son apoyo para tareas mecánicas; su salida **siempre se audita** antes de incorporarse — nunca se les delega el juicio final.

## 2. Identidad y nomenclatura
- Subproyecto académico hijo de Smart-AID (materia *Diseño y Construcción de Productos de Software*, UNAL Medellín, Grupo 5). Ideador y líder: **Jonatan Estiven Sánchez Vargas**. Equipo: **Santiago Bedoya García**, **Luis Fernando Montoya Rodríguez**, **Santiago Eusse Gil**.
- Personaje masculino = **Alan** en todo artefacto nuevo (alias históricos del macro: Alanus ≡ Alanor ≡ Alan). Femenino = **Aura** (precursor conceptual: Pandora). Nunca "corregir" grafías de los originales; solo citar la grafía original al referir un archivo existente.

- **Autoría de los commits — innegociable.** Los commits los firma **el equipo humano de §2 y nadie más**. **Nunca** se añade un trailer `Co-Authored-By` de una herramienta, un asistente ni un modelo, en ningún commit, por ninguna razón. La hace cumplir un *hook* versionado, `.githooks/commit-msg`, que retira esa línea **antes de que el commit exista** — actívalo en cada clon con `git config core.hooksPath .githooks`. Decisión `SD-32`.

## 3. Canon de dominio (mínimo al escribir cualquier artefacto)
- No sobre-claim clínico (no diagnostica, no hace terapia, no maneja urgencias en autonomía).
- Minimización (el LLM recibe la cápsula de perfil mínima, nunca historial bruto/ítems/diario/biomarcadores crudos); consentimiento granular revocable; uso no punitivo; divulgación mínima; **seguridad emocional > engagement**.
- **No persistencia del chat** en el MVP académico. **Solo adultos** con *disclosure*; **menores fuera de alcance**.

## 4. Estándar documental (heredado de la auditoría Fable 5 del macroproyecto, aplicado aquí)
- Cada artefacto lleva ficha de encabezado (**ID / Insumos / Consumidores / Hogar / Estado / Changelog / DoD**), **marcas de evidencia** (Evidencia [E1] · Interpretación [I2] · … · Propuesta [P5], escala del protocolo §4.5) y **regla de honestidad** (§4.9: no marcar como verificado lo que no se abrió/probó).
- Modelo verbal → **E8** (subconjunto de 11 rasgos con checklist verificable al final). Requisitos → convención de IDs `RF/RNF/RC/RN/CU/PR/MET` con **guion único** (`RF-01`). Calidad → **25010:2023** (incl. *safety* §3.9) + **GQM** con **umbral obligatorio**. Reglas → taxonomía Wiegers. **Cero requisitos huérfanos** en trazabilidad. **Trinquete:** no degradar lo ya construido.

## 5. Procedencia documental (histórica) y derechos de terceros
- Fuente primaria del corpus del proyecto durante la Fase 1 (ya cerrada): los entregables auditados de `auditoria_fable5/02_auditoria/` del macroproyecto Smart-AID (repositorio separado, no incluido aquí). Detalle de qué se consultó en `docs/00_gobernanza/MANIFIESTO_FUENTES.md`.
- No versionar ni copiar contenido con derechos de autor de terceros (normas ISO, libros): se **cita**, no se reproduce.

## 6. Alcance del pipeline (estado actual)
- **Fase 1 (documental) — cerrada:** visión, ADR, modelos verbales, RF/RNF, requisitos de calidad, reglas de negocio, privacidad, protocolo de seguridad, puente normativo, trazabilidad, plan de proyecto.
- **Fase 2 (ICONIX) — avanzada:** producidos el **modelo de dominio** (`MD-01`), el **diagrama de casos de uso** (`DCU-01`), la **especificación textual** (`ECU-00…ECU-14`), el **análisis de robustez** (`DR-00…DR-14`), la compuerta **`RPD-01`** y los **diagramas de secuencia** (`DS-00…DS-14`, SD-30): 282 mensajes en 0 errores, el delta de **192 operaciones** (`DOP-01`), **181 casos de prueba** derivados de los 150 controladores (`CP-00…CP-14`) y la matriz `TRZ-DS-01`.
- **Arquitectura técnica decidida (`ADR-002`, SD-29):** React + Vite + TypeScript sobre **Vercel**; backend sin servidor en AWS (**Lambda** tras **API Gateway**, **DynamoDB**, **S3**); Tailwind v4 + shadcn/ui; autenticación propia; **Groq se mantiene**. Supera a `ADR-001-D1/D2/D5`. Las cifras que se repiten entre artefactos viven en `docs/00_gobernanza/HECHOS_CANONICOS.md` y las verifica `scripts/verificar_coherencia.py`.
- **Fuera de alcance por ahora (no adelantar):** **el diseño físico** —claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM— es `ARQ-01` y va **después del diagrama de clases y de su CDR**; adelantarlo garantiza retrabajo. Tampoco se escribe código todavía. **Siguiente artefacto ICONIX: el diagrama de clases de diseño**, cuyo insumo (`DOP-01`) ya está listo, y detrás el **CDR** (hito 3).
- **Decisión ya tomada y registrada, no una instrucción pendiente:** en los diagramas de secuencia la **capa de infraestructura de la skill no se ejecutó** — se declaró como tal en `E-1` de `DS-00` y los participantes se derivaron solo de los `DR-XX`, sin `INF_`. El mecanismo va a `ARQ-01`.
- **Pendientes: once, y viven todos en `docs/00_gobernanza/ESTADO_PIPELINE.md §Pendientes declarados`**, con quién los cierra y qué bloquean. El que más pesa es **`PER-H5`**: el respaldo en S3 escapa al borrado en cascada, así que **`RF-24` no se cumple de extremo a extremo**; se cierra en `ARQ-01` y su plazo no es de calendario sino material — **antes de que haya personas reales**.

## 7. Grafo de conocimiento y vault de Obsidian (`grafo/`, navegación — no es un entregable)
- **`grafo/`** (SD-27, 2026-07-25) es una capa de navegación derivada de `docs/` + corpus de conocimiento, **no** un artefacto de la Fase 1/2. **No se edita a mano** (ni el `.json` ni las notas del vault); si algo cambia, se corrige en `docs/` y se regenera con los scripts de `grafo/scripts/`.
- **Guía completa y canónica: `GUIA_USO_GRAFO_Y_VAULT.md`** (raíz) — qué contiene, cómo consultarlo por terminal (`graphify query/explain/path --graph grafo/graph_subproyecto_final.json`), estructura del vault, licencia del corpus de conocimiento (excluido de git, se reconstruye aparte) y trampas conocidas de `graphify`.
- **Prohibido:** `graphify extract`/`update`/`cluster-only`/`merge-graphs` sobre `graph_subproyecto_final.json` fuera de un trabajo deliberado con los scripts existentes — reindexar cuesta cuota y puede destruir el nombrado de comunidades ya hecho.
