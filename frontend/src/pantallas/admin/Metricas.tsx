import { IconChartHistogram } from "@tabler/icons-react";

import { obtenerMetricas } from "@/api/endpoints";
import { useConsulta } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { Icono } from "@/componentes/Icono";
import { TarjetaDeMetrica } from "@/componentes/TarjetaDeMetrica";

import { EstadoDeConsultaAdmin } from "./EstadoDeConsultaAdmin";

/**
 * P-15 Métricas de uso — `/plataforma-admin/metricas/` (CU-09, RF-16).
 *
 * TRAMPA DEL CONTRATO: `MetricasResponse.agregado` es `AgregadoDeUso`, mientras que
 * `DirectorioResponse.agregado` es `AgregadoDeCuentas`. Mismo nombre de campo, tipos
 * distintos. Las cardinalidades de cuentas salen aquí de `agregadoDeCuentas`, NO de
 * `agregado`; copiar el destructuring de P-14 compilaría y mostraría cifras equivocadas.
 *
 * `tasaTecnicaDeExitoYError` es una FRACCIÓN 0..1, no un porcentaje (verificado en
 * `admin/metricas.ts`, que calcula `(ok + fallback) / total`). Y vale `0` cuando no hubo
 * actividad, lo que es indistinguible de «0 % de éxito»: el discriminador correcto es
 * `llamadasAlChatEnSieteDias === 0`.
 *
 * LA CIFRA NO SE COLOREA POR UMBRAL. `ECU-09 RE-05` es explícito: «la vista EXPONE el
 * indicador; no lo VIGILA — el umbral es criterio de aceptación de RC-07, no una alarma del
 * Sistema». El verde del mockup, además, no corresponde a ningún token de tema.css.
 */
export function Metricas() {
  const consulta = useConsulta(obtenerMetricas, []);
  const datos = consulta.datos;
  const sinActividad = datos ? datos.agregado.llamadasAlChatEnSieteDias === 0 : false;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 font-medium text-texto">Métricas de uso</h1>

      <BannerInformativo tipo="info">
        <span className="flex items-start gap-2">
          <Icono icono={IconChartHistogram} size={18} className="mt-0.5 shrink-0" />
          Solo cifras agregadas. Nunca datos, conteos ni contenido por usuario.
        </span>
      </BannerInformativo>

      <EstadoDeConsultaAdmin consulta={consulta} contexto="admin_metricas">
        {datos ? (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <TarjetaDeMetrica
                valor={datos.agregadoDeCuentas.totalDeCuentas}
                etiqueta="Total de cuentas"
              />
              <TarjetaDeMetrica
                valor={datos.agregadoDeCuentas.onboardingsCompletados}
                etiqueta="Onboardings completados"
              />
              <TarjetaDeMetrica
                valor={formatoEntero(datos.agregado.llamadasAlChatEnSieteDias)}
                etiqueta="Llamadas al chat · 7 días"
              />
              <TarjetaDeMetrica
                valor={sinActividad ? "—" : formatoTasa(datos.agregado.tasaTecnicaDeExitoYError)}
                etiqueta={
                  sinActividad ? "Tasa técnica de éxito · sin actividad" : "Tasa técnica de éxito"
                }
                color="sistema"
              />
            </div>

            {/*
              `ECU-09 FA-01`: sin actividad hay que DECLARARLO explícitamente «en vez de dejar
              la tarjeta vacía». Cierra además `ECU-09 RA-03`, que señalaba que DIS-00 nunca
              declaró este estado para P-15.
            */}
            {sinActividad ? (
              <BannerInformativo tipo="info">
                En los últimos 7 días no hubo actividad del chat. Las cifras de la ventana
                están en cero.
              </BannerInformativo>
            ) : null}

            {/*
              El gráfico «Llamadas al chat por día» del mockup NO se implementa, y no es una
              limitación técnica que haya que disculpar: `AgregadoDeUso` solo trae el total de
              la ventana, y aunque existiera el endpoint, `ECU-09 RE-01` prohíbe «segmentación,
              filtro, RANGO, cohorte ni DESGLOSE» — una serie por día es un desglose. Fabricar
              barras a partir del total sería inventar datos sobre los que un administrador
              podría decidir. La ausencia se declara en vez de disimularse.
            */}
            <p className="text-caption text-tenue">
              Esta vista muestra el total de la ventana de 7 días, no su distribución por día.
            </p>
          </div>
        ) : null}
      </EstadoDeConsultaAdmin>
    </div>
  );
}

const formatoEntero = (n: number) => new Intl.NumberFormat("es-CO").format(n);

/** Fracción 0..1 → «98,6 %», con la coma decimal del español de Colombia. */
function formatoTasa(fraccion: number): string {
  const porcentaje = fraccion * 100;
  return `${new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(porcentaje)} %`;
}
