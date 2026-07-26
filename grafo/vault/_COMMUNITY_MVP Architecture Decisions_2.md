---
type: community
members: 3
---

# MVP Architecture Decisions

**Members:** 3 nodes

## Members
- [[Actor Usuario adulto]] - concept - VIS-01_vision_alcance.md
- [[D7 — Idioma español (CO), adultos]] - rationale - ADR-001_decisiones_tecnicas.md
- [[OBJ-7 Gestión de cuenta y acceso]] - concept - VIS-01_vision_alcance.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/MVP_Architecture_Decisions
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions]]
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions_3]]

## Top bridge nodes
- [[D7 — Idioma español (CO), adultos]] - degree 2, connects to 1 community
- [[OBJ-7 Gestión de cuenta y acceso]] - degree 2, connects to 1 community