import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { doc, GSI_USERNAME, TABLA_TITULAR } from "./dynamo.js";
import { verificarContrasena } from "./contrasenas.js";

export interface PerfilAutenticado {
  titularId: string;
  alias: string;
  rol: "usuario" | "administrador";
}

/** RE-02 (ECU-03): mensaje genérico — no revela cuál de los dos campos falló. */
export async function autenticar(
  username: string,
  contrasena: string,
): Promise<PerfilAutenticado | null> {
  const gsi = await doc.send(
    new QueryCommand({
      TableName: TABLA_TITULAR,
      IndexName: GSI_USERNAME,
      KeyConditionExpression: "username = :u",
      ExpressionAttributeValues: { ":u": username },
      Limit: 1,
    }),
  );
  const referencia = gsi.Items?.[0];
  if (!referencia) return null;

  const perfil = await doc.send(
    new GetCommand({
      TableName: TABLA_TITULAR,
      Key: { titularId: referencia.titularId, sk: "PERFIL" },
    }),
  );
  if (!perfil.Item) return null;

  const valido = await verificarContrasena(contrasena, perfil.Item.contrasenaHash);
  if (!valido) return null;

  return {
    titularId: perfil.Item.titularId,
    alias: perfil.Item.alias,
    rol: perfil.Item.rol,
  };
}

export async function tieneOnboardingCompleto(titularId: string): Promise<boolean> {
  const capsula = await doc.send(
    new GetCommand({
      TableName: TABLA_TITULAR,
      Key: { titularId, sk: "CAPSULA" },
    }),
  );
  return Boolean(capsula.Item);
}
