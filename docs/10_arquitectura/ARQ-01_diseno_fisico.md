# ARQ-01 — Diseño físico

**ID:** ARQ-01 · **Familia:** ARQ (diseño físico, posterior al CDR) · **Hogar:** `docs/10_arquitectura/` · **Fecha:** 2026-08-05 · **Estado:** aceptada (con verificaciones pendientes).
**Insumos:** `ADR-002 §1` (que difirió los cuatro entregables de este documento), `ADR-002-D1/D4/D5/D6/D7`, `ADR-003`, `ADR-004-D1`, `ADR-005` (herramienta: CDK en TypeScript), `MC-01`/`MC-00`/`COD-01` (43 clases congeladas), `PER-01` completo, `PRIV-01 §4.1`, `CDR-01` (`H-09`), las 14 `ECU` (§17/§10, interfaces técnicas), `00_PLAN_CODEX_ORIGINAL §4.9`, decisión del usuario sobre topología de origen (2026-08-05).
**Consumidores:** Fase 3 (construcción del MVP), `PRIV-01 §4.1` (actualizado por este documento), `PER-01 §8` (cierra `PER-H4`).
**Naturaleza:** documento de **diseño físico**, con el mismo estatus que `PER-01`/`DIS-00`: fija estructura, no la implementa. **El código CDK real se escribe en Fase 3**, todavía no chartered — ningún artefacto de la Fase 2 (`MD-01`…`MC-01`) contenía código, y este tampoco lo contiene.

**Regla de honestidad (§4.9).** Nada de este documento se ejecutó contra AWS real. Ninguna tabla, función ni bucket existe hoy; ningún número de latencia, costo o límite de servicio está medido. Donde hay juicio de diseño propio va marcado `[I2]`; donde hay una propuesta a validar en construcción, `[P5]`.

## Escala de verificación

| Marca | Significado |
|---|---|
| **[E1]** | Evidencia directa, localizable en el artefacto citado. |
| **[I2]** | Interpretación o decisión de diseño del orquestador, defendible y argumentada, pero no dictada literalmente por ninguna fuente. |
| **[N6]** | Hecho externo volátil: verificar y monitorear. |
| **[P5]** | Propuesta sin desplegar ni probar. Construcción puede ajustarla sin reabrir este documento, siempre que declare el ajuste. |

---

## §0 — Por qué existe este documento, y por qué ahora

`ADR-002 §1` fijó motores y topología pero dejó fuera, explícitamente, cuatro cosas: *«diseño de claves de DynamoDB… tabla formal de endpoints y contratos de API… inventario físico de contenedores, prefijos y políticas de S3… IAM, red, herramienta de infraestructura como código y runbook de despliegue»* — con la razón escrita: *«el diagrama de clases aún puede mover atributos y operaciones. Fijar claves antes de esa convergencia produce retrabajo garantizado.»* `[E1]`

Esa condición ya no aplica. El CDR cerró (`SD-46`, `CDR-01 v2.0`) y `MC-01` quedó **congelado**: 43 clases, 201 operaciones, 51 atributos, 80 relaciones — verificado cinco veces, ninguna cifra se movió desde `SD-39`. La herramienta con la que se escribirá la infraestructura ya está decidida (`ADR-005`, CDK en TypeScript). No queda ninguna razón declarada para seguir diferido. `[E1]`

---

## §1 — Frontera de este documento

**Decide** los cuatro entregables de `ADR-002 §1`: claves de DynamoDB, tabla de *endpoints*, inventario de S3, IAM/red/*runbook*. **Hereda y resuelve, en la medida que le corresponde**, cuatro deudas: CSRF (`ADR-002 §3` fila 1), el *endpoint* de cierre de sesión (`RA-01` de `ECU-03`), `PER-H4` (campos y llave de `ContadorDeUsoDiario`) y `H-09` del CDR (códigos HTTP sin transportar). `[E1]`

**No decide** código real. La sintaxis exacta de los constructos CDK, el `package.json`, las pruebas y el CI/CD son Fase 3. **No decide** la región de forma definitiva — sigue condicionada a `V6-b` (frontera legal, Ley 1581), pendiente desde la Fase 1. **No decide** el texto del consentimiento ni la política de retención de Groq (`V6-a`), ajenos a este documento.

---

## ARQ-01-D1 — Topología de origen: **Vercel como intermediario**

**Contexto.** `ADR-002 §3` fila 1 dejó dos salidas para el problema de origen cruzado: *«dominio propio con la API en subdominio, o reescritura en Vercel que actúe de intermediario»*. `PRIV-01 §4.1` había dejado la fila de Vercel condicionada exactamente a esta elección: *«si `ARQ-01` elige esa vía, todo el tráfico pasaría por él, credenciales y cápsula incluidas, y esta fila cambiaría a "Sí". No está decidido.»` `[E1]`

**Decisión, del usuario (2026-08-05).** Vercel actúa como intermediario, mediante **reescrituras** (`rewrites`) declaradas en `vercel.json`: el navegador solo habla con el origen de Vercel; Vercel reenvía las peticiones bajo un prefijo (`/api/*`) hacia la URL real de API Gateway, de forma transparente al cliente.

**Por qué esto resuelve el CSRF de raíz y no solo lo esquiva `[I2]`.** Con esta topología, **no hay origen cruzado desde la perspectiva del navegador**: toda petición sale hacia el mismo origen que sirvió la SPA. Eso significa que la cookie de sesión puede fijarse con `SameSite=Strict` sin ningún caso de excepción, y **no hace falta ningún mecanismo adicional de token CSRF** — el problema que `ADR-002 §3` fila 1 planteaba deja de existir, no se compensa. La alternativa de dominio propio también lo habría resuelto, a cambio de una pieza de infraestructura más (DNS, certificado). Esta vía la evita, a cambio de la consecuencia siguiente.

**Consecuencia declarada — Vercel pasa a ser encargado del tratamiento.** Al reescribir la petición, la infraestructura de Vercel procesa el cuerpo completo de cada llamada, incluidas las credenciales de autenticación y la cápsula de perfil que viaja hacia `/api/chat/`. `PRIV-01 §4.1` deja de estar condicionada: la fila de Vercel pasa de **«No — condicionado»** a **«Sí»**. El cambio exacto se aplica en §N de este documento. `[E1, consecuencia de la decisión]`

**Efecto sobre CORS en API Gateway.** Al no haber origen cruzado real desde el navegador, la configuración de CORS de API Gateway puede quedar cerrada al origen exacto de la reescritura de Vercel (no un comodín `*`), reduciendo superficie sin coste funcional. `[I2]`

**Condición de reversa.** Si esta topología resultara insuficiente (por ejemplo, límites del plan gratuito de Vercel sobre volumen de *rewrites*, sin verificar — `ADR-002 §4.9`), la salida es la alternativa ya prevista: dominio propio con la API en subdominio. Eso revierte también la fila de `PRIV-01 §4.1` a «No», y debe declararse si ocurre.

---

## ARQ-01-D2 — Tablas y claves de DynamoDB, cerrando `PER-H4`

**Contexto.** `ADR-002-D5` fijó DynamoDB con las siete entidades de `PER-01` y ninguna nueva, dejando el diseño de claves —*«particiones, ordenación, índices secundarios, TTL concretos, tabla única frente a múltiple»*— para este documento. `[E1]`

**Decisión — dos grupos de tablas, no una sola ni siete separadas `[I2]`:**

### Grupo 1 — Tabla `Titular`, de diseño de tabla única, para las cuatro entidades ligadas a la cuenta

`User`, `ConsentRecord`, `InitialConversationProfile` y `DailyUsageCounter` comparten titular y **se borran juntas** por `PER-T1`. Ponerlas en una sola tabla, particionada por titular, convierte la cascada en una consulta por partición más un borrado por lotes — no en cuatro operaciones sobre tablas distintas. Esto además es exactamente el mecanismo que el CDR ya dio por bueno: `H-02` reabrió `ECU-04 RE-04` de *«atómico todo-o-nada»* a **«borrado ordenado, tolerante a fallo parcial y reintentable»**, precisamente porque una transacción atómica de verdad no es implementable sobre DynamoDB sin respaldo. Consultar-y-borrar-por-lotes es tolerante a fallo parcial y reintentable por construcción: si se corta a mitad de camino, repetir la operación termina el trabajo sin duplicar nada, porque un `DELETE` sobre un ítem que ya no existe no falla. `[I2]`

| Campo | Valor |
|---|---|
| **Clave de partición (`PK`)** | `titularId` — identificador **opaco generado** (UUID v4), no `username` |
| **Clave de ordenación (`SK`)** | discriminador por tipo de ítem, ver tabla siguiente |
| **`GSI-1`** | `PK=username` (único) → `titularId`. Único propósito: resolver el *login* por nombre de usuario sin escanear la tabla |
| **`GSI-2`** | `PK` constante (`"DIRECTORIO"`) → `SK=titularId`, proyección **dispersa**: solo `alias`, `fechaDeRegistro`, `estado`, indicador de *onboarding* completo |
| **TTL** | Sobre los ítems `CONTADOR#<fecha>` únicamente (30 días, `PER-T5`) |

**Por qué `titularId` opaco y no `username` como `PK` `[I2]`, punto a confirmar en construcción:** `username` es `{readOnly}` en `MC-01`, así que técnicamente serviría como clave estable. Se prefiere un identificador generado porque `username` quedaría entonces **embebido como clave física en cada ítem relacionado** (consentimiento, cápsula, contadores), lo que dificulta cualquier cambio futuro de esquema de identidad y expone la cadena de inicio de sesión como dato estructural en vez de como credencial. El costo es un `GSI` adicional para el *login*, que DynamoDB soporta sin fricción. Si construcción decide que el costo no compensa, revertir a `username` como `PK` es un cambio de esquema, no de canon — se declara aquí para que no se tome como cerrado sin discusión.

**Por qué `GSI-2` con proyección dispersa, no un `Scan` `[I2]`:** `CU-08` (directorio) necesita listar titulares, y un `Scan` sobre una tabla que crece es antipatrón. El `GSI-2` resuelve el listado con una `Query`. Que la proyección incluya **solo** los cuatro campos que `PER-T4` autoriza hace de `PER-T3` (segregación del administrador: nunca alcanza la cápsula, el contenido, el personaje ni los conteos) una propiedad **estructural** del índice, no solo una disciplina de código — el resto de los datos ni siquiera están en ese índice para que una consulta mal escrita los alcance.

**Ítems por titular, con su `SK` y campos (cierra `PER-H4` en la última fila):**

| `SK` | Entidad de origen | Campos |
|---|---|---|
| `PERFIL` | `User` | `username`, `alias`, `contrasenaHash`, `rol`, `esAdulto`, `versionDisclosure`, `fechaDeRegistro` |
| `CONSENTIMIENTO#BASE` | `ConsentRecord` (capa base) | `estado`, `fecha`, `version` |
| `CONSENTIMIENTO#PERSONALIZACION` | `ConsentRecord` (capa personalización) | `estado`, `fecha`, `version` |
| `CAPSULA` | `InitialConversationProfile` | `moodSelfReport`, `energySelfReport`, `conversationGoal`, `responseStyle`, `character`, `schemaVersion`, `consentVersion` |
| `CONTADOR#<fecha ISO>` | `DailyUsageCounter` — **`PER-H4`, cerrado aquí** | `contador` (entero, incrementado atómicamente), `fecha`, `ttl` (fecha + 30 días, epoch) |

**Cierre explícito de `PER-H4`:** campos y llave de `ContadorDeUsoDiario` quedan fijados arriba — un ítem por titular y por día, bajo la partición del titular, con incremento atómico (`UpdateItem` con `ADD`) y expiración nativa. La granularidad diaria basta para el límite de **30/día** (`RN-02.9`, `H-04`); el límite de **3/min** de la misma regla **no** se implementa aquí — se delega al *throttling* de API Gateway (`ARQ-01-D5`), porque una ventana de un minuto no es el patrón de acceso para el que conviene diseñar una tabla.

### Grupo 2 — Tres tablas separadas, deliberadamente fuera de `Titular`

| Tabla | Entidad | `PK` | `SK` | TTL |
|---|---|---|---|---|
| `Configuracion` | `PlatformSetting` | `parametro` (hoy: `"kill_switch"`, constante) | — | — |
| `EventoOperativo` | `OperationalEvent` | `fecha` (ISO, agrupa por día) | `eventoId` (ordenable cronológicamente) | 30 días |
| `AccionAdministrativa` | `AdministrativeAction` | `"GLOBAL"` (constante — volumen mínimo, solo el *kill switch*) | `fecha#accionId` | vigencia del curso + 30 días, calculado al crear el ítem |

**Por qué separadas y no dentro de `Titular` `[I2]`, y esto es lo que hace de `PER-T2` una propiedad estructural:** `PER-T2` exige que `OperationalEvent` y `AdministrativeAction` **no permitan reconstruir qué hizo un usuario concreto** — ninguna lleva alias ni *username*. Meterlas en la misma tabla que `Titular`, aunque fuera con un `SK` distinto, crearía una adyacencia física innecesaria: cualquier índice futuro, cualquier consulta mal escrita, tendría la tentación estructural de cruzar ambas. Mantenerlas en tablas separadas hace que esa regla no dependa de que nadie, alguna vez, evite añadir el índice equivocado.

**Elección de `PK` por fecha, no por evento aislado `[I2]`:** agrupa naturalmente por día para `CU-09` (métricas agregadas), que necesita sumar eventos de una ventana de tiempo, no consultar uno por uno.

**Total de tablas: 4** (`Titular`, `Configuracion`, `EventoOperativo`, `AccionAdministrativa`). Responde a *«tabla única frente a múltiple»* de `ADR-002 §1`: ninguna de las dos extremas — ni una tabla para todo, ni siete tablas para las siete entidades.

---

## ARQ-01-D3 — Tabla de *endpoints*

**Contexto.** Las rutas del backend estaban dispersas en 14 `ECU` (algunas en §17, otras en §10 según la forma completa o ágil de cada una), con tres huecos declarados `RA-01` y el hallazgo `H-09` del CDR: *«los códigos HTTP que las ECU comprometen (400/401/403/409/429/504) no los lleva ningún mensaje de los 14 DS»*, clasificado como *management issue* heredado explícitamente por `ARQ-01`. `[E1]`

**Decisión — un espacio de nombres `/api/v1/` para el backend, separado de las rutas de la SPA.** Las rutas de `DIS-00` (`/login/`, `/onboarding/`, `/plataforma-admin/`…) son rutas de **React Router**, del lado del cliente, y **no cambian** — siguen siendo válidas tal cual `DIS-00` las inventarió. Lo que faltaba, y que `ADR-002 §1` encarga a este documento, es el espacio de nombres del **backend**. Se fija `/api/v1/...`, consistente con `/api/chat/` que ya usan `ECU-06`/`ECU-07`/`ECU-13`. `[I2]`

### Los tres `RA-01`, resueltos con criterios distintos — no todos necesitaban una ruta nueva

1. **`character` de `CU-14` (elegir acompañante).** `MC-01` declara `CapsulaDePerfil.character` como **`{readOnly}`**: se fija una sola vez. El hueco no era la falta de un mecanismo, era que nadie había dicho dónde vivía: **se cierra declarando que `character` viaja en el mismo payload de `POST /api/v1/onboarding`**, junto con el resto de la cápsula — no hace falta una ruta separada, porque el paso que la escribe es parte de la misma transacción que crea el resto del perfil.
2. **`CU-13` (cambiar de acompañante) no era en realidad un hueco.** Como `character` es de solo lectura en el perfil almacenado, "cambiar de acompañante" no puede escribirlo — y no lo hace: viaja como campo de `ChatRequestV1` en cada `POST /api/v1/chat`, seleccionando quién responde **esa** conversación, sin tocar el perfil guardado. Es consistente con que `ECU-13` ya reutilizaba ese *endpoint*.
3. **Cierre de sesión (`RA-01` de `ECU-03`) y revocar personalización (`RA-01` de `ECU-12`) sí necesitan ruta nueva**, y se declaran aquí. La primera existía en el plan original (`§4.9`, `POST /logout/`) pero `ECU-03 v2.0` la retiró por no tener respaldo en `DIS-00` ni en `REQ-01`; `ADR-002-D7` explica por qué vuelve a hacer falta —borrar una cookie `httpOnly` exige respuesta del servidor—. **Se cierra la ruta aquí; el control de interfaz en `DIS-00` sigue siendo de la fase de construcción**, tal como el propio `ECU-03 §10` ya lo había asignado — este documento no se atribuye lo que su fuente no le dio.

### Tabla completa

| Método | Ruta | Origen / CU | Auth | Códigos (incl. `H-09`) |
|---|---|---|---|---|
| `GET` | `/api/v1/health` | Infraestructura, no es caso de uso — restituido del plan `§4.9` como *health check* de despliegue | No | `200` |
| `POST` | `/api/v1/auth/registro` | `CU-02` | No | `201`, `400`, `409` |
| `POST` | `/api/v1/auth/login` | `CU-03` | No | `200`, `400`, `401`, `429` |
| `POST` | `/api/v1/auth/login-admin` | `CU-03` (administrador) | No | `200`, `400`, `401`, `429` |
| `POST` | `/api/v1/auth/logout` | `CU-03` — **cierra `RA-01`** | Sí | `200`, `401` |
| `POST` | `/api/v1/onboarding` | `CU-05` (incluye `character` de `CU-14`, ver arriba) | Sí | `200`, `400`, `401`, `403` |
| `POST` | `/api/v1/chat` | `CU-06`, `CU-07` (`extend`), `CU-13` (campo `character` por petición) | Sí | `200`, `400`, `401`, `403`, `429`, `504` |
| `POST` | `/api/v1/perfil/reiniciar` | `CU-11` | Sí | `200`, `401` |
| `POST` | `/api/v1/perfil/personalizacion/revocar` | `CU-12` — **cierra `RA-01`** | Sí | `200`, `401` |
| `POST` | `/api/v1/cuenta/eliminar` | `CU-04` | Sí | `200`, `401`, `409` |
| `GET` | `/api/v1/admin/directorio` | `CU-08` | Sí (admin) | `200`, `401`, `403` |
| `GET` | `/api/v1/admin/metricas` | `CU-09` | Sí (admin) | `200`, `401`, `403` |
| `POST` | `/api/v1/admin/chat-access` | `CU-10` | Sí (admin) | `200`, `401`, `403` |

**Sobre `H-09`, con honestidad de alcance `[I2]`:** los códigos de la columna anterior son una primera consolidación a partir del conjunto que `H-09` nombra (400/401/403/409/429/504) más los éxitos obvios — **no** es un recorrido exhaustivo de cada flujo `FA`/`FE` de las 14 `ECU` verificado uno a uno. Esa verificación exacta queda en §pendientes; lo que este documento cierra es que **cada *endpoint* tiene ya una fila que transporta código de estado**, que es lo que `H-09` decía que faltaba.

---

## ARQ-01-D4 — Inventario de S3

**Contexto.** `ADR-002-D6` fija S3 con versionado para configuración y activos —los respaldos ya no existen, por `ADR-003`—. `[E1]`

**Decisión.** **Un solo bucket versionado**, con prefijos por tipo de contenido:

| Prefijo | Contenido |
|---|---|
| `config/prompts/` | Plantillas de *system prompt*, con `version_prompt` |
| `config/consentimiento/` | Textos de consentimiento y de *disclosure*, por versión |
| `config/ayuda/` | Catálogo de `RecursoDeAyuda` y texto de contención del *fallback* |
| `config/evaluacion/` | Banco de casos de evaluación del LLM |
| `assets/` | Activos estáticos que no viven en el repositorio del frontend |

**No-objetivos, repetidos aquí porque son los que más se reintroducen como «optimización» `[E1]`:** ninguna caché de conversación (`ADR-002-D6`), ningún respaldo (`ADR-003`).

---

## ARQ-01-D5 — IAM y red

**Decisión.** Mínimo privilegio vía los métodos `grant*` de los constructos CDK (`ADR-005-D1`) — un rol de ejecución **por función Lambda**, nunca un rol compartido entre funciones con permisos distintos. **Sin VPC**: ningún recurso decidido en `ADR-002` la necesita (Lambda accede a DynamoDB y S3 por API pública de AWS con IAM, no por red privada). `[I2]`

**Límite de 3/min (`RN-02.9`), delegado aquí:** un plan de uso (*usage plan*) de API Gateway sobre la ruta `/api/v1/chat`, con limitación por clave o por IP autenticada — el mecanismo exacto (identificador de limitación) es de construcción; lo que se fija aquí es que **no** vive en DynamoDB.

---

## ARQ-01-D6 — *Runbook*, esqueleto

1. `cdk bootstrap aws://<cuenta>/<región>` — una vez por cuenta y región.
2. Desplegar las 4 tablas DynamoDB (`ARQ-01-D2`).
3. Desplegar el bucket S3 y cargar la configuración inicial (`ARQ-01-D4`).
4. Desplegar las funciones Lambda con sus roles (`ARQ-01-D5`), con `PlatformSetting` sembrado en estado `habilitado` (`ADR-004-D2`).
5. Desplegar API Gateway con las rutas de `ARQ-01-D3` y el plan de uso del límite por minuto.
6. Configurar `vercel.json` con las reescrituras hacia la URL de API Gateway (`ARQ-01-D1`).
7. Verificar `GET /api/v1/health`.

**Región: provisional, no decidida `[N6]`.** El *bootstrap* exige una región concreta; hoy el perfil de herramienta usa `us-east-1` por omisión, **no por decisión de proyecto**. Es un valor de arranque, sujeto a lo que `V6-b` determine bajo la Ley 1581/2012. Si `V6-b` exige otra región, el *runbook* se repite desde el paso 1 — no hay dato todavía que migrar, porque nada se ha desplegado.

---

## §N — Consecuencia aplicada sobre `PRIV-01 §4.1`

La fila de Vercel en la tabla de encargados del tratamiento cambia de:

> «**No — condicionado [P5].** Con la topología prevista, el navegador habla directamente con la API y Vercel no ve dato alguno... No está decidido.»

a:

> «**Sí.** `ARQ-01-D1` (2026-08-05) fija Vercel como intermediario de las peticiones mediante reescrituras: todo el tráfico —credenciales y cápsula incluidas— pasa por su infraestructura antes de llegar a la API.»

El cambio real se aplica en `docs/03_requisitos/PRIV-01_privacidad_datos.md`, no aquí — este párrafo es la cita de lo que cambió, para que quien lea `ARQ-01` no tenga que ir a buscarlo.

---

## §N+1 — Verificaciones pendientes

Ninguna de estas se ha hecho. Se listan para que no se den por hechas. `[E1]`

| # | Qué falta verificar | Marca |
|---|---|---|
| 1 | Que las 4 tablas se despliegan tal como se diseñaron aquí, con CDK real | `[E1]` |
| 2 | Que `GSI-2` (directorio) resuelve `CU-08` sin `Scan`, medido | `[N6]` |
| 3 | Códigos de estado de `D3` contra cada flujo `FA`/`FE` de las 14 `ECU`, uno a uno — hoy es una primera consolidación, no un recorrido exhaustivo | `[I2]` |
| 4 | Que las reescrituras de Vercel funcionan dentro de los límites de su plan gratuito, sin verificar desde `ADR-002 §4.9` | `[N6]` |
| 5 | Región definitiva, condicionada a `V6-b` | `[N6]` |
| 6 | Que el plan de uso de API Gateway aplica de verdad el límite de 3/min sin bloquear tráfico legítimo | `[N6]` |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-05 | S. Bedoya | Creación (`SD-50`). `D1` fija Vercel como intermediario (decisión del usuario), con la consecuencia declarada sobre `PRIV-01 §4.1`. `D2` fija 4 tablas DynamoDB —una única para las entidades ligadas al titular, tres separadas para lo global/telemetría, por `PER-T2`— y **cierra `PER-H4`**. `D3` fija el espacio de nombres `/api/v1/`, resuelve los tres `RA-01` heredados (dos sin necesitar ruta nueva, por ser `character` de solo lectura) e incorpora primera consolidación de `H-09`. `D4` fija un bucket S3 con prefijos. `D5` fija IAM de mínimo privilegio sin VPC. `D6` es el *runbook* esqueleto, con región explícitamente provisional. No decide código real ni la región definitiva. |
