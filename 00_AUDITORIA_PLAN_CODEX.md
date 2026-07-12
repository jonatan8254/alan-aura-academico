# 00 — Auditoría breve del plan generado con Codex
**ID:** AUD-CODEX-01 · **Hogar:** `subproyecto_academico_alan_aura/` · **Fecha:** 2026-07-12 · **Estado:** cerrada.
**Insumos:** el plan del subproyecto generado con Codex (insumo del usuario); canon del macroproyecto Smart-AID (`CLAUDE.md` §Dominio, repositorio separado, no incluido aquí); estándar de auditoría Fable 5 (`auditoria_fable5/`, ídem — repositorio separado).
**Consumidores:** VIS-01, ADR-001, MV-01.x, REQ-01, SEG-01 (cada refinamiento se incorpora al artefacto indicado).
**Naturaleza:** auditoría analítico-experta, no empírica. **Marcas de evidencia:** Evidencia [E1] · Interpretación [I2] · Propuesta [P5] (escala del protocolo §4.5). **Honestidad (§4.9):** los hechos sobre servicios externos (Groq, PythonAnywhere, versiones) **no fueron verificados** en esta ejecución; se tratan como decisiones de plan a re-verificar.

---

## 1. Alcance de la auditoría
El usuario pidió una **auditoría breve** del plan que Codex produjo para delimitar el subproyecto académico. No se re-hace el plan: se **ratifica lo sólido** y se **refina lo que debe endurecerse** para alcanzar el estándar documental de la auditoría Fable 5. Cada observación termina indicando **en qué artefacto se resuelve**, de modo que la auditoría no queda como opinión suelta sino como entrada trazable.

## 2. Veredicto
**El plan es apto como base de alcance del MVP académico.** Es una rebanada vertical realizable, canon-compliant y honesta sobre sus límites. Los ajustes que siguen son de **formalización y trazabilidad**, no de rediseño. Ninguna observación invalida el plan; todas lo elevan.

## 3. Fortalezas ratificadas [E1]
1. **Rebanada vertical realista** — onboarding → conversación → gate de seguridad → administración: un flujo end-to-end demostrable en ~1 mes, no una acumulación de módulos inconexos. [E1]
2. **Lista positiva + exclusiones extensas** — el plan dice explícitamente qué NO hace (sensórica, NMA, federación, dashboards, triaje completo, menores), que es la mejor defensa contra el *scope creep* académico. [E1]
3. **Canon-compliant** — respeta no-diagnóstico, no-persistencia del chat, minimización (cápsula de perfil), uso no punitivo, adultos + *disclosure*, y la nomenclatura **Alan**. Coherente con el canon del macro sin que se lo pidieran de forma mecánica. [E1]
4. **Calidad anclada a SQuaRE / 25010:2023 con GQM** — el plan no inventa atributos de calidad: los ancla a la norma vigente y los liga a preguntas medibles, en línea con D6-H1 del macro. [E1]
5. **Fallback determinista de seguridad honesto** — reconoce que el gate no es detección clínica exhaustiva y define una ruta segura por defecto (coherente con §3.9.3 *fail safe* de 25010:2023 vía D6-bis). [E1]
6. **Honestidad sobre servicios gratuitos** — marca los *free tiers* (Groq, PythonAnywhere) y las versiones como hechos a re-verificar, con contingencia (Render). No sobre-afirma disponibilidad. [E1]

## 4. Refinamientos (valor agregado — cada uno se incorpora)

| # | Observación | Marca | Se resuelve en |
|---|---|---|---|
| R1 | El plan nombra un «MV-01 mínimo» pero **no lo ancla a un estándar verificable** (E8). Sin checklist, «modelo verbal» es un rótulo. | [I2] | **MV-01.x** cumple el subconjunto de **11 rasgos de E8** con checklist al final. |
| R2 | Menciona «~15 reglas de negocio» pero **no las enumera ni tipifica**. Reglas sin tipo no son verificables ni trazables. | [I2] | **REQ-01 §Reglas** las enumera y **tipifica** (taxonomía Wiegers: término/hecho/restricción/habilitador/inferencia/cálculo), rasgo E8-15. |
| R3 | Los requisitos de calidad (§ del plan) son correctos pero les falta **GQM pegado + característica *safety* + umbral obligatorio**. Calidad sin umbral no es evaluable (D6-P4). | [I2] | **REQ-01 §Calidad** formaliza cada uno con meta→pregunta→métrica→**umbral** y característica 25010:2023 (incl. §3.9 *safety*). |
| R4 | Hechos externos (Groq `gpt-oss-20b`, PythonAnywhere Free, Django 5.2) el plan los da por buenos. **No los verifiqué**; los servicios y *free tiers* cambian. | [I2] §4.9 | **ADR-001** los lleva como **[N5]/[N6] «decisión de plan, verificar antes del release»** con condiciones de reversa. Consistente con que el plan ya pedía re-verificar. |
| R5 | El **protocolo de seguridad** queda disuelto dentro del flujo del LLM. Un mecanismo de seguridad debe ser **artefacto propio y auditable**, no una nota en el pipeline. | [P5] | **SEG-01** lo aísla: gate binario + fallback determinista, reducción declarada con honestidad y **mapeo de procedencia a la escala S0-S5** del macro (E3). |
| R6 | El plan lista **~16 IDs** de artefactos, riesgo de proliferación para un MVP de 1 mes. | [P5] | Se **consolidan en ~9 artefactos** por afinidad (requisitos juntos, trazabilidad junta). Ver `INDICE_MAESTRO.md`. |
| R7 | El plan contempla repo/despliegue del subproyecto. Para esta fase **documental** eso adelanta trabajo. | [P5] | **Se difiere** repo git/grafo/vault del subproyecto (SD-11); los artefactos viven en la subcarpeta del repo existente, extraíbles después. |

## 5. Riesgos que el plan ya cubre bien (se conservan)
- **Dependencia de un LLM externo** → contingencia de despliegue (Render) y fallback determinista que no depende del LLM para la ruta de seguridad. [E1]
- **Sobre-alcance** → exclusiones explícitas. [E1]
- **Sobre-claim clínico** → *disclosure* + no-diagnóstico en el canon. [E1]

## 6. Qué NO se toca del plan
El **alcance** (rebanada vertical), el **stack** elegido y el **doble horizonte** se respetan tal cual. La auditoría no cambia decisiones del usuario ni del plan; solo las formaliza y las hace trazables.

## 7. Cierre
- **Decisiones confirmadas:** el plan es la base de alcance (SD-01, SD-06…SD-09).
- **Recomendaciones:** R1–R7, ya ruteadas a sus artefactos.
- **Supuestos:** los servicios externos funcionan como el plan indica (a re-verificar, V6-a).
- **Pendientes:** validación de frontera legal de datos (V6-b) y de servicios externos (V6-a).

## 8. Corrección posterior (SD-15) — fidelidad al alcance del plan
Una verificación posterior contra el texto del plan detectó que la **primera** construcción de artefactos se había desviado del alcance del administrador y del usuario:
- **Recortado por error:** las 3 funciones reales del administrador (directorio mínimo, métricas agregadas, **kill switch**, plan §3.7) y varias del usuario (registro/login, reinicio de perfil, revocación, **eliminación en cascada**, manejo de errores/cuota, plan §2.3/§3.1).
- **Añadido de más:** edición administrativa de recursos/textos/prompts (CMS), que el plan **excluye** (§2.5/§3.7). El plan aprovisiona esos recursos **por entorno**.
- **Resuelto (SD-15):** se restauró lo del plan y se quitó lo inventado en VIS-01, MV-01, REQ-01, PRIV-01, CONTRATO, MD-01 y TRZ-01. Esta auditoría se mantiene como registro; la corrección vive en `docs/00_gobernanza/REGISTRO_DECISIONES.md` (SD-15) y `CHANGELOG.md` (v0.4.0).
