import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

/**
 * Las 4 tablas y el bucket de ARQ-01-D2/D4 (docs/10_arquitectura/ARQ-01_diseno_fisico.md).
 *
 * RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE en las tablas: freno 2 de ADR-005-D2.
 * No hay respaldos (ADR-003), así que un reemplazo de recurso durante un `cdk deploy`
 * —no solo un delete— sería pérdida de datos irreversible; RETAIN a secas no cubre
 * ese caso, solo RETAIN_ON_UPDATE_OR_DELETE lo hace.
 */
export class DataStack extends Stack {
  public readonly tablaTitular: dynamodb.Table;
  public readonly tablaConfiguracion: dynamodb.Table;
  public readonly tablaEventoOperativo: dynamodb.Table;
  public readonly tablaAccionAdministrativa: dynamodb.Table;
  public readonly bucketConfiguracion: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Grupo 1 (ARQ-01-D2): tabla única para las 4 entidades ligadas al titular,
    // porque se borran juntas por PER-T1 (cascada = una Query por partición + BatchWrite).
    this.tablaTitular = new dynamodb.Table(this, "Titular", {
      partitionKey: { name: "titularId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "ttl", // solo los items CONTADOR#<fecha> lo usan
      removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });

    // GSI-1: login por username -> titularId, sin escanear (ARQ-01-D2).
    this.tablaTitular.addGlobalSecondaryIndex({
      indexName: "GSI-1-username",
      partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
    });

    // GSI-2: directorio (CU-08), disperso — solo los items PERFIL llevan
    // "directorioPk" con el valor constante "DIRECTORIO". La proyección
    // limitada a estos 4 campos hace de PER-T3 (segregación del admin)
    // una propiedad estructural del índice, no solo disciplina de código.
    this.tablaTitular.addGlobalSecondaryIndex({
      indexName: "GSI-2-directorio",
      partitionKey: { name: "directorioPk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "titularId", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: ["alias", "fechaDeRegistro", "estado", "completoElOnboarding"],
    });

    // Grupo 2 (ARQ-01-D2): tres tablas separadas, deliberadamente fuera de
    // Titular, para que PER-T2 (no reconstruir actividad por usuario desde
    // las tablas operativas/admin) sea estructural y no solo disciplina.
    this.tablaConfiguracion = new dynamodb.Table(this, "Configuracion", {
      partitionKey: { name: "parametro", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });

    this.tablaEventoOperativo = new dynamodb.Table(this, "EventoOperativo", {
      partitionKey: { name: "fecha", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "eventoId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "ttl", // 30 días
      removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });

    this.tablaAccionAdministrativa = new dynamodb.Table(this, "AccionAdministrativa", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING }, // constante "GLOBAL"
      sortKey: { name: "fechaAccionId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "ttl", // vigencia del curso + 30 días, calculado al crear el item
      removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });

    // Bucket de config/assets (ARQ-01-D4): prompts, textos de consentimiento/ayuda,
    // banco de evaluación, activos estáticos — por prefijo, no por bucket separado.
    // Sin dato personal (ADR-003 ya quitó los respaldos): DESTROY es seguro aquí,
    // a diferencia de las tablas (ADR-005-D2).
    this.bucketConfiguracion = new s3.Bucket(this, "BucketConfiguracion", {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}
