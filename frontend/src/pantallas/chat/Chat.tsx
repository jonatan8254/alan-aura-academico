import { useEffect, useRef, useState, type RefObject } from "react";
import { Link, useNavigate } from "react-router";
import { IconCat, IconDog, IconMessageOff, IconRefresh, IconRobot } from "@tabler/icons-react";
import type { Character, ChatIntercambio } from "contrato-api";

import { chat } from "@/api/endpoints";
import type { Fallo } from "@/api/resultado";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { BurbujaDeChat } from "@/componentes/BurbujaDeChat";
import { Chip } from "@/componentes/Chip";
import { CompositorDeMensaje } from "@/componentes/CompositorDeMensaje";
import { EstadoVacio } from "@/componentes/EstadoVacio";
import { Icono } from "@/componentes/Icono";
import { IndicadorEscribiendo } from "@/componentes/IndicadorEscribiendo";
import { TarjetaDeContencion } from "@/componentes/TarjetaDeContencion";
import { TarjetaDePersonaje } from "@/componentes/TarjetaDePersonaje";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copiaDeFallo } from "@/copia/fallos";
import {
  AVISO_DE_MENSAJES_RESTANTES,
  MAX_INTERCAMBIOS_DE_HISTORIAL,
  MAX_MENSAJES_POR_SESION,
} from "@/dominio/limites";
import { fichaDe, PERSONAJES } from "@/dominio/personajes";
import { textoPlano } from "@/dominio/respuestaDelModelo";
import { BotonDeCerrarSesion } from "@/layouts/BotonDeCerrarSesion";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * Chat — `/chat/` (CU-06, CU-07 y CU-13; RF-07…RF-13, RF-25, RF-26).
 *
 * Las tres pantallas del inventario viven en este archivo por decisión de `DIS-00 §2`
 * (corrección PDR-01 D-13): P-10 es la conversación, P-11 son sus estados de degradación y
 * P-12 es el estado de contención. No son tres vistas, son tres estados de una.
 *
 * DOS EJES DE ESTADO, que es lo que evita el nudo de banderas booleanas:
 *   - `estadoDeSesion` (macro): qué puede hacer la persona ahora mismo.
 *   - `estadoDelTurno` (micro): si hay un mensaje en vuelo. Solo aplica en `abierta`.
 *
 * REGLA DERIVADA de cuándo se deshabilita el compositor, no inventada aquí: se deshabilita
 * exactamente donde la ECU dice «Termina/Finaliza» (FE-02, FE-04, FE-08, FA-01) y mientras
 * hay un turno en vuelo; se mantiene HABILITADO donde dice «Vuelve al paso 2» (FE-03, FE-05,
 * FE-06, FE-07). El mockup p11 dibuja el compositor muerto en su pie, pero ese pie ilustra
 * solo el 409.
 *
 * ESTE ARCHIVO MONTA SU PROPIO ENCABEZADO y no usa `LayoutDeSesion`: el mockup p10 no
 * enseña la marca de la app sino el acompañante con su disclosure persistente, y el chat
 * necesita gobernar el alto de la ventana para anclar el compositor abajo.
 *
 * No usa `useComando`: ese hook trae su propio `enviando`/`fallo`, que competirían con los
 * dos ejes, y no puede expresar «un reintento automático solo para el 502» ni conservar el
 * turno pendiente entre intentos. Se llama a `chat()` y se decide con `if (r.ok)` — la capa
 * de API no lanza, así que no hay `try/catch` en toda la pantalla.
 */

type Clase = "usuario" | "personaje" | "sistema";

interface Turno {
  id: string;
  clase: Clase;
  /** `local` = saludo o línea de sistema. NUNCA entra en el `history` que va al modelo. */
  origen: "remoto" | "local";
  texto: string;
  /** Solo en `personaje`: la voz con la que se dijo, no la activa ahora. */
  character?: Character;
}

interface TurnoPendiente {
  idTurnoUsuario: string;
  texto: string;
  clientRequestId: string;
  /** Congelado al primer envío, para que un reintento no mande otro historial. */
  historial: ChatIntercambio[];
  character: Character;
  reintentosAutomaticos: number;
}

type EstadoDeSesion =
  | "eligiendo_personaje"
  | "abierta"
  | "contenida"
  | "agotada"
  | "en_mantenimiento"
  | "sin_permiso"
  | "cerrada";

type EstadoDelTurno = "reposo" | "esperando" | "fallido";

const nuevoId = () => crypto.randomUUID();

/**
 * El saludo de apertura del mockup p10. Es `origen: "local"` — nunca entra en el `history`
 * que va al modelo, porque es un turno que el personaje no dijo.
 */
function saludoDe(character: Character, alias?: string): Turno {
  return {
    id: nuevoId(),
    clase: "personaje",
    origen: "local",
    texto: `Hola${alias ? `, ${alias}` : ""}. Me alegra que estés aquí. ¿Cómo llegas hoy?`,
    character,
  };
}

/**
 * `history` = los últimos 4 turnos REMOTOS, planos, más reciente al final.
 *
 * CUATRO ELEMENTOS, no cuatro pares: el handler responde 400 a `history.length > 4`, así que
 * la lectura natural de «hasta 4 intercambios» (= 8 mensajes) sería un 400 garantizado.
 *
 * El saludo local nunca entra: es un turno que el personaje jamás dijo, y reinyectarlo como
 * suyo sería alimentar al modelo con palabras fabricadas. El `texto` del turno actual
 * tampoco: el backend lo empuja después del historial, y duplicarlo lo mandaría dos veces.
 */
function construirHistorial(mensajes: readonly Turno[]): ChatIntercambio[] {
  return mensajes
    .filter((t) => t.origen === "remoto" && t.clase !== "sistema")
    .slice(-MAX_INTERCAMBIOS_DE_HISTORIAL)
    .map((t) => ({
      rol: t.clase === "usuario" ? ("usuario" as const) : ("personaje" as const),
      texto: t.texto,
    }));
}

export function Chat() {
  const { sesion, escribirSesion } = useSesion();
  const navegar = useNavigate();

  const [personaje, setPersonaje] = useState<Character | null>(sesion?.character ?? null);
  // Si el acompañante ya venía elegido (se acaba de terminar el onboarding, o la pista lo
  // guarda), la conversación abre con el saludo en vez de con una pantalla en blanco. Solo
  // en el arranque: llegar sin `character` lleva al selector, y el saludo lo pone la
  // elección.
  const [mensajes, setMensajes] = useState<Turno[]>(() =>
    sesion?.character ? [saludoDe(sesion.character, sesion.alias)] : [],
  );
  const [borrador, setBorrador] = useState("");
  const [estadoDeSesion, setEstadoDeSesion] = useState<EstadoDeSesion>(
    sesion?.character ? "abierta" : "eligiendo_personaje",
  );
  const [estadoDelTurno, setEstadoDelTurno] = useState<EstadoDelTurno>("reposo");
  const [falloDelTurno, setFalloDelTurno] = useState<Fallo | null>(null);
  const [pendiente, setPendiente] = useState<TurnoPendiente | null>(null);
  const [turnosConsumidos, setTurnosConsumidos] = useState(0);
  const [textoDeContencion, setTextoDeContencion] = useState<string | null>(null);
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  const finDeLaTranscripcion = useRef<HTMLDivElement | null>(null);
  const tituloDeContencion = useRef<HTMLHeadingElement | null>(null);

  const ficha = personaje ? fichaDe(personaje) : null;

  useEffect(() => {
    finDeLaTranscripcion.current?.scrollIntoView({ block: "end" });
  }, [mensajes, estadoDelTurno, estadoDeSesion]);

  // Único punto de la app donde robar el foco está justificado: garantiza que la ruta hacia
  // ayuda humana se anuncie y quede en pantalla (ECU-07 §11 pasos 3-6).
  useEffect(() => {
    if (estadoDeSesion === "contenida") tituloDeContencion.current?.focus();
  }, [estadoDeSesion]);

  function elegirPersonaje(elegido: Character) {
    // ECU-13 FA-01: elegir el mismo no produce cambio observable ni línea de sistema.
    if (elegido === personaje) {
      setSelectorAbierto(false);
      return;
    }
    const ficha = fichaDe(elegido);
    const primeraVez = personaje === null;
    setPersonaje(elegido);
    if (sesion) escribirSesion({ ...sesion, character: elegido });
    setSelectorAbierto(false);
    setEstadoDeSesion("abierta");
    setMensajes((previos) => [
      ...previos,
      primeraVez
        ? saludoDe(elegido, sesion?.alias)
        : // ECU-13 §11 paso 3: «confirma el cambio al Usuario sin cerrar la Conversacion».
          {
            id: nuevoId(),
            clase: "sistema" as const,
            origen: "local" as const,
            texto: `Ahora te acompaña ${ficha.nombre}.`,
          },
    ]);
  }

  function reiniciarSesion() {
    setMensajes([]);
    setTurnosConsumidos(0);
    setPendiente(null);
    setFalloDelTurno(null);
    setTextoDeContencion(null);
    setBorrador("");
    setEstadoDelTurno("reposo");
    setEstadoDeSesion("abierta");
    if (personaje) setMensajes([saludoDe(personaje, sesion?.alias)]);
  }

  async function despachar(turno: TurnoPendiente) {
    setEstadoDelTurno("esperando");
    setFalloDelTurno(null);

    const resultado = await chat({
      texto: turno.texto,
      character: turno.character,
      history: turno.historial,
      clientRequestId: turno.clientRequestId,
    });

    if (resultado.ok) {
      const { respuesta, modo } = resultado.datos;
      const consumidos = turnosConsumidos + 1;
      setTurnosConsumidos(consumidos);
      setPendiente(null);
      setEstadoDelTurno("reposo");

      if (modo === "safety_fallback") {
        // ECU-06 FE-08 / CU-07. Llega con 200, no con un código de error: el frontend lo
        // distingue por `modo`, nunca por status. Y sí consume cupo — el handler evalúa los
        // límites antes del gate.
        setTextoDeContencion(textoPlano(respuesta));
        setEstadoDeSesion("contenida");
        return;
      }

      setMensajes((previos) => [
        ...previos,
        {
          id: nuevoId(),
          clase: "personaje",
          origen: "remoto",
          texto: textoPlano(respuesta),
          character: turno.character,
        },
      ]);
      // RF-25 / FA-01: se evalúa DESPUÉS de pintar la respuesta, para que el último turno
      // se lea antes del cierre.
      if (consumidos >= MAX_MENSAJES_POR_SESION) setEstadoDeSesion("agotada");
      return;
    }

    const fallo = resultado.fallo;

    // 401 — cliente.ts ya limpió la pista y navegó. No hay nada que hacer aquí.
    if (fallo.tipo === "sin_sesion") return;

    if (fallo.tipo === "sin_permiso") {
      const copia = copiaDeFallo(fallo, "chat");
      if (copia.accion.tipo === "navegar") {
        // FE-09: la capa base no está vigente. Se corrige la pista para que la guarda no
        // devuelva aquí en bucle, y se manda a rehacer CU-05.
        if (sesion) escribirSesion({ ...sesion, onboardingCompleto: false });
        navegar(copia.accion.destino, { replace: true });
        return;
      }
      // FE-02: rol no autorizado. «Termina» — terminal, sin reintento.
      setFalloDelTurno(fallo);
      setEstadoDelTurno("reposo");
      setEstadoDeSesion("sin_permiso");
      return;
    }

    if (fallo.tipo === "conflicto") {
      // FE-04: kill switch. Se conserva el pendiente para que «Reintentar» funcione.
      setFalloDelTurno(fallo);
      setEstadoDelTurno("fallido");
      setEstadoDeSesion("en_mantenimiento");
      return;
    }

    if (fallo.tipo === "entrada_invalida") {
      // FE-03: «vuelve al paso 2». Se retira la burbuja optimista y el texto vuelve al
      // compositor: el arreglo es editarlo, no reenviarlo igual, así que no se ofrece
      // reintento y no se conserva el pendiente.
      setMensajes((previos) => previos.filter((t) => t.id !== turno.idTurnoUsuario));
      setBorrador(turno.texto);
      setPendiente(null);
      setFalloDelTurno(fallo);
      setEstadoDelTurno("fallido");
      return;
    }

    if (fallo.tipo === "proveedor_caido" && turno.reintentosAutomaticos === 0) {
      // FE-06: «máx. 1 reintento ante fallos transitorios». El mismo clientRequestId y el
      // mismo historial, para que sea el mismo turno y no uno nuevo.
      const siguiente = { ...turno, reintentosAutomaticos: 1 };
      setPendiente(siguiente);
      await despachar(siguiente);
      return;
    }

    // FE-05 (429), FE-07 (504 — jamás automático: duplicaría la espera de 20s que acota
    // RN-02.9), el segundo 502, y red/ilegible/desconocido. Todos conservan el pendiente y
    // dejan el compositor habilitado.
    setFalloDelTurno(fallo);
    setEstadoDelTurno("fallido");
  }

  async function enviar() {
    const texto = borrador.trim();
    if (!texto || !personaje || estadoDeSesion !== "abierta" || estadoDelTurno === "esperando") {
      return;
    }

    const idTurnoUsuario = nuevoId();
    const turno: TurnoPendiente = {
      idTurnoUsuario,
      texto,
      clientRequestId: nuevoId(),
      historial: construirHistorial(mensajes),
      character: personaje,
      reintentosAutomaticos: 0,
    };

    setMensajes((previos) => [
      ...previos,
      { id: idTurnoUsuario, clase: "usuario", origen: "remoto", texto },
    ]);
    setBorrador("");
    setPendiente(turno);
    await despachar(turno);
  }

  const copiaDelFallo = falloDelTurno
    ? copiaDeFallo(falloDelTurno, "chat", { personaje: ficha?.nombre })
    : null;

  const compositorHabilitado =
    estadoDeSesion === "abierta" && estadoDelTurno !== "esperando" && personaje !== null;

  const restantes = MAX_MENSAJES_POR_SESION - turnosConsumidos;
  const mostrarAvisoDeRestantes =
    estadoDeSesion === "abierta" && restantes <= AVISO_DE_MENSAJES_RESTANTES && restantes > 0;

  return (
    <div className="flex h-dvh flex-col bg-pagina">
      <CabeceraDelChat
        ficha={ficha}
        enContencion={estadoDeSesion === "contenida"}
        puedeCambiar={estadoDeSesion === "abierta"}
        onCambiar={() => setSelectorAbierto(true)}
        onCerrarConversacion={() => setEstadoDeSesion("cerrada")}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 sm:px-6">
        {/*
          `role="log"` con `aria-live="polite"`: los turnos nuevos se anuncian sin
          interrumpir. El indicador de escritura y la tarjeta de contención van FUERA de esta
          región — anidar dos live regions produce anuncios dobles.
        */}
        <div
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="flex flex-1 flex-col gap-3 overflow-y-auto py-6"
        >
          {estadoDeSesion === "eligiendo_personaje" ? (
            <SelectorInicial onElegir={elegirPersonaje} />
          ) : null}

          {mensajes.map((turno) =>
            turno.clase === "sistema" ? (
              <p key={turno.id} className="py-1 text-center text-caption text-tenue">
                {turno.texto}
              </p>
            ) : (
              <BurbujaDeChat
                key={turno.id}
                texto={turno.texto}
                autor={turno.clase}
                character={turno.character}
              />
            ),
          )}

          {estadoDeSesion === "cerrada" ? (
            <div className="py-8">
              <EstadoVacio icono={IconMessageOff} titulo="Conversación cerrada">
                {/* Hace VISIBLE la postcondición de RF-13 / C-5 / CA-05, que si no sería una
                    promesa invisible: no hay registro recuperable del diálogo. */}
                No guardamos nada de lo que hablaron.
              </EstadoVacio>
              <div className="flex justify-center pt-4">
                <Button onClick={reiniciarSesion} className="h-11 px-5 text-cuerpo">
                  Nueva sesión
                </Button>
              </div>
            </div>
          ) : null}

          <div ref={finDeLaTranscripcion} />
        </div>

        {estadoDelTurno === "esperando" && ficha ? (
          <div className="flex items-center gap-2 pb-3 text-caption text-suave">
            <IndicadorEscribiendo />
            {ficha.nombre} está escribiendo
          </div>
        ) : null}

        {estadoDeSesion === "contenida" && textoDeContencion ? (
          <Contencion
            texto={textoDeContencion}
            refTitulo={tituloDeContencion}
            onNuevaSesion={reiniciarSesion}
          />
        ) : null}

        {estadoDeSesion === "agotada" ? (
          <div className="mb-3 flex flex-col items-center gap-3 rounded-tarjeta border border-borde bg-superficie p-4 text-center">
            {/* RF-25 / FA-01: estado de P-10, NO un error (corrección PDR-01 D-13). */}
            <p className="text-cuerpo text-texto">
              Llegaste al final de esta sesión. Puedes cerrarla o empezar una nueva cuando
              quieras.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEstadoDeSesion("cerrada")}
                className="h-11 px-5 text-cuerpo"
              >
                Cerrar
              </Button>
              <Button onClick={reiniciarSesion} className="h-11 px-5 text-cuerpo">
                Nueva sesión
              </Button>
            </div>
          </div>
        ) : null}

        {copiaDelFallo && estadoDeSesion !== "contenida" ? (
          <TiraDeFallo
            copia={copiaDelFallo}
            onReintentar={() => pendiente && despachar(pendiente)}
            hayPendiente={pendiente !== null}
          />
        ) : null}

        {mostrarAvisoDeRestantes ? (
          // Deliberadamente discreto: nada de insignias ni contadores gamificados
          // (canon: seguridad emocional > engagement).
          <p className="pb-2 text-center text-caption text-tenue">
            Te queda{restantes === 1 ? "" : "n"} {restantes} mensaje
            {restantes === 1 ? "" : "s"} en esta sesión.
          </p>
        ) : null}

        {estadoDeSesion !== "cerrada" ? (
          <div className="pb-4">
            <CompositorDeMensaje
              valor={borrador}
              onCambiar={setBorrador}
              onEnviar={enviar}
              deshabilitado={!compositorHabilitado}
              placeholder={placeholderDe(estadoDeSesion, estadoDelTurno)}
            />
          </div>
        ) : null}
      </div>

      <Dialog open={selectorAbierto} onOpenChange={setSelectorAbierto}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>¿Con quién quieres seguir?</DialogTitle>
            <DialogDescription className="text-cuerpo text-suave">
              Lo que ya hablaron se queda en pantalla. Puedes volver a cambiar cuando quieras.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {PERSONAJES.map((p) => (
              <TarjetaDePersonaje
                key={p.character}
                character={p.character}
                nombre={p.nombre}
                rol={p.rol}
                frase={p.frase}
                icono={p.character === "aura" ? IconCat : IconDog}
                seleccionado={p.character === personaje}
                onSeleccionar={() => elegirPersonaje(p.character)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function placeholderDe(sesion: EstadoDeSesion, turno: EstadoDelTurno): string {
  if (sesion === "eligiendo_personaje") return "Elige con quién quieres conversar";
  if (sesion === "contenida") return "Esta conversación quedó en pausa.";
  if (sesion === "agotada") return "Llegaste al final de esta sesión.";
  if (sesion === "en_mantenimiento") return "El chat está en pausa por mantenimiento.";
  if (sesion === "sin_permiso") return "El chat no está disponible para esta cuenta.";
  if (turno === "esperando") return "Un momento…";
  return "Escribe lo que sientes…";
}

/**
 * `C-1` — el disclosure discreto y persistente. El subtítulo «IA de acompañamiento» no es
 * decoración: es la traza de RF-01 dentro de la conversación, y se mantiene incluso en modo
 * seguridad.
 *
 * En contención se RETIRAN «Cambiar acompañante» y «Cerrar conversación»: `C-10` suspende la
 * personalidad ordinaria, y ofrecer un selector de personajes en ese momento es exactamente
 * lo que `CA-10` prohíbe.
 *
 * Acciones explícitas en línea y no un menú `⋯` como el mockup: no hay primitiva
 * `DropdownMenu` instalada, y dos botones visibles son más accesibles que un menú a medio
 * construir.
 */
function CabeceraDelChat({
  ficha,
  enContencion,
  puedeCambiar,
  onCambiar,
  onCerrarConversacion,
}: {
  ficha: ReturnType<typeof fichaDe> | null;
  enContencion: boolean;
  puedeCambiar: boolean;
  onCambiar: () => void;
  onCerrarConversacion: () => void;
}) {
  return (
    <header className="border-b border-borde bg-superficie">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3" data-persona={ficha?.character}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-persona-tinte">
            <Icono
              icono={ficha?.character === "alan" ? IconDog : IconCat}
              size={22}
              className="text-persona-500"
            />
          </span>
          <div className="flex flex-col">
            <span className="font-medium text-texto">{ficha?.nombre ?? "Tu acompañante"}</span>
            <span className="flex items-center gap-1 text-caption text-suave">
              <Icono icono={IconRobot} size={13} />
              IA de acompañamiento
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {enContencion ? (
            <Chip className="bg-crisis-tinte text-crisis-texto">modo seguridad</Chip>
          ) : (
            <>
              {puedeCambiar ? (
                <Button variant="ghost" onClick={onCambiar} className="h-11 px-3 text-caption">
                  Cambiar acompañante
                </Button>
              ) : null}
              <Button
                variant="ghost"
                onClick={onCerrarConversacion}
                className="h-11 px-3 text-caption"
              >
                Cerrar conversación
              </Button>
            </>
          )}
          <Link
            to="/cuenta/"
            className="rounded-control px-3 py-2.5 text-caption text-suave hover:bg-superficie-alt"
          >
            Mi cuenta
          </Link>
          <BotonDeCerrarSesion etiqueta="Salir" />
        </div>
      </div>
    </header>
  );
}

/** Paso 1 de `ECU-06`: elegir con quién conversar. Se llega aquí cuando la pista no trae
 * `character` — típicamente tras un login nuevo, porque ninguna respuesta del backend
 * devuelve la cápsula. */
function SelectorInicial({ onElegir }: { onElegir: (c: Character) => void }) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-center text-cuerpo text-suave">¿Con quién quieres conversar hoy?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PERSONAJES.map((p) => (
          <TarjetaDePersonaje
            key={p.character}
            character={p.character}
            nombre={p.nombre}
            rol={p.rol}
            frase={p.frase}
            icono={p.character === "aura" ? IconCat : IconDog}
            onSeleccionar={() => onElegir(p.character)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * P-12. `TarjetaDeContencion` (`role="status"`, cortés) y NO `BannerInformativo tipo="crisis"`
 * (`role="alert"`, asertivo): «contención, no alarma» (`E3`) también es una propiedad ARIA,
 * no solo un color.
 *
 * Se renderiza SOLO el mensaje que llega del servidor. Ese texto está aprovisionado por
 * entorno (`SEG-01 §5`, `RN-06`) y el producto lo pinta, no lo escribe. El bloque de líneas
 * telefónicas del mockup no aparece: el catálogo está vacío y `ChatResponseV1` no lo
 * transporta, así que dos tarjetas con «[configurada por entorno]» serían prometerle una
 * ruta que no existe a alguien en crisis. `ECU-07 FA-01` es explícito en que, sin recursos
 * presentables, se orienta «en términos genéricos, sin números ni líneas embebidos» — que es
 * justo lo que el propio mensaje del servidor ya dice.
 *
 * `FA-02` (escribir otra vez con el chat suspendido) se cumple POR CONSTRUCCIÓN: el
 * compositor está deshabilitado, así que no puede salir ninguna petición. Es más fuerte que
 * interceptar el envío, y elimina cualquier posibilidad de que un error técnico se haga
 * visible durante la crisis (`ECU-07 §13`).
 */
function Contencion({
  texto,
  refTitulo,
  onNuevaSesion,
}: {
  texto: string;
  refTitulo: RefObject<HTMLHeadingElement | null>;
  onNuevaSesion: () => void;
}) {
  return (
    <div className="mb-3 flex flex-col gap-3">
      <TarjetaDeContencion
        titulo="Lo más importante ahora es tu seguridad"
        refTitulo={refTitulo}
      >
        <p className="whitespace-pre-line">{texto}</p>
      </TarjetaDeContencion>

      {/*
        La nota de transparencia se reescribe respecto del mockup, que decía «aunque el
        modelo esté caído»: eso es vocabulario interno, y `ECU-07 §13` es más estricto aquí
        que en el resto del producto porque «un error técnico visible durante una crisis es un
        daño en sí mismo». La primera frase pasa a ser la declaración de naturaleza de IA que
        exigen `SEG-01 §5` y `ECU-07 RE-06`, y que el mensaje del servidor NO trae.
      */}
      <p className="text-center text-caption text-suave">
        Alan y Aura son una IA de acompañamiento y no atienden emergencias. No guardamos el
        contenido de esta conversación ni registramos ninguna clasificación.
      </p>

      <div className="flex justify-center">
        <Button onClick={onNuevaSesion} className="h-11 px-5 text-cuerpo">
          Iniciar una nueva sesión
        </Button>
      </div>
    </div>
  );
}

/**
 * `role="status"`, nunca `alert`, y sin `text-destructivo`: ese rol está reservado a la
 * confirmación de eliminar cuenta (DIS-01 §2.5). Es el sistema hablando, no el personaje,
 * así que tampoco lleva la serif de voz ni el tinte de persona.
 */
function TiraDeFallo({
  copia,
  onReintentar,
  hayPendiente,
}: {
  copia: ReturnType<typeof copiaDeFallo>;
  onReintentar: () => void;
  hayPendiente: boolean;
}) {
  return (
    <div className="mb-3">
      <BannerInformativo tipo="aviso">
        <p className="text-texto">{copia.titulo}</p>
        {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
        {copia.accion.tipo === "reintentar" && hayPendiente ? (
          <Button
            variant="outline"
            onClick={onReintentar}
            className="mt-3 h-11 gap-2 px-4 text-cuerpo"
          >
            <Icono icono={IconRefresh} size={16} />
            {copia.accion.etiqueta}
          </Button>
        ) : null}
      </BannerInformativo>
    </div>
  );
}
