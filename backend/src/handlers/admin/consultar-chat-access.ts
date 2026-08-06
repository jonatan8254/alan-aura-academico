import type { APIGatewayProxyHandler } from "aws-lambda";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { ConsultarChatAccessResponse, EstadoDisponibilidad } from "contrato-api";
import { doc, TABLA_ACCION_ADMINISTRATIVA, TABLA_CONFIGURACION } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

/**
 * CU-10 — lectura complementaria de `POST /admin/chat-access` (`chat-access.ts`, mismo recurso
 * REST, verbo distinto). Cierra el hueco declarado en `ECU-10 §11` paso 1: solo existía la
 * ruta de escritura, y la pantalla de administración necesitaba mostrar «el estado global
 * vigente y el último cambio registrado, con autor y fecha» sin tener de dónde leerlo.
 *
 * `pk = "GLOBAL"` y `ScanIndexForward: false` porque `TABLA_ACCION_ADMINISTRATIVA` ordena por
 * `fechaAccionId` (ISO 8601 + sufijo `#<uuid>`) — orden lexicográfico ascendente es orden
 * cronológico ascendente, así que descendente con `Limit: 1` trae la acción más reciente.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "administrador") return json(403, { error: "rol no autorizado" }); // FE-02

  const [config, ultimaAccion] = await Promise.all([
    doc.send(new GetCommand({ TableName: TABLA_CONFIGURACION, Key: { parametro: "kill_switch" } })),
    doc.send(
      new QueryCommand({
        TableName: TABLA_ACCION_ADMINISTRATIVA,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": "GLOBAL" },
        ScanIndexForward: false,
        Limit: 1,
      }),
    ),
  ]);

  // Fail-closed, igual que chatbotHabilitado(): sin el ítem, "deshabilitado".
  const estado: EstadoDisponibilidad =
    config.Item?.estado === "habilitado" ? "habilitado" : "deshabilitado";

  const ultimo = ultimaAccion.Items?.[0];
  const ultimoCambio =
    ultimo && typeof ultimo.autor === "string" && typeof ultimo.fecha === "string"
      ? { autor: ultimo.autor, fecha: ultimo.fecha }
      : null; // El kill switch nunca se tocó desde que existe la tabla de auditoría.

  return json(200, { estado, ultimoCambio } satisfies ConsultarChatAccessResponse);
};
