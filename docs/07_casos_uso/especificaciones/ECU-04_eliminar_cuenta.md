# ECU-04 — Especificación de caso de uso: «Eliminar cuenta» (CU-04)
**ID documento:** DOC-CU-04 · **Caso de uso:** CU-04 · **Alias en DCU-01:** `CU_Elim` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-08-01 · **Versión:** v2.6 (`SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.**). v2.5 (SD-42: historial reordenado a descendente; ninguna afirmación cambia). v2.4 (`CDR-01` `H-02`, Mayor: la atomicidad prometida no tenía mecanismo — el borrado pasa a **ordenado, tolerante a fallo parcial y reintentable**, con el `Consentimiento` primero y el `Usuario` al final). v2.3 (SD-35: `RA-01` cerrada — supresión física e inmediata). v2.2 (SD-34: se retira el acotador «desde la aplicación», que existía por `PER-H5`). v2.1 (SD-29: precisión de `CA-01`, sin cambio de exigencia — ver historial) · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23 de la plantilla de la skill `use-case-specifier`) — caso de uso **canon-sensible**: es la supresión efectiva del `Usuario` y de sus registros asociados, y su efecto es irreversible.
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01 §Vista Cuenta y acceso, REQ-01 (RF-24), PRIV-01 v1.4, PER-01 v1.1, DIS-00, DR-00 (hallazgo D-05). **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** reescritura de ECU-04 v1.1 «Gestionar cuenta y datos personales», que agrupaba **tres** objetivos. DCU-01 v2.0 los separó: la caracterización se reinicia en **CU-11** y la personalización se revoca en **CU-12**. Aquí queda **un solo objetivo**, que ya era el escenario crítico del documento anterior.

---

## 1. Control del documento

| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-04 |
| Versión | v2.0 |
| Autor(es) | Jonatan Estiven Sánchez Vargas (redacción) · Santiago Bedoya García · Luis Fernando Montoya Rodríguez · Santiago Eusse Gil |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-31 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v2.6 | 2026-08-05 | J. Sánchez | `SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.** |
| v2.5 | 2026-08-05 | J. Sánchez | **SD-42 — reparación del registro, no del contenido.** El historial iba desordenado y se reordena a **descendente**, que es la convención del repositorio: se estableció **midiendo** —~~23 artefactos descendentes contra 3 ascendentes y 5 sin orden~~ **21 descendentes, 3 ascendentes y 7 mixtos** *(la cifra de `SD-42` estaba mal medida: se contó después de reparar ya `PER-01` y `CP-00`. Corregida en `SD-43`; este historial se rectifica en `SD-44`, `TVI-06`)*— y el `CHANGELOG` ya la había declarado en su `v0.21.1`. **Ninguna afirmación de este artefacto cambia.** El desorden alcanzaba a **ocho** archivos y no lo vigilaba nada; desde esta versión lo comprueba el **bloque 6** de `verificar_coherencia.py`. |
| **v2.4** | 2026-08-04 | J. Sánchez | **`CDR-01`, hallazgo `H-02` (Mayor) — retrabajo `SD-39`.** La especificación prometía un borrado en cascada **atómico** y lo sostenía con una compensación (`deshaceLoSuprimido`) que **ningún mecanismo puede implementar**: la cascada reparte el borrado en cuatro entidades, `ADR-002-D5` fija DynamoDB —que no revierte escrituras confirmadas fuera de `TransactWriteItems`— y `ADR-003` deja el almacén sin respaldo. **Sustituida por un borrado ordenado, tolerante a fallo parcial y reintentable:** `Consentimiento` primero —desde ahí el sistema ya no procesa a esa persona—, después `CapsulaDePerfil` y `ContadorDeUsoDiario`, y el `Usuario` al final. Tocados: paso 3 del flujo básico, `FE-04`, el invariante de §14, `RE-04`, `CA-10`, `RA-04`, el glosario de «borrado en cascada» y el ítem 14 del checklist. **La garantía al titular no cambia**; lo que cambia es el mecanismo prometido. |
| **v2.3** | 2026-08-04 | J. Sánchez | **SD-35 (`ADR-004-D1`): `RA-01` cerrada** — la supresión de cuenta es **física e inmediata**, sin ventana de gracia ni marca de baja. *(Fila añadida el 2026-08-04 durante el retrabajo del CDR: la ficha declaraba `v2.3` desde `SD-35` pero el historial no la registraba. Hueco de propagación, de la misma clase que motivó `SD-36`.)* |
| **v2.2** | 2026-08-04 | J. Sánchez | **SD-34: se retira el acotador «desde la aplicación» de los cuatro sitios donde estaba vivo** —§2 Objetivo, §2 Resultado observable, §14 postcondición y `CA-01`—. Lo había añadido `v2.1` por `PER-H5`, y `ADR-003` cerró ese hallazgo **quitando el respaldo** del almacén operativo. Sin segundo almacén, «recuperable desde la aplicación» y «recuperable» son lo mismo, y mantener el acotador **sugería que existe un sitio fuera de la aplicación donde el dato sobrevive**. `RA-01` también se corrige: razonaba sobre «retención de respaldo por entorno», y los «+30 días» del plan §4.14 son retención **del propio registro de cuenta** (`PER-01 §2`). **Ningún flujo, regla, invariante ni criterio de exigencia cambia** — solo se retira un acotador que dejó de ser cierto. `RA-01` sigue **abierto**. |
| **v2.1** | 2026-08-01 | J. Sánchez | **Precisión de `CA-01`, sin cambio de exigencia (SD-29).** `CA-01` decía «ningún registro asociado queda recuperable» sin acotar, mientras `§14` y «Resultado observable» ya llevaban el acotador **«desde la aplicación»** desde v2.0. La discrepancia era invisible hasta que `ADR-002-D6` puso el respaldo de la base de datos en S3 y `PER-01` abrió **`PER-H5`**: un respaldo no es alcanzable desde la aplicación, así que la promesa acotada sigue siendo cierta, pero `CA-01` — el criterio que de verdad se prueba — no la llevaba, y su método de verificación («Inspección del almacenamiento», sin acotar) habría hecho fallar la prueba por algo que el documento ya sabía que no aplicaba. Se alinea `CA-01` con `§14`; se añade nota a `RA-01` señalando que `PER-H2` ahora tiene nombre y arquitectura propios (`PER-H5`). **Ningún flujo, regla ni invariante cambia; el `.puml` de `DR-04` no se toca** (validado en 0 errores, sin mención de infraestructura). |
| **v2.0** | 2026-07-31 | J. Sánchez | **Estrechamiento a un objetivo único (PDR-01, fase D.3, tanda 2).** Salen el reinicio de la caracterización (ahora **CU-11**) y la revocación de la personalización (ahora **CU-12**), y con ellos sus reglas, sus criterios de aceptación y el paso de menú que solo servía para elegir entre las tres acciones. El nombre, el disparador, el propósito y la versión resumida dejan de hablar de «elegir una acción». Se corrige el **hallazgo D-05** del certificado de robustez: el paso 4 deja de apuntar a una interfaz que exige sesión activa. Entran tres flujos alternativos y un flujo de excepción nuevos, la **invariante de atomicidad** de la cascada y la trazabilidad del `ContadorDeUsoDiario` y del `EventoOperativo` (clases que MD-01 v1.3 incorporó al dominio). |
| v1.1 | 2026-07-25 | J. Sánchez | Consecuencia de PER-H1 (SD-26): precisión sobre el reinicio de la caracterización. |
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3), con el nombre «Gestionar cuenta y datos personales» y tres subobjetivos agrupados. |

## 2. Entradas esperadas

| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Cuenta y acceso (familia RN-04.1…RN-04.6) | Disponible |
| Modelo de dominio | MD-01 v1.4 (`Usuario`, `CapsulaDePerfil`, `Consentimiento`, `ContadorDeUsoDiario`, `Conversacion`, `EventoOperativo`, `Visitante`) | Disponible |
| Diagrama de casos de uso | DCU-01 v2.1, alias `CU_Elim` | Disponible |
| Caso de uso seleccionado | CU-04 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Reglas de negocio | RN-04.4, RN-04.6, RN-02.5, RN-01.6, RN-03.1, RN-07 | Disponible |
| Requisitos funcionales | RF-24 | Disponible |
| Requisitos especiales | RNF-01, RNF-08, **PRIV-R11**, PER-T1, PER-T2, RC-04 | Disponible |
| Restricciones | Canon: supresión efectiva, minimización, uso no punitivo | Disponible |
| Prototipos / GUI | **Gestión de cuenta** (P-13) y **Presentación / landing** (P-01) | Disponible (SD-23, alta fidelidad); el estado «cuenta eliminada» de P-01 **no** está en el inventario (`RA-03`) |

## 3. Identificación

| Campo | Valor |
|---|---|
| ID | CU-04 |
| Nombre | Eliminar cuenta |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Baja |
| Criticidad | **Alta** (la supresión en cascada es irreversible y no tiene ruta de recuperación) |
| Estado | Propuesto |

## 4. Propósito

| Campo | Descripción |
|---|---|
| Objetivo | Que el Usuario **suprima su cuenta** y, con ella, **todos sus registros asociados**, mediante un borrado en cascada verificable y **sin remanentes**. |
| Descripción breve | Desde la **Gestión de cuenta**, el Usuario solicita eliminar su cuenta; el Sistema le presenta el alcance de la supresión y le advierte que es irreversible; con la confirmación explícita, suprime el `Usuario` junto con su `CapsulaDePerfil`, su `Consentimiento` y su `ContadorDeUsoDiario`, cierra la sesión y lo devuelve a la **Presentación / landing**. |
| Valor funcional | Materializa el **canon de supresión** del proyecto: el Usuario puede irse del todo, no «desactivarse». El diseño **se alinea** con los principios de la Ley 1581/2012, cuya validación jurídica PRIV-01 declara **pendiente** (V6-b): esta especificación no afirma cumplimiento legal. |
| Resultado observable | La cuenta y sus registros asociados dejan de existir; las credenciales anteriores ya no dan acceso; **ningún registro asociado queda recuperable**. |

### 4.1 Qué pasa con las dos capas del `Consentimiento`

La definición canónica de las dos capas —**base** y **personalización**— vive en ECU-12 §4.1 y **no se repite aquí**. Lo que esta especificación añade es qué les ocurre cuando la cuenta desaparece:

| Capa | Qué le ocurre en este caso de uso |
|---|---|
| **base** | Desaparece con el registro de `Consentimiento`. No queda «revocada»: deja de existir junto con la cuenta que la otorgó. |
| **personalización** | Igual: desaparece, tanto si estaba otorgada como si el Usuario ya la había revocado antes (CU-12). |

> **Por qué importa.** ECU-12 declara que el MVP **no ofrece revocar la capa base después del onboarding** como acción separada, porque equivaldría a quedarse sin servicio, y remite esa intención a este caso de uso. CU-04 es, por tanto, **la única salida completa** del tratamiento: no cesa el uso de un registro, lo suprime. Por `RN-07` el `Consentimiento` es revocable —y ese camino es CU-12—; aquí no hay revocación que registrar porque no sobrevive el registro donde anotarla.

## 5. Actores

| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Persona ≥18 registrada, autenticada y titular de la cuenta que se elimina | Solicita la eliminación y la confirma |
| Actor secundario | — | El Proveedor LLM **no** participa en este caso de uso | No aplica |
| Sistema externo | — | No aplica | — |
| Stakeholder relacionado | Rol Datos/Privacidad | Vela por que la supresión sea efectiva y sin remanentes (PLAN-01 §7, PRIV-R11) | Verifica el borrado en cascada |

> **El `Administrador` no es actor de este caso de uso.** Sus funciones son exactamente tres —directorio, métricas agregadas y *kill switch*— y ninguna incluye suprimir cuentas ajenas (`RN-03.1`). La suspensión individual está además fuera de alcance (VIS-01 §5).

## 6. Alcance y contexto

| Campo | Valor |
|---|---|
| Alcance funcional | Supresión definitiva de la cuenta del propio Usuario y de todos sus registros asociados. |
| Límite del sistema | El Usuario suprime **su** cuenta y solo la suya. El Sistema no ofrece baja temporal, desactivación, ni restauración posterior. |
| Incluye | Advertencia de irreversibilidad, confirmación explícita, borrado en cascada, cierre de sesión y aviso final en una interfaz pública. |
| Excluye | Borrado de la `CapsulaDePerfil` conservando la cuenta (eso es CU-11), retiro de la capa de personalización (eso es CU-12), exportación previa de los registros (ningún RF la contempla) y recuperación de la cuenta (`RN-04.6`). |
| Suposiciones | El Usuario tiene cuenta y sesión activa. Puede tener o no `CapsulaDePerfil` y `Consentimiento`: quien no completó el onboarding tampoco los tiene (`FA-01`). |

## 7. Modelo de dominio involucrado

| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| `Usuario` | Persona adulta registrada; especialización de `TitularDeCuenta` | **Se suprime**: es la raíz de la cascada | username, alias, contraseña, rol (diferidos al supertipo); esAdulto, versionDisclosure | `Usuario -- Consentimiento : otorga`; `Usuario -- CapsulaDePerfil : posee`; `Usuario -- ContadorDeUsoDiario : tiene` |
| `CapsulaDePerfil` | Resumen mínimo que orienta la conversación | **Se suprime** con la cuenta | los 4 autorreportes + `character` + metadatos | `CapsulaDePerfil -- Conversacion : orienta` |
| `Consentimiento` | Aceptación granular y revocable, por capas | **Se suprime** con la cuenta; no queda como revocado | capa, estado, fecha, versión | `Usuario -- Consentimiento` |
| `ContadorDeUsoDiario` | Cuota diaria de uso del chat por usuario | **Se suprime** con la cuenta | (campos sin especificar: `PER-H4` abierto) | `Usuario -- ContadorDeUsoDiario` |
| `Conversacion` | Sesión efímera de acompañamiento | Si hay una abierta, el Sistema la cierra y descarta su contenido (`FA-02`) | — | `Usuario -- Conversacion : mantiene` |
| `EventoOperativo` | Telemetría técnica **sin contenido ni identidad** | **Permanece**: la cascada no lo alcanza, y por eso debe ser irreidentificable (`RE-06`) | momento, resultado | `Conversacion -- EventoOperativo : se documenta con` |
| `Visitante` | Persona no autenticada que consulta la presentación | Condición a la que vuelve la persona tras el paso 4 | — | `Visitante -- TitularDeCuenta : precede a` |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| Eliminar cuenta | Suprimir el `Usuario` y sus registros asociados con borrado en cascada | prohibido: «dar de baja», «desactivar la cuenta», «cerrar la cuenta», «baja temporal» | Es vocabulario de REQ-01 (RF-24); la clase es `Usuario` |
| Borrado en cascada | La supresión de la cuenta alcanza `Consentimiento`, `CapsulaDePerfil`, `ContadorDeUsoDiario` y el propio `Usuario`. **«Cascada» nombra el alcance, no el orden**: el `Usuario` es la raíz de la pertenencia, pero se suprime **el último** (`RE-04`) | prohibido: «borrado lógico», «marcar como eliminado» | PER-T1; el alcance exacto de la cascada es el de esa regla, ni más ni menos |
| `ContadorDeUsoDiario` | Cuota diaria de uso por usuario | prohibido: `DailyUsageCounter` (nombre de persistencia) | Clase de MD-01 v1.4; el nombre de persistencia vive en PER-01 |
| `Consentimiento` | Aceptación granular por capas y revocable | prohibido: «permiso», «términos», `ConsentRecord` | Aquí desaparece; **revocar** es otra operación y otro caso de uso |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Aparece solo al nombrar CU-06; el término trazable al dominio es `Personaje` |

## 8. Relaciones con otros casos de uso

| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 «Iniciar y cerrar sesión» | Este CU depende de | Requiere sesión activa (`PRE-01`); además, el paso 4 la cierra. |
| Dependencia funcional | CU-02 «Registrar cuenta» | Este CU depende de | Sin cuenta no hay nada que suprimir (`PRE-03`). |
| Distinción explícita | CU-11 «Reiniciar la caracterización» | Objetivo distinto | CU-11 borra la `CapsulaDePerfil` y **conserva** la cuenta, el `Consentimiento` y el acceso. Aquí desaparece todo, la cápsula incluida. |
| Distinción explícita | CU-12 «Revocar la personalización» | Objetivo distinto | CU-12 retira una capa del `Consentimiento` y **conserva** el servicio. Aquí el `Consentimiento` no cambia de estado: deja de existir. |
| Caso de uso afectado | CU-06 «Conversar con el acompañante» | Este CU lo termina | Una `Conversacion` abierta se cierra y su contenido se descarta antes de la supresión (`FA-02`). |
| `<<include>>` | — | — | Ninguno. La confirmación es un paso del flujo, no un subservicio observable compartido. |
| `<<extend>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

## 9. Precondiciones

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → `FE-01`) |
| PRE-02 | El rol «usuario» está validado en servidor y la solicitud apunta a la cuenta del propio titular autenticado. | Autorización | Sí (si no → `FE-02`) |
| PRE-03 | Existe la cuenta (`Usuario`) que el titular pide suprimir. | Datos | Sí |
| PRE-04 | Existen, o no, `CapsulaDePerfil` y `Consentimiento` de ese `Usuario`. | Datos | No bloqueante: quien no completó el onboarding tampoco los tiene, y la supresión sigue siendo válida (`FA-01`) |

## 10. Disparador

| Campo | Valor |
|---|---|
| Evento inicial | El Usuario solicita eliminar su cuenta en la **Gestión de cuenta**. |
| Generado por | Actor (Usuario adulto). |
| Condición inicial observable | El Sistema presenta el alcance de la supresión y advierte que la acción es irreversible. |

## 11. Flujo básico / curso normal

| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Usuario | Solicita eliminar su cuenta | `Usuario` | Presenta el alcance de la supresión —enumera qué registros desaparecen— y advierte que la acción es **irreversible** y que no existe ruta de recuperación (`RN-04.6`) | Gestión de cuenta (P-13) |
| 2 | Usuario | Confirma explícitamente la eliminación | `Usuario` | Acepta la confirmación y comprueba en servidor que quien la envía es el titular de esa cuenta (`RE-02`, `RE-03`) | Gestión de cuenta (P-13) |
| 3 | Sistema | Ejecuta el **borrado en cascada en orden**: suprime primero el `Consentimiento`, luego la `CapsulaDePerfil` y el `ContadorDeUsoDiario`, y **el `Usuario` al final** (`RE-04`) | `Consentimiento`, `CapsulaDePerfil`, `ContadorDeUsoDiario`, `Usuario` | Ningún registro asociado queda recuperable. Si la secuencia se interrumpe, lo ya suprimido **no vuelve** y el reintento la completa (`FE-04`) | — |
| 4 | Sistema | Cierra la sesión y confirma al Usuario que su cuenta y sus registros desaparecieron | `Visitante` | La persona queda sin sesión y sin cuenta, en la condición de `Visitante` | Presentación / landing (P-01), estado «cuenta eliminada» |

> **Por qué el paso 4 cambia de interfaz — corrección del hallazgo D-05.** ECU-04 v1.1 asignaba «Página de gestión de cuenta» a los pasos 3 y 4, pero en el paso 4 la cuenta ya no existe y la sesión está cerrada: P-13 exige sesión activa, de modo que el aviso final no podía verse allí. El destino es **P-01**, la única interfaz pública del paquete de cuenta junto con el registro y el ingreso. Es lo que ya dibuja DR-04.
> **Honestidad sobre el `Visitante`.** MD-01 §3.2 declara `Visitante -- TitularDeCuenta : precede a` en el sentido del alta —quien consulta sin cuenta puede pasar a tenerla—. Que la persona **vuelva** a esa condición tras la eliminación es lectura de esta especificación, coherente con la definición de `Visitante` («persona no autenticada que consulta la presentación», MV-01 §12), no una afirmación literal de MD-01.

## 12. Flujos alternativos

| ID | Nombre | Punto de inicio | Condición | Resultado | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Cuenta sin cápsula ni `Consentimiento` | Paso 3 | El Usuario registró su cuenta pero nunca completó el onboarding, así que no tiene `CapsulaDePerfil` ni `Consentimiento` que borrar | El Sistema suprime el `Usuario` y su `ContadorDeUsoDiario`; la cascada no falla por la ausencia de los otros registros | **Continúa** en el paso 4 | RN-01.6, RN-04.4 |
| FA-02 | `Conversacion` abierta al eliminar | Paso 3 | El Usuario tiene una `Conversacion` en curso cuando confirma la eliminación | El Sistema cierra la `Conversacion` y descarta su contenido antes de suprimir la cuenta; ese contenido nunca estuvo persistido | **Continúa** en el paso 4 | RN-02.5 |
| FA-03 | Cancelar la eliminación | Paso 2 | El Usuario no confirma y cancela en la **Gestión de cuenta** | El Sistema no suprime nada; la cuenta y sus registros quedan intactos | **Cancela** y **vuelve** al paso 1 | RN-04.4 |

## 13. Flujos de excepción

| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje | Estado final | Recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Cualquiera | La sesión expira antes de completar la supresión | `401`; no suprime nada | «Tu sesión expiró» | La cuenta queda íntegra | **Termina**; reingresar por CU-03 |
| FE-02 | Permiso insuficiente | Paso 2 | El rol no está autorizado, o la solicitud apunta a una cuenta ajena | `403`; no suprime nada | «No tienes permiso para esta acción» | Ninguna cuenta cambia | **Termina** |
| FE-03 | Entrada inválida | Paso 2 | Solicitud mal formada o sin confirmación explícita | `400`; no ejecuta la supresión | «No pudimos completar la eliminación; inténtalo de nuevo» | La cuenta queda íntegra | **Vuelve** al paso 2 |
| FE-04 | Cascada interrumpida | Paso 3 | El almacenamiento falla a mitad del borrado en cascada | **Conserva lo ya suprimido** —no lo restaura—, **no** confirma la eliminación e informa que quedó a medias, ofreciendo reintentar | «No pudimos terminar de eliminar tu cuenta. Parte de tus datos ya se borró y el resto sigue pendiente; puedes reintentarlo» | La supresión queda **parcial y declarada**: lo borrado no vuelve, y el reintento retoma desde donde quedó | **Vuelve** al paso 1, con el reintento disponible |

> Regla de excepción transversal: no se retornan errores crudos ni *stack traces*, claves ni metadatos internos (plan §4.13).

## 14. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El `Usuario`, su `CapsulaDePerfil`, su `Consentimiento` y su `ContadorDeUsoDiario` ya no existen | Inspección del almacenamiento |
| **Éxito (lo esencial)** | **Ningún registro asociado a la cuenta queda recuperable** (RF-24, PRIV-R11) | Inspección: sin remanentes |
| Éxito (sesión) | La sesión queda cerrada y las credenciales anteriores ya no dan acceso | Prueba de ingreso con las credenciales suprimidas |
| **Invariante** | **El orden del borrado es lo que garantiza la eliminación, no su atomicidad.** Se suprime **primero el `Consentimiento`**: desde ese instante el Sistema ya no tiene base para procesar a esa persona, aunque el resto de la cascada aún no haya terminado. Una interrupción **nunca deja la cuenta utilizable con su consentimiento retirado**, y lo que falte se completa al reintentar | Prueba de interrupción (`FE-04`): se induce el fallo tras la primera supresión y se comprueba que el `Consentimiento` ya no está y que la sesión no puede conversar |
| Fallo | La cuenta y sus registros quedan intactos y el Sistema no confirma ninguna eliminación | Inspección |
| Datos creados | Ninguno | Inspección |
| Datos modificados | Ninguno: este caso de uso no cambia estados, los suprime | Inspección |
| Datos eliminados | `Usuario` + `CapsulaDePerfil` + `Consentimiento` + `ContadorDeUsoDiario` (`RE-01`, PER-T1). El `EventoOperativo` **queda fuera** de la cascada y sobrevive sin identidad (`RE-06`) | Inspección del almacenamiento y de la telemetría |
| Cambios de estado | Ninguno de cara al Usuario: la cuenta no queda en un estado «eliminado» consultable —el dominio de valores del directorio administrativo es {activo, sin consentimiento vigente} y no contempla ese valor (`RN-03.1`, PRIV-R10)—. Si la construcción resuelve `PER-H2` con purga diferida, esa marca es interna y no altera lo observable | Inspección del directorio: la cuenta ya no figura |
| Efectos visibles | El aviso de eliminación en la **Presentación / landing** y la imposibilidad de volver a entrar | Observación |

## 15. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-04.4 | El usuario puede **eliminar su cuenta** con **borrado en cascada**. | Habilitador | Paso 3, FA-01, FA-03 | MV-01 §7.5 |
| RN-04.6 | No hay recuperación de contraseña por correo ni verificación de correo. | Restricción | Paso 1 (fundamenta la advertencia de irreversibilidad) | MV-01 §7.5 |
| RN-02.5 | La conversación se descarta al cerrar; no se reusa entre sesiones. | Restricción | FA-02 | MV-01 §7.3 |
| RN-01.6 | `character` es **precondición funcional** del chat, y por eso la `CapsulaDePerfil` **siempre existe tras el onboarding** —y solo tras él—. | Restricción | FA-01 (delimita cuándo no hay cápsula que borrar) | MV-01 §7.2 (SD-26) |
| RN-03.1 | El administrador tiene **exactamente tres funciones**: directorio mínimo, métricas agregadas y *kill switch*. | Restricción | §5, §6 (límite), FE-02, §14 | MV-01 §7.4 |
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. | Habilitador | §4.1 (delimita qué **no** hace este CU: aquí el `Consentimiento` no se revoca, desaparece) | MV-01 §7.1 |

## 16. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | La eliminación borra en **cascada** `CapsulaDePerfil`, `Consentimiento` y `ContadorDeUsoDiario` de esa cuenta (PRIV-R11, PER-T1). | Inspección del almacenamiento: cero registros asociados |
| RE-02 | Seguridad | La supresión exige **confirmación explícita** tras una advertencia de irreversibilidad; sin ella el Sistema no suprime nada. | Prueba: una solicitud sin confirmación no elimina |
| RE-03 | Seguridad | La supresión alcanza únicamente la cuenta del titular autenticado; el rol y la titularidad se comprueban en servidor, nunca por un indicador enviado por el cliente (RNF-08). | Prueba de autorización: solicitud contra una cuenta ajena → `403` |
| RE-04 | Integridad | El borrado en cascada es **ordenado, tolerante a fallo parcial y reintentable**. El orden es obligatorio y va de lo que corta el acceso hacia el titular: **`Consentimiento` primero** —sin capa base vigente el sistema ya no procesa a esa persona—, después `CapsulaDePerfil` y `ContadorDeUsoDiario`, y **el `Usuario` al final**. Si el almacenamiento falla a mitad, lo ya suprimido **no se restaura**: el Sistema no confirma la eliminación e **informa que quedó a medias, con reintento disponible**, y el reintento retoma desde donde quedó porque cada supresión es idempotente. La garantía que `RF-24` exige —que el dato personal desaparezca— se cumple al terminar la secuencia, no en un instante atómico (RF-24). | Prueba de interrupción: se induce el fallo tras la primera supresión, se comprueba que **el `Consentimiento` no está** y que el Sistema **no confirmó** la eliminación; se reintenta y la cuenta desaparece por completo |
| RE-05 | Usabilidad / no punitivo | El paso 1 enumera en español CO qué registros desaparecen y advierte que no hay vuelta atrás, **sin culpabilizar ni retener** al Usuario con fricción añadida (RNF-01, canon de uso no punitivo). | El texto de la **Gestión de cuenta** nombra los registros afectados y no interpone pasos de retención |
| RE-06 | Privacidad / auditoría | El `EventoOperativo` que sobrevive a la eliminación **no lleva alias ni username** (plan §4.15) y no permite reconstruir qué hizo una cuenta concreta (PER-T2). La supresión no deja, por esa vía, un rastro reidentificable. | Inspección de la telemetría posterior a la eliminación |

## 17. Prototipos, GUI o referencias de interfaz

| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Pantalla | **Gestión de cuenta** (P-13) | Solicitar la eliminación, ver su alcance y confirmarla | — | Eliminar cuenta, Confirmar, Cancelar | 1–2, FA-03 |
| Pantalla | **Presentación / landing** (P-01), estado «cuenta eliminada» | Confirmar la supresión a quien ya no tiene sesión | — | Volver al inicio, Registrarse | 4 |
| *Endpoint* visible | `POST /cuenta/eliminar/` | Recibir la confirmación explícita de eliminación | confirmación | Enviar | 2–3 |

> **Pantallas.** P-13 pasa a estar **compartida por CU-04, CU-11 y CU-12**, no es propia de ninguno. P-01 es de CU-01, y este caso de uso le añade un estado.
> **Hueco declarado (D-05, `RA-03`).** DIS-00 §2 declara para P-01 los estados «default · servicio no disponible»: el estado «cuenta eliminada» que exige el paso 4 **no está en el inventario de diseño**. Se nombra aquí para que exista, y queda pendiente de añadirlo a DIS-00 §2 y a su *mockup*.
> **Procedencia del *endpoint*.** `POST /cuenta/eliminar/` viene de ECU-04 v1.1 §17. La tabla de *endpoints* del MVP está **diferida a ARQ-01** (PER-01 §11), así que este nombre es el punto de interacción declarado, no un contrato cerrado (`RA-05`).
> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantallas P-01 y P-13) y `DIS-01_sistema_diseno.md`.

## 18. Datos y objetos manipulados

| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| `Usuario` | cuenta e identidad de acceso | Eliminar | Paso 3 | Es la raíz de la cascada (PER-T1) |
| `CapsulaDePerfil` | los 4 autorreportes + `character` + metadatos | Eliminar | Paso 3 | Puede no existir (`FA-01`) |
| `Consentimiento` | capa, estado, fecha, versión | Eliminar | Paso 3 | Desaparece con ambas capas; **no** queda como revocado |
| `ContadorDeUsoDiario` | cuota diaria de la cuenta | Eliminar | Paso 3 | PRIV-R11; sus campos siguen sin especificar (`PER-H4`) |
| `Conversacion` | — | Cerrar y descartar su contenido | FA-02 | Su contenido nunca estuvo persistido (`RN-02.5`) |
| `EventoOperativo` | momento, resultado | Conservar (fuera de la cascada) | Paso 3 | Sobrevive **sin identidad** reconstruible (PER-T2, `RE-06`) |

## 19. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Elim` (DCU-01 v2.1) ↔ **CU-04** | Correspondencia explícita. El número **se conserva** de v1.0: DCU-01 §3 declara numeración estable, y el flujo básico de aquel documento ya era «eliminar cuenta con borrado en cascada» |
| Requisito funcional | RF-24 «Eliminar la cuenta con borrado en cascada» | Realizado **íntegramente** por este CU |
| Requisito funcional cedido | RF-22 → CU-11 · RF-23 → CU-12 | Los realizaba ECU-04 v1.1 en sus flujos alternativos; **ya no** los realiza este CU |
| Objetivo de negocio | OBJ-7 | Control del usuario sobre su cuenta y su acceso. **OBJ-4 no aplica**: TRZ-01 lo asigna a RF-23, que este CU cedió a CU-12, y su enunciado en VIS-01 trata del chat y del Proveedor LLM, que §5 declara ausentes de este caso de uso |
| Regla de negocio | RN-04.4, RN-04.6, RN-02.5, RN-01.6, RN-03.1, RN-07 | Gobiernan el flujo |
| Requisito de calidad | RC-04 (security/minimización) | Ancla de calidad |
| Privacidad | PRIV-R11 (cascada), PRIV-R10 (directorio), PER-T1 (alcance de la cascada), PER-T2 (telemetría irreidentificable) | Restricciones verificables que este CU debe satisfacer |
| Modelo de dominio | `Usuario`, `CapsulaDePerfil`, `Consentimiento`, `ContadorDeUsoDiario`, `Conversacion`, `EventoOperativo`, `Visitante` | Conceptos manipulados |
| Diagrama de casos de uso | `Usuario -- CU_Elim` (asociación directa) | Origen |
| Caso de uso relacionado | CU-11 «Reiniciar la caracterización» | Objetivo distinto: borra la cápsula y conserva la cuenta |
| Caso de uso relacionado | CU-12 «Revocar la personalización» | Objetivo distinto: retira una capa del consentimiento y conserva el servicio |
| Caso de uso afectado | CU-06 «Conversar con el acompañante» | Una conversación abierta se cierra y se descarta (`FA-02`) |
| Caso de prueba | CP-04 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-04 / DS-04 | DR-04 existe con el alcance anterior (tres objetivos) y debe recortarse en la fase D.4; DS-04 planificado |
| Criterio de aceptación | CA-01…CA-11 | Verificación |

## 20. Criterios de aceptación

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario que confirma la eliminación de su cuenta, cuando el Sistema ejecuta el borrado, entonces su `CapsulaDePerfil`, su `Consentimiento` y su `ContadorDeUsoDiario` desaparecen y **ningún registro asociado queda recuperable**. *(El acotador «desde la aplicación» se retira en SD-34: existía por `PER-H5` —el respaldo en S3—, y `ADR-003` lo cerró quitando el respaldo. Sin segundo almacén, «recuperable desde la aplicación» y «recuperable» son lo mismo, y mantener el acotador sugeriría que hay un sitio fuera donde el dato sobrevive.)* | Flujo básico | Inspección del almacenamiento |
| CA-02 | Dado un usuario cuya cuenta acaba de desaparecer, cuando el Sistema cierra la sesión, entonces el aviso de eliminación aparece en la **Presentación / landing** y ninguna interfaz que exija sesión activa interviene en ese paso. | Flujo básico (paso 4) | Observación y prueba de navegación |
| CA-03 | Dada una solicitud de eliminación sin confirmación explícita, cuando llega al Sistema, entonces no suprime nada y la cuenta queda intacta. | RE-02 | Prueba |
| CA-04 | Dado un usuario que registró su cuenta y nunca completó el onboarding, cuando elimina la cuenta, entonces la supresión termina con éxito aunque no exista `CapsulaDePerfil` ni `Consentimiento` que borrar. | FA-01 | Inspección del almacenamiento |
| CA-05 | Dado un usuario con una `Conversacion` abierta, cuando confirma la eliminación, entonces el Sistema cierra esa conversación y su contenido no queda en ninguna parte. | FA-02 | Inspección del almacenamiento y de la traza |
| CA-06 | Dado un usuario que ya vio la advertencia de irreversibilidad, cuando cancela, entonces su cuenta y todos sus registros quedan intactos y vuelve al inicio del flujo. | FA-03 | Inspección |
| CA-07 | Dado un usuario cuya sesión expira durante la eliminación, cuando reingresa, entonces encuentra su cuenta completa y sin cambios. | FE-01 | Prueba de expiración |
| CA-08 | Dada una solicitud de eliminación dirigida a una cuenta ajena o sin el rol autorizado, cuando llega al Sistema, entonces responde `403` y ninguna cuenta desaparece. | FE-02 | Prueba de autorización |
| CA-09 | Dada una solicitud de eliminación mal formada, cuando llega al Sistema, entonces responde `400`, no suprime nada y el usuario puede reintentar. | FE-03 | Prueba de entrada inválida |
| CA-10 | Dada una interrupción a mitad del borrado en cascada, cuando el usuario vuelve a entrar, entonces **su `Consentimiento` ya no existe y no puede conversar**, el Sistema **no le confirmó** una eliminación que no terminó, y **el reintento completa la supresión**. | FE-04 | Prueba de interrupción con reintento |
| CA-11 | Dada una cuenta ya eliminada, cuando se inspecciona la telemetría superviviente, entonces ningún `EventoOperativo` permite reconstruir que esa cuenta existió ni qué hizo. | RE-06 | Inspección de la telemetría |

**Cobertura de flujos:** los ocho flujos tienen criterio asociado — flujo básico (`CA-01`, `CA-02`), `FA-01` (`CA-04`), `FA-02` (`CA-05`), `FA-03` (`CA-06`), `FE-01` (`CA-07`), `FE-02` (`CA-08`), `FE-03` (`CA-09`), `FE-04` (`CA-10`). `CA-03` y `CA-11` verifican requisitos especiales.

## 21. Riesgos, ambigüedades y decisiones pendientes

| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad | RF-24 exige que «no quede dato asociado recuperable», pero plan §4.14 fija «hasta eliminación o cierre **+ 30 días**». Es la misma cuestión que PER-01 registra como **PER-H2**. | Define si la supresión es física e inmediata o lógica con purga diferida, y por tanto si el esquema necesita marca de baja | El borrado es inmediato, y ahora también **por decisión escrita**. **Cerrado en SD-35 (`ADR-004-D1`):** la supresión es **física e inmediata**, sin ventana de gracia ni marca de baja. La ambigüedad era **sintáctica**, no de diseño — «hasta eliminación o cierre + 30 días» admite dos lecturas, y esta `RA` asumía la que contradice `RF-24`; el MVP **no tiene cierre de cuenta**, así que esa ventana no aplica aquí. La otra rama, el respaldo en S3, ya había cerrado en `ADR-003` (SD-34). | ✅ **Cerrado (SD-35)** |
| RA-02 | Decisión pendiente heredada | ECU-04 v1.1 §21 preguntaba si «Eliminar cuenta» debía separarse como caso de uso propio. | Granularidad del modelo funcional | **Resuelta: sí, y ya ocurrió.** DCU-01 v2.0 estrechó «Gestionar cuenta y datos personales» a «Eliminar cuenta» y creó CU-11 y CU-12, porque los tres RF tienen **objetivos, objetos y postcondiciones distintos** (`Usuario` · `CapsulaDePerfil` · una capa del `Consentimiento`). Fue la respuesta al punto 3 de la retroalimentación docente, que midió que 13 de 26 RF no tenían manifestación gráfica. Esta v2.0 es la consecuencia en la especificación. | **Resuelta** |
| RA-03 | Hueco de diseño | El estado «cuenta eliminada» de **P-01** que exige el paso 4 no figura en DIS-00 §2, que solo declara «default · servicio no disponible». Es el hallazgo **D-05** del certificado de robustez. | El paso 4 nombra una interfaz cuyo estado no existe en el inventario | Se nombra aquí la **Presentación / landing** (P-01), que sí es pública, y queda pendiente **añadir el estado a DIS-00 §2** y al *mockup*. No bloquea la especificación. | Abierto |
| RA-04 | Decisión de esta especificación, **revisada en el CDR** | La **atomicidad** del borrado en cascada (`RE-04`, `FE-04`) no estaba exigida en ningún artefacto previo, y esta especificación la había decidido por su cuenta. | El `CDR-01` la clasificó como **`H-02`, hallazgo Mayor**: la promesa no tenía mecanismo que la sostuviera. La cascada reparte el borrado en **cuatro entidades**, `ADR-002-D5` fija **DynamoDB** —que no revierte escrituras confirmadas fuera de `TransactWriteItems`— y `ADR-003` deja el almacén **sin respaldo**. Prometer «todo o nada» era comprometerse a algo irrealizable | **Sustituida:** el borrado pasa a **ordenado, tolerante a fallo parcial y reintentable**, con el `Consentimiento` primero y el `Usuario` al final. La garantía que importa al titular —dejar de ser procesado y que su dato desaparezca— se entrega igual, **sin transacciones y sin adelantar `ARQ-01`**. Se descartó `TransactWriteItems` por comprar una garantía más cara de la que el MVP necesita, por obligar a fijar claves antes de tiempo (`ADR-002 §1`) y por su tope de 100 ítems frente a un `ContadorDeUsoDiario` por día de uso. **Supuesto declarado:** que el borrado es idempotente, de modo que reintentar es seguro | **Decidido — `CDR-01`, `SD-39`** |
| RA-05 | Hueco heredado | El *endpoint visible* `POST /cuenta/eliminar/` proviene de ECU-04 v1.1 §17 y no tiene respaldo en un artefacto de contrato: la tabla de *endpoints* está diferida a ARQ-01 (PER-01 §11). | Contrato de interfaz | Se conserva como punto de interacción declarado; se cierra en construcción. | Abierto |
| RA-06 | Trazabilidad rota | Al estrecharse el alcance, las citas externas a los flujos de este documento dejan de resolver: **PER-01 §3.3** cita «FA-01 de ECU-04» para el borrado de `character`, y **PER-01 §5 (PER-T7)** cita «FA-01/FA-02 de ECU-04» para reinicio y revocación. Esos comportamientos viven ahora en CU-11 y CU-12. También quedan desactualizadas **PER-01 §9** («ECU-04 borra/revoca/cascada») y **ECU-00** (nombre y forma). | Trazabilidad del corpus | **No se corrigen aquí**: PER-01 es artefacto de otra fase y ECU-00 se rehace en la tanda 5. Se listan para que la fase **D.5** los repare. Las citas «CA-01 de ECU-04» (PER-T1) y «RA-01 en ECU-04 §21» (PER-H2) **siguen resolviendo**: se conservaron a propósito con el mismo significado. | Abierto |

## 22. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Suprimir la cuenta con borrado en cascada. Los otros dos objetivos salieron a CU-11 y CU-12 |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Eliminar cuenta» |
| 3 | Actor primario identificado | ✅ | Usuario adulto; el `Administrador` queda excluido con motivo (`RN-03.1`) |
| 4 | Actores externos al sistema | ✅ | Sin Proveedor LLM en este CU |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 4 pasos, desde la intención del actor hasta el aviso final; ya no arranca con un menú |
| 6 | Flujos alternativos suficientes | ✅ | FA-01…FA-03, todos con desenlace declarado |
| 7 | Flujos de excepción relevantes | ✅ | 401, 403, 400 y la cascada interrumpida |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | Incluidas `ContadorDeUsoDiario` y `EventoOperativo`, que v1.1 nombraba como «contadores» sin clase |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7; `DailyUsageCounter` y «dar de baja» prohibidos |
| 10 | Interfaces nombradas donde aplica | ⚠️ | P-13 y P-01 existen en DIS-00, pero el **estado «cuenta eliminada» de P-01 no está en el inventario**: se nombra aquí y queda abierto en `RA-03` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15; ninguna huérfana: las seis se citan en un flujo o sección |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | Verificables por inspección. El alcance temporal quedó fijado en SD-35 (`ADR-004-D1`): la supresión es **física e inmediata**, así que «sin remanentes» es comprobable sin ambigüedad. `RA-01` cerrada |
| 14 | Sin detalle de implementación | ✅ | Caja negra. **El orden del borrado sí se enuncia**, y no es detalle de implementación: es *qué* garantiza el sistema —dejar de procesar al titular desde la primera supresión— y no *cómo* lo consigue el almacén (`RE-04`, revisado en `CDR-01` `H-02`) |
| 15 | Auth como precondición, no CU incluido | ✅ | `PRE-01`, `PRE-02` |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19, con la correspondencia alias ↔ CU-NN y los RF cedidos |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20, con cobertura declarada de los 8 flujos |
| 18 | Base para robustez y secuencia | ⚠️ | Sirve de base, pero **DR-04 ya existe con el alcance anterior** (tres objetivos, 11 controladores): debe recortarse en la fase D.4 para no contradecir esta versión |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Supresión efectiva, minimización, uso no punitivo (`RE-05`), solo adultos |

## 23. Versión resumida

| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto |
| Objetivo | Suprimir su cuenta y todos sus registros asociados, con borrado en cascada y sin remanentes alcanzables. |
| Disparador | El Usuario solicita eliminar su cuenta en la **Gestión de cuenta**. |
| Precondiciones | Sesión activa; rol usuario y titularidad de la cuenta; la cuenta existe. |
| Conceptos del dominio | `Usuario`, `CapsulaDePerfil`, `Consentimiento`, `ContadorDeUsoDiario`, `Conversacion`, `EventoOperativo`, `Visitante`. |
| Flujo básico | Solicitar → ver el alcance y la advertencia → confirmar → supresión en cascada → cierre de sesión y aviso en la landing. |
| Flujos alternativos | Cuenta sin cápsula ni consentimiento; conversación abierta al eliminar; cancelar. |
| Flujos de excepción | 401; 403; 400; cascada interrumpida. |
| Postcondición de éxito | La cuenta y sus registros asociados dejan de existir, **entera o no ocurre**. |
| Reglas de negocio | RN-04.4, RN-04.6, RN-02.5, RN-01.6, RN-03.1, RN-07. |
| Criterios de aceptación | CA-01…CA-11. |
| Casos relacionados | CU-02 y CU-03 (preceden), CU-06 (se termina si está abierta), CU-11 y CU-12 (objetivos distintos). |

**Fin de ECU-04.**
