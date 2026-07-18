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
- **Fase 2 (ICONIX) — en curso:** producidos el modelo de dominio (`MD-01`), el diagrama de casos de uso (`DCU-01`) y la especificación textual de casos de uso (`ECU-00…ECU-10`).
- **No adelantar** análisis de robustez, secuencias, diseño de clases ni código: quedan planificados. **Siguiente artefacto ICONIX: el análisis de robustez.**
