import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { IconShieldLock } from "@tabler/icons-react";

import { registrarse } from "@/api/endpoints";
import { useComando } from "@/api/hooks";
import { BannerInformativo } from "@/componentes/BannerInformativo";
import { CampoDeFormulario } from "@/componentes/CampoDeFormulario";
import { Icono } from "@/componentes/Icono";
import { Button } from "@/components/ui/button";
import { copiaDeFallo } from "@/copia/fallos";

/**
 * P-02 Registro — `/registro/` (CU-02, RF-20).
 *
 * REGISTRARSE NO AUTENTICA. El backend responde 201 y NO emite cookie de sesión (verificado
 * en `auth/registro.ts`): la cuenta nace sin consentimiento ni cápsula, y `ECU-02 §5` paso 3
 * dice que el sistema «confirma el alta y ofrece el paso a CU-03». Por eso aquí no se llama
 * a `escribirSesion` en ningún caso.
 *
 * `ECU-02 RA-01` dejaba abierto dónde vive el estado de éxito —«añadir un estado de
 * confirmación a P-02, o llevar al recién registrado a P-03 con un aviso de alta exitosa;
 * decide DIS-00, no esta especificación»—. Se eligió lo segundo, decidido por el usuario:
 * reusa la convención `?motivo=` que la rama ya emite y no inventa un estado que el mockup
 * no diseñó.
 *
 * NO se validan longitud de contraseña ni formato de usuario. `ECU-02 RA-02` dice que ningún
 * artefacto las fija, y el backend tampoco valida nada más allá de «no vacío». Inventarlas
 * aquí sería inventar especificación, y encima una que el servidor no haría cumplir.
 */
export function Registro() {
  const [username, setUsername] = useState("");
  const [alias, setAlias] = useState("");
  const [contrasena, setContrasena] = useState("");
  const { enviando, fallo, ejecutar } = useComando(registrarse);
  const navegar = useNavigate();

  const copia = fallo ? copiaDeFallo(fallo, "registro") : null;
  // El 409 se pinta bajo el campo que lo causó; el resto, como banner del formulario.
  const errorDeUsuario = fallo?.tipo === "conflicto" ? copia?.titulo : undefined;
  const errorGeneral = fallo && fallo.tipo !== "conflicto" ? copia : null;

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = await ejecutar({ username, alias, contrasena });
    if (resultado.ok) {
      navegar("/login/?motivo=cuenta_creada", { replace: true });
    }
    // Si no: `FA-01` (409) vuelve al paso 2 «con alias y contrasena a la espera» y `FE-01`
    // (400) conserva TODO. Como no se limpia ningún campo, los dos se cumplen sin código.
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6" noValidate>
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 font-medium text-texto">Crea tu cuenta</h1>
        <p className="text-cuerpo text-suave">Un minuto y estás dentro.</p>
      </header>

      <div className="flex items-start gap-3 rounded-tarjeta border border-borde bg-aura-50 p-4">
        <Icono icono={IconShieldLock} size={20} className="mt-0.5 shrink-0 text-aura-700" />
        <div className="flex flex-col gap-1.5 text-caption text-texto">
          <p>
            Pedimos lo mínimo: un usuario, un alias y una contraseña.{" "}
            <span className="text-aura-700">No pedimos correo, documento ni teléfono.</span>
          </p>
          {/*
            Esta segunda frase NO está en el mockup y es obligatoria: `ECU-02 RE-01` exige
            decir que, al no pedir correo, el MVP no ofrece recuperación de contraseña
            (RN-04.6) — «en vez de callarse». Callarlo dejaría a alguien sin cuenta y sin
            explicación el día que olvide la clave.
          */}
          <p className="text-suave">
            Como no pedimos correo, no podemos ayudarte a recuperar la contraseña si la
            olvidas: guárdala en un lugar seguro.
          </p>
        </div>
      </div>

      {errorGeneral ? (
        <BannerInformativo tipo="aviso">
          <p className="font-medium">{errorGeneral.titulo}</p>
          {errorGeneral.detalle ? <p className="text-suave">{errorGeneral.detalle}</p> : null}
        </BannerInformativo>
      ) : null}

      <div className="flex flex-col gap-4">
        <CampoDeFormulario
          etiqueta="Usuario"
          valor={username}
          onCambiar={setUsername}
          autoComplete="username"
          autoFocus
          deshabilitado={enviando}
          error={errorDeUsuario}
        />
        <CampoDeFormulario
          etiqueta="Alias"
          ayuda="¿Cómo quieres que te llamemos?"
          valor={alias}
          onCambiar={setAlias}
          autoComplete="nickname"
          deshabilitado={enviando}
        />
        <CampoDeFormulario
          etiqueta="Contraseña"
          tipo="password"
          valor={contrasena}
          onCambiar={setContrasena}
          autoComplete="new-password"
          deshabilitado={enviando}
        />
      </div>

      <Button type="submit" disabled={enviando} className="h-11 w-full px-5 text-cuerpo">
        {enviando ? "Creando cuenta…" : "Crear cuenta"}
      </Button>

      <p className="text-center text-caption text-suave">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login/" className="text-sistema underline-offset-4 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
