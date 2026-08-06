import type { APIGatewayProxyHandler } from "aws-lambda";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import type { ReiniciarPerfilRequest, ReiniciarPerfilResponse } from "contrato-api";
import { doc, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

/**
 * CU-11. Borra la CapsulaDePerfil entera (character incluido) — Consentimiento
 * y Usuario no se tocan (§4.1: reiniciar ≠ revocar). Sin auditoría (RE-06
 * retirado en CDR-01 H-14: nadie pidió un registro de la acción de un
 * usuario sobre sus propios datos).
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "usuario") return json(403, { error: "rol no autorizado" }); // FE-02

  let cuerpo: ReiniciarPerfilRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" }); // FE-03
  }
  if (cuerpo.confirmacion !== true) {
    return json(400, { error: "confirmación explícita requerida" }); // FE-03, RE-01
  }

  try {
    await doc.send(
      new DeleteCommand({
        TableName: TABLA_TITULAR,
        Key: { titularId: sesion.titularId, sk: "CAPSULA" },
      }),
    );
    // FA-01: si no existía, DeleteItem es un no-op silencioso — idempotente
    // por construcción, no hace falta distinguir el caso en la respuesta.
    return json(200, {
      estado: "caracterizacion_reiniciada",
    } satisfies ReiniciarPerfilResponse);
  } catch {
    return json(500, { error: "no pudimos reiniciar tu caracterización" }); // FE-04
  }
};
