/**
 * C_GateDeSeguridad.evaluarPeligroExplicito (MC-01). Filtro determinista
 * por coincidencia de texto (SEG-01 §4: "¿coincide con señal de peligro
 * explícito (config)?") — no es un clasificador, no llama al LLM. No
 * detecta peligro implícito por diseño (SEG-01 §2, limitación declarada).
 */
export function evaluarPeligroExplicito(texto: string, senalesDePeligro: string[]): boolean {
  const normalizado = texto.toLowerCase();
  return senalesDePeligro.some((senal) => normalizado.includes(senal.toLowerCase()));
}
