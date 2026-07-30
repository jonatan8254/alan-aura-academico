#!/usr/bin/env python3
"""Genera los SVG acompanantes de los diagramas de robustez DR-01..DR-10.

Los `.puml` son la FUENTE DE VERDAD (los valida `validate_robustness_puml.py`).
Este script produce la VISTA DERIVADA en SVG, con el mismo sistema visual que
`MD-01_modelo_dominio.svg` y `DCU-01_casos_uso.svg`: lienzo de ancho fijo,
`role="img"` + `<title>`/`<desc>`, tipografia unica heredada de la raiz, sin
`<defs>` ni `<style>` ni `<marker>`, agrupacion por color en triadas
(relleno pastel / borde saturado / texto oscuro) y leyenda de notacion.

Por que un generador y no 10 SVG a mano: son 179 elementos y ~260 arcos en 10
diagramas; un generador garantiza que los 10 comparten exactamente la misma
retica y hace el resultado reproducible, igual que `grafo/scripts/`.

Layout: cuatro carriles verticales (Actor - Borde - Controlador - Entidad), que
es la disposicion natural de BCE, con los pasos fluyendo hacia abajo y los arcos
ruteados ortogonalmente por los canales entre carriles.

Uso:
    python generar_svg_robustez.py              # regenera los 10 .svg
    python generar_svg_robustez.py --verificar  # solo comprueba, no escribe
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# --------------------------------------------------------------------------
# Sistema visual — valores extraidos literalmente de MD-01/DCU-01
# --------------------------------------------------------------------------

FUENTE = "Segoe UI, Helvetica, Arial, sans-serif"
FONDO = "#FFFFFF"
LINEA = "#5F5E5A"          # color de arco (MD-01)
LINEA_TENUE = "#8a8a8a"    # asociaciones secundarias (DCU-01)
BORDE_TENUE = "#B4B2A9"    # contenedores punteados (DCU-01)

# Triadas (relleno, borde, texto). No se inventa ningun color: son las cinco
# que ya usan MD-01 y DCU-01.
TRIADA = {
    "actor":    ("#F1EFE8", "#5F5E5A", "#2C2C2A"),  # Actores / operacion
    "boundary": ("#E6F1FB", "#185FA5", "#0C447C"),  # Acceso y cuenta (azul)
    "control":  ("#E1F5EE", "#0F6E56", "#04342C"),  # Conversacion (verde)
    "entity":   ("#EEEDFE", "#534AB7", "#26215C"),  # Identidad (violeta)
    "alterno":  ("#FAECE7", "#993C1D", "#4A1B0C"),  # Seguridad (terracota)
}

# --------------------------------------------------------------------------
# Geometria
# --------------------------------------------------------------------------

W = 1000
MARGEN_SUP = 34
ALTO_CABECERA = 46      # titulo + cabeceras de carril
GAP_FILA = 14
RADIO = 4

CARRIL = {
    "actor":    {"x": 24,  "w": 96,  "titulo": "Actor"},
    "boundary": {"x": 150, "w": 195, "titulo": "Objeto tipo Borde"},
    "control":  {"x": 425, "w": 275, "titulo": "Controlador"},
    "entity":   {"x": 800, "w": 165, "titulo": "Entidad"},
}
ORDEN_CARRIL = ["actor", "boundary", "control", "entity"]

# Canales de ruteo (bandas verticales libres entre carriles).
# C<->C va por la DERECHA del carril de controladores: si compartiera banda con
# B<->C, el borde izquierdo del carril se congestiona y los chips se pisan.
CANAL_AB = (124, 146)     # actor  <-> borde
CANAL_BC = (352, 412)     # borde  <-> controlador (izquierda del carril)
CANAL_CC = (708, 736)     # controlador <-> controlador (derecha del carril)
CANAL_CE = (744, 792)     # controlador <-> entidad

PX_POR_CHAR = 0.55        # ancho medio de caracter relativo al font-size


# --------------------------------------------------------------------------
# Parseo del .puml — mismas expresiones que validate_robustness_puml.py
# --------------------------------------------------------------------------

DECL_RE = re.compile(
    r'^\s*(?P<type>actor|boundary|control|entity)\s+'
    r'"(?P<label>[^"]+)"\s+as\s+(?P<alias>\w+)'
    r'(?:\s+(?P<color>#[#\w]+))?\s*$',
    re.IGNORECASE,
)
REL_RE = re.compile(
    r'^\s*(?P<left>\w+)\s*'
    r'(?P<conn><?[-.]{1,3}(?:\[[^\]]*\])?[-.]{0,3}>?)\s*'
    r'(?P<right>\w+)\s*'
    r'(?::\s*(?P<label>.*?))?\s*$'
)
CURSO_RE = re.compile(r'^\s*(F[AE]-\d+)\s+([^:.]{3,60})', re.IGNORECASE)
TITULO_RE = re.compile(r"^'\s*(DR-\d+)\s+[—-]\s+(.*)$")


class Elem:
    __slots__ = ("alias", "label", "tipo", "color", "orden", "x", "y", "w", "h", "lineas")

    def __init__(self, alias, label, tipo, color):
        self.alias, self.label, self.tipo = alias, label, tipo
        self.color = (color or "").lower()
        self.orden = 10_000
        self.x = self.y = self.w = self.h = 0
        self.lineas: list[str] = []

    @property
    def alterno(self) -> bool:
        return "lightcoral" in self.color

    @property
    def descubierta(self) -> bool:
        return "palegreen" in self.color

    @property
    def cy(self) -> float:
        return self.y + self.h / 2


def parsear(texto: str):
    elems: dict[str, Elem] = {}
    rels: list[tuple[str, str, str]] = []
    cursos: list[tuple[str, str]] = []
    titulo = subtitulo = ""
    en_bloque = False

    for raw in texto.splitlines():
        line = raw.strip()

        if en_bloque:
            if re.match(r"^end\s*(note|legend)\b", line, re.I):
                en_bloque = False
            else:
                m = CURSO_RE.match(line)
                if m:
                    cursos.append((m.group(1).upper(), m.group(2).strip()))
            continue

        if line.startswith("'"):
            m = TITULO_RE.match(line)
            if m and not titulo:
                titulo, subtitulo = m.group(1), m.group(2)
            continue
        if not line or line.startswith("@"):
            continue
        if re.match(r"^(note|legend)\b", line, re.I):
            if not (re.search(r":\s*\S", line) or re.search(r'^\s*note\s+"[^"]*"\s+as\s+\w+', line, re.I)):
                en_bloque = True
            continue
        if line.lower().startswith(("skinparam", "title", "hide", "left to", "top to", "!")):
            continue

        m = DECL_RE.match(line)
        if m:
            elems[m.group("alias")] = Elem(
                m.group("alias"), m.group("label"),
                m.group("type").lower(), m.group("color"))
            continue

        m = REL_RE.match(line)
        if m and m.group("conn") and m.group("left") in elems or (m and m.group("conn")):
            l, r = m.group("left"), m.group("right")
            if l in elems and r in elems:
                rels.append((l, r, m.group("label") or ""))

    # orden de aparicion: define la fila dentro de cada carril
    for i, (l, r, _) in enumerate(rels):
        for a in (l, r):
            elems[a].orden = min(elems[a].orden, i)

    # dedupe de cursos conservando el orden
    vistos, limpio = set(), []
    for cid, nombre in cursos:
        if cid not in vistos:
            vistos.add(cid)
            limpio.append((cid, nombre))

    return elems, rels, limpio, titulo, subtitulo


# --------------------------------------------------------------------------
# Utilidades de texto
# --------------------------------------------------------------------------

def envolver(texto: str, ancho_px: float, font: int) -> list[str]:
    """Parte el texto en lineas que quepan en ancho_px."""
    max_chars = max(8, int(ancho_px / (font * PX_POR_CHAR)))
    palabras, lineas, act = texto.split(), [], ""
    for p in palabras:
        cand = f"{act} {p}".strip()
        if len(cand) <= max_chars:
            act = cand
        else:
            if act:
                lineas.append(act)
            act = p
    if act:
        lineas.append(act)
    return lineas or [texto]


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))


CHIP_RE = re.compile(
    r'^((?:(?:PRE|FA|FE)-\d+|\d+(?:-\d+)?)(?:\s+(?:(?:PRE|FA|FE)-\d+|\d+(?:-\d+)?))*)')


def chip(label: str) -> str:
    """Extrae el identificador corto de una etiqueta de arco.

    "3 FA-01 elige registrarse"     -> "3 FA-01"
    "FE-06 FE-07 informa el estado" -> "FE-06/07"   (se compacta)
    "1 solicita el directorio"      -> "1"
    """
    m = CHIP_RE.match(label.strip())
    if not m:
        return ""
    partes = m.group(1).split()
    # compacta ids consecutivos de la misma familia: FE-06 FE-07 -> FE-06/07
    out: list[str] = []
    for p in partes:
        pm = re.fullmatch(r"(FA|FE|PRE)-(\d+)", p, re.I)
        if pm and out:
            om = re.match(r"(FA|FE|PRE)-", out[-1], re.I)
            if om and om.group(1).upper() == pm.group(1).upper():
                out[-1] += "/" + pm.group(2)
                continue
        out.append(p)
    return " ".join(out)


# --------------------------------------------------------------------------
# Dibujo
# --------------------------------------------------------------------------

def icono(tipo: str, cx: float, cy: float, trazo: str) -> str:
    """Iconos de Jacobson (notacion ICONIX estandar), 14 px."""
    g = f'<g fill="none" stroke="{trazo}" stroke-width="1.3">'
    if tipo == "boundary":      # barra vertical + circulo a su derecha
        g += (f'<line x1="{cx-7}" y1="{cy-6}" x2="{cx-7}" y2="{cy+6}"/>'
              f'<line x1="{cx-7}" y1="{cy}" x2="{cx-3}" y2="{cy}"/>'
              f'<circle cx="{cx+2}" cy="{cy}" r="5"/>')
    elif tipo == "control":     # circulo con flecha en el arco superior
        g += (f'<circle cx="{cx}" cy="{cy}" r="5.5"/>'
              f'<polyline points="{cx-1.5},{cy-7.5} {cx+2.5},{cy-5.2} {cx-1.8},{cy-2.8}"/>')
    elif tipo == "entity":      # circulo con linea horizontal debajo
        g += (f'<circle cx="{cx}" cy="{cy-1.5}" r="5.5"/>'
              f'<line x1="{cx-6.5}" y1="{cy+6}" x2="{cx+6.5}" y2="{cy+6}"/>')
    return g + "</g>"


def monigote(cx: float, cy: float) -> str:
    """Actor: mismas proporciones que DCU-01 (cabeza r=9, alto total 55)."""
    return (f'<g fill="none" stroke="{TRIADA["actor"][2]}" stroke-width="1.4">'
            f'<circle cx="{cx}" cy="{cy}" r="9"/>'
            f'<line x1="{cx}" y1="{cy+9}" x2="{cx}" y2="{cy+31}"/>'
            f'<line x1="{cx-12}" y1="{cy+18}" x2="{cx+12}" y2="{cy+18}"/>'
            f'<line x1="{cx}" y1="{cy+31}" x2="{cx-10}" y2="{cy+46}"/>'
            f'<line x1="{cx}" y1="{cy+31}" x2="{cx+10}" y2="{cy+46}"/>'
            f'</g>')


def disponer(elems: dict[str, Elem]) -> int:
    """Asigna x/y/w/h a cada elemento. Devuelve el alto del area de diagrama."""
    y_base = MARGEN_SUP + ALTO_CABECERA
    alto_max = y_base

    for tipo in ORDEN_CARRIL:
        carril = CARRIL[tipo]
        grupo = sorted((e for e in elems.values() if e.tipo == tipo),
                       key=lambda e: (e.orden, e.label))
        y = y_base
        for e in grupo:
            e.x, e.w = carril["x"], carril["w"]
            if tipo == "actor":
                e.lineas = envolver(e.label, e.w, 11)
                e.h = 55 + 6 + 13 * len(e.lineas)
            else:
                # deja hueco al icono a la izquierda del texto
                e.lineas = envolver(e.label, e.w - 34, 11)
                e.h = 22 + 15 * len(e.lineas)
            e.y = y
            y += e.h + GAP_FILA
        alto_max = max(alto_max, y)

    return int(alto_max)


def calcular_anclajes(elems: dict[str, Elem], rels) -> dict[tuple[str, int], float]:
    """Reparte en abanico los puntos de salida a lo largo del borde de cada caja.

    Sin esto, todos los arcos de una caja muy conectada (la Interfaz de chat de
    DR-06 tiene once) salen del mismo punto: los tramos horizontales se solapan
    y los chips se apilan en una columna.
    """
    incidentes: dict[str, list[int]] = {a: [] for a in elems}
    for i, (l, r, _) in enumerate(rels):
        incidentes[l].append(i)
        incidentes[r].append(i)

    anc: dict[tuple[str, int], float] = {}
    for alias, idxs in incidentes.items():
        e = elems[alias]

        def cy_del_otro(i: int) -> float:
            l, r, _ = rels[i]
            return elems[r if l == alias else l].cy

        orden = sorted(dict.fromkeys(idxs), key=cy_del_otro)
        k = len(orden)
        for j, i in enumerate(orden):
            if e.tipo == "actor":
                anc[(alias, i)] = e.y + 18 + (j - (k - 1) / 2) * 6
            else:
                anc[(alias, i)] = e.y + e.h * (j + 1) / (k + 1)
    return anc


def puntos_arco(a: Elem, b: Elem, idx: int, ya: float, yb: float):
    """Ruteo ortogonal por el canal que corresponde al par de carriles."""
    tipos = {a.tipo, b.tipo}
    izq, der = (a, b) if ORDEN_CARRIL.index(a.tipo) <= ORDEN_CARRIL.index(b.tipo) else (b, a)
    y_izq, y_der = (ya, yb) if izq is a else (yb, ya)

    if tipos == {"actor", "boundary"}:
        c0, c1 = CANAL_AB
        cx = c0 + (idx % 3) * ((c1 - c0) / 3)
        return [(izq.x + izq.w / 2 + 12, y_izq), (cx, y_izq), (cx, y_der), (der.x, y_der)]

    if tipos == {"boundary", "control"}:
        c0, c1 = CANAL_BC
        cx = c0 + (idx % 5) * ((c1 - c0) / 5)
        return [(izq.x + izq.w, y_izq), (cx, y_izq), (cx, y_der), (der.x, y_der)]

    if tipos == {"control"}:                  # controlador <-> controlador
        c0, c1 = CANAL_CC
        cx = c0 + (idx % 4) * ((c1 - c0) / 4)
        xr = a.x + a.w                        # salen y entran por la derecha
        return [(xr, ya), (cx, ya), (cx, yb), (xr, yb)]

    if tipos == {"control", "entity"}:
        c0, c1 = CANAL_CE
        cx = c0 + (idx % 6) * ((c1 - c0) / 6)
        return [(izq.x + izq.w, y_izq), (cx, y_izq), (cx, y_der), (der.x, y_der)]

    # cualquier otro par (no deberia existir: el validador lo prohibe)
    return [(izq.x + izq.w, y_izq), (der.x, y_der)]


def construir_svg(dr: str, subtitulo: str, elems, rels, cursos) -> str:
    alto_diagrama = disponer(elems)

    # --- tira de cursos alternativos -------------------------------------
    y_cursos = alto_diagrama + 18
    filas_cursos = (len(cursos) + 1) // 2
    alto_cursos = (26 + filas_cursos * 16) if cursos else 0

    y_leyenda = y_cursos + alto_cursos + (12 if cursos else 0)
    alto_total = int(y_leyenda + 62)

    o: list[str] = []
    n_ctrl = sum(1 for e in elems.values() if e.tipo == "control")
    n_bor = sum(1 for e in elems.values() if e.tipo == "boundary")
    n_ent = sum(1 for e in elems.values() if e.tipo == "entity")
    n_act = sum(1 for e in elems.values() if e.tipo == "actor")
    desc = (f"Diagrama de robustez ICONIX de {subtitulo}. "
            f"{n_act} actor(es), {n_bor} objeto(s) tipo Borde, {n_ctrl} Controlador(es) y "
            f"{n_ent} Entidad(es), en cuatro carriles verticales. "
            f"Los objetos en terracota participan solo en cursos alternativos o de excepcion; "
            f"la entidad con borde punteado es un descubrimiento de robustez ausente del modelo "
            f"de dominio MD-01. Vista derivada: la fuente de verdad es el archivo .puml.")

    o.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{alto_total}" '
             f'viewBox="0 0 {W} {alto_total}" role="img" font-family="{FUENTE}">')
    o.append(f'<title>{esc(dr)} — {esc(subtitulo)}</title>')
    o.append(f'<desc>{esc(desc)}</desc>')
    o.append("")
    o.append(f'<rect x="0" y="0" width="{W}" height="{alto_total}" fill="{FONDO}"/>')
    o.append("")

    # --- cabecera ---------------------------------------------------------
    o.append(f'<text x="24" y="{MARGEN_SUP - 8}" font-size="14" font-weight="500" '
             f'fill="#2C2C2A">{esc(dr)} · {esc(subtitulo)}</text>')
    y_cab = MARGEN_SUP + 22
    o.append(f'<g font-size="11" font-weight="500" fill="{LINEA}" text-anchor="middle">')
    for tipo in ORDEN_CARRIL:
        if not any(e.tipo == tipo for e in elems.values()):
            continue                       # no se rotula un carril vacio
        c = CARRIL[tipo]
        o.append(f'<text x="{c["x"] + c["w"]/2:.0f}" y="{y_cab}">{esc(c["titulo"])}</text>')
    o.append("</g>")
    o.append(f'<line x1="24" y1="{y_cab + 8}" x2="{W-35}" y2="{y_cab + 8}" '
             f'stroke="{BORDE_TENUE}" stroke-width="1"/>')
    o.append("")

    # --- arcos (primero: van por debajo de las cajas, z-order de DCU-01) --
    o.append(f'<g fill="none" stroke="{LINEA_TENUE}" stroke-width="1">')
    etiquetas = []
    contador: dict[frozenset, int] = {}
    anclajes = calcular_anclajes(elems, rels)
    for i_rel, (l, r, label) in enumerate(rels):
        a, b = elems[l], elems[r]
        k = frozenset({a.tipo, b.tipo})
        idx = contador.get(k, 0)
        contador[k] = idx + 1
        pts = puntos_arco(a, b, idx,
                          anclajes[(l, i_rel)], anclajes[(r, i_rel)])
        cadena = " ".join(f"{x:.0f},{y:.0f}" for x, y in pts)
        alt = a.alterno and b.alterno
        stroke = f' stroke="{TRIADA["alterno"][1]}"' if alt else ""
        dash = ' stroke-dasharray="5 3"' if alt else ""
        o.append(f'<polyline points="{cadena}"{stroke}{dash}/>')
        c = chip(label)
        if c and len(pts) >= 4:
            # El chip se coloca sobre el PRIMER tramo horizontal, justo al salir
            # de la caja de origen: ahi hay sitio en el canal y la pertenencia al
            # arco es inequivoca. Ponerlo sobre el tramo vertical lo metia debajo
            # de la caja vecina.
            ancho = max(16, len(c) * 5.2 + 8)
            signo = 1 if pts[1][0] >= pts[0][0] else -1
            mx = pts[0][0] + signo * (ancho / 2 + 6)
            etiquetas.append((mx, pts[0][1], ancho, c, alt))
    o.append("</g>")
    o.append("")

    # --- cajas ------------------------------------------------------------
    for tipo in ORDEN_CARRIL:
        grupo = [e for e in elems.values() if e.tipo == tipo]
        if not grupo:
            continue
        for e in sorted(grupo, key=lambda x: x.y):
            if tipo == "actor":
                cx = e.x + e.w / 2
                o.append(monigote(cx, e.y + 12))
                o.append(f'<g font-size="11" text-anchor="middle" fill="{TRIADA["actor"][2]}">')
                for i, ln in enumerate(e.lineas):
                    o.append(f'<text x="{cx:.0f}" y="{e.y + 74 + i*13:.0f}">{esc(ln)}</text>')
                o.append("</g>")
                continue

            fill, stroke, text = TRIADA["alterno"] if e.alterno else TRIADA[tipo]
            dash = ' stroke-dasharray="4 3"' if e.descubierta else ""
            o.append(f'<rect x="{e.x}" y="{e.y}" width="{e.w}" height="{e.h}" rx="{RADIO}" '
                     f'fill="{fill}" stroke="{stroke}"{dash}/>')
            o.append(icono(tipo, e.x + 17, e.cy, stroke))
            base = e.y + (e.h - 15 * len(e.lineas)) / 2 + 11
            o.append(f'<g font-size="11" fill="{text}">')
            for i, ln in enumerate(e.lineas):
                o.append(f'<text x="{e.x + 32}" y="{base + i*15:.0f}">{esc(ln)}</text>')
            o.append("</g>")
    o.append("")

    # --- chips (los ultimos: nada debe taparlos) --------------------------
    if etiquetas:
        o.append('<g font-size="9" text-anchor="middle">')
        puestos: list[tuple[float, float, float, float]] = []

        def libre(bx, by, bw, bh):
            return all(bx + bw <= px or px + pw <= bx or by + bh <= py or py + ph <= by
                       for px, py, pw, ph in puestos)

        y_min = MARGEN_SUP + ALTO_CABECERA + 4
        y_max = alto_diagrama - 4
        for mx, my0, ancho, c, alt in etiquetas:
            my = min(max(my0, y_min), y_max)
            for paso in range(0, 40):           # baja/sube en saltos hasta hallar hueco
                for signo in (1, -1):
                    cand = my0 + signo * paso * 15
                    if not (y_min <= cand <= y_max):   # nunca fuera del diagrama
                        continue
                    if libre(mx - ancho / 2, cand - 7, ancho, 14):
                        my = cand
                        break
                else:
                    continue
                break
            puestos.append((mx - ancho / 2, my - 7, ancho, 14))
            col = TRIADA["alterno"][2] if alt else LINEA
            o.append(f'<rect x="{mx - ancho/2:.0f}" y="{my - 7:.0f}" width="{ancho:.0f}" '
                     f'height="13" rx="3" fill="{FONDO}" stroke="{BORDE_TENUE}"/>'
                     f'<text x="{mx:.0f}" y="{my + 3:.0f}" fill="{col}">{esc(c)}</text>')
        o.append("</g>")
        o.append("")

    # --- tira de cursos alternativos / excepcion --------------------------
    if cursos:
        o.append(f'<line x1="24" y1="{y_cursos - 6}" x2="{W-35}" y2="{y_cursos - 6}" '
                 f'stroke="{BORDE_TENUE}" stroke-width="1"/>')
        o.append(f'<text x="24" y="{y_cursos + 10}" font-size="11" font-weight="500" '
                 f'fill="{LINEA}">Cursos alternativos y de excepcion</text>')
        o.append('<g font-size="10">')
        for i, (cid, nombre) in enumerate(cursos):
            col, fila = i % 2, i // 2
            cx0 = 24 + col * 480
            cy0 = y_cursos + 30 + fila * 16
            o.append(f'<rect x="{cx0}" y="{cy0 - 8}" width="42" height="12" rx="3" '
                     f'fill="{TRIADA["alterno"][0]}" stroke="{TRIADA["alterno"][1]}"/>'
                     f'<text x="{cx0 + 21}" y="{cy0 + 1}" text-anchor="middle" '
                     f'fill="{TRIADA["alterno"][2]}">{esc(cid)}</text>'
                     f'<text x="{cx0 + 50}" y="{cy0 + 1}" fill="{LINEA}">{esc(nombre)}</text>')
        o.append("</g>")
        o.append("")

    # --- leyenda ----------------------------------------------------------
    o.append(f'<line x1="24" y1="{y_leyenda - 6}" x2="{W-35}" y2="{y_leyenda - 6}" '
             f'stroke="{BORDE_TENUE}" stroke-width="1"/>')
    yl = y_leyenda + 14
    o.append('<g font-size="11">')
    x = 24
    for tipo, nombre in (("boundary", "Objeto tipo Borde"), ("control", "Controlador"),
                         ("entity", "Entidad")):
        fill, stroke, _ = TRIADA[tipo]
        o.append(f'<rect x="{x}" y="{yl - 9}" width="13" height="13" rx="2" '
                 f'fill="{fill}" stroke="{stroke}"/>')
        o.append(icono(tipo, x + 6.5, yl - 2.5, stroke))
        o.append(f'<text x="{x + 20}" y="{yl + 1}" fill="{LINEA}">{esc(nombre)}</text>')
        x += 26 + len(nombre) * 6.2
    o.append("</g>")

    yl2 = y_leyenda + 36
    o.append('<g font-size="11">')
    f_alt, s_alt, _ = TRIADA["alterno"]
    o.append(f'<rect x="24" y="{yl2 - 9}" width="13" height="13" rx="2" '
             f'fill="{f_alt}" stroke="{s_alt}"/>'
             f'<text x="44" y="{yl2 + 1}" fill="{LINEA}">Participa solo en un curso alternativo o de excepcion</text>')
    f_e, s_e, _ = TRIADA["entity"]
    o.append(f'<rect x="384" y="{yl2 - 9}" width="13" height="13" rx="2" fill="{f_e}" '
             f'stroke="{s_e}" stroke-dasharray="4 3"/>'
             f'<text x="404" y="{yl2 + 1}" fill="{LINEA}">Entidad descubierta, ausente de MD-01</text>')
    o.append(f'<line x1="694" y1="{yl2 - 2}" x2="{724}" y2="{yl2 - 2}" '
             f'stroke="{LINEA_TENUE}" stroke-width="1"/>'
             f'<text x="732" y="{yl2 + 1}" fill="{LINEA}">Asociacion de comunicacion (sin direccion)</text>')
    o.append("</g>")

    o.append("</svg>")
    return "\n".join(o) + "\n"


# --------------------------------------------------------------------------

def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--verificar", action="store_true",
                    help="no escribe: solo comprueba la correspondencia con los .puml")
    args = ap.parse_args(argv[1:])

    raiz = Path(__file__).resolve().parent.parent
    fuentes = sorted(raiz.glob("DR-*.puml"))
    if not fuentes:
        print(f"ERROR: no se encontraron .puml en {raiz}")
        return 2

    tot = {"actor": 0, "boundary": 0, "control": 0, "entity": 0}
    print(f"{'DR':7}{'act':>4}{'bor':>4}{'ctl':>4}{'ent':>4}{'arcos':>7}{'lienzo':>12}")
    for f in fuentes:
        elems, rels, cursos, dr, sub = parsear(f.read_text(encoding="utf-8"))
        svg = construir_svg(dr or f.name[:5], sub, elems, rels, cursos)
        alto = re.search(r'height="(\d+)"', svg).group(1)
        c = {t: sum(1 for e in elems.values() if e.tipo == t) for t in tot}
        for t in tot:
            tot[t] += c[t]
        if not args.verificar:
            f.with_suffix(".svg").write_text(svg, encoding="utf-8")
        print(f"{(dr or f.name[:5]):7}{c['actor']:>4}{c['boundary']:>4}{c['control']:>4}"
              f"{c['entity']:>4}{len(rels):>7}{f'{W}x{alto}':>12}")

    total = sum(tot.values())
    print(f"\nTOTAL: {total} elementos "
          f"({tot['actor']}/{tot['boundary']}/{tot['control']}/{tot['entity']})")
    esperado = (12, 31, 102, 34)
    real = (tot["actor"], tot["boundary"], tot["control"], tot["entity"])
    if real == esperado and total == 179:
        print("Correspondencia con los .puml: OK (179 elementos, 12/31/102/34)")
        return 0
    print(f"AVISO: se esperaba 179 elementos {esperado} y se obtuvo {total} {real}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
