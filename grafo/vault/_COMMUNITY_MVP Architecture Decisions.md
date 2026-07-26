---
type: community
members: 6
---

# MVP Architecture Decisions

**Members:** 6 nodes

## Members
- [[ADR-001 Decisiones técnicas del MVP]] - rationale - ADR-001_decisiones_tecnicas.md
- [[D1 — Framework Django 5.2 LTS]] - rationale - ADR-001_decisiones_tecnicas.md
- [[D2 — Persistencia SQLite]] - rationale - ADR-001_decisiones_tecnicas.md
- [[D3 — Motor conversacional Groq gpt-oss-20b]] - rationale - ADR-001_decisiones_tecnicas.md
- [[D4 — Control de versiones GitHub]] - rationale - ADR-001_decisiones_tecnicas.md
- [[D5 — Despliegue PythonAnywhere Free  Render]] - rationale - ADR-001_decisiones_tecnicas.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/MVP_Architecture_Decisions
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions_3]]
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions_1]]
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions_2]]
- 1 edge to [[_COMMUNITY_MVP Architecture Decisions_4]]

## Top bridge nodes
- [[ADR-001 Decisiones técnicas del MVP]] - degree 8, connects to 3 communities
- [[D3 — Motor conversacional Groq gpt-oss-20b]] - degree 3, connects to 1 community