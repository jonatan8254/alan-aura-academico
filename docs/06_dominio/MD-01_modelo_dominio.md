# MD-01 — Modelo de dominio del MVP «Alan & Aura Académico»
**ID:** MD-01 · **Familia:** MD (dominio, fase 2 ICONIX) · **Hogar:** `docs/06_dominio/` · **Fecha:** 2026-07-12 · **Versión:** v1.2 (SD-15: +`DisponibilidadDelChatbot`, `Configuracion` descartada · refinamiento: relación `Administrador--Usuario`/«supervisa» retirada — directorio/métricas son casos de uso, §3.3; nota de capas §5).
**Artefacto ejecutable:** [`MD-01_modelo_dominio.puml`](MD-01_modelo_dominio.puml) (PlantUML copy-ready, fuente de verdad). **Render acompañante:** [`MD-01_modelo_dominio.svg`](MD-01_modelo_dominio.svg) (vista estática, autocontenida, coincide 1:1 con el `.puml`; útil para revisar sin herramienta PlantUML).
**Insumos:** MV-01 (consolidado, §3 candidatos, §4 relaciones, §8 vistas, §14 handoff), VIS-01 (actores/alcance), REQ-01 (reglas de negocio), CONTRATO conversacional, SEG-01, PRIV-01, TRZ-01.
**Consumidores:** casos de uso (skill `uml-use-case-diagram`), especificación de casos de uso, robustez, clases (fases posteriores).
**Generado con:** skill `uml-domain-modeler` (modo *academic strict*). **Validador:** `validate_domain_puml.py` → **0 errores / 0 advertencias**.
**Naturaleza:** análisis estático conceptual — glosario del dominio. **No** es diseño, ni modelo de datos, ni arquitectura, ni flujo, ni diagrama de casos de uso.

---

## 1. Modo y contrato aplicados
- **Academic strict** (subproyecto "para entregar", modelo inicial): **sin atributos, sin métodos, sin multiplicidades**, sin tipos ni claves; `hide fields/methods/empty members`.
- **Español**, un término por concepto (alias resueltos: Alan no «Alanus/Alanor»; Aura no «Pandora»).
- Solo **clases conceptuales y relaciones**; los atributos, cardinalidades y estados quedan **diferidos** (§6, reserva de MV-01 §13).

## 2. Clases del dominio (12) y su clasificación
| Clase | Clasificación | Origen |
|---|---|---|
| **Usuario** | Actor/rol + clase de dominio | MV-01 §3, VIS actor |
| **Administrador** | Actor/rol + clase de dominio | MV-01 §3, VIS actor |
| **DisponibilidadDelChatbot** | Estado operativo del servicio (kill switch) | MV-01 §3 (SD-15), plan §3.7 |
| **Consentimiento** | Clase central (registro con ciclo de vida) | MV-01 §3, PRIV-01 |
| **CapsulaDePerfil** | Clase central | MV-01 §3, PRIV-01 |
| **Personaje** | Superclase (abstracción) | MV-01 §3 |
| **Alan** | Especialización (`is-a` Personaje) | MV-01 §3, contrato |
| **Aura** | Especialización (`is-a` Personaje) | MV-01 §3, contrato |
| **Conversacion** | Clase central (objeto de negocio nuclear) | MV-01 §3 |
| **Mensaje** | Clase secundaria (parte de la conversación) | MV-01 §3 |
| **EventoDeSeguridad** | Evento de dominio (safety) | MV-01 §3, SEG-01 |
| **RecursoDeAyuda** | Recurso de dominio | MV-01 §3, SEG-01 |

> **Actor sin clase:** `Visitante` (consulta la presentación; sin datos de dominio) → actor de caso de uso. **Vista derivada (no clase):** `MétricaDeUso` (agregados operativos que ve el admin).

## 3. Decisiones de modelado (los *borderline* que resolvió la skill)
1. **`DisponibilidadDelChatbot` → añadida (SD-15).** El **kill switch** del plan (habilitar/deshabilitar el chatbot) es, como sustantivo, un **estado operativo del servicio** con identidad y ciclo de vida (habilitado/deshabilitado). Lo controla el `Administrador` y **condiciona** si pueden iniciarse `Conversacion`es. Da presencia real al administrador en el dominio.
2. **`Configuracion` → descartada como clase.** Es un contenedor técnico de parámetros (recursos, textos, señales del gate). No aporta vocabulario de dominio y roza el término de infraestructura. Alineado al plan (§2.5/§3.7): el administrador **no** edita recursos/textos; se aprovisionan **por entorno**. `RecursoDeAyuda` permanece como clase (participa en la derivación). Los textos son **atributos** diferidos.
3. **El administrador y sus funciones (refinamiento SD-15).** El admin tiene **una sola** relación de dominio: `Administrador -- DisponibilidadDelChatbot : controla` (el kill switch es un estado-sustantivo real). Sus otras dos funciones **no** son relaciones del dominio: «ver directorio» es una **vista** sobre `Usuario` y «ver métricas» es una **vista derivada** (agregados). **No** se dibuja `Administrador -- Usuario`, porque (a) sería una relación de *acceso/comportamiento*, no conceptual, y (b) «supervisa» se malinterpreta como que el admin vigila las conversaciones — lo que **viola el canon**. El directorio y las métricas viven como **casos de uso**, no como cajas ni líneas del dominio.
4. **`EventoDeSeguridad` → conservada.** En un dominio de *safety* (salud emocional), un evento de riesgo es de primera clase con identidad, ciclo de vida y trazabilidad (se origina en un `Mensaje`, remite a `RecursoDeAyuda`).
5. **`RecursoDeAyuda` → conservada.** Recurso de derivación estable del dominio (participa en `remite a`).
6. **`gate` / `fallback` / LLM / Groq / Django / SQLite → excluidos.** Mecanismos, servicios e infraestructura (espacio de solución), no conceptos del problema.
7. **Registro/login/eliminar-cuenta, onboarding, chat, «pantalla», «formulario» → excluidos como clases.** Son **acciones**, procesos o UI (van a casos de uso, no a clases). El sustantivo asociado es `Usuario` (la cuenta), ya presente.
8. **Estados y atributos → diferidos** (no clases en la primera pasada). Ver §6.
9. **El modelo de IA (LLM / Groq) → NO es clase de dominio (hipótesis analizada y descartada).** Aunque el LLM es central en la *dinámica* del chat, el modelo de dominio captura el **vocabulario del problema**, no el **mecanismo** de la solución. Razones: (a) desde la vista del usuario y de los casos de uso, se conversa con **Alan/Aura** (`Personaje`), no con "un LLM" — el `Personaje` **es** el interlocutor conceptual y el LLM es *cómo* genera su texto; (b) la salida del LLM ya está representada: es un `Mensaje` del personaje; (c) el propio plan de Codex clasifica a Groq como **sistema externo** ("genera texto, pero no es actor clínico ni decisor autónomo"), no como entidad de dominio; (d) la skill excluye por defecto *service/API/infraestructura*. **Dónde SÍ vive el LLM:** como **actor de sistema externo** en el diagrama de casos de uso, como **objeto frontera** en robustez, como **lifeline** en secuencia, y como **decisión técnica** en ADR-001-D3. Su *gobierno* (minimización, guardas, fallback, kill switch) sí es dominio y ya está modelado vía reglas (RN-03/05), `EventoDeSeguridad` y `DisponibilidadDelChatbot` — pero gobernar el LLM no lo convierte en sustantivo del problema.

## 4. Relaciones (tipo y justificación)
| Relación | Tipo | Justificación |
|---|---|---|
| `Personaje <|-- Alan` · `Personaje <|-- Aura` | **Generalización** | Pasa el *substitution test*: todo Alan/Aura **es** un Personaje. |
| `Conversacion *-- Mensaje : contiene` | **Composición** | Parte con dependencia de ciclo de vida: los mensajes no se comparten y se descartan con la conversación (canon de **no persistencia**, RN-04). |
| `Administrador -- DisponibilidadDelChatbot : controla` | Asociación | El admin habilita/deshabilita el chatbot (kill switch). |
| `DisponibilidadDelChatbot -- Conversacion : condiciona` | Asociación | Solo se inician conversaciones si el chatbot está habilitado. |
| `Usuario -- Consentimiento : otorga` | Asociación | Hecho de dominio (consentimiento informado). |
| `Usuario -- CapsulaDePerfil : posee` | Asociación | La cápsula describe mínimamente al usuario. |
| `Usuario -- Conversacion : mantiene` | Asociación | El usuario sostiene conversaciones. |
| `CapsulaDePerfil -- Conversacion : orienta` | Asociación | La cápsula da contexto a la conversación (minimización: es lo único que llega al modelo). |
| `Conversacion -- Personaje : acompañada por` | Asociación | La conversación se conduce con Alan o Aura. |
| `Mensaje -- EventoDeSeguridad : origina` | Asociación | Un mensaje puede dar lugar a un evento de seguridad. |
| `EventoDeSeguridad -- RecursoDeAyuda : remite a` | Asociación | El evento deriva a recursos de ayuda. |

**Etiquetas conceptuales** (no procedimentales); **sin multiplicidades** (modo strict). `Conversacion` es el objeto nuclear (5 relaciones, no es *hub* excesivo). **Sin clases huérfanas** (12 clases, 12 relaciones: 2 generalizaciones + 1 composición + 9 asociaciones). `Administrador` participa solo en `controla` (sus demás funciones son casos de uso, §3.3).

## 5. Trazabilidad hacia casos de uso (columna vertebral)
Los sustantivos de este modelo deben **reaparecer por nombre** en los casos de uso posteriores. Ejemplos candidatos (no producidos aquí):
- «Registrar cuenta» / «Eliminar cuenta» → `Usuario`.
- «Registrar consentimiento» / «Revocar personalización» → `Usuario`, `Consentimiento`, `CapsulaDePerfil`.
- «Conversar con Alan/Aura» → `Usuario`, `Conversacion`, `Personaje`, `Mensaje`.
- «Derivar ante peligro» → `EventoDeSeguridad`, `RecursoDeAyuda`.
- «Habilitar/deshabilitar el chatbot» (kill switch) → `Administrador`, `DisponibilidadDelChatbot`.
- «Ver directorio de usuarios» / «Ver métricas agregadas» → `Administrador`, `Usuario` (agregado).
Cadena: `MV-01 → MD-01 (este) → casos de uso → especificación → robustez → secuencia`.

> **Qué NO va en el dominio y por qué (tres capas).** Las **acciones** (registrar, iniciar sesión, reiniciar perfil, revocar, **eliminar cuenta**, ver directorio, ver métricas, habilitar chatbot) **no** son ni atributos ni métodos aquí: el modelo de dominio **no lleva operaciones** (regla *academic strict*). Son **casos de uso** (capa siguiente) y solo se vuelven **métodos/operaciones** de clases en la **fase de diseño**. Las clases se ven "vacías" a propósito: aquí solo viven los **sustantivos** y sus relaciones conceptuales; los **datos** (username, alias, edad…) son atributos **diferidos** (§6).

## 6. Diferido a fases posteriores (reserva)
Coherente con el modo *academic strict* y la regla ICONIX «no attributes / defer multiplicity» — todo esto vive en MV-01 §13 y se incorporará al **refinamiento** (no al modelo inicial):
- **Atributos / dominios de valor:** `Usuario.edad`, `CapsulaDePerfil.{mood_self_report, energy_self_report, conversation_goal, response_style, character}` + metadatos `schema_version`/`consent_version` (= `ContextoInicialConversacionalV1`, plan §3.4; SD-22), textos de consentimiento/*disclosure*, señales del gate.
- **Multiplicidades:** ver MV-01 §13.2 (candidatas, diferidas).
- **Clases de estado** (candidatas, no incluidas para mantener el modelo mínimo-suficiente): `EstadoConsentimiento` {otorgado, revocado}, `EstadoConversacion` {activa, cerrada}. Se añadirán solo si mejoran la trazabilidad de casos de uso.

## 7. Verificación (quality gates de la skill)
- ✅ `@startuml … @enduml`; `linetype ortho`, `classAttributeIconSize 0`, `hide fields/methods/empty members`.
- ✅ Sin operaciones, sin atributos, sin multiplicidades, sin tipos (modo strict).
- ✅ Sin clases de implementación/BD/UI/API/infra; sin casos de uso como clases.
- ✅ Generalizaciones `is-a` válidas; composición justificada por ciclo de vida.
- ✅ Etiquetas conceptuales; sin relaciones transitivas redundantes.
- ✅ Sin clases huérfanas; vocabulario trazable a casos de uso preservado.
- ✅ **Validador `validate_domain_puml.py`: 0 errores / 0 advertencias.**

## 8. Cómo renderizar
- **Ya renderizado:** [`MD-01_modelo_dominio.svg`](MD-01_modelo_dominio.svg) — vista estática lista para abrir en cualquier navegador o visor de imágenes, agrupada por color (actores/identidad/conversación/seguridad) con leyenda de notación (asociación, generalización, composición).
- **Para regenerar o editar el `.puml`:** VS Code (extensión *PlantUML* → *Preview*, Alt+D), `plantuml.com`, o `java -jar plantuml.jar MD-01_modelo_dominio.puml` (PNG/SVG).
- El `.svg` es una vista derivada del `.puml`; ante cualquier discrepancia, el `.puml` es la fuente de verdad (regenerar el `.svg` si el `.puml` cambia).

## 9. Canon de dominio (recordatorio)
El modelo respeta el canon: la `CapsulaDePerfil` (no historial) es lo único que orienta la conversación (minimización); `Conversacion`/`Mensaje` no persisten (composición); `EventoDeSeguridad`/`RecursoDeAyuda` materializan la derivación segura; el `Personaje` no es identidad humana (contrato, *disclosure*).

## 10. Cierre
- **Confirmado:** 12 clases, 12 relaciones (2 generalizaciones + 1 composición + 9 asociaciones), validador limpio (0/0); administrador conectado por el kill switch (`controla`); directorio/métricas y las acciones de cuenta viven como casos de uso, no como cajas.
- **Recomendación:** al abrir casos de uso, reusar estos nombres exactos; evaluar entonces las clases de estado (§6) y las multiplicidades.
- **Pendiente (fuera de alcance):** casos de uso, robustez, secuencia, clases de diseño.

**Fin de MD-01.**
