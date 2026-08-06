import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";

import { MarcaAlanAura } from "./MarcaAlanAura";

/**
 * Encabezado.tsx — la barra superior que los 21 mockups repiten idéntica en cada pantalla:
 * la marca a la izquierda, acciones a la derecha, separadas por un borde inferior.
 *
 * Los mockups la dibujan DENTRO de un marco redondeado de 600px, porque son maquetas: ese
 * marco es el "dispositivo", no un elemento de la interfaz. Aquí la barra es de ancho
 * completo y quien centra el contenido es `Pagina` — traducir el marco literalmente
 * produciría una app metida en una tarjeta flotante, que no es lo que los mockups
 * proponen sino cómo se presentan a sí mismos.
 *
 * Tres variantes, una por contexto de actor, porque las acciones de la derecha cambian:
 * público (Visitante), de sesión (Usuario) y admin (Administrador).
 */

function Encabezado({ derecha, tono = "usuario" }: { derecha?: ReactNode; tono?: "usuario" | "admin" }) {
  return (
    <header
      className={cn(
        "border-b",
        tono === "admin" ? "border-admin-borde bg-admin-pagina" : "border-borde bg-pagina",
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 rounded-control">
          <MarcaAlanAura tamano="sm" />
          <span className="font-medium">Alan &amp; Aura</span>
        </Link>
        {derecha ? <div className="flex items-center gap-2">{derecha}</div> : null}
      </div>
    </header>
  );
}

/** P-01/P-02/P-03: los dos accesos públicos. `omitir` esconde el enlace a la pantalla en la
 * que ya se está — un enlace a uno mismo no es navegación, es ruido. */
export function EncabezadoPublico({ omitir }: { omitir?: "registro" | "login" }) {
  return (
    <Encabezado
      derecha={
        <>
          {omitir === "login" ? null : (
            <Link
              to="/login/"
              className="rounded-control px-3 py-2 text-sm text-texto hover:bg-superficie-alt"
            >
              Iniciar sesión
            </Link>
          )}
          {omitir === "registro" ? null : (
            <Link
              to="/registro/"
              className="rounded-control bg-texto px-3.5 py-2 text-sm text-superficie hover:bg-texto/90"
            >
              Registrarse
            </Link>
          )}
        </>
      }
    />
  );
}

/** P-10/P-13: la persona autenticada, identificada por su ALIAS — nunca por su `username`,
 * que es credencial de acceso y no nombre (RN-04.1, PER-01 §3.1). */
export function EncabezadoDeSesion({ alias, derecha }: { alias: string; derecha?: ReactNode }) {
  return (
    <Encabezado
      derecha={
        <>
          {derecha}
          <span className="ml-1 hidden text-caption text-suave sm:inline">{alias}</span>
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-aura-50 text-caption font-medium text-aura-700"
          >
            {alias.slice(0, 1).toUpperCase()}
          </span>
        </>
      }
    />
  );
}

/** P-04/P-14/P-15/P-16: sobrio a propósito (RN-03.7) — la insignia dice dónde estás, sin
 * anunciar capacidades ni revelar si la ruta existe para quien no debería alcanzarla. */
export function EncabezadoAdmin({ derecha }: { derecha?: ReactNode }) {
  return (
    <Encabezado
      tono="admin"
      derecha={
        <>
          {derecha}
          <span className="rounded-full border border-borde bg-sistema-tinte px-2.5 py-1 text-caption text-sistema-texto">
            Administración
          </span>
        </>
      }
    />
  );
}
