import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import type {
  Character,
  ConversationGoal,
  EnergySelfReport,
  MoodSelfReport,
  ResponseStyle,
} from "contrato-api";
import { doc, TABLA_TITULAR } from "./dynamo.js";

export interface EstadoDelTitular {
  consentimientoBaseOtorgado: boolean;
  consentimientoPersonalizacionOtorgado: boolean;
  capsula: {
    character: Character;
    moodSelfReport?: MoodSelfReport;
    energySelfReport?: EnergySelfReport;
    conversationGoal?: ConversationGoal;
    responseStyle?: ResponseStyle;
  } | null;
}

/**
 * Un solo Query por partición (titularId) en vez de 3 GetItem — PERFIL,
 * ambas capas de Consentimiento y CAPSULA comparten partición (ARQ-01-D2).
 */
export async function leerEstadoDelTitular(titularId: string): Promise<EstadoDelTitular> {
  const resultado = await doc.send(
    new QueryCommand({
      TableName: TABLA_TITULAR,
      KeyConditionExpression: "titularId = :t",
      ExpressionAttributeValues: { ":t": titularId },
    }),
  );
  const items = resultado.Items ?? [];
  const base = items.find((i) => i.sk === "CONSENTIMIENTO#BASE");
  const personalizacion = items.find((i) => i.sk === "CONSENTIMIENTO#PERSONALIZACION");
  const capsulaItem = items.find((i) => i.sk === "CAPSULA");

  return {
    consentimientoBaseOtorgado: base?.estado === "otorgado",
    consentimientoPersonalizacionOtorgado: personalizacion?.estado === "otorgado",
    capsula: capsulaItem
      ? {
          character: capsulaItem.character,
          moodSelfReport: capsulaItem.moodSelfReport,
          energySelfReport: capsulaItem.energySelfReport,
          conversationGoal: capsulaItem.conversationGoal,
          responseStyle: capsulaItem.responseStyle,
        }
      : null,
  };
}
