# ECU-05 — Especificación de caso de uso: «Otorgar consentimiento y caracterizar el perfil» (CU-05)
**ID documento:** DOC-CU-05 · **Caso de uso:** CU-05 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (24 secciones de la skill `use-case-specifier`, §1–§23) — caso de uso **canon-sensible** (consentimiento, minimización, solo adultos).
**Insumos:** DCU-01, MV-01 §Vista Onboarding, MD-01, REQ-01 (RF-01…06), PRIV-01, VIS-01, contrato, plan §3.1/§3.3/§3.4. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-05 |
| Versión | v1.0 |
| Autor | Jonatan Estiven Sánchez Vargas (subproyecto) |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-16 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |

## 2. Entradas esperadas
| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Onboarding (RN-01.x) | Disponible |
| Modelo de dominio | MD-01 (Usuario, Consentimiento, CapsulaDePerfil, Personaje) | Disponible |
| Diagrama de casos de uso | DCU-01 (CU «Otorgar consentimiento y caracterizar el perfil») | Disponible |
| Caso de uso seleccionado | CU-05 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Reglas de negocio | RN-01, RN-02, RN-09, RN-10; RN-01.1…RN-01.5; RN-04.2 | Disponible |
| Requisitos funcionales | RF-01…RF-06 | Disponible |
| Requisitos especiales | RNF-01, PRIV-R1/R4/R8/R9, RC-04, RC-06 | Disponible |
| Restricciones | Canon: solo adultos, disclosure previo, minimización | Disponible |
| Prototipos / GUI | Pantallas de onboarding | [Pendiente] (fase de construcción) |

## 3. Identificación
| Campo | Valor |
|---|---|
| ID | CU-05 |
| Nombre | Otorgar consentimiento y caracterizar el perfil |
| Paquete funcional | Acompañamiento (Onboarding) |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Media (una vez por usuario; repetible al reiniciar el perfil) |
| Criticidad | **Alta** (consentimiento informado + minimización + solo adultos) |
| Estado | Propuesto |

## 4. Propósito
| Campo | Descripción |
|---|---|
| Objetivo | Obtener el **consentimiento informado** del usuario adulto y construir una **CapsulaDePerfil mínima** que oriente la conversación, con *disclosure* de IA previo. |
| Descripción breve | Onboarding: *disclosure* → declaración de edad → consentimiento granular → caracterización opcional (5 preguntas) → generación de la cápsula → presentación de Alan y Aura. |
| Valor funcional | Habilita la conversación con seguridad ética (sin consentimiento no hay chat) y personaliza mínimamente sin recolectar historial. |
| Resultado observable | Existe un `Consentimiento` otorgado y (opcionalmente) una `CapsulaDePerfil`; el usuario puede elegir personaje y pasar a CU-06. |

## 5. Actores
| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Persona ≥18 registrada y autenticada | Declara edad, otorga consentimiento, responde la caracterización opcional, elige personaje |
| Actor secundario | — | (el LLM **no** participa en el onboarding) | No aplica |
| Sistema externo | — | No aplica | — |
| Stakeholder relacionado | Rol Datos/Privacidad | Vela por minimización y consentimiento (PLAN-01 §7) | Define y revisa el texto de consentimiento (por entorno) |

## 6. Alcance y contexto
| Campo | Valor |
|---|---|
| Alcance funcional | Onboarding emocional simplificado (disclosure, edad, consentimiento, cápsula). |
| Límite del sistema | Produce `Consentimiento` + `CapsulaDePerfil`; **no** conversa (eso es CU-06). |
| Incluye | Disclosure de IA, declaración de edad, consentimiento granular revocable, 5 preguntas opcionales, presentación de Alan/Aura. |
| Excluye | Historial, diario, biomarcadores, diagnóstico, triaje; menores; nombre legal/documento/correo/teléfono. |
| Suposiciones | El usuario ya tiene cuenta y sesión activa (CU-02/CU-03). |

## 7. Modelo de dominio involucrado
| Concepto/clase | Descripción | Participación en el CU | Atributos relevantes (reserva) | Relaciones importantes |
|---|---|---|---|---|
| Usuario | Persona adulta registrada | Titular del consentimiento y la cápsula | esAdulto, versionDisclosure | Usuario–Consentimiento (otorga); Usuario–CapsulaDePerfil (posee) |
| Consentimiento | Registro de aceptación granular y revocable | Se **crea** (otorgado) | estado ∈ {otorgado, revocado}, fecha | Usuario–Consentimiento |
| CapsulaDePerfil | Resumen mínimo que orienta la conversación | Se **crea** (opcional) | preferenciaDePersonaje, focoEmocional, tonoPreferido | CapsulaDePerfil–Conversacion (orienta) |
| Personaje (Alan, Aura) | Estilo de acompañamiento | Se presenta / selecciona | — | Personaje <|-- Alan; Personaje <|-- Aura |

**Control terminológico**

| Término oficial | Significado | Sinónimos o términos prohibidos | Observación |
|---|---|---|---|
| CapsulaDePerfil | Resumen mínimo (≤3 campos) que orienta la conversación | prohibido: «perfil», «PerfilInicialParaLLM» (alias macro) | No es historial (MV-01 §6) |
| Consentimiento | Aceptación granular y revocable | prohibido: «permiso», «términos» | Ciclo otorgado/revocado |
| Disclosure | Aviso de que se conversa con una IA | prohibido: «aviso legal» sin más | Precede a toda captura |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 Iniciar sesión | Este CU depende de | Requiere sesión activa (precondición). |
| Dependencia funcional | CU-06 Conversar con el acompañante | Este CU precede a | El consentimiento y la cápsula habilitan el chat. |
| `<<include>>` | — | — | Ninguno. |
| `<<extend>>` | — | — | Ninguno. |
| Generalización | — | — | Ninguna. |

> La **caracterización opcional (5 preguntas)** vive **dentro** de este CU (DCU-01 decisión 5); no es CU aparte ni `<<extend>>`.

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa (CU-03). | Autorización | Sí |
| PRE-02 | El Usuario no ha completado el onboarding, o desea rehacerlo. | Funcional | Sí |
| PRE-03 | El onboarding **no** depende del kill switch (solo la conversación lo hace). | Negocio | Sí |

## 10. Disparador
| Campo | Valor |
|---|---|
| Evento inicial | El Usuario inicia el onboarding tras iniciar sesión por primera vez (o elige rehacer su caracterización). |
| Generado por | Actor (Usuario). |
| Condición inicial observable | El sistema presenta la primera pantalla del onboarding con el *disclosure*. |

## 11. Flujo básico / curso normal
| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Sistema | Presenta el *disclosure* de IA **antes** de pedir cualquier dato (se conversa con una IA de acompañamiento, no un humano ni un terapeuta) | — | Muestra la pantalla de *disclosure* | Pantalla de disclosure |
| 2 | Usuario | Lee y continúa | — | Solicita la declaración de mayoría de edad | Pantalla de edad |
| 3 | Usuario | Declara ser mayor de 18 años | Usuario | Registra la declaración booleana + versión de *disclosure* y habilita el consentimiento | Pantalla de edad |
| 4 | Sistema | Presenta el consentimiento granular (procesar lo necesario para el chat) | Consentimiento | Muestra la pantalla de consentimiento | Pantalla de consentimiento |
| 5 | Usuario | Otorga el consentimiento | Consentimiento | **Crea** el registro de `Consentimiento` (otorgado) | Pantalla de consentimiento |
| 6 | Sistema | Ofrece la caracterización opcional de cinco preguntas (ánimo, energía, objetivo, estilo, personaje) | — | Muestra la pantalla de caracterización | Pantalla de caracterización |
| 7 | Usuario | Responde u omite cada pregunta | CapsulaDePerfil | **Arma** la `CapsulaDePerfil` con los campos respondidos (sin *defaults* para los omitidos) | Pantalla de caracterización |
| 8 | Sistema | Presenta a Alan (activación) y Aura (calma) | Personaje | Muestra la presentación de personajes | Presentación de Alan/Aura |
| 9 | Usuario | Confirma el personaje con quien desea conversar | Personaje | Deja listo el inicio de la conversación (CU-06) | Presentación de Alan/Aura |

## 12. Flujos alternativos
| ID | Nombre | Punto de inicio | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Omitir caracterización | Paso 6 | El Usuario rechaza la caracterización opcional | Continúa sin cápsula de preferencias; elegirá personaje en el paso 8 | Al paso 8 | RN-01.4 |
| FA-02 | Respuestas parciales | Paso 7 | El Usuario responde algunas preguntas y omite otras | La cápsula se arma solo con lo respondido; sin *defaults* | Al paso 8 | RN-01.3, plan §3.3 |
| FA-03 | Revocar en el onboarding | Paso 5+ | El Usuario revoca el consentimiento | Cesa el uso de la cápsula; no se habilita el chat | Fin sin conversación | RN-01.5, RN-07 |

## 13. Flujos de excepción
| ID | Error o evento | Punto | Causa | Respuesta del sistema | Mensaje | Estado final | Recuperación |
|---|---|---|---|---|---|---|---|
| FE-01 | Menor de edad | Paso 3 | El Usuario declara ser <18 | No continúa ni registra perfil | «Este servicio es solo para personas adultas» | Sin consentimiento, sin cápsula | Cerrar sesión |
| FE-02 | Sin consentimiento | Paso 5 | El Usuario no otorga el consentimiento | No permite avanzar a la conversación | «Sin consentimiento no es posible conversar» | Sin chat | Otorgar consentimiento |
| FE-03 | Entrada inválida | Paso 7 | Datos de encuesta mal formados | `400`; pide corregir sin perder lo válido | «Revisa los datos ingresados» | Onboarding en curso | Reintentar |
| FE-04 | Sesión ausente | Cualquiera | La sesión expira | `401`; solicita reingresar | «Tu sesión expiró» | Lo no confirmado no se persiste | Reingresar (CU-03) |

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | Existe un `Consentimiento` otorgado; opcionalmente una `CapsulaDePerfil` (≤3 campos); el Usuario puede iniciar CU-06 | Inspección de registros |
| Fallo | No se crea consentimiento; no hay cápsula; no se habilita el chat | Inspección |
| Datos creados | `Consentimiento` (otorgado + fecha + versión disclosure); `CapsulaDePerfil` (campos respondidos) | Inspección |
| Datos modificados | `Usuario` (esAdulto=verdadero, versionDisclosure) | Inspección |
| Datos eliminados | Ninguno (los campos omitidos **no** se guardan) | Inspección |
| Cambios de estado | `Consentimiento` → otorgado | Traza |
| Efectos visibles | El usuario ve a Alan/Aura y puede conversar | Observación |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-01 | Solo adultos (≥18) pueden usar el MVP. | Restricción | Paso 3, FE-01 | MV-01 §7.1 |
| RN-02 | No hay conversación sin consentimiento otorgado. | Restricción | Paso 5, FE-02 | MV-01 §7.1 |
| RN-09 | El *disclosure* de IA se muestra antes de la primera conversación y de capturar datos. | Restricción | Paso 1 | MV-01 §7.1 |
| RN-10 | «Adulto» = declara edad ≥18 en el onboarding. | Término | Paso 3 | MV-01 §7.1 |
| RN-01.1 | El *disclosure* precede a cualquier dato. | Restricción | Paso 1 | MV-01 §7.2 |
| RN-01.2 | La edad se declara antes del consentimiento; <18 no continúa. | Restricción | Paso 3, FE-01 | MV-01 §7.2 |
| RN-01.3 | La cápsula se compone solo de {preferenciaDePersonaje, focoEmocional, tonoPreferido}. | Restricción | Paso 7 | MV-01 §7.2 |
| RN-01.4 | Ningún campo de perfil es obligatorio salvo edad y consentimiento. | Habilitador | FA-01/FA-02 | MV-01 §7.2 |
| RN-01.5 | El consentimiento se puede revocar desde el onboarding y después. | Habilitador | FA-03 | MV-01 §7.2 |
| RN-04.2 | La mayoría de edad se guarda como declaración booleana + versión de disclosure, no como fecha de nacimiento. | Hecho | Paso 3 | MV-01 §7.5 |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | La cápsula contiene solo los campos definidos; nada de historial/diario/biomarcadores (PRIV-R1/R4/R9). | Inspección de la cápsula = solo los campos de RN-01.3 |
| RE-02 | Seguridad/Consentimiento | *Disclosure* y consentimiento preceden a toda captura (PRIV-R8, RN-09). | Ningún dato se captura antes del *disclosure* |
| RE-03 | Usabilidad | Onboarding ≈2 min, español CO, comprensible para adultos (RNF-01, RC-06). | ≥80 % completan sin asistencia (MET-06) |
| RE-04 | Legal/regulatorio | El texto de consentimiento se aprovisiona por entorno y requiere revisión legal (Ley 1581). | Texto revisado por experto antes de piloto (V6-b) |

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | Onboarding (multipaso) | Disclosure→edad→consentimiento→encuesta→personajes | (por pantalla) | Continuar, Otorgar, Omitir, Elegir | 1–9 |
| Endpoint visible | `POST /onboarding/` | Guardar consentimiento y perfil | consentimiento, respuestas de encuesta | Enviar | 5, 7 |

> Prototipos gráficos: **[Pendiente]** (fase de construcción). §17 se limita a referencias planificadas.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| Consentimiento | estado, fecha, versión de disclosure | Crear / Confirmar | Paso 5 | Revocable (RN-01.5) |
| CapsulaDePerfil | preferenciaDePersonaje, focoEmocional, tonoPreferido | Crear / Seleccionar | Paso 7 | Solo campos de RN-01.3; opcionales |
| Usuario | esAdulto, versionDisclosure | Actualizar | Paso 3 | Booleano, no fecha de nacimiento (RN-04.2) |
| Personaje | Alan / Aura | Seleccionar | Paso 8–9 | Uno por sesión (cambiable, RN-02.6) |

> **Nota de origen (encuesta):** el plan §3.3 define 5 preguntas → atributos `mood_self_report`, `energy_self_report`, `conversation_goal`, `response_style`, `character`. El mapeo exacto de esos 5 a los 3 campos canónicos de la cápsula (RN-01.3) es una **ambigüedad abierta** (ver §21 RA-01).

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación con el CU |
|---|---|---|
| Requisito funcional | RF-01, RF-02, RF-03, RF-04, RF-05, RF-06 | Realizados por este CU |
| Objetivo de negocio | OBJ-1 | Onboarding/consentimiento/cápsula |
| Regla de negocio | RN-01/02/09/10, RN-01.1…1.5, RN-04.2 | Gobiernan el flujo |
| Requisito de calidad | RC-04 (minimización), RC-06 (usabilidad) | Anclas de calidad |
| Modelo de dominio | Usuario, Consentimiento, CapsulaDePerfil, Personaje/Alan/Aura | Conceptos manipulados |
| Diagrama de casos de uso | DCU-01 «Otorgar consentimiento y caracterizar el perfil» | Origen |
| Caso de prueba | CP-05 | Planificado |
| Diagrama de robustez / secuencia | DR-05 / DS-05 | Planificados |
| Criterio de aceptación | CA-01…CA-06 | Verificación |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario que inicia el onboarding, cuando aparece la primera pantalla, entonces ve el *disclosure* de IA antes de cualquier captura de datos. | Flujo básico | Inspección de pantalla 1 |
| CA-02 | Dado un usuario que declara <18, cuando lo confirma, entonces el sistema no continúa ni registra perfil. | FE-01 | Prueba de caso <18 |
| CA-03 | Dado un usuario, cuando otorga el consentimiento, entonces se crea el registro y puede avanzar; sin consentimiento, no avanza. | Flujo básico / FE-02 | Traza de consentimiento |
| CA-04 | Dado un usuario que completa la caracterización, cuando se genera la cápsula, entonces contiene solo los campos de RN-01.3 y nada más. | Flujo básico | Inspección de la cápsula |
| CA-05 | Dado un usuario que omite preguntas, cuando finaliza, entonces la cápsula se arma solo con lo respondido, sin *defaults*. | FA-02 | Inspección de la cápsula |
| CA-06 | Dado un usuario, cuando termina el onboarding, entonces ve a Alan y Aura y puede elegir. | Flujo básico | Observación |

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad | La caracterización se describe con **5 preguntas** (VIS-01/MV-01/plan §3.3: ánimo, energía, objetivo, estilo, personaje), pero la cápsula canónica (RN-01.3) y lo que recibe el LLM (PRIV-R1/RNF-04) nombran **3 campos**; el plan §3.4 (`ContextoInicialConversacionalV1`) lista **5 autorreportes + personaje + versión de consentimiento**. | Define qué recibe realmente el LLM | Seguir el **canon del subproyecto (3 campos)** como autoridad; reconciliar el mapeo 5→3 y la discrepancia con el plan §3.4. | **Abierto** (a reconciliar con el usuario) |
| RA-02 | Riesgo | El texto de consentimiento requiere revisión legal antes de uso con personas reales. | Cumplimiento Ley 1581 | Aprovisionar por entorno; V6-b | Abierto |
| RA-03 | Decisión pendiente | Prototipos/GUI del onboarding. | Diseño de interacción | Fase de construcción | Abierto |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Consentimiento + cápsula |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Otorgar… y caracterizar…» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Sin LLM en onboarding |
| 5 | Flujo básico = escenario de éxito completo | ✅ | 9 pasos |
| 6 | Flujos alternativos suficientes | ✅ | FA-01…FA-03 |
| 7 | Flujos de excepción relevantes | ✅ | <18, sin consentimiento, 400, 401 |
| 8 | Términos del dominio (MD-01) usados | ✅ | Consentimiento, CapsulaDePerfil, Personaje |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | Pantallas + `/onboarding/` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | §14 |
| 14 | Sin detalle de implementación | ✅ | Caja negra |
| 15 | Auth como precondición/regla, no CU incluido | ✅ | PRE-01 |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19 |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ✅ | DR-05/DS-05 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Sin sobre-claim; minimización; adultos |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto |
| Objetivo | Consentir (informado) y armar la cápsula mínima, con *disclosure* previo. |
| Disparador | El usuario inicia el onboarding tras iniciar sesión. |
| Precondiciones | Sesión activa (CU-03); no menor de edad. |
| Conceptos del dominio | Usuario, Consentimiento, CapsulaDePerfil, Personaje/Alan/Aura. |
| Flujo básico | Disclosure → edad → consentimiento → encuesta opcional → cápsula → elegir personaje. |
| Flujos alternativos | Omitir/parcializar encuesta; revocar consentimiento. |
| Flujos de excepción | <18; sin consentimiento; 400; 401. |
| Postcondición de éxito | Consentimiento otorgado (+ cápsula opcional); listo para CU-06. |
| Reglas de negocio | RN-01/02/09/10, RN-01.1…1.5, RN-04.2. |
| Criterios de aceptación | CA-01…CA-06. |
| Casos relacionados | CU-03 (precede), CU-06 (sigue). |

**Fin de ECU-05.**
