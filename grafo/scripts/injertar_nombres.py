# -*- coding: utf-8 -*-
"""
`graphify label --missing-only` re-clusterizo TODO el grafo como efecto
secundario (los ids de comunidad cambiaron para TODOS los nodos, no solo
los de conocimiento). Por eso el mapeo por id de comunidad fallaba.

Aqui se mapea por NODO (el id de nodo si es estable entre las dos corridas):
para cada comunidad original del subproyecto (775-829, del grafo limpio),
se mira que nombre recibieron SUS nodos en la salida re-clusterizada
(voto mayoritario) y se usa ese nombre — sin tocar comunidades ni nombres
del conocimiento.
"""
import sys, json, collections
sys.stdout.reconfigure(encoding="utf-8")

# El "limpio" de referencia es el que se guardo ANTES de este segundo intento
# NOTA: intermedio historico, permanece en SmartAID (solo lectura)
SIN_ETIQUETAR = r"C:\GitHub\SmartAID\grafo_subproyecto\graph_subproyecto_final_SIN_ETIQUETAR.json"
ETIQUETADO = r"C:\GitHub\SmartAID\grafo_subproyecto\etiquetado\graphify-out\graph.json"
SALIDA = r"C:\GitHub\alan-aura-academico\grafo\graph_subproyecto_final.json"

limpio = json.load(open(SIN_ETIQUETAR, encoding="utf-8"))
etiquetado = json.load(open(ETIQUETADO, encoding="utf-8"))

# id de nodo -> nombre de comunidad que le toco en la salida re-clusterizada
nombre_por_nodo = {}
for n in etiquetado["nodes"]:
    name = n.get("community_name")
    if name and not str(name).startswith("Community"):
        nombre_por_nodo[n["id"]] = name

# Para cada comunidad ORIGINAL del subproyecto (775-829), votar el nombre
# mas frecuente entre sus nodos originales
com_a_nodos = collections.defaultdict(list)
for n in limpio["nodes"]:
    if n.get("origen_grafo") == "subproyecto":
        com_a_nodos[n.get("community")].append(n["id"])

com_a_nombre = {}
for com, ids in com_a_nodos.items():
    votos = collections.Counter(nombre_por_nodo[i] for i in ids if i in nombre_por_nodo)
    if votos:
        com_a_nombre[com] = votos.most_common(1)[0][0]

print("Comunidades originales del subproyecto: %d" % len(com_a_nodos))
print("Comunidades con nombre recuperado (voto mayoritario): %d" % len(com_a_nombre))
sin_nombre = [c for c in com_a_nodos if c not in com_a_nombre]
if sin_nombre:
    print("Sin nombre recuperado (quedan con 'Community N'): %s" % sin_nombre)

# Aplicar SOLO a nodos del subproyecto; comunidades y nombres del
# conocimiento quedan absolutamente intactos (nunca se leen ni escriben)
tocados = 0
for n in limpio["nodes"]:
    if n.get("origen_grafo") == "subproyecto":
        com = n.get("community")
        if com in com_a_nombre:
            n["community_name"] = com_a_nombre[com]
            tocados += 1

print("Nodos del subproyecto con nombre injertado: %d de %d" % (
    tocados, len(com_a_nodos and [i for v in com_a_nodos.values() for i in v])))

with open(SALIDA, "w", encoding="utf-8") as f:
    json.dump(limpio, f, ensure_ascii=False)
print("Guardado: %s" % SALIDA)

print("\n=== Comunidades del subproyecto: id -> nombre final ===")
for com in sorted(com_a_nodos, key=lambda x: (x is None, x)):
    print("   %-6s (%2d nodos) -> %s" % (com, len(com_a_nodos[com]), com_a_nombre.get(com, "[SIN NOMBRE]")))
