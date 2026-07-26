---
type: community
members: 10
---

# MVP Data Persistence

**Members:** 10 nodes

## Members
- [[Borrado en cascada (PER-T1)]] - concept - PER-01_mapa_persistencia.md
- [[Entidad AdministrativeAction]] - concept - PER-01_mapa_persistencia.md
- [[Entidad ConsentRecord]] - concept - PER-01_mapa_persistencia.md
- [[Entidad DailyUsageCounter]] - concept - PER-01_mapa_persistencia.md
- [[Entidad PlatformSetting (kill switch)]] - concept - PER-01_mapa_persistencia.md
- [[Entidad User]] - concept - PER-01_mapa_persistencia.md
- [[MD-01 modelo de dominio_1]] - document - PER-01_mapa_persistencia.md
- [[PER-01 Mapa de persistencia del MVP]] - document - PER-01_mapa_persistencia.md
- [[PRIV-R11 (eliminación en cascada)]] - concept - PRIV-01_privacidad_datos.md
- [[RF-24 (eliminar cuenta con cascada)]] - concept - REQ-01_requisitos.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/MVP_Data_Persistence
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Privacy & Data Management]]
- 2 edges to [[_COMMUNITY_MVP Data Persistence_1]]
- 1 edge to [[_COMMUNITY_MVP Data Persistence_2]]

## Top bridge nodes
- [[PER-01 Mapa de persistencia del MVP]] - degree 12, connects to 3 communities
- [[Borrado en cascada (PER-T1)]] - degree 6, connects to 1 community