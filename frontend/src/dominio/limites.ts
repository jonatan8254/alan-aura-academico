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
 * CUATRO ELEMENTOS, no cuatro pares. Los documentos dicen «hasta 4 intercambios», que se lee
 * naturalmente como 4 idas y venidas (8 mensajes), pero `ChatRequestV1.history` es una lista
 * plana de `{rol, texto}` y el handler responde 400 a `history.length > 4`. Manda la
 * implementación: mandar 8 sería un 400 garantizado.
 */
export const MAX_INTERCAMBIOS_DE_HISTORIAL = 4;

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
