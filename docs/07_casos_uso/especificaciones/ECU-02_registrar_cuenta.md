# ECU-02 — Especificación de caso de uso: «Registrar cuenta» (CU-02)
**ID documento:** DOC-CU-02 · **Caso de uso:** CU-02 · **Alias en DCU-01:** `CU_Reg` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.2 (`SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.**). v2.1 (SD-42: historial reordenado a descendente; ninguna afirmación cambia). v2.0 · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — alta de cuenta con tres datos, un curso alternativo y una excepción. La v1.0 ya era ágil y el alcance funcional **no cambia**.
**Insumos:** DCU-01 v2.1 (`CU_Reg`), MD-01 v1.4 (`Visitante`, `TitularDeCuenta`, `Usuario`), MV-01 §7.1/§7.2/§7.5 y §11, REQ-01 v1.4 (RF-20, §2 RNF), PRIV-01 v1.4 (§2 inventario, §3 PRIV-R12), PER-01 §3.1, DIS-00 §2/§3 (P-02) y su mockup `p02_registro_cuenta.html`, VIS-01 (OBJ-7).
**Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Sobre las fuentes citadas como «plan §…»:** MV-01 y PER-01 remiten en algunas filas al plan del **macroproyecto**, que no está en este repositorio. Esta especificación cita el artefacto local que recoge cada regla —MV-01, REQ-01, PRIV-01, PER-01—, nunca el plan externo, que no se abrió.
**Origen:** rehecho en el PDR-01, fase D.3, tanda 2, sobre ECU-02 v1.0. Cuatro defectos corregidos: precondiciones no reconocibles, flujos sin desenlace, cobertura incompleta de criterios y el **hallazgo D-04** (paso 3 sobre una pantalla sin nombre).

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-02 |
| Nombre | Registrar cuenta |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| **Actor primario** | Visitante (pasa a Usuario al crear la cuenta) |
| Actores secundarios | Ninguno. No interviene el Proveedor LLM ni el Administrador |
| Prioridad | Alta (sin cuenta no hay nada más) |
| Frecuencia | Baja: una vez por persona |
| Criticidad | Media (crea el único registro identificable del MVP) |
| Estado | Propuesto |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `Visitante` | Clase y actor de MD-01 v1.4: persona no autenticada | prohibido: «anónimo», «invitado» | Es el actor primario **al empezar**; al terminar el curso básico ya es `Usuario`. MD-01 v1.4 modela ese orden con la asociación `Visitante -- TitularDeCuenta : precede a`, no como transición ni como clase de estado |
| `TitularDeCuenta` | **Supertipo** de MD-01 v1.4; porta la identidad de acceso `username`, `alias`, `contrasena`, `rol` | prohibido: «Cuenta» como clase | MD-01 §3.1 descartó `Cuenta <|-- Usuario`: una persona **no es** una identidad de acceso y no pasa el *substitution test*. Este caso de uso crea justamente esos cuatro atributos |
| `Usuario` | Especialización (`is-a TitularDeCuenta`) que otorga consentimiento, posee cápsula y mantiene conversaciones | prohibido: «cliente», «paciente», «perfil» | Lo que este caso de uso crea es un `Usuario` **todavía sin** `Consentimiento` ni `CapsulaDePerfil` |
| `alias` | Nombre elegido con el que el acompañante y el directorio se dirigen a la persona | prohibido: «nombre», «nombre real» | Es el **único** dato identificable que el `Administrador` llega a ver (PER-01 §3.1, RN-03.2). No es el nombre legal, que RN-04.1 prohíbe pedir |

## 2. Núcleo del caso de uso

**Curso básico.** Sin sesión activa, el Visitante abre **P-02 «Registro»** desde la presentación pública y entrega los tres datos de identidad mínima que admite `RN-04.1`: `username`, `alias` y `contrasena`. El Sistema comprueba su formato, comprueba que ningún `TitularDeCuenta` tenga tomado ese `username` y crea el `Usuario` con la contraseña hasheada (`PRIV-R12`) y el `rol` de usuario fijado en el servidor (`RNF-08`). El Sistema confirma el alta en **P-02 «Registro»** y ofrece el paso a CU-03 «Iniciar y cerrar sesión»; el flujo **finaliza** con una cuenta creada que todavía **no** puede conversar, porque el `Consentimiento` y la `CapsulaDePerfil` nacen después, en CU-05 «Otorgar consentimiento y crear la cápsula de perfil» (`RN-02`).

**Cursos alternativos y de excepción.** Si el `username` propuesto ya pertenece a otra cuenta, el Sistema no crea nada, pide otro `username` y el flujo **retorna** al paso 2 (`FA-01`). Si el Visitante envía **P-02 «Registro»** con algún dato vacío o mal formado, el Sistema responde `400`, explica el rechazo en esa misma pantalla y el flujo **retorna** al paso 2 conservando lo ya diligenciado, sin crear cuenta (`FE-01`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador** | El Visitante elige «Crear cuenta» en la presentación pública y abre la pantalla P-02 «Registro». |
| Generado por | Actor (Visitante). |
| Condición inicial observable | El Sistema presenta P-02 «Registro» pidiendo `username`, `alias` y `contrasena`, con el aviso de minimización que el mockup ya redacta: «No pedimos correo, documento ni teléfono». |

## 4. Precondiciones

Dos gobiernan el arranque —que no haya sesión y que el alta sea pública— y una tercera condiciona el dato que el Visitante propone. **No** son precondición ni el consentimiento ni la declaración de edad: los dos pertenecen al onboarding de CU-05 (`RN-01.2`), y exigirlos aquí adelantaría un paso que este caso de uso no ejecuta.

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Visitante **no** tiene sesión activa. | Autorización | Sí |
| PRE-02 | El alta es pública: el Visitante alcanza la ruta `/registro/` sin autenticarse. | Funcional | Sí (DIS-00 §2 asigna esa ruta al actor Visitante) |
| PRE-03 | Ningún `TitularDeCuenta` tiene tomado el `username` que el Visitante propone. | Datos | Sí, en el momento del envío (si no → `FA-01`; la unicidad la declara PER-01 §3.1) |

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Visitante | Abre P-02 «Registro» desde la presentación pública | `Visitante` | Presenta P-02 «Registro» y pide únicamente `username`, `alias` y `contrasena` (`RN-04.1`) | P-02 «Registro» |
| 2 | Visitante | Diligencia `username`, `alias` y `contrasena`, y envía el alta | `TitularDeCuenta` | Comprueba el formato de los tres datos y que ese `username` no lo tenga tomado otro `TitularDeCuenta` | P-02 «Registro» |
| 3 | Sistema | Crea el `Usuario` con la contraseña hasheada (`PRIV-R12`) y el `rol` de usuario fijado en el servidor (`RNF-08`) | `Usuario` | Confirma el alta y ofrece el paso a CU-03 «Iniciar y cerrar sesión»; el flujo **finaliza** | P-02 «Registro», **estado de éxito no declarado** en DIS-00 §2 (`RA-01`) |

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | El `username` ya está tomado | Paso 2 | Otro `TitularDeCuenta` usa ese `username` (`PRE-03`) | Rechaza el alta y pide otro `username`; no crea nada | **Retorna** al paso 2, con `alias` y `contrasena` a la espera de un `username` libre | PER-01 §3.1, `RA-03` |
| FE-01 | Entrada inválida | Paso 2 | El Visitante envía el alta con algún dato vacío o mal formado | Responde `400` y explica el rechazo en P-02 «Registro», sin crear cuenta | **Retorna** al paso 2 conservando lo ya diligenciado | `RN-04.1`, `RA-02` |

## 7. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | Existe un `Usuario` —especialización de `TitularDeCuenta`— con `username`, `alias`, contraseña **hasheada** y `rol` de usuario | Inspección de lo persistido (PER-01 §3.1) |
| **Invariante** | **La cuenta nace sin `Consentimiento` y sin `CapsulaDePerfil`**: no hay conversación posible hasta que CU-05 otorgue la capa base (`RN-02`) | Consulta de ambos conceptos justo después del alta |
| **Invariante** | `esAdulto` y `versionDisclosure` siguen **sin valor**: la declaración de edad pertenece al onboarding (`RN-01.2`, `RN-04.2`) | Inspección de lo persistido |
| **Invariante** | El Sistema no pide ni guarda nombre legal, documento, correo, teléfono, dirección ni fecha de nacimiento (`RN-04.1`) | Inspección de lo persistido y del envío |
| Fallo | Ninguna cuenta creada; quien lo intentó sigue siendo `Visitante` | Inspección |
| Datos creados | La identidad mínima de la cuenta y su fecha de registro (PER-01 §3.1) | Inspección |
| Datos modificados | Ninguno: el alta no toca ningún registro previo | Inspección |
| Cambios de estado | El actor pasa de `Visitante` a `Usuario`, el orden que MD-01 v1.4 enuncia con `Visitante -- TitularDeCuenta : precede a` | Traza |
| Efectos visibles | El Sistema confirma el alta y ofrece el paso a CU-03; el chat sigue cerrado | Observación |

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-04.1 | El registro pide solo `username`, `alias` y contraseña; ni nombre legal, ni documento, ni correo, ni teléfono, ni dirección, ni fecha de nacimiento. | Restricción | Pasos 1–2, `FE-01`, `RE-01` | MV-01 §7.5 |
| RN-04.6 | No hay recuperación de contraseña por correo ni verificación de correo. | Restricción | `RE-01`, `RA-02` | MV-01 §7.5 |
| RN-04.5 | El Visitante solo consulta la presentación pública; no alcanza el chat ni datos de nadie. | Restricción | `PRE-02`, paso 1 | MV-01 §7.5 |
| RN-02 | El Sistema no inicia conversación sin `Consentimiento` otorgado. | Restricción | §7, primera invariante | MV-01 §7.1 |
| RN-01.2 | La edad se declara antes del consentimiento; quien declara menos de 18 años no continúa. | Restricción | §4, §7, segunda invariante | MV-01 §7.2 |
| RN-04.2 | El Sistema guarda la mayoría de edad como declaración booleana más versión del *disclosure*, nunca como fecha de nacimiento. | Hecho | §7, segunda invariante | MV-01 §7.5 |
| PRIV-R12 | El Sistema almacena la contraseña **hasheada**: nunca en claro, nunca en el cliente, nunca accesible al `Administrador`. | Restricción | Paso 3, `RE-02` | PRIV-01 §3 |
| RNF-08 | El Sistema determina y valida el `rol` en el **servidor**; el cliente no lo elige ni lo altera. | Restricción | Paso 3, `RE-02` | REQ-01 §2 |
| RNF-09 | Las claves y los *tokens* no llegan al navegador ni al repositorio. | Restricción | `RE-02` | REQ-01 §2 |

## 9. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad (minimización) | El alta captura exactamente tres datos —`username`, `alias`, `contrasena`— y ninguno más (`RN-04.1`); sin correo, el MVP tampoco ofrece recuperación de contraseña (`RN-04.6`), y esa consecuencia se dice en P-02 «Registro» en vez de callarse. | Inspección del envío y de lo persistido: cero datos identificatorios adicionales |
| RE-02 | Seguridad | El Sistema guarda la contraseña hasheada (`PRIV-R12`), fija el `rol` en el servidor (`RNF-08`) y no entrega secretos al cliente (`RNF-09`). | La contraseña nunca queda en claro ni viaja al cliente; manipular el envío no cambia el `rol` |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **P-02 «Registro»** (DIS-00 §2, ruta `/registro/`) | Crear la cuenta con identidad mínima y comunicar la minimización | Crear cuenta · Ir a iniciar sesión | 1–3 |
| Estados diseñados | P-02 «Registro»: vacío · error `400` · `username` en uso (DIS-00 §2) | Cubren el paso 2, `FE-01` y `FA-01` | — | 2 |
| Estado de éxito | **No declarado en DIS-00 §2** — ver `RA-01` | Debería cubrir el paso 3 (confirmación del alta e invitación a iniciar sesión) | — | 3 |
| Punto de interacción visible | Ruta `/registro/` (DIS-00 §2) | Recibe el alta | Enviar | 2–3 |

> El único enlace hacia CU-03 que el mockup de P-02 ya redacta es «¿Ya tienes cuenta? Inicia sesión», pensado para quien llega por error, **no** para quien acaba de registrarse. Es exactamente el vacío que describe `RA-01`.

## 11. Criterios de aceptación

Los tres flujos —básico, `FA-01` y `FE-01`— tienen criterio propio. La v1.0 tenía tres criterios, pero ninguno cubría las invariantes de la cuenta recién nacida ni la asignación del `rol` en el servidor.

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un Visitante sin sesión activa, cuando envía `username`, `alias` y `contrasena` válidos en P-02 «Registro», entonces el Sistema crea el `Usuario`, confirma el alta y le ofrece el paso a CU-03. | Flujo básico | Observación de P-02 «Registro» |
| CA-02 | Dada una cuenta recién creada, cuando se inspecciona lo persistido, entonces constan `username`, `alias`, contraseña **hasheada**, `rol` y fecha de registro, y **ningún** dato identificatorio más. | Flujo básico · `RE-01` | Inspección de lo persistido |
| CA-03 | Dado un `Usuario` recién registrado, cuando se consultan su `Consentimiento` y su `CapsulaDePerfil`, entonces **no existe ninguno de los dos** y el chat permanece cerrado hasta CU-05. | Flujo básico · §7 (invariantes) | Consulta inmediata tras el alta |
| CA-04 | Dado un envío manipulado que pide `rol` de administrador, cuando el Visitante lo confirma, entonces la cuenta queda con `rol` de usuario. | `RE-02` | Prueba de manipulación del envío |
| CA-05 | Dado un `username` que ya pertenece a otra cuenta, cuando el Visitante lo envía, entonces el Sistema no crea cuenta alguna, pide otro `username` y el flujo **retorna** al paso 2. | `FA-01` | Prueba con `username` duplicado |
| CA-06 | Dado un envío con algún dato vacío o mal formado, cuando el Visitante lo confirma, entonces el Sistema responde `400`, no crea cuenta y el flujo **retorna** al paso 2 conservando lo diligenciado. | `FE-01` | Prueba de entrada inválida |

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Reg` (DCU-01 v2.1, paquete «Acceso y cuenta») ↔ **CU-02** | Correspondencia explícita. El `.puml` nombra sus casos de uso con alias y la especificación con identificadores numerados; sin esta fila el número parecería arbitrario. CU-02 conserva su numeración de la v1.0 del diagrama |
| Requisito funcional | RF-20 «Registrar cuenta con username, alias y contraseña…» | **Realizado íntegramente** por este CU; es el único que lo realiza |
| Objetivo de negocio | OBJ-7 «Gestión de cuenta y acceso» (VIS-01) | Es su primera pieza: sin alta no hay ni sesión ni onboarding |
| Reglas de negocio | `RN-04.1`, `RN-04.2`, `RN-04.5`, `RN-04.6`, `RN-01.2`, `RN-02`, `PRIV-R12`, `RNF-08`, `RNF-09` | Gobiernan el flujo y las invariantes |
| Modelo de dominio | `Visitante`, `TitularDeCuenta`, `Usuario` (MD-01 v1.4), y la asociación `Visitante -- TitularDeCuenta : precede a` | Conceptos creados y orden de roles |
| Diagrama de casos de uso | `Visitante -- CU_Reg` (asociación simple; sin `<<include>>` ni `<<extend>>`) | Origen de la relación |
| Caso de uso previo | CU-01 «Consultar presentación del servicio» | Da acceso a P-02 «Registro»; **no** es precondición del alta |
| Casos de uso siguientes | CU-03 «Iniciar y cerrar sesión» → CU-05 «Otorgar consentimiento y crear la cápsula de perfil» | El alta no autentica ni consiente: ambas cosas ocurren después |
| Caso de uso inverso | CU-04 «Eliminar cuenta» | Deshace lo que este crea, con borrado en cascada (PRIV-R11) |
| Persistencia | PER-01 §3.1 (cuenta e identidad mínima) | Único registro identificable que crea el MVP |
| Diseño | DIS-00 §2/§3, pantalla P-02, y su mockup `p02_registro_cuenta.html` | Interfaz; con el vacío de `RA-01` |
| Caso de prueba | CP-02 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-02 / DS-02 | Planificados (DR-02 en la fase D.4) |
| Criterios de aceptación | CA-01…CA-06 | Verificación |

## 13. Riesgos y ambigüedades

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | Vacío de diseño (**hallazgo D-04**) | El paso 3 confirma el alta, y DIS-00 §2 declara para P-02 «Registro» solo tres estados: vacío, error `400` y `username` en uso [E1]. El mockup `p02_registro_cuenta.html` renderiza únicamente el de `username` en uso [E1]. **No existe estado de éxito** en P-02 «Registro». | La especificación **nombra P-02 «Registro»**, que sí existe, y **no inventa** ni una pantalla nueva ni un redireccionamiento a P-03. Quedan dos salidas posibles para la fase 5: añadir un estado de confirmación a P-02, o llevar al recién registrado a P-03 «Iniciar sesión (usuario)» con un aviso de alta exitosa [I2]. Decide DIS-00, no esta especificación. | **Abierto**; bloquea el mockup, no la especificación |
| RA-02 | Ambigüedad | Ningún artefacto de este repositorio fija el formato mínimo de `contrasena`, `username` ni `alias`: no hay política de longitud ni de composición en REQ-01, PRIV-01 ni MV-01 §7.5 [E1]. Por eso `FE-01` no puede enumerar sus causas de rechazo. | `FE-01` se declara de forma genérica —dato vacío o mal formado— y la política se fija en construcción. Pesa más de lo normal porque `RN-04.6` descarta la recuperación por correo: una contraseña débil u olvidada no tiene camino de vuelta. | Abierto |
| RA-03 | Riesgo declarado | `FA-01` confirma que un `username` ajeno existe —el mockup dice «Ese usuario ya está en uso»— [E1], mientras que DIS-00 §3 exige para P-03 un error de acceso **genérico**, «sin revelar campo» [E1]. Las dos pantallas tratan el mismo dato con criterios opuestos, lo que habilita enumerar cuentas desde el registro [I2]. | Queda anotado sin resolver: la unicidad tiene que comunicarse de algún modo para que el alta sea usable. Conviene decidirlo junto con la política de `RA-02`. No afecta al canon —no expone contenido conversacional ni datos de bienestar—, pero roza el principio rector de PRIV-01 §1: exponer el mínimo dato necesario. | Abierto |

## 14. Verificación

| # | Criterio (rúbrica de la skill) | Resultado |
|---|---|---|
| 1 | Objetivo único y observable | ✅ Crear la cuenta con identidad mínima. No autentica (CU-03) ni consiente (CU-05) |
| 2 | Nombre en infinitivo + objeto del dominio | ✅ «Registrar cuenta» |
| 3 | Actor primario externo | ✅ `Visitante`, clase y actor de MD-01 v1.4 y DCU-01 §1 |
| 4 | Vocabulario del modelo de dominio | ✅ `Visitante`, `TitularDeCuenta`, `Usuario` y los cuatro atributos de identidad, tal como los declara MD-01 v1.4 §6 |
| 5 | Precondiciones verificables, una por fila | ✅ `PRE-01`…`PRE-03`, cada una con su identificador abriendo la fila y su comprobación |
| 6 | Flujo básico completo | ✅ Tres pasos, del disparador a la postcondición, en voz activa |
| 7 | Todos los flujos declaran desenlace | ✅ El básico **finaliza**; `FA-01` y `FE-01` **retornan** al paso 2 |
| 8 | 100 % de los flujos con criterio de aceptación | ✅ Flujo básico → `CA-01`/`CA-02`/`CA-03`; `FA-01` → `CA-05`; `FE-01` → `CA-06` |
| 9 | Reglas fuera del flujo, por ID | ✅ Nueve reglas en §8; los pasos solo las referencian |
| 10 | Postcondiciones verificables | ✅ Incluidas tres invariantes que la v1.0 no tenía: sin consentimiento, sin cápsula y sin declaración de edad |
| 11 | Sin detalle de implementación | ✅ Sin controladores ni esquemas; la ruta `/registro/` aparece como punto de interacción visible, no como paso |
| 12 | Interfaces nombradas | ⚠️ **Parcial.** P-02 «Registro» está nombrada y trazada, pero su **estado de éxito no existe** en DIS-00 (`RA-01`). Se declara el vacío en vez de inventar el estado, que es justo el defecto que corrige esta versión |
| 13 | Excepciones con causa y estado final | ⚠️ **Parcial.** `FE-01` no puede enumerar sus causas porque ningún artefacto fija el formato mínimo de los tres datos (`RA-02`) |
| 14 | Trazabilidad alias ↔ identificador | ✅ `CU_Reg` ↔ CU-02 en §12, leída del `.puml` v2.1 |
| 15 | Coherencia con el canon | ✅ Minimización (`RN-04.1`), sin sobre-claim clínico, sin persistencia de chat; el consentimiento **no** se da por otorgado al registrarse |
| 16 | Referencias abiertas y leídas | ✅ MD-01, DCU-01 (`.puml` y `.md`), MV-01 §7.1/§7.2/§7.5 y §11, REQ-01, PRIV-01, PER-01, DIS-00 y el mockup de P-02. ⚠️ **No** se abrió el plan del macroproyecto, que no está en este repositorio: ninguna afirmación se apoya en él |

**Compuerta ejecutada:** `validate_use_case_spec.py` → **0 errores / 0 advertencias**. Cobertura de flujos comprobada aparte: **3 de 3**.

## 15. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v2.2 | 2026-08-05 | J. Sánchez | `SD-44` (`TVI-06`): la fila de `SD-42` publicaba «23 descendentes / 3 / 5» **como hecho**, y la cifra real es **21 / 3 / 7**. Se tacha y se rectifica, no se borra (`SD-31`). **Ninguna afirmación vigente de este artefacto cambia.** |
| v2.1 | 2026-08-05 | **SD-42 — reparación del registro, no del contenido.** El historial iba desordenado y se reordena a **descendente**, que es la convención del repositorio: se estableció **midiendo** —~~23 artefactos descendentes contra 3 ascendentes y 5 sin orden~~ **21 descendentes, 3 ascendentes y 7 mixtos** *(la cifra de `SD-42` estaba mal medida: se contó después de reparar ya `PER-01` y `CP-00`. Corregida en `SD-43`; este historial se rectifica en `SD-44`, `TVI-06`)*— y el `CHANGELOG` ya la había declarado en su `v0.21.1`. **Ninguna afirmación de este artefacto cambia.** El desorden alcanzaba a **ocho** archivos y no lo vigilaba nada; desde esta versión lo comprueba el **bloque 6** de `verificar_coherencia.py`. |
| v2.0 | 2026-07-31 | Rehecho en el PDR-01, fase D.3, tanda 2, **sin cambiar el alcance funcional ni la forma ágil**. (a) Las precondiciones pasan de una celda corrida a **una fila por precondición** con el identificador abriendo la fila, y `PRE-02` se añade porque el carácter público del alta estaba supuesto. (b) `FA-01` y `FE-01` declaran **desenlace** explícito. (c) Los criterios pasan de tres a seis y cubren **el 100 %** de los flujos, más las invariantes de la cuenta recién nacida y la asignación del `rol` en el servidor. (d) **Hallazgo D-04:** el paso 3 nombra ahora **P-02 «Registro»** y el estado de éxito ausente se declara en `RA-01` en vez de darse por hecho. (e) CU-03 se cita por su nombre vigente, «Iniciar y cerrar sesión», y CU-05 por el suyo, «Otorgar consentimiento y crear la cápsula de perfil». (f) Se añade la correspondencia `CU_Reg` ↔ CU-02 en la trazabilidad. (g) Se añaden el núcleo de dos párrafos, el control terminológico, las postcondiciones detalladas y los riesgos `RA-02`/`RA-03`. |
| v1.0 | 2026-07-16 | Creación (forma ágil, §23). |

**Fin de ECU-02.**
