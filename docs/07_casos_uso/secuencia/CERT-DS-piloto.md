# CERT-DS-piloto — Certificado de auditoría interna del piloto

**ID:** CERT-DS-piloto · **Familia:** DS (secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/` · **Fecha:** 2026-08-01 · **Versión:** v1.0 · **Estado:** Propuesto.
**Alcance:** `DS-06` (Conversar con el acompañante, 25 controladores) y `DS-07` (Derivar ante peligro, 12). **37 de los 149** controladores del paquete.
**Insumos:** `DR-06`/`DR-07` v2.0, `ECU-06`/`ECU-07` v2.0, `MD-01 v1.4`, `DCU-01 v2.1`, `RPD-01` (*Aceptado con verificación de retrabajo*), `DIS-00`, `SEG-01 v1.2`, `PER-01 v1.2`, `PRIV-01`, `MV-01 §7`, `HECHOS_CANONICOS`.
**Generado con:** skill `uml-sequence-diagram`, modo **Generar**. **Validador:** `validate_sequence_puml.py` con las cuatro banderas.
**Consumidores:** `DS-00`, el punto de control con el usuario antes de la Fase 2.

---

## 1. Por qué el piloto son estos dos

`DR-06` es el mayor del paquete —25 controladores, 9 entidades, 11 flujos no básicos— y `DR-07`
es donde aterriza la restricción nueva de `SEG-01 v1.2`. Si el formato aguanta este par, aguanta
los doce restantes.

## 2. Estado final

| Diagrama | Participantes | Mensajes | Fragmentos | Controladores | Operaciones | Casos de prueba | Validador |
|---|---:|---:|---:|---:|---:|---:|---|
| `DS-06` | 16 | 49 | 12 | 25/25 | 32 | **31** (`CP-001…031`) | **0 errores · 0 advertencias** |
| `DS-07` | 9 | 26 | 8 | 12/12 | 18 | **21** (`CP-101…121`) | **0 errores · 0 advertencias** |
| **Total** | | **75** | **20** | **37/37** | **50** | **52** | |

**Flujos sin fragmento: 0** en ambos. **Controladores sin cubrir: 0** en ambos.
**52 casos de prueba para 37 controladores** — cota inferior holgadamente respetada.

## 3. Capas — ejecutadas y no ejecutadas

Ninguna queda en silencio. Esa es la exigencia de la skill y el motivo de esta tabla.

| # | Capa | Resultado |
|---|---|---|
| 1 | Notación y estructura | ✅ Las tres directivas obligatorias; alias con prefijo; sin `activate`/`deactivate`; fragmentos etiquetados con su `FA`/`FE`; anidamiento ≤ 2 |
| 2 | Cierre de participantes contra `DR-XX` | ✅ Todo participante viene del diagrama de robustez. Ningún renombrado silencioso |
| 3 | Cierre de entidades contra el dominio | ✅ Las 13 entidades usadas están en `MD-01 v1.4`. Dos clases nuevas, ambas del **espacio de la solución** y declaradas en `DOP-01 §4` |
| 4 | Cobertura de controladores (guía #7) | ✅ **37/37** |
| 5 | Cobertura de flujos alternativos | ✅ 2 `FA` + 9 `FE` en `DS-06`; 3 `FA` + 3 `FE` en `DS-07` |
| 6 | Barrido texto ↔ mensajes (guía #6) | ✅ **Ejecutado a mano**, línea a línea, contra `ECU-06` §11 (8 pasos) y `ECU-07` §11 (8 pasos), y contra los **18 pasos del plan §4.11** que `ECU-06` delega expresamente a `DS-06`. Dos hallazgos en §6 |
| 7 | Asignación de comportamiento (paso 4) | ✅ `DOP-01` registra las **50 operaciones** con su clase y su justificación |
| 8 | Legibilidad del `.svg` | ✅ Generador propio con verificación geométrica `R9`; **0 colisiones**; títulos no vacíos |
| 9 | Cifras contra `HECHOS_CANONICOS` | ✅ `H-01` a `H-06` presentes y correctas; **cero apariciones del valor obsoleto 1.500** |
| 10 | Derivación de casos de prueba | ✅ **52 `CP`** desde los 37 controladores, con la tabla de **siete campos** y la cobertura de caminos **desagregada por operador**: `break` y `opt` con rama tomada y no tomada, `loop` con sus fronteras (primer mensaje y mensaje 20). Las **cuatro invariantes de *safety*** de `CU-07` tienen caso propio |
| — | **Arquitectura / infraestructura** | ⛔ **NO EJECUTADA, por decisión declarada.** Ver §5 |

## 4. Lo que las pasadas encontraron y la lectura a ojo no

Tres defectos los cazó el validador o el generador, no la revisión:

1. **`DS-06` llegó a anidamiento de nivel 7.** El primer borrador modelaba las nueve excepciones
   como `alt` en cascada. Eso es *flowcharting*: estructura de control en vez de colaboración.
   Se rehízo con `break`, que es lo que semánticamente son —guardas que terminan el turno—, y el
   anidamiento bajó a 2. **De 7 advertencias a 0.**
2. **`DS-06` tenía 3 auto-llamadas consecutivas** sobre la frontera del proveedor. El validador
   lo dice sin rodeos: un objeto que se llama a sí mismo repetidamente **ejecuta un algoritmo, no
   colabora**. Las guardas de salida se movieron a `C_GateDeSeguridad`, que es donde `SEG-R4` las
   sitúa, y de paso quedó **una sola sede** para la política de seguridad.
3. **`DS-07` tenía el control centralizado al 69 %** (umbral 60). Se corrigió de verdad, no
   subiendo el umbral: la pantalla de contención pasó a **buscar lo que presenta** en vez de
   recibirlo masticado. Es mejor diseño y además bajó la métrica.

> El primero es el más instructivo. Un diagrama puede tener **cobertura perfecta** de
> controladores y flujos —lo tenía— y aun así estar mal: la cobertura mide que no falte nada, no
> que esté bien repartido. Por eso el paso 4 no es mecanizable.

## 5. Excepción declarada — `E-1` de `DS-00`

> **Numeración local.** `DR-00 §5` ya usa `E-1`, `E-2` y `E-3` con significados propios. Las
> excepciones de la familia `DS` se numeran en su propio espacio y **se citan siempre
> cualificadas**. Esta es `E-1` **de `DS-00`**, no la de `DR-00`.

**`E-1` de `DS-00` · La capa de infraestructura no se ejecuta.**

`ESTADO_PIPELINE.md` v1.4 lo instruye textualmente y `ADR-002 §1` fija la frontera: el diseño
físico —claves de DynamoDB, tabla de *endpoints*, inventario de S3— va a `ARQ-01`, **después del
diagrama de clases y de su CDR**. Los participantes se derivan solo de los `DR-XX`; no hay
ningún `INF_` (comprobado: 0 en ambos diagramas).

**El coste, declarado y no disimulado.** La fuente **no** avala omitir la infraestructura sin
más: el ejercicio 8-3 (*Plumbing*) advierte que produce *«leaps of logic»* y que *«it's probable
that a part of the design has been missed»*. Lo que sí avala es el **orden**, que el anti-patrón
#6 fija: primero el comportamiento del dominio, después la infraestructura que ese reparto
necesite. Esta pasada ejecuta la **primera mitad** y difiere la segunda.

**Dónde queda el salto, concretamente:** `C_VerificarSesionYRol` no tiene ningún arco a entidad
en `DR-06`, porque la sesión no es un concepto del problema. Se resolvió como auto-llamada sobre
el borde y está marcado como tal en `DOP-01 §2`.

**Qué la cierra:** `ARQ-01`, tras el CDR. Habrá que decidir entonces si exige una segunda pasada
sobre los `DS-XX` o si lo absorbe el diagrama de clases.

**Lo que se comprobó y resultó menor de lo temido:** el candidato obvio era `DS-07` —«¿de dónde
salen los `RecursoDeAyuda`?»—, pero `ECU-07 §6` ya lo acota (*«el Sistema solo consulta la
configuración de entorno del propio despliegue»*) y `SEG-01 v1.2` precisa que «local» significa
dentro de la propia función. El mensaje a `RecursoDeAyuda` **no es un salto**: es una lectura ya
resuelta por la especificación. Lo diferido es el mecanismo.

## 6. Hallazgos sobre los artefactos de entrada

Se **proponen**, no se aplican. Enrutados a su skill y pendientes de confirmación del usuario.

| # | Hallazgo | Destino |
|---|---|---|
| H-1 | **Plan §4.11 paso 17 vs. `ECU-06` §18.** El plan sitúa el registro del evento operativo **por petición** (latencia, modelo, versión son valores por llamada); `ECU-06` §18 y `DR-06` lo sitúan en el **paso 8**, al cerrar. `DS-06` sigue la cadena `ECU`→`DR`, que es la que gobierna, pero la divergencia es real: al cerrar no hay una latencia única que registrar. `[I2]` | `/use-case-specifier` |
| H-2 | **Plan §4.11 paso 3 («verificar mayoría de edad») no está modelado.** `ECU-06` `PRE-03` lo funde con la capa base del consentimiento («El Usuario es adulto **y** tiene vigente la capa base») y `DR-06` no le da controlador. Queda absorbido, no perdido — pero conviene que la fusión sea explícita en la especificación. `[E1]` | `/use-case-specifier` |
| H-3 | **`DS-07` invierte el orden 7↔8 de `ECU-07`.** El texto numera «7 el Usuario abre más tarde una conversación nueva» y «8 el Sistema descarta el contenido», pero el descarte resuelve el turno en curso y no puede esperar a una acción que el Usuario emprende «cuando lo decide». `DR-07` ya lo modela así. Declarado en la nota del diagrama. `[I2]` | `/use-case-specifier` |

Siguen abiertos, de pasadas anteriores y sin acción en esta: la nota obsoleta de
`DR-06:194-196` y la contradicción interna de `DR-08:62-64,86`, ambas a `/uml-robustness-diagram`.

## 7. Convergencia

| Pasada | Qué se comprobó | Hallazgos nuevos |
|---|---|---|
| 0 | Construcción y primer validador | 7 advertencias en `DS-06`; 1 error + 1 advertencia en `DS-07` |
| 1 | Tras refactorizar y prefactorizar: validador, generador y `R9` | **0** |
| 2 | Lo no mecanizable: cifras canónicas, cadenas de mensajes, `INF_`, capas | **0** |

**Dos pasadas consecutivas sin hallazgos nuevos.** Condición de cierre cumplida.
**Pasadas ejecutadas: 3 de 5** (contando la de construcción). Tope duro no alcanzado.

### Condiciones de cierre, una por una

| Condición | Resultado |
|---|---|
| Cero críticos y cero mayores | ✅ |
| ≤ 2 menores, documentados y justificados | ✅ 0 menores abiertos |
| Cada controlador cubierto **y** cada paso del texto con su mensaje | ✅ 37/37 y barrido completo |
| Cada operación del delta con su clase y su justificación | ✅ 50/50 en `DOP-01` |
| Cada capa declarada ejecutada o no ejecutada, sin huecos | ✅ 9 ejecutadas + 1 declarada no ejecutada |
| Dos pasadas consecutivas sin hallazgos nuevos | ✅ |

## 8. Estado

**CONVERGIDO CON UNA EXCEPCIÓN DECLARADA** (`E-1` de `DS-00`: capa de infraestructura no
ejecutada, con su coste y su cierre documentados).

Queda el **punto de control con el usuario** antes de abrir la Fase 2 con los doce restantes.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-01 | J. Sánchez | Creación. Certifica `DS-06` y `DS-07` en 0 errores y 0 advertencias, 37/37 controladores cubiertos, 50 operaciones asignadas con justificación, generador SVG sin colisiones geométricas y tres hallazgos enrutados a `/use-case-specifier`. |
