import type { APIGatewayProxyHandler } from "aws-lambda";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import type { TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import type { ReiniciarPerfilRequest, ReiniciarPerfilResponse } from "contrato-api";
import { doc, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

/**
 * CU-11. Borra la CapsulaDePerfil entera (character incluido) — Consentimiento
 * y Usuario no se tocan (§4.1: reiniciar ≠ revocar). Sin auditoría (RE-06
 * retirado en CDR-01 H-14: nadie pidió un registro de la acción de un
 * usuario sobre sus propios datos).
 *
 * Bug real, corregido: la versión anterior solo borraba CAPSULA y dejaba
 * `PERFIL.completoElOnboarding` en `true`. Consecuencia: `/chat` empezaba a
 * responder `403 "consentimiento base no otorgado"` —correcto, dado que la
 * cápsula ya no existe— pero `LoginResponse.onboardingCompleto` y
 * `DirectorioResponse` seguían afirmando `true` hasta el siguiente login
 * (`tieneOnboardingCompleto()` mira la presencia de `CAPSULA`, no ese
 * campo). Ahora las dos escrituras van en el mismo `TransactWriteCommand`:
 * o las dos ocurren, o ninguna — evita el estado intermedio donde la
 * cápsula ya no existe pero el perfil sigue diciendo que sí.
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

  const { titularId } = sesion;

  // FA-01: si CAPSULA no existía, el Delete es un no-op silencioso dentro
  // de la transacción — sigue idempotente, como en la versión anterior.
  const items: NonNullable<TransactWriteCommandInput["TransactItems"]> = [
    {
      Delete: {
        TableName: TABLA_TITULAR,
        Key: { titularId, sk: "CAPSULA" },
      },
    },
    {
      Update: {
        TableName: TABLA_TITULAR,
        Key: { titularId, sk: "PERFIL" },
        UpdateExpression: "SET completoElOnboarding = :falso",
        ExpressionAttributeValues: { ":falso": false },
      },
    },
  ];

  try {
    await doc.send(new TransactWriteCommand({ TransactItems: items }));
    return json(200, {
      estado: "caracterizacion_reiniciada",
    } satisfies ReiniciarPerfilResponse);
  } catch {
    return json(500, { error: "no pudimos reiniciar tu caracterización" }); // FE-04
  }
};
