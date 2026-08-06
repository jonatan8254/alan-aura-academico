import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import { registrarCallback401 } from "@/api/cliente";

import { escribirPista, leerPista, type PistaDeSesion } from "./pista";

/**
 * SesionProvider — dueño único de la pista de sesión en memoria/`sessionStorage` (ver
 * pista.ts) y del "efecto secundario global" de la Fase 0b: cuando `api/cliente.ts` recibe
 * un 401 en cualquier ruta protegida, limpia la pista y navega a
 * `/login/?motivo=sesion_expirada` sin que cada pantalla repita ese manejo.
 *
 * Requiere estar MONTADO DENTRO de `<BrowserRouter>` (ver App.tsx) — usa `useNavigate()`
 * directamente. La especificación de Fase 0b describía esto como "pasar un ref de
 * useNavigate a cliente.ts"; en la práctica cliente.ts sigue sin importar react-router (el
 * requisito real, documentado en su cabecera) — el mecanismo es un callback plano registrado
 * vía `registrarCallback401`, más simple que gestionar un ref a mano y con el mismo efecto:
 * ni cliente.ts ni api/* saben que react-router existe.
 */

interface ContextoDeSesion {
  sesion: PistaDeSesion | null;
  escribirSesion: (pista: PistaDeSesion | null) => void;
}

const Contexto = createContext<ContextoDeSesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<PistaDeSesion | null>(() => leerPista());
  const navigate = useNavigate();

  const escribirSesion = (pista: PistaDeSesion | null) => {
    escribirPista(pista);
    setSesion(pista);
  };

  useEffect(() => {
    registrarCallback401(() => {
      escribirPista(null);
      setSesion(null);
      navigate("/login/?motivo=sesion_expirada");
    });
    return () => registrarCallback401(null);
  }, [navigate]);

  return <Contexto.Provider value={{ sesion, escribirSesion }}>{children}</Contexto.Provider>;
}

export function useSesion(): ContextoDeSesion {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useSesion() debe usarse dentro de <SesionProvider>.");
  }
  return contexto;
}
