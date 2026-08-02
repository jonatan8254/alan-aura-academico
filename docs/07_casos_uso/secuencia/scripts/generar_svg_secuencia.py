#!/usr/bin/env python3
"""Genera los SVG acompanantes de los diagramas de secuencia DS-01..DS-14.

Los `.puml` son la FUENTE DE VERDAD (los valida `validate_sequence_puml.py`).
Este script produce la VISTA DERIVADA en SVG, con el mismo sistema visual que
`generar_svg_robustez.py`, `MD-01_modelo_dominio.svg` y `DCU-01_casos_uso.svg`:
`role="img"` + `<title>`/`<desc>`, tipografia unica heredada de la raiz, sin
`<defs>` ni `<style>` ni `<marker>`, y las mismas triadas de color.

POR QUE UN GENERADOR NUEVO Y NO EL DE ROBUSTEZ
----------------------------------------------
El de robustez enruta N arcos sin orden temporal por canales de capacidad FIJA
con aritmetica modular (`idx % N`). En DR-06, 23 arcos control-control se
reparten en 4 posiciones dentro de una franja de 28 px: a partir del quinto, el
modulo RECICLA una x ya usada y dos polilineas quedan superpuestas. Ademas su
`libre()` compara cada etiqueta solo contra OTRAS ETIQUETAS, nunca contra las
lineas, asi que una etiqueta puede declararse «libre» encima del haz de arcos.

Un diagrama de secuencia no hereda esa causa raiz: tiene ORDEN TEMPORAL TOTAL
(1 mensaje = 1 fila, y estrictamente creciente), asi que no hay competencia por
un canal. El riesgo no es reinventar el defecto sino REINTRODUCIRLO en los dos
unicos puntos donde si se comparte espacio: auto-llamadas y mensajes de largo
alcance. El diseno los cubre por construccion:

  R1  el arco se traza TEXT_TO_ARROW_GAP px POR DEBAJO del bloque de texto de su
      propio mensaje. Es una garantia GEOMETRICA, no un buscador de huecos.
  R2  el ancho de cada hueco entre lineas de vida sale del mensaje mas exigente
      QUE LO CRUZA (no del participante), acotado a [MIN_COL_GAP, MAX_COL_GAP].
  R5  la demanda de una auto-llamada se SUMA al hueco de su propia columna,
      nunca a un carril aparte.
  R9  pase de verificacion geometrica post-layout: todas las cajas de texto
      contra TODOS los segmentos. Si algo colisiona, ABORTA.

Uso:
    python generar_svg_secuencia.py              # regenera los .svg
    python generar_svg_secuencia.py --verificar  # solo comprueba, no escribe
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DIR_PUML = RAIZ / "puml"      # fuente de verdad
DIR_SVG = RAIZ / "svg"        # vista derivada

# --------------------------------------------------------------------------
# Sistema visual - valores heredados LITERALMENTE de generar_svg_robustez.py
# --------------------------------------------------------------------------

FUENTE = "Segoe UI, Helvetica, Arial, sans-serif"
FONDO = "#FFFFFF"
LINEA = "#5F5E5A"
LINEA_TENUE = "#8a8a8a"
BORDE_TENUE = "#B4B2A9"

TRIADA = {
    "actor":    ("#F1EFE8", "#5F5E5A", "#2C2C2A"),
    "boundary": ("#E6F1FB", "#185FA5", "#0C447C"),
    "control":  ("#E1F5EE", "#0F6E56", "#04342C"),
    "entity":   ("#EEEDFE", "#534AB7", "#26215C"),
    "alterno":  ("#FAECE7", "#993C1D", "#4A1B0C"),
}

PX_POR_CHAR = 0.55

# --------------------------------------------------------------------------
# Geometria - constantes nuevas de esta pieza
# --------------------------------------------------------------------------

MARGEN_IZQ = 24
MARGEN_DER = 24
MARGEN_SUP = 34
MARGEN_INF = 28

MIN_COL_GAP = 130
MAX_COL_GAP = 300          # techo blando: se supera solo si el texto no cabe
COL_MARGIN = 18

FONT_TITULO = 15
FONT_CAB = 11
FONT_MSG = 10
FONT_NOTA = 9.5

LINEA_ALTO_MSG = 13
TEXT_TOP_PAD = 5
TEXT_TO_ARROW_GAP = 10     # R1: la respuesta a «no tapes la linea»
ARROW_TO_NEXT_GAP = 12
MAX_LINEAS_MSG = 3

SELF_LOOP_W = 42
SELF_LOOP_H = 26

FRAME_TAB_W = 62
FRAME_TAB_H = 20
FRAME_TOP_PAD = 8
FRAME_BOTTOM_PAD = 10
FRAME_SIDE_PAD = 12
NEST_INSET = 10
ELSE_BAND_H = 18

DIVIDER_H = 32
NOTA_PAD = 8
GAP_SECCION = 24
ALTO_ACTOR = 55
ALTO_CAJA_MIN = 30

# --------------------------------------------------------------------------
# Parseo
# --------------------------------------------------------------------------

DECL_RE = re.compile(
    r'^\s*(actor|boundary|control|entity|participant|database|queue)\s+'
    r'"([^"]+)"\s+as\s+(\w+)\s*$', re.IGNORECASE)
MSG_RE = re.compile(
    r'^\s*(\w+)\s*(-->|->)\s*(\w+)\s*:\s*(.+?)\s*$')
FRAG_RE = re.compile(r'^\s*(alt|opt|loop|par|critical|break|group)\b\s*(.*)$', re.IGNORECASE)
ELSE_RE = re.compile(r'^\s*else\b\s*(.*)$', re.IGNORECASE)
END_RE = re.compile(r'^\s*end\s*$', re.IGNORECASE)
DIV_RE = re.compile(r'^\s*==\s*(.+?)\s*==\s*$')
NOTA_INI_RE = re.compile(
    r'^\s*note\s+(over|right of|left of)\s+([\w ,]+?)\s*$', re.IGNORECASE)
NOTA_FIN_RE = re.compile(r'^\s*end\s*note\s*$', re.IGNORECASE)
TITULO_RE = re.compile(r"^'\s*(DS-\d+)\s*-\s*(.*)$")


@dataclass
class Part:
    alias: str
    label: str
    tipo: str
    col: int
    x: float = 0.0
    w: float = 0.0
    h: float = 0.0
    y_base: float = 0.0    # borde inferior de SU cabecera: donde nace SU linea de vida
    lineas: list[str] = field(default_factory=list)


@dataclass
class Msg:
    origen: str
    destino: str
    kind: str          # sync | return | self
    texto: str
    nivel: int
    y: float = 0.0
    y_texto: float = 0.0
    lineas: list[str] = field(default_factory=list)


@dataclass
class Frag:
    kind: str
    guard: str
    nivel: int
    y0: float = 0.0
    y1: float = 0.0
    x0: float = 0.0
    x1: float = 0.0
    toca: set[str] = field(default_factory=set)
    elses: list[tuple[str, float]] = field(default_factory=list)


@dataclass
class Div:
    texto: str
    y: float = 0.0


@dataclass
class Nota:
    modo: str
    anclas: list[str]
    lineas_txt: list[str]
    nivel: int
    y0: float = 0.0
    y1: float = 0.0
    x0: float = 0.0
    x1: float = 0.0


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))


def limpiar_markup(s: str) -> str:
    """Quita el markup de PlantUML que no se renderiza a nivel de caracter."""
    return re.sub(r"</?[biu]>", "", s)


def envolver(texto: str, ancho_px: float, font: float) -> list[str]:
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


def ancho_texto(s: str, font: float) -> float:
    return len(s) * font * PX_POR_CHAR


def parsear(texto: str):
    parts: dict[str, Part] = {}
    items: list = []          # secuencia plana de Msg | Frag | Div | Nota | ('end',) | ('else',guard)
    titulo = ("DS-??", "")
    pila: list[Frag] = []
    en_nota: Nota | None = None

    for raw in texto.splitlines():
        line = raw.rstrip()

        if en_nota is not None:
            if NOTA_FIN_RE.match(line):
                items.append(en_nota)
                en_nota = None
            else:
                en_nota.lineas_txt.append(limpiar_markup(line.strip()))
            continue

        m = TITULO_RE.match(line)
        if m:
            titulo = (m.group(1), m.group(2).strip())
            continue
        if line.strip().startswith("'") or not line.strip():
            continue
        if line.strip().startswith(("@startuml", "@enduml", "skinparam", "title")):
            continue

        m = DECL_RE.match(line)
        if m:
            tipo = m.group(1).lower()
            if tipo in ("participant", "database", "queue"):
                tipo = "entity"
            parts[m.group(3)] = Part(m.group(3), m.group(2), tipo, len(parts))
            continue

        m = NOTA_INI_RE.match(line)
        if m:
            anclas = [a.strip() for a in m.group(2).split(",") if a.strip()]
            en_nota = Nota(m.group(1).lower(), anclas, [], len(pila))
            continue

        m = DIV_RE.match(line)
        if m:
            items.append(Div(m.group(1)))
            continue

        m = FRAG_RE.match(line)
        if m:
            f = Frag(m.group(1).lower(), m.group(2).strip(), len(pila))
            pila.append(f)
            items.append(f)
            continue

        m = ELSE_RE.match(line)
        if m:
            items.append(("else", m.group(1).strip()))
            continue

        if END_RE.match(line):
            if pila:
                pila.pop()
            items.append(("end",))
            continue

        m = MSG_RE.match(line)
        if m:
            o, conn, d, t = m.group(1), m.group(2), m.group(3), m.group(4)
            kind = "self" if o == d else ("return" if conn == "-->" else "sync")
            items.append(Msg(o, d, kind, limpiar_markup(t), len(pila)))
            continue

    return titulo, parts, items


# --------------------------------------------------------------------------
# Layout
# --------------------------------------------------------------------------

def calcular_columnas(parts: dict[str, Part], items: list) -> float:
    """R2 + R5: el ancho de cada hueco sale del mensaje mas exigente QUE LO CRUZA,
    mas la demanda de las auto-llamadas de la columna izquierda del hueco."""
    orden = list(parts.values())
    n = len(orden)
    idx = {p.alias: i for i, p in enumerate(orden)}

    # cabeceras
    for p in orden:
        p.lineas = envolver(p.label, 150, FONT_CAB)
        p.w = max(96, max(ancho_texto(l, FONT_CAB) for l in p.lineas) + 22)
        if p.tipo == "actor":
            p.h = ALTO_ACTOR + 6 + LINEA_ALTO_MSG * len(p.lineas)
            # el monigote y luego su etiqueta debajo; la linea de vida nace bajo el texto
            p.y_base = MARGEN_SUP + ALTO_ACTOR + 8 + LINEA_ALTO_MSG * (len(p.lineas) - 1) + 6
        else:
            caja = max(ALTO_CAJA_MIN, 20 + LINEA_ALTO_MSG * len(p.lineas))
            p.h = caja + 16
            # R-lifeline: nace en el borde inferior de SU PROPIA caja, no en el del mas alto
            p.y_base = MARGEN_SUP + caja

    demanda = [0.0] * max(1, n - 1)      # demanda por hueco i..i+1
    for it in items:
        if not isinstance(it, Msg):
            continue
        a, b = idx.get(it.origen), idx.get(it.destino)
        if a is None or b is None:
            continue
        w = ancho_texto(it.texto, FONT_MSG)
        if it.kind == "self":
            # R5: la auto-llamada compite en SU PROPIO hueco, no en un carril aparte
            h = min(a, n - 2) if n > 1 else 0
            demanda[h] = max(demanda[h], SELF_LOOP_W + 10 + min(w, MAX_COL_GAP))
        else:
            lo, hi = min(a, b), max(a, b)
            tramos = max(1, hi - lo)
            # el texto se reparte entre los tramos que cruza
            por_tramo = w / tramos
            for k in range(lo, hi):
                demanda[k] = max(demanda[k], por_tramo)

    x = MARGEN_IZQ
    for i, p in enumerate(orden):
        p.x = x + p.w / 2
        if i < n - 1:
            bruto = demanda[i] + COL_MARGIN
            hueco = min(MAX_COL_GAP, max(MIN_COL_GAP, bruto))
            x += p.w / 2 + hueco + orden[i + 1].w / 2
    ancho = (orden[-1].x + orden[-1].w / 2 + MARGEN_DER) if orden else 400
    return ancho


def calcular_filas(parts: dict[str, Part], items: list, ancho: float) -> float:
    """R1 + R3: altura de fila derivada del texto real; el arco siempre por debajo."""
    y = MARGEN_SUP + max((p.h for p in parts.values()), default=40) + 18
    pila: list[Frag] = []

    for it in items:
        if isinstance(it, Div):
            it.y = y + DIVIDER_H / 2
            y += DIVIDER_H
        elif isinstance(it, Frag):
            it.y0 = y + FRAME_TOP_PAD
            y = it.y0 + FRAME_TAB_H + FRAME_TOP_PAD
            pila.append(it)
        elif isinstance(it, tuple) and it and it[0] == "else":
            if pila:
                pila[-1].elses.append((it[1], y))
            y += ELSE_BAND_H
        elif isinstance(it, tuple) and it and it[0] == "end":
            if pila:
                f = pila.pop()
                f.y1 = y + FRAME_BOTTOM_PAD - ARROW_TO_NEXT_GAP
                y = f.y1 + FRAME_BOTTOM_PAD
        elif isinstance(it, Nota):
            anchoy = _ancho_nota(it, parts, ancho)
            it.lineas_txt = [l for l in it.lineas_txt if l]
            envueltas: list[str] = []
            for l in it.lineas_txt:
                envueltas.extend(envolver(l, anchoy - 2 * NOTA_PAD, FONT_NOTA))
            it.lineas_txt = envueltas
            it.y0 = y
            it.y1 = y + 2 * NOTA_PAD + LINEA_ALTO_MSG * len(envueltas)
            y = it.y1 + 14
        elif isinstance(it, Msg):
            a, b = parts.get(it.origen), parts.get(it.destino)
            if a is None or b is None:
                continue
            if it.kind == "self":
                disp = MAX_COL_GAP
            else:
                disp = max(MIN_COL_GAP, abs(b.x - a.x) - 16)
            it.lineas = envolver(it.texto, disp, FONT_MSG)[:MAX_LINEAS_MSG]
            it.y_texto = y + TEXT_TOP_PAD
            alto_txt = LINEA_ALTO_MSG * len(it.lineas)
            it.y = it.y_texto + alto_txt + TEXT_TO_ARROW_GAP      # R1
            extra = SELF_LOOP_H if it.kind == "self" else 0
            y = it.y + extra + ARROW_TO_NEXT_GAP
            for f in pila:
                f.toca.add(it.origen)
                f.toca.add(it.destino)

    return y + GAP_SECCION


def _ancho_nota(n: Nota, parts: dict[str, Part], ancho: float) -> float:
    xs = [parts[a].x for a in n.anclas if a in parts]
    if not xs:
        return min(520.0, ancho - MARGEN_IZQ - MARGEN_DER)
    if n.modo == "over" and len(xs) > 1:
        return max(260.0, (max(xs) - min(xs)) + 200)
    return min(460.0, ancho - min(xs) - MARGEN_DER)


def situar_fragmentos(parts: dict[str, Part], items: list, ancho: float) -> None:
    for it in items:
        if not isinstance(it, Frag):
            continue
        xs = [parts[a].x for a in it.toca if a in parts]
        if not xs:
            xs = [p.x for p in parts.values()]
        pad = FRAME_SIDE_PAD + NEST_INSET * it.nivel
        it.x0 = min(xs) - pad - 26
        it.x1 = max(xs) + pad + 26
        it.x0 = max(MARGEN_IZQ * 0.5, it.x0)
        it.x1 = min(ancho - MARGEN_DER * 0.5, it.x1)
    for it in items:
        if isinstance(it, Nota):
            xs = [parts[a].x for a in it.anclas if a in parts]
            base = min(xs) if xs else MARGEN_IZQ
            w = _ancho_nota(it, parts, ancho)
            if it.modo == "over" and len(xs) > 1:
                it.x0 = min(xs) - 90
            elif it.modo == "right of":
                it.x0 = base + 26
            else:
                it.x0 = max(MARGEN_IZQ, base - w - 26)
            it.x0 = max(6.0, min(it.x0, ancho - w - 6))
            it.x1 = it.x0 + w


# --------------------------------------------------------------------------
# R9 - verificacion geometrica post-layout
# --------------------------------------------------------------------------

def cajas_y_segmentos(parts, items):
    cajas, segs = [], []
    for it in items:
        if isinstance(it, Msg):
            a, b = parts.get(it.origen), parts.get(it.destino)
            if a is None or b is None:
                continue
            w = max(ancho_texto(l, FONT_MSG) for l in it.lineas) if it.lineas else 0
            if it.kind == "self":
                cx = a.x + SELF_LOOP_W + 8
                cajas.append((cx, it.y_texto - 2, cx + w, it.y_texto + LINEA_ALTO_MSG * len(it.lineas)))
                segs.append((a.x, it.y, a.x + SELF_LOOP_W, it.y))
                segs.append((a.x + SELF_LOOP_W, it.y, a.x + SELF_LOOP_W, it.y + SELF_LOOP_H))
                segs.append((a.x, it.y + SELF_LOOP_H, a.x + SELF_LOOP_W, it.y + SELF_LOOP_H))
            else:
                cx = (a.x + b.x) / 2 - w / 2
                cajas.append((cx, it.y_texto - 2, cx + w, it.y_texto + LINEA_ALTO_MSG * len(it.lineas)))
                segs.append((a.x, it.y, b.x, it.y))
    return cajas, segs


def solapan(c1, c2) -> bool:
    return not (c1[2] <= c2[0] or c2[2] <= c1[0] or c1[3] <= c2[1] or c2[3] <= c1[1])


def verificar_geometria(parts, items) -> list[str]:
    """R9: ninguna caja de texto puede intersecar otra caja ni un segmento."""
    errores: list[str] = []
    cajas, segs = cajas_y_segmentos(parts, items)
    for i in range(len(cajas)):
        for j in range(i + 1, len(cajas)):
            if solapan(cajas[i], cajas[j]):
                errores.append(
                    f"L-1: dos etiquetas se superponen en y={cajas[i][1]:.0f} y y={cajas[j][1]:.0f}")
    for c in cajas:
        for (x1, y1, x2, y2) in segs:
            if y1 != y2:          # tramo vertical de auto-llamada
                if c[0] <= x1 <= c[2] and not (y2 < c[1] or y1 > c[3]):
                    errores.append(f"L-2: un arco vertical cruza una etiqueta en y={c[1]:.0f}")
            else:
                if c[1] <= y1 <= c[3] and not (x2 < c[0] or x1 > c[2]):
                    errores.append(f"L-2: un arco horizontal cruza una etiqueta en y={y1:.0f}")
    return errores


# --------------------------------------------------------------------------
# Dibujo
# --------------------------------------------------------------------------

def icono(tipo: str, cx: float, cy: float, trazo: str) -> str:
    g = f'<g fill="none" stroke="{trazo}" stroke-width="1.3">'
    if tipo == "boundary":
        g += (f'<line x1="{cx-7}" y1="{cy-6}" x2="{cx-7}" y2="{cy+6}"/>'
              f'<line x1="{cx-7}" y1="{cy}" x2="{cx-3}" y2="{cy}"/>'
              f'<circle cx="{cx+2}" cy="{cy}" r="5"/>')
    elif tipo == "control":
        g += (f'<circle cx="{cx}" cy="{cy}" r="5.5"/>'
              f'<polyline points="{cx-1.5},{cy-7.5} {cx+2.5},{cy-5.2} {cx-1.8},{cy-2.8}"/>')
    elif tipo == "entity":
        g += (f'<circle cx="{cx}" cy="{cy-1.5}" r="5.5"/>'
              f'<line x1="{cx-6.5}" y1="{cy+6}" x2="{cx+6.5}" y2="{cy+6}"/>')
    return g + "</g>"


def monigote(cx: float, cy: float) -> str:
    return (f'<g fill="none" stroke="{TRIADA["actor"][2]}" stroke-width="1.4">'
            f'<circle cx="{cx}" cy="{cy}" r="9"/>'
            f'<line x1="{cx}" y1="{cy+9}" x2="{cx}" y2="{cy+31}"/>'
            f'<line x1="{cx-12}" y1="{cy+18}" x2="{cx+12}" y2="{cy+18}"/>'
            f'<line x1="{cx}" y1="{cy+31}" x2="{cx-10}" y2="{cy+46}"/>'
            f'<line x1="{cx}" y1="{cy+31}" x2="{cx+10}" y2="{cy+46}"/>'
            f'</g>')


def punta(x: float, y: float, hacia_der: bool, color: str, hueca: bool) -> str:
    d = 7 if hacia_der else -7
    relleno = "none" if hueca else color
    return (f'<polygon points="{x},{y} {x-d},{y-3.4} {x-d},{y+3.4}" '
            f'fill="{relleno}" stroke="{color}" stroke-width="1.2"/>')


def construir_svg(titulo, parts, items, ancho: float, alto: float) -> str:
    ds, subtitulo = titulo
    orden = list(parts.values())
    y_top = MARGEN_SUP + max((p.h for p in orden), default=40) + 18
    o: list[str] = []
    o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho:.0f} {alto:.0f}" '
             f'width="{ancho:.0f}" height="{alto:.0f}" role="img" '
             f'aria-labelledby="t d" font-family="{FUENTE}">')
    o.append(f'<title id="t">{esc(ds)} - {esc(subtitulo)}</title>')
    o.append(f'<desc id="d">Diagrama de secuencia UML. {len(orden)} participantes, '
             f'{sum(1 for i in items if isinstance(i, Msg))} mensajes.</desc>')
    o.append(f'<rect x="0" y="0" width="{ancho:.0f}" height="{alto:.0f}" fill="{FONDO}"/>')
    o.append(f'<text x="{MARGEN_IZQ}" y="{MARGEN_SUP - 8}" font-size="{FONT_TITULO}" '
             f'font-weight="600" fill="{TRIADA["actor"][2]}">{esc(ds)} - {esc(subtitulo)}</text>')

    # lineas de vida: cada una nace en el borde inferior de SU PROPIA cabecera
    for p in orden:
        o.append(f'<line x1="{p.x:.1f}" y1="{p.y_base:.1f}" x2="{p.x:.1f}" y2="{alto - MARGEN_INF:.1f}" '
                 f'stroke="{BORDE_TENUE}" stroke-width="1" stroke-dasharray="4 4"/>')

    # fragmentos (debajo de los mensajes)
    for it in items:
        if not isinstance(it, Frag):
            continue
        relleno, borde, _ = TRIADA["alterno"] if re.match(r"^F[AE]-", it.guard) else TRIADA["actor"]
        o.append(f'<rect x="{it.x0:.1f}" y="{it.y0:.1f}" width="{it.x1-it.x0:.1f}" '
                 f'height="{max(20, it.y1-it.y0):.1f}" fill="none" stroke="{borde}" '
                 f'stroke-width="1" rx="3"/>')
        tx, ty = it.x0, it.y0
        o.append(f'<polygon points="{tx},{ty} {tx+FRAME_TAB_W},{ty} '
                 f'{tx+FRAME_TAB_W},{ty+FRAME_TAB_H-8} {tx+FRAME_TAB_W-8},{ty+FRAME_TAB_H} '
                 f'{tx},{ty+FRAME_TAB_H}" fill="{relleno}" stroke="{borde}" stroke-width="1"/>')
        o.append(f'<text x="{tx+9}" y="{ty+FRAME_TAB_H-6}" font-size="{FONT_MSG}" '
                 f'font-weight="600" fill="{borde}">{esc(it.kind)}</text>')
        if it.guard:
            g = envolver(it.guard, it.x1 - it.x0 - FRAME_TAB_W - 20, FONT_MSG)[0]
            o.append(f'<text x="{tx+FRAME_TAB_W+10}" y="{ty+FRAME_TAB_H-6}" '
                     f'font-size="{FONT_MSG}" fill="{borde}">[{esc(g)}]</text>')
        for guard, gy in it.elses:
            o.append(f'<line x1="{it.x0:.1f}" y1="{gy:.1f}" x2="{it.x1:.1f}" y2="{gy:.1f}" '
                     f'stroke="{borde}" stroke-width="1" stroke-dasharray="5 4"/>')
            if guard:
                g = envolver(guard, it.x1 - it.x0 - 24, FONT_MSG)[0]
                o.append(f'<text x="{it.x0+10:.1f}" y="{gy+13:.1f}" font-size="{FONT_MSG}" '
                         f'fill="{borde}">[{esc(g)}]</text>')

    # divisores
    for it in items:
        if not isinstance(it, Div):
            continue
        xs = [p.x for p in orden]
        x0, x1 = (min(xs) - 20, max(xs) + 20) if xs else (MARGEN_IZQ, ancho - MARGEN_DER)
        o.append(f'<line x1="{x0:.1f}" y1="{it.y:.1f}" x2="{x1:.1f}" y2="{it.y:.1f}" '
                 f'stroke="{LINEA_TENUE}" stroke-width="1"/>')
        w = ancho_texto(it.texto, FONT_CAB) + 22
        cx = (x0 + x1) / 2
        o.append(f'<rect x="{cx-w/2:.1f}" y="{it.y-11:.1f}" width="{w:.1f}" height="22" rx="3" '
                 f'fill="{FONDO}" stroke="{BORDE_TENUE}" stroke-width="1"/>')
        o.append(f'<text x="{cx:.1f}" y="{it.y+4:.1f}" font-size="{FONT_CAB}" font-weight="600" '
                 f'text-anchor="middle" fill="{LINEA}">{esc(it.texto)}</text>')

    # mensajes
    for it in items:
        if not isinstance(it, Msg):
            continue
        a, b = parts.get(it.origen), parts.get(it.destino)
        if a is None or b is None:
            continue
        color = LINEA if it.kind != "return" else LINEA_TENUE
        dash = ' stroke-dasharray="6 4"' if it.kind == "return" else ""
        w = max(ancho_texto(l, FONT_MSG) for l in it.lineas) if it.lineas else 0

        if it.kind == "self":
            x0 = a.x
            x1 = a.x + SELF_LOOP_W
            o.append(f'<polyline points="{x0:.1f},{it.y:.1f} {x1:.1f},{it.y:.1f} '
                     f'{x1:.1f},{it.y+SELF_LOOP_H:.1f} {x0+9:.1f},{it.y+SELF_LOOP_H:.1f}" '
                     f'fill="none" stroke="{color}" stroke-width="1.3"{dash}/>')
            o.append(punta(x0 + 2, it.y + SELF_LOOP_H, False, color, it.kind == "return"))
            tx = x1 + 10
        else:
            der = b.x > a.x
            x0, x1 = a.x, b.x
            o.append(f'<line x1="{x0:.1f}" y1="{it.y:.1f}" x2="{x1:.1f}" y2="{it.y:.1f}" '
                     f'stroke="{color}" stroke-width="1.3"{dash}/>')
            o.append(punta(x1 + (-2 if der else 2), it.y, der, color, it.kind == "return"))
            tx = (x0 + x1) / 2 - w / 2

        # R4: fondo opaco defensivo detras del texto
        alto_txt = LINEA_ALTO_MSG * len(it.lineas)
        o.append(f'<rect x="{tx-4:.1f}" y="{it.y_texto-2:.1f}" width="{w+8:.1f}" '
                 f'height="{alto_txt+2:.1f}" fill="{FONDO}"/>')
        for k, l in enumerate(it.lineas):
            o.append(f'<text x="{tx:.1f}" y="{it.y_texto + LINEA_ALTO_MSG*(k+1) - 3:.1f}" '
                     f'font-size="{FONT_MSG}" fill="{TRIADA["actor"][2]}">{esc(l)}</text>')

    # notas
    for it in items:
        if not isinstance(it, Nota):
            continue
        o.append(f'<rect x="{it.x0:.1f}" y="{it.y0:.1f}" width="{it.x1-it.x0:.1f}" '
                 f'height="{it.y1-it.y0:.1f}" fill="{TRIADA["actor"][0]}" '
                 f'stroke="{BORDE_TENUE}" stroke-width="1" rx="3"/>')
        for k, l in enumerate(it.lineas_txt):
            o.append(f'<text x="{it.x0+NOTA_PAD:.1f}" '
                     f'y="{it.y0+NOTA_PAD+LINEA_ALTO_MSG*(k+1)-3:.1f}" font-size="{FONT_NOTA}" '
                     f'fill="{TRIADA["actor"][2]}">{esc(l)}</text>')

    # cabeceras (encima de todo)
    for p in orden:
        relleno, borde, texto = TRIADA[p.tipo]
        if p.tipo == "actor":
            o.append(monigote(p.x, MARGEN_SUP + 12))
            base = MARGEN_SUP + ALTO_ACTOR + 8
            for k, l in enumerate(p.lineas):
                o.append(f'<text x="{p.x:.1f}" y="{base + LINEA_ALTO_MSG*k:.1f}" '
                         f'font-size="{FONT_CAB}" text-anchor="middle" fill="{texto}">{esc(l)}</text>')
        else:
            h = max(ALTO_CAJA_MIN, 20 + LINEA_ALTO_MSG * len(p.lineas))
            o.append(f'<rect x="{p.x-p.w/2:.1f}" y="{MARGEN_SUP:.1f}" width="{p.w:.1f}" '
                     f'height="{h:.1f}" rx="4" fill="{relleno}" stroke="{borde}" stroke-width="1"/>')
            o.append(icono(p.tipo, p.x - p.w / 2 + 14, MARGEN_SUP + h / 2, borde))
            for k, l in enumerate(p.lineas):
                o.append(f'<text x="{p.x + 10:.1f}" '
                         f'y="{MARGEN_SUP + h/2 - LINEA_ALTO_MSG*(len(p.lineas)-1)/2 + LINEA_ALTO_MSG*k + 4:.1f}" '
                         f'font-size="{FONT_CAB}" text-anchor="middle" fill="{texto}">{esc(l)}</text>')

    o.append("</svg>")
    return "\n".join(o)


# --------------------------------------------------------------------------

def procesar(ruta: Path, escribir: bool) -> tuple[bool, str]:
    texto = ruta.read_text(encoding="utf-8")
    titulo, parts, items = parsear(texto)
    if not parts:
        return False, f"{ruta.name}: sin participantes declarados"
    ancho = calcular_columnas(parts, items)
    alto = calcular_filas(parts, items, ancho)
    situar_fragmentos(parts, items, ancho)

    errores = verificar_geometria(parts, items)
    if errores:
        return False, f"{ruta.name}: {len(errores)} colision(es)\n    - " + "\n    - ".join(errores[:6])

    svg = construir_svg(titulo, parts, items, ancho, alto)
    destino = DIR_SVG / (ruta.stem + ".svg")
    if escribir:
        DIR_SVG.mkdir(parents=True, exist_ok=True)
        destino.write_text(svg, encoding="utf-8")
    nmsg = sum(1 for i in items if isinstance(i, Msg))
    return True, (f"{ruta.name}: {len(parts)} participantes, {nmsg} mensajes, "
                  f"lienzo {ancho:.0f}x{alto:.0f} px")


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description="Genera los SVG de los diagramas de secuencia.")
    ap.add_argument("--verificar", action="store_true", help="solo comprueba, no escribe")
    args = ap.parse_args(argv)

    pumls = sorted(DIR_PUML.glob("DS-*.puml"))
    if not pumls:
        print("No hay ningun DS-*.puml en", DIR_PUML)
        return 1

    fallos = 0
    for p in pumls:
        ok, msg = procesar(p, escribir=not args.verificar)
        print(("  OK   " if ok else "  FALLA ") + msg)
        if not ok:
            fallos += 1

    print()
    if fallos:
        print(f"RESULTADO: {fallos} de {len(pumls)} con colisiones geometricas (L-1/L-2).")
        return 1
    print(f"RESULTADO: {len(pumls)} diagrama(s) sin colisiones."
          + ("  (--verificar: no se escribio nada)" if args.verificar else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
