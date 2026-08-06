import type { APIGatewayProxyHandler } from "aws-lambda";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { MetricasResponse } from "contrato-api";
import { doc, TABLA_CONFIGURACION, TABLA_EVENTO_OPERATIVO, TABLA_TITULAR } from "../../lib/dynamo.js";
import { verificarSesion } from "../../lib/sesion.js";
import { json } from "../../lib/respuestas.js";

const GSI_DIRECTORIO = "GSI-2-directorio";
const DIAS_DE_VENTANA = 7; // RE-04: 7 ≤ 30 días de retención de EventoOperativo

/**
 * CU-09. Cuatro cifras, dos fuentes (ECU-09 §5): total de cuentas y
 * onboardings completados son cardinalidades de Usuario (mismo GSI-2 que
 * el directorio); llamadas en 7 días y tasa técnica salen de
 * EventoOperativo, que no tiene alias/username (PER-T2, RE-02) — nunca se
 * usa ContadorDeUsoDiario aquí, es por-usuario y RN-03.5 lo prohíbe (RE-03).
 * No depende del kill switch (FA-02): administrar no requiere el chat habilitado.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sesion = await verificarSesion(event.headers?.Cookie ?? event.headers?.cookie);
  if (!sesion) return json(401, { error: "sesión ausente o inválida" }); // FE-01

  if (sesion.rol !== "administrador") return json(403, { error: "rol no autorizado" }); // FE-02

  const [cuentas, ventana, kill] = await Promise.all([
    doc.send(
      new QueryCommand({
        TableName: TABLA_TITULAR,
        IndexName: GSI_DIRECTORIO,
        KeyConditionExpression: "directorioPk = :d",
        ExpressionAttributeValues: { ":d": "DIRECTORIO" },
      }),
    ),
    consultarVentanaDeSieteDias(),
    doc.send(
      new GetCommand({ TableName: TABLA_CONFIGURACION, Key: { parametro: "kill_switch" } }),
    ),
  ]);

  const filas = cuentas.Items ?? [];
  const totalDeCuentas = filas.length;
  const onboardingsCompletados = filas.filter((f) => f.completoElOnboarding).length;

  return json(200, {
    agregadoDeCuentas: { totalDeCuentas, onboardingsCompletados },
    agregado: ventana,
    // Si el ítem no existe todavía, mismo fail-safe que disponibilidad.ts.
    estadoDelChatbot: kill.Item?.estado === "habilitado" ? "habilitado" : "deshabilitado",
  } satisfies MetricasResponse);
};

async function consultarVentanaDeSieteDias(): Promise<MetricasResponse["agregado"]> {
  const fechas = Array.from({ length: DIAS_DE_VENTANA }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const resultados = await Promise.all(
    fechas.map((fecha) =>
      doc.send(
        new QueryCommand({
          TableName: TABLA_EVENTO_OPERATIVO,
          KeyConditionExpression: "fecha = :f",
          ExpressionAttributeValues: { ":f": fecha },
        }),
      ),
    ),
  );

  const eventos = resultados.flatMap((r) => r.Items ?? []);
  const total = eventos.length;
  // MET-07: peticiones OK + fallback / totales. "sin actividad" declarado
  // como 0 en vez de indefinido (FA-01) — sin actividad no es un fallo.
  const okOfallback = eventos.filter((e) => e.resultado === "ok" || e.resultado === "fallback").length;

  return {
    llamadasAlChatEnSieteDias: total,
    tasaTecnicaDeExitoYError: total === 0 ? 0 : okOfallback / total,
  };
}
