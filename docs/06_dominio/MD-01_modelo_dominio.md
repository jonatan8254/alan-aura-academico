# MD-01 — Modelo de dominio del MVP «Alan & Aura Académico»
**ID:** MD-01 · **Familia:** MD (dominio, fase 2 ICONIX) · **Hogar:** `docs/06_dominio/` · **Fecha:** 2026-07-30 · **Versión:** v1.3 (PDR-01: +`Cuenta` como supertipo de `Usuario`/`Administrador`, +`Visitante`, +`ContadorDeUsoDiario`, +`EventoOperativo`; agrupación en 5 paquetes).
**Artefacto ejecutable:** [`MD-01_modelo_dominio.puml`](MD-01_modelo_dominio.puml) (PlantUML copy-ready, fuente de verdad). **Render acompañante:** [`MD-01_modelo_dominio.svg`](MD-01_modelo_dominio.svg).
**Insumos:** MV-01, VIS-01, REQ-01, CONTRATO conversacional, SEG-01, PRIV-01, **PER-01** (mapa de persistencia), TRZ-01, **retroalimentación docente (RET-01)** y el **delta de object discovery de DR-00 §4**.
**Consumidores:** DCU-01, especificación de casos de uso, robustez, clases (fases posteriores).
**Generado con:** skill `uml-domain-modeler` (modo *academic strict*). **Validador:** `validate_domain_puml.py` → **0 errores / 0 advertencias**.
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
| **Visitante** | Actor/rol + clase de dominio | RET-01 punto 2; VIS-01 actor |
| **Cuenta** | **Supertipo** (identidad de acceso) | RET-01 punto 1; PER-01 §3.1 (`User.rol`) |
| **Usuario** | Especialización (`is-a` Cuenta) | MV-01 §3, VIS actor |
| **Administrador** | Especialización (`is-a` Cuenta) | MV-01 §3, VIS actor |
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

1. **`Cuenta` como supertipo (RET-01 punto 1).** El profesor observó que «el administrador es un tipo de usuario». Se resuelve con un **supertipo** en vez de `Usuario <|-- Administrador` porque el `Usuario` de este modelo `otorga Consentimiento`, `posee CapsulaDePerfil` y `mantiene Conversacion` — y un administrador **no hace nada de eso** (canon: no ve datos conversacionales). `Cuenta` recoge lo común (identidad de acceso y rol) y ambos la especializan. Coincide con lo que ya describe **PER-01 §3.1**: no existe entidad `Administrador`; hay una sola cuenta con `rol ∈ {usuario, administrador}`. Pasa el *substitution test*: todo `Usuario` y todo `Administrador` **es** una `Cuenta`.
2. **`Visitante` pasa a ser clase (RET-01 punto 2) — reversión declarada.** MV-01 §3 y §14 y MD-01 v1.2 §2 lo clasificaban como «actor **sin** clase de dominio», con el criterio «sin datos ni relaciones de dominio». La retroalimentación docente pide representarlo, y la relación `Visitante -- Cuenta : se registra y obtiene` es un hecho real del dominio (ECU-02 §5: «Visitante pasa a Usuario al crear la cuenta»), de modo que **deja de ser una clase huérfana** y no rompe el gate de calidad. Se registra como reversión en `SD-28`.
3. **`ContadorDeUsoDiario` → añadida.** Materializa la cuota de RN-02.9 (3/min, 30/día) y **participa en el borrado en cascada** (ECU-04 paso 3, PRIV-R11, PER-T1). Sin ella el modelo describía una cascada incompleta: nombraba `Usuario`, `Consentimiento` y `CapsulaDePerfil` y omitía en silencio un dato por usuario que sí se persiste. *(Sus campos siguen sin especificar: `PER-H4` continúa abierto.)*
4. **`EventoOperativo` → añadida (resuelve D-12).** MV-01 §13.2 lo agrupaba con `MétricaDeUso` como «vista derivada (no clase)», pero **PER-01 §3.6** lo define como entidad persistida de 8 campos y lo declara «la **única** fuente de las métricas agregadas del administrador». La contradicción se resuelve a favor de PER-01: sin esta clase, la tasa técnica de 7 días que exige ECU-09 sería **incomputable**, porque `Conversacion` no se persiste. `MétricaDeUso` **sí sigue siendo vista derivada**.
5. **El administrador y sus funciones (refinamiento de SD-15, vigente).** Sigue **sin** dibujarse `Administrador -- Usuario` como **asociación**: sería una relación de acceso/comportamiento y la etiqueta «supervisa» se malinterpreta como que el admin vigila las conversaciones, lo que **viola el canon**. Lo que v1.3 añade es una **generalización** (ambos son `Cuenta`), que es una relación distinta y no arrastra ese problema. «Ver directorio» y «ver métricas» siguen siendo **casos de uso**, no relaciones de dominio.
6. **`Configuracion` → descartada.** Contenedor técnico de parámetros; los recursos y textos se aprovisionan **por entorno**. `RecursoDeAyuda` permanece como clase.
7. **`EventoDeSeguridad` y `RecursoDeAyuda` → conservadas.** En un dominio de *safety*, el evento de riesgo es de primera clase.
8. **`gate` / `fallback` / LLM / Groq / Django / SQLite → excluidos.** Mecanismos e infraestructura, no conceptos del problema.
9. **Registro/login/eliminar-cuenta, onboarding, chat, «pantalla», «formulario» → excluidos como clases.** Son acciones o UI: van a casos de uso.
10. **Estados y atributos → diferidos** (§6).
11. **El modelo de IA (LLM/Groq) → NO es clase de dominio.** Se conversa con **Alan/Aura** (`Personaje`); el LLM es *cómo* se genera el texto. Vive como **actor de sistema externo** en DCU-01, como **objeto frontera** en robustez y como decisión técnica en ADR-001-D3.

## 4. Relaciones (17) y su justificación

| Relación | Tipo | Justificación |
|---|---|---|
| `Cuenta <|-- Usuario` · `Cuenta <|-- Administrador` | **Generalización** | *Substitution test*: todo Usuario/Administrador **es** una Cuenta (§3.1) |
| `Personaje <|-- Alan` · `Personaje <|-- Aura` | **Generalización** | Todo Alan/Aura **es** un Personaje |
| `Conversacion *-- Mensaje : contiene` | **Composición** | Ciclo de vida dependiente: los mensajes se descartan con la conversación (no persistencia, RN-04) |
| `Visitante -- Cuenta : se registra y obtiene` | Asociación | Hecho de dominio (ECU-02) |
| `Usuario -- Consentimiento : otorga` | Asociación | Consentimiento informado |
| `Usuario -- CapsulaDePerfil : posee` | Asociación | La cápsula describe mínimamente al usuario |
| `Usuario -- Conversacion : mantiene` | Asociación | El usuario sostiene conversaciones |
| `Usuario -- ContadorDeUsoDiario : acumula` | Asociación | Cuota de uso por usuario (RN-02.9) |
| `CapsulaDePerfil -- Conversacion : orienta` | Asociación | Minimización: es lo único que llega al modelo |
| `Conversacion -- Personaje : acompañada por` | Asociación | Se conduce con Alan o Aura |
| `Conversacion -- EventoOperativo : origina` | Asociación | Telemetría sin contenido; simétrica de `Mensaje -- EventoDeSeguridad` |
| `Mensaje -- EventoDeSeguridad : origina` | Asociación | Un mensaje puede dar lugar a un evento de seguridad |
| `EventoDeSeguridad -- RecursoDeAyuda : remite a` | Asociación | El evento deriva a recursos |
| `Administrador -- DisponibilidadDelChatbot : controla` | Asociación | Kill switch |
| `DisponibilidadDelChatbot -- Conversacion : condiciona` | Asociación | Solo se conversa si el chatbot está habilitado |

**16 clases, 17 relaciones** (4 generalizaciones + 1 composición + 12 asociaciones). Etiquetas conceptuales; sin multiplicidades. **Sin clases huérfanas.**

## 5. Trazabilidad hacia los casos de uso
Los sustantivos de este modelo **reaparecen por nombre** en DCU-01. La matriz clase ↔ caso de uso se publica en `TRZ-01` (novedad de PDR-01: antes no existía en ningún artefacto, que es lo que señaló el punto 4 de la retroalimentación docente).

Ejemplos de la correspondencia buscada: «Registrar cuenta» / «Eliminar cuenta» → `Visitante`, `Cuenta`, `Usuario` · «Otorgar consentimiento y crear la cápsula de perfil» → `Consentimiento`, `CapsulaDePerfil` · «Elegir acompañante (Alan o Aura)» → `Personaje`, `Alan`, `Aura` · «Derivar ante peligro» → `EventoDeSeguridad`, `RecursoDeAyuda` · «Habilitar o deshabilitar el chatbot» → `Administrador`, `DisponibilidadDelChatbot`.

> **Qué NO va en el dominio.** Las **acciones** (registrar, iniciar sesión, reiniciar, revocar, eliminar, ver directorio, ver métricas) **no** son atributos ni métodos aquí: el modelo **no lleva operaciones** (*academic strict*). Son casos de uso, y solo se vuelven métodos en la fase de diseño.

## 6. Diferido a fases posteriores
- **Atributos:** `Cuenta.{username, alias, contrasena, rol}` · `Usuario.{esAdulto, versionDisclosure}` · `Consentimiento.{capa ∈ {base, personalizacion}, estado, fecha, version}` · `CapsulaDePerfil.{mood_self_report, energy_self_report, conversation_goal, response_style, character}` + `schema_version`/`consent_version` · `DisponibilidadDelChatbot.estado` · `ContadorDeUsoDiario.{…}` (**`PER-H4` abierto**) · `EventoOperativo.{timestamp, request_id, latencia, modelo, version_prompt, estado, entorno}`.
- **Multiplicidades:** MV-01 §13.2 (diferidas).
- **Clases de estado** candidatas, no incluidas: `EstadoConsentimiento`, `EstadoConversacion`.

## 7. Verificación
- ✅ `@startuml … @enduml`; `linetype ortho`, `hide fields/methods/empty members`.
- ✅ Sin operaciones, atributos, multiplicidades ni tipos (modo strict).
- ✅ Sin clases de implementación/BD/UI/API/infra.
- ✅ Generalizaciones `is-a` válidas (*substitution test*); composición justificada por ciclo de vida.
- ✅ **Sin clases huérfanas**: las 16 participan en ≥1 relación.
- ✅ **Validador `validate_domain_puml.py`: 0 errores / 0 advertencias.**

## 8. Cómo renderizar
El `.svg` se **regenera** desde el `.puml` (los colores y la tipografía viven en el propio `.puml` como `skinparam`, alineados con la paleta del repositorio):

```bash
java -jar plantuml.jar -tsvg -charset UTF-8 MD-01_modelo_dominio.puml
```

También sirve VS Code (extensión *PlantUML* → *Preview*) o `plantuml.com`. Ante cualquier discrepancia, **el `.puml` es la fuente de verdad**.

## 9. Canon de dominio
La `CapsulaDePerfil` (no el historial) es lo único que orienta la conversación (minimización); `Conversacion`/`Mensaje` no persisten (composición); `EventoDeSeguridad`/`RecursoDeAyuda` materializan la derivación segura; el `Personaje` no es identidad humana. **El `Administrador` no tiene ninguna relación con los datos conversacionales**: comparte con el `Usuario` únicamente la identidad de acceso (`Cuenta`).

## 10. Cierre
- **Confirmado:** 16 clases, 17 relaciones (4 generalizaciones + 1 composición + 12 asociaciones), 5 paquetes, validador 0/0, sin huérfanas.
- **Novedad de v1.3:** responde a los puntos 1 y 2 de la retroalimentación docente e incorpora dos de las tres clases del delta de robustez.
- **Pendiente:** `PER-H4` (campos de `ContadorDeUsoDiario`); `AccionAdministrativa` sigue fuera por RA-01.

**Fin de MD-01.**
