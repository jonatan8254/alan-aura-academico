/**
 * motivos.ts — el vocabulario del parámetro `?motivo=`, en un solo sitio.
 *
 * La rama ya emitía tres de estos desde código que no se reescribe en esta fase
 * (`SesionProvider` manda `sesion_expirada`; `guardias.tsx` manda `sesion_requerida` y
 * `requerido`), y la Fase 3 añade tres más. Sin un módulo común, cuatro pantallas
 * inventarían cuatro redacciones para lo mismo.
 *
 * La asimetría entre `sesion_requerida` y `requerido` no es un descuido nuevo: viene de
 * `guardias.tsx`, que está verificado y no se toca. Se absorbe aquí en vez de arriesgar un
 * cambio en el ruteo por una cuestión de nombres.
 *
 * Un motivo describe POR QUÉ llegaste a esta pantalla, no un error. Por eso el tipo solo
 * admite `exito` y `aviso`: nada de lo que viaja por la URL justifica la paleta de crisis.
 */

export type Motivo =
  | "sesion_expirada"
  | "sesion_requerida"
  | "requerido"
  | "cuenta_creada"
  | "cuenta_eliminada"
  | "consentimiento_requerido";

export interface AvisoDeMotivo {
  texto: string;
  tipo: "exito" | "aviso";
}

const AVISOS: Record<Motivo, AvisoDeMotivo> = {
  // ECU-03 FE-03 / ECU-04 FE-01 / ECU-05 FE-04 / ECU-11 FE-01 — todas usan el mismo
  // «Tu sesión expiró».
  sesion_expirada: {
    texto: "Tu sesión expiró. Vuelve a entrar para continuar.",
    tipo: "aviso",
  },
  sesion_requerida: {
    texto: "Necesitas iniciar sesión para continuar.",
    tipo: "aviso",
  },
  // Lo emite RequiereOnboarding. P-05 lo IGNORA a propósito: decirle «te falta el
  // onboarding» a alguien que está viendo la primera pantalla del onboarding es ruido.
  requerido: {
    texto: "Antes de conversar necesitamos completar unos pasos.",
    tipo: "aviso",
  },
  // Cierra RA-01 de ECU-02: la ECU dejó abierto si el alta se confirma en P-02 o en P-03, y
  // se eligió P-03 para reusar esta convención en vez de añadir un estado a P-02.
  // Registrarse NO autentica: por eso el texto pide iniciar sesión y no da por hecho nada.
  cuenta_creada: {
    texto: "Tu cuenta está lista. Inicia sesión para continuar.",
    tipo: "exito",
  },
  // ECU-04 §11 paso 4 (corrección D-05): el aviso final de la eliminación se ve en P-01.
  // Afirma la postcondición de RF-24 —no queda dato asociado recuperable— porque es la
  // única confirmación que la persona va a recibir.
  cuenta_eliminada: {
    texto: "Tu cuenta y tus datos se eliminaron. No queda nada asociado a esa cuenta.",
    tipo: "exito",
  },
  // ECU-06 FE-09: el chat respondió 403 porque la capa base no está vigente.
  consentimiento_requerido: {
    texto: "Para conversar necesitamos tu consentimiento otra vez.",
    tipo: "aviso",
  },
};

function esMotivo(valor: string): valor is Motivo {
  return valor in AVISOS;
}

/**
 * Pensado para recibir directamente `useSearchParams().get("motivo")`. Un motivo ausente,
 * desconocido o manipulado a mano en la barra de direcciones devuelve `null` y la pantalla
 * simplemente no pinta banner — nunca un texto vacío ni el valor crudo.
 */
export function copiaDeMotivo(crudo: string | null): AvisoDeMotivo | null {
  if (crudo === null) return null;
  return esMotivo(crudo) ? AVISOS[crudo] : null;
}
