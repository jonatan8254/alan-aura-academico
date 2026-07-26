---
type: community
members: 1
---

# Change Requests by Origin

**Members:** 1 nodes

## Members
- [[Figure 28-4 Number of Change Requests by Change Origin]] - image - libros_y_normas_markdown/Software_Requirements_3rd_Edition_Developer_Best_Wiegers_Karl_Beatty_Joy_3rd_ed_p501_figure_28_4_28_4_shows_a_way_to_represent_number_of_change.png

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Change_Requests_by_Origin
SORT file.name ASC
```
