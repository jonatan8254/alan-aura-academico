# -*- coding: utf-8 -*-
"""Comprueba las reglas de estilo del informe academico `INF-01`.

POR QUE EXISTE
--------------
El informe lo firma el equipo humano y tiene que leerse como suyo. Hay marcadores
de escritura automatica que son MEDIBLES, y una conviccion que este proyecto pago
cara durante el `CDR-01`: una convencion sin comprobador es una intencion.

QUE NO HACE, Y SE DECLARA
-------------------------
No juzga si el texto se lee natural. Eso es una pasada humana. Este script mide
siete marcadores mecanicos; el verde significa «no se detectan los tics
conocidos», no «esta bien escrito».

EL TECNICISMO NO ES UN TIC
--------------------------
La regla del tricolon se aplica SOLO a enumeraciones retoricas. Una serie como
«15 actores, 38 bordes, 150 controladores y 59 entidades» es un DATO, y marcarla
seria el falso positivo que `CVI-01` levanto contra el barrido de desenlaces.
Se eximen las series que contienen cifras, identificadores o codigo.
"""
import argparse
import io
import os
import re
import statistics
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
# Ruta RELATIVA: el repositorio debe poder clonarse en cualquier sitio
# (`AGENTS.md §0`; `CVI-02` se levanto por violarlo).
INFORME_POR_DEFECTO = os.path.normpath(
    os.path.join(AQUI, "..", "INF-01_informe_academico.md"))

# --- umbrales ---------------------------------------------------------------
RAYAS_POR_PARRAFO = 1 / 3.0      # <= 1 raya cada 3 parrafos
TRICOLON_POR_SECCION = 1         # <= 1 tricolon retorico por seccion
NEGRITAS_POR_PARRAFO = 1         # > 1 en un parrafo de prosa es enfasis retorico
CV_LONGITUD_MINIMO = 0.35        # coeficiente de variacion de longitud de parrafo
RATIO_VINETAS_MAXIMO = 0.40      # vinetas / (vinetas + parrafos de prosa)

RELLENO = [
    r"no solo\b[^.]{0,80}\bsino",
    r"\bes importante (destacar|mencionar|señalar|resaltar)\b",
    r"\bcabe (mencionar|destacar|señalar|resaltar)\b",
    r"\ben resumen\b",
    r"\bresulta fundamental\b",
    r"\bjuega un papel\b",
    r"\bde vital importancia\b",
    r"\bvale la pena (mencionar|destacar)\b",
    r"\bsin lugar a dudas\b",
    r"\bpor otro lado,\s*por otro lado\b",
]
APERTURA_META = re.compile(
    r"^(En (esta|la presente) (secci[oó]n|apartado|cap[ií]tulo)|"
    r"A continuaci[oó]n se (presenta|describe|detalla|expone)|"
    r"El (presente|siguiente) apartado)\b", re.I)

# Serie de tres o mas elementos separados por comas y cerrada con «y»/«o».
TRICOLON = re.compile(r"(?:[^,;.()]{3,60},\s+){2,}[^,;.()]{3,60}\s+[yeo]\s+[^,;.()]{3,60}")
# Lo que convierte una serie en DATO y no en figura de estilo.
TECNICO = re.compile(r"\d|`[^`]+`|\b[A-Z]{2,4}-\d{2}\b|«[^»]*»")
# Minimo de palabras por elemento para que una serie sea una serie. Sin esto,
# las comas de un inciso —«se encuentra, por diseño, en una etapa…»— se leen
# como enumeracion y producen un falso positivo.
PALABRAS_MINIMAS_POR_ELEMENTO = 3


def es_serie_retorica(texto):
    """Una serie de verdad: >=3 elementos, todos con cuerpo, y ninguno tecnico."""
    if TECNICO.search(texto):
        return False
    partes = [p.strip() for p in re.split(r",|\s+[yeo]\s+", texto) if p.strip()]
    if len(partes) < 3:
        return False
    return all(len(p.split()) >= PALABRAS_MINIMAS_POR_ELEMENTO for p in partes)

TABLA = re.compile(r"^\s*\|")
ENCABEZADO = re.compile(r"^\s*#")
VINETA = re.compile(r"^\s*(?:[-*+]|\d+\.)\s+\S")
CITA = re.compile(r"^\s*>")
NEGRITA = re.compile(r"\*\*[^*]+\*\*")
# La ficha del artefacto y las lineas de etiqueta-valor son convencion de la
# casa, no enfasis retorico: `**ID:** … **Version:** …`. Marcarlas seria el
# falso positivo de `CVI-01` repetido en otro instrumento.
LINEA_DE_FICHA = re.compile(r"^\s*\*\*[A-ZÁÉÍÓÚÑ][^*]{1,28}:\*\*\s")


def secciones(lineas):
    """Trocea el documento en (titulo, [lineas]) por encabezado de nivel 2."""
    actual, bloques = "portada", []
    buf = []
    for l in lineas:
        if re.match(r"^##\s+\S", l):
            bloques.append((actual, buf))
            actual, buf = l.strip("# ").strip(), []
        else:
            buf.append(l)
    bloques.append((actual, buf))
    return bloques


def parrafos_de_prosa(lineas):
    """Parrafos de cuerpo: sin tablas, encabezados, vinetas ni citas."""
    parr, buf = [], []
    for l in lineas:
        if not l.strip():
            if buf:
                parr.append(" ".join(buf))
                buf = []
            continue
        if (TABLA.match(l) or ENCABEZADO.match(l) or VINETA.match(l)
                or CITA.match(l) or LINEA_DE_FICHA.match(l)):
            if buf:
                parr.append(" ".join(buf))
                buf = []
            continue
        buf.append(l.strip())
    if buf:
        parr.append(" ".join(buf))
    return [p for p in parr if len(p.split()) >= 8]


def analizar(ruta):
    lineas = io.open(ruta, encoding="utf-8").read().splitlines()
    fallos = []
    medidas = {}

    bloques = secciones(lineas)
    prosa_total = []
    for titulo, ls in bloques:
        prosa_total += parrafos_de_prosa(ls)

    # --- 1. densidad de rayas ---
    rayas = sum(p.count("—") for p in prosa_total)
    lim = max(1, int(len(prosa_total) * RAYAS_POR_PARRAFO))
    medidas["rayas"] = f"{rayas} en {len(prosa_total)} parrafos (limite {lim})"
    if rayas > lim:
        fallos.append(f"RAYAS: {rayas} en {len(prosa_total)} parrafos; el limite es {lim}")

    # --- 2. tricolon RETORICO por seccion ---
    tri_total = 0
    for titulo, ls in bloques:
        n = 0
        for p in parrafos_de_prosa(ls):
            for m in TRICOLON.finditer(p):
                if es_serie_retorica(m.group(0)):
                    n += 1
        tri_total += n
        if n > TRICOLON_POR_SECCION:
            fallos.append(f"TRICOLON: «{titulo[:40]}» tiene {n} series retoricas; el limite es {TRICOLON_POR_SECCION}")
    medidas["tricolon retorico"] = f"{tri_total} en todo el documento"

    # --- 3. formulas de relleno ---
    enc = []
    for i, l in enumerate(lineas, 1):
        for pat in RELLENO:
            if re.search(pat, l, re.I):
                enc.append((i, re.search(pat, l, re.I).group(0)))
    medidas["relleno"] = f"{len(enc)} apariciones"
    for i, s in enc:
        fallos.append(f"RELLENO: linea {i}, «{s}»")

    # --- 4. aperturas metatextuales ---
    # Se revisan TODOS los parrafos, no solo el primero de la seccion: una frase
    # que anuncia lo que se va a decir es relleno este donde este.
    n_meta = 0
    for titulo, ls in bloques:
        for p in parrafos_de_prosa(ls):
            if APERTURA_META.match(p):
                n_meta += 1
                fallos.append(f"APERTURA META: «{titulo[:34]}», «{p[:52]}…»")
    medidas["aperturas metatextuales"] = f"{n_meta}"

    # --- 5. negrita retorica ---
    n_neg = 0
    for p in prosa_total:
        k = len(NEGRITA.findall(p))
        if k > NEGRITAS_POR_PARRAFO:
            n_neg += 1
            fallos.append(f"NEGRITA: un parrafo con {k} tramos en negrita: «{p[:56]}…»")
    medidas["parrafos con exceso de negrita"] = f"{n_neg}"

    # --- 6. varianza de longitud de parrafo ---
    largos = [len(p.split()) for p in prosa_total]
    if len(largos) >= 5:
        media = statistics.mean(largos)
        cv = statistics.pstdev(largos) / media if media else 0
        medidas["variacion de longitud"] = f"CV = {cv:.2f} (minimo {CV_LONGITUD_MINIMO})"
        if cv < CV_LONGITUD_MINIMO:
            fallos.append(f"UNIFORMIDAD: los parrafos son demasiado parejos (CV {cv:.2f} < {CV_LONGITUD_MINIMO})")

    # --- 7. proporcion vinetas / prosa ---
    n_vin = sum(1 for l in lineas if VINETA.match(l))
    ratio = n_vin / max(1, n_vin + len(prosa_total))
    medidas["vinetas frente a prosa"] = f"{ratio:.2f} (maximo {RATIO_VINETAS_MAXIMO})"
    if ratio > RATIO_VINETAS_MAXIMO:
        fallos.append(f"VINETAS: proporcion {ratio:.2f}; el cuerpo debe ser prosa (max {RATIO_VINETAS_MAXIMO})")

    return fallos, medidas


def informe(ruta):
    fallos, medidas = analizar(ruta)
    print("=" * 74)
    print(f"ESTILO — {os.path.basename(ruta)}")
    print("=" * 74)
    for k, v in medidas.items():
        print(f"  {k:34} {v}")
    print()
    if fallos:
        for f in fallos:
            print(f"  !! {f}")
        print(f"\nRESULTADO: {len(fallos)} incumplimiento(s).")
    else:
        print("RESULTADO: sin incumplimientos en las siete medidas.")
    print("\nNota: el verde significa «no se detectan los tics conocidos», no")
    print("«esta bien escrito». Lo segundo se comprueba leyendolo.")
    return len(fallos)


def autoprueba():
    """Fixtures de las DOS clases: lo que debe cazar y lo que NO debe marcar."""
    base = os.path.join(AQUI, "fixtures_estilo")
    if not os.path.isdir(base):
        print("!! no hay fixtures_estilo/")
        return 1
    fallos = 0
    for arch in sorted(f for f in os.listdir(base) if f.endswith(".md")):
        esperado = arch[:-3].rsplit("__", 1)[-1]      # `caza` o `limpio`
        f, _ = analizar(os.path.join(base, arch))
        obtenido = "caza" if f else "limpio"
        ok = obtenido == esperado
        fallos += 0 if ok else 1
        detalle = f" ({f[0][:44]})" if f else ""
        print(f"  {'OK ' if ok else '!! '} {arch[:-3]:46} espera {esperado:7} obtiene {obtenido}{detalle}")
    print(f"\nAUTOPRUEBA: {'sin fallos' if not fallos else str(fallos) + ' fallo(s)'}")
    return fallos


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--informe", default=INFORME_POR_DEFECTO)
    ap.add_argument("--autoprueba", action="store_true")
    args = ap.parse_args()
    sys.exit(1 if (autoprueba() if args.autoprueba else informe(args.informe)) else 0)
