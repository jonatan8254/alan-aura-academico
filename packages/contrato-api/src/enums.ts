/**
 * Los 11 enums de docs/07_casos_uso/clases/MC-01_cabeceras.txt, transcritos literalmente.
 * No se re-diseñan aquí — MC-01 es la fuente.
 */

export type Character = "alan" | "aura";

export type MoodSelfReport =
  | "muy_mal"
  | "mal"
  | "neutral"
  | "bien"
  | "muy_bien"
  | "prefiero_no_responder";

export type EnergySelfReport = "baja" | "media" | "alta" | "prefiero_no_responder";

export type ConversationGoal =
  | "sentirme_escuchado"
  | "calmarme"
  | "ordenar_ideas"
  | "dar_un_paso_pequeno"
  | "recibir_una_sugerencia_breve"
  | "prefiero_no_responder";

export type ResponseStyle =
  | "breve_y_directo"
  | "equilibrado"
  | "pausado_y_reflexivo"
  | "sin_preferencia";

export type EstadoConsentimiento = "otorgado" | "revocado";

export type EstadoConversacion = "activa" | "cerrada";

export type EstadoDisponibilidad = "habilitado" | "deshabilitado";

export type CapaConsentimiento = "base" | "personalizacion";

export type Rol = "usuario" | "administrador";

export type EstadoDirectorio = "activo" | "sin_consentimiento_vigente";
