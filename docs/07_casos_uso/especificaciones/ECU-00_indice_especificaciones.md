# ECU-00 — Índice de especificaciones de casos de uso
**ID:** ECU-00 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Propósito:** índice de las **10 especificaciones textuales** de casos de uso derivadas de `DCU-01` con la skill `use-case-specifier` (paso 3 ICONIX).
**Insumos:** DCU-01 (diagrama), MV-01 (modelo verbal), MD-01 (dominio), REQ-01 (RF/RNF/RC/RN), PRIV-01, SEG-01, contrato conversacional, VIS-01, plan archivado. **Consumidores:** análisis de robustez, diagramas de secuencia, pruebas (fases siguientes).

---

## 1. Las 10 especificaciones
| CU | Nombre | Archivo | Actor primario | Paquete | Forma | RF → OBJ |
|---|---|---|---|---|---|---|
| **CU-01** | Consultar presentación del servicio | [`ECU-01_consultar_presentacion.md`](ECU-01_consultar_presentacion.md) | Visitante | Acceso y cuenta | Ágil | RF-19 → OBJ-7 |
| **CU-02** | Registrar cuenta | [`ECU-02_registrar_cuenta.md`](ECU-02_registrar_cuenta.md) | Visitante | Acceso y cuenta | Ágil | RF-20 → OBJ-7 |
| **CU-03** | Iniciar sesión | [`ECU-03_iniciar_sesion.md`](ECU-03_iniciar_sesion.md) | Usuario (var. Administrador) | Acceso y cuenta | Ágil | RF-14, RF-21 → OBJ-6/7 |
| **CU-04** | Gestionar cuenta y datos personales | [`ECU-04_gestionar_cuenta_datos_personales.md`](ECU-04_gestionar_cuenta_datos_personales.md) | Usuario | Acceso y cuenta | **Completa** | RF-22/23/24 → OBJ-7/4 |
| **CU-05** | Otorgar consentimiento y caracterizar el perfil | [`ECU-05_otorgar_consentimiento_caracterizar_perfil.md`](ECU-05_otorgar_consentimiento_caracterizar_perfil.md) | Usuario | Acompañamiento | **Completa** | RF-01…06 → OBJ-1 |
| **CU-06** | Conversar con el acompañante | [`ECU-06_conversar_con_el_acompanante.md`](ECU-06_conversar_con_el_acompanante.md) | Usuario (sec. Proveedor LLM) | Acompañamiento | **Completa** | RF-07…13/25/26 → OBJ-2/4 |
| **CU-07** | Derivar ante peligro (`<<extend>>` de CU-06) | [`ECU-07_derivar_ante_peligro.md`](ECU-07_derivar_ante_peligro.md) | Usuario (disparo del sistema) | Acompañamiento | **Completa** | RF-11 → OBJ-3 |
| **CU-08** | Consultar directorio de usuarios | [`ECU-08_consultar_directorio.md`](ECU-08_consultar_directorio.md) | Administrador | Administración | Ágil | RF-15 → OBJ-6 |
| **CU-09** | Consultar métricas de uso | [`ECU-09_consultar_metricas.md`](ECU-09_consultar_metricas.md) | Administrador | Administración | Ágil | RF-16 → OBJ-6 |
| **CU-10** | Habilitar o deshabilitar el chatbot | [`ECU-10_habilitar_deshabilitar_chatbot.md`](ECU-10_habilitar_deshabilitar_chatbot.md) | Administrador | Administración | **Completa** | RF-17, RF-18 → OBJ-6 |

## 2. Convención de identificadores
- **Documento:** `DOC-CU-XX`. **Caso de uso:** `CU-XX` (REQ-01 §0 reserva `CU` para la fase 2).
- **Dentro de cada spec:** `PRE-` (precondición), `FA-` (flujo alternativo), `FE-` (flujo de excepción), `RN-` (regla de negocio), `RE-` (requisito especial), `CA-` (criterio de aceptación), `RA-` (riesgo/ambigüedad). **Trazas:** `RF-`/`OBJ-`/`RN-`/`RC-`/`CP-`/`DR-`/`DS-`.

## 3. Mapa a DCU-01
- **1:1 con el diagrama:** 4 actores, 10 casos de uso, 3 paquetes, **1 `<<extend>>`** (CU-07 «Derivar ante peligro» → CU-06 «Conversar»), **0 `<<include>>`**.
- **Equivalencia con el plan §5.3** (`CU-01…06` presupuestados): el plan agrupaba de otro modo (p. ej. «Administrar la plataforma» = un solo CU); aquí se desglosa por trazabilidad en CU-08/09/10. La numeración `CU-01…10` de este paquete es la vigente.

## 4. Profundidad (decisión del usuario, 2026-07-16)
- **Completa (24 secciones, §1–§23):** CU-04, CU-05, CU-06, CU-07, CU-10 — casos canon-sensibles (eliminación en cascada, consentimiento/minimización, conversación gobernada, *fail-safe*, kill switch auditado).
- **Ágil (núcleo ICONIX / plantilla §23):** CU-01, CU-02, CU-03, CU-08, CU-09 — casos simples de un escenario. Incluyen igual su bloque de trazabilidad y su checklist §22.

## 5. Cobertura de trazabilidad (cero RF huérfanos)
Los **26 RF** de REQ-01 aparecen en el §19/§Trazabilidad de ≥1 especificación:

| RF | CU | RF | CU | RF | CU |
|---|---|---|---|---|---|
| RF-01 | CU-05 | RF-10 | CU-06 | RF-19 | CU-01 |
| RF-02 | CU-05 | RF-11 | CU-07 | RF-20 | CU-02 |
| RF-03 | CU-05 | RF-12 | CU-06 | RF-21 | CU-03 |
| RF-04 | CU-05 | RF-13 | CU-06 | RF-22 | CU-04 |
| RF-05 | CU-05 | RF-14 | CU-03 | RF-23 | CU-04 |
| RF-06 | CU-05 | RF-15 | CU-08 | RF-24 | CU-04 |
| RF-07 | CU-06 | RF-16 | CU-09 | RF-25 | CU-06 |
| RF-08 | CU-06 | RF-17 | CU-10 | RF-26 | CU-06 |
| RF-09 | CU-06 | RF-18 | CU-10 | — | — |

→ **26/26 cubiertos, cero huérfanos.** (Poblada la columna CU de `TRZ-01`.)

## 6. Gate de calidad (verificación documental)
La skill `use-case-specifier` **no** trae validador ejecutable (a diferencia de MD-01/DCU-01, con `validate_*.py`). La verificación es **documental**: cada spec **embebe su checklist §22 (20 ítems)** como evidencia, y todas pasaron el **loop de auditoría** del orquestador (checklist §22 + rúbrica de severidades + «8 pasos» + traza *backward* concepto∈MD-01 / actor·relación∈DCU-01 / flujo∈MV-01 + matriz de canon §5) **sin hallazgos Crítico/Mayor**. Los borradores mecánicos (CU-01/02/03/08/09) se auditaron antes de incorporarse.

## 7. Reconciliación RA-01 (cerrada — SD-22)
- **RA-01 (nº de campos al LLM) — RESUELTA (SD-22):** se adopta la definición del plan §3.4 (`ContextoInicialConversacionalV1`): la cápsula = **5 campos de contenido** (`mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style`, `character`) **+ 2 metadatos** (`schema_version`, `consent_version`). Se descarta el colapso a 3 campos. Propagado a RN-01.3 (MV-01), RF-04/RF-05 (REQ-01), PRIV-R1 e inventario §2 (PRIV-01), MD-01 §6 y a CU-04/CU-05/CU-06 (§7/§18/§21). **PRIV-R9 (lista de prohibidos al LLM) intacta**; sigue siendo minimización.

## 8. Siguiente paso ICONIX
**Análisis de robustez** (`DR-01…DR-10`) por caso de uso, reusando los objetos de frontera/entidad/control ya insinuados en cada flujo; luego diagramas de secuencia (`DS-XX`) y pruebas (`CP-XX`).

**Fin de ECU-00.**
