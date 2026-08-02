# Índice maestro — Subproyecto «Alan & Aura Académico»
**Propósito:** qué es cada artefacto, su ID, sus insumos y consumidores. **Fecha de creación:** 2026-07-12 · **Última actualización:** 2026-08-01 (SD-30: diagramas de secuencia).
**Convención de IDs:** `RF/RNF/RC/RN/CU/PR/MET` con **guion único** (`RF-01`). Documentos con prefijo semántico (`VIS`, `ADR`, `MV`, `REQ`, `PRIV`, `SEG`, `NORM`, `TRZ`, `PLAN`, `SD`).

---

## Gobernanza (`docs/00_gobernanza/`)
| Archivo | Qué es |
|---|---|
| `ESTADO_PIPELINE.md` | Fase actual y qué sigue. **Leer primero.** |
| `CAPSULA_CONTEXTO.md` | El subproyecto en 5 minutos. |
| `INDICE_MAESTRO.md` | Este índice. |
| `REGISTRO_DECISIONES.md` | Decisiones SD-01…SD-29 con justificación. |
| `HECHOS_CANONICOS.md` | **Fuente única de las cifras repetidas entre artefactos** (21 hechos) y de los valores obsoletos con su ámbito legítimo. Cuando dos documentos discrepan, manda esta tabla. La verifica `scripts/verificar_coherencia.py`. |
| `CHANGELOG.md` | Hitos del paquete documental. |
| `MANIFIESTO_FUENTES.md` | Procedencia: qué del macro se consultó (solo lectura). |

## Raíz del subproyecto
| ID | Archivo | Qué es |
|---|---|---|
| — | `README.md` | Portada y mapa. |
| — | `AGENTS.md` / `CLAUDE.md` | Reglas operativas para agentes (aislamiento, sin default de modelo). |
| **PLAN-CODEX-ORIGINAL** | `00_PLAN_CODEX_ORIGINAL.md` | **Fuente primaria verbatim** del plan generado con Codex. Ancla de toda cita "plan §X.Y" en el subproyecto. No se edita. |
| — | `00_AUDITORIA_PLAN_CODEX.md` | Auditoría breve del plan (consume PLAN-CODEX-ORIGINAL). |
| — | `grafo/README.md` | **Grafo de conocimiento propio del subproyecto** (SD-27): 2.876 nodos (262 del subproyecto + 2.614 de conocimiento) + vault de Obsidian trazable a cada documento fuente, aislado del macroproyecto. Ver detalle en `REGISTRO_DECISIONES.md` (SD-27). |
| — | `GUIA_USO_GRAFO_Y_VAULT.md` | **Instructivo de uso de `grafo/`** (añadido 2026-07-27): cómo consultar el grafo por terminal, navegar el vault en Obsidian, la licencia del corpus de conocimiento y las trampas de `graphify` ya verificadas. Referencia canónica de `grafo/`. |

## Contenido (`docs/`)
| ID | Archivo | Insumos | Consumidores |
|---|---|---|---|
| **VIS-01** | `01_vision/VIS-01_vision_alcance.md` | Auditoría del plan, canon, doc 8 | ADR-001, MV-01, REQ-01, PLAN-01 |
| **ADR-001** | `01_vision/ADR-001_decisiones_tecnicas.md` (**D1/D2/D5 superadas por ADR-002**) | Plan Codex, VIS-01 | REQ-01 (RNF), PLAN-01, fase de construcción |
| **ADR-002** | `01_vision/ADR-002_reversion_stack_serverless.md` — stack vigente: React + Vercel + AWS serverless | ADR-001, SD-29, PER-01, DIS-01 | REQ-01, PER-01, PRIV-01, PLAN-01, DIS-01, `ARQ-01` (futuro) |
| **MV-01** | `02_modelos_verbales/MV-01_modelo_verbal_general.md` (consolidado; vistas Onboarding·Conversación·Seguridad·Administración) | VIS-01, E8, canon | skill `uml-domain-modeler`, REQ-01, contrato |
| — | `02_modelos_verbales/CONTRATO_conversacional.md` | E4 simplificado, MV-01 §Conversación | MV-01 §Conversación, SEG-01, pruebas (fase 2) |
| **REQ-01** | `03_requisitos/REQ-01_requisitos.md` | MV-01, VIS-01, ADR-001, **ADR-002**, 25010:2023 | TRZ-01, NORM-01, pruebas (fase 2) |
| **PRIV-01** | `03_requisitos/PRIV-01_privacidad_datos.md` | Canon, MV-01 §Onboarding, Ley 1581 | REQ-01, SEG-01, TRZ-01 |
| **SEG-01** | `03_requisitos/SEG-01_protocolo_seguridad.md` | E3 (S0-S5), D22 fallback, MV-01 §Conversación | REQ-01, TRZ-01, NORM-01 |
| **PER-01** | `03_requisitos/PER-01_mapa_persistencia.md` | Plan §4.14/§4.15, PRIV-01, **ADR-002-D5/D6** (superan a ADR-001-D2), MD-01, ECU-02/04/05/06/08/09/10, REQ-01 | Robustez, diseño de clases y modelo de datos, **`ARQ-01`** y construcción (fase 3), pruebas de privacidad (RC-04) |
| **NORM-01** | `04_trazabilidad/NORM-01_puente_normativo.md` | D6-bis (cláusulas verificadas), REQ-01 | TRZ-01, evaluación (fase 4) |
| **TRZ-01** | `04_trazabilidad/TRZ-01_trazabilidad.md` | VIS-01, MV-01, REQ-01, SEG-01, NORM-01 | Verificación de cobertura, fase 2/4 |
| **PLAN-01** | `05_plan/PLAN-01_plan_proyecto.md` | Todos los anteriores | Ejecución del subproyecto |
| **RET-01** | `00_gobernanza/RET-01_retroalimentacion_docente.md` | Retroalimentación del profesor sobre la fase 2 | Revisión docente, informe académico |
| **PDR-01** | `00_gobernanza/PDR-01_primera_pasada_correcciones.md` | RET-01, DR-00 (15 hallazgos), skills actualizadas | Revisión docente, informe académico, fases posteriores |
| **RPD-01** | `07_casos_uso/RPD-01_revision_preliminar_diseno.md` | MD-01, DCU-01, ECU-00…14, DR-00…14 (compuerta ICONIX, skill `iconix-pdr-review`) | Diagramas de secuencia (autoriza el paso a diseño detallado) |
| **DS-00…DS-14** | `07_casos_uso/secuencia/` (`puml/`, `svg/`, `pruebas/`, `scripts/`) | DR-01…14, ECU-01…14, MD-01, DCU-01, RPD-01, DIS-00, SEG-01, PER-01 | Diagrama de clases de diseño, `COD-01`, el CDR |
| **DR-00…DR-14** | `07_casos_uso/robustez/` (`.puml` + `.svg` + certificados `CERT-D4-tanda1/2/3.md`) | ECU-01…ECU-14, MD-01, DCU-01, DIS-00, SEG-01 | `RPD-01`, diagramas de secuencia, casos de prueba |
| **MD-01** | `06_dominio/MD-01_modelo_dominio.puml` (+ `.md`) | MV-01, VIS-01, REQ-01, SEG-01, PRIV-01, contrato | DCU-01, robustez, `RPD-01`, clases (fase 2+) |
| **DCU-01** | `07_casos_uso/DCU-01_casos_uso.puml` (+ `.md`, `.svg`) | MV-01, MD-01, VIS-01, REQ-01, plan §5.3 | Especificación textual de CU, robustez, `RPD-01` |
| **ECU-00…14** | `07_casos_uso/especificaciones/ECU-00_indice…ECU-14_*.md` | DCU-01, MV-01, MD-01, REQ-01, PRIV-01, SEG-01, contrato, plan | Robustez (DR), `RPD-01`, secuencia (DS), pruebas (CP) |
| **DIS-00 / DIS-01** | `08_diseno/DIS-00_inventario_y_plan.md`, `08_diseno/DIS-01_sistema_diseno.md` | DCU-01, ECU-00…14, VIS-01, MV-01, REQ-01, PRIV-01, SEG-01, **ADR-002-D1/D2** (supera a ADR-001); evidencia (Fase 1) | Mockups, §17 de las ECU, fase de construcción |
| **Informe académico** | `09_informe/Informe_Academico_Alan_Aura.docx` | Todos los artefactos del proyecto | Entrega académica del curso (revisión del profesor). **Pendiente:** aún refleja el estado anterior a `PDR-01`/`RPD-01` |

## Cadena de dependencia (resumen)
`VIS-01 → ADR-001 → ADR-002 (stack vigente) → MV-01 (vistas: Onboarding · Conversación (+contrato) · Seguridad · Administración) → REQ-01 → {PRIV-01, SEG-01, PER-01} → NORM-01 → TRZ-01 → PLAN-01`
Fase 2 ICONIX: `MV-01 → MD-01 (dominio) ✅ → DCU-01 (casos de uso) ✅ → especificación textual ✅ → robustez ✅ → RPD-01 (compuerta) ✅ → secuencia (siguiente) → clases`

## Estándares por artefacto
- **MV-01 (consolidado):** E8, 11 rasgos {1,2,3,6,7,12,13,14,15,16,17} + checklist único; apto para extracción de dominio (§14 Handoff, modo *academic strict*).
- **REQ-01:** convención de IDs; RF/RNF con criterios; calidad 25010:2023 + GQM + umbral; reglas Wiegers tipadas.
- **SEG-01:** gate binario + fallback determinista; mapeo de procedencia a S0-S5 (E3).
- **NORM-01:** filas [V-cláusula] reusadas de D6-bis; 3 niveles de verificación.
- **TRZ-01:** objetivo → actor → RF/RN → calidad → norma → prueba-planeada; cero huérfanos.
- **MD-01 v1.4:** modelo de dominio PlantUML (skill `uml-domain-modeler`, modo *academic strict*); **16 clases, 17 relaciones** (4 generalizaciones + 1 composición + 12 asociaciones), sin atributos/multiplicidades; validador 0/0 y compuertas de la skill (*Final Quality Gates*) superadas.
- **DCU-01 v2.1:** diagrama de casos de uso PlantUML (skill `uml-use-case-diagram`); **5 actores** (4 concretos + el rol general `Titular de cuenta`), **14 casos de uso**, 3 paquetes, **2 `<<extend>>` y 1 `<<include>>`**; validador 0 errores y compuertas de la skill superadas.
- **ECU-00…14:** especificación textual (skill `use-case-specifier`); 7 completas + 7 ágiles; validador **0 errores y 0 advertencias** en las 14; **100 % de sus 76 flujos** con criterio de aceptación asociado.
- **DR-00…14 v2.1:** análisis de robustez (skill `uml-robustness-diagram`); **263 elementos** (15 actores / 38 borde / 150 control / 60 entidad); validador 0 errores con `--domain MD-01`; cobertura de flujos completa.
- **DS-00…14 v1.0:** diagramas de secuencia (skill `uml-sequence-diagram`, modo *Generar*); **282 mensajes**, **150/150** controladores cubiertos, 0 flujos sin fragmento; validador **0 errores en los 14**. Capa de infraestructura **declarada no ejecutada** (`E-1` de `DS-00`). Delta en `DOP-01` (**192 operaciones**, 16/16 clases del dominio) y **178 casos de prueba** en `pruebas/CP-00…CP-14`.
- **RPD-01:** compuerta ICONIX (skill `iconix-pdr-review`) entre análisis y diseño detallado; veredicto **Aceptado con verificación de retrabajo**.
- **PER-01:** inventario consolidado de persistencia (7 entidades del plan §4.14 + telemetría §4.15); marcas [E1]/[I2], reglas transversales `PER-T1…T7`, hallazgos abiertos `PER-H2`/`PER-H4`/**`PER-H5`** (este último, de canon: el respaldo en S3 escapa al borrado en cascada — ver `ADR-002`). **No** es diseño de esquema: sin tipos, claves ni DDL.
