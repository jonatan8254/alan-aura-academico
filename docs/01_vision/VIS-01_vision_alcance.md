# VIS-01 — Visión, objetivos y alcance del subproyecto «Alan & Aura Académico»
**ID:** VIS-01 · **Hogar:** `docs/01_vision/` · **Fecha:** 2026-07-12 · **Estado:** v1.1 (alineada al plan de Codex — gestión de cuenta y admin de plataforma restaurados, SD-15).
**Insumos:** `00_AUDITORIA_PLAN_CODEX.md`; canon del macro (`../../CLAUDE.md`); doc 8 (plan metodológico v1.1, Releases 0.1/0.2); D22 (arquitectura LLM v2.0).
**Consumidores:** ADR-001, MV-01, REQ-01, PLAN-01, TRZ-01 (objetivos como raíz de la trazabilidad).
**Naturaleza:** documento de encuadre. **Marcas:** [E1]/[I2]/[P5]. **Nomenclatura:** Alan / Aura.

---

## 1. Visión
Ofrecer un **acompañante conversacional de apoyo emocional** —encarnado en dos personajes complementarios, **Alan** (activación) y **Aura** (calma)— que, en un **MVP académico realizable en ~1 mes**, demuestre de extremo a extremo el valor central de Smart-AID (acompañar, orientar y educar con seguridad) **sin** las capacidades avanzadas del producto profesional y **sin** traicionar su canon ético.

> El subproyecto es una **prueba de concepto documental y, en fase posterior, funcional** del núcleo de Smart-AID, no una versión reducida "para siempre": lo que recorta lo **difiere**, no lo niega.

## 2. Problema y motivación
Las personas adultas que atraviesan estrés, desregulación o bajones anímicos carecen de un espacio de **primer apoyo** disponible, no clínico y no punitivo. El MVP no pretende resolver la salud mental: pretende **ofrecer contención conversacional segura y psicoeducación**, y **derivar** cuando aparezca peligro. La motivación académica es demostrar que ese núcleo puede construirse con **estándares profesionales** (requisitos, calidad medible, seguridad auditable) en el marco de un curso.

## 3. Objetivos

### 3.1 Objetivo general
Construir y documentar un MVP conversacional (Alan/Aura) que complete el flujo **presentación → registro/acceso → onboarding → conversación → gate de seguridad**, con **gestión de cuenta** del usuario (reinicio de perfil, revocación, eliminación en cascada) y un **administrador de plataforma** de tres funciones (directorio, métricas agregadas, kill switch), cumpliendo el canon de dominio y con requisitos de calidad medibles.

### 3.2 Objetivos específicos (raíz de la trazabilidad)
| ID | Objetivo | Traza a |
|---|---|---|
| **OBJ-1** | Onboarding que obtenga **consentimiento informado** y arme una **cápsula de perfil mínima** (adultos, con *disclosure* de IA). | MV-01 §Onboarding, RF onboarding, PRIV-01 |
| **OBJ-2** | Conversación con un LLM gobernado, donde la **personalidad** (Alan/Aura) modula el tono pero **no** compromete la seguridad. | MV-01 §Conversación, contrato, RF chat |
| **OBJ-3** | **Gate de seguridad binario**: ante peligro explícito, fallback determinista con derivación a recursos configurables. | SEG-01, RF seguridad |
| **OBJ-4** | **Minimización y no persistencia del chat**; el LLM nunca recibe historial bruto. | PRIV-01, RNF privacidad |
| **OBJ-5** | **Calidad medible**: cada cualidad relevante anclada a 25010:2023 con umbral (incl. *safety*). | REQ-01 §Calidad, NORM-01 |
| **OBJ-6** | **Administración de plataforma** con **exactamente tres funciones** (plan §3.7): (a) directorio mínimo de usuarios, (b) métricas agregadas de uso, (c) **kill switch** para habilitar/deshabilitar el chatbot — sin acceder a contenido sensible ni a datos individuales. | MV-01 §Administración, RF administración |
| **OBJ-7** | **Gestión de cuenta y acceso**: presentación pública (Visitante); registro y login/logout del usuario; reinicio de la caracterización; revocación de la personalización; **eliminación de cuenta con borrado en cascada**. | MV-01 §Cuenta, RF cuenta, PRIV-01 |

## 4. Alcance (qué SÍ entra en el MVP)
- **Presentación y cuenta:** landing público (Visitante consulta alcance/límites/accesos); **registro** (username/alias/contraseña) y **login/logout**; **reinicio de la caracterización**, **revocación de la personalización** y **eliminación de cuenta** con borrado en cascada. [E1]
- **Onboarding emocional simplificado:** confirmación de mayoría de edad, *disclosure* y consentimiento (pasos separados), caracterización opcional de 5 preguntas, presentación de Alan y Aura, generación de la cápsula. [E1]
- **Conversación Alan/Aura v1:** chat con LLM gobernado; la cápsula alimenta el modelo; elección/percepción de personalidad; **hasta ~20 mensajes por sesión**; **manejo de indisponibilidad/timeout/cuota** sin romper la interfaz; sin persistencia del chat. [E1]
- **Gate de seguridad binario:** detección de peligro explícito → fallback determinista (contención + derivación). [E1]
- **Administración de plataforma (3 funciones):** directorio mínimo de usuarios, métricas agregadas y **kill switch**. Los recursos de ayuda y los textos se aprovisionan **por entorno** (deployment), **no** mediante edición del administrador. [E1]

## 5. Fuera de alcance (delimitación explícita)
**De esta fase (documental):** casos de uso, modelo de dominio, robustez, secuencias, código, repo git separado, grafo/vault propios → **planificados en PLAN-01, no producidos**. [P5]

**Del MVP (producto reducido):** sensórica y biomarcadores · neuromodulación adaptativa (NMA) · IA federada · dashboards y analítica de bienestar · triaje S0-S5 completo y rutas críticas · check-ins/diario/recomendaciones/cajitas de aprendizaje (Releases 0.3→1.0) · **menores de edad** · integración con TalentTrack · cualquier claim clínico. [E1]

**Del administrador (plan §3.7, explícito):** el admin **no** tiene CMS ni edición de preguntas/encuestas ni edición de prompts; **no** hace suspensión individual, segmentación sensible, exportación masiva ni visualización de conversaciones. Tampoco hay recuperación de contraseña por correo ni verificación de correo. [E1]

> Regla de frontera: **el MVP acompaña y deriva; no diagnostica, no trata, no gestiona urgencias en autonomía.**

## 6. Actores
| Actor | Descripción |
|---|---|
| **Visitante** | Persona no autenticada que consulta la presentación, los límites y los accesos antes de registrarse. |
| **Usuario adulto** | Persona ≥18 años, registrada y autenticada, que gestiona su cuenta (perfil, revocación, eliminación) y conversa con Alan/Aura tras consentir. |
| **Administrador de plataforma** | Rol técnico-operativo con login separado y **tres funciones**: directorio mínimo, métricas agregadas y kill switch. **No** accede a conversaciones, cápsulas, respuestas de encuesta ni datos individuales; **no** edita recursos/textos/prompts. |
| **LLM externo (Groq)** | Servicio de terceros que genera las respuestas conversacionales, gobernado por el sistema (cápsula + guardas + gate). No es actor clínico ni decisor autónomo. |
| **Recursos de derivación** | Líneas/servicios de ayuda configurables por entorno a los que apunta el fallback de seguridad. |

## 7. Supuestos y restricciones
- **Supuestos:** el usuario es adulto y consiente; los servicios externos (LLM, hosting) están disponibles según el plan (a re-verificar, V6-a). [I2]
- **Restricciones:** ~1 mes de desarrollo; equipo académico; *free tiers*; español (Colombia); sin presupuesto de infraestructura. [E1]

## 8. Definición de «MVP terminado» (Definition of Done del producto)
El MVP se considera terminado cuando **todo** lo siguiente es cierto:
1. Un adulto puede **registrarse, iniciar sesión, consentir**, generar su **cápsula** y **conversar** con Alan o Aura de principio a fin; el **rol no puede alterarse desde el cliente**. [OBJ-1, OBJ-2, OBJ-7]
2. Ante un **mensaje de peligro explícito** de prueba, el sistema **activa el fallback determinista** y muestra la derivación, **aunque el LLM falle**. [OBJ-3, SEG-01]
3. Se verifica que **el chat no se persiste** y que el LLM **no recibe historial bruto** (solo la cápsula). [OBJ-4, PRIV-01]
4. Cada **requisito de calidad** con umbral definido en REQ-01 tiene su medición planificada y su fila en NORM-01. [OBJ-5]
5. El **administrador** puede usar sus **tres funciones** (directorio, métricas, kill switch) **sin acceder a datos sensibles**; los recursos de ayuda se cambian **por configuración de entorno**. [OBJ-6, SD-12]
6. El usuario puede **reiniciar su perfil, revocar la personalización y eliminar su cuenta** (borrado en cascada). [OBJ-7, PRIV-01]
7. El sistema maneja **indisponibilidad, timeout, cuota y respuesta bloqueada** sin romper la interfaz. [OBJ-2]
8. **Cero requisitos huérfanos** en TRZ-01 y checklist de canon §5 aprobado por artefacto.

## 9. Canon de dominio (recordatorio operativo)
No sobre-claim clínico · minimización (cápsula, no historial) · consentimiento revocable · uso no punitivo · divulgación mínima · seguridad emocional > engagement · no persistencia del chat · solo adultos con *disclosure*.

## 10. Cierre
- **Decisiones confirmadas:** objetivos OBJ-1…OBJ-7; alcance y exclusiones (SD-01, SD-05, SD-07, SD-08, SD-15).
- **Recomendaciones:** mantener la delimitación de §5 como *gate* anti-scope-creep.
- **Supuestos:** §7. **Pendientes:** V6-a (servicios externos), V6-b (frontera legal de datos).
