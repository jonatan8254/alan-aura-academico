import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { doc, TABLA_TITULAR } from "./dynamo.js";

const LIMITE_DIARIO = 30; // RN-02.9
const LIMITE_POR_MINUTO = 3; // RN-02.9
const TTL_DIAS = 30; // PER-T5 / ARQ-01-D2

/**
 * ARQ-01-D5 delegaba el límite de 3/min a un "plan de uso" de API Gateway,
 * "por clave o por IP autenticada — mecanismo exacto de construcción". No
 * encaja con el modelo de sesión por cookie de este proyecto: los planes
 * de uso de API Gateway limitan por API key (no tenemos), y el throttling
 * de método/stage es global — todos los usuarios combinados, no por
 * usuario. Se implementa aquí, con el mismo patrón atómico que el límite
 * diario, para que sí sea per-usuario. Desviación declarada de ARQ-01-D5,
 * no silenciosa — su dueño puede registrarla como corrección formal.
 *
 * Ventana fija de 1 minuto (no deslizante): más simple, y el margen de
 * error de una ventana fija en el borde no importa a esta escala.
 */
export async function dentroDelLimitePorMinuto(titularId: string): Promise<boolean> {
  const minuto = Math.floor(Date.now() / 60_000);
  const ttl = Math.floor(Date.now() / 1000) + 120; // sobra con un par de minutos

  return incrementarSiNoSuperaElLimite(titularId, `CONTADOR_MIN#${minuto}`, LIMITE_POR_MINUTO, ttl);
}

/**
 * Incremento y comprobación en una sola UpdateItem condicional: si ya está
 * en el límite, la condición falla y no se incrementa — nadie queda
 * cobrado por un intento rechazado.
 */
export async function dentroDelLimiteDiario(titularId: string): Promise<boolean> {
  const fecha = new Date().toISOString().slice(0, 10);
  const ttl = Math.floor(Date.now() / 1000) + TTL_DIAS * 24 * 60 * 60;

  // "fecha" es campo declarado de este ítem en ARQ-01-D2; el contador por
  // minuto no tiene equivalente declarado, de ahí el parámetro opcional.
  return incrementarSiNoSuperaElLimite(titularId, `CONTADOR#${fecha}`, LIMITE_DIARIO, ttl, {
    fecha,
  });
}

async function incrementarSiNoSuperaElLimite(
  titularId: string,
  sk: string,
  limite: number,
  ttl: number,
  camposExtra?: Record<string, string>,
): Promise<boolean> {
  const asignacionesExtra = Object.keys(camposExtra ?? {})
    .map((campo) => `, ${campo} = :${campo}`)
    .join("");

  try {
    await doc.send(
      new UpdateCommand({
        TableName: TABLA_TITULAR,
        Key: { titularId, sk },
        // "ttl" es palabra reservada de DynamoDB — sin alias, el
        // UpdateExpression falla con ValidationException en runtime (no lo
        // detecta `cdk synth`, solo empaqueta código, no lo ejecuta).
        UpdateExpression: `ADD contador :uno SET #ttl = :ttl${asignacionesExtra}`,
        ConditionExpression: "attribute_not_exists(contador) OR contador < :limite",
        ExpressionAttributeNames: { "#ttl": "ttl" },
        ExpressionAttributeValues: {
          ":uno": 1,
          ":ttl": ttl,
          ":limite": limite,
          ...Object.fromEntries(
            Object.entries(camposExtra ?? {}).map(([campo, valor]) => [`:${campo}`, valor]),
          ),
        },
      }),
    );
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") {
      return false;
    }
    throw error;
  }
}
