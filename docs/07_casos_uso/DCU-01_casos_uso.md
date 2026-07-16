# DCU-01 — Diagrama de casos de uso del MVP «Alan & Aura Académico»
**ID:** DCU-01 · **Familia:** DCU (casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/` · **Fecha:** 2026-07-12 · **Versión:** v1.0.
**Artefacto ejecutable:** [`DCU-01_casos_uso.puml`](DCU-01_casos_uso.puml) (PlantUML copy-ready, **fuente de verdad**). **Render acompañante:** [`DCU-01_casos_uso.svg`](DCU-01_casos_uso.svg) (vista estática autocontenida).
**Insumos:** MV-01 (modelo verbal, RF por actor y vocabulario), MD-01 (modelo de dominio — vocabulario controlado, **no** se copian clases), VIS-01 (actores/objetivos), REQ-01 (RF-01…26), contrato conversacional, SEG-01, plan §5.3 (CU-01…06 presupuestados).
**Consumidores:** especificación textual de casos de uso (skill `use-case-specifier`, fase siguiente), robustez, secuencia.
**Generado con:** skill `uml-use-case-diagram`. **Validador:** `validate_use_case_puml.py` → **0 errores** (1 aviso de "acceso/autenticación" mantenido a propósito: login/logout y rol están explícitos, RF-14/RF-21/RNF-08).
**Naturaleza:** **vista funcional** — un resumen (tabla de contenidos) de las metas de los actores. **No** es un flujo, ni un algoritmo, ni UI, ni arquitectura. La sustancia (flujos básicos/alternativos, pre/postcondiciones, reglas) vive en la **especificación textual** de cada caso de uso, no en el diagrama.

---

## 1. Actores (4)
| Actor | Tipo | Rol |
|---|---|---|
| **Visitante** | Humano | Persona no autenticada que consulta la presentación y se registra. |
| **Usuario adulto** | Humano (primario) | Persona ≥18 registrada que hace onboarding, conversa y gestiona su cuenta. |
| **Administrador de plataforma** | Humano | Rol técnico-operativo con tres funciones (directorio, métricas, kill switch). |
| **Proveedor LLM (Groq)** | **Sistema externo** | Genera el texto de las respuestas durante la conversación, bajo el gobierno del sistema. No inicia casos de uso ni es decisor autónomo. |

> **No son actores** (aunque aparezcan en el dominio o el stack): los recursos de derivación (son una **salida** del sistema al usuario, no un sistema que interactúe), ni GitHub/PythonAnywhere/SQLite (infraestructura, fuera del límite funcional).

## 2. Casos de uso (10, en 3 paquetes)
### Acceso y cuenta
| CU | Actor(es) | Traza (RF → OBJ) |
|---|---|---|
| Consultar presentación del servicio | Visitante | RF-19 → OBJ-7 |
| Registrar cuenta | Visitante | RF-20 → OBJ-7 |
| Iniciar sesión | Usuario, Administrador | RF-14, RF-21 → OBJ-6/OBJ-7 |
| Gestionar cuenta y datos personales | Usuario | RF-22, RF-23, RF-24 → OBJ-7/OBJ-4 |

### Acompañamiento
| CU | Actor(es) | Traza (RF → OBJ) |
|---|---|---|
| Otorgar consentimiento y caracterizar el perfil | Usuario | RF-01…RF-06 → OBJ-1 |
| Conversar con el acompañante | Usuario, Proveedor LLM | RF-07, RF-08, RF-09, RF-10, RF-12, RF-13, RF-25, RF-26 → OBJ-2/OBJ-4 |
| Derivar ante peligro *(«extend» de Conversar)* | — (disparado por el sistema) | RF-11 → OBJ-3 |

### Administración de plataforma
| CU | Actor(es) | Traza (RF → OBJ) |
|---|---|---|
| Consultar directorio de usuarios | Administrador | RF-15 → OBJ-6 |
| Consultar métricas de uso | Administrador | RF-16 → OBJ-6 |
| Habilitar o deshabilitar el chatbot | Administrador | RF-17, RF-18 → OBJ-6 |

## 3. Relaciones
- **Asociaciones** (la columna vertebral): 11, listadas en §2 por actor.
- **`<<extend>>` (1, justificado):** `Derivar ante peligro` extiende `Conversar con el acompañante`. Es **condicional** (solo ante peligro explícito), **puede no ocurrir** (la conversación se completa sin él) y es **observable** (el usuario ve la contención + la derivación). Cumple el gate de *extend*.
- **`<<include>>` (0, a propósito):** el diagrama se mantiene como resumen limpio. Lo que sería tentador incluir —evaluar el gate de seguridad, invocar al LLM, generar la cápsula, descartar el chat— es comportamiento **interno o postcondición**, no un subservicio observable compartido; va en el texto, no en el diagrama.
- **Generalización (0):** no hay variantes de rol que la justifiquen.

## 4. Decisiones de modelado
1. **El Proveedor LLM (Groq) → actor de sistema externo.** Coherente con la decisión 9 de MD-01: el LLM **no** es clase de dominio, pero **sí** es actor en la vista de casos de uso, porque intercambia información con el sistema en la frontera (genera el texto de la respuesta). Se asocia solo a `Conversar` y **no** a `Derivar ante peligro` (el *fallback* es determinista, sin LLM).
2. **Las tres funciones del administrador → tres casos de uso separados.** Los requisitos las enumeran explícitamente y distintas (directorio ≠ métricas ≠ kill switch); son metas de actor independientes y observables. El plan las agrupaba como «CU-06 Administrar la plataforma»; aquí se desglosan por trazabilidad.
3. **«Gestionar cuenta y datos personales» → un solo caso de uso** que agrupa reiniciar perfil, revocar personalización y eliminar cuenta (RF-22/23/24). Se mantiene a nivel de meta para no saturar el diagrama; el desglose (incluida la eliminación en cascada, de alto impacto) se hará en la **especificación textual**. *(Trade-off consciente; podría separarse «Eliminar cuenta» si el curso lo pide.)*
4. **«Iniciar sesión» sí es caso de uso.** El *gate* de acceso/autenticación se satisface: el modelo verbal menciona explícitamente registro, login/logout y rol validado en servidor (RF-14/RF-21/RNF-08). No se creó por el mero hecho de "usar el sistema".
5. **La caracterización opcional vive dentro de «Otorgar consentimiento y caracterizar el perfil».** Las cinco preguntas son opcionales (RF-04); esa opcionalidad se documenta en el flujo del caso de uso, no como un CU o un `<<extend>>` aparte, para no fragmentar.
6. **`Derivar ante peligro` → `<<extend>>`, no caso de uso iniciado por actor.** Lo dispara el sistema al detectar peligro; el usuario no lo "pide". Por eso extiende `Conversar` y no lleva asociación de actor.

## 5. Trazabilidad (cero requisitos funcionales huérfanos)
Los **26 RF** de REQ-01 quedan cubiertos por los 10 casos de uso (§2). Casos particulares: **RF-13** (no persistencia del chat) es una **postcondición** de `Conversar`, no un CU; **RF-18** (auditoría del kill switch) es parte de `Habilitar o deshabilitar el chatbot`. Cadena ICONIX: `MV-01 → MD-01 → DCU-01 (este) → especificación textual → robustez → secuencia`.

## 6. Qué NO se modeló como caso de uso (separación de vistas)
- **Evaluar el gate de seguridad en cada mensaje** → paso interno de `Conversar` (flujo básico), no un CU.
- **Generar la respuesta con el LLM / aplicar guardas de salida** → interacción con el actor externo (ya reflejada) + postvalidación interna (texto).
- **Generar la cápsula de perfil / descartar la conversación** → postcondiciones.
- **Validar mayoría de edad, aplicar límites de tasa** → precondición y regla de negocio (texto).
- **Directorio/métricas/estados de la BD** → detalle interno; los actores ven *servicios*, no operaciones de persistencia.

## 7. Verificación (quality gates de la skill)
- ✅ `@startuml … @enduml`; `left to right direction`, `linetype ortho`, `packageStyle rectangle`, `shadowing false`.
- ✅ Actores **fuera** del límite; casos de uso **dentro** de `rectangle "Alan & Aura Académico" {}` con 3 paquetes de áreas de negocio.
- ✅ Solo metas de actor / servicios observables; sin pasos de flujo, validaciones internas, UI ni persistencia como CU.
- ✅ `<<include>>`/`<<extend>>` con restricción: 0 include, 1 extend justificado.
- ✅ Nombres en voz activa (infinitivo + sustantivo del dominio), vocabulario alineado con MD-01.
- ✅ Disciplina de asociación de actores (ninguno sobre-conectado; el usuario a 4 metas independientes, el admin a 4, el visitante a 2, el LLM a 1).
- ✅ **Validador `validate_use_case_puml.py`: 0 errores** (1 aviso de acceso/auth mantenido con justificación).

## 8. Cómo renderizar
- **Ya renderizado:** [`DCU-01_casos_uso.svg`](DCU-01_casos_uso.svg) — abrir en cualquier navegador o visor.
- **Para regenerar/editar el `.puml`:** VS Code (extensión *PlantUML* → *Preview*), `plantuml.com`, o `java -jar plantuml.jar DCU-01_casos_uso.puml`.
- El `.svg` es una vista derivada; ante discrepancia, el `.puml` manda.

## 9. Cierre y siguiente paso
- **Confirmado:** 4 actores, 10 casos de uso, 3 paquetes, 1 `<<extend>>`, 0 `<<include>>`, validador 0 errores; los 26 RF trazados sin huérfanos.
- **Siguiente artefacto ICONIX:** la **especificación textual** de cada caso de uso (skill `use-case-specifier`) — nombre, actores, precondiciones, disparador, flujo básico, flujos alternativos/excepción, postcondiciones, reglas y criterios de aceptación. Ahí se desglosan la caracterización opcional, la eliminación en cascada, el manejo de errores (401/403/409/429/502/504) y la ruta de *fallback*.

**Fin de DCU-01.**
