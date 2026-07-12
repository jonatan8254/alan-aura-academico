# Cápsula de contexto — Subproyecto «Alan & Aura Académico»
**Objetivo:** entender el subproyecto en 5 minutos. **Naturaleza:** síntesis operativa (no normativa). **Fecha:** 2026-07-12.

---

## En una frase
Un **MVP conversacional de apoyo emocional** con los personajes **Alan** (activación) y **Aura** (calma), **realizable en ~1 mes**, que **simplifica** las Releases 0.1 + 0.2 de Smart-AID para la materia *Diseño y Construcción de Productos de Software*, **sin traicionar** el canon de seguridad del macroproyecto.

## Doble horizonte
- **Académico (esto):** lo mínimo entregable y demostrable en un curso. Recorta módulos, no principios.
- **Producto (macro):** Smart-AID / TalentTrack completo (raíz del repo). **Solo se consulta**; el subproyecto **no lo modifica**.

## Qué hace el MVP (rebanada vertical)
1. **Onboarding emocional simplificado:** consentimiento + *disclosure* de IA (adultos), unos pocos datos de perfil, presentación de Alan y Aura, y armado de una **cápsula de perfil mínima**.
2. **Conversación Alan/Aura v1:** chat con un LLM gobernado; la cápsula (no el historial bruto) alimenta el modelo; el usuario elige/percibe personalidad.
3. **Gate de seguridad binario:** ante señales de **peligro explícito**, la personalidad se subordina a un **fallback determinista** (mensaje de contención + derivación a recursos configurables). No es detección clínica ni exhaustiva; se declara con honestidad.
4. **Administración mínima:** configuración operativa (recursos de ayuda por entorno, textos de consentimiento), sin analítica invasiva.

## Qué NO hace (esta fase)
- No diagnostica, no hace terapia, no gestiona urgencias en autonomía.
- **No persiste el chat.** No maneja menores. No usa sensórica, NMA, federación, dashboards ni triaje S0-S5 completo.
- No produce (todavía) casos de uso, dominio, robustez, secuencias ni código: **quedan planificados**, no hechos.

## Stack decidido en el plan (a re-verificar antes del release)
Django 5.2 LTS · SQLite · Groq API (`gpt-oss-20b`) · GitHub · despliegue PythonAnywhere Free (Render como contingencia). Español (Colombia). Detalle y condiciones de reversa en `ADR-001`.

## Canon heredado (innegociable)
No sobre-claim clínico · minimización (cápsula, no historial) · consentimiento revocable · uso no punitivo · divulgación mínima · seguridad emocional > engagement · no persistencia del chat · solo adultos con *disclosure*.

## De dónde salió el alcance
De un **plan generado con Codex** (auditado en `../../00_AUDITORIA_PLAN_CODEX.md`) y del corpus del macro (Release 0.1/0.2, doc 8 plan metodológico; arquitectura LLM D22; personajes/onboarding docs del corpus). El subproyecto **ratifica** el plan y lo **formaliza** con el estándar documental de la auditoría Fable 5.

## Mapa rápido
`01_vision/` visión y decisiones · `02_modelos_verbales/` MV + contrato · `03_requisitos/` RF-RNF-calidad-reglas, privacidad, seguridad · `04_trazabilidad/` norma y trazabilidad · `05_plan/` cronograma. Índice completo en `INDICE_MAESTRO.md`.
