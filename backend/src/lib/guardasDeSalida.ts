/**
 * RN-02.3: filtro de salida del LLM (no riesgo, no claim clínico). Ningún
 * artefacto fija el mecanismo — se implementa simétrico al gate de entrada
 * (determinista, por patrón), con un set de PRUEBA que necesita la misma
 * revisión que las señales del gate antes de producción.
 */
const PATRONES_INSEGUROS_DE_SALIDA = [
  /tienes\s+(depresi[oó]n|un trastorno|ansiedad cl[ií]nica)/i,
  /est[aá]s\s+diagnosticad[oa]/i,
  /deber[ií]as\s+dejar\s+la\s+medicaci[oó]n/i,
];

const RESPUESTA_SUSTITUTA =
  "Prefiero no aventurarme a interpretar lo que sientes en esos términos. ¿Querés contarme un poco más?";

/** FA-02: sustituye toda la salida, nunca la entrega junto con el original. */
export function aplicarGuardasDeSalida(texto: string): string {
  const esInsegura = PATRONES_INSEGUROS_DE_SALIDA.some((patron) => patron.test(texto));
  return esInsegura ? RESPUESTA_SUSTITUTA : texto;
}

/**
 * RN-02.8: 350 tokens de salida. Sin tokenizer disponible (no se agrega una
 * dependencia nueva solo para esto), se aproxima por palabras — red de
 * seguridad defensiva: max_tokens ya se le pide a Groq en la llamada
 * (groq.ts), esto solo cubre que no lo respete.
 */
export function limitarTokensDeSalida(texto: string, maxAproximado: number): string {
  const palabras = texto.split(/\s+/);
  if (palabras.length <= maxAproximado) return texto;
  return palabras.slice(0, maxAproximado).join(" ") + "…";
}
