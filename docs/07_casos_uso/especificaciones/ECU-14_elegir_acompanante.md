# ECU-14 — Especificación de caso de uso: «Elegir acompañante (Alan o Aura)» (CU-14)
**ID documento:** DOC-CU-14 · **Caso de uso:** CU-14 · **Alias en DCU-01:** `CU_Elegir` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-30 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — subobjetivo simple, sin efectos sobre datos personales más allá de un campo ya gobernado por `RN-01.6`.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §Vista Onboarding, REQ-01 (RF-06), plan §3.4. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** extraído de los **pasos 8 y 9** del flujo básico de ECU-05 v1.1 (PDR-01, fase D.3). Responde al punto 4 de la retroalimentación docente: es el caso de uso que hace visibles `Personaje`, `Alan` y `Aura` en el diagrama.

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-14 |
| Nombre | Elegir acompañante (Alan o Aura) |
| Paquete funcional | Acompañamiento |
| Nivel de abstracción | Subobjetivo (incluido por CU-05) |
| **Actor primario** | Usuario adulto |
| Prioridad | Alta (`character` es precondición funcional del chat) |
| Criticidad | Media |
| Estado | Propuesto |

> **Por qué es caso de uso y no un paso.** El catálogo de antipatrones de la skill del diagrama admite la excepción: una subfunción puede modelarse *«raramente, como un `<<include>>` justificado»*. Aquí lo está por tres razones: realiza un RF propio (**RF-06**), es testable de forma independiente (`CA-01`), y su extracción es lo que trae `Personaje`/`Alan`/`Aura` al diagrama de casos de uso.
>
> **Por qué no cuelga de ningún actor en DCU-01.** Por disciplina de asociación: el actor no se conecta a subfunciones ya incluidas por el caso de uso base. El actor primario sí existe y es quien ejecuta el paso 2.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `Personaje` | Clase de MD-01 v1.4; se especializa en `Alan` y `Aura` | prohibido: «bot», «asistente», «avatar» | **«Acompañante» es un alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3): se usa en los nombres de los casos de uso y en la interfaz por su calidez, pero el término trazable al dominio es `Personaje` |
| `character` | Campo de la `CapsulaDePerfil` que guarda la elección | prohibido: «personalidad», «perfil» | **No es autorreporte**: es elección de interlocutor y precondición funcional del chat (`RN-01.6`) |

## 2. Núcleo del caso de uso

**Curso básico.** El Sistema presenta a **Alan** (activación) y a **Aura** (calma) en la **Presentación de Alan/Aura**, describiendo el rol y el estilo de cada `Personaje`. El Usuario adulto confirma con cuál desea conversar. El Sistema completa la `CapsulaDePerfil` con el campo `character` correspondiente al `Personaje` elegido y **finaliza**, devolviendo el control a CU-05, que queda en condiciones de habilitar CU-06.

**Cursos alternativos y de excepción.** Si el Usuario cambia de elección antes de confirmar, el Sistema sustituye la selección presentada y el flujo **continúa** en el paso 2 sin dejar rastro de la elección descartada (`FA-01`). Si la sesión expira mientras se presenta la elección, el Sistema responde `401`, no escribe `character` y el flujo **termina**, devolviendo al Usuario a CU-03 (`FE-01`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador** | CU-05 alcanza el final de su paso 7 y la `CapsulaDePerfil` aún no tiene `character`. |
| Generado por | El caso de uso base (CU-05), por la relación `<<include>>`. |
| Condición inicial observable | El Sistema muestra la **Presentación de Alan/Aura**. |

## 4. Precondiciones

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa (CU-03). | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El Usuario otorgó la **capa base** del `Consentimiento` en el paso 5 de CU-05. | Negocio | Sí |
| PRE-03 | La `CapsulaDePerfil` está armada con los autorreportes respondidos, que pueden ser ninguno. | Datos | Sí |

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Sistema | Presenta a `Alan` (activación) y a `Aura` (calma) con su rol y su estilo | `Personaje`, `Alan`, `Aura` | Muestra la **Presentación de Alan/Aura** | Presentación de Alan/Aura |
| 2 | Usuario | Confirma el `Personaje` con quien desea conversar | `Personaje` | Recibe la elección | Presentación de Alan/Aura |
| 3 | Sistema | Escribe `character` en la `CapsulaDePerfil` | `CapsulaDePerfil` | La cápsula queda existente con `character` como contenido mínimo; **finaliza** y devuelve el control a CU-05 | — |

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Cambiar la elección antes de confirmar | Paso 2 | El Usuario selecciona el otro `Personaje` antes de confirmar | Sustituye la selección presentada, sin escribir nada | **Continúa** en el paso 2 | RN-01.6 |
| FE-01 | Sesión ausente | Paso 1–2 | La sesión expira durante la presentación | `401`; no escribe `character`; la cápsula queda como estaba | **Termina**; el Usuario reingresa por CU-03 | RN-01.6 |

## 7. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | La `CapsulaDePerfil` **existe** y tiene `character` con el `Personaje` elegido; CU-05 puede completar su postcondición de éxito | Inspección de la cápsula |
| Fallo | `character` no se escribe; la `CapsulaDePerfil` queda sin completar y CU-05 no habilita CU-06 | Inspección |
| Datos modificados | `CapsulaDePerfil.character` | Inspección |
| Cambios de estado | Ninguno en `Consentimiento` ni en `Usuario` | Traza |
| Efectos visibles | El Usuario ve a `Alan` y a `Aura` y sabe con quién va a conversar | Observación |

> **Lo persistido es la última elección y actúa como predeterminado.** La sesión puede usar el otro `Personaje` **sin reescribir la cápsula** (`RN-01.6`); ese cambio en sesión es CU-13, no este caso de uso.

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-01.6 | `character` no es autorreporte de perfil sino **elección de interlocutor** y precondición funcional del chat ⇒ la `CapsulaDePerfil` **siempre existe** tras el onboarding, con `character` como mínimo. El valor persistido es la última elección y actúa como predeterminado, cambiable por sesión. | Restricción | Paso 3, FA-01 | MV-01 §7.2 (SD-26) |
| RN-01.4 | Ningún **autorreporte** de la caracterización es obligatorio; el usuario puede omitir los 4. Obligatorios son solo edad, consentimiento y `character`. | Habilitador | PRE-03 | MV-01 §7.2 |
| RN-02.6 | El usuario puede cambiar de `Personaje` durante o entre conversaciones. | Habilitador | §7 (nota) | MV-01 §7.3 |

## 9. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Usabilidad | La presentación describe rol y estilo de cada `Personaje` en español CO, comprensible sin asistencia (RNF-01, RC-06). | El Usuario puede elegir sin ayuda externa |
| RE-02 | Privacidad | La elección **no** añade ningún campo a la cápsula más allá de `character` (PRIV-R1). | Inspección: la cápsula sigue teniendo 5 campos de contenido + 2 metadatos |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **Presentación de Alan/Aura** (P-09) | Presentar y elegir el `Personaje` | Elegir, Confirmar | 1–3 |

> **Hueco heredado, declarado:** ECU-05 §17 declara el *endpoint visible* `POST /onboarding/` para sus pasos 5 y 7, y **el paso que escribe `character` nunca tuvo endpoint declarado**. Queda anotado en `RA-01` y lo resuelve la fase de construcción.

## 11. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario que termina la caracterización, cuando llega a este caso de uso, entonces ve a `Alan` y a `Aura` con su rol y su estilo, y puede elegir. | Flujo básico | Observación de P-09 |
| CA-02 | Dado un usuario que omitió las cuatro preguntas de la caracterización, cuando confirma su `Personaje`, entonces la `CapsulaDePerfil` **existe igualmente** con `character` como único contenido. | Flujo básico + PRE-03 | Inspección de la cápsula |
| CA-03 | Dado un usuario que cambia de selección antes de confirmar, cuando confirma, entonces solo se escribe el `Personaje` confirmado y no queda rastro del descartado. | FA-01 | Inspección de la cápsula |
| CA-04 | Dado un usuario cuya sesión expira antes de confirmar, cuando reingresa, entonces `character` no se escribió y CU-05 no habilitó la conversación. | FE-01 | Prueba de expiración |

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Elegir` (DCU-01 v2.1) ↔ **CU-14** | Correspondencia explícita; el número sigue el orden de declaración del diagrama |
| Requisito funcional | RF-06 «Presentar a Alan y Aura (rol y estilo) antes de conversar» | Realizado por este CU |
| Objetivo de negocio | OBJ-1 | Onboarding |
| Regla de negocio | RN-01.6, RN-01.4, RN-02.6 | Gobiernan el flujo |
| Modelo de dominio | `Personaje`, `Alan`, `Aura`, `CapsulaDePerfil` | Conceptos manipulados |
| Diagrama de casos de uso | `CU_Onb ..> CU_Elegir : <<include>>` | Origen de la relación |
| Caso de uso base | CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | **Es incluido por** |
| Caso de uso relacionado | CU-13 «Cambiar de acompañante» | El cambio **en sesión** es CU-13; aquí se fija el predeterminado |
| Caso de uso relacionado | CU-11 «Reiniciar la caracterización» | Borra `character` y obliga a repetir este CU |
| Caso de prueba | CP-14 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-14 / DS-14 | Planificados (DR-14 en la fase D.4) |
| Criterio de aceptación | CA-01…CA-04 | Verificación |

> **Nota de trazabilidad (heredada de TRZ-01 §72).** RF-06 es el único RF que **no invoca ninguna regla de restricción**. No es huérfano —traza a OBJ-1 y a `CA-01`—, pero la singularidad se hereda a este caso de uso y queda declarada.

## 13. Riesgos y ambigüedades

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | Hueco heredado | El paso que persiste `character` no tiene *endpoint visible* declarado en ninguna especificación. | Resolver en la fase de construcción; no bloquea la especificación. | Abierto |

## 14. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v1.0 | 2026-07-30 | Creación (PDR-01, fase D.3, tanda 1). Extraído de los pasos 8-9 de ECU-05 v1.1, que quedan retirados de allí y sustituidos por la relación `<<include>>`. Migran íntegros: el flujo, `RN-01.6`, `RN-01.4`, el sexto criterio de aceptación de ECU-05 (aquí `CA-01`), la segunda mitad de su quinto criterio (aquí `CA-02`) y la fila `Personaje` de su §18. **Los criterios de origen se citan en prosa y no por identificador**, porque toda referencia `PREFIJO-NN` debe resolver dentro de este documento. |

**Fin de ECU-14.**
