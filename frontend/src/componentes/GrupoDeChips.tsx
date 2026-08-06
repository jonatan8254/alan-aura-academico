import { useId } from "react";

import { cn } from "@/lib/utils";

interface OpcionDeChip<T extends string> {
  valor: T;
  etiqueta: string;
}

interface GrupoDeChipsProps<T extends string> {
  nombre: string;
  opciones: readonly OpcionDeChip<T>[];
  valorSeleccionado: T | null;
  onCambiar: (valor: T) => void;
  rotulo: string;
}

/**
 * GrupoDeChips — grupo de radio buttons nativos (accesibilidad de teclado/lector de
 * pantalla gratis) disfrazados de chips. Renderiza EXACTAMENTE las `opciones` que recibe —
 * no inventa valores propios.
 *
 * Discrepancia "P-08 enums" del plan de Fase 0b: la caracterización (P-08, CU-05 RF-04/05,
 * `ContextoInicialConversacionalV1`) tiene 5 preguntas cuyas opciones deben ser los enums
 * LITERALES de `contrato-api` (`MoodSelfReport`, `EnergySelfReport`, `ConversationGoal`,
 * `ResponseStyle`) — todos ya incluyen su propio `"prefiero_no_responder"` /
 * `"sin_preferencia"` (packages/contrato-api/src/enums.ts). Este componente no añade ni
 * recorta ninguna opción por su cuenta: quien arma `opciones` en la pantalla de P-08 (fase
 * posterior) es responsable de mapear el enum completo, valor por valor, a su copia — este
 * archivo solo dibuja lo que le pasan.
 */
export function GrupoDeChips<T extends string>({
  nombre,
  opciones,
  valorSeleccionado,
  onCambiar,
  rotulo,
}: GrupoDeChipsProps<T>) {
  const idGrupo = useId();
  return (
    <fieldset className="flex flex-col gap-2">
      <legend id={idGrupo} className="text-cuerpo font-medium text-texto">
        {rotulo}
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={idGrupo}>
        {opciones.map((opcion) => {
          const idOpcion = `${nombre}-${opcion.valor}`;
          const seleccionado = valorSeleccionado === opcion.valor;
          return (
            <label
              key={opcion.valor}
              htmlFor={idOpcion}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-cuerpo transition-colors duration-rapido",
                seleccionado
                  ? "border-sistema bg-sistema-tinte text-sistema-texto"
                  : "border-borde bg-superficie text-suave hover:bg-superficie-alt",
              )}
            >
              <input
                id={idOpcion}
                type="radio"
                name={nombre}
                value={opcion.valor}
                checked={seleccionado}
                onChange={() => onCambiar(opcion.valor)}
                className="sr-only"
              />
              {opcion.etiqueta}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
