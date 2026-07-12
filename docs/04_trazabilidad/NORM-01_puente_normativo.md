# NORM-01 — Puente normativo del MVP (mini D6-bis)
**ID:** NORM-01 · **Hogar:** `docs/04_trazabilidad/` · **Fecha:** 2026-07-12 · **Versión:** v1.0.
**Insumos:** `auditoria_fable5/02_auditoria/D6bis_matriz_puente_normativo.md` (macroproyecto Smart-AID, repositorio separado — filas **[V-cláusula]** ya verificadas por lectura directa de ISO/IEC 25010:2023, citadas aquí); REQ-01 (RC-01…RC-10).
**Consumidores:** TRZ-01, evaluación de calidad (fase 4), REQ-01.
**Naturaleza:** matriz de correspondencia requisito de calidad ↔ norma. **No inventa cláusulas.**

---

## 1. Regla de honestidad y niveles de verificación (heredada de D6-bis §4.9)
Cada fila declara su **nivel**:
- **[V-cláusula]** = texto de la norma abierto y citado literalmente (verificado en D6-bis; se **reutiliza**, no se re-cita a ciegas).
- **[V-estructura]** = edición/estructura confirmadas (25010:2023), **cláusula exacta de la sub-característica pendiente** de abrir al fijar la evaluación.
- **[V-índice]** = ubicación conocida, pendiente de apertura.

> Las filas de la **familia *safety*** y la lista de **nueve características** provienen de D6-bis a nivel **[V-cláusula]** (lectura directa de la edición 2023). Las sub-características específicas de otras familias quedan **[V-estructura]** hasta abrir su cláusula exacta en la fase de evaluación.

## 2. Matriz requisito de calidad → cláusula (ISO/IEC 25010:2023)

| RC (REQ-01) | Característica / sub-característica | Cláusula 25010:2023 | Nivel | Procedencia en D6-bis |
|---|---|---|---|---|
| RC-01 | Safety · *fail safe* | **§3.9.3** — *"…automatically place itself in a safe operating mode, or revert to a safe condition in the event of a failure"* | **[V-cláusula]** | D6-bis fila 4 |
| RC-02 | Safety · *risk identification* | **§3.9.2** — *"…identify a course of events or operations that can expose life, property or environment to unacceptable risk"* | **[V-cláusula]** | D6-bis fila 3 |
| RC-03 | Safety · *operational constraint* | **§3.9.1** — *"…constrain its operation to within safe parameters or states when encountering operational hazard"* | **[V-cláusula]** | D6-bis fila 6 |
| — | Safety · *hazard warning* (deriva del fallback, SEG-R5) | **§3.9.4** — *"…provide warnings of unacceptable risks…"* | **[V-cláusula]** | D6-bis fila 5 |
| — | Safety (característica raíz) | **§3.9** — *"…avoid a state in which human life, health, property, or the environment is endangered"* | **[V-cláusula]** | D6-bis fila 2 |
| RC-04 | Security · confidencialidad | Característica *security* (en la lista de nueve, §4.1); sub-cláusula de confidencialidad | **[V-estructura]** | D6-bis fila 1 (lista §4.1 verificada) |
| RC-05 | Performance efficiency · comportamiento temporal | *performance efficiency* (§4.1); sub-cláusula de *time behaviour* | **[V-estructura]** | D6-bis fila 1 |
| RC-06 | Interaction capability | **§3.4** — *interaction capability* (renombre 2023 de *usability*, definición leída) | **[V-cláusula]** | D6-bis fila 8 |
| RC-07 | Reliability · disponibilidad | *reliability* (§4.1); sub-cláusula de *availability* | **[V-estructura]** | D6-bis fila 1 |
| RC-08 | Functional suitability · corrección | *functional suitability* (§4.1); sub-cláusula de *correctness* | **[V-estructura]** | D6-bis fila 1 |
| RC-09 | Flexibility · instalabilidad | *flexibility* (§4.1, renombre 2023 de *portability*); sub-cláusula de *installability* | **[V-estructura]** | D6-bis fila 1 |
| RC-10 | Maintainability · modificabilidad | *maintainability* (§4.1); sub-cláusula de *modifiability* | **[V-estructura]** | D6-bis fila 1 |

## 3. Nota de edición (heredada de D6-bis)
El corpus del macro cita la edición **2023** (nueve características: se añade *safety*; *usability*→*interaction capability*; *portability*→*flexibility*). NORM-01 usa la 2023 de forma consistente con REQ-01 y con D22.

## 4. Marco de requisitos y medición (contexto, no cláusula)
- **ISO/IEC 25030** (marco de requisitos de calidad) y **ISO/IEC 25023/25022** (medición de producto/calidad en uso) respaldan la **estructura** de RC-01…RC-10 (meta→métrica→umbral). Nivel **[V-estructura]/[V-índice]** (D6-bis filas 9–11); las cláusulas exactas se abren al formalizar el plan de medición (fase 4).
- **GQM** (Basili) respalda el método meta→pregunta→métrica de cada RC. [V-índice] (D6-bis fila 11).

## 5. Filas de nivel 6 (fuera del corpus normativo)
- **Ley 1581/2012 + Decreto 1377/2013** respaldan PRIV-01: **validación legal = nivel 6** (V6-b), no resuelta aquí (coherente con D6-bis fila 17).

## 6. Cierre
- **Confirmadas:** las 5 filas *safety* + *interaction capability* se reutilizan a **[V-cláusula]** desde D6-bis (sin re-abrir la norma).
- **Recomendaciones:** al preparar la evaluación (fase 4), elevar RC-04/05/07/08/09/10 de [V-estructura] a [V-cláusula] abriendo la sub-cláusula exacta.
- **Pendientes:** cláusulas exactas de sub-características no-safety; validación legal (V6-b).

**Fin de NORM-01.**
