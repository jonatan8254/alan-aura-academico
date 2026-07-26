# -*- coding: utf-8 -*-
"""
Fusiona el grafo de conocimiento (libros/normas, sin proyecto Smart-AID) con los
11 grafos por carpeta del subproyecto «Alan & Aura Académico».

Determinista, sin LLM. NO usa `graphify merge-graphs` porque ese comando
renombra todos los ids a `<tag>::<id>`, pierde la dirección de las aristas y
colapsa aristas paralelas. Aquí se preserva el esquema exacto.

Entradas (solo lectura, permanecen en SmartAID):
  - grafo_conocimiento/graph_conocimiento.json
  - grafo_subproyecto/extraccion_por_carpeta/<carpeta>/graphify-out/graph.json
Salida:
  - alan-aura-academico/grafo/graph_subproyecto_final.json
"""
import sys, json, os, re, unicodedata, collections
sys.stdout.reconfigure(encoding="utf-8")

RAIZ = r"C:\GitHub\SmartAID"
CONOC = os.path.join(RAIZ, "grafo_conocimiento", "graph_conocimiento.json")
EXTRA = os.path.join(RAIZ, "grafo_subproyecto", "extraccion_por_carpeta")
SALIDA = r"C:\GitHub\alan-aura-academico\grafo\graph_subproyecto_final.json"


def normalizar(s):
    """Normaliza una etiqueta para detectar el mismo concepto escrito distinto."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    s = re.sub(r"\b(19|20)\d\d\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


# ---------- 1. Cargar conocimiento ----------
con = json.load(open(CONOC, encoding="utf-8"))
nodos = {n["id"]: dict(n) for n in con["nodes"]}
for n in nodos.values():
    n["origen_grafo"] = "conocimiento"
links = [dict(l) for l in con.get("links", [])]
hyper = [dict(h) for h in con.get("hyperedges", [])]

com_max = max((n.get("community") or 0) for n in con["nodes"])
print("conocimiento : %d nodos | %d aristas | %d hiper | comunidad max %d"
      % (len(nodos), len(links), len(hyper), com_max))

# ---------- 2. Añadir cada carpeta del subproyecto ----------
offset = com_max + 1
dup_ids, nuevos_por_carpeta = [], {}
print("\nsubproyecto:")
for carpeta in sorted(os.listdir(EXTRA)):
    f = os.path.join(EXTRA, carpeta, "graphify-out", "graph.json")
    if not os.path.exists(f):
        print("   %-24s SIN GRAFO (omitido)" % carpeta)
        continue
    g = json.load(open(f, encoding="utf-8"))
    coms = set()
    antes = len(nodos)
    for n in g["nodes"]:
        nn = dict(n)
        nn["origen_grafo"] = "subproyecto"
        nn["carpeta_origen"] = carpeta
        c = nn.get("community")
        if c is not None:
            coms.add(c)
            nn["community"] = c + offset          # evita colisión con conocimiento
        if nn["id"] in nodos:
            dup_ids.append((nn["id"], carpeta))    # mismo concepto en 2 carpetas
        else:
            nodos[nn["id"]] = nn
    for l in g.get("links", []):
        links.append(dict(l))
    for h in g.get("hyperedges", []):
        hh = dict(h)
        hh["source_file"] = hh.get("source_file", carpeta)
        hyper.append(hh)
    nuevos_por_carpeta[carpeta] = len(nodos) - antes
    print("   %-24s +%3d nodos  (comunidades %d-%d)"
          % (carpeta, nuevos_por_carpeta[carpeta], offset, offset + len(coms) - 1 if coms else offset))
    offset += len(coms) if coms else 1

# ---------- 3. Puentes por etiqueta normalizada ----------
por_norm = collections.defaultdict(list)
for n in nodos.values():
    if n.get("origen_grafo") == "conocimiento":
        e = normalizar(n.get("label"))
        if e:
            por_norm[e].append(n["id"])

puentes, vistos = [], set()
for n in list(nodos.values()):
    if n.get("origen_grafo") != "subproyecto":
        continue
    e = normalizar(n.get("label"))
    for destino in por_norm.get(e, []):
        par = (n["id"], destino)
        if par in vistos:
            continue
        vistos.add(par)
        links.append({
            "relation": "same_as",
            "confidence": "INFERRED",
            "confidence_score": 0.9,
            "source_file": "fusionar.py (puente por etiqueta normalizada)",
            "source_location": "",
            "weight": 1,
            "source": n["id"],
            "target": destino,
        })
        puentes.append((n.get("label"), nodos[destino].get("label")))

# ---------- 4. Escribir ----------
salida = {
    "directed": con.get("directed", True),
    "multigraph": con.get("multigraph", False),
    "graph": {"hyperedges": hyper},
    "nodes": list(nodos.values()),
    "links": links,
    "hyperedges": hyper,
}
with open(SALIDA, "w", encoding="utf-8") as f:
    json.dump(salida, f, ensure_ascii=False)

sub = sum(1 for n in nodos.values() if n.get("origen_grafo") == "subproyecto")
print("\n=== RESULTADO ===")
print("   nodos totales : %d  (conocimiento %d + subproyecto %d)"
      % (len(nodos), len(nodos) - sub, sub))
print("   aristas       : %d" % len(links))
print("   hiperaristas  : %d" % len(hyper))
print("   ids repetidos entre carpetas (fusionados): %d" % len(dup_ids))
print("   PUENTES creados (same_as): %d" % len(puentes))
for a, b in puentes:
    print("      %-44s <-> %s" % (a[:44], b[:44]))
print("\n   escrito en: %s" % SALIDA)
