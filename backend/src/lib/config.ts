import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Character } from "contrato-api";
import type { ReferenciaDeDerivacion } from "contrato-api";

const s3 = new S3Client({});
const BUCKET = process.env.BUCKET_CONFIGURACION ?? "";

export interface ConfigSeguridad {
  senalesDePeligro: string[];
  contencion: { mensaje: string; recursos: ReferenciaDeDerivacion[] };
}

/**
 * SEG-01 §4: "la configuración se carga al inicializar la función y se
 * retiene en memoria; la ruta de fallback nunca hace una lectura remota".
 * Se cachea en una promesa a nivel de módulo — el entorno de ejecución de
 * Lambda se reusa entre invocaciones, así que en la práctica se carga una
 * vez por arranque en frío, igual que exige la restricción, y las
 * invocaciones siguientes no tocan la red.
 *
 * SENALES_DE_ULTIMO_RECURSO y CONTENCION_DE_ULTIMO_RECURSO son el "valor de
 * último recurso empaquetado con el código" que la misma restricción exige
 * si la carga de S3 falla: la contención, a diferencia de la derivación,
 * NO se puede degradar a "no responde". Son deliberadamente mínimos y de
 * PRUEBA — SEG-01 §7 declara el set real de señales como pendiente de
 * definir, idealmente con revisión de nivel 6. Sin números de teléfono
 * embebidos (SEG-01 §5): la derivación real se completa en
 * config/ayuda/contencion.json, no en código.
 */
const SENALES_DE_ULTIMO_RECURSO = [
  "quiero matarme",
  "me quiero suicidar",
  "voy a hacerme daño",
  "voy a matar a",
];

const CONTENCION_DE_ULTIMO_RECURSO: ConfigSeguridad["contencion"] = {
  mensaje:
    "No puedo atender una emergencia. Si hay peligro inmediato, por favor contacta a un " +
    "servicio de emergencia o acude a alguien de confianza ahora mismo. Si puedes hacerlo con " +
    "seguridad, busca ayuda humana: es la vía indicada.",
  recursos: [],
};

let cacheSeguridad: Promise<ConfigSeguridad> | null = null;
const cachePrompts = new Map<Character, Promise<string>>();

async function leerJsonDeS3<T>(key: string): Promise<T | null> {
  try {
    const respuesta = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const texto = await respuesta.Body?.transformToString();
    return texto ? (JSON.parse(texto) as T) : null;
  } catch {
    return null;
  }
}

export function obtenerConfigSeguridad(): Promise<ConfigSeguridad> {
  if (!cacheSeguridad) {
    cacheSeguridad = (async () => {
      const [senales, contencion] = await Promise.all([
        leerJsonDeS3<string[]>("config/ayuda/senales_gate.json"),
        leerJsonDeS3<ConfigSeguridad["contencion"]>("config/ayuda/contencion.json"),
      ]);
      return {
        senalesDePeligro: senales ?? SENALES_DE_ULTIMO_RECURSO,
        contencion: contencion ?? CONTENCION_DE_ULTIMO_RECURSO,
      };
    })();
  }
  return cacheSeguridad;
}

/**
 * No es la ruta de fallback (esa restricción es solo para SEG), así que
 * puede fallar si S3 no responde — se propaga y el handler lo traduce a un
 * 502. Igual se cachea en memoria por la misma razón de latencia/costo.
 */
export function obtenerSystemPrompt(character: Character): Promise<string> {
  if (!cachePrompts.has(character)) {
    cachePrompts.set(
      character,
      (async () => {
        const datos = await leerJsonDeS3<{ texto: string; version: string }>(
          `config/prompts/${character}.json`,
        );
        if (!datos) {
          throw new Error(`system prompt de ${character} no disponible en S3`);
        }
        return datos.texto;
      })(),
    );
  }
  return cachePrompts.get(character)!;
}
