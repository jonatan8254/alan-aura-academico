# ECU-00 — Índice de especificaciones de casos de uso
**ID:** ECU-00 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-31 · **Versión:** v2.1 (`SD-48`: §7 declaraba que «`MV-01` §7.3 y `RF-25` aún dicen 1.500 caracteres», y **ninguno de los dos lo dice**). v2.0 · **Estado:** Propuesto.
**Propósito:** índice de las **14 especificaciones textuales** de casos de uso derivadas de `DCU-01 v2.1` con la skill `use-case-specifier` (paso 3 ICONIX).
**Insumos:** DCU-01 v2.1, MD-01 v1.4, MV-01, REQ-01, PRIV-01, PER-01, SEG-01, contrato conversacional, VIS-01, DIS-00, `00_PLAN_CODEX_ORIGINAL.md`. **Consumidores:** análisis de robustez, diagramas de secuencia, pruebas.
**Naturaleza:** este documento es un **índice**, no una especificación. Ver §6 para lo que eso implica en la verificación.

---

## 1. Las 14 especificaciones

| CU | Nombre | Archivo | Actor primario | Paquete | Forma | RF |
|---|---|---|---|---|---|---|
| **CU-01** | Consultar presentación del servicio | [`ECU-01_consultar_presentacion.md`](ECU-01_consultar_presentacion.md) | Visitante | Acceso y cuenta | Ágil | RF-19 |
| **CU-02** | Registrar cuenta | [`ECU-02_registrar_cuenta.md`](ECU-02_registrar_cuenta.md) | Visitante | Acceso y cuenta | Ágil | RF-20 |
| **CU-03** | **Iniciar y cerrar sesión** | [`ECU-03_iniciar_y_cerrar_sesion.md`](ECU-03_iniciar_y_cerrar_sesion.md) | Titular de cuenta | Acceso y cuenta | Ágil | RF-14, RF-21 |
| **CU-04** | **Eliminar cuenta** | [`ECU-04_eliminar_cuenta.md`](ECU-04_eliminar_cuenta.md) | Usuario adulto | Acceso y cuenta | **Completa** | RF-24 |
| **CU-05** | **Otorgar consentimiento y crear la cápsula de perfil** | [`ECU-05_otorgar_consentimiento_crear_capsula.md`](ECU-05_otorgar_consentimiento_crear_capsula.md) | Usuario adulto | Acompañamiento | **Completa** | RF-01…RF-05 |
| **CU-06** | Conversar con el acompañante | [`ECU-06_conversar_con_el_acompanante.md`](ECU-06_conversar_con_el_acompanante.md) | Usuario adulto (secundario: Proveedor LLM) | Acompañamiento | **Completa** | RF-07…RF-10, RF-13, RF-25, RF-26 |
| **CU-07** | Derivar ante peligro | [`ECU-07_derivar_ante_peligro.md`](ECU-07_derivar_ante_peligro.md) | Usuario adulto (lo dispara el sistema) | Acompañamiento | **Completa** | RF-11 |
| **CU-08** | Consultar directorio de usuarios | [`ECU-08_consultar_directorio.md`](ECU-08_consultar_directorio.md) | Administrador de plataforma | Administración | Ágil | RF-15 |
| **CU-09** | Consultar métricas de uso | [`ECU-09_consultar_metricas.md`](ECU-09_consultar_metricas.md) | Administrador de plataforma | Administración | Ágil | RF-16 |
| **CU-10** | Habilitar o deshabilitar el chatbot | [`ECU-10_habilitar_deshabilitar_chatbot.md`](ECU-10_habilitar_deshabilitar_chatbot.md) | Administrador de plataforma | Administración | **Completa** | RF-17, RF-18 |
| **CU-11** | **Reiniciar la caracterización** | [`ECU-11_reiniciar_la_caracterizacion.md`](ECU-11_reiniciar_la_caracterizacion.md) | Usuario adulto | Acceso y cuenta | **Completa** | RF-22 |
| **CU-12** | **Revocar la personalización** | [`ECU-12_revocar_la_personalizacion.md`](ECU-12_revocar_la_personalizacion.md) | Usuario adulto | Acceso y cuenta | **Completa** | RF-23 |
| **CU-13** | **Cambiar de acompañante** | [`ECU-13_cambiar_de_acompanante.md`](ECU-13_cambiar_de_acompanante.md) | Usuario adulto | Acompañamiento | Ágil | RF-12 |
| **CU-14** | **Elegir acompañante (Alan o Aura)** | [`ECU-14_elegir_acompanante.md`](ECU-14_elegir_acompanante.md) | Usuario adulto | Acompañamiento | Ágil | RF-06 |

**Siete completas** (CU-04, 05, 06, 07, 10, 11, 12) y **siete ágiles** (CU-01, 02, 03, 08, 09, 13, 14). El criterio no es el tamaño sino la sensibilidad al canon: lleva forma completa lo que toca el consentimiento, la minimización, la ruta de seguridad, el borrado irreversible o el *kill switch*.

## 2. Qué cambió en v2.0

El punto 3 de la retroalimentación docente señaló que los requisitos funcionales no se veían reflejados en su totalidad en el diagrama. La auditoría lo confirmó: **13 de los 26 RF no tenían manifestación gráfica** y tres casos de uso absorbían 17. `DCU-01 v2.0` pasó de 10 a 14 casos de uso, y este paquete lo sigue.

| Cambio | De | A |
|---|---|---|
| «Gestionar cuenta y datos personales» se estrecha | CU-04 con tres objetivos | **CU-04** «Eliminar cuenta» · **CU-11** «Reiniciar la caracterización» · **CU-12** «Revocar la personalización» |
| El cambio de personaje sale de un flujo alternativo | dentro de CU-06 | **CU-13** «Cambiar de acompañante», `<<extend>>` |
| La elección de personaje sale del onboarding | pasos 8-9 de CU-05 | **CU-14** «Elegir acompañante», `<<include>>` |
| Dos casos de uso se renombran | «Iniciar sesión» · «…caracterizar el perfil» | «Iniciar **y cerrar** sesión» (RF-21 nombra el cierre) · «…**crear la cápsula de perfil**» («perfil» a secas es término prohibido) |

**Decisión de diseño introducida en esta pasada:** el `Consentimiento` se separa en **capa base** (autoriza conversar) y **capa de personalización** (autoriza que los cuatro autorreportes de la cápsula orienten la conversación). La definición canónica vive en `ECU-12` §4.1. Resolvió el hallazgo D-01, que había detectado que «revocar» no decía **qué** se revocaba y que un usuario con el consentimiento retirado entraba al chat sin obstáculo en el modelo.

## 3. Convención de identificadores
- **Documento:** `DOC-CU-XX`. **Caso de uso:** `CU-XX` (REQ-01 §0 reserva `CU` para la fase 2).
- **Dentro de cada especificación:** `PRE-` (precondición), `FA-` (flujo alternativo), `FE-` (flujo de excepción), `RN-` (regla de negocio), `RE-` (requisito especial), `CA-` (criterio de aceptación), `RA-` (riesgo o ambigüedad). **Trazas hacia fuera:** `RF-`, `OBJ-`, `RC-`, `CP-`, `DR-`, `DS-`.
- **Numeración.** Los diez casos de uso de v1.0 conservan su número; los cuatro nuevos se numeran del 11 al 14 en el orden de la tabla de `DCU-01` §2. No sigue el orden de declaración del `.puml`, y por eso cada especificación registra en su trazabilidad la correspondencia **alias del diagrama ↔ `CU-NN`**.

## 4. Mapa a DCU-01 v2.1
- **5 actores** (4 concretos más el rol general `Titular de cuenta`), **14 casos de uso**, **3 paquetes**.
- **1 `<<include>>`:** `CU-05 ..> CU-14`. **2 `<<extend>>`:** `CU-07 ..> CU-06` y `CU-13 ..> CU-06`.
- `CU-07` y `CU-14` **no cuelgan de ningún actor** en el diagrama, por disciplina de asociación: el primero lo dispara el sistema, el segundo es una subfunción incluida. Ambos sí declaran actor primario en su especificación, porque el validador lo exige y porque alguien ejecuta sus pasos.

## 5. Cobertura de trazabilidad — 26/26, cero huérfanos

| RF | CU | RF | CU | RF | CU |
|---|---|---|---|---|---|
| RF-01 | CU-05 | RF-10 | CU-06 | RF-19 | CU-01 |
| RF-02 | CU-05 | RF-11 | CU-07 | RF-20 | CU-02 |
| RF-03 | CU-05 | **RF-12** | **CU-13** | RF-21 | CU-03 |
| RF-04 | CU-05 | RF-13 | CU-06 | **RF-22** | **CU-11** |
| RF-05 | CU-05 | RF-14 | CU-03 | **RF-23** | **CU-12** |
| **RF-06** | **CU-14** | RF-15 | CU-08 | RF-24 | CU-04 |
| RF-07 | CU-06 | RF-16 | CU-09 | RF-25 | CU-06 |
| RF-08 | CU-06 | RF-17 | CU-10 | RF-26 | CU-06 |
| RF-09 | CU-06 | RF-18 | CU-10 | — | — |

**Cada RF lo realiza exactamente un caso de uso.** Cuando una especificación cita un RF que no realiza, lo etiqueta como *cedido*, *relacionado* o *vecino* y dice a quién pertenece: `ECU-04` cede RF-22 y RF-23; `ECU-08` cita RF-14 (lo realiza CU-03); `ECU-07` cita RF-10 (el gate, que vive en CU-06).

## 6. Verificación

**Comprobado por script.** La skill **sí** trae validador ejecutable, `scripts/validate_use_case_spec.py`. Sobre las **14 especificaciones**: **0 errores y 0 advertencias**.

```bash
for f in ECU-0[1-9]*.md ECU-1[0-4]*.md; do python .../validate_use_case_spec.py "$f"; done
```

> **Alcance real de ese 0/0.** El validador tiene **tres clases de error**: campo mínimo ausente, identificador duplicado y referencia cruzada colgante. Todo lo demás —que el caso de uso sea un objetivo de actor, que la traza al dominio sea cierta, que una cita a otro documento exista— **queda fuera de su alcance** y depende del juicio del analista. Un 0/0 no es prueba de calidad por sí solo.
>
> **Este índice no se somete al validador.** Es un índice, no una especificación: no tiene actor primario, ni disparador, ni flujo básico, y el validador se los reclamaría. El script no admite exención —ni bandera, ni marcador, ni heurística de nombre—, así que la exclusión se hace no ejecutándolo y declarándola aquí. Convertir el índice en lo que no es sería peor que la advertencia que evita.

**Comprobado a mano, con comando.**
- **Cobertura de flujos: 76/76.** El 100 % de los flujos alternativos y de excepción de las 14 especificaciones tiene un criterio de aceptación asociado que cita su identificador. Es el criterio de convergencia de la skill y **el validador no lo comprueba**.
- **Cobertura de RF: 26/26**, sin huérfanos y sin ningún RF realizado por dos casos de uso.
- Cada especificación registra la correspondencia alias ↔ `CU-NN`.

**Auditoría independiente.** Cada documento pasó por un auditor que no lo escribió y por un escéptico encargado de refutar sus hallazgos. Sobre las cinco especificaciones de la tanda 1: 57 hallazgos, 13 refutados, 44 sostenidos, ninguno crítico superviviente. Sobre las nueve de las tandas 2 a 4: 32 sostenidos, 11 de ellos mayores. Todos los mayores se corrigieron antes de comitear.

> **Lo que la auditoría enseñó, y que gobierna este paquete.** El defecto más frecuente y más caro no fue estructural: fue **afirmar algo sin comprobarlo**. Se citó una declaración de alias inexistente en MV-01, una pantalla inexistente en DIS-00, un diagrama como «planificado» cuando estaba comiteado, y un requisito de privacidad que hablaba de otra cosa. Por eso cada especificación separa ahora **lo comprobado por script** de **lo comprobado a mano**, y declara el alcance de cada comprobación en vez de dar por buena la casilla marcada.

## 7. Qué queda abierto

| Asunto | Dónde | Fase |
|---|---|---|
| `DR-05`, `DR-07` y `DR-08` quedaron **desalineados** por estas reescrituras; faltan `DR-11…DR-14` | `docs/07_casos_uso/robustez/` | **D.4** |
| `PER-01` cita criterios y flujos de `ECU-04` que la renumeración rompió | `PER-01` §104, §170, §176 | D.5 |
| `DIS-00` afirma que reiniciar la caracterización es «reversible»: es **falso** | `DIS-00` §3 | D.5 |
| ~~`MV-01` §7.3 y `RF-25` aún dicen 1.500 caracteres por mensaje~~ **— ya no: los dos dicen 2.500.** Comprobado contra la fuente en `SD-48`: `REQ-01 RF-25` dice **2.500** y en `MV-01` el 1.500 solo sobrevive en un **bloque de cambio histórico** (`MV-01:66`), que es correcto que lo conserve. El pendiente estaba **resuelto en los documentos y abierto solo en el registro** | — | **Cerrado (`SD-48`)** |
| `MV-01` §13.2 llama «vista derivada, no clase» a `EventoOperativo`; `MD-01 v1.4` y `PER-01` lo tratan como entidad | `MV-01` §13.2 | D.5 |
| `PER-H4`: campos de `ContadorDeUsoDiario` | `PER-01` | abierta |
| La matriz clase ↔ caso de uso y la tabla de visibilidad RF → CU | `TRZ-01` | D.5 |

## 8. Siguiente paso ICONIX
**Análisis de robustez** `DR-01…DR-14`, uno por caso de uso, reusando los objetos de frontera, control y entidad que cada flujo ya nombra. Después, diagramas de secuencia `DS-XX` y casos de prueba `CP-XX`.

**Historial de cambios**

| Versión | Fecha | Autor | Cambio |
|---|---|---|---|
| v2.1 | 2026-08-05 | J. Sánchez | **`SD-48`: §7 declaraba una afirmación falsa.** Decía que «`MV-01` §7.3 y `RF-25` aún dicen 1.500 caracteres por mensaje», y **ninguno de los dos lo dice**: `REQ-01 RF-25` dice **2.500**, y en `MV-01` el 1.500 solo sobrevive en un bloque de cambio histórico (`MV-01:66`), que es correcto que lo conserve. Era el **pendiente 1 de `HECHOS_CANONICOS`**: estaba **resuelto en los documentos y abierto solo en el registro**, y esta era la línea que lo mantenía vivo. Se tacha y se corrige; no se borra (`SD-31`). **Este artefacto no tenía historial**: entra aquí, porque la disciplina de ficha lo exige y el bloque 6 de `verificar_coherencia.py` lo comprueba. |

**Fin de ECU-00.**
