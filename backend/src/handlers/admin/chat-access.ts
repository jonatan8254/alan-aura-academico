import type { APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "node:crypto";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { ChatAccessRequest, ChatAccessResponse, EstadoDisponibilidad } from "contrato-api";
import { doc, TABLA_ACCION_ADMINISTRATIVA, TABLA_CONFIGURACION, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

// ARQ-01-D2: TTL = "vigencia del curso + 30 días" — la duración exacta del
// curso no está fijada en ningún artefacto; placeholder de 180 días.
const TTL_DIAS_PLACEHOLDER = 180;

/**
 * CU-10. Idempotente (FA-03): si el estado pedido ya rige, no se escribe
 * Configuracion de nuevo ni se crea AccionAdministrativa — evita auditar
 * un cambio que no ocurrió.
 *
 * `autor` = ALIAS del administrador, no el `titularId` desnudo de la sesión
 * ni su `username` (RN-03.5). Se resuelve con una lectura extra de PERFIL
 * porque la cookie de sesión solo firma `{titularId, rol}` (sesion.ts) — no
 * es "dato de Usuario" en el sentido de RE-01/PER-T2: es la identidad del
 * propio Administrador que actúa, no de un Usuario ajeno, y hace falta que
 * GET /admin/chat-access (lectura complementaria de esta ruta) pueda
 * mostrar algo legible.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "administrador") return json(403, { error: "rol no autorizado" }); // FE-02

  let cuerpo: ChatAccessRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }
  if (
    (cuerpo.estadoNuevo !== "habilitado" && cuerpo.estadoNuevo !== "deshabilitado") ||
    cuerpo.confirmacion !== true
  ) {
    return json(400, { error: "estadoNuevo y confirmación explícita son requeridos" }); // FE-03
  }

  const actual = await doc.send(
    new GetCommand({ TableName: TABLA_CONFIGURACION, Key: { parametro: "kill_switch" } }),
  );
  const estadoVigente: EstadoDisponibilidad =
    actual.Item?.estado === "habilitado" ? "habilitado" : "deshabilitado";

  if (estadoVigente === cuerpo.estadoNuevo) {
    return json(200, { estado: estadoVigente } satisfies ChatAccessResponse); // FA-03
  }

  const fecha = new Date().toISOString();
  const ttl = Math.floor(Date.now() / 1000) + TTL_DIAS_PLACEHOLDER * 24 * 60 * 60;

  const perfilAdmin = await doc.send(
    new GetCommand({ TableName: TABLA_TITULAR, Key: { titularId: sesion.titularId, sk: "PERFIL" } }),
  );
  // Sesión válida con rol administrador ya verificado arriba: PERFIL tiene
  // que existir. El fallback al titularId es solo para no reventar la
  // acción si el dato viniera corrupto — nunca debería ejercitarse.
  const autor =
    typeof perfilAdmin.Item?.alias === "string" ? perfilAdmin.Item.alias : sesion.titularId;

  await doc.send(
    new UpdateCommand({
      TableName: TABLA_CONFIGURACION,
      Key: { parametro: "kill_switch" },
      UpdateExpression: "SET estado = :estado",
      ExpressionAttributeValues: { ":estado": cuerpo.estadoNuevo },
    }),
  );
  await doc.send(
    new PutCommand({
      TableName: TABLA_ACCION_ADMINISTRATIVA,
      Item: {
        pk: "GLOBAL",
        // La clave de ordenación real de esta tabla es "fechaAccionId"
        // (data-stack.ts), no "sk" — único caso entre las 4 tablas que no
        // usa "sk" como nombre. Bug real: DynamoDB rechazó el Put con
        // "Missing the key fechaAccionId in the item".
        fechaAccionId: `${fecha}#${randomUUID()}`,
        autor,
        fecha,
        accion: `kill_switch:${cuerpo.estadoNuevo}`,
        ttl,
      },
    }),
  );

  return json(200, { estado: cuerpo.estadoNuevo } satisfies ChatAccessResponse);
};
