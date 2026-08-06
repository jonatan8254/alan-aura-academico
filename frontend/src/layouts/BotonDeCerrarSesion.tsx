import { useState } from "react";

import { cerrarSesion } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * BotonDeCerrarSesion.tsx — el control que `ECU-03 RA-01` dejó sin diseñar.
 *
 * `RA-01` es explícito: la RUTA existe (`POST /api/v1/auth/logout`, ARQ-01-D3) pero
 * «DIS-00 no inventarió ninguna pantalla, estado ni control para el cierre de sesión», y
 * declararlo «queda para la fase de construcción». Esta es esa fase.
 *
 * `RA-01` ancla el control en P-10 y P-14. Aquí acaba apareciendo también en P-13, P-15 y
 * P-16, que es un superconjunto: P-13 es alcanzable por su cuenta y dejar a alguien ahí sin
 * salida sería un callejón, y P-15/P-16 comparten cabecera con P-14 — esconderlo en dos de
 * las tres pestañas de administración sería una inconsistencia que ninguna fuente pide.
 *
 * SIN diálogo de confirmación: cerrar sesión es reversible y ninguna ECU lo exige. Los
 * diálogos son de las acciones irreversibles de P-13 y del kill switch de P-16.
 *
 * FAIL-CLOSED, que es la decisión importante: la pista local se borra y se navega PASE LO
 * QUE PASE con la respuesta. Un 401 aquí significa que la sesión ya no existía —el estado
 * deseado ya se cumple—, y un fallo de red no puede dejar a alguien que pidió salir
 * aparentando seguir dentro. La cookie es `httpOnly` y solo el servidor puede borrarla; si
 * la llamada no llegó, esa cookie ya está vencida o lo estará, y en ningún caso concede algo
 * que la pista local deba seguir afirmando.
 */
export function BotonDeCerrarSesion({
  destino = "/login/",
  etiqueta = "Cerrar sesión",
}: {
  /** Los administradores vuelven a su propia puerta, no a la de usuario (RN-03.7). */
  destino?: string;
  etiqueta?: string;
}) {
  const { escribirSesion } = useSesion();
  const [saliendo, setSaliendo] = useState(false);

  async function salir() {
    setSaliendo(true);
    // El Resultado se descarta a propósito: no hay desenlace de logout que deba cambiar
    // lo que hacemos a continuación. `/auth/logout` está fuera de la redirección global
    // del 401 (ver cliente.ts) precisamente para que este camino no sea secuestrado.
    await cerrarSesion();
    escribirSesion(null);
    // Recarga completa y no `navigate`, por el mismo motivo que la eliminación de cuenta:
    // al limpiar la pista, la guarda de la ruta desde la que se sale se re-renderiza y su
    // `<Navigate>` gana la carrera, añadiendo un `?motivo=sesion_requerida` que le reprocha
    // no haber iniciado sesión a quien acaba de cerrarla a propósito. Y salir es, de todas
    // formas, el momento correcto para tirar todo el estado en memoria.
    window.location.assign(destino);
  }

  return (
    <Button
      variant="ghost"
      onClick={salir}
      disabled={saliendo}
      className="h-11 px-3 text-cuerpo"
    >
      {saliendo ? "Saliendo…" : etiqueta}
    </Button>
  );
}
