/**
 * Tipos de las clases de dominio y de transferencia de MC-01_cabeceras.txt,
 * reducidos a sus campos (atributos), no a sus operaciones — este paquete es
 * el contrato de datos, no el modelo de comportamiento.
 *
 * IDs y claves añadidos según ARQ-01-D2 (no estaban en MC-01: COD-01 §8 los
 * declaraba hueco, ARQ-01 los cierra).
 */
import {
  Character,
  MoodSelfReport,
  EnergySelfReport,
  ConversationGoal,
  ResponseStyle,
  EstadoConsentimiento,
  EstadoConversacion,
  EstadoDisponibilidad,
  CapaConsentimiento,
  Rol,
  EstadoDirectorio,
} from "./enums.js";

export interface Usuario {
  titularId: string;
  username: string;
  alias: string;
  rol: Rol;
  esAdulto: boolean;
  versionDisclosure: string;
  fechaDeRegistro: string;
  estado: EstadoDirectorio;
}

export interface Administrador {
  titularId: string;
  username: string;
  alias: string;
  rol: Rol;
}

export interface Consentimiento {
  capa: CapaConsentimiento;
  estado: EstadoConsentimiento;
  fecha: string;
  version: string;
}

export interface CapsulaDePerfil {
  moodSelfReport: MoodSelfReport;
  energySelfReport: EnergySelfReport;
  conversationGoal: ConversationGoal;
  responseStyle: ResponseStyle;
  character: Character;
  schemaVersion: string;
  consentVersion: string;
}

export interface Conversacion {
  estado: EstadoConversacion;
  character: Character;
}

export interface Mensaje {
  texto: string;
  momento: string;
  autor: "usuario" | "personaje";
}

export interface EventoDeSeguridad {
  momento: string;
  modo: string;
}

export interface RecursoDeAyuda {
  nombreDelRecurso: string;
  formaDeContacto: string;
}

export interface DisponibilidadDelChatbot {
  estado: EstadoDisponibilidad;
}

/** Tipos de transferencia (DTO) de MC-01_cabeceras.txt, marcados <<solucion>>. */

export interface FilaDeDirectorio {
  alias: string;
  idTruncado: string;
  fechaDeRegistro: string;
  estado: EstadoDirectorio;
  completoElOnboarding: boolean;
}

export interface AgregadoDeCuentas {
  totalDeCuentas: number;
  onboardingsCompletados: number;
}

export interface AgregadoDeUso {
  llamadasAlChatEnSieteDias: number;
  tasaTecnicaDeExitoYError: number;
}

export interface AlcanceDeBorrado {
  registrosQueDesapareceran: string[];
  esIrreversible: boolean;
  dejaraSinAccesoAlChat: boolean;
}

export interface ReferenciaDeDerivacion {
  nombreDelRecurso: string;
  formaDeContacto: string;
}
