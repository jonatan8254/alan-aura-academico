import type { APIGatewayProxyHandler } from "aws-lambda";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import type { TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import type { OnboardingRequest, OnboardingResponse } from "contrato-api";
import { doc, TABLA_TITULAR } from "../lib/dynamo.js";
import { verificarSesion } from "../lib/sesion.js";
import { json } from "../lib/respuestas.js";

// ContextoInicialConversacionalV1 (RN-01.3): versión de esquema de la
// cápsula, la fija el backend — no es algo que el cliente deba declarar.
const SCHEMA_VERSION_CAPSULA = "v1";

/**
 * CU-05. Un solo TransactWriteCommand: a diferencia de /cuenta/eliminar
 * (ARQ-01-D2, H-02), aquí son a lo sumo 4 items fijos, así que sí es
 * razonable exigir todo-o-nada en vez de "ordenado, tolerante a fallo
 * parcial" — no hay razón para aceptar un onboarding a medias.
 *
 * consentVersion/Consentimiento.version reusan versionDisclosure: ECU-05
 * §18 ya trata "versión de disclosure" como la versión que se estampa en
 * el Consentimiento; no hay un campo de versión de consentimiento propio
 * declarado en ningún artefacto.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" });

  let cuerpo: OnboardingRequest;
  try {
    cuerpo = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "cuerpo inválido" });
  }

  if (!cuerpo.esAdulto || !cuerpo.versionDisclosure || !cuerpo.character || !cuerpo.consentimientoBase) {
    return json(400, {
      error: "esAdulto, versionDisclosure, character y consentimientoBase son requeridos",
    });
  }

  const { titularId } = sesion;
  const fecha = new Date().toISOString();

  const items: NonNullable<TransactWriteCommandInput["TransactItems"]> = [
    {
      Update: {
        TableName: TABLA_TITULAR,
        Key: { titularId, sk: "PERFIL" },
        UpdateExpression: "SET esAdulto = :ea, versionDisclosure = :vd, estado = :estado",
        ConditionExpression: "attribute_exists(titularId)",
        ExpressionAttributeValues: {
          ":ea": cuerpo.esAdulto,
          ":vd": cuerpo.versionDisclosure,
          ":estado": "activo",
        },
      },
    },
    {
      Put: {
        TableName: TABLA_TITULAR,
        Item: {
          titularId,
          sk: "CONSENTIMIENTO#BASE",
          estado: "otorgado",
          fecha,
          version: cuerpo.versionDisclosure,
        },
      },
    },
    {
      // Sin defaults para los autorreportes omitidos (RN-01.4): solo se
      // escribe la clave si el cliente la envió.
      Put: {
        TableName: TABLA_TITULAR,
        Item: {
          titularId,
          sk: "CAPSULA",
          ...(cuerpo.moodSelfReport !== undefined && { moodSelfReport: cuerpo.moodSelfReport }),
          ...(cuerpo.energySelfReport !== undefined && {
            energySelfReport: cuerpo.energySelfReport,
          }),
          ...(cuerpo.conversationGoal !== undefined && {
            conversationGoal: cuerpo.conversationGoal,
          }),
          ...(cuerpo.responseStyle !== undefined && { responseStyle: cuerpo.responseStyle }),
          character: cuerpo.character,
          schemaVersion: SCHEMA_VERSION_CAPSULA,
          consentVersion: cuerpo.versionDisclosure,
        },
      },
    },
  ];

  if (cuerpo.consentimientoPersonalizacion) {
    items.push({
      Put: {
        TableName: TABLA_TITULAR,
        Item: {
          titularId,
          sk: "CONSENTIMIENTO#PERSONALIZACION",
          estado: "otorgado",
          fecha,
          version: cuerpo.versionDisclosure,
        },
      },
    });
  }

  await doc.send(new TransactWriteCommand({ TransactItems: items }));

  return json(200, { onboardingCompleto: true } satisfies OnboardingResponse);
};
