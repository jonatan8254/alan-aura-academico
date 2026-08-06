/** Catch-all ("*"). No está en el inventario de 16 pantallas de DIS-00 — se añade en Fase
 * 0b porque una app enrutada con react-router necesita una respuesta para una ruta que no
 * existe (evita una pantalla en blanco). Stub. */
export function NotFound() {
  return <div className="p-6 text-cuerpo text-texto">404 — ruta no encontrada</div>;
}
