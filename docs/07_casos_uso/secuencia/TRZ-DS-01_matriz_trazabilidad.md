# TRZ-DS-01 — Matriz de trazabilidad del paquete de secuencia

**ID:** TRZ-DS-01 · **Familia:** DS (secuencia, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/secuencia/` · **Fecha:** 2026-08-01 · **Versión:** v1.3 (SD-35: `RF-24` pasa a cumplirse). v1.2 (SD-33: `PER-H5` cerrado; §4 pasa a citar `PER-H2`). v1.1 (SD-32: §3 corrige «tres clases del espacio de la solución» a 21). v1.0 · **Estado:** Propuesto.
**Propósito:** cerrar la cadena **paso del texto → mensaje → operación → clase receptora → caso de prueba**, para los 14 casos de uso. Es el quinto entregable de la skill `uml-sequence-diagram` y la evidencia de que **ningún requisito quedó huérfano** al pasar de análisis a diseño detallado.
**Insumos:** `ECU-01…ECU-14 v2.1`, `DR-01…DR-14 v2.1` (**262 elementos**, 150 controladores), `DS-01…DS-14 v1.1` (**282 mensajes**), `DOP-01 v1.1` (**192 operaciones**), `CP-00…CP-14 v1.2` (**181 casos**), `MD-01 v1.6`, `HECHOS_CANONICOS` (`H-20`…`H-24`).
**Consumidores:** `TRZ-01` (matriz maestra), `uml-design-class-model`, el CDR.
**Generado con:** skill `uml-sequence-diagram`. Conteos **reproducidos por el orquestador** contra los `.puml` y los `.md`, no citados de segunda mano.

---

## 1. La cadena, y por qué se verifica en este punto

ICONIX exige que **cada requisito llegue a código por un camino visible**. El paso de secuencia es
donde ese camino puede romperse sin que nadie lo note: el comportamiento se reparte entre clases y,
si una asignación se pierde, el requisito sigue escrito pero ya no lo implementa nadie.

```
RF-XX  →  CU-XX  →  paso de ECU-XX  →  controlador de DR-XX  →  mensaje de DS-XX
                                              ↓                        ↓
                                           CP-XXX              operación en una clase (DOP-01)
```

**Dos ramas, no una.** El controlador se bifurca: hacia el **mensaje** (qué hace el sistema) y
hacia el **caso de prueba** (cómo se comprueba). Que las dos ramas nazcan del mismo nodo es lo que
impide probar algo distinto de lo que se diseñó.

## 2. Matriz por caso de uso

| CU | Especificación | Robustez | Secuencia | Entidades de dominio que reciben mensajes | Pruebas |
|---|---|---:|---:|---|---:|
| CU-01 Consultar presentación | `ECU-01` | `DR-01` · 7 ctrl | `DS-01` · 12 msg | 1: `Visitante` | `CP-501…507` · 7 |
| CU-02 Registrar cuenta | `ECU-02` | `DR-02` · 7 ctrl | `DS-02` · 16 msg | 3: `Visitante`, `TitularDeCuenta`, `Usuario` | `CP-601…607` · 7 |
| CU-03 Iniciar y cerrar sesión | `ECU-03` | `DR-03` · 12 ctrl | `DS-03` · 21 msg | 5: `TitularDeCuenta`, `Usuario`, `Administrador`, `Consentimiento`, `CapsulaDePerfil` | `CP-701…712` · 12 |
| CU-04 Eliminar cuenta | `ECU-04` | `DR-04` · 12 ctrl | `DS-04` · 23 msg | 7: `Usuario`, `CapsulaDePerfil`, `Consentimiento`, `ContadorDeUsoDiario`, `Conversacion`, `Visitante`, `EventoOperativo` | `CP-801…813` · 13 |
| CU-05 Consentimiento y cápsula | `ECU-05` | `DR-05` · 16 ctrl | `DS-05` · 24 msg | 3: `Usuario`, `Consentimiento`, `CapsulaDePerfil` | `CP-201…218` · 18 |
| **CU-06 Conversar** | `ECU-06` | `DR-06` · 25 ctrl | `DS-06` · 49 msg | 9: `Consentimiento`, `DisponibilidadDelChatbot`, `Conversacion`, `Personaje`, `Mensaje`, `ContadorDeUsoDiario`, `CapsulaDePerfil`, `EventoDeSeguridad`, `EventoOperativo` | `CP-001…034` · **34** |
| CU-07 Derivar ante peligro | `ECU-07` | `DR-07` · 12 ctrl | `DS-07` · 26 msg | 5: `Mensaje`, `EventoDeSeguridad`, `RecursoDeAyuda`, `Conversacion`, `DisponibilidadDelChatbot` | `CP-101…121` · 21 |
| CU-08 Consultar directorio | `ECU-08` | `DR-08` · 8 ctrl | `DS-08` · 13 msg | 2: `Usuario`, `Consentimiento` | `CP-901…908` · 8 |
| CU-09 Consultar métricas | `ECU-09` | `DR-09` · 8 ctrl | `DS-09` · 13 msg | 3: `Usuario`, `EventoOperativo`, `DisponibilidadDelChatbot` | `CP-1001…1008` · 8 |
| CU-10 Habilitar/deshabilitar | `ECU-10` | `DR-10` · 11 ctrl | `DS-10` · 20 msg | 3: `Administrador`, `DisponibilidadDelChatbot`, `Conversacion` | `CP-1101…1114` · 14 |
| CU-11 Reiniciar caracterización | `ECU-11` | `DR-11` · 11 ctrl | `DS-11` · 19 msg | 3: `Usuario`, `CapsulaDePerfil`, `Consentimiento` | `CP-1201…1213` · 13 |
| CU-12 Revocar personalización | `ECU-12` | `DR-12` · 9 ctrl | `DS-12` · 17 msg | 4: `Usuario`, `Consentimiento`, `CapsulaDePerfil`, `Conversacion` | `CP-1301…1311` · 11 |
| CU-13 Cambiar de acompañante | `ECU-13` | `DR-13` · 6 ctrl | `DS-13` · 16 msg | 6: `Alan`, `Aura`, `Personaje`, `Conversacion`, `CapsulaDePerfil`, `DisponibilidadDelChatbot` | `CP-301…308` · 8 |
| CU-14 Elegir acompañante | `ECU-14` | `DR-14` · 6 ctrl | `DS-14` · 13 msg | 4: `Alan`, `Aura`, `Personaje`, `CapsulaDePerfil` | `CP-401…407` · 7 |
| | | **150** | **282** | **16/16** distintas · **192** operaciones (`DOP-01`) | **181** |

**Los cuatro totales son hechos canónicos:** `H-21` (150), `H-22` (282), `H-23` (192), `H-24` (181).
Si esta tabla discrepa de `HECHOS_CANONICOS`, manda esa tabla.

## 3. Cobertura del modelo de dominio — las 16 clases

`DOP-01 §7` lo verifica en detalle; aquí queda el resumen, porque es la pregunta que el CDR hará
primero: **¿alguna clase de `MD-01` salió del análisis sin comportamiento?**

| Clase de `MD-01 v1.6` | Aparece como Entidad en |
|---|---|
| `Administrador` | `DS-03`, `DS-10` |
| `Alan` | `DS-13`, `DS-14` |
| `Aura` | `DS-13`, `DS-14` |
| `CapsulaDePerfil` | `DS-03`, `DS-04`, `DS-05`, `DS-06`, `DS-11`, `DS-12`, `DS-13`, `DS-14` |
| `Consentimiento` | `DS-03`, `DS-04`, `DS-05`, `DS-06`, `DS-08`, `DS-11`, `DS-12` |
| `ContadorDeUsoDiario` | `DS-04`, `DS-06` |
| `Conversacion` | `DS-04`, `DS-06`, `DS-07`, `DS-10`, `DS-12`, `DS-13` |
| `DisponibilidadDelChatbot` | `DS-06`, `DS-07`, `DS-09`, `DS-10`, `DS-13` |
| `EventoDeSeguridad` | `DS-06`, `DS-07` |
| `EventoOperativo` | `DS-04`, `DS-06`, `DS-09` |
| `Mensaje` | `DS-06`, `DS-07` |
| `Personaje` | `DS-06`, `DS-13`, `DS-14` |
| `RecursoDeAyuda` | `DS-07` |
| `TitularDeCuenta` | `DS-02`, `DS-03` |
| `Usuario` | `DS-02`, `DS-03`, `DS-04`, `DS-05`, `DS-08`, `DS-09`, `DS-11`, `DS-12` |
| `Visitante` | `DS-01`, `DS-02`, `DS-04` |

**16/16. Cero clases sin comportamiento** — y, en el otro sentido, **cero entidades dibujadas sin
recibir nada**: las 58 apariciones de entidad en los 14 diagramas son todas destino de al menos un
mensaje. Comprobado sobre los `.puml`, no supuesto. Una entidad dibujada que nadie invoca sería el
síntoma clásico del modelo anémico.

**Veintiuna** clases del **espacio de la solución** reciben operaciones sin estar en `MD-01`: dos de
**control** (`C_GateDeSeguridad`, `C_FallbackDeSeguridad`), una de **auditoría de operación**
(`AccionAdministrativa`) y **dieciocho de frontera** — las 16 pantallas de `DIS-00`, el diálogo de
confirmación de P-16 y la frontera con el proveedor. Entre las tres primeras reúnen 7 operaciones y
las fronteras 88. **No es un defecto de trazabilidad**: es lo que se espera del diseño detallado,
donde los dos espacios convergen. El inventario con su justificación vive en
`MC-01_matriz_procedencia.md §4`; las de control, además, contra `SEG-01 §R1-R6`.

> **Corregido en v1.1 (`H-B` de `MC-00`, SD-32).** Hasta v1.0 este párrafo decía «**tres** clases» y
> nombraba `C_GateDeSeguridad`, `B_FronteraProveedorLLM` y `B_InterfazDeChat`. Eran tres ejemplos
> presentados como el total, y además una lista **distinta** de la que daba `DOP-01 §8` —que también
> decía tres y nombraba otras—. Dos artefactos del mismo paquete daban dos respuestas incompatibles a
> la misma pregunta, y ninguna era el número real.

## 4. Lo que esta matriz deja declarado y no resuelve

| Asunto | Por qué no se cierra aquí |
|---|---|
| **`E-1` de `DS-00`** — la capa de infraestructura no se ejecutó | Decisión de `SD-30`: el diseño físico es `ARQ-01`, posterior al diagrama de clases y su CDR (`ADR-002 §1`) |
| ~~**`RF-24`** no se cumple~~ — ✅ **cumple desde SD-35** | Sus dos excepciones cerradas: **`PER-H5`** en `ADR-003` (sin respaldo del almacén operativo) y **`PER-H2`** en `ADR-004-D1` (supresión física e inmediata). Se cumple **según el diseño**; la inmediatez solo se verifica contra una implementación, que es fase 4 |
| **`COD-01`** (clase · operación · **firma** · capa) | La firma exige tipos, y los tipos los fija el **diagrama de clases**, que es el artefacto siguiente. Escribirlos ahora sería inventarlos |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.2 | 2026-08-04 | J. Sánchez | **SD-33.** §4 deja de declarar que `RF-24` no se cumple «de extremo a extremo» por `PER-H5` —cerrado en `ADR-003`— y pasa a declarar que no se cumple de forma **inmediata** por `PER-H2`. Ningún conteo cambia. |
| v1.1 | 2026-08-04 | J. Sánchez | **SD-32, hallazgo `H-B` de `MC-00`.** §3 decía «tres clases del espacio de la solución» y nombraba tres ejemplos, con una lista además **distinta** de la de `DOP-01 §8`. Las reales son **21**. Ningún conteo de la matriz por caso de uso cambia: los 150 controladores, los 282 mensajes, las 192 operaciones y los 181 casos de prueba se mantienen. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación (SD-30). Cierra la cadena paso → mensaje → operación → clase → `CP` para los 14 casos de uso, con los cinco totales reproducidos contra los artefactos y la verificación de que las **16 clases** de `MD-01` reciben comportamiento. |
