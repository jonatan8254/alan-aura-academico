# -*- coding: utf-8 -*-
"""Comprueba la convencion de desenlaces `SD-44` (R1 y R2) sobre los `DS-XX`.

R1 — el sufijo de exito vive DENTRO del operando de exito de su `alt`. Un
     operando de exito vacio con la continuacion FUERA del fragmento es el
     defecto de `opt` con otro nombre.
R2 — un `break` dentro de un `loop` sale del bucle y sigue ejecutando, asi que
     solo vale si lo que sigue al bucle es LIMPIEZA COMUN: ninguna accion
     originada por un ACTOR puede quedar sin acotar por un `opt`.

`SD-45` (`CVI-01`, `CVI-02` del `CDR-01 v1.7`) reescribe este comprobador. La
cuarta verificacion independiente demostro con catorce sabotajes que la version
de `SD-44` DECORABA la convencion mas de lo que la sostenia:
  - cualquier fragmento ocultaba una violacion de R2, no solo `opt`;
  - las flechas `->>`, `-\\` y `\\-` escapaban al regex de mensaje;
  - una nota cuyo texto contuviera una linea `end` descuadraba el recorrido,
    porque un `while` movia el indice de un `for` que volvia a recorrerlo;
  - `rnote`/`hnote` no se reconocian como nota;
  - los mensajes de un fragmento anidado no se atribuian al operando que lo
    contiene, lo que producia falsos positivos con `group`.
Los sabotajes viven ahora como regresion versionada en `fixtures/` y los
ejercita `--autoprueba`, para que el verde de este script signifique algo.
"""
import argparse
import io
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
# Ruta RELATIVA al propio script: el repositorio debe poder clonarse en
# cualquier ubicacion (`AGENTS.md §0`, check de independencia). `CVI-02`.
PUML_POR_DEFECTO = os.path.normpath(os.path.join(AQUI, "..", "puml"))

APERTURA = re.compile(r"^\s*(alt|loop|opt|par|critical|group|break)\b(.*)$")
ELSE = re.compile(r"^\s*else\b(.*)$")
FIN = re.compile(r"^\s*end\s*$")
NOTA_FIN = re.compile(r"^\s*end\s*(?:note|legend)\s*$", re.I)
NOTA_LINEA = re.compile(r"^\s*[rh]?note\s+[^:]*:", re.I)
NOTA_INI = re.compile(r"^\s*(?:[rh]?note\b|legend\b)", re.I)

# Toda flecha de mensaje de PlantUML, no solo `->` y `-->`. `CVI-01`.
FLECHA = (r"(?:<-{1,3}|-{1,3}>{1,2}|-{1,3}\\{1,2}|\\{1,2}-{1,3}"
          r"|-{1,3}/|/-{1,3}|<<-{1,3}|-{1,3}>>|-{1,3}x|x-{1,3})")
MENSAJE = re.compile(r"^\s*(?:\[|\])?\s*[\w\"'.]+\s*" + FLECHA + r"[ox]?\s*(?:\[|\])?\s*[\w\"'.]*\s*:")
ACTOR = re.compile(r"^\s*ACT_\w+\s*" + FLECHA)


def despiezar(lineas):
    """Lista de (nº, linea) con las notas neutralizadas.

    En UNA pasada y con estado propio, no moviendo el indice de un bucle `for`
    — ese era el defecto que dejaba que una nota con la palabra `end` en su
    texto se tomara por cierre de fragmento. `CVI-01`.
    """
    util = []
    en_nota = False
    for i, l in enumerate(lineas, 1):
        if en_nota:
            if NOTA_FIN.match(l):
                en_nota = False
            util.append((i, None))
            continue
        if NOTA_LINEA.match(l):             # nota de una sola linea
            util.append((i, None))
            continue
        if NOTA_INI.match(l):
            en_nota = True
            util.append((i, None))
            continue
        util.append((i, l))
    return util


class Marco(object):
    __slots__ = ("tipo", "linea", "etiqueta", "operandos")

    def __init__(self, tipo, linea, etiqueta):
        self.tipo = tipo
        self.linea = linea
        self.etiqueta = etiqueta
        self.operandos = [[etiqueta, 0]]    # [etiqueta, nº de mensajes]

    def marcar(self, n=1):
        self.operandos[-1][1] += n


def cierre_de(util, linea_apertura):
    """Indice en `util` del `end` que cierra el fragmento abierto en esa linea."""
    prof = 0
    arrancado = False
    for idx, (num, l) in enumerate(util):
        if l is None or num < linea_apertura:
            continue
        if APERTURA.match(l):
            prof += 1
            arrancado = True
        elif FIN.match(l) and arrancado:
            prof -= 1
            if prof == 0:
                return idx
    return None


def mensajes_tras(util, idx_fin):
    """Mensajes que siguen al fragmento cerrado en `idx_fin`, en su mismo ambito."""
    fuera = []
    prof = 0
    for num, l in util[idx_fin + 1:]:
        if l is None:
            continue
        if APERTURA.match(l):
            prof += 1
        elif FIN.match(l):
            if prof == 0:
                break
            prof -= 1
        elif prof == 0 and MENSAJE.match(l):
            fuera.append(num)
    return fuera


def acciones_de_actor_sin_acotar(util, idx_fin):
    """Acciones del ACTOR tras el bucle que NO estan acotadas por un `opt`.

    Se DESCIENDE a `alt`, `critical`, `group`, `par` y `loop`: ninguno acota la
    accion en el sentido que R2 exige. Solo `opt` lo hace. `CVI-01`.
    """
    sueltos = []
    pila = []
    for num, l in util[idx_fin + 1:]:
        if l is None:
            continue
        m = APERTURA.match(l)
        if m:
            pila.append(m.group(1))
            continue
        if FIN.match(l):
            if not pila:
                break
            pila.pop()
            continue
        if ACTOR.match(l) and "opt" not in pila:
            sueltos.append(num)
    return sueltos


def analizar(ruta):
    lineas = io.open(ruta, encoding="utf-8").read().splitlines()
    util = despiezar(lineas)

    pila = []
    v1, v2 = [], []
    n_alt = n_loop = n_break = n_opt = 0
    breaks = []

    for idx, (num, l) in enumerate(util):
        if l is None:
            continue

        m = APERTURA.match(l)
        if m:
            tipo, etiq = m.group(1), m.group(2).strip()
            n_alt += tipo == "alt"
            n_loop += tipo == "loop"
            n_opt += tipo == "opt"
            if tipo == "break":
                n_break += 1
                bucles = [f.linea for f in pila if f.tipo == "loop"]
                if bucles:
                    breaks.append((num, etiq, bucles[-1]))
            pila.append(Marco(tipo, num, etiq))
            continue

        m = ELSE.match(l)
        if m and pila:
            pila[-1].operandos.append([m.group(1).strip(), 0])
            continue

        if FIN.match(l):
            if not pila:
                continue
            marco = pila.pop()
            # Un fragmento que contuvo mensajes CUENTA como contenido del
            # operando que lo envuelve. Sin esto, un `group` anidado dejaba al
            # operando exterior como «vacio»: falso positivo. `CVI-01`.
            total = sum(n for _, n in marco.operandos)
            if pila and total:
                pila[-1].marcar(total)

            if marco.tipo == "alt" and len(marco.operandos) >= 2:
                et_exito, n_exito = marco.operandos[-1]
                if n_exito == 0:
                    despues = mensajes_tras(util, idx)
                    if despues:
                        v1.append((marco.linea, marco.etiqueta, et_exito, len(despues)))
            continue

        if MENSAJE.match(l) and pila:
            pila[-1].marcar()

    for num, etiq, ln_loop in breaks:
        idx_fin = cierre_de(util, ln_loop)
        if idx_fin is None:
            continue
        sueltos = acciones_de_actor_sin_acotar(util, idx_fin)
        if sueltos:
            v2.append((num, etiq, sueltos))

    return v1, v2, (n_alt, n_loop, n_break, n_opt)


def informe(directorio):
    v1_t, v2_t, resumen = [], [], []
    for arch in sorted(f for f in os.listdir(directorio) if f.endswith(".puml")):
        nombre = arch[:5]
        v1, v2, cuenta = analizar(os.path.join(directorio, arch))
        v1_t += [(nombre,) + x for x in v1]
        v2_t += [(nombre,) + x for x in v2]
        resumen.append((nombre,) + cuenta)

    print("=" * 78)
    print("REGLA 1 — alt con operando de exito VACIO y continuacion fuera del fragmento")
    print("=" * 78)
    for n, ln, etiq, et_exito, cuantos in v1_t:
        print(f"  {n} :{ln:<4} alt {etiq[:42]:<42} | exito «{et_exito[:24]}» vacio, {cuantos} msg despues")
    print(f"  TOTAL: {len(v1_t)}")

    print()
    print("=" * 78)
    print("REGLA 2 — break dentro de un loop con accion del ACTOR sin acotar por `opt`")
    print("=" * 78)
    for n, ln, etiq, sueltos in v2_t:
        print(f"  {n} :{ln:<4} break {etiq[:44]:<44} | alcanzaria las lineas {sueltos}")
    print(f"  TOTAL: {len(v2_t)}")

    print()
    print("Inventario por diagrama (alt / loop / break / opt):")
    t = [0, 0, 0, 0]
    for n, a, lo, b, o in resumen:
        print(f"  {n}: alt={a:<3} loop={lo:<3} break={b:<3} opt={o}")
        for i, v in enumerate((a, lo, b, o)):
            t[i] += v
    print(f"  TOTALES: alt={t[0]}  loop={t[1]}  break={t[2]}  opt={t[3]}")
    return len(v1_t) + len(v2_t)


def autoprueba():
    """Ejercita los sabotajes de la cuarta verificacion. `CVI-01`."""
    base = os.path.join(AQUI, "fixtures")
    if not os.path.isdir(base):
        print("!! no hay fixtures/ — la autoprueba no puede correr")
        return 1
    fallos = 0
    for arch in sorted(f for f in os.listdir(base) if f.endswith(".puml")):
        # nombre: <caso>__<esperado>.puml, con esperado en {limpio, r1-N, r2-N}
        esperado = arch[:-5].rsplit("__", 1)[-1]
        v1, v2, _ = analizar(os.path.join(base, arch))
        if v1 and v2:
            obtenido = f"r1-{len(v1)}+r2-{len(v2)}"
        elif v1:
            obtenido = f"r1-{len(v1)}"
        elif v2:
            obtenido = f"r2-{len(v2)}"
        else:
            obtenido = "limpio"
        ok = obtenido == esperado
        fallos += 0 if ok else 1
        print(f"  {'OK ' if ok else '!! '} {arch[:-5]:56} espera {esperado:9} obtiene {obtenido}")
    print(f"\nAUTOPRUEBA: {'sin fallos' if not fallos else str(fallos) + ' fallo(s)'}")
    return fallos


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--puml", default=PUML_POR_DEFECTO,
                    help="directorio de los .puml (por defecto, ../puml junto a este script)")
    ap.add_argument("--autoprueba", action="store_true",
                    help="ejercita los sabotajes versionados de fixtures/")
    args = ap.parse_args()
    if args.autoprueba:
        sys.exit(1 if autoprueba() else 0)
    sys.exit(1 if informe(args.puml) else 0)
