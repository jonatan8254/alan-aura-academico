# Índice maestro — Subproyecto «Alan & Aura Académico»
**Propósito:** qué es cada artefacto, su ID, sus insumos y consumidores. **Fecha:** 2026-07-12.
**Convención de IDs:** `RF/RNF/RC/RN/CU/PR/MET` con **guion único** (`RF-01`). Documentos con prefijo semántico (`VIS`, `ADR`, `MV`, `REQ`, `PRIV`, `SEG`, `NORM`, `TRZ`, `PLAN`, `SD`).

---

## Gobernanza (`docs/00_gobernanza/`)
| Archivo | Qué es |
|---|---|
| `ESTADO_PIPELINE.md` | Fase actual y qué sigue. **Leer primero.** |
| `CAPSULA_CONTEXTO.md` | El subproyecto en 5 minutos. |
| `INDICE_MAESTRO.md` | Este índice. |
| `REGISTRO_DECISIONES.md` | Decisiones SD-01…SD-12 con justificación. |
| `CHANGELOG.md` | Hitos del paquete documental. |
| `MANIFIESTO_FUENTES.md` | Procedencia: qué del macro se consultó (solo lectura). |

## Raíz del subproyecto
| ID | Archivo | Qué es |
|---|---|---|
| — | `README.md` | Portada y mapa. |
| — | `AGENTS.md` / `CLAUDE.md` | Reglas operativas para agentes (aislamiento, sin default de modelo). |
| **PLAN-CODEX-ORIGINAL** | `00_PLAN_CODEX_ORIGINAL.md` | **Fuente primaria verbatim** del plan generado con Codex. Ancla de toda cita "plan §X.Y" en el subproyecto. No se edita. |
| — | `00_AUDITORIA_PLAN_CODEX.md` | Auditoría breve del plan (consume PLAN-CODEX-ORIGINAL). |

## Contenido (`docs/`)
| ID | Archivo | Insumos | Consumidores |
|---|---|---|---|
| **VIS-01** | `01_vision/VIS-01_vision_alcance.md` | Auditoría del plan, canon, doc 8 | ADR-001, MV-01, REQ-01, PLAN-01 |
| **ADR-001** | `01_vision/ADR-001_decisiones_tecnicas.md` | Plan Codex, VIS-01 | REQ-01 (RNF), PLAN-01, fase de construcción |
| **MV-01** | `02_modelos_verbales/MV-01_modelo_verbal_general.md` (consolidado; vistas Onboarding·Conversación·Seguridad·Administración) | VIS-01, E8, canon | skill `uml-domain-modeler`, REQ-01, contrato |
| — | `02_modelos_verbales/CONTRATO_conversacional.md` | E4 simplificado, MV-01 §Conversación | MV-01 §Conversación, SEG-01, pruebas (fase 2) |
| **REQ-01** | `03_requisitos/REQ-01_requisitos.md` | MV-01, VIS-01, ADR-001, 25010:2023 | TRZ-01, NORM-01, pruebas (fase 2) |
| **PRIV-01** | `03_requisitos/PRIV-01_privacidad_datos.md` | Canon, MV-01 §Onboarding, Ley 1581 | REQ-01, SEG-01, TRZ-01 |
| **SEG-01** | `03_requisitos/SEG-01_protocolo_seguridad.md` | E3 (S0-S5), D22 fallback, MV-01 §Conversación | REQ-01, TRZ-01, NORM-01 |
| **NORM-01** | `04_trazabilidad/NORM-01_puente_normativo.md` | D6-bis (cláusulas verificadas), REQ-01 | TRZ-01, evaluación (fase 4) |
| **TRZ-01** | `04_trazabilidad/TRZ-01_trazabilidad.md` | VIS-01, MV-01, REQ-01, SEG-01, NORM-01 | Verificación de cobertura, fase 2/4 |
| **PLAN-01** | `05_plan/PLAN-01_plan_proyecto.md` | Todos los anteriores | Ejecución del subproyecto |
| **MD-01** | `06_dominio/MD-01_modelo_dominio.puml` (+ `.md`) | MV-01, VIS-01, REQ-01, SEG-01, PRIV-01, contrato | DCU-01, robustez, clases (fase 2+) |
| **DCU-01** | `07_casos_uso/DCU-01_casos_uso.puml` (+ `.md`, `.svg`) | MV-01, MD-01, VIS-01, REQ-01, plan §5.3 | Especificación textual de CU, robustez |
| **ECU-00…10** | `07_casos_uso/especificaciones/ECU-00_indice…ECU-10_*.md` | DCU-01, MV-01, MD-01, REQ-01, PRIV-01, SEG-01, contrato, plan | Robustez (DR), secuencia (DS), pruebas (CP) |
| **DIS-00 / DIS-01** | `08_diseno/DIS-00_inventario_y_plan.md`, `08_diseno/DIS-01_sistema_diseno.md` | DCU-01, ECU-00…10, VIS-01, MV-01, REQ-01, PRIV-01, SEG-01, ADR-001; evidencia (Fase 1) | Mockups, §17 de las ECU, fase de construcción |

## Cadena de dependencia (resumen)
`VIS-01 → ADR-001 → MV-01 (vistas: Onboarding · Conversación (+contrato) · Seguridad · Administración) → REQ-01 → {PRIV-01, SEG-01} → NORM-01 → TRZ-01 → PLAN-01`
Fase 2 ICONIX: `MV-01 → MD-01 (dominio) → DCU-01 (casos de uso) → [especificación textual → robustez → secuencia → clases]`

## Estándares por artefacto
- **MV-01 (consolidado):** E8, 11 rasgos {1,2,3,6,7,12,13,14,15,16,17} + checklist único; apto para extracción de dominio (§14 Handoff, modo *academic strict*).
- **REQ-01:** convención de IDs; RF/RNF con criterios; calidad 25010:2023 + GQM + umbral; reglas Wiegers tipadas.
- **SEG-01:** gate binario + fallback determinista; mapeo de procedencia a S0-S5 (E3).
- **NORM-01:** filas [V-cláusula] reusadas de D6-bis; 3 niveles de verificación.
- **TRZ-01:** objetivo → actor → RF/RN → calidad → norma → prueba-planeada; cero huérfanos.
- **MD-01:** modelo de dominio PlantUML (skill `uml-domain-modeler`, modo *academic strict*); 11 clases, sin atributos/multiplicidades; validador 0/0.
- **DCU-01:** diagrama de casos de uso PlantUML (skill `uml-use-case-diagram`); 4 actores, 10 casos de uso, 3 paquetes, 1 `<<extend>>`, 0 `<<include>>`; validador 0 errores.
