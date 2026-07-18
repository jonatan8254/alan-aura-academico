# ECU-10 — Especificación de caso de uso: «Habilitar o deshabilitar el chatbot» (CU-10)
**ID documento:** DOC-CU-10 · **Caso de uso:** CU-10 · **Familia:** ECU (especificación de casos de uso, fase 2 ICONIX) · **Hogar:** `docs/07_casos_uso/especificaciones/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto.
**Forma:** **completa** (§1–§23) — caso de uso **de control global (kill switch) con auditoría**.
**Insumos:** DCU-01, MV-01 §Vista Administración, MD-01, REQ-01 (RF-17/18), PRIV-01, plan §3.2/§3.7/§4.9/§4.14. **Nomenclatura:** Alan / Aura. **Idioma:** español (Colombia).

---

## 1. Control del documento
| Campo | Valor |
|---|---|
| Nombre del proyecto | Alan & Aura Académico |
| Nombre del sistema | Aplicación de acompañamiento conversacional «Alan & Aura Académico» |
| ID del documento | DOC-CU-10 |
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
| Modelo verbal | MV-01 §Vista Administración (RN-03.x) | Disponible |
| Modelo de dominio | MD-01 (DisponibilidadDelChatbot, Administrador) | Disponible |
| Diagrama de casos de uso | DCU-01 (CU «Habilitar o deshabilitar el chatbot») | Disponible |
| Caso de uso seleccionado | CU-10 | Disponible |
| Actor principal | Administrador de plataforma | Disponible |
| Reglas de negocio | RN-03.1, RN-03.4, RN-03.7, RN-02.7 | Disponible |
| Requisitos funcionales | RF-17, RF-18 | Disponible |
| Requisitos especiales | RNF-08, RC-07 | Disponible |
| Entidad de auditoría | `AdministrativeAction` (plan §4.14) | Disponible |

## 3. Identificación
| Campo | Valor |
|---|---|
| ID | CU-10 |
| Nombre | Habilitar o deshabilitar el chatbot |
| Paquete funcional | Administración de plataforma |
| Nivel de abstracción | Usuario |
| Actor primario | Administrador de plataforma |
| Prioridad | Alta |
| Frecuencia de uso | Baja (eventual) |
| Criticidad | **Alta** (control global del servicio conversacional) |
| Estado | Propuesto |

## 4. Propósito
| Campo | Descripción |
|---|---|
| Objetivo | Permitir al Administrador **habilitar o deshabilitar globalmente el chatbot** (*kill switch*), con **confirmación** y **registro de la acción**. |
| Descripción breve | El admin cambia el estado global de `DisponibilidadDelChatbot`; con el chatbot deshabilitado, ningún usuario puede iniciar conversación. |
| Valor funcional | Control operativo de contingencia (p. ej. incidente del LLM) sin tocar código. |
| Resultado observable | El estado global cambia; la acción queda auditada (autor/fecha); CU-06 se condiciona. |

## 5. Actores
| Tipo | Actor | Descripción | Participación |
|---|---|---|---|
| Actor primario | Administrador de plataforma | Rol con login separado y tres funciones | Cambia el estado y confirma |
| Stakeholder relacionado | Usuario adulto | Se ve afectado (no puede conversar si está deshabilitado) | Indirecta |

## 6. Alcance y contexto
| Campo | Valor |
|---|---|
| Alcance funcional | Cambio del estado global de disponibilidad del chatbot, con confirmación y auditoría. |
| Límite del sistema | El admin controla el **estado**; **no** ve conversaciones ni datos individuales. |
| Incluye | Ver estado actual, cambiarlo con confirmación, registrar la acción (autor/fecha). |
| Excluye | Edición de recursos/textos/prompts, suspensión individual, exportación, ver contenido. |
| Suposiciones | El admin está autenticado con rol=admin (CU-03/FA-01). |

## 7. Modelo de dominio involucrado
| Concepto/clase | Descripción | Participación | Atributos (reserva) | Relaciones |
|---|---|---|---|---|
| DisponibilidadDelChatbot | Estado global habilitado/deshabilitado | Se cambia | estado ∈ {habilitado, deshabilitado} | Administrador–DisponibilidadDelChatbot (controla); DisponibilidadDelChatbot–Conversacion (condiciona) |
| Administrador | Rol de plataforma | Ejecuta el cambio | — | Administrador–DisponibilidadDelChatbot |
| *AdministrativeAction* (entidad del plan) | Registro de auditoría de la acción | Se crea | autor, fecha | (no es clase de MD-01; ver §21 RA-01) |

**Control terminológico**

| Término oficial | Significado | Prohibidos | Observación |
|---|---|---|---|
| DisponibilidadDelChatbot | Estado global del servicio conversacional | «apagar servidor», «mantenimiento» | *kill switch* (MV-01 §12) |
| Kill switch | Habilitar/deshabilitar el chatbot | «borrar el chatbot» | RF-17 |

## 8. Relaciones con otros casos de uso
| Tipo de relación | Caso de uso relacionado | Dirección | Justificación |
|---|---|---|---|
| Dependencia funcional | CU-03 Iniciar sesión (admin) | Depende de | Requiere sesión con rol=admin. |
| Condiciona | CU-06 Conversar con el acompañante | Este CU condiciona a | Deshabilitado → CU-06 no se inicia (409, RN-02.7). |
| `<<include>>` / `<<extend>>` | — | — | Ninguno. |

## 9. Precondiciones
| ID | Precondición | Tipo | Verificable |
|---|---|---|---|
| PRE-01 | El Administrador tiene sesión con rol=admin validado en servidor. | Autorización | Sí (si no → 401/403) |
| PRE-02 | El acceso administrativo es por login separado (RN-03.7). | Autorización | Sí |

## 10. Disparador
| Campo | Valor |
|---|---|
| Evento inicial | El Administrador decide habilitar o deshabilitar el chatbot. |
| Generado por | Actor (Administrador). |
| Condición inicial observable | El sistema muestra el estado actual de disponibilidad. |

## 11. Flujo básico / curso normal (escenario: deshabilitar)
| Paso | Responsable | Acción (voz activa) | Concepto de dominio | Respuesta del sistema / resultado | Interfaz |
|---|---|---|---|---|---|
| 1 | Administrador | Abre el control de disponibilidad | DisponibilidadDelChatbot | Muestra el estado actual (habilitado/deshabilitado) | Panel administrativo |
| 2 | Administrador | Elige deshabilitar el chatbot | DisponibilidadDelChatbot | Solicita **confirmación** de la acción | Diálogo de confirmación |
| 3 | Administrador | Confirma | DisponibilidadDelChatbot | **Cambia** el estado global y **registra** la acción (autor + fecha) | Panel administrativo |
| 4 | Sistema | — | Conversacion | Aplica el nuevo estado: con el chatbot deshabilitado, ningún usuario inicia conversación (409) | — |

## 12. Flujos alternativos
| ID | Nombre | Punto | Condición | Resultado | Retorno | Reglas |
|---|---|---|---|---|---|---|
| FA-01 | Habilitar el chatbot | Paso 2 | El Administrador elige habilitar | Cambia a habilitado (con confirmación + registro); CU-06 vuelve a estar disponible | Paso 3 | RN-03.4 |
| FA-02 | Cancelar el cambio | Paso 2 | El Administrador no confirma | El estado no cambia | Vuelve al paso 1 | — |

## 13. Flujos de excepción
| ID | Error o evento | Punto | Causa | Respuesta del sistema | Estado final | Recuperación |
|---|---|---|---|---|---|---|
| FE-01 | Sesión ausente | Cualquiera | Sin sesión | `401`; solicita reingresar | Estado sin cambios | CU-03 |
| FE-02 | Permiso insuficiente | Paso 1 | Rol no-admin (aunque manipule el cliente) | `403` o redirección segura | Sin acceso | — |

## 14. Postcondiciones
| Tipo | Postcondición | Verificación |
|---|---|---|
| Éxito | El estado global de `DisponibilidadDelChatbot` queda cambiado | Inspección de estado |
| Fallo | El estado no cambia (cancelado o error de permiso) | Inspección |
| Datos creados | `AdministrativeAction` (autor, fecha), **sin** datos de usuario | Inspección (RF-18) |
| Datos modificados | `DisponibilidadDelChatbot.estado` | Traza |
| Cambios de estado | habilitado ↔ deshabilitado | Traza |
| Efectos visibles | Con el chatbot deshabilitado, los usuarios reciben indisponibilidad (409) al intentar conversar | Prueba (CU-06 FE-04) |

## 15. Reglas de negocio
| ID | Regla | Tipo | Flujo | Fuente |
|---|---|---|---|---|
| RN-03.1 | El administrador tiene exactamente tres funciones (directorio, métricas, kill switch). | Restricción | Todo | MV-01 §7.4 |
| RN-03.4 | El kill switch requiere **confirmación** y queda **registrado** (auditoría de la acción). | Habilitador | Paso 2–3 | MV-01 §7.4 |
| RN-03.7 | El acceso administrativo es por login separado y el rol se valida en el servidor. | Restricción | PRE-01/02, FE-02 | MV-01 §7.4 |
| RN-02.7 | No se inicia conversación si el chatbot está deshabilitado globalmente. | Restricción | Paso 4 | MV-01 §7.3 |

## 16. Requisitos especiales
| ID | Categoría | Requisito | Criterio verificable |
|---|---|---|---|
| RE-01 | Auditoría | Cada cambio del kill switch se registra con autor y fecha, **sin** datos de usuario (RF-18). | Inspección de la `AdministrativeAction` |
| RE-02 | Seguridad | Acceso por login separado; rol validado en servidor (RN-03.7, RNF-08). | No-admin recibe 401/403 |
| RE-03 | Fiabilidad | El cambio surte efecto de inmediato sobre el inicio de conversaciones (RC-07). | Con deshabilitado, CU-06 responde 409 |
| RE-04 | Privacidad | El admin **no** ve conversaciones, cápsulas ni datos individuales al operar el kill switch. | Inspección de la vista |

## 17. Prototipos, GUI o referencias de interfaz
| Elemento | Nombre explícito | Propósito | Campos principales | Acciones | Pasos |
|---|---|---|---|---|---|
| Página | Panel administrativo (control de disponibilidad) | Ver y cambiar el estado del chatbot | estado actual | Habilitar, Deshabilitar, Confirmar/Cancelar | 1–3 |
| Endpoint visible | `POST /plataforma-admin/chat-access/` | Cambiar el kill switch | nuevo estado, confirmación | Enviar | 3 |

> **Diseño de alta fidelidad producido (SD-23):** ver `../../08_diseno/DIS-00_inventario_y_plan.md` (pantalla P-16) y `DIS-01_sistema_diseno.md` (sistema de diseño: tokens, doble voz Alan/Aura, componentes). Mockups renderizados en claro y oscuro con estados no-felices. Los prototipos gráficos de producción quedan pendientes de la fase de construcción.

## 18. Datos y objetos manipulados
| Concepto de dominio | Datos usados | Operación | Flujo | Restricciones |
|---|---|---|---|---|
| DisponibilidadDelChatbot | estado | Actualizar / Confirmar | Paso 3 | Requiere confirmación (RN-03.4) |
| AdministrativeAction | autor, fecha | Crear | Paso 3 | Sin datos de usuario (RF-18) |

## 19. Trazabilidad
| Tipo de elemento | Referencia | Relación |
|---|---|---|
| Requisito funcional | RF-17, RF-18 | Realizados por este CU |
| Objetivo de negocio | OBJ-6 | Administración (3 funciones) |
| Regla de negocio | RN-03.1, RN-03.4, RN-03.7, RN-02.7 | Gobiernan el flujo |
| Requisito de calidad | RC-07 (fiabilidad) | Ancla |
| Modelo de dominio | DisponibilidadDelChatbot, Administrador | Conceptos manipulados |
| Diagrama de casos de uso | DCU-01 «Habilitar o deshabilitar el chatbot» | Origen |
| Caso de prueba | CP-10 | Planificado |
| Robustez / secuencia | DR-10 / DS-10 | Planificados |
| Criterio de aceptación | CA-01…CA-03 | Verificación |

## 20. Criterios de aceptación
| ID | Criterio (Dado/Cuando/Entonces) | Flujo | Evidencia |
|---|---|---|---|
| CA-01 | Dado el chatbot habilitado, cuando el admin lo deshabilita y confirma, entonces ningún usuario puede iniciar conversación (409). | Flujo básico | Prueba (CU-06) |
| CA-02 | Dado un cambio del kill switch, cuando ocurre, entonces queda registrado con autor y fecha, sin datos de usuario. | Postcondición (RF-18) | Inspección de auditoría |
| CA-03 | Dado un usuario no-admin, cuando intenta operar el kill switch, entonces recibe 401/403. | FE-01/FE-02 | Prueba |

## 21. Riesgos, ambigüedades y decisiones pendientes
| ID | Tipo | Descripción | Impacto | Decisión | Estado |
|---|---|---|---|---|---|
| RA-01 | Ambigüedad | La auditoría se apoya en `AdministrativeAction`, entidad del **plan §4.14** que **no** es clase de MD-01 (el modelo de dominio no la incluyó por ser registro operativo). | Traza dominio↔auditoría | Tratarla como registro operativo (no de dominio); mencionarla como entidad de construcción. | Nota (aceptado) |
| RA-02 | Decisión pendiente | Prototipos/GUI del control de disponibilidad. | Diseño | Fase de construcción. | Abierto |

## 22. Checklist de revisión metodológica (§22)
| # | Criterio | Cumple | Observación |
|---|---|---|---|
| 1 | Objetivo único y claro | ✅ | Cambiar el estado global del chatbot |
| 2 | Nombre en verbo infinitivo + objeto | ✅ | «Habilitar o deshabilitar el chatbot» |
| 3 | Actor primario identificado | ✅ | Administrador |
| 4 | Actores externos al sistema | ✅ | — |
| 5 | Flujo básico = escenario de éxito completo | ✅ | Deshabilitar con confirmación + auditoría |
| 6 | Flujos alternativos suficientes | ✅ | Habilitar, cancelar |
| 7 | Flujos de excepción relevantes | ✅ | 401, 403 |
| 8 | Términos del dominio (MD-01) usados | ✅ | DisponibilidadDelChatbot, Administrador |
| 9 | Sin sinónimos ambiguos | ✅ | Control terminológico §7 |
| 10 | Interfaces nombradas donde aplica | ✅ | Panel + `/plataforma-admin/chat-access/` |
| 11 | Reglas de negocio separadas (por ID) | ✅ | §15 |
| 12 | Requisitos especiales separados | ✅ | §16 (auditoría) |
| 13 | Postcondiciones verificables | ✅ | §14 |
| 14 | Sin detalle de implementación | ✅ | Caja negra |
| 15 | Auth como precondición/regla | ✅ | PRE-01/02 |
| 16 | Trazabilidad a RF/OBJ/RN/CA | ✅ | §19 |
| 17 | Criterios en Dado/Cuando/Entonces | ✅ | §20 |
| 18 | Base para robustez y secuencia | ✅ | DR-10/DS-10 |
| 19 | Comprensible por usuarios/analistas/desarrolladores | ✅ | — |
| 20 | Coherente con DCU-01 y canon §5 | ✅ | Condiciona CU-06; admin no ve datos individuales |

## 23. Versión resumida
| Campo | Valor |
|---|---|
| Actor primario | Administrador de plataforma |
| Objetivo | Habilitar/deshabilitar el chatbot con confirmación y auditoría. |
| Disparador | El admin decide cambiar el estado del chatbot. |
| Precondiciones | Sesión con rol=admin (login separado). |
| Conceptos del dominio | DisponibilidadDelChatbot, Administrador (+ AdministrativeAction, registro). |
| Flujo básico | Ver estado → deshabilitar → confirmar → cambiar + auditar → efecto en CU-06. |
| Flujos alternativos | Habilitar; cancelar. |
| Flujos de excepción | 401; 403. |
| Postcondición de éxito | Estado global cambiado; acción registrada (autor/fecha). |
| Reglas de negocio | RN-03.1, RN-03.4, RN-03.7, RN-02.7. |
| Criterios de aceptación | CA-01…CA-03. |
| Casos relacionados | CU-03 (precede), CU-06 (condiciona). |

**Fin de ECU-10.**
