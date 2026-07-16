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
- Subproyecto académico hijo de Smart-AID (materia *Diseño y Construcción de Productos de Software*, UNAL Medellín, Grupo 20). Ideador y líder: **Jonatan Estiven Sánchez Vargas**.
- Personaje masculino = **Alan** en todo artefacto nuevo (alias históricos del macro: Alanus ≡ Alanor ≡ Alan). Femenino = **Aura** (precursor conceptual: Pandora). Nunca "corregir" grafías de los originales; solo citar la grafía original al referir un archivo existente.

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
- **Fase 2 (ICONIX) — en curso:** producidos el **modelo de dominio** (`MD-01`), el **diagrama de casos de uso** (`DCU-01`) y la **especificación textual de los casos de uso** (`ECU-00…ECU-10`).
- **Fuera de alcance por ahora (no adelantar):** análisis de robustez, secuencias, diseño de clases y código. Quedan planificados, no producidos. **Siguiente artefacto ICONIX: el análisis de robustez.**
