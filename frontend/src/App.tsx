import { BrowserRouter } from "react-router";

import { SesionProvider } from "@/sesion/SesionProvider";
import { Rutas } from "@/rutas/rutas";

/**
 * App.tsx — Fase 0b. Reemplaza el placeholder de tokens de Fase 0a (que probaba tema.css a
 * mano) por el armazón real: enrutador -> proveedor de sesión -> rutas.
 *
 * `<BrowserRouter>` va POR FUERA de `<SesionProvider>`, no por dentro como sugería el
 * boceto original de esta fase: `SesionProvider` usa `useNavigate()` (ver su cabecera para
 * el porqué), y ese hook solo funciona dentro de un Router — con el orden inverso la app ni
 * arranca. `Rutas` (rutas/rutas.tsx) es quien de verdad decide qué pantalla mostrar; App.tsx
 * no vuelve a crecer más allá de este armazón.
 */
export default function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <Rutas />
      </SesionProvider>
    </BrowserRouter>
  );
}
