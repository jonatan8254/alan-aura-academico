# Grafo de conocimiento — Alan & Aura Académico

Grafo propio del subproyecto, **aislado del macroproyecto Smart-AID**: fusiona los
262 conceptos extraídos de los 37 documentos de `docs/` con un grafo de solo
libros y normas (sin ningún nodo de Smart-AID/TalentTrack).

| | |
|---|---|
| **Nodos** | 2.876 — 262 del subproyecto + 2.614 de conocimiento |
| **Aristas / hiperaristas** | 2.893 / 249 |
| **Comunidades** | 769 — 55 nuevas del subproyecto + 714 de conocimiento |
| **Puentes `same_as`** | 34 (conocimiento ↔ subproyecto) |
| **Notas del vault** | 3.645 de concepto/comunidad + 62 documentos fuente |

## Contenido

```
grafo/
├── graph_subproyecto_final.json   ← el grafo (node-link JSON)
├── vault/                          ← vault de Obsidian (abrir esta carpeta en Obsidian)
│   ├── 00_Inicio.md                  hub de navegación — empieza aquí
│   ├── 01_Indices/                   índice de fuentes y de comunidades
│   ├── 02_Fuentes/
│   │   ├── Subproyecto/              los 37 .md de docs/, con su ruta preservada
│   │   └── Conocimiento/             los 25 libros y normas (ver «Licencia» abajo)
│   └── *.md                          una nota por concepto y por comunidad
└── scripts/                        ← cómo se construyó (reproducibilidad)
```

## Cómo usarlo

Abre `grafo/vault/` como vault en Obsidian y arranca por `00_Inicio.md`.
Cada nota de concepto trae:

- una sección `## Origen` con wikilink al documento del que salió, y
- frontmatter `source_path` / `source_absolute_path` / `source_note` para llegar
  al archivo original fuera del vault.

## Trazabilidad

Cada nota enlaza de vuelta a su fuente. Tres casos:

1. **Subproyecto (262 nodos)** → wikilink a `02_Fuentes/Subproyecto/…`, copia
   íntegra del `.md` de `docs/` con su ruta original preservada.
2. **Conocimiento, texto (1.644 nodos)** → wikilink a `02_Fuentes/Conocimiento/…`,
   copia íntegra del libro o norma.
3. **Conocimiento, figuras (970 nodos)** → solo ruta absoluta al original. Son
   ~882 imágenes extraídas de los libros (~109 MB): pesan más de 10× el texto y
   son material con derechos, así que no se duplican aquí.

En los tres casos se conserva la ruta al **original canónico**; la copia del vault
es operativa, no sustituye a la fuente.

## ⚠️ Licencia del corpus de conocimiento

`vault/02_Fuentes/Conocimiento/` contiene el texto íntegro de libros y normas con
derechos de autor (PMBOK 7, ISO/IEC 90003, ISO/IEC 25010/25020, Wiegers, entre
otros), usados como material de estudio del curso.

**Esa carpeta está en `.gitignore` a propósito**: el vault es autocontenido en
disco, pero el repositorio no redistribuye material licenciado. Para
reconstruirla en otra máquina hace falta el corpus original y ejecutar
`scripts/vincular_fuentes.py`.

## Reproducibilidad

`scripts/` conserva el pipeline que construyó el grafo:

| Script | Qué hace | ¿Re-ejecutable? |
|---|---|---|
| `fusionar.py` | Une el grafo de conocimiento con el del subproyecto | ❌ lee intermedios de extracción que quedaron en el proyecto principal |
| `injertar_nombres.py` | Injerta los nombres de comunidad generados con Opus | ❌ ídem |
| `reconstruir_vault.py` | Regenera las notas del vault desde el grafo | ✅ |
| `vincular_fuentes.py` | Copia las fuentes y enlaza cada nota a su origen | ✅ (necesita el corpus original para el conocimiento) |
| `generar_indices.py` | Regenera hub e índices | ✅ |

Orden para regenerar el vault: `reconstruir_vault.py` → `vincular_fuentes.py` → `generar_indices.py`.

Los dos primeros scripts se conservan como **registro de cómo se construyó**, no
como herramienta de uso diario: dependen de artefactos intermedios de la
extracción (que se hizo con Opus, por subcarpeta y en `--mode deep`) que viven en
el proyecto principal.

## Procedencia

Construido en `SmartAID/grafo_subproyecto/` sobre **copias**, y migrado aquí.
El grafo y el vault originales del macroproyecto (`graphify-out/`,
`vault_obsidian/`) nunca se modificaron — verificado por hash SHA256 antes y
después de cada etapa.

El bloque de conocimiento es idéntico al grafo de conocimiento aislado del que
partió: 0 diferencias de id, comunidad o nombre en los 2.614 nodos.
