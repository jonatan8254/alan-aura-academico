#!/usr/bin/env node
/**
 * lint-tokens.mjs — guarda contra la deriva de paleta que teme DIS-01 §7.1: "si cuatro
 * personas copian los hexadecimales a mano, la paleta habrá divergido antes de la segunda
 * semana". Recorre `src/**`, busca literales hex (`#abc`, `#aabbcc`, `#aabbccdd`, ...) y
 * falla si encuentra alguno fuera de `src/estilos/tema.css`, que es la ÚNICA fuente
 * permitida de un color hardcodeado.
 *
 * Uso: `npm run lint:tokens` (desde frontend/) — exit 0 si está limpio, exit 1 y lista de
 * ofensores si no.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ_FRONTEND = path.resolve(__dirname, "..");
const RAIZ_SRC = path.join(RAIZ_FRONTEND, "src");

// Rutas (relativas a frontend/), normalizadas a "/", exentas de la regla.
const RUTAS_EXENTAS = new Set(["src/estilos/tema.css"]);

// Extensiones en las que tiene sentido buscar (evita reventar en binarios: fuentes, imágenes).
const EXTENSIONES_A_REVISAR = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".html",
  ".mjs",
  ".cjs",
]);

const PATRON_HEX = /#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;

/** @param {string} dir @returns {string[]} */
function listarArchivosRecursivo(dir) {
  const resultado = [];
  for (const entrada of readdirSync(dir)) {
    const rutaAbsoluta = path.join(dir, entrada);
    const info = statSync(rutaAbsoluta);
    if (info.isDirectory()) {
      resultado.push(...listarArchivosRecursivo(rutaAbsoluta));
    } else {
      resultado.push(rutaAbsoluta);
    }
  }
  return resultado;
}

function rutaRelativaPosix(rutaAbsoluta) {
  return path.relative(RAIZ_FRONTEND, rutaAbsoluta).split(path.sep).join("/");
}

const ofensores = [];

for (const rutaAbsoluta of listarArchivosRecursivo(RAIZ_SRC)) {
  const relativa = rutaRelativaPosix(rutaAbsoluta);
  if (RUTAS_EXENTAS.has(relativa)) continue;
  if (!EXTENSIONES_A_REVISAR.has(path.extname(rutaAbsoluta))) continue;

  const contenido = readFileSync(rutaAbsoluta, "utf8");
  const lineas = contenido.split("\n");

  lineas.forEach((linea, indice) => {
    const coincidencias = linea.match(PATRON_HEX);
    if (coincidencias) {
      for (const hex of coincidencias) {
        ofensores.push({ archivo: relativa, linea: indice + 1, hex, texto: linea.trim() });
      }
    }
  });
}

if (ofensores.length > 0) {
  console.error(
    `lint:tokens — ${ofensores.length} literal(es) hex fuera de src/estilos/tema.css:\n`,
  );
  for (const o of ofensores) {
    console.error(`  ${o.archivo}:${o.linea}  ${o.hex}  →  ${o.texto}`);
  }
  console.error(
    "\nMueve el valor a src/estilos/tema.css (Tier 1/2/3) y consume el rol semántico " +
      '("bg-superficie", "text-persona-texto", ...) en su lugar. Ver DIS-01 §7.1.',
  );
  process.exit(1);
}

console.log("lint:tokens — sin literales hex fuera de src/estilos/tema.css.");
