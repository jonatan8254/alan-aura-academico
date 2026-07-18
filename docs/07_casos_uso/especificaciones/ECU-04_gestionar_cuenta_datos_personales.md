# ECU-04 — Especificación de caso de uso: «Gestionar cuenta y datos personales» (CU-04)
**ID documento:** DOC-CU-04 · **Caso de uso:** CU-04 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23) — caso de uso **canon-sensible** (borrado en cascada, revocación, supresión de datos). Agrupa tres subobjetivos (DCU-01 decisión 3): reiniciar perfil, revocar personalización, eliminar cuenta.
**Insumos:** DCU-01, MV-01 §Vista Cuenta, MD-01, REQ-01 (RF-22/23/24), PRIV-01, VIS-01, plan §3.1/§4.9/§4.14. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-04 |
| Versión | v1.0 |
| Autor | Jonatan Estiven Sánchez Vargas (subproyecto) |
| Fecha de creación | 2026-07-16 |
| Fecha de última actualización | 2026-07-16 |
| Estado | Propuesto |

**Historial de cambios**

| Versión | Fecha | Autor | Cambio realizado |
|---|---|---|---|
| v1.0 | 2026-07-16 | J. Sánchez | Creación (fase 2 ICONIX, paso 3). |

## 2. Entradas esperadas
| Insumo | Descripción | Estado |
|---|---|---|
| Modelo verbal | MV-01 §Vista Cuenta y acceso (RN-04.x) | Disponible |
| Modelo de dominio | MD-01 (Usuario, CapsulaDePerfil, Consentimiento) | Disponible |
| Diagrama de casos de uso | DCU-01 (CU «Gestionar cuenta y datos personales») | Disponible |
| Caso de uso seleccionado | CU-04 | Disponible |
| Actor principal | Usuario adulto | Disponible |
| Reglas de negocio | RN-04.3, RN-04.4, RN-07 | Disponible |
| Requisitos funcionales | RF-22, RF-23, RF-24 | Disponible |
| Requisitos especiales | PRIV-R11, RNF-08 | Disponible |
| Restricciones | Canon: supresión, minimización, no punitivo | Disponible |

## 3. Identificación
| Campo | Valor |
|---|---|
| ID | CU-04 |
| Nombre | Gestionar cuenta y datos personales |
| Paquete funcional | Acceso y cuenta |
| Nivel de abstracción | Usuario |
| Actor primario | Usuario adulto |
| Prioridad | Alta |
| Frecuencia de uso | Baja |
| Criticidad | **Alta** (la eliminación en cascada es irreversible) |
| Estado | Propuesto |

## 4. Propósito
| Campo | Descripción |
|---|---|
| Objetivo | Permitir al Usuario **reiniciar su caracterización**, **revocar la personalización** y **eliminar su cuenta** con **borrado en cascada**. |
| Descripción breve | Desde la gestión de cuenta, el usuario controla sus datos: borra el perfil, detiene el uso de la cápsula o suprime toda su cuenta. |
| Valor funcional | Autonomía sobre los datos personales (control y supresión), coherente con el canon y la Ley 1581. |
| Resultado observable | Según la acción: la cápsula deja de existir, deja de alimentar la conversación, o la cuenta y todos sus datos asociados desaparecen sin remanentes. |

## 5. Actores
| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Usuario adulto | Titular de la cuenta | Elige y confirma la acción de gestión |
| Stakeholder relacionado | Rol Datos/Privacidad | Vela por la supresión efectiva (PRIV-01) | Verifica el borrado en cascada |

## 6. Alcance y contexto
| Campo | Valor |
|---|---|
| Alcance funcional | Gestión de la cuenta del propio usuario (reinicio, revocación, eliminación). |
| Límite del sistema | El usuario gestiona **su** cuenta; el administrador **no** interviene aquí. |
| Incluye | Reiniciar caracterización, revocar personalización, eliminar cuenta con borrado en cascada. |
| Excluye | Edición de recursos/textos (admin), recuperación de contraseña por correo (RN-04.6). |
| Suposiciones | El usuario tiene sesión activa (CU-03). |

## 7. Modelo de dominio involucrado
| Concepto/clase | Descripción | Participación | Atributos (reserva) | Relaciones |
|---|---|---|---|---|
| Usuario | Titular de la cuenta | Se elimina (o conserva) | username, alias | Usuario–CapsulaDePerfil; Usuario–Consentimiento |
| CapsulaDePerfil | Resumen mínimo (`ContextoInicialConversacionalV1`) | Se borra o deja de alimentar | 5 campos + metadatos | CapsulaDePerfil–Conversacion (orienta) |
| Consentimiento | Aceptación granular | Se revoca / se elimina en cascada | estado | Usuario–Consentimiento |

**Control terminológico**

| Término oficial | Significado | Prohibidos | Observación |
|---|---|---|---|
| Reiniciar caracterización | Borrar la `CapsulaDePerfil` | «resetear perfil» | RF-22 |
| Revocar personalización | Cesar el uso de la cápsula | «desactivar cuenta» | RF-23, RN-07 |
| Eliminar cuenta | Suprimir el `Usuario` con borrado en cascada | «dar de baja temporal» | RF-24, PRIV-R11 |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 Iniciar sesión | Depende de | Requiere sesión activa. |
| `<<include>>` / `<<extend>>` | — | — | Ninguno. |
| Nota de granularidad | — | — | Agrupa tres subobjetivos (DCU-01 decisión 3); podría separarse «Eliminar cuenta» si el curso lo pide. |

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Usuario tiene sesión activa. | Autorización | Sí (si no → 401) |
| PRE-02 | El rol «usuario» está validado en servidor. | Autorización | Sí |
| PRE-03 | El Usuario tiene una cuenta (y opcionalmente una cápsula/consentimiento). | Datos | Sí |

## 10. Disparador
| Campo | Valor |
|---|---|
| Evento inicial | El Usuario abre la gestión de cuenta y elige una acción (reiniciar / revocar / eliminar). |
| Generado por | Actor (Usuario). |
| Condición inicial observable | El sistema muestra las opciones de gestión de cuenta. |

## 11. Flujo básico / curso normal (escenario crítico: eliminar cuenta con borrado en cascada)
| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Usuario | Abre la gestión de cuenta | — | Muestra las opciones: reiniciar caracterización, revocar personalización, eliminar cuenta | Página de gestión de cuenta |
| 2 | Usuario | Elige «Eliminar cuenta» | Usuario | Solicita **confirmación** advirtiendo que la acción es **irreversible** | Diálogo de confirmación |
| 3 | Usuario | Confirma la eliminación | Usuario, CapsulaDePerfil, Consentimiento | **Elimina** la cuenta y ejecuta el **borrado en cascada** de los datos asociados (cápsula, consentimiento, contadores del usuario) | Página de gestión de cuenta |
| 4 | Sistema | — | — | Cierra la sesión y confirma que no queda dato asociado recuperable | Confirmación |

## 12. Flujos alternativos
| ID | Nombre | Punto | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Reiniciar caracterización | Paso 1 | El Usuario elige «Reiniciar caracterización» | Se **borra** la `CapsulaDePerfil`; la cuenta permanece | Fin | RN-04.3, RF-22 |
| FA-02 | Revocar personalización | Paso 1 | El Usuario elige «Revocar personalización» | La cápsula **deja de alimentar** la conversación | Fin | RN-04.3, RN-07, RF-23 |
| FA-03 | Cancelar eliminación | Paso 2 | El Usuario no confirma | No se elimina nada | Vuelve al paso 1 | — |

## 13. Flujos de excepción
| ID | Error o evento | Punto | Causa | Respuesta del sistema | Estado final | Recuperación |
|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Cualquiera | La sesión expira | `401`; solicita reingresar | Sin cambios en la cuenta | CU-03 |
| FE-02 | Entrada inválida | Paso 2–3 | Petición mal formada | `400`; no ejecuta la acción | Sin cambios | Reintentar |

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito (eliminar) | La cuenta y todos sus datos asociados se suprimen; se cierra la sesión | Inspección: sin remanentes recuperables |
| Éxito (reiniciar) | La `CapsulaDePerfil` deja de existir; la cuenta permanece | Inspección |
| Éxito (revocar) | La cápsula no vuelve a alimentar la conversación | Prueba de conversación |
| Fallo | Ninguna acción se ejecuta; la cuenta queda intacta | Inspección |
| Datos eliminados | `Usuario` + `CapsulaDePerfil` + `Consentimiento` + contadores (cascada); o solo `CapsulaDePerfil` (reiniciar) | Inspección |
| Cambios de estado | `Consentimiento` → revocado (FA-02) | Traza |
| Efectos visibles | Confirmación de la acción realizada | Observación |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-04.3 | El usuario puede reiniciar su caracterización y revocar la personalización. | Habilitador | FA-01/FA-02 | MV-01 §7.5 |
| RN-04.4 | El usuario puede eliminar su cuenta con borrado en cascada. | Habilitador | Flujo básico | MV-01 §7.5 |
| RN-07 | El consentimiento es revocable; al revocarlo cesa el uso de la cápsula. | Habilitador | FA-02 | MV-01 §7.1 |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Privacidad | La eliminación borra en **cascada** todos los datos asociados (cápsula, consentimiento, contadores) (PRIV-R11). | Inspección: sin remanentes recuperables |
| RE-02 | Seguridad | La eliminación exige **confirmación** de acción irreversible; rol validado en servidor (RNF-08). | Prueba: sin confirmación no se elimina |
| RE-03 | Usabilidad | Las acciones de gestión son claras y en español CO (RNF-01). | Textos comprensibles |

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | Gestión de cuenta | Reiniciar/revocar/eliminar | — | Reiniciar, Revocar, Eliminar, Confirmar/Cancelar | 1–4 |
| Endpoint visible | `POST /perfil/reiniciar/` | Borrar caracterización | — | Enviar | FA-01 |
| Endpoint visible | `POST /cuenta/eliminar/` | Eliminar cuenta | confirmación | Enviar | 3 |

> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantalla P-13) y `DIS-01_sistema_diseno.md` (sistema de diseño: tokens, doble voz Alan/Aura, componentes). Mockups renderizados en claro y oscuro con estados no-felices. Los prototipos gráficos de producción quedan pendientes de la fase de construcción.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| Usuario | cuenta | Eliminar | Paso 3 | Borrado en cascada (PRIV-R11) |
| CapsulaDePerfil | 5 campos + metadatos | Eliminar | Paso 3, FA-01 | Deja de existir |
| Consentimiento | estado | Actualizar (revocar) / Eliminar | FA-02, paso 3 | Revocable (RN-07) |

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación |
|---|---|---|
| Requisito funcional | RF-22, RF-23, RF-24 | Realizados por este CU |
| Objetivo de negocio | OBJ-7, OBJ-4 | Cuenta/acceso; minimización |
| Regla de negocio | RN-04.3, RN-04.4, RN-07 | Gobiernan el flujo |
| Requisito de calidad | RC-04 (security/minimización) | Ancla |
| Modelo de dominio | Usuario, CapsulaDePerfil, Consentimiento | Conceptos manipulados |
| Diagrama de casos de uso | DCU-01 «Gestionar cuenta y datos personales» | Origen |
| Caso de prueba | CP-04 | Planificado |
| Robustez / secuencia | DR-04 / DS-04 | Planificados |
| Criterio de aceptación | CA-01…CA-04 | Verificación |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado un usuario que elimina su cuenta, cuando confirma, entonces se ejecuta el borrado en cascada y no queda dato asociado recuperable. | Flujo básico | Inspección de datos |
| CA-02 | Dado un usuario, cuando reinicia su caracterización, entonces la cápsula deja de existir y la cuenta permanece. | FA-01 | Inspección |
| CA-03 | Dado un usuario, cuando revoca la personalización, entonces la cápsula no vuelve a alimentar la conversación. | FA-02 | Prueba de conversación |
| CA-04 | Dada la opción de eliminar, cuando el usuario no confirma, entonces no se elimina nada. | FA-03 | Prueba |

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad | RF-24 pide «no queda dato asociado recuperable», pero PRIV-01/plan §4.14 mencionan una **retención de +30 días** tras la eliminación. | Define «sin remanentes» vs. ventana de retención | El borrado es inmediato de cara al usuario; la ventana +30 días (si aplica) es retención de respaldo por entorno — precisar en construcción. | **Abierto** |
| RA-02 | Decisión pendiente | ¿Separar «Eliminar cuenta» como CU propio? | Granularidad del modelo | Se mantiene agrupado (DCU-01 decisión 3); revisable si el curso lo pide. | Abierto |
| RA-03 | Decisión pendiente | Prototipos/GUI de gestión de cuenta. | Diseño | Fase de construcción. | Abierto |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Gestionar la propia cuenta (3 subobjetivos afines) |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Gestionar cuenta y datos personales» |
| 3 | Actor primario identificado | ✅ | Usuario adulto |
| 4 | Actores externos al sistema | ✅ | Sin LLM ni admin |
| 5 | Flujo básico = escenario de éxito completo | ✅ | Eliminar con cascada (crítico) |
| 6 | Flujos alternativos suficientes | ✅ | Reiniciar, revocar, cancelar |
| 7 | Flujos de excepción relevantes | ✅ | 401, 400 |
| 8 | Términos del dominio (MD-01) usados | ✅ | Usuario, CapsulaDePerfil, Consentimiento |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | Gestión de cuenta + endpoints |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 |
| 13 | Postcondiciones verificables | ✅ | Sin remanentes |
| 14 | Sin detalle de implementación | ✅ | Caja negra |
| 15 | Auth como precondición/regla | ✅ | PRE-01/02 |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19 |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ✅ | DR-04/DS-04 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Supresión; no punitivo; minimización |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Usuario adulto |
| Objetivo | Reiniciar perfil, revocar personalización o eliminar la cuenta (cascada). |
| Disparador | El usuario abre la gestión de cuenta y elige una acción. |
| Precondiciones | Sesión activa; rol usuario. |
| Conceptos del dominio | Usuario, CapsulaDePerfil, Consentimiento. |
| Flujo básico | Eliminar cuenta → confirmación → borrado en cascada → cierre de sesión. |
| Flujos alternativos | Reiniciar caracterización; revocar personalización; cancelar. |
| Flujos de excepción | 401; 400. |
| Postcondición de éxito | Datos suprimidos sin remanentes (o cápsula borrada/detenida). |
| Reglas de negocio | RN-04.3, RN-04.4, RN-07. |
| Criterios de aceptación | CA-01…CA-04. |
| Casos relacionados | CU-03 (precede). |

**Fin de ECU-04.**
