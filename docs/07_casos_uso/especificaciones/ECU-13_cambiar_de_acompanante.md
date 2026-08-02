# ECU-13 — Especificación de caso de uso: «Cambiar de acompañante» (CU-13)
**ID documento:** DOC-CU-13 · **Caso de uso:** CU-13 · **Alias en DCU-01:** `CU_Cambiar` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-30 · **Versión:** v1.1 · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — extensión simple, sin efectos sobre datos persistidos.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §Vista Conversación, REQ-01 (RF-12), plan §4.9. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** extraído del **flujo alternativo «Cambiar de personaje»** de ECU-06 v1.0 (PDR-01, fase D.3). Era una meta que el usuario pide deliberadamente, sepultada como flujo alternativo.

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-13 |
| Nombre | Cambiar de acompañante |
| Paquete funcional | Acompañamiento |
| Nivel de abstracción | Usuario |
| **Actor primario** | Usuario adulto |
| Prioridad | Media |
| Criticidad | Baja (no altera datos persistidos ni el gate de seguridad) |
| Estado | Propuesto |

> **Por qué sí cuelga de un actor en DCU-01**, a diferencia de CU-14: es una extensión que el Usuario **pide de forma deliberada**, no una subfunción automática. La disciplina de asociación permite conectar al actor con metas independientes que puede perseguir dentro del escenario dominante.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `Personaje` | Clase de MD-01 v1.4; se especializa en `Alan` y `Aura` | prohibido: «bot», «asistente», «avatar» | **«Acompañante» es un alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3): se usa en el nombre de este caso de uso y en la interfaz por su calidez, pero el término trazable al dominio es `Personaje` |
| `Conversacion` | Sesión efímera; **no** persiste | prohibido: «chat guardado», «historial» | El cambio ocurre dentro de una `Conversacion` abierta |
| `character` | Campo de la `CapsulaDePerfil` con la elección persistida | prohibido: «personalidad» | Este caso de uso **no lo reescribe**: solo cambia el `Personaje` de la sesión en curso (`RN-01.6`) |

## 2. Núcleo del caso de uso

**Curso básico.** Con una `Conversacion` abierta, el Usuario adulto solicita cambiar de acompañante desde la **Interfaz de chat**. El Sistema sustituye el `Personaje` que conduce la sesión —de `Alan` a `Aura` o a la inversa— sin cerrar la `Conversacion`, sin reiniciar el onboarding y **sin reescribir** `character` en la `CapsulaDePerfil`. El Sistema confirma el cambio en la **Interfaz de chat** y el flujo **continúa** en el paso de envío de mensajes de CU-06, ahora con el nuevo `Personaje` modulando el tono.

**Cursos alternativos y de excepción.** Si el Usuario solicita el `Personaje` que ya conduce la sesión, el Sistema no altera nada y el flujo **continúa** sin cambio observable (`FA-01`). Si el chatbot queda deshabilitado entre la solicitud y la sustitución, el Sistema responde `409` y el flujo **termina** con la `Conversacion` cerrada por indisponibilidad (`FE-01`). Si la sesión expira, el Sistema responde `401`, no sustituye el `Personaje` y el flujo **termina** devolviendo al Usuario a CU-03 (`FE-02`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador** | El Usuario solicita cambiar de acompañante en cualquier turno de una `Conversacion` abierta. |
| Generado por | Actor (Usuario adulto). |
| Condición inicial observable | El Sistema recibe la solicitud de cambio y muestra el selector de `Personaje` en la **Interfaz de chat**. |

## 4. Precondiciones

Cuatro se heredan de CU-06 —sesión, rol, capa base del consentimiento y chatbot habilitado— porque este caso de uso lo extiende sobre una conversación en curso. La quinta, `PRE-05`, es **propia del punto de extensión**: exige que la `Conversacion` ya esté abierta. El límite de tasa de CU-06 **no** se hereda: cambiar de acompañante no consume turno.

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → `FE-02`) |
| PRE-02 | El rol es «usuario» validado en servidor. | Autorización | Sí |
| PRE-03 | El Usuario es adulto y tiene vigente la **capa base** del `Consentimiento`. | Negocio | Sí |
| PRE-04 | El chatbot está **habilitado** (`DisponibilidadDelChatbot`). | Negocio | Sí (si no → `FE-01`) |
| PRE-05 | Existe una `Conversacion` abierta. | Datos | Sí |

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Usuario | Solicita cambiar de acompañante | `Personaje` | Muestra el selector de `Personaje` | Interfaz de chat |
| 2 | Usuario | Confirma el otro `Personaje` (`Alan` ↔ `Aura`) | `Personaje`, `Alan`, `Aura` | Sustituye el `Personaje` que conduce la `Conversacion` | Interfaz de chat |
| 3 | Sistema | Confirma el cambio al Usuario sin cerrar la `Conversacion` | `Conversacion` | La sesión sigue abierta con el nuevo `Personaje`; **continúa** en el paso 2 de CU-06 | Interfaz de chat |

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Confirmar el `Personaje` en curso | Paso 2 | El Usuario elige el `Personaje` que ya conduce la sesión | No altera nada; sin cambio observable de tono | **Continúa** en el paso 2 de CU-06 | RN-02.6 |
| FE-01 | Chatbot deshabilitado | Paso 2 | El *kill switch* se activa entre la solicitud y la sustitución | `409`; informa indisponibilidad temporal | **Termina**; la `Conversacion` se cierra y el Usuario reintenta luego | RN-02.7 |
| FE-02 | Sesión ausente | Paso 1–2 | La sesión expira | `401`; no sustituye el `Personaje` | **Termina**; el Usuario reingresa por CU-03 | PRE-01 |

## 7. Postcondiciones

Ninguna existía: ECU-06 nunca cubrió este flujo en su sección de postcondiciones. Se redactan aquí por primera vez.

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | La `Conversacion` sigue **abierta** y la conduce el `Personaje` recién elegido; los turnos posteriores llevan su tono | Observación de la sesión |
| **Invariante** | **`CapsulaDePerfil.character` no cambia.** La sesión usa otro `Personaje` sin reescribir la cápsula (`RN-01.6`) | Inspección de la cápsula antes y después |
| Fallo | El `Personaje` en curso se mantiene o la `Conversacion` se cierra por indisponibilidad; en ningún caso se reinicia el onboarding | Inspección |
| Datos creados | Ninguno | Inspección |
| Datos modificados | Ninguno persistido; solo el `Personaje` de la sesión en curso | Inspección de BD = sin escritura |
| Cambios de estado | Ninguno en `Conversacion` (sigue activa) ni en `Consentimiento` | Traza |
| Efectos visibles | El tono de las respuestas cambia; el contenido previo de la sesión permanece visible y no se reenvía al Proveedor LLM más allá de los ≤4 intercambios habituales | Observación |

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-02.6 | El usuario puede cambiar de `Personaje` durante o entre conversaciones. | Habilitador | Paso 2, FA-01 | MV-01 §7.3 |
| RN-02.4 | La personalidad (`Alan`/`Aura`) modula el **tono**, no las reglas de seguridad. | Restricción | Paso 3 | MV-01 §7.3 |
| RN-01.6 | Lo persistido en `character` es la **última elección** del onboarding y actúa como predeterminado; la sesión puede usar otro `Personaje` sin reescribir la cápsula. | Restricción | §7 (invariante) | MV-01 §7.2 (SD-26) |
| RN-02.7 | No se conversa si el chatbot está deshabilitado. | Restricción | PRE-04, FE-01 | MV-01 §7.3 |

> **`RN-02.9` retirada de la trazabilidad (`H-5`, corregido).** §12 la citaba entre las reglas que
> «gobiernan el flujo», pero esta sección nunca la definió: era una **referencia colgante**. Y no
> podía definirse, porque `RN-02.9` es el **límite de tasa** (3/min, 30/día — `H-04`), que gobierna
> el envío de mensajes en `CU-06`, no el cambio de acompañante. Cambiar de `Personaje` no consume
> cuota: no hay llamada al proveedor. Se retira de §12 en vez de inventarle una definición aquí.

## 9. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Seguridad (*safety*) | El cambio de `Personaje` **no** altera el gate de seguridad ni las guardas de salida: solo el *system prompt* de personalidad (`RN-02.4`). | El gate se evalúa igual antes y después del cambio |
| RE-02 | Privacidad | El cambio no añade ni reenvía datos al Proveedor LLM: el contexto sigue siendo cápsula + persona + ≤4 intercambios + turno (PRIV-R1/R9). | Inspección del *payload*: 0 campos adicionales |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **Interfaz de chat** (P-10, estado «cambiar personaje») | Alternar entre `Alan` y `Aura` sin salir de la conversación | Cambiar acompañante, Confirmar | 1–3 |
| *Endpoint* visible | `POST /api/chat/` | El campo `character` del `ChatRequestV1` transporta el `Personaje` de la sesión | Enviar | 2–3 |

> La **Interfaz de chat** es una pantalla compartida con CU-06: allí se conversa, aquí se alterna el `Personaje`.

## 11. Criterios de aceptación

Ninguno existía: los seis criterios de ECU-06 cubren el gate, el *payload*, el *fallback*, la no persistencia, los límites y los fallos del proveedor, y **ninguno cubría este flujo**. Se redactan aquí por primera vez.

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario con una `Conversacion` abierta con `Alan`, cuando cambia a `Aura`, entonces la conversación **continúa sin cerrarse** y los turnos siguientes llevan el tono de `Aura`. | Flujo básico | Observación de la sesión |
| CA-02 | Dado un usuario que cambia de acompañante en sesión, cuando se inspecciona la `CapsulaDePerfil`, entonces `character` **conserva el valor del onboarding** y no fue reescrito. | Invariante §7 | Inspección de la cápsula antes y después |
| CA-03 | Dado un usuario que cambia de acompañante, cuando envía el siguiente mensaje, entonces el gate de seguridad se evalúa igual que antes del cambio. | RE-01 | Traza técnica del gate |
| CA-04 | Dado un usuario que confirma el `Personaje` que ya conducía la sesión, cuando el sistema responde, entonces no hay cambio observable ni escritura alguna. | FA-01 | Inspección |
| CA-05 | Dado el *kill switch* activado durante el cambio, cuando el usuario confirma, entonces recibe `409` y la conversación termina sin error crudo. | FE-01 | Prueba con *kill switch* |
| CA-06 | Dada una sesión que expira durante el cambio, cuando el usuario confirma, entonces recibe `401`, el `Personaje` en curso **no se sustituye** y la cápsula queda intacta. | FE-02 | Prueba de expiración |

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Cambiar` (DCU-01 v2.1) ↔ **CU-13** | Correspondencia explícita. El número **no** viene del orden de declaración del `.puml`: los diez casos de uso de v1.0 conservan su numeración original y DCU-01 §2 numera los cuatro nuevos del 11 al 14 en el orden de su tabla. Esta nota existe porque, sin ella, el número parecería arbitrario |
| Requisito funcional | RF-12 «Permitir cambiar de personaje durante o entre conversaciones» | Realizado por este CU en su mitad «**durante**», que es la que exige una `Conversacion` abierta (`PRE-05`). La mitad «**entre** conversaciones» se realiza en CU-14, que fija el `Personaje` predeterminado, y en el paso 1 de CU-06, que lo usa al abrir |
| Objetivo de negocio | OBJ-2 | Conversación de acompañamiento |
| Regla de negocio | RN-02.6, RN-02.4, RN-01.6, RN-02.7 | Gobiernan el flujo — **las cuatro definidas en §8** |
| Modelo de dominio | `Personaje`, `Alan`, `Aura`, `Conversacion`, `CapsulaDePerfil`, `DisponibilidadDelChatbot` | Conceptos manipulados |
| Diagrama de casos de uso | `CU_Cambiar ..> CU_Chat : <<extend>>` | Origen de la relación |
| Caso de uso base | CU-06 «Conversar con el acompañante» | **Lo extiende**; el punto de extensión es cualquier turno de una conversación abierta |
| Caso de uso relacionado | CU-14 «Elegir acompañante (Alan o Aura)» | Fija el predeterminado en el onboarding; aquí solo se cambia en sesión |
| Caso de prueba | CP-13 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-13 / DS-13 | Planificados (DR-13 en la fase D.4) |
| Criterio de aceptación | CA-01…CA-06 | Verificación |

**El gate de `<<extend>>` se verificó contra sus cinco criterios:** el comportamiento es opcional y lo pide el Usuario ✅; CU-06 se completa sin él ✅; el cambio de tono es externamente observable ✅; extraerlo hace visible RF-12, que estaba sepultado ✅; y no representa un fallo de validación menor ni manejo de errores de bajo nivel ✅.

## 13. Riesgos y ambigüedades

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | Ambigüedad heredada | ECU-06 no declaraba si el cambio de `Personaje` reescribe `character`. La única frase con contenido verificable vivía en la §18 de **ECU-05**, la especificación equivocada. | **Resuelto aquí:** no lo reescribe. Se eleva a **invariante** de §7 y a `CA-02`, con la inspección antes/después como evidencia. | **Resuelto** |
| RA-02 | Decisión pendiente | Si el cambio debe reflejarse en los ≤4 intercambios que viajan al Proveedor LLM, o si el contexto arrastra turnos del `Personaje` anterior. | El contrato de `ChatRequestV1` no lo distingue hoy. Se resuelve en la fase de construcción; no bloquea la especificación. | Abierto |

## 14. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v1.1 | 2026-08-01 | **SD-30, hallazgo `H-5` de `DS-00`.** §12 citaba `RN-02.9` entre las reglas que gobiernan el flujo, pero §8 nunca la definió: **referencia colgante**. Y no podía definirse aquí — `RN-02.9` es el límite de tasa, que gobierna el envío de mensajes en `CU-06`; cambiar de acompañante no consume cuota porque no hay llamada al proveedor. Se retira de §12, con el motivo escrito en §8. |
| v1.0 | 2026-07-30 | Creación (PDR-01, fase D.3, tanda 1). Extraído del primer flujo alternativo de ECU-06 v1.0, que queda retirado de allí y sustituido por la relación `<<extend>>`. Migran el flujo, las cinco precondiciones, `RN-02.6` y `RN-02.4`, y la pantalla P-10. **Se redactan por primera vez las postcondiciones y los cinco criterios de aceptación**, que el flujo de origen nunca tuvo. |

**Fin de ECU-13.**
