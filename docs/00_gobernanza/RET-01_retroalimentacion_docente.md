# RET-01 — Retroalimentación docente y evidencia de su atención
**ID:** RET-01 · **Familia:** RET (gobernanza) · **Hogar:** `docs/00_gobernanza/` · **Fecha:** 2026-07-31 · **Versión:** v1.0 · **Estado:** Cerrado.
**Propósito:** registrar **literalmente** la retroalimentación recibida del profesor sobre la fase 2 y dejar, por cada punto, la evidencia comprobable de cómo se atendió.
**Consumidores:** revisión docente, `PDR-01`, informe académico.

---

## 1. La retroalimentación, tal como se recibió

> Deben revisar el modelo del dominio ya que hay varios aspectos que deben mejorarse:
>
> 1. Los objetos usuario y administrador deben tener relación, ya que, el administrador es un tipo de usuario.
> 2. Los actores que aparecen en el diagrama deberían estar representados en un objeto del dominio: Visitante y usuario adulto.
> 3. Los requisitos funcionales especificados no se ven reflejados en su totalidad en el diagrama de casos de uso presentado.
> 4. Realizar verificación de los objetos del dominio, deben verse reflejados en los casos de uso.

Se atendió en una pasada completa de correcciones, **PDR-01**, cuyo registro está en [`PDR-01_primera_pasada_correcciones.md`](PDR-01_primera_pasada_correcciones.md).

---

## 2. Punto 1 — «Usuario y administrador deben tener relación»

**Qué se hizo.** Se introdujo el supertipo **`TitularDeCuenta`** en `MD-01`, con `Usuario` y `Administrador` como especializaciones:

```plantuml
TitularDeCuenta <|-- Usuario
TitularDeCuenta <|-- Administrador
```

Y, en el diagrama de casos de uso, el **rol general `Titular de cuenta`** del que cuelga «Iniciar y cerrar sesión», que es lo único que ambos comparten.

**Por qué un supertipo y no una herencia directa.** La lectura literal de «el administrador es un tipo de usuario» sería `Usuario <|-- Administrador`. **Se descartó**, y el motivo importa: en este dominio `Usuario` no es «persona con cuenta», sino la persona adulta que **consiente, tiene cápsula de perfil y conversa**. Un administrador no hace nada de eso —el canon se lo prohíbe expresamente: no accede al contenido conversacional— así que la herencia **no pasa el test de sustitución**: no todo `Administrador` es sustituible por un `Usuario`.

La solución conserva la intención del profesor —hacer visible la relación— sin romper el canon de privacidad: lo compartido se sube a `TitularDeCuenta` (identidad y acceso) y lo específico se queda abajo.

> Una primera versión modeló el supertipo como `Cuenta`. La auditoría independiente la marcó como **defecto crítico**: un `Usuario` *tiene* una cuenta, no *es* una cuenta. Se renombró a `TitularDeCuenta`, que sí es un rol y sí pasa el test.

**Evidencia:** `MD-01_modelo_dominio.puml` (16 clases, 4 generalizaciones) · `MD-01_modelo_dominio.md` §3.1 · `DCU-01_casos_uso.md` §1 · commits `eaff4ec`, `174f5f9`, `34b529c`.

---

## 3. Punto 2 — «Visitante y usuario adulto deben estar en el dominio»

**Qué se hizo.** `Visitante` **pasó a ser clase** de `MD-01`, con su relación hacia `TitularDeCuenta`. `Usuario` ya existía como clase.

**Qué hubo que revertir para hacerlo, y se declara.** `MV-01` §3 y §14 clasificaban expresamente a `Visitante` como «actor **sin** clase de dominio», con el criterio «sin datos ni relaciones de dominio». La retroalimentación pide lo contrario. **Se revierte esa decisión y queda declarado como reversión**, no disimulado: `MD-01` §3.2 lo dice por escrito.

**Evidencia comprobable de que no es decorativo:** `Visitante` participa hoy en **tres casos de uso** (CU-01, CU-02 y CU-04, como destino tras eliminar la cuenta) y aparece como objeto tipo Entidad en **tres diagramas de robustez** (DR-01, DR-02, DR-04).

**Evidencia:** `MD-01_modelo_dominio.md` §3.2 · `TRZ-01_trazabilidad.md` §5.1 · commits `174f5f9`, `34b529c`, `6463241`.

---

## 4. Punto 3 — «Los RF no se ven reflejados en su totalidad»

**El punto era correcto, y se midió.** Antes de la corrección: **13 de los 26 RF (50 %) no tenían ninguna manifestación gráfica**, y tres casos de uso absorbían diecisiete.

**Qué se hizo.** El diagrama pasó de **10 a 14 casos de uso**:

| Cambio | De | A |
|---|---|---|
| «Gestionar cuenta y datos personales» fusionaba tres objetivos | CU-04 | **CU-04** «Eliminar cuenta» · **CU-11** «Reiniciar la caracterización» · **CU-12** «Revocar la personalización» |
| El cambio de personaje estaba sepultado como flujo alternativo | dentro de CU-06 | **CU-13** «Cambiar de acompañante», `<<extend>>` |
| La elección de personaje era un paso del onboarding | pasos 8-9 de CU-05 | **CU-14** «Elegir acompañante», `<<include>>` |
| Dos nombres omitían parte de su requisito | «Iniciar sesión» · «…caracterizar el perfil» | «Iniciar **y cerrar** sesión» (RF-21 nombra el cierre) · «…**crear la cápsula de perfil**» |

**Resultado medido: los 26 RF tienen caso de uso propio y único.** Ninguno huérfano, ninguno realizado por dos casos de uso. Cuando una especificación cita un RF que no realiza, lo etiqueta como *cedido*, *relacionado* o *vecino* y dice a quién pertenece.

**Qué NO se añadió, y por qué.** No todo requisito debe ser un caso de uso, y forzarlo sería el error contrario:

- **RF-10** (el gate de seguridad) **no** es caso de uso: es una validación interna, que la metodología excluye. Se hizo visible como **condición etiquetada** del `<<extend>>` hacia «Derivar ante peligro».
- **RF-26** (indisponibilidad, *timeout*, cuota) **no** se añadió como `<<extend>>`: es manejo de errores de bajo nivel, que pertenece a los flujos de excepción del texto. Vive en `ECU-06`, con nueve flujos de excepción.

**Evidencia:** `DCU-01_casos_uso.puml` v2.1 · `DCU-01_casos_uso.md` §2, §3 y §4 · `TRZ-01_trazabilidad.md` **§5.2** (tabla RF → caso de uso) · `ECU-00` §5 · commits `655438c`, `e01f40d`, `94c0670`, `8e6d56e`.

---

## 5. Punto 4 — «Verificar que los objetos del dominio se vean reflejados en los casos de uso»

Es el punto que exigía **una verificación**, no una afirmación. Se publica como matriz comprobable en **`TRZ-01` §5.1**, con tres columnas: clase, casos de uso que la manipulan, y **diagramas de robustez donde aparece como objeto tipo Entidad** — que es la evidencia más fuerte, porque allí cada clase tiene un arco a un controlador concreto.

**Resultado: las 16 clases de `MD-01 v1.4` aparecen en al menos un caso de uso y en al menos un diagrama de robustez. Cero clases sin usar.**

**Cómo se verificó, y qué pasó al verificarlo.** La matriz se escribió a mano y después se **comprobó contra los `.puml` con un script**. **Cuatro de las dieciséis filas discrepaban**: en tres se había quedado corta y una afirmaba de más. Esa cuarta destapó un defecto real —`DR-06` omitía `EventoDeSeguridad` pese a que `ECU-06` lo nombra en su paso 3—, que se corrigió. La matriz se regeneró desde los `.puml` y se volvió a verificar: **0 discrepancias**.

> Ese episodio es la respuesta más honesta al punto 4: la verificación solo vale si puede fallar, y esta falló antes de pasar.

**Las clases que el punto 4 destapó.** `Alan` y `Aura` eran, antes de esta pasada, las **únicas clases del dominio sin ninguna manifestación en el diagrama de casos de uso**. Extraer **CU-14 «Elegir acompañante (Alan o Aura)»** fue precisamente lo que las trajo, y es la razón por la que ese `<<include>>` supera su compuerta pese a que solo lo usa un caso de uso base.

**Evidencia:** `TRZ-01_trazabilidad.md` §5.1 · los 14 `.puml` de `docs/07_casos_uso/robustez/` · commit `35f7549`.

---

## 6. Lo que la corrección arrastró

La retroalimentación tocaba dos artefactos, pero **cambiar el diagrama invalidó todo lo que colgaba de él**. El alcance real fue:

| Artefacto | Estado antes | Estado después |
|---|---|---|
| `MD-01` | v1.2, 12 clases | **v1.4**, 16 clases, 17 relaciones |
| `DCU-01` | v1.0, 10 casos de uso | **v2.1**, 14 casos de uso, 5 actores |
| Especificaciones | 10 + índice, 18 errores de validador | **14 + índice, 0 errores y 0 advertencias** |
| Robustez | 10 diagramas, derivados de un texto que dejó de existir | **14 diagramas**, 0 errores, 260 elementos |
| Corpus aguas arriba | MV-01, REQ-01, TRZ-01, PER-01, PRIV-01, DIS-00 | propagado y verificado |

**Verificación de cierre, reproducible:** los cuatro validadores en **0 errores** (`MD-01`, `DCU-01`, las 14 especificaciones, los 14 diagramas de robustez), **76/76 flujos** con criterio de aceptación asociado, **26/26 RF** con caso de uso propio, **16/16 clases** manifestadas, y **cero enlaces rotos** en `docs/`.

## 7. Qué queda abierto, dicho sin adornos

- **`PER-H4`**: los campos de `ContadorDeUsoDiario` siguen sin decidir.
- **`AccionAdministrativa`** permanece fuera de `MD-01` por decisión declarada: es auditoría de operación, no concepto del problema. Aparece marcada en `DR-10` para que la decisión siga siendo discutible.
- **Diagramas de secuencia** (`DS-01…DS-14`) y **casos de prueba** (`CP-01…CP-14`): planificados, no producidos. Con 148 controladores en robustez, esa es la cota inferior de casos de prueba.
- La **frontera jurídica** (Ley 1581) sigue **sin validar**, y así se declara en `PRIV-01`: el diseño se *alinea* con sus principios, no se afirma cumplimiento.

**Fin de RET-01.**
