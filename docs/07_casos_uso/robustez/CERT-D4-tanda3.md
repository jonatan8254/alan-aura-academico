# Certificado de auditoría — D.4 tanda 3 · DR-01, DR-07, DR-08, DR-09, DR-10 + cierre de fase

**Fase:** PDR-01 · D.4 · tanda 3 «derivación y administración» · **Fecha:** 2026-07-31
**Skill:** `uml-robustness-diagram` · **Insumos:** ECU-01/07/08/09/10 v2.0 en 0/0, MD-01 v1.4, DCU-01 v2.1, DIS-00, SEG-01, PRIV-01
**Pasadas ejecutadas:** 2 de 5 · **Estado: convergido con excepciones declaradas**

---

## 1. Alcance

| Diagrama | Caso de uso | Qué se hizo | Elementos |
|---|---|---|---|
| **DR-07** | CU-07 Derivar ante peligro | Rehecho: D-09 resuelto, +`FA-02`, `FA-03`, `FE-03`, invariante partida | 20 |
| **DR-08** | CU-08 Consultar directorio | +`FA-01`, `FA-02`, que **no tenía ninguno** | 12 |
| **DR-09** | CU-09 Consultar métricas | +`FA-01`, `FA-02`, que **no tenía ninguno** | 14 |
| **DR-10** | CU-10 Habilitar/deshabilitar | +`FA-03`, `FE-03` | 19 |
| **DR-01** | CU-01 Consultar presentación | +`FA-03`, `FE-02`, `Visitante` como entidad | 12 |

## 2. Las siete capas

| # | Capa | Resultado |
|---|---|---|
| 1 | Sintaxis y reglas duras | ✅ **0 errores en los cinco** |
| 2 | Correspondencia texto ↔ diagrama ↔ interfaz | ✅ Cobertura de flujos completa. **Tres diagramas tenían cursos alternativos declarados en su especificación y ausentes del diagrama** — la ausencia más grave que puede tener un diagrama de robustez, según la propia skill |
| 3 | Guías de método | ✅ |
| 4 | Anti-patrones | ⚠️ Una excepción declarada (§3) |
| 5 | Trazabilidad | ✅ Una entidad en el delta, declarada: `AccionAdministrativa` |
| 6 | Calidad del ítem de información | ✅ |
| 7 | Conformidad entrada ↔ salida | ✅ |

## 3. Excepción declarada

**E-1 · Racimo controlador-controlador en `DR-07` (12 enlaces).** La ruta de seguridad es una cadena determinista: detectar → modo seguro → contención → derivar → marcar → bloquear → descartar. Esa forma **es** el texto, y es además la que sostiene la garantía *fail-safe*: cada eslabón depende del anterior sin ramificar. Distribuirla introduciría puntos donde la cadena podría cortarse.

## 4. Correcciones aplicadas

**DR-07 — se resolvió el hallazgo D-09.** La v1.0 asignaba a `FA-01` y `FE-02` **el mismo arco y el mismo controlador**, con el comentario «la distinción no está definida en el texto; queda reportada». La fase D.3 la definió, y ahora son fallos de **dos cosas distintas en dos pasos distintos**: `FA-01` es que faltan los **recursos** en el paso 4 —y el texto de contención sí resuelve—; `FE-02` es que falta el **texto de contención** en el paso 3. Cada uno con su controlador.

**DR-07 — la invariante se partió en dos.** `I-2` atribuía a RNF-06, RC-01 y SEG-R3 una garantía frente al fallo del **aprovisionamiento por entorno** que esas tres fuentes no cubren: solo hablan de la caída del proveedor o de la red. Ahora `I-2a` es la heredada y `I-2b` la decisión de la especificación, declarada como tal.

**DR-08 y DR-09 no tenían ningún curso alternativo.** La skill es explícita: *«los cursos alternativos no son opcionales: su ausencia es el error más común y más grave»*. Sus especificaciones sí los declaraban. Entran los cuatro: directorio vacío, cuenta sin consentimiento vigente, ventana de siete días sin actividad y chatbot deshabilitado.

**DR-09 — un defecto que el validador cazó.** La declaración de `DisponibilidadDelChatbot` quedó con **dos sufijos de color** (`#LightCoral #PaleGreen`), lo que invalidaba la línea entera: el validador reportó que la relación mencionaba un alias no declarado.

**DR-01 — `Visitante` entra como entidad.** Es clase de MD-01 v1.4 desde el PDR-01 porque lo pidió el profesor; el diagrama del caso de uso que el `Visitante` protagoniza no lo tenía.

**Se retiró el `#PaleGreen` de `ContadorDeUsoDiario` y `EventoOperativo`**, y con él la línea de leyenda en los diagramas donde ya no aplicaba. Ambas son clases de MD-01 v1.4 desde la tanda 0; seguir marcándolas como «descubiertas y ausentes» era falso.

## 5. Cierre de la fase D.4

**Los 14 diagramas: 0 errores, cobertura de flujos completa, 259 elementos (15 actores / 38 borde / 148 control / 58 entidad).**

**Los 14 `.svg` regenerados**, con el generador corregido: llevaba grabado `179 elementos (12/31/102/34)` como comprobación de correspondencia, y ahora verifica `259 (15/38/148/58)`.

**Un defecto que solo apareció al rasterizar.** Nueve de los catorce `.svg` salieron **sin título**. Al insertar «(v2.0, PDR-01 fase D.4)» en la línea de cabecera del `.puml` se rompió el patrón con que el generador extrae el título, que espera `' DR-NN — <nombre>`. Ni el validador ni el generador fallan por ello: el primero no mira el `.svg` y el segundo produce el archivo igual. Se corrigió moviendo la marca de versión a la línea siguiente en los nueve.

> Es el hallazgo más instructivo de la fase: **«el script no falló» y «se ve bien» no son lo mismo**. Por eso la verificación incluyó rasterizar con Chrome y mirar, no solo ejecutar.

**`DR-00` reescrito** contra el estado real: 14 diagramas, conteos nuevos, el delta reducido a una sola entidad declarada, las excepciones de las tres tandas consolidadas y las afirmaciones de la v1.0 que ya no se sostienen, retiradas.

## 6. Delta de *object discovery*

**`AccionAdministrativa`**, en `DR-10`. Sigue **deliberadamente fuera** de MD-01 por RA-01 de ECU-10: es auditoría de operación, no concepto del problema. Se mantiene marcada para que la decisión siga siendo visible.

## 7. Informe de desambiguación

**Sin hallazgos**, como en las tandas 1 y 2.

**Fin del certificado.**
