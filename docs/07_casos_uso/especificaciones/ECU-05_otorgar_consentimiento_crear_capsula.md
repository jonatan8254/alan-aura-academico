# ECU-05 — Especificación de caso de uso: «Otorgar consentimiento y crear la cápsula de perfil» (CU-05)
**ID documento:** DOC-CU-05 · **Caso de uso:** CU-05 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Alias en DCU-01:** `CU_Onb` · **Fecha:** 2026-07-30 · **Versión:** v2.2 (`CDR-01` `H-16`: `CA-10` prometía que «nada de lo no confirmado quedó escrito» y el diseño no lo entrega — el `Consentimiento` se crea en el paso 5, antes que la cápsula). v2.1 · **Estado:** Propuesto.
**Forma:** **completa** (24 secciones de la skill `use-case-specifier`, §1–§23) — caso de uso **canon-sensible** (consentimiento, minimización, solo adultos).
**Insumos:** DCU-01 v2.1, MV-01 §Vista Onboarding, MD-01 v1.4, REQ-01 (RF-01…RF-05), PRIV-01, VIS-01, contrato, plan §3.1/§3.3/§3.4. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-05 |
| Versión | v2.1 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-30 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| **v2.2** | 2026-08-04 | J. Sánchez | **`CDR-01`, hallazgo `H-16` — retrabajo `SD-39`.** `CA-10` prometía que, tras expirar la sesión, «nada de lo no confirmado quedó escrito», y **el diseño no lo entrega**: `DS-05` crea el `Consentimiento` en el paso 5 —que el Usuario otorga explícitamente— antes de armar la cápsula en el paso 8, así que una expiración entre ambos deja el consentimiento escrito. Es el mismo patrón que `H-02` en un tercer sitio: una promesa de reversión sin mecanismo. **`CA-10` pasa a prometer la garantía observable** —el chat no queda habilitado y ningún autorreporte sin confirmar queda escrito— y **declara** lo que sí puede quedar. |
| v2.1 | 2026-08-01 | J. Sánchez | **SD-30, hallazgo `H-4` de `DS-00`.** El armado de la `CapsulaDePerfil` estaba numerado en el **paso 8** por §11 y en el **7** por §15 (`CA-05`), §18 y `RN-01.3`. Manda **§11**, que es el flujo básico: el paso 7 otorga la capa de personalización, el 8 arma la cápsula. `DS-05` ya lo modelaba así. Corregidas las tres referencias y añadida la nota que distingue los dos pasos. |
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |
| v2.0 | 2026-07-30 | J. Sánchez | **PDR-01, fase D.3, tanda 1.** Renombrado a «crear la cápsula de perfil» («perfil» a secas es término prohibido por el control terminológico de §7). Los **pasos 8 y 9** salen a **CU-14** vía `<<include>>`. Se separa el `Consentimiento` en **capas base y personalización** (§4.1), lo que resuelve el hallazgo D-01. Se ancla el tercer flujo alternativo a un paso concreto (D-06), se declara quién cierra la sesión del menor (D-07), se añade `RN-01.6` y se define `RN-07` en §15 (D-14), y se unifica la versión (D-15). |
| v1.1 | 2026-07-25 | J. Sánchez | **Resolución de PER-H1 (SD-26):** la `CapsulaDePerfil` **siempre existe** al terminar el onboarding, con `character` como contenido mínimo. Corrige FA-01 (decía «continúa sin cápsula»), §4, §14, §20 CA-05 y §23; precisa RN-01.4 y añade RN-01.6; nota sobre el personaje cambiable por sesión en §18. Sin cambios en el flujo básico ni en lo que recibe el LLM. |

## 2. Entradas esperadas
| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Onboarding (familia RN-01.1…RN-01.6) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`Usuario`, `Consentimiento`, `CapsulaDePerfil`, `Personaje`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Onb` | Disponible |
| Caso de uso seleccionado | CU-05 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Reglas de negocio | RN-01, RN-02, RN-09, RN-10; familia RN-01.1…RN-01.6; RN-04.2; RN-07 | Disponible |
| Requisitos funcionales | RF-01…RF-05 (RF-06 pasa a CU-14) | Disponible |
| Requisitos especiales | RNF-01, PRIV-R1/R4/R8/R9, RC-04, RC-06 | Disponible |
| Restricciones | Canon: solo adultos, disclosure previo, minimización | Disponible |
| Prototipos / GUI | Pantallas de onboarding | [Pendiente] (fase de construcción) |

## 3. Identificación
| Campo | Valor |
|---|---|
| ID | CU-05 |
| Nombre | Otorgar consentimiento y crear la cápsula de perfil |
| Paquete funcional | Acompañamiento (Onboarding) |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Media (una vez por usuario; repetible al reiniciar el perfil) |
| Criticidad | **Alta** (consentimiento informado + minimización + solo adultos) |
| Estado | Propuesto |

## 4. Propósito
| Campo | Descripción |
|---|---|
| Objetivo | Obtener el **consentimiento informado por capas** del usuario adulto y construir una **`CapsulaDePerfil` mínima** que oriente la conversación, con *disclosure* de IA previo. |
| Descripción breve | Onboarding: *disclosure* → declaración de edad → **capa base** del consentimiento → **capa de personalización** y caracterización opcional (4 autorreportes) → armado de la cápsula → `<<include>>` **CU-14** para elegir acompañante. |
| Valor funcional | Habilita la conversación con seguridad ética (sin consentimiento no hay chat) y personaliza mínimamente sin recolectar historial. |
| Resultado observable | Existe un `Consentimiento` con su **capa base** otorgada y una `CapsulaDePerfil` (**siempre**, con `character` como contenido mínimo escrito por CU-14; los 4 autorreportes son opcionales); el usuario puede pasar a CU-06. |

### 4.1 Las dos capas del `Consentimiento`

| Capa | Qué autoriza | Paso donde se otorga | Si no se otorga |
|---|---|---|---|
| **base** | Procesar lo mínimo para conversar: la edad declarada, `character` y el turno en curso | Paso 5 | **No hay conversación** (`RN-02`); el onboarding termina sin habilitar el chat |
| **personalización** | Usar los cuatro **autorreportes** de la cápsula para orientar la conversación | Paso 6, junto con la caracterización opcional | Se conversa igual, sin que la cápsula oriente (`RN-07`) |

`character` **no** pertenece a la capa de personalización: por `RN-01.6` es elección de interlocutor y **precondición funcional** del chat, así que lo cubre la capa base. Retirar la capa de personalización más adelante es **CU-12**; borrar la cápsula entera es **CU-11**. La separación en capas resuelve el hallazgo **D-01** del certificado de robustez, que había detectado que «revocar» no decía **qué** se revocaba y que un usuario con el consentimiento retirado entraba al chat sin obstáculo en el modelo.

## 5. Actores
| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Persona ≥18 registrada y autenticada | Declara edad, otorga consentimiento, responde la caracterización opcional, elige personaje |
| Actor secundario | — | (el LLM **no** participa en el onboarding) | No aplica |
| Sistema externo | — | No aplica | — |
| Stakeholder relacionado | Rol Datos/Privacidad | Vela por minimización y consentimiento (PLAN-01 §7) | Define y revisa el texto de consentimiento (por entorno) |

## 6. Alcance y contexto
| Campo | Valor |
|---|---|
| Alcance funcional | Onboarding emocional simplificado (disclosure, edad, consentimiento, cápsula). |
| Límite del sistema | Produce `Consentimiento` + `CapsulaDePerfil`; **no** conversa (eso es CU-06). |
| Incluye | Disclosure de IA, declaración de edad, consentimiento granular revocable, 5 preguntas opcionales, presentación de Alan/Aura. |
| Excluye | Historial, diario, biomarcadores, diagnóstico, triaje; menores; nombre legal/documento/correo/teléfono. |
| Suposiciones | El usuario ya tiene cuenta y sesión activa (CU-02/CU-03). |

## 7. Modelo de dominio involucrado
| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| Usuario | Persona adulta registrada | Titular del consentimiento y la cápsula | esAdulto, versionDisclosure | Usuario–Consentimiento (otorga); Usuario–CapsulaDePerfil (posee) |
| Consentimiento | Registro de aceptación granular y revocable | Se **crea** (otorgado) | estado ∈ {otorgado, revocado}, fecha | Usuario–Consentimiento |
| CapsulaDePerfil | Resumen mínimo (`ContextoInicialConversacionalV1`) que orienta la conversación | Se **crea** | mood_self_report, energy_self_report, conversation_goal, response_style (opcionales), character (obligatorio) + schema_version/consent_version | CapsulaDePerfil–Conversacion (orienta) |
| `Personaje` (`Alan`, `Aura`) | Estilo de acompañamiento | Se presenta y se elige **dentro de CU-14**, incluido por este CU | — | `Personaje <|-- Alan`; `Personaje <|-- Aura` |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| CapsulaDePerfil | Cápsula (`ContextoInicialConversacionalV1`): 5 campos de contenido + 2 metadatos (plan §3.4) | prohibido: «perfil», «PerfilInicialParaLLM» (alias macro) | No es historial (MV-01 §6) |
| Consentimiento | Aceptación granular y revocable | prohibido: «permiso», «términos» | Ciclo otorgado/revocado |
| Disclosure | Aviso de que se conversa con una IA | prohibido: «aviso legal» sin más | Precede a toda captura |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Se usa por calidez en la interfaz y en los nombres de CU-13/CU-14; el término trazable al dominio es `Personaje` |
| Capa del `Consentimiento` | `base` o `personalizacion` (§4.1) | prohibido: «consentimiento» a secas al hablar de revocar | Revocar **sin decir la capa** es lo que produjo el hallazgo D-01 |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 Iniciar sesión | Este CU depende de | Requiere sesión activa (precondición). |
| Dependencia funcional | CU-06 Conversar con el acompañante | Este CU precede a | El consentimiento y la cápsula habilitan el chat. |
| `<<include>>` | CU-14 «Elegir acompañante (Alan o Aura)» | **Este CU incluye** | Comportamiento **obligatorio** (`character` lo es, `RN-01.6`), testable como subobjetivo propio, y su extracción es lo que trae `Personaje`/`Alan`/`Aura` al diagrama — el punto 4 de la retroalimentación docente. |
| `<<extend>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

> **Granularidad, precisada en v2.0.** Los **cuatro autorreportes** de la caracterización opcional siguen viviendo **dentro** de este CU: no son casos de uso ni `<<extend>>`. Lo que sale es la **quinta pregunta**, `character`, que pasa a **CU-14** por `<<include>>` — porque no es un autorreporte sino la elección de interlocutor (`RN-01.6`) y realiza un RF propio. La nota de v1.1 decía que las cinco preguntas quedaban dentro; eso deja de ser cierto y se corrige aquí.

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa (CU-03). | Autorización | Sí |
| PRE-02 | El Usuario no ha completado el onboarding, o desea rehacerlo. | Funcional | Sí |
| PRE-03 | El onboarding **no** depende del kill switch (solo la conversación lo hace). | Negocio | Sí |

## 10. Disparador
| Campo | Valor |
|---|---|
| Evento inicial | El Usuario inicia el onboarding tras iniciar sesión por primera vez (o elige rehacer su caracterización). |
| Generado por | Actor (Usuario). |
| Condición inicial observable | El sistema presenta la primera pantalla del onboarding con el *disclosure*. |

## 11. Flujo básico / curso normal
| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Sistema | Presenta el *disclosure* de IA **antes** de pedir cualquier dato (se conversa con una IA de acompañamiento, no un humano ni un terapeuta) | — | Muestra la **Pantalla de disclosure** | Pantalla de disclosure |
| 2 | Usuario | Lee y continúa | — | Solicita la declaración de mayoría de edad | Pantalla de edad |
| 3 | Usuario | Declara ser mayor de 18 años | Usuario | Registra la declaración booleana + versión de *disclosure* y habilita el consentimiento | Pantalla de edad |
| 4 | Sistema | Presenta la **capa base** del consentimiento: procesar lo mínimo para conversar | `Consentimiento` | Muestra la **Pantalla de consentimiento** | Pantalla de consentimiento |
| 5 | Usuario | Otorga la **capa base** | `Consentimiento` | **Crea** el `Consentimiento` con la capa base en estado otorgado | Pantalla de consentimiento |
| 6 | Sistema | Ofrece la **capa de personalización** junto con la caracterización opcional de cuatro autorreportes (ánimo, energía, objetivo, estilo) | `Consentimiento` | Muestra la **Pantalla de caracterización** con el alcance de esa capa | Pantalla de caracterización |
| 7 | Usuario | **Otorga la capa de personalización** | `Consentimiento` | Añade la capa de personalización al `Consentimiento`, en estado otorgado | Pantalla de caracterización |
| 8 | Usuario | Responde u omite cada autorreporte | `CapsulaDePerfil` | **Arma** la `CapsulaDePerfil` con los autorreportes respondidos, sin *defaults* para los omitidos, e **invoca CU-14** (`<<include>>`) para completarla con `character` | Pantalla de caracterización |

> **Dos pasos distintos, que este documento llegó a confundir (`H-4`, corregido).** El **paso 7**
> es *otorgar la capa de personalización*; el **paso 8** es *armar la `CapsulaDePerfil`* con los
> autorreportes respondidos. §15 (`CA-05`), §18 y `RN-01.3` decían «paso 7» para el armado.
> **Manda §11**, que es el flujo básico y por tanto la autoridad; `DS-05` ya lo modelaba así.
>
> El flujo básico tiene **8 pasos** y termina invocando CU-14. El otorgamiento de la capa de personalización es el **paso 7**, con el Usuario como responsable: en la primera redacción de v2.0 iba escondido como condicional dentro de la respuesta del Sistema al paso 6, lo que ocultaba el acto que crea la capa.

## 12. Flujos alternativos
| ID | Nombre | Punto de inicio | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Omitir la caracterización | Paso 6 | El Usuario **no otorga** la capa de personalización y rechaza la caracterización opcional | La cápsula queda **sin autorreportes**; el `Consentimiento` conserva solo la capa base | **Continúa** en el paso 8, que invoca CU-14 | RN-01.4, RN-01.6, RN-07 |
| FA-02 | Respuestas parciales | Paso 8 | El Usuario responde algunos autorreportes y omite otros | La cápsula se arma solo con lo respondido, sin *defaults* | **Continúa** en el paso 8, que invoca CU-14 | RN-01.3, plan §3.3 |
| FA-03 | Retirar la capa base en el onboarding | **Paso 5** | El Usuario retira la capa base que acababa de otorgar | El `Consentimiento` queda con la capa base en estado revocado; **no se habilita el chat** y la cápsula no llega a armarse | **Finaliza** el onboarding sin conversación | RN-01.5, RN-07, RN-02 |
| FA-04 | Retirar solo la personalización en el onboarding | **Paso 7** | El Usuario retira la capa de personalización tras haberla otorgado | Los autorreportes dejan de orientar la conversación; la capa base sigue otorgada | **Continúa** en el paso 8, que invoca CU-14 | RN-01.5, RN-07 |

## 13. Flujos de excepción
| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje | Estado final | Recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Menor de edad | Paso 3 | El Usuario declara ser <18 | No continúa ni crea `Consentimiento` ni `CapsulaDePerfil`; **el Sistema cierra la sesión** sin esperar acción del Usuario | «Este servicio es solo para personas adultas» | Sin consentimiento, sin cápsula, sin sesión | **Termina**. El cierre lo ejecuta el Sistema, no el Usuario |
| FE-02 | Capa base no otorgada | Paso 5 | El Usuario no otorga la capa base | No permite avanzar a la conversación | «Sin consentimiento no es posible conversar» | Sin chat | **Vuelve** al paso 4 para otorgarla |
| FE-03 | Entrada inválida | Paso 8 | Autorreportes mal formados | `400`; pide corregir sin perder lo válido | «Revisa tus respuestas» | Onboarding en curso | **Vuelve** al paso 8 |
| FE-04 | Sesión ausente | Cualquiera | La sesión expira | `401`; solicita reingresar; lo no confirmado no queda escrito | «Tu sesión expiró» | Sin cambios confirmados | **Termina**; reingresar por CU-03 |

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | Existe un `Consentimiento` con su **capa base** otorgada y **siempre** una `CapsulaDePerfil` (los 4 autorreportes opcionales; `character` obligatorio, escrito por CU-14, + metadatos); el Usuario puede iniciar CU-06 | Inspección de registros |
| Fallo | No se crea consentimiento; no hay cápsula; no se habilita el chat | Inspección |
| Datos creados | `Consentimiento` (capa base otorgada, y capa de personalización si la aceptó, + fecha + versión de *disclosure*); `CapsulaDePerfil` (autorreportes respondidos; `character` lo escribe CU-14) | Inspección |
| Datos modificados | `Usuario` (esAdulto=verdadero, versionDisclosure) | Inspección |
| Datos eliminados | Ninguno: los autorreportes omitidos **no** quedan escritos | Inspección |
| Cambios de estado | `Consentimiento`: capa base → otorgada; capa de personalización → otorgada o ausente | Traza |
| Efectos visibles | El Usuario termina el onboarding y puede conversar. **Ver a `Alan` y `Aura` es efecto de CU-14**, incluido por este CU | Observación |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-01 | Solo adultos (≥18) pueden usar el MVP. | Restricción | Paso 3, FE-01 | MV-01 §7.1 |
| RN-02 | No hay conversación sin la **capa base** del consentimiento otorgada. | Restricción | Paso 5, FE-02, FA-03 | MV-01 §7.1 |
| RN-09 | El Sistema presenta el *disclosure* de IA antes de la primera conversación y de capturar dato alguno. | Restricción | Paso 1 | MV-01 §7.1 |
| RN-10 | «Adulto» = declara edad ≥18 en el onboarding. | Término | Paso 3 | MV-01 §7.1 |
| RN-01.1 | El *disclosure* precede a cualquier dato. | Restricción | Paso 1 | MV-01 §7.2 |
| RN-01.2 | La edad se declara antes del consentimiento; <18 no continúa. | Restricción | Paso 3, FE-01 | MV-01 §7.2 |
| RN-01.3 | La cápsula (`ContextoInicialConversacionalV1`) = 5 campos de contenido (`mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style`, `character`) + metadatos (`schema_version`, `consent_version`). | Restricción | **Paso 8** | MV-01 §7.2, plan §3.4 |
| RN-01.4 | Ningún **autorreporte** de la caracterización es obligatorio; el usuario puede omitir los 4. Obligatorios son solo edad, capa base del consentimiento y `character`. | Habilitador | FA-01, FA-02 | MV-01 §7.2 |
| RN-01.5 | El consentimiento se puede revocar desde el onboarding **y después**. El «después» de la capa de personalización es CU-12. | Habilitador | FA-03, FA-04 | MV-01 §7.2 |
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. | Habilitador | FA-01, FA-03, FA-04 | MV-01 §7.1 |
| RN-01.6 | `character` no es autorreporte de perfil sino **elección de interlocutor** y precondición funcional del chat ⇒ la `CapsulaDePerfil` **siempre existe** tras el onboarding, con `character` como mínimo. El valor persistido es la última elección y actúa como predeterminado, cambiable por sesión. | Restricción | Paso 7 (vía CU-14), FA-01 | MV-01 §7.2 (SD-26) |
| RN-04.2 | El Sistema registra la mayoría de edad como declaración booleana + versión de *disclosure*, nunca como fecha de nacimiento. | Hecho | Paso 3 | MV-01 §7.5 |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | La cápsula contiene solo los 5 campos + metadatos definidos; nada de historial/diario/biomarcadores (PRIV-R1/R4/R9). | Inspección de la cápsula = solo los campos de RN-01.3 (5 + metadatos) |
| RE-02 | Seguridad/Consentimiento | *Disclosure* y consentimiento preceden a toda captura (PRIV-R8, RN-09). | Ningún dato se captura antes del *disclosure* |
| RE-03 | Usabilidad | Onboarding ≈2 min, español CO, comprensible para adultos (RNF-01, RC-06). | ≥80 % completan sin asistencia (MET-06) |
| RE-04 | Legal/regulatorio | El texto de consentimiento se aprovisiona por entorno y requiere revisión legal (Ley 1581). | Texto revisado por experto antes de piloto (V6-b) |

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | Onboarding (multipaso, P-05 a P-08) | *Disclosure* → edad → capa base → capa de personalización y caracterización | (por pantalla) | Continuar, Otorgar, Retirar, Omitir | 1–8 |
| *Endpoint* visible | `POST /onboarding/` | Registrar las capas del consentimiento y los autorreportes | capas otorgadas, autorreportes | Enviar | 5, 7, 8 |

> La **Presentación de Alan/Aura** (P-09) ya **no** pertenece a este CU: es la interfaz de **CU-14**, incluido por este.

> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantallas P-05 a P-09) y `DIS-01_sistema_diseno.md` (sistema de diseño: tokens, doble voz Alan/Aura, componentes). Mockups renderizados en claro y oscuro con estados no-felices. Los prototipos gráficos de producción quedan pendientes de la fase de construcción.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| `Consentimiento` | capa, estado, fecha, versión de *disclosure* | Crear / Confirmar | Pasos 5 y 6 | Revocable por capas (`RN-01.5`, `RN-07`) |
| `CapsulaDePerfil` | mood_self_report, energy_self_report, conversation_goal, response_style (+ schema_version, consent_version) | Crear | **Paso 8** | Solo campos de `RN-01.3`; los 4 autorreportes son opcionales. **`character` lo escribe CU-14** |
| `Usuario` | esAdulto, versionDisclosure | Actualizar | Paso 3 | Booleano, no fecha de nacimiento (`RN-04.2`) |

> La fila de `Personaje` de v1.1 —con la nota sobre la última elección como predeterminado— **migró a CU-14**, junto con los pasos 8 y 9.

> **Nota de origen (encuesta):** el plan §3.3 define 5 preguntas → los **5 campos de contenido** de la cápsula (`mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style`, `character`), **1:1** con `ContextoInicialConversacionalV1` (plan §3.4). No hay colapso 5→3: la cápsula = estos 5 + metadatos (`schema_version`, `consent_version`). Reconciliado en **SD-22** (ver §21 RA-01).

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Onb` (DCU-01 v2.1) ↔ **CU-05** | Correspondencia explícita; el número sigue el orden de declaración del diagrama |
| Requisito funcional | RF-01, RF-02, RF-03, RF-04, RF-05 | Realizados por este CU. **RF-06 pasa a CU-14** |
| Objetivo de negocio | OBJ-1 | Onboarding/consentimiento/cápsula |
| Regla de negocio | RN-01, RN-02, RN-09, RN-10; familia RN-01.1…**RN-01.6**; RN-04.2; RN-07 | Gobiernan el flujo. En v1.1 la familia se listaba hasta RN-01.5, omitiendo la regla decisiva de SD-26, y se invocaba RN-07 sin definirla en §15 (hallazgo **D-14**) |
| Requisito de calidad | RC-04 (minimización), RC-06 (usabilidad) | Anclas de calidad |
| Modelo de dominio | `Usuario`, `Consentimiento`, `CapsulaDePerfil`; `Personaje`/`Alan`/`Aura` **vía CU-14** | Conceptos manipulados |
| Diagrama de casos de uso | `CU_Onb ..> CU_Elegir : <<include>>` | Origen de la relación |
| Caso de uso incluido | CU-14 «Elegir acompañante (Alan o Aura)» | **Este CU lo incluye** |
| Caso de uso relacionado | CU-11 «Reiniciar la caracterización» | Borra la cápsula y obliga a rehacer este CU desde el paso 6 |
| Caso de uso relacionado | CU-12 «Revocar la personalización» | Retira después la capa que este CU otorga en el paso 6 |
| Caso de prueba | CP-05 | Planificado |
| Diagrama de robustez / secuencia | **DR-05 existe y queda invalidado por esta reescritura**; DS-05 planificado | DR-05 se produjo sobre el flujo de 9 pasos de v1.1 y sobre un `Consentimiento` sin capas. Rehacerlo, y añadir DR-14, es la **fase D.4** del PDR-01 |
| Criterio de aceptación | CA-01…CA-10 | Verificación |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario que inicia el onboarding, cuando aparece la primera pantalla, entonces ve el *disclosure* de IA antes de cualquier captura de datos. | Flujo básico | Inspección de pantalla 1 |
| CA-02 | Dado un usuario que declara <18, cuando lo confirma, entonces el sistema no continúa ni registra perfil. | FE-01 | Prueba de caso <18 |
| CA-03 | Dado un usuario, cuando otorga la **capa base**, entonces el registro queda creado y puede avanzar; sin ella, no avanza. | Flujo básico / FE-02 | Traza de consentimiento |
| CA-04 | Dado un usuario que completa la caracterización, cuando el Sistema arma la cápsula, entonces contiene solo los 5 campos de contenido + metadatos (`RN-01.3`) y nada más. | Flujo básico | Inspección de la cápsula |
| CA-05 | Dado un usuario que omite autorreportes, cuando finaliza el **paso 8**, entonces la cápsula se arma solo con lo respondido, **sin *defaults***. | FA-01, FA-02 | Inspección de la cápsula |
| CA-06 | Dado un usuario que rechaza la caracterización, cuando termina el onboarding, entonces el `Consentimiento` conserva la capa base y **no** tiene capa de personalización. | FA-01 | Traza de consentimiento |
| CA-07 | Dado un usuario que retira la capa base en el paso 5, cuando el onboarding termina, entonces el chat **no queda habilitado**. | FA-03 | Prueba de acceso al chat |
| CA-08 | Dado un usuario que retira solo la capa de personalización, cuando termina el onboarding, entonces conserva la capa base, **puede conversar** y sus autorreportes no orientan la conversación. | FA-04 | Prueba de conversación e inspección de *payload* |
| CA-09 | Dado un autorreporte mal formado, cuando el usuario lo envía, entonces el sistema responde `400` y **no pierde** lo que ya había respondido válidamente. | FE-03 | Prueba de entrada inválida |
| CA-10 | Dada una sesión que expira a mitad del onboarding, cuando el usuario reingresa, entonces **el chat no queda habilitado y ningún autorreporte sin confirmar quedó escrito**; lo que sí puede haber quedado es el `Consentimiento` con su capa base, que el paso 5 ya había otorgado explícitamente. | FE-04 | Prueba de expiración: se corta la sesión entre el paso 5 y el 8 y se comprueba que no hay acceso al chat |

> El criterio de v1.1 que verificaba «ve a Alan y Aura y puede elegir» **migró a CU-14**, junto con la segunda mitad del que comprobaba que la cápsula existe con `character` cuando se omiten los cuatro autorreportes.

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad (histórica) | La cápsula canónica nombraba **3 campos** mientras el plan §3.4 (`ContextoInicialConversacionalV1`) lista **5 de contenido + metadatos**. | Define qué recibe el LLM | **Resuelto (SD-22):** se adoptan los **5 campos del plan** (`mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style`, `character`) + `schema_version`/`consent_version`; RN-01.3, RF-04/05 y PRIV-R1 actualizados. | **Resuelto** |
| RA-02 | Riesgo | El texto de consentimiento requiere revisión legal antes de uso con personas reales. | Cumplimiento Ley 1581 | Aprovisionar por entorno; V6-b | Abierto |
| RA-03 | Decisión pendiente | Prototipos/GUI del onboarding. | Diseño de interacción | Fase de construcción | Abierto |
| RA-04 | Contradicción (detectada en `PER-01`, **PER-H1**) | FA-01 decía que quien omite la caracterización «continúa **sin cápsula**», mientras `character` es campo **obligatorio** de la cápsula (RN-01.3) y RN-01.4 afirmaba que ningún campo de perfil lo es. Las tres no podían ser ciertas a la vez. | Define la cardinalidad `Usuario–CapsulaDePerfil` y qué borra exactamente RF-22 | **Resuelto (SD-26):** la cápsula **siempre existe** tras el onboarding, con `character` como contenido mínimo. `character` se reclasifica como **precondición funcional** (elección de interlocutor), no como autorreporte de perfil ⇒ RN-01.4 precisada, RN-01.6 añadida. No cambia lo que recibe el LLM (RN-01.3 intacta) ni reabre SD-22. | **Resuelto** |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Consentimiento + cápsula |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Otorgar… y caracterizar…» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Sin LLM en onboarding |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 8 pasos + `<<include>>` CU-14 |
| 6 | Flujos alternativos suficientes | ✅ | FA-01…FA-04, uno por capa |
| 7 | Flujos de excepción relevantes | ✅ | <18, sin consentimiento, 400, 401 |
| 8 | Términos del dominio (MD-01) usados | ✅ | Consentimiento, CapsulaDePerfil, Personaje |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | Pantallas + `/onboarding/` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | §14 |
| 14 | Sin detalle de implementación | ✅ | Caja negra |
| 15 | Auth como precondición/regla, no CU incluido | ✅ | `PRE-01`. El único `<<include>>` es CU-14, que no es autenticación |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19, con la correspondencia alias ↔ CU-NN |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ⚠️ | Sirve de base, pero **invalida el DR-05 vigente**: se rehace en la fase D.4 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Sin sobre-claim; minimización; adultos |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto |
| Objetivo | Consentir (informado) y armar la cápsula mínima, con *disclosure* previo. |
| Disparador | El usuario inicia el onboarding tras iniciar sesión. |
| Precondiciones | Sesión activa (CU-03); no menor de edad. |
| Conceptos del dominio | Usuario, Consentimiento, CapsulaDePerfil, Personaje/Alan/Aura. |
| Flujo básico | *Disclosure* → edad → capa base → capa de personalización y caracterización opcional → cápsula → `<<include>>` CU-14. |
| Flujos alternativos | Omitir o parcializar la caracterización; retirar la capa base; retirar solo la personalización. |
| Flujos de excepción | <18; sin consentimiento; 400; 401. |
| Postcondición de éxito | Capa base otorgada + cápsula (siempre existe, mínimo `character`, escrito por CU-14); listo para CU-06. |
| Reglas de negocio | RN-01, RN-02, RN-09, RN-10; familia RN-01.1…RN-01.6; RN-04.2; RN-07. |
| Criterios de aceptación | CA-01…CA-10. |
| Casos relacionados | CU-03 (precede), CU-14 (`<<include>>`), CU-06 (sigue), CU-11 y CU-12 (deshacen lo que este produce). |

**Fin de ECU-05.**
