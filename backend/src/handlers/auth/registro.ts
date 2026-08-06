import type { APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "node:crypto";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import type { RegistroRequest, RegistroResponse } from "contrato-api";
import { doc, TABLA_TITULAR } from "../../lib/dynamo.js";
import { hashContrasena } from "../../lib/contrasenas.js";
import { json } from "../../lib/respuestas.js";

/**
 * ECU-02. La tabla Titular no tiene a "username" como PK (ARQ-01-D2 usa un
 * titularId opaco), así que la unicidad de username no es gratis: se
 * reserva con un item "lock" (titularId="USERNAME#<username>", sk="LOCK",
 * sin atributo `username` para no aparecer en GSI-1) puesto en la misma
 * transacción que crea el PERFIL. Si el lock ya existe, la transacción
 * completa se cancela — sin ítems a medias.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  let cuerpo: RegistroRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }

  const { username, alias, contrasena } = cuerpo;
  if (!username || !alias || !contrasena) {
    return json(400, { error: "username, alias y contrasena son requeridos" });
  }

  const titularId = randomUUID();
  const contrasenaHash = await hashContrasena(contrasena);
  const fechaDeRegistro = new Date().toISOString();

  try {
    await doc.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: TABLA_TITULAR,
              Item: { titularId: `USERNAME#${username}`, sk: "LOCK" },
              ConditionExpression: "attribute_not_exists(titularId)",
            },
          },
          {
            Put: {
              TableName: TABLA_TITULAR,
              Item: {
                titularId,
                sk: "PERFIL",
                username,
                alias,
                contrasenaHash,
                rol: "usuario",
                // esAdulto/versionDisclosure: hueco de contrato declarado en
                // CONTRATO_API_v1.md — CU-05 no tiene hoy dónde enviarlos.
                estado: "sin_consentimiento_vigente",
                fechaDeRegistro,
              },
              ConditionExpression: "attribute_not_exists(titularId)",
            },
          },
        ],
      }),
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TransactionCanceledException") {
      return json(409, { error: "username ya está en uso" });
    }
    throw error;
  }

  return json(201, { titularId } satisfies RegistroResponse);
};
