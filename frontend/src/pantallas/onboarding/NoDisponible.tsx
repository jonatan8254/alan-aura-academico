import { Link } from "react-router";
import { IconHeart } from "@tabler/icons-react";

import { EncabezadoPublico } from "@/componentes/Encabezado";
import { Icono } from "@/componentes/Icono";
import { LINEAS_DE_APOYO } from "@/dominio/recursosDeAyuda";
import { Pagina } from "@/layouts/Pagina";

/**
 * Onboarding no disponible — `/onboarding/no-disponible`.
 *
 * El desenlace de `ECU-05 FE-01` (menor de edad). No está numerada en `DIS-00 §2` porque el
 * mockup p06 dibuja este estado DENTRO de la pantalla de edad, como hoja de especificación
 * que muestra dos estados a la vez; el flujo real cierra la sesión y navega aquí, así que
 * necesita ruta propia.
 *
 * Vive fuera de `RequiereSesion` Y fuera del layout de onboarding: quien la ve ya no tiene
 * sesión (P-06 la cerró), no tiene borrador y no tiene paso que mostrar. Por eso monta su
 * propio encabezado.
 *
 * `omitir="ambos"` deja solo la marca. Ofrecerle «Registrarse» a alguien que acaba de
 * declararse menor de edad y recibir un no sería un dark pattern de manual, de los que
 * `DIS-01 §7` prohíbe explícitamente.
 *
 * El bloque de líneas de apoyo del mockup NO se renderiza mientras el catálogo esté vacío
 * (ver `dominio/recursosDeAyuda.ts`), y la frase que lo introducía se reescribe para que no
 * quede colgando prometiendo algo que no viene detrás.
 */
export function NoDisponible() {
  return (
    <>
      <EncabezadoPublico omitir="ambos" />
      <Pagina ancho="onboarding">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-aura-50">
              <Icono icono={IconHeart} size={22} className="text-aura-700" />
            </span>
            <h1 className="text-h1 font-medium text-texto">Gracias por tu sinceridad</h1>
          </div>

          {/* Contiene el mensaje que ECU-05 FE-01 exige: «solo para personas adultas». */}
          <p className="max-w-lectura text-cuerpo text-suave">
            Por ahora este servicio es solo para personas adultas, así que no podemos
            continuar.
          </p>

          <p className="max-w-lectura text-cuerpo text-suave">
            Si estás pasando por un momento difícil, no estás solo. Busca apoyo en alguien de
            confianza o en los servicios de salud de tu ciudad.
          </p>

          {LINEAS_DE_APOYO.length > 0 ? (
            <ul className="flex flex-col gap-2 rounded-tarjeta border border-borde bg-superficie p-4">
              {LINEAS_DE_APOYO.map((recurso) => (
                <li key={recurso.nombreDelRecurso} className="flex justify-between gap-4 text-cuerpo">
                  <span className="text-texto">{recurso.nombreDelRecurso}</span>
                  <span className="num-tabular text-suave">{recurso.formaDeContacto}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="text-caption text-suave">
            <Link to="/" className="text-sistema underline-offset-4 hover:underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </Pagina>
    </>
  );
}
