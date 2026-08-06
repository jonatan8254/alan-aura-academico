# Frontend — estado y cómo continuar

> # ⚠️ DOCUMENTO HISTÓRICO — NO SEGUIR SUS INSTRUCCIONES
>
> **Describe el estado del 2026-08-06 por la mañana, cuando las 16 pantallas eran *stubs*.**
> Esa misma tarde se implementaron todas, se mergeó la rama en `main` y el sistema se desplegó.
> Casi todo lo que este archivo declara pendiente **está cerrado**, y sus cifras se quedaron cortas
> (dice 13 envoltorios y 15 componentes: son **14** y **17**).
>
> **El estado real es [`frontend/README.md`](README.md)**, y las cifras canónicas viven en
> `docs/00_gobernanza/HECHOS_CANONICOS.md` (`H-32` a `H-35`).
>
> Se conserva porque su §5 —las trampas verificadas contra las `ECU`— **sigue siendo válida y útil**:
> son decisiones de comportamiento que ninguna otra fuente recoge. Lo demás es historia.

**Fecha:** 2026-08-06 (mañana) · **Rama:** `fase-3-frontend`, hoy mergeada en `main` · **Para:** contexto histórico.

Este archivo no es un artefacto de gobernanza: es el traspaso operativo entre dos sesiones de
trabajo. La autoridad sigue siendo `DIS-00`/`DIS-01` para la interfaz, las `ECU` para el
comportamiento y `packages/contrato-api` para los tipos. Si algo de aquí contradice a esos tres,
ellos ganan y este archivo está desactualizado.

---

## 1. Dónde quedó

| Commit | Autor | Qué dejó |
|---|---|---|
| `4f09058` | 3LuisF | **Fase 0a + 0b**: scaffold Vite, tokens de `DIS-01`, capa de API, sesión, ruteo, 7 primitivas shadcn sobre Base UI y 15 propias |
| `01bc58f` | — | Merge de `main`: trae los 4 cambios de contrato que la rama no tenía |
| `1cf0e04` | — | La capa de API alineada a ese contrato |
| *(en stage)* | — | `Encabezado.tsx` a medio camino + `package-lock.json` |

**El armazón está completo y las 16 pantallas son *stubs*.** Ninguna tiene comportamiento: las
`src/pantallas/**` devuelven un texto de marcador. Lo que sí existe y **no hay que reescribir**:

- `src/api/` — `pedir()` nunca lanza; todo termina en un `Resultado<T>` con `ok: true|false`.
  Los 13 envoltorios de `endpoints.ts` ya están, uno por ruta.
- `src/sesion/` — pista optimista en `sessionStorage` (no es la sesión real, que es la cookie
  `httpOnly`) + las 4 guardas de ruta, ya cableadas en `rutas/rutas.tsx`.
- `src/estilos/` — los tokens de `DIS-01`. **Único sitio del repo donde puede haber un hex.**
- `src/componentes/` — 15 primitivas propias. Antes de escribir una pantalla, **mirá si ya
  existe el componente**: `BurbujaDeChat`, `CompositorDeMensaje`, `IndicadorEscribiendo`,
  `TarjetaDeContencion`, `TarjetaDePersonaje`, `TarjetaDeMetrica`, `BannerDeDisclosure`,
  `BannerInformativo`, `BarraDePasos`, `GrupoDeChips`, `Chip`, `DialogoDeConfirmacion`,
  `EstadoVacio`, `Icono`, `MarcaAlanAura`.

## 2. Lo primero, antes de escribir nada

```bash
ssh-add ~/.ssh/id_ed25519_university
```

La rama tiene **2 commits sin subir** y el `git fetch` falla sin eso (`Permission denied
(publickey)`: la clave tiene passphrase y el agente está vacío). Hasta que se corra, esta copia
puede estar atrasada respecto del remoto y **nada de lo que hagas llega al equipo**.

```bash
npm install          # desde la raíz del repo
npm run mock         # las 13 rutas en :4000, sin AWS — dejar corriendo
npm run dev -w frontend
```

El `proxy` de Vite manda `/api/*` al mock, así que la app siempre pide a `/api/v1/...` en su
mismo origen — igual que en producción, donde Vercel reescribe hacia el API Gateway
(`ARQ-01-D1`). **No hay que tocar código para cambiar de uno a otro.**

> **Ojo con `npm install` y las ramas.** El commit de Fase 0a/0b **no incluyó
> `package-lock.json`**, así que el lockfile de la rama no conocía las dependencias del
> frontend. Queda corregido en el stage de esta sesión. Si alguna vez `tsc` se queja de
> `Cannot find type definition file for 'vite/client'`, es que un `npm install` corrió con
> otra rama activa y podó el workspace: volvé a esta rama y reinstalá.

## 3. Lo que cambió en el contrato (y qué pantalla tiene que proveerlo)

El merge de `main` trajo cuatro cambios. Dos rompieron el typecheck y ya están resueltos; **los
otros dos son deuda de las pantallas que todavía no existen**:

| Tipo | Campo nuevo | Quién debe proveerlo | Por qué |
|---|---|---|---|
| `ChatRequestV1` | `history: ChatIntercambio[]` (≤4) y `clientRequestId` | **P-10** | Sin `history` el LLM no recuerda el turno anterior (`RN-02.2`). No hay persistencia en servidor (`RF-13`): **el cliente reenvía el historial en cada turno** |
| `ChatAccessRequest` | `confirmacion: true` | **P-16** | `RN-03.4`/`FE-03` exigen confirmación explícita del *kill switch* |
| `ReiniciarPerfilRequest` / `EliminarCuentaRequest` | `confirmacion: true` | ya resuelto en `endpoints.ts` | El diálogo de la pantalla sigue siendo obligatorio: el campo solo lo declara en el cable |
| `MetricasResponse` | `agregadoDeCuentas` | **P-15** | `ECU-09 §5` exige **cuatro** cifras, no dos |

## 4. El plan: A → B → C (`DIS-00 §5`)

| Paquete | Pantallas | Estado |
|---|---|---|
| **A · Acceso y cuenta** | P-01, P-02, P-03, P-04, P-13 | ⬜ *stubs* — **empezar por aquí** |
| **B · Acompañamiento** | P-05…P-09 (onboarding), P-10 (chat), P-11 (degradación), P-12 (contención) | ⬜ *stubs* |
| **C · Administración** | P-14, P-15, P-16 | ⬜ *stubs* |

Cada pantalla, con su ruta, sus estados clave y su mockup, está en `DIS-00 §2`. Los mockups
autocontenidos viven en `docs/08_diseno/mockups/` (galería en `index.html`).

## 5. Trampas ya verificadas contra las ECU — no volver a descubrirlas

Esto salió de leer las especificaciones al preparar el Paquete A. **Cada punto cita su fuente**;
si algo se contradice con el mockup, el mockup pierde (son de la fase de diseño y algunos
quedaron con texto anterior a las correcciones del `PDR-01`).

1. **P-13 · el mockup contradice al canon.** `p13_gestion_cuenta_datos.html` dice *«Todo es
   reversible, salvo eliminar la cuenta»* y le pone a reiniciar *«Puedes rehacerlo cuando
   quieras»*. **Falso**: `DIS-00 §3` lo corrigió en el hallazgo **D-02** del `PDR-01` —
   **reiniciar la caracterización es igual de irreversible**, borra `character` y deja al
   usuario **sin poder conversar** hasta rehacerla (`ECU-11 §11` paso 1, `§14` invariante).
   Las **dos** acciones irreversibles exigen confirmación con su advertencia; **revocar la
   personalización es la única reversible** y no es punitiva (`ECU-12 §14`).
2. **P-13 · revocar también se confirma.** Aunque `RevocarPersonalizacionRequest` no lleve
   `confirmacion` —su `FE-03` liga el `400` solo a «petición mal formada»—, `ECU-12 §11` paso 2
   y su `FA-03` (cancelar) **sí** piden el paso de confirmación en la interfaz. La asimetría
   está en la **advertencia**, no en la existencia del diálogo.
3. **P-13 · el diálogo de eliminar muestra el alcance como texto fijo del cliente.** `ECU-04
   §11` paso 1 enumera qué desaparece **antes** de confirmar; el `alcance` que devuelve la
   respuesta confirma lo **ya ejecutado**, no es una vista previa. No hay llamada al servidor
   para el paso 1.
4. **P-13 → P-01 tras eliminar.** `ECU-04 §11` paso 4 (corrección **D-05**): la cuenta ya no
   existe y P-13 exige sesión, así que el aviso final se ve en **P-01, estado «cuenta
   eliminada»**. Convención de la rama para esto: parámetro `?motivo=…`, como el
   `/login/?motivo=sesion_expirada` que ya emite `SesionProvider`.
5. **P-13 → P-08 tras reiniciar.** `ECU-11 §11` paso 5 manda a **caracterización**, no a todo
   el onboarding: la cuenta y el consentimiento quedan intactos. **Hueco a resolver en el
   Paquete B:** `POST /onboarding` exige igualmente `esAdulto`, `versionDisclosure` y
   `consentimientoBase`, así que rehacer *solo* la caracterización necesita decidir de dónde
   salen esos tres. No lo inventes en P-13: dejalo declarado.
6. **P-01 · «servicio no disponible» NO es el *kill switch*.** Es `FE-01` de `ECU-01`:
   *«el servicio está caído o en mantenimiento»*. Se implementa con `GET /api/v1/health` —
   que hoy no lo usa nadie. El *kill switch* es otra cosa y se ve en el chat como `409`.
7. **P-02 · registrarse NO autentica.** `ECU-02 §5` paso 3: confirma el alta y **ofrece el paso
   a CU-03**; la cuenta nace sin consentimiento ni cápsula. El **estado de éxito no está
   diseñado** en `DIS-00 §2` — es el hueco `RA-01` de `ECU-02 §10`, y cerrarlo toca a la fase
   de construcción, o sea a vos.
8. **P-02 · falta una frase que el mockup no tiene.** `RE-01` de `ECU-02` exige decir que, al
   no pedir correo, **el MVP no ofrece recuperación de contraseña** (`RN-04.6`), *«en vez de
   callarse»*. El mockup solo trae «No pedimos correo, documento ni teléfono».
9. **P-02 · `FA-01` (username en uso) conserva alias y contraseña** y vuelve al paso 2; `FE-01`
   (`400`) conserva **todo** lo diligenciado. Ninguno de los dos crea cuenta.
10. **P-03 · el error es genérico a propósito.** `FE-01` de `ECU-03`: texto idéntico para
    usuario y para contraseña, sin delatar cuál falló, y **sin ofrecer recuperación**.
11. **P-03 · el ruteo después de entrar.** `ECU-03 §5` paso 4 y `FA-01`: si el onboarding está
    completo → `/chat/`; si no → el onboarding. `FA-02`: el administrador entra por P-04 y va a
    `/plataforma-admin/`. Las guardas de `sesion/guardias.tsx` ya lo asumen.
12. **El `rol` no viene en la respuesta.** Ni `LoginResponse` ni `LoginAdminResponse` lo traen,
    pero `PistaDeSesion` lo necesita: lo fija la pantalla según por dónde entró
    (`/login` → `usuario`, `/login-admin` → `administrador`). **Eso es solo para renderizar**;
    la autorización real la hace el servidor en cada petición (`RNF-08`, `RN-03.7`).
    `LoginAdminResponse` tampoco trae `onboardingCompleto` — un administrador no hace
    onboarding; elegí un valor y **decí por qué en el código**.
13. **Mensajes de error: falta el mapeo.** `RF-26`/`P-11` prohíben mostrar códigos crudos, y
    `api/errores.ts` dejó explícito que traducir un `Fallo` a **copia** es trabajo de la
    pantalla, «en una fase posterior». Esa fase es esta: conviene un módulo único
    (`Fallo` → texto) en vez de repetir el `switch` en cada pantalla. Ojo con el `403`, que
    está sobrecargado: en `/chat` es «consentimiento base revocado» (`ECU-06 FE-09`) y en el
    resto es «rol insuficiente».

## 6. Convenciones de la rama que no se relajan

- **Cero hex fuera de `src/estilos/tema.css`** — lo hace cumplir `npm run lint:tokens`.
  Usá los roles semánticos (`bg-superficie`, `text-suave`, `border-borde`…), no los stops.
- **Solo pesos 400 y 500.** `DIS-01 §3` no tiene un solo *bold*: `font-semibold`/`font-bold`
  existen como utilidad pero **sin fuente cargada detrás**. No usarlos.
- **Sin modo oscuro** en esta pasada — decisión explícita de Fase 0a. Los roles están planos
  para que añadirlo después sea rellenar valores, no reestructurar.
- **La capa de API no lanza**: se decide con `if (r.ok)`, nunca con `try/catch`.
- **Comentario de cabecera en cada archivo explicando el *porqué***, no el *qué*. Es el estilo
  de toda la rama y es lo que hace revisable el código contra las ECU; cuando una decisión se
  aparta del mockup o del enunciado, se dice ahí mismo y se cita la fuente.

## 7. Verificación antes de commitear

```bash
npm run typecheck -w frontend && npm run lint:tokens -w frontend && npm run build -w frontend
```

Y **recorrer la pantalla en el navegador contra el mock**, no solo compilar: `lint:tokens` y
`tsc` no ven un layout roto ni una copia que contradice a su ECU. El mock no valida la cookie
de sesión y nunca manda `Retry-After`, así que el `429` sale sin número de espera — es
limitación del mock, no un defecto de la pantalla.

## 8. Lo que quedó en el stage

`frontend/src/componentes/Encabezado.tsx` — la barra superior que los 21 mockups repiten, en
tres variantes (pública, de sesión, admin). **Compila y pasa `lint:tokens`, pero no la usa
ninguna pantalla todavía.** Decisión que lleva escrita en su cabecera y conviene mantener: los
mockups dibujan la barra dentro de un marco redondeado de 600 px porque son maquetas —ese marco
es «el dispositivo», no un elemento de la interfaz—, así que aquí la barra es de ancho completo
y el centrado del contenido es responsabilidad de la pantalla.
