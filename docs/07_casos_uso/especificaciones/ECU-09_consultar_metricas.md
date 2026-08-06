# ECU-09 — Especificación de caso de uso: «Consultar métricas de uso» (CU-09)
**ID documento:** DOC-CU-09 · **Caso de uso:** CU-09 · **Alias en DCU-01:** `CU_Met` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-08-01 · **Versión:** v2.3 (`SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.**). v2.2 (SD-42: historial reordenado a descendente; ninguna afirmación cambia). v2.1 · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — consulta de solo lectura, sin efecto sobre ningún dato persistido.
**Insumos:** DCU-01 v2.1 (alias `CU_Met`), MD-01 v1.4, MV-01 §7.4, REQ-01 (RF-16, RNF-08, RC-07/MET-07), PRIV-01 v1.4 (PRIV-R10), PER-01 v1.1 (§3.5, §3.6, PER-T2, PER-H4), VIS-01 (OBJ-6), DIS-00 (P-15). **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** reescritura de ECU-09 v1.0 (PDR-01, fase D.3, tanda 4). La v1.0 escondía las precondiciones en una celda de propósito, dejaba dos flujos de excepción sin desenlace, nombraba tecnología en su checklist y sostenía la agregación como afirmación suelta en vez de como requisito verificable.

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-09 |
| Nombre | Consultar métricas de uso |
| Paquete funcional | Administración |
| Nivel de abstracción | Usuario |
| **Actor primario** | Administrador de plataforma |
| Prioridad | Media |
| Frecuencia de uso | Baja |
| Criticidad | **Media-alta** por privacidad (la vista mira hacia todo el padrón de cuentas), baja por operación (no altera nada) |
| Estado | Propuesto |

> **Es un objetivo de actor, no una vista técnica.** El Administrador de plataforma acude a las métricas para decidir si el servicio opera con normalidad. Que la consulta no escriba nada no la degrada a paso de interfaz: tiene disparador, resultado observable y un canon de privacidad que gobernar.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `MétricaDeUso` | **Vista derivada, no clase de dominio** (MD-01 §2; MV-01 §13.2) | prohibido: «reporte», «tablero», «estadística por usuario» | El Sistema la deriva de **`Usuario` y `EventoOperativo`**; no la persiste como clase propia ni la dibuja MD-01. **`Conversacion` no es fuente** — ver la nota de §2 |
| `EventoOperativo` | Clase de MD-01 v1.4: telemetría técnica **sin contenido** | prohibido: «log de conversación», «traza del chat» | Única fuente de las cifras que dependen de la ventana temporal (PER-01 §3.6). Retención declarada: 30 días |
| `ContadorDeUsoDiario` | Clase de MD-01 v1.4: cuota diaria **por usuario** | prohibido: «métrica de uso» | **No alimenta esta vista.** Es un conteo por persona, y el Administrador tiene prohibido verlos (RN-03.5). Su composición interna sigue sin especificar: **PER-H4**, abierta (§13, `RA-01`) |
| `Administrador` | Clase de MD-01 v1.4, `is-a` `TitularDeCuenta` | prohibido: «supervisor», «moderador», «auditor» | «Administrador de plataforma» es el nombre del mismo rol como actor en DCU-01 v2.1: forma extendida, no sinónimo nuevo |
| `Usuario` | Clase de MD-01 v1.4, `is-a` `TitularDeCuenta` | prohibido: «cliente», «paciente» | Aquí entra **solo por cardinalidad**: cuántas cuentas y cuántos onboardings terminados, nunca quiénes |

## 2. Núcleo del caso de uso

**Curso básico.** El Administrador de plataforma, ya autenticado por el acceso administrativo separado, abre la **Vista de métricas de uso** del panel administrativo. El Sistema deriva cuatro cifras de la plataforma completa y las presenta como agregados de un **grupo único**, sin segmentación ni desglose. **Dos son cardinalidades de `Usuario`** —total de cuentas y onboardings completados— y **dos salen de `EventoOperativo`**, que es el único registro que sobrevive a la ventana temporal: llamadas al chat en los últimos siete días y tasa técnica de éxito/error. El Administrador de plataforma lee las cuatro cifras y el flujo **finaliza** sin que el Sistema haya expuesto un solo conteo por persona ni contenido de conversación alguno.

> **Por qué `Conversacion` no es fuente, y por qué antes lo parecía.** Hasta `v2.0` este documento
> agrupaba las tres clases sin repartir las cifras, y `DR-09`/`DS-09` —la única asignación
> explícita que existía— contaban las «llamadas al chat» desde **`Conversacion`**. Es imposible:
> la `Conversacion` **no se persiste** (`RF-13`, `PRIV-01 §2`: «No (nunca)»), así que a los siete
> días no queda nada que contar. `MD-01 §3` creó `EventoOperativo` **precisamente por eso** —«sin
> esta clase la tasa de 7 días de `ECU-09` sería incomputable»— y el reparto se corrige aquí a
> favor de esa decisión. Hallazgo `H-1b` de `DS-00`, resuelto en `v2.1`.

**Cursos alternativos y de excepción.** Si la ventana de siete días no tiene ningún `EventoOperativo`, el Sistema presenta en cero las cifras que dependen de esa ventana y declara la ausencia de actividad en lugar de dejar la tarjeta vacía; el flujo **continúa** hasta la lectura (`FA-01`). Si el *kill switch* está activo, el Sistema presenta las cuatro cifras igualmente —la indisponibilidad corta las conversaciones, no la administración— y el flujo **continúa** (`FA-02`). Si quien pide la vista no tiene sesión vigente, el Sistema responde `401`, no presenta ninguna cifra y el flujo **termina** (`FE-01`). Si la sesión es vigente pero el rol validado en servidor no es administrador, el Sistema responde `403`, no presenta ninguna cifra y el flujo **termina** (`FE-02`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador** | El Administrador de plataforma abre la **Vista de métricas de uso** dentro del panel administrativo. |
| Generado por | Actor (Administrador de plataforma). |
| Condición inicial observable | El Sistema recibe la solicitud de consulta y compone los agregados vigentes. |

## 4. Precondiciones

Las dos primeras son de autorización y corresponden al acceso administrativo separado que exige RF-14. La tercera es de datos y **no bloquea**: la ausencia de telemetría en la ventana es una situación normal de operación, no un error.

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Administrador de plataforma tiene sesión vigente. | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El rol «administrador» está validado en el servidor y no es alterable desde el cliente. | Autorización | Sí (si no → `FE-02`) |
| PRE-03 | El Sistema conserva la telemetría (`EventoOperativo`) de los últimos siete días. | Datos | No bloqueante: si la ventana está vacía, la consulta es válida y las cifras dependientes valen cero (`FA-01`) |

> El *kill switch* **no** es precondición: administrar la plataforma no depende de que el chatbot esté habilitado (`FA-02`).

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Administrador de plataforma | Abre la **Vista de métricas de uso** del panel administrativo | `MétricaDeUso` | El Sistema deriva las cuatro cifras de **`Usuario`** (dos cardinalidades) y **`EventoOperativo`** (las dos dependientes de la ventana), siempre sobre la plataforma completa | Vista de métricas de uso (P-15) |
| 2 | Sistema | Presenta los cuatro agregados vigentes: total de cuentas, onboardings completados, llamadas al chat en los últimos siete días y tasa técnica de éxito/error | `MétricaDeUso`, `EventoOperativo` | El Administrador de plataforma ve cuatro cifras de grupo único, sin control de segmentación, filtro ni rango | Vista de métricas de uso (P-15) |
| 3 | Administrador de plataforma | Lee las cuatro cifras y cierra la consulta | `MétricaDeUso` | El Sistema no ha expuesto conteo por persona ni contenido de conversación; el flujo **finaliza** sin escritura alguna | Vista de métricas de uso (P-15) |

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Ventana de siete días sin actividad | Paso 1 | El Sistema no conserva ningún `EventoOperativo` dentro de la ventana | Presenta en cero las cifras dependientes de la ventana y declara explícitamente la ausencia de actividad, en vez de dejar la tarjeta vacía | **Continúa** en el paso 2 | RN-03.3 |
| FA-02 | Chatbot deshabilitado | Paso 1 | El *kill switch* está activo cuando el Administrador de plataforma abre la vista | Presenta las cuatro cifras con normalidad: la indisponibilidad corta las conversaciones, no las funciones administrativas | **Continúa** en el paso 2 | RN-02.7, RN-03.1 |
| FE-01 | Sesión ausente | Paso 1 | Quien pide la vista no tiene sesión vigente, o la sesión expira durante la consulta | `401`; no presenta ninguna cifra ni deja ver el panel administrativo | **Termina**; el solicitante reingresa por el acceso administrativo separado (CU-03, RF-14) | PRE-01 |
| FE-02 | Rol insuficiente | Paso 1 | La sesión es vigente, pero el rol que el Sistema valida en el servidor no es administrador | `403`; no presenta ninguna cifra | **Termina**; el solicitante permanece fuera del panel administrativo y no reintenta desde el cliente | PRE-02, RN-03.7 |

> Regla de excepción transversal: el Sistema no devuelve errores crudos, trazas internas ni identificadores de persona en la respuesta de fallo.

## 7. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El Administrador de plataforma ha visto las cuatro cifras agregadas vigentes de la plataforma completa | Observación de la Vista de métricas de uso |
| **Invariante (privacidad)** | **Ninguna cifra corresponde a una persona identificable.** Las cuatro son totales de un grupo único; el Sistema no expone conteos por usuario, alias, username, cápsula ni contenido de conversación | Inspección de la vista y del origen de cada cifra |
| **Invariante (solo lectura)** | El caso de uso **no escribe nada**: consultar métricas no crea, modifica ni elimina registro alguno | Inspección del almacenamiento antes y después |
| Fallo | El solicitante queda fuera del panel administrativo y el Sistema no ha revelado ninguna cifra | Inspección de la respuesta |
| Datos creados | Ninguno | Inspección |
| Datos modificados | Ninguno | Inspección |
| Datos eliminados | Ninguno | Inspección |
| Cambios de estado | Ninguno, ni en `DisponibilidadDelChatbot` ni en `Usuario` | Traza |
| Efectos visibles | Cuatro agregados en la Vista de métricas de uso; ninguna otra parte del sistema cambia de comportamiento | Observación |

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-03.1 | El administrador tiene **exactamente tres funciones**: directorio mínimo, métricas agregadas y *kill switch*. | Restricción | Paso 1, FA-02 | MV-01 §7.4 |
| RN-03.3 | Las métricas son **agregadas** —total de cuentas, onboardings, llamadas al chat en 7 días y tasa técnica de éxito/error—; nunca individuales. | Restricción | Pasos 1–3, FA-01 | MV-01 §7.4 |
| RN-03.5 | El administrador **no** ve: username completo, respuestas de encuesta, cápsula, mensajes, respuestas, personaje elegido, **conteos por usuario**, contraseñas ni tokens. | Restricción | Paso 3, §7 (invariante) | MV-01 §7.4 |
| RN-03.7 | El acceso administrativo es por **login separado** y el Sistema valida el rol en el **servidor**, nunca en el cliente. | Restricción | PRE-02, FE-02 | MV-01 §7.4 |
| RN-02.7 | No se inicia conversación si el chatbot está deshabilitado globalmente (*kill switch*). | Restricción | FA-02 (delimita qué **no** afecta a esta vista) | MV-01 §7.3 |

## 9. Requisitos especiales

`RE-01` es la respuesta a la pregunta que la v1.0 dejaba como afirmación suelta: **qué umbral de agregación aplica**. Ni PRIV-01 ni MV-01 §7.4 declaran un umbral numérico de celda mínima; lo que sí declaran, y es verificable, es la **granularidad**: el grupo de agregación es la plataforma completa y es **uno solo**. La ausencia de umbral numérico queda registrada en `RA-02`, no disimulada.

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad (umbral de agregación) | La **única granularidad admitida es la plataforma completa**: las cuatro cifras son totales de un grupo único, sin segmentación, filtro, rango, cohorte ni desglose que reduzca ese grupo (RN-03.3, PRIV-R10). | La Vista de métricas de uso no ofrece ningún control de segmentación ni de rango, y ninguna de las cuatro cifras proviene de un conteo por persona: la inspección de la vista y del origen de cada cifra encuentra **cero** valores atribuibles a un individuo |
| RE-02 | Privacidad (no reidentificación) | El origen de las cifras dependientes de la ventana es `EventoOperativo`, que **no lleva alias, username ni identificador de usuario** (PER-01 §3.6, **PER-T2**); el total de cuentas y los onboardings completados son **cardinalidades** de `Usuario`, no listados. | Inspección del origen: los registros que alimentan las cuatro cifras no contienen ningún identificador de persona; ninguna combinación de las cuatro cifras devuelve un listado |
| RE-03 | Privacidad (fuente excluida) | `ContadorDeUsoDiario` **no** alimenta ninguna de las cuatro cifras: es un conteo por usuario y RN-03.5 lo prohíbe al Administrador de plataforma. | Inspección del origen: ninguna cifra de la vista procede del contador diario por usuario |
| RE-04 | Privacidad (ventana ≤ retención) | La ventana de siete días de «llamadas al chat» **nunca excede** la retención declarada de `EventoOperativo` (30 días, PER-01 §3.6). | Comparación de la ventana consultada contra la retención declarada: 7 ≤ 30 en toda consulta |
| RE-05 | Fiabilidad (indicador medible) | La tasa técnica de éxito/error corresponde a **MET-07**: peticiones OK + *fallback* sobre el total de peticiones; el umbral de referencia de RC-07 es **≥ 95 %**. | La cifra mostrada reproduce esa definición y es comparable contra el ≥ 95 % de RC-07. **La vista expone el indicador; no lo vigila:** el umbral es criterio de aceptación de RC-07, no una alarma del Sistema |
| RE-06 | Seguridad | El Sistema determina y valida el rol en el servidor; manipular el cliente no habilita el acceso a la Vista de métricas de uso (RNF-08, RN-03.7). | Toda solicitud revalida el rol en el servidor; una petición con el cliente alterado recibe `403` |
| RE-07 | Uso no punitivo | Las cifras agregadas no alimentan evaluación, ranking ni sanción de ninguna persona (PRIV-R6, canon). | Ninguna cifra permite ordenar, comparar ni señalar a un usuario individual |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **Vista de métricas de uso** — P-15 «Métricas de uso (agregadas)» (DIS-00; mockup `mockups/p15_admin_metricas.html`) | Presentar los cuatro agregados de la plataforma completa | Abrir la vista, Leer los agregados | 1–3 |
| *Endpoint* visible | `GET /plataforma-admin/` | Punto de acceso observable del panel administrativo, compartido con el directorio de usuarios | Consultar | 1–2 |

> **Estado de la interfaz.** DIS-00 declara para P-15 los estados «agregados» y «sin datos por usuario»; **no** declara el estado «ventana sin actividad» que exige `FA-01` (§13, `RA-03`). El *endpoint* se nombra como punto observable: la tabla formal queda diferida a ARQ-01, fase de construcción (`docs/00_gobernanza/ESTADO_PIPELINE.md`, punto 6).

## 11. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un Administrador de plataforma con sesión vigente y rol validado en servidor, cuando abre la Vista de métricas de uso, entonces ve las cuatro cifras agregadas —total de cuentas, onboardings completados, llamadas al chat en siete días y tasa técnica de éxito/error— y ningún dato por persona. | Flujo básico (§5) | Observación de la vista |
| CA-02 | Dada una ventana de siete días sin ningún `EventoOperativo`, cuando el Administrador de plataforma abre la vista, entonces las cifras dependientes de la ventana valen cero, la vista declara la ausencia de actividad y no aparece ningún error. | FA-01 | Prueba con telemetría vacía |
| CA-03 | Dado el *kill switch* activo, cuando el Administrador de plataforma abre la vista, entonces las cuatro cifras aparecen con normalidad: la indisponibilidad del chatbot no bloquea la administración. | FA-02 | Prueba con el *kill switch* activo |
| CA-04 | Dado un solicitante sin sesión vigente, cuando pide la Vista de métricas de uso, entonces recibe `401`, no ve ninguna cifra y regresa al acceso administrativo separado. | FE-01 | Prueba de expiración de sesión |
| CA-05 | Dada una sesión vigente cuyo rol validado en servidor no es administrador, cuando pide la Vista de métricas de uso, entonces recibe `403` y no ve ninguna cifra, aunque altere el cliente. | FE-02 | Prueba de autorización con cliente manipulado |
| CA-06 | Dada la Vista de métricas de uso en cualquier estado, cuando se la inspecciona, entonces no ofrece control de segmentación, filtro ni rango, y las cuatro cifras corresponden al grupo único «plataforma completa». | RE-01 | Inspección de la vista |
| CA-07 | Dado el origen de las cuatro cifras, cuando se lo inspecciona, entonces no contiene alias, username ni identificador de usuario, y ninguna cifra procede de `ContadorDeUsoDiario`. | RE-02, RE-03 | Inspección del origen |
| CA-08 | Dada una consulta de métricas completada, cuando se compara el almacenamiento antes y después, entonces no hay ningún registro creado, modificado ni eliminado. | §7 (invariante de solo lectura) | Inspección del almacenamiento |
| CA-09 | Dada la tasa técnica mostrada, cuando se la recalcula como peticiones OK + *fallback* sobre el total, entonces coincide, y es comparable contra el umbral ≥ 95 % de RC-07. | RE-05 | Recálculo contra MET-07 |

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Met` (DCU-01 v2.1) ↔ **CU-09** | Correspondencia explícita. El alias de PlantUML no es identificador de especificación; DCU-01 §2 fija la numeración y CU-09 conserva su número original de la v1.0 del diagrama. Sin esta fila, el número parecería arbitrario |
| Requisito funcional | RF-16 «Visualizar métricas agregadas: total de cuentas, onboardings, llamadas al chat en 7 días y tasa técnica de éxito/error» | **Realizado íntegramente** por este CU |
| Objetivo de negocio | OBJ-6 (Administración de plataforma, VIS-01) | Segunda de las tres funciones del administrador |
| Regla de negocio | RN-03.1, RN-03.3, RN-03.5, RN-03.7, RN-02.7 | Gobiernan el flujo y su frontera |
| Requisito de privacidad | PRIV-R10, PRIV-R6, PER-T2 | Anti-reidentificación y uso no punitivo |
| Requisito de calidad | RC-07 (Reliability) con **MET-07** y umbral **≥ 95 %** (REQ-01 §3) | Ancla de calidad de la cuarta cifra |
| Requisito no funcional | RNF-08 (rol validado en servidor) | Sostiene `PRE-02` y `FE-02` |
| Modelo de dominio | `Administrador`, `Usuario`, `EventoOperativo` (clases de MD-01 v1.4) · `MétricaDeUso` (**vista derivada, no clase**) · `ContadorDeUsoDiario` y `Conversacion` (**ambas excluidas a propósito**: la primera por `RN-03.5`, la segunda porque no se persiste — `H-1b`) | Conceptos manipulados |
| Mapa de persistencia | PER-01 §3.6 (`EventoOperativo`, única fuente y retención de 30 días), §3.5 (`ContadorDeUsoDiario`), PER-T2 | Origen y límites de las cifras |
| Diagrama de casos de uso | `Admin -- CU_Met` (asociación directa, DCU-01 v2.1) | Origen de la asociación |
| Caso de uso previo | CU-03 «Iniciar y cerrar sesión» | Provee la sesión administrativa (RF-14, RF-21) |
| Casos de uso hermanos | CU-08 «Consultar directorio de usuarios» y CU-10 «Habilitar o deshabilitar el chatbot» | Las otras dos funciones del administrador (RN-03.1) |
| Diseño | DIS-00 P-15 «Métricas de uso (agregadas)» + DIS-01 | Pantalla de este CU |
| Caso de prueba | CP-09 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-09 / DS-09 | Planificados (DR-09 en la fase D.4) |
| Criterio de aceptación | CA-01…CA-09 | Verificación |

## 13. Riesgos, ambigüedades y decisiones pendientes

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | **Decisión pendiente del proyecto (PER-H4)** | `ContadorDeUsoDiario` está nombrado y acotado (por usuario, diario, ≤ 30 días), pero **su composición y su llave no están especificadas** en ningún artefacto. | **No se da por cerrada.** Esta especificación **no** apoya ninguna de sus cuatro cifras en ese contador: la fuente de las cifras dependientes de la ventana es `EventoOperativo`, que PER-01 §3.6 declara **única fuente** de las métricas agregadas (`RE-03`). Si en construcción se decidiera derivar «llamadas al chat en 7 días» del contador diario, **PER-H4 tendría que cerrarse antes** y habría que revisar `RE-02` y `RE-03`, porque ese contador es por persona. | **Abierto** (PER-H4, abierto por decisión desde SD-26) |
| RA-02 | Hueco declarado | **Ningún artefacto declara un umbral numérico de celda mínima** (tamaño mínimo del grupo agregado) para las métricas. Lo que protege hoy es la granularidad: un grupo único, sin segmentación (`RE-01`), y un origen sin identificadores (`RE-02`). | Con un solo grupo no hay celda que pueda encogerse hasta una persona, así que el umbral numérico no hace falta **mientras la vista no se segmente**. Queda como condición explícita: si alguna vez se añade filtro, cohorte o desglose, hay que definir y aprobar un umbral mínimo antes. Se declara para que sea discutible, no invisible. | **Abierto (condicionado)** |
| RA-03 | Hueco de diseño | DIS-00 declara para P-15 los estados «agregados» y «sin datos por usuario»; **no** declara el estado «ventana sin actividad» que `FA-01` necesita. | Resolver al detallar P-15 en la fase de diseño; no bloquea la especificación. | Abierto |
| RA-04 | Riesgo de lectura | Una plataforma académica con muy pocas cuentas hace que un total agregado se acerque al dato individual por simple aritmética social (quien conoce el padrón infiere). | Mitigado parcialmente por `RE-02` (el origen no lleva identificadores) y por `RN-03.5` (sin conteos por usuario). No es eliminable por diseño de la vista: queda anotado como límite conocido del MVP académico, no como defecto oculto. | Abierto |
| RA-05 | Ambigüedad menor | «Onboardings completados» aparece en RF-16 y en RN-03.3 sin definir qué marca la terminación. | Interpretación de esta especificación: termina cuando existe la `CapsulaDePerfil`, que tras el onboarding **siempre existe** con `character` como mínimo (SD-26). Se declara como interpretación, no como cita. | Abierto |

## 14. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Consultar los agregados de operación de la plataforma |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Consultar métricas de uso», idéntico a DCU-01 v2.1 |
| 3 | Actor primario identificado y externo | ✅ | Administrador de plataforma |
| 4 | Actores externos | ✅ | Ninguno: el Proveedor LLM no interviene en esta consulta |
| 5 | Flujo básico = escenario de éxito completo | ✅ | Tres pasos, del disparador a la lectura |
| 6 | Flujos alternativos suficientes | ✅ | `FA-01` (ventana vacía) y `FA-02` (*kill switch*). La v1.0 declaraba «no aplica»: era una omisión, no una decisión |
| 7 | Flujos de excepción relevantes | ✅ | `FE-01` (`401`) y `FE-02` (`403`), ambos **con desenlace declarado** |
| 8 | Términos del dominio (MD-01 v1.4) | ✅ | `Administrador`, `Usuario`, `EventoOperativo`; `MétricaDeUso` marcada como vista derivada; `Conversacion` retirada como fuente (`H-1b`) |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §1, con `ContadorDeUsoDiario` explícitamente excluido |
| 10 | Interfaces nombradas | ✅ | Vista de métricas de uso (P-15) y *endpoint* visible §10 |
| 11 | Reglas de negocio separadas por ID | ✅ | §8, cada una con fuente en MV-01 |
| 12 | Requisitos especiales con criterio medible | ⚠️ **Parcial** | `RE-01`…`RE-07` tienen criterio verificable, pero el **umbral de agregación no es numérico**: ningún artefacto declara una celda mínima, y lo verificable es la granularidad de grupo único. Declarado en `RA-02` en vez de fingir un número |
| 13 | Postcondiciones verificables | ✅ | §7, con las dos invariantes (privacidad y solo lectura) |
| 14 | Sin detalle de implementación | ✅ | Caja negra funcional: sin tecnología ni mecanismo de cálculo. El *endpoint* aparece como punto observable, con la tabla formal diferida a ARQ-01 |
| 15 | Autenticación como precondición, no CU incluido | ✅ | `PRE-01` y `PRE-02` en fila propia |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §12, con la correspondencia `CU_Met` ↔ CU-09 |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §11 |
| 18 | Cobertura de flujos por criterios | ✅ | Los cinco flujos (básico, `FA-01`, `FA-02`, `FE-01`, `FE-02`) tienen criterio asociado: `CA-01`…`CA-05` |
| 19 | Base para robustez y secuencia | ✅ | Pasos numerados con frontera y conceptos nombrados; DR-09 / DS-09 quedan **planificados**, no producidos |
| 20 | Coherente con DCU-01 y canon | ⚠️ **Con salvedad** | Nombre, actor, paquete y traza coinciden con DCU-01 v2.1, y se preservan minimización y uso no punitivo. La salvedad es `RA-04`: en un padrón pequeño, un agregado global se acerca al dato individual por aritmética social, y eso no se resuelve dentro de esta vista |

## 15. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v2.3 | 2026-08-05 | J. Sánchez | `SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.** |
| v2.2 | 2026-08-05 | **SD-42 — reparación del registro, no del contenido.** El historial iba desordenado y se reordena a **descendente**, que es la convención del repositorio: se estableció **midiendo** —~~23 artefactos descendentes contra 3 ascendentes y 5 sin orden~~ **21 descendentes, 3 ascendentes y 7 mixtos** *(la cifra de `SD-42` estaba mal medida: se contó después de reparar ya `PER-01` y `CP-00`. Corregida en `SD-43`; este historial se rectifica en `SD-44`, `TVI-06`)*— y el `CHANGELOG` ya la había declarado en su `v0.21.1`. **Ninguna afirmación de este artefacto cambia.** El desorden alcanzaba a **ocho** archivos y no lo vigilaba nada; desde esta versión lo comprueba el **bloque 6** de `verificar_coherencia.py`. |
| v2.1 | 2026-08-01 | **SD-30, hallazgo `H-1b` de `DS-00`.** Se reparten las cuatro cifras entre sus fuentes, que hasta ahora se citaban agrupadas: dos son **cardinalidades de `Usuario`**, dos salen de **`EventoOperativo`**. **`Conversacion` deja de ser fuente** — no se persiste (`RF-13`, `PRIV-01 §2`), así que a los siete días no queda nada que contar, y `MD-01 §3` creó `EventoOperativo` precisamente por eso. Afecta a §1 (control terminológico), §2 (núcleo + nota nueva), §5 paso 1, §12 y §14. `DR-09` y `DS-09` se alinean y pierden la entidad `Conversacion`. |
| v2.0 | 2026-07-31 | Reescritura (PDR-01, fase D.3, tanda 4). **Precondiciones** extraídas a fila propia (`PRE-01`…`PRE-03`), donde antes vivían en una celda de propósito. **Desenlace declarado** en los dos flujos de excepción y **dos flujos alternativos nuevos** (`FA-01`, `FA-02`) donde la v1.0 escribía «no aplica». **Cobertura completa de flujos por criterios** (`CA-01`…`CA-05`). El umbral de agregación pasa de afirmación suelta a **requisito verificable** (`RE-01`…`RE-04`), con la ausencia de umbral numérico declarada en `RA-02`. **PER-H4 registrada como abierta** (`RA-01`) y `ContadorDeUsoDiario` excluido de las fuentes de manera explícita. Se retira la mención de tecnología del checklist. Se añade la correspondencia **alias `CU_Met` ↔ CU-09** a la trazabilidad y los insumos pasan a MD-01 v1.4, DCU-01 v2.1 y PER-01 v1.1. |
| v1.0 | 2026-07-16 | Creación (forma ágil). |

**Fin de ECU-09.**
