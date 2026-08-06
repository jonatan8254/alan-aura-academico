# -*- coding: utf-8 -*-
"""Barrido de las cuatro reglas de SD-44 sobre los 14 DS. Inventario, no pista."""
import io
import glob
import os
import re

PUML = r"C:/GitHub/alan-aura-academico/docs/07_casos_uso/secuencia/puml"

APERTURA = re.compile(r"^\s*(alt|loop|opt|par|critical|group|break)\b(.*)$")
ELSE = re.compile(r"^\s*else\b(.*)$")
FIN = re.compile(r"^\s*end\s*$")
NOTA_INI = re.compile(r"^\s*note\b")
NOTA_FIN = re.compile(r"^\s*end\s*note\s*$")
MENSAJE = re.compile(r"^\s*\S+\s*(->|-->|<-|<--)\s*\S+\s*:")

ACTOR = re.compile(r"^\s*ACT_\w+\s*(->|-->)")


def mensajes_del_actor_tras_el_loop(lineas, ln_loop):
    """Mensajes originados por un ACTOR despues del loop, sin guardar por
    ningun fragmento. Son los que un `break` interno alcanzaria por error."""
    prof = 0
    i = ln_loop - 1
    # localizar el `end` que cierra ese loop
    for j in range(ln_loop - 1, len(lineas)):
        l = lineas[j]
        if NOTA_INI.match(l):
            while j < len(lineas) and not NOTA_FIN.match(lineas[j]):
                j += 1
            continue
        if APERTURA.match(l):
            prof += 1
        elif FIN.match(l):
            prof -= 1
            if prof == 0:
                i = j + 1
                break
    sueltos, prof, en_nota = [], 0, False
    for j in range(i, len(lineas)):
        l = lineas[j]
        if NOTA_FIN.match(l):
            en_nota = False
            continue
        if en_nota:
            continue
        if NOTA_INI.match(l):
            en_nota = True
            continue
        if APERTURA.match(l):
            prof += 1
        elif FIN.match(l):
            if prof == 0:
                break
            prof -= 1
        elif prof == 0 and ACTOR.match(l):
            sueltos.append(j + 1)
    return sueltos


viol1 = []   # operando de exito vacio con continuacion fuera del alt
viol4 = []   # break dentro de loop con accion del actor sin guardar despues
resumen = []

for ruta in sorted(glob.glob(os.path.join(PUML, "*.puml"))):
    nombre = os.path.basename(ruta)[:5]
    lineas = io.open(ruta, encoding="utf-8").read().splitlines()

    pila = []          # [(tipo, linea_apertura, etiqueta)]
    operandos = {}     # id(apertura) -> lista de operandos [(etiqueta, [lineas de mensaje])]
    en_nota = False
    n_alt = n_loop = n_break = 0

    for i, l in enumerate(lineas, 1):
        if NOTA_FIN.match(l):
            en_nota = False
            continue
        if en_nota:
            continue
        if NOTA_INI.match(l):
            en_nota = True
            continue

        m = APERTURA.match(l)
        if m:
            tipo, etiq = m.group(1), m.group(2).strip()
            if tipo == "alt":
                n_alt += 1
            if tipo == "loop":
                n_loop += 1
            if tipo == "break":
                n_break += 1
                # R2: un break dentro de un loop sale del bucle y sigue ejecutando.
                # Solo es valido si lo que sigue al bucle es limpieza comun: ninguna
                # accion normal originada por el ACTOR puede quedar sin guardar.
                marco_loop = None
                for t, ln, et in pila:
                    if t == "loop":
                        marco_loop = ln
                if marco_loop is not None:
                    sueltos = mensajes_del_actor_tras_el_loop(lineas, marco_loop)
                    if sueltos:
                        viol4.append((nombre, i, etiq, sueltos))
            pila.append([tipo, i, etiq])
            operandos[id(pila[-1])] = [[etiq, []]]
            continue

        m = ELSE.match(l)
        if m and pila:
            operandos[id(pila[-1])].append([m.group(1).strip(), []])
            continue

        if FIN.match(l):
            if not pila:
                continue
            marco = pila.pop()
            tipo, ini, etiq = marco
            ops = operandos.pop(id(marco), [])
            if tipo == "alt" and len(ops) >= 2:
                ultimo_et, ultimo_msgs = ops[-1]
                if not ultimo_msgs:
                    # ¿hay mensajes despues del alt, en el mismo ambito?
                    despues = 0
                    prof = 0
                    for l2 in lineas[i:]:
                        if NOTA_INI.match(l2):
                            prof -= 1000
                        if NOTA_FIN.match(l2):
                            prof += 1000
                        if prof <= -1000:
                            continue
                        if APERTURA.match(l2):
                            prof += 1
                        elif FIN.match(l2):
                            if prof == 0:
                                break
                            prof -= 1
                        elif prof == 0 and MENSAJE.match(l2):
                            despues += 1
                    if despues:
                        viol1.append((nombre, ini, etiq, ultimo_et, despues))
            continue

        if MENSAJE.match(l) and pila:
            operandos[id(pila[-1])][-1][1].append(i)

    resumen.append((nombre, n_alt, n_loop, n_break))

print("=" * 78)
print("REGLA 1 — alt con operando de exito VACIO y continuacion fuera del fragmento")
print("=" * 78)
for n, ini, etiq, et_exito, cuantos in viol1:
    print(f"  {n} :{ini:<4} alt {etiq[:44]:<44} | exito «{et_exito[:26]}» vacio, {cuantos} msg despues")
print(f"  TOTAL: {len(viol1)}")

print()
print("=" * 78)
print("REGLA 2 — break dentro de un loop con accion del ACTOR sin guardar despues")
print("=" * 78)
for n, i, etiq, sueltos in viol4:
    print(f"  {n} :{i:<4} break {etiq[:46]:<46} | alcanzaria las lineas {sueltos}")
print(f"  TOTAL: {len(viol4)}")

print()
print("Inventario por diagrama (alt / loop / break):")
ta = tl = tb = 0
for n, a, lo, b in resumen:
    print(f"  {n}: alt={a:<3} loop={lo:<3} break={b}")
    ta += a
    tl += lo
    tb += b
print(f"  TOTALES: alt={ta}  loop={tl}  break={tb}")
