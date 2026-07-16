# Estado del subproyecto — «Alan & Aura Académico»
**Propósito:** decir en qué fase está el subproyecto y qué sigue. Es el primer archivo a leer al rehidratar contexto. **Fecha:** 2026-07-12 · **Versión:** v1.0.

---

## Dónde estamos
Fase **1 cerrada** y **Fase 2 (ICONIX) en curso** (2026-07-12): el paquete documental está completo y ya se produjeron los dos primeros artefactos ICONIX — el **modelo de dominio `MD-01`** (`docs/06_dominio/`) y el **diagrama de casos de uso `DCU-01`** (`docs/07_casos_uso/`), ambos en PlantUML con validador de la skill en 0 errores. No hay código ni pilotos, por diseño. Siguiente artefacto ICONIX: **especificación textual de los casos de uso**.

## Fases del subproyecto

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Delimitación de alcance (plan generado con Codex) | ✅ cerrada (insumo externo) |
| 1 | **Auditoría del plan + artefactos documentales mínimos** (esta fase) | ✅ **cerrada (2026-07-12)** |
| 2 | Análisis y diseño ICONIX (dominio → CU → robustez → secuencia → clases) | 🟩 **en curso** — `MD-01` (dominio) ✅ · `DCU-01` (casos de uso) ✅ (2026-07-12); especificación textual de CU pendiente |
| 3 | Construcción del MVP (Django/LLM/gate de seguridad) | ⬜ planificada |
| 4 | Verificación, despliegue académico y entrega | ⬜ planificada |

## Entregables de la Fase 1 (esta ejecución)

| ID | Artefacto | Estado |
|---|---|---|
| — | Gobernanza (README, AGENTS, CLAUDE, índice, cápsula, estado, decisiones, changelog, manifiesto) | ✅ |
| — | `00_AUDITORIA_PLAN_CODEX` — auditoría breve del plan | ✅ |
| VIS-01 | Visión, objetivos, alcance, exclusiones, definición de «MVP terminado» | ✅ |
| ADR-001 | Decisiones técnicas (stack) con condiciones de reversa | ✅ |
| MV-01 | Modelo verbal **consolidado** (vistas onboarding/conversación/seguridad/administración) + contrato E4 simplificado; apto para extracción de dominio | ✅ |
| REQ-01 | RF/RNF + requisitos de calidad (25010:2023 + GQM + umbral) + reglas tipadas | ✅ |
| PRIV-01 | Privacidad, minimización, retención, no-persistencia | ✅ |
| SEG-01 | Protocolo de seguridad (gate binario + fallback) | ✅ |
| NORM-01 | Puente normativo (mini D6-bis) | ✅ |
| TRZ-01 | Matriz de trazabilidad (cero huérfanos) | ✅ |
| PLAN-01 | Plan de proyecto de 1 mes | ✅ |

## Fuente primaria archivada y reconciliada (SD-16/SD-17, 2026-07-12)
`00_PLAN_CODEX_ORIGINAL.md` — texto completo verbatim del plan de Codex. **Reconciliación APLICADA** (SD-17) contra los 5 puntos identificados al comparar con la reconstrucción forense previa:
1. ✅ Historial de sesión (hasta 4 intercambios, no "cero historial") — MV-01 RN-02.2/RN-03, REQ-01 RF-09/RNF-04, PRIV-01 PRIV-R1, CONTRATO C-4/CA-4.
2. ✅ Límites de tasa exactos (3/min, 30/día, 20s timeout, 1.500 caracteres, 350 tokens) — MV-01 RN-02.8/RN-02.9, REQ-01 RF-25/26/RNF-10, TRZ-01.
3. ✅ Inventario de PRIV-01 mapeado 1:1 a las 7 entidades del plan (`User`/`ConsentRecord`/`InitialConversationProfile`/`PlatformSetting`/`DailyUsageCounter`/`OperationalEvent`/`AdministrativeAction`).
4. ✅ Tabla de personajes del contrato enriquecida (P-1..P-8: función/tono/respuesta típica/preguntas/sugerencias/longitud/límites).
5. ✅ Plantilla del fallback citada en SEG-01 §5 (sin números fijos, respeta SD-12).
6. ⬜ Tabla de endpoints (§4.9 del plan) — diferida a ARQ-01 (fase de construcción, no aplica a esta fase documental).

## Corrección de alcance (SD-15, 2026-07-12)
Verificación forense contra el plan de Codex: se restauraron las 3 funciones reales del administrador (directorio, métricas agregadas, kill switch) y las de cuenta del usuario (registro/login, reinicio de perfil, revocación, eliminación en cascada, manejo de errores), y se quitó la edición administrativa que el plan excluye (recursos/textos **por entorno**). Propagado a VIS-01, MV-01 (v2.1, +`DisponibilidadDelChatbot`), REQ-01 (v1.1, +RF-19…26), PRIV-01, CONTRATO, MD-01 (12 clases) y TRZ-01. Detalle en `CHANGELOG.md` (v0.4.0) y `REGISTRO_DECISIONES.md` (SD-15).

## Verificación de cierre (Fase 1)
| Criterio | Resultado |
|---|---|
| Checklist de 11 rasgos de E8 en el MV | ✅ 11/11 en MV-01 (consolidado; vistas Onboarding·Conversación·Seguridad·Administración) |
| Cero requisitos huérfanos (TRZ-01) | ✅ verificado (TRZ-01 §5) |
| GQM + umbral por requisito de calidad | ✅ RC-01…RC-10, todos con umbral (REQ-01 §3) |
| Cláusulas ISO reutilizadas de D6-bis, sin invención | ✅ NORM-01 (5 filas *safety* + §3.4 a nivel [V-cláusula]) |
| Aislamiento (`git status` solo la carpeta nueva) | ✅ solo `subproyecto_academico_alan_aura/` untracked |

### Matriz de canon §5 por artefacto
Leyenda: ✅ afirmado/cumplido · ➖ no aplica al artefacto.

| Artefacto | No sobre-claim | Minimización | No punitivo | No persistencia chat | Disclosure/adultos |
|---|---|---|---|---|---|
| VIS-01 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ADR-001 | ➖ | ✅ (D2) | ➖ | ✅ (D2) | ✅ (D7) |
| MV-01 (consolidado) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contrato | ✅ (C-2) | ✅ (C-4) | ✅ (C-6) | ✅ (C-5) | ✅ (C-1) |
| REQ-01 | ✅ | ✅ (RC-04) | ✅ (RN-08) | ✅ (RNF-03) | ✅ (RF-01) |
| PRIV-01 | ✅ | ✅ | ✅ (PRIV-R6) | ✅ (PRIV-R2) | ✅ (PRIV-R8) |
| SEG-01 | ✅ (§2) | ✅ | ✅ | ✅ | ✅ |
| NORM-01 / TRZ-01 | ➖ (trazan) | ➖ | ➖ | ➖ | ➖ |
| PLAN-01 | ✅ (DoD) | ✅ (DoD) | ✅ | ✅ | ✅ |

*(Ver `CHANGELOG.md` para el registro del hito.)*

## Qué sigue (después de la Fase 1)
1. Revisión del usuario de VIS-01/ADR-001/REQ-01 (validaciones nivel 6: servicios externos y frontera legal).
2. Fase 2 (ICONIX) **en curso**: `MD-01` (dominio) ✅ y `DCU-01` (casos de uso) ✅ producidos con las skills `uml-domain-modeler` y `uml-use-case-diagram` (validador 0 errores en ambos). Siguiente: **especificación textual de cada caso de uso** (skill `use-case-specifier`) reusando los nombres de DCU-01 — pendiente.
3. Diferido explícito: repo git separado, grafo y vault del subproyecto (cuando el usuario lo decida).

## Invariantes que no se relajan
- Aislamiento: cambios solo bajo `subproyecto_academico_alan_aura/`.
- Canon de dominio en cada artefacto; cero requisitos huérfanos; umbral+GQM por requisito de calidad.
- Sin default de modelo de razonamiento; subagentes solo para lo mecánico, auditados.
