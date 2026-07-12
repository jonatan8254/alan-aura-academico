# SEG-01 — Protocolo de seguridad del MVP (gate binario + fallback determinista)
**ID:** SEG-01 · **Hogar:** `docs/03_requisitos/` · **Fecha:** 2026-07-12 · **Versión:** v1.1 (SD-17: plantilla de fallback citada del plan §3.8, RN-02.9 rate limits).
**Insumos:** MV-01 §Conversación, contrato conversacional (C-3, C-7), D22 (fallback determinista de crisis), E3 del macro (escala S0-S5, **procedencia**), ISO/IEC 25010:2023 §3.9 *safety* (vía NORM-01/D6-bis), `00_PLAN_CODEX_ORIGINAL.md` §3.8 (plantilla de fallback, citada).
**Consumidores:** REQ-01 (RF-10/11, RC-01/02/03, RNF-06), TRZ-01, NORM-01.
**Naturaleza:** protocolo de seguridad, artefacto propio y auditable. **Honestidad §4.9:** este gate **no es** detección clínica ni exhaustiva; su alcance se declara explícitamente.

---

## 1. Decisión de diseño (SD-05)
El MVP implementa un **gate binario de seguridad**: por cada mensaje del usuario decide `{no-peligro | peligro-explícito}`. Ante **peligro explícito**, la respuesta la produce un **fallback determinista** (mensaje de contención + derivación a recursos configurables), **no** el LLM. No se implementa la escala graduada S0-S5 del macro; se implementa su **extremo crítico** de forma honesta y realizable en ~1 mes.

## 2. Qué es y qué NO es (frontera honesta)
**Es:** un filtro determinista sobre señales **explícitas** de peligro (intención o riesgo manifiesto de daño a sí mismo o a terceros, RN-11), con una ruta segura que **no depende del LLM**.
**No es:**
- No es un **clasificador clínico** ni un diagnóstico de riesgo.
- No detecta peligro **implícito, ambiguo o encubierto** (limitación declarada).
- No sustituye a servicios de emergencia ni a profesionales.
- No hace **escalamiento graduado** (S1→S2→…); es binario.

> Declararlo así es parte del canon (no sobre-claim). La honestidad sobre la reducción es un requisito, no una disculpa.

## 3. Mapeo de procedencia a la escala S0-S5 del macro (E3)
El gate binario **proviene** de la escala S0-S5 del macro; se documenta la correspondencia para trazabilidad y para una futura elevación (fase posterior). [I2]

| Escala macro (E3, referencial) | Descripción (procedencia) | Decisión del gate binario del MVP |
|---|---|---|
| S0 | Sin señales de riesgo | **no-peligro** → conversación normal |
| S1–S2 | Malestar leve/moderado, sin peligro | **no-peligro** → conversación normal (Alan/Aura acompañan) |
| S3 | Señales de alarma | **fuera de alcance del gate binario** (no se detecta de forma graduada) → si el mensaje es **explícito**, se trata como peligro |
| S4–S5 | Riesgo alto / crisis explícita | **peligro-explícito** → fallback determinista |

> El MVP cubre con garantía el **extremo explícito** (≈S4–S5). Las zonas intermedias (S3 y peligro implícito) quedan **declaradas como no cubiertas**; su detección graduada es trabajo de fase posterior (elevar a E3 completo).

## 4. Flujo del gate (determinista)
```
MensajeRecibido
   │
   ▼
[Gate binario]  ── ¿coincide con señal de peligro explícito (config)? ──┐
   │ no                                                                 │ sí
   ▼                                                                    ▼
Respuesta del LLM (gobernado: cápsula + persona + guardas)      FallbackActivado (SEG)
   │                                                                    │
   ▼                                                                    ▼
Turno mostrado                                    Mensaje de contención + derivación a
                                                  Recurso(s) de ayuda (config por entorno)
```
- El gate se evalúa **antes** de invocar al LLM (RF-10) → si hay peligro, el LLM **no** genera el turno (RN-05, C-3).
- El fallback es **determinista y local**: no requiere LLM ni red hacia Groq (RNF-06, RC-01) → opera aunque el LLM esté caído.

## 5. Contenido del fallback (parametrizable, no *hardcodeado*)
El mensaje de fallback y los recursos se leen de **configuración por entorno** (RF-17, SD-12):
- **Contención:** mensaje breve, validante, sin juicio, que reconoce el riesgo y prioriza la seguridad.
- **Derivación:** uno o más **recursos de ayuda** (línea/servicio) configurables por entorno; **nunca** números embebidos en código o en este documento.
- **Transparencia:** recuerda que es una IA y que la ayuda humana es la vía indicada.

**Plantilla de referencia (citada del plan, §3.8; NO usar como valor fijo — RNF-05/SD-12):** el plan de Codex propone un texto base para el fallback. Se cita aquí como referencia de tono y estructura; los recursos concretos (línea de emergencia, línea de apoyo, número local) **deben leerse de configuración por entorno**, nunca copiarse literalmente a código ni a este documento como valor operativo:

> *"No puedo atender una emergencia. Si existe peligro inmediato, llama a **[línea de emergencia, config]** o acude al servicio de urgencias más cercano. Si estás en **[localidad, config]**, también puedes comunicarte con **[línea de apoyo local, config]**. Si puedes hacerlo con seguridad, contacta ahora a una persona de confianza."*

El texto exacto propuesto por el plan (con los números de referencia para la demo en Medellín, marcados por el plan mismo como *"previa revalidación en AA-G6"*) vive archivado en `../../00_PLAN_CODEX_ORIGINAL.md` §3.8 — se consulta ahí, no se reproduce con números fijos en artefactos operativos.

## 6. Requisitos de seguridad (traza a REQ-01)
| ID | Requisito | 25010:2023 | Traza |
|---|---|---|---|
| SEG-R1 | El gate se evalúa en cada mensaje antes de responder. | §3.9.2 *risk identification* | RF-10, RC-02 |
| SEG-R2 | Ante peligro explícito, responde el fallback, no el LLM. | §3.9.3 *fail safe* | RF-11, RC-01 |
| SEG-R3 | El fallback opera con el LLM/red caídos. | §3.9.3 *fail safe* | RNF-06, RC-01 |
| SEG-R4 | Las guardas restringen la salida del LLM a parámetros seguros. | §3.9.1 *operational constraint* | RC-03 |
| SEG-R5 | La derivación advierte el riesgo y ofrece recursos. | §3.9.4 *hazard warning* | RF-11 |
| SEG-R6 | Señales y mensajes del gate son configurables, no *hardcodeados*. | Maintainability | RF-17, RNF-05 |

## 7. Verificación (cómo se prueba, fase posterior)
- **Set de prueba** de frases de peligro explícito (define el equipo) → mide *recall* (RC-02).
- **Prueba de fail-safe:** deshabilitar el LLM y enviar un mensaje de peligro → debe mostrarse el fallback (RC-01 = 100 %).
- **Prueba de guardas:** *prompts* adversarios → salida bloqueada/segura (RC-03).

## 8. Trazabilidad
`RN-05/RN-11 + C-3/C-7 + D22 (fail safe) → SEG-R1..R6 → RF-10/11, RNF-06, RC-01/02/03 → NORM-01 (§3.9.x) → TRZ-01`.

## 9. Cierre
- **Decisiones confirmadas:** gate binario, fallback determinista local, configuración por entorno, mapeo de procedencia a S0-S5.
- **Recomendaciones:** en fase posterior, elevar a la escala graduada E3 y añadir detección de señales implícitas.
- **Supuestos:** el conjunto de señales explícitas configurado cubre los casos de prueba acordados.
- **Pendientes:** definición del *set* de prueba (antes de construcción); revisión por perfil de salud mental (nivel 6, deseable).

**Fin de SEG-01.**
