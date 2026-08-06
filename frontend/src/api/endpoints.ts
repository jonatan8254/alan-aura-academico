/**
 * endpoints.ts — 13 envoltorios delgados, uno por ruta de /api/v1 (CONTRATO_API_v1.md /
 * ARQ-01-D3). Cada uno solo fija el verbo, la ruta y el tipo — cero lógica propia; eso vive
 * en cliente.ts (transporte) y en hooks.ts (estado de React).
 *
 * Todos los tipos de request/response se importan desde `contrato-api`, nunca se redeclaran.
 */
import type {
  HealthResponse,
  RegistroRequest,
  RegistroResponse,
  LoginRequest,
  LoginResponse,
  LoginAdminRequest,
  LoginAdminResponse,
  LogoutRequest,
  LogoutResponse,
  OnboardingRequest,
  OnboardingResponse,
  ChatRequestV1,
  ChatResponseV1,
  ReiniciarPerfilRequest,
  ReiniciarPerfilResponse,
  RevocarPersonalizacionRequest,
  RevocarPersonalizacionResponse,
  EliminarCuentaRequest,
  EliminarCuentaResponse,
  DirectorioResponse,
  MetricasResponse,
  ChatAccessRequest,
  ChatAccessResponse,
} from "contrato-api";

import { pedir } from "./cliente";

export const revisarSalud = () => pedir<HealthResponse>("GET", "/health");

export const registrarse = (req: RegistroRequest) =>
  pedir<RegistroResponse>("POST", "/auth/registro", req);

export const iniciarSesion = (req: LoginRequest) =>
  pedir<LoginResponse>("POST", "/auth/login", req);

export const iniciarSesionAdmin = (req: LoginAdminRequest) =>
  pedir<LoginAdminResponse>("POST", "/auth/login-admin", req);

export const cerrarSesion = () =>
  pedir<LogoutResponse>("POST", "/auth/logout", {} satisfies LogoutRequest);

export const enviarOnboarding = (req: OnboardingRequest) =>
  pedir<OnboardingResponse>("POST", "/onboarding", req);

// contexto "chat": ver Discrepancia #2 en api/errores.ts — el 403 de esta ruta es
// "consentimiento base revocado" (ECU-06 FE-09), no "rol insuficiente".
export const chat = (req: ChatRequestV1) => pedir<ChatResponseV1>("POST", "/chat", req, "chat");

// `confirmacion: true` es literal en el contrato (ECU-11 RE-01/FE-03): el request no se
// puede armar sin confirmar, así que no hay nada que el llamador pueda decidir aquí y el
// envoltorio se mantiene sin argumentos, como `cerrarSesion`. La confirmación que le importa
// al usuario —el diálogo con la advertencia de irreversibilidad— es de la PANTALLA (P-13,
// DIS-00 §3), no de esta capa; este campo solo la declara en el cable.
export const reiniciarPerfil = () =>
  pedir<ReiniciarPerfilResponse>("POST", "/perfil/reiniciar", {
    confirmacion: true,
  } satisfies ReiniciarPerfilRequest);

export const revocarPersonalizacion = () =>
  pedir<RevocarPersonalizacionResponse>(
    "POST",
    "/perfil/personalizacion/revocar",
    {} satisfies RevocarPersonalizacionRequest,
  );

// Mismo patrón que `reiniciarPerfil` (ECU-04 FE-03). `revocarPersonalizacion` NO lo lleva, y
// no es un olvido: su FE-03 liga el 400 solo a "petición mal formada" — es la asimetría real
// entre las tres acciones de P-13, donde revocar es la única reversible.
export const eliminarCuenta = () =>
  pedir<EliminarCuentaResponse>("POST", "/cuenta/eliminar", {
    confirmacion: true,
  } satisfies EliminarCuentaRequest);

export const obtenerDirectorio = () => pedir<DirectorioResponse>("GET", "/admin/directorio");

export const obtenerMetricas = () => pedir<MetricasResponse>("GET", "/admin/metricas");

export const cambiarAccesoAlChat = (req: ChatAccessRequest) =>
  pedir<ChatAccessResponse>("POST", "/admin/chat-access", req);
