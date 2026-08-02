#!/usr/bin/env python3
"""Genera los SVG acompanantes de los diagramas de robustez DR-01..DR-14.

Los `.puml` son la FUENTE DE VERDAD (los valida `validate_robustness_puml.py`).
Este script produce la VISTA DERIVADA en SVG, con el mismo sistema visual que
`MD-01_modelo_dominio.svg` y `DCU-01_casos_uso.svg`: lienzo de ancho fijo,
`role="img"` + `<title>`/`<desc>`, tipografia unica heredada de la raiz, sin
`<defs>` ni `<style>` ni `<marker>`, agrupacion por color en triadas
(relleno pastel / borde saturado / texto oscuro) y leyenda de notacion.

Por que un generador y no 14 SVG a mano: son 262 elementos y ~370 arcos en 14
diagramas; un generador garantiza que los 14 comparten exactamente la misma
reticula y hace el resultado reproducible, igual que `grafo/scripts/`.

Layout: cuatro carriles verticales (Actor - Borde - Controlador - Entidad), que
es la disposicion natural de BCE, con los pasos fluyendo hacia abajo y los arcos
ruteados ortogonalmente por los canales entre carriles.

v2.0 - LEGIBILIDAD. La v1 producia diagramas con etiquetas encima de las lineas
y trazos superpuestos. No era cuestion de estilo: eran tres defectos concretos,
y los tres estan corregidos aqui.

  1. CAPACIDAD FIJA. Los arcos se repartian con `idx % N` sobre bandas
     constantes. `CANAL_CC` daba 4 posiciones y DR-06 pide 24 arcos: del quinto
     en adelante reciclaba una coordenada. No era exclusivo de DR-06 — medidos
     los 14, TODOS desbordaban algun canal. Ahora `asignar_pistas` hace
     coloreado de intervalos: dos arcos comparten x si no se solapan en y, con
     lo que la demanda de DR-06 baja de 24 a 12 pistas, y las bandas estan
     dimensionadas contra ese peor caso MEDIDO.

  2. ANTI-SOLAPE CIEGO. `libre()` comparaba cada etiqueta solo contra otras
     etiquetas, nunca contra las lineas: por construccion no podia ver el
     defecto que el ojo ve primero. Y si no hallaba hueco, colocaba igual sin
     avisar. Ahora comprueba tambien los arcos —excluyendo el propio, sobre el
     que el chip se apoya a proposito— y el hueco existe de verdad, porque cada
     par de carriles tiene DOS bandas: una de etiquetas, sin una sola pista, y
     otra de pistas. Un chip ya no puede taparle la linea a nadie.

  3. SIN VERIFICACION. Nada comprobaba el resultado. Ahora `verificar_geometria`
     contrasta todas las cajas de texto contra todas las cajas y todos los
     segmentos, y el lote ABORTA sin escribir nada si algo colisiona: mejor no
     producir nada que producir algo ilegible, que es como se colaron los SVG
     de la v1.

Y la altura de una caja ya no la fija solo su texto, sino tambien cuantos arcos
salen de ella (`PASO_ANCLAJE`): con catorce arcos en una caja de 37px los anclajes
salian a 2,5px y catorce etiquetas de 14px no podian no solaparse. Ninguna heuristica
de colocacion arregla despues un espacio que no existe.

Uso:
    python generar_svg_robustez.py              # regenera los 14 .svg
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

W = 1340
MARGEN_SUP = 34
ALTO_CABECERA = 46      # titulo + cabeceras de carril
GAP_FILA = 14
PASO_ANCLAJE = 17       # px minimos entre dos anclajes de la misma caja.
                        # Un chip mide 14 px de alto: por debajo de esto, dos
                        # etiquetas del mismo objeto no pueden no solaparse.
RADIO = 4

CARRIL = {
    "actor":    {"x": 24,   "w": 96,  "titulo": "Actor"},
    "boundary": {"x": 225,  "w": 195, "titulo": "Objeto tipo Borde"},
    "control":  {"x": 615,  "w": 275, "titulo": "Controlador"},
    "entity":   {"x": 1140, "w": 165, "titulo": "Entidad"},
}
ORDEN_CARRIL = ["actor", "boundary", "control", "entity"]

# El hueco entre dos carriles se reparte en DOS BANDAS, y esa separacion es la
# clave del rediseño (v2.0). Antes habia una sola: las etiquetas se apoyaban en
# su tramo horizontal justo donde pasaban todas las pistas verticales, asi que
# cada chip tapaba los arcos de los demas. Ahora:
#
#   [ caja ][ ZONA DE ETIQUETAS — sin una sola pista ][ PISTAS ][ caja ]
#
# Los chips viven en la primera y los tramos verticales en la segunda, de modo
# que un chip no puede taparle la linea a nadie: no hay ninguna donde el esta.
#
# Ancho de cada banda DERIVADO DE LA DEMANDA MEDIDA, no elegido a ojo. Las
# pistas, del peor caso de los 14 diagramas con `asignar_pistas` (AB=2, BC=15,
# CC=12, CE=10) a SEPARACION_MIN px. Las zonas de etiqueta, del chip mas ancho
# que produce el corpus: 50 px, con holgura.
ZONA_AB = (124, 186)      # 62px de etiquetas
CANAL_AB = (190, 212)     #  2 pistas en 22px
ZONA_BC = (424, 492)      # 68px de etiquetas
CANAL_BC = (496, 601)     # 15 pistas en 105px
ZONA_CX = (894, 962)      # 68px, compartida por los chips de C<->C y C<->E
CANAL_CC = (966, 1050)    # 12 pistas en 84px
CANAL_CE = (1058, 1128)   # 10 pistas en 70px

# Zona de etiquetas que corresponde a cada canal
ZONA_DE_CANAL = {CANAL_AB: ZONA_AB, CANAL_BC: ZONA_BC,
                 CANAL_CC: ZONA_CX, CANAL_CE: ZONA_CX}

SEPARACION_MIN = 7        # px entre arcos paralelos; por debajo dejan de leerse

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


def disponer(elems: dict[str, Elem], rels=()) -> int:
    """Asigna x/y/w/h a cada elemento. Devuelve el alto del area de diagrama.

    La altura de una caja no la fija solo su texto: la fija **tambien el numero
    de arcos que salen de ella**. `calcular_anclajes` reparte los k anclajes a
    lo largo del borde, con paso `h/(k+1)`; si la caja mide lo que mide su
    texto, catorce arcos salen a dos pixeles y medio unos de otros, y sus catorce
    etiquetas —de catorce pixeles de alto— no pueden no solaparse. Ninguna heuristica de
    colocacion arregla eso despues: el espacio sencillamente no existe.

    Asi que la caja crece hasta `PASO_ANCLAJE * (k+1)`. Es el mismo principio
    que rige los canales: **capacidad derivada de la demanda real**, aplicado
    aqui al eje vertical.
    """
    incid: dict[str, int] = {a: 0 for a in elems}
    for l, r, _ in rels:
        incid[l] = incid.get(l, 0) + 1
        incid[r] = incid.get(r, 0) + 1

    y_base = MARGEN_SUP + ALTO_CABECERA
    alto_max = y_base

    for tipo in ORDEN_CARRIL:
        carril = CARRIL[tipo]
        grupo = sorted((e for e in elems.values() if e.tipo == tipo),
                       key=lambda e: (e.orden, e.label))
        y = y_base
        for e in grupo:
            e.x, e.w = carril["x"], carril["w"]
            k = incid.get(e.alias, 0)
            if tipo == "actor":
                e.lineas = envolver(e.label, e.w, 11)
                # tambien el actor crece con sus arcos: con k=4 el abanico se
                # salia por encima del monigote y una linea nacia del vacio
                e.h = max(55 + 6 + 13 * len(e.lineas), 16 + (k - 1) * PASO_ANCLAJE)
            else:
                # deja hueco al icono a la izquierda del texto
                e.lineas = envolver(e.label, e.w - 34, 11)
                e.h = max(22 + 15 * len(e.lineas), PASO_ANCLAJE * (k + 1))
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
                # el centro baja lo justo para que el anclaje mas alto nunca
                # quede por encima del monigote (con k>=4 lo hacia)
                centro = e.y + max(18, 8 + (k - 1) * PASO_ANCLAJE / 2)
                anc[(alias, i)] = centro + (j - (k - 1) / 2) * PASO_ANCLAJE
            else:
                anc[(alias, i)] = e.y + e.h * (j + 1) / (k + 1)
    return anc


def canal_de(ta: str, tb: str):
    """Banda vertical por la que se rutea un arco entre dos carriles."""
    tipos = {ta, tb}
    if tipos == {"actor", "boundary"}:
        return CANAL_AB
    if tipos == {"boundary", "control"}:
        return CANAL_BC
    if tipos == {"control"}:
        return CANAL_CC
    if tipos == {"control", "entity"}:
        return CANAL_CE
    return None                               # el validador prohibe el resto


def asignar_pistas(elems, rels, anclajes) -> dict[int, float]:
    """Decide la coordenada x del tramo vertical de CADA arco.

    Sustituye al reparto por `idx % N` sobre bandas de capacidad fija, que era
    el defecto de fondo de la v1: `CANAL_CC` daba **4** posiciones y `DR-06`
    pide **24** arcos, asi que del quinto en adelante se reciclaba una
    coordenada ya usada y dos trazos se dibujaban uno encima del otro. No era
    exclusivo de DR-06: los catorce diagramas desbordaban algun canal.

    Aqui la observacion que lo resuelve: **dos arcos pueden compartir x si sus
    tramos verticales no se solapan en y**. Es coloreado voraz de intervalos —
    se ordenan por y_min y cada uno toma la primera pista cuyo ultimo y_max
    quede por encima con holgura—. El numero de pistas pasa a ser la
    PROFUNDIDAD MAXIMA DE SOLAPAMIENTO, no el total de arcos: en `DR-06` baja
    de 24 a 12. Los canales de arriba estan dimensionados contra ese peor caso
    medido, no contra una estimacion.
    """
    porcanal: dict[tuple, list[tuple[float, float, int]]] = {}
    for i, (l, r, _) in enumerate(rels):
        canal = canal_de(elems[l].tipo, elems[r].tipo)
        if canal is None:
            continue
        ya, yb = anclajes[(l, i)], anclajes[(r, i)]
        porcanal.setdefault(canal, []).append((min(ya, yb), max(ya, yb), i))

    cx_de: dict[int, float] = {}
    for (c0, c1), arcos in porcanal.items():
        pistas: list[float] = []              # ultimo y_max ocupado de cada pista
        de_arco: dict[int, int] = {}
        for y0, y1, i in sorted(arcos):
            for k, ymax in enumerate(pistas):
                if y0 >= ymax + SEPARACION_MIN:
                    pistas[k] = y1
                    de_arco[i] = k
                    break
            else:
                pistas.append(y1)
                de_arco[i] = len(pistas) - 1
        n = max(1, len(pistas))
        # Se reparten sobre TODA la banda: un diagrama que solo necesita dos
        # pistas las separa al maximo, en vez de apretarlas contra el borde.
        paso = (c1 - c0) / n if n > 1 else 0
        for i, k in de_arco.items():
            cx_de[i] = c0 + k * paso if n > 1 else (c0 + c1) / 2
    return cx_de


def puntos_arco(a: Elem, b: Elem, cx: float, ya: float, yb: float):
    """Ruteo ortogonal por la pista `cx` que le asigno `asignar_pistas`."""
    tipos = {a.tipo, b.tipo}
    izq, der = (a, b) if ORDEN_CARRIL.index(a.tipo) <= ORDEN_CARRIL.index(b.tipo) else (b, a)
    y_izq, y_der = (ya, yb) if izq is a else (yb, ya)

    if tipos == {"actor", "boundary"}:
        return [(izq.x + izq.w / 2 + 12, y_izq), (cx, y_izq), (cx, y_der), (der.x, y_der)]

    if tipos == {"control"}:                  # salen y entran por la derecha
        xr = a.x + a.w
        return [(xr, ya), (cx, ya), (cx, yb), (xr, yb)]

    if tipos in ({"boundary", "control"}, {"control", "entity"}):
        return [(izq.x + izq.w, y_izq), (cx, y_izq), (cx, y_der), (der.x, y_der)]

    # cualquier otro par (no deberia existir: el validador lo prohibe)
    return [(izq.x + izq.w, y_izq), (der.x, y_der)]


# --------------------------------------------------------------------------
# Verificacion geometrica post-layout (portada de generar_svg_secuencia.py)
# --------------------------------------------------------------------------

def solapan(c1, c2) -> bool:
    """Interseccion de dos rectangulos. Se ignora todo campo mas alla del 4.o."""
    return not (c1[2] <= c2[0] or c2[2] <= c1[0] or c1[3] <= c2[1] or c2[3] <= c1[1])


def caja_cruza_segmento(c, seg) -> bool:
    """Un segmento ortogonal atraviesa el rectangulo c.

    Ambos llevan un campo extra con el indice del arco al que pertenecen; aqui
    se descarta, porque la decision de que hacer con el la toma quien llama.
    """
    x1, y1, x2, y2 = seg[:4]
    if x1 == x2:                              # tramo vertical
        return c[0] <= x1 <= c[2] and not (max(y1, y2) < c[1] or min(y1, y2) > c[3])
    if y1 == y2:                              # tramo horizontal
        return c[1] <= y1 <= c[3] and not (max(x1, x2) < c[0] or min(x1, x2) > c[2])
    return False


def verificar_geometria(cajas, segmentos) -> list[str]:
    """Ninguna etiqueta puede solaparse con otra ni ser cruzada por un arco AJENO.

    Es la comprobacion que la v1 no podia hacer: su `libre()` comparaba cada
    etiqueta candidata **solo contra otras etiquetas**, nunca contra las lineas,
    asi que por construccion era incapaz de detectar el defecto que el ojo ve
    primero. Y si tras 40 intentos no hallaba hueco, colocaba igual sin avisar.

    «Ajeno» no es un matiz menor. Un chip se apoya **sobre su propio arco** a
    proposito —es lo que hace inequivoca la pertenencia— y su fondo opaco tapa
    ese tramo, que es el idioma normal de una etiqueta sobre linea. Lo que no
    puede es tapar el arco **de otro**: ahi si se pierde informacion.

    `cajas` son `(x0, y0, x1, y1, i_rel)`; `segmentos`, `(x1, y1, x2, y2, i_rel)`.
    """
    errores: list[str] = []
    for i in range(len(cajas)):
        for j in range(i + 1, len(cajas)):
            if solapan(cajas[i], cajas[j]):
                errores.append(f"L-1: dos etiquetas se superponen en y={cajas[i][1]:.0f}")
    for c in cajas:
        for s in segmentos:
            if s[4] != c[4] and caja_cruza_segmento(c, s):
                errores.append(f"L-2: un arco ajeno cruza la etiqueta de y={c[1]:.0f}")
                break
    return errores


def construir_svg(dr: str, subtitulo: str, elems, rels, cursos):
    alto_diagrama = disponer(elems, rels)

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
    segmentos: list[tuple[float, float, float, float]] = []
    anclajes = calcular_anclajes(elems, rels)
    cx_de = asignar_pistas(elems, rels, anclajes)
    for i_rel, (l, r, label) in enumerate(rels):
        a, b = elems[l], elems[r]
        pts = puntos_arco(a, b, cx_de.get(i_rel, (a.x + b.x) / 2),
                          anclajes[(l, i_rel)], anclajes[(r, i_rel)])
        for p, q in zip(pts, pts[1:]):        # para el pase de verificacion
            segmentos.append((p[0], p[1], q[0], q[1], i_rel))
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
            #
            # El chip se desliza a lo largo de su propia linea —es su grado de
            # libertad natural: conserva a que arco pertenece, cosa que moverlo
            # en vertical destruye— pero SOLO dentro de la zona de etiquetas,
            # nunca sobre las pistas. Se guardan los dos tramos horizontales
            # acotados a esa zona.
            ancho = max(16, len(c) * 5.2 + 8)
            canal = canal_de(a.tipo, b.tipo)
            z0, z1 = ZONA_DE_CANAL.get(canal, (pts[0][0], pts[1][0]))
            tramos = []
            for (xa, ya_), (xb, _) in ((pts[0], pts[1]), (pts[3], pts[2])) if len(pts) >= 4 \
                    else ((pts[0], pts[1]),):
                lo, hi = min(xa, xb), max(xa, xb)
                ini, fin = max(lo, z0), min(hi, z1)
                if fin - ini >= 16:
                    # se recorre desde el extremo mas cercano a la caja
                    tramos.append((ini, fin, ya_) if xa <= xb else (fin, ini, ya_))
            if not tramos:                      # arco tan corto que no cruza la zona
                tramos = [(pts[0][0], pts[1][0], pts[0][1])]
            etiquetas.append((tramos, ancho, c, alt, i_rel))
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
    cajas_txt: list[tuple[float, float, float, float, int]] = []
    if etiquetas:
        o.append('<g font-size="9" text-anchor="middle">')

        def libre(caja) -> bool:
            """Libre de OTRAS ETIQUETAS y de LOS ARCOS AJENOS.

            La segunda mitad es la que faltaba en la v1: sin ella el buscador
            de hueco no podia ver el defecto que iba a producir. El arco propio
            se excluye a proposito — el chip se apoya en el.
            """
            if any(solapan(caja, c) for c in cajas_txt):
                return False
            return not any(s[4] != caja[4] and caja_cruza_segmento(caja, s)
                           for s in segmentos)

        y_min = MARGEN_SUP + ALTO_CABECERA + 4
        y_max = alto_diagrama - 4
        for tramos, ancho, c, alt, i_rel in etiquetas:
            caja = respaldo = None

            # 1) deslizar por sus PROPIAS lineas: conserva la pertenencia al arco
            for x_ini, x_fin, y_lin in tramos:
                signo = 1 if x_fin >= x_ini else -1
                recorrido = abs(x_fin - x_ini) - ancho - 8
                mx0 = x_ini + signo * (ancho / 2 + 5)
                if respaldo is None:
                    respaldo = (mx0 - ancho / 2, y_lin - 7, mx0 + ancho / 2, y_lin + 7, i_rel)
                for d in range(0, max(1, int(recorrido)), 3):
                    mx = mx0 + signo * d
                    prueba = (mx - ancho / 2, y_lin - 7, mx + ancho / 2, y_lin + 7, i_rel)
                    if libre(prueba):
                        caja = prueba
                        break
                if caja is not None:
                    break

            # 2) si ningun tramo da de si, apartarse en vertical como ultimo recurso
            if caja is None:
                x_ini, x_fin, y_lin = tramos[0]
                signo = 1 if x_fin >= x_ini else -1
                mx0 = x_ini + signo * (ancho / 2 + 5)
                for paso in range(1, 40):
                    for s in (-1, 1):
                        cand = y_lin + s * paso * 8
                        if not (y_min <= cand <= y_max):
                            continue
                        prueba = (mx0 - ancho / 2, cand - 7, mx0 + ancho / 2, cand + 7, i_rel)
                        if libre(prueba):
                            caja = prueba
                            break
                    if caja is not None:
                        break

            if caja is None:                    # lo declara el pase, no lo esconde
                caja = respaldo
            mx = (caja[0] + caja[2]) / 2
            my = (caja[1] + caja[3]) / 2
            cajas_txt.append(caja)
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
            cx0 = 24 + col * ((W - 60) // 2)
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
    x_arco = (W - 60) // 2 + 190
    o.append(f'<line x1="{x_arco}" y1="{yl2 - 2}" x2="{x_arco + 30}" y2="{yl2 - 2}" '
             f'stroke="{LINEA_TENUE}" stroke-width="1"/>'
             f'<text x="{x_arco + 38}" y="{yl2 + 1}" fill="{LINEA}">Asociacion de comunicacion (sin direccion)</text>')
    o.append("</g>")

    o.append("</svg>")
    return "\n".join(o) + "\n", verificar_geometria(cajas_txt, segmentos)


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
    generados: list[tuple[Path, str]] = []
    con_colisiones: list[tuple[str, list[str]]] = []
    print(f"{'DR':7}{'act':>4}{'bor':>4}{'ctl':>4}{'ent':>4}{'arcos':>7}{'lienzo':>12}{'geom':>8}")
    for f in fuentes:
        elems, rels, cursos, dr, sub = parsear(f.read_text(encoding="utf-8"))
        nombre = dr or f.name[:5]
        svg, errores = construir_svg(nombre, sub, elems, rels, cursos)
        alto = re.search(r'height="(\d+)"', svg).group(1)
        c = {t: sum(1 for e in elems.values() if e.tipo == t) for t in tot}
        for t in tot:
            tot[t] += c[t]
        if errores:
            con_colisiones.append((nombre, errores))
        else:
            generados.append((f.with_suffix(".svg"), svg))
        print(f"{nombre:7}{c['actor']:>4}{c['boundary']:>4}{c['control']:>4}"
              f"{c['entity']:>4}{len(rels):>7}{f'{W}x{alto}':>12}"
              f"{('OK' if not errores else f'{len(errores)} col.'):>8}")

    # --- el pase geometrico ABORTA: mejor no producir nada que producir algo
    #     ilegible, que es como se colaron los SVG de la v1 -------------------
    if con_colisiones:
        print(f"\nABORTADO: {len(con_colisiones)} diagrama(s) con colisiones geometricas.")
        print("No se ha escrito NINGUN .svg — el lote se escribe entero o no se escribe.")
        for nombre, errs in con_colisiones:
            print(f"\n  {nombre}: {len(errs)} colision(es)")
            for e in errs[:6]:
                print(f"    - {e}")
            if len(errs) > 6:
                print(f"    ... y {len(errs) - 6} mas")
        return 1

    if not args.verificar:
        for ruta, svg in generados:
            ruta.write_text(svg, encoding="utf-8")

    total = sum(tot.values())
    print(f"\nTOTAL: {total} elementos "
          f"({tot['actor']}/{tot['boundary']}/{tot['control']}/{tot['entity']})")
    print(f"Verificacion geometrica: {len(generados)} diagrama(s) sin colisiones.")
    esperado = (15, 38, 150, 59)
    real = (tot["actor"], tot["boundary"], tot["control"], tot["entity"])
    if real == esperado and total == 262:
        print("Correspondencia con los .puml: OK (262 elementos, 15/38/150/59)")
        return 0
    print(f"AVISO: se esperaba 262 elementos {esperado} y se obtuvo {total} {real}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
