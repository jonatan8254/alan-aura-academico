---
type: community
members: 2
---

# MVP Architecture Decisions

**Members:** 2 nodes

## Members
- [[D6 — Recursos de crisis configurables por entorno]] - rationale - ADR-001_decisiones_tecnicas.md
- [[OBJ-3 Gate de seguridad binario]] - concept - VIS-01_vision_alcance.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/MVP_Architecture_Decisions
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions]]
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions_3]]

## Top bridge nodes
- [[D6 — Recursos de crisis configurables por entorno]] - degree 2, connects to 1 community
- [[OBJ-3 Gate de seguridad binario]] - degree 2, connects to 1 community