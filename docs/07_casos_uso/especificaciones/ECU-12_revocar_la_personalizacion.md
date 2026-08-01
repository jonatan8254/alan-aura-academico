# ECU-12 — Especificación de caso de uso: «Revocar la personalización» (CU-12)
**ID documento:** DOC-CU-12 · **Caso de uso:** CU-12 · **Alias en DCU-01:** `CU_Revoc` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-30 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23 de la plantilla de la skill `use-case-specifier`) — caso de uso **canon-sensible**: toca el consentimiento, que es el eje del canon de privacidad del proyecto.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §Vista Cuenta y acceso, REQ-01 (RF-23), PRIV-01, PER-01, plan §3.1. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** extraído del **flujo alternativo «Revocar personalización»** de ECU-04 v1.1 (PDR-01, fase D.3). Tiene objetivo, objeto y postcondición distintos de «Eliminar cuenta», y estaba degradado a flujo alternativo de esta última.

---

## 1. Control del documento

| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-12 |
| Versión | v1.0 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-30 |
| Fecha de última actualización | 2026-07-30 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-07-30 | J. Sánchez | Creación (PDR-01, fase D.3, tanda 1). Extraído del segundo flujo alternativo de ECU-04 v1.1. Introduce la **separación del `Consentimiento` en dos capas** (base y personalización), que resuelve el hallazgo D-01 del certificado de robustez. |

## 2. Entradas esperadas

| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Cuenta y acceso (familia RN-04.1…RN-04.4) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`Usuario`, `Consentimiento`, `CapsulaDePerfil`, `Conversacion`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Revoc` | Disponible |
| Caso de uso seleccionado | CU-12 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Reglas de negocio | RN-04.3, RN-07, RN-01.5, RN-02 | Disponible |
| Requisitos funcionales | RF-23 | Disponible |
| Requisitos especiales | RNF-01, RNF-08, **PRIV-R1/R3/R8**, RC-04 | Disponible |
| Restricciones | Canon: consentimiento granular revocable, uso no punitivo, minimización | Disponible |
| Prototipos / GUI | **Gestión de cuenta** (P-13) | Disponible (SD-23, alta fidelidad) |

## 3. Identificación

| Campo | Valor |
|---|---|
| ID | CU-12 |
| Nombre | Revocar la personalización |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta (es el ejercicio efectivo del derecho a revocar) |
| Frecuencia de uso | Baja |
| Criticidad | **Alta** (consentimiento, minimización, uso no punitivo) |
| Estado | Propuesto |

## 4. Propósito

| Campo | Descripción |
|---|---|
| Objetivo | Que el Usuario **retire la capa de personalización** de su `Consentimiento`, de modo que la `CapsulaDePerfil` **deje de orientar** la conversación, **sin perder el acceso al servicio**. |
| Descripción breve | Desde la gestión de cuenta, el Usuario revoca la personalización; el Sistema le explica el alcance del cambio, lo confirma y marca esa capa como revocada. A partir del turno siguiente, el Proveedor LLM ya no recibe los autorreportes. |
| Valor funcional | Materializa el canon: el consentimiento es **granular y revocable**, y su retiro **no es punitivo** — el Usuario sigue pudiendo conversar. |
| Resultado observable | La `CapsulaDePerfil` no vuelve a alimentar la conversación; el chat sigue disponible con el acompañamiento genérico. |

### 4.1 Las dos capas del `Consentimiento` — decisión de diseño de esta especificación

El `Consentimiento` deja de ser un interruptor único y pasa a tener dos capas independientes, cada una con su propio efecto al retirarse:

| Capa | Qué autoriza | Qué pasa al revocarla | Dónde se otorga | Dónde se revoca |
|---|---|---|---|---|
| **base** | Procesar lo mínimo para conversar: la edad declarada, `character` y el turno en curso | **No hay conversación** (`RN-02`) | Paso 5 de CU-05 | Durante el onboarding (flujo alternativo de CU-05) o al eliminar la cuenta (CU-04) |
| **personalización** | Usar los cuatro **autorreportes** de la `CapsulaDePerfil` para orientar la conversación | Se conversa igual, sin que la cápsula oriente (`RN-07`) | Paso 6 de CU-05, junto con la caracterización opcional | **Este caso de uso**, en cualquier momento |

`character` **no** pertenece a la capa de personalización: por `RN-01.6` es elección de interlocutor y **precondición funcional** del chat, así que lo cubre la capa base. Por eso revocar la personalización **no** deja al Usuario sin poder conversar.

> **Alcance declarado, no un olvido.** El MVP **no ofrece revocar la capa base después del onboarding** como acción separada: hacerlo equivaldría a quedarse sin servicio, y esa intención se atiende con CU-04 «Eliminar cuenta», que además suprime la cuenta y sus registros en cascada. La decisión queda anotada en `RA-02`.

## 5. Actores

| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Persona ≥18 registrada, autenticada y titular del `Consentimiento` | Solicita la revocación y la confirma |
| Actor secundario | — | El Proveedor LLM **no** participa en este caso de uso | No aplica |
| Sistema externo | — | No aplica | — |
| Stakeholder relacionado | Rol Datos/Privacidad | Vela por que la revocación sea efectiva y no punitiva (PLAN-01 §7) | Revisa el texto y verifica el efecto |

## 6. Alcance y contexto

| Campo | Valor |
|---|---|
| Alcance funcional | Retiro de la capa de personalización del `Consentimiento` y cese del uso de los autorreportes. |
| Límite del sistema | Cambia el estado de una capa del `Consentimiento` y marca los autorreportes para descarte (PRIV-R3); **no** borra la `CapsulaDePerfil` en el acto (eso es CU-11) ni la cuenta (eso es CU-04). |
| Incluye | Explicación del alcance del cambio, confirmación y cese efectivo del uso de la cápsula. |
| Excluye | Borrado de la cápsula, borrado de la cuenta, revocación de la capa base, exportación de datos. |
| Suposiciones | El Usuario tiene cuenta, sesión activa y otorgó ambas capas en el onboarding. |

## 7. Modelo de dominio involucrado

| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| `Usuario` | Persona adulta registrada | Titular que ejerce la revocación | — | `Usuario -- Consentimiento : otorga` |
| `Consentimiento` | Aceptación **granular** y revocable | Se **modifica**: la capa de personalización pasa a revocada | capa ∈ {base, personalizacion}, estado ∈ {otorgado, revocado}, fecha, versión | `Usuario -- Consentimiento` |
| `CapsulaDePerfil` | Resumen mínimo que orienta la conversación | Sus **4 autorreportes** dejan de orientar y quedan marcados para descarte; **`character` permanece** | los 4 autorreportes + `character` + metadatos | `CapsulaDePerfil -- Conversacion : orienta` |
| `Conversacion` | Sesión efímera de acompañamiento | Se ve afectada a partir del turno siguiente | — | `CapsulaDePerfil -- Conversacion` |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| Revocar la personalización | Retirar la **capa de personalización** del `Consentimiento` | prohibido: «desactivar cuenta», «darse de baja», «borrar perfil» | Es vocabulario de REQ-01 (RF-23), no una clase; la clase es `Consentimiento` |
| `Consentimiento` | Aceptación granular por capas y revocable | prohibido: «permiso», «términos», `ConsentRecord` (nombre de persistencia) | El nombre de persistencia vive en PER-01, no en las especificaciones |
| `CapsulaDePerfil` | Cápsula (`ContextoInicialConversacionalV1`) | prohibido: «perfil» | Revocar **no** la borra: la deja sin uso |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Se usa por calidez en la interfaz; el término trazable al dominio es `Personaje` |

## 8. Relaciones con otros casos de uso

| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 «Iniciar y cerrar sesión» | Este CU depende de | Requiere sesión activa (`PRE-01`). |
| Dependencia funcional | CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | Este CU depende de | Sin `Consentimiento` otorgado no hay nada que revocar (`PRE-03`). |
| Dependencia funcional | CU-06 «Conversar con el acompañante» | Este CU afecta a | Tras la revocación, la conversación **continúa** sin que la cápsula la oriente. |
| Distinción explícita | CU-11 «Reiniciar la caracterización» | Objetivo distinto | CU-11 **borra la cápsula entera**, `character` incluido, e inhabilita el chat hasta rehacerla. Este CU **conserva `character`** y solo marca los autorreportes para descarte, así que el Usuario sigue pudiendo conversar. Confundirlos es el error que la fusión en «Gestionar cuenta» inducía. |
| Distinción explícita | CU-04 «Eliminar cuenta» | Objetivo distinto | CU-04 suprime cuenta y datos en cascada; aquí no se borra nada. |
| `<<include>>` | — | — | Ninguno. La confirmación es un paso del flujo, no un subservicio observable compartido. |
| `<<extend>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

## 9. Precondiciones

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El rol «usuario» está validado en servidor. | Autorización | Sí (si no → `FE-02`) |
| PRE-03 | Existe un `Consentimiento` con la capa de personalización en estado **otorgado**. | Datos | Sí (si no → `FA-01`) |
| PRE-04 | Existe una `CapsulaDePerfil` con al menos un autorreporte. | Datos | No bloqueante: si solo tiene `character`, la revocación es válida y su efecto es nulo (`FA-02`) |

## 10. Disparador

| Campo | Valor |
|---|---|
| Evento inicial | El Usuario elige «Revocar la personalización» en la **Gestión de cuenta**. |
| Generado por | Actor (Usuario adulto). |
| Condición inicial observable | El Sistema muestra el alcance del cambio y pide confirmación. |

## 11. Flujo básico / curso normal

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Usuario | Elige «Revocar la personalización» | `Consentimiento` | Presenta el alcance del cambio: la `CapsulaDePerfil` dejará de orientar la conversación y **el chat seguirá disponible** | Gestión de cuenta |
| 2 | Usuario | Confirma la revocación | `Consentimiento` | Recibe la confirmación | Gestión de cuenta |
| 3 | Sistema | Marca la capa de personalización del `Consentimiento` como revocada, con su fecha | `Consentimiento` | La capa base permanece otorgada | — |
| 4 | Sistema | Confirma al Usuario que la personalización quedó revocada y que puede seguir conversando | `CapsulaDePerfil`, `Conversacion` | Desde el turno siguiente, los autorreportes de la cápsula no viajan al Proveedor LLM | Gestión de cuenta |

## 12. Flujos alternativos

| ID | Nombre | Punto de inicio | Condición | Resultado | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Personalización ya revocada | Paso 1 | La capa de personalización ya está en estado revocado | El Sistema informa que ya lo está y no repite el cambio; operación idempotente | **Finaliza** sin cambios | RN-07 |
| FA-02 | Cápsula sin autorreportes | Paso 1 | La `CapsulaDePerfil` solo tiene `character` porque el Usuario omitió las cuatro preguntas | El Sistema revoca igualmente la capa; el efecto observable es nulo porque no había nada que dejara de usarse | **Finaliza** con la capa revocada | RN-01.4, RN-07 |
| FA-03 | Cancelar la confirmación | Paso 2 | El Usuario cancela en la **Gestión de cuenta** | El Sistema no modifica el `Consentimiento` | **Cancela** y **vuelve** al paso 1 | RN-04.3 |

## 13. Flujos de excepción

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje | Estado final | Recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Cualquiera | La sesión expira | `401`; no modifica el `Consentimiento` | «Tu sesión expiró» | Sin cambios | **Termina**; reingresar por CU-03 |
| FE-02 | Permiso insuficiente | Paso 1 | El rol no está autorizado | `403` | «No tienes permiso para esta acción» | Sin cambios | **Termina** |
| FE-03 | Entrada inválida | Paso 2 | Petición mal formada | `400`; no ejecuta la acción | «No pudimos registrar tu revocación; inténtalo de nuevo» | Sin cambios | **Vuelve** al paso 2 |

> Regla de excepción transversal: no se retornan errores crudos ni *stack traces*, claves ni metadatos internos (plan §4.13).

## 14. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | La capa de personalización del `Consentimiento` está en estado **revocado** con su fecha; la capa base sigue **otorgada** | Inspección del registro de consentimiento |
| **Éxito (lo esencial)** | La `CapsulaDePerfil` **no vuelve a alimentar** la conversación: sus autorreportes dejan de viajar al Proveedor LLM | Prueba de conversación: inspección del *payload* del turno siguiente |
| **Invariante** | **El Usuario sigue pudiendo conversar.** Revocar la personalización **no es punitivo** | Prueba de conversación tras la revocación |
| Fallo | El `Consentimiento` queda sin cambios; la cápsula sigue orientando la conversación | Inspección |
| Datos creados | Ninguno | Inspección |
| Datos modificados | `Consentimiento`: la capa de personalización pasa a revocada | Traza |
| Datos eliminados | Ninguno **de inmediato**, pero los cuatro autorreportes quedan **marcados para descarte** (PRIV-R3). `character` no se marca: lo cubre la capa base y sin él no habría `Personaje` | Inspección: los autorreportes constan como marcados; `character` intacto |
| Cambios de estado | `Consentimiento` (capa personalización) → revocado | Traza |
| Efectos visibles | El acompañamiento pasa a ser genérico: el `Personaje` conserva su tono, pero la conversación no arranca orientada por los autorreportes | Observación |

## 15. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. | Habilitador | Paso 3, FA-01, FA-02 | MV-01 §7.1 |
| RN-04.3 | El usuario puede reiniciar su caracterización y **revocar la personalización**. | Habilitador | Paso 1, FA-03 | MV-01 §7.5 |
| RN-01.5 | El consentimiento se puede revocar desde el onboarding **y después**. | Habilitador | Paso 1 | MV-01 §7.2 |
| RN-01.4 | Ningún **autorreporte** de la caracterización es obligatorio; el usuario puede omitir los 4. Obligatorios son solo edad, consentimiento y `character`. | Habilitador | FA-02 | MV-01 §7.2 |
| RN-01.6 | `character` no es autorreporte sino **elección de interlocutor** y precondición funcional del chat. | Restricción | §4.1 (por qué la revocación no impide conversar) | MV-01 §7.2 (SD-26) |
| RN-02 | No hay conversación sin la **capa base** del consentimiento otorgada. | Restricción | §4.1 (delimita qué **no** hace este CU) | MV-01 §7.1 |

## 16. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | Tras la revocación, ningún autorreporte de la `CapsulaDePerfil` viaja al Proveedor LLM (PRIV-R1, RC-04). | Inspección del *payload*: 0 campos de autorreporte |
| RE-02 | Usabilidad / no punitivo | El paso 1 declara explícitamente que **el chat sigue disponible**, para que el Usuario no crea que pierde el servicio (RNF-01, canon de uso no punitivo). | El texto de la **Gestión de cuenta** nombra ese efecto |
| RE-03 | Seguridad | La revocación se decide y se aplica en servidor, nunca por un indicador enviado por el cliente (RNF-08). | Inspección |
| RE-04 | Trazabilidad | La revocación queda fechada y es auditable **sin registrar contenido de conversación** (PRIV-R8). | Inspección de la traza |
| RE-05 | Privacidad | Al revocar, los cuatro autorreportes quedan **marcados para descarte**, no solo sin uso (**PRIV-R3**: «al revocar cesa el uso de la cápsula y se marca para descarte»). | Inspección: los autorreportes constan marcados |

## 17. Prototipos, GUI o referencias de interfaz

| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Pantalla | **Gestión de cuenta** (P-13) | Revocar la personalización | — | Revocar la personalización, Confirmar, Cancelar | 1–4 |

> **Hueco declarado:** ECU-04 v1.1 §17 nombraba los *endpoints visibles* de reiniciar y eliminar, pero **nunca declaró uno para revocar**. Queda anotado en `RA-01`.
> **Pantalla:** la única de este caso de uso es **Gestión de cuenta (P-13)**. En DIS-00, P-07 es el **consentimiento granular del onboarding**, que pertenece a CU-05: no hay ninguna pantalla de ajustes de personalización en el inventario de diseño.
> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantallas P-07 y P-13) y `DIS-01_sistema_diseno.md`. La pantalla P-13 pasa a ser **compartida por CU-04, CU-11 y CU-12**, no propia de ninguno.

## 18. Datos y objetos manipulados

| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| `Consentimiento` | capa, estado, fecha | Actualizar (revocar la capa de personalización) | Paso 3 | Revocable (`RN-07`); la capa base no se toca |
| `CapsulaDePerfil` | los 4 autorreportes | Marcar para descarte y dejar de consultar | Paso 4 | **No se borra en el acto**; el borrado inmediato y total, `character` incluido, es CU-11 |
| `Conversacion` | — | Consultar el estado del consentimiento al construir el contexto | Paso 4 | El efecto se observa desde el turno siguiente |

## 19. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Revoc` (DCU-01 v2.1) ↔ **CU-12** | Correspondencia explícita; el número sigue el orden de declaración del diagrama |
| Requisito funcional | RF-23 «Revocar la personalización (uso de la cápsula)» | Realizado por este CU |
| Objetivo de negocio | OBJ-7, OBJ-4 | Control del usuario sobre sus datos; minimización |
| Regla de negocio | RN-07, RN-04.3, RN-01.5, RN-01.4, RN-01.6, RN-02 | Gobiernan el flujo |
| Requisito de calidad | RC-04 (minimización) | Ancla de calidad |
| Modelo de dominio | `Usuario`, `Consentimiento`, `CapsulaDePerfil`, `Conversacion` | Conceptos manipulados |
| Diagrama de casos de uso | `Usuario -- CU_Revoc` (asociación directa) | Origen |
| Caso de uso relacionado | CU-11 «Reiniciar la caracterización» | Objetivo distinto: borra la cápsula |
| Caso de uso relacionado | CU-04 «Eliminar cuenta» | Objetivo distinto: suprime la cuenta |
| Caso de uso afectado | CU-06 «Conversar con el acompañante» | Consume el estado que este CU produce |
| Caso de prueba | CP-12 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-12 / DS-12 | Planificados (DR-12 en la fase D.4) |
| Criterio de aceptación | CA-01…CA-09 | Verificación |

## 20. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario con la personalización otorgada, cuando la revoca, entonces la `CapsulaDePerfil` **no vuelve a alimentar** la conversación. | Flujo básico | Prueba de conversación e inspección del *payload* |
| CA-02 | Dado un usuario que acaba de revocar la personalización, cuando abre una conversación, entonces **puede conversar con normalidad**: la revocación no le quita el servicio. | Invariante §14 | Prueba de conversación |
| CA-03 | Dado un usuario que revoca la personalización, cuando se inspecciona el almacenamiento, entonces los cuatro autorreportes constan **marcados para descarte** y `character` **sigue intacto**, de modo que el Usuario conserva su acompañante. | Postcondición «datos eliminados» | Inspección |
| CA-04 | Dado un usuario que ya revocó la personalización, cuando lo intenta de nuevo, entonces el sistema informa el estado y no repite el cambio. | FA-01 | Inspección de la traza |
| CA-05 | Dado un usuario que ya vio el alcance del cambio, cuando cancela, entonces el `Consentimiento` queda intacto y vuelve al inicio del flujo. | FA-03 | Inspección |
| CA-06 | Dado un usuario que omitió las cuatro preguntas del onboarding, cuando revoca la personalización, entonces la capa queda revocada y el efecto observable es nulo, sin error alguno. | FA-02 | Inspección de la traza |
| CA-07 | Dado un usuario cuya sesión expira durante la revocación, cuando reingresa, entonces el `Consentimiento` **no cambió** y la personalización sigue vigente. | FE-01 | Prueba de expiración |
| CA-08 | Dada una petición de revocación sin el rol autorizado, cuando llega al sistema, entonces responde `403` y el `Consentimiento` queda intacto. | FE-02 | Prueba de autorización |
| CA-09 | Dada una petición de revocación mal formada, cuando llega al sistema, entonces responde `400`, no ejecuta la acción y el Usuario puede reintentar. | FE-03 | Prueba de entrada inválida |

## 21. Riesgos, ambigüedades y decisiones pendientes

| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Hueco heredado | La revocación **no tenía *endpoint visible* declarado** en ninguna especificación: ECU-04 v1.1 §17 solo nombraba los de reiniciar y eliminar. | Contrato de interfaz | Resolver en la fase de construcción; no bloquea la especificación. | Abierto |
| RA-02 | Decisión de alcance | El MVP **no ofrece revocar la capa base después del onboarding** como acción separada. | Ejercicio del derecho a revocar | **Decidido:** revocar la base equivale a quedarse sin servicio, y esa intención se atiende con CU-04, que además suprime la cuenta y sus registros en cascada. La capa base sí se puede rechazar durante el onboarding. Se declara para que sea discutible, no invisible. | **Decidido** |
| RA-03 | Ambigüedad resuelta | Antes de esta especificación, `Consentimiento` era un interruptor único, y «revocar» no decía **qué** se revocaba. El certificado de robustez lo registró como hallazgo D-01: un usuario con el consentimiento revocado **entraba al chat sin obstáculo** en el modelo. | Coherencia del canon de privacidad | **Resuelto:** se separa en capas base y personalización (§4.1); CU-06 gana un flujo de excepción para la capa base revocada. | **Resuelto** |
| RA-04 | Riesgo | Un usuario podría interpretar «revocar la personalización» como «darse de baja». | Confianza | Mitigado por `RE-02`: el paso 1 declara que el chat sigue disponible. Verificar con usuarios en la fase de construcción. | Abierto |

## 22. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Retirar una capa del consentimiento |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Revocar la personalización» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Sin Proveedor LLM en este CU |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 4 pasos |
| 6 | Flujos alternativos suficientes | ✅ | FA-01…FA-03 |
| 7 | Flujos de excepción relevantes | ✅ | 401, 403, 400 |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | `Consentimiento`, `CapsulaDePerfil`, `Conversacion` |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7; `ConsentRecord` prohibido |
| 10 | Interfaces nombradas donde aplica | ✅ | Gestión de cuenta (P-13), Ajustes de personalización (P-07) |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | §14, incluida la invariante de no punición |
| 14 | Sin detalle de implementación | ✅ | Caja negra |
| 15 | Auth como precondición, no CU incluido | ✅ | `PRE-01`, `PRE-02` |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19, con la correspondencia alias ↔ CU-NN |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ✅ | DR-12 / DS-12 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Consentimiento granular revocable; uso no punitivo |

## 23. Versión resumida

| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto |
| Objetivo | Retirar la capa de personalización del `Consentimiento` sin perder el acceso al servicio. |
| Disparador | El Usuario elige «Revocar la personalización» en la Gestión de cuenta. |
| Precondiciones | Sesión activa; rol usuario; `Consentimiento` con la capa de personalización otorgada. |
| Conceptos del dominio | `Usuario`, `Consentimiento`, `CapsulaDePerfil`, `Conversacion`. |
| Flujo básico | Elegir → ver el alcance → confirmar → capa revocada → la cápsula deja de orientar. |
| Flujos alternativos | Ya revocada; cápsula sin autorreportes; cancelar. |
| Flujos de excepción | 401; 403; 400. |
| Postcondición de éxito | La cápsula no vuelve a alimentar la conversación **y el Usuario sigue pudiendo conversar**. |
| Reglas de negocio | RN-07, RN-04.3, RN-01.5, RN-01.4, RN-01.6, RN-02. |
| Criterios de aceptación | CA-01…CA-09. |
| Casos relacionados | CU-05 (precede), CU-06 (consume el estado), CU-11 y CU-04 (objetivos distintos). |

**Fin de ECU-12.**
