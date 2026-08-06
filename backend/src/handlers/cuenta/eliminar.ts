import type { APIGatewayProxyHandler } from "aws-lambda";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { AlcanceDeBorrado, EliminarCuentaRequest, EliminarCuentaResponse } from "contrato-api";
import { doc, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json, limpiarCookie } from "../../lib/respuestas.js";

async function borrar(titularId: string, sk: string): Promise<void> {
  // Sin ConditionExpression: DeleteItem sobre un ítem que no existe es un
  // no-op silencioso — cada paso es idempotente por construcción (RE-04),
  // así que un reintento tras una interrupción retoma sin duplicar nada.
  await doc.send(new DeleteCommand({ TableName: TABLA_TITULAR, Key: { titularId, sk } }));
}

/**
 * CU-04. Borrado ORDENADO, tolerante a fallo parcial y reintentable
 * (ARQ-01-D2, CDR-01 H-02) — no una transacción: Consentimiento primero
 * (desde ahí el sistema ya no procesa a esta persona, RE-04), después
 * CapsulaDePerfil y los contadores de uso, y el Usuario (PERFIL) al final.
 * Si un paso falla, lo ya borrado no se restaura y el reintento retoma
 * donde quedó — cada paso es individualmente idempotente.
 *
 * El ítem LOCK de unicidad de username (registro.ts, no es una entidad de
 * dominio) se libera al final: si no se borra, el username queda reservado
 * para siempre y nadie podría volver a registrarlo.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "usuario") return json(403, { error: "rol no autorizado" }); // FE-02, PRE-02

  let cuerpo: EliminarCuentaRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }
  if (cuerpo.confirmacion !== true) {
    return json(400, { error: "confirmación explícita requerida" }); // FE-03
  }

  const { titularId } = sesion;

  const resultado = await doc.send(
    new QueryCommand({
      TableName: TABLA_TITULAR,
      KeyConditionExpression: "titularId = :t",
      ExpressionAttributeValues: { ":t": titularId },
    }),
  );
  const items = resultado.Items ?? [];
  const username = items.find((i) => i.sk === "PERFIL")?.username as string | undefined;
  const sksDeContadores = items
    .map((i) => i.sk as string)
    .filter((sk) => sk.startsWith("CONTADOR"));

  try {
    await borrar(titularId, "CONSENTIMIENTO#BASE");
    await borrar(titularId, "CONSENTIMIENTO#PERSONALIZACION");
    await borrar(titularId, "CAPSULA");
    for (const sk of sksDeContadores) {
      await borrar(titularId, sk);
    }
    await borrar(titularId, "PERFIL");
    if (username) {
      await borrar(`USERNAME#${username}`, "LOCK");
    }
  } catch {
    return json(500, {
      error: "no pudimos terminar de eliminar tu cuenta; parte de tus datos ya se borró, inténtalo de nuevo",
    }); // FE-04
  }

  const alcance: AlcanceDeBorrado = {
    registrosQueDesapareceran: ["perfil", "consentimiento", "cápsula de perfil", "contadores de uso"],
    esIrreversible: true,
    dejaraSinAccesoAlChat: true,
  };

  return limpiarCookie(200, { alcance } satisfies EliminarCuentaResponse);
};
