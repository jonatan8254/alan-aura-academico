# AGENTS.md — Subproyecto «Alan & Aura Académico» (superset del CLAUDE.md local)

> Canon operativo para **cualquier** agente que trabaje en este repositorio (Claude, Codex, subagentes). Es el _superset_ del `CLAUDE.md` local: todo lo de allí aplica, y aquí se añade lo que Codex/otros necesitan. **Se origina** en el canon del macroproyecto Smart-AID (repositorio GitHub separado, no incluido aquí); tras la extracción (SD-18), estas reglas son **autosuficientes** en este repositorio.

## §0 — Independencia del macroproyecto (regla de oro, innegociable)
- Este repositorio es **independiente**: nació como subcarpeta aislada del repositorio profesional Smart-AID/TalentTrack y fue extraído aquí (SD-18, 2026-07-12). No debe depender de rutas, archivos ni servicios de aquel repositorio para funcionar, construirse o desplegarse.
- Toda mención a `auditoria_fable5/`, docs numerados, `graphify-out/`, `vault_obsidian/` u otros artefactos del macro es **cita de procedencia** (de la fase documental previa a la extracción) — esos archivos **no existen en este repositorio** y no son navegables desde aquí.
- Check de independencia: cero imports, cero rutas absolutas ni relativas hacia fuera de este repositorio.

## §1 — Modelo de razonamiento (sin default)
- No hay modelo de razonamiento predeterminado. Lo elige el usuario por sesión/mensaje con su nivel de esfuerzo. Ningún agente ni config lo fija, asume o cambia.
- El modelo activo es el orquestador responsable final. Los subagentes son apoyo mecánico; su salida se audita antes de incorporarse.

## §2 — Preservación
- El macroproyecto Smart-AID (repositorio separado) no se modifica desde aquí — no hay forma técnica de hacerlo, y aunque se tenga acceso a él por otra vía, ningún agente de este repositorio lo edita.
- No versionar contenido con © de terceros; se cita en APA/puntual, no se reproduce.

## §3 — Identidad y nomenclatura
- Hijo académico de Smart-AID (materia *Diseño y Construcción de Productos de Software*, UNAL Medellín, Grupo 5). Ideador/líder: Jonatan Estiven Sánchez Vargas. Equipo: Santiago Bedoya García, Luis Fernando Montoya Rodríguez, Santiago Eusse Gil.
- **Alan** (masculino; alias históricos Alanus ≡ Alanor) y **Aura** (femenino; precursor Pandora) en todo artefacto nuevo. No corregir grafías en originales; citar la grafía original al referenciar.

- **Autoría de los commits — innegociable.** Los firma **el equipo humano de §3 y nadie más**. **Nunca** un trailer `Co-Authored-By` de herramienta, asistente o modelo, en ningún commit. La hace cumplir `.githooks/commit-msg`, que retira esa línea antes de que el commit exista; se activa con `git config core.hooksPath .githooks`. Decisión `SD-38` *(registrada originalmente como `SD-32`, renumerada al detectarse que ese ID lo ocupaban dos decisiones distintas)*.

## §4 — Canon de dominio
No diagnóstico / no terapia / no urgencias en autonomía · minimización (cápsula de perfil, no historial bruto) · consentimiento granular revocable · uso no punitivo · divulgación mínima · seguridad emocional > engagement · **no persistencia del chat** (MVP académico) · **solo adultos** con *disclosure* · menores fuera de alcance.

## §5 — Estándar documental
Ficha (ID/Insumos/Consumidores/Hogar/Estado/Changelog/DoD) · marcas de evidencia (Evidencia [E1] … Propuesta [P5], §4.5) · honestidad (§4.9) · E8 (11 rasgos + checklist) · IDs `RF/RNF/RC/RN` con guion único · 25010:2023 + safety + GQM con umbral · reglas tipadas Wiegers · cero huérfanos · trinquete (no degradar).

## §6 — Subagentes (disciplina de delegación)
- El orquestador conserva el juicio; delega a subagentes solo tareas **mecánicas** (rastreos, borradores de tablas, código repetitivo). Toda salida de subagente se **audita** contra la fuente antes de incorporarse.
- Ningún subagente amplía el alcance ni aprueba su propio trabajo. Los agentes Codex `Sol`/`Terra`/`Luna` conservan su definición si se reintroduce `.codex/` en este repositorio.

## §7 — Procedencia documental (histórica)
Los artefactos de la Fase 1 (documental) se construyeron consultando `auditoria_fable5/02_auditoria/` del macroproyecto Smart-AID (repositorio separado, solo durante esa fase, ya cerrada). Esa fuente **no está presente** en este repositorio; el detalle de qué se consultó y con qué nivel de verificación vive en `docs/00_gobernanza/MANIFIESTO_FUENTES.md`.

## §8 — Alcance del pipeline (estado)
- **Fase 1 (pre-ICONIX) — cerrada:** visión, ADR, MV, RF/RNF, calidad, reglas, privacidad, seguridad, norma, trazabilidad, plan.
- **Fase 2 (ICONIX) — completa salvo la compuerta:** producidos el modelo de dominio (`MD-01`), el diagrama de casos de uso (`DCU-01`), la especificación textual (`ECU-00…ECU-14`), el análisis de robustez (`DR-00…DR-14`), la compuerta `RPD-01`, los **diagramas de secuencia** (`DS-00…DS-14`, SD-30) con el delta de 192 operaciones (`DOP-01`) y 181 casos de prueba, y el **modelo de clases de diseño** (`MC-00`/`MC-01`/`COD-01`, SD-32): **37 clases** —16 del problema con nombre idéntico a `MD-01` y **21 del espacio de la solución**—, **200 operaciones**, 35 atributos y 11 enumerados.
- **Arquitectura técnica decidida (`ADR-002`, SD-29):** React + Vite + TypeScript sobre **Vercel**; backend sin servidor en AWS (**Lambda** tras **API Gateway**, **DynamoDB**, **S3**); Tailwind v4 + shadcn/ui; autenticación propia; **Groq se mantiene**. Supera a `ADR-001-D1/D2/D5`. Las cifras que se repiten entre artefactos viven en `docs/00_gobernanza/HECHOS_CANONICOS.md` y las verifica `scripts/verificar_coherencia.py`.
- **No adelantar** el **diseño físico** —claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM—: es `ARQ-01` y va **después del CDR**. Tampoco código. **El CDR ya se ejecutó y su retrabajo ya se aplicó** (`CDR-01 v1.2`, `SD-39`). **Siguiente hito: la verificación independiente de ese retrabajo**, que **no la hace quien lo aplicó** — se emite `CDR-01 v1.3` y de ahí sale el veredicto. Hasta entonces sigue en `Reinspección requerida`.
- **Decisión ya tomada y registrada, no una instrucción pendiente:** la **capa de infraestructura no se ejecutó** ni en secuencia (`E-1` de `DS-00`) ni en el modelo de clases (`E-1` de `MC-00`): sin participantes `INF_`, sin repositorios, sin DAO, sin sesión como clase. El mecanismo va a `ARQ-01`, **tras el CDR**. La segunda capa que `MC-01` declaraba no ejecutada —el **render del `.svg`**— quedó **cerrada en `SD-39`**: está generado **y mirado** (`MC-00 §4.2`). Queda una sola, `E-1`.
- **Pendientes: viven todos en `docs/00_gobernanza/ESTADO_PIPELINE.md §Pendientes declarados`**, con quién los cierra y qué bloquean. **Quedan nueve abiertos y ninguno rompe un requisito vigente** — la tabla tiene además tres filas *declaradas sin acción inmediata* (16, 17 y 18), que no cuentan como trabajo abierto. **El más importante de los nueve es el 15: la verificación independiente del retrabajo del CDR**, que es lo único que separa al proyecto del paso a código. Cerrados los tres que sí: **`PER-H5`** (`ADR-003`, SD-33), **`PER-H2`** (`ADR-004-D1`, SD-35) y **`COD-01`** (SD-32). Con ellos **`RF-24` pasa a cumplirse**, según el diseño — la inmediatez se verifica en fase 4 (`TRZ-01 §2`).

## §9 — Grafo de conocimiento y vault de Obsidian (`grafo/`)
- **`grafo/`** (SD-27, 2026-07-25): capa de navegación derivada de `docs/` + corpus de conocimiento (2.876 nodos: 262 del subproyecto + 2.614 de conocimiento). **No es un entregable de fase** y **no se edita a mano** — ni `graph_subproyecto_final.json` ni las notas de `grafo/vault/`. Correcciones van en `docs/`; el grafo se regenera con `grafo/scripts/` (ver tabla de re-ejecutabilidad en `grafo/README.md`).
- **Referencia canónica: `GUIA_USO_GRAFO_Y_VAULT.md`** (raíz) — consulta por terminal, estructura del vault, licencia del corpus de conocimiento (excluido de git), trampas de `graphify` verificadas.
- **Prohibido para cualquier agente:** `graphify extract`/`update`/`cluster-only`/`merge-graphs` sobre el grafo vigente fuera de un trabajo deliberado y explícitamente pedido — cuesta cuota y puede re-clusterizar comunidades ya nombradas (ver GUIA §7).
