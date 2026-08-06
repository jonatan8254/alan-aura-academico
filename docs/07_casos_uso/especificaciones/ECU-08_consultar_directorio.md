# ECU-08 — Especificación de caso de uso: «Consultar directorio de usuarios» (CU-08)
**ID documento:** DOC-CU-08 · **Caso de uso:** CU-08 · **Alias en DCU-01:** `CU_Dir` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.4 (`SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.**). v2.3 (SD-42: historial reordenado a descendente; ninguna afirmación cambia). v2.2 (`CDR-01 v1.4` `VI-03`, retrabajo `SD-41`: la corrección de `H-17` se quedó en `RE-04` y el resto del documento seguía prometiendo lo retirado. **Cinco afirmaciones vivas alineadas**, no las tres que el acta listó). v2.1 (`CDR-01` `H-17`: `RE-04` exigía que la vista «no permita señalar a una persona concreta», incumplible en un directorio donde cada fila **es** un titular — reformulada a no exponer dato sensible). v2.0 (PDR-01, fase D.3, tanda 4) · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — consulta de solo lectura, sin efectos sobre datos persistidos.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §7.4 (vista Administración) y §11 (tabla de alias), REQ-01 v1.4 (RF-15, RNF-08), PRIV-01 v1.4 (PRIV-R6/R7/R10/R12), PER-01 v1.1 (PER-T4, PER-H3), VIS-01 §3.2 y §5, DIS-00 §2 paquete C (P-14). **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen de la revisión:** v1.1 nombraba el estado del directorio como derivado de `ConsentRecord`, que es el nombre de **persistencia** (vive en PER-01) y no el del dominio (hallazgo D-11); además omitía `Consentimiento` de sus conceptos, citaba el flujo alternativo de otro caso de uso por identificador, alojaba la precondición en una celda compartida y dejaba sus dos excepciones sin desenlace.

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-08 |
| Nombre | Consultar directorio de usuarios |
| Paquete funcional | Administración de plataforma |
| Nivel de abstracción | Usuario |
| **Actor primario** | Administrador de plataforma |
| Prioridad | Media |
| Frecuencia de uso | Baja |
| Criticidad | **Alta en privacidad** (es el único punto donde un rol distinto del titular mira cuentas ajenas), baja en función |
| Estado | Propuesto |

> **Por qué es un caso de uso y no una relación de dominio.** MV-01 §4 retira del modelo la asociación `Administrador -- Usuario`: ver el directorio y ver las métricas quedan clasificados allí como **casos de uso y vistas derivadas** sobre `Usuario`, no como relaciones conceptuales. MD-01 v1.4 lo respeta —la única asociación del `Administrador` es con `DisponibilidadDelChatbot`—, así que este caso de uso construye una **vista mínima** sobre `Usuario` sin que exista vínculo conceptual de supervisión.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `Usuario` | Clase de MD-01 v1.4; persona adulta registrada, subtipo de `TitularDeCuenta` | prohibido: «cliente», «paciente», «perfil» | El directorio muestra una **vista mínima** sobre esta clase, nunca la cuenta completa |
| `Consentimiento` | Clase de MD-01 v1.4; aceptación **granular por capas** y revocable | prohibido: **`ConsentRecord`** (nombre de persistencia: vive en PER-01 §2, no en las especificaciones), «permiso», «términos» | Origen del `estado` que muestra el directorio. La corrección del nombre es el hallazgo D-11 de esta versión |
| `estado` (del directorio) | Valor **derivado** ∈ {activo, sin consentimiento vigente} | prohibido: «suspendido», «bloqueado», «baja» | No es campo editable ni suspensión: VIS-01 §5 excluye la suspensión individual del alcance del administrador |
| `ID truncado` | Identificador de cuenta acortado, que **no revela el username ni ningún dato sensible** del titular | prohibido: «username», «ID completo», «correo» | Se escribe **`ID truncado`** en todo el documento porque así lo nombran REQ-01 (RF-15), MV-01 §7.4, PER-01 (PER-T4) y DIS-00 §3; no se introduce ninguna variante. **No se define como «no permite señalar a una persona»** (`H-17`): la fila del directorio **sí** señala a un titular —ese es su propósito, y `RF-15` lo pide—; lo que el truncado evita es **exponer el identificador completo**, que es minimización, no anonimato |
| `Personaje` | Clase de MD-01 v1.4, especializada en `Alan` y `Aura` | prohibido: «bot», «asistente» | Aparece aquí solo como dato **prohibido**: el `Personaje` elegido por cada `Usuario` es uno de los que el directorio no expone. «Acompañante» es su alias de producto en uso activo, declarado en la tabla de alias de MV-01 §11 |
| Directorio de usuarios | Vista derivada de solo lectura sobre las cuentas de `Usuario` | prohibido: «reporte», «tablero», «exportación» | No hay clase `Directorio` en MD-01: es una vista del caso de uso, y VIS-01 §5 excluye la exportación masiva |

## 2. Núcleo del caso de uso

**Curso básico.** Con la sesión administrativa abierta, el Administrador de plataforma abre el **Directorio de usuarios** en el panel de administración. El Sistema arma una vista mínima sobre las cuentas de `Usuario` y presenta cinco columnas, y solo cinco: alias, ID truncado, fecha de registro, `estado` ∈ {activo, sin consentimiento vigente} —que el Sistema deriva de la capa base del `Consentimiento` de cada `Usuario`— y si completó el onboarding. El Administrador recorre el listado; el Sistema deja fuera de la vista todo dato individual sensible: el username completo, los cuatro autorreportes de la `CapsulaDePerfil`, los `Mensaje` de cualquier `Conversacion`, el `Personaje` elegido, los conteos por usuario, las contraseñas y los tokens. La consulta es de solo lectura y el flujo **finaliza** sin crear, modificar ni borrar nada.

**Cursos alternativos y de excepción.** Si todavía no existe ninguna cuenta de `Usuario`, el Sistema presenta el directorio vacío con un aviso sobrio y el flujo **finaliza** sin fila alguna (`FA-01`). Si un `Usuario` no tiene vigente la capa base de su `Consentimiento`, el Sistema deriva para su fila el `estado` «sin consentimiento vigente» y el flujo **continúa** con el resto del listado, sin ofrecer acción alguna sobre esa cuenta (`FA-02`). Si quien solicita el directorio no tiene sesión, el Sistema responde `401`, no arma la vista y el flujo **termina** devolviéndolo al login administrativo separado que realiza CU-03 (`FE-01`). Si tiene sesión pero el servidor no le reconoce el rol de administrador, el Sistema responde `403`, no arma la vista y el flujo **termina** sin exponer una sola fila (`FE-02`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador** | El Administrador de plataforma abre el **Directorio de usuarios** en el panel de administración. |
| Generado por | Actor (Administrador de plataforma). |
| Condición inicial observable | El Sistema recibe la solicitud del directorio y comprueba en el servidor la sesión y el rol antes de armar la vista. |

## 4. Precondiciones

Las dos primeras son de autorización y cada una tiene su excepción asociada. La tercera **no bloquea**: sin cuentas registradas el caso de uso sigue siendo válido y produce el listado vacío de `FA-01`. No hay precondición sobre el `Consentimiento` de los usuarios listados: el Administrador consulta el directorio igual, y la ausencia de consentimiento vigente es precisamente uno de los dos valores que el `estado` puede tomar.

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Administrador tiene una sesión activa, abierta por el login administrativo separado (RF-14). | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El servidor reconoce el rol «administrador» del solicitante. | Autorización | Sí (si no → `FE-02`) |
| PRE-03 | Existe al menos una cuenta de `Usuario` registrada. | Datos | No bloqueante: si no existe, el directorio queda vacío (`FA-01`) |

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Administrador | Abre el **Directorio de usuarios** | `Usuario` | El Sistema comprueba la sesión y el rol en el servidor y arma la vista mínima sobre las cuentas de `Usuario` | Directorio de usuarios (P-14) |
| 2 | Sistema | Deriva el `estado` de cada fila a partir de la capa base del `Consentimiento` de ese `Usuario` | `Consentimiento` | El Sistema asigna «activo» o «sin consentimiento vigente»; no consulta ni expone la capa de personalización | — |
| 3 | Sistema | Presenta las cinco columnas mínimas: alias, ID truncado, fecha de registro, `estado` y onboarding completado | `Usuario`, `Consentimiento` | El Administrador ve el listado truncado y ninguna acción sobre las filas | Directorio de usuarios (P-14) |
| 4 | Administrador | Recorre el listado | `Usuario` | El Sistema mantiene fuera de la vista el username completo, los autorreportes de la `CapsulaDePerfil`, los `Mensaje`, el `Personaje` elegido, los conteos por usuario, las contraseñas y los tokens | Directorio de usuarios (P-14) |

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Directorio vacío | Paso 1 | Ninguna cuenta de `Usuario` está registrada todavía | Presenta el directorio vacío con un aviso sobrio, sin error | **Finaliza** con cero filas y sin error | PRE-03, RN-03.2 |
| FA-02 | Cuenta sin consentimiento vigente | Paso 2 | Un `Usuario` no tiene vigente la capa base de su `Consentimiento` | Deriva para esa fila el `estado` «sin consentimiento vigente»; no ofrece acción alguna sobre ella | **Continúa** en el paso 3 con el resto del listado | RN-03.2, RN-03.5 |
| FE-01 | Sesión ausente | Paso 1 | Quien solicita el directorio no tiene sesión activa | `401`; no arma la vista ni devuelve fila alguna | **Termina**; el solicitante reingresa por el login administrativo separado que realiza CU-03 | PRE-01, RN-03.7 |
| FE-02 | Rol insuficiente | Paso 1 | El solicitante tiene sesión pero el servidor no le reconoce el rol de administrador | `403`; no arma la vista ni devuelve fila alguna | **Termina** sin exponer una sola fila | PRE-02, RN-03.7 |

> Convención transversal de excepción: el Sistema no devuelve errores crudos ni volcados técnicos, sino avisos sobrios. Es la misma línea que REQ-01 exige en el criterio de RF-25 —un estado claro y no un error crudo— y que DIS-00 §3 pide para el acceso administrativo: «403 seguro si no es admin» (P-04).

## 7. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El Administrador ve el listado con las cinco columnas mínimas y ninguna otra | Observación de la vista y comparación con la enumeración de `RN-03.2` |
| **Invariante (privacidad)** | **Ninguna fila expone dato individual sensible**: ni username completo, ni autorreportes de la `CapsulaDePerfil`, ni `Mensaje`, ni el `Personaje` elegido, ni conteos por usuario, ni contraseñas, ni tokens | Inspección de la respuesta del directorio, campo por campo |
| **Invariante (solo lectura)** | **La consulta no altera nada.** En particular, no toca el `Consentimiento` del que deriva el `estado` ni ninguna cuenta de `Usuario` | Comparación del almacenamiento antes y después: cero escrituras |
| Fallo | El Sistema no arma la vista y el Administrador no ve fila alguna | Inspección de la respuesta |
| Datos creados | Ninguno | Inspección |
| Datos modificados | Ninguno | Inspección |
| Datos eliminados | Ninguno | Inspección |
| Cambios de estado | Ninguno. El `estado` que muestra el directorio es **derivado en el momento de la consulta**, no un valor que este caso de uso escriba | Traza |
| Efectos visibles | El Administrador conoce cuántas cuentas hay y cuáles carecen de consentimiento vigente, **sin conocer nada sensible de ninguna de ellas**: ve filas que identifican cuentas —eso es el directorio— pero ni contenido de conversación, ni autorreportes, ni personaje elegido, ni conteos por usuario | Observación |

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-03.1 | El administrador tiene **exactamente tres funciones**: directorio mínimo, métricas agregadas y kill switch. Consultar el directorio es una de ellas. | Restricción | Alcance del CU | MV-01 §7.4; VIS-01 §3.2 (OBJ-6) |
| RN-03.2 | El directorio muestra solo campos mínimos: alias, **ID truncado**, fecha de registro, **`estado` ∈ {activo, sin consentimiento vigente}** (derivado del `Consentimiento`, no editable ni suspensión) y onboarding completado. | Restricción | Pasos 2–3, FA-01, FA-02 | MV-01 §7.4; REQ-01 (RF-15); PER-01 (PER-T4) |
| RN-03.5 | El administrador **no** ve: username completo, respuestas de encuesta, cápsula, mensajes, personaje elegido, conteos por usuario, contraseñas ni tokens. | Restricción | Paso 4, FA-02, invariante de privacidad §7 | MV-01 §7.4; canon de minimización |
| RN-03.6 | El administrador **no** edita recursos, textos ni prompts; el entorno los aprovisiona. | Restricción | Delimita el CU: el panel de administración no es un gestor de contenidos, y el directorio consulta sin editar | MV-01 §7.4 |
| RN-03.7 | El acceso administrativo es por **login separado** y el servidor valida el rol, que el cliente no puede alterar. | Restricción | PRE-01, PRE-02, FE-01, FE-02 | MV-01 §7.4; REQ-01 (RF-14) |

> La familia completa es `RN-03.1`…`RN-03.7`. Aquí se recogen las cinco que gobiernan este caso de uso; `RN-03.3` (métricas agregadas) pertenece a CU-09 y `RN-03.4` (confirmación y auditoría del kill switch) a CU-10.

## 9. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | El directorio expone únicamente el conjunto truncado de `RN-03.2` (PRIV-R10) y el administrador no accede a cápsulas ni conversaciones (PRIV-R7). | Inspección de la respuesta del directorio: cero campos fuera de los cinco declarados |
| RE-02 | Seguridad | El servidor decide sesión y rol; ningún indicador enviado por el cliente los altera (RNF-08; PRIV-01 §4, que limita el acceso administrativo a sus tres funciones con *login* separado). **No** se ancla en PRIV-R12: esa regla trata del hasheo de la contraseña, no de la sesión ni del rol. | Una solicitud sin sesión recibe `401` y una con rol distinto recibe `403`, aunque el cliente diga otra cosa |
| RE-03 | Uso no punitivo | El directorio es **observación mínima, no gobierno de personas**: no ofrece suspender, sancionar ni segmentar (PRIV-R6; VIS-01 §5 excluye la suspensión individual). | La vista no presenta ninguna acción ejecutable sobre una fila |
| RE-04 | Minimización de la exposición | El identificador va **truncado** y el alias no es el username. La vista **no expone dato sensible ni contenido individual**: ninguna columna revela username completo, respuestas de encuesta, `CapsulaDePerfil`, `Mensaje` ni personaje elegido (PRIV-R10). **Alcance de esta regla, precisado en `CDR-01` (`H-17`):** un directorio identifica cuentas por definición —cada fila **es** un titular, con su alias—, así que lo que se exige no es impedir señalar a una persona, que sería incumplible, sino **que lo señalado no revele nada sensible sobre ella**. | Revisión de la vista: ninguna columna, ni su combinación, expone username completo, encuesta, cápsula, mensajes ni personaje |
| RE-05 | Minimización del `estado` | El `estado` deriva **solo** de la capa base del `Consentimiento`. Derivarlo también de la capa de personalización revelaría si cada `Usuario` aceptó personalizar, que es dato individual prohibido por `RN-03.5`. | Inspección: dos cuentas con distinta capa de personalización y misma capa base muestran el mismo `estado` |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **Directorio de usuarios** (P-14, DIS-00 §2 paquete C) | Presentar el listado truncado de cuentas | Abrir el directorio, recorrer el listado | 1, 3, 4 |
| Ruta visible | `/plataforma-admin/` (DIS-00 §2) | Punto de acceso del panel de administración | Consultar | 1 |

> Estados de P-14 declarados en DIS-00: **lista truncada · vacío · 401/403** — los mismos cuatro desenlaces que cubren el flujo básico, `FA-01`, `FE-01` y `FE-02`. La mini-ficha de DIS-00 §3 lo resume: tabla mínima con alias, ID truncado, fecha, `estado` y onboarding; «**jamás** username completo ni contenido».

## 11. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un Administrador con sesión activa y rol reconocido por el servidor, cuando abre el **Directorio de usuarios**, entonces ve alias, ID truncado, fecha de registro, `estado` ∈ {activo, sin consentimiento vigente} y onboarding completado, y ninguna columna más. | Flujo básico (pasos 1–3) | Observación de la vista |
| CA-02 | Dado el directorio presentado, cuando el revisor inspecciona su respuesta campo por campo, entonces no aparece el username completo, ni autorreporte alguno de la `CapsulaDePerfil`, ni `Mensaje`, ni el `Personaje` elegido, ni conteos por usuario, ni contraseñas, ni tokens. | Flujo básico (paso 4) e invariante de privacidad §7 | Inspección de la respuesta |
| CA-03 | Dada una plataforma sin ninguna cuenta de `Usuario` registrada, cuando el Administrador abre el directorio, entonces ve el listado vacío con un aviso sobrio y sin error. | `FA-01` | Prueba con almacenamiento vacío |
| CA-04 | Dado un `Usuario` sin la capa base de su `Consentimiento` vigente, cuando el Administrador consulta el directorio, entonces esa fila muestra `estado` «sin consentimiento vigente», el resto del listado aparece igual y ninguna fila ofrece acción ejecutable. | `FA-02` y `RE-03` | Prueba con cuenta sin consentimiento vigente |
| CA-05 | Dada una solicitud del directorio sin sesión activa, cuando llega al Sistema, entonces responde `401` y no devuelve fila alguna. | `FE-01` | Prueba de acceso sin sesión |
| CA-06 | Dada una solicitud del directorio con sesión pero sin el rol de administrador reconocido por el servidor, cuando llega al Sistema, entonces responde `403` y no devuelve fila alguna, aunque el cliente afirme lo contrario. | `FE-02` y `RE-02` | Prueba de manipulación del cliente |
| CA-07 | Dado el almacenamiento antes y después de una consulta completa del directorio, cuando el revisor compara ambos estados, entonces son idénticos: la consulta no escribe nada y el `Consentimiento` de cada `Usuario` queda intacto. | Invariante de solo lectura §7 | Comparación antes/después |
| CA-08 | Dadas dos cuentas con la misma capa base y distinta capa de personalización de su `Consentimiento`, cuando el Administrador consulta el directorio, entonces ambas muestran el mismo `estado`. | `RE-05` | Prueba con dos cuentas contrastadas |

**Cobertura:** los cinco flujos del documento —básico, `FA-01`, `FA-02`, `FE-01` y `FE-02`— tienen criterio asociado (`CA-01`/`CA-02`, `CA-03`, `CA-04`, `CA-05`, `CA-06`), y las dos invariantes de §7 se verifican en `CA-02` y `CA-07`.

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Dir` (DCU-01 v2.1) ↔ **CU-08** | Correspondencia explícita. El número **no** sigue el orden de declaración del `.puml`, donde `CU_Dir` es la duodécima declaración: CU-08 conserva la numeración que ya tenía en DCU-01 v1.0, y §2 del diagrama la mantiene al insertar del 11 al 14 los cuatro casos de uso nuevos. Esta nota existe porque, sin ella, el número parecería arbitrario |
| Requisito funcional | RF-15 «Visualizar el **directorio mínimo** de usuarios: alias, ID truncado, fecha de registro, estado y onboarding completado» | Realizado por este CU, entero: ningún otro caso de uso lo comparte |
| Requisito funcional relacionado | RF-14 (login administrativo separado) | Lo consumen `PRE-01` y `PRE-02`; lo realiza CU-03, no este CU |
| Objetivo de negocio | OBJ-6 (VIS-01 §3.2) | Administración con exactamente tres funciones, «sin acceder a contenido sensible ni a datos individuales» (cita literal). **Leer con la precisión de `RE-04` (`H-17`):** el directorio **sí** muestra filas individuales —`RF-15` lo exige—, así que «datos individuales» debe leerse como **contenido individual sensible**. *(La formulación de `OBJ-6` arrastra la ambigüedad y `VIS-01` se contradice consigo mismo: su §Alcance dice «sin acceder a datos **sensibles**». Señalado en `RA-07`; corregirlo es de `VIS-01`, no de aquí.)* |
| Matriz de trazabilidad | TRZ-01, fila de RF-15: `RF-15 → OBJ-6 → CU-08`, con ancla de calidad RC-04 y atributo *security* | Confirma desde fuera la cadena que declara esta especificación |
| Regla de negocio | `RN-03.1`, `RN-03.2`, `RN-03.5`, `RN-03.6`, `RN-03.7` | Gobiernan el flujo y su frontera |
| Requisito de privacidad | PRIV-R6, PRIV-R7, PRIV-R10 y PRIV-01 §4 | Anclas de `RE-01`, `RE-02`, `RE-03` y `RE-04`. PRIV-R12 **no** es ancla de ninguno: trata del hasheo de la contraseña |
| Requisito no funcional | RNF-08 (rol validado en servidor) | Ancla de `RE-02` |
| Modelo de dominio | `Usuario`, `Consentimiento` (conceptos consultados); `CapsulaDePerfil`, `Mensaje`, `Conversacion`, `Personaje` (conceptos **excluidos** de la vista) | `Consentimiento` entra en v2.0: el `estado` se deriva de él y v1.1 lo omitía |
| Mapa de persistencia | PER-01 (PER-T4, PER-H3 resuelta en SD-26) | Fija el dominio de valores del `estado`; PER-01 conserva el nombre de persistencia, que **no** se usa aquí |
| Diagrama de casos de uso | `Admin -- CU_Dir` (asociación directa) | Origen de la relación |
| Caso de uso relacionado | CU-03 «Iniciar y cerrar sesión» | Abre la sesión administrativa que `PRE-01` exige |
| Casos de uso hermanos | CU-09 «Consultar métricas de uso», CU-10 «Habilitar o deshabilitar el chatbot» | Las otras dos funciones de `RN-03.1`; ninguna se incluye ni extiende con esta |
| Diseño (mockup) | P-14 «Directorio de usuarios» (DIS-00 §2 paquete C, §3) | Pantalla única del CU |
| Caso de prueba | CP-08 | Planificado (fase de pruebas) |
| Robustez / secuencia | **DR-08 está producido** (derivado de ECU-08 v1.1) / DS-08 planificado | Esta versión **lo desalinea**: DR-08 afirma que la especificación no tiene cursos alternativos y v2.0 le añade dos. Rehacerlo es la **fase D.4** |
| Criterio de aceptación | `CA-01`…`CA-08` | Verificación |

**Sin `<<include>>` ni `<<extend>>`.** El diagrama no dibuja ninguna para este caso de uso y la especificación no la introduce: la comprobación de sesión y rol es precondición y requisito especial, no un subservicio observable, tal como manda la disciplina de la skill.

## 13. Riesgos, ambigüedades y decisiones

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | Ambigüedad heredada | Con el `Consentimiento` partido en dos capas (decisión de ECU-12 §4.1), «sin consentimiento vigente» dejó de tener un referente único: `RN-03.2` y PER-H3 se escribieron cuando el consentimiento era un interruptor solo. | **Decidido aquí:** el `estado` deriva **solo de la capa base**. Es la única lectura compatible con `RN-03.5`, porque derivarlo de la capa de personalización delataría quién aceptó personalizar —dato individual prohibido—. Se eleva a `RE-05` y a `CA-08`. | **Decidido** |
| RA-02 | Discrepancia entre insumos | RF-15, `RN-03.2`, PER-T4 y la mini-ficha de P-14 enumeran **cinco** columnas (con fecha de registro); PRIV-R10 enumera **cuatro** y omite la fecha. | **Resuelto a favor de las cinco:** la omisión de PRIV-R10 es abreviatura, no prohibición — su lista de vetos («nunca contenido, respuestas de encuesta, personaje elegido ni conteos por usuario») no nombra la fecha de registro, y cuatro artefactos independientes sí la incluyen. Conviene alinear la redacción de PRIV-R10 en su próxima revisión. | **Resuelto**, con recomendación abierta |
| RA-03 | Hallazgo corregido | v1.1 llamaba `ConsentRecord` a la clase de la que deriva el `estado`. Ese es el nombre de **persistencia** de PER-01 §2, no el del dominio (hallazgo D-11). | **Corregido:** el documento usa `Consentimiento` en todo su texto, la clase entra en los conceptos del dominio de §12 y `ConsentRecord` queda **prohibido** en el control terminológico de §1. | **Resuelto** |
| RA-04 | Alcance declarado | El directorio no pagina, no filtra, no ordena y no busca: es una vista única del MVP. | **Decidido:** la paginación es una necesidad de escala que el MVP académico no tiene. El buscador se descarta por **`RE-03`, no por `RE-04`**: buscar por alias convertiría una vista de observación en una herramienta para **ir a por alguien**, que es lo que «observación mínima, no gobierno de personas» excluye. *(La versión anterior lo justificaba diciendo que acercaría «a la reidentificación que `RE-04` evita»; `RE-04` ya no promete evitar la reidentificación —`H-17`—, así que ese argumento se apoyaba en una promesa retirada.)* Se declara para que sea discutible, no invisible. | **Decidido** |
| RA-05 | Hueco declarado | **Ningún artefacto del repositorio define qué significa «ID truncado»** (cuántos caracteres, de qué extremo). Lo nombran al menos seis —REQ-01, MV-01, PRIV-01, PER-01, TRZ-01 y DIS-00— y ninguno lo acota. Sin esa definición, **el grado de truncado** es verificable por revisión y no por medida. **`RE-04` no depende de ello** tras `H-17`: lo que exige es que la vista no exponga contenido sensible, y eso se inspecciona columna por columna cualquiera sea la longitud del identificador. Resolver en la fase de construcción; no bloquea la especificación. | Abierto |
| RA-07 | Hallazgo señalado, fuera de alcance | **La sobrepromesa que `H-17` retiró de aquí sigue viva en `VIS-01`, y encima allí se contradice.** `OBJ-6` (`VIS-01 §3.2`, línea 30) dice «sin acceder a contenido sensible **ni a datos individuales**», mientras el §Alcance del mismo documento (línea 68) dice «sin acceder a datos **sensibles**». La primera formulación es la incumplible: `RF-15` **exige** que el directorio muestre filas individuales. | **Señalado, no corregido:** `VIS-01` no pertenece a este encargo y tiene su propia cadena de propagación (`REQ-01`, `TRZ-01`, `MV-01 §7.4`). Aquí la cita se conserva **literal** —falsearla sería peor— y se acompaña de la lectura correcta en §12. | Abierto (en otro artefacto) |
| RA-06 | Hallazgo señalado, fuera de alcance | El nombre de persistencia `ConsentRecord` no solo estaba en esta especificación: el **criterio de aceptación de RF-15 en REQ-01 §1** también dice que el `estado` deriva «de `ConsentRecord`», y PER-H3 en PER-01 lo repite. | **Corregido aquí y señalado allá:** esta especificación queda limpia, pero cerrar D-11 del todo exige tocar REQ-01, que **no** pertenece a este encargo. Se deja anotado para la fase de trazabilidad. | Abierto (en otro artefacto) |

## 14. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Ver el directorio mínimo sin acceder a dato individual sensible |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Consultar» + «directorio de usuarios» |
| 3 | Actor primario identificado | ✅ | Administrador de plataforma, único |
| 4 | Actores externos al sistema | ✅ | Ninguno; el Proveedor LLM no participa |
| 5 | Flujo básico = escenario de éxito completo | ✅ | Cuatro pasos, §5 |
| 6 | Flujos alternativos suficientes | ✅ | `FA-01` (vacío) y `FA-02` (sin consentimiento vigente), ambos con desenlace |
| 7 | Flujos de excepción relevantes | ✅ | `FE-01` (401) y `FE-02` (403), los dos estados no felices que DIS-00 declara para P-14 |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | `Usuario` y `Consentimiento` consultados; `CapsulaDePerfil`, `Mensaje`, `Conversacion` y `Personaje` nombrados como excluidos |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico en §1; `ConsentRecord` prohibido |
| 10 | Interfaces nombradas donde aplica | ✅ | Directorio de usuarios (P-14) y su ruta, §10 |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §8, fuera de los pasos del flujo |
| 12 | Requisitos especiales separados | ✅ | §9, cinco requisitos con criterio propio |
| 13 | Postcondiciones verificables | ✅ | §7, con las dos invariantes de privacidad y de solo lectura |
| 14 | Sin detalle de implementación | ✅ | Caja negra. Los códigos `401`/`403` son respuestas observables por el actor, y la ruta de §10 es punto de acceso visible, no tecnología |
| 15 | Autenticación como precondición, no CU incluido | ✅ | `PRE-01` y `PRE-02`; CU-03 aparece como caso relacionado, sin `<<include>>` |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §12, con la correspondencia alias ↔ CU-NN |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §11, ocho criterios; cobertura declarada al pie |
| 18 | Base para robustez y secuencia | ⚠️ | Actor, frontera y conceptos separados en cada paso, pero **el DR-08 vigente queda desalineado** por los cursos alternativos que añade esta versión: se rehace en la fase D.4 |
| 19 | Comprensible por usuarios, analistas y desarrolladores | ✅ | Lenguaje llano; ningún término exige conocer la construcción |
| 20 | Coherente con DCU-01 y con el canon | ⚠️ **Con salvedad** | Coherente en nombre, actor, asociación y traza RF-15 → OBJ-6. La salvedad es `RA-05`: mientras «ID truncado» no tenga definición operativa, **el grado de truncado** se sostiene por revisión y no por medida. *(Antes decía «la coherencia con el canon anti-reidentificación»; ese canon no es el que este caso de uso puede sostener —`H-17`—, y el defecto que `RA-05` señala es de **minimización medible**, no de anonimato.)* |

> **Honestidad de la verificación (§4.9 del estándar documental heredado).** Todas las citas de este documento se abrieron y leyeron en el repositorio: RF-14, RF-15, RF-25 y RNF-08 en REQ-01; `RN-03.1`…`RN-03.7` en MV-01 §7.4; la tabla de alias en MV-01 §11 y la retirada de `Administrador -- Usuario` en MV-01 §4; PRIV-R6/R7/R10/R12 en PRIV-01 §3; PER-T4 y PER-H3 en PER-01; OBJ-6 y la exclusión de la suspensión individual en VIS-01 §3.2 y §5; la traza RF-15 → OBJ-6 → CU-08 en TRZ-01; P-14 en DIS-00 §2 y §3; `CU_Dir`, su asociación y su posición de declaración en `DCU-01_casos_uso.puml`; y las clases y asociaciones en `MD-01_modelo_dominio.puml`.
>
> **Dos límites declarados.** (a) El mockup renderizado de P-14 **no se abrió**: este documento se apoya en la ficha de DIS-00, no en el archivo HTML. (b) Las citas de la forma «plan §X» que aparecen en MV-01, REQ-01, PRIV-01 y PER-01 **sí son verificables**: el plan está en este repositorio, en `00_PLAN_CODEX_ORIGINAL.md` (SD-16), y así lo recuerda PER-01 §8. La versión anterior de esta nota afirmaba lo contrario y lo usaba para no comprobar ninguna cita; era falso. Aun así, cada regla se ancla **además** en el artefacto de este repositorio que la reproduce, porque es el que gobierna.

## 15. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v2.4 | 2026-08-05 | J. Sánchez | `SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.** |
| v2.3 | 2026-08-05 | **SD-42 — reparación del registro, no del contenido.** El historial iba desordenado y se reordena a **descendente**, que es la convención del repositorio: se estableció **midiendo** —~~23 artefactos descendentes contra 3 ascendentes y 5 sin orden~~ **21 descendentes, 3 ascendentes y 7 mixtos** *(la cifra de `SD-42` estaba mal medida: se contó después de reparar ya `PER-01` y `CP-00`. Corregida en `SD-43`; este historial se rectifica en `SD-44`, `TVI-06`)*— y el `CHANGELOG` ya la había declarado en su `v0.21.1`. **Ninguna afirmación de este artefacto cambia.** El desorden alcanzaba a **ocho** archivos y no lo vigilaba nada; desde esta versión lo comprueba el **bloque 6** de `verificar_coherencia.py`. |
| **v2.2** | 2026-08-05 | **`CDR-01 v1.4`, hallazgo `VI-03` — retrabajo `SD-41`.** `H-17` corrigió `RE-04` en `SD-39` y **dejó el resto del documento prometiendo lo que acababa de retirar**: el artefacto se contradecía consigo mismo. Alineadas **cinco** afirmaciones vivas —el acta listaba tres—: §1 definía `ID truncado` como el que «no permite señalar a una persona»; §7 prometía que el Administrador consulta «sin conocer a nadie en particular»; §12 glosaba `OBJ-6` sin la precisión; **`RA-04` justificaba descartar el buscador por «la reidentificación que `RE-04` evita»**, apoyándose en una promesa ya retirada —ahora se descarta por `RE-03`, que es el motivo real: buscar por alias convierte la observación en ir a por alguien—; y **el checklist #20 invocaba un «canon anti-reidentificación»** que este caso de uso no puede sostener. Se ajusta también el razonamiento de `RA-05`: el hueco de «ID truncado» afecta al **grado de truncado**, no a `RE-04`, que se inspecciona columna por columna sea cual sea la longitud. **Ni `RE-04` ni el alcance del directorio se tocan:** `RF-15` sigue pidiendo las cinco columnas. **Y un hallazgo hacia fuera (`RA-07`):** la sobrepromesa sigue viva en `VIS-01 OBJ-6`, que además se contradice con el §Alcance del propio `VIS-01`; la cita se conserva **literal** y se acompaña de su lectura correcta. |
| **v2.1** | 2026-08-04 | **`CDR-01`, hallazgo `H-17` — retrabajo `SD-39`.** `RE-04` exigía que «la combinación de columnas no permita señalar a una persona concreta», obligación **incumplible por construcción**: un directorio de usuarios identifica cuentas por definición y cada fila **es** un titular, con su alias. Reformulada a lo que `PRIV-R10` quiere decir aquí y el diseño sí cumple: **la vista no expone dato sensible ni contenido individual**. `DS-08` ya lo realizaba —su nota declara la ausencia de todo camino hacia cápsula, mensajes y personaje—; era la redacción la que no se podía verificar. |
| v2.0 | 2026-07-31 | Rehecho en PDR-01, fase D.3, tanda 4, conservando la forma ágil. **Hallazgo D-11 corregido:** `ConsentRecord` → `Consentimiento`, con la clase incorporada a los conceptos del dominio y el nombre de persistencia prohibido en el control terminológico. Se sustituye la cita del flujo alternativo de otro caso de uso por su descripción en prosa; las precondiciones pasan a filas propias (`PRE-01`…`PRE-03`); `FE-01` y `FE-02` declaran desenlace; se corrige un paso en voz impersonal y se retira el término de implementación del checklist. **Se añaden por primera vez:** los dos flujos alternativos que DIS-00 ya exigía para P-14, las postcondiciones con sus dos invariantes, `RE-03`…`RE-05`, seis criterios de aceptación nuevos, la correspondencia alias `CU_Dir` ↔ CU-08 y la sección de riesgos. Se comprobó contra PRIV-01 qué columnas puede mostrar el directorio: las cinco declaradas son legítimas (`RA-02`) y las prohibidas quedan enumeradas en la invariante de privacidad de §7. Se resuelve además a qué capa del `Consentimiento` se refiere «sin consentimiento vigente» tras la separación de ECU-12 (`RA-01`, `RE-05`) y se señala que REQ-01 arrastra el mismo `ConsentRecord` que aquí se corrige (`RA-06`). |
| v1.1 | 2026-07-25 | SD-26: dominio de valores del `estado` fijado (resolución de PER-H3). |
| v1.0 | 2026-07-25 | Creación (fase 2 ICONIX, forma ágil). |

**Fin de ECU-08.**
