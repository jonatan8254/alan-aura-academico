import { randomUUID } from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { doc, TABLA_EVENTO_OPERATIVO } from "./dynamo.js";

const TTL_DIAS = 30;

/** RE-07/ECU-06 paso 6: un EventoOperativo por llamada al proveedor, sin contenido del diálogo. */
export async function registrarEventoOperativo(datos: {
  resultado: "ok" | "fallback" | "error";
  latencia?: number;
  modelo?: string;
  versionPrompt?: string;
}): Promise<void> {
  const ahora = new Date();
  const fecha = ahora.toISOString().slice(0, 10);
  const ttl = Math.floor(ahora.getTime() / 1000) + TTL_DIAS * 24 * 60 * 60;

  await doc.send(
    new PutCommand({
      TableName: TABLA_EVENTO_OPERATIVO,
      Item: {
        fecha,
        eventoId: `${ahora.toISOString()}#${randomUUID()}`,
        momento: ahora.toISOString(),
        resultado: datos.resultado,
        ...(datos.latencia !== undefined && { latencia: datos.latencia }),
        ...(datos.modelo !== undefined && { modelo: datos.modelo }),
        ...(datos.versionPrompt !== undefined && { versionPrompt: datos.versionPrompt }),
        ttl,
      },
    }),
  );
}
