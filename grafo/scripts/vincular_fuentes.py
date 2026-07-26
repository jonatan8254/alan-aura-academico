# -*- coding: utf-8 -*-
"""
"Pull the source docs in and link every note back to where it came from."

Enriquece cada nota de concepto del vault con trazabilidad a su documento
fuente. Idempotente: se ejecuta DESPUES de reconstruir_vault.py, que regenera
las notas de nodo/comunidad limpias (las copias en 02_Fuentes/ no se tocan,
graphify solo sobrescribe los archivos que el mismo genero).

Tres casos:

1. Nodos origen_grafo=subproyecto (262): sus 37 .md fuente estan copiados en
   02_Fuentes/Subproyecto/ (ruta original preservada). La nota enlaza por
   wikilink a esa copia.

2. Nodos origen_grafo=conocimiento con fuente .md (1644): sus 25 .md fuente
   estan copiados en 02_Fuentes/Conocimiento/. La nota enlaza por wikilink a
   esa copia. Se conserva ADEMAS source_absolute_path al original canonico en
   SmartAID (regla del proyecto: el corpus original se cita como fuente
   canonica; la copia del vault es solo operativa).

3. Nodos origen_grafo=conocimiento con fuente .png (967): son figuras
   extraidas de los libros (~109 MB, 882 imagenes). NO se duplican en el
   vault por peso y por licencia (son figuras de libros y normas ISO con
   derechos). La nota apunta por ruta absoluta al original.
"""
import sys; sys.stdout.reconfigure(encoding="utf-8")
import json, re, hashlib
from pathlib import Path

GRAFO_DIR = Path(r"C:\GitHub\alan-aura-academico\grafo")
GRAPH = GRAFO_DIR / "graph_subproyecto_final.json"
VAULT = GRAFO_DIR / "vault"
SUBPROYECTO_REPO = Path(r"C:\GitHub\alan-aura-academico")
# Corpus original de conocimiento: SOLO LECTURA, vive en el proyecto principal
CONOCIMIENTO_ROOT = Path(r"C:\GitHub\SmartAID\libros_y_normas_markdown")
MAPA_FUENTES = json.loads((GRAFO_DIR / "scripts" / "mapa_fuentes.json").read_text(encoding="utf-8"))

g = json.loads(GRAPH.read_text(encoding="utf-8"))
nodes = g["nodes"]


# --- replica de la logica de nombres de archivo de graphify.export.to_obsidian
def _cap_filename(s: str, limit: int = 200) -> str:
    b = s.encode("utf-8")
    if len(b) <= limit:
        return s
    digest = hashlib.sha1(s.encode("utf-8")).hexdigest()[:8]
    keep = limit - 9
    return f"{b[:keep].decode('utf-8', 'ignore')}_{digest}"


def safe_name(label: str) -> str:
    cleaned = re.sub(r'[\\/*?:"<>|#^\[\]]', "", label.replace("\r\n", " ").replace("\r", " ").replace("\n", " ")).strip()
    cleaned = re.sub(r"\.(md|mdx|qmd|markdown)$", "", cleaned, flags=re.IGNORECASE)
    if not re.search(r"\w", cleaned, flags=re.UNICODE):
        return "unnamed"
    return _cap_filename(cleaned)


node_filename, used = {}, set()
for n in nodes:
    base = safe_name(n.get("label", n["id"]))
    candidate, i = base, 1
    while candidate.lower() in used:
        candidate = f"{base}_{i}"
        i += 1
    used.add(candidate.lower())
    node_filename[n["id"]] = candidate

assert (VAULT / f"{node_filename['capsula_contexto']}.md").exists(), "Logica de nombres desincronizada"
print("Verificacion de logica de nombres: OK")


def limpiar_prefijo(sf: str) -> str:
    """source_file viene inconsistente: unos traen el prefijo de carpeta y otros no."""
    return sf[len("libros_y_normas_markdown/"):] if sf.startswith("libros_y_normas_markdown/") else sf


# --- 1. Copiar los 37 docs del subproyecto a 02_Fuentes/Subproyecto/
fuentes_sub_dir = VAULT / "02_Fuentes" / "Subproyecto"
fuente_notafile = {}
for source_file, relpath in MAPA_FUENTES.items():
    origen = SUBPROYECTO_REPO / relpath
    destino = fuentes_sub_dir / relpath
    destino.parent.mkdir(parents=True, exist_ok=True)
    frontmatter = (
        "---\n"
        f'source_path: "{relpath}"\n'
        f'source_absolute_path: "{origen}"\n'
        'source_category: "subproyecto"\n'
        "traceability: copied_from_original\n"
        "created_for: obsidian_traceability_vault\n"
        "---\n\n"
    )
    # newline="" para no traducir saltos de linea y alterar el original
    with open(origen, encoding="utf-8", newline="") as f:
        original_text = f.read()
    with open(destino, "w", encoding="utf-8", newline="") as f:
        f.write(frontmatter + original_text)
    fuente_notafile[source_file] = f"02_Fuentes/Subproyecto/{relpath[:-3]}"

print(f"Fuentes del subproyecto copiadas: {len(fuente_notafile)}/{len(MAPA_FUENTES)}")

# --- 2. Inventario de las copias de conocimiento ya presentes en el vault
conoc_dir = VAULT / "02_Fuentes" / "Conocimiento"
conoc_disponibles = {p.name for p in conoc_dir.glob("*.md")} if conoc_dir.exists() else set()
print(f"Fuentes de conocimiento disponibles en el vault: {len(conoc_disponibles)}")

# --- 3. Enriquecer cada nota de concepto
stats = {"subproyecto": 0, "conocimiento_md": 0, "conocimiento_png": 0}
faltantes, sin_copia = [], set()

for n in nodes:
    fname = node_filename.get(n["id"])
    note_path = VAULT / f"{fname}.md"
    if not note_path.exists():
        faltantes.append(n["id"])
        continue

    text = note_path.read_text(encoding="utf-8")
    origen_grafo = n.get("origen_grafo")
    source_file = n.get("source_file") or ""

    if origen_grafo == "subproyecto":
        rel = MAPA_FUENTES.get(source_file)
        note_link = fuente_notafile.get(source_file)
        if not note_link:
            continue
        extra_front = (
            f'source_path: "{rel}"\n'
            f'source_absolute_path: "{SUBPROYECTO_REPO / rel}"\n'
            f'source_note: "[[{note_link}]]"\n'
        )
        origen_section = (
            "## Origen\n"
            f"- Fuente original del subproyecto: [[{note_link}]]\n"
            f"- Archivo original: `{rel}`\n"
        )
        stats["subproyecto"] += 1

    elif origen_grafo == "conocimiento":
        nombre = limpiar_prefijo(source_file)
        abs_path = CONOCIMIENTO_ROOT / nombre
        if nombre.lower().endswith(".md"):
            if nombre not in conoc_disponibles:
                sin_copia.add(nombre)
                continue
            note_link = f"02_Fuentes/Conocimiento/{nombre[:-3]}"
            extra_front = (
                f'source_path: "libros_y_normas_markdown/{nombre}"\n'
                f'source_absolute_path: "{abs_path}"\n'
                f'source_note: "[[{note_link}]]"\n'
            )
            origen_section = (
                "## Origen\n"
                f"- Fuente en este vault: [[{note_link}]]\n"
                f"- Original canonico (proyecto principal, solo lectura): "
                f"`libros_y_normas_markdown/{nombre}`\n"
            )
            stats["conocimiento_md"] += 1
        else:
            # figura extraida de un libro: no se duplica en el vault
            extra_front = (
                f'source_path: "libros_y_normas_markdown/{nombre}"\n'
                f'source_absolute_path: "{abs_path}"\n'
                'source_asset: "no duplicado en el vault (figura de libro/norma)"\n'
            )
            origen_section = (
                "## Origen\n"
                f"- Figura extraida de un libro/norma: `libros_y_normas_markdown/{nombre}`\n"
                "- No duplicada en este vault (peso y licencia); abrir desde la ruta original.\n"
            )
            stats["conocimiento_png"] += 1
    else:
        continue

    # insertar extra_front al final del frontmatter existente
    parts = text.split("---\n", 2)
    if len(parts) < 3:
        continue
    new_text = "---\n" + parts[1] + extra_front + "---\n" + parts[2]

    # insertar "## Origen" justo despues del titulo H1
    lines = new_text.split("\n")
    for i, line in enumerate(lines):
        if line.startswith("# "):
            lines[i + 1:i + 1] = ["", origen_section]
            break
    note_path.write_text("\n".join(lines), encoding="utf-8")

print(f"\nNotas enriquecidas:")
print(f"  subproyecto      : {stats['subproyecto']:5d} / 262")
print(f"  conocimiento .md : {stats['conocimiento_md']:5d} / 1644")
print(f"  conocimiento .png: {stats['conocimiento_png']:5d} / 967")
print(f"  TOTAL            : {sum(stats.values()):5d} / {len(nodes)}")
print(f"\nNotas no encontradas en disco: {len(faltantes)}")
print(f"Fuentes .md de conocimiento citadas pero sin copia en el vault: {len(sin_copia)}")
for s in sorted(sin_copia)[:10]:
    print("   ", s)
