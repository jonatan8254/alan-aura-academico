import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const TABLA_TITULAR = process.env.TABLA_TITULAR ?? "";
export const TABLA_CONFIGURACION = process.env.TABLA_CONFIGURACION ?? "";
export const TABLA_EVENTO_OPERATIVO = process.env.TABLA_EVENTO_OPERATIVO ?? "";

export const GSI_USERNAME = "GSI-1-username";
