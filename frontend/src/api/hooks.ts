import { useCallback, useEffect, useState } from "react";
import type { DependencyList } from "react";

import type { Fallo, Resultado } from "./resultado";

/**
 * hooks.ts — los dos únicos hooks de la capa de API. Ninguno sabe de rutas concretas: reciben
 * la función de endpoints.ts que quieran envolver.
 *
 * `useConsulta` es para lecturas (GET, o un POST que se dispara solo al montar/cambiar deps).
 * `useComando` es para acciones disparadas por el usuario (submit de un formulario, un botón).
 */

export type EstadoDeConsulta = "cargando" | "listo" | "fallo";

export interface ResultadoDeConsulta<T> {
  estado: EstadoDeConsulta;
  datos: T | null;
  fallo: Fallo | null;
  recargar: () => Promise<void>;
}

export function useConsulta<T>(
  fn: () => Promise<Resultado<T>>,
  deps: DependencyList = [],
): ResultadoDeConsulta<T> {
  const [estado, setEstado] = useState<EstadoDeConsulta>("cargando");
  const [datos, setDatos] = useState<T | null>(null);
  const [fallo, setFallo] = useState<Fallo | null>(null);

  const recargar = useCallback(async () => {
    setEstado("cargando");
    const r = await fn();
    if (r.ok) {
      setDatos(r.datos);
      setFallo(null);
      setEstado("listo");
    } else {
      setFallo(r.fallo);
      setEstado("fallo");
    }
    // fn se declara estable por convención de llamado (useCallback/función module-level en
    // quien invoca useConsulta) — no se añade a deps para que el llamador controle cuándo
    // recargar solo con su propio arreglo `deps`, como en el resto de hooks de datos de React.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn]);

  useEffect(() => {
    void recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { estado, datos, fallo, recargar };
}

export interface ResultadoDeComando<Req, Res> {
  enviando: boolean;
  fallo: Fallo | null;
  ejecutar: (req: Req) => Promise<Resultado<Res>>;
}

export function useComando<Req, Res>(
  fn: (req: Req) => Promise<Resultado<Res>>,
): ResultadoDeComando<Req, Res> {
  const [enviando, setEnviando] = useState(false);
  const [fallo, setFallo] = useState<Fallo | null>(null);

  const ejecutar = useCallback(
    async (req: Req) => {
      setEnviando(true);
      setFallo(null);
      const r = await fn(req);
      if (!r.ok) setFallo(r.fallo);
      setEnviando(false);
      return r;
    },
    [fn],
  );

  return { enviando, fallo, ejecutar };
}
