# MD-01 — Modelo de dominio del MVP «Alan & Aura Académico»
**ID:** MD-01 · **Familia:** MD (dominio, fase 2 ICONIX) · **Hogar:** `docs/06_dominio/` · **Fecha:** 2026-08-01 · **Versión:** v1.7 (SD-32: solo anexo — §6 remitía las multiplicidades a §13.2 y están en §13.3). v1.6 (SD-30: **solo anexo** — la decisión de modelado 4 precisa que `EventoOperativo` documenta **una llamada**, no una conversación; hallazgo `H-1a` de `DS-00`. **El `.puml` no se toca**: la relación `Conversacion -- EventoOperativo` no lleva multiplicidad —*academic strict*, §1— así que ya admitía uno-a-muchos. Siguen 16 clases y 17 relaciones). · **Versión anterior:** v1.5 (SD-29: **solo anexo** — la decisión 8 deja de excluir productos concretos («Django / SQLite») y pasa a excluir **por categoría** el framework de aplicación, el motor de persistencia y la plataforma de despliegue, para que la regla no caduque cuando cambie el stack. **El `.puml` no se toca**: siguen siendo las mismas 16 clases y 17 relaciones, y el validador da 0 errores igual que antes. PDR-01 tanda 0: cuatro etiquetas de relación reescritas tras ejecutar las compuertas de la skill — ver §10).
**Artefacto ejecutable:** [`MD-01_modelo_dominio.puml`](MD-01_modelo_dominio.puml) (PlantUML copy-ready, fuente de verdad). **Render acompañante:** [`MD-01_modelo_dominio.svg`](MD-01_modelo_dominio.svg).
**Insumos:** MV-01, VIS-01, REQ-01, CONTRATO conversacional, SEG-01, PRIV-01, **PER-01** (mapa de persistencia), TRZ-01, **retroalimentación docente** (se registrará en `RET-01`, fase D.6) y el **delta de object discovery de DR-00 §4**.
**Consumidores:** DCU-01, especificación de casos de uso, robustez, clases (fases posteriores).
**Generado con:** skill `uml-domain-modeler` (modo *academic strict*); sus **compuertas finales** se ejecutaron sobre este artefacto en v1.4 (§10). **Validador:** `validate_domain_puml.py` → **0 errores / 0 advertencias** — con el alcance acotado que se declara en §7.
**Naturaleza:** análisis estático conceptual — glosario del dominio. **No** es diseño, ni modelo de datos, ni arquitectura, ni flujo, ni diagrama de casos de uso.

---

## 1. Modo y contrato aplicados
- **Academic strict**: **sin atributos, sin métodos, sin multiplicidades**, sin tipos ni claves; `hide fields/methods/empty members`.
- **Español**, un término por concepto (Alan no «Alanus/Alanor»; Aura no «Pandora»).
- Solo **clases conceptuales y relaciones**; atributos, cardinalidades y estados quedan **diferidos** (§6).
- **Agrupación en 5 paquetes** (v1.3): el validador avisa a partir de 12 clases sin agrupar. Los paquetes son de lectura, no de semántica.

## 2. Clases del dominio (16) y su clasificación

| Clase | Clasificación | Origen |
|---|---|---|
| **Visitante** | Actor/rol + clase de dominio | Retroalimentación docente punto 2; VIS-01 actor |
| **TitularDeCuenta** | **Supertipo** (rol: quien posee una cuenta) | Retroalimentación docente punto 1 |
| **Usuario** | Especialización (`is-a` TitularDeCuenta) | MV-01 §3, VIS actor |
| **Administrador** | Especialización (`is-a` TitularDeCuenta) | MV-01 §3, VIS actor |
| **Consentimiento** | Clase central (registro con ciclo de vida) | MV-01 §3, PRIV-01 |
| **CapsulaDePerfil** | Clase central | MV-01 §3, PRIV-01 |
| **ContadorDeUsoDiario** | Cuota de uso por usuario | PER-01 §3.5; DR-00 §4.1 |
| **Personaje** | Superclase (abstracción) | MV-01 §3 |
| **Alan** | Especialización (`is-a` Personaje) | MV-01 §3, contrato |
| **Aura** | Especialización (`is-a` Personaje) | MV-01 §3, contrato |
| **Conversacion** | Clase central (objeto de negocio nuclear) | MV-01 §3 |
| **Mensaje** | Clase secundaria (parte de la conversación) | MV-01 §3 |
| **EventoDeSeguridad** | Evento de dominio (safety) | MV-01 §3, SEG-01 |
| **RecursoDeAyuda** | Recurso de dominio | MV-01 §3, SEG-01 |
| **DisponibilidadDelChatbot** | Estado operativo del servicio (kill switch) | MV-01 §3 (SD-15), plan §3.7 |
| **EventoOperativo** | Telemetría sin contenido | PER-01 §3.6; DR-00 §4.1, D-12 |

> **Vista derivada (no clase):** `MétricaDeUso` — agregados que ve el admin; se **calculan** sobre `Usuario`, `Conversacion` y `EventoOperativo`, no se persisten como clase propia.
> **Fuera del dominio por decisión:** `AccionAdministrativa` (registro operativo; ECU-10 §21 RA-01, aceptada).

## 3. Decisiones de modelado

1. **`TitularDeCuenta` como supertipo (retroalimentación docente, punto 1) — reversión declarada.** El profesor observó que «el administrador es un tipo de usuario». Se resuelve con un **supertipo** en vez de `Usuario <|-- Administrador` porque el `Usuario` de este modelo `otorga Consentimiento`, `posee CapsulaDePerfil` y `mantiene Conversacion` — y un administrador **no hace nada de eso** (canon: no ve datos conversacionales).
   **Por qué `TitularDeCuenta` y no `Cuenta`:** una `Cuenta` es una *identidad de acceso*, y una persona **no «es»** una identidad de acceso — `Usuario <|-- Cuenta` sería un error de categoría y no pasaría el *substitution test*. `TitularDeCuenta` es un **rol de persona**, y ahí sí: todo `Usuario` y todo `Administrador` **es** alguien que posee una cuenta. La identidad de acceso (`username`, `alias`, `contraseña`, `rol`) pasa a ser atributo diferido del supertipo (§6).
   **Reversión que esto implica:** MV-01 §3 dice literalmente «*la identidad de acceso son atributos de `Usuario`; **no se crea clase `Cuenta` aparte**(§13)*». Esta versión **se aparta de esa clasificación**: no crea una clase `Cuenta`, pero sí eleva la titularidad a un supertipo, que es lo que hace falta cuando hay **dos** tipos de titular. Queda pendiente de registrar como decisión (`SD-28`, fase D.5).
   **Nota sobre PER-01:** su §3.1 describe una sola tabla `User` con `rol ∈ {usuario, administrador}`. Eso es el patrón *rol-como-atributo*, que es la **alternativa** de persistencia a esta jerarquía, no su confirmación. Ambas son compatibles — la jerarquía es conceptual y el mapeo a una tabla con discriminador es una decisión de la fase de diseño.
2. **`Visitante` pasa a ser clase (retroalimentación docente, punto 2) — reversión declarada.** MV-01 §3 y §14 y MD-01 v1.2 §2 lo clasificaban como «actor **sin** clase de dominio», con el criterio «sin datos ni relaciones de dominio». La retroalimentación docente pide representarlo. La relación `Visitante -- TitularDeCuenta : precede a` enuncia el **orden de los dos roles**, no un paso de proceso: quien consulta la presentación sin cuenta puede pasar a tenerla (ECU-02 §5: «Visitante pasa a Usuario al crear la cuenta»). *El acto de registrarse sigue siendo un caso de uso, no una relación.* La etiqueta se corrigió en v1.4: `se convierte en` describía la **transición**, y el rubro de la skill advierte de no modelar cada transición ni como clase ni como acción. Pendiente de registrar en `SD-28` (fase D.5).
3. **`ContadorDeUsoDiario` → añadida.** El hecho de dominio es que **el servicio limita cuánto se puede conversar** (RN-02.9: 3/min, 30/día) — una regla de negocio, no un mecanismo. La clase es el sustantivo de esa cuota, y **participa en el borrado en cascada** (ECU-04 paso 3, PRIV-R11, PER-T1). Sin ella el modelo describía una cascada incompleta: nombraba `Usuario`, `Consentimiento` y `CapsulaDePerfil` y omitía en silencio un dato por usuario que sí se persiste. *(Sus campos siguen sin especificar: `PER-H4` continúa abierto.)*
4. **`EventoOperativo` → añadida (resuelve D-12).** Es el **hecho de dominio** de que una **llamada al acompañante** ocurrió, registrado *sin su contenido* — uno por petición, no uno por conversación (precisado en `v1.6`, hallazgo `H-1a` de `DS-00`: latencia, resultado, modelo y versión son valores de una llamada, y `MET-07` mide peticiones sobre el total): es lo que permite al administrador ver agregados sin ver a nadie en particular, que es una exigencia del canon (RN-03.3, PRIV-R10), no un detalle técnico. MV-01 §13.2 lo agrupaba con `MétricaDeUso` como «vista derivada (no clase)»; se resuelve la contradicción a su favor porque `Conversacion` **no se persiste** y sin esta clase la tasa de 7 días de ECU-09 sería incomputable. `MétricaDeUso` **sí sigue siendo vista derivada**.
   **Riesgo declarado:** su ficha de persistencia (PER-01 §3.6) tiene campos claramente técnicos (`request_id`, `version_prompt`, `entorno`). Esos **no** son atributos de dominio y no se listan en §6: viven en PER-01. Si en una revisión posterior se concluye que la clase solo se sostiene por su tabla, procede sacarla como se hizo con `AccionAdministrativa`.
5. **El administrador y sus funciones (refinamiento de SD-15, vigente).** Sigue **sin** dibujarse `Administrador -- Usuario` como **asociación**: sería una relación de acceso/comportamiento y la etiqueta «supervisa» se malinterpreta como que el admin vigila las conversaciones, lo que **viola el canon**. Lo que v1.3 añade es una **generalización** (ambos son titulares de cuenta), que es una relación distinta y no arrastra ese problema. «Ver directorio» y «ver métricas» siguen siendo **casos de uso**, no relaciones de dominio.
6. **`Configuracion` → descartada.** Contenedor técnico de parámetros; los recursos y textos se aprovisionan **por entorno**. `RecursoDeAyuda` permanece como clase.
7. **`EventoDeSeguridad` y `RecursoDeAyuda` → conservadas.** En un dominio de *safety*, el evento de riesgo es de primera clase.
8. **`gate` / `fallback` / LLM / Groq / el framework de aplicación / el motor de persistencia / la plataforma de despliegue → excluidos.** Mecanismos e infraestructura, no conceptos del problema. La exclusión es **por categoría, no por producto**: vale cualquiera que sea el stack vigente (hoy, `ADR-002`), y por eso no caduca cuando el stack cambia.
9. **Registro/login/eliminar-cuenta, onboarding, chat, «pantalla», «formulario» → excluidos como clases.** Son acciones o UI: van a casos de uso.
10. **Estados y atributos → diferidos** (§6).
11. **El modelo de IA (LLM/Groq) → NO es clase de dominio.** Se conversa con **Alan/Aura** (`Personaje`); el LLM es *cómo* se genera el texto. Vive como **actor de sistema externo** en DCU-01, como **objeto frontera** en robustez y como decisión técnica en ADR-001-D3.

## 4. Relaciones (17) y su justificación

| Relación | Tipo | Justificación |
|---|---|---|
| `TitularDeCuenta <|-- Usuario` · `TitularDeCuenta <|-- Administrador` | **Generalización** | *Substitution test*: todo Usuario/Administrador **es** un titular de cuenta (§3.1) |
| `Personaje <|-- Alan` · `Personaje <|-- Aura` | **Generalización** | Todo Alan/Aura **es** un Personaje |
| `Conversacion *-- Mensaje : contiene` | **Composición** | Ciclo de vida dependiente: los mensajes se descartan con la conversación (no persistencia, RN-04) |
| `Visitante -- TitularDeCuenta : precede a` | Asociación | Orden de los roles: quien consulta sin cuenta puede pasar a tenerla (ECU-02). **No** se modela la transición como clase (antipatrón «*Missing state concept*» invertido: el rubro advierte de no convertir cada transición en clase) |
| `Usuario -- Consentimiento : otorga` | Asociación | Consentimiento informado |
| `Usuario -- CapsulaDePerfil : posee` | Asociación | La cápsula describe mínimamente al usuario |
| `Usuario -- Conversacion : mantiene` | Asociación | El usuario sostiene conversaciones |
| `Usuario -- ContadorDeUsoDiario : tiene` | Asociación | Cuota de uso por usuario (RN-02.9) |
| `CapsulaDePerfil -- Conversacion : orienta` | Asociación | Minimización: es lo único que llega al modelo |
| `Conversacion -- Personaje : acompañada por` | Asociación | Se conduce con Alan o Aura |
| `Conversacion -- EventoOperativo : se documenta con` | Asociación | Telemetría sin contenido; simétrica de `Mensaje -- EventoDeSeguridad` |
| `Mensaje -- EventoDeSeguridad : se documenta con` | Asociación | Un mensaje puede quedar documentado por un evento de seguridad |
| `EventoDeSeguridad -- RecursoDeAyuda : remite a` | Asociación | El evento deriva a recursos |
| `Administrador -- DisponibilidadDelChatbot : tiene a cargo` | Asociación | Kill switch: relación de responsabilidad, no de acción |
| `DisponibilidadDelChatbot -- Conversacion : condiciona` | Asociación | Solo se conversa si el chatbot está habilitado |

**16 clases, 17 relaciones** (4 generalizaciones + 1 composición + 12 asociaciones). Etiquetas conceptuales; sin multiplicidades. **Sin clases huérfanas.**

## 5. Trazabilidad hacia los casos de uso
Los sustantivos de este modelo **reaparecen por nombre** en DCU-01. La matriz clase ↔ caso de uso **se publicará** en `TRZ-01` (fase D.5): hoy **no existe en ningún artefacto**, que es precisamente lo que señaló el punto 4 de la retroalimentación docente.

Ejemplos de la correspondencia buscada: «Registrar cuenta» / «Eliminar cuenta» → `Visitante`, `TitularDeCuenta`, `Usuario` · «Otorgar consentimiento y crear la cápsula de perfil» → `Consentimiento`, `CapsulaDePerfil` · «Elegir acompañante (Alan o Aura)» → `Personaje`, `Alan`, `Aura` · «Derivar ante peligro» → `EventoDeSeguridad`, `RecursoDeAyuda` · «Habilitar o deshabilitar el chatbot» → `Administrador`, `DisponibilidadDelChatbot`.

> **Qué NO va en el dominio.** Las **acciones** (registrar, iniciar sesión, reiniciar, revocar, eliminar, ver directorio, ver métricas) **no** son atributos ni métodos aquí: el modelo **no lleva operaciones** (*academic strict*). Son casos de uso, y solo se vuelven métodos en la fase de diseño.

## 6. Diferido a fases posteriores
- **Atributos:** `TitularDeCuenta.{username, alias, contrasena, rol}` · `Usuario.{esAdulto, versionDisclosure}` · `Consentimiento.{capa ∈ {base, personalizacion}, estado, fecha, version}` · `CapsulaDePerfil.{mood_self_report, energy_self_report, conversation_goal, response_style, character}` + `schema_version`/`consent_version` · `DisponibilidadDelChatbot.estado` · `ContadorDeUsoDiario.{…}` (**`PER-H4` abierto**) · `EventoOperativo.{momento, resultado}` — los campos técnicos restantes (`request_id`, `version_prompt`, `entorno`…) son de **persistencia**, viven en PER-01 §3.6 y **no** son atributos de dominio.
- **Multiplicidades:** MV-01 **§13.3** (diferidas). *(SD-32, `H-H`: hasta v1.6 esta línea remitía a §13.2, que es la vista derivada `MétricaDeUso`, no las cardinalidades.)*
- **Clases de estado** candidatas, no incluidas: `EstadoConsentimiento`, `EstadoConversacion`.

## 7. Verificación

**Comprobado por script** (`validate_domain_puml.py`): **0 errores / 0 advertencias**. Cubre sintaxis, ausencia de operaciones/atributos/multiplicidades, nombres técnicos, clases desconectadas y etiquetas procedimentales **de su lista**.

> **Alcance real de ese 0/0.** La lista de verbos del validador es **literal y cerrada**: `valida`, `calcula`, `muestra`, `guarda`, `consulta`, `notifica`, `genera`, `comunica`, `actualiza`, `impide`, `verifica`, `aprueba`, `rechaza`, `afecta`. Ninguna de las etiquetas que v1.4 corrigió estaba en ella, así que **el 0/0 de v1.3 no probaba nada sobre este punto**. La comprobación que sí lo cubre es la lista de compuertas finales de la skill `uml-domain-modeler`, ejecutada por primera vez en v1.4.

**Comprobado a mano contra las *Final Quality Gates* de la skill** (ejecutadas en v1.4; el validador no las cubre):
- ✅ Generalizaciones `is-a` sometidas al *substitution test* una por una. `TitularDeCuenta <|-- Usuario/Administrador` se replanteó en v1.3 precisamente porque `Cuenta <|-- Usuario` **no** lo pasaba (§3.1).
- ✅ Composición justificada por ciclo de vida (los mensajes se descartan con la conversación) — cumple las dos condiciones que exige la skill: sin compartición y con borrado en cascada.
- ✅ Sin clases huérfanas: las 16 participan en ≥1 relación.
- ✅ Sin clases de UI, base de datos, infraestructura ni maquinaria de patrones de diseño; ningún caso de uso convertido en clase.
- ⚠️ **Etiquetas: cuatro fallaban y se corrigieron en v1.4** (ver §Changelog). La afirmación de v1.3 —«etiquetas conceptuales, revisadas a mano»— **era falsa**: la revisión no se había hecho contra el rubro de la skill.
- ⚠️ **Dos etiquetas se conservan con motivo declarado**, por la excepción de la propia regla («*unless the domain relationship truly requires them*»): `otorga` (otorgar el consentimiento **es** la relación de dominio, no una acción del sistema) y `condiciona` (enuncia una restricción del dominio, no un comportamiento).

**Tensión declarada, no resuelta:** `ContadorDeUsoDiario` y `EventoOperativo` entran al dominio con justificación de regla de negocio (§3.3, §3.4), pero **su origen documental es el mapa de persistencia**. Un revisor puede objetar razonablemente que son infraestructura. La decisión y su motivo quedan por escrito para que sea discutible, no invisible.

## 8. Cómo renderizar
El `.svg` se **regenera** desde el `.puml` (los colores y la tipografía viven en el propio `.puml` como `skinparam`, alineados con la paleta del repositorio):

```bash
java -jar plantuml.jar -tsvg -charset UTF-8 MD-01_modelo_dominio.puml
```

También sirve VS Code (extensión *PlantUML* → *Preview*) o `plantuml.com`. Ante cualquier discrepancia, **el `.puml` es la fuente de verdad**.

## 9. Canon de dominio
La `CapsulaDePerfil` (no el historial) es lo único que orienta la conversación (minimización); `Conversacion`/`Mensaje` no persisten (composición); `EventoDeSeguridad`/`RecursoDeAyuda` materializan la derivación segura; el `Personaje` no es identidad humana. **El `Administrador` no tiene ninguna relación con los datos conversacionales**: comparte con el `Usuario` únicamente la condición de titular de una cuenta.

## 10. Changelog

| Versión | Cambio |
|---|---|
| **v1.6** | **SD-30, hallazgo `H-1a` de `DS-00`. Solo anexo.** La decisión de modelado 4 decía que `EventoOperativo` es «el hecho de dominio de que **una conversación** ocurrió». Es **una llamada**: latencia, resultado, modelo y versión son valores de una petición, y `MET-07` mide «peticiones OK + *fallback* / totales». La justificación de la clase no cambia —sigue siendo que `Conversacion` no se persiste—, cambia el hecho que documenta. **El `.puml` queda intacto:** sin multiplicidades, la asociación ya admitía uno-a-muchos. |
| v1.7 | **SD-32. Solo anexo; el `.puml` no se toca.** `H-H` de `MC-00`: §6 remitía las multiplicidades a «MV-01 §13.2», que es la vista derivada `MétricaDeUso`; las cardinalidades están en **§13.3**. Referencia colgante corregida. |
| v1.5 | **SD-29. Solo anexo.** La decisión 8 deja de excluir productos concretos y pasa a excluir por **categoría**, para que la regla no caduque al cambiar el stack. |
| **v1.4** | **Compuertas finales de la skill `uml-domain-modeler` ejecutadas por primera vez** sobre este artefacto. Cuatro etiquetas de relación reescritas como relaciones estables de dominio, según el antipatrón «*Procedural relationship labels*» del rubro: `se convierte en` → **`precede a`**, `origina` ×2 → **`se documenta con`**, `controla` → **`tiene a cargo`**. Dos etiquetas (`otorga`, `condiciona`) se conservan con motivo declarado. Sin cambios de clases ni de tipos de relación. |
| v1.3 | +`TitularDeCuenta` como supertipo de `Usuario`/`Administrador`, +`Visitante`, +`ContadorDeUsoDiario`, +`EventoOperativo`; agrupación en 5 paquetes. Responde a los puntos 1 y 2 de la retroalimentación docente. `Cuenta <|-- Usuario` descartada por no pasar el *substitution test* (§3.1). |

> **Por qué v1.4 existe.** Las fases 1 y 2 del PDR-01 se ejecutaron **sin cargar** la skill `uml-domain-modeler`, trabajando desde el artefacto, el validador y reglas de segunda mano. Al cargarla y pasar la lista completa de compuertas aparecieron estos cuatro defectos, que ni el validador ni la auditoría independiente habían señalado. **Nada estructural resultó afectado**: las clases, los paquetes, las generalizaciones y la composición pasaron todas las compuertas sin cambios.

## 11. Cierre
- **Confirmado:** 16 clases, 17 relaciones (4 generalizaciones + 1 composición + 12 asociaciones), 5 paquetes, validador 0/0, sin huérfanas, compuertas de la skill superadas.
- **Pendiente:** `PER-H4` (campos de `ContadorDeUsoDiario`); `AccionAdministrativa` sigue fuera por RA-01.

**Fin de MD-01.**
