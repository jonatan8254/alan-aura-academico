# ECU-07 — Especificación de caso de uso: «Derivar ante peligro» (CU-07)
**ID documento:** DOC-CU-07 · **Caso de uso:** CU-07 · **Alias en DCU-01:** `CU_Deriv` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23 de la plantilla de la skill `use-case-specifier`) — caso de uso **de seguridad (*safety*), criticidad máxima**. Es la ruta que el MVP debe garantizar al 100 %.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §Vista Seguridad, REQ-01 (RF-11), SEG-01 v1.1, PRIV-01, contrato conversacional (C-3, C-7, C-10), NORM-01 (§3.9), DIS-00 (P-12), `00_PLAN_CODEX_ORIGINAL.md` §3.8. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento

| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-07 |
| Versión | v2.0 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-31 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v2.0 | 2026-07-31 | J. Sánchez | **PDR-01, fase D.3, tanda 3.** Cierra **D-09**: el flujo alternativo de recursos y el de excepción de configuración compartían disparador; ahora la falla de recursos es **un solo** flujo (`FA-01`) y la excepción queda reservada al **otro** elemento configurable, el texto de contención (`FE-02`). Cierra **D-10**: el recuento de pasos se comprueba contra sus fuentes reales y queda la correspondencia auditable en §11. Se declara el desenlace de los tres flujos de excepción, se reescriben los ocho pasos en voz activa con conceptos nombrados, y **todo flujo gana criterio de aceptación**. Se añaden `FA-02`, `FA-03` y `FE-03`, que cubren huecos reales. Se incorpora la **transparencia** de SEG-01 §5, ausente del flujo de v1.0. Se añade la correspondencia alias ↔ CU-NN en §19. |
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |

## 2. Entradas esperadas

| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Seguridad (RN-05, RN-06, RN-11) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`EventoDeSeguridad`, `RecursoDeAyuda`, `Mensaje`, `Conversacion`, `DisponibilidadDelChatbot`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Deriv` | Disponible |
| Caso de uso seleccionado | CU-07 | Disponible |
| Actor beneficiario | Usuario adulto | Disponible |
| Protocolo de seguridad | SEG-01 v1.1 (gate binario + *fallback* determinista) | Disponible |
| Reglas de negocio | RN-05, RN-06, RN-11; contrato C-3, C-7, C-10 | Disponible |
| Requisitos funcionales | RF-11 | Disponible |
| Requisitos especiales | RC-01, RC-02, RC-03; RNF-05, RNF-06; PRIV-R2, PRIV-R5, PRIV-R7 | Disponible |
| Secuencia de la derivación | `00_PLAN_CODEX_ORIGINAL.md` §3.8 (diez cláusulas, citadas) | Disponible |
| Prototipos / GUI | **Contención + derivación** (P-12) | Disponible (SD-23, alta fidelidad) |

## 3. Identificación

| Campo | Valor |
|---|---|
| ID | CU-07 |
| Nombre | Derivar ante peligro |
| Paquete funcional | Acompañamiento (Seguridad) |
| Nivel de abstracción | Usuario (subfunción de seguridad, `<<extend>>` de CU-06) |
| Actor beneficiario | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Eventual (solo ante peligro explícito) |
| Criticidad | **Máxima** (*safety*; el MVP debe garantizarla al 100 %) |
| Estado | Propuesto |

## 4. Propósito

| Campo | Descripción |
|---|---|
| Objetivo | Ante **peligro explícito**, entregar al Usuario una respuesta de **contención + derivación** producida por un ***fallback* determinista y local**, independiente del Proveedor LLM. |
| Descripción breve | Cuando el gate decide «peligro explícito», el Sistema suspende la respuesta ordinaria, presenta un texto fijo de contención que declara su naturaleza de IA, orienta a emergencias y a apoyo humano con los `RecursoDeAyuda` del entorno, y suspende el chat ordinario de esa `Conversacion`. |
| Valor funcional | Prioriza la seguridad emocional sobre el *engagement*; es la única ruta del MVP que debe operar **aunque el Proveedor LLM falle** (*fail safe*). |
| Resultado observable | El Usuario ve la contención y la derivación; el chat ordinario queda suspendido en esa sesión; el Sistema no conserva el contenido ni contabiliza clasificación alguna de riesgo. |

### 4.1 Qué garantiza esta ruta y qué no

Cuatro invariantes gobiernan cada flujo de esta especificación. Ningún flujo alternativo ni de excepción puede relajarlas: por eso todos ellos **continúan** hacia la derivación en lugar de abortarla.

| # | Invariante | Por qué |
|---|---|---|
| I-1 | Decidido el peligro explícito, el turno **nunca** llega al Proveedor LLM. | RN-05, C-3, SEG-R2 |
| I-2a | El Usuario **siempre** termina con una ruta hacia ayuda humana **aunque falle el Proveedor LLM o la red**. | RNF-06, RC-01 = 100 %, SEG-R3 — las tres cubren exactamente este caso |
| I-2b | Y **también** si falla el **aprovisionamiento por entorno** del texto de contención o de los recursos. | **Decisión de esta especificación**, no heredada: ninguna de las tres fuentes de I-2a cubre el fallo de aprovisionamiento. Se declara aquí para que sea discutible, y de ella dependen `PRE-03`, `PRE-04`, `FA-01` y `FE-02` |
| I-3 | El Sistema **no** conserva el contenido ni contabiliza clasificación de riesgo, ni siquiera para el Administrador. | PRIV-R2, PRIV-R7, plan §3.8 |
| I-4 | En modo de seguridad la personalidad ordinaria queda suspendida: sin humor, juego ni metáforas. | C-10 |

**Frontera honesta (SEG-01 §2, sin sobre-claim).** Este caso de uso **no** diagnostica, **no** hace terapia y **no** atiende la urgencia: deriva a quien sí puede. Tampoco estima severidad, no aplica la escala graduada S0-S5 del macroproyecto, no notifica a terceros y **no detecta el peligro implícito, ambiguo o encubierto**. La garantía cubre el extremo explícito, y esa reducción está declarada, no disimulada (`RA-01`).

**Dónde empieza este caso de uso.** La evaluación del gate **no** ocurre aquí: ocurre en el paso 3 de CU-06, donde el Sistema decide entre «no-peligro» y «peligro-explícito» antes de construir contexto alguno. Este caso de uso arranca **después** de esa decisión, con el veredicto ya tomado. Por eso una falla del gate mismo es materia de CU-06, no de esta especificación.

## 5. Actores

| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor beneficiario | Usuario adulto | Persona ≥18 que envió el turno con peligro explícito | **No lo solicita**: recibe la contención y la derivación de un disparo del Sistema |
| Sistema externo | — | El **Proveedor LLM no participa**: el *fallback* es determinista y local | No aplica |
| Salida (no es actor) | `RecursoDeAyuda` | Líneas y servicios de ayuda aprovisionados por entorno | El Sistema los presenta; no interactúan con el Sistema ni lo invocan |
| Stakeholder relacionado | Rol Datos/Privacidad y Rol Calidad | Velan por la honestidad del alcance y por los umbrales de *safety* | Revisan el texto y las pruebas |

> **Por qué CU-07 no cuelga de ningún actor en DCU-01.** Comprobado contra `DCU-01_casos_uso.puml` v2.1: el alias `CU_Deriv` aparece en **una sola** línea, `CU_Deriv ..> CU_Chat : <<extend>>`, y en **ninguna** asociación de actor. DCU-01 §4 lo dice de forma explícita: «`CU-07` (disparado por el sistema) y `CU-14` (subfunción incluida) **no** llevan asociación de actor». El Usuario adulto es **beneficiario**, no iniciador: colgarlo de una asociación afirmaría que el Usuario persigue esta meta, y nadie busca deliberadamente activar una derivación de crisis.

## 6. Alcance y contexto

| Campo | Valor |
|---|---|
| Alcance funcional | *Fallback* determinista de contención y derivación, disparado por el veredicto de peligro explícito del gate. |
| Límite del sistema | Ruta segura **sin dependencia** del Proveedor LLM ni de la red hacia él; el Sistema solo consulta la configuración de entorno del propio despliegue. |
| Incluye | Suspensión de la respuesta ordinaria, texto fijo de contención con declaración de naturaleza de IA, derivación a `RecursoDeAyuda` por entorno, marca `mode=safety_fallback`, suspensión del chat ordinario de la sesión. |
| Excluye | La evaluación del gate (paso 3 de CU-06), la escala graduada S0-S5, la clasificación clínica, la estimación de severidad, el diagnóstico, la notificación a terceros, las decisiones de hospitalización, el registro individual para el Administrador y la detección de peligro **implícito**. |
| Suposiciones | El conjunto de señales explícitas aprovisionado cubre el conjunto de prueba acordado (SEG-01 §9). |

## 7. Modelo de dominio involucrado

| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| `EventoDeSeguridad` | Evento del gate binario ante peligro explícito | Documenta el turno y remite a la derivación | — | `Mensaje -- EventoDeSeguridad : se documenta con`; `EventoDeSeguridad -- RecursoDeAyuda : remite a` |
| `RecursoDeAyuda` | Referencia de derivación aprovisionada por entorno | El Sistema la presenta al Usuario | — | `EventoDeSeguridad -- RecursoDeAyuda : remite a` |
| `Mensaje` | Turno del Usuario que el gate marcó como peligro explícito | Queda documentado por el `EventoDeSeguridad` y **no** persiste | — | `Conversacion *-- Mensaje : contiene` |
| `Conversacion` | Sesión efímera de acompañamiento | Su chat ordinario queda **suspendido** | estado | `Conversacion *-- Mensaje`; `DisponibilidadDelChatbot -- Conversacion : condiciona` |
| `DisponibilidadDelChatbot` | Estado global habilitado/deshabilitado (*kill switch*) | Puede cambiar durante la derivación sin interrumpirla (`FE-03`) | estado | `DisponibilidadDelChatbot -- Conversacion : condiciona` |

> Las etiquetas de relación se transcriben literalmente de `MD-01_modelo_dominio.puml` v1.4. La v1.0 de esta especificación escribía «`Mensaje–EventoDeSeguridad` (origina)», etiqueta que el modelo de dominio no tiene: la suya es **«se documenta con»**, y esa diferencia importa porque «origina» sugiere que el `Mensaje` produce el evento, cuando la relación conceptual es de documentación.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `EventoDeSeguridad` | Evento del gate binario ante peligro explícito | prohibido: «triaje», «monitor de crisis», «diagnóstico», «alerta clínica» | Alcance honesto (SEG-01 §2); el alias del macroproyecto era más amplio (MV-01 §11) |
| `RecursoDeAyuda` | Referencia de derivación **por entorno** | prohibido: números o líneas embebidos en código o en este documento | RN-06, RNF-05, SD-12 |
| *Fallback* determinista | Respuesta local producida sin el Proveedor LLM | prohibido: «respuesta del bot», «respuesta del modelo» | Mecanismo de SEG-01, **no** clase del dominio |
| Gate de seguridad | Filtro determinista de peligro explícito | prohibido: «clasificador clínico», «escala de riesgo» | Mecanismo de SEG-01; se evalúa en CU-06, no aquí |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | En modo de seguridad su personalidad queda suspendida (C-10); el término trazable al dominio sigue siendo `Personaje` |

## 8. Relaciones con otros casos de uso

| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| `<<extend>>` | CU-06 «Conversar con el acompañante» | **Este CU extiende a** CU-06 | Comprobado contra DCU-01 v2.1: `CU_Deriv ..> CU_Chat : <<extend>>`, etiquetado «(el gate detecta peligro explícito)». Cumple los cinco criterios de la compuerta: es **condicional** (solo ante peligro explícito), CU-06 **se completa sin él**, su efecto es **externamente observable**, extraerlo mantiene visible RF-11 sin convertir el gate en caso de uso, y **no** es un error de validación de bajo nivel. |
| Punto de extensión | CU-06, **paso 3** | Enganche | El paso 3 de CU-06 es donde el Sistema evalúa el gate determinista sobre el `Mensaje` antes de responder, y donde la rama de peligro desvía el turno hacia esta especificación. **Verificado contra ECU-06 v2.0** (tanda 1): lo que esa reescritura renumeró fueron sus **flujos alternativos** —el de «Cambiar de personaje» salió a CU-13—, **no** sus pasos; el paso 3 sigue siendo la evaluación del gate. |
| Dependencia funcional | CU-10 «Habilitar o deshabilitar el chatbot» | Concurre, sin condicionarlo | El *kill switch* condiciona **abrir** conversaciones, pero **no** interrumpe una derivación ya iniciada (`FE-03`). |
| `<<include>>` | — | — | Ninguno. La contención y la derivación son un único comportamiento indivisible, no subservicios compartidos. |
| Generalización | — | — | Ninguna. |

## 9. Precondiciones

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | Existe una `Conversacion` activa, con CU-06 en curso. | Funcional | Sí |
| PRE-02 | El gate de seguridad de CU-06 evaluó el `Mensaje` y **decidió «peligro explícito»**. | Funcional | Sí: es el disparador; sin ese veredicto este caso de uso no ocurre |
| PRE-03 | El despliegue tiene aprovisionado el texto de contención por entorno. | Datos | Sí (si no → `FE-02`) |
| PRE-04 | El despliegue tiene aprovisionados los `RecursoDeAyuda` por entorno. | Datos | Sí (si no → `FA-01`) |

> `PRE-03` y `PRE-04` son **no bloqueantes por diseño**: su incumplimiento degrada la respuesta, nunca la cancela (invariantes I-2a e I-2b). Un caso de uso de *safety* no puede tener una precondición cuyo incumplimiento deje a la persona sin ruta.

## 10. Disparador

| Campo | Valor |
|---|---|
| Evento inicial | El gate de seguridad de CU-06 decide **«peligro explícito»** (RN-11) sobre un `Mensaje` del Usuario. |
| Generado por | **Sistema** (evento de negocio detectado por el gate). **No** es una petición del actor: por eso CU-07 no cuelga de ningún actor en DCU-01. |
| Condición inicial observable | El Sistema suspende la respuesta ordinaria del turno y el `Mensaje` no viaja al Proveedor LLM. |

## 11. Flujo básico / curso normal

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Sistema | Suspende la respuesta ordinaria del turno y documenta el `Mensaje` con un `EventoDeSeguridad` | `EventoDeSeguridad`, `Mensaje` | El turno **no** viaja al Proveedor LLM (invariante I-1) | — |
| 2 | Sistema | Se atiene al modo de seguridad: **no** interpreta clínicamente el `Mensaje` ni formula preguntas exploratorias clínicas | `EventoDeSeguridad` | Sin diagnóstico, sin severidad, sin escala graduada | — |
| 3 | Sistema | Presenta el **texto fijo de contención**, que reconoce el riesgo, prioriza la seguridad y **declara que Alan o Aura es una IA que no atiende emergencias** | `EventoDeSeguridad` | El Usuario lee una contención breve y validante, sin humor ni metáforas (C-10) | **Contención + derivación** (P-12) |
| 4 | Sistema | Orienta a emergencias y a apoyo humano presentando los `RecursoDeAyuda` aprovisionados por entorno | `RecursoDeAyuda` | El Usuario obtiene una ruta concreta hacia ayuda humana | **Contención + derivación** (P-12) |
| 5 | Sistema | Marca el turno con `mode=safety_fallback` y lo entrega al Usuario | `EventoDeSeguridad` | El turno queda identificado como producido por la ruta de seguridad | **Contención + derivación** (P-12) |
| 6 | Sistema | Bloquea el chat ordinario de esa `Conversacion` | `Conversacion` | El Usuario no puede seguir conversando en esa sesión | Interfaz de chat |
| 7 | Usuario | Abre más tarde una `Conversacion` nueva, cuando lo decide | `Conversacion` | El Sistema permite reabrir el acompañamiento en una sesión nueva | Interfaz de chat |
| 8 | Sistema | Descarta el contenido del turno y **no** contabiliza ninguna clasificación de riesgo | `Mensaje`, `EventoDeSeguridad` | Sin persistencia del contenido y sin *scoring* (invariante I-3) | — |

### 11.1 Procedencia de la secuencia y recuento de pasos (cierra el hallazgo D-10)

La v1.0 encabezaba esta tabla con la nota «*Fuente: SEG-01 §4 + plan §3.8 (10 pasos)*» sobre una tabla de ocho filas, mientras su checklist declaraba ocho, igual que la tabla. Eran **dos cifras en conflicto, no tres**: la nota decía diez y todo lo demás decía ocho. Las fuentes se abrieron y se comprobaron:

| Fuente | Qué contiene de verdad | Recuento |
|---|---|---|
| SEG-01 §4 «Flujo del gate» | Un **diagrama de dos ramas** (no-peligro → Proveedor LLM gobernado · peligro-explícito → *fallback*) más dos viñetas de garantía: el gate corre antes del Proveedor LLM, y el *fallback* es local. | **Cero pasos numerados** |
| SEG-01 §5 «Contenido del *fallback*» | Tres elementos del mensaje: **contención**, **derivación** y **transparencia**. | Tres elementos, no pasos |
| `00_PLAN_CODEX_ORIGINAL.md` §3.8 | La secuencia de la derivación, enumerada. | **Diez cláusulas** |

La cifra «10» existe, pero pertenece **solo** al plan: SEG-01 §4 nunca enumeró pasos, así que la nota de v1.0 le atribuía un recuento que no tiene. **La discrepancia no viene de que las fuentes cuenten pasos internos que aquí no caben.** Viene de una fusión legítima: dos pares de cláusulas **negativas** del plan describen **una sola respuesta observable** cada uno, y una especificación de caja negra no puede convertir en dos pasos lo que el Usuario percibe como uno.

Las diez cláusulas del plan están redactadas en voz impersonal, con verbo reflexivo y sin sujeto explícito. Aquí quedan rendidas **en voz activa**, nombrando quién actúa, para que la correspondencia sea comparable con la tabla del flujo; el tenor literal vive en `00_PLAN_CODEX_ORIGINAL.md` §3.8, numerado del 1 al 10, y se coteja ahí.

| Cláusula del plan §3.8 (rendida en voz activa) | Paso de esta tabla |
|---|---|
| 1. El Sistema suspende la respuesta ordinaria. | Paso 1 |
| 2. El Sistema no interpreta clínicamente. · 3. El Sistema no formula preguntas exploratorias clínicas. | **Paso 2** (fusión: dos abstenciones, una sola conducta observable) |
| 4. El Sistema presenta un texto fijo. | Paso 3 |
| 5. El Sistema orienta a emergencias y apoyo humano. | Paso 4 |
| 6. El Sistema devuelve `mode=safety_fallback`. | Paso 5 |
| 7. La interfaz bloquea el chat ordinario para esa sesión. | Paso 6 |
| 8. El Usuario puede iniciar posteriormente una sesión nueva. | Paso 7 |
| 9. El Sistema no almacena el contenido. · 10. El Sistema no contabiliza una clasificación de riesgo. | **Paso 8** (fusión: dos prohibiciones, un solo efecto verificable) |

**Diez cláusulas → ocho pasos, con las dos fusiones señaladas.** El recuento queda auditable: quien compare las fuentes con esta tabla llega a la misma cifra.

**Lo que sí faltaba.** La comprobación destapó un hueco real: SEG-01 §5 exige **tres** elementos en el texto de contención y el flujo de v1.0 solo cubría dos. La **transparencia** —«recuerda que es una IA y que la ayuda humana es la vía indicada»— no aparecía en ningún paso. Queda incorporada al paso 3 y verificada por `RE-06` y `CA-12`. No se añade un noveno paso porque es contenido del mismo texto de contención, no una conducta separada.

## 12. Flujos alternativos

| ID | Nombre | Punto de inicio | Condición (disjunta y verificable) | Resultado | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Sin `RecursoDeAyuda` presentables | Paso 4 | La configuración de entorno **no entrega ningún `RecursoDeAyuda` presentable**, sea porque falta, porque resuelve vacía o porque su contenido no es legible. El texto de contención **sí** resuelve. | El Sistema mantiene la contención del paso 3 y orienta a emergencias y a apoyo humano en términos genéricos, **sin números ni líneas embebidos** en el producto | **Continúa** en el paso 5 | RN-06, PRIV-R5 |
| FA-02 | Turno adicional con el chat ya suspendido | Después del paso 6 | El Usuario envía otro `Mensaje` en la **misma** `Conversacion`, ya suspendida | El Sistema no reabre el chat ordinario ni invoca al Proveedor LLM; mantiene visibles la contención y la invitación a abrir una `Conversacion` nueva | **Continúa** con esa `Conversacion` suspendida | RN-05, C-3 |
| FA-03 | Peligro explícito de nuevo en la sesión siguiente | Paso 7 | En la `Conversacion` nueva que abre el Usuario, el gate vuelve a decidir «peligro explícito» | El Sistema no acumula estado entre sesiones ni endurece la respuesta: trata el turno con la misma contención y la misma derivación | **Reanuda** el flujo desde el paso 1 | RN-05, RN-11 |

> **Por qué `FA-01` es uno y no dos (cierra el hallazgo D-09).** La v1.0 tenía un flujo alternativo «Recursos no configurados» y un flujo de excepción «Falla al leer recursos» **enganchados al mismo paso 4 y con el mismo disparador de fondo**; la excepción llegaba a decir «Aplica FA-01», es decir, se declaraba redundante por escrito. Ante la elección entre separarlos o fusionarlos, el criterio decisivo es que **los flujos se distinguen por la respuesta del Sistema, no por la causa interna**: falta de clave, valor vacío y contenido ilegible producen exactamente la misma conducta observable y la misma postcondición, de modo que separarlos habría añadido a la especificación una distinción que **ninguna prueba puede discriminar**. Se fusionan en `FA-01`, con las tres causas enumeradas en su condición.
>
> Y se clasifica como **flujo alternativo, no de excepción**, con intención: por la invariante I-2b la orientación genérica es un desenlace **diseñado y correcto**, no un fallo. Llamarlo excepción contradiría el carácter *fail safe* de la ruta.
>
> La excepción queda entonces **reservada al otro elemento configurable**. SEG-01 §5 aprovisiona **dos** cosas independientes —el texto de contención y los recursos—, y que falle la primera es un caso distinto con distinta respuesta: eso es `FE-02`. Ese, y no el de v1.0, era el reparto con condiciones disjuntas.

## 13. Flujos de excepción

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje al Usuario | Estado final | Desenlace y recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Proveedor LLM o red caídos | Cualquiera | El Proveedor LLM no responde, o la red hacia él está caída | La ruta **igual opera**: es determinista y local, y en ningún paso consulta al Proveedor LLM | Contención y derivación completas, sin degradación | Contención entregada | **Continúa** el flujo sin cambio alguno; es el diseño *fail safe*, no una recuperación (RC-01 = 100 %) |
| FE-02 | Texto de contención no resoluble | Paso 3 | La configuración de entorno no entrega el texto de contención, o lo entrega ilegible | El Sistema **no** devuelve el turno al Proveedor LLM y **no** deja al Usuario sin respuesta visible: presenta una orientación mínima invariable —que no atiende emergencias, que la persona busque servicios de urgencia y a alguien de confianza— junto con los `RecursoDeAyuda` que sí resuelvan | Orientación mínima invariable, sin humor ni metáforas | Derivación entregada | **Continúa** en el paso 4; el equipo corrige el aprovisionamiento en el gate de *release* |
| FE-03 | *Kill switch* activado durante la derivación | Pasos 3–6 | El Administrador deshabilita el chatbot (CU-10) mientras el Sistema presenta la contención | El Sistema **completa** la derivación en curso: la indisponibilidad del servicio no interrumpe una ruta de seguridad ya iniciada. Después, el Usuario no puede abrir una `Conversacion` nueva mientras el chatbot siga deshabilitado | Contención y derivación completas; luego, indisponibilidad temporal | Derivación entregada; sin sesión nueva | **Continúa** hasta el paso 6; el paso 7 queda diferido hasta que el Administrador rehabilite el chatbot |

> Regla de excepción transversal: el Sistema no devuelve errores crudos, trazas de pila, claves ni metadatos internos (plan §4.13). En esta ruta la exigencia es más estricta que en el resto del producto, porque un error técnico visible durante una crisis es un daño en sí mismo.
>
> **Decisión tomada aquí:** `FE-03` no existía y la pregunta —qué manda cuando la disponibilidad y la seguridad chocan— no estaba resuelta en ningún artefacto. Se resuelve por canon: **seguridad emocional > engagement**, y por tanto también > disponibilidad. Queda anotada en `RA-04` para que sea discutible, no invisible.

## 14. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El Usuario recibió contención y derivación, y el chat ordinario de esa `Conversacion` quedó suspendido | Observación de la sesión |
| **Éxito (lo esencial)** | El Usuario terminó con **una ruta hacia ayuda humana**, concreta si el entorno la aprovisionó y genérica si no (invariantes I-2a e I-2b) | Prueba de derivación con entorno completo y con entorno degradado |
| **Invariante** | El `Mensaje` marcado como peligro explícito **nunca** viajó al Proveedor LLM (invariante I-1) | Inspección del *payload* saliente: cero turnos con veredicto de peligro |
| Fallo | No hay «fallo» funcional: la ruta es *fail safe* y degrada a orientación genérica o mínima antes que cancelarse | Prueba *fail safe* con el Proveedor LLM deshabilitado y con configuración degradada |
| Datos creados | Ninguno de contenido. El `EventoDeSeguridad` documenta la ocurrencia **sin conservar el texto** del `Mensaje` | Inspección: cero contenido conservado |
| Datos consultados | `RecursoDeAyuda` y el texto de contención, ambos de la configuración por entorno | Inspección |
| Datos eliminados | El Sistema descarta el contenido del turno al cerrar el *fallback* | Inspección de almacenamiento y de registros técnicos: sin contenido |
| Cambios de estado | Chat ordinario de la `Conversacion` → suspendido; el turno queda marcado `mode=safety_fallback` | Traza técnica |
| Efectos visibles | El Usuario ve la contención, la declaración de naturaleza de IA y la derivación; puede abrir una `Conversacion` nueva | Observación |
| No efectos | Sin clasificación de riesgo, sin conteo, sin registro individual accesible al Administrador, sin notificación a terceros y sin intervención automatizada | Inspección (PRIV-R7, plan §3.8) |

## 15. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-05 | Ante peligro explícito, la respuesta la produce el *fallback* determinista, no el Proveedor LLM. | Habilitador | Pasos 1–5, FA-02, FA-03 | MV-01 §7.1, SEG-01 |
| RN-11 | «Peligro explícito» = mensaje del Usuario que expresa de forma manifiesta intención o riesgo de daño a sí mismo o a terceros. | Término | Paso 1, FA-03, `PRE-02` | MV-01 §7.1, SEG-01 |
| RN-06 | Los `RecursoDeAyuda` se leen de configuración por entorno, no de código. | Restricción | Paso 4, FA-01 | MV-01 §7.1, SD-12 |
| RN-02.1 | Todo `Mensaje` del Usuario pasa el gate de seguridad antes de que el Proveedor LLM genere respuesta. | Habilitador | `PRE-02`, FA-03 | MV-01 §7.3, SEG-01 |
| C-3 | **Gate de seguridad previo:** ante peligro explícito, el turno lo produce SEG-01, no el Proveedor LLM. | Restricción | Paso 1, FA-02 | CONTRATO |
| C-7 | **No instrucciones de riesgo:** el Sistema no da medios ni métodos de daño. | Restricción | Todo el flujo | CONTRATO |
| C-10 | **Sin humor ni metáforas en modo seguridad:** la personalidad ordinaria queda suspendida. | Restricción | Pasos 3–5, FE-02 | CONTRATO |

## 16. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Seguridad (*fail safe*, §3.9.3) | La ruta de seguridad opera aunque el Proveedor LLM falle (RNF-06, SEG-R3). | *Fallback* entregado en el **100 %** de los casos de prueba con el Proveedor LLM deshabilitado (RC-01) |
| RE-02 | Seguridad **vecina, verificada en CU-06** (*risk identification*, §3.9.2) | El gate detecta el peligro **explícito** del conjunto de prueba (SEG-R1). La evaluación del gate pertenece al paso 3 de CU-06, como declaran §4.1 y §6: aquí se **hereda** como condición de entrada, no se realiza. | *Recall* **≥ 0,90** sobre el conjunto definido (RC-02). Honesto: explícito, no clínico |
| RE-03 | Seguridad **vecina, verificada en CU-06** (*operational constraint*, §3.9.1) | Las guardas de salida impiden que el producto emita salidas de riesgo (SEG-R4, C-7). Pertenecen al paso 6 de CU-06: aquí se **heredan**, no se realizan. | **≥ 0,95** de *prompts* adversarios con salida bloqueada o segura (RC-03) |
| RE-04 | Mantenibilidad | Señales de peligro, texto de contención y `RecursoDeAyuda` viven en configuración por entorno, no en el producto (RNF-05, SEG-R6), **salvo la orientación mínima invariable de `FE-02`**, que es conducta de último recurso y no contiene recurso, línea ni número alguno. | Búsqueda en el código: **cero** recursos, líneas o números de crisis embebidos |
| RE-05 | Seguridad (*hazard warning*, §3.9.4) | La derivación advierte el riesgo y ofrece una ruta hacia ayuda humana (SEG-R5, RF-11). | El texto de contención ofrece emergencias **y** apoyo humano, incluso en `FA-01` y en `FE-02` |
| RE-06 | Transparencia y divulgación mínima | El texto de contención declara que Alan o Aura es una IA y que la ayuda humana es la vía indicada (SEG-01 §5, C-1). La derivación es **la única** exposición de recursos externos del producto (PRIV-R5). | Inspección del texto: contiene la declaración de naturaleza de IA; ningún dato del Usuario acompaña la derivación |

## 17. Prototipos, GUI o referencias de interfaz

| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Pantalla | **Contención + derivación** (P-12) | Presentar contención, transparencia y derivación | texto fijo de contención, `RecursoDeAyuda` por entorno | Iniciar una `Conversacion` nueva | 3–5 |
| Pantalla | **Interfaz de chat** (P-10, P-11) | Alojar la `Conversacion` cuyo chat ordinario queda suspendido | — | — | 6–7 |
| *Endpoint* visible | `POST /api/chat/` con respuesta `mode=safety_fallback` | Entregar el turno producido por la ruta de seguridad | reply (texto fijo), mode | — | 5 |

> **Texto del *fallback*:** el equipo lo aprovisiona por entorno. La plantilla de referencia, con marcadores `[línea de emergencia, config]` y `[línea de apoyo local, config]`, vive citada en SEG-01 §5 y en `00_PLAN_CODEX_ORIGINAL.md` §3.8. Este artefacto **no** reproduce números fijos (RN-06, RNF-05, SD-12).
> **Pantalla comprobada contra DIS-00:** P-12 «Contención + derivación (safety fallback)» existe en el inventario, atribuida a CU-07 · RF-11, con mockup en `mockups/p12_contencion_derivacion.html` y estados «contención + recursos + nueva sesión». DIS-00 §Notas añade una directriz de diseño que esta especificación respeta: tono contenedor, recursos al frente, **sin rojo de alarma** y sin métricas.
> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` y `DIS-01_sistema_diseno.md`. Los prototipos gráficos de producción quedan pendientes de la fase de construcción.

## 18. Datos y objetos manipulados

| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| `EventoDeSeguridad` | veredicto de peligro explícito del gate | Crear (sin contenido) | Paso 1 | Determinista; **no** conserva el texto del `Mensaje` ni puntúa severidad |
| `RecursoDeAyuda` | referencia de derivación | Consultar | Paso 4, FA-01, FE-02 | Por entorno (RN-06); nunca embebido en el producto |
| `Mensaje` | contenido del turno disparador | Consultar y descartar | Pasos 1 y 8 | No persiste (PRIV-R2); no viaja al Proveedor LLM |
| `Conversacion` | estado del chat | Actualizar (suspender) | Paso 6, FA-02 | El chat ordinario queda suspendido en esa sesión |
| `DisponibilidadDelChatbot` | estado global | Consultar | FE-03, paso 7 | No interrumpe una derivación en curso |
| Texto de contención | plantilla por entorno | Consultar | Paso 3, FE-02 | Incluye contención, transparencia y orientación (SEG-01 §5) |

## 19. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Deriv` (DCU-01 v2.1) ↔ **CU-07** | Correspondencia explícita, que v1.0 no declaraba. CU-07 es uno de los diez casos de uso originales y conserva su número: DCU-01 §3 fija «numeración estable», y §2 lo lista como «CU-07 · Derivar ante peligro · Acompañamiento · RF-11» |
| Requisito funcional | RF-11 «Activar el fallback determinista ante peligro explícito (respuesta sin LLM + derivación)» | **Realizado por este CU**, exactamente el que le asigna DCU-01 §2 |
| Requisito funcional vecino | RF-10 (el gate) | **No** lo realiza este CU: vive en el paso 3 de CU-06. DCU-01 §4 lo dejó fuera del diagrama a propósito, para no convertir una validación en caso de uso |
| Objetivo de negocio | OBJ-3 | Ruta de seguridad y derivación |
| Regla de negocio | RN-05, RN-11, RN-06, RN-02.1; C-3, C-7, C-10 | Gobiernan el flujo. Todas quedan **definidas en §15**, sin remitir a otro artefacto para entenderlas |
| Requisito de calidad | RC-01, RC-02, RC-03 | Anclas de *safety* con umbral (100 %, ≥ 0,90, ≥ 0,95) |
| Requisito de privacidad | PRIV-R2, PRIV-R5, PRIV-R7 | No persistencia del contenido; divulgación mínima; sin acceso del Administrador |
| Norma | ISO/IEC 25010:2023 §3.9.1, §3.9.2, §3.9.3, §3.9.4 (vía NORM-01) | *Safety*: *operational constraint*, *risk identification*, *fail safe*, *hazard warning* |
| Requisitos de seguridad | SEG-R1…SEG-R6 (SEG-01 §6) | SEG-R2, SEG-R3 y SEG-R5 se realizan aquí; SEG-R1 y SEG-R4 en CU-06; SEG-R6 en el aprovisionamiento |
| Modelo de dominio | `EventoDeSeguridad`, `RecursoDeAyuda`, `Mensaje`, `Conversacion`, `DisponibilidadDelChatbot` | Conceptos manipulados, con las etiquetas de relación de MD-01 v1.4 |
| Diagrama de casos de uso | `CU_Deriv ..> CU_Chat : <<extend>>` («el gate detecta peligro explícito»); **sin asociación de actor** | Origen de la relación y del disparo automático |
| Caso de uso base | CU-06 «Conversar con el acompañante» | **Lo extiende** en su paso 3 |
| Caso de uso concurrente | CU-10 «Habilitar o deshabilitar el chatbot» | Su estado no interrumpe una derivación en curso (`FE-03`) |
| Prototipo | P-12 «Contención + derivación» (DIS-00) | Interfaz de los pasos 3–5 |
| Caso de prueba | CP-07 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-07 / DS-07 | DR-07 existe; DS-07 planificado |
| Criterio de aceptación | CA-01…CA-12 | Verificación; **cubren el 100 % de los flujos** (§20) |

## 20. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un `Mensaje` de peligro explícito del conjunto de prueba, cuando el gate emite su veredicto, entonces la respuesta la produce el *fallback* determinista y el turno **no** viaja al Proveedor LLM. | Flujo básico (pasos 1–5) | Traza técnica del gate e inspección del *payload* saliente |
| CA-02 | Dado el modo de seguridad activo, cuando el Usuario lee la contención, entonces el texto no usa humor, juego ni metáforas, y ofrece emergencias **y** apoyo humano. | Flujo básico (pasos 3–4) | Inspección del texto (C-10, `RE-05`) |
| CA-03 | Dada una derivación entregada, cuando el Usuario intenta seguir en esa `Conversacion`, entonces el chat ordinario está suspendido, y cuando abre una `Conversacion` nueva, entonces puede conversar de nuevo. | Flujo básico (pasos 6–7) | Prueba de sesión suspendida y de sesión nueva |
| CA-04 | Dada una derivación entregada, cuando se inspecciona el almacenamiento y los registros técnicos, entonces no hay contenido del turno ni clasificación de riesgo contabilizada, ni registro individual accesible al Administrador. | Flujo básico (paso 8) | Inspección (PRIV-R2, PRIV-R7) |
| CA-05 | Dado un entorno sin ningún `RecursoDeAyuda` presentable, cuando el gate detecta peligro explícito, entonces el Usuario recibe igualmente contención y una orientación genérica a emergencias y apoyo humano, sin que el producto exponga números embebidos. | FA-01 | Prueba con configuración de recursos vacía, ausente e ilegible |
| CA-06 | Dado un chat ya suspendido por derivación, cuando el Usuario envía otro `Mensaje` en la misma `Conversacion`, entonces el Sistema no lo envía al Proveedor LLM y mantiene visible la derivación. | FA-02 | Prueba de turno posterior a la suspensión |
| CA-07 | Dado un Usuario que abre una `Conversacion` nueva tras una derivación, cuando vuelve a expresar peligro explícito, entonces recibe la misma contención y la misma derivación, sin endurecimiento ni estado acumulado entre sesiones. | FA-03 | Prueba de dos sesiones consecutivas |
| CA-08 | Dado un entorno cuyo texto de contención no resuelve, cuando el gate detecta peligro explícito, entonces el Usuario recibe la orientación mínima invariable y los recursos que sí resuelvan, y en ningún caso una respuesta del Proveedor LLM. | FE-02 | Prueba con el texto de contención ausente e ilegible |
| CA-09 | Dado el Proveedor LLM deshabilitado o la red hacia él caída, cuando llega un `Mensaje` de peligro explícito, entonces la contención y la derivación se entregan completas y sin degradación. | FE-01 | Prueba *fail safe* (RC-01 = 100 %) |
| CA-10 | Dado el *kill switch* activado mientras el Sistema presenta la contención, cuando el Usuario llega al final de la derivación, entonces la recibió completa, y solo después el Sistema le informa que no puede abrir una `Conversacion` nueva. | FE-03 | Prueba con *kill switch* durante la derivación |
| CA-11 | Dado el producto construido, cuando se busca en el código, entonces no hay ningún recurso, línea ni número de crisis embebido: todos provienen de configuración por entorno. | Flujo básico (paso 4), `RE-04` | Búsqueda en el código (RNF-05) |
| CA-12 | Dada una contención presentada, cuando el Usuario la lee, entonces el texto declara que Alan o Aura es una IA que no atiende emergencias y que la ayuda humana es la vía indicada. | Flujo básico (paso 3), `RE-06` | Inspección del texto (SEG-01 §5) |

> **Cobertura declarada:** los siete flujos de esta especificación —básico, `FA-01`, `FA-02`, `FA-03`, `FE-02`, `FE-01` y `FE-03`— tienen al menos un criterio asociado que los cita por identificador. Es el criterio de convergencia de la skill, y v1.0 no lo cumplía: sus cuatro criterios dejaban `FA-01` y `FE-01` sin verificación.

## 21. Riesgos, ambigüedades y decisiones pendientes

| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Riesgo declarado | El gate binario **no** detecta peligro implícito, ambiguo ni encubierto. | Cobertura de seguridad | Declarado con honestidad (SEG-01 §2, §4.1 de este documento); solo se garantiza el explícito. Elevar a la escala graduada es trabajo de fase posterior. | Aceptado |
| RA-02 | Decisión pendiente | El texto del *fallback* y los `RecursoDeAyuda` —incluidas las líneas de Medellín que propone el plan— deben **revalidarse** antes del *release*. | Correctitud operativa | Aprovisionamiento por entorno; revalidación en el gate de *release*, como pide el propio plan §3.8. | Abierto |
| RA-03 | Ambigüedad resuelta (hallazgo **D-09**) | El flujo alternativo de recursos y el de excepción de configuración compartían disparador, y la excepción se remitía al alternativo por escrito: era imposible saber cuál aplicaba. | Verificabilidad de la ruta degradada | **Resuelto:** se fusionan en `FA-01`, porque la causa interna difería pero la respuesta observable era idéntica. La excepción se reserva al otro elemento configurable, el texto de contención (`FE-02`). Motivo completo en la nota de §12. | **Resuelto** |
| RA-04 | Decisión tomada aquí | Qué manda cuando la disponibilidad del servicio y una derivación en curso chocan: ningún artefacto lo resolvía. | Continuidad de la ruta de seguridad | **Decidido:** la derivación en curso se completa; el *kill switch* solo impide abrir sesiones nuevas (`FE-03`). Se sigue el canon «seguridad emocional > engagement». Conviene confirmarlo con el Rol Datos/Privacidad. | **Decidido** |
| RA-05 | Hueco cerrado (hallazgo **D-10**) | La nota de v1.0 atribuía a SEG-01 §4 un recuento de diez pasos que esa sección nunca tuvo, sobre una tabla de ocho filas, mientras el checklist también decía ocho: dos cifras en conflicto, no tres. | Auditabilidad del flujo | **Resuelto:** las tres fuentes se abrieron; la cifra pertenece solo al plan §3.8; la correspondencia diez → ocho queda tabulada en §11.1. De paso se detectó que faltaba la **transparencia** de SEG-01 §5, ahora en el paso 3. | **Resuelto** |
| RA-06 | Riesgo | Revisión del protocolo por perfil de salud mental (nivel 6, deseable). | Calidad del protocolo | Recomendada para fase posterior (SEG-01 §9). Esta especificación no la sustituye. | Abierto |
| RA-07 | Supuesto declarado | `FE-02` presenta una orientación mínima **invariable**, que por definición no proviene de configuración. | Tensión aparente con RN-06 | **Decidido:** RN-06 y RNF-05 prohíben embeber **recursos, líneas y números** —lo que caduca—, y el criterio de verificación de RNF-05 lo dice así. **SEG-R6 y `RE-04` sí hablan de mensajes**, y son las dos fuentes que hacían falta citar: por eso `RE-04` se matiza expresamente para excluir esta orientación mínima. Una conducta de último recurso, sin recursos ni líneas ni números, **no es un mensaje del gate** ni un recurso aprovisionable; y sin ella la invariante I-2b no se podría sostener. Conviene ratificarlo al aprovisionar el entorno. | **Decidido** |

## 22. Checklist de revisión metodológica

Casillas comprobadas contra el artefacto tal como queda, no contra la intención.

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Contención + derivación ante peligro explícito |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Derivar ante peligro» |
| 3 | Actor primario identificado | ✅ | Usuario adulto como **beneficiario**; el disparo del Sistema queda explicitado en §5 y §10 |
| 4 | Actores externos al sistema | ✅ | El Proveedor LLM **no** participa; los `RecursoDeAyuda` son salida, no actor |
| 5 | Flujo básico = escenario de éxito completo | ✅ | **Ocho pasos**, con la correspondencia auditable a las diez cláusulas del plan §3.8 en §11.1. La cifra se repite igual aquí y en el flujo |
| 6 | Flujos alternativos suficientes | ✅ | `FA-01`, `FA-02` y `FA-03`; v1.0 solo tenía el primero |
| 7 | Flujos de excepción relevantes | ✅ | `FE-02`, `FE-01` y `FE-03`, los tres con desenlace declarado |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | Con las etiquetas de relación transcritas del `.puml`, incluida la corrección de «origina» → «se documenta con» |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | P-12, P-10/P-11 y el *endpoint* visible; P-12 verificada contra DIS-00 |
| 11 | Reglas de negocio separadas por ID | ✅ | §15; todas definidas aquí, sin remitir a otro artefacto |
| 12 | Requisitos especiales separados | ✅ | §16, los seis con umbral o evidencia |
| 13 | Postcondiciones verificables | ✅ | §14, incluidas las invariantes I-1, I-2a e I-2b |
| 14 | Sin detalle de implementación | ✅ | Caja negra; el *endpoint* visible es punto de interacción observable, que la plantilla admite |
| 15 | Autorización como precondición, no CU incluido | ✅ | Este CU hereda el contexto autorizado de CU-06; no modela autenticación |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19, con la correspondencia alias ↔ CU-NN que v1.0 no tenía |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20, `CA-01`…`CA-12` |
| 18 | Cobertura de flujos por criterio | ✅ | **7 de 7 flujos** con criterio asociado que los cita |
| 19 | Base para robustez y secuencia | ⚠️ **Con reserva** | DR-07 ya existe y se dibujó contra la **v1.0**. Esta versión añade `FA-02`, `FA-03` y `FE-03` y reparte de otro modo la degradación de configuración, así que **DR-07 queda desalineado** hasta que la fase D.4 lo rehaga. No se marca como cumplido lo que no se ha rehecho |
| 20 | Comprensible por usuarios, analistas y desarrolladores | ✅ | — |
| 21 | Coherente con DCU-01 v2.1 y canon | ✅ | `<<extend>>` de CU-06 y ausencia de asociación de actor, ambas verificadas contra el `.puml`; sin sobre-claim clínico; sin números embebidos |

## 23. Versión resumida

| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto (beneficiario; el disparo lo hace el Sistema) |
| Objetivo | Contención + derivación por *fallback* determinista ante peligro explícito. |
| Disparador | El gate de CU-06 decide «peligro explícito» (evento del Sistema). |
| Precondiciones | `Conversacion` activa; veredicto de peligro del gate; texto y recursos aprovisionados por entorno (los dos últimos, no bloqueantes). |
| Conceptos del dominio | `EventoDeSeguridad`, `RecursoDeAyuda`, `Mensaje`, `Conversacion`, `DisponibilidadDelChatbot`. |
| Flujo básico | Suspender el turno → sin lectura clínica → contención con declaración de IA → recursos → `safety_fallback` → suspender el chat de la sesión → sesión nueva más tarde → descartar contenido. |
| Flujos alternativos | Sin recursos presentables; turno adicional con el chat suspendido; peligro de nuevo en la sesión siguiente. |
| Flujos de excepción | Texto de contención no resoluble; Proveedor LLM o red caídos; *kill switch* durante la derivación. Los tres **continúan** la derivación. |
| Postcondición de éxito | El Usuario terminó con una ruta hacia ayuda humana; sin contenido conservado ni clasificación de riesgo. |
| Reglas de negocio | RN-05, RN-11, RN-06, RN-02.1; C-3, C-7, C-10. |
| Criterios de aceptación | CA-01…CA-12, con cobertura de los siete flujos. |
| Casos relacionados | `<<extend>>` de CU-06 (paso 3); concurre con CU-10. |

**Fin de ECU-07.**
