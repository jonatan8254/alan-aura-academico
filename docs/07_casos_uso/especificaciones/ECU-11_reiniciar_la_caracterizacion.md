# ECU-11 — Especificación de caso de uso: «Reiniciar la caracterización» (CU-11)
**ID documento:** DOC-CU-11 · **Caso de uso:** CU-11 · **Alias en DCU-01:** `CU_Reinit` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23 de la plantilla de la skill `use-case-specifier`) — caso de uso **canon-sensible**: borra datos personales de forma **irreversible** y deja al Usuario **sin poder conversar** hasta rehacer la caracterización del onboarding.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §7.2 y §7.5, REQ-01 (RF-22), PRIV-01 v1.4, PER-01 v1.1, DIS-00 (inventario de pantallas), plan §3.1. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** extraído del **primer flujo alternativo** de ECU-04 v1.1 (PDR-01, fase D.3, tanda 2). Tiene objetivo, objeto y postcondición distintos de «Eliminar cuenta», y estaba degradado a flujo alternativo de esta última. Migran el flujo, las precondiciones, `RN-04.3` y `RN-01.6`, su criterio de aceptación, sus dos postcondiciones, el *endpoint* visible `POST /perfil/reiniciar/` y la pantalla P-13.

---

## 1. Control del documento

| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-11 |
| Versión | v1.0 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-31 |
| Fecha de última actualización | 2026-07-31 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-07-31 | J. Sánchez | Creación (PDR-01, fase D.3, tanda 2). Extraído del primer flujo alternativo de ECU-04 v1.1. Resuelve el **hallazgo D-02**: el reinicio es tan irreversible como la eliminación de cuenta y **no tenía requisito de confirmación**; ahora lo tiene (`RE-01`), con una advertencia que declara la pérdida del acceso al chat. Registra la contradicción con DIS-00, que califica el reinicio de «reversible». |

## 2. Entradas esperadas

| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §7.5 (vista Cuenta y acceso, familia `RN-04.1`…`RN-04.4`) y §7.2 (vista Onboarding) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`Usuario`, `CapsulaDePerfil`, `Consentimiento`, `Conversacion`, `Personaje`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Reinit`, asociado directamente al actor «Usuario adulto» | Disponible |
| Caso de uso seleccionado | CU-11 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Reglas de negocio | `RN-04.3`, `RN-01.6`, `RN-01.3`, `RN-01.4`, `RN-07`, `RN-02` | Disponible |
| Requisitos funcionales | RF-22 | Disponible |
| Requisitos especiales | RNF-01, RNF-08, **PRIV-R2/R6**, RC-04 | Disponible |
| Mapa de persistencia | PER-01 v1.1 §8 y su tabla de trazas (reinicio ≠ revocación; el reinicio borra también `character`) | Disponible |
| Restricciones | Canon: minimización, supresión efectiva, uso no punitivo, solo adultos | Disponible |
| Prototipos / GUI | **Gestión de cuenta y datos** (P-13) y **Onboarding · caracterización** (P-08) | Disponible (SD-23, alta fidelidad) — con la salvedad de `RA-01` |

## 3. Identificación

| Campo | Valor |
|---|---|
| ID | CU-11 |
| Nombre | Reiniciar la caracterización |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta (es el ejercicio del derecho de supresión sobre la cápsula) |
| Frecuencia de uso | Baja |
| Criticidad | **Alta** (borrado irreversible que además inhabilita el acceso al chat) |
| Estado | Propuesto |

## 4. Propósito

| Campo | Descripción |
|---|---|
| Objetivo | Que el Usuario **borre por completo su `CapsulaDePerfil`** —los cuatro autorreportes, `character` y los metadatos— conservando su cuenta y su `Consentimiento`. |
| Descripción breve | Desde la **Gestión de cuenta**, el Usuario pide reiniciar la caracterización; el Sistema le advierte que el borrado es irreversible y que perderá el acceso al chat, lo confirma, borra la cápsula entera y lo dirige a rehacerla. |
| Valor funcional | Materializa la supresión efectiva sobre el único dato de bienestar que el sistema conserva: el Usuario puede empezar de cero sin renunciar a su cuenta. |
| Resultado observable | La `CapsulaDePerfil` deja de existir; el `Usuario` y su `Consentimiento` permanecen; el chat queda inhabilitado hasta que el Usuario rehaga la caracterización. |

### 4.1 Reiniciar **no** es revocar — distinción canónica frente a CU-12

ECU-12 §4.1 fija la definición canónica de las **dos capas** del `Consentimiento`: la capa **base**, que autoriza procesar lo mínimo para conversar (edad declarada, `character` y el turno en curso), y la capa **personalización**, que autoriza que los cuatro autorreportes de la `CapsulaDePerfil` orienten la conversación. Esta especificación no la modifica; la usa para deslindarse.

| Dimensión | CU-11 «Reiniciar la caracterización» (este caso de uso) | CU-12 «Revocar la personalización» |
|---|---|---|
| Objeto que cambia | La `CapsulaDePerfil` | El `Consentimiento` |
| Qué le ocurre | **Se borra entera**: los cuatro autorreportes, `character` y los metadatos | Su capa de personalización pasa a estado revocado |
| Qué pasa con `character` | **Desaparece** | **Permanece intacto** |
| Qué pasa con el `Consentimiento` | **Permanece intacto**, con sus dos capas tal como estaban | Cambia: la capa de personalización queda revocada |
| ¿El Usuario puede conversar después? | **No**, hasta rehacer la caracterización | **Sí**, con acompañamiento genérico |
| Reversibilidad | **Ninguna**: lo borrado no vuelve | Reversible: la capa puede otorgarse de nuevo |
| Requisito funcional | RF-22 | RF-23 |

El bloqueo del chat que produce este caso de uso **no es un problema de consentimiento**: la capa base sigue otorgada, así que `RN-02` está satisfecha. El bloqueo lo produce `RN-01.6`, que hace de `character` una **precondición funcional** del chat, del mismo rango que el consentimiento: sin `character` no hay `Personaje` que conduzca la `Conversacion`. Es la consecuencia deliberada que PER-01 §8 registró al cerrar el hallazgo PER-H1.

> **Reinicio ≠ revocación** es además una traza explícita del mapa de persistencia (PER-01, traza **PER-T7**): reiniciar **borra** la cápsula; revocar hace que **deje de alimentar** la conversación. Son dos operaciones distintas sobre estados distintos, y confundirlas es el error que la fusión en «Gestionar cuenta y datos personales» inducía.

## 5. Actores

| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Persona ≥18 registrada, autenticada y titular de la `CapsulaDePerfil` | Solicita el reinicio y lo confirma explícitamente |
| Actor secundario | — | El Proveedor LLM **no** participa en este caso de uso | No aplica |
| Sistema externo | — | No aplica | — |
| Stakeholder relacionado | Rol **Datos/privacidad** (PLAN-01 §7, «Responsables sugeridos») | Vela por que la supresión sea efectiva y por que la advertencia sea honesta | Revisa el texto de la advertencia y verifica el borrado |

## 6. Alcance y contexto

| Campo | Valor |
|---|---|
| Alcance funcional | Borrado completo de la `CapsulaDePerfil` del propio Usuario, con confirmación explícita previa. |
| Límite del sistema | El Usuario borra **su** cápsula; el Administrador **no** interviene y nunca accede a cápsulas (PRIV-R7). El Sistema **no** toca la cuenta ni el `Consentimiento`. |
| Incluye | Advertencia de irreversibilidad y de pérdida del acceso al chat, confirmación explícita, borrado atómico de la cápsula y encaminamiento a rehacer la caracterización. |
| Excluye | Revocación de cualquier capa del `Consentimiento` (eso es CU-12), eliminación de la cuenta con borrado en cascada (eso es CU-04), exportación de datos, edición campo a campo de la cápsula. |
| Suposiciones | El Usuario tiene cuenta, sesión activa y completó el onboarding, de modo que su `CapsulaDePerfil` existe con al menos `character`. |

## 7. Modelo de dominio involucrado

| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| `Usuario` | Persona adulta registrada | Titular que ejerce el reinicio; **no cambia** | username, alias | `Usuario -- CapsulaDePerfil : posee` |
| `CapsulaDePerfil` | Resumen mínimo (`ContextoInicialConversacionalV1`) que orienta la conversación | **Se borra entera** y deja de existir | los 4 autorreportes + `character` + `schema_version` y `consent_version` | `CapsulaDePerfil -- Conversacion : orienta` |
| `Consentimiento` | Aceptación granular por capas y revocable | **No cambia**: sus dos capas quedan como estaban | capa, estado, fecha, versión | `Usuario -- Consentimiento : otorga` |
| `Conversacion` | Sesión efímera de acompañamiento | **Queda inhabilitada** mientras no exista `character` | — | `Conversacion -- Personaje : acompañada por` |
| `Personaje` | Interlocutor que conduce la sesión, especializado en `Alan` y `Aura` | Deja de estar determinado, porque `character` desaparece | — | `Personaje <|-- Alan`, `Personaje <|-- Aura` |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| Reiniciar la caracterización | Borrar por completo la `CapsulaDePerfil` | prohibido: «resetear perfil», «borrar perfil», «limpiar cuenta» | Es vocabulario de REQ-01 (RF-22), no una clase; la clase es `CapsulaDePerfil` |
| `CapsulaDePerfil` | Cápsula (`ContextoInicialConversacionalV1`) | prohibido: «perfil», `InitialConversationProfile` (nombre de persistencia) | El nombre de persistencia vive en PER-01, no en las especificaciones |
| `character` | Campo de la `CapsulaDePerfil` con el `Personaje` elegido | prohibido: «personalidad», «avatar» | **No es autorreporte**: es elección de interlocutor y precondición funcional del chat (`RN-01.6`) |
| Autorreporte | Cada uno de los cuatro campos que el Usuario responde sobre sí mismo (ánimo, energía, objetivo, estilo) | prohibido: «encuesta», «test», «puntaje» | Los cuatro son opcionales (`RN-01.4`) |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Aquí se usa poco: este caso de uso habla de la cápsula, no del interlocutor |

## 8. Relaciones con otros casos de uso

| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 «Iniciar y cerrar sesión» | Este CU depende de | Requiere sesión activa (`PRE-01`). |
| Dependencia funcional | CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | Este CU depende de | Sin onboarding completo no existe `CapsulaDePerfil` que borrar (`PRE-03`). |
| Dependencia funcional | CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | Este CU encamina a | Tras el borrado, el Usuario rehace la caracterización **desde el paso 6 de CU-05**, que ofrece los cuatro autorreportes y termina invocando CU-14 para fijar `character`. El `Consentimiento` ya existe, así que los pasos previos no vuelven a ejecutarse. |
| Dependencia funcional | CU-14 «Elegir acompañante (Alan o Aura)» | Este CU deja pendiente | `character` solo vuelve a existir cuando CU-14 lo escribe, invocado por CU-05. |
| Dependencia funcional | CU-06 «Conversar con el acompañante» | Este CU inhabilita | Mientras no exista `character`, el Usuario no puede abrir una `Conversacion` (`RN-01.6`). |
| Distinción explícita | CU-12 «Revocar la personalización» | Objetivo distinto | Detallada en §4.1: CU-12 conserva `character` y el Usuario sigue conversando; este CU lo borra y lo deja sin poder hacerlo. |
| Distinción explícita | CU-04 «Eliminar cuenta» | Objetivo distinto | CU-04 suprime el `Usuario` y arrastra en cascada cápsula, consentimiento y contadores; aquí la cuenta sobrevive intacta. |
| `<<include>>` | — | — | Ninguno. La confirmación es un paso del flujo, no un subservicio observable compartido. |
| `<<extend>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

## 9. Precondiciones

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El rol «usuario» está validado en servidor. | Autorización | Sí (si no → `FE-02`) |
| PRE-03 | Existe una `CapsulaDePerfil` asociada al Usuario, con `character` como contenido mínimo. | Datos | Sí (si no → `FA-01`) |
| PRE-04 | El `Consentimiento` del Usuario existe con su capa base otorgada. | Negocio | Sí. **No bloqueante para el borrado**, pero determina que el Usuario pueda rehacer la caracterización sin volver al inicio del onboarding |

## 10. Disparador

| Campo | Valor |
|---|---|
| Evento inicial | El Usuario elige «Reiniciar la caracterización» en la **Gestión de cuenta**. |
| Generado por | Actor (Usuario adulto). |
| Condición inicial observable | El Sistema presenta la advertencia de borrado irreversible y pide confirmación explícita. |

## 11. Flujo básico / curso normal

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Usuario | Elige «Reiniciar la caracterización» | `CapsulaDePerfil` | Presenta la advertencia exigida por `RE-01`: el borrado es **irreversible**, alcanza también `character`, y el Usuario **no podrá conversar** hasta rehacer la caracterización | **Gestión de cuenta** (P-13) |
| 2 | Usuario | Confirma el reinicio de forma explícita | `CapsulaDePerfil` | Acepta la confirmación y no la da por supuesta | **Gestión de cuenta** (P-13) |
| 3 | Sistema | Borra la `CapsulaDePerfil` completa: los cuatro autorreportes, `character`, `schema_version` y `consent_version` | `CapsulaDePerfil` | La cápsula deja de existir; el borrado es todo-o-nada (`RE-04`) | — |
| 4 | Sistema | Declara al Usuario que su cuenta y su `Consentimiento` siguen intactos y que el chat queda inhabilitado | `Usuario`, `Consentimiento` | El Usuario conoce el alcance exacto de lo ocurrido | **Gestión de cuenta** (P-13) |
| 5 | Sistema | Ofrece al Usuario rehacer la caracterización desde el paso 6 de CU-05 | `CapsulaDePerfil`, `Personaje` | Abre el acceso a **Onboarding · caracterización** (P-08); hasta completarla, el Usuario no puede abrir una `Conversacion` | **Onboarding · caracterización** (P-08) |

## 12. Flujos alternativos

| ID | Nombre | Punto de inicio | Condición | Resultado | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Caracterización ya reiniciada | Paso 1 | No existe `CapsulaDePerfil`, porque el Usuario ya la reinició antes y no la ha rehecho | El Sistema informa que no hay caracterización que borrar y ofrece rehacerla; la operación es idempotente y no produce error | **Finaliza** sin cambios y encamina al paso 6 de CU-05 | RN-04.3, RN-01.6 |
| FA-02 | Cápsula con solo `character` | Paso 2 | El Usuario omitió los cuatro autorreportes en el onboarding, así que la cápsula solo contiene `character` y sus metadatos | El Sistema borra igualmente la cápsula entera; el efecto sobre el acceso al chat es idéntico, porque lo que lo inhabilita es la ausencia de `character` | **Continúa** en el paso 3 | RN-01.4, RN-01.6 |
| FA-03 | Cancelar la confirmación | Paso 2 | El Usuario cancela la advertencia en la **Gestión de cuenta** | El Sistema no borra nada; la cápsula queda completa y el chat sigue disponible | **Cancela** y **vuelve** al paso 1 | RN-04.3 |

## 13. Flujos de excepción

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje | Estado final | Recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Cualquiera | La sesión expira | `401`; no borra la `CapsulaDePerfil` | «Tu sesión expiró» | La cápsula sigue completa | **Termina**; reingresar por CU-03 |
| FE-02 | Permiso insuficiente | Paso 1 | El rol no está autorizado | `403`; no borra nada | «No tienes permiso para esta acción» | Sin cambios | **Termina** |
| FE-03 | Confirmación ausente o petición mal formada | Paso 2 | La solicitud de reinicio llega sin la confirmación explícita que exige `RE-01`, o mal formada | `400`; no ejecuta el borrado | «No pudimos reiniciar tu caracterización; confirma de nuevo» | Sin cambios | **Vuelve** al paso 2 |
| **FE-04** | Borrado incompleto | Paso 3 | El Sistema no logra completar el borrado de la `CapsulaDePerfil` | `500`; deshace lo iniciado y deja la cápsula tal como estaba, sin estados intermedios (`RE-04`) | «No pudimos reiniciar tu caracterización; inténtalo de nuevo» | La cápsula sigue completa, con `character` | **Vuelve** al paso 1 |

> Regla de excepción transversal: no se retornan errores crudos ni *stack traces*, claves ni metadatos internos (plan §4.13).

## 14. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| **Éxito (lo esencial)** | La `CapsulaDePerfil` **deja de existir**: ni los cuatro autorreportes, ni `character`, ni los metadatos quedan recuperables | Inspección del almacenamiento: cero registros de cápsula para ese `Usuario` |
| Éxito | El `Usuario` y su `Consentimiento` **permanecen intactos**, con las dos capas tal como estaban antes del reinicio | Inspección del registro de consentimiento antes y después |
| **Invariante** | **El Usuario queda sin poder conversar** hasta rehacer la caracterización, porque `character` es precondición funcional del chat (`RN-01.6`) | Prueba de conversación: el intento de abrir una `Conversacion` no prospera |
| **Invariante** | El borrado es **atómico**: nunca queda una `CapsulaDePerfil` sin `character`, estado que `RN-01.6` declara imposible | Inspección tras un fallo inducido (`FE-04`) |
| Fallo | La `CapsulaDePerfil` queda completa y el chat sigue disponible; ninguna acción parcial persiste | Inspección |
| Datos creados | Ninguno | Inspección |
| Datos modificados | Ninguno. Este caso de uso **no actualiza** nada: solo borra | Inspección |
| Datos eliminados | La `CapsulaDePerfil` **completa** —los cuatro autorreportes, `character`, `schema_version` y `consent_version`—. Nada más: ni cuenta, ni `Consentimiento`, ni contadores | Inspección del almacenamiento |
| Cambios de estado | La cardinalidad `Usuario`–`CapsulaDePerfil` pasa de 1 a 1 a **0**, que es el estado previo al onboarding | Traza |
| Efectos visibles | La **Gestión de cuenta** confirma el reinicio y ofrece rehacer la caracterización; el acceso al chat aparece inhabilitado | Observación |

## 15. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-04.3 | El usuario puede **reiniciar su caracterización** y revocar la personalización. | Habilitador | Paso 1, FA-01, FA-03 | MV-01 §7.5 |
| RN-01.6 | `character` no es autorreporte de perfil sino la **elección de interlocutor**: es **precondición funcional** de la conversación, del mismo rango que el consentimiento. La cápsula siempre existe tras el onboarding, con `character` como contenido mínimo. | Restricción | Paso 3, paso 5, §14 (invariantes), FA-01, FA-02 | MV-01 §7.2 (SD-26) |
| RN-01.3 | La `CapsulaDePerfil` se materializa como `ContextoInicialConversacionalV1`: **cinco campos de contenido** (los cuatro autorreportes y `character`) más **dos metadatos** (`schema_version`, `consent_version`). Sin otros. | Restricción | Paso 3 (delimita qué alcanza el borrado) | MV-01 §7.2 |
| RN-01.4 | Ningún **autorreporte** de la caracterización es obligatorio; el usuario puede omitir los cuatro. Obligatorios son solo edad, consentimiento y `character`. | Habilitador | FA-02 | MV-01 §7.2 |
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. | Habilitador | §4.1 (delimita qué **no** hace este caso de uso: aquí el `Consentimiento` no cambia) | MV-01 §7.1 |
| RN-02 | No hay conversación sin la **capa base** del consentimiento otorgada. | Restricción | §4.1 (el bloqueo que produce este caso de uso **no** proviene de aquí, sino de `RN-01.6`) | MV-01 §7.1 |

## 16. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| **RE-01** | **Seguridad / Usabilidad** | **El reinicio exige confirmación explícita del Usuario**, precedida de una advertencia que declare las tres cosas a la vez: que el borrado es **irreversible**, que alcanza **también `character`** y no solo los autorreportes, y que el Usuario **perderá el acceso al chat hasta rehacer la caracterización** (RNF-08, RNF-01). **Resuelve el hallazgo D-02**: ECU-04 v1.1 exigía confirmación únicamente para eliminar la cuenta, y el reinicio —igual de irreversible— no tenía ninguna. | Prueba: sin confirmación explícita el Sistema no borra la cápsula (`FE-03`). Revisión del texto: la advertencia nombra la pérdida del acceso al chat con esas palabras |
| RE-02 | Privacidad | El borrado alcanza los cinco campos de contenido y los dos metadatos, sin remanente que permita reconstruir los autorreportes. PRIV-01 §2 fija la retención de la cápsula «hasta reinicio, revocación o eliminación»; el reinicio es uno de esos tres finales (RC-04). | Inspección del almacenamiento: cero registros de cápsula tras el reinicio |
| RE-03 | Seguridad | La decisión y el borrado ocurren en servidor, con el rol validado allí, nunca por un indicador enviado por el cliente (RNF-08). | Inspección |
| **RE-04** | **Integridad** | El borrado de la `CapsulaDePerfil` es **todo-o-nada**. Un borrado parcial dejaría una cápsula sin `character`, estado que `RN-01.6` declara imposible. | Prueba de fallo inducido (`FE-04`): la cápsula queda completa, nunca a medias |
| RE-05 | Usabilidad / no punitivo | Tras confirmar, la **Gestión de cuenta** ofrece de inmediato el acceso a rehacer la caracterización, para que el reinicio no funcione como un castigo ni deje al Usuario en un callejón sin salida (RNF-01, PRIV-R6). | El paso 5 conduce a **Onboarding · caracterización** (P-08) sin pasos intermedios |
| RE-06 | Trazabilidad | El reinicio queda fechado y auditable **sin registrar contenido de conversación ni el contenido borrado** (PRIV-R2). | Inspección de la traza: consta el evento y su fecha, no los valores suprimidos |

## 17. Prototipos, GUI o referencias de interfaz

| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Pantalla | **Gestión de cuenta y datos** (P-13, ruta `/cuenta/…`) | Pedir el reinicio, advertir y confirmar | — | Reiniciar la caracterización, Confirmar, Cancelar | 1–4 |
| Pantalla | **Onboarding · caracterización** (P-08, ruta `/onboarding/`) | Rehacer la caracterización tras el borrado | Los cuatro autorreportes | Responder, Omitir | 5 |
| *Endpoint* visible | `POST /perfil/reiniciar/` | Borrar la `CapsulaDePerfil` | confirmación explícita | Enviar | 2–3 |

> **Pantalla compartida:** P-13 la comparten CU-04, CU-11 y CU-12; no es propia de ninguno. P-08 pertenece a CU-05 y este caso de uso solo encamina hacia ella.
> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantallas P-08 y P-13) y `DIS-01_sistema_diseno.md` (tokens, doble voz Alan/Aura, componentes).
> **Salvedad, no aprobación:** el inventario de DIS-00 declara como estados clave de P-13 «default · confirmar eliminación (destructivo)» y no contempla ningún estado destructivo para el reinicio. La contradicción queda registrada en `RA-01`; esta especificación no la resuelve por su cuenta.

## 18. Datos y objetos manipulados

| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| `CapsulaDePerfil` | Los cuatro autorreportes, `character`, `schema_version`, `consent_version` | **Eliminar** (completa) | Paso 3, FA-02 | Irreversible y atómica (`RE-04`); alcanza `character` (`RN-01.6`) |
| `Usuario` | cuenta | Consultar (para identificar al titular de la cápsula) | Paso 3 | **No se elimina ni se altera**: eso es CU-04 |
| `Consentimiento` | capa, estado | Consultar (para saber si el Usuario puede rehacer la caracterización sin repetir el onboarding entero) | Paso 5, `PRE-04` | **No cambia**: cambiarlo es CU-12 |
| `Conversacion` | — | Consultar la existencia de `character` al intentar abrirse | §14 (invariante) | Sin `character` no hay `Personaje` que la conduzca |

## 19. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Reinit` (DCU-01 v2.1) ↔ **CU-11** | Correspondencia explícita. El número **no** viene del orden de declaración del `.puml`: los diez casos de uso de v1.0 conservan su numeración y DCU-01 §2 numera los cuatro nuevos del 11 al 14 en el orden de su tabla |
| Requisito funcional | RF-22 «Reiniciar/borrar la caracterización (perfil)» | Realizado **por completo** por este CU; ningún otro caso de uso lo realiza |
| Objetivo de negocio | OBJ-7, OBJ-4 | Control del usuario sobre sus datos; minimización |
| Regla de negocio | `RN-04.3`, `RN-01.6`, `RN-01.3`, `RN-01.4`, `RN-07`, `RN-02` | Gobiernan el flujo y delimitan su alcance |
| Requisito de calidad | RC-04 (security / minimización) | Ancla de calidad |
| Mapa de persistencia | PER-01 traza **PER-T7** (reinicio ≠ revocación) y §8 (el reinicio borra también `character`) | Origen de la consecuencia declarada en §4.1 |
| Modelo de dominio | `Usuario`, `CapsulaDePerfil`, `Consentimiento`, `Conversacion`, `Personaje` | Conceptos manipulados |
| Diagrama de casos de uso | `Usuario -- CU_Reinit` (asociación directa) | Origen |
| Caso de uso relacionado | CU-12 «Revocar la personalización» | Objetivo distinto: conserva `character` (§4.1) |
| Caso de uso relacionado | CU-04 «Eliminar cuenta» | Objetivo distinto: suprime el `Usuario` en cascada |
| Caso de uso encaminado | CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | Recibe al Usuario en su paso 6 para rehacer la caracterización |
| Caso de uso afectado | CU-06 «Conversar con el acompañante» | Queda inhabilitado mientras no exista `character` |
| Caso de prueba | CP-11 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-11 / DS-11 | Planificados (DR-11 en la fase D.4) |
| Criterio de aceptación | CA-01…CA-11 | Verificación |

## 20. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario con una `CapsulaDePerfil` completa, cuando confirma el reinicio, entonces la cápsula **deja de existir por entero**, `character` incluido, y el sistema lo dirige a rehacer la caracterización antes de poder conversar. *(Migra CA-02 de ECU-04 v1.1, ampliado con el alcance del borrado.)* | Flujo básico | Inspección del almacenamiento |
| CA-02 | Dado un usuario que reinicia su caracterización, cuando se inspeccionan su cuenta y su `Consentimiento`, entonces **ambos permanecen intactos**, con las dos capas tal como estaban. | Flujo básico | Inspección del registro de consentimiento antes y después |
| CA-03 | Dado un usuario que acaba de reiniciar, cuando intenta abrir una `Conversacion`, entonces **no puede conversar** y el sistema lo remite a rehacer la caracterización. | Flujo básico | Prueba de conversación |
| CA-04 | Dado un usuario que pide reiniciar, cuando el sistema presenta la advertencia, entonces esta declara que el borrado es irreversible, que alcanza `character` y que **perderá el acceso al chat** hasta rehacer la caracterización. | Flujo básico | Revisión del texto de la **Gestión de cuenta** |
| CA-05 | Dado un usuario que ya reinició su caracterización y no la ha rehecho, cuando lo intenta de nuevo, entonces el sistema informa que no hay nada que borrar, no produce error y le ofrece rehacerla. | FA-01 | Inspección de la traza |
| CA-06 | Dado un usuario que omitió los cuatro autorreportes en el onboarding, cuando reinicia, entonces la cápsula con solo `character` se borra igualmente y el acceso al chat queda inhabilitado lo mismo que en el caso completo. | FA-02 | Inspección del almacenamiento y prueba de conversación |
| CA-07 | Dado un usuario que ya vio la advertencia, cuando cancela, entonces la `CapsulaDePerfil` queda completa, el chat sigue disponible y vuelve al inicio del flujo. | FA-03 | Inspección |
| CA-08 | Dado un usuario cuya sesión expira durante el reinicio, cuando reingresa, entonces su `CapsulaDePerfil` **no cambió** y conserva `character`. | FE-01 | Prueba de expiración |
| CA-09 | Dada una petición de reinicio sin el rol autorizado, cuando llega al sistema, entonces responde `403` y la cápsula queda intacta. | FE-02 | Prueba de autorización |
| CA-10 | Dada una petición de reinicio **sin confirmación explícita**, cuando llega al sistema, entonces responde `400`, **no borra nada** y el usuario puede confirmar de nuevo. | FE-03 | Prueba de entrada inválida |
| CA-11 | Dado un fallo inducido durante el borrado, cuando el sistema responde, entonces la `CapsulaDePerfil` queda **completa**, nunca a medias y nunca sin `character`. | FE-04 | Prueba de fallo inducido e inspección |

## 21. Riesgos, ambigüedades y decisiones pendientes

| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| **RA-01** | **Contradicción con el diseño** | **DIS-00 afirma que el reinicio es reversible y es falso.** Su nota de P-13 dice, literalmente, que en esa pantalla es «todo claro y reversible salvo eliminar», y su inventario declara como estados clave de P-13 «default · confirmar eliminación (destructivo)», sin ningún estado destructivo para el reinicio. Reiniciar la caracterización **no es reversible**: borra la `CapsulaDePerfil` entera, `character` incluido, y deja al Usuario sin poder conversar. | Alto. Si el mockup se toma como especificación, el reinicio podría construirse sin advertencia ni confirmación, que es justamente el hallazgo D-02. | **No se edita DIS-00** desde aquí: pertenece a la fase de diseño, fuera del alcance del PDR-01 fase D.3. Esta especificación fija `RE-01` como fuente de verdad del comportamiento y **deja la corrección de DIS-00 pendiente y nominada**: la nota de P-13 y su columna de estados clave necesitan un estado destructivo para el reinicio. | **Abierto** |
| RA-02 | Hueco heredado, resuelto | El requisito de confirmación de ECU-04 v1.1 cubría **solo** la eliminación de cuenta. El reinicio, igual de irreversible y con un efecto adicional —dejar sin chat—, no tenía ninguno. Hallazgo **D-02**. | Un borrado irreversible sin confirmación es un defecto de seguridad de datos. | **Resuelto aquí** con `RE-01`, `FE-03` y `CA-04`/`CA-10`. La advertencia debe nombrar la pérdida del acceso al chat, no solo la irreversibilidad. | **Resuelto** |
| RA-03 | Ambigüedad | ¿El borrado de la cápsula tiene ventana de respaldo? PER-01 fija su retención «hasta reinicio, revocación o eliminación», sin ventana declarada, mientras que la cuenta sí lleva «+ 30 días». El hallazgo PER-H2 dejó **abierto por decisión** si el hosting hace respaldos. | Define si «deja de existir» es borrado físico inmediato o purga diferida. | Se resuelve en la fase de construcción, cuando se conozca la política de respaldo del entorno. No bloquea la especificación ni el análisis de robustez. | Abierto |
| RA-04 | Riesgo | Un Usuario podría reiniciar creyendo que solo borra sus respuestas del cuestionario, y descubrir después que perdió el acceso al chat. | Confianza y percepción de castigo. | Mitigado por `RE-01` (la advertencia lo dice antes) y `RE-05` (el camino de vuelta está a un paso). Verificar con usuarios en la fase de construcción. | Abierto |
| RA-05 | Hueco detectado | El estado que **produce** este caso de uso —usuario con cuenta y consentimiento pero **sin cápsula**— no tiene tratamiento declarado en la especificación de CU-06: sus precondiciones cubren las dos capas del consentimiento y su tabla de excepciones cubre la capa base revocada, pero **ninguna exige la existencia de `character`**. | Un usuario recién reiniciado llegaría al chat sin flujo de excepción que lo atienda. | Registrado para la tanda que revise CU-06 y para `DR-11`. Este documento no edita ECU-06. | **Abierto** |

## 22. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Borrar la `CapsulaDePerfil` entera |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Reiniciar la caracterización» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Sin Proveedor LLM ni Administrador |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 5 pasos, del disparador al encaminamiento de vuelta |
| 6 | Flujos alternativos suficientes | ✅ | FA-01…FA-03 |
| 7 | Flujos de excepción relevantes | ✅ | 401, 403, 400 y el borrado incompleto (500) |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | `CapsulaDePerfil`, `Usuario`, `Consentimiento`, `Conversacion`, `Personaje` |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7; «perfil» e `InitialConversationProfile` prohibidos |
| 10 | Interfaces nombradas donde aplica | ⚠️ | Las dos pantallas existen y están nombradas (P-13, P-08), **pero el inventario de DIS-00 contradice esta especificación**: califica el reinicio de reversible y no declara estado destructivo para él (`RA-01`). Que las dos existan no equivale a que su diseño esté alineado con este documento |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16, con `RE-01` como resolución del hallazgo D-02 |
| 13 | Postcondiciones verificables | ✅ | §14, incluidas las dos invariantes |
| 14 | Sin detalle de implementación | ✅ | Caja negra; el nombre de persistencia queda en PER-01 |
| 15 | Auth como precondición, no CU incluido | ✅ | `PRE-01`, `PRE-02` |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19, con la correspondencia alias ↔ CU-NN |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20, uno por cada flujo |
| 18 | Base para robustez y secuencia | ⚠️ | Los objetos de frontera, entidad y control se derivan sin ambigüedad, **pero `DR-11` heredará `RA-05`**: el estado «usuario sin cápsula» que este caso de uso produce no tiene tratamiento declarado en CU-06 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Supresión efectiva, minimización, uso no punitivo, solo adultos |

## 23. Versión resumida

| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto |
| Objetivo | Borrar por completo la `CapsulaDePerfil`, `character` incluido, conservando cuenta y `Consentimiento`. |
| Disparador | El Usuario elige «Reiniciar la caracterización» en la Gestión de cuenta. |
| Precondiciones | Sesión activa; rol usuario; `CapsulaDePerfil` existente; `Consentimiento` con la capa base otorgada. |
| Conceptos del dominio | `Usuario`, `CapsulaDePerfil`, `Consentimiento`, `Conversacion`, `Personaje`. |
| Flujo básico | Elegir → advertencia irreversible → confirmar → borrar la cápsula entera → encaminar a rehacer la caracterización. |
| Flujos alternativos | Ya reiniciada; cápsula con solo `character`; cancelar. |
| Flujos de excepción | 401; 403; 400 sin confirmación; 500 con borrado incompleto. |
| Postcondición de éxito | La cápsula deja de existir **y el Usuario queda sin poder conversar** hasta rehacerla; cuenta y consentimiento intactos. |
| Reglas de negocio | `RN-04.3`, `RN-01.6`, `RN-01.3`, `RN-01.4`, `RN-07`, `RN-02`. |
| Criterios de aceptación | CA-01…CA-11. |
| Casos relacionados | CU-05 (precede y recibe de vuelta), CU-14 (repone `character`), CU-06 (queda inhabilitado), CU-12 y CU-04 (objetivos distintos). |

**Fin de ECU-11.**
