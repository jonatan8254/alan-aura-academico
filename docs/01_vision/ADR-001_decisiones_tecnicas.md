# ADR-001 — Decisiones técnicas del MVP «Alan & Aura Académico»
**ID:** ADR-001 · **Hogar:** `docs/01_vision/` · **Fecha:** 2026-07-12 · **Versión:** v1.1 (SD-29: D1, D2 y D5 marcadas como superadas por `ADR-002`) · **Estado:** **parcialmente superada** — D3, D4, D6 y D7 vigentes; D1, D2 y D5 superadas por `ADR-002`.
**Insumos:** plan generado con Codex (auditado en `00_AUDITORIA_PLAN_CODEX.md`, R4); VIS-01; restricciones académicas.
**Consumidores:** REQ-01 (RNF de portabilidad/rendimiento/mantenibilidad), PLAN-01 (riesgos), fase de construcción.
**Naturaleza:** registro de decisiones de arquitectura. **Regla de honestidad (§4.9):** los hechos sobre servicios externos **no fueron verificados** en esta ejecución.

> ## ⚠ Superada parcialmente por `ADR-002` (2026-08-01, SD-29)
> **`ADR-001-D1` (Django), `ADR-001-D2` (SQLite) y `ADR-001-D5` (PythonAnywhere) están superadas** por [`ADR-002_reversion_stack_serverless.md`](ADR-002_reversion_stack_serverless.md), que decide React + Vercel + AWS serverless. **Se conservan aquí sin modificar**, por trinquete: registran qué se decidió y con qué razones, y sin ellas la reversión no sería auditable.
>
> **`ADR-001-D3` (Groq `gpt-oss-20b`), `D4` (GitHub), `D6` (recursos por entorno) y `D7` (español, adultos) siguen plenamente vigentes.** `ADR-002-D8` reafirma D3 de forma expresa.
>
> **Ninguna de las condiciones de reversa escritas más abajo disparó el cambio** — D2 preveía Postgres, D5 preveía Render, D1 preveía otra LTS de Django. Fue una decisión nueva del equipo; el motivo real está en `ADR-002 §0`.

## Escala de verificación de hechos externos
| Marca | Significado |
|---|---|
| **[N1]** | Hecho interno del subproyecto (verificable en estos artefactos). |
| **[N5]** | **Decisión de plan** sobre un servicio/tecnología externa: adoptada, **no verificada** aquí — **verificar antes del release**. |
| **[N6]** | **Hecho externo volátil** (disponibilidad de *free tier*, versión, cuota, modelo hospedado): además de verificar, **monitorear** porque cambia sin aviso. |

---

## ADR-001-D1 — ~~Framework de aplicación: **Django 5.2 LTS**~~ · **SUPERADA por `ADR-002-D1`/`D4`/`D7`**
- **Contexto:** MVP web con onboarding, chat y administración; equipo académico; se valora soporte largo (LTS) y baterías incluidas (auth, admin, ORM). [N5]
- **Decisión:** usar **Django 5.2 LTS** como framework de backend y de plantillas del MVP. [N5]
- **Consecuencias:** admin de Django cubre gran parte de OBJ-6 (administración mínima) sin código extra; ORM sobre SQLite; el *release* debe fijar la versión exacta y confirmar que 5.2 es LTS vigente. [N5]
- **Condición de reversa:** si 5.2 LTS no está disponible/soportada al iniciar construcción → fijar la LTS vigente más cercana; el diseño no depende de features exclusivas de 5.2.

## ADR-001-D2 — ~~Persistencia: **SQLite**~~ · **SUPERADA por `ADR-002-D5`**
- **Contexto:** volumen de datos mínimo (perfiles de prueba, configuración); **el chat no se persiste** (canon, PRIV-01); despliegue en *free tier*. [N1]
- **Decisión:** **SQLite** como motor de base de datos del MVP. [N5]
- **Consecuencias:** cero infraestructura de BD; suficiente para la carga académica; **no** apto para concurrencia alta ni multi-instancia (aceptable en el MVP). La no-persistencia del chat es requisito, no efecto colateral (RN/RNF en REQ-01). [N1]
- **Condición de reversa:** si el hosting no soporta SQLite con escritura persistente → migrar a Postgres gestionado (no previsto para el MVP).

## ADR-001-D3 — Motor conversacional: **Groq API, modelo `gpt-oss-20b`**
- **Contexto:** se necesita un LLM de bajo/nulo coste, con latencia baja, para la conversación Alan/Aura. El plan Codex seleccionó Groq con `gpt-oss-20b`. [N6]
- **Decisión:** integrar **Groq API** con el modelo **`gpt-oss-20b`** como generador conversacional, **gobernado** por el sistema (recibe la cápsula + *system prompt* de personalidad + guardas; **nunca** historial bruto). [N6]
- **Consecuencias:** dependencia de un servicio externo y de su *free tier*/cuota; el nombre exacto del modelo, su disponibilidad y sus límites **deben verificarse antes del release** (V6-a). La ruta de **seguridad no depende del LLM** (SEG-01: fallback determinista). [N6] §4.9
- **Condición de reversa:** si `gpt-oss-20b` o el *free tier* de Groq no está disponible → sustituir por otro proveedor/modelo equivalente **sin cambiar** el contrato de gobierno (cápsula + guardas + gate). El diseño es **agnóstico del proveedor**.

## ADR-001-D4 — Control de versiones: **GitHub**
- **Contexto:** trabajo en equipo, entrega académica, historia auditable. [N5]
- **Decisión:** **GitHub** como repositorio del subproyecto **cuando se extraiga** (diferido, SD-11). En esta fase los artefactos viven en la subcarpeta del repo del macro, aislados. [N1]
- **Consecuencias:** sin repo separado ahora; la carpeta es **extraíble** tal cual. No se versiona contenido con © de terceros. [N1]
- **Condición de reversa:** ninguna relevante; decisión de bajo riesgo.

## ADR-001-D5 — ~~Despliegue: **PythonAnywhere Free** (contingencia **Render**)~~ · **SUPERADA por `ADR-002-D3`/`D4`**
- **Contexto:** se requiere hosting gratuito para demostrar el MVP; el plan eligió PythonAnywhere Free con Render como contingencia. [N6]
- **Decisión:** desplegar en **PythonAnywhere Free**; si sus límites (CPU/always-on/salidas de red hacia Groq) lo impiden → **Render** como contingencia. [N6]
- **Consecuencias:** límites de *free tier* (horas de CPU, *sleep*, whitelist de dominios de salida) pueden afectar las llamadas al LLM; **verificar antes del release** que PythonAnywhere Free permite las llamadas salientes a Groq. [N6] §4.9
- **Condición de reversa:** documentada como parte de la propia decisión (Render). Si ninguno sirve → demo local, sin comprometer la entrega documental.

## ADR-001-D6 — Recursos de ayuda / crisis: **configurables por entorno**
- **Contexto:** el fallback de seguridad (SEG-01) deriva a líneas/servicios de ayuda; esos datos **cambian** y no deben quedar *hardcodeados* ni publicados en artefactos. [N1]
- **Decisión:** los recursos de derivación se leen de **configuración por entorno** (variables/tabla de administración), nunca de código ni de estos documentos (SD-12). [N1]
- **Consecuencias:** el administrador (OBJ-6) los actualiza sin tocar código; los artefactos no publican números que se vuelven obsoletos o incorrectos. [N1]
- **Condición de reversa:** ninguna; es una salvaguarda de correctitud.

## ADR-001-D7 — Idioma y público: **español (Colombia), adultos**
- **Contexto:** contexto de la materia y del usuario; política de menores no resuelta en el macro. [N1]
- **Decisión:** interfaz y *prompts* en **español (CO)**; público **solo adultos** con *disclosure* de IA (SD-08, SD-09). [N1]
- **Consecuencias:** copy y onboarding en español; verificación de mayoría de edad por declaración; menores fuera de alcance. [N1]
- **Condición de reversa:** ampliar a menores exigiría rediseño de consentimiento y protección (no previsto).

---

## Resumen de verificaciones pendientes (antes del release)
| Decisión | Qué verificar | Marca | Estado |
|---|---|---|---|
| ~~D1~~ | ~~Django 5.2 es LTS vigente y soportada~~ | [N5] | **Decae:** D1 superada por `ADR-002` |
| **D3** | Groq `gpt-oss-20b`: existencia del modelo, *free tier*, cuota, latencia | [N6] | **Vigente** — reafirmada por `ADR-002-D8` |
| ~~D5~~ | ~~PythonAnywhere Free permite salida HTTPS a Groq; límites de CPU/always-on~~ | [N6] | **Decae:** D5 superada por `ADR-002` |

Las verificaciones que sustituyen a las de D1 y D5 —capa gratuita de Vercel y de AWS, entorno de ejecución Node 22, arranque en frío, región y residencia de datos— están en **`ADR-002 §4`** y en `V6-a`.

> Estas verificaciones son **nivel 6** (servicios externos): las resuelve el usuario/equipo al iniciar construcción, no esta auditoría (§4.9). PLAN-01 las incluye como riesgos con control.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.1 | 2026-08-01 | J. Sánchez | **SD-29.** Se marcan **D1, D2 y D5 como superadas** por `ADR-002` (React + Vercel + AWS serverless), conservando su texto íntegro por trinquete. Se declara en cabecera que ninguna condición de reversa escrita aquí disparó el cambio. Se depura la tabla de verificaciones pendientes: decaen las de D1 y D5, se mantiene la de D3. **Sin cambios en D3, D4, D6 ni D7.** |
| v1.0 | 2026-07-12 | J. Sánchez | Creación: siete decisiones técnicas con condiciones de reversa, derivadas del plan de Codex (SD-06). |
