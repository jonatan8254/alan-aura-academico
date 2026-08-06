import { useState } from "react";
import { useNavigate } from "react-router";
import { IconCheck } from "@tabler/icons-react";

import { cerrarSesion } from "@/api/endpoints";
import { Icono } from "@/componentes/Icono";
import { EDAD } from "@/dominio/consentimiento";
import { actualizarBorrador, escribirBorrador } from "@/onboarding/borrador";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * P-06 Onboarding · declaración de edad — `/onboarding/edad` (CU-05, RF-02).
 *
 * «No» ES `ECU-05 FE-01`, y su implementación se decidió antes de esta fase
 * (`CONTRATO_API_v1`, actualización segunda): la pantalla **nunca llama a
 * `POST /onboarding`** — `FE-01` no crea nada— sino directo a `POST /auth/logout`, y navega
 * a `/onboarding/no-disponible`. Por eso `OnboardingRequest.esAdulto` es el literal `true`:
 * un `false` no tiene a dónde ir.
 *
 * La limpieza local es INCONDICIONAL y va pase lo que pase con la respuesta. `FE-01` dice
 * que «el Sistema cierra la sesión sin esperar acción del Usuario», así que el bloqueo no
 * puede quedar colgando de que la red funcione. Si el logout falla, la cookie sobrevive en
 * el navegador hasta vencer, pero la interfaz no puede dejar a un menor de edad aparentando
 * seguir dentro. (Esto solo funciona porque `/auth/logout` está fuera de la redirección
 * global del 401 — ver cliente.ts; con ella, un 401 mandaría a `/login/?motivo=sesion_expirada`
 * y el bloqueo no se vería.)
 *
 * SIN diálogo de «¿seguro?» antes de «No». `FE-01` no lo tiene, y presionar a un menor para
 * que reconsidere una respuesta honesta es exactamente lo contrario del uso no punitivo del
 * canon. Tampoco se muestra error si el logout falla: informar de un fallo interno a alguien
 * a quien se acaba de bloquear no aporta nada.
 */
export function Edad() {
  const navegar = useNavigate();
  const { escribirSesion } = useSesion();
  const [bloqueando, setBloqueando] = useState(false);

  function declararAdulto() {
    actualizarBorrador({ esAdulto: true });
    navegar("/onboarding/consentimiento");
  }

  async function declararMenor() {
    setBloqueando(true);
    // Primero el borrador: si algo se tuerce a mitad, no puede quedar uno con esAdulto en un
    // estado ambiguo esperando a que alguien lo retome.
    escribirBorrador(null);
    await cerrarSesion();
    escribirSesion(null);
    navegar("/onboarding/no-disponible", { replace: true }); // replace: «atrás» no vuelve al gate.
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-medium text-texto">{EDAD.titulo}</h1>
        <p className="max-w-lectura text-cuerpo text-suave">{EDAD.subtitulo}</p>
      </header>

      {/*
        Botones de tarjeta, no radios con un «Continuar» debajo: el mockup no dibuja botón de
        avance en este paso, y la respuesta es la acción.
      */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={declararAdulto}
          disabled={bloqueando}
          className="flex items-center gap-3 rounded-tarjeta border border-borde bg-superficie p-4 text-left text-cuerpo text-texto transition-colors duration-rapido hover:border-borde-fuerte hover:bg-superficie-alt disabled:opacity-50"
        >
          <Icono icono={IconCheck} size={20} className="shrink-0 text-exito" />
          {EDAD.si}
        </button>
        <button
          type="button"
          onClick={declararMenor}
          disabled={bloqueando}
          className="flex items-center gap-3 rounded-tarjeta border border-borde bg-superficie p-4 text-left text-cuerpo text-suave transition-colors duration-rapido hover:border-borde-fuerte hover:bg-superficie-alt disabled:opacity-50"
        >
          {bloqueando ? "Un momento…" : EDAD.no}
        </button>
      </div>
    </div>
  );
}
