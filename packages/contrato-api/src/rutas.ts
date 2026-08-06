/**
 * Contrato de las 13 rutas de /api/v1 fijadas en ARQ-01-D3
 * (docs/10_arquitectura/ARQ-01_diseno_fisico.md). Un tipo Request y un tipo
 * Response por ruta, más los códigos de estado que declara la tabla de D3.
 *
 * Este archivo es la fuente para docs/10_arquitectura/CONTRATO_API_v1.md —
 * si el contrato cambia, se cambia aquí primero.
 */
import {
  Character,
  MoodSelfReport,
  EnergySelfReport,
  ConversationGoal,
  ResponseStyle,
  EstadoDisponibilidad,
} from "./enums.js";
import {
  FilaDeDirectorio,
  AgregadoDeCuentas,
  AgregadoDeUso,
  AlcanceDeBorrado,
} from "./entidades.js";

/** GET /api/v1/health */
export interface HealthResponse {
  estado: "ok";
}
export type HealthStatus = 200;

/** POST /api/v1/auth/registro (CU-02) */
export interface RegistroRequest {
  username: string;
  alias: string;
  contrasena: string;
}
export interface RegistroResponse {
  titularId: string;
}
export type RegistroStatus = 201 | 400 | 409;

/** POST /api/v1/auth/login (CU-03) */
export interface LoginRequest {
  username: string;
  contrasena: string;
}
export interface LoginResponse {
  titularId: string;
  alias: string;
  onboardingCompleto: boolean;
}
export type LoginStatus = 200 | 400 | 401 | 429;

/** POST /api/v1/auth/login-admin (CU-03, administrador) */
export interface LoginAdminRequest {
  username: string;
  contrasena: string;
}
export interface LoginAdminResponse {
  titularId: string;
  alias: string;
}
export type LoginAdminStatus = 200 | 400 | 401 | 429;

/** POST /api/v1/auth/logout (CU-03 — cierra RA-01). Sin cuerpo de request. */
export type LogoutRequest = Record<string, never>;
export interface LogoutResponse {
  estado: "sesion_cerrada";
}
export type LogoutStatus = 200 | 401;

/** POST /api/v1/onboarding (CU-05, incluye character de CU-14 por ARQ-01-D3 §1) */
export interface OnboardingRequest {
  moodSelfReport: MoodSelfReport;
  energySelfReport: EnergySelfReport;
  conversationGoal: ConversationGoal;
  responseStyle: ResponseStyle;
  character: Character;
  consentimientoBase: true;
  consentimientoPersonalizacion: boolean;
}
export interface OnboardingResponse {
  onboardingCompleto: true;
}
export type OnboardingStatus = 200 | 400 | 401 | 403;

/** POST /api/v1/chat (CU-06, CU-07 extend, CU-13 vía campo character) */
export interface ChatRequestV1 {
  texto: string;
  character: Character;
}
export interface ChatResponseV1 {
  respuesta: string;
  modo: "ordinario" | "safety_fallback";
}
export type ChatStatus = 200 | 400 | 401 | 403 | 429 | 504;

/** POST /api/v1/perfil/reiniciar (CU-11). Sin cuerpo de request. */
export type ReiniciarPerfilRequest = Record<string, never>;
export interface ReiniciarPerfilResponse {
  estado: "caracterizacion_reiniciada";
}
export type ReiniciarPerfilStatus = 200 | 401;

/** POST /api/v1/perfil/personalizacion/revocar (CU-12 — cierra RA-01). Sin cuerpo de request. */
export type RevocarPersonalizacionRequest = Record<string, never>;
export interface RevocarPersonalizacionResponse {
  estado: "personalizacion_revocada";
}
export type RevocarPersonalizacionStatus = 200 | 401;

/** POST /api/v1/cuenta/eliminar (CU-04) */
export type EliminarCuentaRequest = Record<string, never>;
export interface EliminarCuentaResponse {
  alcance: AlcanceDeBorrado;
}
export type EliminarCuentaStatus = 200 | 401 | 409;

/** GET /api/v1/admin/directorio (CU-08, admin) */
export type DirectorioRequest = Record<string, never>;
export interface DirectorioResponse {
  filas: FilaDeDirectorio[];
  agregado: AgregadoDeCuentas;
}
export type DirectorioStatus = 200 | 401 | 403;

/** GET /api/v1/admin/metricas (CU-09, admin) */
export type MetricasRequest = Record<string, never>;
export interface MetricasResponse {
  agregado: AgregadoDeUso;
  estadoDelChatbot: EstadoDisponibilidad;
}
export type MetricasStatus = 200 | 401 | 403;

/** POST /api/v1/admin/chat-access (CU-10, admin — kill switch) */
export interface ChatAccessRequest {
  estadoNuevo: EstadoDisponibilidad;
}
export interface ChatAccessResponse {
  estado: EstadoDisponibilidad;
}
export type ChatAccessStatus = 200 | 401 | 403;
