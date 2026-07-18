# PLAN-01 — Plan de proyecto del MVP «Alan & Aura Académico»
**ID:** PLAN-01 · **Hogar:** `docs/05_plan/` · **Fecha:** 2026-07-12 · **Versión:** v1.0.
**Insumos:** VIS-01, ADR-001, MV-01.x, REQ-01, PRIV-01, SEG-01, NORM-01, TRZ-01.
**Consumidores:** ejecución del subproyecto (fases 2–4).
**Naturaleza:** plan de gestión de ~1 mes. **Alcance de este plan:** planifica todo el MVP; **produce** solo hasta los artefactos pre-ICONIX (esta fase). ICONIX, construcción y verificación quedan **planificados, no ejecutados**.

---

## 1. Enfoque
Ciclo **ágil ligero (Scrum-lite) con gates**, coherente con el macro (Scrum + V-Model con gates) pero calibrado a un curso de ~1 mes: iteraciones semanales, un incremento demostrable por semana, y **gates** que impiden avanzar sin cumplir su Definition of Done.

## 2. Cronograma (4 semanas)

| Semana | Fase | Entregables | Gate de salida |
|---|---|---|---|
| **S0–S1** | Documental (esta fase) + **ICONIX análisis** | Paquete documental (VIS/ADR/MV/REQ/PRIV/SEG/NORM/TRZ/PLAN) ✅; luego modelo de dominio, casos de uso y robustez desde MV-01.x. | **G1:** requisitos completos, cero huérfanos (TRZ-01), umbrales fijados; dominio/CU trazados a REQ-01. |
| **S2** | **Construcción – núcleo** | Onboarding (RF-01…06), cápsula, esqueleto de conversación (RF-07/08), integración Groq gobernada (RF-09). | **G2:** flujo onboarding→chat funcionando en local con LLM gobernado (solo cápsula). |
| **S3** | **Construcción – seguridad y admin** | Gate binario + fallback determinista (RF-10/11), no persistencia (RF-13), administración (RF-14…18). | **G3:** fallback opera con LLM caído (RC-01); config por entorno (RC-10). |
| **S4** | **Verificación + despliegue + entrega** | Pruebas de RC-01…RC-10 (umbrales), despliegue en *free tier*, demo y documentación de entrega. | **G4 (final):** «MVP terminado» (VIS-01 §8) verificado; demo reproducible. |

> **Regla de no-adelanto:** los entregables de S1–S4 se **listan** aquí para planificar; su producción es de fases posteriores. Esta ejecución cierra en el paquete documental.

## 3. Backlog inicial (épicas → historias → RF)
| Épica | Historia (resumen) | RF |
|---|---|---|
| **E1 Onboarding** | Como usuario adulto quiero consentir y presentarme mínimamente para conversar seguro. | RF-01…RF-06 |
| **E2 Conversación** | Como usuario quiero hablar con Alan o Aura y recibir acompañamiento coherente. | RF-07, RF-08, RF-09, RF-12 |
| **E3 Seguridad** | Como usuario en riesgo quiero recibir contención y derivación aunque el sistema falle. | RF-10, RF-11 |
| **E4 Privacidad** | Como usuario quiero que no se guarde mi conversación ni se exponga mi información. | RF-13 (+ PRIV-R1..R8) |
| **E5 Administración** | Como administrador quiero mantener recursos y textos sin tocar código. | RF-14…RF-18 |

Priorización (MoSCoW): **Must** E1, E2 (núcleo), E3 (seguridad), E4 (privacidad); **Should** E5; **Could** refinamientos de UI; **Won't** (esta versión) todo lo de VIS-01 §5.

## 4. Definition of Ready (DoR) — para tomar una historia
- Traza a un objetivo (VIS-01) y a ≥1 RF con criterio de aceptación (REQ-01).
- Reglas de negocio aplicables identificadas (RN) y canon §5 revisado.
- Dependencias externas conocidas (p. ej. clave/latencia de Groq) y con contingencia.

## 5. Definition of Done (DoD) — para cerrar una historia
- Criterio de aceptación del RF cumplido y demostrable.
- Sin violar ninguna cláusula [C] del contrato ni el canon §5.
- Si toca datos: cumple PRIV-01 (minimización, no persistencia del chat).
- Si toca seguridad: pasa la prueba de fail-safe correspondiente (SEG-01).
- Trazabilidad actualizada en TRZ-01.

## 6. Riesgos y controles
| ID | Riesgo | Prob. | Impacto | Control |
|---|---|---|---|---|
| R-1 | Groq `gpt-oss-20b` o su *free tier* no disponible/cambia. [N6] | Media | Alto | Diseño agnóstico de proveedor (ADR-001-D3); verificar V6-a en S0; contingencia de modelo/proveedor. |
| R-2 | PythonAnywhere Free bloquea salida a Groq o limita CPU. [N6] | Media | Alto | Verificar en S0; contingencia **Render** (ADR-001-D5). |
| R-3 | El gate binario deja pasar peligro implícito. | Media | Alto (dominio) | Alcance declarado honestamente (SEG-01 §2); fallback ante explícito garantizado; elevar a E3 en fase posterior. |
| R-4 | Frontera legal de datos no validada. | Media | Medio | V6-b: revisión legal del consentimiento antes de uso con personas reales (PRIV-01 §5). |
| R-5 | *Scope creep* hacia módulos del producto. | Alta | Medio | Exclusiones VIS-01 §5 como gate; MoSCoW «Won't». |
| R-6 | Latencia del LLM incumple RC-05. [N6] | Media | Medio | Medir en S2; ajustar *timeouts*/UX; umbral p95 ≤ 5 s revisable tras medición. |
| R-7 | Equipo pequeño / tiempo de curso. | Alta | Medio | Núcleo Must primero; E5 y refinamientos como Should/Could. |

## 7. Responsables sugeridos (roles, no personas)
| Rol | Responsabilidad |
|---|---|
| **Líder / arquitecto (Jonatan)** | Decisiones de alcance y arquitectura; orquestación; verificación final. |
| **Desarrollo backend** | Django, integración Groq gobernada, gate/fallback. |
| **Desarrollo front/UX** | Onboarding y chat en español CO; presentación de personajes. |
| **Calidad** | Pruebas de RC (umbrales), *set* de peligro explícito, rúbrica de personaje. |
| **Datos/privacidad** | Cumplimiento PRIV-01; preparación de la consulta legal (V6-b). |

> Los roles de desarrollo backend, front/UX, calidad y datos/privacidad los cubre el resto del equipo (Santiago Bedoya García, Luis Fernando Montoya Rodríguez, Santiago Eusse Gil), con asignación específica a definir al abrir la fase de construcción.

> Asignación de personas a roles: decisión del equipo del curso; este plan sugiere la estructura, no la nomina.

## 8. Hitos y verificaciones nivel 6
- **V6-a (S0):** verificar Django LTS, Groq `gpt-oss-20b` y PythonAnywhere Free antes de construir.
- **V6-b (antes de piloto real):** validación legal del consentimiento y frontera de datos.
- **Gate final G4:** «MVP terminado» de VIS-01 §8 verificado punto por punto.

## 9. Cierre
- **Confirmadas:** enfoque, cronograma de 4 semanas, backlog y DoD/DoR.
- **Recomendaciones:** cerrar V6-a en S0 antes de escribir código; congelar umbrales [N6] tras medición.
- **Supuestos:** disponibilidad del equipo del curso y de los *free tiers*.
- **Pendientes:** ejecución de fases 2–4 (fuera de esta entrega documental).

**Fin de PLAN-01.**
