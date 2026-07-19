# DIS-00 — Inventario de pantallas y plan de diseño del MVP
**ID:** DIS-00 · **Familia:** DIS (diseño de interfaz) · **Hogar:** `docs/08_diseno/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto (dirección para validar).
**Insumos:** DCU-01 (10 CU), ECU-00…10 (flujos §11), REQ-01 (RF-01…26), plan §3.1/§3.2/§4.9 (rutas), VIS-01 (OBJ), PRIV-01, SEG-01. **Sistema:** DIS-01. **Consumidores:** mockups (Fase 5), fase de construcción; puebla el §17 de las ECU.

---

## 1. Investigación aplicada (resumen; fuentes completas en DIS-01 §0)
E1 alianza/validación + disclosure honesto · E2 base fría-calma, calidez de acento · E3 crisis serena no alarmista · E4 consentimiento por capas/opt-in · E5 tipografía humanista + aire · E6 movimiento reducido. Todo el inventario y cada pantalla se anclan a estos hallazgos.

## 2. Inventario de pantallas (16) — derivado de DCU-01 + §11 ECU + rutas plan §4.9
> Hoy **ninguna** está diseñada (§17 de cada ECU = [Pendiente]). Este inventario cubre los **10 CU** y los **26 RF**, sin vacíos.

**Mockups renderizados:** ver [`mockups/index.html`](mockups/index.html) (galería) — cada fila enlaza a su archivo `.html` autocontenido.

### Paquete A · Acceso y cuenta
| ID | Pantalla | Archivo | Ruta | CU · RF | Actor | Prioridad | Estados clave |
|---|---|---|---|---|---|---|---|
| P-01 | Presentación / landing | [`mockups/p01_presentacion_landing.html`](mockups/p01_presentacion_landing.html) | `/` | CU-01 · RF-19 | Visitante | Alta | default · servicio no disponible |
| P-02 | Registro | [`mockups/p02_registro_cuenta.html`](mockups/p02_registro_cuenta.html) | `/registro/` | CU-02 · RF-20 | Visitante | Alta | vacío · error 400 · username en uso |
| P-03 | Iniciar sesión (usuario) | [`mockups/p03_iniciar_sesion_usuario.html`](mockups/p03_iniciar_sesion_usuario.html) | `/login/` | CU-03 · RF-21 | Usuario | Alta | vacío · credenciales inválidas |
| P-04 | Iniciar sesión (admin, separado) | [`mockups/p04_login_administracion.html`](mockups/p04_login_administracion.html) | `/plataforma-admin/login/` | CU-03 · RF-14 | Administrador | Media | vacío · 403 rol insuficiente |
| P-13 | Gestión de cuenta y datos | [`mockups/p13_gestion_cuenta_datos.html`](mockups/p13_gestion_cuenta_datos.html) | `/cuenta/…` | CU-04 · RF-22/23/24 | Usuario | Media | default · confirmar eliminación (destructivo) |

### Paquete B · Acompañamiento
| ID | Pantalla | Archivo | Ruta | CU · RF | Actor | Prioridad | Estados clave |
|---|---|---|---|---|---|---|---|
| P-05 | Onboarding · disclosure de IA | [`mockups/p05_onboarding_disclosure.html`](mockups/p05_onboarding_disclosure.html) | `/onboarding/` | CU-05 · RF-01 | Usuario | Alta | default (precede a todo dato) |
| P-06 | Onboarding · declaración de edad | [`mockups/p06_onboarding_edad.html`](mockups/p06_onboarding_edad.html) | `/onboarding/` | CU-05 · RF-02 | Usuario | Alta | default · **bloqueo <18** |
| P-07 | Onboarding · consentimiento granular | [`mockups/p07_onboarding_consentimiento.html`](mockups/p07_onboarding_consentimiento.html) | `/onboarding/` | CU-05 · RF-03 | Usuario | Alta | toggles apagados · revocar |
| P-08 | Onboarding · caracterización (5 preguntas → `ContextoInicialConversacionalV1`) | [`mockups/p08_onboarding_caracterizacion.html`](mockups/p08_onboarding_caracterizacion.html) | `/onboarding/` | CU-05 · RF-04/05 | Usuario | Alta | completo · parcial/omitir (todo opcional salvo personaje) |
| P-09 | Onboarding · elegir Alan o Aura | [`mockups/p09_onboarding_elegir_personaje.html`](mockups/p09_onboarding_elegir_personaje.html) | `/onboarding/` | CU-05 · RF-06 | Usuario | Alta | comparar · seleccionado |
| P-10 | Chat con el acompañante (normal) | [`mockups/p10_chat_claro.html`](mockups/p10_chat_claro.html) · [oscuro](mockups/p10_chat_oscuro.html) | `/api/chat/` | CU-06 · RF-07…13/25 | Usuario · LLM | Alta | vacío/bienvenida · escribiendo · límite de sesión · cambiar personaje |
| P-11 | Chat · error/degradación | [`mockups/p11_chat_estados_degradacion.html`](mockups/p11_chat_estados_degradacion.html) | `/api/chat/` | CU-06 · RF-26 | Sistema | Media | 401/403/400/409/429/502/504 (sin códigos crudos) |
| P-12 | Contención + derivación (safety fallback) | [`mockups/p12_contencion_derivacion.html`](mockups/p12_contencion_derivacion.html) | (respuesta `safety_fallback`) | CU-07 · RF-11 | Usuario (disparo del sistema) | Alta | contención + recursos + nueva sesión |

### Paquete C · Administración de plataforma
| ID | Pantalla | Archivo | Ruta | CU · RF | Actor | Prioridad | Estados clave |
|---|---|---|---|---|---|---|---|
| P-14 | Directorio de usuarios | [`mockups/p14_admin_directorio.html`](mockups/p14_admin_directorio.html) | `/plataforma-admin/` | CU-08 · RF-15 | Administrador | Media | lista truncada · vacío · 401/403 |
| P-15 | Métricas de uso (agregadas) | [`mockups/p15_admin_metricas.html`](mockups/p15_admin_metricas.html) | `/plataforma-admin/` | CU-09 · RF-16 | Administrador | Media | agregados · sin datos por usuario |
| P-16 | Kill switch (habilitar/deshabilitar) | [`mockups/p16_admin_kill_switch.html`](mockups/p16_admin_kill_switch.html) | `/plataforma-admin/chat-access/` | CU-10 · RF-17/18 | Administrador | Alta | habilitado · deshabilitado · **modal de confirmación** + auditoría |

**Cobertura:** RF-01…06→P05-P09 · RF-07…13/25→P10 · RF-11→P12 · RF-14→P04 · RF-15→P14 · RF-16→P15 · RF-17/18→P16 · RF-19→P01 · RF-20→P02 · RF-21→P03 · RF-22/23/24→P13 · RF-26→P11. **26/26, cero vacíos.**

## 3. Plan por pantalla (mini-fichas)
> Propósito · elementos · estados · voz Alan/Aura (si aplica) · anclaje evidencia/RF.

- **P-01 Presentación** — Comunicar alcance NO clínico, límites y accesos; generar confianza serena. Hero cálido-sereno, tres puntos de "qué es / qué no es", accesos registro/login, nota de disclosure. Sin claims. (E2, RF-19, RN-04.5)
- **P-02 Registro** — Crear cuenta con **solo** username/alias/contraseña; comunicar minimización ("no pedimos correo, documento ni teléfono"). Form corto, validación amable, error 400 sobrio. (E4, PRIV, RF-20)
- **P-03 Login usuario** — Entrar; mensaje de error **genérico** (sin revelar campo). Form mínimo. (RF-21, RNF-08)
- **P-04 Login admin** — Acceso separado, sobrio, "solo personal autorizado"; 403 seguro si no es admin. (RF-14, RN-03.7)
- **P-05 Disclosure** — **Primera** pantalla del onboarding: banner claro "hablas con una IA de acompañamiento, no un profesional" antes de cualquier dato. (E1, PRIV-R8, RF-01)
- **P-06 Edad** — Declaración ≥18 (booleana); bloqueo compasivo y no culpabilizador si <18. (RF-02, RN-01)
- **P-07 Consentimiento** — Granular, por capas: resumen + "ver detalle"; toggles **apagados**; revocable; lenguaje llano. (E4, RF-03)
- **P-08 Caracterización** — 5 preguntas (ánimo, energía, objetivo, estilo, personaje) → `ContextoInicialConversacionalV1`; **todo opcional salvo personaje**; "prefiero no responder" siempre visible; nada de defaults. (E4, RF-04/05, SD-22)
- **P-09 Elegir personaje** — Dos tarjetas (Aura teal / Alan ámbar) con avatar, rol y frase de muestra de su tono; comparar sin fricción. (E1, RF-06)
- **P-10 Chat** — Conversación gobernada; burbujas diferenciadas (usuario neutro / Alan ámbar / Aura teal, texto serif de voz); disclosure discreto persistente; cambiar personaje; aviso de límite de sesión sin romper. Indicador "escribiendo" = latido lento. (E1, E5, E6, RF-07…13/25)
- **P-11 Errores del chat** — Estados claros para 401/403/400/409/429/502/504 y límite; mensaje humano + reintento; **sin** stack/códigos crudos. (RF-26)
- **P-12 Contención/derivación** — Tono contenedor, centrado en la persona; recursos de ayuda al frente (por entorno); "iniciar nueva sesión"; fondo *grounding*, **sin rojo de alarma**, sin métricas. (E3, SEG-01, RF-11)
- **P-13 Gestión de cuenta** — Reiniciar perfil · revocar personalización · **eliminar cuenta** (confirmación irreversible, borrado en cascada); todo claro y reversible salvo eliminar. (RF-22/23/24, PRIV-R11)
- **P-14 Directorio admin** — Tabla mínima (alias, ID truncado, fecha, estado, onboarding); **jamás** username completo ni contenido. (PRIV-R10, RF-15)
- **P-15 Métricas admin** — Tarjetas de agregados (cuentas, onboardings, llamadas 7d, tasa éxito/error); nunca por usuario. (RF-16, RN-03.3)
- **P-16 Kill switch** — Estado global claro; cambiar con **modal de confirmación**; queda auditado (autor/fecha); efecto inmediato en el chat (409). (RF-17/18, RN-03.4)

## 4. Trazabilidad (pantalla → RF/ECU → evidencia)
Cada pantalla del §2 traza a su ECU (columna CU·RF) y a ≥1 hallazgo de la Fase 1 (E1–E6, ver §3 y DIS-01 §0). El detalle fino (componente → token → fuente) vive en DIS-01 §0/§6.

## 5. Orden de construcción (Fase 5)
Paquete A (Acceso y cuenta) → Paquete B (Acompañamiento) → Paquete C (Administración), en claro Y oscuro, con estados no-felices. Cada pantalla usa la biblioteca de DIS-01 y pasa el checklist de canon (DIS-01 §7).

## 6. Archivos persistidos (SD-24)
Los 16 mockups (+ style-tile) se guardan como **archivos HTML autocontenidos** en `docs/08_diseno/mockups/` — colores hardcoded (mismos valores hex de DIS-01, sin variables CSS de ningún entorno externo), tipografía humanista + serif de voz, iconos Tabler vía CDN. Abrir [`mockups/index.html`](mockups/index.html) para la galería completa con navegación por paquete.

**Fin de DIS-00.**
