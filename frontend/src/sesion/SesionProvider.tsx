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
      // El destino se decide ANTES de limpiar, y se lee de `leerPista()` en vez de del
      // `sesion` del closure: este callback se registra una sola vez y capturaría un valor
      // viejo, mientras que `sessionStorage` siempre tiene el actual.
      //
      // Por qué el rol importa: sin esto, un administrador cuya sesión expira en
      // /plataforma-admin/ aterriza en el login de USUARIO, que es la puerta equivocada y
      // contradice el acceso separado de RN-03.7 (y de ECU-08/09/10 FE-01, que mandan a
      // reingresar por la ruta administrativa).
      const rol = leerPista()?.rol;
      const puerta = rol === "administrador" ? "/plataforma-admin/login/" : "/login/";
      escribirPista(null);
      setSesion(null);
      navigate(`${puerta}?motivo=sesion_expirada`);
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
