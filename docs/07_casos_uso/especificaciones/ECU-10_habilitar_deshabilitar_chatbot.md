# ECU-10 — Especificación de caso de uso: «Habilitar o deshabilitar el chatbot» (CU-10)
**ID documento:** DOC-CU-10 · **Caso de uso:** CU-10 · **Alias en DCU-01:** `CU_Kill` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.1 (SD-35: `PRE-03` cerrada — el kill switch arranca habilitado). v2.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23 de la plantilla de la skill `use-case-specifier`) — caso de uso **de control global (*kill switch*) con auditoría**, y **canon-sensible por elevación**: condiciona a CU-06, así que un defecto aquí se paga en la conversación.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §Vista Administración, REQ-01 (RF-17, RF-18), PRIV-01, PER-01, DIS-00 (P-16), plan §3.2/§3.7/§4.14. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento

| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-10 |
| Versión | v2.0 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-31 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v2.1 | 2026-08-04 | J. Sánchez | **SD-35: `PRE-03` cerrada.** Declaraba que «ningún artefacto declara todavía cuál es el valor inicial de un entorno recién aprovisionado». `ADR-004-D2` lo fija: **`habilitado`**. **No es *fail-closed*, y se declara** — el motivo es la conveniencia de la demostración académica, y la condición de reversa es material: en cuanto haya personas reales, pasa a `deshabilitado`. El *gate* y el *fallback* no dependen de este estado. **Ningún flujo ni criterio cambia.** |
| v2.0 | 2026-07-31 | J. Sánchez | **PDR-01, fase D.3, tanda 4.** Se declara en §4.1 **qué alcanza el *kill switch* y qué no**, con el efecto sobre las conversaciones ya abiertas separado del efecto sobre las nuevas. Toda regla citada queda **definida en §15** (v1.0 invocaba la familia de administración con notación de familia, que no resolvía). Los flujos de excepción ganan **desenlace explícito** y aparecen `FA-03` (estado ya vigente) y `FE-03` (confirmación mal formada). Los criterios de aceptación pasan de 3 a **9**, uno por flujo. El registro de auditoría se nombra `AccionAdministrativa`, como en MD-01 §2, y su nombre de persistencia queda acotado a PER-01. Se añade la correspondencia alias ↔ `CU-NN` en §19. |
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |

## 2. Entradas esperadas

| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §7.4 Vista Administración (familia **RN-03.1…RN-03.7**) y §7.3 (RN-02.7) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`DisponibilidadDelChatbot`, `Administrador`, `Conversacion`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Kill` | Disponible |
| Caso de uso seleccionado | CU-10 | Disponible |
| Actor principal | Administrador de plataforma | Disponible |
| Reglas de negocio | RN-03.1, RN-03.4, RN-03.5, RN-03.6, RN-03.7, RN-02.7 | Disponible |
| Requisitos funcionales | RF-17, RF-18 | Disponible |
| Requisitos especiales | RNF-08, RC-07, PRIV-R7, PRIV-R10, PER-T2 | Disponible |
| Restricciones | Canon: el administrador no ve datos individuales; uso no punitivo; minimización | Disponible |
| Registro de auditoría | `AccionAdministrativa` (plan §4.14; ficha de persistencia en PER-01 §3.7) | Disponible |
| Prototipos / GUI | **Disponibilidad del chatbot** (P-16), con estados habilitado/deshabilitado y diálogo de confirmación | Disponible (SD-23, alta fidelidad) |

## 3. Identificación

| Campo | Valor |
|---|---|
| ID | CU-10 |
| Nombre | Habilitar o deshabilitar el chatbot |
| Paquete funcional | Administración de plataforma |
| Nivel de abstracción | Usuario |
| Actor primario | Administrador de plataforma |
| Prioridad | Alta |
| Frecuencia de uso | Baja (eventual) |
| Criticidad | **Alta** (control global del servicio conversacional) |
| Estado | Propuesto |

## 4. Propósito

| Campo | Descripción |
|---|---|
| Objetivo | Que el Administrador **cambie el estado global de `DisponibilidadDelChatbot`** (*kill switch*), con confirmación explícita y con la acción registrada. |
| Descripción breve | Desde el panel de administración, el Administrador consulta el estado global vigente, elige el estado contrario, confirma, y el Sistema aplica el cambio y lo registra con su autor y su fecha. Con el chatbot deshabilitado, ningún Usuario abre una `Conversacion` nueva. |
| Valor funcional | Control operativo de contingencia —por ejemplo, un incidente del Proveedor LLM o un texto de seguridad que hay que revisar— **sin tocar código ni desplegar**. |
| Resultado observable | El estado global queda cambiado; el panel muestra el último cambio con autor y fecha; la apertura de conversaciones queda condicionada. |

### 4.1 Qué alcanza el *kill switch* y qué no — decisión de alcance de esta especificación

La v1.0 decía «con el chatbot deshabilitado, ningún usuario puede iniciar conversación» y, a la vez, «el cambio surte efecto de inmediato»: dos afirmaciones que no dicen lo mismo cuando ya hay una `Conversacion` abierta. Esta versión separa los tres casos y declara **solo lo que está sostenido aguas arriba**:

| Situación | Qué ocurre | Dónde está sostenido |
|---|---|---|
| Un Usuario intenta **abrir** una `Conversacion` con el chatbot deshabilitado | El Sistema **no la abre** y responde `409` con un aviso de indisponibilidad temporal | `RN-02.7`, y el flujo de excepción que CU-06 engancha a su paso de apertura |
| Un Usuario pide **cambiar de acompañante** con una `Conversacion` abierta y el *kill switch* se activa entre la solicitud y la sustitución | El Sistema responde `409` y esa `Conversacion` **se cierra** | Declarado en el caso de uso de cambio de acompañante, que extiende a CU-06; es el **único** caso de conversación abierta resuelto por escrito hoy |
| Un Usuario tiene una `Conversacion` abierta y sigue conversando en ella cuando el Administrador deshabilita el chatbot | **Sin regla general decidida.** Ni MV-01 §7.4, ni `RN-02.7` —que habla de *iniciar*—, ni el plan §3.7 lo resuelven | **Hueco declarado en `RA-02`** |

> **Lo que esta especificación afirma, sin ambigüedad:** el *kill switch* **impide abrir conversaciones nuevas**. Ese es el efecto verificable y es el que anuncia el diálogo de confirmación de P-16 («ningún usuario podrá iniciar una conversación hasta que lo vuelvas a habilitar»).
> **Lo que esta especificación NO inventa:** si un turno en curso se corta, se deja terminar o continúa hasta que el Usuario cierre. Decidirlo aquí sería fabricar una regla de negocio desde la especificación de un caso de uso ajeno al chat. Queda en `RA-02` para que el líder del proyecto la decida y se propague a CU-06 en la fase D.5.

## 5. Actores

| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Administrador de plataforma | Rol técnico-operativo con login separado y **exactamente tres funciones**: directorio mínimo, métricas agregadas y *kill switch* | Consulta el estado global, elige el contrario y lo confirma |
| Actor secundario | — | El Proveedor LLM **no** participa: este caso de uso no invoca al modelo | No aplica |
| Stakeholder relacionado | Usuario adulto | Queda afectado —con el chatbot deshabilitado no abre conversaciones— pero **no interviene** en el flujo | Indirecta |
| Stakeholder relacionado | Rol Datos/Privacidad | Vela por que la auditoría no reidentifique a nadie (PER-T2) | Revisa el registro |

## 6. Alcance y contexto

| Campo | Valor |
|---|---|
| Alcance funcional | Cambio del estado global de `DisponibilidadDelChatbot`, con confirmación explícita y con la acción registrada. |
| Límite del sistema | El Administrador gobierna un **estado global**; **no** ve conversaciones, cápsulas ni ningún dato individual, y **no** suspende a un Usuario concreto. |
| Incluye | Consultar el estado vigente, elegir el contrario, confirmarlo, aplicarlo y registrar la `AccionAdministrativa` con autor y fecha. |
| Excluye | Edición de recursos, textos o *prompts* (`RN-03.6`); suspensión individual; exportación; lectura de contenido conversacional; cualquier efecto sobre conversaciones ya abiertas más allá de lo declarado en §4.1. |
| Suposiciones | El Administrador entró por el login separado del panel de administración y el Sistema confirmó su rol en el servidor. |

## 7. Modelo de dominio involucrado

| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| `DisponibilidadDelChatbot` | Estado global del servicio conversacional | Se **modifica**: es el objeto del caso de uso | estado ∈ {habilitado, deshabilitado} | `Administrador -- DisponibilidadDelChatbot : tiene a cargo`; `DisponibilidadDelChatbot -- Conversacion : condiciona` |
| `Administrador` | Rol de plataforma, especialización de `TitularDeCuenta` | Ejecuta y confirma el cambio | rol (heredado del supertipo) | `Administrador -- DisponibilidadDelChatbot` |
| `Conversacion` | Sesión efímera de acompañamiento | **Queda condicionada**: con el chatbot deshabilitado no se abre ninguna nueva | estado ∈ {activa, cerrada} | `DisponibilidadDelChatbot -- Conversacion` |
| `AccionAdministrativa` | Registro de auditoría del cambio | Se **crea** en el paso 4 | autor, fecha | **No es clase de MD-01**: quedó fuera del dominio por decisión (MD-01 §2, que remite a `RA-01` de este documento) |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `DisponibilidadDelChatbot` | Estado global del servicio conversacional | prohibido: «apagar el servidor», «modo mantenimiento», `PlatformSetting` (nombre de persistencia) | El nombre de persistencia vive en PER-01 §3.4, no en las especificaciones |
| *Kill switch* | Alias operativo de la acción de habilitar o deshabilitar el chatbot | prohibido: «borrar el chatbot», «desinstalar» | Está en el glosario de MV-01 §12 y es el vocabulario de RF-17 |
| `AccionAdministrativa` | Registro de quién cambió el estado y cuándo | prohibido: `AdministrativeAction` (nombre de persistencia), «log», «bitácora» | La ficha de persistencia vive en PER-01 §3.7 |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Solo aparece aquí al nombrar CU-06; el término trazable al dominio es `Personaje` |

## 8. Relaciones con otros casos de uso

| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 «Iniciar y cerrar sesión» | Este CU depende de | Exige sesión con rol de administrador validado en servidor (`PRE-01`, `PRE-02`). |
| Condiciona | CU-06 «Conversar con el acompañante» | Este CU **condiciona a** | El estado que este CU produce decide si un Usuario puede abrir una `Conversacion` (`RN-02.7`). El alcance exacto de ese condicionamiento está acotado en §4.1. |
| Condiciona | CU-13 «Cambiar de acompañante» | Este CU **condiciona a** | Ese caso de uso hereda de CU-06 la precondición de chatbot habilitado y declara el único efecto sobre una conversación ya abierta que existe hoy por escrito. |
| Coexistencia | CU-08 «Consultar directorio de usuarios», CU-09 «Consultar métricas de uso» | Ninguna | Son las otras dos funciones del Administrador (`RN-03.1`); comparten panel y sesión, pero ningún flujo. |
| `<<include>>` | — | — | Ninguno. La confirmación es un paso del flujo, no un subservicio observable compartido. |
| `<<extend>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

## 9. Precondiciones

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Administrador tiene sesión activa, abierta por el login separado del panel de administración. | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El Sistema confirma en el servidor que la sesión tiene rol de administrador. | Autorización | Sí (si no → `FE-02`) |
| PRE-03 | Existe un estado global de `DisponibilidadDelChatbot` con valor conocido. | Datos | Sí. **Valor inicial fijado en SD-35 (`ADR-004-D2`): `habilitado`** — un entorno recién aprovisionado arranca con el chatbot activo. **No es *fail-closed***, y el motivo está declarado: conveniencia de la demostración académica. **Condición de reversa material:** en cuanto haya personas reales, pasa a `deshabilitado` |

## 10. Disparador

| Campo | Valor |
|---|---|
| Evento inicial | El Administrador decide cambiar el estado global del chatbot y abre la vista **Disponibilidad del chatbot**. |
| Generado por | Actor (Administrador de plataforma). |
| Condición inicial observable | El Sistema presenta el estado global vigente y el último cambio registrado (autor y fecha). |

## 11. Flujo básico / curso normal (escenario: deshabilitar)

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Administrador | Abre la vista **Disponibilidad del chatbot** | `DisponibilidadDelChatbot` | El Sistema presenta el estado global vigente —habilitado— y el último cambio registrado, con autor y fecha | Disponibilidad del chatbot (P-16) |
| 2 | Administrador | Elige deshabilitar el chatbot | `DisponibilidadDelChatbot` | El Sistema pide confirmación explícita y anticipa el efecto: ningún Usuario podrá iniciar una `Conversacion` hasta que el Administrador lo vuelva a habilitar | Diálogo de confirmación |
| 3 | Administrador | Confirma el cambio | `DisponibilidadDelChatbot` | El Sistema cambia el estado global a deshabilitado | Disponibilidad del chatbot (P-16) |
| 4 | Sistema | Registra una `AccionAdministrativa` con el autor del cambio y su fecha, sin ningún dato de Usuario | `AccionAdministrativa` | El Sistema deja la acción disponible para auditoría | — |
| 5 | Sistema | Confirma al Administrador el estado nuevo y lo presenta como último cambio | `DisponibilidadDelChatbot`, `Conversacion` | Desde ese momento, ningún Usuario abre una `Conversacion` nueva: el Sistema responde `409` a la petición de apertura | Disponibilidad del chatbot (P-16) |

## 12. Flujos alternativos

| ID | Nombre | Punto de inicio | Condición | Resultado | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Habilitar el chatbot | Paso 2 | El Administrador elige habilitar, con el estado vigente en deshabilitado | El Sistema pide la misma confirmación, cambia el estado a habilitado y registra la `AccionAdministrativa`; los Usuarios vuelven a abrir conversaciones | **Continúa** en el paso 3 con el estado inverso | RN-03.4, RN-02.7 |
| FA-02 | Cancelar la confirmación | Paso 2 | El Administrador cancela en el diálogo de confirmación | El Sistema no cambia el estado global ni registra `AccionAdministrativa` alguna | **Cancela** y **vuelve** al paso 1 | RN-03.4 |
| FA-03 | El estado elegido ya rige | Paso 2 | El Administrador elige el estado que ya está vigente | El Sistema informa que ese estado ya rige, no repite el cambio y no registra una `AccionAdministrativa` nueva; la operación es idempotente | **Finaliza** sin cambios | RN-03.4 |

## 13. Flujos de excepción

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje | Estado final | Recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Cualquiera | La sesión del Administrador expira | `401`; el Sistema no cambia el estado global | «Tu sesión expiró» | Estado global sin cambios | **Termina**; reingresar por CU-03 |
| FE-02 | Permiso insuficiente | Paso 1 | Una cuenta sin rol de administrador pide la vista, aunque manipule el cliente | `403` o redirección segura; el Sistema no expone el estado global | «No tienes permiso para esta acción» | Sin acceso al panel | **Termina** |
| FE-03 | Confirmación mal formada | Paso 3 | La petición de cambio llega incompleta o sin la confirmación exigida | `400`; el Sistema no aplica el cambio ni registra la `AccionAdministrativa` | «No pudimos aplicar el cambio; inténtalo de nuevo» | Estado global sin cambios | **Vuelve** al paso 2 |

> Regla de excepción transversal: el Sistema no retorna errores crudos ni *stack traces*, claves ni metadatos internos (plan §4.13).

## 14. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El estado global de `DisponibilidadDelChatbot` es el que el Administrador confirmó | Inspección del estado global en el panel |
| **Éxito (lo esencial)** | Con el estado en deshabilitado, **ningún Usuario abre una `Conversacion` nueva**: la petición de apertura recibe `409` | Prueba de apertura de conversación con el chatbot deshabilitado |
| **Alcance declarado** | Sobre una `Conversacion` **ya abierta**, esta especificación **no** declara una regla general: el único caso resuelto por escrito es el del cambio de acompañante, que termina con `409` y la conversación cerrada (§4.1, `RA-02`) | Declarado, no verificable hasta que se decida `RA-02` |
| Fallo | El estado global queda sin cambios —por cancelación, por estado ya vigente o por error de sesión, permiso o petición | Inspección del estado global |
| Datos creados | Una `AccionAdministrativa` con autor y fecha, **sin ningún dato de Usuario** (RF-18) | Inspección del registro de auditoría |
| Datos consultados | El estado global vigente y el último cambio registrado; **ninguna** `CapsulaDePerfil`, `Conversacion` ni `Mensaje` | Inspección de la vista |
| Datos modificados | `DisponibilidadDelChatbot`: su estado global | Traza |
| Datos eliminados | Ninguno | Inspección |
| Cambios de estado | `DisponibilidadDelChatbot`: habilitado ↔ deshabilitado | Traza |
| Efectos visibles | El panel muestra el estado nuevo y el último cambio con autor y fecha; los Usuarios que intentan abrir conversación reciben un aviso de indisponibilidad temporal | Observación |

## 15. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-03.1 | El Administrador tiene **exactamente tres funciones**: directorio mínimo, métricas agregadas y *kill switch*. | Restricción | Todo el caso de uso; §8 | MV-01 §7.4, plan §3.7 |
| RN-03.4 | El *kill switch* exige **confirmación** del Administrador y la acción queda **registrada** (auditoría). | Habilitador | Pasos 2–4, `FA-01`, `FA-02`, `FA-03` | MV-01 §7.4, plan §3.7 |
| RN-03.5 | El Administrador **no** accede a username completo, respuestas de la caracterización, `CapsulaDePerfil`, mensajes, respuestas, `Personaje` elegido, conteos por usuario, contraseñas ni tokens. | Restricción | Paso 1, `RE-04` | MV-01 §7.4, canon |
| RN-03.6 | El Administrador **no** edita recursos, textos ni *prompts*: esos se aprovisionan por entorno. | Restricción | §6 (delimita qué **no** hace este CU) | MV-01 §7.4, plan §2.5/§3.7 |
| RN-03.7 | El acceso administrativo entra por **login separado** y el Sistema valida el rol en el **servidor**, no en el cliente. | Restricción | `PRE-01`, `PRE-02`, `FE-02` | MV-01 §7.4, plan §3.2 |
| RN-02.7 | **No se inicia** conversación si el chatbot está deshabilitado globalmente. Habla de *iniciar*: no gobierna las conversaciones ya abiertas (§4.1). | Restricción | Paso 5, `FA-01` | MV-01 §7.3, plan §3.7 |

## 16. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Auditoría | El Sistema registra cada cambio del estado global con su autor y su fecha, **sin ningún dato de Usuario** (RF-18). | La `AccionAdministrativa` conserva autor y fecha; una revisión del registro no permite reconstruir qué hizo un Usuario concreto (PER-T2) |
| RE-02 | Seguridad | El Sistema sirve el panel de administración tras un login separado y valida el rol en el servidor (`RN-03.7`, RNF-08, RF-14). | Una cuenta sin rol de administrador recibe `401` o `403` aunque manipule el cliente |
| RE-03 | Fiabilidad | El cambio de estado rige de inmediato sobre la apertura de conversaciones (RC-07). | Tras confirmar el estado deshabilitado, la primera petición de apertura posterior recibe `409` |
| RE-04 | Privacidad | La vista **Disponibilidad del chatbot** no expone conversaciones, cápsulas ni ningún dato individual (`RN-03.5`, PRIV-R7, PRIV-R10). | Inspección de la vista: cero campos de contenido y cero campos por usuario |
| RE-05 | Usabilidad | El diálogo de confirmación nombra el efecto **antes** de que el Administrador confirme, para que no deshabilite el servicio sin saber a quién afecta (`RN-03.4`). | El texto del diálogo enuncia que ningún Usuario podrá iniciar una conversación hasta rehabilitar |

## 17. Prototipos, GUI o referencias de interfaz

| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Pantalla | **Disponibilidad del chatbot** (P-16) | Consultar y cambiar el estado global; ver el último cambio | estado global vigente; autor y fecha del último cambio | Habilitar, Deshabilitar | 1, 3, 5 |
| Diálogo | **Diálogo de confirmación** (estado de P-16) | Confirmar el cambio anticipando su efecto | — | Confirmar, Cancelar | 2 |
| *Endpoint* visible | `POST /plataforma-admin/chat-access/` | Aplicar el cambio del estado global | estado solicitado, confirmación | Enviar | 3 |

> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (P-16, listada allí como «Kill switch (habilitar/deshabilitar)») y `DIS-01_sistema_diseno.md` (tokens, doble voz Alan/Aura, componentes). El *mockup* `mockups/p16_admin_kill_switch.html` renderiza el **tema claro** con el estado **habilitado** y el diálogo de confirmación. El estado **deshabilitado** y la variante oscura **no están producidos**: el registro de decisiones deja la variante oscura solo para P-10. Los prototipos gráficos de producción quedan pendientes de la fase de construcción.

## 18. Datos y objetos manipulados

| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| `DisponibilidadDelChatbot` | estado global | Consultar (paso 1) / Actualizar (paso 3) | Pasos 1, 3; `FA-01`, `FA-03` | El cambio exige confirmación (`RN-03.4`); es global, nunca por Usuario |
| `AccionAdministrativa` | autor, fecha | Crear | Paso 4 | Sin ningún dato de Usuario (RF-18, PER-T2); no se crea en `FA-02`, `FA-03` ni `FE-03` |
| `Conversacion` | — | Condicionar la apertura | Paso 5 | Con el estado deshabilitado, el Sistema no abre ninguna nueva (`RN-02.7`) |

## 19. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Kill` (DCU-01 v2.1) ↔ **CU-10** | Correspondencia explícita; el número lo conserva de DCU-01 v1.0, donde ya era el décimo caso de uso, y v2.0 mantuvo estable la numeración de los diez originales |
| Requisito funcional | RF-17 «Habilitar/deshabilitar globalmente el chatbot, con confirmación»; RF-18 «Registrar la acción del *kill switch*» | Realizados por este CU, exactamente los que le asigna DCU-01 v2.1 §2 |
| Objetivo de negocio | OBJ-6 «Administración de plataforma» | Las tres funciones del Administrador |
| Regla de negocio | RN-03.1, RN-03.4, RN-03.5, RN-03.6, RN-03.7, RN-02.7 | Gobiernan el flujo. Toda regla citada queda **definida en §15**: v1.0 las invocaba con notación de familia, que no resolvía a ninguna definición |
| Requisito de calidad | RC-07 (fiabilidad: éxito o degradación con gracia ≥ 95 %) | Ancla de calidad de `RE-03` |
| Requisito no funcional | RNF-08 (rol validado en servidor) | Ancla de `RE-02` |
| Privacidad | PRIV-R7, PRIV-R10, PER-T2 | Anclas de `RE-01` y `RE-04` |
| Modelo de dominio | `DisponibilidadDelChatbot`, `Administrador`, `Conversacion` | Conceptos manipulados. `AccionAdministrativa` **no** es clase de MD-01 (`RA-01`) |
| Diagrama de casos de uso | `Admin -- CU_Kill` (asociación directa) | Origen |
| Caso de uso condicionado | CU-06 «Conversar con el acompañante» | Consume el estado que este CU produce, con el alcance de §4.1 |
| Caso de uso condicionado | CU-13 «Cambiar de acompañante» | Hereda la precondición de chatbot habilitado |
| Caso de uso relacionado | CU-08, CU-09 | Las otras dos funciones del Administrador (`RN-03.1`) |
| Persistencia | PER-01 §3.4 y §3.7 | Fichas de las dos entidades que este CU escribe |
| Caso de prueba | CP-10 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-10 / DS-10 | Planificados (DR-10 en la fase D.4) |
| Criterio de aceptación | CA-01…CA-09 | Verificación; cubren el flujo básico y los seis flujos alternativos y de excepción |

## 20. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado el chatbot habilitado, cuando el Administrador lo deshabilita y confirma, entonces ningún Usuario abre una `Conversacion` nueva y la petición de apertura recibe `409`. | Flujo básico | Prueba de apertura de conversación con el chatbot deshabilitado |
| CA-02 | Dado un cambio confirmado del estado global, cuando se revisa el registro de auditoría, entonces consta una `AccionAdministrativa` con autor y fecha y **sin ningún dato de Usuario**. | Flujo básico (paso 4) | Inspección del registro de auditoría |
| CA-03 | Dado un Administrador operando el *kill switch*, cuando se inspecciona la vista **Disponibilidad del chatbot**, entonces no aparece ninguna conversación, cápsula ni dato de un Usuario concreto. | Flujo básico (paso 1) | Inspección de la vista |
| CA-04 | Dado el chatbot deshabilitado, cuando el Administrador lo habilita y confirma, entonces los Usuarios vuelven a abrir conversaciones y el cambio queda registrado. | FA-01 | Prueba de apertura de conversación tras rehabilitar |
| CA-05 | Dado el diálogo de confirmación abierto, cuando el Administrador cancela, entonces el estado global queda intacto, no se crea `AccionAdministrativa` alguna y el flujo vuelve al inicio. | FA-02 | Inspección del estado global y del registro |
| CA-06 | Dado el chatbot ya deshabilitado, cuando el Administrador vuelve a elegir deshabilitar, entonces el Sistema informa que ese estado ya rige y no añade un registro nuevo. | FA-03 | Inspección de la traza |
| CA-07 | Dada una sesión de Administrador que expira durante el cambio, cuando llega la petición, entonces el Sistema responde `401` y el estado global **no cambió**. | FE-01 | Prueba de expiración de sesión |
| CA-08 | Dada una cuenta sin rol de administrador que pide operar el *kill switch*, cuando llega la petición aunque se manipule el cliente, entonces el Sistema responde `403` o redirige de forma segura y no expone el estado global. | FE-02 | Prueba de autorización |
| CA-09 | Dada una petición de cambio sin la confirmación exigida, cuando llega al Sistema, entonces responde `400`, el estado global queda intacto y el Administrador puede reintentar. | FE-03 | Prueba de petición mal formada |

## 21. Riesgos, ambigüedades y decisiones pendientes

| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad | La auditoría se apoya en `AccionAdministrativa`, entidad del **plan §4.14** con ficha en PER-01 §3.7 que **no** es clase de MD-01: el modelo de dominio la dejó fuera por ser registro operativo. | Traza dominio ↔ auditoría | **Aceptada:** se trata como registro operativo, no de dominio. MD-01 §2 remite explícitamente a esta decisión. | **Decidido** |
| RA-02 | Ambigüedad | **Qué le pasa a una `Conversacion` ya abierta cuando el Administrador deshabilita el chatbot.** `RN-02.7` habla de *iniciar*; MV-01 §7.4 y el plan §3.7 no lo mencionan; CU-06 solo engancha su excepción al paso de apertura. El único caso resuelto por escrito es el del cambio de acompañante, que cierra la conversación. | Coherencia entre CU-10 y CU-06; verificabilidad de `RE-03` | **Abierta y declarada, no inventada.** Las tres salidas posibles son: cortar el turno en curso, dejar terminar la conversación abierta, o impedir solo la apertura de nuevas. La decisión la toma el líder del proyecto y se propaga a CU-06 y a `RN-02.7` en la fase D.5. | **Abierto** |
| RA-03 | Riesgo | Con el chatbot deshabilitado, un Usuario en peligro **no puede abrir conversación**, así que tampoco alcanza la ruta de contención y derivación de CU-07. SEG-01 §7 solo cubre el caso de que el Proveedor LLM esté caído, que es distinto: allí el *fallback* sí opera. | Canon: seguridad emocional > *engagement* | **Abierta.** Candidato natural: que el aviso de indisponibilidad lleve los recursos de ayuda que ya se aprovisionan por entorno (RNF-05). No se incorpora aquí porque sería crear un requisito nuevo desde una especificación; se eleva al líder. | **Abierto** |
| RA-04 | Riesgo de trazabilidad | SEG-01 §5 y `SEG-R6` citan **RF-17** como el requisito de configurabilidad por entorno de recursos y señales. En REQ-01, RF-17 es el *kill switch*, y el requisito de configurabilidad es **RNF-05**, que `SEG-R6` también cita. La cita cruzada de SEG-01 quedó desactualizada. | Cero requisitos huérfanos | **Declarada, no corregida aquí:** enmendar SEG-01 pertenece a la fase D.5. Este documento se atiene a REQ-01, donde RF-17 es el *kill switch*. | **Abierto** |

## 22. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Cambiar el estado global del chatbot |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Habilitar o deshabilitar el chatbot» |
| 3 | Actor primario identificado | ✅ | Administrador de plataforma |
| 4 | Actores externos al sistema | ✅ | Sin Proveedor LLM en este CU |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 5 pasos, del estado vigente al efecto observable |
| 6 | Flujos alternativos suficientes | ✅ | Habilitar, cancelar y estado ya vigente |
| 7 | Flujos de excepción relevantes | ✅ | `401`, `403`, `400`, todos con desenlace declarado |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | `DisponibilidadDelChatbot`, `Administrador`, `Conversacion` |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7; nombres de persistencia prohibidos |
| 10 | Interfaces nombradas donde aplica | ✅ | Disponibilidad del chatbot (P-16), diálogo de confirmación y `/plataforma-admin/chat-access/` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15, con las seis definidas localmente |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ⚠️ | **Una no lo es todavía**: la que describe el efecto sobre conversaciones ya abiertas está *declarada* como alcance, no verificada, porque la regla general no está decidida (`RA-02`). Marcarla como cumplida sería falso |
| 14 | Sin detalle de implementación | ✅ | Caja negra; el único *endpoint* es visible para el Administrador |
| 15 | Auth como precondición, no CU incluido | ✅ | `PRE-01`, `PRE-02` |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ⚠️ | Hacia atrás está completa. Hacia SEG-01 hay una cita cruzada errónea de RF-17 que este documento **declara** (`RA-04`) y no puede corregir desde aquí |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20: nueve criterios, uno por flujo como mínimo |
| 18 | Base para robustez y secuencia | ✅ | DR-10 / DS-10 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ⚠️ | Coherente con DCU-01 y con el canon de minimización. Queda **abierto** qué ve un Usuario en peligro con el chatbot deshabilitado (`RA-03`): es una tensión real con «seguridad emocional > *engagement*», y se declara en vez de darse por resuelta |

## 23. Versión resumida

| Campo | Valor |
|---|---|
| Actor primario | Administrador de plataforma |
| Objetivo | Cambiar el estado global de `DisponibilidadDelChatbot` con confirmación y con la acción registrada. |
| Disparador | El Administrador abre la vista **Disponibilidad del chatbot** para cambiar el estado. |
| Precondiciones | Sesión activa por login separado; rol de administrador validado en servidor; estado global con valor conocido. |
| Conceptos del dominio | `DisponibilidadDelChatbot`, `Administrador`, `Conversacion` (+ `AccionAdministrativa`, registro operativo). |
| Flujo básico | Ver el estado vigente → elegir el contrario → confirmar → aplicar → registrar autor y fecha → ningún Usuario abre conversación nueva. |
| Flujos alternativos | Habilitar; cancelar; el estado elegido ya rige. |
| Flujos de excepción | `401` sesión ausente; `403` permiso insuficiente; `400` confirmación mal formada. |
| Postcondición de éxito | El estado global es el confirmado **y con el chatbot deshabilitado ningún Usuario abre una `Conversacion` nueva**; la acción queda registrada con autor y fecha. |
| Reglas de negocio | RN-03.1, RN-03.4, RN-03.5, RN-03.6, RN-03.7, RN-02.7. |
| Criterios de aceptación | CA-01…CA-09. |
| Casos relacionados | CU-03 (precede); CU-06 y CU-13 (condicionados); CU-08 y CU-09 (las otras dos funciones del Administrador). |

**Fin de ECU-10.**
