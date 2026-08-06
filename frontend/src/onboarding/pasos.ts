import type { BorradorDeOnboarding } from "./borrador";

/**
 * pasos.ts — el orden del asistente y la guarda que impide alcanzar un paso imposible.
 *
 * Sin esto, escribir `/onboarding/personaje` a mano en la barra de direcciones llega a una
 * pantalla que intentaría armar un `OnboardingRequest` con `esAdulto` en `null`: un 400
 * garantizado, y encima ilegible para quien lo reciba. La guarda no es defensa contra un
 * atacante —la autorización real la hace el servidor— sino contra un estado que la propia
 * app no sabría explicar.
 */

export interface Paso {
  numero: 1 | 2 | 3 | 4 | 5;
  ruta: string;
  completo: (borrador: BorradorDeOnboarding) => boolean;
}

export const PASOS: readonly Paso[] = [
  { numero: 1, ruta: "/onboarding/", completo: (b) => b.disclosureAceptado },
  { numero: 2, ruta: "/onboarding/edad", completo: (b) => b.esAdulto === true },
  { numero: 3, ruta: "/onboarding/consentimiento", completo: (b) => b.consentimientoBase },
  // El paso 4 NUNCA bloquea: los cuatro autorreportes son omitibles (RN-01.4 / ECU-05 FA-01),
  // así que «no haber respondido nada» es un estado válido y completo de esta pantalla.
  { numero: 4, ruta: "/onboarding/caracterizacion", completo: () => true },
  { numero: 5, ruta: "/onboarding/personaje", completo: (b) => b.character !== null },
];

/** La ruta exacta, sin heurísticas: `/onboarding/` y `/onboarding/edad` no se parecen. */
export function pasoDe(pathname: string): Paso | null {
  return PASOS.find((paso) => paso.ruta === pathname) ?? null;
}

/**
 * En modo reinicio (llegada desde P-13/CU-11), los pasos 1–3 se dan por reafirmados: `ECU-11
 * RE-05` manda a la caracterización «sin pasos intermedios», para que el reinicio «no
 * funcione como un castigo».
 */
export function primerPasoIncompleto(borrador: BorradorDeOnboarding): Paso {
  const desde = borrador.origen === "reinicio" ? 4 : 1;
  const pendiente = PASOS.find(
    (paso) => paso.numero >= desde && !paso.completo(borrador),
  );
  // Si no hay ninguno pendiente, el sitio correcto es el último paso: es donde se envía.
  return pendiente ?? PASOS[PASOS.length - 1]!;
}

/**
 * `true` si se puede estar en este paso. Basta con mirar los ANTERIORES: estar en un paso
 * incompleto es exactamente lo normal (se acaba de llegar a él).
 */
export function sePuedeEstarEn(paso: Paso, borrador: BorradorDeOnboarding): boolean {
  const desde = borrador.origen === "reinicio" ? 4 : 1;
  if (paso.numero < desde) return false;
  return PASOS.filter((p) => p.numero >= desde && p.numero < paso.numero).every((p) =>
    p.completo(borrador),
  );
}
