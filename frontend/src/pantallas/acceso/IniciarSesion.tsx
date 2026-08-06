import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { iniciarSesion } from "@/api/endpoints";
import { useComando } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { CampoDeFormulario } from "@/componentes/CampoDeFormulario";
import { Button } from "@/components/ui/button";
import { copiaDeFallo } from "@/copia/fallos";
import { copiaDeMotivo } from "@/copia/motivos";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * P-03 Iniciar sesión — `/login/` (CU-03, RF-21).
 *
 * EL ERROR ES GENÉRICO A PROPÓSITO. `ECU-03 FE-01` pide «un texto genérico de credenciales
 * incorrectas —idéntico en ambos casos, sin delatar cuál falló— y tampoco ofrece
 * recuperación por correo, que el MVP no tiene». Por eso no se resalta ningún campo (marcar
 * «Usuario» delataría que existe) y no hay enlace de «olvidé mi contraseña». La garantía de
 * que P-03 y P-04 digan exactamente lo mismo la da `ERROR_CREDENCIALES` en copia/fallos.ts.
 *
 * EL ROL LO FIJA LA PANTALLA. `LoginResponse` no lo trae, y `PistaDeSesion` lo necesita para
 * decidir qué renderizar. Se pone `"usuario"` porque es la puerta por la que se entró; la
 * autorización real la sigue haciendo el servidor en cada petición (`RNF-08`: «manipular el
 * cliente no cambia el rol»). Consecuencia conocida y aceptada: un administrador que entre
 * por aquí queda con pista de usuario y, si va a /plataforma-admin/, la cadena de guardas lo
 * devuelve a /chat/. No hay bucle, y el precio es coherente con tener dos puertas separadas.
 *
 * La pista se escribe ANTES de navegar: al revés, `RequiereOnboarding` leería la pista vieja
 * y rebotaría al onboarding a alguien que acaba de entrar con el onboarding completo.
 */
export function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [contrasena, setContrasena] = useState("");
  const { enviando, fallo, ejecutar } = useComando(iniciarSesion);
  const { escribirSesion } = useSesion();
  const [parametros] = useSearchParams();
  const navegar = useNavigate();

  const aviso = copiaDeMotivo(parametros.get("motivo"));
  const copia = fallo ? copiaDeFallo(fallo, "login") : null;

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = await ejecutar({ username, contrasena });
    if (!resultado.ok) return;

    const { titularId, alias, onboardingCompleto } = resultado.datos;
    escribirSesion({ titularId, alias, rol: "usuario", onboardingCompleto });
    // ECU-03 §5 paso 4 y FA-01: con el onboarding completo va al chat; si no, al onboarding.
    // Sin `motivo`: llegar al onboarding recién registrado es el camino normal, no un aviso.
    navegar(onboardingCompleto ? "/chat/" : "/onboarding/", { replace: true });
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6" noValidate>
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 font-medium text-texto">Hola de nuevo</h1>
        <p className="text-cuerpo text-suave">Inicia sesión para continuar.</p>
      </header>

      {aviso ? <BannerInformativo tipo={aviso.tipo}>{aviso.texto}</BannerInformativo> : null}

      {copia ? (
        <BannerInformativo tipo="aviso">
          <p className="font-medium">{copia.titulo}</p>
          {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
        </BannerInformativo>
      ) : null}

      <div className="flex flex-col gap-4">
        {/* Sin `error` en ninguno de los dos campos: ver la nota de FE-01 en la cabecera. */}
        <CampoDeFormulario
          etiqueta="Usuario"
          valor={username}
          onCambiar={setUsername}
          autoComplete="username"
          autoFocus
          deshabilitado={enviando}
        />
        <CampoDeFormulario
          etiqueta="Contraseña"
          tipo="password"
          valor={contrasena}
          onCambiar={setContrasena}
          autoComplete="current-password"
          deshabilitado={enviando}
        />
      </div>

      <Button type="submit" disabled={enviando} className="h-11 w-full px-5 text-cuerpo">
        {enviando ? "Entrando…" : "Entrar"}
      </Button>

      <p className="text-center text-caption text-suave">
        ¿Primera vez?{" "}
        <Link to="/registro/" className="text-sistema underline-offset-4 hover:underline">
          Crea una cuenta
        </Link>
      </p>
    </form>
  );
}
