# TRZ-01 — Matriz de trazabilidad del MVP
**ID:** TRZ-01 · **Hogar:** `docs/04_trazabilidad/` · **Fecha:** 2026-07-25 · **Versión:** v2.1 (SD-39, retrabajo del `CDR-01`: entran **§3.1**, los 10 RNF trazados a su decisión de diseño —hallazgo `H-05`—, y **§5.3**, el último tramo `RF → clase de MC-01` sobre las 43 clases —hallazgo `H-06`—). v2.0 (SD-36: la fila de `RF-24` pierde el símbolo de incumplimiento, que contradecía a su propia nota). v1.9 (SD-35: `RF-24` deja de ser el único RF incumplido). v1.8 (SD-34: el recuadro de `RF-24` deja de citar `PER-H5` —cerrado— y pasa a `PER-H2`). v1.7 (SD-30: §5.1 gana la columna **Secuencia** con los `DS-XX` —16/16 clases—, §2 gana la columna de **casos de prueba** —26/26 RF—, la fila de `EventoOperativo` recupera `CU-04`/`DR-04` que `SD-30` le había añadido, y `RF-24` queda marcado como no cumplido de extremo a extremo por `PER-H5`. Antes, v1.6 (SD-29: `RNF-02` y `RC-09` reapuntados a `ADR-002`; **la estructura de la trazabilidad no cambia** —el cambio de stack no crea ni destruye requisitos, y los conteos de §5 siguen siendo 26 RF y 16 clases—. SD-26: **RN-01.6** trazada desde RF-04/RF-05 — la cápsula siempre existe con `character` como mínimo; cero reglas huérfanas · SD-22:  RF-04/05 coherentes con la cápsula de 5 campos = `ContextoInicialConversacionalV1` · SD-21: **columna CU poblada** — cada RF trazado a su especificación `ECU-0X`; dimensión CU cerrada · SD-15: +RF-19…26 cuenta/acceso y sesión; admin realineado; MD-01 disponible · SD-17: RF-25/26 con límites de tasa exactos y RN-02.9).
**Insumos:** VIS-01 (OBJ-1…OBJ-7), MV-01 (vistas), contrato, REQ-01 (RF-01…26/RNF/RC/RN), PRIV-01, SEG-01, NORM-01, MD-01 (dominio).
**Consumidores:** verificación de cobertura; fase 2 (CU/dominio) y fase 4 (pruebas).
**Criterio de cierre:** **cero requisitos huérfanos** — todo RF traza a ≥1 objetivo, ≥1 regla y ≥1 prueba planificada; todo objetivo tiene ≥1 RF; todo RC tiene ≥1 RF **o RNF**; **todo RNF traza a ≥1 decisión de diseño** (§3.1, desde v2.1) y **toda clase de `MC-01` traza a ≥1 RF** (§5.3, desde v2.1).
**Columnas de fase posterior:** el **modelo de dominio** (`Dominio`, MD-01) y los **casos de uso** (`CU`, ECU-00…10) ya están **producidos** — la columna CU de §2 queda **poblada** (SD-21). Solo `Prueba ejecutada` sigue **⏳ pendiente** (fase 4).

---

## 1. Cadena de trazabilidad (forma canónica)
`Objetivo (VIS-01) → Actor → Modelo verbal (MV) → Regla (RN) → Requisito funcional (RF) → Requisito de calidad (RC) → Norma (NORM-01) → Prueba planificada → [CU ✅ (ECU-0X) → Dominio ✅ (MD-01) → Prueba ejecutada ⏳]`

## 2. Matriz principal (RF)

| RF | Objetivo | Actor | MV | Regla(s) | RC | Norma | Prueba planificada | CU (ECU) | Casos de prueba |
|---|---|---|---|---|---|---|---|---|---|
| RF-01 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-09, RN-01.1 | RC-06 | §3.4 | Verificar *disclosure* previo a captura | CU-05 | `CP-201…218` |
| RF-02 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-01, RN-10, RN-01.2 | — | — | Caso <18 no continúa | CU-05 | `CP-201…218` |
| RF-03 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-02, RN-07, RN-01.5 | RC-04 | Security | Otorgar/revocar consentimiento | CU-05 | `CP-201…218` |
| RF-04 | OBJ-1 | Usuario | MV-01 §Onboarding | RN-01.3, RN-01.4, RN-01.6 | RC-04 | Security | Completar dejando los 4 autorreportes vacíos; `character` obligatorio | CU-05 | `CP-201…218` |
| RF-05 | OBJ-1/OBJ-4 | Usuario | MV-01 §Onboarding | RN-03, RN-01.6 | RC-04 | Security | Inspección: la cápsula = 5 campos + metadatos (`ContextoInicialConversacionalV1`); **siempre existe** tras el onboarding (mínimo `character`) | CU-05 | `CP-201…218` |
| RF-06 | OBJ-1 | Usuario | MV-01 §Conversación | — | RC-06 | §3.4 | Presentación de Alan y Aura visible | **CU-14** | `CP-401…407` |
| RF-07 | OBJ-2 | Usuario | MV-01 §Conversación | RN-02.6 | RC-08 | Func. suitability | Iniciar con personaje elegido | CU-06 | `CP-001…034` |
| RF-08 | OBJ-2 | Usuario / LLM | MV-01 §Conversación | RN-02.2 | RC-05, RC-08 | Perf. / Func. | Intercambio de turnos coherentes | CU-06 | `CP-001…034` |
| RF-09 | OBJ-2/OBJ-4 | LLM (gobernado) | MV-01 §Conversación | RN-02.2, RN-03 | RC-04 | Security | Inspección del *payload* al LLM | CU-06 | `CP-001…034` |
| RF-10 | OBJ-3 | Sistema | MV-01 §Conversación | RN-02.1, RN-05 | RC-02 | §3.9.2 | Gate evaluado en cada mensaje | CU-06 | `CP-001…034` |
| RF-11 | OBJ-3 | Sistema | MV-01 §Conversación/SEG-01 | RN-05, RN-11 | RC-01, RC-03 | §3.9.3/.1 | Fallback con LLM deshabilitado | **CU-07** | `CP-101…121` |
| RF-12 | OBJ-2 | Usuario | MV-01 §Conversación | RN-02.6 | RC-08 | Func. suitability | Cambio de personaje | **CU-13** | `CP-301…308` |
| RF-13 | OBJ-4 | Sistema | MV-01 §Conversación | RN-04, RN-02.5 | RC-04 | Security | No hay registro tras cerrar | CU-06 | `CP-001…034` |
| RF-14 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.7 | RC-04 | Security | Usuario en ruta admin → 403; rol validado en servidor | CU-03 | `CP-701…712` |
| RF-15 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.2 | RC-04 | Security | Directorio muestra solo campos mínimos (ID truncado) | CU-08 | `CP-901…908` |
| RF-16 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.3 | RC-07 | Reliability | Métricas agregadas; sin datos por usuario | CU-09 | `CP-1001…1008` |
| RF-17 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.1, RN-03.4, RN-02.7 | RC-07 | Reliability | Con chatbot deshabilitado, nadie inicia conversación | CU-10 | `CP-1101…1114` |
| RF-18 | OBJ-6 | Administrador | MV-01 §Administración | RN-03.4 | RC-04 | Security | El kill switch queda auditado (autor/fecha) | CU-10 | `CP-1101…1114` |
| RF-19 | OBJ-7 | Visitante | MV-01 §Cuenta | RN-04.5 | RC-06 | §3.4 | Landing visible sin autenticar; sin acceso a chat/datos | CU-01 | `CP-501…507` |
| RF-20 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.1 | RC-04 | Security | Registro pide solo username/alias/contraseña | CU-02 | `CP-601…607` |
| RF-21 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-03.7, RN-04.6 | RC-04 | Security | Login/logout; rol no seleccionable desde cliente | CU-03 | `CP-701…712` |
| RF-22 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.3 | RC-04 | Security | Borrar perfil elimina la cápsula | **CU-11** | `CP-1201…1213` |
| RF-23 | OBJ-7/OBJ-4 | Usuario | MV-01 §Cuenta | RN-04.3, RN-07 | RC-04 | Security | Revocada la personalización, la cápsula no alimenta | **CU-12** | `CP-1301…1311` |
| RF-24 | OBJ-7 | Usuario | MV-01 §Cuenta | RN-04.4 | RC-04 | Security | Eliminar cuenta → borrado en cascada, sin remanentes ✅ | CU-04 | `CP-801…813` |
| RF-25 | OBJ-2 | Sistema | MV-01 §Conversación | RN-02.8 | RC-07 | Reliability | Alcanzados 20 mensajes/2.500 caracteres/350 tokens, invita a cerrar sin error | CU-06 | `CP-001…034` |
| RF-26 | OBJ-2 | Sistema | MV-01 §Conversación | RN-02.9, plan §2.4/§4.13 | RC-07 | Reliability | Solicitud 4/min y 31/día → `429`; timeout 20s → `504`, sin romper la UI | CU-06 | `CP-001…034` |

> **Columna CU poblada (SD-21; actualizada en el PDR-01):** cada RF traza a su especificación `ECU-NN`. Los **26 RF** quedan cubiertos por los **14** casos de uso, **cero huérfanos** y **ningún RF realizado por dos casos de uso**. Cuatro cambiaron de dueño al desglosarse el diagrama: RF-06 → CU-14, RF-12 → CU-13, RF-22 → CU-11, RF-23 → CU-12. (Detalle inverso RF→CU en `../07_casos_uso/especificaciones/ECU-00_indice_especificaciones.md` §5.)

> ✅ **`RF-24` pasa a cumplirse en SD-35, y deja de ser el único RF declarado como incumplido.**
> `CP-801…813` cubren la cascada sobre las cuatro entidades del titular, y `CP-813` verifica que la
> telemetría sobrevive sin identidad. Sus **dos excepciones están cerradas**: `PER-H5` en `ADR-003`
> —el almacén operativo **no se respalda**, así que no hay copia que escape al borrado— y `PER-H2` en
> `ADR-004-D1` — la supresión es **física e inmediata**, sin ventana de gracia ni marca de baja.
> **Con una precisión que conviene no perder:** se cumple **según el diseño**. La inmediatez solo se
> puede verificar contra una implementación, y eso es fase 4. Un artefacto de diseño no puede
> sostener más que eso, y decir lo contrario sería el sobre-claim que este proyecto evita.
> **Sigue abierta `V6-b`**, la validación legal, que es de nivel 6 y no la cierra un análisis
> documental.

## 3. Cobertura de requisitos de calidad (RC → RF)
| RC | Cubierto por | ¿≥1 RF? |
|---|---|---|
| RC-01 *fail safe* | RF-11 | ✅ |
| RC-02 *risk identification* | RF-10 | ✅ |
| RC-03 *operational constraint* | RF-11 (guardas) | ✅ |
| RC-04 minimización/security | RF-03/04/05/09/13/14/15/18/20/21/22/23/24 | ✅ |
| RC-05 performance | RF-08 | ✅ |
| RC-06 interaction capability | RF-01/06/19 | ✅ |
| RC-07 reliability | RF-08/11/16/17/25/26 | ✅ |
| RC-08 func. suitability | RF-07/08/12 | ✅ |
| RC-09 flexibility | RNF-02 (despliegue en capa gratuita, `ADR-002`) | ✅ |
| RC-10 maintainability | RNF-05 (recursos/textos por entorno) | ✅ |

## 3.1 Trazabilidad de los requisitos NO funcionales (RNF → decisión de diseño)

Sección nueva por el hallazgo **`H-05`** del `CDR-01`. Hasta aquí los **10 RNF** no tenían fila en ningún artefacto: solo asomaban como origen en `REQ-01` y de refilón por `RC-09` (vía `RNF-02`) y `RC-10` (vía `RNF-05`). La guía #5 del CDR pide trazar los requisitos *«functional **(and nonfunctional)**»*.

**Un RNF no se traza a una clase, y forzarlo sería falsificar la matriz.** Un requisito no funcional es una **restricción sobre cómo se construye o se despliega el sistema**, no una función que un objeto realice; su realización vive en una **decisión de diseño** (`ADR`, `SD`) y se comprueba contra el artefacto donde esa decisión se materializa — o, cuando no hay ninguno todavía, se dice. Por eso la columna central es la decisión, no la clase.

| RNF | Decisión de diseño que lo realiza | Dónde se comprueba **hoy** | RC | Estado en fase 2 |
|---|---|---|---|---|
| **RNF-01** español (CO) | `SD-09`, `ADR-001-D7` | **Ningún artefacto de diseño lo fija.** Se observa en que todo `ECU`, `DR`, `DS` y `MC` está redactado en español CO, pero eso es una propiedad del corpus, no una comprobación | — | ⏳ **Fase 3/4** — inspección de los textos de cara al usuario |
| **RNF-02** capa gratuita (Vercel + Lambda/API GW/DynamoDB/S3) | **`ADR-002-D3/D4/D5/D6`** | **No comprobable en el diseño detallado, y está declarado:** es diseño **físico**, o sea `ARQ-01`. En fase 2 se realiza como una **ausencia deliberada** — `E-1` de `DS-00` y de `MC-00`: ni una clase `INF_`, ni repositorio, ni DAO | RC-09 | ⛔ **`ARQ-01`**, tras el CDR. `V6-a` (qué servicios son gratuitos de forma permanente) sigue abierta |
| **RNF-03** el chat no se persiste | `RN-04`, `PRIV-01 §4`; **`ADR-003`** refuerza (el almacén no se respalda) | `DS-06:134-135` paso 8 — `Conversacion.cerrar()` y `Mensaje.descartarContenido()`, dos mensajes distintos porque cerrar y descartar son dos obligaciones · `MC-01` `Conversacion.cerrarYDescartarSuContenido()` y `Mensaje.descartarContenido()` · `ECU-06` postcondición | RC-04 | ✅ **Realizado en el diseño** |
| **RNF-04** el LLM solo recibe cápsula + turno + ≤4 intercambios | `RN-03`, `PRIV-01`, plan §3.4 | `DR-06` `C_ConstruirContextoMinimo` con sus cuatro arcos · `MC-01` `CapsulaDePerfil.materializarContextoV1()` · `DS-06` paso 4. **La minimización se realiza como la AUSENCIA de todo mensaje que pase alias, username, ID o rol**, y esa ausencia es verificable sobre los 14 `.puml` | RC-04 | ✅ **Realizado en el diseño** |
| **RNF-05** recursos y parámetros por entorno | `SD-12`, `ADR-001-D6`, `ADR-002-D6` | `MC-01` `RecursoDeAyuda.obtenerAprovisionadosPorEntorno() : List<ReferenciaDeDerivacion>` — **es la operación que lo materializa**, y por eso `RecursoDeAyuda` no tiene atributos (`MC-00 §7`): no hay estado embebido que modelar | RC-10 | ✅ **Realizado en el diseño** |
| **RNF-06** la ruta de seguridad no depende del LLM | `RN-05`, `SEG-01`, `SEG-R2/R3/R5` | `MC-01` declara **`Fallback de seguridad` como clase `<<solucion>>` propia**, separada de la `Frontera con el Proveedor LLM` · `DR-07`/`DS-07` la recorren sin tocar al proveedor | RC-01, RC-03 | ✅ **Realizado en el diseño** |
| **RNF-07** sin contenido © de terceros | `AGENTS §2`, `CLAUDE.md §5` | **No es un requisito de producto sino de repositorio**, así que no traza a ningún artefacto de diseño y no debe forzarse a hacerlo. Se comprueba sobre el árbol de archivos | — | ✅ **Vigente**, comprobable por inspección del repositorio |
| **RNF-08** el rol se determina en el servidor | `RN-03.7`, plan §2.6 | `MC-01` `Usuario.determinarRolEnElServidor()` **y** `Administrador.determinarRolEnElServidor()` —la misma operación en el rol concreto, que es lo que el requisito exige— · `verificarSesionYRol()`/`…YRolDeAdministrador()` en las 5 pantallas · `DS-03` | RC-04 | ✅ **Realizado en el diseño** |
| **RNF-09** claves y tokens fuera del cliente y del repositorio | `ADR-002-D7`, canon, plan §2.6 | **No comprobable en el diseño detallado:** el gestor de secretos es infraestructura (`E-1`). Lo único que el diseño aporta es que **ninguna operación de `MC-01` transporta una clave** | RC-04 | ⛔ **`ARQ-01`** + fase 3 |
| **RNF-10** *rate limit* 3/min y 30/día, *timeout* 20 s, ≤4 intercambios | `RN-02.9`, plan §4.13 | `DR-06` `C_VerificarLimitesDeTasa` y `C_ControlarTiempoDeEspera` · `MC-01` `ContadorDeUsoDiario` · `DS-06` `FE-05`/`FE-07`. **Con un hueco declarado:** `PER-H4` deja los **campos y la llave** de `ContadorDeUsoDiario` sin especificar, así que la clase existe sin atributos (`MC-00 §7`) y la configurabilidad por entorno es `ARQ-01` | RC-07 | ⚠️ **Realizado en la estructura, con `PER-H4` abierto** |

**Lectura del resultado, sin maquillar.** De los diez, **seis están realizados en el diseño de fase 2** y se pueden señalar con el dedo sobre un artefacto concreto; **uno** (`RNF-10`) lo está en su estructura pero arrastra `PER-H4`; **dos** (`RNF-02`, `RNF-09`) son de infraestructura y esperan a `ARQ-01` por la misma decisión declarada que deja fuera toda la capa física; y **uno** (`RNF-01`) solo se comprueba contra los textos, ya en fase 3/4. `RNF-07` es del repositorio, no del producto. **Cero RNF sin fila**, que era el defecto.

## 4. Cobertura de objetivos (OBJ → RF)
| OBJ | RF que lo realizan |
|---|---|
| OBJ-1 (onboarding/consentimiento/cápsula) | RF-01…RF-06 |
| OBJ-2 (conversación gobernada) | RF-07, RF-08, RF-09, RF-12, RF-25, RF-26 |
| OBJ-3 (gate de seguridad) | RF-10, RF-11 |
| OBJ-4 (minimización/no persistencia) | RF-05, RF-09, RF-13, RF-23 |
| OBJ-5 (calidad medible) | RC-01…RC-10 (todos con umbral en REQ-01) |
| OBJ-6 (administración: 3 funciones) | RF-14…RF-18 |
| OBJ-7 (cuenta y acceso) | RF-19…RF-24 |

## 5. Verificación de huérfanos
- **RF sin regla:** solo RF-06 (presentación) no invoca una RN de restricción — es un requisito de presentación derivado de OBJ-1/MV-01 §Conversación; **no es huérfano** (traza a objetivo y prueba). Todos los demás RF (incluidos RF-14…RF-26) tienen ≥1 RN. ✅
- **RF sin prueba planificada:** ninguno (columna «Prueba planificada» completa para RF-01…RF-26). ✅
- **RC sin RF/RNF:** ninguno (§3); RC-09 traza vía RNF-02 y RC-10 vía RNF-05 (concerns de despliegue/entorno, no funciones). ✅
- **OBJ sin RF:** ninguno; OBJ-6 (admin) y OBJ-7 (cuenta) ya cubiertos (§4). ✅
- **RN sin RF:** RN-08 (uso no punitivo) es transversal (PRIV-R5/R6) — traza vía PRIV-01, **regla transversal**, no huérfana. ✅
- **RNF sin decisión de diseño:** ninguno — los **10** tienen fila en §3.1 desde v2.1 (`H-05` del `CDR-01`). Dos de ellos (`RNF-02`, `RNF-09`) trazan a una decisión que **aún no tiene artefacto donde comprobarse**, porque es `ARQ-01`: eso se declara, no se disimula. ✅
- **Clase de `MC-01` sin RF:** ninguna — las **43** tienen al menos uno en §5.3 desde v2.1 (`H-06`). ✅
- **RF sin clase que lo realice:** ninguno — los **26** aparecen en §5.3. `RF-13` es el único que **ninguna clase de la solución** realiza, y es correcto: la no persistencia la realizan `Conversacion` y `Mensaje` descartando su contenido. ✅

> **Resultado: cero requisitos huérfanos.** La columna **CU** ya está poblada (cada RF → su `ECU-0X`) y el **Dominio** existe (MD-01); desde v2.1 tampoco quedan **RNF** ni **clases de diseño** sin trazar. La única casilla abierta es `Prueba ejecutada`, ⏳ por diseño (fase 4).

## 5.1 Matriz clase del dominio ↔ caso de uso (punto 4 de la retroalimentación docente)

El profesor pidió **verificar que los objetos del dominio se vean reflejados en los casos de uso**. La comprobación se publica aquí, contra `MD-01 v1.4` (16 clases) y `DCU-01 v2.1` (14 casos de uso). La columna «Robustez» es la evidencia más fuerte: es donde cada clase aparece como **objeto tipo Entidad**, con un arco a un controlador concreto.

| Clase (MD-01 v1.6) | Casos de uso que la manipulan | Robustez | Secuencia |
|---|---|---|---|
| `Visitante` | CU-01, CU-02, CU-04 (destino tras eliminar) | DR-01, DR-02, DR-04 | DS-01, DS-02, DS-04 |
| `TitularDeCuenta` | CU-02, CU-03 | DR-02, DR-03 | DS-02, DS-03 |
| `Usuario` | CU-03, CU-04, CU-05, CU-08, CU-09, CU-11, CU-12 | DR-02, DR-03, DR-04, DR-05, DR-08, DR-09, DR-11, DR-12 | DS-02, DS-03, DS-04, DS-05, DS-08, DS-09, DS-11, DS-12 |
| `Administrador` | CU-03, CU-10 | DR-03, DR-10 | DS-03, DS-10 |
| `Consentimiento` | CU-05, CU-06, CU-08, CU-11, CU-12, CU-04 | DR-03, DR-04, DR-05, DR-06, DR-08, DR-11, DR-12 | DS-03, DS-04, DS-05, DS-06, DS-08, DS-11, DS-12 |
| `CapsulaDePerfil` | CU-05, CU-06, CU-11, CU-12, CU-13, CU-14, CU-04, CU-03 | DR-03, DR-04, DR-05, DR-06, DR-11, DR-12, DR-13, DR-14 | DS-03, DS-04, DS-05, DS-06, DS-11, DS-12, DS-13, DS-14 |
| `Conversacion` | CU-06, CU-07, CU-09, CU-12, CU-13, CU-04 | DR-04, DR-06, DR-07, DR-09, DR-10, DR-12, DR-13 | DS-04, DS-06, DS-07, DS-10, DS-12, DS-13 |
| `Mensaje` | CU-06, CU-07 | DR-06, DR-07 | DS-06, DS-07 |
| `Personaje` | CU-06, CU-13, CU-14 | DR-06, DR-13, DR-14 | DS-06, DS-13, DS-14 |
| `Alan` | CU-13, CU-14 | DR-13, DR-14 | DS-13, DS-14 |
| `Aura` | CU-13, CU-14 | DR-13, DR-14 | DS-13, DS-14 |
| `EventoDeSeguridad` | CU-06, CU-07 | DR-06, DR-07 | DS-06, DS-07 |
| `RecursoDeAyuda` | CU-07 | DR-07 | DS-07 |
| `DisponibilidadDelChatbot` | CU-06, CU-09, CU-10, CU-13, CU-07 | DR-06, DR-07, DR-09, DR-10, DR-13 | DS-06, DS-07, DS-09, DS-10, DS-13 |
| `ContadorDeUsoDiario` | CU-06, CU-04 | DR-04, DR-06 | DS-04, DS-06 |
| `EventoOperativo` | CU-04 (**sobrevive** a la cascada), CU-06, CU-09 | DR-04, DR-06, DR-09 | DS-04, DS-06, DS-09 |

**Las 16 clases aparecen en al menos un caso de uso y en al menos un diagrama de robustez. Cero clases sin usar.**

> `Alan` y `Aura` eran, antes del PDR-01, las únicas clases sin manifestación en el diagrama de casos de uso. Extraer **CU-14 «Elegir acompañante (Alan o Aura)»** fue precisamente lo que las trajo, y es la razón por la que ese `<<include>>` supera su compuerta pese a que solo lo usa un caso de uso base.

## 5.2 Visibilidad RF → caso de uso

Los **26 RF** tienen ahora **caso de uso propio y único**. Antes del PDR-01, trece no tenían manifestación gráfica y tres casos de uso absorbían diecisiete.

| Caso de uso | RF que realiza | | Caso de uso | RF que realiza |
|---|---|---|---|---|
| CU-01 | RF-19 | | CU-08 | RF-15 |
| CU-02 | RF-20 | | CU-09 | RF-16 |
| CU-03 | RF-14, RF-21 | | CU-10 | RF-17, RF-18 |
| CU-04 | RF-24 | | **CU-11** | **RF-22** |
| CU-05 | RF-01…RF-05 | | **CU-12** | **RF-23** |
| CU-06 | RF-07…RF-10, RF-13, RF-25, RF-26 | | **CU-13** | **RF-12** |
| CU-07 | RF-11 | | **CU-14** | **RF-06** |

Cuando una especificación cita un RF que **no** realiza, lo etiqueta como *cedido*, *relacionado* o *vecino* y dice a quién pertenece — por ejemplo `ECU-08` cita RF-14 aclarando que lo realiza CU-03, y `ECU-07` cita RF-10 aclarando que el gate vive en CU-06.

## 5.3 Visibilidad RF → clase de `MC-01` (el último tramo de la cadena)

Sección nueva por el hallazgo **`H-06`** del `CDR-01`. §5.1 responde a la pregunta del profesor —*«¿se ven los objetos del dominio en los casos de uso?»*— pero se quedó **congelada en las 16 clases de `MD-01`**, así que la pregunta de control del CDR, ***«¿qué requisito implementa esta clase?»***, no era contestable para las de diseño desde ningún artefacto único: había que empalmar §5.2 con `TRZ-DS-01 §2` y con `MC-01_matriz_procedencia`. Aquí se cierra, sobre las **43** clases de `MC-01` (16 del problema + 27 de la solución).

**Cómo se derivó, para que se pueda rehacer.** No se repartió a ojo, y tampoco vale la unión gruesa: *«la clase aparece en `DS-06`, luego realiza los siete RF de CU-06»* daría que la pantalla de login realiza el onboarding y que `FilaDeDirectorio` realiza trece requisitos. La regla usada es más fina y se apoya en una **convención que los propios diagramas ya llevan escrita**:

1. **`#LightCoral` en los `DR` significa «participa solo en un curso alternativo o de excepción»**. Un borde **sin** color está en el curso básico: ahí es donde la pantalla **realiza** el requisito. Con color, solo **participa**. Es lo que separa a `P-11` —que salía con siete RF y realiza **uno**, `RF-26`— de `P-14`, que realiza `RF-15` y nada más.
2. Los **tipos de transferencia** no tienen línea de vida, así que se anclan por la **operación que los devuelve**: `AlcanceDeBorrado` sale de `CapsulaDePerfil.enumerarQueElBorradoAlcanzaTambienCharacter()`, que `DS-11` dibuja — luego CU-11, luego `RF-22`, y no los diecinueve RF de todos los casos de uso donde la cápsula participa.
3. La columna **«realiza»** lleva juicio y va marcada **`[I2]`**; las columnas de CU son **`[E1]`**, medidas sobre los `.puml`.

### A · Las 27 clases del espacio de la solución

| Clase de `MC-01` | CU en curso **básico** | RF que **realiza** `[I2]` | Solo **participa** en |
|---|---|---|---|
| `Presentacion / landing (P-01)` | CU-01, CU-04 | **RF-19** | RF-24 (destino tras la cascada, no la ejecuta) |
| `Registro (P-02)` | CU-02 | **RF-20** | RF-19 |
| `Inicio de sesion de usuario (P-03)` | CU-02, CU-03 | **RF-21** | RF-20 y los **siete** CU donde solo es destino de `FE-01` |
| `Inicio de sesion de administracion (P-04)` | — (solo excepción en CU-03, CU-10) | **RF-14** (ruta admin → 403) | RF-17, RF-18, RF-21 |
| `Onboarding - disclosure de IA (P-05)` | CU-05 | **RF-01** | RF-14, RF-21 |
| `Onboarding - declaracion de edad (P-06)` | CU-05 | **RF-02** | — |
| `Onboarding - consentimiento capa base (P-07)` | CU-05 | **RF-03** | RF-07…RF-13 (`FE-09` de CU-06) |
| `Onboarding - caracterizacion y capa de personalizacion (P-08)` | CU-05, CU-11 | **RF-04, RF-05, RF-22** | — |
| `Onboarding - elegir Alan o Aura (P-09)` | CU-14 | **RF-06** | — |
| `Chat con el acompanante (P-10)` | CU-03, CU-06, CU-07, CU-13 | **RF-07, RF-08, RF-12, RF-25** | RF-11, RF-14, RF-21 |
| `Chat - error y degradacion (P-11)` | — (solo excepción en CU-06) | **RF-26** | RF-07…RF-13 |
| `Contencion y derivacion (P-12)` | CU-07 | **RF-11** | — |
| `Gestion de cuenta (P-13)` | CU-04, CU-11, CU-12 | **RF-22, RF-23, RF-24** | — |
| `Directorio de usuarios (P-14)` | CU-08 | **RF-15** | RF-14 |
| `Metricas de uso (P-15)` | CU-09 | **RF-16** | — |
| `Kill switch - control de disponibilidad (P-16)` | CU-10 | **RF-17** | RF-18 |
| `Dialogo de confirmacion del cambio` | CU-10 | **RF-18** (la mitad *confirmación* de `RN-03.4`) | RF-17 |
| `Frontera con el Proveedor LLM` | CU-06 | **RF-09** | RF-08, RF-26 |
| `Gate de seguridad` | CU-06 | **RF-10** | RF-11 |
| `Fallback de seguridad` | CU-07 | **RF-11** | RF-26 |
| `AccionAdministrativa` | CU-10 | **RF-18** (la mitad *registro* de `RN-03.4`) | — |
| `FilaDeDirectorio` | CU-08 | **RF-15** | — |
| `AgregadoDeCuentas` | CU-09 | **RF-16** | — |
| `AgregadoDeUso` | CU-09 | **RF-16** | — |
| `AlcanceDeBorrado` | CU-11 | **RF-22** | — |
| `Persona` | CU-06, CU-13, CU-14 | **RF-06, RF-07, RF-12** | — |
| `ReferenciaDeDerivacion` | CU-07 | **RF-11** | — |

### B · Las 16 clases del espacio del problema

Aquí «realiza» significa otra cosa: una entidad realiza el RF que **restringe su estado**, no el que la usa de paso. Por eso `Consentimiento` realiza `RF-03` y no los dieciocho de los siete casos de uso en que aparece. La columna de **casos de uso** completa está en §5.1 y no se repite.

| Clase | RF que **realiza** `[I2]` | Por qué ese y no los de todos sus CU |
|---|---|---|
| `Visitante` | **RF-19** | Su estado *es* «no autenticado»: `RN-04.5`, solo consulta la presentación |
| `TitularDeCuenta` | **RF-20, RF-21** | Concentra identidad y credencial; el rol lo determina en servidor (`RNF-08`) |
| `Usuario` | **RF-20, RF-21, RF-22, RF-24** + **RF-15, RF-16** | Las cuatro primeras son su ciclo de vida; las dos últimas son la **proyección de lectura** para el administrador que `H-L` de `MC-00` identifica como su segunda cara |
| `Administrador` | **RF-14** | No posee dato de usuario (`RN-03.5`): lo que realiza es la separación de rol |
| `Consentimiento` | **RF-03, RF-23** | Otorgar/revocar es su estado; `RF-23` es la revocación de la capa de personalización |
| `CapsulaDePerfil` | **RF-04, RF-05, RF-22, RF-23** | Es el objeto que los cuatro requisitos describen: existe siempre con `character`, se borra en CU-11, deja de alimentar en CU-12 |
| `Conversacion` | **RF-07, RF-13, RF-25** | Se abre con personaje, se cierra descartando y lleva el límite de 20 mensajes |
| `Mensaje` | **RF-08, RF-13, RF-25** | El turno y su límite de 2.500 caracteres; muere con la conversación |
| `Personaje` | **RF-07, RF-12** | Fija el personaje de la sesión y soporta el cambio |
| `Alan` · `Aura` | **RF-06, RF-12** | Su existencia como especializaciones *es* lo que `RF-06` pide hacer visible |
| `EventoDeSeguridad` | **RF-10, RF-11** | Lo documenta el gate y lo consume la derivación |
| `RecursoDeAyuda` | **RF-11** | Los recursos de la contención, aprovisionados por entorno (`RNF-05`) |
| `DisponibilidadDelChatbot` | **RF-17** | Su estado global *es* el *kill switch* |
| `ContadorDeUsoDiario` | **RF-26** | La cuota 3/min y 30/día (`RNF-10`) |
| `EventoOperativo` | **RF-16, RF-24** | Alimenta las métricas agregadas y **sobrevive** a la cascada sin identidad |

### C · Comprobación de cobertura

- **43/43 clases con al menos un RF**, ninguna sin requisito que la justifique. ✅
- **26/26 RF realizados por al menos una clase de `MC-01`.** ✅
- **Un solo RF no lo realiza ninguna clase de la solución: `RF-13`** («no hay registro tras cerrar»), y es correcto que sea así: la no persistencia no la realiza una pantalla ni un servicio, sino **`Conversacion` y `Mensaje` descartando su contenido**. Un RF cumplido por entidades del dominio y no por andamiaje es exactamente lo que el método espera de un requisito de minimización.
- La pregunta de control del CDR —***«¿qué requisito implementa esta clase?»***— es contestable para las 43 **desde este artefacto**, sin empalmar tres.

## 6. Cierre
- **Confirmadas:** cobertura completa objetivo↔RF↔RC↔norma; **columna CU poblada** (RF → `ECU-NN`), cero huérfanos, **16/16 clases del dominio manifestadas en casos de uso** (§5.1) y **26/26 RF con caso de uso propio y único** (§5.2).
- **Confirmadas en v2.1 (retrabajo del `CDR-01`):** **10/10 RNF con fila de trazabilidad** a su decisión de diseño (§3.1) —seis realizados en el diseño de fase 2, uno con `PER-H4` abierto, dos heredados por `ARQ-01` y uno de fase 3/4—, y **43/43 clases de `MC-01` con al menos un RF** más **26/26 RF realizados por al menos una clase** (§5.3). Con eso, la cadena `Objetivo → … → RF → CU → clase de diseño` queda **recorrible de extremo a extremo desde este artefacto**, que era lo que `H-06` echaba en falta.
- **Recomendaciones:** al abrir fase 4, ejecutar las pruebas planificadas (`CP-XX`) y medir umbrales; encadenar cada `ECU-NN` con su robustez (`DR-NN`, ya producida: 14 diagramas) y secuencia (`DS-XX`).
- **Pendientes:** columna `Prueba ejecutada` ⏳ (fase 4).

**Fin de TRZ-01.**
