import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { doc, TABLA_CONFIGURACION } from "./dynamo.js";

/**
 * Kill switch (CU-10, ADR-004-D2 lo siembra en "habilitado" al desplegar).
 * Si el ítem no existe todavía (runbook no corrido), falla cerrado —
 * deshabilitado por defecto, nunca al revés.
 */
export async function chatbotHabilitado(): Promise<boolean> {
  const respuesta = await doc.send(
    new GetCommand({
      TableName: TABLA_CONFIGURACION,
      Key: { parametro: "kill_switch" },
    }),
  );
  return respuesta.Item?.estado === "habilitado";
}
