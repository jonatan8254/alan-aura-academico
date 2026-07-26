# -*- coding: utf-8 -*-
"""Paso 3: notas de navegacion (hub + indice de fuentes), mismo patron que
vault_obsidian/00_Inicio.md y 01_Indices/Indice de fuentes.md."""
import sys; sys.stdout.reconfigure(encoding="utf-8")
import json, collections
from pathlib import Path

GRAPH = Path(r"C:\GitHub\alan-aura-academico\grafo\graph_subproyecto_final.json")
VAULT = Path(r"C:\GitHub\alan-aura-academico\grafo\vault")
MAPA_FUENTES = json.loads(Path(
    r"C:\GitHub\alan-aura-academico\grafo\scripts\mapa_fuentes.json"
).read_text(encoding="utf-8"))

g = json.loads(GRAPH.read_text(encoding="utf-8"))
nodes = g["nodes"]
sub = [n for n in nodes if n.get("origen_grafo") == "subproyecto"]
con = [n for n in nodes if n.get("origen_grafo") == "conocimiento"]

com_sub = collections.Counter(n.get("community_name") for n in sub)
com_con_count = len(set(n.get("community_name") for n in con))

indices_dir = VAULT / "01_Indices"
indices_dir.mkdir(exist_ok=True)

# --- Indice de fuentes (subproyecto): 1 fila por doc fuente
lines = [
    "---",
    "type: index",
    "created_for: obsidian_traceability_vault",
    "---",
    "",
    "# Indice de fuentes — Subproyecto Alan & Aura Academico",
    "",
    f"Los {len(MAPA_FUENTES)} documentos fuente del subproyecto, copiados en "
    "`02_Fuentes/Subproyecto/` con su ruta original preservada. Cada fila enlaza "
    "a la copia trazable dentro del vault.",
    "",
    "| Documento | Ruta original (repo alan-aura-academico) |",
    "|---|---|",
]
for source_file, relpath in sorted(MAPA_FUENTES.items()):
    note_link = f"02_Fuentes/Subproyecto/{relpath[:-3]}"
    lines.append(f"| [[{note_link}\\|{source_file}]] | `{relpath}` |")
conoc_dir = VAULT / "02_Fuentes" / "Conocimiento"
todos = sorted(p.name for p in conoc_dir.iterdir() if p.is_file()) if conoc_dir.exists() else []
conoc_files = [x for x in todos if x.lower().endswith(".md")]
n_png = len(todos) - len(conoc_files)

lines += [
    "",
    "## Corpus de conocimiento (libros y normas)",
    "",
    f"El grafo incluye {len(con)} nodos de conocimiento ({com_con_count} comunidades), "
    "heredados intactos del grafo de conocimiento aislado (solo libros/normas, "
    "sin contaminacion del macroproyecto Smart-AID).",
    "",
    f"El vault es **autocontenido**: estan copiados aqui tanto los "
    f"**{len(conoc_files)} documentos de texto** como las **{n_png} figuras** "
    "extraidas de ellos (`02_Fuentes/Conocimiento/`). Cada nota de concepto enlaza "
    "a su copia por wikilink — las de figura ademas la embeben — y conserva "
    "`source_absolute_path` al original canonico en el proyecto principal.",
    "",
    "> Esa carpeta esta excluida del control de versiones (`.gitignore`): es "
    "material con derechos y el repositorio no lo redistribuye. Se reconstruye "
    "con `scripts/vincular_fuentes.py` a partir del corpus original.",
    "",
    "### Documentos de texto",
    "",
    "| Documento de conocimiento |",
    "|---|",
]
for name in conoc_files:
    lines.append(f"| [[02_Fuentes/Conocimiento/{name[:-3]}\\|{name}]] |")
lines += [
    "",
    f"### Figuras ({n_png})",
    "",
    "Se consultan desde la nota de concepto que las cita (cada una embebe su "
    "imagen). No se listan aqui una por una por volumen.",
    "",
]
(indices_dir / "Indice de fuentes.md").write_text("\n".join(lines), encoding="utf-8")

# --- Indice de comunidades del subproyecto
# Nota: el injerto de nombres asigno el mismo nombre a varias comunidades
# numericas ORIGINALES distintas (voto mayoritario por nodo, no re-numeracion),
# asi que graphify genera varias notas _COMMUNITY_<nombre>[_N].md por nombre
# repetido -> no hay un unico archivo por nombre, por eso aqui se lista texto
# plano (buscar "_COMMUNITY_<nombre>" en Obsidian muestra todas sus variantes).
lines2 = [
    "---",
    "type: index",
    "created_for: obsidian_traceability_vault",
    "---",
    "",
    "# Comunidades del subproyecto",
    "",
    f"{len(com_sub)} comunidades nuevas (offset 775+), nombradas con Opus a partir "
    "de los 262 nodos extraidos del subproyecto. Varios ids de comunidad originales "
    "comparten nombre (voto mayoritario) -> busca `_COMMUNITY_<nombre>` en Obsidian "
    "para ver todas sus notas de resumen.",
    "",
    "| Comunidad | Nodos |",
    "|---|---|",
]
for name, count in com_sub.most_common():
    lines2.append(f"| {name} | {count} |")
(indices_dir / "Comunidades del subproyecto.md").write_text("\n".join(lines2), encoding="utf-8")

# --- Hub
hub = f"""---
type: hub
created_for: obsidian_traceability_vault
source_category: vault_generated
traceability: vault_navigation
---

# Alan & Aura Academico — Vault del subproyecto

Grafo de conocimiento propio del subproyecto **Alan & Aura Academico** (MVP,
UNAL Medellin), fusionado con el grafo de conocimiento aislado (solo
libros/normas, sin contaminacion del macroproyecto Smart-AID). Cada nota
de concepto enlaza de vuelta a su documento fuente (seccion "## Origen" +
frontmatter `source_path` / `source_absolute_path`).

## Navegacion

- [[01_Indices/Indice de fuentes|Indice de fuentes]] — los documentos fuente, con enlace a su copia trazable
- [[01_Indices/Comunidades del subproyecto|Comunidades del subproyecto]] — las {len(com_sub)} comunidades nuevas, nombradas con Opus
- `02_Fuentes/Subproyecto/` — los 37 `.md` del subproyecto (estructura de carpetas preservada)
- `02_Fuentes/Conocimiento/` — los {len(conoc_files)} libros y normas que sustentan el bloque de conocimiento

## Composicion del grafo

- **{len(sub)} nodos** del subproyecto (37 documentos, {len(com_sub)} comunidades nuevas)
- **{len(con)} nodos** de conocimiento (libros y normas), identicos a `grafo_conocimiento/graph_conocimiento.json`, {com_con_count} comunidades preexistentes sin modificar
- **{len(g.get('links', []))} aristas**, **{len(g.get('hyperedges', []))} hiperaristas**
- Puentes explicitos `same_as` conocimiento <-> subproyecto: ver aristas con `relation: same_as` en el grafo

## Notas

- Este vault se genero sobre una **copia** (ahora en `alan-aura-academico/grafo/`, migrada desde
  `SmartAID/grafo_subproyecto/`); el grafo y vault originales de SmartAID
  (`graphify-out/`, `vault_obsidian/`) nunca se tocaron.
- El bloque de conocimiento es byte-identico a `grafo_conocimiento/graph_conocimiento.json` (verificado: 0 diferencias
  de id/comunidad/nombre en los 2614 nodos).
"""
(VAULT / "00_Inicio.md").write_text(hub, encoding="utf-8")

print("Indices y hub escritos.")
print(" -", indices_dir / "Indice de fuentes.md")
print(" -", indices_dir / "Comunidades del subproyecto.md")
print(" -", VAULT / "00_Inicio.md")
