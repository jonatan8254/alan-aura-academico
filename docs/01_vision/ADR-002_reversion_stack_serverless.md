# ADR-002 — Reversión del stack: arquitectura serverless (React + Vercel + AWS)
**ID:** ADR-002 · **Hogar:** `docs/01_vision/` · **Fecha:** 2026-08-01 · **Estado:** aceptada (con verificaciones pendientes).
**Insumos:** ADR-001 (decisiones que esta ADR supera); decisión del equipo (SD-29); PER-01 (inventario de persistencia); DIS-01 (sistema de diseño a implementar); investigación de bibliotecas de componentes del 2026-08-01.
**Consumidores:** REQ-01 (RNF-02/05/09, RC-05/RC-09), PER-01 (motor de persistencia), PRIV-01 (encargados del tratamiento), PLAN-01 (riesgos y roles), DIS-01 (gate §7), ARQ-01 (futuro), fase de construcción.
**Naturaleza:** registro de decisiones de arquitectura. **Supera:** ADR-001-D1, ADR-001-D2 y ADR-001-D5. **Deja intactas:** ADR-001-D3, D4, D6 y D7.
**Regla de honestidad (§4.9):** las versiones y licencias de las bibliotecas **sí** se verificaron (ver §Verificaciones); los límites de las capas gratuitas de Vercel y AWS **no**.

## Escala de verificación de hechos externos
| Marca | Significado |
|---|---|
| **[N1]** | Hecho interno del subproyecto (verificable en estos artefactos). |
| **[N5]** | **Decisión de plan** sobre un servicio/tecnología externa: adoptada, **no verificada** aquí — **verificar antes del release**. |
| **[N6]** | **Hecho externo volátil** (disponibilidad de *free tier*, versión, cuota, modelo hospedado): además de verificar, **monitorear** porque cambia sin aviso. |

---

## §0 — Motivo real de la reversión (léase antes que las decisiones)

**Ninguna condición de reversa declarada en ADR-001 disparó este cambio.** Conviene decirlo sin rodeos porque la tentación contraria es fuerte:

- `ADR-001-D2` preveía como reversa *«migrar a Postgres gestionado»*. DynamoDB no es Postgres.
- `ADR-001-D5` preveía como reversa *«Render»*, y en último extremo *«demo local»*. Vercel + AWS no estaba contemplado.
- `ADR-001-D1` preveía como reversa *«fijar la LTS vigente más cercana»* de Django. Abandonar Django no estaba contemplado.

Es una **decisión nueva y exógena del equipo** (SD-29), tomada al planificar la construcción: se prefiere una arquitectura serverless con un frontend React desplegado en Vercel. No es la ejecución de un plan de contingencia previsto, y presentarla como tal falsearía la trazabilidad.

**Lo que sí se conserva de ADR-001** es la propiedad que hace esto posible sin rehacer el análisis: el diseño se declaró **agnóstico del proveedor y del hosting** (`ADR-001-D3`, MV-01 §Tecnologías). Esa promesa se cobra aquí — y se verifica en el hecho de que los 17 diagramas y las 14 especificaciones de la fase 2 no requieren ningún cambio.

## §1 — Frontera de esta ADR

Esta ADR decide **motores y topología**. **No** decide esquemas. Quedan explícitamente fuera, diferidos a **`ARQ-01`** (posterior al diagrama de clases de diseño y a su CDR):

- Diseño de claves de DynamoDB (particiones, ordenación, índices secundarios, TTL concretos, tabla única frente a múltiple).
- Tabla formal de *endpoints* y contratos de API (diferida desde SD-17).
- Inventario físico de contenedores, prefijos y políticas de S3.
- IAM, red, herramienta de infraestructura como código y *runbook* de despliegue.

Razón: el diagrama de clases aún puede mover atributos y operaciones. Fijar claves antes de esa convergencia produce retrabajo garantizado. `PER-01 §1` ya había declarado esta misma frontera para sí mismo; esta ADR la respeta.

---

## ADR-002-D1 — Interfaz: **React 19 + Vite + TypeScript** (SPA)
- **Contexto:** el MVP tiene 16 pantallas ya inventariadas (DIS-00) y un sistema de diseño propio ya producido (DIS-01). El equipo opta por una aplicación de página única en lugar de plantillas renderizadas en servidor. [N1]
- **Decisión:** construir la interfaz como **SPA con React 19, empaquetada con Vite y escrita en TypeScript**. [N6]
- **Consecuencias:** el servidor deja de renderizar HTML y pasa a exponer solo datos; el contrato de API se vuelve la única frontera entre capas. Los tipos de `ChatRequestV1`/`ChatResponseV1` pueden compartirse entre cliente y funciones al ser ambos TypeScript, lo que elimina la posibilidad de que diverjan. Se pierde el renderizado en servidor y con él el posicionamiento en buscadores, irrelevante para un MVP académico tras autenticación. [N1]
- **Condición de reversa:** si la SPA resulta inviable para el plazo, se puede volver a un renderizado en servidor **sin tocar el análisis**: las 16 pantallas y las rutas de DIS-00 son independientes de la técnica de renderizado.

## ADR-002-D2 — Componentes: **Tailwind CSS v4 + shadcn/ui sobre Base UI**
- **Contexto:** DIS-01 define una identidad propia —paleta teal/ámbar, elevación plana, borde de un píxel, tipografía humanista con serif de voz, contraste AA verificado— y **no** se apoya en ninguna biblioteca. Los 21 *mockups* son HTML autocontenido con los valores hexadecimales escritos en línea y **cero variables CSS**: no hay inversión previa que preservar, hay que producir los tokens desde cero en cualquier caso. [N1]
- **Decisión:** **Tailwind CSS v4** como sustrato de utilidades y **shadcn/ui** como fuente de componentes, fijado sobre la primitiva **Base UI**. [N6]
- **Consecuencias:** shadcn/ui no es una dependencia sino un mecanismo de distribución: su herramienta **copia el código del componente al repositorio**, de modo que reestilizarlo a DIS-01 es editar código propio, sin competir en especificidad con estilos ajenos. Base UI aporta lo que DIS-01 no cubre —gestión de foco, teclado, roles ARIA— y deja explícitamente al implementador el contraste, las etiquetas y el foco visible, que es justo lo que DIS-01 ya resolvió y verificó. Se necesitan del orden de diez componentes; los propios de Alan & Aura (banner de *disclosure*, tarjeta de contención, burbujas con serif de voz, indicador de latido) no existen en ninguna biblioteca y hay que escribirlos igual. Todo el conjunto es de licencia MIT. [N6]
- **Riesgo operativo declarado:** shadcn/ui admite dos primitivas (Base UI, por defecto desde julio de 2026, y Radix, plenamente soportada). **Elegir una y no cambiarla**: cuatro personas buscando ejemplos encontrarán tutoriales de ambas y mezclarán interfaces incompatibles.
- **Condición de reversa:** si Base UI resultara insuficiente, `shadcn init -b radix` cambia de primitiva sin tocar los tokens ni el sistema de diseño. Si Tailwind resultara inviable, DIS-01 sigue siendo implementable con CSS plano: sus tokens son valores, no clases.

## ADR-002-D3 — Despliegue de la interfaz: **Vercel**
- **Contexto:** se requiere alojamiento gratuito y reproducible para una SPA. [N6]
- **Decisión:** desplegar el frontend en **Vercel**, sirviendo activos estáticos por red de distribución. [N6]
- **Consecuencias:** despliegue por integración con el repositorio y entornos de vista previa por rama, útil para revisión académica. **Frontend y backend dejan de compartir origen** —consecuencia central, ver §3—. Requiere reescrituras para que las rutas profundas (`/onboarding/`, `/plataforma-admin/`) no devuelvan 404 al recargar. Los límites reales del plan gratuito **no se verificaron**. [N6] §4.9
- **Condición de reversa:** cualquier alojamiento de estáticos sirve (Netlify, Cloudflare Pages, S3 con distribución). La decisión es de bajo acoplamiento: lo que se despliega es un directorio de archivos.

## ADR-002-D4 — Backend: **AWS Lambda (Node 22 / TypeScript) tras API Gateway**
- **Contexto:** el MVP tiene tráfico académico, esporádico y con largos periodos de inactividad; un servidor permanente es coste y mantenimiento sin contrapartida. [N1]
- **Decisión:** implementar el backend como **funciones Lambda en Node 22 y TypeScript**, expuestas mediante **API Gateway**. [N6]
- **Consecuencias:** un solo lenguaje en todo el repositorio y el contrato de API compartido por tipos. Se paga solo por invocación. **Aparece el arranque en frío como factor de latencia nuevo**, que antes no existía y que presiona sobre `RC-05` (p95 ≤ 5 s). Se pierde el panel administrativo técnico que Django ofrecía de fábrica —el panel **funcional** de RF-15/RF-16/RF-17 siempre fue a medida (plan §3.6), así que lo perdido es solo la consola de inspección de emergencia—. Cambia el instrumental de pruebas: donde el plan citaba *pytest*, ahora corresponde Vitest; Playwright se mantiene por ser agnóstico. [N1]
- **Nota de alcance:** esta decisión gobierna el **código de la aplicación**. El instrumental documental del repositorio (`grafo/scripts/`, `robustez/scripts/`, `scripts/verificar_coherencia.py`) sigue en Python y no se ve afectado: no es código de producto.
- **Condición de reversa:** si el arranque en frío incumpliera `RC-05` de forma sostenida, las salidas conocidas son aprovisionar concurrencia o mover el backend a un contenedor permanente. Ninguna de las dos toca el análisis.

## ADR-002-D5 — Persistencia operativa: **DynamoDB**
- **Contexto:** PER-01 inventaría **siete entidades** de volumen mínimo y sin consultas relacionales complejas; el contenido del chat **no se persiste** por requisito (RF-13, RNF-03, PRIV-R2). El acceso es siempre por titular de cuenta o por clave única. [N1]
- **Decisión:** **DynamoDB** como motor de persistencia operativa, con las siete entidades ya inventariadas y **ninguna nueva**. [N6]
- **Consecuencias:** encaja con el modelo de acceso real, no exige servidor de base de datos ni migraciones, y su expiración nativa por tiempo de vida da mecanismo concreto a `PER-T5` (purga por ventana), que hasta ahora era una exigencia sin instrumento. El borrado en cascada de `PER-T1` sigue siendo expresable de forma atómica. Pierde las consultas relacionales arbitrarias, que este dominio no necesita. **El diseño de claves queda diferido a `ARQ-01`** (§1). [N1]
- **Condición de reversa:** si el modelo de acceso resultara más relacional de lo previsto al converger el diagrama de clases, la alternativa es una base relacional gestionada. `PER-01` está escrito en términos de entidades y reglas, no de motor, así que la sustitución no lo invalida.

## ADR-002-D6 — Configuración, activos y respaldos: **S3 versionado**
- **Contexto:** `RNF-05` y `RC-10` exigen que recursos de ayuda, textos y parámetros del *gate* sean **configurables por entorno sin tocar código** (ADR-001-D6, SD-12), y `PER-H2` quedó abierto en parte por no saber si el alojamiento haría respaldos. [N1]
- **Decisión:** usar **S3 con versionado** como almacén de **configuración por entorno, activos y respaldos**. [N1]
- **Qué guarda:** plantillas de *system prompt* con su versión (`version_prompt`), textos de consentimiento y de *disclosure* por versión, catálogo de `RecursoDeAyuda` y texto de contención del *fallback*, banco de casos de evaluación del LLM, y exportaciones de respaldo.
- **Advertencia sobre los respaldos [I2].** Un respaldo exportado de DynamoDB **es** el contenido de las siete entidades: dato personal, no configuración. No comparte régimen con el resto de esta decisión, y **ninguna regla vigente lo alcanza**: `PER-T1` y `PRIV-R11` enumeran la cascada de borrado sin mencionarlo, porque se escribieron cuando no había respaldos. El versionado agrava el punto: borrar un objeto no lo borra, sobreviven sus versiones. Queda abierto como **`PER-H5`** y debe cerrarse en `ARQ-01` **antes de cualquier uso con personas reales**. Se declara aquí en vez de dejarlo implícito porque afecta a `RF-24`.
- **Qué NO guarda — y es la parte importante:** **ninguna caché de conversación**. Guardar pares mensaje→respuesta para ahorrar cuota **es** persistir el chat, y viola `PRIV-R2`, `RNF-03` y `RF-13`. Queda declarado aquí como **no-objetivo explícito** para que no se reintroduzca en construcción como «optimización». Ver §2.
- **Consecuencias:** el versionado nativo da historia de los textos sensibles (consentimiento, *disclosure*, contención) sin inventar un mecanismo propio, lo cual importa porque esos textos tienen implicaciones legales. Cambiar un recurso de ayuda deja de requerir despliegue. [N1]
- **Condición de reversa:** para la configuración pura, un gestor de parámetros o variables de entorno cumple igual; se eligió S3 por el versionado y porque los respaldos necesitan almacenamiento de objetos de todas formas.

## ADR-002-D7 — Autenticación: **propia, con hash Argon2id y sesión en cookie firmada**
- **Contexto:** `RF-20` prohíbe expresamente recolectar correo, teléfono, documento o fecha de nacimiento: la cuenta se crea con **username, alias y contraseña**, y nada más. `PRIV-R12` exige contraseña hasheada; `RNF-08` exige que el rol se determine y valide **en el servidor**. Al desaparecer Django desaparece `django.contrib.auth`. [N1]
- **Decisión:** autenticación **propia**: credenciales en DynamoDB con la contraseña hasheada mediante **Argon2id**, y sesión mediante **token firmado en cookie `httpOnly`, `Secure`**. [N1]
- **Alternativa descartada:** **Amazon Cognito**. Su modelo de agrupación de usuarios gira en torno a correo o teléfono —justo lo que `RF-20` prohíbe recolectar—, introduciría un tercer encargado del tratamiento que `PRIV-01` tendría que declarar, y sacaría el registro de usuarios de DynamoDB. Se descarta por incompatibilidad con el canon de minimización, no por capacidad técnica.
- **Consecuencias:** control total sobre qué se almacena, que es exactamente lo que el canon exige. En contrapartida, **la protección contra falsificación de petición entre sitios, que Django daba de fábrica, hay que construirla**, y el `SameSite` de la cookie queda condicionado por §3. Reaparece probablemente la necesidad de un *endpoint* de cierre de sesión, porque borrar una cookie `httpOnly` exige respuesta del servidor: eso reabre `RA-01` de ECU-03, que se resolverá en `ARQ-01`. [N1]
- **Condición de reversa:** si la gestión propia de sesiones resultara frágil, Cognito sigue siendo posible **a costa de** revisar `RF-20` y `PRIV-01` — es decir, con cambio de canon, no como sustitución transparente.

## ADR-002-D8 — Motor conversacional: **se mantiene Groq `gpt-oss-20b`**
- **Contexto:** el cambio de stack no obliga a cambiar de proveedor de modelo. Se evaluó mover el motor a Amazon Bedrock por homogeneidad con el resto de la infraestructura. [N1]
- **Decisión:** **mantener `ADR-001-D3` sin cambios.** Groq con `gpt-oss-20b` sigue siendo el generador conversacional; lo único que cambia es **desde dónde se le llama** (una función Lambda en lugar de una vista Django) y **dónde vive la clave** (gestor de secretos en lugar de variable de entorno del alojamiento). [N6]
- **Motivo de no migrar a Bedrock:** no ofrece capa gratuita equivalente —se factura por token—, obligaría a reabrir la verificación de región y retención (`V6-a`), y tocaría ECU-06, DR-06, DCU-01, PER-01 §7 y PRIV-01 §5. Es la opción cara en dinero y en retrabajo, sin beneficio para un MVP académico.
- **Consecuencias:** el actor `Proveedor LLM (Groq)` de DCU-01, el objeto frontera de DR-06 y la advertencia `RA-04` de ECU-06 **siguen vigentes tal cual**. La verificación pendiente de `ADR-001-D3` no se cierra ni se altera. [N6]
- **Condición de reversa:** la de `ADR-001-D3`, sin cambios: sustituir proveedor o modelo **sin alterar** el contrato de gobierno (cápsula + guardas + *gate*).

---

## §2 — Memoria conversacional: qué existe, qué no, y dónde vive

Tres cosas distintas se llaman «caché» y confundirlas produce una violación del canon. Se separan aquí de forma explícita:

| Concepto | ¿Existe? | Dónde vive | Fundamento |
|---|---|---|---|
| **Historial de la sesión en curso** (≤ 4 intercambios) | **Sí, es obligatorio** | Memoria del navegador; viaja en `history` de `ChatRequestV1` en cada petición | RF-09, RNF-04, PRIV-R1, RN-02.2 |
| **Caché de respuestas del LLM** (pares mensaje→respuesta) | **No, y no se admitirá** | — | Sería persistir el chat: viola PRIV-R2, RNF-03, RF-13 |
| **Caché de configuración** (plantillas y textos leídos de S3) | **Sí, recomendable** | Memoria del contenedor de la función, entre invocaciones | Sin dato de usuario; reduce latencia (RC-05) |

**El servidor ya era sin estado por diseño, antes de esta ADR.** El plan §4.18 fijó que el frontend mantiene el historial *en memoria* y **no** usa almacenamiento local del navegador; `ECU-06 §17` fijó que `history` (≤ 4) viaja en la petición y lo declaró **entrada no confiable**. Esa propiedad, decidida por razones de privacidad, es lo que hace viable el modelo serverless **sin sesiones adheridas ni almacén de sesión**. Si el diseño hubiera exigido estado de sesión en el servidor, este cambio habría requerido infraestructura adicional. [E1]

**Deber del backend, ya declarado y sin cambios:** por ser entrada no confiable, la función **valida y trunca** el historial a cuatro intercambios y aplica el límite de 2.500 caracteres por mensaje (RN-02.8, RF-25), en vez de confiar en lo que envíe el cliente.

**Efecto colateral aceptado y ya vigente:** al recargar la página se pierde el historial. Es el comportamiento declarado (RF-13, sin almacenamiento local), no una regresión introducida aquí.

## §3 — Consecuencias nuevas que el stack anterior no tenía

| # | Consecuencia | Dónde se resuelve |
|---|---|---|
| 1 | **Frontend y backend dejan de compartir origen.** Con Django todo venía del mismo sitio. Ahora Vercel sirve la interfaz y API Gateway expone la API, lo que impide `SameSite=Strict` entre dominios distintos y **obliga a construir la protección contra falsificación de petición entre sitios** que Django daba de fábrica. Salidas conocidas: dominio propio con la API en subdominio, o reescritura en Vercel que actúe de intermediario. | `ARQ-01` |
| 2 | **Arranque en frío** como factor de latencia nuevo, con presión sobre `RC-05` (p95 ≤ 5 s). | `PLAN-01` R-6; medición en construcción |
| 3 | **`RA-01` de ECU-03 puede reabrirse**: la sesión en cookie `httpOnly` exige respuesta del servidor para cerrarse, así que probablemente vuelva a hacer falta un *endpoint* de cierre de sesión. | `ARQ-01` |
| 4 | **Cambia quién custodia el dato personal**: pasa de PythonAnywhere a **AWS**, con la **región** por decidir; Vercel se suma como tercero pero **sin datos personales** —salvo que `ARQ-01` elija la topología de intermediación de la fila 1, que sí los haría pasar por él—; el proveedor del modelo sigue igual. Encargados con dato personal: **dos antes, dos ahora**. Inventario en `PRIV-01 §4.1`. | `PRIV-01 §4.1`, `V6-b` |
| 5 | **El respaldo en S3 escapa al borrado en cascada** — `PER-H5`, abierto. Ver `ADR-002-D6`. | `ARQ-01`, antes de uso real |
| 6 | **El *fallback* de seguridad adquiere una dependencia que no tenía.** Su texto de contención vive ahora en configuración remota (D6), y `RNF-06`/`RC-01` exigen cobertura del 100 % sin red. Restricción derivada: la configuración se carga al inicializar y se retiene en memoria; la ruta de contención **nunca** hace lectura remota, y hay valor de último recurso empaquetado. | `SEG-01 §4`, riesgo en `PLAN-01` |
| 7 | **Se pierde la consola administrativa técnica** de Django. El panel funcional siempre fue a medida, así que el impacto es bajo. Matiz honesto en la otra dirección: ese admin habría dado acceso crudo a `InitialConversationProfile`, que es justo lo que `PER-T3` y `PRIV-R7` prohíben — perderlo **reduce** un riesgo de canon. | Declarado; sin acción |

---

## §4 — Verificaciones

### Verificado en esta pasada (2026-08-01)
Consultado el registro de paquetes de npm y la documentación oficial de cada proyecto:

| Hecho | Resultado | Marca |
|---|---|---|
| Tailwind CSS | 4.3.3, licencia MIT | [N6] |
| shadcn/ui (herramienta) | 4.16.1, licencia MIT | [N6] |
| Base UI | `@base-ui/react` 1.6.0, licencia MIT, mantenida por MUI | [N6] |
| Primitiva por defecto de shadcn/ui | Base UI desde julio de 2026; Radix sigue soportada | [N6] |
| Adherencia de Base UI a las prácticas WAI-ARIA | Declarada por el proyecto, con pruebas en lectores de pantalla | [N6] |

**Reproducibilidad, con honestidad §4.9:** esta tabla registra el resultado de consultar el registro de npm y la documentación oficial de cada proyecto el 2026-08-01, pero **no deja comando ni URL por fila**, de modo que otro lector no puede reproducirla sin repetir la búsqueda. Es un desnivel real frente a `HECHOS_CANONICOS`, que sí deja comandos. Al re-verificar en `V6-a`, **anótese la fuente**.

Se marcan **[N6]** aunque estén verificadas: son hechos externos volátiles y deben re-comprobarse al iniciar construcción.

**No verificadas y pendientes también:** **React 19** y **Vite** (`ADR-002-D1`) — se adoptan sin comprobar versión vigente ni soporte; van igualmente a `V6-a`.

### Pendientes antes del release (nivel 6, van a `V6-a`)
| Decisión | Qué verificar | Marca |
|---|---|---|
| D1 | **React 19 y Vite**: versión vigente, soporte y compatibilidad con la primitiva elegida | [N6] |
| D3 | Límites reales del plan gratuito de Vercel | [N6] |
| D4 | Vigencia del entorno de ejecución Node 22 en Lambda; magnitud real del arranque en frío contra `RC-05` | [N6] |
| D4/D5/D6 | **Qué servicios de AWS son gratuitos de forma permanente y cuáles solo los primeros doce meses.** De esto depende que `RNF-02` y `RC-09` sigan siendo ciertos al final del curso | [N6] |
| D5/D6 | **Región de AWS** y sus implicaciones de residencia de datos bajo la Ley 1581 de 2012 | [N6] |
| D8 | La de `ADR-001-D3`, sin cambios: Groq `gpt-oss-20b`, capa gratuita, cuota, latencia y retención | [N6] |

> Estas verificaciones son **nivel 6** (servicios externos): las resuelve el equipo al iniciar construcción, no esta pasada documental (§4.9). `PLAN-01` las incluye como riesgos con control.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación (SD-29). Supera ADR-001-D1/D2/D5; reafirma D3. Decide interfaz React + Vite + TypeScript, componentes Tailwind v4 + shadcn/ui sobre Base UI, despliegue en Vercel, backend Lambda + API Gateway en Node 22, persistencia DynamoDB, configuración y respaldos en S3, y autenticación propia. Declara la caché de conversación como no-objetivo. |
