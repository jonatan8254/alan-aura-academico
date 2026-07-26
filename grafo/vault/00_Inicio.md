---
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
- [[01_Indices/Comunidades del subproyecto|Comunidades del subproyecto]] — las 18 comunidades nuevas, nombradas con Opus
- `02_Fuentes/Subproyecto/` — los 37 `.md` del subproyecto (estructura de carpetas preservada)
- `02_Fuentes/Conocimiento/` — los 25 libros y normas que sustentan el bloque de conocimiento

## Composicion del grafo

- **262 nodos** del subproyecto (37 documentos, 18 comunidades nuevas)
- **2614 nodos** de conocimiento (libros y normas), identicos a `grafo_conocimiento/graph_conocimiento.json`, 617 comunidades preexistentes sin modificar
- **2893 aristas**, **249 hiperaristas**
- Puentes explicitos `same_as` conocimiento <-> subproyecto: ver aristas con `relation: same_as` en el grafo

## Notas

- Este vault se genero sobre una **copia** (ahora en `alan-aura-academico/grafo/`, migrada desde
  `SmartAID/grafo_subproyecto/`); el grafo y vault originales de SmartAID
  (`graphify-out/`, `vault_obsidian/`) nunca se tocaron.
- El bloque de conocimiento es byte-identico a `grafo_conocimiento/graph_conocimiento.json` (verificado: 0 diferencias
  de id/comunidad/nombre en los 2614 nodos).
