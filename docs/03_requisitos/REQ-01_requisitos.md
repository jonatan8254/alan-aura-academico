# REQ-01 — Requisitos del MVP «Alan & Aura Académico»
**ID:** REQ-01 · **Hogar:** `docs/03_requisitos/` · **Fecha:** 2026-07-12 · **Versión:** v1.2 (SD-15: +cuenta/acceso RF-19…24, +sesión/robustez RF-25/26, admin realineado; SD-17: límites de tasa exactos +RNF-10, historial de sesión precisado en RF-09/RNF-04).
**Insumos:** MV-01 (consolidado, con sus vistas), contrato conversacional, VIS-01 (OBJ), ADR-001, SEG-01, PRIV-01, ISO/IEC 25010:2023 (vía NORM-01/D6-bis).
**Consumidores:** TRZ-01, NORM-01, pruebas (fase 2), construcción (fase 3).
**Frontera dura (disciplina K):** este artefacto produce **RF, RNF, requisitos de calidad (RC) con GQM+umbral y reglas de negocio tipadas (RN)**. **No** produce casos de uso, modelo de dominio, robustez ni secuencias (fase 2).
**Marcas:** [E1]/[I2]/[P5]. **Honestidad §4.9:** los umbrales dependientes de servicios externos se declaran como tales.

---

## 0. Convención de identificadores
- **Formato:** `PREFIJO-NN` con **guion único** y dos dígitos (`RF-01`).
- **Prefijos:** `RF` funcional · `RNF` no funcional · `RC` requisito de calidad (SQuaRE) · `RN` regla de negocio · `MET` métrica · `CU`/`PR` reservados a fase 2.
- Cada RF/RNF/RC declara: enunciado, origen (objetivo/regla/MV), criterio de aceptación verificable y traza (columna en TRZ-01).

---

## 1. Requisitos funcionales (RF)

### Onboarding (OBJ-1, MV-01 §Onboarding)
| ID | Requisito | Origen | Criterio de aceptación |
|---|---|---|---|
| RF-01 | Mostrar el *disclosure* de IA antes de solicitar cualquier dato. | RN-09, RN-01.1 | El *disclosure* aparece en la primera pantalla; ningún campo se captura antes. |
| RF-02 | Solicitar declaración de edad y bloquear a menores de 18. | RN-01, RN-01.2 | Con edad <18 no se continúa ni se registra dato. |
| RF-03 | Registrar consentimiento granular y revocable. | RN-02, RN-07 | Se puede otorgar y revocar; sin consentimiento no hay conversación. |
| RF-04 | Capturar datos mínimos de perfil (preferencia de personaje, foco emocional, tono), todos opcionales. | RN-01.3, RN-01.4 | Se puede completar el onboarding dejando campos en "prefiero no decir". |
| RF-05 | Generar la cápsula de perfil a partir del onboarding. | RN-03, REL-2 | La cápsula contiene solo los 3 campos definidos; nada más. |
| RF-06 | Presentar a Alan y Aura (rol y estilo) antes de conversar. | OBJ-1, MV-01 §Conversación | El usuario ve ambos personajes y puede elegir. |

### Conversación (OBJ-2, MV-01 §Conversación, contrato)
| ID | Requisito | Origen | Criterio de aceptación |
|---|---|---|---|
| RF-07 | Iniciar conversación con el personaje elegido (Alan o Aura). | REL-3, REL-4 | La conversación arranca con la persona seleccionada. |
| RF-08 | Intercambiar turnos de diálogo usuario↔personaje. | REL-5 | El usuario envía y recibe mensajes coherentes. |
| RF-09 | Gobernar el LLM con cápsula + *system prompt* de personalidad + hasta 4 intercambios de la sesión actual + turno. | RN-02.2, C-4, plan §3.4/§4.10 | El *payload* al LLM contiene cápsula + persona + máx. 4 intercambios de la sesión + turno; sin historial de sesiones previas. |
| RF-10 | Evaluar el gate de seguridad en **cada** mensaje del usuario antes de responder. | RN-02.1, SEG-01 | Todo mensaje pasa el gate; verificable en traza técnica. |
| RF-11 | Activar el fallback determinista ante peligro explícito (respuesta sin LLM + derivación). | RN-05, C-3, SEG-01 | Con mensaje de peligro de prueba, responde el fallback aunque el LLM esté deshabilitado. |
| RF-12 | Permitir cambiar de personaje durante o entre conversaciones. | RN-02.6 | El usuario alterna Alan/Aura sin reiniciar el onboarding. |
| RF-13 | Cerrar la conversación y descartar su contenido (no persistencia). | RN-04, RN-02.5, C-5 | Tras cerrar, no hay registro recuperable del diálogo. |

### Administración de plataforma (OBJ-6, MV-01 §Administración — **exactamente tres funciones**, plan §3.7)
| ID | Requisito | Origen | Criterio de aceptación |
|---|---|---|---|
| RF-14 | Autenticar al administrador por **login separado**; el rol se valida en el **servidor** (no alterable desde el cliente). | RN-03.7, plan §3.2 | Un usuario ordinario que visite rutas admin recibe 403/redirección aunque modifique el cliente. |
| RF-15 | Visualizar el **directorio mínimo** de usuarios: alias, **ID truncado**, fecha de registro, estado y onboarding completado. | RN-03.1, RN-03.2 | El directorio no muestra username completo, respuestas de encuesta ni contenido. |
| RF-16 | Visualizar **métricas agregadas**: total de cuentas, onboardings, llamadas al chat en 7 días y tasa técnica de éxito/error. | RN-03.1, RN-03.3 | Las cifras son agregadas; no hay conteos ni datos por usuario. |
| RF-17 | **Habilitar/deshabilitar globalmente el chatbot** (kill switch), con confirmación. | RN-03.1, RN-03.4, RN-02.7 | Con el chatbot deshabilitado, ningún usuario puede iniciar conversación. |
| RF-18 | Registrar la acción del kill switch (auditoría: quién/cuándo). | RN-03.4 | Cada cambio de disponibilidad queda con autor y fecha; sin datos de usuario. |

> **Nota (alineación al plan §2.5/§3.7):** el administrador **no** edita recursos, textos ni prompts (no hay CMS). Esos se aprovisionan **por entorno** (ver RNF-05, ADR-001-D6). No hay suspensión individual, exportación ni visualización de conversaciones.

### Cuenta y acceso (OBJ-7, MV-01 §Cuenta — plan §2.2/§3.1)
| ID | Requisito | Origen | Criterio de aceptación |
|---|---|---|---|
| RF-19 | Presentar al **Visitante** la landing pública (alcance no clínico, límites, accesos) antes de registrarse. | RN-04.5 | El Visitante ve la presentación sin autenticarse; no accede a chat ni datos. |
| RF-20 | **Registrar cuenta** con username, alias y contraseña; sin nombre legal, documento, correo, teléfono, dirección ni fecha de nacimiento. | RN-04.1 | Se crea la cuenta pidiendo solo esos tres campos. |
| RF-21 | **Iniciar y cerrar sesión** (login/logout) del usuario. | plan §3.1 | El usuario entra y sale; el rol no se selecciona desde el cliente. |
| RF-22 | **Reiniciar/borrar la caracterización** (perfil). | RN-04.3 | El usuario borra su perfil; la cápsula deja de existir. |
| RF-23 | **Revocar la personalización** (uso de la cápsula). | RN-04.3, RN-07 | Tras revocar, la cápsula no vuelve a alimentar la conversación. |
| RF-24 | **Eliminar la cuenta** con **borrado en cascada**. | RN-04.4 | Eliminada la cuenta, no queda dato asociado recuperable. |

### Sesión y robustez (transversal)
| ID | Requisito | Origen | Criterio de aceptación |
|---|---|---|---|
| RF-25 | Limitar la sesión de chat a **20 mensajes** de usuario, **1.500 caracteres** por mensaje y **350 tokens** de salida del LLM. | RN-02.8 | Alcanzado cualquier límite, la sesión responde con estado claro (no error crudo) e invita a cerrar/reiniciar. |
| RF-26 | Manejar **indisponibilidad, timeout (20 s), cuota (3/min, 30/día) y respuesta bloqueada** del LLM sin romper la interfaz. | plan §2.4/§4.13, RN-02.9, RC-07 | Ante cada fallo simulado (401/403/400/409/429/502/504), la UI muestra estado y permite reintento manual; no se rompe. |

## 2. Requisitos no funcionales (RNF)
| ID | Requisito | Origen | Criterio de aceptación |
|---|---|---|---|
| RNF-01 | Interfaz y *prompts* en español (Colombia). | SD-09, ADR-001-D7 | Todos los textos de cara al usuario en español CO. |
| RNF-02 | El MVP se despliega en *free tier* (PythonAnywhere Free; Render contingencia). | ADR-001-D5 | Corre en el *free tier* con pasos documentados (o contingencia). [N6] |
| RNF-03 | El chat no se persiste en base de datos ni logs. | RN-04, PRIV-01 | Inspección confirma ausencia de contenido de chat en BD/logs. |
| RNF-04 | El LLM nunca recibe datos fuera de la cápsula, el turno actual y los intercambios de la sesión en curso (máx. 4); nunca username, alias, ID, rol, contraseña ni historial de sesiones previas. | RN-03, PRIV-01, plan §3.4 | Inspección de *payloads*: cero campos prohibidos (lista exacta en PRIV-01). |
| RNF-05 | Recursos de ayuda y parámetros de seguridad configurables por entorno, no *hardcodeados*. | SD-12, ADR-001-D6 | Grep del código: cero recursos/números de crisis embebidos. |
| RNF-06 | La ruta de seguridad no depende de la disponibilidad del LLM. | RN-05, SEG-01 | Con LLM caído, el fallback sigue operando (ver RC-01). |
| RNF-07 | El código no versiona contenido con © de terceros. | AGENTS §2 | Repo sin normas/libros de terceros. |
| RNF-08 | El rol (usuario/administrador) se determina y valida en el **servidor**; no seleccionable ni alterable desde el cliente. | RN-03.7, plan §2.6 | Manipular el cliente no cambia el rol; rutas admin protegidas (403). |
| RNF-09 | Las claves/tokens (LLM, sesión) no llegan al navegador ni al repositorio. | canon, plan §2.6 | Inspección: sin secretos en el cliente ni en el repo. |
| RNF-10 | Rate limit configurable por entorno: **3 solicitudes/min y 30/día por usuario**; timeout de LLM **20 s**; máx. **4 intercambios** de historial de sesión enviados al LLM. | RN-02.9, plan §4.13 | Prueba automatizada confirma que la solicitud 4/min y la 31/día del mismo usuario responden `429`. |

## 3. Requisitos de calidad (RC) — SQuaRE / ISO-IEC 25010:2023 con GQM y umbral
Cada RC: **característica 25010:2023** · **GQM** (meta → pregunta → **métrica (MET)** → **umbral obligatorio**). Los umbrales dependientes del LLM/hosting se marcan [N6]. Todos tienen fila en NORM-01.

| ID | Característica (25010:2023) | Meta | Pregunta | Métrica (MET) | **Umbral** |
|---|---|---|---|---|---|
| **RC-01** | Safety §3.9.3 *fail safe* | La ruta de seguridad opera aunque el LLM falle. | ¿En qué % de casos de peligro de prueba se muestra el fallback con el LLM deshabilitado? | MET-01: fallbacks correctos / casos de peligro con LLM off. | **100 %** |
| **RC-02** | Safety §3.9.2 *risk identification* | Detectar el peligro **explícito** del conjunto de prueba. | ¿Qué *recall* alcanza el gate sobre un set definido de frases de peligro explícito? | MET-02: verdaderos positivos / total del set. | **≥ 0,90** sobre el set definido (honesto: explícito, no clínico) |
| **RC-03** | Safety §3.9.1 *operational constraint* | Las guardas impiden salidas de riesgo del LLM. | ¿Qué % de *prompts* adversarios de prueba producen salida bloqueada/segura? | MET-03: salidas seguras / *prompts* adversarios. | **≥ 0,95** |
| **RC-04** | Security (confidencialidad) | Minimización: el LLM solo recibe la cápsula. | ¿Cuántos *payloads* inspeccionados contienen campos prohibidos? | MET-04: *payloads* con fuga / *payloads* inspeccionados. | **0 fugas (100 % limpios)** |
| **RC-05** | Performance efficiency (tiempo) | Respuesta conversacional en tiempo aceptable. | ¿Cuál es el p95 del tiempo de respuesta? | MET-05: p95 de latencia extremo a extremo. | **p95 ≤ 5 s** [N6] |
| **RC-06** | Interaction capability §3.4 | Onboarding usable sin ayuda. | ¿Qué % de usuarios de prueba completan el onboarding sin asistencia? | MET-06: usuarios que completan / total (n≥5). | **≥ 80 %** |
| **RC-07** | Reliability (disponibilidad en demo) | El MVP responde o degrada con gracia. | ¿Qué % de peticiones de la demo terminan con éxito o *fallback*? | MET-07: peticiones OK+fallback / totales. | **≥ 95 %** |
| **RC-08** | Functional suitability (corrección) | Coherencia de personaje (Alan/Aura). | ¿Qué puntúa el diálogo en la rúbrica de coherencia de persona? | MET-08: promedio de rúbrica 1–5 (n≥10 diálogos). | **≥ 4,0 / 5** |
| **RC-09** | Flexibility (instalabilidad) | Desplegable en *free tier* de forma reproducible. | ¿El despliegue sigue los pasos documentados sin intervención extra? | MET-09: despliegue reproducible (sí/no) según runbook. | **Sí, 1 corrida documentada** [N6] |
| **RC-10** | Maintainability (modificabilidad) | Cambiar recursos/textos sin tocar código. | ¿Qué % de cambios de recursos/textos se hacen por **configuración de entorno** sin desplegar código? | MET-10: cambios por configuración de entorno / cambios totales. | **100 %** |

> **Nota de honestidad (§4.9):** RC-02 mide *recall* sobre un **conjunto de prueba de frases explícitas** definido por el equipo; **no** es una garantía de detección clínica ni de casos implícitos (ver SEG-01). RC-05/RC-09 dependen de servicios externos [N6].

## 4. Reglas de negocio tipadas (RN) — consolidado
Taxonomía Wiegers: término / hecho / restricción / habilitador de acción / inferencia / cálculo. Las reglas raíz (RN-01…RN-11) viven en MV-01 §7.1; las de vista (RN-01.x onboarding, RN-02.x conversación, RN-03.x administración, RN-04.x cuenta/acceso) en MV-01 §7.2–§7.5. Consolidado por tipo:

| Tipo | Reglas |
|---|---|
| **Término** | RN-10 (adulto), RN-11 (peligro explícito). |
| **Hecho** | RN-04.2 (mayoría de edad = declaración booleana + versión de disclosure). |
| **Restricción** | RN-01, RN-02, RN-03, RN-04, RN-06, RN-08, RN-09; RN-01.1/.2/.3; RN-02.2/.3/.4/.5/.7/.8; RN-03.1/.2/.3/.5/.6/.7; RN-04.1/.5/.6. |
| **Habilitador de acción** | RN-05, RN-07; RN-01.4/.5; RN-02.1/.6; RN-03.4 (kill switch); RN-04.3 (reinicio/revocación), RN-04.4 (eliminación en cascada). |
| **Inferencia** | *(ninguna en el MVP; el gate es determinista, no inferencial — decisión honesta, SEG-01).* |
| **Cálculo** | *(ninguna sobre datos de bienestar; las métricas del admin son **contadores operativos agregados**, no scoring del usuario).* |

> Las casillas vacías se declaran **a propósito**: el MVP evita inferencia/cálculo sobre datos de bienestar (minimización y no-perfilado). [P5]

## 5. Trazabilidad
Cada RF/RNF/RC entra en TRZ-01 con su objetivo, MV de origen, regla, requisito de calidad, norma (NORM-01) y prueba planificada. **Cero requisitos huérfanos** es criterio de cierre.

## 6. Cierre
- **Decisiones confirmadas:** RF-01…RF-26, RNF-01…RNF-09, RC-01…RC-10 con umbral (SD-15: cuenta/acceso y admin de plataforma alineados al plan de Codex).
- **Recomendaciones:** fijar el *set* de prueba de RC-02 antes de construcción; congelar umbrales [N6] tras verificar servicios (V6-a).
- **Supuestos:** los umbrales de latencia/instalabilidad se cumplen en el *free tier* elegido (a verificar).
- **Pendientes:** V6-a (servicios), V6-b (frontera legal, PRIV-01).

**Fin de REQ-01.**
