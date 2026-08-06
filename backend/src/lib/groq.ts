import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// CAPSULA_CONTEXTO.md: "Motor conversacional: Groq API (gpt-oss-20b)". El id
// exacto del modelo en la API de Groq no está verificado contra su
// documentación en vivo — confirmar antes del primer cdk deploy real.
export const MODELO_GROQ = "openai/gpt-oss-20b";

/**
 * Presupuesto de GENERACIÓN, que no es lo mismo que el límite de salida visible.
 *
 * BUG REAL, corregido el 2026-08-06. Aquí decía `350` —el límite de RN-02.8— y se enviaba
 * como `max_tokens`. Pero `gpt-oss-20b` es un modelo de RAZONAMIENTO: el presupuesto cuenta
 * los tokens de razonamiento ADEMÁS de los de respuesta. Cuando el modelo razonaba mucho
 * —típico con mensajes ambiguos («1», «4») o con preguntas que piden comparar varias
 * opciones— agotaba los 350 razonando y devolvía `content: ""` con `finish_reason: "length"`.
 * El usuario veía una burbuja vacía.
 *
 * Reproducido contra Groq real: 2 de 3 mensajes que inducen razonamiento largo volvieron
 * vacíos; uno corto («?») respondió con normalidad.
 *
 * RN-02.8 sigue vigente y se sigue cumpliendo: limita la RESPUESTA VISIBLE a ~350 tokens, y
 * quien lo hace cumplir es `limitarTokensDeSalida()` en guardasDeSalida.ts, del lado de la
 * salida ya generada. Este número solo le da al modelo espacio para pensar antes de escribir.
 *
 * A ~500 tokens/s del modelo, 2000 tokens son ~4s — holgado dentro de los 20s de RN-02.9.
 */
const MAX_TOKENS_GENERACION = 2000;
const PRESUPUESTO_TOTAL_MS = 20_000; // RN-02.9 — total, no por intento (ver generar())

const smClient = new SecretsManagerClient({});
let apiKeyCache: Promise<string> | null = null;

function obtenerApiKey(): Promise<string> {
  if (!apiKeyCache) {
    apiKeyCache = smClient
      .send(new GetSecretValueCommand({ SecretId: process.env.GROQ_API_KEY_ARN }))
      .then((respuesta) => {
        if (!respuesta.SecretString) throw new Error("GroqApiKey sin SecretString");
        return respuesta.SecretString;
      });
  }
  return apiKeyCache;
}

export interface MensajeGroq {
  role: "system" | "user" | "assistant";
  content: string;
}

export class TimeoutLlmError extends Error {}
export class ProveedorNoDisponibleError extends Error {}

async function llamarUnaVez(
  mensajes: MensajeGroq[],
  timeoutMs: number,
): Promise<{ texto: string; latenciaMs: number }> {
  const apiKey = await obtenerApiKey();
  const inicio = Date.now();
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const respuesta = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODELO_GROQ,
        messages: mensajes,
        max_tokens: MAX_TOKENS_GENERACION,
      }),
      signal: controller.signal,
    });

    if (!respuesta.ok) {
      throw new ProveedorNoDisponibleError(`Groq respondió ${respuesta.status}`);
    }

    const datos = (await respuesta.json()) as {
      choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
    };
    const eleccion = datos.choices?.[0];
    const texto = eleccion?.message?.content;
    if (typeof texto !== "string") {
      throw new ProveedorNoDisponibleError("respuesta de Groq sin contenido");
    }

    // Una cadena VACÍA pasaba el `typeof` de arriba —`"" ` sí es string— y llegaba entera
    // hasta la pantalla como una burbuja en blanco, con HTTP 200 y modo "ordinario". Un turno
    // sin texto no es una respuesta: se trata como fallo del proveedor, que es lo que de
    // verdad ocurrió, y así entra en la ruta de reintento de FE-06 en vez de fingir éxito.
    if (texto.trim() === "") {
      throw new ProveedorNoDisponibleError(
        `Groq devolvió contenido vacío (finish_reason: ${eleccion?.finish_reason ?? "desconocido"})`,
      );
    }

    return { texto, latenciaMs: Date.now() - inicio };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TimeoutLlmError(`Groq no respondió en ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * FE-06: máx. 1 reintento ante fallos transitorios. FE-07 (timeout) es
 * expreso en que NO hay reintento automático.
 *
 * El presupuesto de 20s (RN-02.9) es TOTAL, no por intento: API Gateway
 * REST tiene un tope duro de integración de 29s, sin excepción — 20s +
 * 20s de un reintento ingenuo (40s) lo superaría y API Gateway cortaría
 * la respuesta antes de que el handler termine. El reintento solo ocurre
 * si sobra presupuesto real tras el primer fallo rápido (no-timeout); si
 * el primer intento ya agotó el presupuesto, se propaga sin reintentar.
 */
export async function generar(
  mensajes: MensajeGroq[],
): Promise<{ texto: string; latenciaMs: number }> {
  const limite = Date.now() + PRESUPUESTO_TOTAL_MS;

  try {
    return await llamarUnaVez(mensajes, PRESUPUESTO_TOTAL_MS);
  } catch (error) {
    if (error instanceof TimeoutLlmError) throw error;

    const restante = limite - Date.now();
    if (restante <= 1000) throw error; // sin margen real para un segundo intento

    return await llamarUnaVez(mensajes, restante);
  }
}
