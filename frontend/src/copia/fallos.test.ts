import { describe, expect, it } from "vitest";

import type { Fallo } from "@/api/resultado";

import { copiaDeFallo, type ContextoDeCopia } from "./fallos";

/**
 * Las dos mitades de `RF-26`, comprobadas por máquina.
 *
 * La primera —«sin jerga ni códigos crudos»— es difícil de vigilar a ojo: basta con que
 * alguien escriba «error 502» en una celda de la tabla para romperla, y nadie lo notaría en
 * una revisión. Aquí se comprueba sobre TODAS las combinaciones de tipo y contexto.
 *
 * La segunda —las cuatro desambiguaciones del chat— es la razón de que `Fallo` transporte
 * `detalle`, y la que rompería en silencio si alguien «simplificara» el módulo.
 */

const CONTEXTOS: readonly ContextoDeCopia[] = [
  "presentacion",
  "registro",
  "login",
  "login_admin",
  "onboarding",
  "chat",
  "cerrar_sesion",
  "reiniciar_perfil",
  "revocar_personalizacion",
  "eliminar_cuenta",
  "admin_directorio",
  "admin_metricas",
  "admin_kill_switch",
];

const FALLOS: readonly Fallo[] = [
  { tipo: "entrada_invalida", estado: 400 },
  { tipo: "sin_sesion", estado: 401 },
  { tipo: "sin_permiso", estado: 403 },
  { tipo: "conflicto", estado: 409 },
  { tipo: "limite_de_tasa", estado: 429, esperarSegundos: null },
  { tipo: "proveedor_caido", estado: 502 },
  { tipo: "tiempo_agotado", estado: 504 },
  { tipo: "red" },
  { tipo: "respuesta_ilegible" },
  { tipo: "desconocido", estado: 500 },
];

describe("copiaDeFallo — RF-26: sin jerga ni códigos crudos", () => {
  it("siempre devuelve un título no vacío", () => {
    for (const contexto of CONTEXTOS) {
      for (const fallo of FALLOS) {
        const copia = copiaDeFallo(fallo, contexto);
        expect(copia.titulo.trim().length, `${contexto}/${fallo.tipo}`).toBeGreaterThan(0);
      }
    }
  });

  it("nunca filtra un código HTTP ni vocabulario técnico", () => {
    // Los códigos que RF-26 nombra, más las palabras que delatarían un mensaje de servidor
    // o una variable sin resolver.
    const PROHIBIDO = /\b(400|401|403|409|429|500|502|504)\b|internal server|undefined|null|\berror\b|\bstatus\b|\bcódigo\b|\bcodigo\b/i;

    for (const contexto of CONTEXTOS) {
      for (const fallo of FALLOS) {
        const copia = copiaDeFallo(fallo, contexto);
        const texto = `${copia.titulo} ${copia.detalle ?? ""} ${copia.accion.tipo === "ninguna" ? "" : copia.accion.etiqueta}`;
        expect(PROHIBIDO.test(texto), `${contexto}/${fallo.tipo}: «${texto}»`).toBe(false);
      }
    }
  });

  it("nunca deja el marcador de personaje sin sustituir", () => {
    for (const contexto of CONTEXTOS) {
      for (const fallo of FALLOS) {
        const copia = copiaDeFallo(fallo, contexto);
        expect(`${copia.titulo}${copia.detalle ?? ""}`).not.toContain("{personaje}");
      }
    }
  });
});

describe("copiaDeFallo — las desambiguaciones que `detalle` hace posibles", () => {
  it("el 403 de consentimiento (ECU-06 FE-09) redirige al onboarding", () => {
    const copia = copiaDeFallo(
      { tipo: "sin_permiso", estado: 403, detalle: "consentimiento base no otorgado" },
      "chat",
    );
    expect(copia.accion.tipo).toBe("navegar");
    if (copia.accion.tipo === "navegar") {
      expect(copia.accion.destino).toContain("/onboarding/");
    }
  });

  it("el 403 de rol (ECU-06 FE-02) termina, sin reintento ni redirección", () => {
    const copia = copiaDeFallo(
      { tipo: "sin_permiso", estado: 403, detalle: "rol no autorizado" },
      "chat",
    );
    expect(copia.accion.tipo).toBe("ninguna");
  });

  it("un 403 con motivo desconocido cae a la rama segura y NO redirige", () => {
    // Es lo que devuelve API Gateway ante una ruta inexistente bajo /api/v1: un 403 con
    // cuerpo `{"message": "Missing Authentication Token"}`. Tratarlo como FE-09 mandaría al
    // onboarding a alguien por culpa de un typo de ruta.
    const copia = copiaDeFallo(
      { tipo: "sin_permiso", estado: 403, detalle: "Missing Authentication Token" },
      "chat",
    );
    expect(copia.accion.tipo).toBe("ninguna");
  });

  it("el 429 diario no ofrece reintento y el de minuto sí", () => {
    const diario = copiaDeFallo(
      { tipo: "limite_de_tasa", estado: 429, esperarSegundos: null, detalle: "límite diario de mensajes alcanzado" },
      "chat",
    );
    const porMinuto = copiaDeFallo(
      { tipo: "limite_de_tasa", estado: 429, esperarSegundos: null, detalle: "límite de mensajes por minuto alcanzado" },
      "chat",
    );
    // Reintentar hoy no puede funcionar; ofrecerlo sería ofrecer algo que se sabe inútil.
    expect(diario.accion.tipo).toBe("ninguna");
    expect(porMinuto.accion.tipo).toBe("reintentar");
  });

  it("el mismo código dice cosas distintas según la operación", () => {
    // Un 502 en el chat es el proveedor del modelo; en el registro es infraestructura, y
    // decir «el proveedor no responde» ahí sería mentir.
    const enChat = copiaDeFallo({ tipo: "proveedor_caido", estado: 502 }, "chat");
    const enRegistro = copiaDeFallo({ tipo: "proveedor_caido", estado: 502 }, "registro");
    expect(enChat.titulo).not.toBe(enRegistro.titulo);

    // Un 409 en el chat es el kill switch; en el registro, un username tomado.
    const conflictoChat = copiaDeFallo({ tipo: "conflicto", estado: 409 }, "chat");
    const conflictoRegistro = copiaDeFallo({ tipo: "conflicto", estado: 409 }, "registro");
    expect(conflictoChat.titulo).not.toBe(conflictoRegistro.titulo);
  });

  it("en las rutas de acceso, un 401 es «credenciales», no «sesión expirada»", () => {
    const enLogin = copiaDeFallo({ tipo: "sin_sesion", estado: 401 }, "login");
    const enAdmin = copiaDeFallo({ tipo: "sin_sesion", estado: 401 }, "login_admin");
    // ECU-03 FE-01: idéntico en ambos casos, sin delatar cuál falló.
    expect(enLogin.titulo).toBe(enAdmin.titulo);
    expect(enLogin.titulo.toLowerCase()).toContain("incorrect");
  });
});
