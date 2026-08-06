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

const LIMITE_INTENTOS_LOGIN_POR_MINUTO = 5;

/**
 * Freno de fuerza bruta para `/auth/login` y `/auth/login-admin`. Bug real,
 * no una feature nueva: `LoginStatus`/`LoginAdminStatus` declaran `429`
 * desde que existe el contrato, y ningún handler lo emitía — no había
 * ningún límite antes de esta función.
 *
 * Clave por USERNAME, no por IP. La amenaza que importa aquí es adivinar la
 * contraseña de UNA cuenta, y el username —aunque lo declare quien
 * ataca— es la identidad que se protege, con el mismo criterio que ya usa
 * el límite de chat (ahí la identidad viene de una sesión válida; aquí
 * todavía no existe, así que es lo único disponible). Limitar también por
 * IP queda fuera de esta corrida: ningún artefacto lo pide, y añade una
 * segunda decisión de diseño —qué IP, detrás de qué proxy— sin necesidad
 * probada.
 *
 * Prefijo `LOGIN#` para no compartir espacio de claves con el contador de
 * chat (usa el `titularId` desnudo) ni con el *lock* de username de
 * `registro.ts` (`USERNAME#<username>` sin sufijo). Vive en `TABLA_TITULAR`
 * como un ítem más, pero sin el atributo `username`, así que no aparece en
 * `GSI-1-username` (índice disperso: un ítem sin el atributo indexado no se
 * proyecta).
 */
export async function dentroDelLimiteDeIntentosDeLogin(username: string): Promise<boolean> {
  const minuto = Math.floor(Date.now() / 60_000);
  const ttl = Math.floor(Date.now() / 1000) + 120;

  return incrementarSiNoSuperaElLimite(
    `LOGIN#${username}`,
    `CONTADOR_MIN#${minuto}`,
    LIMITE_INTENTOS_LOGIN_POR_MINUTO,
    ttl,
  );
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
