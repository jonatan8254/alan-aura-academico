# 00 — Plan original generado con Codex (fuente primaria, verbatim)
**ID:** PLAN-CODEX-ORIGINAL · **Hogar:** raíz de `subproyecto_academico_alan_aura/` · **Fecha de archivo:** 2026-07-12.
**Naturaleza:** **fuente primaria externa**, insumo del usuario (generado con Codex, rol declarado: *arquitecto principal de software, auditor técnico, analista senior de requisitos y planificador ICONIX*). **Verbatim** — transcrito tal cual lo entregó Codex, solo corrigiendo artefactos de copiado/pegado (entidades HTML, bloques de código fragmentados por el editor de origen). **Ninguna decisión, cifra ni redacción fue alterada.**
**Consumidores:** `00_AUDITORIA_PLAN_CODEX.md` (lo audita), y **todos** los artefactos del subproyecto que citan "plan §X.Y" (VIS-01, MV-01, REQ-01, PRIV-01, SEG-01, CONTRATO, ADR-001, PLAN-01, TRZ-01, MD-01).
**Regla de preservación:** este archivo **no se edita** salvo para corregir errores de transcripción evidentes (ver nota arriba). Es el ancla contra la que se verifican las citas "plan §X.Y" del resto del subproyecto.

---

**Rol usado (declarado por Codex):** arquitecto principal de software, auditor técnico, analista senior de requisitos y planificador ICONIX.

# Plan maestro del subproyecto académico hijo de Smart-AID/TalentTrack

## Resumen ejecutivo

Se creará posteriormente una línea base independiente denominada provisionalmente **"Alan & Aura Académico"**, dentro de la carpeta `subproyecto_academico_alan_aura/`. Será una aplicación web de acompañamiento conversacional no clínico para personas adultas, en español colombiano, con:

- Registro e inicio de sesión de usuario.
- Acceso diferenciado para administrador.
- Confirmación explícita de mayoría de edad.
- Consentimiento, disclosure y advertencias previas.
- Caracterización opcional de cinco preguntas, inferior a dos minutos.
- Selección manual entre Alan y Aura.
- Un único servicio LLM con un prompt común y dos variantes breves de personaje.
- Conversación limitada a la sesión actual, sin persistencia del contenido.
- Tres funciones administrativas: directorio mínimo de usuarios, métricas agregadas y habilitación global del chatbot.
- Seguridad proporcional, privacidad por minimización y fallback textual ante expresiones explícitas de peligro inmediato.
- Repositorio independiente en GitHub.
- Integración continua mediante GitHub Actions.
- Arquitectura monolítica Django desplegable y demostrable mediante un enlace público.
- Uso inicial de un modelo de pesos abiertos consumido mediante la API de Groq.
- PythonAnywhere Free como despliegue académico principal.
- Render Free como despliegue de contingencia, no como infraestructura paralela permanente.

La línea base técnica recomendada será:

```
GitHub
├── repositorio y control de versiones
├── pull requests y revisión
├── issues/backlog
└── GitHub Actions
        │
        ▼
PythonAnywhere Free
├── Django 5.2 LTS
├── plantillas Django
├── JavaScript mínimo
├── autenticación y sesiones Django
├── SQLite
└── aplicación WSGI
        │
        ▼
Groq API
└── openai/gpt-oss-20b
```

La arquitectura de contingencia será:

```
GitHub
        │
        ▼
Render Free
├── Django
├── Gunicorn
└── PostgreSQL temporal
        │
        ▼
Groq API
```

PythonAnywhere Free permite actualmente conectarse a `api.groq.com` porque dicho dominio se encuentra en su allowlist. No obstante, la cuenta gratuita se limita a una aplicación web, un solo worker, 512 MiB de almacenamiento y renovación mensual. Estas restricciones son aceptables para una demostración académica con baja concurrencia, pero no representan una infraestructura profesional.

Render se conservará como contingencia porque permite desplegar desde GitHub y utilizar PostgreSQL, pero su plan gratuito suspende el servicio después de 15 minutos sin tráfico, tarda aproximadamente un minuto en reactivarse, pierde los cambios del filesystem local al reiniciar y las bases PostgreSQL gratuitas expiran 30 días después de su creación.

Django 5.2 se mantiene como rama LTS. Durante la implementación deberá utilizarse el parche más reciente disponible de esa rama, no una versión antigua fijada sin justificación.

`openai/gpt-oss-20b` será el candidato inicial, no una selección irrevocable. Groq lo ofrece actualmente como modelo de pesos abiertos con soporte de generación textual y razonamiento. Su id deberá mantenerse configurable y comprobarse contra el catálogo activo antes del release.

No será una versión corregida ni reducida de D8, D13 o D22. Será un producto hijo con línea base propia. La simplificación no vulnera el trinquete de no degradación porque no reemplaza ningún artefacto del macroproyecto.

**Leyenda de evidencia:**
- `[N1]`: evidencia directa del corpus o configuración.
- `[N2]`: interpretación documental.
- `[N3]`: hecho externo verificado en documentación oficial.
- `[N5]`: propuesta o decisión de este plan.
- `[N6]`: requiere insumo, adopción o validación externa.

Las prescripciones no marcadas de otra forma son decisiones `[N5]`.

---

## 1. Diagnóstico inicial

### 1.1 Problema

El alcance profesional vigente combina onboarding, Santuario, 25 submódulos internos, dos personajes complejos, arquitectura LLM de cuatro planos, guardrails especializados, trazabilidad normativa, memoria, personalización, etapas posteriores y conexiones con el ecosistema Smart-AID/TalentTrack. Ese volumen no cabe razonablemente en un mes para un equipo universitario sin sacrificar integración, pruebas, documentación o calidad.

El riesgo principal no es que el proyecto académico quede "pequeño", sino que quede incompleto:

- Muchos documentos parciales.
- Múltiples módulos inconclusos.
- Una interfaz sin backend completo.
- Una integración LLM que no pueda demostrarse.
- Un despliegue inestable.
- Una arquitectura sobredimensionada.
- Un producto sin trazabilidad entre requisitos, diseño, implementación y pruebas.

El MVP debe priorizar una rebanada vertical completa:

```
registro
→ mayoría de edad
→ consentimiento
→ caracterización mínima
→ selección de personaje
→ conversación
→ respuesta normal o fallback
→ administración técnica
```

### 1.2 Restricciones cerradas

- `[N1]` G1-16 queda resuelta como doble horizonte: cierre académico independiente y continuidad profesional del macroproyecto.
- `[N1]` G1-18 obliga a acotar la Release 0.2 a un subconjunto demostrable.
- `[N1]` Jonatan Estiven Sánchez Vargas conserva propiedad de producto, decisiones funcionales, arquitectura, modelo del dominio e integración final.
- `[N1]` El macroproyecto, su auditoría, corpus, grafo y vault permanecerán intactos.
- `[N5]` El MVP se limita a personas adultas —18 años o más— en Colombia.
- `[N5]` Las pruebas se realizarán con participantes invitados.
- `[N5]` El sistema no se presentará como producto clínico, terapéutico ni profesional de producción.
- `[N5]` El horizonte de ejecución se presupuesta como 20 días laborables.
- `[N5]` Los últimos 2–3 días efectivos se reservan para integración, contingencias y ensayo.
- `[N5]` El costo objetivo inicial de hosting e inferencia será cero.
- `[N5]` Si la infraestructura gratuita compromete la evaluación, podrá autorizarse temporalmente un plan de pago sin cambiar el diseño del dominio.
- `[N5]` El enlace funcional deberá probarse antes de la semana final.
- `[N5]` No se utilizará Ollama, una GPU propia ni inferencia autoalojada en el release académico.
- `[N5]` La aplicación tendrá una sola ruta principal de despliegue y una contingencia documentada.

### 1.3 Evidencia consultada

La planificación parte de:

- El estado vivo en `auditoria_fable5/ESTADO_PIPELINE.md`: auditoría 2.0–2.4 cerrada; construcción profesional `H → K → I → K′ → J` todavía pendiente.
- La secuencia metodológica de D8: dominio → casos de uso → robustez → secuencia → clases → datos.
- El onboarding vigente de D13, D13.1 y D18.
- El modelo verbal y los personajes de D10 y D11.
- La arquitectura profesional de D22.
- Los informes Fable D3, D6/D6-bis, E3–E8, F1–F5, E5 y G1.
- La familia SQuaRE disponible: ISO/IEC 25010, 25020, 25022, 25023, 25024, 25030 y 25040.
- GQM e ISO/IEC/IEEE 15939.
- ICONIX en Rosenberg y Stephens.
- Graphify y vault en lectura, con desambiguación mediante índice y documentos originales.
- La configuración vigente de agentes y subagentes del macroproyecto.

La consulta al grafo y al vault fue ejecutada por `sol_graph_researcher`; los inventarios directos por `luna_scanner`; y los criterios de aceptación fueron contrastados por `sol_auditor`. La integración y las decisiones permanecen en el agente raíz seleccionado por el usuario, conforme a la configuración vigente.

También se verificaron externamente:

- Django 5.2 como versión LTS.
- Disponibilidad de `api.groq.com` en la allowlist gratuita de PythonAnywhere.
- Límites de PythonAnywhere Free: un worker, una aplicación, 512 MiB y expiración mensual.
- Disponibilidad de `openai/gpt-oss-20b` en Groq.
- Límites gratuitos de Groq por modelo y necesidad de verificar los límites exactos de la organización.
- Retención estándar de Groq y opción de Zero Data Retention.
- Restricciones de Render Free.

### 1.4 Criterios de simplificación

1. **Rebanada vertical antes que amplitud:** cada función incluida debe llegar a interfaz, backend, datos, prueba y despliegue.
2. **Lista positiva de alcance:** solo existe lo nombrado como incluido. Todo submódulo profesional no nombrado queda fuera.
3. **Minimización de datos:** no recolectar ni conservar información que no sea necesaria para personalizar mínimamente la sesión.
4. **Una aplicación, una base y un proveedor:** no duplicar servicios sin una necesidad demostrada.
5. **Monolito modular:** separación lógica mediante aplicaciones Django, sin microservicios físicos.
6. **Seguridad proporcional:** mantener límites no clínicos, autorización y fallback, sin reconstruir el motor profesional de crisis.
7. **Trazabilidad corta pero completa:** objetivo → actor → caso de uso → requisito → arquitectura → prueba → backlog.
8. **Calidad mediante criterios verificables:** no mediante reproducción completa de toda la documentación normativa.
9. **Independencia física:** ninguna ejecución del hijo requerirá editar o importar desde el padre.
10. **Portabilidad:** hosting, base y proveedor LLM deben poder reemplazarse mediante configuración.
11. **Infraestructura gratuita con límites explícitos:** no presentar un free tier como equivalente a producción.
12. **Proveedor falso antes que integración tardía:** construir primero el flujo con un adaptador simulado.
13. **No persistir contenido conversacional:** reducir riesgo, almacenamiento y complejidad.
14. **Despliegue temprano:** comprobar la viabilidad real del hosting y la API antes de terminar la construcción.
15. **Consolidación documental:** mantener IDs de trazabilidad sin multiplicar archivos innecesariamente.

### 1.5 Resultado de auditoría del plan anterior

La auditoría ratifica:

- El alcance funcional.
- La encuesta.
- Los personajes.
- La frontera no clínica.
- Las funciones administrativas.
- ICONIX.
- SQuaRE/GQM.
- La ausencia de persistencia del chat.
- El aislamiento del macroproyecto.
- El cronograma de un mes.

La auditoría reemplaza:

| Decisión anterior | Decisión auditada |
|---|---|
| TypeScript | Python |
| Next.js | Django 5.2 LTS |
| React | Plantillas Django + JavaScript mínimo |
| Supabase Auth | Django Auth |
| PostgreSQL/RLS como baseline | SQLite + autorización Django |
| Vercel | PythonAnywhere Free |
| OpenAI API | Groq API |
| `gpt-5.6-terra` | `openai/gpt-oss-20b` como candidato |
| Vitest/React Testing Library | pytest/pytest-django |
| Render como hosting principal | Render como contingencia |
| Registro con correo | Registro con username, alias y contraseña |
| Moderación externa obligatoria | Gate determinista + prompt + pruebas; safeguard opcional posterior |
| Seis llamadas por minuto | Tres llamadas por minuto por usuario |
| Sesenta llamadas diarias | Treinta llamadas diarias por usuario |
| Seis intercambios de historial | Cuatro intercambios de historial |
| Dieciséis documentos físicos | Ocho documentos físicos con dieciséis IDs lógicos |

---

## 2. Delimitación recomendada

### 2.1 Identidad y objetivo

**Nombre funcional:** Alan & Aura Académico.
**Nombre de carpeta:** `subproyecto_academico_alan_aura/`.
**Nombre recomendado del repositorio independiente futuro:** `alan-aura-academico`.

**Objetivo del MVP:** permitir que una persona adulta autenticada complete una caracterización breve y opcional, elija a Alan o Aura y sostenga una conversación de acompañamiento no clínico con un LLM, mientras un administrador gestiona la disponibilidad técnica y observa métricas agregadas sin acceder al contenido sensible.

### 2.2 Actores

#### Actores humanos
- **Visitante:** consulta presentación, límites y accesos.
- **Usuario adulto registrado:** gestiona consentimiento, caracterización y conversación.
- **Administrador de plataforma:** administra disponibilidad y visualiza datos técnicos mínimos.

#### Sistemas externos
- **Proveedor LLM:** Groq; genera texto, pero no es actor clínico ni decisor autónomo.
- **Proveedor de hosting:** PythonAnywhere; aloja la aplicación.
- **Repositorio e integración continua:** GitHub.
- **Hosting de contingencia:** Render.

El proveedor de base de datos no se modelará como actor de caso de uso. SQLite es un mecanismo interno de persistencia, no un actor con objetivos propios.

No existirán actores:
- Profesional de salud.
- Psicólogo.
- Terapeuta.
- RR. HH.
- Organización empleadora.
- Cuidador.
- Operador de emergencias.
- Empresa TalentTrack.
- Administrador clínico.

### 2.3 Alcance funcional definitivo

| Componente | Decisión |
|---|---|
| Registro | Username, alias y contraseña |
| Onboarding | Advertencias, mayoría de edad, disclosure, consentimiento y cinco preguntas |
| Caracterización | Estado autorreportado, energía, objetivo, estilo de respuesta y personaje |
| Alan y Aura | Configuraciones del mismo servicio y modelo |
| Selección de personaje | Manual; no habrá inferencia automática |
| Chat | Texto, una sesión, contexto corto y una respuesta por turno |
| Persistencia de chat | Excluida |
| Usuario | Registro, login/logout, caracterización, chat, reinicio de perfil, revocación y eliminación |
| Administrador | Login separado, directorio mínimo, métricas agregadas y kill switch |
| Seguridad | Gate explícito, prompt común, límites y fallback estático |
| Datos | Cuenta, consentimiento, perfil mínimo, configuración, contadores y eventos operativos |
| Repositorio | GitHub |
| CI | GitHub Actions |
| Despliegue principal | PythonAnywhere Free |
| Base principal | SQLite |
| Proveedor LLM | Groq |
| Modelo inicial | `openai/gpt-oss-20b` |
| Contingencia | Render Free + PostgreSQL |
| Aplicación | Web responsiva; no app móvil ni modo offline |

### 2.4 Únicas capacidades incluidas del chatbot

La lista positiva del hijo será:

1. Autenticación y roles.
2. Confirmación de mayoría de edad.
3. Consentimiento y disclosure.
4. Onboarding mínimo.
5. `ContextoInicialConversacionalV1`.
6. Identidad simplificada de Alan y Aura.
7. Servicio conversacional LLM.
8. Gate de seguridad y fallback.
9. Manejo de errores y cuotas.
10. Administración técnica básica.
11. Métricas operativas sin contenido.
12. Despliegue reproducible.
13. Integración continua.
14. Adaptador de proveedor LLM.

Todo submódulo de D10 §5.11.5 no absorbido explícitamente por estas capacidades queda fuera.

### 2.5 Exclusiones definitivas

Además de las exclusiones obligatorias indicadas por el usuario, quedan fuera:

Santuario completo · Diario · Check-ins · Seguimiento longitudinal · Cajitas · Gamificación · Recompensas · Economía o monetización · Motor de recomendación · Motor de intervención · Technique Cards · Biblioteca psicoeducativa avanzada · Contenido RAG · Embeddings · Vector DB · Búsqueda semántica · Personalización psicométrica · PSS · Big Five · Perfiles triádicos · Puntuaciones · Inferencias profundas · Preguntas de trauma como parte de la caracterización · Historia clínica · Medicación · Diagnóstico · Triaje S0–S5 · Escalas de severidad · Clasificación clínica · Rutas automatizadas · Comunicación automática a terceros · Portal profesional · Teleconsulta · Agenda · Facturación · Sensórica · Wearables · BLE · EEG · PPG · EDA · HRV · Temperatura · IMU · Biofeedback · Neuromodulación · Dispositivos médicos · Analítica avanzada · BI · Observatorio · Predicción o clasificación propia · ML propio · Fine-tuning · MLOps · Federated learning · Data lake · LangGraph · Multiagentes · Juez LLM · Plano asíncrono · Memoria semántica o episódica · Multiempresa · Multitenancy · RR. HH. · Módulos TalentTrack · Comunidad · Red social · Notificaciones · Comunicación entre usuarios · Avatar · Voz · Multimedia · Videollamadas · Aplicación móvil nativa · Modo offline · PWA instalable · Internacionalización avanzada · Edición administrativa de encuestas · Edición administrativa de prompts · CMS · Historial de conversaciones · Recuperación automática de contraseña por correo · Verificación de correo · Ollama · Modelos autoalojados · GPU · AWS como dependencia del release · Releases profesionales 0.3–1.0 · Integración runtime con el macroproyecto · Piloto público · Validación clínica · Afirmación de eficacia terapéutica.

### 2.6 Definición de "MVP terminado"

El MVP solo estará terminado cuando:

- Exista una URL pública reproducible y accesible.
- Exista un repositorio GitHub identificable.
- Exista una versión etiquetada del release.
- GitHub Actions esté en verde.
- Usuario y administrador estén autenticados y autorizados.
- El rol no pueda seleccionarse ni alterarse desde el cliente.
- Se pueda ejecutar el flujo registro → mayoría de edad → consentimiento → encuesta → selección → chat.
- Alan y Aura mantengan diferencias observables sin utilizar servicios distintos.
- El perfil llegue al LLM como contexto estructurado mínimo.
- La conversación ordinaria y sus respuestas no queden almacenadas en la base ni en logs.
- El administrador pueda usar sus tres funciones sin acceder a datos sensibles.
- El sistema maneje indisponibilidad, timeout, cuota y respuesta bloqueada sin romper la interfaz.
- El fallback funcione sobre el banco de casos explícitos.
- Las claves no lleguen al navegador ni al repositorio.
- Se haya verificado la política de retención de Groq.
- El disclosure externo sea correcto.
- Las pruebas críticas estén aprobadas.
- La matriz de trazabilidad no tenga requisitos huérfanos.
- Otro integrante pueda instalar y probar siguiendo la documentación.
- Exista un backup verificable de SQLite.
- La demostración académica pueda repetirse.
- PythonAnywhere haya sido renovado antes de la entrega.
- La contingencia Render esté documentada.
- No exista ninguna modificación del macroproyecto.

---

## 3. Propuesta funcional

### 3.1 Flujo principal del usuario

1. Acceder a la presentación y leer el alcance no clínico.
2. Registrarse con `username`, contraseña y alias.
3. Iniciar sesión por `/login/`.
4. Confirmar ser mayor de 18 años.
5. Leer el disclosure sobre IA y procesamiento externo.
6. Aceptar el procesamiento necesario para utilizar el chat.
7. Aceptar o rechazar la caracterización opcional.
8. Contestar cinco preguntas o continuar sin las opcionales.
9. Confirmar Alan o Aura.
10. Iniciar una sesión de chat.
11. Intercambiar hasta 20 mensajes de usuario.
12. Reiniciar o cerrar la sesión.
13. Borrar la caracterización.
14. Revocar la personalización.
15. Eliminar la cuenta.

No se pedirá: nombre legal · documento · teléfono · dirección · fecha de nacimiento · correo electrónico.

La mayoría de edad se registrará como declaración booleana y versión del disclosure, no como fecha de nacimiento.

### 3.2 Flujo del administrador

1. Acceder por `/plataforma-admin/login/`.
2. Autenticarse con una cuenta aprovisionada previamente.
3. Ser redirigido al panel solo si el servidor confirma `role=admin`.
4. Consultar: directorio mínimo de cuentas · métricas operativas agregadas · estado global del acceso al chatbot.
5. Activar o desactivar temporalmente el chatbot.
6. Cerrar sesión.

El Django Admin técnico vivirá en `/django-admin/`. El Django Admin se reservará para superusuarios técnicos y **no** será el panel funcional que se demuestre como parte del producto.

Un usuario ordinario que visite rutas administrativas recibirá `403` o una redirección segura, incluso si modifica el cliente.

### 3.3 Encuesta inicial definitiva

Tiempo objetivo: menos de dos minutos.

| # | Pregunta concreta | Respuesta | Obligatoria | Atributo construido |
|---|---|---|---|---|
| 1 | ¿Cómo te sientes en este momento? | Muy mal / Mal / Neutral / Bien / Muy bien / Prefiero no responder | No | `mood_self_report` |
| 2 | ¿Cómo está tu energía ahora? | Baja / Media / Alta / Prefiero no responder | No | `energy_self_report` |
| 3 | ¿Qué te gustaría obtener de esta conversación? | Sentirme escuchado / Calmarme / Ordenar ideas / Dar un paso pequeño / Recibir una sugerencia breve / Prefiero no responder | No | `conversation_goal` |
| 4 | ¿Cómo prefieres que te respondan? | Breve y directo / Equilibrado / Pausado y reflexivo / Sin preferencia | No | `response_style` |
| 5 | ¿Con quién quieres conversar en esta sesión? | Alan — práctico / Aura — calmada y reflexiva | Sí para iniciar chat | `character` |

Reglas:
- No se calcula puntuación.
- No se deriva riesgo, personalidad, diagnóstico ni constructo psicométrico.
- "Muy mal" sigue siendo un autorreporte subjetivo, no una señal clínica.
- Las respuestas omitidas no se reemplazan con valores por defecto.
- La selección de personaje no cambia automáticamente.
- El perfil se puede borrar o actualizar.
- Consentimiento, mayoría de edad y disclosure son pasos separados.
- El personaje puede cambiarse al iniciar una nueva sesión.
- La caracterización no se utiliza para bloquear el acceso.

### 3.4 Información que recibe el LLM

```
ContextoInicialConversacionalV1
- schema_version
- mood_self_report?       { value, source: "self_report", collected_at }
- energy_self_report?     { value, source: "self_report", collected_at }
- conversation_goal?      { value, source: "self_report", collected_at }
- response_style?         { value, source: "self_report", collected_at }
- character               { value: "alan" | "aura", source: "user_choice" }
- consent_version
```

El LLM **no** recibe: texto completo de las preguntas · username · alias · ID de usuario · rol · contraseña · historial previo a la sesión actual · puntajes · datos biométricos · datos laborales · datos organizacionales · datos clínicos · campos no respondidos · inferencias construidas por el sistema · fecha de registro · métricas de uso.

### 3.5 Advertencias mínimas

Antes de la encuesta se mostrará:

- Alan y Aura son personajes de una IA, no personas ni profesionales.
- El sistema acompaña y orienta; no diagnostica, hace terapia ni sustituye atención profesional.
- No sirve para manejar emergencias.
- El servicio está limitado a personas adultas.
- Los mensajes y el contexto mínimo serán procesados por Groq como proveedor externo.
- La aplicación académica no guardará el contenido del chat en su propia base de datos.
- La ausencia de almacenamiento interno no equivale a confidencialidad absoluta.
- Groq puede aplicar retención externa según la configuración de la cuenta; esto deberá verificarse antes del release.
- Se recomienda no incluir nombres, documentos, direcciones ni información médica innecesaria.
- En peligro inmediato se debe llamar al `123` o acudir a urgencias.
- Para el despliegue de demostración en Medellín podrán mostrarse la Línea Amiga `106`, la línea fija `(604) 444 44 48` y los canales vigentes, previa revalidación en `AA-G6`. La Alcaldía de Medellín mantiene actualmente la Línea Amiga como servicio de orientación 24/7.
- Para usuarios fuera de Medellín, la aplicación no asumirá que la línea local es idéntica; los recursos deberán configurarse por entorno.

### 3.6 Identidad mínima de los personajes

| Elemento | Alan | Aura |
|---|---|---|
| Función | Activación práctica | Regulación y reflexión |
| Tono | Cercano, directo y dinámico | Cálido, pausado y sereno |
| Respuesta típica | Ayudar a identificar un paso pequeño y realizable | Ayudar a nombrar y ordenar lo sentido |
| Preguntas | Concretas y orientadas a acción | Abiertas pero breves |
| Sugerencias | Una acción opcional de bajo riesgo | Una pausa o reflexión opcional |
| Longitud | Breve | Breve o moderada |
| Límites | Idénticos a Aura | Idénticos a Alan |

Reglas comunes:
- Validar la emoción sin confirmar afirmaciones dañinas o distorsiones.
- No diagnosticar.
- No utilizar etiquetas clínicas.
- No presentarse como humano.
- No prometer mejora, curación o confidencialidad.
- No fomentar dependencia.
- No sugerir exclusividad.
- No desacreditar ayuda humana.
- Recomendar ayuda humana cuando el problema exceda el alcance.
- Ante el fallback, suspender la personalidad ordinaria.
- No usar humor, juego o metáforas en modo de seguridad.
- No acceder a herramientas, web, documentos ni sistemas externos.
- No ofrecer medicamentos.
- No interpretar síntomas como trastornos.
- No tomar decisiones por el usuario.

La configuración se implementará mediante: `bloque común + bloque corto Alan o Aura + contexto mínimo + historial validado + mensaje actual`.

No se implementarán dos agentes.

### 3.7 Rol administrador definitivo

Funciones incluidas, **exactamente tres**:

1. **Visualizar usuarios registrados:** alias, ID truncado, fecha de registro, estado y onboarding completado.
2. **Visualizar métricas agregadas:** total de cuentas, onboarding completados, llamadas al chat durante siete días y tasa técnica de éxito/error.
3. **Habilitar o deshabilitar globalmente el chatbot:** con confirmación y registro de la acción.

El administrador **no** podrá visualizar: username completo si no es necesario · respuestas de encuesta · `ContextoInicialConversacionalV1` · mensajes · respuestas · personaje elegido por usuario · motivos individuales de fallback · conteos por usuario · datos de moderación · contraseñas · tokens · claves · exportaciones individuales · datos para RR. HH.

No habrá: CMS · edición de preguntas · edición de prompts · suspensión individual · segmentación sensible · exportación masiva · visualización de conversaciones.

### 3.8 Fallback de seguridad

La exclusión de triaje significa: sin escala S0–S5 · sin clasificación clínica · sin estimación de severidad · sin diagnóstico · sin notificación a terceros · sin decisiones sobre hospitalización · sin registro individual para el administrador · sin intervención automatizada · sin afirmar detección exhaustiva.

Ante lenguaje explícito y directo de peligro inmediato o autolesión:

1. Se suspende la respuesta ordinaria.
2. No se interpreta clínicamente.
3. No se realizan preguntas exploratorias clínicas.
4. Se muestra un mensaje fijo.
5. Se orienta a emergencias y apoyo humano.
6. Se devuelve `mode=safety_fallback`.
7. La interfaz bloquea el chat ordinario para esa sesión.
8. El usuario puede iniciar posteriormente una sesión nueva.
9. El contenido no se almacena.
10. No se contabiliza una clasificación de riesgo.

Texto base:
> No puedo atender una emergencia. Si existe peligro inmediato, llama al 123 o acude al servicio de urgencias más cercano. Si estás en Medellín, también puedes comunicarte con la Línea Amiga 106. Si puedes hacerlo con seguridad, contacta ahora a una persona de confianza.

El texto y los recursos deberán revalidarse en el gate de release.

---

## 4. Propuesta técnica

### 4.1 Alternativas y decisión

| Alternativa | Evaluación | Decisión |
|---|---|---|
| Django + PythonAnywhere Free + SQLite + Groq | Menor complejidad, URL pública, persistencia local, autenticación integrada y costo inicial cero | **Recomendada** |
| Django + Render Free + PostgreSQL + Groq | Integración automática con GitHub y PostgreSQL; cold start, filesystem efímero y BD gratuita de 30 días | Contingencia |
| Django + PythonAnywhere pago + Groq | Más workers y acceso saliente sin restricciones; requiere pago | Contingencia económica |
| Next.js + Supabase + OpenAI | Buen frontend, pero mayor distribución de responsabilidades y costo de API | Reemplazada |
| React/Vite + Django REST | Dos aplicaciones, CORS y más integración | Rechazada |
| Django + PostgreSQL en AWS | Robusto, pero más DevOps y costo | Futuro |
| AWS + Bedrock | Inferencia administrada, pero mayor complejidad | Futuro |
| AWS + Ollama | GPU/RAM, mantenimiento y costo fijo | Rechazada |
| Flutter + backend | No se necesita cliente móvil | Rechazada para el mini proyecto |
| Streamlit | Insuficiente para roles, UX y arquitectura | Rechazada |
| GitHub Pages | No ejecuta Python ni Django | Solo documentación estática |
| Solo repositorio GitHub | No entrega enlace funcional | Insuficiente |
| D22/LangGraph | Excede G1-18 y el plazo | Rechazada |

### 4.2 Stack recomendado

Lenguaje: Python. Framework: Django 5.2 LTS (último parche disponible). Arquitectura: monolito modular. Interfaz: plantillas Django, HTML semántico, CSS y JavaScript mínimo. Backend: vistas Django y servicios internos. Validación: Django Forms y validadores explícitos. Autenticación: `django.contrib.auth`. Modelo de usuario: personalizado desde la primera migración. Base principal: SQLite. Proveedor LLM: Groq. Modelo candidato: `openai/gpt-oss-20b`. SDK: cliente oficial de Groq o cliente HTTP controlado. Pruebas: pytest, pytest-django y Playwright. Lint/formato: Ruff. Repositorio: GitHub. CI: GitHub Actions. Despliegue: PythonAnywhere Free. Contingencia: Render Free + PostgreSQL. Servidor principal: WSGI administrado por PythonAnywhere. Servidor de contingencia: Gunicorn.

**Sin:** Django REST Framework, React, Celery, Redis, Channels, WebSockets, streaming o Docker obligatorio.

### 4.3 Proveedor y modelo LLM

**Proveedor base:** Groq. **API:** Chat Completions compatible con OpenAI o Responses API de Groq, según el soporte validado durante implementación. **Modelo candidato inicial:** `openai/gpt-oss-20b`.

El modelo: se consume mediante API · no se descarga · no requiere Ollama · no requiere GPU · es de pesos abiertos · debe superar el banco de evaluación · se configura mediante `LLM_MODEL` · se verifica antes del release mediante el catálogo activo · puede reemplazarse sin modificar el dominio.

Groq documenta actualmente el modelo como una arquitectura MoE de 20B parámetros orientada a despliegue eficiente y flujos de razonamiento.

Decisión de versionado:
1. Evaluar `openai/gpt-oss-20b`.
2. Registrar resultados.
3. Fijar el ID mediante variable de entorno.
4. Verificar el modelo activo antes de desplegar.
5. Repetir evaluaciones ante cualquier cambio.
6. No usar `llama-3.1-8b-instant` como baseline principal.
7. No cambiar de modelo directamente en producción.
8. No afirmar equivalencia con modelos propietarios más grandes.

### 4.4 Arquitectura lógica

```
Navegador
  ├─ presentación pública
  ├─ autenticación
  ├─ onboarding y consentimiento
  ├─ chat y contexto efímero
  └─ panel administrativo
        │
        ▼
Django monolítico
  ├─ accounts
  ├─ onboarding
  ├─ conversation
  ├─ platform_admin
  ├─ core
  ├─ autorización y sesiones
  ├─ compositor de prompt
  ├─ safety gate
  ├─ adaptador LLM
  └─ telemetría técnica
        │
        ├────────► SQLite
        │
        └────────► Groq API
                      └─ openai/gpt-oss-20b
```

No existirán: colas · workers propios · brokers · caché distribuida · motor de agentes · microservicios · vector DB · servicio de moderación separado obligatorio · servicio de memoria.

### 4.5 Aplicaciones Django y responsabilidades

**`accounts`** — modelo de usuario, registro, login, logout, roles, eliminación de cuenta, autorización.
**`onboarding`** — mayoría de edad, disclosure, consentimiento, encuesta, perfil mínimo, actualización, revocación.
**`conversation`** — interfaz de chat, endpoint, historial efímero, composición del prompt, personajes, gate de seguridad, proveedor LLM, fallback, telemetría.
**`platform_admin`** — panel funcional, directorio mínimo, métricas, kill switch, acciones administrativas.
**`core`** — configuración, interfaces, excepciones, logging, health check, utilidades, constantes.

### 4.6 Responsabilidades frontend y backend

**Frontend:** renderizar formularios y estados · mantener el historial solo en memoria · enviar roles `user/assistant` · mostrar indicadores de espera · evitar doble envío · gestionar `client_request_id` · descartar la conversación al reiniciar o cerrar · **no** construir el prompt · **no** decidir permisos · **no** almacenar claves · **no** persistir localmente el chat.

**Backend:** validar sesión, rol, mayoría de edad y consentimiento · aplicar límites · cargar el perfil desde SQLite · no confiar en el perfil del navegador · construir instrucciones · filtrar el historial · ejecutar el gate · consultar Groq · validar la salida · registrar telemetría sin contenido · proteger rutas · eliminar datos.

### 4.7 Modelo de usuario y autorización

Se definirá un usuario personalizado antes de la primera migración. `Role = "user" | "admin"`.

Separación: `role` (rol funcional del producto) · `is_staff` (acceso al Django Admin) · `is_superuser` (administración técnica excepcional).

Reglas: el formulario público no acepta `role` ni `is_staff` · el administrador se crea mediante procedimiento controlado · el rol se verifica en cada vista administrativa · la interfaz nunca es la única barrera · la cuenta admin no se registra públicamente · las contraseñas se gestionan con Django.

### 4.8 Interfaz del proveedor LLM

```
class LLMProvider:
    def generate(self, request):
        ...
```

Implementaciones: `GroqLLMProvider`, `FakeLLMProvider`, `UnavailableLLMProvider`.

`FakeLLMProvider` será obligatorio para: pruebas · desarrollo · errores · reproducibilidad · trabajo sin cuota · construcción del flujo antes de integrar Groq.

No se implementarán en el MVP: `OpenAIProvider` · `BedrockProvider` · `OllamaProvider` · `GitHubModelsProvider`. Podrán añadirse después sin cambiar casos de uso si respetan el contrato.

### 4.9 Interfaces públicas mínimas

Tipos:
```
Role = "user" | "admin"
Character = "alan" | "aura"
ChatMode =
  "normal"
  | "safety_fallback"
  | "service_fallback"
  | "chat_disabled"
  | "rate_limited"
```

`ChatRequestV1`:
```json
{
  "character": "alan",
  "message": "Texto",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "client_request_id": "uuid"
}
```

Restricciones: `message` máximo 1.500 caracteres · `history` máximo cuatro intercambios · no se aceptan roles `system` ni `developer` · no se acepta perfil desde el cliente · no se acepta prompt desde el cliente · máximo 20 mensajes de usuario por sesión · el historial se considera entrada no confiable · la autorización no depende del historial.

`ChatResponseV1`:
```json
{
  "reply": "Texto",
  "mode": "normal",
  "request_id": "uuid",
  "prompt_version": "aa-1.0",
  "model": "openai/gpt-oss-20b"
}
```

Endpoints:

| Método y ruta | Responsabilidad |
|---|---|
| `POST /registro/` | Crear usuario |
| `POST /login/` | Iniciar sesión |
| `POST /logout/` | Cerrar sesión |
| `POST /onboarding/` | Guardar consentimiento y perfil |
| `POST /perfil/reiniciar/` | Borrar caracterización |
| `POST /cuenta/eliminar/` | Eliminar cuenta |
| `POST /api/chat/` | Ejecutar conversación |
| `GET /plataforma-admin/` | Panel administrativo |
| `POST /plataforma-admin/chat-access/` | Cambiar kill switch |
| `GET /health/` | Verificar despliegue |

### 4.10 Composición del prompt

Una llamada recibirá: (1) bloque de alcance (acompañamiento no clínico); (2) bloque de seguridad (prohibiciones y límites); (3) bloque de respuesta (reconocer, aclarar, proponer máximo un paso y cerrar brevemente); (4) bloque de personaje (Alan o Aura); (5) contexto inicial (datos categóricos no instructivos); (6) historial (máximo cuatro intercambios); (7) mensaje actual.

Reglas: el prompt se versionará en código · el administrador no podrá editarlo · los datos de usuario se delimitarán · los datos no podrán reemplazar instrucciones · no se incluirán herramientas · no se permitirá web search · no se expondrá razonamiento interno · solo se utilizará el contenido final de respuesta · la salida se limitará a 350 tokens.

### 4.11 Flujo técnico de una conversación

1. Validar sesión. 2. Verificar rol. 3. Verificar mayoría de edad. 4. Verificar consentimiento. 5. Comprobar kill switch. 6. Aplicar rate limit. 7. Validar longitud y estructura. 8. Cargar el perfil. 9. Ejecutar gate determinista. 10. Si corresponde, devolver fallback. 11. Construir prompt. 12. Invocar Groq. 13. Verificar existencia de respuesta. 14. Extraer únicamente contenido final. 15. Aplicar postvalidación básica. 16. Sustituir salida insegura por fallback. 17. Registrar latencia, modelo, versión y estado técnico. 18. Devolver respuesta.

### 4.12 Gate y seguridad conversacional

El gate: detectará únicamente expresiones explícitas y directas · no será un clasificador clínico · no intentará estimar severidad · no se presentará como detección exhaustiva · devolverá un fallback fijo · será probado contra falsos positivos y falsos negativos básicos.

Capas: `entrada → validación → gate explícito → prompt común → Groq → postvalidación → respuesta o fallback`.

Un modelo especializado como `openai/gpt-oss-safeguard-20b` podrá evaluarse posteriormente, pero no será obligatorio para el MVP porque introduciría una segunda llamada, mayor consumo y más complejidad. Groq ofrece actualmente ese modelo como clasificador de políticas, pero su adopción requeriría una ADR independiente.

### 4.13 Manejo de errores y límites

Límites locales: 3 solicitudes por minuto por usuario · 30 solicitudes por día por usuario · 20 mensajes por sesión · 4 intercambios de historial · 1.500 caracteres de entrada · 350 tokens de salida · 20 segundos de timeout.

Groq publica actualmente para `openai/gpt-oss-20b` un nivel gratuito base de 30 RPM, 1.000 RPD, 8.000 TPM y 200.000 TPD, aunque los límites exactos deben comprobarse en la organización porque pueden existir excepciones o cambios.

| Condición | Resultado |
|---|---|
| Sesión ausente | `401` |
| Permiso insuficiente | `403` |
| Entrada inválida | `400` |
| Chat deshabilitado | `409` |
| Límite superado | `429` |
| Proveedor no disponible | `502` |
| Timeout | `504` |
| Riesgo explícito | `200` + `safety_fallback` |

Reglas: máximo un reintento para fallos transitorios · no superar el timeout total · respetar `Retry-After` · el reintento visible será manual · no duplicar mensajes · no retornar errores crudos · no mostrar stack traces, claves, el prompt ni metadatos de razonamiento.

### 4.14 Almacenamiento y retención

Entidades previstas: `User` · `ConsentRecord` · `InitialConversationProfile` · `PlatformSetting` · `DailyUsageCounter` · `OperationalEvent` · `AdministrativeAction`.

No existirán: `Conversation` · `Message` · `Diagnosis` · `RiskScore` · `PsychometricResult` · `Intervention`.

| Información | Persistencia | Acceso | Retención |
|---|---|---|---|
| Cuenta y rol | Sí | Usuario y backend | Hasta eliminación o cierre + 30 días |
| Alias | Sí | Usuario y backend | Igual que cuenta |
| Consentimiento | Sí | Usuario y backend | Igual que cuenta |
| Perfil mínimo | Sí | Usuario y servicio | Hasta reinicio o eliminación |
| Contenido del chat | No | Memoria de la pestaña | Fin de sesión |
| Contador diario | Sí | Backend | Máximo 30 días |
| Evento técnico | Sí, sin contenido | Backend; admin agregado | 30 días |
| Kill switch | Sí | Backend/admin | Vigencia |
| Acción admin | Sí | Auditoría técnica | Curso + 30 días |
| Riesgo individual | No | No disponible | No persistir |

Groq informa una retención estándar de 30 días y permite gestionar Zero Data Retention desde Data Controls. Antes del release deberá verificarse si ZDR está activado realmente; si no lo está, el disclosure deberá declararlo sin prometer retención cero.

### 4.15 Telemetría

Un evento podrá almacenar: timestamp · request ID · resultado técnico · latencia · modelo · versión de prompt · código de estado · entorno.

No almacenará: mensaje · respuesta · perfil · alias · username · motivo textual del fallback · texto de error del proveedor · categoría emocional.

### 4.16 Variables de entorno

```
DJANGO_SETTINGS_MODULE
DJANGO_SECRET_KEY
DJANGO_DEBUG
ALLOWED_HOSTS
CSRF_TRUSTED_ORIGINS
SQLITE_PATH
GROQ_API_KEY
LLM_PROVIDER
LLM_MODEL
LLM_TIMEOUT_SECONDS
PROMPT_VERSION
CHAT_RATE_LIMIT_PER_MINUTE
CHAT_DAILY_CAP
CHAT_MAX_USER_MESSAGES
CHAT_MAX_MESSAGE_CHARS
CHAT_MAX_HISTORY_TURNS
CHAT_MAX_OUTPUT_TOKENS
EMERGENCY_PHONE
MENTAL_HEALTH_SUPPORT_PHONE
MENTAL_HEALTH_SUPPORT_LABEL
APP_BASE_URL
DEPLOYMENT_ENVIRONMENT
```

Reglas: `.env.example` contiene nombres, no valores · `GROQ_API_KEY` solo se usa en servidor · la clave no llega al navegador · los secretos no se versionan · los logs no imprimen valores · desarrollo y demo utilizan configuraciones separadas cuando sea viable · el administrador se crea mediante comando controlado, no credenciales permanentes en `.env`.

### 4.17 Seguridad mínima obligatoria

Django 5.2 LTS actualizado · `DEBUG=False` · `SECRET_KEY` externa · HTTPS · `ALLOWED_HOSTS` · `CSRF_TRUSTED_ORIGINS` · cookies `Secure`/`HttpOnly`/`SameSite` · protección CSRF · autorización en servidor · modelo de usuario personalizado · consultas ORM · formularios Django · CSP básica · cabeceras de seguridad · prohibición de HTML no sanitizado · rate limiting · logs sin contenido · dependencias fijadas · análisis de vulnerabilidades · `manage.py check --deploy` · pruebas negativas · backup de SQLite · eliminación en cascada · cero uso punitivo · cero uso para RR. HH.

### 4.18 Frontend

El chat: usará `fetch` · no recargará la página · mantendrá historial en memoria · mostrará estado de espera · deshabilitará envío durante la petición · permitirá reintento manual · evitará duplicados · borrará historial al reiniciar · no implementará streaming · no almacenará en `localStorage`/`sessionStorage` · no usará React ni una SPA.

### 4.19 GitHub y CI

GitHub será obligatorio para: control de versiones · pull requests · issues · backlog · revisión por pares · releases · etiquetas · evidencia · enlace a despliegue · GitHub Actions.

GitHub Pages no ejecutará la aplicación Django; podrá utilizarse únicamente para documentación estática. GitHub describe Pages como alojamiento estático, no como runtime Python.

Pipeline: checkout → instalar Python → instalar dependencias → Ruff check → verificación de formato → `manage.py check` → comprobar migraciones → pruebas unitarias → pruebas de integración → cobertura → E2E críticas posteriormente → bloquear merge cuando falle.

El despliegue principal en PythonAnywhere será controlado: `CI verde → merge → git pull en PythonAnywhere → migraciones → collectstatic → reload → smoke test`.

### 4.20 Despliegue principal: PythonAnywhere

```
PythonAnywhere Free
├── Django WSGI
├── virtualenv
├── SQLite
├── static files
├── Groq API
└── URL *.pythonanywhere.com
```

Ventajas: menor complejidad · enlace público · hosting orientado a Python · filesystem persistente · SQLite disponible · `api.groq.com` en allowlist · no hay cold start documentado como el de Render · no requiere Nginx ni Gunicorn propios.

Restricciones: un solo worker · una sola aplicación · 512 MiB · expiración mensual · acceso externo restringido · baja concurrencia · despliegue manual · sin SLA.

Cada worker atiende una sola petición a la vez; las cuentas gratuitas disponen de uno. Una llamada LLM prolongada puede bloquear temporalmente otras solicitudes.

Controles: renovar antes de la exposición · probar Groq en el hosting real · mantener pocos usuarios simultáneos · limitar solicitudes · backup diario durante semana 4 · mantener fixtures · vigilar cuota de disco · probar reload · ejecutar smoke test · no presentarlo como producción.

### 4.21 Contingencia: Render

Render se activará si: PythonAnywhere falla · la concurrencia requerida supera un worker · se necesita demostrar PostgreSQL · se prefiere despliegue automático · el equipo acepta el cold start · se autoriza migración.

```
Render Free
├── Django
├── Gunicorn
├── PostgreSQL
├── GitHub deploy
└── Groq
```

Controles: no usar SQLite · crear PostgreSQL cerca de la entrega · registrar fecha de expiración · exportar datos · abrir la app antes de la demo · medir cold start · no depender del filesystem · preparar variables · mantener migraciones portables.

### 4.22 Banco de evaluación LLM

Mínimo 30 casos:

| Grupo | Casos |
|---|---|
| Conversaciones ordinarias | 8 |
| Diferencia Alan/Aura | 6 |
| Límites no clínicos | 6 |
| Dependencia emocional | 3 |
| Inyección de prompt | 3 |
| Peligro explícito | 4 |

Criterios: seguimiento de instrucciones · brevedad · español natural · coherencia · diferencia de personajes · ausencia de diagnóstico · ausencia de promesas · ausencia de dependencia · respeto del fallback · latencia · estabilidad.

El modelo solo se aprobará si supera los umbrales acordados.

### 4.23 Calidad SQuaRE/GQM adaptada

| Objetivo GQM | Pregunta | Métrica/umbral inicial `[N5]` |
|---|---|---|
| Flujo funcional | ¿Puede llegar al primer mensaje? | 100 % de CU P0 pasan E2E |
| Calidad en uso | ¿Puede completar sin ayuda? | 4/5 testers |
| Onboarding | ¿Es breve? | Mediana ≤2 min |
| Rendimiento | ¿La respuesta llega a tiempo? | p95 ≤15 s |
| Fiabilidad | ¿Los fallos quedan controlados? | 100 % de escenarios previstos |
| Seguridad | ¿Cada actor ve lo permitido? | 100 % de negativas denegadas |
| Privacidad | ¿Se evita guardar el chat? | Cero contenido en BD y logs |
| Safety | ¿El peligro explícito suspende el flujo? | 100 % del banco explícito |
| Mantenibilidad | ¿Otro integrante reproduce? | Instalación sin ayuda directa |
| Portabilidad | ¿Puede cambiarse hosting? | Migración documentada |
| Calidad de datos | ¿El perfil es válido? | 100 % de campos validados |
| Reproducibilidad | ¿Se reconstruye el release? | Sí, desde tag |
| Disponibilidad académica | ¿El enlace funciona para la demo? | Smoke test aprobado |

Anclajes: ISO/IEC 25010:2023 · 25020 · 25022 · 25023 · 25024 · 25030 · 25040 · ISO/IEC/IEEE 15939 · GQM.

Los umbrales son objetivos, no resultados ni certificación ISO.

### 4.24 Controles profesionales aplazados

| Mínimo académico | Aplazado al macroproyecto |
|---|---|
| Django monolítico | Arquitectura profesional multi-plano |
| SQLite | PostgreSQL profesional |
| Un adaptador Groq | Estrategia multiproveedor |
| Prompt común | Orquestación avanzada |
| Gate explícito | Guardián especializado |
| Contexto breve | Memoria profunda |
| Banco de 30 casos | Harness calibrado |
| PythonAnywhere | AWS |
| GitHub Actions básico | DevSecOps completo |
| Logs técnicos | SIEM/SRE |
| Adultos invitados | Despliegue ciudadano |
| Un worker | Alta disponibilidad |
| Disclosure | Validación legal integral |

---

## 5. Delimitación documental

### 5.1 Paquete de artefactos futuros

Cada artefacto deberá declarar: `ID · hogar · insumos · consumidores · propietario · dependencias · estado · changelog · DoD`.

| Orden | ID | Artefacto | Contenido y cierre |
|---|---|---|---|
| 1 | GOV-00 | Gobierno y rehidratación | README, AGENTS, CLAUDE, `.codex`, índice, cápsula, estado, changelog y fuentes |
| 2 | VIS-01 | Visión, objetivos y alcance | Problema, actores, funciones, exclusiones y DoD |
| 3 | ADR-001 | Decisiones técnicas | Django, SQLite, Groq, GitHub, PythonAnywhere y Render |
| 4 | MV-01 | Modelo verbal mínimo | Glosario, onboarding, conversación y administración |
| 5 | UX-01 | Diseño de experiencia | Flujos, wireframes, encuesta, disclosure, errores y accesibilidad |
| 6 | REQ-01 | Requisitos | Máximo 18 RF, 12 RNF, 15 RB y 8 requisitos de calidad |
| 7 | PRIV-01 | Datos y seguridad | Inventario, permisos, retención, amenazas y controles |
| 8 | TRZ-01 | Matriz maestra | Objetivo → CU → requisito → calidad → arquitectura → prueba |
| 9 | ICONIX-01A | Dominio inicial | Conceptos y relaciones |
| 10 | ICONIX-01B | Casos de uso | Máximo seis CU |
| 11 | ICONIX-01C | Robustez | BCE de flujos P0 |
| 12 | ICONIX-01D | Secuencias | Responsabilidades y dominio actualizado |
| 13 | ARQ-01 | Arquitectura | Django, datos, LLM, endpoints, seguridad y despliegue |
| 14 | QA-01 | Estrategia de pruebas | Unitarias, integración, E2E, seguridad, privacidad y evals |
| 15 | PLAN-01 | Ejecución | Backlog, responsables, riesgos, DoR y DoD |
| 16 | OPS-01 | Operación | Instalación, despliegue, backup, demo y reversa |

### 5.2 Consolidación física recomendada

Los 16 IDs se conservarán, pero podrán vivir en ocho archivos: `GOV-00_gobierno.md` · `PRODUCTO_VIS_MV_UX.md` · `REQ_PRIV_TRZ.md` · `ICONIX.md` · `ADR_ARQ.md` · `QA-01_pruebas.md` · `PLAN-01_ejecucion.md` · `OPS-01_operacion.md`. Esto reduce carga documental sin perder trazabilidad.

### 5.3 Casos de uso presupuestados

1. `CU-01` — Registrarse, iniciar y cerrar sesión.
2. `CU-02` — Gestionar consentimiento y caracterización.
3. `CU-03` — Iniciar sesión conversacional y elegir personaje.
4. `CU-04` — Conversar y recibir respuesta normal, segura o de error.
5. `CU-05` — Reiniciar perfil, revocar consentimiento o eliminar cuenta.
6. `CU-06` — Administrar la plataforma.

Las historias de usuario se derivarán después de casos de uso y robustez. No sustituirán los casos de uso.

### 5.4 Fuentes del macroproyecto que solo se consultarán

| Familia | Uso |
|---|---|
| D8 | Tailoring ICONIX |
| D10/D11 | Personajes, límites y administración |
| D13/D13.1/D18 | Consentimiento y contexto |
| D15 | Gates y riesgos |
| D22 | Principios, no arquitectura completa |
| D3 | Privacidad y roles |
| D6/D6-bis | SQuaRE y GQM |
| E3/E4 | Seguridad conversacional |
| E5/E6/E8 | Priorización |
| F1–F5 | Justificación del recorte |
| G1/G2/G3 | Decisiones |

No se responderá `G1bis_formulario_decisiones.md`.

### 5.5 Artefactos Fable que no se trasladan

H/K/K′/I/J · F6 completo · modelo verbal de 17 rasgos · S0–S5 · maestro completo de personajes · matriz de 25 submódulos · Technique Cards · Releases 0.3–1.0 · harness profesional · registros regionales · correcciones del padre.

### 5.6 Preparación del futuro modelo del dominio

Antes de `ICONIX-01A` deben cerrarse: VIS-01 · glosario · actores · registro sin correo · roles · encuesta · contrato de contexto · funciones admin · no persistencia · fronteras navegador/Django/Groq · datos · requisitos · wireframes · convención de IDs · decisión Django · decisión SQLite · decisión PythonAnywhere · decisión Groq · contingencia Render.

Conceptos: cuenta · rol · consentimiento · declaración de mayoría de edad · perfil conversacional · personaje · sesión transitoria · mensaje transitorio · configuración · contador de uso · evento operativo · acción administrativa · proveedor LLM · solicitud conversacional.

Trazabilidad: `concepto → MV-01 → requisito/regla → caso de uso → robustez → secuencia → módulo Django → prueba`.

El esquema Django no se diseña definitivamente antes de secuencias y actualización del dominio.

---

## 6. Estructura aislada

### 6.1 Árbol propuesto

```
subproyecto_academico_alan_aura/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── CHANGELOG.md
├── LICENSE
├── .env.example
├── .gitignore
├── pyproject.toml
├── requirements.txt
├── requirements-dev.txt
├── manage.py
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .codex/
│   ├── config.toml
│   ├── hooks.json
│   └── agents/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/
│   ├── onboarding/
│   ├── conversation/
│   ├── platform_admin/
│   └── core/
├── templates/
├── static/
├── data/
│   └── .gitkeep
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   └── llm_evals/
├── scripts/
│   ├── seed_demo.py
│   ├── backup_sqlite.py
│   ├── restore_sqlite.py
│   └── smoke_test.py
├── docs/
│   ├── 00_gobernanza/
│   ├── 01_producto/
│   ├── 02_requisitos/
│   ├── 03_ux_iconix/
│   ├── 04_arquitectura/
│   ├── 05_privacidad_seguridad/
│   ├── 06_calidad_pruebas/
│   └── 07_planificacion_operacion/
└── knowledge/
    ├── MANIFIESTO_FUENTES.md
    ├── corpus_curado/
    ├── graphify-out/
    └── vault_obsidian/
```

`graphify-out/` y `vault_obsidian/` no existirán durante la ruta crítica.

### 6.2 Rehidratación propia

`INDICE_MAESTRO.md` · `CAPSULA_CONTEXTO.md` · `ESTADO_PIPELINE.md` · `REGISTRO_DECISIONES.md` · `MANIFIESTO_PROCEDENCIA.md` · `CHANGELOG.md` · `AGENTS.md` · `CLAUDE.md`.

Orden: 1. `AGENTS.md` 2. `ESTADO_PIPELINE.md` 3. `CAPSULA_CONTEXTO.md` 4. `INDICE_MAESTRO.md` 5. `VIS-01` 6. `ADR-001` 7. `TRZ-01` 8. Artefacto específico.

### 6.3 Reglas heredadas

Se heredarán: nomenclatura Alan · no diagnóstico · no terapia · seguridad sobre engagement · minimización · no uso punitivo · evidencia por niveles · barrera contra fabricación · preservación · trazabilidad · cero huérfanos · responsabilidades de agentes existentes.

No se heredarán como alcance: 25 submódulos · releases profesionales · H/K/I/K′/J · rutas del grafo padre · pipeline de auditoría padre · decisiones técnicas abiertas del padre · arquitectura D22 completa.

### 6.4 Configuración propia de agentes

`.codex/config.toml` no fijará modelo raíz · el selector del chat será el mando principal · `max_threads=4` · profundidad uno · perfiles existentes sin redefinir · Graphify solo obligatorio cuando exista grafo hijo · ningún agente editará el padre · la implementación solo podrá comenzar tras `AA-G4`.

### 6.5 Extracción a repositorio independiente

Condiciones: cero imports hacia el padre · cero rutas absolutas obligatorias · sin symlinks · variables propias · SQLite propia · Groq key propia · repositorio GitHub propio · dependencias fijadas · migraciones propias · datos semilla propios · documentación propia · licencia definida · prueba de extracción limpia · backup y restauración verificables · contingencia PostgreSQL documentada.

---

## 7. Estrategia de grafo y vault propios

### 7.1 Viabilidad

Es viable que el hijo tenga grafo, vault y rehidratación propios, pero no forman parte de la ruta crítica.

### 7.2 Estrategia recomendada

**Grafo final:** extracción nueva desde corpus curado. No podar directamente el grafo padre porque contiene: versiones reemplazadas · comunidades desconectadas · aristas inferidas · rutas absolutas · fragmentación · conceptos fuera de alcance.

### 7.3 Fuentes permitidas

1. Artefactos vigentes del hijo. 2. Resúmenes derivados de D8, D10, D11, D13, D18 y D22. 3. Matrices de procedencia. 4. Resúmenes normativos. 5. Fuentes externas con licencia revisada. 6. ADRs y requisitos propios. 7. Código y pruebas relevantes una vez estabilizados.

No copiar: normas completas · libros · vault padre · grafo padre completo · documentos históricos reemplazados.

### 7.4 Posibilidad de subgrafo semilla

1. Allowlist. 2. Verificar esquema. 3. Copiar a carpeta hija. 4. Filtrar nodos. 5. Filtrar aristas. 6. Eliminar rutas. 7. Marcar `SEED_DERIVADO_NO_CANONICO`. 8. Sustituir por extracción propia.

### 7.5 Denylist

Sensórica · biomarcadores · TalentTrack · telemedicina · clínico · NMA · dispositivos · multiagentes · LangGraph · RAG · releases futuras · RR. HH. · menores · Fable no adaptado · arquitectura profesional no seleccionada.

### 7.6 Proceso posterior

1. Congelar índice. 2. Crear manifiesto. 3. Revisar fuentes. 4. Autorizar extracción. 5. Ejecutar Graphify dentro del hijo. 6. Generar vault. 7. Validar procedencia. 8. Buscar contaminación. 9. Publicar reporte. 10. Congelar snapshot.

---

## 8. Secuencia de construcción

### 8.1 Fases y gates propios

| Fase | Salidas | Gate |
|---|---|---|
| 0. Aislamiento | Carpeta, repo y gobierno | `AA-G0` |
| 1. Producto | VIS-01, ADR-001, MV-01 | `AA-G1` |
| 2. Requisitos y UX | UX-01, REQ-01, PRIV-01, TRZ-01 | `AA-G2` |
| 3. ICONIX preliminar | Dominio, CU y robustez | `AA-G3` |
| 4. Diseño detallado | Secuencias, dominio, arquitectura y datos | `AA-G4` |
| 5. Construcción | Flujo vertical y staging | `AA-G5` |
| 6. Release | Pruebas, enlace y demo | `AA-G6` |
| 7. Conocimiento | Grafo y vault | Posterior |

### 8.2 Orden metodológico

1. Aislamiento. 2. Procedencia. 3. Visión. 4. ADR. 5. Modelo verbal. 6. UX. 7. Requisitos. 8. Privacidad. 9. Dominio. 10. Casos de uso. 11. Refinamiento. 12. Robustez. 13. Revisión. 14. Secuencias. 15. Dominio actualizado. 16. Modelos Django. 17. Implementación. 18. Integración. 19. Despliegue. 20. Pruebas. 21. Release.

### 8.3 Responsables sugeridos

**Humanos:** Jonatan (Product Owner, arquitecto, dominio, decisiones, integración y gates) · UX/frontend (wireframes, accesibilidad, onboarding y panel) · Backend/datos (Django, SQLite, autenticación, Groq y despliegue) · QA/documentación (requisitos, trazabilidad, pruebas y demo).

**Agentes:** agente raíz seleccionado (síntesis y decisiones) · `sol_graph_researcher` (fuentes y grafo) · `luna_scanner` (inventarios) · `luna_operator` (cambios mecánicos) · Terra (implementación aprobada) · `sol_auditor` (AA-G3, AA-G5 y AA-G6).

---

## 9. Cronograma de un mes

### Semana 1 — Línea base e ICONIX hasta robustez

**Día 1:** crear estructura aislada · inicializar Git · crear repositorio GitHub · crear GOV-00 · crear VIS-01 · registrar ADR-001 · cerrar `AA-G0`.

**Día 2:** construir MV-01 · cerrar encuesta · cerrar personajes · cerrar funciones · elaborar UX-01.

**Día 3:** elaborar REQ-01 · elaborar PRIV-01 · crear GQM · iniciar TRZ-01 · construir dominio inicial.

**Día 4:** especificar seis casos de uso · refinar requisitos · revisar dominio.

**Día 5:** construir robustez de autenticación, onboarding, chat y administración · actualizar dominio · auditoría `AA-G3`.

**Entregable:** línea base, UX, dominio, CU y robustez. Sin funcionalidades completas.

### Semana 2 — Diseño detallado y flujo simulado

Secuencias · dominio actualizado · ARQ-01 · scaffold Django · usuario personalizado · migraciones · registro · login/logout · mayoría de edad · consentimiento · encuesta · perfil · interfaz chat · `FakeLLMProvider` · GitHub Actions · pruebas unitarias · spike de `/health/` · prueba de despliegue PythonAnywhere · prueba de conectividad Groq.

**Entregable:** `usuario autenticado → onboarding → chat simulado → despliegue técnico validado`.

### Semana 3 — Groq, personajes y administración

`GroqLLMProvider` · `openai/gpt-oss-20b` · prompt · Alan/Aura · gate · límites · fallback · telemetría · panel · métricas · kill switch · despliegue completo · banco de evaluación · pruebas de autorización · backup de SQLite.

**Entregable:** flujo completo en URL pública; `AA-G5`.

### Semana 4 — Integración, calidad y demo

**Días 1–2:** E2E · seguridad · privacidad · accesibilidad · UAT · rendimiento · errores · logs · retención/ZDR · corrección P0/P1.

**Día 3:** release candidate · backup · OPS-01 · tag · credenciales de demo · prueba por otro integrante.

**Días 4–5:** reserva · activar Render solo si se dispara contingencia · ensayo · renovación PythonAnywhere · correcciones · auditoría `AA-G6`.

### Regla de recorte

Orden: 1. Pulido visual. 2. Métricas secundarias. 3. Directorio detallado. 4. Recuperación de contraseña. 5. Automatización secundaria. 6. Documentación duplicada. 7. Contingencia Render si no es necesaria.

Nunca recortar: autenticación · autorización · mayoría de edad · consentimiento · chat · fallback · privacidad · pruebas críticas · repositorio · URL pública.

---

## 10. Riesgos y controles

| Riesgo | Control | Disparador y respuesta |
|---|---|---|
| Sobrealcance | Lista positiva | Toda función nueva reemplaza otra |
| Carga documental | Ocho archivos físicos | Integrar si no desbloquea trabajo |
| Disponibilidad | Roles y tablero | Redistribuir tras 2 días |
| Un solo worker | Límites y usuarios invitados | Activar Render o plan pago |
| Expiración PythonAnywhere | Calendario de renovación | Renovar antes de demo |
| 512 MiB | Vigilar cuota | Limpiar logs y archivos |
| SQLite concurrente | Baja concurrencia | Migrar a PostgreSQL |
| Pérdida SQLite | Backup | Restaurar desde backup |
| Modelo retirado | Adaptador y variable | Elegir modelo activo y repetir evals |
| Cuota Groq | Límites locales | Fallback `429` |
| Groq sin SLA | Demo ensayada | Aviso y contingencia |
| Retención externa | ZDR o disclosure | Bloquear release si se oculta |
| Respuesta insegura | Gate, prompt y pruebas | Defecto P0 |
| Falsa apariencia clínica | Copy y revisión | Bloquear release |
| Rol manipulable | Backend y negativas | Bloquear release |
| Secretos | Variables y escaneo | Rotar |
| Logs sensibles | Logging controlado | Eliminar y auditar |
| Integración tardía | Fake provider | Congelar P2 |
| Despliegue manual | Runbook | Smoke test |
| Render cold start | Solo contingencia | Abrir antes de demo |
| BD Render expira | Registrar fecha | Exportar/migrar |
| Demo sin internet | Evidencia complementaria | No presentar mock como real |
| Contaminación padre | Escrituras solo en hijo | Detener |
| Licencias | Manifiesto | No publicar sin revisar |
| Rúbrica incompatible | Revisar al inicio | Ajustar presentación |

---

## 11. Decisiones pendientes reales

1. `[N6]` Número de compañeros y responsabilidades nominales.
2. `[N6]` Rúbrica exacta.
3. `[N6]` Fecha exacta de entrega.
4. `[N6]` Visibilidad del repositorio.
5. `[N6]` Cuenta GitHub del equipo.
6. `[N6]` Cuenta Groq.
7. `[N6]` Cuenta PythonAnywhere.
8. `[N6]` Confirmación de límites reales de Groq.
9. `[N6]` Configuración ZDR.
10. `[N6]` Participantes adultos.
11. `[N6]` Licencia.
12. `[N6]` Presupuesto de contingencia.
13. `[N6]` Recursos territoriales de ayuda que se mostrarán.
14. `[N6]` Necesidad real de concurrencia.

Defaults: español `es-CO` · adultos · participantes invitados · Django 5.2 LTS · SQLite · GitHub · GitHub Actions · PythonAnywhere Free · Groq · `openai/gpt-oss-20b` · sin correo · sin persistencia del chat · tres funciones admin · Render contingente · repositorio privado durante desarrollo · grafo/vault después del MVP.

No quedan pendientes: G1-16 · G1-18 · alcance · personajes · encuesta · no persistencia · arquitectura monolítica · hosting principal · proveedor inicial · frontera no clínica · ausencia de Ollama · funciones administrativas.

---

## 12. Orden exacto de la siguiente ejecución

La siguiente ejecución autorizada debe limitarse a construir la carpeta y cerrar la semana 1 documental hasta robustez, sin implementar todavía funcionalidades completas:

1. Rehidratar el macroproyecto. 2. Consultar Graphify en lectura. 3. Verificar cero cambios fuera de la carpeta hija. 4. Crear `subproyecto_academico_alan_aura/`. 5. Inicializar Git. 6. Crear repositorio GitHub. 7. Crear `.gitignore`. 8. Crear `README.md`. 9. Crear `AGENTS.md`. 10. Crear `CLAUDE.md`. 11. Crear `.codex/config.toml` sin modelo raíz. 12. Incorporar perfiles existentes. 13. Crear índice. 14. Crear cápsula. 15. Crear estado. 16. Crear changelog. 17. Crear manifiesto. 18. Construir VIS-01. 19. Registrar ADR-001 con: Django, SQLite, GitHub, PythonAnywhere, Groq, `gpt-oss-20b`, Render contingente, no Ollama, no persistencia. 20. Construir MV-01. 21. Construir UX-01. 22. Construir REQ-01. 23. Construir PRIV-01. 24. Crear TRZ-01. 25. Preparar dominio. 26. Construir y aprobar ICONIX-01A. 27. Especificar seis casos de uso. 28. Refinar requisitos. 29. Construir robustez P0. 30. Actualizar dominio. 31. Actualizar trazabilidad. 32. Ejecutar `sol_auditor`. 33. Cerrar `AA-G3`. 34. Actualizar estado y changelog. 35. Detener sin implementar funcionalidades completas.

La prueba técnica mínima `/health/` y la conectividad Groq se ejecutarán al comenzar la semana 2, salvo que el usuario autorice expresamente incorporarlas al cierre de esta ejecución.

Criterio de cierre: carpeta autocontenida · repositorio propio · gobierno operativo · alcance congelado · ADR coherente · modelo verbal · UX · requisitos · privacidad · dominio aprobado · seis CU · robustez revisada · trazabilidad sin huérfanos · cero modificaciones al padre · semana 2 lista.

---

**Fin del plan original (verbatim).**
