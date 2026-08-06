/**
 * Datos de ejemplo en memoria para el mock server. No hay persistencia real:
 * cada proceso arranca con este estado y lo muta en memoria mientras corre.
 */
import type {
  FilaDeDirectorio,
  AgregadoDeCuentas,
  AgregadoDeUso,
  EstadoDisponibilidad,
} from "contrato-api";

export const directorio: FilaDeDirectorio[] = [
  {
    alias: "visitante_calmado",
    idTruncado: "a1b2c3",
    fechaDeRegistro: "2026-08-01",
    estado: "activo",
    completoElOnboarding: true,
  },
  {
    alias: "otro_usuario",
    idTruncado: "d4e5f6",
    fechaDeRegistro: "2026-08-03",
    estado: "sin_consentimiento_vigente",
    completoElOnboarding: false,
  },
];

export const agregadoDeCuentas: AgregadoDeCuentas = {
  totalDeCuentas: directorio.length,
  onboardingsCompletados: directorio.filter((f) => f.completoElOnboarding).length,
};

export const agregadoDeUso: AgregadoDeUso = {
  llamadasAlChatEnSieteDias: 42,
  tasaTecnicaDeExitoYError: 0.97,
};

export const estado = {
  chatbot: "habilitado" as EstadoDisponibilidad,
};

export const respuestasDeEjemplo = [
  "Cuéntame un poco más sobre eso.",
  "Suena como un día difícil. ¿Qué necesitarías ahora mismo?",
  "Vamos con calma, un paso a la vez.",
];
