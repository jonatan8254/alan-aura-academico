# Manifiesto de fuentes — Alan & Aura Académico
**Propósito:** dejar constancia de **qué del macroproyecto Smart-AID se consultó** durante la Fase 1 (documental, previa a la extracción de este repositorio) para construir estos artefactos, con qué nivel de verificación. Rasgo E8-1 (parentesco documental). **Fecha:** 2026-07-12.
**Nota de repositorio extraído (SD-18):** el macroproyecto Smart-AID vive en un **repositorio GitHub separado**, no incluido aquí. Toda ruta de este documento sin enlace (`auditoria_fable5/...`, `DATOS_Y_FUENTES.md`, docs numerados) es una **cita de procedencia histórica**, no un archivo presente en este repositorio.

---

## 1. Regla de procedencia
- El macroproyecto fue **fuente canónica de consulta** durante la Fase 1; nunca se modificó.
- Fuente primaria del corpus del proyecto: los **entregables auditados** de `auditoria_fable5/02_auditoria/` (macroproyecto, repositorio separado) — más autoritativos que su grafo de conocimiento.
- Contenido con derechos de autor de terceros (normas ISO, libros): se citó, no se reprodujo (bibliografía completa en `DATOS_Y_FUENTES.md` del macroproyecto).

## 2. Fuentes del macro consultadas (todas solo lectura)

| Fuente (macro, repositorio separado) | Qué aportó al subproyecto | Nivel |
|---|---|---|
| `auditoria_fable5/02_auditoria/E8_estandar_modelo_verbal.md` | Los 17 rasgos del estándar de modelo verbal; se adopta el subconjunto de 11 (SD-04). | [V-cláusula] leído íntegro |
| `auditoria_fable5/02_auditoria/D6bis_matriz_puente_normativo.md` | Cláusulas ISO **ya verificadas** (25010:2023 §4.1, §3.4, §3.9 y sub-safety §3.9.1–.5) reusadas en NORM-01. | [V-cláusula] leído íntegro |
| `auditoria_fable5/02_auditoria/E3_protocolo_seguridad_triaje.md` | Escala S0-S5 y protocolo del macro; se mapea como **procedencia** del gate binario (SEG-01). | citado (estructura conocida) |
| `auditoria_fable5/02_auditoria/E4_contrato_conversacional.md` | Estructura del contrato de personajes ([C]/[P], criterios de aceptación); se simplifica para el MVP. | citado (estructura conocida) |
| Doc 8 — plan metodológico v1.1 (corpus) | Ancla de Releases 0.1 (onboarding + santuario) y 0.2 (chat LLM); alcance MVP. | citado |
| Doc 22 (D22) — arquitectura LLM v2.0 doctoral (corpus) | Gobierno de la Release 0.2: fallback determinista de crisis, minimización (cápsula), *fail-closed*. | citado |
| Doc 16 — vPRO v1.0 (corpus) | Antecedente científico de D22 (revisión de literatura). | citado |
| Docs de personajes/onboarding (corpus) | Identidad Alan (activación) / Aura (calma), presentación y consentimiento. | citado |
| `CLAUDE.md` / `AGENTS.md` del macro | Canon de dominio, nomenclatura, reglas de preservación y de modelo sin default. | heredado (adaptado en este repo) |
| Plan generado con Codex (insumo externo del usuario) | Delimitación de alcance y stack del MVP; texto completo archivado en `00_PLAN_CODEX_ORIGINAL.md` (verbatim, raíz de este repo); auditado en `00_AUDITORIA_PLAN_CODEX.md`. | insumo, verbatim archivado |

## 3. Normas y libros (citados, no reproducidos)
- **ISO/IEC 25010:2023** — modelo de calidad de producto; cláusulas concretas reusadas vía D6-bis (§4.1 nueve características; §3.4 *interaction capability*; §3.9 *safety* y sub-características .1–.5). Ver NORM-01.
- **Wiegers & Beatty / Wiegers & Hokanson** — taxonomía de reglas de negocio y atributos de requisito (usados en REQ-01).
- **Basili (GQM)** — estructura meta→pregunta→métrica→umbral (requisitos de calidad).
- **Ley 1581/2012 + Decreto 1377/2013 (Colombia)** — marco de datos personales (PRIV-01); validación de frontera legal = nivel 6 (pendiente, no resuelta aquí).

Referencia bibliográfica completa (APA): `DATOS_Y_FUENTES.md` del macroproyecto Smart-AID (repositorio separado, no incluida aquí).

## 4. Garantía de aislamiento (histórica, Fase 1)
Ninguna de las fuentes anteriores fue modificada. Durante la fase documental, todo cambio ocurrió **exclusivamente** bajo la carpeta `subproyecto_academico_alan_aura/` del repositorio del macroproyecto. Este repositorio es el resultado de esa extracción (SD-18); ya no depende de aquel árbol de archivos.
