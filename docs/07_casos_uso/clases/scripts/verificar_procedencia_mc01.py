#!/usr/bin/env python3
"""Verificacion EXACTA de procedencia de MC-01 contra los 14 DS-XX y MD-01.

Por que existe, y por que no basta el validador de la skill
------------------------------------------------------------
`validate_design_class_puml.py` comprueba la procedencia de las operaciones por
**bolsa de palabras**: parte el nombre en palabras y le basta con que alguna
coincida con el vocabulario dirigido a esa clase. Con esa regla,
`mostrarSelectorDePersonaje()` valida contra `mostrarRespuestaDelPersonaje()`
—comparten {mostrar, personaje}— aunque el mensaje real fuera a otra linea de
vida. Es una heuristica deliberada, y su propio codigo la declara.

Este script hace la comprobacion **exacta**: nombre de operacion identico y
dirigido a la misma linea de vida.

Las tablas de reconciliacion de abajo son DECLARADAS a proposito. MC-01 resuelve
dos inconsistencias que sus insumos declaran como excepciones —`E-3` y `E-4` de
`DS-00`— y este script comprueba que las resuelve **como esta escrito aqui**, no
de cualquier manera. Esconderlas en el codigo seria peor que declararlas.

Una tercera, las etiquetas divergentes de P-08 y P-10, **ya no hace falta
reconciliarla**: en SD-32 se corrigio en su raiz, que estaba en `DR-11` y
`DR-13`, no en los diagramas de secuencia. La Tabla 1 quedo vacia y el conteo
que la vigilaba paso de 5 mensajes a 0.

Uso:
    python verificar_procedencia_mc01.py

Codigos de salida:  0 sin discrepancias  ·  1 hay discrepancias
"""

from __future__ import annotations

import glob
import os
import re
import sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
MC = os.path.join(RAIZ, "docs/07_casos_uso/clases/MC-01_modelo_clases_diseno.puml")
MD = os.path.join(RAIZ, "docs/06_dominio/MD-01_modelo_dominio.puml")
DS = os.path.join(RAIZ, "docs/07_casos_uso/secuencia/puml/DS-*.puml")

# --------------------------------------------------------------------------
# TABLA 1 — VACIA A PROPOSITO, y esa es la noticia.
#
# Hasta SD-32 esta tabla unificaba dos pantallas que cambiaban de etiqueta entre
# diagramas (P-08 y P-10, hallazgo H-D). Al buscar la causa resulto estar en
# `DR-11` y `DR-13`: los diagramas de secuencia copiaban fielmente su robustez,
# que es justo lo que la capa 2 del metodo exige. **Corregida la raiz**, la
# unificacion dejo de hacer falta — se comprobo dejandola puesta y midiendo:
# paso de 5 mensajes a 0. Se conserva el diccionario, vacio, para que el
# mecanismo siga disponible si vuelve a aparecer una divergencia.
# --------------------------------------------------------------------------
UNIFICACION_ETIQUETA = {}

# --------------------------------------------------------------------------
# TABLA 2 — Mensajes dirigidos a un ACTOR. Un actor no es clase de diseno, asi
# que la operacion no tiene receptor posible en UML. Se reasigna a la frontera
# EMISORA, que es quien realiza la conducta. Hallazgo H-C.
# --------------------------------------------------------------------------
REASIGNAR_DESDE_ACTOR = True

# --------------------------------------------------------------------------
# TABLA 3 — Etiqueta compartida entre un actor y una entidad. Hallazgo H-N.
# En DS-01 y DS-02 conviven `actor "Visitante"` y `entity "Visitante"`: misma
# etiqueta, distinto alias. Se desambigua por el PREFIJO del alias.
# --------------------------------------------------------------------------
DESAMBIGUAR_POR_ALIAS = {"Visitante"}

DECL_SEC = re.compile(
    r'^\s*(?P<tipo>actor|boundary|control|entity|participant|database|collections|queue)\s+'
    r'(?:"(?P<label>[^"]+)"|(?P<bare>[\w]+))(?:\s+as\s+(?P<alias>[\w]+))?',
    re.IGNORECASE | re.MULTILINE)
MSG = re.compile(
    r'^\s*(?P<emisor>"[^"]+"|[\w]+)\s*(?P<flecha>--?>>?|<<?--?)\s*'
    r'(?P<receptor>"[^"]+"|[\w]+)'
    r'(?:\s*(?:\+\+|--|\*\*|!!))?\s*(?::\s*(?P<etiqueta>.*))?$', re.MULTILINE)
OP_LABEL = re.compile(r'^([A-Za-z_][\w]*)\s*\([^)]*\)\s*$')
CLASE = re.compile(
    r'^\s*(?:abstract\s+)?(?P<kind>class|interface|enum)\s+'
    r'(?:"(?P<q>[^"]+)"|(?P<n>[\w]+))'
    r'(?:\s+as\s+(?P<alias>[\w]+))?(?P<est>(?:\s*<<[^>]+>>)*)', re.MULTILINE)
OPER = re.compile(r'^\s*[+\-#~]?\s*(?P<nombre>[A-Za-zÁÉÍÓÚÑáéíóúñ_][\w]*)\s*\([^)]*\)')


def cuerpo(text: str, desde: int) -> str:
    resto = text[desde:]
    if not resto.lstrip().startswith("{"):
        return ""
    ini = desde + resto.index("{")
    prof, i = 0, ini
    while i < len(text):
        if text[i] == "{":
            prof += 1
        elif text[i] == "}":
            prof -= 1
            if prof == 0:
                return text[ini + 1:i]
        i += 1
    return text[ini + 1:]


def canon(etiqueta: str) -> str:
    return UNIFICACION_ETIQUETA.get(etiqueta, (etiqueta, ""))[0]


def leer_ds():
    """Devuelve (por_receptor, reasignadas, unificadas, ambiguas)."""
    por_receptor, reasignadas, unificadas, ambiguas = {}, {}, [], []
    for path in sorted(glob.glob(DS)):
        text = open(path, encoding="utf-8").read()
        base = os.path.basename(path).split("_")[0]
        alias, tipo_de_alias = {}, {}
        for m in DECL_SEC.finditer(text):
            et = m.group("label") or m.group("bare") or ""
            a = m.group("alias") or m.group("bare") or et
            if not a:
                continue
            alias[a] = et
            tipo_de_alias[a] = m.group("tipo").lower()

        for m in MSG.finditer(text):
            et_msg = (m.group("etiqueta") or "").strip()
            mo = OP_LABEL.match(et_msg)
            if not mo:
                continue
            op = mo.group(1)
            emisor_a, receptor_a = m.group("emisor").strip('"'), m.group("receptor").strip('"')
            if (m.group("flecha") or "").startswith("<"):
                emisor_a, receptor_a = receptor_a, emisor_a

            dest = alias.get(receptor_a, receptor_a)
            emisor = canon(alias.get(emisor_a, emisor_a))
            es_actor = tipo_de_alias.get(receptor_a) == "actor"

            # Tabla 3: etiqueta compartida actor/entidad -> manda el alias.
            if dest in DESAMBIGUAR_POR_ALIAS:
                ambiguas.append((base, dest, receptor_a, op))
                es_actor = receptor_a.startswith("ACT_")

            if es_actor and REASIGNAR_DESDE_ACTOR:
                reasignadas.setdefault(op, set()).add((base, emisor))
                por_receptor.setdefault(emisor, {}).setdefault(op, set()).add(base)
                continue

            # Tabla 1: etiquetas divergentes de una misma pantalla.
            if dest in UNIFICACION_ETIQUETA:
                unificadas.append((base, dest, canon(dest), op))
            por_receptor.setdefault(canon(dest), {}).setdefault(op, set()).add(base)

    return por_receptor, reasignadas, unificadas, ambiguas


def leer_mc():
    text = open(MC, encoding="utf-8").read()
    clases, estereotipos = {}, {}
    for m in CLASE.finditer(text):
        if m.group("kind").lower() == "enum":
            continue
        nombre = m.group("q") or m.group("n") or ""
        ops = set()
        for ln in cuerpo(text, m.end()).split("\n"):
            ln = ln.strip()
            if not ln or ln.startswith("'") or ln.startswith(".."):
                continue
            mo = OPER.match(ln)
            if mo:
                ops.add(mo.group("nombre"))
        clases[nombre] = ops
        estereotipos[nombre] = m.group("est") or ""
    return clases, estereotipos


def main() -> int:
    ds, reasignadas, unificadas, ambiguas = leer_ds()
    mc, est = leer_mc()
    dominio = set(re.findall(r'^\s*class\s+(\w+)', open(MD, encoding="utf-8").read(),
                             re.MULTILINE))
    fallos = 0

    print("Verificacion EXACTA de procedencia — MC-01")
    print("=" * 66)

    print("\n[1] Operaciones del modelo sin mensaje dirigido a esa misma clase")
    huerfanas = [(c, o) for c, ops in sorted(mc.items())
                 for o in sorted(ops) if o not in ds.get(c, {})]
    if huerfanas:
        fallos += len(huerfanas)
        for c, o in huerfanas:
            otras = sorted(k for k, v in ds.items() if o in v)
            print(f"    x {c}.{o}()  — en los DS va a: {otras or 'NINGUNA'}")
    else:
        print("    OK  ninguna. Emparejamiento exacto por linea de vida, no por bolsa de palabras")

    print("\n[2] Operaciones de los DS que NO aterrizaron en el modelo")
    sin_reflejar = [(r, o, sorted(d)) for r, ops in sorted(ds.items())
                    for o, d in sorted(ops.items()) if o not in mc.get(r, set())]
    if sin_reflejar:
        fallos += len(sin_reflejar)
        for r, o, d in sin_reflejar:
            print(f"    x {r}.{o}()  [{','.join(d)}]")
    else:
        print("    OK  ninguna. Criterio de entrada del CDR satisfecho de forma exacta")

    print("\n[3] Cobertura del modelo de dominio")
    faltan = sorted(dominio - set(mc))
    if faltan:
        fallos += len(faltan)
        for c in faltan:
            print(f"    x falta la clase de dominio: {c}")
    else:
        print(f"    OK  las {len(dominio)} clases de MD-01 estan, con nombre identico")

    print("\n[4] Clases fuera del dominio sin declarar <<solucion>>")
    sin_marca = [c for c in mc if c not in dominio and "solucion" not in est.get(c, "")]
    if sin_marca:
        fallos += len(sin_marca)
        for c in sin_marca:
            print(f"    x {c}")
    else:
        n = sum(1 for c in mc if "solucion" in est.get(c, ""))
        print(f"    OK  las {n} clases fuera de MD-01 llevan <<solucion>>")

    print("\n[5] Reconciliaciones aplicadas — decisiones, no defectos de MC-01")
    print(f"    · Etiquetas divergentes unificadas por pantalla (H-D): {len(unificadas)} mensajes")
    for et_orig, (et_canon, motivo) in sorted(UNIFICACION_ETIQUETA.items()):
        n = sum(1 for _b, o, _c, _op in unificadas if o == et_orig)
        print(f"        «{et_orig}» -> «{et_canon}»  ({n} msg) — {motivo}")
    print(f"    · Mensajes dirigidos a un ACTOR, reasignados al emisor (H-C): "
          f"{len(reasignadas)} operaciones")
    for op, quien in sorted(reasignadas.items()):
        print(f"        {op}()  ->  {'; '.join(sorted({e for _d, e in quien}))}")
    print(f"    · Etiqueta compartida actor/entidad, desambiguada por alias (H-N): "
          f"{len(ambiguas)} mensajes sobre «Visitante»")

    print("\n" + "=" * 66)
    print(f"Clases en MC-01: {len(mc)} ({sum(1 for c in mc if 'solucion' in est.get(c, ''))} "
          f"de solucion) | Operaciones: {sum(len(v) for v in mc.values())}")
    print(f"RESULTADO: {'SIN DISCREPANCIAS' if not fallos else str(fallos) + ' DISCREPANCIA(S)'}")
    return 1 if fallos else 0


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    raise SystemExit(main())
