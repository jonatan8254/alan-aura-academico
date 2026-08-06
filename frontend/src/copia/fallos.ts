import type { Fallo } from "@/api/resultado";

/**
 * fallos.ts — el único sitio donde un `Fallo` se convierte en algo que una persona lee.
 *
 * Existe porque RF-26 pide dos cosas a la vez: manejar 400/401/403/409/429/502/504 «sin
 * jerga ni códigos crudos» **y** que la UI «permita reintento manual». Lo segundo es la
 * razón de que esto devuelva una estructura y no un `string`: un texto suelto no puede
 * expresar que este fallo lleva botón de reintento y aquel redirige al onboarding.
 *
 * Por qué defaults + excepciones, y no una tabla completa: 13 contextos x 10 tipos son 130
 * celdas, de las cuales la gran mayoría dirían lo mismo (un fallo de red es un fallo de red
 * en cualquier pantalla). Con esta forma, el archivo se lee como «qué tiene de especial esta
 * pantalla», que es justo lo que se puede revisar contra las ECU.
 *
 * Un contexto es una OPERACIÓN de negocio, no una ruta HTTP ni una pantalla. P-13 aporta
 * tres contextos porque sus tres acciones no significan lo mismo; P-10, P-11 y P-12
 * comparten uno porque son la misma operación (ECU-06).
 *
 * Nada de lo que sale de aquí usa la paleta de crisis: `crisis-*` es de la contención de
 * P-12 (DIS-01 §2.5, «contención, nunca alarma») y `destructivo` está reservado a eliminar
 * cuenta. Un fallo técnico no es ninguna de las dos cosas, así que `CopiaDeFallo` no tiene
 * campo de tono — todos los banners de fallo son `tipo="aviso"` y no hay forma de pedir otro.
 */

export type ContextoDeCopia =
  | "presentacion"
  | "registro"
  | "login"
  | "login_admin"
  | "onboarding"
  | "chat"
  | "cerrar_sesion"
  | "reiniciar_perfil"
  | "revocar_personalizacion"
  | "eliminar_cuenta"
  | "admin_directorio"
  | "admin_metricas"
  | "admin_kill_switch";

export type AccionDeRecuperacion =
  | { tipo: "reintentar"; etiqueta: string }
  | { tipo: "navegar"; etiqueta: string; destino: string }
  | { tipo: "ninguna" };

export interface CopiaDeFallo {
  /** Una oración, sentence case, español de Colombia. Sin códigos ni nombres de campo. */
  titulo: string;
  /** Segunda línea opcional: qué puede hacer la persona. */
  detalle?: string;
  accion: AccionDeRecuperacion;
}

/**
 * ECU-03 FE-01 exige un texto «genérico de credenciales incorrectas, idéntico en ambos
 * casos, sin delatar cuál falló». Se exporta como constante para que P-03 y P-04 no puedan
 * divergir: la garantía la da el módulo, no la disciplina de quien escribe la pantalla.
 * Literal del mockup p03.
 */
export const ERROR_CREDENCIALES = "Usuario o contraseña incorrectos.";

const REINTENTAR: AccionDeRecuperacion = { tipo: "reintentar", etiqueta: "Reintentar" };
const NINGUNA: AccionDeRecuperacion = { tipo: "ninguna" };

/**
 * Coincidencia tolerante contra el cuerpo del error. Tolerante a propósito: el cuerpo
 * `{"error": "..."}` es convención de los handlers, no contrato — CONTRATO_API_v1.md no
 * declara su forma. Comparar por igualdad exacta ataría la interfaz a una redacción que
 * nadie prometió mantener.
 */
function mencionaA(detalle: string | undefined, aguja: string): boolean {
  if (!detalle) return false;
  return detalle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .includes(aguja);
}

const POR_DEFECTO: Record<Fallo["tipo"], CopiaDeFallo> = {
  entrada_invalida: {
    titulo: "Revisa los datos e inténtalo de nuevo.",
    accion: NINGUNA,
  },
  // En la práctica se ve poco: cliente.ts ya limpia la sesión y navega al login ante
  // cualquier 401 fuera de las rutas de acceso. Queda por si una pantalla lo pinta durante
  // el frame que dura la redirección.
  sin_sesion: {
    titulo: "Tu sesión expiró.",
    detalle: "Vuelve a entrar para continuar.",
    accion: NINGUNA,
  },
  sin_permiso: {
    titulo: "No tienes permiso para esta acción.",
    accion: NINGUNA,
  },
  conflicto: {
    titulo: "No pudimos completar la acción.",
    detalle: "Inténtalo de nuevo en un momento.",
    accion: REINTENTAR,
  },
  // Sin cuenta atrás: el backend nunca manda `Retry-After` (verificado en respuestas.ts),
  // así que `esperarSegundos` siempre llega en null. Inventar un número sería peor que no
  // dar ninguno.
  limite_de_tasa: {
    titulo: "Vas un poco rápido.",
    detalle: "Espera un momento y vuelve a intentarlo.",
    accion: REINTENTAR,
  },
  proveedor_caido: {
    titulo: "Algo falló de nuestro lado.",
    detalle: "Inténtalo de nuevo en unos minutos.",
    accion: REINTENTAR,
  },
  tiempo_agotado: {
    titulo: "Esto se demoró más de lo normal.",
    detalle: "Puedes intentarlo otra vez.",
    accion: REINTENTAR,
  },
  red: {
    titulo: "Parece que no hay conexión.",
    detalle: "Revisa tu internet y vuelve a intentarlo.",
    accion: REINTENTAR,
  },
  respuesta_ilegible: {
    titulo: "Recibimos una respuesta que no pudimos leer.",
    detalle: "Inténtalo de nuevo.",
    accion: REINTENTAR,
  },
  desconocido: {
    titulo: "Algo no salió bien.",
    detalle: "Inténtalo de nuevo.",
    accion: REINTENTAR,
  },
};

type Excepciones = Partial<Record<Fallo["tipo"], CopiaDeFallo>>;

const OVERRIDES: Partial<Record<ContextoDeCopia, Excepciones>> = {
  registro: {
    // ECU-02 FA-01. Texto del mockup p02. Sin acción: la corrección es editar el campo, y
    // la pantalla conserva alias y contraseña.
    conflicto: {
      titulo: "Ese usuario ya está en uso.",
      detalle: "Prueba con otro.",
      accion: NINGUNA,
    },
    entrada_invalida: {
      titulo: "Faltan datos.",
      detalle: "Usuario, alias y contraseña son obligatorios.",
      accion: NINGUNA,
    },
    // Un 502 aquí es infraestructura de AWS, no el proveedor del modelo: la copia por
    // defecto («algo falló de nuestro lado») serviría, pero nombrar la operación es más
    // útil y evita que alguien la reescriba como «el proveedor de IA no responde».
    proveedor_caido: {
      titulo: "No pudimos crear tu cuenta ahora mismo.",
      detalle: "Inténtalo de nuevo en unos minutos.",
      accion: REINTENTAR,
    },
  },

  login: {
    // ECU-03 FE-01: en las rutas de acceso un 401 NO es «sesión expirada», es «credenciales
    // incorrectas». Y no se ofrece recuperación, que el MVP no tiene (RN-04.6).
    sin_sesion: { titulo: ERROR_CREDENCIALES, accion: NINGUNA },
    // Legítimamente distinto del 401: CA-06 solo exige texto idéntico entre «usuario
    // inexistente» y «contraseña incorrecta», y ambos son 401. Un 400 no revela ninguna de
    // las dos cosas.
    entrada_invalida: { titulo: "Escribe tu usuario y tu contraseña.", accion: NINGUNA },
    proveedor_caido: {
      titulo: "No pudimos iniciar sesión ahora mismo.",
      detalle: "Inténtalo de nuevo en unos minutos.",
      accion: REINTENTAR,
    },
  },

  login_admin: {
    // Mismo literal que login, a propósito: RN-03.7 pide no revelar si la cuenta existe ni
    // si tiene el rol. El backend ya responde 401 genérico también cuando el rol no es
    // administrador.
    sin_sesion: { titulo: ERROR_CREDENCIALES, accion: NINGUNA },
    entrada_invalida: { titulo: "Escribe tu usuario y tu contraseña.", accion: NINGUNA },
    proveedor_caido: {
      titulo: "No pudimos iniciar sesión ahora mismo.",
      detalle: "Inténtalo de nuevo en unos minutos.",
      accion: REINTENTAR,
    },
  },

  onboarding: {
    // ECU-05 FE-03, literal. Sin acción: se vuelve al paso 8 conservando lo válido.
    entrada_invalida: { titulo: "Revisa tus respuestas.", accion: NINGUNA },
  },

  chat: {
    // ECU-06 FE-03. La validación de 2.500 caracteres ya la hace CompositorDeMensaje, así
    // que llegar aquí significa otra cosa; la corrección es editar el mensaje, no reintentar.
    entrada_invalida: {
      titulo: "No pudimos enviar ese mensaje.",
      detalle: "Revísalo e inténtalo de nuevo.",
      accion: NINGUNA,
    },
    // ECU-06 FE-06. El mockup p11 fusiona 502 y 504 bajo «tardó en responder», pero un 502
    // no es una tardanza: es que no se pudo conectar. Se separan porque las ECU les dan
    // políticas de reintento distintas (FE-06 admite uno automático, FE-07 ninguno).
    proveedor_caido: {
      titulo: "No pudimos conectar con {personaje} ahora mismo.",
      detalle: "¿Reintentamos?",
      accion: REINTENTAR,
    },
    // ECU-06 FE-07, literal del mockup p11.
    tiempo_agotado: {
      titulo: "{personaje} tardó en responder esta vez.",
      detalle: "¿Reintentamos?",
      accion: REINTENTAR,
    },
  },

  reiniciar_perfil: {
    entrada_invalida: {
      titulo: "No pudimos reiniciar tu caracterización; confirma de nuevo.",
      accion: NINGUNA,
    },
    // ECU-11 FE-04. Importante decir que nada cambió: la cápsula sigue intacta y completa.
    desconocido: {
      titulo: "No pudimos reiniciar tu caracterización.",
      detalle: "Tu caracterización sigue como estaba; puedes intentarlo de nuevo.",
      accion: REINTENTAR,
    },
  },

  revocar_personalizacion: {
    entrada_invalida: {
      titulo: "No pudimos registrar tu revocación; inténtalo de nuevo.",
      accion: NINGUNA,
    },
  },

  eliminar_cuenta: {
    entrada_invalida: {
      titulo: "No pudimos completar la eliminación; inténtalo de nuevo.",
      accion: NINGUNA,
    },
    // ECU-04 FE-04, el desenlace que más importa de toda la pantalla: la supresión quedó
    // PARCIAL. Decirlo es obligatorio — lo borrado no vuelve — y el reintento retoma desde
    // donde quedó, porque el borrado es idempotente.
    desconocido: {
      titulo: "No pudimos terminar de eliminar tu cuenta.",
      detalle:
        "Parte de tus datos ya se borró y el resto sigue pendiente; puedes reintentarlo.",
      accion: REINTENTAR,
    },
  },

  admin_directorio: {
    sin_permiso: { titulo: "No tienes permiso para ver esta sección.", accion: NINGUNA },
  },
  admin_metricas: {
    sin_permiso: { titulo: "No tienes permiso para ver esta sección.", accion: NINGUNA },
  },
  admin_kill_switch: {
    // ECU-10 FE-03, literal.
    entrada_invalida: {
      titulo: "No pudimos aplicar el cambio; inténtalo de nuevo.",
      accion: NINGUNA,
    },
  },
};

/**
 * Tercer nivel: solo donde el mismo código, en el mismo contexto, significa dos cosas
 * distintas. Es lo que ni `contexto` ni una tabla plana pueden resolver, y la única razón
 * por la que `Fallo` transporta `detalle`.
 *
 * Devolver `null` significa «este caso no es especial»: se sigue a OVERRIDES y luego al
 * default. Todo `detalle` que no se reconozca cae por ahí, que es siempre la rama segura.
 */
const SUBCASOS: Partial<Record<ContextoDeCopia, (fallo: Fallo) => CopiaDeFallo | null>> = {
  // ECU-01 FE-01: en la landing da igual por qué falló /health — lo único que el Visitante
  // necesita saber es que el servicio no está, «sin exponer detalle técnico».
  presentacion: () => ({
    titulo: "El servicio no está disponible ahora mismo.",
    detalle: "Estamos en mantenimiento. Vuelve a intentarlo en unos minutos.",
    accion: REINTENTAR,
  }),

  chat: (fallo) => {
    // Los dos 403 de ECU-06 salen de la misma ruta y solo el cuerpo los separa.
    if (fallo.tipo === "sin_permiso") {
      // FE-09: la capa base no está vigente. No es un error que la persona pueda reintentar;
      // el remedio es rehacer CU-05. El título no llega a verse (se navega), pero se escribe
      // por si una pantalla lo pinta durante la transición.
      if (mencionaA(fallo.detalle, "consentimiento")) {
        return {
          titulo: "Necesitamos tu consentimiento para conversar.",
          detalle: "Te llevamos a otorgarlo de nuevo.",
          accion: {
            tipo: "navegar",
            etiqueta: "Continuar",
            destino: "/onboarding/?motivo=consentimiento_requerido",
          },
        };
      }
      // FE-02: rol no autorizado. «Termina» — sin reintento y sin ruta de salida.
      return {
        titulo: "Esta cuenta no tiene acceso al chat de acompañamiento.",
        accion: NINGUNA,
      };
    }

    // Los dos 429 tampoco son lo mismo, y la diferencia importa: uno se arregla esperando
    // un minuto y el otro no se arregla hoy. Ofrecer «Reintentar» en el diario sería
    // ofrecer algo que no puede funcionar.
    if (fallo.tipo === "limite_de_tasa") {
      if (mencionaA(fallo.detalle, "diario")) {
        return {
          titulo: "Llegaste al máximo de mensajes por hoy.",
          detalle: "Podemos seguir mañana.",
          accion: NINGUNA,
        };
      }
      return {
        titulo: "Vas un poco rápido.",
        detalle: "Espera un momento y seguimos.",
        accion: REINTENTAR,
      };
    }

    // ECU-06 FE-04, kill switch. Texto del mockup p11.
    if (fallo.tipo === "conflicto") {
      return {
        titulo: "El chat está en pausa por mantenimiento.",
        detalle: "Vuelve pronto; tus datos están a salvo.",
        accion: REINTENTAR,
      };
    }

    return null;
  },
};

/**
 * `sustituciones.personaje` cubre los dos únicos textos que nombran al acompañante (el 502 y
 * el 504 del chat). Sin él dirían «tu acompañante», que es correcto pero más frío que el
 * literal del mockup.
 */
export function copiaDeFallo(
  fallo: Fallo,
  contexto: ContextoDeCopia,
  sustituciones?: { personaje?: string },
): CopiaDeFallo {
  const copia =
    SUBCASOS[contexto]?.(fallo) ?? OVERRIDES[contexto]?.[fallo.tipo] ?? POR_DEFECTO[fallo.tipo];

  const personaje = sustituciones?.personaje ?? "tu acompañante";
  const aplicar = (texto: string) => texto.replace(/\{personaje\}/g, personaje);

  return {
    ...copia,
    titulo: aplicar(copia.titulo),
    detalle: copia.detalle ? aplicar(copia.detalle) : undefined,
  };
}
