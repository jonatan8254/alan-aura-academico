# ECU-01 — Especificación de caso de uso: «Consultar presentación del servicio» (CU-01)
**ID documento:** DOC-CU-01 · **Caso de uso:** CU-01 · **Alias en DCU-01:** `CU_Pres` · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.0 · **Estado:** Propuesto.
**Forma:** **ágil** (núcleo de dos párrafos + campos mínimos, §23 de la plantilla de la skill `use-case-specifier`) — caso de uso simple, un solo escenario soleado, sin efectos sobre datos persistidos.
**Insumos:** DCU-01 v2.1, **MD-01 v1.4**, MV-01 §Vista Cuenta y acceso, REQ-01 v1.4 (RF-19), VIS-01 (OBJ-7), TRZ-01 v1.5, PRIV-01 v1.4, DIS-00 (P-01) y su maqueta [`p01_presentacion_landing.html`](../../08_diseno/mockups/p01_presentacion_landing.html). **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).
**Origen:** rehecho sobre **ECU-01 v1.0** (PDR-01, fase D.3, tanda 4). La v1.0 escondía su precondición dentro de una celda de resumen, dejaba su flujo de excepción sin desenlace, cubría con criterio de aceptación solo dos de sus cuatro flujos y trataba a `Visitante` como actor sin clase de dominio, clasificación que **MD-01 revirtió** (la clase entró en v1.3; la etiqueta de su relación se corrigió en v1.4).

---

## 1. Identificación y control

| Campo | Valor |
|---|---|
| ID | CU-01 |
| Nombre | Consultar presentación del servicio |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| **Actor primario** | **Visitante** (persona **no autenticada**) |
| Prioridad | Media (es la puerta de entrada, no el valor central del servicio) |
| Frecuencia de uso | Alta |
| Criticidad | Media (no toca datos personales, pero es donde el alcance **no clínico** se declara por primera vez) |
| Estado | Propuesto |

> **Nota de prioridad.** DIS-00 §2 clasifica **P-01** con prioridad de **diseño** «Alta»: es la primera impresión del producto. La prioridad funcional de este caso de uso es Media; las dos escalas miden cosas distintas y no se contradicen.

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| `Visitante` | Clase de MD-01 v1.4 **y** actor de DCU-01 v2.1: persona no autenticada que consulta la presentación antes de registrarse | prohibido: «invitado», «usuario anónimo», «usuario» a secas | Su única relación de dominio es `Visitante -- TitularDeCuenta : precede a` (§1.1) |
| `TitularDeCuenta` | Supertipo de MD-01 v1.4: quien posee una cuenta; se especializa en `Usuario` y `Administrador` | prohibido: «cuenta» como si fuera la persona | Este caso de uso **no** convierte a nadie en titular: eso ocurre al registrarse (CU-02) |
| `Personaje` | Clase de MD-01 v1.4; se especializa en `Alan` y `Aura` | prohibido: «bot», «asistente», «avatar» | **«Acompañante» es un alias de producto en uso activo** de `Personaje`, declarado en la tabla de alias de MV-01 §11 (fila añadida por el PDR-01, fase D.3). La presentación nombra a `Alan` y `Aura`, pero **no** los pone a conversar: conversar exige cuenta |
| Presentación / landing | Objeto de frontera: la página pública del servicio (P-01) | prohibido: «home», «portada», «página web» | Es interfaz, **no** clase de dominio (MD-01 §3, decisión 9) |

### 1.1 `Visitante`: actor **y** concepto del dominio

`Visitante` dejó de ser un simple rol de caso de uso. **MD-01 v1.4 lo lista como la primera de sus 16 clases**, con la clasificación «actor/rol **+ clase de dominio**» y origen «retroalimentación docente, punto 2» (MD-01 §2). Su única relación es `Visitante -- TitularDeCuenta : precede a` (MD-01 §4; la etiqueta se reescribió en v1.4, donde antes decía `se convierte en`, que describía la transición en vez del orden), y enuncia el **orden de los dos roles** —quien consulta sin cuenta puede pasar a tenerla— y no un paso de proceso: el acto de registrarse sigue siendo un caso de uso, CU-02, y no una relación del dominio.

Qué implica aquí, en concreto:

| Consecuencia en esta especificación | Dónde se ve |
|---|---|
| `Visitante` es un concepto del dominio manipulado por el flujo, no solo la etiqueta del actor | Columna «Concepto de dominio» de §5 |
| La transición `Visitante → TitularDeCuenta` **no ocurre** en este caso de uso | Postcondición «cambios de estado» (§7) y `FA-01` |
| El caso de uso queda con conceptos de dominio propios, en vez de «ninguno» como declaraba la v1.0 | §5 y §12 |

> **Tensión declarada, no disimulada.** MV-01 §3 todavía clasifica a `Visitante` como «actor/rol (**sin** clase de dominio)», y MV-01 §14 lo repite en su handoff. MD-01 §3, decisión 2, registra el cambio como **reversión declarada**, pendiente de anotarse en `SD-28` (fase D.5). Esta especificación sigue a **MD-01 v1.4**, que es el insumo de vocabulario de la fase 2 y el artefacto que responde a la retroalimentación docente. La contradicción queda anotada en `RA-01`.

## 2. Núcleo del caso de uso

**Curso básico.** El Visitante —persona sin cuenta ni sesión— solicita la **Presentación / landing**. El Sistema le presenta qué **es** el servicio (acompañamiento emocional no clínico para personas adultas), qué **no** es (no diagnostica ni da tratamiento, no atiende urgencias en autonomía y no reemplaza a un profesional), advierte que el interlocutor es una inteligencia artificial, nombra a los dos `Personaje` disponibles —`Alan`, de activación, y `Aura`, de calma— y mantiene visibles los dos accesos: registro e inicio de sesión. El Visitante lee ese alcance y elige un acceso; el Sistema lo dirige al acceso elegido y **finaliza** sin haber capturado dato alguno del Visitante y sin haber creado sesión.

**Cursos alternativos y de excepción.** Si el Visitante decide crear cuenta, el Sistema lo dirige al acceso de registro y el flujo **termina** aquí para continuar en CU-02 (`FA-01`); si ya tiene cuenta, el Sistema lo dirige al acceso de inicio de sesión y el flujo **termina** para continuar en CU-03 (`FA-02`); si se marcha sin elegir acceso, el flujo **finaliza** igualmente sin cuenta, sin sesión y sin captura alguna (`FA-03`). Si el servicio está caído o en mantenimiento, el Sistema presenta el estado «servicio no disponible» de la propia **Presentación / landing** y el flujo **termina**, con reintento posterior y sin sesión creada (`FE-01`). Si el Visitante intenta alcanzar el acompañamiento sin cuenta, el Sistema no abre la `Conversacion` ni concede acceso a dato alguno de cuenta, y el flujo **vuelve** a la **Presentación / landing** con el acceso de registro a la vista (`FE-02`).

## 3. Disparador

| Campo | Valor |
|---|---|
| **Disparador** | El Visitante solicita la **Presentación / landing** pública en la ruta `/`. |
| Generado por | Actor (Visitante), sin autenticarse. |
| Condición inicial observable | El Sistema presenta el alcance no clínico, los límites y los dos accesos. |

## 4. Precondiciones

Son dos, y ninguna exige sesión: esa ausencia **es** el requisito de este caso de uso. La v1.0 las escondía dentro de una celda de la tabla de resumen, donde ningún identificador podía trazarse.

| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El servicio está desplegado y disponible. | Funcional | Sí (si no → `FE-01`) |
| PRE-02 | La **Presentación / landing** es pública de solo lectura: el Visitante llega sin cuenta, sin sesión y sin credencial alguna. | Autorización | Sí: abre en la ruta `/` sin autenticarse (criterio de aceptación de RF-19 en REQ-01) |

## 5. Flujo básico

| Paso | Responsable | Acción | Concepto de dominio | Respuesta del sistema | Interfaz |
|---|---|---|---|---|---|
| 1 | Visitante | Solicita la **Presentación / landing** sin cuenta ni sesión | `Visitante` | Presenta qué es el servicio (acompañamiento no clínico para personas adultas) y qué no es (no diagnostica ni da tratamiento, no atiende urgencias en autonomía, no reemplaza a un profesional) | Presentación / landing |
| 2 | Visitante | Lee el alcance, los límites y la advertencia de que el interlocutor es una inteligencia artificial | `Personaje`, `Alan`, `Aura` | Nombra a `Alan` (activación) y a `Aura` (calma), y mantiene visibles los dos accesos: registro e inicio de sesión | Presentación / landing |
| 3 | Visitante | Elige el acceso de registro o el de inicio de sesión | `Visitante`, `TitularDeCuenta` | Dirige al Visitante al acceso elegido; **finaliza** sin capturar dato alguno y sin crear sesión | Presentación / landing |

## 6. Flujos alternativos y de excepción

| ID | Nombre | Punto | Condición | Respuesta del sistema | Desenlace | Reglas y requisitos |
|---|---|---|---|---|---|---|
| FA-01 | Continuar al registro | Paso 3 | El Visitante decide crear cuenta | Dirige al Visitante al acceso de registro | **Termina** aquí; continúa en CU-02, que es donde `Visitante` pasa a `TitularDeCuenta` | RN-04.5 |
| FA-02 | Continuar al inicio de sesión | Paso 3 | El Visitante ya tiene cuenta | Dirige al Visitante al acceso de inicio de sesión | **Termina** aquí; continúa en CU-03 | RN-04.5 |
| FA-03 | Salir sin elegir acceso | Pasos 2–3 | El Visitante se marcha tras leer el alcance y los límites | No retiene nada del Visitante | **Finaliza** sin cuenta, sin sesión y sin captura alguna | RN-04.5, RE-04 |
| FE-01 | Presentación no disponible | Paso 1 | El servicio está caído o en mantenimiento | Presenta el estado «servicio no disponible» de la **Presentación / landing**, sin exponer detalle técnico | **Termina**; el Visitante reintenta más tarde, sin sesión creada | RN-04.5 |
| FE-02 | Intento de alcanzar el acompañamiento sin cuenta | Cualquiera | El Visitante solicita la conversación directamente, sin cuenta ni sesión | No abre la `Conversacion` ni concede acceso a dato alguno de cuenta; ofrece el acceso de registro | **Vuelve** a la **Presentación / landing** | RN-04.5, RE-02 |

> `FE-01` no estrena pantalla: «servicio no disponible» es uno de los dos estados clave que DIS-00 §2 declara para **P-01**. El otro es «default», el del curso básico.

## 7. Postcondiciones

| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El Visitante conoce el alcance no clínico, los límites y los dos accesos, y decide con esa base si crea una cuenta | Observación de la **Presentación / landing** |
| **Invariante** | **El Sistema no captura dato alguno del Visitante ni crea sesión.** Consultar la presentación no deja rastro personal | Inspección: tras la visita no existe cuenta, sesión ni registro asociado al Visitante |
| Fallo | El Visitante no llega a ver la presentación; tampoco entonces hay captura ni sesión | Inspección |
| Datos creados | Ninguno | Inspección |
| Datos modificados | Ninguno | Inspección |
| Cambios de estado | Ninguno. El `Visitante` **no** pasa a `TitularDeCuenta` en este caso de uso: la relación `precede a` enuncia el orden de los roles, y el paso efectivo lo realiza CU-02 | Inspección |
| Efectos visibles | El Visitante sabe qué es y qué no es el servicio, y que hablará con una inteligencia artificial, antes de entregar nada | Observación |

## 8. Reglas de negocio

| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-04.5 | El Visitante solo consulta la presentación (alcance, límites, accesos); no accede a chat ni datos. | Restricción | Pasos 1–3, FA-01, FA-02, FA-03, FE-01, FE-02 | MV-01 §7.5 |
| RN-09 | Todo usuario ve el *disclosure* de IA antes de la primera conversación. | Restricción | Paso 2 | MV-01 §7.1 |
| RN-01 | Solo usuarios que declaran ser adultos (≥18) pueden usar el MVP. | Restricción | Paso 1 | MV-01 §7.1 |

> **Dónde vive cada una, con precisión.** El *disclosure* que `RN-09` exige es el del onboarding (pantalla P-05, caso de uso CU-05), que precede a la primera conversación y a cualquier captura (`PRIV-R8`). Lo que la presentación aporta es su **anticipo**: la nota «hablas con una inteligencia artificial de acompañamiento» ya está en P-01, antes incluso del registro. Con `RN-01` ocurre lo mismo: la presentación **declara** que el servicio es solo para personas adultas; la declaración de edad la recoge el onboarding. Este caso de uso no verifica edad ni recoge aceptación alguna.

## 9. Requisitos especiales

| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Usabilidad | Textos en español (Colombia), en lenguaje llano para público adulto (RNF-01). | Un lector adulto distingue qué es y qué no es el servicio sin asistencia |
| RE-02 | Seguridad | Acceso público de **solo lectura**: la presentación no expone la `Conversacion` ni dato alguno de cuenta, y el acceso a lo protegido lo decide el servidor, nunca el cliente (RN-04.5, RNF-08). | Una solicitud sin sesión al acompañamiento no obtiene contenido conversacional |
| RE-03 | Seguridad (*safety*) — no sobre-claim | La presentación no promete diagnóstico, tratamiento, terapia ni atención de urgencias en autonomía. La única promesa ante riesgo es la **derivación a ayuda humana**, que realiza CU-07. | Revisión del texto de P-01: el bloque «Qué no es» enumera las tres exclusiones y ninguna frase las contradice |
| RE-04 | Privacidad | Consultar la presentación no captura dato alguno ni crea sesión; el *disclosure* precede a cualquier captura (`PRIV-R8`). | Inspección tras la visita: sin cuenta, sin sesión, sin registro asociado al Visitante |

## 10. Interfaz

| Elemento | Nombre explícito | Propósito | Acciones | Pasos |
|---|---|---|---|---|
| Pantalla | **Presentación / landing** (P-01, estados «default» y «servicio no disponible») | Comunicar alcance no clínico, límites y accesos | Registrarse, Ya tengo cuenta | 1–3 |
| Ruta pública visible | `/` | Punto de entrada sin sesión (DIS-00 §2) | Abrir | 1 |

> **Comprobado contra la maqueta**, no supuesto: [`p01_presentacion_landing.html`](../../08_diseno/mockups/p01_presentacion_landing.html) contiene los dos accesos, las tarjetas de `Aura` y `Alan` con su rol, el bloque «Qué es / Qué no es» con las tres exclusiones que sostienen `RE-03`, y la nota de que el interlocutor es una inteligencia artificial y de que el servicio es solo para personas adultas.
> **P-02 (Registro) y P-03 (Inicio de sesión de usuario)** aparecen únicamente como **destino** de `FA-01` y `FA-02`: pertenecen a CU-02 y CU-03, no a este caso de uso.

## 11. Criterios de aceptación

Los seis flujos —el básico, tres alternativos y dos de excepción— tienen criterio propio, y dos criterios más cubren la invariante y `RE-03`. La v1.0 tenía cuatro flujos y solo dos criterios: `FA-02` y `FE-01` quedaban sin verificación.

| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un visitante sin cuenta ni sesión, cuando abre la **Presentación / landing**, entonces ve el alcance no clínico, los límites y los dos accesos **sin autenticarse**. | Flujo básico | Observación de P-01 |
| CA-02 | Dado un visitante que consulta la presentación, cuando termina la visita, entonces no existe cuenta, sesión ni registro asociado a él. | Invariante §7 | Inspección |
| CA-03 | Dado un visitante que lee la presentación, cuando revisa el bloque «Qué no es», entonces encuentra declarado que el servicio no diagnostica, no atiende urgencias en autonomía y no reemplaza a un profesional. | RE-03 | Revisión del texto de P-01 |
| CA-04 | Dado un visitante en la presentación, cuando elige registrarse, entonces el Sistema lo dirige al acceso de registro y este caso de uso termina. | FA-01 | Observación |
| CA-05 | Dado un visitante que ya tiene cuenta, cuando elige iniciar sesión, entonces el Sistema lo dirige al acceso de inicio de sesión y este caso de uso termina. | FA-02 | Observación |
| CA-06 | Dado un visitante que se marcha sin elegir acceso, cuando abandona la presentación, entonces el Sistema no conserva nada de él. | FA-03 | Inspección |
| CA-07 | Dado el servicio en mantenimiento, cuando el visitante abre la presentación, entonces recibe el estado «servicio no disponible» sin detalle técnico y puede reintentar más tarde. | FE-01 | Prueba con el servicio detenido |
| CA-08 | Dado un visitante sin cuenta, cuando solicita el acompañamiento directamente, entonces no obtiene la `Conversacion` ni dato alguno de cuenta y regresa a la presentación con el acceso de registro. | FE-02 | Prueba de acceso sin sesión |

## 12. Trazabilidad

| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| **Alias del diagrama ↔ ID** | `CU_Pres` (DCU-01 v2.1) ↔ **CU-01** | Correspondencia explícita. `CU_Pres` es el primer caso de uso declarado en el `.puml` y encabeza la tabla §2 de DCU-01; el número coincide con ambos órdenes |
| Requisito funcional | RF-19 «Presentar al **Visitante** la landing pública (alcance no clínico, límites, accesos) antes de registrarse» | Realizado por este CU, íntegro: es su único RF |
| Objetivo de negocio | OBJ-7 «Gestión de cuenta y acceso» (VIS-01 §3.2) | La presentación pública es la primera pieza del objetivo, nombrada en su propio enunciado |
| Regla de negocio | RN-04.5, RN-09, RN-01 | Gobiernan el flujo (§8) |
| Requisito de calidad | RC-06, anclaje que TRZ-01 §2 asigna a RF-19 | ⚠️ Su pregunta GQM mide el **onboarding**, no la presentación; ver `RA-03` |
| Modelo de dominio | `Visitante`, `TitularDeCuenta`, `Personaje`, `Alan`, `Aura` | Conceptos nombrados; **ninguno se crea ni se modifica** |
| Relación de dominio | `Visitante -- TitularDeCuenta : precede a` (MD-01 §4) | Enuncia el orden de los roles que este CU respeta y **no** consuma |
| Diagrama de casos de uso | `Visitante -- CU_Pres` (asociación directa) | Origen |
| Caso de uso relacionado | CU-02 «Registrar cuenta» | Destino de `FA-01`; allí sí se pasa a `TitularDeCuenta` |
| Caso de uso relacionado | CU-03 «Iniciar y cerrar sesión» | Destino de `FA-02` |
| Caso de uso excluido | CU-06 «Conversar con el acompañante» | La presentación **nombra** a `Alan` y `Aura` pero no los pone a conversar: conversar exige cuenta, consentimiento y sesión (`RN-04.5`, `FE-02`) |
| Caso de prueba | CP-01 | Planificado (fase de pruebas) |
| Robustez | **DR-01 existe** (`../robustez/DR-01_robustez_consultar_presentacion.puml`), derivado de ECU-01 **v1.0** | ⚠️ Queda desalineado con esta versión; regenerar en la fase D.4. Ver `RA-02` |
| Secuencia | DS-01 | Planificado |
| Criterio de aceptación | CA-01…CA-08 | Verificación |

## 13. Verificación metodológica (checklist §22 de la plantilla)

| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Informar alcance, límites y accesos antes de decidir registrarse |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Consultar presentación del servicio» |
| 3 | Actor primario identificado | ✅ | Visitante, no autenticado (DCU-01 §1) |
| 4 | Actores externos al sistema | ✅ | Un solo actor humano; sin sistema externo (el Proveedor LLM no participa) |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 3 pasos, del disparador al acceso elegido |
| 6 | Flujos alternativos suficientes | ✅ | `FA-01`, `FA-02` y `FA-03`: las tres salidas reales |
| 7 | Flujos de excepción relevantes | ✅ | `FE-01` indisponibilidad, `FE-02` intento de acceso sin cuenta |
| 8 | Términos del dominio (MD-01 v1.4) usados | ⚠️ | Sí: `Visitante`, `TitularDeCuenta`, `Personaje`, `Alan`, `Aura`. El vocabulario sigue a MD-01 v1.4, que **contradice** a MV-01 §3 sobre `Visitante`; declarado en `RA-01` |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §1; «invitado» y «usuario anónimo» prohibidos |
| 10 | Interfaces nombradas donde aplica | ✅ | **Presentación / landing** (P-01) en los 3 pasos; P-02 y P-03 solo como destino |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §8, referenciadas desde los flujos |
| 12 | Requisitos especiales separados | ✅ | §9, `RE-01`…`RE-04` |
| 13 | Postcondiciones verificables | ✅ | §7, incluida la invariante de no captura |
| 14 | Sin detalle de implementación | ✅ | Caja negra: sin controladores internos, sin almacenamiento ni tecnología nombrada. La ruta `/` es punto de entrada observable, no arquitectura |
| 15 | Auth como precondición/regla, no CU incluido | ✅ | `PRE-02` declara el acceso público; no hay caso de uso de acceso incluido |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §12, con la correspondencia alias ↔ CU-NN |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §11 |
| 18 | Utilizable como base de robustez y secuencia | ⚠️ | Sirve, pero **DR-01 ya existía** y se derivó de la v1.0: hay que regenerarlo (`RA-02`) |
| 19 | Comprensible por usuarios, analistas y desarrolladores | ✅ | Lenguaje llano |
| 20 | Coherente con DCU-01 y el canon | ✅ | Sin sobre-claim clínico (`RE-03`), solo adultos (`RN-01`), *disclosure* anticipado (`RN-09`), sin captura de datos (`RE-04`) |

## 14. Riesgos y ambigüedades

| ID | Tipo | Descripción | Decisión | Estado |
|---|---|---|---|---|
| RA-01 | Contradicción entre insumos | MD-01 v1.4 §2 clasifica a `Visitante` como «actor/rol **+ clase de dominio**»; MV-01 §3 y §14 lo mantienen como «actor **sin** clase de dominio». | Esta especificación sigue a **MD-01 v1.4**, insumo de vocabulario de la fase 2 y respuesta a la retroalimentación docente. MD-01 §3, decisión 2, ya registra la reversión como pendiente de `SD-28`; lo que falta es alinear MV-01 §3, §11 y §14. | Abierto (fase D.5) |
| RA-02 | Desalineación producida por esta versión | `DR-01` se derivó de ECU-01 v1.0: tres pasos, dos cursos alternativos y uno de excepción. Esta versión añade `FA-03` y `FE-02`, y nombra `Visitante`/`TitularDeCuenta`/`Personaje` como conceptos del dominio, lo que le da objetos tipo entidad que la nota de DR-01 declara ausentes. | **Regenerar `DR-01` en la fase D.4**, junto con los demás diagramas de robustez de las tandas del PDR-01. No bloquea esta especificación; se declara para que la deuda sea visible. | Abierto (fase D.4) |
| RA-03 | Anclaje de calidad impreciso | TRZ-01 §2 asigna **RC-06** a RF-19, pero el enunciado de RC-06 en REQ-01 §3 mide «onboarding usable sin ayuda» con umbral ≥ 80 % de usuarios de prueba: su pregunta GQM **no se puede medir sobre la presentación pública**. | Declarado, no corregido aquí: tocar la matriz de calidad excede el alcance de una especificación de caso de uso. Se propone revisarlo al actualizar TRZ-01 (fase D.5). | Abierto |
| RA-04 | Alcance de `FE-02` | La respuesta exacta del área de acompañamiento ante una solicitud sin sesión la gobierna el caso de uso de conversación, no este. Aquí solo se afirma lo que `RN-04.5` y el criterio de RF-19 garantizan: que el Visitante no obtiene la `Conversacion` ni dato alguno de cuenta. | Suficiente para la especificación; el código de respuesta concreto se fija en la fase de construcción. | Abierto |

## 15. Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| v2.0 | 2026-07-31 | Rehecho (PDR-01, fase D.3, tanda 4), conservando la forma ágil. **Precondiciones extraídas a filas propias** (`PRE-01`, `PRE-02`), donde antes vivían dentro de una celda de resumen y ningún identificador resolvía. **`FE-01` gana desenlace explícito** y se añade `FE-02` (intento de alcanzar el acompañamiento sin cuenta), que materializa la mitad de `RN-04.5` que ningún flujo cubría. **+`FA-03`** (salir sin elegir acceso), que es la salida más frecuente en la realidad. **Cobertura de criterios de aceptación al 100 %**: de 2 criterios para 4 flujos se pasa a 8 criterios para 6 flujos. **`Visitante` pasa a tratarse como concepto del dominio** conforme a MD-01 v1.4, con su relación `precede a` (§1.1, §7, §12). Reescritos en voz activa los pasos impersonales y retirado del checklist un término de tecnología de almacenamiento que sobraba en una especificación de caja negra. Se añaden `RE-03` (no sobre-claim, comprobado contra la maqueta P-01) y `RE-04` (no captura). Se corrige la cita de `RN-09`, que la v1.0 parafraseaba mezclándola con el *disclosure* del onboarding. |
| v1.0 | 2026-07-16 | Creación (fase 2 ICONIX). |

**Fin de ECU-01.**
