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
 *
 * Los 4 autorreportes son opcionales (RN-01.4: "Ningún autorreporte de la
 * caracterización es obligatorio; el usuario puede omitir los 4.
 * Obligatorios son solo edad, capa base del consentimiento y character") —
 * antes se declaraban obligatorios por error.
 */
export interface OnboardingRequest {
  esAdulto: true;
  versionDisclosure: string;
  moodSelfReport?: MoodSelfReport;
  energySelfReport?: EnergySelfReport;
  conversationGoal?: ConversationGoal;
  responseStyle?: ResponseStyle;
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
 *
 * history/clientRequestId añadidos: ECU-06 §17 los lista como campos del
 * endpoint ("character, message, history (≤4), client_request_id") y no
 * estaban — sin history el LLM no tiene memoria del turno anterior (rompe
 * RN-02.2). No hay persistencia server-side (RF-13): el cliente reenvía el
 * historial en cada turno, el servidor no lo guarda entre peticiones.
 */
export interface ChatIntercambio {
  rol: "usuario" | "personaje";
  texto: string;
}
export interface ChatRequestV1 {
  texto: string;
  character: Character;
  /** Los últimos intercambios de la sesión actual, más reciente al final. Máximo 4 (RN-02.2). */
  history: ChatIntercambio[];
  /** Idempotencia del turno ante reintento (ECU-06 FE-06/FE-07). */
  clientRequestId: string;
}
export interface ChatResponseV1 {
  respuesta: string;
  modo: "ordinario" | "safety_fallback";
}
export type ChatStatus = 200 | 400 | 401 | 403 | 409 | 429 | 502 | 504;

/**
 * POST /api/v1/perfil/reiniciar (CU-11).
 * 400/403/500 añadidos tras la verificación exhaustiva (ECU-11 FE-02/03/04).
 *
 * confirmacion añadido: ECU-11 RE-01/FE-03 exigen confirmación EXPLÍCITA
 * del usuario ("confirmación ausente o petición mal formada" → 400) — a
 * diferencia de CU-12 (revocar), cuyo FE-03 no liga el 400 a una
 * confirmación ausente, solo a "petición mal formada". Literal `true`,
 * mismo patrón que consentimientoBase: el request no se puede armar sin
 * confirmar.
 */
export interface ReiniciarPerfilRequest {
  confirmacion: true;
}
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
 *
 * confirmacion añadido: ECU-04 FE-03 liga el 400 a "solicitud mal formada
 * o SIN CONFIRMACIÓN EXPLÍCITA" — mismo patrón que ReiniciarPerfilRequest.
 * El endpoint solo cubre los pasos 2–3 (ECU-04 §17): el paso 1 —mostrar el
 * alcance antes de confirmar— es responsabilidad del cliente, con un texto
 * fijo; alcance en la respuesta es la confirmación de lo ya ejecutado, no
 * una vista previa.
 */
export interface EliminarCuentaRequest {
  confirmacion: true;
}
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

/**
 * GET /api/v1/admin/metricas (CU-09, admin).
 * agregadoDeCuentas añadido: ECU-09 §5 exige CUATRO cifras —total de
 * cuentas y onboardings completados (cardinalidades de Usuario) además de
 * llamadas en 7 días y tasa técnica (de EventoOperativo)— y el contrato
 * solo tenía las dos últimas. AgregadoDeCuentas ya existía (lo usa
 * DirectorioResponse) — se reusa, no se duplica.
 */
export type MetricasRequest = Record<string, never>;
export interface MetricasResponse {
  agregadoDeCuentas: AgregadoDeCuentas;
  agregado: AgregadoDeUso;
  estadoDelChatbot: EstadoDisponibilidad;
}
export type MetricasStatus = 200 | 401 | 403;

/**
 * POST /api/v1/admin/chat-access (CU-10, admin — kill switch).
 * 400 añadido tras la verificación exhaustiva (ECU-10 FE-03).
 *
 * confirmacion añadido: RN-03.4 exige confirmación explícita y FE-03 liga
 * el 400 a "sin la confirmación exigida" — mismo patrón que
 * ReiniciarPerfilRequest/EliminarCuentaRequest.
 */
export interface ChatAccessRequest {
  estadoNuevo: EstadoDisponibilidad;
  confirmacion: true;
}
export interface ChatAccessResponse {
  estado: EstadoDisponibilidad;
}
export type ChatAccessStatus = 200 | 400 | 401 | 403;

/**
 * GET /api/v1/admin/chat-access (CU-10, admin) — lee el estado vigente del kill switch y el
 * último cambio auditado. Pendiente declarado hasta esta corrida: solo existía la ruta de
 * escritura de arriba; `ECU-10 §11` paso 1 exige que la pantalla «presente el estado global
 * vigente y el último cambio registrado, con autor y fecha», y no había de dónde leerlo.
 *
 * Mismo recurso REST que `ChatAccessRequest`/`ChatAccessResponse` (arriba), método distinto —
 * de ahí el nombre `Consultar*` en vez de reusar `ChatAccessResponse` para dos formas distintas.
 */
export type ConsultarChatAccessRequest = Record<string, never>;
export interface UltimoCambioDeAcceso {
  /** El ALIAS del administrador que hizo el cambio — nunca su `username` (RN-03.5). */
  autor: string;
  fecha: string;
}
export interface ConsultarChatAccessResponse {
  estado: EstadoDisponibilidad;
  /** `null` si el kill switch nunca se tocó desde que existe la tabla de auditoría. */
  ultimoCambio: UltimoCambioDeAcceso | null;
}
export type ConsultarChatAccessStatus = 200 | 401 | 403;
