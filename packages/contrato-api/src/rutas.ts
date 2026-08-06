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

/**
 * POST /api/v1/onboarding (CU-05, incluye character de CU-14 por ARQ-01-D3 §1).
 *
 * esAdulto/versionDisclosure (ECU-05 paso 3) añadidos tras la verificación
 * exhaustiva. ECU-05 §17 nunca listó el paso 3 en el endpoint (solo 5, 7, 8):
 * FE-01 (menor de edad) no crea nada — lo resuelve el frontend solo, con
 * POST /api/v1/auth/logout, sin llegar a llamar esta ruta. Por eso
 * esAdulto es `true` literal, igual que consentimientoBase: el request
 * físicamente no se puede armar para un menor.
 */
export interface OnboardingRequest {
  esAdulto: true;
  versionDisclosure: string;
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
/** 403 retirado: ningún flujo de ECU-05 lo respalda para esta ruta (igual que el 409 de /cuenta/eliminar). */
export type OnboardingStatus = 200 | 400 | 401;

/**
 * POST /api/v1/chat (CU-06, CU-07 extend, CU-13 vía campo character).
 * 409 (kill switch activo, ECU-06 FE-04 / ECU-13 FE-01) y 502 (proveedor LLM
 * no disponible, ECU-06 FE-06) añadidos tras la verificación exhaustiva de
 * H-09/ARQ-01-D3 §N+1 punto 3 — DR-06.puml ya diseñaba estas dos pantallas
 * de error sin que el contrato las tuviera.
 */
export interface ChatRequestV1 {
  texto: string;
  character: Character;
}
export interface ChatResponseV1 {
  respuesta: string;
  modo: "ordinario" | "safety_fallback";
}
export type ChatStatus = 200 | 400 | 401 | 403 | 409 | 429 | 502 | 504;

/**
 * POST /api/v1/perfil/reiniciar (CU-11). Sin cuerpo de request.
 * 400/403/500 añadidos tras la verificación exhaustiva (ECU-11 FE-02/03/04).
 */
export type ReiniciarPerfilRequest = Record<string, never>;
export interface ReiniciarPerfilResponse {
  estado: "caracterizacion_reiniciada";
}
export type ReiniciarPerfilStatus = 200 | 400 | 401 | 403 | 500;

/**
 * POST /api/v1/perfil/personalizacion/revocar (CU-12 — cierra RA-01). Sin cuerpo de request.
 * 400/403 añadidos tras la verificación exhaustiva (ECU-12 FE-02/03).
 */
export type RevocarPersonalizacionRequest = Record<string, never>;
export interface RevocarPersonalizacionResponse {
  estado: "personalizacion_revocada";
}
export type RevocarPersonalizacionStatus = 200 | 400 | 401 | 403;

/**
 * POST /api/v1/cuenta/eliminar (CU-04).
 * 400/403 añadidos (ECU-04 FE-02/03). El 409 original se retira: ningún
 * flujo de ECU-04 lo justifica; 500 lo reemplaza para FE-04 (cascada
 * interrumpida), por simetría con el FE-04 de ECU-11, que sí es explícito.
 */
export type EliminarCuentaRequest = Record<string, never>;
export interface EliminarCuentaResponse {
  alcance: AlcanceDeBorrado;
}
export type EliminarCuentaStatus = 200 | 400 | 401 | 403 | 500;

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

/**
 * POST /api/v1/admin/chat-access (CU-10, admin — kill switch).
 * 400 añadido tras la verificación exhaustiva (ECU-10 FE-03).
 */
export interface ChatAccessRequest {
  estadoNuevo: EstadoDisponibilidad;
}
export interface ChatAccessResponse {
  estado: EstadoDisponibilidad;
}
export type ChatAccessStatus = 200 | 400 | 401 | 403;
