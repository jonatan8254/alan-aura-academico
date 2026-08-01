# RPD-01 — Acta de Revisión Preliminar del Diseño (PDR)
**ID:** RPD-01 · **Familia:** RPD (compuerta ICONIX entre análisis y diseño detallado) · **Hogar:** `docs/07_casos_uso/` · **Fecha:** 2026-07-31 · **Modalidad:** informal (una sola sesión, un revisor).
**Generado con:** skill `iconix-pdr-review`. **Nota de nomenclatura:** este acrónimo (*Preliminary Design Review*) coincide por casualidad con `PDR-01`, el registro de gobernanza de la primera pasada de correcciones (`docs/00_gobernanza/PDR-01_primera_pasada_correcciones.md`, *Pasada De Revisión*). Son documentos distintos; se nombra `RPD-01` para no confundirlos.
**Paquete revisado:** modelo de dominio, diagrama de casos de uso, 14 especificaciones textuales y 14 diagramas de robustez del subproyecto «Alan & Aura Académico», al cierre del PDR-01 (gobernanza).
**Participantes:** orquestador (redacción y revisión) — sesión de un solo rol; ver hallazgo H-05.

---

## Insumos recibidos e insumos ausentes

| Insumo | Estado |
|---|---|
| 14 diagramas de robustez (`.puml`) | Recibido |
| 14 especificaciones textuales (`.md`) | Recibido |
| Modelo de dominio (`MD-01 v1.4`) | Recibido |
| Diagrama de casos de uso (`DCU-01 v2.1`) | Recibido |
| Modelo verbal (`MV-01`) | Recibido (contexto) |
| Wireframes o mockups | Recibido — 16 mockups de alta fidelidad en `docs/08_diseno/mockups/`, **no consultados en esta sesión** |
| Documento de arquitectura o vista de capas | **Ausente** |

**Capa desactivada por insumo ausente:** la capa de **arquitectura** (opcional) no se ejecutó — no hay documento de arquitectura en el repositorio en esta fase. Es información, no una mentira por omisión: se declara aquí y no se inventa contenido para cubrirla.

**Capa parcialmente ejecutada por insumo no consultado:** la mitad «campo de pantalla» de la guía #8 (flujo de datos) no se verificó contra los mockups; sí se verificó la otra mitad (que las entidades receptoras tengan atributos declarados).

## Veredicto

**ACEPTADO CON VERIFICACIÓN DE RETRABAJO**

**Motivo.** Cero hallazgos críticos. El único hallazgo **mayor** (H-01) se corrigió **en el acto**, durante esta misma sesión, y se verificó cerrado. Los hallazgos restantes son **moderados o menores**, cada uno con corrección acordada, responsable y fecha — que es exactamente la condición que separa este veredicto de `Aceptado` liso: queda una entidad fuera del dominio por decisión ya declarada (no un olvido) y una guía que esta sesión no pudo ejecutar por su propia naturaleza (participación multi-rol).

## Presupuesto de la sesión

El validador estima **106,1 páginas equivalentes** sobre las 14 especificaciones y 14 diagramas. A 3,5 pág/h (IEEE 1028 §6.5.2 para diseño preliminar), serían **~30 h** de revisión — muy por encima de una sesión sostenible de 2 h. **Esta sesión no hizo esa revisión exhaustiva desde cero.** Se apoyó en la auditoría independiente ya realizada y documentada durante la construcción de cada tanda (`CERT-D4-tanda1/2/3.md`, más las auditorías de las tandas de especificación en `PDR-01_primera_pasada_correcciones.md` §6), que sí siguieron un ritmo de sesión por paquete pequeño. Esta sesión se concentró en lo que esas auditorías **no pudieron comprobar por sí solas**: la coherencia **entre** los cuatro tipos de artefacto a la vez, que es la razón de ser de un PDR.

## Preparación: el validador (`validate_pdr.py`)

Se ejecutó primero, como manda el procedimiento. **Su salida cruda no es directamente utilizable**: reportó 97 errores y 92 advertencias con un veredicto de `Reinspección requerida`. Antes de aceptar esos números se investigó su causa, como exige la skill («los errores son incumplimientos deterministas… las advertencias requieren tu juicio» — pero un incumplimiento determinista solo lo es si el determinismo está bien calculado).

**Se encontraron y documentan tres defectos en el propio validador**, los tres con la misma causa raíz: sus expresiones regulares de extracción no delimitan las secciones por su encabezado real (`## 6. Flujos alternativos…`, con número y título) y en su lugar escanean el documento completo o buscan subcadenas literales que esos encabezados no contienen.

| # | Función afectada | Defecto | Efecto medido |
|---|---|---|---|
| 1 | `emparejar()` | Empareja cada diagrama con la especificación por el primer `CU-XX` hallado en **cualquier parte** del texto del `.puml` (incluidas relaciones `<<extend>>` hacia *otros* casos de uso), iterando las especificaciones en orden numérico. Un diagrama que menciona `CU-06` en una relación `<<extend>>` se empareja con `ECU-06` en vez de con su propia especificación si `ECU-06` aparece antes en la lista. | De 14 diagramas, **solo 2 quedaron bien emparejados por casualidad** (`DR-01`, `DR-02`). Los 12 restantes se compararon contra el texto equivocado. |
| 2 | `parse_spec()` (extracción de `flujos`) | El bloque de "definición" de un `FA-XX`/`FE-XX` se toma como el texto entre esa mención y la **siguiente mención de cualquier identificador de flujo en todo el documento** — no la fila de la tabla que lo define. Como `use-case-specifier` exige citar cada flujo en §Criterios de aceptación y en §Trazabilidad (buena práctica, no un defecto), el bloque capturado suele ser un fragmento de esas secciones, no la definición real. | 75 de las 96 "alternos sin comportamiento" reportadas resultaron ser de este origen. Verificado a mano: las filas reales de `ECU-01` `FA-01` y `FE-02` sí especifican comportamiento observable del sistema, con desenlace explícito. |
| 3 | `parse_spec()` (extracción de `pasos`) y `check_dialogo()` | La lista de "pasos numerados" se extrae buscando **cualquier** fila que empiece por un dígito, en **todo el documento** — lo que incluye las 20 filas numeradas del checklist §22 de la plantilla completa. La cobertura del marcador (guía #10) y el diálogo (guía #6) se miden, en parte, contra filas del checklist, que nunca tendrán contraparte en un diagrama porque no son pasos del caso de uso. | La cobertura del marcador reportada (75%) bajaba a un 66% con un intento de acotamiento parcial, y subió a **100 % (74/74)** al acotar correctamente por el encabezado real de cada sección de flujo básico. |

**Metodología de verificación de estos tres defectos:** no se dedujeron por lectura del código únicamente; se reprodujo cada función con los datos reales del repositorio (`emparejar()`, `parse_spec()`) para observar el emparejamiento y los bloques que el validador produce de verdad, y se contrastó contra las filas reales de las especificaciones. Es la misma disciplina que gobernó todo el PDR-01: no afirmar sin comprobar.

**Métricas recalculadas, corrigiendo la causa (1) y (3):**

| Métrica | Valor bruto del validador | Valor corregido | Meta | ¿Cumple? |
|---|---|---|---|---|
| % cobertura del marcador (flujo básico) | 75 % (APROXIMADA, con emparejamiento incorrecto) | **100 % (74/74)**, con emparejamiento correcto y acotado al flujo básico | Completa | ✅ |
| # entidades sin dominio | 1 | **1** (sin corrección: este cálculo no depende del emparejamiento) | 0 | ⚠️ (declarada, ver H-02) |
| # alternos sin comportamiento | 96 | **1** (el único real: `DR-11`/`FE-04`, corregido en esta sesión → **0** tras la corrección) | 0 | ✅ (tras corrección) |
| # violaciones de sintaxis | 0 | 0 (no dependía del emparejamiento) | 0 | ✅ |
| # revisiones necesarias | no calculable | no calculable | ≤ 3 | — |

## Cobertura de las diez guías

| # | Guía | Estado | Nota |
|---|---|---|---|
| 1 | Los seis pasos | Compuesta | Agrega #10, #5, #7 y #2; ver sus filas |
| 2 | No derivar a diseño detallado | Ejecutada | 0 hallazgos: ningún diagrama asigna métodos, patrones ni arquitectura |
| 3 | Contexto de objetos y GUI | Parcial | Actores verificados contra `DCU-01 v2.1`, 0 discrepancias. Mockups no consultados (ver insumos) |
| 4 | Técnicos y no técnicos | **No ejecutada** | Sesión de un solo rol; no hubo comité con participación no técnica. Se declara, no se disimula |
| 5 | Sintaxis de robustez | Ejecutada | 0 violaciones en los 14 diagramas |
| 6 | Diálogo usuario/sistema | Ejecutada (con corrección de causa 3) | Sin la contaminación del checklist, 0 rachas reales sin respuesta del sistema |
| 7 | Cursos alternos con comportamiento | Ejecutada (con corrección de causas 1 y 2) | 1 hallazgo real (`H-01`), corregido en esta sesión |
| 8 | Flujo de datos | Parcial | 16 clases sin atributos — **por diseño**: `MD-01` está en modo *academic strict* de `uml-domain-modeler` (sin atributos, decisión declarada del propio modelo), no un hueco de trazabilidad. Sin wireframes, la mitad "campo de pantalla" no se verifica |
| 9 | Entidades en el dominio | Ejecutada | 1 hallazgo (`H-02`), ya declarado y documentado antes de esta sesión |
| 10 | Prueba del marcador | Ejecutada (con corrección de causa 3) | 100 % en flujo básico; alternos/excepciones ya cubiertos por la auditoría D.3/D.4 |

## Hallazgos

| ID | Guía | Sev. | Ubicación | Descripción | Corrección | Destinatario | Responsable | Fecha | Estado |
|---|---|---|---|---|---|---|---|---|---|
| H-01 | #7 (cursos alternos) | **Mayor** | `DR-11_robustez_reiniciar_la_caracterizacion.puml` | `ECU-11` declara `FE-04` («Borrado incompleto»: el sistema no logra completar el borrado de la `CapsulaDePerfil`, deshace lo iniciado, `500`, vuelve al paso 1), y `DR-11` no lo dibujaba. Es el mismo tipo de invariante de atomicidad que `DR-04` ya modela para la cascada de eliminar cuenta (`FE-04` allí también), y se había pasado por alto al construir `DR-11` en la tanda 2 de D.4. | Añadir el controlador «Deshacer el borrado incompleto», con arcos a `CapsulaDePerfil` y a la pantalla de gestión de cuenta, etiquetados `FE-04`. | `/uml-robustness-diagram` | Orquestador | 2026-07-31 | **Cerrado** — corregido en esta misma sesión; `DR-11` revalidado en 0 errores / 0 advertencias, SVG regenerado |
| H-02 | #9 (entidades en el dominio) | Moderado | `DR-10_robustez_habilitar_deshabilitar_chatbot.puml` L29 | La entidad `AccionAdministrativa` no existe en `MD-01`. | **No** se propone incorporarla al dominio: es una decisión ya tomada y documentada — `RA-01` de `ECU-10` la declara auditoría de operación, no concepto del problema, y `DR-00` §6 la mantiene marcada a propósito para que la decisión siga siendo discutible. | `/uml-domain-modeler` (si se revierte la decisión) | Líder del proyecto | — | **Cerrado con excepción documentada** — no requiere acción; se reafirma la decisión existente |
| H-03 | Validador (`validate_pdr.py`) | Moderado | `scripts/validate_pdr.py`, función `emparejar()` | El emparejamiento diagrama↔especificación falla en 12 de 14 casos: usa el primer `CU-XX` hallado en cualquier parte del texto del diagrama, no una correspondencia exacta 1:1. | Emparejar por el número de caso de uso que da nombre al propio diagrama (extraíble del nombre de archivo `DR-NN` ↔ `CU-NN`, o de la primera línea `note as N_DRNN` que declara «CU-NN - Nombre»), no por la primera coincidencia de subcadena en orden de lista. | Mantenedor de la skill `iconix-pdr-review` (fuera del alcance de este subproyecto) | — | — | **Abierto, sin acción propia** — documentado para quien mantenga la skill; este subproyecto ya recalculó las métricas a mano |
| H-04 | Validador (`validate_pdr.py`), funciones `parse_spec()`/`check_dialogo()` | Menor | `scripts/validate_pdr.py` | La extracción de "pasos" y de "bloques de flujo" no se acota por el encabezado de sección real (`## N. Flujo básico`, `## N. Flujos alternativos…`), sino por búsquedas de subcadena que no coinciden con encabezados numerados, y por distancia entre menciones repetidas del mismo identificador. Contamina las guías #6, #7 (segunda mitad) y #10 con filas del checklist §22 y con referencias cruzadas legítimas. | Acotar la extracción con una expresión regular de encabezado (`^##\s*\d+\.\s*<título>`) en vez de `str.find` literal; para los bloques de flujo, tomar la fila de tabla que **empieza** por el identificador, no el intervalo hasta la siguiente mención. | Mantenedor de la skill `iconix-pdr-review` | — | — | **Abierto, sin acción propia** — mismo tratamiento que H-03 |
| H-05 | #4 (técnicos y no técnicos) | Menor | Esta sesión | La guía #4 exige participación de roles técnicos y no técnicos; esta sesión tuvo un solo participante. | Si el profesor o el equipo desean ejercer el rol de "cliente" que el PDR reserva para revisión directa, esta acta y el paquete completo (`ECU-00`, `DR-00`, mockups) están listos para esa sesión adicional. | — | Usuario (si lo desea) | — | **Abierto, sin bloquear el veredicto** — es una limitación de esta sesión, no un defecto del paquete |

## Matriz de trazabilidad de datos

**No ejecutada de forma exhaustiva** en esta sesión: requiere los 16 mockups de `docs/08_diseno/mockups/`, que no se abrieron. Se deja como trabajo pendiente si se desea completar la guía #8 en su totalidad; no bloquea el veredicto porque la mitad "entidad con atributos" de esa guía marcó `MD-01` como intencionalmente sin atributos (modo *academic strict*), lo que hace la matriz de poco valor añadido en su forma actual — se completaría solo cuando el modelo de dominio pase a modo enriquecido, si el proyecto lo decide.

## Delta al modelo de dominio

**Ninguno nuevo.** El único candidato (`AccionAdministrativa`) ya está en el delta consolidado de `DR-00` §6 desde la fase D.4, con su decisión declarada (H-02).

## Correcciones propuestas — agrupadas por destinatario

- **`/uml-robustness-diagram`:** H-01, ya aplicada.
- **`/uml-domain-modeler`:** H-02, sin acción — decisión reafirmada, no una corrección pendiente.
- **Fuera del subproyecto (mantenimiento de la skill `iconix-pdr-review`):** H-03, H-04.

No hay correcciones pendientes de confirmación del usuario en el contenido del paquete: la única corrección de contenido (H-01) ya se aplicó y se verificó durante esta sesión.

## Certificado de auditoría interna del acta

**Pasadas:** 1. **Estado: Convergido.**

- Cada hallazgo `H-01…H-05` tiene severidad, ubicación verificable, corrección y destinatario.
- Cada una de las diez guías está declarada ejecutada, parcial o no ejecutada, sin huecos.
- Las métricas se publican con su método de cálculo (bruto del validador y corregido, con la razón de la corrección) y su umbral.
- El veredicto se sigue de los umbrales: cero críticos, un mayor **cerrado dentro de la sesión**, el resto moderado/menor con su disposición — es exactamente la condición de `Aceptado con verificación de retrabajo`, no de `Aceptado` (por H-02 y H-05, ninguno de los cuales es un defecto sin resolver) ni de `Reinspección requerida` (no hay críticos ni mayores abiertos).
- Ninguna corrección propuesta inventa contenido no respaldado por los insumos: H-01 reutiliza el patrón ya existente en `DR-04` para el mismo tipo de invariante de atomicidad.

**Fin de RPD-01.**
