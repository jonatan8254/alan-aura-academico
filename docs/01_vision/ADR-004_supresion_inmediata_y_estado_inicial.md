# ADR-004 — La supresión de cuenta es **inmediata**, y el *kill switch* arranca **habilitado**

**ID:** ADR-004 · **Hogar:** `docs/01_vision/` · **Fecha:** 2026-08-04 · **Estado:** aceptada (con verificaciones pendientes).
**Insumos:** `PER-H2` (abierto desde SD-25), `RA-01` de `ECU-04`, `RA-03` de `ECU-11`, `PRE-03` de `ECU-10`, `00_PLAN_CODEX_ORIGINAL §4.14`, `REQ-01` (`RF-24`, `RF-17`), `PRIV-01` (`PRIV-R11`), `ADR-003`, decisión del líder del proyecto (SD-35).
**Consumidores:** `PER-01` (§2, §3.4, `PER-H2`), `REQ-01` (`RF-24`), `ECU-04` (`RA-01`), `ECU-10` (`PRE-03`), `ECU-11` (`RA-03`), `TRZ-01`, `ARQ-01` (futuro), fase de construcción.
**Naturaleza:** registro de decisión de arquitectura. **Cierra:** `PER-H2` y `PRE-03` de `ECU-10`. **Completa:** `ADR-003`, que cerró la otra mitad del problema de `RF-24`.
**Regla de honestidad (§4.9):** `D1` **es una interpretación de la fuente primaria**, no una lectura evidente, y va marcada **`[I2]`** en cuerpo y consecuencias. Se dice aquí, arriba, para que nadie la cite como `[E1]`.

## Escala de verificación

| Marca | Significado |
|---|---|
| **[E1]** | Evidencia directa, verificable en los artefactos citados. |
| **[I2]** | **Interpretación del orquestador** sobre una fuente ambigua. Defendible, con su argumento escrito, pero **no** es lo que la fuente dice literalmente. |
| **[N6]** | Hecho externo volátil: además de verificar, monitorear. |

---

## §0 — Por qué existe esta ADR

`RF-24` —«eliminada la cuenta, no queda dato asociado recuperable»— llevaba siendo **el único requisito
declarado como incumplido** desde `SD-29`. Tenía dos excepciones:

- **`PER-H5`** — el respaldo escapaba a la cascada. **Cerrado** en `ADR-003` (SD-33).
- **`PER-H2`** — la ventana de «+30 días» del plan §4.14. **Es lo que cierra esta ADR.**

Y de paso se cierra `PRE-03` de `ECU-10`, un hueco que llevaba abierto desde antes y que `ADR-003`
volvió urgente: sin respaldo, un almacén perdido arranca en un estado que nadie había decidido.

---

## ADR-004-D1 — La supresión de cuenta es **física e inmediata** `[I2]`

### El texto que originó el hallazgo

`00_PLAN_CODEX_ORIGINAL §4.14`, tabla de retención, fila «Cuenta y rol»:

> **«Hasta eliminación o cierre + 30 días»**

`PER-01` lo registró como **`PER-H2`** porque parecía contradecir `RF-24`: si tras eliminar se
retienen 30 días, entonces sí queda dato recuperable. `ECU-04` lo replicó en `RA-01` y `ECU-11` en
`RA-03`.

### El hallazgo es de lectura, no de diseño

Esa frase **es sintácticamente ambigua** y admite dos análisis: `[E1]`

| | Lectura | Consecuencia |
|---|---|---|
| **(a)** | hasta *(eliminación o cierre)* **+ 30 días** | Se retiene 30 días **después** de eliminar → contradice `RF-24` |
| **(b)** | hasta *eliminación*, **o** *(cierre + 30 días)* | Eliminar es inmediato; los 30 días son del **cierre** → sin contradicción |

**Todo `PER-H2` asume la lectura (a) sin decir que la asume.** Y hay tres razones para preferir (b):

1. **El MVP no tiene «cierre de cuenta».** Verificado sobre los **26 RF** de `REQ-01`: hay registrar
   (`RF-20`), iniciar y cerrar **sesión** (`RF-21` — sesión, no cuenta), reiniciar la caracterización
   (`RF-22`), revocar la personalización (`RF-23`) y **eliminar la cuenta** (`RF-24`). **No hay
   cierre, ni desactivación, ni baja temporal**, y `VIS-01 §5` excluye expresamente la suspensión
   individual. Bajo la lectura (b), la ventana de 30 días se refiere a un escenario **que este
   sistema no implementa**: queda vacía. `[E1]`
2. **La lectura (a) pone al plan en contradicción consigo mismo.** El mismo plan que fija esa
   retención es el que exige el borrado en cascada sin remanentes. Entre dos análisis de una fuente,
   **gana el que la deja internamente consistente**. `[I2]`
3. **El «+30 días» aparece tres veces más en el plan, y ninguna es la cuenta:** contador diario
   («máximo 30 días»), evento técnico («30 días») y acción administrativa («curso + 30 días»). Son
   **ventanas de purga de telemetría y auditoría**, no de dato de titular. `[E1]`

### La decisión

- **Decisión:** al eliminar la cuenta, la supresión de `User`, `ConsentRecord`,
  `InitialConversationProfile` y `DailyUsageCounter` es **física e inmediata**. **No hay ventana de
  gracia, no hay marca de baja, no hay borrado lógico.** `[I2]`
- **Qué NO alcanza, y ya estaba decidido:** `OperationalEvent` sobrevive por diseño y **debe ser
  irreidentificable** (`CA-11` de `ECU-04`, `PER-T2`, `RE-06`); `AdministrativeAction` es auditoría
  sin identidad de usuario. Ninguno es «dato asociado» en el sentido de `RF-24`, porque **por
  construcción no puede asociarse a nadie**. `[E1]`
- **Alcance idéntico para la cápsula:** `RA-03` de `ECU-11` preguntaba si el borrado de la
  `CapsulaDePerfil` tenía ventana de respaldo. **No la tiene**, por la misma razón y además porque
  `ADR-003` quitó los respaldos.
- **Condición de reversa:** si alguna vez se añade **cierre o desactivación de cuenta** como función
  —hoy fuera de alcance—, esta decisión debe releerse: entonces la lectura (b) sí tendría un
  escenario real al que aplicarse y habría que decidir su ventana.

### Por qué se puede decidir ahora, y sin `V6-b`

**No es diseño físico.** «La supresión es inmediata y sin marca de baja» dice **qué hace el
sistema**, no claves ni índices — el mismo test que dejó pasar `ADR-003` antes de `ARQ-01`. Lo que
`ARQ-01` hereda es el **mecanismo**, no la decisión. `[E1]`

**Y no necesita la validación legal `V6-b`.** El borrado inmediato es la opción **más conservadora**
bajo la Ley 1581: satisface el derecho de supresión con más holgura, no con menos. `V6-b` haría
falta para justificar **conservar** datos, no para borrarlos antes. Cerrar esto **reduce** la
superficie de `V6-b`; no la sustituye. `[I2]`

---

## ADR-004-D2 — El *kill switch* arranca **habilitado**

- **Contexto:** `PRE-03` de `ECU-10` decía, literal, que *«ningún artefacto declara todavía cuál es
  el valor inicial de un entorno recién aprovisionado»*. Era un hueco latente. `ADR-003` lo volvió
  activo: sin respaldo, un almacén perdido arranca en un estado que nadie decidió. `[E1]`
- **Decisión:** un entorno recién aprovisionado, o uno que pierda su `PlatformSetting`, arranca con
  el chatbot **habilitado**. `[E1]`
- **Motivo, dicho como es:** **conveniencia de la demostración académica**. El entorno funciona sin
  que nadie toque el panel de administración.
- **Contrapunto declarado, porque el CDR lo va a preguntar:** esto **no es *fail-closed***. El *kill
  switch* es el mecanismo que **detiene** el chatbot, y arrancar habilitado significa que un almacén
  perdido **devuelve el chatbot activo sin decisión humana** —incluso si un administrador lo había
  apagado a propósito—. Se elige igualmente porque no hay usuarios reales ni piloto, y porque el
  *gate* de seguridad y el *fallback* **no dependen de este estado**: siguen operando en cada mensaje
  (`SEG-R1`, `RNF-06`).
- **Condición de reversa, y no es de calendario:** **en cuanto haya personas reales**, esto pasa a
  `deshabilitado`. La conveniencia de demo deja de ser una razón cuando hay alguien al otro lado.

---

## §1 — Frontera de esta ADR

Decide **qué hace el sistema**. **No** decide cómo. Quedan en `ARQ-01`: el mecanismo de supresión
física sobre el motor de persistencia, el aprovisionamiento del estado inicial, y las políticas de
purga de `OperationalEvent` y `AdministrativeAction`, cuyas ventanas de 30 días **no cambian**.

---

## §2 — Efecto sobre `RF-24`

Con `PER-H5` cerrado en `ADR-003` y `PER-H2` cerrado aquí:

| Excepción | Estado |
|---|---|
| `PER-H5` — el respaldo escapaba a la cascada | ✅ cerrada en `ADR-003` |
| `PER-H2` — la ventana de «+30 días» | ✅ **cerrada aquí** |

**`RF-24` pasa a cumplirse**, y deja de ser el único requisito declarado como incumplido del
proyecto. La cadena completa: sin respaldo (`ADR-003`), supresión física e inmediata (`D1`), y la
telemetría que sobrevive es irreidentificable por construcción (`CA-11`, `PER-T2`).

**Lo que esto NO significa, y conviene decirlo.** `RF-24` se cumple **según el diseño**. No está
probado: `CP-801…813` cubren la cascada, pero la **inmediatez** solo se puede verificar contra una
implementación que aún no existe. Se cumple en el papel, que es lo único que un artefacto de diseño
puede sostener.

---

## §3 — Consecuencias

- **`ARQ-01` hereda una restricción, no una pregunta:** supresión física, **sin `deletedAt` ni
  ningún borrado lógico** en el esquema. `PER-H2` dejaba abierto precisamente si el esquema
  necesitaba marca de baja; la respuesta es **no**.
- **Se pierde el «deshacer».** Un usuario que elimina su cuenta por error no tiene recuperación.
  Es coherente con `RF-24`, que promete exactamente eso, y con `ECU-04`, que ya exige **confirmación
  explícita** y advertencia de irreversibilidad antes de suprimir.
- **Tres hallazgos se cierran a la vez:** `PER-H2`, `RA-01` de `ECU-04` y `RA-03` de `ECU-11` eran
  **la misma pregunta** registrada en tres sitios.
- **`V6-b` sigue abierta** y no se toca. Es nivel 6: la resuelve una persona con criterio jurídico.

## §4 — Verificaciones pendientes

| # | Qué verificar | Marca | Cuándo |
|---|---|---|---|
| 1 | Que el motor de persistencia **no conserve** el ítem tras el borrado por algún mecanismo propio (papelera, retención interna) | **[N6]** | `ARQ-01`, con `V6-a` |
| 2 | Que el estado inicial del *kill switch* sea efectivamente `habilitado` en un entorno recién aprovisionado | **[E1]** | Despliegue |
| 3 | **Si aparece cierre o desactivación de cuenta**, releer `D1` antes de implementarlo | **[E1]** | Continuo |
| 4 | Que `V6-b` confirme que el borrado inmediato basta bajo la Ley 1581 | **[N6]** | Revisión legal |

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-08-04 | J. Sánchez | Creación (SD-35). `D1` cierra `PER-H2` resolviendo la ambigüedad sintáctica de `plan §4.14` a favor de la lectura que deja la fuente internamente consistente, con el hecho verificable de que **el MVP no tiene cierre de cuenta** como fundamento. Marcada `[I2]`: es interpretación, no evidencia. `D2` cierra `PRE-03` de `ECU-10` fijando el estado inicial del *kill switch* en `habilitado`, con su contrapunto de no ser *fail-closed* declarado y su condición de reversa. **`RF-24` pasa a cumplirse**; `V6-b` sigue abierta. |
