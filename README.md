# Alan & Aura Académico

> **MVP conversacional de apoyo emocional realizable en ~1 mes**, derivado y **simplificado** de Smart-AID (Releases 0.1 + 0.2). Repositorio **independiente**, extraído del macroproyecto profesional Smart-AID/TalentTrack.
> Materia: *Diseño y Construcción de Productos de Software* — UNAL Medellín, Facultad de Minas, Grupo 5.
> **Líder / arquitecto:** Jonatan Estiven Sánchez Vargas. · **Integrantes:** Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil.

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
├── 00_PLAN_CODEX_ORIGINAL.md         Fuente primaria (verbatim) del plan de Codex
├── scripts/                          verificar_coherencia.py (validador de coherencia documental)
└── docs/
    ├── 00_gobernanza/                Índice, cápsula, estado, decisiones, changelog, manifiesto, HECHOS_CANONICOS
    ├── 01_vision/                    VIS-01 (visión/alcance) · ADR-001 · ADR-002 (stack vigente: React + Vercel + AWS)
    ├── 02_modelos_verbales/          MV-01 consolidado (vistas Onboarding·Conversación·Seguridad·Administración) + contrato conversacional (E4 simplificado)
    ├── 03_requisitos/                REQ-01 (RF/RNF/calidad/reglas) · PRIV-01 · SEG-01 · PER-01 (mapa de persistencia)
    ├── 04_trazabilidad/              NORM-01 (puente normativo) · TRZ-01 (trazabilidad)
    ├── 05_plan/                      PLAN-01 (plan de proyecto de 1 mes)
    ├── 06_dominio/                   MD-01 (modelo de dominio, PlantUML)
    ├── 07_casos_uso/                 DCU-01 (diagrama de casos de uso) · especificaciones/ ECU-00…ECU-14 · robustez/ DR-00…DR-14
    ├── 08_diseno/                    DIS-00 (inventario + plan) · DIS-01 (sistema de diseño) + 16 mockups de alta fidelidad
    └── 09_informe/                   Informe académico (.docx) para revisión del profesor
```

## Cómo rehidratar contexto (leer en orden)

1. [`docs/00_gobernanza/ESTADO_PIPELINE.md`](docs/00_gobernanza/ESTADO_PIPELINE.md) — en qué fase está el subproyecto y qué sigue.
2. [`docs/00_gobernanza/CAPSULA_CONTEXTO.md`](docs/00_gobernanza/CAPSULA_CONTEXTO.md) — el subproyecto en 5 minutos.
3. [`docs/00_gobernanza/INDICE_MAESTRO.md`](docs/00_gobernanza/INDICE_MAESTRO.md) — qué es cada artefacto, IDs y anclas.
4. [`00_AUDITORIA_PLAN_CODEX.md`](00_AUDITORIA_PLAN_CODEX.md) — de dónde salió el alcance.

## Estado

Paquete documental completo, **repositorio independiente** (SD-18), y **Fase 2 (ICONIX) en curso**: producidos el **modelo de dominio** ([`MD-01 v1.4`](docs/06_dominio/MD-01_modelo_dominio.puml)), el **diagrama de casos de uso** ([`DCU-01 v2.1`](docs/07_casos_uso/DCU-01_casos_uso.puml)), la **especificación textual de los 14 casos de uso** ([`ECU-00…ECU-14`](docs/07_casos_uso/especificaciones/)), el **análisis de robustez** ([`DR-00…DR-14`](docs/07_casos_uso/robustez/)) y la **base de diseño de interfaz** ([`DIS-00`/`DIS-01`](docs/08_diseno/) + 16 mockups de alta fidelidad en claro y oscuro).

La fase 2 pasó por una **primera pasada completa de correcciones** ([`PDR-01`](docs/00_gobernanza/PDR-01_primera_pasada_correcciones.md)), motivada por la retroalimentación docente ([`RET-01`](docs/00_gobernanza/RET-01_retroalimentacion_docente.md)) y por los hallazgos del propio análisis de robustez. Estado medido al cierre: los **cuatro validadores en 0 errores**, las especificaciones también sin advertencias, **76/76 flujos** con criterio de aceptación asociado, **26/26 RF** con caso de uso propio y único, y las **16 clases** del dominio manifestadas en casos de uso y en robustez. Existe un **informe académico** ([`docs/09_informe/`](docs/09_informe/)) para la entrega, pendiente de actualizar a este estado. **Siguiente artefacto ICONIX:** los diagramas de secuencia.

**Arquitectura técnica (2026-08-01, [`ADR-002`](docs/01_vision/ADR-002_reversion_stack_serverless.md)):** la construcción usará **React 19 + Vite + TypeScript** con **Tailwind CSS v4 y shadcn/ui**, desplegado en **Vercel**, y un backend **sin servidor** en AWS — **Lambda** (Node 22) tras **API Gateway**, **DynamoDB** como base operativa y **S3 versionado** para configuración, activos y respaldos—, con **autenticación propia** y **Groq `gpt-oss-20b`** sin cambios como motor conversacional. Supera a `ADR-001-D1/D2/D5` (Django · SQLite · PythonAnywhere), y **ninguna condición de reversa declarada lo disparó**: fue decisión del equipo. La fase 2 de ICONIX **sobrevivió al cambio casi intacta**: los 17 diagramas y las 14 especificaciones no requirieron ningún ajuste, y solo se neutralizaron **dos líneas de prosa** en los anexos de `MD-01` y `DCU-01` — es el rendimiento de haber mantenido el dominio libre de tecnología. Quedan dos hallazgos declarados: `RA-01` de `ECU-03` puede reabrirse, porque cerrar sesión con cookie `httpOnly` exige respuesta del servidor; y **`PER-H5`**, de canon — el respaldo de la base de datos vive en S3 y **escapa al borrado en cascada**, por lo que «eliminar cuenta» no borra el respaldo hasta que se cierre en `ARQ-01`. El **diseño físico** (claves, *endpoints*, inventario de S3) queda para `ARQ-01`, **posterior al diagrama de clases y su CDR**.

## Licencia y derechos

**© 2026 Jonatan Estiven Sánchez Vargas, Santiago Bedoya García, Luis Fernando Montoya Rodríguez y Santiago Eusse Gil. [Todos los derechos reservados](LICENSE).**

Obra colectiva del **Grupo 5**. **Ideación, liderazgo, arquitectura y redacción:** Jonatan Estiven Sánchez Vargas. La **construcción del MVP será trabajo conjunto del equipo**; los créditos de implementación se asignarán cuando esa fase se realice.

Este repositorio se publica para ser **leído y evaluado**, no reutilizado — y la ausencia de licencia abierta es deliberada, no un olvido. Puedes leerlo, evaluarlo, enlazarlo y citar fragmentos breves con atribución. Copiar, modificar, redistribuir, usarlo con fines comerciales o tomarlo como base de otro producto o entregable académico requiere autorización previa. No se concede licencia de patente ni de marca. Las normas y la literatura se **citan, nunca se redistribuyen**: el corpus con derechos queda excluido del control de versiones. Detalle completo en [`LICENSE`](LICENSE).

## Estándares aplicados

Modelo verbal → **E8** (subconjunto de 11 rasgos, checklist verificable). Requisitos → frontera **K** + convención de IDs. Calidad → **SQuaRE / ISO-IEC 25010:2023** (incluida la familia *safety*) con **GQM** y umbral obligatorio. Reglas de negocio → taxonomía **Wiegers**. Puente normativo → mini **D6-bis** reusando cláusulas ya verificadas. Contrato de personajes → **E4** simplificado. Análisis y diseño → **ICONIX** (dominio → casos de uso → especificación textual). Diseño de interfaz → sistema de diseño y mockups **fundamentados en evidencia** (agentes de bienestar, psicología del color, mensajería de crisis, consentimiento por capas, tipografía, accesibilidad WCAG). Canon de dominio en cada artefacto; marcas de evidencia y regla de honestidad heredadas del protocolo de auditoría.
