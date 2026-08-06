/**
 * limites.ts — los números de negocio del chat, en un solo sitio.
 *
 * Mismo argumento que `lint:tokens` aplica al color: un valor que aparece en tres archivos
 * ya divergió, solo que todavía no lo sabes. Los tres de aquí están verificados contra
 * `backend/src/handlers/chat.ts` y `backend/src/lib/limites.ts`.
 */

/**
 * RN-02.8 / RF-25. El backend rechaza con 400 lo que pase de aquí, así que el compositor lo
 * corta antes: es la única validación de esta capa que evita una petición, no que la maquilla.
 */
export const MAX_CARACTERES_POR_MENSAJE = 2500;

/**
 * RN-02.2 / C-4 — el único mecanismo de memoria que existe, porque no hay persistencia del
 * chat (RF-13).
 *
 * OCHO MENSAJES = CUATRO INTERCAMBIOS. Un intercambio es una ida y vuelta (turno del usuario
 * + respuesta del personaje), así que los «hasta 4 intercambios» del canon son 8 mensajes en
 * la lista plana de `ChatRequestV1.history`.
 *
 * Hasta el 2026-08-06 esto valía 4, alineado con un backend que capaba a 4 elementos por el
 * mismo malentendido —`ChatIntercambio` modela UN mensaje, pese a su nombre—. El efecto era
 * visible: al cuarto mensaje de una conversación, el primero ya había caído del historial y
 * el modelo respondía como si no hubiera nada antes. Corregido en los dos lados a la vez.
 */
export const MAX_MENSAJES_DE_HISTORIAL = 8;

/**
 * RF-25 / ECU-06 FA-01. Lo cuenta EL CLIENTE: el backend no tiene entidad `Conversacion`
 * —es efímera por diseño— así que nadie más lleva esta cuenta, y se pierde al recargar la
 * página. Por eso la interfaz no debe presentarlo como una garantía: los límites que sí se
 * hacen cumplir son los del servidor (3/min y 30/día).
 *
 * Alcanzarlo NO es un error (corrección PDR-01 D-13): es un estado de P-10 que «finaliza de
 * forma controlada, sin error crudo».
 */
export const MAX_MENSAJES_POR_SESION = 20;

/** A partir de aquí la interfaz avisa cuántos mensajes quedan, discretamente. */
export const AVISO_DE_MENSAJES_RESTANTES = 3;
