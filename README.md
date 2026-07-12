# Alan & Aura Académico

> **MVP conversacional de apoyo emocional realizable en ~1 mes**, derivado y **simplificado** de Smart-AID (Releases 0.1 + 0.2). Repositorio **independiente**, extraído del macroproyecto profesional Smart-AID/TalentTrack.
> Materia: *Diseño y Construcción de Productos de Software* — UNAL Medellín, Facultad de Minas, Grupo 20.
> **Autor, ideador y líder:** Jonatan Estiven Sánchez Vargas.

---

## Qué es este repositorio

Es el **paquete documental autocontenido** de la *siguiente fase* del subproyecto académico: los entregables mínimos (visión, decisiones técnicas, modelos verbales, requisitos —funcionales, no funcionales y de calidad—, reglas de negocio, privacidad, protocolo de seguridad, puente normativo, trazabilidad, plan de proyecto y modelo de dominio) que preceden al análisis y diseño ICONIX y a la construcción del MVP.

Nace como **hijo simplificado** del macroproyecto Smart-AID: durante su fase documental vivió como carpeta aislada dentro del repositorio profesional, y fue **extraído aquí** como repositorio independiente el **2026-07-12**. Hereda sus **canones** (§ *Canon de dominio* más abajo) y su **estándar documental**, pero ya no depende de aquel repositorio para existir, construirse o desplegarse.

## Doble horizonte (no confundir)

| Horizonte | Qué es | Dónde vive |
|---|---|---|
| **Académico (este repositorio)** | MVP mínimo, ~1 mes, para la materia. Simplifica sin traicionar el canon. | Este repositorio (`alan-aura-academico`). |
| **Producto (macroproyecto)** | Smart-AID / TalentTrack completo: ecosistema profesional, pipeline de auditoría, arquitectura LLM v2.0 (D22). | Repositorio **separado**, propiedad del mismo autor. No incluido aquí. |

Este repositorio **citó** al macro como fuente durante su fase documental; nunca lo editó, y ya no depende de él. El manifiesto de procedencia (histórico) está en [`docs/00_gobernanza/MANIFIESTO_FUENTES.md`](docs/00_gobernanza/MANIFIESTO_FUENTES.md).

## Los personajes

- 🐕 **Alan** — activación positiva: movimiento, foco, hábitos, afrontamiento conductual. *(Alias históricos del macro: Alanus ≡ Alanor ≡ Alan; en todo artefacto nuevo se escribe **Alan**.)*
- 🐈 **Aura** — regulación profunda: calma, validación, introspección, autocompasión. *(Precursor conceptual del macro: Pandora → Aura.)*

> No son terapeutas: acompañan, orientan y educan; **ante peligro explícito, la personalidad se subordina a un fallback de seguridad determinista** ([`SEG-01`](docs/03_requisitos/SEG-01_protocolo_seguridad.md)).

## Canon de dominio (heredado, innegociable)

- **No sobre-claim clínico:** el chatbot no diagnostica, no hace terapia, no maneja urgencias en autonomía.
- **Minimización de datos:** el LLM recibe una **cápsula de perfil mínima**, nunca el historial en bruto ni ítems/diario/biomarcadores crudos.
- **Consentimiento** granular y revocable; **uso no punitivo**; **divulgación mínima**; **seguridad emocional > engagement**.
- **No persistencia del chat** en el MVP académico (decisión de alcance, ver [`PRIV-01`](docs/03_requisitos/PRIV-01_privacidad_datos.md)).
- **Solo adultos** con *disclosure* de que es una IA; **menores fuera de alcance** (no se asume cobertura).

## Mapa de entregables

```
alan-aura-academico/
├── README.md                         (este archivo)
├── AGENTS.md · CLAUDE.md             Reglas operativas para agentes (canon heredado, sin default de modelo)
├── 00_AUDITORIA_PLAN_CODEX.md        Auditoría breve del plan generado con Codex
└── docs/
    ├── 00_gobernanza/                Índice, cápsula de contexto, estado, decisiones, changelog, manifiesto de fuentes
    ├── 01_vision/                    VIS-01 (visión/alcance) · ADR-001 (decisiones técnicas)
    ├── 02_modelos_verbales/          MV-01 consolidado (vistas Onboarding·Conversación·Seguridad·Administración) + contrato conversacional (E4 simplificado)
    ├── 03_requisitos/                REQ-01 (RF/RNF/calidad/reglas) · PRIV-01 · SEG-01
    ├── 04_trazabilidad/              NORM-01 (puente normativo) · TRZ-01 (trazabilidad)
    ├── 05_plan/                      PLAN-01 (plan de proyecto de 1 mes)
    └── 06_dominio/                   MD-01 (modelo de dominio PlantUML, fase 2 ICONIX)
```

## Cómo rehidratar contexto (leer en orden)

1. [`docs/00_gobernanza/ESTADO_PIPELINE.md`](docs/00_gobernanza/ESTADO_PIPELINE.md) — en qué fase está el subproyecto y qué sigue.
2. [`docs/00_gobernanza/CAPSULA_CONTEXTO.md`](docs/00_gobernanza/CAPSULA_CONTEXTO.md) — el subproyecto en 5 minutos.
3. [`docs/00_gobernanza/INDICE_MAESTRO.md`](docs/00_gobernanza/INDICE_MAESTRO.md) — qué es cada artefacto, IDs y anclas.
4. [`00_AUDITORIA_PLAN_CODEX.md`](00_AUDITORIA_PLAN_CODEX.md) — de dónde salió el alcance.

## Estado

Paquete documental completo, **repositorio independiente ya creado** (SD-18), y **Fase 2 (ICONIX) iniciada**: ya se produjo el **modelo de dominio** ([`MD-01`](docs/06_dominio/MD-01_modelo_dominio.puml), PlantUML). **Fuera de alcance por ahora** (planificados, no producidos): casos de uso, robustez, secuencias, código y grafo/vault propios.

## Estándares aplicados

Modelo verbal → **E8** (subconjunto de 11 rasgos, checklist verificable). Requisitos → frontera **K** + convención de IDs. Calidad → **SQuaRE / ISO-IEC 25010:2023** (incluida la familia *safety*) con **GQM** y umbral obligatorio. Reglas de negocio → taxonomía **Wiegers**. Puente normativo → mini **D6-bis** reusando cláusulas ya verificadas. Contrato de personajes → **E4** simplificado. Canon de dominio en cada artefacto; marcas de evidencia y regla de honestidad heredadas del protocolo de auditoría.
