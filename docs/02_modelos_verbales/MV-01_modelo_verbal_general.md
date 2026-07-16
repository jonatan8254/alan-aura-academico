# Modelo verbal — Aplicación de acompañamiento conversacional «Alan & Aura Académico»

**Asignatura:** Diseño y Construcción de Productos de Software
**Profesor:** Albeiro Espinosa Bedoya, Ph.D., M.Sc.
**Autor:** Jonatan Estiven Sánchez Vargas
**Período académico:** 2026-1 · **Universidad Nacional de Colombia — Sede Medellín, Facultad de Minas** · Grupo 20

> Este modelo verbal se presenta en dos partes. La **Parte A (secciones 1–6)** sigue el formato de entrega del curso —título, contexto, descripción, requisitos funcionales, no funcionales y de calidad—, redactada como documento narrativo. La **Parte B** conserva la **formalización conceptual rigurosa** que ya tenía este modelo (estándar E8: glosario del dominio, taxonomía, relaciones tipadas, reglas de negocio y checklist verificable), que es la que alimenta la extracción del modelo de dominio. Los metadatos de control del artefacto (ID, versión, insumos, changelog) abren la Parte B.

---

## 1. Título del Proyecto

**Alan & Aura Académico** — aplicación web de **acompañamiento conversacional de apoyo emocional no clínico** para personas adultas, en español colombiano. Es un subproyecto académico, simplificado e independiente, derivado del ecosistema profesional **Smart-AID / TalentTrack**: toma su núcleo (acompañar, orientar y educar con seguridad, encarnado en dos personajes complementarios, **Alan** y **Aura**) y lo reduce a un producto mínimo viable (MVP) construible y demostrable en aproximadamente un mes, sin traicionar sus principios éticos.

## 2. Contexto del Proyecto

En los últimos años, la salud emocional y el bienestar psicológico han ganado un lugar central en la conversación pública, impulsados por un entorno post-pandémico que dejó a muchas personas adultas conviviendo con estrés sostenido, desregulación emocional y bajones anímicos. Sin embargo, entre "estar bien" y "necesitar atención clínica" existe una franja amplia y desatendida: personas que solo requieren un **espacio de primer apoyo** —disponible, cercano, no clínico y no punitivo— donde ser escuchadas, ordenar lo que sienten y recibir orientación breve antes de que un malestar cotidiano escale. La atención profesional en salud mental es escasa, costosa y a menudo intimidante como primer paso, lo que deja ese primer apoyo sin cubrir.

En este entorno surge la necesidad de una herramienta conversacional que ofrezca **contención y psicoeducación de manera segura y accesible**, que acompañe sin pretender diagnosticar ni sustituir a un profesional, y que sepa **derivar** cuando aparezca una señal de peligro. El uso de modelos de lenguaje hace hoy viable una experiencia de acompañamiento natural y disponible en todo momento; pero, en un dominio tan sensible, la tecnología solo es una ventaja si se construye con **seguridad emocional por encima del *engagement***, minimización estricta de datos y transparencia sobre lo que es y lo que no es. "Alan & Aura Académico" se propone como una demostración de que ese núcleo puede construirse con estándares profesionales —requisitos trazables, calidad medible y seguridad auditable— dentro del marco de un curso universitario.

Los actores sociales involucrados en el proyecto son la **persona adulta usuaria**, que consiente y conversa buscando apoyo; el **visitante**, que consulta la presentación y los límites del servicio antes de registrarse; el **administrador de plataforma**, responsable técnico-operativo de mantener el servicio disponible y observar métricas agregadas sin acceder a contenido sensible; y, como sistema externo, el **proveedor de modelo de lenguaje**, que genera el texto de las respuestas bajo el gobierno del sistema. El acompañamiento se encarna en dos personajes de inteligencia artificial complementarios: **Alan**, orientado a la activación práctica, y **Aura**, orientada a la regulación y la calma. Ninguno es un terapeuta: acompañan, orientan y educan, y ante una expresión explícita de peligro se subordinan a un protocolo de seguridad.

## 3. Descripción del Proyecto

El **objetivo general** es construir y documentar un MVP conversacional (Alan/Aura) que complete de extremo a extremo el flujo **presentación → registro/acceso → onboarding → conversación → gate de seguridad**, con gestión de cuenta del usuario y un administrador de plataforma de funciones mínimas, cumpliendo el canon ético de dominio y con requisitos de calidad medibles. Entre los **objetivos específicos** se encuentran: (1) un onboarding que obtenga consentimiento informado y arme una **cápsula de perfil mínima** para adultos, con *disclosure* de que se conversa con una IA; (2) una conversación con un modelo de lenguaje **gobernado**, en la que la personalidad de Alan o Aura modula el tono pero no compromete la seguridad; (3) un **gate de seguridad** que, ante peligro explícito, active un *fallback* determinista con derivación a recursos de ayuda; (4) **minimización y no persistencia** del contenido del chat; (5) **calidad medible**, con cada cualidad relevante anclada a la norma ISO/IEC 25010:2023; (6) una **administración de plataforma** de exactamente tres funciones; y (7) la **gestión de cuenta y acceso** del usuario, incluida la eliminación de cuenta con borrado en cascada.

La **duración estimada** del desarrollo es de aproximadamente un mes (unos veinte días laborables), reservando los últimos dos o tres días para integración, contingencias y ensayo de la demostración. Las **ideas clave** que sustentan el proyecto son el acompañamiento no clínico, el principio de *seguridad emocional por encima del engagement*, la minimización de datos (el modelo de lenguaje recibe únicamente una cápsula mínima, nunca el historial en bruto) y la no persistencia del contenido conversacional. En cuanto a **tecnologías**, se utilizará **Python con el framework Django 5.2 LTS** —plantillas del propio Django y JavaScript mínimo para la interfaz—, una base de datos **SQLite**, y la **API de Groq** con el modelo de pesos abiertos `openai/gpt-oss-20b` como generador conversacional; el control de versiones e integración continua se llevará en **GitHub con GitHub Actions**, y el despliegue académico principal en **PythonAnywhere Free**, con **Render Free** como contingencia documentada. El diseño es agnóstico del proveedor y del hosting, que pueden reemplazarse por configuración.

El **alcance** abarca una rebanada vertical completa: desde la presentación pública y el registro, pasando por el onboarding y la conversación con seguridad, hasta la administración técnica mínima; deliberadamente **quedan fuera** la sensórica, la neuromodulación, la analítica de bienestar, el triaje clínico por niveles, el manejo de menores de edad y cualquier afirmación de eficacia terapéutica. Las **metas esperadas** se expresan como umbrales verificables antes de la entrega: que la ruta de seguridad opere el **100 %** de las veces sobre el banco de casos de peligro explícito **incluso con el modelo de lenguaje deshabilitado**; que al menos el **80 %** de las personas de prueba completen el onboarding sin asistencia; que la inspección de los envíos al modelo muestre **cero fugas** de datos prohibidos; y que el despliegue sea **reproducible** siguiendo la documentación. Con estas metas, el proyecto busca demostrar no solo una herramienta conversacional funcional, sino un núcleo de acompañamiento **seguro, medible y trazable**.

## 4. Requisitos Funcionales

El software "Alan & Aura Académico" ofrecerá funcionalidades diferenciadas según el actor. Para el **visitante**, la interacción se limita a consultar la presentación pública del servicio —su alcance no clínico, sus límites y sus accesos— antes de decidir registrarse, sin acceder al chat ni a ningún dato.

Para la **persona adulta usuaria**, el flujo comienza con el **registro** (mediante nombre de usuario, alias y contraseña, sin pedir nombre legal, documento, correo, teléfono, dirección ni fecha de nacimiento) y el inicio y cierre de sesión. Antes de cualquier captura de datos se le muestra el **aviso (*disclosure*)** de que conversará con una inteligencia artificial; luego declara ser mayor de dieciocho años y **otorga un consentimiento granular y revocable**; sin consentimiento no hay conversación. A continuación puede responder una **caracterización opcional de cinco preguntas** (estado de ánimo, energía, objetivo de la conversación, estilo de respuesta preferido y personaje), con la que el sistema arma la **cápsula de perfil mínima**. El usuario elige entre **Alan y Aura** e inicia una sesión de conversación en la que intercambia mensajes con el personaje; el sistema gobierna al modelo de lenguaje entregándole únicamente la cápsula, el *system prompt* de personalidad, hasta cuatro intercambios de la sesión en curso y el turno actual, y **evalúa un gate de seguridad en cada mensaje** antes de responder. Ante una expresión explícita de peligro, el sistema **activa un *fallback* determinista** —una respuesta de contención con derivación a recursos de ayuda— que funciona aunque el modelo de lenguaje esté caído. El usuario puede cambiar de personaje, cerrar la conversación (cuyo contenido se descarta, sin persistencia), y en todo momento **reiniciar su caracterización, revocar la personalización o eliminar su cuenta con borrado en cascada** de todos sus datos asociados. Cada sesión respeta límites operativos (hasta veinte mensajes de usuario, mil quinientos caracteres por mensaje) y maneja con gracia la indisponibilidad, los tiempos de espera y las cuotas del servicio sin romper la interfaz.

Los **administradores de plataforma** acceden mediante un inicio de sesión separado, con el rol validado en el servidor (de modo que manipular el cliente no otorga privilegios), y disponen de **exactamente tres funciones**: visualizar un **directorio mínimo** de usuarios (alias, identificador truncado, fecha de registro, estado y si completó el onboarding); visualizar **métricas agregadas** de uso (total de cuentas, onboardings completados, llamadas al chat en siete días y tasa técnica de éxito/error); y **habilitar o deshabilitar globalmente el chatbot** (*kill switch*), con confirmación y registro de la acción. El administrador **no** edita menús de contenido, textos ni *prompts*, **no** realiza suspensiones individuales ni exportaciones, y **no** puede ver conversaciones, respuestas de encuesta ni ningún dato individual sensible. Finalmente, el **proveedor de modelo de lenguaje** actúa como sistema externo que genera el texto de las respuestas, siempre bajo el gobierno del sistema (cápsula, guardas y gate de seguridad), sin ser un actor clínico ni un decisor autónomo.

## 5. Requisitos No Funcionales

"Alan & Aura Académico" debe cumplir requisitos no funcionales que garanticen una experiencia segura, respetuosa de la privacidad y sostenible en infraestructura gratuita. La **interfaz y los *prompts*** estarán en español de Colombia, con un onboarding breve —del orden de dos minutos— y un lenguaje claro y accesible para personas adultas de distintas edades. En cuanto a **rendimiento**, la respuesta conversacional deberá llegar en un tiempo aceptable pese a depender de un servicio externo, y el sistema aplicará límites de uso configurables (tres solicitudes por minuto y treinta por día por usuario, con un tiempo máximo de espera de veinte segundos por llamada) para proteger la cuota y la estabilidad. Respecto a la **disponibilidad**, el MVP se desplegará sobre *free tiers* (PythonAnywhere Free como ruta principal y Render Free como contingencia), por lo que —con honestidad académica— **no** se promete un nivel de servicio de producción; lo que sí se garantiza es la **degradación con gracia**: ante indisponibilidad, tiempo de espera, cuota agotada o respuesta bloqueada, la interfaz informa el estado y permite reintentar sin romperse.

En **seguridad y privacidad**, el rol de cada actor se determina y valida en el servidor; las contraseñas y las claves de servicio nunca llegan al navegador ni al repositorio; el **contenido del chat no se persiste** en base de datos ni en registros; y rige la **minimización estricta**: el modelo de lenguaje recibe únicamente la cápsula, el turno actual y hasta cuatro intercambios de la sesión en curso, y jamás el nombre de usuario, el alias, el identificador, el rol, la contraseña ni el historial de sesiones previas. La ruta de seguridad es **independiente del modelo de lenguaje** (opera aunque este falle). En cuanto a **mantenibilidad y portabilidad**, los recursos de ayuda y los parámetros de seguridad se aprovisionan por configuración de entorno, no en el código, y el diseño es reemplazable en su hosting, base de datos y proveedor de modelo mediante configuración, favoreciendo la reproducibilidad del despliegue.

## 6. Requisitos de Calidad

Para asegurar la calidad del software se establecen métricas claras y medibles, ancladas a la norma **ISO/IEC 25010:2023** y expresadas con el método **Meta–Pregunta–Métrica (GQM)** con un umbral obligatorio por cada una. En materia de **seguridad de dominio (*safety*)**, la ruta de contención deberá activarse en el **100 %** de los casos del banco de peligro explícito, incluso con el modelo de lenguaje deshabilitado; la detección de peligro **explícito** deberá alcanzar un *recall* de al menos **0,90** sobre un conjunto de prueba definido por el equipo —declarando con honestidad que no es una detección clínica ni cubre casos implícitos—; y las guardas de salida deberán bloquear o volver segura al menos el **95 %** de los *prompts* adversarios de prueba. En **confidencialidad**, la inspección de los envíos al modelo de lenguaje deberá arrojar **cero fugas** de datos prohibidos (100 % de envíos limpios).

En **capacidad de interacción**, al menos el **80 %** de las personas de prueba deberán completar el onboarding sin asistencia; en **eficiencia de desempeño**, el percentil 95 del tiempo de respuesta deberá mantenerse dentro de un umbral acordado (dependiente del servicio externo); en **fiabilidad**, al menos el **95 %** de las peticiones de la demostración deberán terminar con éxito o con un *fallback* controlado; y en **idoneidad funcional**, la coherencia de personaje entre Alan y Aura deberá puntuar al menos **4 sobre 5** en una rúbrica aplicada a diez o más diálogos. Finalmente, la **instalabilidad** exigirá un despliegue reproducible según el *runbook*, y la **mantenibilidad**, que el 100 % de los cambios de recursos y textos se realicen por configuración de entorno sin desplegar código. En cuanto al **marco de datos personales**, el diseño se alinea con la Ley 1581 de 2012 y su decreto reglamentario (finalidad, consentimiento, minimización), cuya validación jurídica queda señalada como pendiente de revisión por un experto legal. Estos umbrales son **objetivos de calidad**, no resultados alcanzados ni una certificación ISO; su verificación es parte del cierre del MVP.

---

# Parte B — Modelo verbal conceptual (formalización E8)

> Lo que sigue es el modelo verbal **conceptual y riguroso** (estándar E8) que ya tenía este artefacto: glosario del dominio, taxonomía de clasificación, catálogo de relaciones tipadas, reglas de negocio y checklist verificable. Es la fuente que alimenta la extracción del modelo de dominio (`../06_dominio/MD-01_modelo_dominio.puml`). La ficha de control del artefacto abre esta parte.
**ID:** MV-01 · **Familia:** MV (único) · **Hogar:** `docs/02_modelos_verbales/` · **Fecha:** 2026-07-12 · **Versión:** externa v2.3 / interna v2.3.0 · **Autoría:** Jonatan E. Sánchez Vargas (subproyecto).
**Naturaleza declarada:** modelo verbal conceptual (analítico, pre-formal) — glosario del dominio. No es diseño técnico, ni modelo de datos, ni arquitectura, ni casos de uso.
**Insumos:** VIS-01, ADR-001, `00_AUDITORIA_PLAN_CODEX.md`, canon del macro; estándar E8 (subconjunto de 11 rasgos, SD-04).
**Consumidores:** la skill `uml-domain-modeler` (extracción del modelo de dominio, fase 2), REQ-01, contrato conversacional.
**Cambio v2.0 (SD-13):** modelo **consolidado** — absorbe los antiguos submodelos MV-01.1/.2/.3 como **vistas internas** (§8) y se estructura para una **extracción de dominio correcta** en modo *academic strict* (sin atributos, **sin multiplicidades**; ver §14 Handoff). Las cardinalidades y los dominios de valor pasan a **reserva** (§13), no al diagrama inicial.
**Cambio v2.1 (SD-15):** **alineación al plan de Codex** — se restauran gestión de cuenta (registro/login, reinicio de perfil, revocación, eliminación en cascada), el actor **Visitante**, y las 3 funciones reales del administrador (directorio, métricas agregadas, **kill switch**); entra la clase **DisponibilidadDelChatbot**; se descarta `Configuracion` como clase (recursos/textos **por entorno**, no por edición del admin).
**Cambio v2.2 (SD-17):** **reconciliación con el plan completo archivado** — se precisa el historial de sesión (RN-02.2/RN-03: hasta 4 intercambios de la sesión actual, no "cero historial") y se añaden los límites de tasa exactos (RN-02.8/RN-02.9: 20 msg/sesión, 1.500 caracteres, 350 tokens, 3/min, 30/día, timeout 20 s). Además, la relación `Administrador -- Usuario` (supervisa) se **retira** del dominio (era de acceso, no conceptual; el directorio es caso de uso).
**Cambio v2.3 (SD-19):** **formato de entrega del curso** — se antepone la **Parte A (secciones 1–6)** en el estilo narrativo del ejemplo provisto (título, contexto, descripción, RF, RNF, requisitos de calidad), con el contenido real del miniproyecto extraído de VIS-01/REQ-01/plan; la formalización E8 se conserva íntegra como **Parte B**. Sin cambios en clases, relaciones ni reglas.
**Estándar de cumplimiento:** E8 — **11 rasgos {1, 2, 3, 6, 7, 12, 13, 14, 15, 16, 17}**; checklist en §Checklist (Parte B).

---

## 1. Parentesco documental (rasgo E8-1)
- **Padre conceptual:** VIS-01 (objetivos OBJ-1…OBJ-6). **Abuelo:** corpus del macro (doc 8, Releases 0.1/0.2; D22, arquitectura LLM).
- **Vistas internas** (antes submodelos, ahora §8): Onboarding · Conversación · Seguridad · Administración.
- **Artefacto hermano:** contrato conversacional (comportamiento del LLM; no es *feedstock* de dominio).
- Nada flota sin genealogía: cada clase y regla apunta a un objetivo de VIS-01.

## 2. Taxonomía de clasificación (rasgo E8-2, alineada al extractor)
Se clasifica **antes** de modelar, con las categorías que usa el extractor de dominio: **clase conceptual (central/secundaria)**, **atributo**, **etiqueta de relación**, **actor/rol**, **evento/estado/excepción**, **término UI/técnico** y **descartado**. Primero clasificar, después relacionar; nunca subir un término técnico o un proceso como clase.

## 3. Candidatos clasificados (sustantivos → clasificación)
Nombres canónicos en español, PascalCase, **un término por concepto** (alias en §11). "Borderline" = el MV lo propone, **la skill decide** su tratamiento final.

| Candidato | Clasificación | Nota para la extracción |
|---|---|---|
| **Usuario** | Actor/rol **y** clase de dominio | Persona adulta **registrada** que gestiona su cuenta (perfil, revocación, eliminación) y conversa. La identidad de acceso (username/alias/contraseña) son atributos (§13). |
| **Administrador** | Actor/rol **y** clase de dominio | Rol de plataforma con 3 funciones (directorio, métricas agregadas, kill switch). **No** edita recursos/textos ni ve datos individuales. |
| **Visitante** | Actor/rol (**sin** clase de dominio) | Consulta la presentación antes de registrarse; sin datos ni relaciones de dominio → actor de caso de uso, **no** clase. |
| **Consentimiento** | Clase central | Registro de negocio con ciclo de vida (otorgado/revocado). |
| **CapsulaDePerfil** | Clase central | Objeto de dominio: resumen mínimo que orienta la conversación. |
| **Personaje** | Clase (superclase) | Concepto general de acompañamiento; padre de Alan/Aura. |
| **Alan** | Subclase (especialización) | *is-a* Personaje (activación). Pasa el substitution test. |
| **Aura** | Subclase (especialización) | *is-a* Personaje (calma). Pasa el substitution test. |
| **Conversacion** | Clase central | Sesión efímera de acompañamiento (no persistida). |
| **Mensaje** | Clase secundaria | Turno dentro de una conversación; parte de su ciclo de vida. |
| **EventoDeSeguridad** | Evento de dominio — **borderline** | En dominio de *safety* puede ser de primera clase (incidente/alerta con identidad y trazabilidad). La skill decide si lo conserva o lo consolida. |
| **RecursoDeAyuda** | Clase secundaria — **borderline** | Referencia de derivación; concepto de dominio estable. |
| **DisponibilidadDelChatbot** | Clase (estado operativo del servicio) | Estado global habilitado/deshabilitado que el administrador controla (**kill switch**, plan §3.7); condiciona si pueden iniciarse conversaciones. Tiene identidad y ciclo de vida → clase de dominio. |
| **Configuracion** | **Descartada como clase** (contenedor técnico) | Agrupa recursos/textos/parámetros; en el dominio se descarta (infra). Los recursos se aprovisionan **por entorno**; lo domain-meaningful queda en `RecursoDeAyuda`. |
| MetricaDeUso / EventoOperativo (cuentas, onboardings, llamadas 7d, tasa éxito/error) | **Vista derivada / diferido** | El admin ve métricas **agregadas** (plan §3.7): reporte sobre datos operativos sin contenido. **No** se modela como clase en la primera pasada (§13). |
| Cuenta (username, alias, contraseña) | **Atributo de `Usuario` / diferido** | La identidad de acceso son atributos de `Usuario`; no se crea clase `Cuenta` aparte (§13). |
| edad, preferenciaDePersonaje, focoEmocional, tonoPreferido, textoDeConsentimiento, textoDeDisclosure, estados | **Atributo / dominio de valor** | **No** son clases → reserva (§13). |
| acompañamiento, derivación, activación, calma | **Etiqueta de relación** | Describen cómo se conectan clases, no son clases. |
| LLM/Groq, Django, SQLite, PythonAnywhere, gate, fallback, onboarding-como-proceso, chat-como-UI, mensajes de éxito/error | **Término UI/técnico → descartado** | No entran al dominio (§14 exclusiones). |

## 4. Catálogo de relaciones tipadas (rasgo E8-3)
Etiquetas **conceptuales** (no procedimentales). **Sin multiplicidades** (modo *academic strict*; ver §13/§14). Notación PlantUML orientativa.

| ID | Relación (conceptual) | Tipo | Lectura |
|---|---|---|---|
| REL-1 | `Usuario -- Consentimiento : tiene` | Asociación | Un usuario tiene su consentimiento. |
| REL-2 | `Usuario -- CapsulaDePerfil : se describe con` | Asociación | La cápsula describe mínimamente al usuario. |
| REL-3 | `Personaje <|-- Alan` | Generalización | Alan *is-a* Personaje. |
| REL-4 | `Personaje <|-- Aura` | Generalización | Aura *is-a* Personaje. |
| REL-5 | `Usuario -- Conversacion : mantiene` | Asociación | El usuario mantiene conversaciones. |
| REL-6 | `Conversacion -- Personaje : se conduce con` | Asociación | La conversación se conduce con un personaje. |
| REL-7 | `CapsulaDePerfil -- Conversacion : orienta` | Asociación | La cápsula orienta la conversación (vía LLM). |
| REL-8 | `Conversacion *-- Mensaje : se compone de` | Composición | Los mensajes dependen del ciclo de vida de la conversación (no persistencia → borrado en cascada, no compartidos). |
| REL-9 | `Mensaje -- EventoDeSeguridad : origina` | Asociación | Un mensaje puede originar un evento de seguridad. |
| REL-10 | `EventoDeSeguridad -- RecursoDeAyuda : remite a` | Asociación | El evento remite a recursos de ayuda. |
| REL-11 | `Administrador -- DisponibilidadDelChatbot : controla` | Asociación | El admin habilita/deshabilita el chatbot (kill switch). |
| REL-12 | `DisponibilidadDelChatbot -- Conversacion : condiciona` | Asociación | Solo pueden iniciarse conversaciones si el chatbot está habilitado. |

**Matriz de cobertura (ninguna clase aislada):**

| Clase | Participa en |
|---|---|
| Usuario | REL-1, REL-2, REL-5 |
| Consentimiento | REL-1 |
| CapsulaDePerfil | REL-2, REL-7 |
| Personaje | REL-3, REL-4, REL-6 |
| Alan | REL-3 |
| Aura | REL-4 |
| Conversacion | REL-5, REL-6, REL-7, REL-8, REL-12 |
| Mensaje | REL-8, REL-9 |
| EventoDeSeguridad | REL-9, REL-10 |
| RecursoDeAyuda | REL-10 |
| Administrador | REL-11 |
| DisponibilidadDelChatbot | REL-11, REL-12 |

→ Las 12 clases candidatas participan en ≥1 relación (o son subclase justificada): **cero clases huérfanas.** (`Configuracion` deja de ser clase; `DisponibilidadDelChatbot` entra por el kill switch.) **El `Administrador` se conecta solo por `controla`**: «ver directorio» y «ver métricas» son **casos de uso/vistas** sobre `Usuario`, no relaciones de dominio (evita el malentendido de que «supervisa» las conversaciones).

## 5. Eventos conceptuales candidatos (rasgo E8-5)
`CuentaCreada` · `SesionIniciada` · `ConsentimientoOtorgado` · `CapsulaGenerada` · `ConversacionIniciada` · `MensajeRecibido` · `RespuestaGenerada` · `PeligroExplicitoDetectado` · `FallbackActivado` · `ConversacionCerrada` · `PerfilReiniciado` · `PersonalizacionRevocada` · `CuentaEliminada` · `ChatbotHabilitado` / `ChatbotDeshabilitado`. Insumo **pre-formal** para robustez/secuencia de la fase posterior; **no** son clases del dominio salvo `EventoDeSeguridad` (§3, borderline).

## 6. Fronteras negativas — qué NO es (rasgo E8-6)
- El MVP **no es** un sistema clínico: no diagnostica, no trata, no gestiona urgencias en autonomía.
- La `CapsulaDePerfil` **no es** un historial: no acumula ítems, diario ni biomarcadores.
- La `Conversacion` **no es** persistente: no se guarda ni se reusa entre sesiones.
- La seguridad **no es** detección exhaustiva ni un clasificador clínico: es un gate binario de peligro explícito (SEG-01) — su mecanismo (`gate`/`fallback`) **no** es clase de dominio.
- El `Personaje` **no es** un terapeuta ni una identidad humana: es un estilo de acompañamiento con *disclosure* de IA.
- El `Administrador` **no es** un observador de contenido: ve **agregados** (directorio mínimo, métricas) y controla el kill switch; **no** accede a conversaciones, cápsulas, respuestas de encuesta ni datos individuales, ni edita recursos/textos/prompts (no hay CMS).
- **Regla de frontera (identidad del MV):** *el MVP acompaña, orienta, educa y deriva; la personalidad modula el tono, pero ante peligro la seguridad manda sobre la personalidad.*

## 7. Reglas de negocio tipadas (rasgo E8-15)
Cada regla: ID · enunciado · **tipo** (Wiegers) · origen · justificación. Consolida las reglas raíz y las de las vistas.

### 7.1 Reglas raíz
| ID | Enunciado | Tipo | Origen | Justificación |
|---|---|---|---|---|
| RN-01 | Solo usuarios que declaran ser adultos (≥18) pueden usar el MVP. | Restricción | canon §5, SD-08 | Menores fuera de alcance. |
| RN-02 | No se inicia conversación sin consentimiento otorgado. | Restricción | canon §5 | Consentimiento informado previo. |
| RN-03 | El LLM recibe la `CapsulaDePerfil` y, al conversar, los intercambios de la **sesión actual** (máx. 4, RN-02.2); **nunca** historial persistido de sesiones anteriores ni ítems/diario/biomarcadores. | Restricción | canon (minimización), D22, plan §3.4 | Minimización de datos. |
| RN-04 | La conversación no se persiste; al cerrar la sesión se descarta. | Restricción | canon, ADR-001-D2 | No persistencia del chat. |
| RN-05 | Ante peligro explícito, la respuesta la produce el fallback determinista, no el LLM. | Habilitador de acción | SEG-01, D22 §3.9.3 | *Fail safe*: la ruta segura no depende del LLM. |
| RN-06 | Los recursos de ayuda se leen de configuración por entorno, no de código. | Restricción | SD-12, ADR-001-D6 | Correctitud y anti-obsolescencia. |
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. | Habilitador de acción | canon (consentimiento) | Consentimiento revocable. |
| RN-08 | La información de bienestar no se usa con fines punitivos ni se divulga más allá de lo mínimo. | Restricción | canon (uso no punitivo, divulgación mínima) | Principio ético de dominio. |
| RN-09 | Todo usuario ve el *disclosure* de IA antes de la primera conversación. | Restricción | canon (disclosure), SD-08 | No sobre-claim; transparencia. |
| RN-10 | «Adulto» = persona que declara edad ≥18 al onboarding. | Término | SD-08 | Define el término de RN-01. |
| RN-11 | «Peligro explícito» = mensaje del usuario que expresa de forma manifiesta intención o riesgo de daño a sí mismo o a terceros. | Término | SEG-01 | Define el disparador de RN-05 (explícito, no inferido). |

### 7.2 Reglas de la vista Onboarding
| ID | Enunciado | Tipo | Origen |
|---|---|---|---|
| RN-01.1 | El *disclosure* de IA se muestra antes de pedir cualquier dato. | Restricción | RN-09 |
| RN-01.2 | La edad se declara antes del consentimiento; <18 no continúa. | Restricción | RN-01, RN-10 |
| RN-01.3 | La `CapsulaDePerfil` se compone solo de {preferenciaDePersonaje, focoEmocional, tonoPreferido}. | Restricción | RN-03 |
| RN-01.4 | Ningún campo de perfil es obligatorio salvo edad y consentimiento. | Habilitador | canon (minimización) |
| RN-01.5 | El consentimiento se puede revocar desde el onboarding y después. | Habilitador | RN-07 |

### 7.3 Reglas de la vista Conversación
| ID | Enunciado | Tipo | Origen |
|---|---|---|---|
| RN-02.1 | Todo mensaje del usuario pasa el gate de seguridad antes de generar respuesta del LLM. | Habilitador | RN-05, SEG-01 |
| RN-02.2 | El LLM recibe `CapsulaDePerfil` + persona + hasta 4 intercambios de la **sesión actual** + turno; **nunca** historial de sesiones anteriores (plan §3.4/§4.9/§4.10). | Restricción | RN-03, plan §3.4 |
| RN-02.3 | La respuesta del LLM se filtra por guardas (no riesgo, no claim clínico). | Restricción | canon, §3.9.1 |
| RN-02.4 | La personalidad (Alan/Aura) modula el tono, no las reglas de seguridad. | Restricción | §6 |
| RN-02.5 | La conversación se descarta al cerrar; no se reusa entre sesiones. | Restricción | RN-04 |
| RN-02.6 | El usuario puede cambiar de personaje durante o entre conversaciones. | Habilitador | OBJ-2 |
| RN-02.7 | No se inicia conversación si el chatbot está deshabilitado globalmente (kill switch). | Restricción | plan §3.7 |
| RN-02.8 | Una sesión admite hasta **20 mensajes** de usuario, cada uno hasta **1.500 caracteres**; el LLM devuelve hasta **350 tokens**. | Restricción | plan §3.1/§4.9/§4.10 |
| RN-02.9 | Rate limit por usuario: **3 solicitudes/minuto**, **30/día**; timeout de solicitud al LLM: **20 segundos**. | Restricción | plan §4.13 |

### 7.4 Reglas de la vista Administración (alineadas al plan §3.7 — exactamente tres funciones)
| ID | Enunciado | Tipo | Origen |
|---|---|---|---|
| RN-03.1 | El administrador tiene **exactamente tres funciones**: directorio mínimo, métricas agregadas y kill switch. | Restricción | plan §3.7 |
| RN-03.2 | El directorio muestra solo campos mínimos: alias, **ID truncado**, fecha de registro, estado y onboarding completado. | Restricción | plan §3.7 |
| RN-03.3 | Las métricas son **agregadas** (total de cuentas, onboardings, llamadas al chat 7d, tasa técnica de éxito/error); nunca individuales. | Restricción | plan §3.7 |
| RN-03.4 | El kill switch (habilitar/deshabilitar el chatbot) requiere **confirmación** y queda **registrado** (auditoría de la acción). | Habilitador | plan §3.7 |
| RN-03.5 | El administrador **no** ve: username completo, respuestas de encuesta, cápsula, mensajes, respuestas, personaje elegido, conteos por usuario, contraseñas ni tokens. | Restricción | canon, plan §3.7 |
| RN-03.6 | El administrador **no** edita recursos, textos ni prompts (no hay CMS); esos se aprovisionan **por entorno**. | Restricción | plan §2.5/§3.7, ADR-001-D6 |
| RN-03.7 | El acceso administrativo es por **login separado** y el rol se valida en el **servidor** (no alterable desde el cliente). | Restricción | plan §3.2/§2.6 |

### 7.5 Reglas de la vista Cuenta y acceso
| ID | Enunciado | Tipo | Origen |
|---|---|---|---|
| RN-04.1 | El registro pide solo **username, alias y contraseña**; no nombre legal, documento, correo, teléfono, dirección ni fecha de nacimiento. | Restricción | plan §3.1 |
| RN-04.2 | La mayoría de edad se guarda como **declaración booleana + versión del disclosure**, no como fecha de nacimiento. | Hecho | plan §3.1 |
| RN-04.3 | El usuario puede **reiniciar su caracterización** y **revocar la personalización**. | Habilitador | plan §3.1 |
| RN-04.4 | El usuario puede **eliminar su cuenta** con **borrado en cascada**. | Habilitador | plan §3.1, canon (supresión) |
| RN-04.5 | El Visitante solo consulta la presentación (alcance, límites, accesos); no accede a chat ni datos. | Restricción | plan §2.2 |
| RN-04.6 | No hay recuperación de contraseña por correo ni verificación de correo. | Restricción | plan §2.5 |

## 8. Vistas internas y matriz de intercambio de objetos (rasgo E8-16)
Los antiguos submódulos son ahora **vistas** (candidatos a `package{}` en el diagrama). Cada vista agrupa clases; el dominio es **uno solo**.

| Vista (paquete candidato) | Clases que agrupa | Frontera |
|---|---|---|
| **Cuenta y acceso** | Usuario (ref) | Presentación (Visitante), registro/login, reinicio de perfil, revocación y eliminación de cuenta. |
| **Onboarding** | Usuario, Consentimiento, CapsulaDePerfil, Personaje (ref) | Produce la cápsula y el consentimiento; no conversa. |
| **Conversación** | Conversacion, Mensaje, Personaje, CapsulaDePerfil (ref), DisponibilidadDelChatbot (ref) | Sostiene el diálogo si el chatbot está habilitado; no persiste; ante peligro cede a Seguridad. |
| **Seguridad** | EventoDeSeguridad, RecursoDeAyuda (ref) | Gate binario + derivación; no depende del LLM. |
| **Administración** | Administrador, DisponibilidadDelChatbot, Usuario (ref) | Directorio (agregado), métricas (vista derivada) y kill switch; no accede a datos individuales ni edita recursos/textos. |

**Matriz de intercambio de objetos (qué OBJETO de dominio cruza cada frontera → qué asociación produce):** esto es el "entrega/recibe" explícito.

| Frontera (vista → vista) | Objeto de dominio que cruza | Asociación resultante en el diagrama |
|---|---|---|
| Onboarding → Conversación | `CapsulaDePerfil`, `Consentimiento` | REL-2, REL-7 (la cápsula orienta la conversación) |
| Conversación → Seguridad | `EventoDeSeguridad` (originado por `Mensaje`) | REL-9 |
| Seguridad → (usuario) | `RecursoDeAyuda` (derivación) | REL-10 |
| Administración → Conversación | `DisponibilidadDelChatbot` (kill switch: habilitado/deshabilitado) | REL-11, REL-12 (condiciona el inicio de conversaciones) |
| Administración → (directorio / métricas) | `Usuario` (vista agregada) y contadores operativos | **Caso de uso / vista derivada** — NO es relación de dominio (no se dibuja `Administrador -- Usuario`) |
| Entorno (deployment) → Seguridad/Onboarding | `RecursoDeAyuda`, textos de *disclosure*/consentimiento, parámetros del gate | Aprovisionados **por entorno** (no por el admin); atributos → reserva §13 |

## 9. Anclaje de calidad candidato (rasgo E8-17)
Cada cualidad nombra su característica **ISO/IEC 25010:2023** candidata (puntero, no métrica; el umbral vive en REQ-01/NORM-01). *No* va al diagrama de dominio (es trazabilidad de calidad).

| Cualidad | Característica 25010:2023 |
|---|---|
| El fallback actúa aunque el LLM falle | Safety §3.9.3 *fail safe* + Reliability |
| Detección de peligro explícito | Safety §3.9.2 *risk identification* |
| Derivación oportuna a recursos | Safety §3.9.4 *hazard warning* |
| Guardas que restringen al LLM | Safety §3.9.1 *operational constraint* |
| Minimización (solo la cápsula) | Security (confidencialidad) |
| Onboarding y chat comprensibles | Interaction capability §3.4 |
| MVP en *free tier* | Flexibility (instalabilidad) |
| Respuesta en tiempo aceptable | Performance efficiency (tiempo) |

## 10. Trazabilidad declarada extremo a extremo (rasgo E8-7)
`VIS-01 (OBJ) → MV-01 (clases/relaciones/reglas) → [skill uml-domain-modeler → modelo de dominio .puml] → casos de uso → robustez → secuencia → pruebas → GQM → evidencias`. El tramo desde el `.puml` en adelante queda **planificado**, no producido (Q2). Los sustantivos del dominio deben **reaparecer por nombre** en el texto de los casos de uso (columna vertebral de trazabilidad).

## 11. Disciplina nominal — tabla de alias (rasgo E8-13)
Un concepto = un nombre. Alias históricos declarados, **no** en uso activo.

| Nombre activo | Alias históricos (macro) | Uso |
|---|---|---|
| **Alan** | Alanus, Alanor | Personaje de activación. |
| **Aura** | Pandora | Personaje de calma. |
| **CapsulaDePerfil** | «PerfilInicialParaLLM» (macro) | Resumen mínimo al LLM. |
| **EventoDeSeguridad** | «monitor de crisis / triaje» (macro, más amplio) | Aquí: evento del gate binario (SEG-01). |

## 12. Glosario integrado (rasgo E8-14)
- **Acompañamiento:** apoyo conversacional no clínico (escuchar, validar, orientar, psicoeducar).
- **CapsulaDePerfil:** objeto de dominio; mínimo dato que orienta la conversación (no historial).
- **Canon de dominio:** principios éticos innegociables (VIS-01 §9).
- **Consentimiento:** registro de aceptación granular y revocable.
- **Conversacion:** sesión efímera de acompañamiento; no persiste.
- **Disclosure:** aviso explícito de que el interlocutor es una IA.
- **EventoDeSeguridad:** ocurrencia de dominio cuando un mensaje presenta peligro explícito.
- **Mensaje:** turno dentro de una conversación.
- **Peligro explícito:** ver RN-11.
- **Personaje / Alan / Aura:** estilo de acompañamiento (no identidad humana).
- **RecursoDeAyuda:** referencia de derivación configurable por entorno.
- **Administrador:** rol de plataforma con 3 funciones (directorio, métricas agregadas, kill switch); no ve datos individuales.
- **DisponibilidadDelChatbot:** estado global habilitado/deshabilitado del servicio; lo controla el administrador (**kill switch**).
- **MétricaDeUso:** dato **agregado** de operación (cuentas, onboardings, llamadas 7d, tasa éxito/error), sin contenido; vista derivada, no clase.
- **Visitante:** persona no autenticada que consulta la presentación antes de registrarse.
- *(Mecanismos —gate, fallback, LLM— y stack se definen en SEG-01/ADR-001; NO son clases de dominio.)*

## 13. Reserva — NO para el diagrama de dominio inicial
En modo *academic strict* estos elementos **se difieren** (regla ICONIX «no attributes / defer multiplicity»); se conservan aquí para el diccionario de datos y el refinamiento posterior.

**13.1 Dominios de valor (atributos candidatos, diferidos):**
`Usuario.{username, alias, contraseña, edad (≥18), esAdulto (bool), versionDisclosure}` · `CapsulaDePerfil.preferenciaDePersonaje ∈ {Alan, Aura, sin_preferencia}` · `CapsulaDePerfil.focoEmocional ∈ {estrés, ánimo bajo, ansiedad, otro}` · `CapsulaDePerfil.tonoPreferido ∈ {cercano, sobrio}` · `Consentimiento.estado ∈ {otorgado, revocado}` · `Conversacion.estado ∈ {activa, cerrada}` · `DisponibilidadDelChatbot.estado ∈ {habilitado, deshabilitado}`. Recursos/textos/parámetros del gate = **configuración por entorno** (no atributos de una clase de dominio).

**13.2 Vista derivada (no clase):** `MétricaDeUso` / `EventoOperativo` = agregados operativos (contadores) que el admin visualiza; se derivan de `Usuario`/`Conversacion`, sin contenido individual.

**13.3 Cardinalidades candidatas (diferidas — una ausencia significa "diferida", no "1"):**
Usuario–Consentimiento (1–1) · Usuario–CapsulaDePerfil (1–0..1) · Usuario–Conversacion (1–0..*) · Conversacion–Mensaje (1–1..*) · Conversacion–Personaje (0..*–1) · Mensaje–EventoDeSeguridad (1–0..1) · EventoDeSeguridad–RecursoDeAyuda (1–1..*) · Administrador–DisponibilidadDelChatbot (1–1) · DisponibilidadDelChatbot–Conversacion (1–0..*).

## 14. Handoff para extracción de dominio (invocación de la skill `uml-domain-modeler`)
**Modo:** *academic strict* — "modelo inicial, para entregar, **sin atributos, sin multiplicidades**, en español, glosario primero". Salida esperada: `.puml` con `@startuml/@enduml`, `hide fields`, `hide methods`, `hide empty members`, `skinparam linetype ortho` (lo produce la skill; **no** se genera en esta fase — Q2).

**Insumos a alimentar (en este orden):**
1. **MV-01** (este archivo) — fuente primaria: §3 candidatos clasificados, §4 relaciones, §8 vistas/intercambio, §11 alias, §12 glosario.
2. **REQ-01** — reglas de negocio tipadas y RF como pistas de asociación/estado (no como clases).
3. **VIS-01** — actores y alcance (frontera del sistema).
> **No** alimentar como clases: ADR-001, PRIV-01, SEG-01 (son restricciones/implementación; pueden citarse como notas de restricción si se pide, no como clases).

**Clases esperadas:** Usuario, Consentimiento, CapsulaDePerfil, Personaje (con `Alan`, `Aura`), Conversacion, Mensaje, EventoDeSeguridad, RecursoDeAyuda, Administrador, **DisponibilidadDelChatbot**.

**Jerarquías/todo-parte esperadas:** `Personaje <|-- Alan`, `Personaje <|-- Aura` (generalización, pasa substitution test); `Conversacion *-- Mensaje` (composición, ciclo de vida). Admin: `Administrador -- DisponibilidadDelChatbot : controla`, `DisponibilidadDelChatbot -- Conversacion : condiciona`. **No** dibujar `Administrador -- Usuario` (directorio/métricas = casos de uso, no relación).

**Actores (no clases):** `Visitante` (consulta la presentación; sin datos de dominio).

**Descartado / vista derivada (no clases):** `Configuracion` (contenedor técnico; recursos/textos por entorno); `MétricaDeUso`/`EventoOperativo` (agregados operativos = vista derivada, §13.2).

**Exclusiones (no son clases de dominio):** LLM/Groq, Django, SQLite, PythonAnywhere; módulo, pantalla, formulario, API, servicio, controlador, base de datos; `gate` y `fallback` (mecanismos); onboarding/chat como procesos o UI; registro/login/eliminar-cuenta como **acciones** (van a casos de uso, no a clases); mensajes de éxito/error; multiplicidades y atributos (reserva §13).

**Trazabilidad:** los sustantivos del dominio deben poder usarse por nombre en los casos de uso posteriores.

## 15. Control documental (rasgo E8-12)
Fecha, versión (externa/interna), autoría y naturaleza en la cabecera. Cierra con marcador de fin real. Cambios en `../00_gobernanza/CHANGELOG.md`; decisiones en `REGISTRO_DECISIONES.md` (SD-13, SD-15).

## 16. Cierre (cuatro cajones)
- **Decisiones confirmadas:** candidatos clasificados §3, relaciones §4, vistas §8, reglas §7; consolidación monolítica (SD-13).
- **Recomendaciones:** invocar la skill en modo *academic strict* con §14; dejar que la skill decida los borderline; llevar cardinalidades/atributos solo al refinamiento posterior.
- **Supuestos:** el onboarding puede reducirse a la cápsula sin perder el valor de acompañamiento (a validar en piloto).
- **Pendientes:** generación del `.puml` (Q2, no hecho); validaciones nivel 6 en VIS-01/ADR-001/PRIV-01.

---

## Checklist E8 — 11 rasgos (verificación) {#checklist}
| Rasgo | Cumple | Evidencia (sección) |
|---|---|---|
| 1 · Parentesco documental | ✅ | §1 |
| 2 · Taxonomía de clasificación | ✅ | §2 (+ §3) |
| 3 · Relaciones tipadas + matriz de cobertura | ✅ | §4 |
| 6 · Fronteras negativas | ✅ | §6 |
| 7 · Trazabilidad declarada | ✅ | §10 |
| 12 · Control documental de cabecera | ✅ | cabecera + §15 |
| 13 · Disciplina nominal (tabla de alias) | ✅ | §11 |
| 14 · Glosario integrado | ✅ | §12 |
| 15 · Reglas tipadas con atributos | ✅ | §7 |
| 16 · Matriz de integración con vistas (+ intercambio de objetos) | ✅ | §8 |
| 17 · Anclaje de calidad candidato (25010:2023) | ✅ | §9 |

**Fin de MV-01.**
