import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const TABLA_TITULAR = process.env.TABLA_TITULAR ?? "";

export const GSI_USERNAME = "GSI-1-username";
