# ECU-03 — Especificación de caso de uso: «Iniciar y cerrar sesión» (CU-03)
**ID documento:** DOC-CU-03 · **Caso de uso:** CU-03 · **Alias en DCU-01:** `CU_Login` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.1 (SD-42: historial reordenado a descendente; ninguna afirmación cambia). v2.0 · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — es el *gate* de acceso del sistema, no un caso de uso con reglas de dominio propias.
**Insumos:** DCU-01 v2.1 (nombre, actor y asociación), MD-01 v1.4 (`TitularDeCuenta`, `Usuario`, `Administrador`), MV-01 §7.1/§7.4/§7.5 y §11, REQ-01 (RF-14, RF-21, RNF-08, RNF-09), PRIV-01 (PRIV-R12), DIS-00 §2 (P-03, P-04 y los destinos P-05, P-10, P-14), DR-00 §3 (hallazgo D-03), TRZ-01, plan §3.1/§3.2. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-03 |
| Nombre | **Iniciar y cerrar sesión** |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| **Actor primario** | **Titular de cuenta** (rol general; se especializa en `Usuario` adulto y en `Administrador de plataforma`) |
| Prioridad | Alta |
| Frecuencia de uso | Alta |
| Criticidad | **Alta** (es el *gate* de acceso: de él dependen el rol efectivo y el alcance de todo lo demás) |
| Estado | Propuesto |

> **Por qué el actor primario es el rol general y no los dos concretos.** DCU-01 v2.1 asocia este caso de uso con `Titular de cuenta` porque `Usuario adulto` y `Administrador de plataforma` comparten exactamente una meta: «obtener y terminar una sesión autenticada» (DCU-01 §1). La *ruta* difiere —RF-14 exige acceso separado para el administrador— pero el objetivo es el mismo, y el caso de uso modela objetivos, no rutas. El rol general se corresponde con el supertipo `TitularDeCuenta` de MD-01 v1.4 (`TitularDeCuenta <|-- Usuario`, `TitularDeCuenta <|-- Administrador`). La v1.0 declaraba «Usuario adulto (variante: Administrador)», anterior a esa generalización.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `TitularDeCuenta` | Clase de MD-01 v1.4; supertipo de `Usuario` y de `Administrador` | prohibido: «cliente», «miembro» | Es el actor de este caso de uso; las dos especializaciones aparecen en el flujo básico y en `FA-02` |
| Sesión | Estado de acceso autenticado, con el rol determinado en el servidor | prohibido: tratarla como clase del dominio | **No es clase de MD-01 v1.4**: el modelo de dominio no declara ninguna entidad de sesión. Es un concepto de acceso gobernado por RNF-08 |
| Credenciales | El username y la contraseña con que se creó la cuenta en CU-02 (`RN-04.1`) | prohibido: «correo», «email», «usuario y clave» | El MVP no pide correo, así que tampoco hay recuperación por correo (`RN-04.6`) |
| Rol | «usuario» o «administrador», determinado y comprobado en el servidor | prohibido: «permiso», «perfil de acceso» | Nunca lo propone el cliente (`RN-03.7`, RNF-08) |
| Acompañante | **Alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3) | — | Aparece aquí solo al nombrar CU-06 y la pantalla P-10; el término trazable al dominio es `Personaje` |

## 2. Núcleo del caso de uso

**Curso básico.** El `Titular de cuenta` —aquí en su especialización `Usuario` adulto— abre **Iniciar sesión (usuario)** (P-03) y envía su username y su contraseña. El Sistema las contrasta con la cuenta que CU-02 creó, **determina el rol en el servidor** y establece la sesión con ese rol, sin que el cliente participe en esa decisión. Enseguida el Sistema comprueba si el `Usuario` **ya completó el onboarding** —esto es, si existen un `Consentimiento` con la **capa base** otorgada y una `CapsulaDePerfil` con `character`— y, al estar completo, lo dirige a **Chat con el acompañante** (P-10), donde el flujo **continúa** en CU-06. Cuando el `Titular de cuenta` termina, elige cerrar la sesión: el Sistema la invalida en el servidor, deja de reconocer las peticiones posteriores y lo devuelve a **Iniciar sesión (usuario)** (P-03). El flujo **finaliza** con el acceso cerrado.

**Cursos alternativos y de excepción.** Si el `Usuario` todavía no completó el onboarding, el Sistema lo dirige a **Onboarding · disclosure de IA** (P-05) en vez de a la conversación, y el flujo **continúa** en CU-05 (`FA-01`). Si quien entra es el `Administrador`, lo hace por **Iniciar sesión (admin, separado)** (P-04): con el rol de administrador confirmado en el servidor alcanza **Directorio de usuarios** (P-14) y el flujo **continúa** en el paso 5 para cerrar su sesión (`FA-02`). Si el username o la contraseña no coinciden con ninguna cuenta registrada, el Sistema responde con un texto genérico que no delata cuál de los dos falló, no establece sesión alguna y el flujo **vuelve** al paso 2 (`FE-01`). Si un `Usuario` con rol «usuario» pide una ruta administrativa, el Sistema responde `403` sin conceder privilegio alguno y el flujo **termina** (`FE-02`). Si la sesión expiró o nunca existió, el Sistema responde `401`, no cierra nada y el flujo **termina** pidiendo reingresar (`FE-03`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador (inicio)** | El `Titular de cuenta` abre **Iniciar sesión (usuario)** (P-03) —o **Iniciar sesión (admin, separado)** (P-04)— y envía sus credenciales. |
| **Disparador (cierre)** | El `Titular de cuenta`, con sesión activa, elige cerrar la sesión desde la interfaz autenticada en la que está. |
| Generado por | Actor (`Titular de cuenta`), en ambos casos. |
| Condición inicial observable | El Sistema recibe las credenciales y comienza a contrastarlas, o recibe la solicitud de cierre y comienza a invalidar la sesión. |

## 4. Precondiciones

Este caso de uso abre y cierra el acceso, así que sus precondiciones cubren los dos extremos: `PRE-01` y `PRE-02` gobiernan el inicio; `PRE-03` gobierna el cierre y cualquier función protegida. No hereda precondiciones de ningún otro caso de uso: es el primero que el `Titular de cuenta` ejecuta tras registrarse.

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El `Titular de cuenta` posee una cuenta creada en CU-02, con username y contraseña. | Datos | Sí (si no → `FE-01`) |
| PRE-02 | El `Titular de cuenta` no tiene una sesión activa en el punto de acceso desde el que entra. | Funcional | Sí |
| PRE-03 | Para el paso 5 y para toda función protegida, el `Titular de cuenta` tiene una sesión activa. | Autorización | Sí (si no → `FE-03`) |

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Titular de cuenta | Abre **Iniciar sesión (usuario)** (P-03) | `TitularDeCuenta` | Solicita username y contraseña, sin ofrecer selección de rol | Iniciar sesión (usuario) (P-03) |
| 2 | Titular de cuenta | Escribe sus credenciales y las envía | `Usuario` | Las contrasta con la cuenta registrada y determina el rol en el servidor | Iniciar sesión (usuario) (P-03) |
| 3 | Sistema | Establece la sesión con el rol que acaba de determinar | `Usuario` | La sesión queda activa con rol «usuario»; el cliente no interviene en esa decisión (`RN-03.7`) | — |
| 4 | Sistema | Comprueba si el `Usuario` completó el onboarding —existen un `Consentimiento` con la **capa base** otorgada y una `CapsulaDePerfil` con `character`— y, al estar completo, lo dirige a **Chat con el acompañante** (P-10) | `Consentimiento`, `CapsulaDePerfil` | El `Usuario` entra a conversar; el flujo **continúa** en CU-06 | Chat con el acompañante (P-10) |
| 5 | Titular de cuenta | Elige cerrar la sesión desde la interfaz autenticada | `TitularDeCuenta` | Invalida la sesión en el servidor, deja de reconocer las peticiones posteriores y lo devuelve a **Iniciar sesión (usuario)** (P-03); el flujo **finaliza** | Chat con el acompañante (P-10) → Iniciar sesión (usuario) (P-03) |

> **El criterio de la bifurcación del paso 4, dicho explícitamente.** «Completar el onboarding» es la postcondición de éxito de CU-05 —un `Consentimiento` con la capa base otorgada y una `CapsulaDePerfil` que siempre existe con `character` como contenido mínimo— y es justamente lo que niega la precondición de CU-05 que exige no haberlo completado. Es un estado observable: MV-01 §7.4 lo lista como columna «onboarding completado» del directorio administrativo. La v1.0 escribía «redirige al Usuario al **área correspondiente** (onboarding o conversación)» sin decir según qué; DR-03 dibujó las dos ramas con ese texto literal y **no inventó** el criterio, dejándolo reportado como hallazgo **D-03** (DR-00 §3). Aquí queda cerrado.

> **El paso 5 no es adorno del título.** RF-21 nombra el cierre de sesión junto con el inicio, y la meta que DCU-01 §1 atribuye al rol general es «obtener **y terminar** una sesión autenticada». Por eso el cierre vive en el curso normal, con postcondición propia (§7) y criterio propio (`CA-03`), y no como una nota al pie. La v1.0 lo degradaba a flujo alternativo sin desenlace, sin postcondición y sin criterio.

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Onboarding pendiente | Paso 4 | El `Usuario` aún no completó el onboarding: falta el `Consentimiento` con la capa base otorgada, la `CapsulaDePerfil` con `character`, o ambos | Lo dirige a **Onboarding · disclosure de IA** (P-05) en vez de a P-10; sin la capa base no habría conversación que abrir | **Continúa** en CU-05; al terminar el onboarding el `Usuario` puede conversar y, después, volver al paso 5 | `RN-02` |
| FA-02 | Acceso separado de administración | Paso 1 | El `Titular de cuenta` entra por **Iniciar sesión (admin, separado)** (P-04) | Con el rol de administrador confirmado en el servidor, establece la sesión y lo dirige a **Directorio de usuarios** (P-14), que es la ruta administrativa que DIS-00 §2 inventaría; sin esa confirmación no concede privilegio alguno (`FE-02`) | **Continúa** en el paso 5, donde el `Administrador` cierra su sesión y vuelve a P-04 | `RN-03.7` |
| FE-01 | Credenciales inválidas | Paso 2 y `FA-02` | El username o la contraseña no coinciden con ninguna cuenta registrada | Responde con un texto genérico de credenciales incorrectas —idéntico en ambos casos, sin delatar cuál falló— y no establece sesión; tampoco ofrece recuperación por correo, que el MVP no tiene (`RN-04.6`) | **Vuelve** al paso 2 | `RN-04.6`, `RE-02` |
| FE-02 | Rol insuficiente en ruta administrativa | Paso 4 y `FA-02` | Un `Titular de cuenta` con rol «usuario» pide una ruta administrativa, aunque manipule el cliente | Responde `403` o aplica una redirección segura; no concede privilegios ni altera el rol de la sesión | **Termina** sin acceso administrativo; la sesión de usuario sigue activa | `RN-03.7`, `RE-01` |
| FE-03 | Sesión ausente | Paso 5 y toda función protegida | La sesión expiró o nunca existió | Responde `401`, no cierra nada y pide reingresar | **Termina**; reingresar por el paso 1 | `PRE-03` |

> Regla de excepción transversal: el Sistema no devuelve errores crudos, rastros de pila, claves ni metadatos internos (plan §4.13).

## 7. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito (inicio) | Existe una sesión activa del `Titular de cuenta` con el rol que el servidor determinó, y el actor está en el área que le corresponde: P-10, P-05 o P-14 | Traza de la sesión y observación del destino |
| **Éxito (cierre)** | **La sesión ya no existe.** Una petición posterior a una función protegida responde `401`, y volver atrás en el navegador no restituye el acceso | Prueba de cierre y reintento |
| **Invariante** | **El rol no cambia por acción del cliente.** Ni la interfaz lo ofrece ni la petición lo propone: lo determina el servidor en el paso 2 | Prueba de manipulación del cliente |
| Fallo | No existe sesión alguna y el `Titular de cuenta` permanece en P-03 o en P-04 | Inspección |
| Datos creados | Ninguno del dominio: la sesión no es clase de MD-01 v1.4 | Inspección |
| Datos modificados | Ninguno. Este caso de uso no escribe en `Usuario`, `Consentimiento` ni `CapsulaDePerfil`; solo los **consulta** en el paso 4 | Inspección del almacenamiento: sin escritura |
| Cambios de estado | La sesión pasa de ausente a activa (paso 3) y de activa a terminada (paso 5) | Traza |
| Efectos visibles | El `Titular de cuenta` alcanza la conversación, el onboarding o el directorio administrativo; tras el cierre, solo alcanza P-03 o P-04 | Observación |

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-03.7 | El acceso administrativo es por **login separado** y el Sistema determina el rol en el **servidor**, no alterable desde el cliente. | Restricción | Paso 3, `FA-02`, `FE-02` | MV-01 §7.4 |
| RN-04.1 | El registro pide solo **username, alias y contraseña**; ni nombre legal, ni documento, ni correo, ni teléfono, ni dirección, ni fecha de nacimiento. | Restricción | `PRE-01`, paso 2 | MV-01 §7.5 |
| RN-04.6 | No hay recuperación de contraseña por correo ni verificación de correo. | Restricción | `FE-01` | MV-01 §7.5 |
| RN-02 | No hay conversación sin la **capa base** del `Consentimiento` otorgada. | Restricción | Paso 4, `FA-01` | MV-01 §7.1 («no se inicia conversación sin consentimiento otorgado»), precisada por capas en el PDR-01, fase D.3 (ECU-12 §4.1) |

> La familia de la vista Cuenta y acceso de MV-01 (RN-04.1…RN-04.6) **no dedica ninguna regla al cierre de sesión**: cubre registro, edad, reinicio, revocación, eliminación, alcance del Visitante y ausencia de recuperación por correo. El cierre se apoya en RF-21 y en la meta del rol general de DCU-01 §1, y su verificabilidad la aporta `RE-04`. Queda anotado en `RA-03` en vez de inventarse una regla.

## 9. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Seguridad | El Sistema determina y comprueba el rol en el servidor, y las rutas administrativas rechazan el rol insuficiente (RNF-08, `RN-03.7`). | Manipular el cliente no altera el rol efectivo de la sesión; una petición a ruta administrativa sin rol de administrador responde `403` o redirección segura |
| RE-02 | Seguridad | El texto de error de autenticación es genérico: no revela si falló el username o la contraseña (DIS-00 §3, P-03). | El texto es idéntico para username inexistente y para contraseña incorrecta |
| RE-03 | Seguridad / privacidad | El Sistema almacena la contraseña **hasheada** y nunca la expone en claro, ni al cliente ni al `Administrador`; las claves y los tokens de sesión no llegan al navegador ni al repositorio (**PRIV-R12**, RNF-09). | Inspección del almacenamiento y del cliente: cero contraseñas en claro, cero secretos |
| RE-04 | Seguridad | El cierre de sesión invalida la sesión **en el servidor**, no solo en el cliente. | Tras cerrar, una petición que reutilice la credencial de sesión anterior responde `401` |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **Iniciar sesión (usuario)** (P-03, ruta `/login/`) | Entrar con username y contraseña; error genérico | Entrar | 1, 2 y destino del cierre en 5 |
| Pantalla | **Iniciar sesión (admin, separado)** (P-04, ruta `/plataforma-admin/login/`) | Acceso separado de administración; `403` seguro si el rol no corresponde | Entrar | `FA-02` |
| Pantalla (destino) | **Onboarding · disclosure de IA** (P-05) | Primera pantalla del onboarding, para quien aún no lo completó | — | `FA-01` |
| Pantalla (destino) | **Chat con el acompañante** (P-10) | Destino de quien ya completó el onboarding; desde aquí el `Usuario` cierra la sesión | Cerrar sesión | 4, 5 |
| Pantalla (destino) | **Directorio de usuarios** (P-14, ruta `/plataforma-admin/`) | Destino administrativo; desde aquí el `Administrador` cierra la sesión | Cerrar sesión | `FA-02`, 5 |

> **Hueco declarado, corregido respecto de la v1.0.** DIS-00 §2 **no inventaría ninguna pantalla, estado ni control para el cierre de sesión**, y la ruta `POST /logout/` que la v1.0 citaba como *endpoint* **no aparece en DIS-00 ni en REQ-01**: la escribió esa versión y ningún insumo la respalda, así que se retira. Las dos rutas que sí constan en DIS-00 §2 son `/login/` (P-03) y `/plataforma-admin/login/` (P-04). El anclaje del cierre en P-10 y P-14, con retorno a P-03, procede de DR-03, que ya lo dibujó así. Queda anotado en `RA-01`.

## 11. Criterios de aceptación

Los tres flujos del curso básico —autenticar, rutear y cerrar— y los cinco cursos alternativos y de excepción tienen criterio propio: **8 criterios para 6 flujos**, sin ninguno huérfano. La v1.0 tenía tres criterios para cinco flujos.

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un `Titular de cuenta` con credenciales válidas, cuando las envía en P-03, entonces obtiene una sesión activa cuyo rol determinó el servidor. | Flujo básico (pasos 1–3) | Traza de la sesión |
| CA-02 | Dado un `Usuario` que ya completó el onboarding —capa base otorgada y `CapsulaDePerfil` con `character`—, cuando inicia sesión, entonces el Sistema lo dirige a **Chat con el acompañante** (P-10) y no al onboarding. | Flujo básico (paso 4) | Prueba con la capa base y la cápsula presentes |
| CA-03 | Dado un `Titular de cuenta` con sesión activa, cuando elige cerrar la sesión, entonces una petición posterior a una función protegida responde `401` y volver atrás en el navegador no restituye el acceso. | Flujo básico (paso 5) | Prueba de cierre y reintento |
| CA-04 | Dado un `Usuario` que aún no completó el onboarding, cuando inicia sesión, entonces el Sistema lo dirige a **Onboarding · disclosure de IA** (P-05) y no a la conversación. | `FA-01` | Prueba con la cápsula ausente |
| CA-05 | Dado un `Administrador` que entra por P-04, cuando el servidor confirma su rol, entonces alcanza **Directorio de usuarios** (P-14) y puede cerrar su sesión desde allí. | `FA-02` | Prueba de acceso administrativo |
| CA-06 | Dado un username inexistente y, por separado, una contraseña incorrecta, cuando cualquiera de los dos llega al Sistema, entonces el texto de error es idéntico en ambos casos y no queda sesión establecida. | `FE-01` | Prueba comparada de los dos fallos |
| CA-07 | Dado un `Titular de cuenta` con rol «usuario» que manipula el cliente, cuando pide una ruta administrativa, entonces recibe `403` o una redirección segura y su rol no cambia. | `FE-02` | Prueba de manipulación del cliente |
| CA-08 | Dada una sesión expirada, cuando el `Titular de cuenta` opera una función protegida, entonces recibe `401` y el Sistema le pide reingresar. | `FE-03` | Prueba de expiración |

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Login` (DCU-01 v2.1) ↔ **CU-03** | Correspondencia explícita. Los diez casos de uso de DCU-01 v1.0 conservan su numeración original, y CU-03 es uno de ellos: el número sigue el orden de declaración del `.puml`. Sin esta fila el número parecería arbitrario |
| Requisito funcional | RF-21 «Iniciar y cerrar sesión (login/logout) del usuario» | Realizado por este CU en sus dos mitades: el inicio en los pasos 1–3, el cierre en el paso 5 |
| Requisito funcional | RF-14 «Autenticar al administrador por login separado; el rol se determina en el servidor» | Realizado por este CU en `FA-02` y `FE-02` |
| Objetivo de negocio | OBJ-7 (RF-21) y OBJ-6 (RF-14) | Gestión de cuenta y acceso; administración de plataforma (TRZ-01) |
| Regla de negocio | `RN-03.7`, `RN-04.1`, `RN-04.6`, `RN-02` | Gobiernan el flujo. TRZ-01 asigna a RF-21 las reglas `RN-03.7` y `RN-04.6`, y a RF-14 la regla `RN-03.7` |
| Requisito no funcional | RNF-08 (rol en servidor), RNF-09 (claves y tokens fuera del cliente y del repositorio) | Desarrollados como `RE-01` y `RE-03`, no como reglas de negocio |
| Requisito de privacidad | PRIV-R12 (contraseña hasheada, nunca en claro ni al alcance del `Administrador`) | Ancla de `RE-03` |
| Requisito de calidad | RC-04 (minimización) | Ancla de calidad heredada de TRZ-01 para RF-14 y RF-21 |
| Modelo de dominio | `TitularDeCuenta`, `Usuario`, `Administrador`; `Consentimiento` y `CapsulaDePerfil` **solo consultados** en el paso 4 | Conceptos manipulados. La sesión y el rol **no** son clases de MD-01 v1.4 |
| Diagrama de casos de uso | `Titular -- CU_Login` (asociación directa con el rol general) | Origen de la asociación; la generalización `TitularDeCuenta <|-- Usuario` y `<|-- Administrador` es la que evita duplicarla |
| Caso de uso previo | CU-02 «Registrar cuenta» | Crea la cuenta que `PRE-01` exige |
| Casos de uso habilitados (`Usuario`) | CU-05 «Otorgar consentimiento y crear la cápsula de perfil», CU-06 «Conversar con el acompañante», CU-13 «Cambiar de acompañante», CU-11 «Reiniciar la caracterización», CU-12 «Revocar la personalización», CU-04 «Eliminar cuenta» | Las seis metas que DCU-01 v2.1 §2 asocia a `Usuario adulto`. La v1.0 nombraba CU-04 y CU-05 con títulos ya retirados y **omitía CU-11, CU-12 y CU-13**, que aún no existían |
| Casos de uso habilitados (`Administrador`) | CU-08 «Consultar directorio de usuarios», CU-09 «Consultar métricas de uso», CU-10 «Habilitar o deshabilitar el chatbot» | Las tres funciones administrativas, alcanzables solo por `FA-02` |
| Caso de prueba | CP-03 | Planificado (fase de pruebas) |
| Robustez / secuencia | DR-03 existe y esta reescritura lo invalida en parte; DS-03 planificado | DR-03 se dibujó sobre la v1.0: usa el nombre viejo, el actor viejo, el flujo de 3 pasos y el criterio de bifurcación sin declarar. Rehacerlo es la **fase D.4** del PDR-01 |
| Criterio de aceptación | `CA-01`…`CA-08` | Verificación |

## 13. Checklist de revisión metodológica

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Obtener y terminar una sesión autenticada con el rol determinado en el servidor |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Iniciar y cerrar sesión»: dos verbos sobre **un mismo objeto**, la sesión, tal como RF-21 la enuncia |
| 3 | Actor primario identificado | ✅ | `Titular de cuenta`, el rol general de DCU-01 §1 |
| 4 | Actores externos al sistema | ✅ | Ninguno: el Proveedor LLM no interviene en el acceso |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 5 pasos, del formulario de acceso al cierre de la sesión |
| 6 | Flujos alternativos suficientes | ✅ | `FA-01` (onboarding pendiente) y `FA-02` (acceso separado de administración) |
| 7 | Flujos de excepción relevantes | ✅ | `FE-01` credenciales, `FE-02` rol insuficiente, `FE-03` sesión ausente |
| 8 | Términos del dominio (MD-01 v1.4) usados | ✅ | `TitularDeCuenta`, `Usuario`, `Administrador`, `Consentimiento`, `CapsulaDePerfil` |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §1; «sesión» y «rol» declarados **fuera** del modelo de dominio |
| 10 | Interfaces nombradas donde aplica | ⚠️ | P-03, P-04, P-05, P-10 y P-14 proceden de DIS-00 §2. **El cierre de sesión no tiene elemento de interfaz declarado en ningún insumo**: su anclaje en P-10 y P-14 procede de DR-03. Ver `RA-01` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §8, ninguna incrustada en los pasos |
| 12 | Requisitos especiales separados | ✅ | §9; RNF-08, RNF-09 y PRIV-R12 desarrollados allí, no como reglas |
| 13 | Postcondiciones verificables | ✅ | §7, con la invariante del rol y la postcondición propia del cierre |
| 14 | Sin detalle de implementación | ✅ | Caja negra; las rutas aparecen como referencia de interfaz, no como pasos |
| 15 | Auth como precondición, no CU incluido | ✅ | Este **es** el caso de uso de acceso: no hay `<<include>>` de autenticación en ningún otro, y la protección de rutas administrativas es excepción (`FE-02`) y requisito (`RE-01`), no caso de uso |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §12, con la correspondencia alias ↔ CU-NN |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §11, uno por flujo como mínimo |
| 18 | Base para robustez y secuencia | ⚠️ | Sirve de base, pero **invalida en parte el DR-03 vigente** (nombre, actor, número de pasos y criterio de bifurcación). Se rehace en la fase D.4 |
| 19 | Comprensible por usuarios, analistas y desarrolladores | ✅ | Voz activa, presente, sin jerga |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Nombre, actor y traza (RF-14 y RF-21) coinciden con DCU-01 v2.1 §2; sin sobre-claim clínico y sin capturar dato alguno fuera de `RN-04.1` |

## 14. Riesgos y ambigüedades

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | Hueco heredado | El cierre de sesión no tiene interfaz declarada: DIS-00 §2 no le da pantalla, estado ni control, y la ruta `POST /logout/` que citaba la v1.0 no consta en DIS-00 ni en REQ-01. | Se **retira** la ruta no verificada. La acción se ancla en P-10 y P-14 con retorno a P-03, siguiendo lo que DR-03 ya dibujó; declarar el control en DIS-00 queda para la fase de construcción. | Abierto |
| RA-02 | Ambigüedad resuelta (hallazgo **D-03**) | El paso 3 de la v1.0 bifurcaba «al área correspondiente (onboarding o conversación)» sin declarar según qué. DR-00 §3 lo registró y DR-03 dibujó las dos ramas con el texto literal, sin inventar el criterio. | **Resuelto:** el criterio es haber completado el onboarding, definido como la postcondición de éxito de CU-05 (capa base otorgada + `CapsulaDePerfil` con `character`). Queda en el paso 4, en `FA-01` y en los criterios `CA-02` y `CA-04`. | **Resuelto** |
| RA-03 | Alcance declarado | RF-21 nombra el cierre de sesión, pero ninguna regla de MV-01 lo gobierna: la familia RN-04.1…RN-04.6 no lo menciona. | Se especifica igual, apoyado en RF-21 y en la meta del rol general de DCU-01 §1, con `RE-04` como criterio verificable. Proponer una regla propia para MV-01 corresponde a la fase D.5. | Abierto |
| RA-04 | Decisión pendiente | Qué ocurre si un `Titular de cuenta` con la cuenta ya eliminada (CU-04) intenta entrar: hoy cae en `FE-01` por credenciales que no coinciden con ninguna cuenta, lo que es correcto pero no está declarado como escenario propio en ninguna especificación. | No bloquea: el resultado observable es el mismo texto genérico y la ausencia de sesión. Verificar al rehacer la especificación de CU-04. | Abierto |

## 15. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v2.1 | 2026-08-05 | **SD-42 — reparación del registro, no del contenido.** El historial iba desordenado y se reordena a **descendente**, que es la convención del repositorio: se estableció **midiendo** —23 artefactos descendentes contra 3 ascendentes y 5 sin orden— y el `CHANGELOG` ya la había declarado en su `v0.21.1`. **Ninguna afirmación de este artefacto cambia.** El desorden alcanzaba a **ocho** archivos y no lo vigilaba nada; desde esta versión lo comprueba el **bloque 6** de `verificar_coherencia.py`. |
| v2.0 | 2026-07-31 | **PDR-01, fase D.3, tanda 2.** Renombrado a «**Iniciar y cerrar sesión**» según DCU-01 v2.1 §2, porque RF-21 nombra el cierre y el título anterior lo omitía. El **cierre de sesión** deja de ser un flujo alternativo mudo y pasa al curso normal (paso 5), con postcondición propia, `RE-04` y `CA-03`. Cierra el hallazgo **D-03**: el paso 4 declara el criterio de la bifurcación. El actor primario pasa de «Usuario adulto (variante: Administrador)» a **`Titular de cuenta`**, el rol general de DCU-01 v2.1. Las precondiciones pasan a filas propias; los cinco flujos declaran desenlace; los criterios suben de 3 a 8 y cubren el 100 % de los flujos. Se sustituye la cita cruzada del flujo alternativo de otro caso de uso por su descripción en prosa. Se corrige la lista de casos habilitados (CU-04 y CU-05 con sus títulos vigentes; entran CU-11, CU-12 y CU-13). Se añade la correspondencia alias ↔ CU-NN. Se retira la ruta `POST /logout/`, que ningún insumo respalda (`RA-01`). |
| v1.0 | 2026-07-16 | Creación (fase 2 ICONIX, paso 3). |

**Fin de ECU-03.**
