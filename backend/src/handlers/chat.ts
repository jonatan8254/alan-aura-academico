import type { APIGatewayProxyHandler } from "aws-lambda";
import type { ChatRequestV1, ChatResponseV1 } from "contrato-api";
import { verificarSesion } from "../lib/sesion.js";
import { json } from "../lib/respuestas.js";
import { chatbotHabilitado } from "../lib/disponibilidad.js";
import { leerEstadoDelTitular } from "../lib/perfil.js";
import { dentroDelLimiteDiario, dentroDelLimitePorMinuto } from "../lib/limites.js";
import { evaluarPeligroExplicito } from "../lib/gate.js";
import { obtenerConfigSeguridad, obtenerSystemPrompt } from "../lib/config.js";
import { generar, MODELO_GROQ, TimeoutLlmError, type MensajeGroq } from "../lib/groq.js";
import { aplicarGuardasDeSalida, limitarTokensDeSalida } from "../lib/guardasDeSalida.js";
import { registrarEventoOperativo } from "../lib/eventoOperativo.js";

const MAX_CARACTERES = 2500; // RN-02.8

/**
 * RN-02.2 habla de «hasta 4 INTERCAMBIOS de la sesión actual», y un intercambio es una ida y
 * vuelta: turno del usuario + respuesta del personaje. Son 8 mensajes, no 4.
 *
 * BUG REAL, corregido el 2026-08-06. Esto valía `4` y se comparaba contra `history.length`,
 * que es una lista PLANA de mensajes (`ChatIntercambio` modela UN mensaje, no un par — el
 * nombre del tipo es lo que indujo el error). El efecto: el modelo recibía solo 2 idas y
 * vueltas, la mitad de la memoria que el canon concede, y «olvidaba» el principio de la
 * conversación mucho antes de lo previsto. Verificado contra el backend real: al cuarto
 * mensaje, el primero ya había caído del historial.
 */
const MAX_MENSAJES_HISTORIAL = 8; // = 4 intercambios (RN-02.2, C-4, RNF-04)
const MAX_TOKENS_SALIDA_APROX = 350; // RN-02.8, red de seguridad ver guardasDeSalida.ts

/**
 * CU-06/CU-07(extend)/CU-13(vía character). Orden de verificación, calcado
 * de ECU-06 §9/§11/§13: sesión → rol → kill switch → capa base del
 * consentimiento (paso 1) → entrada válida → límite diario (paso 2) → gate
 * de seguridad (paso 3) → LLM (paso 4-5) → guardas de salida + evento
 * operativo (paso 6).
 *
 * El límite de 20 mensajes/sesión (RN-02.8) NO se aplica aquí: no hay
 * ninguna entidad "Conversacion" en ARQ-01-D2 (es efímera por diseño, RF-13)
 * y el server no guarda estado entre turnos — el conteo de turnos de la
 * sesión es responsabilidad del frontend, que sí sabe cuántos lleva.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "usuario") return json(403, { error: "rol no autorizado" }); // FE-02, PRE-02

  if (!(await chatbotHabilitado())) {
    return json(409, { error: "el chat está temporalmente deshabilitado" }); // FE-04
  }

  const estado = await leerEstadoDelTitular(sesion.titularId);
  if (!estado.consentimientoBaseOtorgado || !estado.capsula) {
    // FE-09. Cápsula ausente con capa base otorgada no debería ocurrir —
    // onboarding las escribe juntas en una sola transacción (ARQ-01-D2) —
    // pero si pasara, el remedio para el usuario es el mismo: rehacer CU-05.
    return json(403, { error: "consentimiento base no otorgado" });
  }

  let cuerpo: ChatRequestV1;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }

  if (!cuerpo.texto || cuerpo.texto.length > MAX_CARACTERES) {
    return json(400, {
      error: `el mensaje debe tener entre 1 y ${MAX_CARACTERES} caracteres`,
    }); // FE-03
  }
  if (!Array.isArray(cuerpo.history) || cuerpo.history.length > MAX_MENSAJES_HISTORIAL) {
    return json(400, {
      error: `history admite hasta ${MAX_MENSAJES_HISTORIAL} mensajes (4 intercambios)`,
    });
  }
  // Bug real, corregido: sin esto, un `character` fuera del enum llegaba
  // intacto hasta `obtenerSystemPrompt` (abajo), donde fallaba al buscar un
  // objeto de S3 que no existe y salía como 502 "el proveedor no está
  // disponible" — copia engañosa para lo que en realidad es una entrada
  // mal formada. Comparación literal, mismo patrón que `estadoNuevo` en
  // admin/chat-access.ts.
  if (cuerpo.character !== "alan" && cuerpo.character !== "aura") {
    return json(400, { error: "character debe ser alan o aura" });
  }

  if (!(await dentroDelLimitePorMinuto(sesion.titularId))) {
    return json(429, { error: "límite de mensajes por minuto alcanzado" }); // FE-05
  }
  if (!(await dentroDelLimiteDiario(sesion.titularId))) {
    return json(429, { error: "límite diario de mensajes alcanzado" }); // FE-05
  }

  const configSeguridad = await obtenerConfigSeguridad();
  if (evaluarPeligroExplicito(cuerpo.texto, configSeguridad.senalesDePeligro)) {
    // RN-05 / SEG-R2: responde el fallback, no el LLM. No se invoca a Groq.
    await registrarEventoOperativo({ resultado: "fallback" });
    return json(200, {
      respuesta: configSeguridad.contencion.mensaje,
      modo: "safety_fallback",
    } satisfies ChatResponseV1);
  }

  let systemPrompt: string;
  try {
    systemPrompt = await obtenerSystemPrompt(cuerpo.character);
  } catch {
    return json(502, { error: "el proveedor no está disponible" }); // config de persona inalcanzable
  }

  const mensajes: MensajeGroq[] = [{ role: "system", content: systemPrompt }];

  // RE-01/PRE-03.1: los autorreportes solo viajan con la capa de
  // personalización otorgada; character siempre viaja (vía el system prompt).
  if (estado.consentimientoPersonalizacionOtorgado) {
    mensajes.push({
      role: "system",
      content:
        `Contexto del usuario — ánimo: ${estado.capsula.moodSelfReport ?? "no indicado"}, ` +
        `energía: ${estado.capsula.energySelfReport ?? "no indicado"}, ` +
        `objetivo: ${estado.capsula.conversationGoal ?? "no indicado"}, ` +
        `estilo preferido: ${estado.capsula.responseStyle ?? "no indicado"}.`,
    });
  }

  for (const intercambio of cuerpo.history.slice(-MAX_MENSAJES_HISTORIAL)) {
    mensajes.push({
      role: intercambio.rol === "usuario" ? "user" : "assistant",
      content: intercambio.texto,
    });
  }
  mensajes.push({ role: "user", content: cuerpo.texto });

  try {
    const { texto, latenciaMs } = await generar(mensajes);
    const salidaSegura = limitarTokensDeSalida(
      aplicarGuardasDeSalida(texto),
      MAX_TOKENS_SALIDA_APROX,
    );
    await registrarEventoOperativo({ resultado: "ok", latencia: latenciaMs, modelo: MODELO_GROQ });
    return json(200, { respuesta: salidaSegura, modo: "ordinario" } satisfies ChatResponseV1);
  } catch (error) {
    await registrarEventoOperativo({ resultado: "error", modelo: MODELO_GROQ });
    if (error instanceof TimeoutLlmError) {
      return json(504, { error: "el proveedor no respondió a tiempo" }); // FE-07
    }
    return json(502, { error: "el proveedor no está disponible" }); // FE-06
  }
};
