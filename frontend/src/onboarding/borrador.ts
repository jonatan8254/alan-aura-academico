import type {
  Character,
  ConversationGoal,
  EnergySelfReport,
  MoodSelfReport,
  OnboardingRequest,
  ResponseStyle,
} from "contrato-api";

import { VERSION_DISCLOSURE } from "@/dominio/consentimiento";

/**
 * borrador.ts — el estado del asistente de onboarding, que vive en cinco rutas pero se
 * escribe en un solo `POST /api/v1/onboarding` al final.
 *
 * Respaldado en `sessionStorage`, calcando `sesion/pista.ts`: misma forma, mismo manejo de
 * JSON corrupto y la misma razón de fondo — el borrador lleva ánimo y energía
 * autorreportados, justo el dato que `PRIV-01` quiere muerto con la pestaña. Un Context de
 * React sin respaldo perdería todo al refrescar en `/onboarding/personaje` y dejaría a la
 * persona en un paso que no puede completar; `sessionStorage` solo, sin un módulo como este,
 * repartiría la forma del borrador entre cinco pantallas.
 *
 * Propiedad que conviene tener escrita: como el POST es único y terminal, NADA se escribe en
 * el servidor hasta P-09. `ECU-05 §17` imaginaba escrituras incrementales en los pasos 5, 7
 * y 8, y por eso su `CA-10` («lo no confirmado no queda escrito») tuvo que debilitarse en la
 * v2.2 (`H-16`). Aquí `CA-10` vuelve a cumplirse en su forma fuerte: la implementación
 * resulta más estricta que su propia especificación.
 */

export interface BorradorDeOnboarding {
  disclosureAceptado: boolean;
  /** Se sella al pasar P-05, para que el texto leído y el enviado no puedan divergir. */
  versionDisclosure: string;
  /** `null` = todavía no declarado. `false` no llega nunca aquí: ver la nota de FE-01 abajo. */
  esAdulto: boolean | null;
  consentimientoBase: boolean;
  consentimientoPersonalizacion: boolean;
  // Los cuatro autorreportes son OPCIONALES (RN-01.4). Ausente ≠ "prefiero_no_responder":
  // no tocar la pregunta omite la clave del request, mientras que elegir «prefiero no
  // responder» SÍ es una respuesta y viaja. Por eso son `?:` y no valores por defecto.
  moodSelfReport?: MoodSelfReport;
  energySelfReport?: EnergySelfReport;
  conversationGoal?: ConversationGoal;
  responseStyle?: ResponseStyle;
  character: Character | null;
  /** `reinicio` = se llegó desde P-13/CU-11 y los pasos 1–3 se dan por reafirmados. */
  origen: "onboarding" | "reinicio";
}

export const BORRADOR_VACIO: BorradorDeOnboarding = {
  disclosureAceptado: false,
  versionDisclosure: VERSION_DISCLOSURE,
  esAdulto: null,
  // Los dos arrancan apagados: DIS-01 §2 E4 y DIS-00 §2 piden «sin casillas premarcadas».
  consentimientoBase: false,
  consentimientoPersonalizacion: false,
  character: null,
  origen: "onboarding",
};

const CLAVE = "borrador-onboarding";

/** Nunca devuelve `null`: un borrador ausente o corrupto es indistinguible de uno vacío. */
export function leerBorrador(): BorradorDeOnboarding {
  const crudo = sessionStorage.getItem(CLAVE);
  if (!crudo) return { ...BORRADOR_VACIO };
  try {
    return { ...BORRADOR_VACIO, ...(JSON.parse(crudo) as Partial<BorradorDeOnboarding>) };
  } catch {
    sessionStorage.removeItem(CLAVE);
    return { ...BORRADOR_VACIO };
  }
}

export function escribirBorrador(borrador: BorradorDeOnboarding | null): void {
  if (borrador) {
    sessionStorage.setItem(CLAVE, JSON.stringify(borrador));
  } else {
    sessionStorage.removeItem(CLAVE);
  }
}

/** Lee, mezcla y guarda. Es lo que usan los cinco pasos al avanzar. */
export function actualizarBorrador(
  parcial: Partial<BorradorDeOnboarding>,
): BorradorDeOnboarding {
  const siguiente = { ...leerBorrador(), ...parcial };
  escribirBorrador(siguiente);
  return siguiente;
}

/**
 * Siembra el borrador para el regreso desde P-13 tras reiniciar la caracterización (CU-11).
 *
 * `ECU-11 §11` paso 5 manda a la caracterización, no al onboarding entero, y `RE-05` es
 * explícito en que va «sin pasos intermedios» para que el reinicio «no funcione como un
 * castigo». Pero `POST /onboarding` exige igualmente `esAdulto`, `versionDisclosure` y
 * `consentimientoBase`, y no hay ninguna ruta para leerlos de vuelta (no existe
 * `GET /perfil` entre las 13).
 *
 * Se resuelve REAFIRMANDO, no inventando: `ECU-11 §14` dice que el `Consentimiento` queda
 * intacto y `PRE-04` que la capa base ya existe, así que reenviar `true` no otorga un
 * consentimiento nuevo — repite un hecho que el servidor ya tiene. Lo mismo con la
 * declaración de edad, que ya está persistida en el `Usuario` (`RN-04.2`).
 *
 * La arruga ética, atendida: afirmar esto desde una pantalla donde la persona solo pulsó
 * «Reiniciar» sería el cliente hablando por ella. Por eso P-08 muestra en modo reinicio una
 * nota que lo dice, y el POST no ocurre hasta que confirma activamente en P-09.
 *
 * Hueco que queda declarado: si algún día sube `VERSION_DISCLOSURE`, un reinicio
 * reconsentiría bajo la versión nueva sin mostrarla. Se cierra con un `GET /perfil` o
 * enrutando el reinicio por P-05 cuando las versiones difieran; hoy no es resoluble.
 */
export function sembrarParaReinicio(): BorradorDeOnboarding {
  const siguiente: BorradorDeOnboarding = {
    ...BORRADOR_VACIO,
    disclosureAceptado: true,
    esAdulto: true,
    consentimientoBase: true,
    origen: "reinicio",
  };
  escribirBorrador(siguiente);
  return siguiente;
}

/**
 * Construye el cuerpo del POST, o `null` si el borrador todavía no puede producirlo.
 *
 * Las claves de autorreporte ausentes NO se incluyen — nada de `?? "prefiero_no_responder"`.
 * Es lo que hace cumplir `RN-01.3`/`CA-05` («sin defaults para los omitidos»): el handler
 * solo escribe la clave si el cliente la mandó, así que omitirla aquí es lo que hace que la
 * cápsula se arme «solo con lo respondido».
 */
export function aPeticion(borrador: BorradorDeOnboarding): OnboardingRequest | null {
  if (!borrador.esAdulto || !borrador.consentimientoBase || borrador.character === null) {
    return null;
  }
  return {
    esAdulto: true,
    versionDisclosure: borrador.versionDisclosure,
    character: borrador.character,
    consentimientoBase: true,
    consentimientoPersonalizacion: borrador.consentimientoPersonalizacion,
    ...(borrador.moodSelfReport ? { moodSelfReport: borrador.moodSelfReport } : {}),
    ...(borrador.energySelfReport ? { energySelfReport: borrador.energySelfReport } : {}),
    ...(borrador.conversationGoal ? { conversationGoal: borrador.conversationGoal } : {}),
    ...(borrador.responseStyle ? { responseStyle: borrador.responseStyle } : {}),
  };
}
