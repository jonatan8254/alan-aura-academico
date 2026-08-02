# CP-09 — Casos de prueba de CU-09 «Consultar métricas de uso»

**ID:** CP-09 · **Familia:** CP · **Hogar:** `docs/07_casos_uso/secuencia/pruebas/` · **Fecha:** 2026-08-01 · **Versión:** v1.1 · **Estado:** Propuesto.
**Insumos:** `DR-09 v2.1` (8 controladores), `DS-09 v1.1`, `ECU-09 v2.1` (`CA-01…CA-09`), `PRIV-01` (`PRIV-R10`), `MV-01` `RN-03.3`/`RN-03.5`, `REQ-01` (`RC-07`, `MET-07`).
**Generado con:** skill `uml-sequence-diagram`. Borrador por subagente, **auditado por el orquestador**.

Numeración global: `CU-09` ocupa **`CP-1001`…`CP-1008`**.

---

| CP | Controlador origen | Camino cubierto | Precondición | Estímulo | Resultado esperado | Trazab. |
|---|---|---|---|---|---|---|
| CP-1001 | `C_VerificarSesionYRol` | Básico p.1 · **FE-01/FE-02 no tomados** | Administrador con sesión vigente y rol validado en servidor. | Abre P-15. | Continúa hacia el cálculo de agregados sin mostrar 401 ni 403. | — |
| CP-1002 | `C_DenegarPorSesionAusente` | **FE-01** | Sin sesión vigente. | Solicita P-15. | HTTP 401; **no presenta ninguna cifra** ni deja ver el panel. | CA-04 |
| CP-1003 | `C_DenegarPorRol` | **FE-02** | Sesión vigente, rol validado distinto de administrador. | Solicita P-15, **aunque el cliente altere su rol declarado**. | HTTP 403; **no presenta ninguna cifra**. | CA-05 |
| CP-1004 | `C_CalcularAgregados` | Básico p.1 · **FA-01 no tomado** | La ventana de siete días tiene `EventoOperativo` registrados; hay conversaciones **ya cerradas y descartadas**. | El sistema calcula. | Presenta las cuatro cifras del **grupo único «plataforma completa»**. Las «llamadas al chat de los últimos 7 días» **coinciden con el número de `EventoOperativo` de la ventana**, y siguen siendo correctas **aunque ninguna `Conversacion` exista ya** — que es lo que la fuente anterior no podía garantizar. | CA-01 |
| CP-1005 | `C_CalcularTasaTecnica` | Básico p.1 | Existen `EventoOperativo` en la ventana. | El sistema calcula la tasa técnica. | La cifra equivale a (peticiones OK + *fallback*) / total, sobre eventos **sin contenido**; comparable contra el umbral **≥ 95 %** de `RC-07` (`MET-07`). | CA-09 |
| CP-1006 | `C_MostrarVentanaSinActividad` | **FA-01** | **Ningún** `EventoOperativo` dentro de la ventana. | Abre P-15. | Las cifras dependientes se muestran **en cero**, declaradas como ausencia de actividad; **no aparece ningún mensaje de error**. | CA-02 |
| CP-1007 | `C_RestringirACifrasAgregadas` | Básico p.2-3 (cierre) | Agregados ya calculados. | El Administrador revisa las cifras. | Las cuatro cifras corresponden **solo al grupo «plataforma completa»**, sin control de segmentación, filtro ni rango; una inspección del origen **no encuentra** alias, username, identificador de usuario ni `ContadorDeUsoDiario`; **comparar el almacenamiento antes y después no muestra ninguna escritura**. | CA-01 · CA-06 · CA-07 · CA-08 |
| CP-1008 | `C_SenalarChatbotDeshabilitado` | **FA-02** | El *kill switch* está activo al abrir P-15. | Abre la vista de métricas. | Las cuatro cifras se presentan **con normalidad** junto con la señal de chatbot deshabilitado; **la indisponibilidad del chatbot no bloquea la vista administrativa**. | CA-03 |

*(Trazabilidad completa: `CU-09 → DR-09 → DS-09 → CP-10NN`.)*

## Cobertura

**8/8 controladores.** Básico ✓ · `FA-01` tomado (1006) y no tomado (1004) · `FA-02` (1008) ·
`FE-01` (1002) · `FE-02` (1003).

## Los dos casos que sostienen el canon de administración

**`CP-1007` prueba que no existe descenso al individuo.** No basta con que la pantalla muestre
agregados: hay que verificar que **no hay control de segmentación, filtro ni rango**, y que el
origen de las cifras **no contiene** identificadores. Si algún día apareciera un filtro «por
usuario», este caso fallaría antes de que nadie lo usara.

**`CP-1006` fija que los ceros son una cifra válida, no un error.** Una ventana sin actividad se
**muestra**; no se oculta ni se sustituye por un aviso de fallo. Es una decisión de diseño
—declarada en `DS-09`— que sin este caso se perdería en la implementación.

**`CP-1008` separa dos cosas que se confunden:** el *kill switch* deshabilita **la conversación**,
no el panel administrativo. El Administrador debe poder ver las métricas precisamente **cuando** el
chatbot está caído.

---

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.1 | 2026-08-01 | J. Sánchez | **SD-30, hallazgo `H-1b`.** `CP-1004` cambia de fuente: las «llamadas al chat de los últimos 7 días» se cuentan desde `EventoOperativo`, no desde `Conversacion`. La precondición añade conversaciones **ya descartadas** y el resultado esperado exige que la cifra siga siendo correcta sin ellas — precisamente lo que la fuente anterior no podía dar, porque la `Conversacion` no se persiste. Ocho casos, sin cambio de número. |
| v1.0 | 2026-08-01 | J. Sánchez | Creación. 8 casos desde los 8 controladores de `DR-09`, con `CP-1007` verificando la ausencia de segmentación y de escrituras. |
