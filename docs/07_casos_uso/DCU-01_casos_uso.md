# DCU-01 — Diagrama de casos de uso del MVP «Alan & Aura Académico»
**ID:** DCU-01 · **Familia:** DCU (casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/` · **Fecha:** 2026-07-30 · **Versión:** v2.0 (PDR-01: 10 → 14 casos de uso; responde al punto 3 de la retroalimentación docente).
**Artefacto ejecutable:** [`DCU-01_casos_uso.puml`](DCU-01_casos_uso.puml) (**fuente de verdad**). **Render acompañante:** [`DCU-01_casos_uso.svg`](DCU-01_casos_uso.svg), regenerable desde el `.puml`.
**Insumos:** MV-01, **MD-01 v1.3** (vocabulario controlado — **no** se copian clases; de ahí sale el rol general `Titular de cuenta`), VIS-01, REQ-01 (RF-01…26), contrato conversacional, SEG-01, plan §5.3, **retroalimentación docente** (se registrará en `RET-01`, fase D.6).
**Consumidores:** `ECU-01…ECU-14`, robustez (`DR-01…DR-14`), secuencia, pruebas.
**Generado con:** skill `uml-use-case-diagram`. **Validador:** `validate_use_case_puml.py` → **0 errores / 0 advertencias**.
**Naturaleza:** **vista funcional** — un resumen (tabla de contenidos) de las metas de los actores. **No** es un flujo, ni un algoritmo, ni UI, ni arquitectura. La sustancia (flujos, pre/postcondiciones, reglas) vive en la **especificación textual**.

---

## 1. Actores (5: 4 concretos + 1 rol general)
| Actor | Tipo | Rol |
|---|---|---|
| **Visitante** | Humano | Persona no autenticada que consulta la presentación y se registra. |
| **Titular de cuenta** | Humano (**rol general**) | Quien posee una cuenta en la plataforma. Recoge lo único que `Usuario adulto` y `Administrador` comparten: la **meta** de obtener y terminar una sesión autenticada. La *ruta* sí difiere — RF-14 exige login separado para el administrador — pero el objetivo es el mismo, y el caso de uso modela objetivos, no rutas. Se corresponde con el supertipo `TitularDeCuenta` de MD-01 §3.1. |
| **Usuario adulto** | Humano (primario) — `is-a` Titular de cuenta | Persona ≥18 registrada que hace el onboarding, conversa y gestiona su cuenta. |
| **Administrador de plataforma** | Humano — `is-a` Titular de cuenta | Rol técnico-operativo con login separado y tres funciones (directorio, métricas, kill switch). |
| **Proveedor LLM (Groq)** | **Sistema externo** | Genera el texto de las respuestas, bajo el gobierno del sistema. No inicia casos de uso ni es decisor autónomo. |

> **Generalización de actores (v2.0).** `Usuario adulto` y `Administrador de plataforma` estaban ambos asociados a «Iniciar y cerrar sesión», es decir, **compartían comportamiento** — que es la condición que la skill exige para generalizar («*a general role is explicit or clearly inferable and multiple specialized actors share behavior*»). Extraer `Titular de cuenta` elimina esa asociación duplicada y **hace visible en el diagrama la relación entre usuario y administrador** que el punto 1 de la retroalimentación docente pedía, en coherencia con el supertipo `TitularDeCuenta` del dominio.

> **No son actores:** los recursos de derivación (son una **salida** del sistema al usuario), ni GitHub/PythonAnywhere/SQLite (infraestructura, fuera del límite funcional).

## 2. Casos de uso (14) y RF que realizan

| CU | Nombre | Paquete | RF |
|---|---|---|---|
| CU-01 | Consultar presentación del servicio | Acceso y cuenta | RF-19 |
| CU-02 | Registrar cuenta | Acceso y cuenta | RF-20 |
| CU-03 | **Iniciar y cerrar sesión** | Acceso y cuenta | RF-14, RF-21 |
| CU-04 | **Eliminar cuenta** | Acceso y cuenta | RF-24 |
| CU-05 | **Otorgar consentimiento y crear la cápsula de perfil** | Acompañamiento | RF-01…RF-05 |
| CU-06 | Conversar con el acompañante | Acompañamiento | RF-07, 08, 09, 10, 13, 25, 26 |
| CU-07 | Derivar ante peligro | Acompañamiento | RF-11 |
| CU-08 | Consultar directorio de usuarios | Administración | RF-15 |
| CU-09 | Consultar métricas de uso | Administración | RF-16 |
| CU-10 | Habilitar o deshabilitar el chatbot | Administración | RF-17, RF-18 |
| **CU-11** | **Reiniciar la caracterización** | Acceso y cuenta | RF-22 |
| **CU-12** | **Revocar la personalización** | Acceso y cuenta | RF-23 |
| **CU-13** | **Cambiar de acompañante** | Acompañamiento | RF-12 |
| **CU-14** | **Elegir acompañante (Alan o Aura)** | Acompañamiento | RF-06 |

**Cobertura: 26/26 RF**, sin omisión ni repetición. La tabla de **visibilidad** RF → CU (qué RF tiene elemento propio y **por qué los demás no pueden tenerlo**) **se publicará** en `TRZ-01` y en `RET-01` (fases D.5–D.6); hoy no existe en ningún artefacto.

## 3. Qué cambió en v2.0 y por qué

El punto 3 de la retroalimentación docente decía: «*los requisitos funcionales especificados no se ven reflejados en su totalidad en el diagrama de casos de uso presentado*». La auditoría lo confirmó y lo midió: **13 de los 26 RF (50 %) no tenían ninguna manifestación gráfica**, y tres casos de uso absorbían 17 RF.

| Cambio | Motivo |
|---|---|
| «Gestionar cuenta y datos personales» **se estrecha a `Eliminar cuenta`**; aparecen `Reiniciar la caracterización` y `Revocar la personalización` | Fusión indebida: los tres RF tienen **objetivos, objetos y postcondiciones distintos** (`Usuario` vs `CapsulaDePerfil` vs uso de la cápsula) y estaban degradados a flujos alternativos de «eliminar». La v1.0 §4.3 ya lo admitía: «*podría separarse «Eliminar cuenta» si el curso lo pide*» |
| `Iniciar sesión` → **`Iniciar y cerrar sesión`** | RF-21 nombra el *logout*, que el nombre anterior omitía |
| `…caracterizar el perfil` → **`…crear la cápsula de perfil`** | «perfil» a secas es término **prohibido** por el control terminológico de ECU-05 §7; se usa el nombre de la clase de MD-01 |
| **+`Cambiar de acompañante`** `<<extend>>` | RF-12 es una meta que el usuario pide; estaba sepultada como flujo alternativo de CU-06 |
| **+`Elegir acompañante (Alan o Aura)`** `<<include>>` | RF-06; además trae `Personaje`/`Alan`/`Aura` al diagrama, que es el punto 4 de la retroalimentación |
| La condición del `<<extend>>` de `Derivar ante peligro` se **etiqueta** | Para que RF-10 (el gate) sea visible sin convertirlo en caso de uso, que la skill prohíbe |

**Numeración estable:** los casos de uso existentes conservan su número. CU-04 no desaparece — su flujo básico ya era «*escenario crítico: eliminar cuenta con borrado en cascada*».

## 4. Relaciones y su justificación

**13 asociaciones** — la columna vertebral. Se conecta al actor **solo** con lo que inicia o persigue deliberadamente. `CU-07` (disparado por el sistema) y `CU-14` (subfunción incluida) **no** llevan asociación de actor; `CU-13` **sí**, porque es una extensión que el usuario pide de forma deliberada. La generalización de actores ahorró una duplicada: «Iniciar y cerrar sesión» cuelga del rol general, no de los dos actores concretos.

| Relación | Gate de la skill |
|---|---|
| `CU-07 ..> CU-06 : <<extend>>` | Opcional · la base completa sin ella · observable · mejora la claridad · no es error de bajo nivel ✅ |
| `CU-13 ..> CU-06 : <<extend>>` | Los cinco criterios ✅ |
| `CU-05 ..> CU-14 : <<include>>` | Obligatoria (`character` lo es, RN-01.6) · testable como subobjetivo · **extraerla mejora la claridad**: es lo que trae `Alan`/`Aura` al diagrama (criterio 3; el «compartida por dos bases» del enunciado es un ejemplo, no un requisito) · no es validación ni paso de UI ✅ |

**2 `<<extend>>` + 1 `<<include>>` para 14 casos de uso.** La skill exige «*default to none, and add one only when its gate is fully satisfied*»; cada una se verificó contra sus cinco criterios.

### Qué NO se modeló, y por qué
- **RF-26** (indisponibilidad, timeout, cuota, respuesta bloqueada) **no** se añade como `<<extend>>`: el gate lo excluye literalmente — «*not a low-level error handling step; those belong in the textual alternate/exception flows*». Vive en ECU-06 §13 (`FE-01…FE-08`).
- **RF-10** (gate de seguridad) **no** es caso de uso: el gate de `<<include>>` excluye las validaciones internas. Se hace visible como **condición etiquetada** del `<<extend>>`.
- **Generalización de casos de uso:** ninguna. La skill la desaconseja en primeras aproximaciones; no hay variantes funcionales de una meta general que la justifiquen. *(La generalización de **actores** sí se aplica — ver §1.)*

## 5. Verificación

**Comprobado por script** (`validate_use_case_puml.py`): **0 errores / 0 advertencias**. Cubre el contrato PlantUML, los actores fuera del límite, los casos de uso dentro del `rectangle` y la heurística de nombres.

> **Alcance real de ese 0/0, dicho sin adornos.** (a) La advertencia de «acceso/autenticación» de v1.0 desaparece porque el script compara **subcadenas literales** y «Iniciar y cerrar sesión» ya no contiene «iniciar sesión» — el script **no** evalúa si la gestión de sesión es explícita. Lo que sostiene el *gate* es RF-14/RF-21/RNF-08 (login, logout, roles), no el validador. (b) La comprobación de **disciplina de asociación** exige flechas (`-+>`) y este `.puml` usa `--`, así que **no se ejecutó**. Se corrió aparte sobre una copia con flechas: avisa de que `Usuario` tiene 6 asociaciones, y se verificó a mano que las seis son metas independientes y ninguna es subpaso de otra.

**Comprobado a mano:**
- ✅ Los 14 son metas de actor, no flujos, validaciones, cálculos ni pasos de UI.
- ✅ Disciplina de asociación (§4), verificada elemento por elemento.
- ✅ Generalización de actores justificada por comportamiento compartido real (§1), no por parecido de nombres.
- ⚠️ **Vocabulario, parcialmente.** Seis de los catorce nombres contienen un sustantivo de MD-01 (`cuenta` ×2, `cápsula de perfil`, `Alan`/`Aura`, `usuarios`, `chatbot`). **«Acompañante» NO es clase de MD-01 ni alias declarado** — la clase es `Personaje`. Igual ocurre con «caracterización» (≡ `CapsulaDePerfil`) y «personalización» (≡ la capa del `Consentimiento`): son vocabulario de REQ-01 (RF-22/RF-23), trazable a requisitos pero no a clases. **Pendiente:** gobernar «acompañante» como alias de `Personaje` en el control terminológico al rehacer las ECU (fase D.3), y publicar la correspondencia término↔clase en la matriz de `TRZ-01` (fase D.5).

## 6. Cómo renderizar
```bash
java -jar plantuml.jar -tsvg -charset UTF-8 DCU-01_casos_uso.puml
```
La paleta vive en el propio `.puml` como `skinparam`, alineada con MD-01. Ante discrepancia, **el `.puml` manda**.

## 7. Cierre
- **Confirmado:** **5 actores** (4 concretos + el rol general `Titular de cuenta`), **14 casos de uso**, 3 paquetes, **13 asociaciones**, 2 generalizaciones de actor, 1 `<<include>>`, 2 `<<extend>>`, validador 0/0.
- **Cobertura:** 26/26 RF; **13 con caso de uso propio** frente a los 9 de v1.0.
- **Siguiente:** especificación textual `ECU-01…ECU-14` y robustez `DR-01…DR-14`.

**Fin de DCU-01.**
