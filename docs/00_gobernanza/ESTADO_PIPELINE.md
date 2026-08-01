# Estado del subproyecto — «Alan & Aura Académico»
**Propósito:** decir en qué fase está el subproyecto y qué sigue. Es el primer archivo a leer al rehidratar contexto. **Fecha de creación:** 2026-07-12 · **Última actualización:** 2026-08-01 · **Versión:** v1.4 (corrige el conteo de `.puml` de la Fase 2: son **16**, no 17 — contados por comando; el 17 provenía de conflación con `H-12`, las 17 relaciones de `MD-01`).

---

## Dónde estamos
Fase **1 cerrada** y **Fase 2 (ICONIX) avanzada**: producidos y verificados los cinco primeros artefactos — el **modelo de dominio `MD-01 v1.4`** (`docs/06_dominio/`, 16 clases), el **diagrama de casos de uso `DCU-01 v2.1`** (`docs/07_casos_uso/`, 14 casos de uso), la **especificación textual `ECU-00…ECU-14`** (`docs/07_casos_uso/especificaciones/`), el **análisis de robustez `DR-00…DR-14`** (`docs/07_casos_uso/robustez/`, 261 elementos) y la **compuerta ICONIX `RPD-01`** entre análisis y diseño detallado (`docs/07_casos_uso/RPD-01_revision_preliminar_diseno.md`).

Ese conjunto pasó por una **primera pasada completa de correcciones** — `PDR-01` (`docs/00_gobernanza/PDR-01_primera_pasada_correcciones.md`), motivada por la retroalimentación docente de 4 puntos (`RET-01`) y los 15 hallazgos de desambiguación del certificado de robustez v1 — y luego por la **Revisión Preliminar del Diseño** propiamente dicha (`RPD-01`, skill `iconix-pdr-review`), cuyo veredicto es **Aceptado con verificación de retrabajo** (un hallazgo mayor real, corregido en la misma sesión; el resto, moderado o menor, ya cerrado o declarado). **No confundir los dos "PDR":** `PDR-01` es el registro de gobernanza de la pasada de correcciones; `RPD-01` es el acta formal de la compuerta ICONIX (*Preliminary Design Review*) — el acrónimo coincide por casualidad y cada documento lo aclara en su cabecera.

**Estado medido y reproducible:** los **cuatro validadores en 0 errores** (`MD-01`, `DCU-01`, las 14 especificaciones —también 0 advertencias—, los 14 diagramas de robustez con `--domain MD-01`). Las especificaciones cubren el **100 % de sus 76 flujos** con un criterio de aceptación asociado. Los **26 RF** tienen caso de uso propio y único, y las **16 clases** del dominio se manifiestan en al menos un caso de uso y en al menos un diagrama de robustez (`TRZ-01` §5.1 y §5.2, verificado por script contra los `.puml`, 0 discrepancias). No hay código ni pilotos, por diseño. La rama de correcciones (`pdr-01-correcciones`) ya está fusionada y publicada en `main`. Siguiente artefacto ICONIX: **diagramas de secuencia** (`DS-XX`, skill `uml-sequence-diagram`, ya disponible).

## Fases del subproyecto

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Delimitación de alcance (plan generado con Codex) | ✅ cerrada (insumo externo) |
| 1 | **Auditoría del plan + artefactos documentales mínimos** (esta fase) | ✅ **cerrada (2026-07-12)** |
| 2 | Análisis y diseño ICONIX (dominio → CU → especificación → robustez → **RPD** → secuencia → clases) | 🟩 **avanzada** — `MD-01` ✅ · `DCU-01` ✅ · `ECU-00…14` ✅ · `DR-00…14` ✅ · `RPD-01` ✅ (2026-07-31, aceptado con verificación de retrabajo); **secuencia** pendiente |
| 3 | Construcción del MVP (React + Vercel · Lambda/API Gateway · DynamoDB/S3 · LLM gobernado · gate de seguridad) | ⬜ planificada — stack decidido en `ADR-002` |
| 4 | Verificación, despliegue académico y entrega | ⬜ planificada |

## Primera pasada de correcciones (`PDR-01`) y compuerta `RPD-01` — resumen (2026-07-31)

Detalle completo en `PDR-01_primera_pasada_correcciones.md` y `RPD-01_revision_preliminar_diseno.md` (`docs/07_casos_uso/`); evidencia punto por punto de la retroalimentación docente en `RET-01_retroalimentacion_docente.md`.

| Artefacto | Antes | Después |
|---|---|---|
| `MD-01` | v1.2, 12 clases, 12 relaciones | **v1.4**, 16 clases, 17 relaciones |
| `DCU-01` | v1.0, 4 actores, 10 casos de uso | **v2.1**, 5 actores, 14 casos de uso |
| Especificaciones | 10 + índice, 18 errores de validador | **14 + índice, 0 errores y 0 advertencias** |
| Robustez | 10 diagramas, 179 elementos | **14 diagramas, 261 elementos**, 0 errores |
| Compuerta ICONIX | no ejecutada | **`RPD-01`: aceptado con verificación de retrabajo** |

Decisiones nuevas que introdujo: el `Consentimiento` se separa en **capa base** y **capa de personalización**; el límite por mensaje sube de 1.500 a **2.500 caracteres**; «acompañante» se declara alias de producto en uso activo de `Personaje`. Reversiones declaradas (no disimuladas): `Visitante` pasa a ser clase de dominio; `EventoOperativo` deja de ser «vista derivada, no clase».

## Entregables de la Fase 1 (esta ejecución)

| ID | Artefacto | Estado |
|---|---|---|
| — | Gobernanza (README, AGENTS, CLAUDE, índice, cápsula, estado, decisiones, changelog, manifiesto) | ✅ |
| — | `00_AUDITORIA_PLAN_CODEX` — auditoría breve del plan | ✅ |
| VIS-01 | Visión, objetivos, alcance, exclusiones, definición de «MVP terminado» | ✅ |
| ADR-001 | Decisiones técnicas (stack) con condiciones de reversa | ✅ — **D1/D2/D5 superadas por `ADR-002`** |
| ADR-002 | Reversión del stack a arquitectura sin servidor (React + Vercel + AWS) — *añadido 2026-08-01, SD-29* | ✅ |
| — | `HECHOS_CANONICOS.md` — fuente única de las cifras repetidas + `scripts/verificar_coherencia.py` — *añadidos 2026-08-01, SD-29* | ✅ |
| MV-01 | Modelo verbal **consolidado** (vistas onboarding/conversación/seguridad/administración) + contrato E4 simplificado; apto para extracción de dominio | ✅ |
| REQ-01 | RF/RNF + requisitos de calidad (25010:2023 + GQM + umbral) + reglas tipadas | ✅ |
| PRIV-01 | Privacidad, minimización, retención, no-persistencia | ✅ |
| PER-01 | Mapa de persistencia (7 entidades, reglas transversales, hallazgos) — *añadido 2026-07-25, SD-25* | ✅ |
| SEG-01 | Protocolo de seguridad (gate binario + fallback) | ✅ |
| NORM-01 | Puente normativo (mini D6-bis) | ✅ |
| TRZ-01 | Matriz de trazabilidad (cero huérfanos) | ✅ |
| PLAN-01 | Plan de proyecto de 1 mes | ✅ |

## Fuente primaria archivada y reconciliada (SD-16/SD-17, 2026-07-12)
`00_PLAN_CODEX_ORIGINAL.md` — texto completo verbatim del plan de Codex. **Reconciliación APLICADA** (SD-17) contra los 5 puntos identificados al comparar con la reconstrucción forense previa:
1. ✅ Historial de sesión (hasta 4 intercambios, no "cero historial") — MV-01 RN-02.2/RN-03, REQ-01 RF-09/RNF-04, PRIV-01 PRIV-R1, CONTRATO C-4/CA-4.
2. ✅ Límites de tasa exactos (3/min, 30/día, 20s timeout, **2.500 caracteres**, 350 tokens) — MV-01 RN-02.8/RN-02.9, REQ-01 RF-25/26/RNF-10, TRZ-01. El límite por mensaje se elevó de 1.500 a 2.500 en el PDR-01.
3. ✅ Inventario de PRIV-01 mapeado 1:1 a las 7 entidades del plan (`User`/`ConsentRecord`/`InitialConversationProfile`/`PlatformSetting`/`DailyUsageCounter`/`OperationalEvent`/`AdministrativeAction`).
4. ✅ Tabla de personajes del contrato enriquecida (P-1..P-8: función/tono/respuesta típica/preguntas/sugerencias/longitud/límites).
5. ✅ Plantilla del fallback citada en SEG-01 §5 (sin números fijos, respeta SD-12).
6. ⬜ Tabla de endpoints (§4.9 del plan) — diferida a `ARQ-01`, junto con el diseño de claves de DynamoDB y el inventario físico de S3. `ARQ-01` llega **después del diagrama de clases de diseño y de su CDR** (`ADR-002 §1`): fijar esquemas mientras el diagrama de clases aún puede mover atributos y operaciones garantiza retrabajo.
7. ✅ **Cápsula de 5 campos (SD-22, RA-01 cerrada, 2026-07-16):** el LLM recibe `ContextoInicialConversacionalV1` (5 de contenido + 2 metadatos), no la cápsula de 3 campos — MV-01 RN-01.3/§3/§13.1, REQ-01 RF-04/05, PRIV-01 PRIV-R1/§2, MD-01 §6, ECU-04/05/06/00. Sigue siendo minimización; PRIV-R9 intacta.

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

## Arquitectura técnica decidida (`ADR-002`, 2026-08-01)

El stack pasa de **Django 5.2 + SQLite + PythonAnywhere** a **React 19 + Vite + TypeScript sobre Vercel**, con backend **sin servidor** en AWS (**Lambda** en Node 22 tras **API Gateway**, **DynamoDB** como base operativa y **S3 versionado** para configuración, activos y respaldos), componentes **Tailwind v4 + shadcn/ui sobre Base UI**, y **autenticación propia** (Argon2id + cookie firmada). **Groq `gpt-oss-20b` se mantiene.**

Tres cosas que conviene tener presentes al leer esto:

1. **Ninguna condición de reversa declarada disparó el cambio** — fue decisión del equipo (SD-29), no contingencia prevista. `ADR-002 §0` lo dice expresamente.
2. **La fase 2 no se tocó.** Los 16 `.puml` y las 14 `ECU` no contenían ni una mención del stack; solo se neutralizaron **dos líneas de anexo** en `MD-01.md` y `DCU-01.md`, y por categoría, no por producto, para que no vuelvan a caducar. Es el rendimiento de haber mantenido el dominio libre de tecnología.
3. **Se decidieron motores, no esquemas.** El diseño de claves, la tabla de *endpoints* y el inventario de S3 van a `ARQ-01`, **tras el CDR**.

**Consecuencias nuevas declaradas y no resueltas:** la protección CSRF hay que construirla (frontend y backend dejan de compartir origen), el arranque en frío presiona sobre `RC-05`, la región de AWS abre una pregunta de residencia de datos bajo la Ley 1581 (`PRIV-01 §4.1`), y **los respaldos en S3 escapan al borrado en cascada** (`PER-H5`, de canon — ver arriba, punto 7 de «Qué sigue»).

## Qué sigue
1. **Diagramas de secuencia `DS-01…DS-14`** (siguiente artefacto ICONIX): la skill `uml-sequence-diagram` ya está disponible. Convierte cada controlador de robustez en un mensaje, asigna operaciones a las clases del dominio y produce el delta de operaciones + los casos de prueba que consume. Con **149 controladores** en los 14 diagramas de robustez, esa es la cota inferior de casos de prueba (`CP-XX`) que resultarán.

   > **Cómo responder a la pregunta de la capa de infraestructura.** La skill activa esa capa cuando hay framework declarado, y ahora lo hay (`ADR-002`). **La respuesta es: no ejecutarla, y declararla como *no ejecutada* en el certificado** —la propia skill dice que sin ella *«el diagrama sale neutral y válido»*, pero también que una capa no ejecutada *«se declara, nunca se silencia»*. Motivo: el diseño físico está diferido a `ARQ-01`, tras el CDR. Los participantes se derivan **solo** de los `DR-XX`, sin añadir participantes de infraestructura (`INF_`); la única frontera con sistema externo es la ya aprobada en `DR-06` (Proveedor LLM). Razón de fondo: el **delta de operaciones** del `DS` es la entrada del diagrama de clases, y si llega contaminado con repositorios y manejadores, el CDR acabaría revisando decisiones que aún no se han tomado.
2. **Propagación pendiente de `RPD-01`** (no bloquea, pero está declarada): dos hallazgos menores de la compuerta quedaron abiertos sin acción propia — dos defectos documentados en el validador `validate_pdr.py` de la skill `iconix-pdr-review` (fuera del alcance de este subproyecto: se reportan para quien mantenga la skill) y la guía #4 (participación técnica y no técnica), que exige una sesión con más de un rol y no se pudo ejercer en esta pasada.
3. **Informe académico** (`docs/09_informe/Informe_Academico_Alan_Aura.docx`): sigue reflejando el estado anterior a `PDR-01`/`RPD-01` **y además describe el stack anterior** — se comprobó que contiene menciones vivas de Django, SQLite y PythonAnywhere, superados por `ADR-002`. Es el único artefacto que el profesor lee de principio a fin, y **ningún validador lo cubre**: `verificar_coherencia.py` solo recorre archivos `.md`, así que el `.docx`, los *mockups* `.html` y los `.puml` quedan fuera del barrido por diseño. **Pendiente de actualizar antes de la próxima entrega**, ahora por dos motivos en vez de uno.
4. Revisión del usuario de VIS-01/ADR-001/REQ-01 (validaciones nivel 6: servicios externos y frontera legal) — sigue abierta desde la Fase 1.
5. **Diseño de interfaz (SD-23, cerrado):** base visual producida — `docs/08_diseno/DIS-00` (inventario de 16 pantallas + plan) y `DIS-01` (sistema de diseño con contraste AA, doble voz Alan/Aura, semilla teal/ámbar), más **16 mockups de alta fidelidad** (claro/oscuro, estados no-felices, contención). `PDR-01` reasignó tres pantallas a los casos de uso nuevos (P-13 → CU-04/11/12, P-09 → CU-14, P-10 → +CU-13); el resto del inventario sigue vigente.
6. **Mapa de persistencia (SD-25, cerrado):** `docs/03_requisitos/PER-01_mapa_persistencia.md` consolida qué se guarda en la BD, qué nunca se persiste y las reglas transversales del esquema (`PER-T1…T7`). `PDR-01` le añadió la tabla de correspondencia nombre de persistencia ↔ clase del dominio y reparó las citas que la renumeración de casos de uso rompió. **Insumo directo del modelo de datos**, que sigue fuera de alcance.
7. **Hallazgos de persistencia:** `PER-H1` y `PER-H3` (cerrados en SD-26, antes de robustez). `PER-H2` sigue abierto (detalle de diseño, ahora entrelazado con `PER-H5`); `PER-H4` (campos de `ContadorDeUsoDiario`) sigue abierto, no bloquea. **`PER-H5` (nuevo, SD-29, de canon):** `ADR-002-D6` puso los respaldos de la base de datos en S3, y ese respaldo **escapa al borrado en cascada** — ninguna regla vigente lo alcanza, así que `RF-24` («no queda dato asociado recuperable») **no se cumple de extremo a extremo** hasta cerrarlo. Abierto y declarado a propósito; debe resolverse en `ARQ-01` **antes de cualquier uso con personas reales**, junto con `V6-b`.
8. **`AccionAdministrativa`** permanece deliberadamente fuera de `MD-01` (auditoría de operación, no concepto del problema) — decisión reafirmada en `RPD-01` H-02, marcada en `DR-10` para que siga siendo discutible.
9. Diferido explícito: repo git separado (✅ ejecutado, SD-18).
10. **Grafo de conocimiento propio del subproyecto (SD-27, cerrado 2026-07-25):** `grafo/` — 2.876 nodos, vault de Obsidian trazable. **No se ha regenerado** desde entonces: no incluye `MD-01 v1.4`, `DCU-01 v2.1`, las 14 ECU, los 14 DR, ni `PDR-01`/`RET-01`/`RPD-01`. Instructivo de uso: `GUIA_USO_GRAFO_Y_VAULT.md` (raíz).

## Invariantes que no se relajan
- **Independencia** (SD-18): el subproyecto no depende del macroproyecto; toda mención a él es cita de procedencia histórica, nunca una referencia funcional viva.
- Canon de dominio en cada artefacto; cero requisitos huérfanos; umbral+GQM por requisito de calidad.
- Sin default de modelo de razonamiento; subagentes solo para lo mecánico, auditados por el orquestador antes de incorporarse.
- **Trinquete:** no degradar lo ya construido y verificado. Corregir con evidencia (validador o comando), no por afirmación.
