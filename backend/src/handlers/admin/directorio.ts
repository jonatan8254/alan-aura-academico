import type { APIGatewayProxyHandler } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { DirectorioResponse, FilaDeDirectorio } from "contrato-api";
import { doc, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

const GSI_DIRECTORIO = "GSI-2-directorio";

/**
 * CU-08. Un solo Query sobre GSI-2 (directorioPk = "DIRECTORIO"), cuya
 * proyección dispersa ya está limitada a las 5 columnas que RE-04 permite
 * (ARQ-01-D2) — estructural, no depende de que este handler filtre bien.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "administrador") return json(403, { error: "rol no autorizado" }); // FE-02

  const resultado = await doc.send(
    new QueryCommand({
      TableName: TABLA_TITULAR,
      IndexName: GSI_DIRECTORIO,
      KeyConditionExpression: "directorioPk = :d",
      ExpressionAttributeValues: { ":d": "DIRECTORIO" },
    }),
  );

  const filas: FilaDeDirectorio[] = (resultado.Items ?? []).map((item) => ({
    alias: item.alias,
    // ECU-08 RA-05: ningún artefacto define el grado de truncado — abierto
    // por decisión, no bloqueante. 8 caracteres del titularId (UUID) es la
    // interpretación de esta pasada.
    idTruncado: String(item.titularId).slice(0, 8),
    fechaDeRegistro: item.fechaDeRegistro,
    estado: item.estado,
    completoElOnboarding: Boolean(item.completoElOnboarding),
  }));

  return json(200, {
    filas,
    agregado: {
      totalDeCuentas: filas.length,
      onboardingsCompletados: filas.filter((f) => f.completoElOnboarding).length,
    },
  } satisfies DirectorioResponse);
};
