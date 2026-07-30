# Guía de uso del grafo de conocimiento y del vault de Obsidian

> Guía operativa para cualquiera que use `grafo/` en este repositorio — compañeros de equipo, agentes de IA (Claude Code, Codex, etc.). Define qué es, cómo consultarlo y qué no tocar. Es la referencia canónica de `grafo/`; `CLAUDE.md`/`AGENTS.md` no la mencionan porque el grafo es posterior a su última revisión — ver la nota de estado al final.

---

## 1. Qué es y qué no

**`grafo/` es un artefacto derivado, no un entregable de la Fase 1/2 del subproyecto.** Los entregables reales viven en `docs/` (visión, modelos verbales, requisitos, ICONIX…) y esos sí siguen las reglas de `CLAUDE.md`/`AGENTS.md`. El grafo es una **capa de navegación** construida sobre esos mismos documentos más el corpus de conocimiento (libros y normas), para poder preguntarle relaciones al corpus en vez de leerlo entero.

- **No se edita a mano.** Ni `grafo/graph_subproyecto_final.json` ni las notas de `grafo/vault/`. Si algo está mal, se corrige en el documento original (`docs/...`) y se regenera con los scripts (§6) — nunca editando el JSON o una nota directamente.
- **No sustituye a `docs/`.** Es un mapa hacia los documentos, no los documentos. Para citar contenido, siempre el original en `docs/`, nunca el texto resumido de un nodo ni la copia en `02_Fuentes/`.
- Construido el **2026-07-25** (SD-27) sobre una copia del proyecto principal Smart-AID, **sin ningún nodo de Smart-AID/TalentTrack** — aislamiento verificado. Detalle de la decisión: `docs/00_gobernanza/REGISTRO_DECISIONES.md` (SD-27) y `docs/00_gobernanza/CHANGELOG.md` (v0.14.0).

---

## 2. Qué contiene el grafo

Dos corpus fusionados en un solo archivo (`grafo/graph_subproyecto_final.json`):

| | Nodos | Qué es |
|---|---:|---|
| **Subproyecto** | 262 | Extraídos de los 37 `.md` de `docs/` |
| **Conocimiento** | 2.614 | Libros y normas de apoyo (PMBOK 7, ISO/IEC 90003, ISO/IEC 25010/25020/25022/25023/25030/25040, 12207, 15939, Wiegers, Rosenberg/ICONIX, GQM…) |
| **Total** | **2.876** | 2.893 aristas · 249 hiperaristas · 769 comunidades (55 nuevas del subproyecto + 714 heredadas) · 34 puentes `same_as` entre ambos corpus |

Cada nodo conserva `source_file`, así que el origen (subproyecto vs. conocimiento) siempre se puede distinguir.

> **Alcance — qué sabe el grafo y qué no.** Conoce los 37 documentos de `docs/` que existían el 2026-07-25. **No** conoce nada creado después de esa fecha (por ejemplo, si `docs/` creció con nuevas especificaciones ICONIX, esos documentos son invisibles al grafo hasta una re-extracción explícita). Antes de fiarte de una consulta para algo reciente, comprueba la fecha del documento contra la del grafo.

---

## 3. Consultar el grafo por terminal

Requiere `graphify` instalado (`pip install graphify`). A diferencia del proyecto principal, **este repo no tiene una carpeta `graphify-out/`** — el grafo vive directo en `grafo/graph_subproyecto_final.json`, así que **el flag `--graph` es obligatorio** en cada comando (sin él, `graphify` buscaría en `./graphify-out/graph.json`, que no existe aquí):

```bash
cd grafo
graphify query "<pregunta>" --graph graph_subproyecto_final.json
graphify explain "<concepto>" --graph graph_subproyecto_final.json
graphify path "<A>" "<B>" --graph graph_subproyecto_final.json
```

- `query` acepta además `--budget N` (límite de tokens de salida) y `--dfs` (profundidad en vez de anchura).
- `path` puede devolver "sin camino" aunque A y B se relacionen conceptualmente — el grafo tiene componentes desconectados por diseño (dos corpus distintos, solo 34 puentes entre ellos). "Sin camino" ≠ "sin relación real"; usa `query`/`explain` para confirmar.
- Las aristas están etiquetadas `EXTRACTED` (directa), `INFERRED` (inferida) o `AMBIGUOUS`. Pondera según esa etiqueta antes de citar una relación como hecho.

**Prohibido, siempre:** `graphify extract` / `update` / `cluster-only` / `merge-graphs` sobre `graph_subproyecto_final.json`. Reindexar cuesta cuota de suscripción y puede destruir el trabajo de nombrado de comunidades ya hecho (§7). Si hace falta actualizar el grafo, es un trabajo deliberado con scripts propios (§6), no un comando suelto.

---

## 4. El vault de Obsidian

**Abrir `grafo/vault/` en Obsidian** (*Open folder as vault*) y empezar por `00_Inicio.md`. No requiere ningún plugin.

Estructura real:
```
grafo/vault/
├── 00_Inicio.md            hub de navegación
├── graph.canvas            vista de grafo de Obsidian
├── .obsidian/               configuración del vault (parte versionada, parte local — ver .gitignore)
├── 01_Indices/
│   ├── Indice de fuentes.md            los 37+25 documentos fuente, con enlace a su copia
│   └── Comunidades del subproyecto.md   las 55 comunidades nuevas del subproyecto
├── 02_Fuentes/
│   ├── Subproyecto/         copia íntegra de los 37 .md de docs/, con su ruta preservada
│   └── Conocimiento/        25 libros/normas + 882 figuras — ver §5, LICENCIA, no está en git
└── *.md                    3.645 notas, una por concepto y por comunidad (viven en la raíz del vault, no en una subcarpeta)
```

**Nota de estructura:** a diferencia de otros vaults de Obsidian que agrupan las notas de concepto en una subcarpeta (`03_Notas_Grafo/`), aquí viven directamente en la raíz de `vault/`, junto al hub y el canvas.

### Trazabilidad

Cada nota de concepto trae en su frontmatter `source_path` / `source_absolute_path` / `source_note`, y una sección `## Origen` con wikilink al documento del que salió. Tres casos:

1. **Subproyecto** → enlaza a `02_Fuentes/Subproyecto/…`, copia íntegra del `.md` de `docs/`.
2. **Conocimiento, texto** → enlaza a `02_Fuentes/Conocimiento/…`, copia íntegra del libro o norma.
3. **Conocimiento, figuras** → enlaza a `02_Fuentes/Conocimiento/…` **y la imagen queda embebida en la propia nota** (no solo citada).

En todos los casos la copia del vault es operativa; el original en `docs/` o en el corpus de conocimiento es la fuente canónica.

### El vault es espejo de lectura, no lugar de trabajo

No edites notas dentro de `vault/`: no llega a `docs/`, y la próxima regeneración lo sobrescribe. Si algo del corpus cambia, corrígelo en `docs/` y regenera el vault con los scripts (§6) — nunca a mano.

---

## 5. ⚠️ Licencia del corpus de conocimiento

`grafo/vault/02_Fuentes/Conocimiento/` contiene el texto íntegro y las figuras de libros y normas con derechos de autor (PMBOK 7, ISO/IEC 90003, ISO/IEC 25010/25020, Wiegers, entre otros). **Esa carpeta está excluida de git a propósito** — el repositorio es público y no puede redistribuir material licenciado.

Si acabas de clonar el repo, esa carpeta existe pero está **vacía**. Para tenerla completa:
1. Pide el zip del corpus (~117 MB) a quien te dio acceso al repositorio — nunca por un canal público.
2. Descomprímelo dentro de `grafo/vault/02_Fuentes/Conocimiento/` (el contenido va directo ahí, sin subcarpeta contenedora — si el zip trae una, mueve solo el contenido).
3. El vault y el grafo funcionan igual sin ese paso — solo faltará el texto íntegro de esas 25 fuentes y sus 882 figuras. Las notas y el resto del grafo (los 262 nodos del subproyecto, por ejemplo) están completos igualmente.

---

## 6. Reproducibilidad (`grafo/scripts/`)

| Script | Qué hace | ¿Re-ejecutable? |
|---|---|---|
| `fusionar.py` | Une el grafo de conocimiento con el del subproyecto | ❌ lee intermedios de extracción que quedaron en el proyecto principal (Smart-AID) |
| `injertar_nombres.py` | Injerta los nombres de comunidad generados con Opus | ❌ ídem |
| `reconstruir_vault.py` | Regenera las notas del vault desde el grafo | ✅ |
| `vincular_fuentes.py` | Copia las fuentes y enlaza cada nota a su origen | ✅ (necesita el corpus de conocimiento local para esa parte) |
| `generar_indices.py` | Regenera el hub y los 2 índices | ✅ |

Orden si hace falta regenerar el vault: `reconstruir_vault.py` → `vincular_fuentes.py` → `generar_indices.py`. Los dos primeros scripts (`fusionar.py`, `injertar_nombres.py`) son **registro de cómo se construyó**, no herramienta de uso diario — dependen de artefactos que viven en el repositorio del proyecto principal, no en este.

---

## 7. Trampas de `graphify` verificadas (si alguna vez se regenera algo)

Esto es la misma herramienta (`graphify`) que usa el proyecto principal Smart-AID, con los mismos comportamientos inesperados verificados allí. Si algún día tocan tocar `fusionar.py`/`injertar_nombres.py` o volver a extraer:

1. **`label --missing-only` no respeta su nombre: re-clusteriza el grafo entero.** Ya pasó aquí — al nombrar las 55 comunidades nuevas del subproyecto, el primer intento alteró 2.162 de los 2.614 nodos de conocimiento que ya estaban bien nombrados. Se descartó y se injertaron solo los nombres nuevos por voto mayoritario a nivel de nodo, dejando las 714 comunidades de conocimiento intactas (verificado: 0 diferencias).
2. **Demasiados documentos en una sola llamada de extracción degradan el resultado a un índice.** Un primer intento en bloque sobre los 37 documentos dio solo 40 nodos. Extraer por subcarpeta y en `--mode deep` fue lo que rindió los 262 nodos reales.
3. **`--model` es ignorado por el backend `claude-cli`**; la única palanca real es la variable de entorno `GRAPHIFY_CLAUDE_CLI_MODEL`.
4. **El nombre de archivo de una nota no se puede derivar del `label` del nodo** — `graphify` elimina caracteres como `: / " ? *` sin dejar separador. Para mapear nodo→nota, lee el frontmatter de la nota.

---

## 8. Nota de estado (por qué esta guía no aparece citada en CLAUDE.md/AGENTS.md)

`grafo/` se incorporó el 2026-07-25 (SD-27), después de la última revisión de `CLAUDE.md`/`AGENTS.md`, que siguen sin mencionarlo. Esta guía existe para que quien llegue a `grafo/` sin contexto sepa qué es y cómo usarlo sin depender de que esos dos archivos se actualicen primero.
