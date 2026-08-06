import type { APIGatewayProxyHandler } from "aws-lambda";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { RevocarPersonalizacionResponse } from "contrato-api";
import { doc, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

/**
 * CU-12. Solo cambia la capa de personalización del Consentimiento — la
 * capa base y la CapsulaDePerfil (character incluido) no se tocan (§4.1:
 * revocar ≠ reiniciar). El efecto real (los autorreportes dejan de viajar
 * al LLM) ya lo garantiza chat.ts, que consulta el estado de esta capa en
 * cada turno — no hace falta marcar nada en CAPSULA para lograrlo.
 *
 * "Marcados para descarte" (RE-05) de los autorreportes en sí —más allá de
 * dejar de usarse— no tiene mecanismo declarado en ARQ-01-D2/MC-01 (ni
 * campo, ni TTL parcial): se documenta como hueco, no se inventa un campo
 * nuevo sin que el dueño del diseño físico lo decida.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "usuario") return json(403, { error: "rol no autorizado" }); // FE-02

  try {
    JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" }); // FE-03
  }

  const fecha = new Date().toISOString();

  try {
    await doc.send(
      new UpdateCommand({
        TableName: TABLA_TITULAR,
        Key: { titularId: sesion.titularId, sk: "CONSENTIMIENTO#PERSONALIZACION" },
        UpdateExpression: "SET estado = :revocado, fecha = :fecha",
        // FA-01: si ya estaba revocada, no se repite el cambio (no se
        // pisa la fecha original) — se trata igual como éxito idempotente.
        ConditionExpression: "attribute_not_exists(estado) OR estado <> :revocado",
        ExpressionAttributeValues: { ":revocado": "revocado", ":fecha": fecha },
      }),
    );
  } catch (error) {
    if (!(error instanceof Error && error.name === "ConditionalCheckFailedException")) {
      throw error;
    }
  }

  return json(200, {
    estado: "personalizacion_revocada",
  } satisfies RevocarPersonalizacionResponse);
};
