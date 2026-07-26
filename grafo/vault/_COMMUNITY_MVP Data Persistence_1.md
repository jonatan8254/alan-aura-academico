---
type: community
members: 6
---

# MVP Data Persistence

**Members:** 6 nodes

## Members
- [[Cápsula ContextoInicialConversacionalV1]] - concept - PER-01_mapa_persistencia.md
- [[Entidad InitialConversationProfile (cápsula)]] - concept - PER-01_mapa_persistencia.md
- [[Hallazgo PER-H1 (character obligatorio vs sin cápsula)]] - rationale - PER-01_mapa_persistencia.md
- [[PRIV-R1 (solo la cápsula al LLM)]] - concept - PRIV-01_privacidad_datos.md
- [[RF-05 (generar cápsula de perfil)]] - concept - REQ-01_requisitos.md
- [[Retención del proveedor LLM (Groq, ZDR)]] - concept - PER-01_mapa_persistencia.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/MVP_Data_Persistence
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_MVP Data Persistence]]

## Top bridge nodes
- [[Entidad InitialConversationProfile (cápsula)]] - degree 6, connects to 1 community