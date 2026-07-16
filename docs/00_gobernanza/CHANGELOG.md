# Changelog — Subproyecto «Alan & Aura Académico»
Formato: fecha · versión · cambios. Solo se registran hitos del paquete documental (no ediciones menores).

---

## 2026-07-16 — v0.9.0 · Especificación textual de casos de uso ECU-00…ECU-10 (SD-21)
- **Añadido:** `docs/07_casos_uso/especificaciones/` con el índice `ECU-00` y las **10 especificaciones** `ECU-01…ECU-10`, generadas con la skill `use-case-specifier` a partir de DCU-01, MV-01, MD-01, REQ-01, PRIV-01, SEG-01, contrato y el plan archivado.
- **Forma:** **completa** (§1–§23) en CU-04/05/06/07/10 (canon-sensibles: eliminación en cascada, consentimiento/minimización, conversación gobernada, *fail-safe*, kill switch auditado); **ágil** (§23) en CU-01/02/03/08/09. Empaquetado un archivo por CU + índice.
- **Trazabilidad:** los **26 RF** de REQ-01 cubiertos sin huérfanos; poblada la **columna CU** de `TRZ-01`.
- **Gate de calidad:** la skill **no** trae validador ejecutable → cada spec **embebe su checklist §22 (20 ítems)** y todas pasaron el loop de auditoría del orquestador (rúbrica + 8 pasos + traza *backward* + canon §5) **sin hallazgos Crítico/Mayor**.
- **Orquestación:** las 5 specs **ágiles** por subagentes **Sonnet** (auditadas antes de incorporarse); las 5 **completas** por el orquestador.
- **Hallazgo abierto (RA-01):** discrepancia del nº de campos que recibe el LLM — cápsula canónica (3, RN-01.3/PRIV-R1) vs plan §3.4 `ContextoInicialConversacionalV1` (5 + personaje + versión); se sigue el canon, pendiente reconciliar (CU-05 §21, CU-06 §21).
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
