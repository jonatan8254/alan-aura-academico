# DR-00 — Índice y certificado del análisis de robustez
**ID:** DR-00 · **Familia:** DR (robustez, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/robustez/` · **Fecha:** 2026-07-31 · **Versión:** v2.0 · **Estado:** Propuesto.
**Propósito:** índice de los **14 diagramas de robustez** (`DR-01…DR-14`) derivados de `ECU-01…ECU-14`, con su certificado de auditoría, el delta de *object discovery* y la trazabilidad.
**Insumos:** ECU-01…ECU-14 v2.0 (en 0 errores / 0 advertencias), MD-01 v1.4, DCU-01 v2.1, DIS-00, MV-01, SEG-01, PRIV-01, PER-01, contrato conversacional.
**Generado con:** skill `uml-robustness-diagram` (contrato actualizado). **Validador:** `validate_robustness_puml.py --domain MD-01` → **0 errores en los 14**.
**Consumidores:** diagramas de secuencia (`DS-XX`) y casos de prueba (`CP-XX`), fases posteriores.

---

## 1. Los 14 diagramas

| DR | Caso de uso | Elementos | Actor/Borde/Control/Entidad | FA | FE |
|---|---|---|---|---|---|
| [DR-01](DR-01_robustez_consultar_presentacion.puml) | CU-01 Consultar presentación del servicio | 12 | 1/3/7/1 | 3 | 2 |
| [DR-02](DR-02_robustez_registrar_cuenta.puml) | CU-02 Registrar cuenta | 13 | 1/2/7/3 | 1 | 1 |
| [DR-03](DR-03_robustez_iniciar_y_cerrar_sesion.puml) | CU-03 **Iniciar y cerrar sesión** | 23 | 1/5/12/5 | 2 | 3 |
| [DR-04](DR-04_robustez_eliminar_cuenta.puml) | CU-04 **Eliminar cuenta** | 21 | 1/3/11/6 | 3 | 4 |
| [DR-05](DR-05_robustez_consentimiento_caracterizacion.puml) | CU-05 **Otorgar consentimiento y crear la cápsula de perfil** | 25 | 1/5/16/3 | 4 | 4 |
| [DR-06](DR-06_robustez_conversar_con_el_acompanante.puml) | CU-06 Conversar con el acompañante | 40 | 2/4/25/9 | 2 | 9 |
| [DR-07](DR-07_robustez_derivar_ante_peligro.puml) | CU-07 Derivar ante peligro | 20 | 1/2/12/5 | 3 | 3 |
| [DR-08](DR-08_robustez_consultar_directorio.puml) | CU-08 Consultar directorio de usuarios | 12 | 1/1/8/2 | 2 | 2 |
| [DR-09](DR-09_robustez_consultar_metricas.puml) | CU-09 Consultar métricas de uso | 14 | 1/1/8/4 | 2 | 2 |
| [DR-10](DR-10_robustez_habilitar_deshabilitar_chatbot.puml) | CU-10 Habilitar o deshabilitar el chatbot | 19 | 1/3/11/4 | 3 | 3 |
| [**DR-11**](DR-11_robustez_reiniciar_la_caracterizacion.puml) | CU-11 **Reiniciar la caracterización** | 18 | 1/3/11/3 | 3 | 4 |
| [**DR-12**](DR-12_robustez_revocar_la_personalizacion.puml) | CU-12 **Revocar la personalización** | 16 | 1/2/9/4 | 3 | 3 |
| [**DR-13**](DR-13_robustez_cambiar_de_acompanante.puml) | CU-13 **Cambiar de acompañante** | 15 | 1/2/6/6 | 1 | 2 |
| [**DR-14**](DR-14_robustez_elegir_acompanante.puml) | CU-14 **Elegir acompañante (Alan o Aura)** | 13 | 1/2/6/4 | 1 | 1 |
| | **Total** | **261** | **15/38/149/59** | | |

**Un diagrama por caso de uso, con su curso básico y *todos* sus cursos alternativos y de excepción en el mismo diagrama.** Los objetos que participan solo en un curso alternativo o de excepción van en `#LightCoral`; los compartidos con el básico, sin color.

## 2. Los `.svg`

Los genera [`scripts/generar_svg_robustez.py`](scripts/generar_svg_robustez.py) desde los propios `.puml`, en cuatro calles (Actor · Borde · Controlador · Entidad). **El `.puml` es la fuente de verdad**; el `.svg` es una vista derivada y se regenera cuando el `.puml` cambia:

```bash
python scripts/generar_svg_robustez.py
```

El generador comprueba su propia correspondencia con los `.puml` y aborta el visto bueno si no cuadra: *«Correspondencia con los .puml: OK (261 elementos, 15/38/149/59)»*.

## 3. Qué cambió en v2.0

La fase D.3 del PDR-01 rehizo las 14 especificaciones. **Los diez diagramas de v1.0 derivaban de un texto que dejó de existir**, así que se rehicieron los diez y se crearon cuatro.

| Cambio | Detalle |
|---|---|
| **+4 diagramas** | `DR-11`, `DR-12`, `DR-13`, `DR-14`, uno por cada caso de uso nuevo |
| **DR-04 se estrecha** | Pierde reiniciar (a DR-11) y revocar (a DR-12). Su paso 1 deja de ser un menú de tres opciones |
| **DR-05 baja de 9 a 8 pasos** | La elección de personaje sale a DR-14 por `<<include>>`, y con ella `Alan`, `Aura`, `Personaje` y P-09 |
| **DR-06 pierde un flujo y gana otro** | El cambio de personaje sale a DR-13; entra `FE-09` (capa base revocada → `403` → CU-05) |
| **DR-03 pasa a un solo actor** | El rol general `Titular de cuenta`; el cierre de sesión entra al flujo básico |
| **Las capas del consentimiento** | `DR-05`, `DR-06` y `DR-12` distinguen la capa base de la de personalización |
| **2 renombrados** | `DR-03_robustez_iniciar_sesion` → `…iniciar_y_cerrar_sesion`; `DR-04_robustez_gestionar_cuenta` → `…eliminar_cuenta` |

## 4. Certificado de auditoría

**Alcance:** los 14 diagramas, en tres tandas. **Pasadas ejecutadas:** 2 de 5 en cada tanda. **Estado: convergido con excepciones declaradas.**

Los certificados por tanda, con el detalle de cada pasada: [`CERT-D4-tanda1.md`](CERT-D4-tanda1.md) · [`CERT-D4-tanda2.md`](CERT-D4-tanda2.md) · [`CERT-D4-tanda3.md`](CERT-D4-tanda3.md).

| # | Capa | Resultado |
|---|---|---|
| 1 | Sintaxis y reglas duras | ✅ **0 errores en los 14**, con `--domain MD-01`. Ninguna conexión prohibida, ningún alias con prefijo cruzado |
| 2 | Correspondencia texto ↔ diagrama ↔ interfaz | ✅ La comprobación automática de cobertura —el texto del caso de uso va como `note`— **no reporta ningún flujo declarado y ausente** en los 14. Pantallas contrastadas contra DIS-00 |
| 3 | Guías de método | ✅ Un objeto tipo Borde por pantalla con su nombre real; controladores en infinitivo; sin *widgets* ni tecnología; arcos sin dirección |
| 4 | Anti-patrones | ⚠️ Excepciones declaradas en §5 |
| 5 | Trazabilidad | ✅ Toda entidad ∈ MD-01 v1.4 **salvo una, declarada** (§6). Actores ∈ DCU-01 v2.1 |
| 6 | Calidad del ítem de información | ✅ Cada diagrama documenta sus decisiones no obvias en su nota |
| 7 | Conformidad entrada ↔ salida | ✅ Nada del texto se perdió en las mudanzas entre diagramas |

### Lo que la capa 1 encontró y la revisión a ojo no

Tres defectos los cazó el validador o el renderizado, no la lectura:

1. **DR-05** tenía un controlador con 8 conexiones absorbiendo comportamiento ajeno. Se distribuyó a 6.
2. **DR-06** declaraba `FA-03` en su nota sin que existiera ya en los arcos: al renumerar por la salida a CU-13 se actualizaron los arcos y no el texto.
3. **Nueve de los catorce títulos salieron vacíos en el `.svg`.** Al insertar la marca de versión en la línea de cabecera se rompió el patrón con que el generador extrae el título. Solo se vio al rasterizar: el validador no mira el `.svg`, y el generador no falla por ello.

> El tercero es el más instructivo: *el script no falló* y *se ve bien* no son lo mismo. Por eso la verificación incluye rasterizar y mirar, no solo ejecutar.

## 5. Excepciones declaradas

**E-1 · Racimos controlador-controlador.** La skill avisa a partir de 3 enlaces porque «suele indicar lógica no distribuida». En `DR-06` (23), `DR-07` (12) y `DR-05` (9) **no lo es**: son cadenas por naturaleza —una tubería de chat, una ruta de seguridad y un asistente multipaso— y esa forma está literalmente en el texto. Distribuirla inventaría estructura que el texto no tiene.

**E-2 · `DR-06` tiene 40 elementos (umbral 25).** El criterio de la propia skill para partir un caso de uso es que *«los cursos alternativos tengan sus propios subalternos»*. Los de CU-06 no los tienen: el tamaño viene de sus **nueve flujos de excepción**, que son la tabla de códigos HTTP del plan §4.13 y responden a RF-26. Partir CU-06 rompería el caso de uso central del MVP para satisfacer un umbral.

**E-3 · `DR-04` concentra 8 conexiones en el controlador de la cascada.** **Cuatro de las ocho son las entidades que suprime**, y suprimirlas juntas *es* su definición y un solo paso del texto. Partirlo rompería la atomicidad, que es la invariante del caso de uso.

> E-1 y E-3 son la misma advertencia con veredictos opuestos a la de `DR-05`, donde sí había comportamiento absorbido y se corrigió. Es exactamente por eso que la skill las clasifica como advertencias y no como errores: piden criterio, no obediencia.

## 6. Delta de *object discovery*

**Una sola entidad ausente del modelo de dominio, y es deliberado:**

| Entidad | Dónde | Situación |
|---|---|---|
| `AccionAdministrativa` | `DR-10`, paso 3 | **Fuera de MD-01 por decisión declarada** (RA-01 de ECU-10): el registro de la acción administrativa es auditoría de operación, no concepto del problema. Se marca en verde en el diagrama y se mantiene en el delta para que la decisión siga siendo visible y discutible |

Las tres clases que la v1.0 reportaba como delta —`TitularDeCuenta`, `ContadorDeUsoDiario` y `EventoOperativo`— **ya son clases de MD-01 v1.4** desde la tanda 0 del PDR-01, así que perdieron su marca verde.

## 7. Informe de desambiguación

**Sin hallazgos en las tres tandas.** Es el resultado esperable y confirma que el orden de las fases era el correcto: las 14 especificaciones se rehicieron y auditaron en la D.3, así que los defectos que este paso suele destapar —pantallas sin nombre, sustantivos vagos, flujos sin desenlace, cursos alternativos sin criterio— ya estaban corregidos allí.

Los quince hallazgos de desambiguación de la v1.0 (`D-01`…`D-15`) **fueron absorbidos por la fase D.3**; su destino está registrado en `ECU-00` y en cada especificación.

## 8. Trazabilidad hacia adelante

La correspondencia con el diseño detallado es casi mecánica, y así se consumirá en las fases siguientes:

| Elemento de robustez | Destino |
|---|---|
| Objeto tipo **Borde** y tipo **Entidad** | Instancias de objeto en el diagrama de secuencia (`DS-XX`) |
| **Controlador** | Mensaje en el diagrama de secuencia; más tarde, método de una clase |
| **Cada controlador** | **Un caso de prueba** (`CP-XX`) |

Con **149 controladores** en los 14 diagramas, esa es la cota inferior de casos de prueba que la fase de pruebas tendrá que cubrir.

## 9. Qué queda abierto

| Asunto | Fase |
|---|---|
| Propagar aguas arriba: `MV-01` (2.500 caracteres, `EventoOperativo` §13.2), `REQ-01`, `TRZ-01` (matriz clase ↔ CU y visibilidad RF → CU), `PER-01` (citas rotas), `DIS-00` («reversible» falso), `INDICE_MAESTRO` | **D.5** |
| Evidencia documental: `RET-01`, `PDR-01`, `SD-28`, `CHANGELOG`, `README` | **D.6** |
| Diagramas de secuencia `DS-01…DS-14` y casos de prueba `CP-01…CP-14` | posteriores |
| `PER-H4`: campos de `ContadorDeUsoDiario` | abierta |


## 10. Revisión Preliminar del Diseño (RPD-01)

El paquete pasó por la **compuerta ICONIX** entre el análisis y el diseño detallado, con la skill `iconix-pdr-review`. Veredicto: **Aceptado con verificación de retrabajo**. Acta completa: [`RPD-01_revision_preliminar_diseno.md`](../RPD-01_revision_preliminar_diseno.md).

Encontró y corrigió en el acto un defecto real que las auditorías anteriores no habían visto: **`DR-11` no dibujaba `FE-04`** (borrado incompleto de la cápsula), que `ECU-11` sí declara. Ya está corregido: `DR-11` pasó de 17 a 18 elementos.

**Fin de DR-00.**
