# Certificado de auditoría — D.4 tanda 1 · DR-05, DR-06, DR-12, DR-13, DR-14

**Fase:** PDR-01 · D.4 · tanda 1 «consentimiento y acompañante» · **Fecha:** 2026-07-31
**Skill:** `uml-robustness-diagram` (contrato actualizado) · **Insumos:** ECU v2.0 en 0/0, MD-01 v1.4, DCU-01 v2.1, DIS-00, MV-01, PRIV-01
**Pasadas ejecutadas:** 2 de 5 · **Estado: convergido con excepciones declaradas**

---

## 1. Alcance

| Diagrama | Caso de uso | Qué se hizo | Elementos |
|---|---|---|---|
| **DR-05** | CU-05 Otorgar consentimiento y crear la cápsula | Rehecho: 9 → 8 pasos, capas del consentimiento, `<<include>>` a CU-14 | 25 |
| **DR-06** | CU-06 Conversar con el acompañante | Rehecho: sale el cambio de personaje, +`FE-09`, 2.500 caracteres | 39 |
| **DR-12** | CU-12 Revocar la personalización | **Nuevo** | 16 |
| **DR-13** | CU-13 Cambiar de acompañante | **Nuevo** | 15 |
| **DR-14** | CU-14 Elegir acompañante | **Nuevo** | 13 |

## 2. Las siete capas

| # | Capa | Resultado |
|---|---|---|
| 1 | Sintaxis y reglas duras | ✅ `validate_robustness_puml.py --domain MD-01`: **0 errores en los cinco**. Ninguna conexión prohibida, ningún alias con prefijo cruzado, todos los controllers presentes |
| 2 | Correspondencia texto ↔ diagrama ↔ interfaz | ✅ La comprobación automática de cobertura (el texto del caso de uso va como `note`) **no reporta ningún flujo declarado y ausente** en los cinco. Pantallas contrastadas contra DIS-00: P-05…P-08 en DR-05, P-09 en DR-14, P-10 en DR-06 y DR-13, P-13 en DR-12 |
| 3 | Guías de método | ✅ Un boundary por pantalla con su nombre real; controllers en infinitivo; sin widgets ni tecnología; color solo en objetos exclusivos de flujos alternativos o de excepción; arcos sin dirección |
| 4 | Anti-patrones | ⚠️ Dos excepciones declaradas (§3). Ningún otro |
| 5 | Trazabilidad | ✅ Toda entity ∈ MD-01 v1.4: **object discovery vacío en los cinco**. Actores ∈ DCU-01 v2.1. Cada elemento rastrea a una frase del texto |
| 6 | Calidad del ítem de información | ✅ Cada diagrama lleva su nota con flujos, postcondiciones, reglas, traza y notas de modelado que justifican las decisiones no obvias |
| 7 | Conformidad entrada ↔ salida | ✅ Nada del texto se perdió en la mudanza: lo que salió de DR-05 está en DR-14, lo que salió de DR-06 está en DR-13, y DR-12 recoge lo que fue de DR-04 |

## 3. Excepciones declaradas

**E-1 · Racimo controlador-controlador en DR-06 (23 enlaces) y DR-05 (9).**
La skill avisa a partir de 3 porque un racimo «suele indicar lógica no distribuida». Aquí **no** lo es: ambos casos de uso son cadenas por naturaleza —el onboarding es un asistente multipaso, y el chat es una tubería `verificar → gate → construir contexto → invocar → guardas → mostrar`— y esa forma está literalmente en el texto de la especificación. Distribuirla inventaría estructura que el texto no tiene. Se conserva y se declara.

**E-2 · DR-06 tiene 39 elementos (umbral: 25).**
La skill recomienda partir el caso de uso cuando crece. **No procede aquí**, y el criterio de la propia skill lo dice: se parte cuando *«los cursos alternativos tienen sus propios subalternos»*. Los de CU-06 no los tienen. El tamaño viene de sus **nueve flujos de excepción**, que son la tabla de códigos HTTP del plan §4.13 y responden a RF-26 (degradación con gracia): cada uno es una rama plana de un solo salto. Partir CU-06 rompería el caso de uso central del MVP para satisfacer un umbral.

## 4. Correcciones aplicadas por pasada

**Pasada 1 → 2, en DR-05:** el controlador «Armar la cápsula» concentraba 8 conexiones (umbral 6). Se distribuyó: el flujo alternativo de respuestas parciales pasó a etiquetar el arco hacia la entidad en vez de tener arco propio, y la expiración de sesión se ancló a las fronteras, que es donde se observa. Quedó en 6.

**Pasada 1 → 2, en DR-06:** la comprobación de cobertura detectó que **el diagrama declaraba `FA-03` en su nota y no existía en los arcos**. Causa: se renumeraron los arcos al sacar el cambio de personaje a CU-13, pero no el texto de la nota. Corregido, más el añadido de `FE-09` a la nota.

> Ambos hallazgos los encontró el validador, no la revisión a ojo. Es la razón por la que la capa 1 es condición de entrega y no recomendación.

## 5. Object discovery

**Delta vacío.** Ninguna de las entities de los cinco diagramas falta en MD-01 v1.4. Es consecuencia de la tanda 0, que ya había incorporado `TitularDeCuenta`, `Visitante`, `ContadorDeUsoDiario` y `EventoOperativo`.

Un cambio de color, no de contenido: `EventoOperativo` llevaba `#PaleGreen` en DR-06 como marca de «clase del delta pendiente». Ya es clase de MD-01 v1.4, así que la marca se retiró.

## 6. Informe de desambiguación

**Sin hallazgos.** Las cinco especificaciones se reescribieron en la fase D.3 y pasaron su propia auditoría independiente, así que los defectos que este paso suele destapar —pantallas sin nombre, sustantivos vagos, flujos sin desenlace— ya se habían corregido allí. Es el resultado esperable cuando el texto entra en buen estado, y confirma que el orden D.3 → D.4 era el correcto.

## 7. Trazabilidad

| Diagrama | Actor(es) ∈ DCU-01 | Entities ∈ MD-01 v1.4 | Pantallas ∈ DIS-00 | Relación del diagrama |
|---|---|---|---|---|
| DR-05 | Usuario adulto | Usuario, Consentimiento, CapsulaDePerfil | P-05…P-08, P-03 | incluye a CU-14 |
| DR-06 | Usuario adulto, Proveedor LLM | Conversacion, Mensaje, Personaje, CapsulaDePerfil, Consentimiento, DisponibilidadDelChatbot, EventoDeSeguridad, EventoOperativo | P-10, P-11, P-07 | extendido por CU-07 y CU-13 |
| DR-12 | Usuario adulto | Usuario, Consentimiento, CapsulaDePerfil, Conversacion | P-13, P-03 | — |
| DR-13 | Usuario adulto | Personaje, Alan, Aura, Conversacion, CapsulaDePerfil, DisponibilidadDelChatbot | P-10, P-03 | extiende a CU-06 |
| DR-14 | Usuario adulto | Personaje, Alan, Aura, CapsulaDePerfil | P-09, P-03 | incluido por CU-05 |

## 8. Lo que queda fuera de este certificado

- **Los SVG no se han regenerado.** Se hacen al cierre de la fase D.4, junto con los de las tandas 2 y 3, porque el generador lleva grabados unos conteos que dejan de ser ciertos y hay que corregirlo una sola vez.
- **`DR-00` sigue describiendo el estado anterior.** Se reescribe al cerrar la fase.
- Las tandas 2 y 3 de la D.4 (DR-01, 02, 03, 04, 07, 08, 09, 10 y el nuevo DR-11) siguen pendientes.

**Fin del certificado.**
