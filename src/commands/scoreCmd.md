# score command

Score sessions based on their attributes (rating, priority, favorites, pins, progress, tab count).

## Subcommands

### `score show <name>`
Display the computed score for a session by name or ID.

```
tabsync score show "Work Research"
# Score for "Work Research": 87.5
```

### `score sort [--asc]`
List all sessions sorted by score (highest first by default).

```
tabsync score sort
# [100] Deep Work (12 tabs)
# [60]  Side Projects (4 tabs)
# [20]  Misc (1 tabs)

tabsync score sort --asc
# [20]  Misc (1 tabs)
# [60]  Side Projects (4 tabs)
# [100] Deep Work (12 tabs)
```

### `score filter --min <value>`
Show only sessions with a score at or above the given minimum.

```
tabsync score filter --min 50
# [100] Deep Work
# [60]  Side Projects
```

## Scoring Weights

| Attribute  | Weight per unit |
|------------|----------------|
| rating     | 20 per star     |
| priority   | 15 × level (high=3, medium=2, low=1) |
| favorite   | +10             |
| pinned     | +10             |
| progress   | 0.3 per %       |
| tab count  | 0.5 per tab     |
