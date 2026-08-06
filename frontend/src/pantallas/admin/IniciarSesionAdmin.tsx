import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { iniciarSesionAdmin } from "@/api/endpoints";
import { useComando } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { CampoDeFormulario } from "@/componentes/CampoDeFormulario";
import { Button } from "@/components/ui/button";
import { copiaDeFallo } from "@/copia/fallos";
import { copiaDeMotivo } from "@/copia/motivos";
import { useSesion } from "@/sesion/SesionProvider";

/**
 * P-04 Acceso de administración — `/plataforma-admin/login/` (CU-03 FA-02, RF-14).
 *
 * UN SOLO ESTADO DE ERROR, aunque `DIS-00 §2` liste «403 rol insuficiente» entre sus
 * estados. El backend real responde `401` genérico también cuando la cuenta existe pero no
 * es administradora (verificado en `auth/login-admin.ts`), y eso es lo correcto: `RN-03.7`
 * pide no revelar si la cuenta existe ni si tiene el rol. El 403 de `ECU-03 FE-02` es otra
 * cosa —pedir una ruta administrativa con sesión de usuario— y lo atajan `RequiereAdmin` y
 * los propios handlers de `/admin/*`, no este formulario.
 *
 * `onboardingCompleto: true` para el administrador, aunque `LoginAdminResponse` no traiga el
 * campo. Con `false`, un administrador que alcanzara `/chat/` sería empujado al onboarding,
 * cuyo actor primario es «Usuario adulto» (`ECU-05 §5`), y acabaría escribiendo un
 * `Consentimiento` para una cuenta administrativa — peor que la alternativa. Con `true` la
 * guarda del cliente deja pasar y el servidor responde lo que tenga que responder, que es
 * exactamente la postura de `RNF-08`. El campo es una pista de renderizado, y la lectura
 * honesta para un administrador es «no tiene onboarding pendiente».
 */
export function IniciarSesionAdmin() {
  const [username, setUsername] = useState("");
  const [contrasena, setContrasena] = useState("");
  const { enviando, fallo, ejecutar } = useComando(iniciarSesionAdmin);
  const { escribirSesion } = useSesion();
  const [parametros] = useSearchParams();
  const navegar = useNavigate();

  const aviso = copiaDeMotivo(parametros.get("motivo"));
  const copia = fallo ? copiaDeFallo(fallo, "login_admin") : null;

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = await ejecutar({ username, contrasena });
    if (!resultado.ok) return;

    const { titularId, alias } = resultado.datos;
    escribirSesion({ titularId, alias, rol: "administrador", onboardingCompleto: true });
    navegar("/plataforma-admin/", { replace: true }); // ECU-03 FA-02: destino P-14.
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6" noValidate>
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 font-medium text-texto">Acceso de administración</h1>
        <p className="text-cuerpo text-suave">
          Solo personal autorizado. Tu rol se valida en el servidor; manipular el cliente no
          otorga permisos.
        </p>
      </header>

      {aviso ? <BannerInformativo tipo={aviso.tipo}>{aviso.texto}</BannerInformativo> : null}

      {copia ? (
        <BannerInformativo tipo="aviso">
          <p className="font-medium">{copia.titulo}</p>
          {copia.detalle ? <p className="text-suave">{copia.detalle}</p> : null}
        </BannerInformativo>
      ) : null}

      <div className="flex flex-col gap-4">
        <CampoDeFormulario
          etiqueta="Usuario administrador"
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
        {enviando ? "Entrando…" : "Entrar al panel"}
      </Button>

      <p className="text-center text-caption text-suave">
        ¿No eres administrador?{" "}
        <Link to="/" className="text-sistema underline-offset-4 hover:underline">
          Volver al inicio
        </Link>
      </p>
    </form>
  );
}
