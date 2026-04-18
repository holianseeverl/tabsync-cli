# impact command

Manage the impact level of tab sessions.

## Levels

`low` | `medium` | `high` | `critical`

## Usage

```
tabsync impact set <name> <level>    Set impact level for a session
tabsync impact clear <name>          Remove impact from a session
tabsync impact show <name>           Show impact for a session
tabsync impact filter <level>        List sessions with given impact
tabsync impact sort                  List all sessions sorted by impact
```

## Examples

```bash
tabsync impact set "work" critical
# Impact for "work" set to critical.

tabsync impact filter high
# - research [high]
# - planning [high]

tabsync impact sort
# - work [critical]
# - research [high]
# - planning [medium]
# - notes [low]

tabsync impact clear "work"
# Impact cleared for "work".
```
