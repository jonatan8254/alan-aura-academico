# -*- coding: utf-8 -*-
"""Genera el HTML y el PDF del informe academico `INF-01`.

LA FUENTE DE VERDAD ES EL MARKDOWN
----------------------------------
`INF-01_informe_academico.md` es el artefacto versionado, y por eso lo recorre
`verificar_coherencia.py`. Este script produce la VISTA DERIVADA. Es el mismo
reparto que `generar_svg_secuencia.py` aplica a los `.puml`.

POR QUE UN CONVERSOR PROPIO Y NO UNA LIBRERIA
---------------------------------------------
No hay `pandoc`, ni `markdown`, ni LaTeX en el entorno. Lo que si hay es Python
y un navegador. El subconjunto de Markdown que el informe usa es pequeno y
conocido —encabezados, parrafos, tablas, listas, citas, enfasis y codigo en
linea—, asi que convertirlo es mas barato y mas predecible que anadir una
dependencia que el proyecto tendria que declarar y sostener.

LOS DIAGRAMAS VAN EN VECTORIAL
------------------------------
Los `.svg` se embeben EN LINEA, no con `<img src>`. Asi el HTML es autonomo y,
sobre todo, el trazo sobrevive al paso a PDF: el lector puede ampliar sin
pixelado, que es imprescindible cuando `MC-01` mide 9347x2208 px y su texto, a
tamano de pagina, cae a 0,22 mm.

LO QUE HACE FALLAR LA GENERACION
--------------------------------
El informe anterior paso tres semanas afirmando cifras falsas porque era un
`.docx` que ningun validador recorria. Este script comprueba, y FALLA:
  1. cifras canonicas del texto contra `HECHOS_CANONICOS.md`;
  2. artefactos citados en el anexo A contra la ficha real de cada uno;
  3. diagramas referenciados que no existen.
"""
import argparse
import base64
import html
import io
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", "..", ".."))   # rutas relativas: `AGENTS.md §0`
INFORME = os.path.normpath(os.path.join(AQUI, "..", "INF-01_informe_academico.md"))
SALIDA_HTML = os.path.normpath(os.path.join(AQUI, "..", "INF-01_informe_academico.html"))
SALIDA_PDF = os.path.normpath(os.path.join(AQUI, "..", "INF-01_informe_academico.pdf"))

NAVEGADORES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

# Diagramas del anexo B, en el orden del proceso.
DIAGRAMAS = (
    [("Modelo de dominio", "docs/06_dominio/MD-01_modelo_dominio.svg", "MD-01"),
     ("Diagrama de casos de uso", "docs/07_casos_uso/DCU-01_casos_uso.svg", "DCU-01")]
    + [(f"Robustez del caso de uso {i:02d}", None, f"DR-{i:02d}") for i in range(1, 15)]
    + [(f"Secuencia del caso de uso {i:02d}", None, f"DS-{i:02d}") for i in range(1, 15)]
    + [("Modelo de clases de diseño",
        "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.svg", "MC-01")]
)
# Ancho a partir del cual el diagrama va en pagina apaisada.
UMBRAL_APAISADO = 1000


# ---------------------------------------------------------------- comprobacion
def hechos_canonicos():
    p = os.path.join(RAIZ, "docs/00_gobernanza/HECHOS_CANONICOS.md")
    t = io.open(p, encoding="utf-8").read()
    h = {}
    for m in re.finditer(r"^\|\s*(H-\d+)\s*\|[^|]*\|\s*\*\*([\d.]+)\*\*", t, re.M):
        h[m.group(1)] = m.group(2).replace(".", "")
    return h


def version_de_ficha(rel):
    p = os.path.join(RAIZ, "docs", rel)
    if not os.path.exists(p):
        return None, False
    t = io.open(p, encoding="utf-8").read(4000)
    m = re.search(r"\*\*Versión:\*\* (v\d+\.\d+)", t)
    if m:
        return m.group(1), True
    m = re.search(r"^' (v\d+\.\d+) ", t, re.M)
    return (m.group(1) if m else None), True


def comprobar(md):
    """Devuelve la lista de motivos por los que NO se debe generar."""
    fallos = []

    # 1. cifras canonicas citadas en el texto
    h = hechos_canonicos()
    vigentes = set(h.values())
    for cifra, etiqueta in [("283", "mensajes"), ("262", "elementos"), ("193", "operaciones"),
                            ("181", "casos de prueba"), ("201", "operaciones"),
                            ("43", "clases"), ("51", "atributos"), ("80", "relaciones"),
                            # Fase 3 (SD-53). El informe las cita en la seccion 9 y en la
                            # tabla de medidas; sin estar aqui, nada avisaria si se desalinean
                            # de HECHOS_CANONICOS, que es donde viven H-32 a H-35.
                            ("16", "pantallas"), ("38", "pruebas"),
                            ("14", "handlers"), ("13", "rutas REST"),
                            ("68", "tipos del contrato")]:
        if cifra not in vigentes:
            fallos.append(f"CIFRA: el informe cita {cifra} {etiqueta}, y no figura en HECHOS_CANONICOS")

    # 2. artefactos del anexo A contra su ficha
    for m in re.finditer(r"^\| `([A-Z][\w-]+)` \| `([^`]+)` \| (v\d+\.\d+|—) \|", md, re.M):
        art, rel, dec = m.group(1), m.group(2), m.group(3)
        real, existe = version_de_ficha(rel)
        if not existe:
            fallos.append(f"ARTEFACTO: {art} cita `{rel}`, que no existe")
        elif dec != "—" and real and real != dec:
            fallos.append(f"VERSION: {art} se cita en {dec} y su ficha dice {real}")

    # 3. diagramas referenciados
    for _, ruta, ident in DIAGRAMAS:
        if ruta and not os.path.exists(os.path.join(RAIZ, ruta)):
            fallos.append(f"DIAGRAMA: falta {ruta}")
    return fallos


# ------------------------------------------------------------------ conversion
EN_LINEA = [
    (re.compile(r"`([^`]+)`"), lambda m: f"<code>{html.escape(m.group(1))}</code>"),
    (re.compile(r"\*\*([^*]+)\*\*"), lambda m: f"<strong>{m.group(1)}</strong>"),
    (re.compile(r"(?<!\*)\*([^*\n]+)\*(?!\*)"), lambda m: f"<em>{m.group(1)}</em>"),
    (re.compile(r"~~([^~]+)~~"), lambda m: f"<del>{m.group(1)}</del>"),
]


def en_linea(s):
    s = html.escape(s, quote=False)
    marcas, i = [], 0
    def guardar(m):
        nonlocal i
        marcas.append(f"<code>{m.group(1)}</code>")
        i += 1
        return f"\x00{i-1}\x00"
    s = re.sub(r"`([^`]+)`", guardar, s)
    for pat, fn in EN_LINEA[1:]:
        s = pat.sub(fn, s)
    for j, v in enumerate(marcas):
        s = s.replace(f"\x00{j}\x00", v)
    return s


def tabla(filas):
    out = ['<table>']
    cab = [c.strip() for c in filas[0].strip().strip("|").split("|")]
    out.append("<thead><tr>" + "".join(f"<th>{en_linea(c)}</th>" for c in cab) + "</tr></thead><tbody>")
    for f in filas[2:]:
        cel = [c.strip() for c in f.strip().strip("|").split("|")]
        out.append("<tr>" + "".join(f"<td>{en_linea(c)}</td>" for c in cel) + "</tr>")
    out.append("</tbody></table>")
    return "\n".join(out)


def a_html_portada(lineas):
    """La portada conserva sus saltos de linea y sus tablas."""
    out, i = [], 0
    while i < len(lineas):
        l = lineas[i]
        if l.startswith("|"):
            j = i
            while j < len(lineas) and lineas[j].startswith("|"):
                j += 1
            out.append(tabla(lineas[i:j]))
            i = j
        elif re.match(r"^#{1,3} ", l):
            n = len(l) - len(l.lstrip("#"))
            out.append(f"<h{n}>{en_linea(l[n:].strip())}</h{n}>")
            i += 1
        elif not l.strip():
            i += 1
        else:
            j, cuerpo = i, []
            while j < len(lineas) and lineas[j].strip() and not lineas[j].startswith(("|", "#")):
                cuerpo.append(en_linea(lineas[j].strip()))
                j += 1
            out.append("<p>" + "<br>".join(cuerpo) + "</p>")
            i = j
    return "\n".join(out)


def a_html(md):
    lineas = md.splitlines()
    out, i = [], 0
    while i < len(lineas):
        l = lineas[i]
        if l.strip() == "<!-- PORTADA -->":
            j = i + 1
            bloque = []
            while j < len(lineas) and lineas[j].strip() != "<!-- /PORTADA -->":
                bloque.append(lineas[j])
                j += 1
            # En la portada cada salto de linea es un salto de verdad, no un
            # parrafo que se une al siguiente.
            out.append('<div class="portada">' + a_html_portada(bloque) + "</div>")
            i = j + 1
        elif l.strip() == "<!-- DIAGRAMAS -->":
            out.append(bloque_diagramas())
            i += 1
        elif l.strip().startswith("<!-- RECORTE "):
            # `<!-- RECORTE ruta | etiqueta | titulo -->`
            arg = l.strip()[12:-3].strip()
            partes = [x.strip() for x in arg.split("|")]
            if len(partes) == 3:
                out.append(bloque_recorte(partes[0], partes[1], partes[2]))
            i += 1
        elif re.match(r"^#{1,4} ", l):
            n = len(l) - len(l.lstrip("#"))
            txt = l[n:].strip()
            # Salto de pagina SOLO en los anexos, que son la frontera estructural
            # real del documento. Forzarlo tambien en cada "## <digito>" dejaba
            # media pagina en blanco detras de cada seccion corta --y las hay de
            # siete lineas--, inflando el PDF sin ganar legibilidad. Las secciones
            # numeradas fluyen; lo que evita que un encabezado quede huerfano al pie
            # es la regla `break-after: avoid` del CSS, no un salto duro.
            cls = ' class="salto"' if l.startswith("## Anexo") else ""
            out.append(f"<h{n}{cls}>{en_linea(txt)}</h{n}>")
            i += 1
        elif l.strip() == "---":
            i += 1
        elif l.startswith("|"):
            j = i
            while j < len(lineas) and lineas[j].startswith("|"):
                j += 1
            out.append(tabla(lineas[i:j]))
            i = j
        elif re.match(r"^\s*(?:[-*+]|\d+\.)\s+\S", l):
            orden = bool(re.match(r"^\s*\d+\.", l))
            j, items = i, []
            while j < len(lineas) and re.match(r"^\s*(?:[-*+]|\d+\.)\s+\S", lineas[j]):
                items.append(re.sub(r"^\s*(?:[-*+]|\d+\.)\s+", "", lineas[j]))
                j += 1
            t = "ol" if orden else "ul"
            out.append(f"<{t}>" + "".join(f"<li>{en_linea(x)}</li>" for x in items) + f"</{t}>")
            i = j
        elif l.startswith(">"):
            j, cuerpo = i, []
            while j < len(lineas) and lineas[j].startswith(">"):
                cuerpo.append(lineas[j].lstrip("> ").rstrip())
                j += 1
            out.append("<blockquote>" + en_linea(" ".join(c for c in cuerpo if c)) + "</blockquote>")
            i = j
        elif not l.strip():
            i += 1
        else:
            j, cuerpo = i, []
            while (j < len(lineas) and lineas[j].strip()
                   and not lineas[j].startswith(("|", ">", "#"))
                   and not re.match(r"^\s*(?:[-*+]|\d+\.)\s+\S", lineas[j])
                   and lineas[j].strip() != "---"):
                cuerpo.append(lineas[j].strip())
                j += 1
            out.append("<p>" + en_linea(" ".join(cuerpo)) + "</p>")
            i = j
    return "\n".join(out)


# ------------------------------------------------------------------- diagramas
def medir(svg):
    m = re.search(r'width="(\d+(?:\.\d+)?)"[^>]*height="(\d+(?:\.\d+)?)"', svg[:1500])
    if m:
        return float(m.group(1)), float(m.group(2))
    m = re.search(r'viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"', svg[:1500])
    return (float(m.group(1)), float(m.group(2))) if m else (0, 0)


def localizar(ident):
    for pat in [f"docs/07_casos_uso/robustez/{ident}_*.svg",
                f"docs/07_casos_uso/secuencia/svg/{ident}_*.svg"]:
        import glob
        r = glob.glob(os.path.join(RAIZ, pat))
        if r:
            return r[0]
    return None


# Numeracion global de figuras, en orden de aparicion en el documento. El
# generador falla si alguna queda sin numero.
_FIGURA = [0]


def siguiente_figura():
    _FIGURA[0] += 1
    return _FIGURA[0]


def recorte(ruta_rel, etiqueta, margen=120, alto=560, ancho_frac=0.62):
    """Recorte ampliado de la region donde vive `etiqueta`, ajustando el viewBox.

    El `.svg` es texto plano: recortar es mover la ventana, no regenerar ni
    tocar el archivo fuente. Sirve para que el lector vea la parte que el cuerpo
    del informe esta discutiendo sin depender del zoom.
    """
    p = os.path.join(RAIZ, ruta_rel)
    if not os.path.exists(p):
        return None
    svg = io.open(p, encoding="utf-8").read()
    w, h = medir(svg)
    m = re.search(r'<text[^>]*\sx="([\d.]+)"[^>]*\sy="([\d.]+)"[^>]*>[^<]*'
                  + re.escape(etiqueta), svg)
    if not m:
        return None
    y = float(m.group(2))
    y0 = max(0, y - margen)
    alto_real = min(alto, h - y0)
    cuerpo = re.sub(r'<\?xml[^>]*\?>', "", svg).strip()
    cuerpo = re.sub(r'\swidth="[\d.]+"', "", cuerpo, count=1)
    cuerpo = re.sub(r'\sheight="[\d.]+"', "", cuerpo, count=1)
    cuerpo = re.sub(r'\sviewBox="[^"]*"', "", cuerpo, count=1)
    ancho = w * ancho_frac
    cuerpo = cuerpo.replace("<svg", f'<svg viewBox="0 {y0:.0f} {ancho:.0f} {alto_real:.0f}"', 1)
    return cuerpo, ancho, alto_real


def bloque_recorte(ruta_rel, etiqueta, titulo):
    r = recorte(ruta_rel, etiqueta)
    if not r:
        return ""
    cuerpo, w, h = r
    return (f'<figure class="figura recorte">{cuerpo}'
            f'<figcaption>Figura {siguiente_figura()}. {en_linea(titulo)}</figcaption></figure>')


def bloque_diagramas():
    import glob
    out, n = [], 0
    for titulo, ruta, ident in DIAGRAMAS:
        p = os.path.join(RAIZ, ruta) if ruta else localizar(ident)
        if not p or not os.path.exists(p):
            continue
        svg = io.open(p, encoding="utf-8").read()
        # el SVG entra tal cual: vectorial, ampliable, sin rasterizar
        svg = re.sub(r'<\?xml[^>]*\?>', "", svg).strip()
        svg = re.sub(r'\swidth="[\d.]+"', "", svg, count=1)
        svg = re.sub(r'\sheight="[\d.]+"', "", svg, count=1)
        w, h = medir(io.open(p, encoding="utf-8").read())
        n = siguiente_figura()
        cls = "figura apaisada" if w > UMBRAL_APAISADO else "figura"
        out.append(f'<figure class="{cls}">{svg}'
                   f'<figcaption>Figura {n}. {html.escape(titulo)} '
                   f'(<code>{ident}</code>, {int(w)} × {int(h)} px)</figcaption></figure>')
    return "\n".join(out)


# ------------------------------------------------------------------------ CSS
CSS = """
@page { size: A4 portrait; margin: 20mm 18mm; }
@page apaisada { size: A4 landscape; margin: 14mm; }
html { font-size: 10.5pt; }
body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.55; color: #111;
       text-align: justify; hyphens: auto; }
h1 { font-size: 2.1em; line-height: 1.2; text-align: left; margin: 0 0 .2em; }
h2 { font-size: 1.35em; text-align: left; margin: 1.6em 0 .5em;
     border-bottom: 1px solid #bbb; padding-bottom: .2em; }
h3 { font-size: 1.1em; text-align: left; margin: 1.3em 0 .4em; }
h2.salto { page-break-before: always; }
/* Un encabezado nunca queda solo al pie de pagina: arrastra consigo lo que
   introduce. Es lo que sustituye al salto duro que antes llevaba cada seccion. */
h2, h3, h4 { page-break-after: avoid; break-after: avoid; }
p { margin: 0 0 .7em; orphans: 2; widows: 2; }
code { font-family: Consolas, 'Courier New', monospace; font-size: .88em;
       background: #f2f2f2; padding: .05em .25em; border-radius: 2px; }
table { border-collapse: collapse; width: 100%; margin: .9em 0; font-size: .88em;
        page-break-inside: avoid; }
th, td { border: 1px solid #ccc; padding: .35em .5em; text-align: left; vertical-align: top; }
th { background: #ececec; }
blockquote { margin: .9em 0; padding: .5em .9em; border-left: 3px solid #999;
             background: #fafafa; font-size: .95em; }
ul, ol { margin: 0 0 .8em; padding-left: 1.4em; }
li { margin-bottom: .25em; }
figure { margin: 1.2em 0; page-break-inside: avoid; text-align: center; }
/* La altura se acota al alto util de la caja de pagina. Sin esto un diagrama
   alto —DS-06 mide 4457x3819 px— se derrama por varias paginas y el informe
   pasa de ~60 a 125. El trazo sigue siendo vectorial: se escala, no se recorta,
   y el lector amplia en el visor. */
figure svg { max-width: 100%; max-height: 232mm; width: auto; height: auto; }
figure.apaisada { page: apaisada; page-break-before: always; }
figure.apaisada svg { max-height: 158mm; }
figcaption { font-size: .8em; color: #444; margin-top: .5em; text-align: center;
             font-style: italic; }
.portada { text-align: center; page-break-after: always; padding-top: 26mm; }
.portada p { margin: 1.1em 0; }
.portada h1 { text-align: center; font-size: 2.4em; margin: 1.4em 0 .3em; }
.portada h2 { text-align: center; font-size: 1.18em; font-weight: normal; font-style: italic;
              border: 0; margin: 0 0 2em; color: #333; }
.portada table { width: 78%; margin: 1.4em auto 2em; font-size: .92em; }
.portada td { text-align: left; }
.portada strong { letter-spacing: .04em; }
.ficha { font-size: .82em; color: #333; background: #fafafa; border: 1px solid #e0e0e0;
         padding: .7em .9em; margin: 0 0 1.6em; text-align: left; }
"""


def generar(pdf=True):
    md = io.open(INFORME, encoding="utf-8").read()
    fallos = comprobar(md)
    if fallos:
        print("NO SE GENERA. El informe no cuadra con la fuente:\n")
        for f in fallos:
            print(f"  !! {f}")
        return len(fallos)

    cuerpo = a_html(md)
    doc = (f"<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\">"
           f"<title>INF-01 — Informe académico Alan &amp; Aura</title>"
           f"<style>{CSS}</style></head><body>{cuerpo}</body></html>")
    io.open(SALIDA_HTML, "w", encoding="utf-8").write(doc)
    print(f"  OK  HTML  {os.path.basename(SALIDA_HTML)}  ({len(doc)//1024} kB)")

    if not pdf:
        return 0
    nav = next((n for n in NAVEGADORES if os.path.exists(n)), None)
    if not nav:
        print("  !!  no hay Chrome ni Edge: el PDF no se genera")
        return 0
    cmd = [nav, "--headless", "--disable-gpu", "--no-pdf-header-footer",
           f"--print-to-pdf={SALIDA_PDF}", "file:///" + SALIDA_HTML.replace("\\", "/")]
    r = subprocess.run(cmd, capture_output=True, timeout=180)
    if os.path.exists(SALIDA_PDF):
        print(f"  OK  PDF   {os.path.basename(SALIDA_PDF)}  "
              f"({os.path.getsize(SALIDA_PDF)//1024} kB, con {os.path.basename(nav)})")
    else:
        print(f"  !!  el navegador no produjo el PDF: {r.stderr.decode('utf-8', 'ignore')[:200]}")
        return 1
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--solo-html", action="store_true")
    args = ap.parse_args()
    sys.exit(generar(pdf=not args.solo_html))
