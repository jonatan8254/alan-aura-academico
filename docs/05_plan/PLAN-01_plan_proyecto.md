# PLAN-01 — Plan de proyecto del MVP «Alan & Aura Académico»
**ID:** PLAN-01 · **Hogar:** `docs/05_plan/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 (SD-29: riesgos y verificaciones realineados a `ADR-002` — R-2 reformulado, R-6 incorpora el arranque en frío, **R-8…R-11 nuevos** (cuenta de AWS, protección CSRF a construir, dependencia de red del *fallback*, respaldos fuera de la cascada — este último, `PER-H5`), rol de backend y `V6-a` actualizados). Al pasar el backend a TypeScript, el instrumental de pruebas del plan de Codex (pytest) deja de aplicar: corresponde Vitest, y Playwright se mantiene por ser agnóstico.
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
| **S4** | **Verificación + despliegue + entrega** | Pruebas de RC-01…RC-10 (umbrales), despliegue en capa gratuita, demo y documentación de entrega. | **G4 (final):** «MVP terminado» (VIS-01 §8) verificado; demo reproducible. |

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
| R-2 | La capa gratuita de AWS o de Vercel resulta insuficiente, o alguno de los servicios solo es gratuito los primeros doce meses. [N6] | Media | Alto | Verificar en S0 **qué es gratuito de forma permanente y qué no** (V6-a, `ADR-002 §4`); acotar consumo; contingencia de alojamiento de estáticos, que es de bajo acoplamiento. |
| R-3 | El gate binario deja pasar peligro implícito. | Media | Alto (dominio) | Alcance declarado honestamente (SEG-01 §2); fallback ante explícito garantizado; elevar a E3 en fase posterior. |
| R-4 | Frontera legal de datos no validada. | Media | Medio | V6-b: revisión legal del consentimiento antes de uso con personas reales (PRIV-01 §5). |
| R-5 | *Scope creep* hacia módulos del producto. | Alta | Medio | Exclusiones VIS-01 §5 como gate; MoSCoW «Won't». |
| R-6 | Latencia extremo a extremo incumple RC-05, ahora con el **arranque en frío** de las funciones sumado a la latencia del LLM. [N6] | Media | Medio | Medir en S2 **incluyendo el arranque en frío**, no solo el camino caliente; si no cuadra, aprovisionar concurrencia o revisar el umbral con evidencia. |
| R-7 | Equipo pequeño / tiempo de curso. | Alta | Medio |
| R-8 | **Cuenta de AWS del equipo**: exige medio de pago asociado y control de gasto; un descuido factura de verdad. [N6] | Media | Medio | Presupuesto y alertas de facturación en S0; una sola cuenta con responsable nombrado. |
| R-9 | **La protección contra falsificación de petición entre sitios hay que construirla.** Django la daba de fábrica; con autenticación propia y origen cruzado, no. [N1] | Media | Alto | Decidir la topología en `ARQ-01` (dominio propio con la API en subdominio, o intermediación desde Vercel); prueba explícita antes de la entrega. |
| R-10 | **El *fallback* de seguridad depende ahora de configuración remota** (S3), y `RC-01` exige cobertura del 100 % sin red. [N1] | Media | **Alto (canon)** | Cargar la configuración al inicializar la función y retenerla en memoria; valor de último recurso empaquetado con el código; probar el fallback con S3 inalcanzable, no solo con el LLM caído (`SEG-01 §4`). |
| R-11 | **Los respaldos escapan al borrado en cascada** (`PER-H5`): `RF-24` promete que «no queda dato asociado recuperable» y el respaldo lo contradice. [N1] | Alta | **Alto (canon/legal)** | Cerrar `PER-H5` en `ARQ-01` antes de cualquier uso con personas reales; decidir retención y borrado de respaldos junto con `V6-b`. | Núcleo Must primero; E5 y refinamientos como Should/Could. |

## 7. Responsables sugeridos (roles, no personas)
| Rol | Responsabilidad |
|---|---|
| **Líder / arquitecto (Jonatan)** | Decisiones de alcance y arquitectura; orquestación; verificación final. |
| **Desarrollo backend** | Funciones Lambda en TypeScript tras API Gateway, acceso a DynamoDB y S3, autenticación propia, integración Groq gobernada, gate/fallback. |
| **Desarrollo front/UX** | Onboarding y chat en español CO; presentación de personajes. |
| **Calidad** | Pruebas de RC (umbrales), *set* de peligro explícito, rúbrica de personaje. |
| **Datos/privacidad** | Cumplimiento PRIV-01; preparación de la consulta legal (V6-b). |

> Los roles de desarrollo backend, front/UX, calidad y datos/privacidad los cubre el resto del equipo (Santiago Bedoya García, Luis Fernando Montoya Rodríguez, Santiago Eusse Gil), con asignación específica a definir al abrir la fase de construcción.

> Asignación de personas a roles: decisión del equipo del curso; este plan sugiere la estructura, no la nomina.

## 8. Hitos y verificaciones nivel 6
- **V6-a (S0):** antes de construir, verificar (1) Groq `gpt-oss-20b`: modelo, capa gratuita, cuota y latencia; (2) **qué servicios de AWS son gratuitos de forma permanente y cuáles solo doce meses**; (3) límites reales del plan gratuito de Vercel; (4) vigencia del entorno Node 22 en Lambda y magnitud del arranque en frío; (5) **región de AWS** y su lectura de residencia de datos (enlaza con V6-b). Detalle en `ADR-002 §4`.
- **V6-b (antes de piloto real):** validación legal del consentimiento y frontera de datos.
- **Gate final G4:** «MVP terminado» de VIS-01 §8 verificado punto por punto.

## 9. Cierre
- **Confirmadas:** enfoque, cronograma de 4 semanas, backlog y DoD/DoR.
- **Recomendaciones:** cerrar V6-a en S0 antes de escribir código; congelar umbrales [N6] tras medición.
- **Supuestos:** disponibilidad del equipo del curso y de los *free tiers*.
- **Pendientes:** ejecución de fases 2–4 (fuera de esta entrega documental).

**Fin de PLAN-01.**
