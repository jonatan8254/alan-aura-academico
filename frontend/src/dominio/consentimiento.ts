/**
 * consentimiento.ts — el disclosure de P-05 y las dos capas de P-07.
 *
 * `ECU-05 RE-04` dice que este texto «se aprovisiona por entorno y requiere revisión legal
 * (Ley 1581)». Mientras esa revisión no ocurra —sigue abierta como pendiente de nivel 6—,
 * tenerlo en un archivo con nombre propio es lo mínimo: el día que llegue la versión
 * revisada se cambia aquí y en ningún otro sitio.
 */

/**
 * Viaja en `OnboardingRequest.versionDisclosure`. El backend la reusa como
 * `Consentimiento.version` Y como `capsula.consentVersion` (verificado en
 * `backend/src/handlers/onboarding.ts`): no hay un campo de versión de consentimiento
 * aparte.
 *
 * Cambiarla no es un bump cosmético. Los consentimientos ya otorgados se quedan en la
 * versión anterior, y el producto no tiene forma de leerla de vuelta (no hay `GET /perfil`),
 * así que no puede avisar a nadie de que consintió bajo un texto viejo. Subirla es una
 * decisión de canon, no de código.
 */
export const VERSION_DISCLOSURE = "disclosure-2026-08-v1";

/** P-05, literal del mockup. El énfasis es de color, nunca negrita: solo hay pesos 400 y 500. */
export const DISCLOSURE = {
  titulo: "Antes de empezar, algo importante",
  cuerpoAntes: "Vas a conversar con una ",
  cuerpoEnfasis: "inteligencia artificial",
  cuerpoDespues:
    " de acompañamiento —Alan y Aura—, no con un profesional de la salud. Te escucha y te " +
    "orienta con seguridad; no diagnostica, no da tratamiento ni atiende urgencias.",
  notaDeRiesgo:
    "Si en algún momento aparece una señal de riesgo, dejamos la conversación normal y te " +
    "conectamos con ayuda humana.",
  continuar: "Entendido, continuar",
  salir: "Salir",
} as const;

/** P-06, literal del mockup. */
export const EDAD = {
  titulo: "¿Eres mayor de 18 años?",
  subtitulo:
    "Este espacio es solo para personas adultas. Guardamos tu respuesta como una " +
    "declaración, no tu fecha de nacimiento.",
  si: "Sí, soy mayor de 18 años",
  no: "No",
} as const;

/**
 * P-07. Los dos toggles arrancan APAGADOS, contra lo que dibuja el mockup: `DIS-01 §2 E4` y
 * `DIS-00 §2` piden «toggles apagados por defecto, sin casillas premarcadas». El mockup
 * muestra un estado ya interactuado.
 *
 * El texto de «ver detalle» no está en el mockup y se redacta aquí desde `ECU-05 §4.1` y
 * `ECU-12 §4.1` — es el que la revisión legal tendrá que mirar primero.
 */
export const CONSENTIMIENTO = {
  titulo: "Tu consentimiento",
  subtitulo: "Pedimos permiso para lo mínimo. Es granular y puedes revocarlo cuando quieras.",
  nota: "Sin casillas premarcadas. No guardamos el contenido de tus conversaciones.",
  otorgar: "Otorgar consentimiento",
  ahoraNo: "Ahora no",
  base: {
    titulo: "Procesar tus mensajes durante la sesión para responderte",
    nota: "Necesario para conversar",
    detalle:
      "Procesamos tu declaración de edad, el acompañante que elijas y el mensaje del turno " +
      "en curso, solo para poder responderte. No guardamos el contenido de la conversación.",
  },
  personalizacion: {
    titulo: "Recordar tu caracterización para no repetirla",
    nota: "Opcional",
    detalle:
      "Usamos tus cuatro respuestas de caracterización —ánimo, energía, objetivo y estilo— " +
      "para orientar el tono de la conversación. Puedes revocarlo cuando quieras desde tu " +
      "cuenta, y podrás seguir conversando.",
  },
} as const;

/** ECU-05 FE-02, literal. No bloquea el botón: explica por qué no se puede avanzar. */
export const SIN_CAPA_BASE = "Sin consentimiento no es posible conversar.";
