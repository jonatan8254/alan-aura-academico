# -*- coding: utf-8 -*-
"""
Paso 1 de la navegabilidad del vault: regenerar vault desde cero
pasando community_labels EXPLICITO (construido desde los atributos community/
community_name de cada nodo del grafo fusionado), en vez de dejar que el CLI
`graphify export obsidian` intente leer un sidecar .graphify_analysis.json /
.graphify_labels.json que no existe para este grafo -> eso es lo que causaba
que las notas mostraran "Community 775" en vez del nombre real.
"""
import sys; sys.stdout.reconfigure(encoding="utf-8")
import json
import networkx as nx
from networkx.readwrite import json_graph as jg

# `SD-48`: la ruta absoluta que habia aqui violaba el check de independencia de
# `AGENTS.md §0` —el repositorio debe poder clonarse en cualquier maquina—. Es el
# mismo defecto que `CVI-02` del `CDR-01`, cerrado en `SD-45`. Ahora se resuelve
# con el `site-packages` del interprete que ejecuta el script, sea cual sea.
import site
for _ruta in (site.getsitepackages() + [site.getusersitepackages()]):
    if _ruta not in sys.path:
        sys.path.insert(0, _ruta)
from graphify.export import to_obsidian, to_canvas

GRAPH = r"C:\GitHub\alan-aura-academico\grafo\graph_subproyecto_final.json"
VAULT_DIR = r"C:\GitHub\alan-aura-academico\grafo\vault"

raw = json.loads(open(GRAPH, encoding="utf-8").read())
G = jg.node_link_graph(raw, edges="links")

communities = {}
labels = {}
for node_id, data in G.nodes(data=True):
    cid = data.get("community")
    if cid is None:
        continue
    cid = int(cid)
    communities.setdefault(cid, []).append(node_id)
    name = data.get("community_name")
    if name and cid not in labels:
        labels[cid] = name

print("comunidades:", len(communities), "| con nombre:", len(labels))
sin_nombre = [c for c in communities if c not in labels]
print("sin nombre (deberian ser 0):", sin_nombre)

n = to_obsidian(G, communities, VAULT_DIR, community_labels=labels, cohesion=None)
print("notas escritas:", n)
to_canvas(G, communities, VAULT_DIR + r"\graph.canvas", community_labels=labels)
print("canvas escrito")
