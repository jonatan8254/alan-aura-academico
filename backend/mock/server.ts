/**
 * Mock server de las 13 rutas de /api/v1 (CONTRATO_API_v1.md / ARQ-01-D3).
 * Sin AWS, sin persistencia real — datos de ejemplo en memoria (fixtures.ts).
 * Objetivo: que el frontend arranque sin esperar a que el backend real exista.
 *
 * No valida sesión ni CSRF: eso es responsabilidad del backend real. Aquí solo
 * se respeta el shape de contrato-api y los códigos de estado declarados.
 */
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import type {
  HealthResponse,
  RegistroRequest,
  RegistroResponse,
  LoginRequest,
  LoginResponse,
  LoginAdminRequest,
  LoginAdminResponse,
  LogoutResponse,
  OnboardingRequest,
  OnboardingResponse,
  ChatRequestV1,
  ChatResponseV1,
  ReiniciarPerfilResponse,
  RevocarPersonalizacionResponse,
  EliminarCuentaResponse,
  DirectorioResponse,
  MetricasResponse,
  ChatAccessRequest,
  ChatAccessResponse,
} from "contrato-api";
import {
  directorio,
  agregadoDeCuentas,
  agregadoDeUso,
  estado,
  respuestasDeEjemplo,
} from "./fixtures.js";

const PUERTO = Number(process.env.PORT ?? 4000);

function leerCuerpo(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", (fragmento) => (datos += fragmento));
    req.on("end", () => {
      if (!datos) return resolve({});
      try {
        resolve(JSON.parse(datos));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function responderJson(res: ServerResponse, codigo: number, cuerpo: unknown): void {
  const texto = JSON.stringify(cuerpo);
  res.writeHead(codigo, { "Content-Type": "application/json" });
  res.end(texto);
}

const servidor = createServer(async (req, res) => {
  const metodo = req.method ?? "GET";
  const ruta = (req.url ?? "").split("?")[0];

  try {
    if (metodo === "GET" && ruta === "/api/v1/health") {
      return responderJson(res, 200, { estado: "ok" } satisfies HealthResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/auth/registro") {
      const cuerpo = (await leerCuerpo(req)) as RegistroRequest;
      if (!cuerpo.username || !cuerpo.alias || !cuerpo.contrasena) {
        return responderJson(res, 400, { error: "campos requeridos faltantes" });
      }
      return responderJson(res, 201, {
        titularId: "titular-mock-0001",
      } satisfies RegistroResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/auth/login") {
      const cuerpo = (await leerCuerpo(req)) as LoginRequest;
      if (!cuerpo.username || !cuerpo.contrasena) {
        return responderJson(res, 400, { error: "campos requeridos faltantes" });
      }
      return responderJson(res, 200, {
        titularId: "titular-mock-0001",
        alias: "visitante_calmado",
        onboardingCompleto: true,
      } satisfies LoginResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/auth/login-admin") {
      const cuerpo = (await leerCuerpo(req)) as LoginAdminRequest;
      if (!cuerpo.username || !cuerpo.contrasena) {
        return responderJson(res, 400, { error: "campos requeridos faltantes" });
      }
      return responderJson(res, 200, {
        titularId: "admin-mock-0001",
        alias: "admin_demo",
      } satisfies LoginAdminResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/auth/logout") {
      return responderJson(res, 200, {
        estado: "sesion_cerrada",
      } satisfies LogoutResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/onboarding") {
      const cuerpo = (await leerCuerpo(req)) as OnboardingRequest;
      // Solo edad, capa base y character son obligatorios (RN-01.4) — los
      // 4 autorreportes se pueden omitir.
      if (!cuerpo.character || !cuerpo.esAdulto || !cuerpo.consentimientoBase) {
        return responderJson(res, 400, { error: "cápsula incompleta" });
      }
      return responderJson(res, 200, {
        onboardingCompleto: true,
      } satisfies OnboardingResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/chat") {
      const cuerpo = (await leerCuerpo(req)) as ChatRequestV1;
      if (!cuerpo.texto) {
        return responderJson(res, 400, { error: "mensaje vacío" });
      }
      const respuesta =
        respuestasDeEjemplo[Math.floor(Math.random() * respuestasDeEjemplo.length)] ??
        respuestasDeEjemplo[0]!;
      return responderJson(res, 200, {
        respuesta,
        modo: "ordinario",
      } satisfies ChatResponseV1);
    }

    if (metodo === "POST" && ruta === "/api/v1/perfil/reiniciar") {
      return responderJson(res, 200, {
        estado: "caracterizacion_reiniciada",
      } satisfies ReiniciarPerfilResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/perfil/personalizacion/revocar") {
      return responderJson(res, 200, {
        estado: "personalizacion_revocada",
      } satisfies RevocarPersonalizacionResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/cuenta/eliminar") {
      return responderJson(res, 200, {
        alcance: {
          registrosQueDesapareceran: ["perfil", "consentimiento", "cápsula", "contadores de uso"],
          esIrreversible: true,
          dejaraSinAccesoAlChat: true,
        },
      } satisfies EliminarCuentaResponse);
    }

    if (metodo === "GET" && ruta === "/api/v1/admin/directorio") {
      return responderJson(res, 200, {
        filas: directorio,
        agregado: agregadoDeCuentas,
      } satisfies DirectorioResponse);
    }

    if (metodo === "GET" && ruta === "/api/v1/admin/metricas") {
      return responderJson(res, 200, {
        agregadoDeCuentas,
        agregado: agregadoDeUso,
        estadoDelChatbot: estado.chatbot,
      } satisfies MetricasResponse);
    }

    if (metodo === "POST" && ruta === "/api/v1/admin/chat-access") {
      const cuerpo = (await leerCuerpo(req)) as ChatAccessRequest;
      if (cuerpo.estadoNuevo !== "habilitado" && cuerpo.estadoNuevo !== "deshabilitado") {
        return responderJson(res, 400, { error: "estadoNuevo inválido" });
      }
      estado.chatbot = cuerpo.estadoNuevo;
      return responderJson(res, 200, { estado: estado.chatbot } satisfies ChatAccessResponse);
    }

    responderJson(res, 404, { error: `ruta no reconocida: ${metodo} ${ruta}` });
  } catch (error) {
    responderJson(res, 400, { error: "cuerpo de la petición inválido" });
  }
});

servidor.listen(PUERTO, () => {
  console.log(`Mock de /api/v1 escuchando en http://localhost:${PUERTO}`);
});
