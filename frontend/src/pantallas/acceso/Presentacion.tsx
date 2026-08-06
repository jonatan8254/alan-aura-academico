import { Link, useSearchParams } from "react-router";
import { IconCat, IconCheck, IconDog, IconMinus } from "@tabler/icons-react";

import { revisarSalud } from "@/api/endpoints";
import { useConsulta } from "@/api/hooks";
import type { Fallo } from "@/api/resultado";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { Icono, type ComponenteIcono } from "@/componentes/Icono";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { copiaDeFallo } from "@/copia/fallos";
import { copiaDeMotivo } from "@/copia/motivos";
import { PERSONAJES } from "@/dominio/personajes";

/**
 * P-01 Presentación — `/` (CU-01, RF-19).
 *
 * `GET /api/v1/health` es la implementación de `ECU-01 FE-01` («presentación no
 * disponible»), y hasta esta fase no lo llamaba nadie. NO es el kill switch: ese se ve en el
 * chat como 409 y solo afecta a la conversación, no a la landing.
 *
 * Decisión que se aparta de la lectura literal: la landing se renderiza ENTERA mientras la
 * consulta está en vuelo, con los dos accesos activos. `ECU-01 CA-01` exige que el Visitante
 * vea alcance, límites y accesos «sin autenticarse», y meter eso detrás de un round-trip lo
 * rompe en cualquier conexión lenta. La consulta solo DEGRADA la pantalla si falla; nunca la
 * habilita.
 *
 * El estado «cuenta eliminada» no está en `DIS-00 §2` —que solo inventarió «default» y
 * «servicio no disponible»— pero `ECU-04 §11` paso 4 (corrección D-05) manda aquí el aviso
 * final de la eliminación. Se implementa y se declara.
 */
export function Presentacion() {
  const salud = useConsulta(revisarSalud, []);
  const [parametros] = useSearchParams();
  const aviso = copiaDeMotivo(parametros.get("motivo"));

  const servicioCaido = salud.estado === "fallo" && salud.fallo !== null;

  return (
    <div className="flex flex-col gap-10">
      {aviso ? <BannerInformativo tipo={aviso.tipo}>{aviso.texto}</BannerInformativo> : null}

      <section className="flex flex-col gap-4">
        <p className="text-caption text-suave">Acompañamiento emocional · no clínico</p>
        <h1 className="max-w-lectura text-display font-medium text-texto">
          Un espacio para respirar, cuando lo necesites
        </h1>
        <p className="max-w-lectura text-cuerpo text-suave">
          Escucha cercana y orientación breve para personas adultas. No es terapia ni una
          línea de urgencias: te acompaña y, si aparece un riesgo, te conecta con ayuda
          humana.
        </p>

        {servicioCaido ? (
          <AvisoDeServicioCaido fallo={salud.fallo!} onReintentar={salud.recargar} />
        ) : (
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/registro/" className={cn(buttonVariants(), "h-11 px-5 text-cuerpo")}>
              Registrarse
            </Link>
            <Link
              to="/login/"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5 text-cuerpo")}
            >
              Ya tengo cuenta
            </Link>
          </div>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {PERSONAJES.map((p) => (
          <div
            key={p.character}
            data-persona={p.character}
            className="flex items-center gap-3 rounded-tarjeta border border-borde bg-persona-tinte p-4"
          >
            <Icono
              icono={p.character === "aura" ? IconCat : IconDog}
              size={24}
              className="text-persona-500"
            />
            <div>
              <p className="font-medium text-persona-texto">{p.nombre}</p>
              <p className="text-caption text-suave">{p.rol}</p>
            </div>
          </div>
        ))}
      </section>

      {/*
        `ECU-01 RE-03` y `CA-03` dependen literalmente de estas seis líneas: son la
        declaración de alcance y de límites que el Visitante tiene derecho a leer antes de
        registrarse. No recortar ninguna, ni suavizar la columna de la derecha.
      */}
      <section className="grid gap-8 sm:grid-cols-2">
        <Columna
          titulo="Qué es"
          icono={IconCheck}
          tonoIcono="text-exito"
          puntos={[
            "Escuchar y validar lo que sientes",
            "Ayudarte a ordenar y dar un paso",
            "Orientación breve y psicoeducación",
          ]}
        />
        <Columna
          titulo="Qué no es"
          icono={IconMinus}
          tonoIcono="text-tenue"
          puntos={[
            "No diagnostica ni da tratamiento",
            "No atiende urgencias en autonomía",
            "No reemplaza a un profesional",
          ]}
        />
      </section>

      {/* El anticipo del disclosure (ECU-01 §8): el disclosure completo es P-05. */}
      <p className="max-w-lectura text-caption text-tenue">
        Hablas con una inteligencia artificial de acompañamiento. Antes de registrarte te
        explicamos qué es y qué no es. Solo para personas adultas · español (Colombia).
      </p>
    </div>
  );
}

function Columna({
  titulo,
  icono,
  tonoIcono,
  puntos,
}: {
  titulo: string;
  icono: ComponenteIcono;
  tonoIcono: string;
  puntos: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-h2 font-medium text-texto">{titulo}</h2>
      <ul className="flex flex-col gap-2">
        {puntos.map((punto) => (
          <li key={punto} className="flex items-start gap-2.5 text-cuerpo text-suave">
            <Icono icono={icono} size={18} className={`mt-1 shrink-0 ${tonoIcono}`} />
            {punto}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * `ECU-01 FE-01`: «presenta el estado "servicio no disponible" **sin exponer detalle
 * técnico**». La copia sale de `copia/fallos.ts` con contexto `presentacion`, que devuelve
 * lo mismo para cualquier causa — al Visitante no le sirve de nada saber si fue la red o un
 * 502, y decírselo sería el detalle técnico que la ECU prohíbe.
 */
function AvisoDeServicioCaido({
  fallo,
  onReintentar,
}: {
  fallo: Fallo;
  onReintentar: () => void;
}) {
  const copia = copiaDeFallo(fallo, "presentacion");
  return (
    <div className="flex flex-col items-start gap-3 pt-2">
      <BannerInformativo tipo="aviso" className="w-full">
        <p className="font-medium">{copia.titulo}</p>
        {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
      </BannerInformativo>
      {copia.accion.tipo === "reintentar" ? (
        <Button variant="outline" onClick={onReintentar} className="h-11 px-5 text-cuerpo">
          {copia.accion.etiqueta}
        </Button>
      ) : null}
    </div>
  );
}
