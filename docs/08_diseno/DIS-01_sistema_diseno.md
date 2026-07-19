# DIS-01 — Sistema de diseño «Alan & Aura»
**ID:** DIS-01 · **Familia:** DIS (diseño de interfaz) · **Hogar:** `docs/08_diseno/` · **Fecha:** 2026-07-16 · **Versión:** v1.0 · **Estado:** Propuesto (dirección para validar).
**Insumos:** VIS-01, MV-01, CONTRATO_conversacional (personalidad P-1…P-8), REQ-01 (RNF-01 español CO, RC-06 usabilidad), PRIV-01 (disclosure/minimización), SEG-01 (derivación), ADR-001 (Django templates + JS mínimo → construible), DCU-01/ECU-00…10 (§17). **Consumidores:** DIS-00 (plan por pantalla), mockups (Fase 5), fase de construcción.
**Naturaleza:** mini-sistema de diseño fundamentado en evidencia. Cada token cita su base (Fase 1).

---

## 0. Evidencia base (Fase 1 — fuentes)
| # | Hallazgo | Implicación de diseño | Fuente |
|---|---|---|---|
| E1 | El vínculo con chatbots de bienestar se construye por **empatía, validación y sintonía**; riesgo de *therapeutic misconception*. | Microcopy cálido y validante **+ disclosure honesto persistente** de IA. Alan (activo, respuestas orientadas a acción) vs Aura (escucha pasiva) reflejan dos estilos con evidencia. | Wysa/Woebot alliance ([Frontiers 2022](https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2022.847991/full), [JMIR 2025](https://mental.jmir.org/2025/1/e76642)) |
| E2 | Tonos **fríos** (azul/verde/teal) bajan ritmo cardíaco y *arousal*; **cálidos** lo suben; **neutros suaves** reducen carga cognitiva y dan sensación de seguridad. | Base **calma-dominante** (fría/neutra); calidez (Alan) como **acento**, no fondo. | [UXmatters salud/bienestar](https://www.uxmatters.com/mt/archives/2024/07/leveraging-the-psychology-of-color-in-ux-design-for-health-and-wellness-apps.php), [Number Analytics](https://www.numberanalytics.com/blog/ultimate-guide-color-psychology-design-wellbeing) |
| E3 | Mensajería segura de crisis: **centrar en la persona**, mostrar recursos, "hay ayuda y esperanza"; **no** método/lugar; no alarmar. | Pantalla de derivación **serena y contenedora**, recursos al frente, tono *grounding* — **nunca rojo de alarma**. | [Community-Led SP](https://communitysuicideprevention.org/element/communication/ensuring-safe-suicide-prevention-messaging/), [ReachLink](https://reachlink.com/advice/depression/suicide-prevention-messaging/) |
| E4 | Consentimiento: **por capas / just-in-time**, opt-in explícito, **sin casillas premarcadas**, lenguaje llano. | Consentimiento granular con resumen + expandir; toggles apagados por defecto; español claro. | [ICO/GDPR layered](https://gdprlocal.com/consent-in-ai-appliactions/), [TermsFeed privacy UX](https://www.termsfeed.com/blog/privacy-ux/) |
| E5 | Interlineado **1.4–1.6** mejora lectura (+~20% precisión, −~30% fatiga); **humanista** más legible; aire blanco ↓ carga cognitiva. | Sans humanista, cuerpo `line-height 1.6`, medida cómoda, mucho aire. | [RAIS font+cognition](https://raisproject.com/font-readability-and-cognition/), [Readability Group](https://medium.com/the-readability-group/a-guide-to-understanding-what-makes-a-typeface-accessible-and-how-to-make-informed-decisions-9e5c0b9040a0) |
| E6 | Movimiento no esencial daña a usuarios vestibulares/ansiedad/ADHD; respetar `prefers-reduced-motion`; usar *fades* cortos, no parpadeo. | Micro-interacciones suaves (120–240 ms), sin parpadeo/parallax/autoplay; reduce-motion soportado. | [WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html), [web.dev motion](https://web.dev/learn/accessibility/motion) |

## 1. Principios (de la evidencia + canon)
1. **Calma como base, calidez como acento** (E2). La app respira; el color cálido puntúa, no inunda.
2. **Agresivos en el *craft*, serenos en el estímulo.** Nivel de detalle alto; estímulo bajo. Nada estridente (canon: seguridad > engagement).
3. **Honestidad visible** (E1, PRIV-01): el *disclosure* de IA precede a todo dato y reaparece en el chat; nunca se disfraza de humano.
4. **Contención, no alarma** (E3): la seguridad se siente sostenida, no urgente-roja.
5. **Legibilidad y aire** (E5): jerarquía clara, interlineado generoso, medida cómoda.
6. **Accesible por defecto** (E5, E6): AA de contraste, foco visible, reduce-motion, objetivos táctiles ≥44px.
7. **Dos voces, un sistema**: Alan y Aura comparten layout, tipografía y reglas; cambian tono, color de acento y ritmo.

## 2. Color (semilla verificada — AA en claro y oscuro)
> Regla de uso: **tinte** (50/100) para fondos suaves; **primario 500** para marca/acentos y elementos grandes; **700/900** para texto y botones sólidos (contraste AA). El cálido (Alan) nunca es fondo de página.

### 2.1 Rampa Aura — teal sereno (calma, regulación) · E2
| Stop | Hex | Uso |
|---|---|---|
| Aura-50 | `#E7F1EF` | fondo de burbuja / tinte |
| Aura-100 | `#C5E2DB` | hover suave |
| Aura-300 | `#6FB3A6` | acento decorativo |
| Aura-500 | `#3E8E82` | **marca Aura**, iconos, bordes activos |
| Aura-700 | `#1F6357` | texto sobre claro (AA), botón sólido + texto blanco |
| Aura-900 | `#123F39` | texto fuerte |

### 2.2 Rampa Alan — ámbar cálido (activación) · E2
| Stop | Hex | Uso |
|---|---|---|
| Alan-50 | `#FBEFDD` | fondo de burbuja / tinte |
| Alan-100 | `#F5DDB8` | hover suave |
| Alan-300 | `#E7B064` | acento decorativo |
| Alan-500 | `#D98A2B` | **marca Alan**, acentos, iconos (elementos grandes) |
| Alan-700 | `#8A5216` | texto sobre claro (AA), botón sólido + texto blanco |
| Alan-900 | `#5C360E` | texto fuerte |
> Alan **nunca** usa rojo/estridente; su energía es cálida, no alarmante (E2 + canon).

### 2.3 Neutros cálidos (no clínicos) · E2, E5
- **Claro:** página `#FAF7F2` · superficie `#FFFFFF` / `#FDFBF7` · borde `#E9E4DB` · texto `#2B2A27` · secundario `#6B6862` · tenue `#9A968E`.
- **Oscuro (cálido, no negro puro):** fondo `#16150F` · superficie `#211F1C` / `#2A2824` · borde `#3A3733` · texto `#EDE9E1` · secundario `#B4AFA5`.
> Se evita blanco/negro puros (leen "clínico/frío").

### 2.4 Acento "serenidad" compartido (marca del sistema) · E2
- `#3F6E8C` (azul-teal apagado, familia fría) para elementos de marca neutrales (enlaces, foco, encabezados de sistema) — une a Aura y Alan sin robar protagonismo.

### 2.5 Semánticos sobrios (uso con mesura)
| Rol | Hex | Texto/uso | Nota |
|---|---|---|---|
| Éxito | `#6FA368` (salvia) | texto `#2E4A28` sobre tinte `#EAF1E4` | distinto del teal de Aura |
| Aviso/atención | `#A8842F` (ocre apagado) | **preferir borde+icono, sin relleno grande** | claramente distinto del ámbar de Alan; usado rara vez |
| Peligro/derivación (crisis) | `#9E5744` (arcilla profunda, *grounding*) | texto `#6E3A2C` sobre tinte `#F3E4DD` | **E3: contención, nunca rojo de alarma** |
| Destructivo irreversible | `#B4472F` (rojo apenas desaturado) | solo en confirmación de "eliminar cuenta"; texto blanco (AA) | mínimo imprescindible |

**Verificación de contraste (muestras clave, WCAG AA):** texto `#2B2A27`/página `#FAF7F2` ≈ 13:1 (AAA) · Aura-700 `#1F6357`/blanco ≈ 5:1 (AA) · Alan-700 `#8A5216`/blanco ≈ 5.6:1 (AA) · blanco/Aura-700 y blanco/Alan-700 ≥ 4.5:1 (botones) · texto oscuro `#EDE9E1`/fondo `#16150F` ≈ 12:1 (AAA). Los stops 500 son para acentos/elementos grandes, **no** para texto pequeño.

## 3. Tipografía · E5
- **Sans humanista** (interfaz): producción recomendada **Figtree** o **Source Sans 3** / **Public Sans** (humanistas, gratuitas, web-safe). Cálida y muy legible.
- **Serif de voz** (solo burbujas de Alan/Aura): **Source Serif 4** o **Lora** — da "voz" humana al personaje y **distingue registro** (chrome sans vs voz serif), reforzando implícitamente "esto es un personaje, no tú" (apoya E1/disclosure).
- **Escala:** display 28 / H1 22 / H2 18 / cuerpo 16 (`line-height 1.6`) / caption 13. **Dos pesos** (regular 400 / medium 500). Sentence case siempre. Medida de lectura ≤ 66 caracteres.

## 4. Ritmo, elevación, movimiento, iconos
- **Espaciado:** escala 4/8/12/16/24/32/48; densidad *comfortable*; aire generoso (E5).
- **Radios:** 10px controles, 16px tarjetas, pill solo en chips/avatars.
- **Elevación:** plana; borde *hairline* 1px; sombra muy sutil solo en *overlays* (modal de consentimiento, confirmación).
- **Movimiento (E6):** 120–240 ms, *ease-out*, solo *opacity/transform* sutiles; sin parpadeo, parallax ni autoplay. `@media (prefers-reduced-motion: reduce)` → *fades* mínimos o nada. El indicador "escribiendo" es un latido lento, no un rebote nervioso.
- **Iconografía:** *outline* coherente (estilo Tabler), trazo 1.5–2px, 20px inline.

## 5. La doble voz Alan / Aura
| Dimensión | **Aura** (calma, regulación) | **Alan** (activación práctica) |
|---|---|---|
| Color de acento | Teal `#3E8E82` | Ámbar `#D98A2B` |
| Forma/ritmo | Redondeado, movimiento lento (respiración) | Un poco más definido, ritmo con más brío (siempre suave) |
| Avatar | Sereno (p. ej. gato/hoja/luna) — a definir en ilustración | Enérgico (p. ej. perro/sol) — a definir |
| Burbuja | Fondo Aura-50, texto serif | Fondo Alan-50, texto serif |
| Microcopy (P-1…P-8) | Pausado, validante: «Estoy aquí contigo. ¿Quieres contarme qué sientes?» | Directo, motivador: «Vamos por un paso pequeño. ¿Cuál podría ser?» |
| Comparten | Layout, tipografía, disclosure de IA, gate de seguridad, reglas [C] | Idéntico — **dos voces, un sistema** |
> Ninguna cláusula [C] del contrato se relaja por personaje (CONTRATO §3): Alan enérgico sigue derivando ante peligro; Aura contenedora sigue sin dar claims clínicos.

## 6. Biblioteca de componentes (a mostrar en el style-tile y aplicar en Fase 5)
- **Botones:** primario (neutro `#2B2A27` / o acento de marca), secundario (borde), *ghost*, **destructivo** (solo eliminar cuenta). Objetivo táctil ≥44px.
- **Inputs/formularios:** etiqueta arriba, ayuda debajo, foco con anillo de acento; estados error/éxito sobrios.
- **Banner de disclosure de IA** (E1, PRIV-R8): visible antes de capturar datos; icono + texto claro «Hablas con una inteligencia artificial de acompañamiento, no con un profesional».
- **Tarjeta de consentimiento granular** (E4): resumen + «ver detalle»; toggles **apagados por defecto**; lenguaje llano; sin casillas premarcadas.
- **Burbujas de chat:** usuario (neutro, alineado a la derecha), Alan (ámbar), Aura (teal), texto en serif de voz; timestamp tenue.
- **Indicador "escribiendo":** latido lento (reduce-motion: puntos estáticos).
- **Selector de personaje:** dos tarjetas (Aura/Alan) con su color, avatar y una frase de muestra de su tono.
- **Tarjeta de contención + derivación (crisis)** (E3): fondo *grounding* `#F3E4DD`, tono contenedor, recursos de ayuda al frente (por entorno), botón «iniciar nueva sesión»; sin rojo de alarma, sin métricas.
- **Estados de error/degradación** (RF-26): 401/403/409/429/502/504 y límite de sesión → mensajes claros, sin jerga ni códigos crudos, con acción de reintento.
- **Avatares** de Alan/Aura (ilustración propia — a definir).
- **Admin — tabla de directorio** (PRIV-R10): alias, ID truncado, fecha, estado, onboarding; **sin** username completo ni contenido.
- **Admin — tarjetas de métricas** (agregados): cuentas, onboardings, llamadas 7d, tasa éxito/error.
- **Admin — toggle kill switch** con **modal de confirmación** (RN-03.4) y registro de auditoría.

## 7. Checklist de canon por pantalla (gate de diseño)
No clínico · *disclosure* de IA antes de capturar datos · sin gamificación agresiva ni dark patterns (seguridad > engagement) · minimización y consentimiento visibles · solo adultos · español (Colombia) · admin sin datos individuales · crisis serena (no alarmista) · AA + reduce-motion · construible con Django templates + JS mínimo.

## 8. Style-tile y mockups aplicados
El sistema se ve renderizado en [`mockups/00_style_tile.html`](mockups/00_style_tile.html) (paleta, tipografía, componentes) y aplicado en las 16 pantallas de [`mockups/index.html`](mockups/index.html) — ver el inventario y la traza pantalla → RF/ECU en DIS-00 §2/§6.

**Fin de DIS-01.**
