# Configuración aprovisionada por entorno

Estos archivos son la **fuente de verdad** de la configuración que el backend lee de S3 en tiempo de ejecución. S3 es el destino del despliegue, no el origen: si algo cambia, se edita aquí, se commitea y se vuelve a subir.

La ruta del repo es espejo de la clave de S3 — `prompts/alan.json` se sube a `config/prompts/alan.json`.

| Archivo | Qué es | Quién lo lee |
|---|---|---|
| `prompts/alan.json` | System prompt de Alan | `obtenerSystemPrompt()` en `src/lib/config.ts` |
| `prompts/aura.json` | System prompt de Aura | ídem |

Del JSON, el código **solo usa el campo `texto`**. `version`, `actualizado` y `trazabilidad` existen para que quien abra el objeto en el bucket sepa qué está mirando, quién lo dejó ahí y contra qué cláusulas del contrato se redactó — en S3 no hay historial de git que lo diga.

El contenido deriva de [`CONTRATO_conversacional.md`](../../docs/02_modelos_verbales/CONTRATO_conversacional.md) §2 (cláusulas `[C]`, obligatorias) y §3 (rasgos `[P]`, de tono). `C-3`, `C-8` y `C-10` no van en el prompt a propósito: el servidor impide invocar al LLM sin consentimiento vigente o ante peligro explícito, así que el modelo nunca ve un turno que las viole.

## Subir a S3

Aprovisionamiento manual por entorno — no hay CMS ni panel de administración (`MV-01` RN-03.6). El bucket lo crea el CDK (`infra/lib/data-stack.ts`).

```bash
aws s3 cp backend/config/prompts/alan.json s3://$BUCKET_CONFIGURACION/config/prompts/alan.json
```

Tras subir, la Lambda cachea el prompt en memoria por arranque en frío: el cambio no se ve hasta que el contenedor se recicla.
