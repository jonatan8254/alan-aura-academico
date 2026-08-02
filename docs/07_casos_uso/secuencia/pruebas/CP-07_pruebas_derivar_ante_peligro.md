# CP-07 — Casos de prueba de CU-07 «Derivar ante peligro»

**ID:** CP-07 · **Familia:** CP (pruebas derivadas de secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Propósito:** derivar los casos de prueba de `CU-07` **desde los Controladores** de `DR-07`. Es el caso de uso de *safety*: aquí la cobertura no basta, también hay que probar las **invariantes**, que son afirmaciones sobre lo que **nunca** debe ocurrir.
**Insumos:** `DR-07 v2.0` (12 controladores), `DS-07 v1.0`, `ECU-07 v2.0` (§20 `CA-01…CA-12`, §4.1 `I-1…I-4`), `SEG-01 v1.2`.
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador** contra los `.puml`.
**Consumidores:** `CP-00`, pruebas de la fase de construcción, `TRZ-DS-01`.

---

## 1. Numeración

`CU-07` ocupa **`CP-101`…`CP-121`** en la serie global (`CU-06` ocupa `CP-001`…`CP-031`).

## 2. Los 21 casos

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazabilidad |
|---|---|---|---|---|---|---|
| CP-101 | `C_DetectarPeligro` | Curso básico | `PRE-01` conversación activa; `PRE-02` el gate de CU-06 ya decidió «peligro explícito». | Llega el veredicto y activa la ruta de *fallback*. | La respuesta ordinaria queda suspendida; existe un `EventoDeSeguridad` que documenta la ocurrencia **sin contener el texto** del mensaje. | CU-07 → DR-07 → DS-07 → CP-101 · CA-01 |
| CP-102 | `C_DetectarPeligro` | Curso básico · **`I-1`** | Arnés capaz de inspeccionar el *payload* saliente. | Se procesan los mensajes de peligro explícito del conjunto de prueba (`SEG-01 §9`), uno por sesión. | El *payload* saliente contiene **cero turnos** con veredicto de peligro, en el **100 %** de los casos. | … · CA-01 · I-1 · RN-05 · C-3 · SEG-R2 |
| CP-103 | `C_MantenerModoSeguro` | Curso básico | Turno ya documentado, sin resolver. | Se ejecuta el paso 2. | La respuesta no contiene interpretación clínica ni preguntas exploratorias (ninguna pregunta sobre desde cuándo o con qué intensidad). Es **una sola conducta observable**, no fragmentada. | … · I-4 (parcial) · C-10 |
| CP-104 | `C_MantenerModoSeguro` | **FE-01 · tomado** | Proveedor LLM deshabilitado o red caída. | El turno recorre la cadena completa con el proveedor caído. | Los ocho pasos se completan **íntegros y sin degradación**; el registro de red muestra **cero solicitudes salientes** hacia el proveedor en cualquier punto. | … · CA-09 · FE-01 · RC-01 = 100 % |
| CP-105 | `C_MantenerModoSeguro` | **FE-01 · no tomado** | Proveedor disponible y red operativa. | Mismo mensaje, mismo veredicto. | La conducta es **indistinguible** de `CP-104`; el registro de red muestra igualmente cero solicitudes — la disponibilidad del proveedor **no altera el resultado** porque ningún paso lo consulta. | … · FE-01 · C-3 |
| CP-106 | `C_MostrarContencion` | Curso básico | `PRE-03` cumplida (texto aprovisionado). | Se resuelve el texto fijo de contención. | En P-12 el texto reconoce el riesgo, prioriza la seguridad y **declara que Alan o Aura es una IA que no atiende emergencias**, indicando que la ayuda humana es la vía. | … · CA-02 · CA-12 · RE-06 |
| CP-107 | `C_MostrarContencion` | Curso básico · **`I-4`** | Texto ya presentado. | Se audita contra un lexicón de marcadores de personalidad (humor, juego, metáfora). | **Cero marcadores**; tono breve y validante; **no varía según el personaje activo**. | … · CA-02 · I-4 · C-10 |
| CP-108 | `C_DerivarARecursos` | Curso básico | `PRE-04` cumplida (recursos aprovisionados). | Se resuelven los `RecursoDeAyuda` del entorno. | P-12 muestra referencias concretas leídas de la configuración; la derivación **no incluye ningún dato personal** junto a ellas. | … · CA-02 · RE-05 · RE-06 |
| CP-109 | `C_DerivarARecursos` | Curso básico · **`I-2a`** | Recursos **sí** aprovisionados (para aislar la variable); proveedor caído. | Se resuelven los recursos con el proveedor caído. | El Usuario recibe **los mismos recursos concretos** que con el proveedor disponible: la caída no reduce ni condiciona la ruta hacia ayuda humana. | … · CA-09 · I-2a · RNF-06 · RC-01 |
| CP-110 | `C_DerivarARecursos` | Curso básico · **`RE-04`** | Código fuente disponible para inspección estática. | Búsqueda exhaustiva de números, líneas de crisis o nombres de servicios escritos como literales. | **Cero coincidencias** embebidas; toda referencia se resuelve por configuración de entorno. | … · CA-11 · RE-04 · RN-06 · RNF-05 |
| CP-111 | `C_MarcarFallback` | Curso básico | Continuación de `CP-108`. | Se marca el turno al cierre del paso 4. | El turno trae `mode=safety_fallback` visible; el `EventoDeSeguridad` lo identifica como producto de la ruta de seguridad. | … · CA-01 |
| CP-112 | `C_BloquearChatOrdinario` | Curso básico | *Kill switch* no activado. | Intenta escribir un mensaje ordinario en la misma conversación. | P-10 **no acepta continuar**: no se genera ninguna respuesta conversacional nueva para ese intento. | … · CA-03 |
| CP-113 | `C_PermitirSesionNueva` | Curso básico | `DisponibilidadDelChatbot` = habilitado. | Abre una conversación nueva cuando lo decide. | Conversa con normalidad: el chat ordinario **ya no está bloqueado** en esta conversación. | … · CA-03 |
| CP-114 | `C_DescartarContenido` | Curso básico · **`I-3`** | Turno ya resuelto y marcado. | Se cierra el *fallback* del turno. | Inspección de almacenamiento y registros: **no existe** el contenido textual, **no existe** puntuación ni clasificación de riesgo, y el panel del Administrador **no expone** ningún registro individual. | … · CA-04 · I-3 · PRIV-R2 · PRIV-R7 |
| CP-115 | `C_OrientacionSinRecursos` | **FA-01** | `PRE-04` incumplida — recursos ausentes, vacíos o ilegibles (las tres causas fusionadas); `PRE-03` sí cumplida. | Se intenta resolver los recursos y no se obtiene ninguno presentable. | Recibe igualmente la contención del paso 3 y una orientación genérica a emergencias y apoyo humano, **sin un solo número o línea embebido**; continúa al paso 5 con la misma marca. | … · CA-05 · FA-01 · I-2b · RN-06 |
| CP-116 | `C_MantenerContencionVisible` | **FA-02 · tomado** | Chat ya suspendido en esa conversación. | Escribe otro mensaje en la **misma** conversación suspendida. | **No reabre** el chat ni genera solicitud nueva hacia el proveedor; la pantalla mantiene visibles la contención y la invitación a abrir una conversación nueva. | … · CA-06 · FA-02 · RN-05 · C-3 |
| CP-117 | `C_DetectarPeligro` | **FA-03 · tomado** | Nueva conversación abierta; el nuevo mensaje vuelve a contener señal de peligro. | El gate decide de nuevo «peligro explícito». | Recibe **exactamente la misma** contención y derivación que la primera vez; **ningún elemento indica reincidencia, endurecimiento ni estado acumulado** entre sesiones. | … · CA-07 · FA-03 · RN-05 · RN-11 |
| CP-118 | `C_PermitirSesionNueva` | **FA-03 · no tomado** | Nueva conversación abierta. | Envía un mensaje ordinario, sin señal de peligro. | El gate no emite veredicto; **CU-07 no se activa**; recibe respuesta conversacional ordinaria bajo CU-06, sin contención ni derivación. | … · PRE-02 · RN-11 |
| CP-119 | `C_OrientacionMinimaInvariable` | **FE-02** | `PRE-03` incumplida — texto de contención ausente o ilegible; recursos **sí** aprovisionados (para aislar el fallo). | Se intenta resolver el texto y no se obtiene ninguno legible. | Ve una orientación **mínima e invariable** (no se atienden emergencias, busque urgencias y a alguien de confianza) que **no contiene ningún recurso, línea ni número**; continúa al paso 4, donde los recursos sí aprovisionados se presentan aparte; el turno **no vuelve al proveedor** y el Usuario **no queda sin respuesta visible**. | … · CA-08 · FE-02 · I-2b · RA-07 |
| CP-120 | `C_CompletarPeseAKillSwitch` | **FE-03 · tomado** | Contención en curso (pasos 3-6); el Administrador deshabilita el chatbot mientras se presenta. | Se consulta el estado global sin que la derivación se detenga. | Contención, derivación, marca y bloqueo **se completan íntegros**, igual que en el curso básico, pese a que el chatbot ya está deshabilitado. | … · CA-10 · FE-03 · RA-04 |
| CP-121 | `C_CompletarPeseAKillSwitch` | **FE-03 · consecuencia** | Derivación ya completada; chatbot sigue deshabilitado. | Intenta abrir una conversación nueva (paso 7). | A diferencia de `CP-113`, **impide** abrir la sesión nueva y lo comunica; esa imposibilidad aparece **solo después** de entregada la derivación, nunca antes ni en su lugar. | … · CA-10 · FE-03 · RA-04 |

*(A partir de `CP-102` la trazabilidad se abrevia: en todas las filas es `CU-07 → DR-07 → DS-07 → CP-XXX`.)*

---

## 3. Verificación de cobertura

Comprobada por el orquestador contra `DR-07_robustez_derivar_ante_peligro.puml`.

**Derivación — los 12 controladores:**

| Controlador | CP | | Controlador | CP |
|---|---|---|---|---|
| `C_DetectarPeligro` | 101, 102, 117 | | `C_DescartarContenido` | 114 |
| `C_MantenerModoSeguro` | 103, 104, 105 | | `C_OrientacionSinRecursos` | 115 |
| `C_MostrarContencion` | 106, 107 | | `C_OrientacionMinimaInvariable` | 119 |
| `C_DerivarARecursos` | 108, 109, 110 | | `C_MantenerContencionVisible` | 116 |
| `C_MarcarFallback` | 111 | | `C_CompletarPeseAKillSwitch` | 120, 121 |
| `C_BloquearChatOrdinario` | 112 | | `C_PermitirSesionNueva` | 113, 118 |

**12/12.** Cota inferior respetada: 21 ≥ 12.

**Caminos:** `FA-01` (115) · `FA-02` (116) · `FA-03` (117 tomado / 118 no tomado) ·
`FE-01` (104 tomado / 105 no tomado) · `FE-02` (119) · `FE-03` (120 + 121). **6/6.**

**Las cuatro invariantes, cada una con su caso** — esto es lo que distingue a un caso de uso de
*safety* de uno ordinario:

| Invariante | Qué afirma | CP |
|---|---|---|
| `I-1` | El turno **nunca** llega al Proveedor LLM | **CP-102** (inspección de *payload*, 100 % del conjunto) |
| `I-2a` | Siempre hay ruta a ayuda humana **aunque falle el proveedor o la red** | **CP-109** |
| `I-2b` | Y también si falla el **aprovisionamiento por entorno** | **CP-115** (sin recursos) y **CP-119** (sin texto) |
| `I-3` | No conserva contenido ni puntúa riesgo | **CP-114** |
| `I-4` | Personalidad suspendida: sin humor ni metáforas | **CP-107** |

## 4. Tres decisiones de derivación que conviene conocer

1. **`I-2a` y `FE-01` se separan** (`CP-109` vs. `CP-104`) aunque compartan precondición: uno mide
   la **integridad de toda la cadena** con el proveedor caído; el otro, que **los recursos
   concretos** siguen siendo los mismos. `ECU-07` los distingue como invariantes distintas.
2. **`CP-105` es el caso que más dice del diseño.** Prueba `FE-01` **no tomado** —proveedor
   disponible— y exige que el resultado sea *indistinguible* del caso con el proveedor caído.
   Si algún día difieren, es que alguien introdujo una dependencia que `C-3` prohíbe.
3. **`CP-119` verifica ausencia, no procedencia.** La orientación mínima invariable de `FE-02` es
   la **única excepción declarada** a «todo por entorno» (`RA-07`): por diseño no proviene de
   configuración, porque debe sobrevivir precisamente al fallo de la configuración. Por eso el
   caso comprueba que no contiene recurso, línea ni número — no de dónde sale.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 21 casos derivados de los 12 controladores de `DR-07`, los 6 flujos no básicos con sus ramas tomada y no tomada, y las cuatro invariantes de *safety* con caso propio. |
