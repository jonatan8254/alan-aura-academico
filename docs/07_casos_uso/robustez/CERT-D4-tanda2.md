# Certificado de auditoría — D.4 tanda 2 · DR-02, DR-03, DR-04, DR-11

**Fase:** PDR-01 · D.4 · tanda 2 «la cuenta» · **Fecha:** 2026-07-31
**Skill:** `uml-robustness-diagram` · **Insumos:** ECU-02/03/04/11 v2.0 en 0/0, MD-01 v1.4, DCU-01 v2.1, DIS-00, PRIV-01, PER-01
**Pasadas ejecutadas:** 2 de 5 · **Estado: convergido con una excepción declarada**

---

## 1. Alcance

| Diagrama | Caso de uso | Qué se hizo | Elementos |
|---|---|---|---|
| **DR-02** | CU-02 Registrar cuenta | Actualizado: `Visitante` y `TitularDeCuenta` como entidades, desenlaces, D-04 | 13 |
| **DR-03** | CU-03 Iniciar y **cerrar** sesión | Rehecho: un solo actor, el cierre entra al flujo básico, D-03 | 23 |
| **DR-04** | CU-04 **Eliminar cuenta** | Estrechado a un objetivo; archivo renombrado | 21 |
| **DR-11** | CU-11 Reiniciar la caracterización | **Nuevo** | 17 |

## 2. Las siete capas

| # | Capa | Resultado |
|---|---|---|
| 1 | Sintaxis y reglas duras | ✅ **0 errores en los cuatro** |
| 2 | Correspondencia texto ↔ diagrama ↔ interfaz | ✅ Cobertura de flujos completa en los cuatro. Pantallas contrastadas contra DIS-00: P-02 y P-03 en DR-02; P-03, P-04, P-05, P-10 y P-14 en DR-03; P-13 y P-01 en DR-04; P-13 y P-08 en DR-11 |
| 3 | Guías de método | ✅ Se retiró el «Diálogo de confirmación» como objeto tipo Borde propio en DR-04: DIS-00 lo inventaría como **estado** de P-13, y un diálogo dentro de una pantalla está por debajo del nivel de granularidad, igual que un botón |
| 4 | Anti-patrones | ⚠️ Una excepción declarada (§3) |
| 5 | Trazabilidad | ✅ **Object discovery vacío en los cuatro** |
| 6 | Calidad del ítem de información | ✅ Cada diagrama documenta sus decisiones no obvias |
| 7 | Conformidad entrada ↔ salida | ✅ Lo que salió de DR-04 está en DR-11 y en DR-12; nada se perdió |

## 3. Excepción declarada

**E-1 · `C_EliminarEnCascada` en DR-04 concentra 8 conexiones (umbral 6).**
La skill pregunta si el controlador «está absorbiendo comportamiento que corresponde a otros». Aquí **no**: **cuatro de las ocho son las entidades de la cascada** —`Usuario`, `CapsulaDePerfil`, `Consentimiento`, `ContadorDeUsoDiario`—, y suprimirlas juntas *es* la definición del controlador y un solo paso del texto. Las otras cuatro son su entrada, su salida, el cierre de conversación de `FA-02` y el deshacer de `FE-04`. Partirlo rompería la atomicidad, que es precisamente la invariante del caso de uso.

> El contraste con la tanda 1 es deliberado: allí un controlador con 8 conexiones **sí** estaba absorbiendo comportamiento ajeno y se distribuyó. La misma advertencia tiene veredictos opuestos según lo que haya detrás, que es exactamente por qué la skill la clasifica como advertencia y no como error.

## 4. Correcciones aplicadas

**DR-04 — el paso 1 dejó de ser un menú.** La v1.0 empezaba con «mostrar las opciones: reiniciar, revocar, eliminar». Con los otros dos objetivos fuera, eso sería navegación de interfaz, no un paso de caso de uso. El flujo empieza ahora por la intención real del actor.

**DR-04 — se resolvió el hallazgo D-05.** La v1.0 asignaba «Página de gestión de cuenta» como interfaz de los pasos 3 y 4, pero en el paso 4 la cuenta ya fue suprimida y la sesión cerrada, y esa pantalla exige sesión activa. El paso 4 termina ahora en **P-01**, la presentación pública, que es donde queda alguien sin cuenta.

**DR-03 — se resolvió el hallazgo D-03.** La v1.0 tenía un único controlador «Dirigir al área correspondiente» que se ramificaba sin declarar según qué. Ahora hay un controlador que **comprueba** el onboarding contra `Consentimiento` y `CapsulaDePerfil`, y la rama es visible en el diagrama.

**DR-03 — un actor, no dos.** La v1.0 dibujaba `Usuario adulto` y `Administrador de plataforma` como actores separados, duplicando la asociación que la generalización de DCU-01 v2.1 vino a eliminar. Ambos siguen presentes como **entidades**, que es lo que son en MD-01 v1.4.

**DR-11 — la advertencia es un controlador, no un mensaje.** Materializa el requisito de confirmación que la v1.1 de ECU-04 exigía **solo** para eliminar la cuenta, dejando este borrado —igual de irreversible— sin ninguno. Era el hallazgo **D-02**.

**DR-02 — se declaró el hueco de D-04 en vez de taparlo.** El estado de éxito del registro **no está declarado en DIS-00 §2**. El arco lo dice literalmente y remite al riesgo de la especificación, en lugar de inventar una pantalla.

## 5. Object discovery

**Delta vacío.** `Visitante`, `TitularDeCuenta` y `ContadorDeUsoDiario` —que estos diagramas ahora usan como entidades— son clases de MD-01 v1.4 desde la tanda 0. `ContadorDeUsoDiario` perdió su `#PaleGreen` de «clase del delta pendiente», igual que `EventoOperativo` en la tanda 1.

## 6. Informe de desambiguación

**Sin hallazgos.** Las cuatro especificaciones se rehicieron y auditaron en la fase D.3.

## 7. Renombrados

Dos archivos cuyo nombre contradecía su contenido, movidos con `git mv` para conservar el historial:

- `DR-04_robustez_gestionar_cuenta` → `DR-04_robustez_eliminar_cuenta`
- `DR-03_robustez_iniciar_sesion` → `DR-03_robustez_iniciar_y_cerrar_sesion`

## 8. Lo que queda fuera de este certificado

Los SVG y `DR-00` se hacen al cierre de la fase D.4, junto con la tanda 3 (DR-01, DR-07, DR-08, DR-09, DR-10).

**Fin del certificado.**
