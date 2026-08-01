# Changelog — Subproyecto «Alan & Aura Académico»
Formato: fecha · versión · cambios. Solo se registran hitos del paquete documental (no ediciones menores).

---

## 2026-07-31 — v0.15.0 · PDR-01, primera pasada de correcciones de la fase 2 (SD-28)
- **Detonantes:** los **4 puntos de la retroalimentación docente** sobre el modelo de dominio y el diagrama de casos de uso, y los **15 hallazgos de desambiguación** que el propio análisis de robustez había producido. Registro completo en `PDR-01_primera_pasada_correcciones.md`; evidencia por punto en `RET-01_retroalimentacion_docente.md`.
- **`MD-01` v1.2 → v1.4:** 12 → **16 clases** y 12 → **17 relaciones**. Entra el supertipo `TitularDeCuenta` con `Usuario` y `Administrador` como especializaciones (punto 1), y `Visitante` pasa a ser clase (punto 2). En v1.4, cuatro etiquetas de relación se reescriben como relaciones estables de dominio al ejecutar por primera vez las compuertas de la skill.
- **`DCU-01` v1.0 → v2.1:** de 4 actores y **10 casos de uso** a 5 actores y **14**, con 1 `<<include>>` y 2 `<<extend>>`. Responde al punto 3: **13 de los 26 RF no tenían manifestación gráfica**; ahora los 26 tienen caso de uso propio y único.
- **Especificaciones 10 → 14 + índice:** de **18 errores y 50 advertencias** del validador a **0 y 0**, con el **100 % de sus 76 flujos** cubiertos por un criterio de aceptación asociado. Dos renombradas: «Iniciar **y cerrar** sesión» y «…**crear la cápsula de perfil**».
- **Robustez 10 → 14 diagramas:** los diez anteriores derivaban de un texto que dejó de existir. **260 elementos**, 0 errores, cobertura de flujos completa, 14 SVG regenerados y `DR-00` reescrito.
- **Propagado y verificado aguas arriba:** `MV-01` (2.500 caracteres; `EventoOperativo` reclasificado como clase), `REQ-01`, `TRZ-01` (**§5.1 matriz clase ↔ caso de uso** y **§5.2 visibilidad RF → CU**, que responden al punto 4), `PER-01` (tabla de correspondencia persistencia ↔ dominio), `PRIV-01` (las dos capas del consentimiento), `DIS-00` (dos afirmaciones falsas retiradas).
- **Decisiones nuevas:** el `Consentimiento` se separa en **capa base** y **capa de personalización**; el límite por mensaje sube a **2.500 caracteres**; «acompañante» se declara **alias de producto en uso activo** de `Personaje`.
- **Reversiones declaradas, no disimuladas:** `Visitante` como clase, contra el criterio de MV-01 §3/§14; y `EventoOperativo` como clase, contra MV-01 §13.2.
- **Auditoría:** cada documento pasó por un auditor independiente y un escéptico refutador. 146 hallazgos, 70 refutados, **76 sostenidos**; ningún crítico sobrevivió. Los once mayores eran todos la misma falta: **afirmar más de lo que la fuente sostiene**.
- **Actualizado:** `INDICE_MAESTRO`, `ESTADO_PIPELINE`, `REGISTRO_DECISIONES` (SD-28), `README`.

## 2026-07-25 — v0.14.0 · Grafo de conocimiento propio del subproyecto (SD-27)
- **Añadido:** `grafo/` — grafo de conocimiento **propio del subproyecto**, aislado del macroproyecto (`README.md`, `graph_subproyecto_final.json`, `vault/`, `scripts/`). Cierra/ejecuta el diferido de SD-11.
- **Origen:** construido en el proyecto principal (`SmartAID/grafo_subproyecto/`) sobre **copias**; los artefactos originales del macro (`graphify-out/`, `vault_obsidian/`) nunca se modificaron — verificado por hash SHA256 antes y después de cada etapa.
- **Composición:** **2.876 nodos** = 262 extraídos de los 37 `.md` de `docs/` + 2.614 de un grafo de solo libros y normas (sin ningún nodo de Smart-AID/TalentTrack). 2.893 aristas, 249 hiperaristas, 769 comunidades (55 nuevas del subproyecto + 714 de conocimiento), 34 puentes `same_as`.
- **Extracción:** con el modelo **Opus** vía `graphify extract`, por subcarpeta y en `--mode deep` — un primer intento en bloque dio resultados pobres (40 nodos, esencialmente un índice) y se descartó.
- **Nombrado de comunidades:** generado con Opus. Se detectó que `graphify label --missing-only` re-clusterizaba **todo** el grafo como efecto secundario (alteraba 2.162 de los 2.614 nodos de conocimiento); se rechazó ese resultado y se injertaron solo los 55 nombres nuevos por voto mayoritario a nivel de nodo, dejando las 714 comunidades de conocimiento intactas (verificado: 0 diferencias de id/comunidad/nombre).
- **Trazabilidad del vault:** las 2.876 notas de concepto enlazan a su documento fuente. Los 37 `.md` del subproyecto y los 25 libros/normas de texto están copiados en `grafo/vault/02_Fuentes/`. **Decisión no obvia (1):** las ~882 figuras extraídas de los libros (~109 MB) **no** se duplican — pesan más de 10× el texto y son material con derechos.
- **Decisión no obvia (2) — licencia:** `grafo/vault/02_Fuentes/Conocimiento/` (9,8 MB de libros y normas con derechos: PMBOK 7, ISO/IEC 90003, ISO/IEC 25010/25020, Wiegers…) queda en `.gitignore` a propósito — el vault es autocontenido en disco, pero el repositorio no redistribuye material licenciado.
- **Actualizado:** `INDICE_MAESTRO` (fila `grafo/`), `REGISTRO_DECISIONES` (SD-27).

## 2026-07-25 — v0.13.0 · Cierre de PER-H1 y PER-H3 (SD-26)
- **Resuelto PER-H1:** la `CapsulaDePerfil` **siempre existe** al terminar el onboarding, con `character` como contenido mínimo. `character` se **reclasifica** como *elección de interlocutor* y **precondición funcional** del chat —del mismo rango que el consentimiento—, no como autorreporte de perfil. Se elige esta opción porque **no reabre SD-22**: lo que recibe el LLM (RN-01.3, `ContextoInicialConversacionalV1`) queda intacto.
- **Nueva regla RN-01.6** y **RN-01.4 precisada** («ningún **autorreporte** de la caracterización es obligatorio»; obligatorios son edad, consentimiento y `character`). **Cardinalidad fijada:** `Usuario–CapsulaDePerfil` = **1 a 1 tras el onboarding**.
- **Consecuencia aceptada y documentada:** reiniciar la caracterización (RF-22) borra también `character` ⇒ el usuario queda **sin poder conversar** hasta rehacer CU-05 (PRE-02 ya lo permitía).
- **Resuelto PER-H3:** el `estado` del directorio administrativo queda acotado a **{activo, sin consentimiento vigente}**, **derivado** de `ConsentRecord` — no editable, no almacenado aparte, y **no** es una suspensión individual (fuera de alcance, VIS-01 §5). Compatible con PRIV-R10.
- **Abiertos por decisión:** PER-H2 (RF-24 «sin remanentes» vs. retención +30 días — se resuelve en construcción, con el hosting a la vista) y PER-H4 (campos de `DailyUsageCounter` — detalle de diseño). Ninguno bloquea el análisis de robustez.
- **Momento:** ambos se cerraron **antes** de entrar a robustez, para que `DR-04`/`DR-05`/`DR-06` no heredaran la contradicción.
- **Propagado (loop de auditoría hasta converger):** MV-01 **v2.5** (RN-01.4 precisada, +RN-01.6, RN-03.2, Parte A §4), REQ-01 **v1.4** (RF-04/05/15, taxonomía Wiegers), PRIV-01 **v1.4** (inventario §2, PRIV-R10), TRZ-01 **v1.5** (RN-01.6 trazada desde RF-04/05, **cero reglas huérfanas**), ECU-05 **v1.1** (FA-01, §4, §11, §14, §15, §18, CA-05, RA-04, §23), ECU-04 **v1.1** (FA-01, §14, CA-02), ECU-08 **v1.1** (§2.1, RN-03.2, CA-01), PER-01 **v1.1**, y el mockup `p14_admin_directorio.html` (la etiqueta «Inactivo» pasa a «Sin consentimiento»).
- **Verificación:** `grep` de «sin cápsula» = solo FE-01 de ECU-05 (menor de edad, correcto) y las citas históricas del propio hallazgo; `grep` de «Inactivo» = 0; RN-01.6 presente en MV-01, REQ-01, TRZ-01, PER-01 y ECU-05.

## 2026-07-25 — v0.12.0 · Mapa de persistencia PER-01 (SD-25)
- **Añadido:** `docs/03_requisitos/PER-01_mapa_persistencia.md` — **inventario consolidado de persistencia**: qué información sobrevive a la sesión, dónde vive, quién la ve y cuánto dura. Reúne en un solo artefacto lo que estaba disperso entre el plan §4.14/§4.15, `PRIV-01` §2 y las ECU.
- **Contenido:** las **7 entidades** del plan (`User`, `ConsentRecord`, `InitialConversationProfile`, `PlatformSetting`, `DailyUsageCounter`, `OperationalEvent`, `AdministrativeAction`) con sus campos trazados uno a uno; la lista de lo que **nunca** se persiste; **7 reglas transversales** (`PER-T1…T7`: cascada, no reidentificación, segregación del admin, directorio truncado, purga por ventana, hash, reinicio≠revocación); mapa de relaciones; y la frontera externa de retención del proveedor LLM (V6-a).
- **Precisión nueva:** los campos exactos de `OperationalEvent` provienen del **plan §4.15** (8 campos incluidos / 8 exclusiones), que hasta ahora no se había citado en ningún artefacto — incluye que **no** se guarda el motivo textual del *fallback* ni la categoría emocional (refuerza PRIV-R6, uso no punitivo).
- **Hallazgos abiertos declarados:** `PER-H1` (contradicción: `character` obligatorio en la cápsula vs. FA-01 de ECU-05 «continúa sin cápsula» vs. RN-01.4 — **bloquea el modelo de datos**), `PER-H2` (RF-24 «sin remanentes» vs. retención +30 días; heredado de RA-01 de ECU-04), `PER-H3` (el campo `estado` del directorio no tiene dominio de valores definido), `PER-H4` (campos de `DailyUsageCounter` sin especificar).
- **Corrección de honestidad (§4.9):** durante el análisis previo se afirmó que «plan §4.14 no existe en este repositorio»; **era falso** — está en `00_PLAN_CODEX_ORIGINAL.md` (fuente primaria archivada en SD-16). El error fue buscar en `PLAN-01_plan_proyecto.md`. Queda corregido explícitamente en PER-01 §8. La regla de independencia (CLAUDE.md §0) **se cumple**.
- **Alcance respetado:** PER-01 **no** adelanta diseño (CLAUDE.md §6) — sin tipos, claves, índices, DDL ni diagrama de clases; **cero requisitos nuevos** (solo consolida y traza los existentes).
- **Actualizado:** `INDICE_MAESTRO` (fila PER-01 + estándar), `ESTADO_PIPELINE`, `REGISTRO_DECISIONES` (SD-25), `README` (mapa de entregables).

## 2026-07-18 — v0.11.2 · Corrección: mockups persistidos como archivos (SD-24)
- **Corregido:** los 16 mockups + style-tile de SD-23 se habían renderizado solo en la conversación, sin escribirse al repositorio (`git status` no los mostraba). El usuario lo detectó al no verlos en GitHub.
- **Añadido:** `docs/08_diseno/mockups/` con 19 archivos HTML autocontenidos — `00_style_tile.html`, `p01…p16` (con `p10` en variante clara y oscura), `index.html` (galería con navegación por paquete). Colores hardcoded (mismos hex de DIS-01), iconos Tabler vía CDN, sin dependencias externas al proyecto.
- **Actualizado:** `DIS-00` (columna «Archivo» con enlace real por pantalla, §6 nuevo) y `DIS-01` (§8 nuevo, puntero a la galería).

## 2026-07-18 — v0.11.1 · Enlace del §17 de las ECU al diseño + informe académico
- **Enlazado:** el §17 (Prototipos/GUI) de las 5 specs completas y la trazabilidad de las 5 ágiles ahora referencian `docs/08_diseno/DIS-00`/`DIS-01` y la(s) pantalla(s) `P-XX` correspondiente(s) — cierra el diferido de SD-23.
- **Añadido:** `docs/09_informe/Informe_Academico_Alan_Aura.docx` — informe académico completo del proyecto (portada, tabla de contenido, resumen, objetivos, metodología ICONIX, desarrollo por fases, arquitectura, trazabilidad, calidad ISO/IEC 25010, diseño de interfaz, conclusiones, referencias y anexos) para revisión del profesor. Integrantes: Jonatan E. Sánchez Vargas (líder), Santiago Bedoya García, Luis Fernando Montoya Rodríguez, Santiago Eusse Gil.

## 2026-07-16 — v0.11.0 · Base de diseño de interfaz: sistema + mockups (SD-23)
- **Añadido:** `docs/08_diseno/` con `DIS-00_inventario_y_plan.md` (investigación con fuentes, inventario de 16 pantallas, plan por pantalla) y `DIS-01_sistema_diseno.md` (tokens con contraste AA, doble voz Alan/Aura, biblioteca de componentes).
- **Fundamento (evidencia):** 6 hallazgos citados (alianza terapéutica Wysa/Woebot, psicología del color, mensajería de crisis segura, consentimiento por capas, tipografía humanista, movimiento accesible) — cada decisión trazada en DIS-01 §0.
- **Semilla de arte:** base calma-dominante (neutros cálidos + tonos fríos); **Aura teal** `#3E8E82` / **Alan ámbar** `#D98A2B`; crisis en tono *grounding* (nunca rojo de alarma).
- **Mockups:** 16 pantallas de alta fidelidad renderizadas en la conversación (claro y oscuro, con estados de error/degradación y la pantalla de contención/derivación), por paquetes (Acceso y cuenta · Acompañamiento · Administración).
- **Canon:** no clínico · disclosure antes de capturar datos · seguridad > engagement (sin gamificación ni dark patterns) · minimización · admin sin datos individuales · AA + reduce-motion.
- **Diferido (opcional):** poblar el §17 de cada ECU con enlace a DIS-00/DIS-01.

## 2026-07-16 — v0.10.0 · Reconciliación RA-01: cápsula de 5 campos (SD-22)
- **Decidido (usuario):** el LLM recibe `ContextoInicialConversacionalV1` (plan §3.4) = **5 campos de contenido** (`mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style`, `character`) **+ 2 metadatos** (`schema_version`, `consent_version`), en lugar de la cápsula de 3 campos {preferenciaDePersonaje, focoEmocional, tonoPreferido}. **RA-01 cerrada.**
- **Propagado (loop de auditoría hasta converger):** MV-01 (RN-01.3 raíz, §3, §13.1 — **v2.4**), REQ-01 (RF-04/05 — **v1.3**), PRIV-01 (inventario §2, PRIV-R1 — **v1.3**), CONTRATO (C-4), MD-01 §6, ECU-04/05/06 (§7/§18/§21), ECU-00 §7, TRZ-01 (RF-04/05 — **v1.4**).
- **Canon:** sigue siendo minimización (autorreportes gruesos de 3–5 puntos, sin historial/diario/biomarcadores); **PRIV-R9 intacta** (lista de prohibidos al LLM). Refuerza la revisión legal V6-b.
- **Verificación:** `grep` de `preferenciaDePersonaje|focoEmocional|tonoPreferido` = 0; `3 campos` solo en los 2 falsos positivos de registro; `RA-01` solo como «Resuelto (SD-22)».

## 2026-07-16 — v0.9.0 · Especificación textual de casos de uso ECU-00…ECU-10 (SD-21)
- **Añadido:** `docs/07_casos_uso/especificaciones/` con el índice `ECU-00` y las **10 especificaciones** `ECU-01…ECU-10`, generadas con la skill `use-case-specifier` a partir de DCU-01, MV-01, MD-01, REQ-01, PRIV-01, SEG-01, contrato y el plan archivado.
- **Forma:** **completa** (§1–§23) en CU-04/05/06/07/10 (canon-sensibles: eliminación en cascada, consentimiento/minimización, conversación gobernada, *fail-safe*, kill switch auditado); **ágil** (§23) en CU-01/02/03/08/09. Empaquetado un archivo por CU + índice.
- **Trazabilidad:** los **26 RF** de REQ-01 cubiertos sin huérfanos; poblada la **columna CU** de `TRZ-01`.
- **Gate de calidad:** la skill **no** trae validador ejecutable → cada spec **embebe su checklist §22 (20 ítems)** y todas pasaron el loop de auditoría del orquestador (rúbrica + 8 pasos + traza *backward* + canon §5) **sin hallazgos Crítico/Mayor**.
- **Orquestación:** las 5 specs **ágiles** por subagentes **Sonnet** (auditadas antes de incorporarse); las 5 **completas** por el orquestador.
- **Hallazgo abierto (RA-01):** discrepancia del nº de campos que recibe el LLM — cápsula canónica (3, RN-01.3/PRIV-R1) vs plan §3.4 `ContextoInicialConversacionalV1` (5 + personaje + versión); se sigue el canon, pendiente reconciliar (CU-05 §21, CU-06 §21). **(→ resuelto en v0.10.0 / SD-22.)**
- **Actualizado:** `INDICE_MAESTRO` (filas ECU), `ESTADO_PIPELINE` (Fase 2: dominio ✅ + casos de uso ✅ + **especificación ✅**), `CLAUDE.md`/`AGENTS.md` §Alcance (Fase 2 en curso; corrige el texto que aún marcaba «casos de uso» fuera de alcance), `REGISTRO_DECISIONES` (SD-21).

## 2026-07-12 — v0.8.0 · Diagrama de casos de uso DCU-01 (SD-20)
- **Añadido:** `docs/07_casos_uso/DCU-01_casos_uso.puml` (+ `.md` + `.svg`) — **diagrama de casos de uso** generado con la skill `uml-use-case-diagram` a partir de MV-01, MD-01, VIS-01 y REQ-01.
- **Contenido:** 4 actores (Visitante, Usuario adulto, Administrador, y **Proveedor LLM (Groq)** como sistema externo); 10 casos de uso en 3 paquetes (Acceso y cuenta · Acompañamiento · Administración de plataforma); 1 `<<extend>>` (Derivar ante peligro → Conversar) y 0 `<<include>>`.
- **Trazabilidad:** los 26 RF de REQ-01 cubiertos sin huérfanos. **Validador:** 0 errores.
- **Siguiente artefacto ICONIX:** especificación textual de cada caso de uso (`use-case-specifier`).

## 2026-07-12 — v0.7.0 · Formato de entrega del curso en MV-01 (SD-19)
- **MV-01 v2.3:** se antepone la **Parte A** (secciones 1–6: Título, Contexto, Descripción, Requisitos Funcionales, No Funcionales y de Calidad) en el **estilo narrativo del ejemplo del curso**; la formalización E8 se conserva íntegra como **Parte B**. Contenido de la Parte A extraído de VIS-01, REQ-01 y el plan archivado. Sin cambios en clases, relaciones ni reglas (la extracción de dominio no se afecta).
- **Nota:** el "Período académico 2026-1" del encabezado es una inferencia — el usuario debe confirmarlo/ajustarlo.

## 2026-07-12 — v0.6.0 · Repositorio independiente (SD-18)
- Este repositorio es el resultado de extraer el subproyecto desde `subproyecto_academico_alan_aura/` del repo de SmartAID a un repositorio GitHub propio (`jonatan8254/alan-aura-academico`, privado). **Es la fuente de verdad activa**; la copia en SmartAID queda como snapshot histórico. Se corrigieron 11 referencias al macro (ahora citas de procedencia, sin enlaces rotos).

## 2026-07-12 — v0.5.0 · Reconciliación contra el plan completo (SD-17)
- **Motivo:** al archivar el plan completo (SD-16) se detectaron 5 discrepancias entre el texto real y los artefactos construidos a partir de una reconstrucción forense parcial.
- **Historial de sesión:** `RN-02.2`/`RN-03` (MV-01) y `RF-09`/`RNF-04` (REQ-01) corregidos — el LLM **sí** recibe hasta 4 intercambios de la sesión actual (no "cero historial"); nunca historial de sesiones previas. Propagado a `PRIV-R1` y `C-4`/`CA-4` del contrato.
- **Límites de tasa exactos:** `RN-02.9` (MV-01) y `RF-25`/`RF-26`/`RNF-10` (REQ-01) — 3 solicitudes/min, 30/día, timeout 20s, 1.500 caracteres de entrada, 350 tokens de salida.
- **Inventario de datos (PRIV-01):** reescrito mapeando 1:1 a las 7 entidades exactas del plan (`User`, `ConsentRecord`, `InitialConversationProfile`, `PlatformSetting`, `DailyUsageCounter`, `OperationalEvent`, `AdministrativeAction`); nota explícita de las entidades que el plan excluye (`Conversation`, `Message`, `Diagnosis`, `RiskScore`, `PsychometricResult`, `Intervention`).
- **Contrato conversacional:** tabla de personajes ampliada a P-1..P-8 (función/tono/respuesta típica/preguntas/sugerencias/longitud/límites, plan §3.6).
- **SEG-01:** plantilla del fallback citada del plan §3.8 **con marcadores de configuración**, no con números fijos (respeta SD-12: los recursos reales viven en config de entorno y en el archivo primario, no se repiten hardcodeados en cada artefacto).
- **Diferido:** tabla de endpoints (§4.9 del plan) — corresponde a ARQ-01 en fase de construcción, no a esta fase documental.

## 2026-07-12 — v0.4.1 · Fuente primaria del plan de Codex archivada (SD-16)
- **Añadido:** `00_PLAN_CODEX_ORIGINAL.md` — texto **verbatim** completo del plan generado con Codex (única corrección: artefactos de copiado/pegado, cero cambios de contenido). Se convierte en el ancla de toda cita "plan §X.Y" en el subproyecto.
- **Actualizado:** INDICE_MAESTRO y MANIFIESTO_FUENTES enlazan la fuente primaria.

## 2026-07-12 — v0.4.0 · Corrección de alcance: alineación al plan de Codex (SD-15)
- **Motivo:** verificación forense del plan de Codex → al consolidar se habían **recortado** funciones reales del administrador y del usuario, y **añadido** funciones que el plan excluye.
- **Administrador (realineado a las 3 funciones del plan §3.7):** directorio mínimo de usuarios (ID truncado), métricas **agregadas** (cuentas, onboardings, llamadas 7d, tasa éxito/error) y **kill switch** (habilitar/deshabilitar el chatbot, con confirmación + auditoría). Se **quitó** la edición administrativa de recursos/textos/gate (el plan no la contempla): esos se aprovisionan **por entorno**.
- **Usuario / cuenta (restaurado):** landing del Visitante, registro (username/alias/contraseña), login/logout, reinicio de perfil, revocación de personalización y **eliminación de cuenta con borrado en cascada**; manejo de indisponibilidad/timeout/cuota; límite ~20 mensajes.
- **Dominio (MD-01):** +clase `DisponibilidadDelChatbot` (kill switch como estado); relación `Administrador–DisponibilidadDelChatbot–Conversacion`; se quitó `Administrador–RecursoDeAyuda`; `Configuracion` descartada. **Refinamiento (a petición del usuario):** se **eliminó** la relación `Administrador–Usuario (supervisa)` por ambigua y por ser de acceso, no conceptual — el directorio y las métricas son **casos de uso**, no relaciones de dominio. Se añadió nota de las **tres capas** (sustantivos / casos de uso / métodos). **12 clases, 12 relaciones, validador 0/0.** `.svg` regenerado.
- **Artefactos tocados:** VIS-01 (Visitante, OBJ-6/OBJ-7, MVP terminado), MV-01 (§3/§4/§6/§7.4/§7.5/§8/§13/§14, v2.1), REQ-01 (RF-14…18 realineados, +RF-19…26, +RNF-08/09, v1.1), PRIV-01 (cuenta/contadores/qué-no-ve-el-admin, v1.1), CONTRATO (+C-9/C-10), MD-01 (.puml/.svg/.md), TRZ-01 (v1.1, cero huérfanos), SD-15.

## 2026-07-12 — v0.3.0 · Modelo de dominio MD-01 (Fase 2 ICONIX iniciada, SD-14)
- **Añadido:** `docs/06_dominio/MD-01_modelo_dominio.puml` — **modelo de dominio en PlantUML**, generado con la skill `uml-domain-modeler` en modo *academic strict* a partir de MV-01 + documentos de apoyo (VIS-01, REQ-01, contrato, SEG-01, PRIV-01, TRZ-01).
- **Añadido:** `docs/06_dominio/MD-01_modelo_dominio.md` — ficha, decisiones de modelado, trazabilidad a casos de uso, quality gates y cómo renderizar.
- **Contenido del modelo:** 11 clases (Usuario, Administrador, Consentimiento, CapsulaDePerfil, Personaje, Alan, Aura, Conversacion, Mensaje, EventoDeSeguridad, RecursoDeAyuda); generalización `Personaje<|--Alan/Aura`; composición `Conversacion*--Mensaje`; sin atributos ni multiplicidades (modo strict).
- **Decisiones de modelado:** `Configuracion` descartada (contenedor técnico) → `Administrador -- RecursoDeAyuda`; `EventoDeSeguridad`/`RecursoDeAyuda` conservadas (dominio de *safety*).
- **Verificación:** validador `validate_domain_puml.py` de la skill → **0 errores / 0 advertencias**.
- **Reversa de Q2** (SD-14): se genera el `.puml` (antes diferido). Sigue sin producir casos de uso (el dominio los precede).
- **Añadido:** `docs/06_dominio/MD-01_modelo_dominio.svg` — render estático autocontenido (colores explícitos, sin dependencias externas), 1:1 con el `.puml`, agrupado por categoría (actores/identidad/conversación/seguridad) con leyenda de notación.
- **Actualizado:** INDICE_MAESTRO (MD-01), ESTADO_PIPELINE (Fase 2 iniciada), SD-14 en REGISTRO_DECISIONES.

## 2026-07-12 — v0.2.0 · MV consolidado apto para extracción de dominio (SD-13)
- **Cambiado:** los modelos verbales se **consolidan en un único MV monolítico** (`MV-01` v2.0.0). Los submodelos `MV-01.1/.2/.3` se **eliminan como archivos** y pasan a ser **vistas internas** (Onboarding·Conversación·Seguridad·Administración) dentro de MV-01.
- **Añadido en MV-01:** tabla de candidatos clasificados (taxonomía del extractor), catálogo de relaciones tipadas con **generalización** (`Personaje<|--Alan/Aura`) y **composición** (`Conversacion*--Mensaje`) y **etiquetas conceptuales**, **matriz de intercambio de objetos** entre vistas (entrega/recibe a nivel de objeto), reserva de dominios de valor y cardinalidades (§13), y sección **Handoff** de extracción (modo *academic strict*, insumos, exclusiones).
- **Alineación con la skill `uml-domain-modeler`** (editada por el usuario): **sin multiplicidades ni atributos** en el catálogo de extracción (evita el anti-patrón "multiplicity too early").
- **Actualizado:** referencias `MV-01.1/.2/.3` → `MV-01 §Vista …` en README, INDICE_MAESTRO, ESTADO_PIPELINE, REQ-01, PRIV-01, SEG-01, TRZ-01, contrato; SD-13 en REGISTRO_DECISIONES.
- **Fuera de alcance:** NO se genera el modelo de dominio `.puml` (Q2); queda listo para invocar la skill.

## 2026-07-12 — v0.1.0 · Fase 1 (paquete documental mínimo)
- **Añadido:** carpeta aislada `subproyecto_academico_alan_aura/` con gobernanza (README, AGENTS, CLAUDE, índice maestro, cápsula de contexto, estado, registro de decisiones, este changelog, manifiesto de fuentes).
- **Añadido:** auditoría breve del plan generado con Codex (`00_AUDITORIA_PLAN_CODEX.md`).
- **Añadido:** VIS-01 (visión/alcance), ADR-001 (decisiones técnicas).
- **Añadido:** MV-01 (modelo verbal general) + submodelos (onboarding, conversación Alan/Aura, administración) + contrato conversacional (E4 simplificado), cada MV con checklist de 11 rasgos de E8.
- **Añadido:** REQ-01 (RF/RNF + requisitos de calidad 25010:2023 con GQM y umbral + reglas de negocio tipadas), PRIV-01 (privacidad), SEG-01 (protocolo de seguridad — gate binario).
- **Añadido:** NORM-01 (puente normativo, mini D6-bis reusando cláusulas verificadas), TRZ-01 (trazabilidad, cero huérfanos).
- **Añadido:** PLAN-01 (plan de proyecto de ~1 mes).
- **Decisiones:** ver `REGISTRO_DECISIONES.md` (SD-01…SD-12).
- **Verificación de cierre:** 23 archivos; 11/11 rasgos de E8 en cada MV; cero huérfanos en TRZ-01; GQM+umbral en RC-01…RC-10; cláusulas *safety* reutilizadas de D6-bis; aislamiento confirmado (`git status` muestra solo esta carpeta). Detalle y matriz de canon §5 en `ESTADO_PIPELINE.md`.
- **Estado:** **Fase 1 cerrada**; Fase 2 (ICONIX) planificada, no iniciada.
