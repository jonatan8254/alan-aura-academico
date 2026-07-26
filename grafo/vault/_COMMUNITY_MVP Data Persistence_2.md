---
type: community
members: 3
---

# MVP Data Persistence

**Members:** 3 nodes

## Members
- [[Entidad OperationalEvent]] - concept - PER-01_mapa_persistencia.md
- [[PRIV-R2 (chat no se persiste en BD ni logs)]] - concept - PRIV-01_privacidad_datos.md
- [[RF-13 (no persistencia del chat)]] - concept - REQ-01_requisitos.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/MVP_Data_Persistence
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_MVP Data Persistence]]

## Top bridge nodes
- [[Entidad OperationalEvent]] - degree 2, connects to 1 community