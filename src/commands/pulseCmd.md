# pulse command

Track how frequently sessions are accessed by recording activity pulses.

## Usage

```
tabsync pulse record <name>       Record a pulse for a session
tabsync pulse clear <name>        Clear all pulse data for a session
tabsync pulse show <name>         Show pulse stats for a session
tabsync pulse sort                List all sessions sorted by most recent pulse
tabsync pulse filter-min <count>  List sessions with at least <count> pulses
```

## Examples

```bash
# Record activity on a session
tabsync pulse record "Work"
# Pulse recorded for "Work"

# Show pulse statistics
tabsync pulse show "Work"
# Session: Work
#   Total pulses: 5
#   Last pulse: 2024-06-01T10:30:00.000Z
#   Pulses (24h): 3

# Sort all sessions by most recently active
tabsync pulse sort

# Find sessions accessed at least 3 times
tabsync pulse filter-min 3
```

## Notes

- Pulses are stored as Unix timestamps (ms) in the `pulse` array on each session.
- `filter-min` counts total pulses, not just recent ones.
- `sort` orders by the most recent pulse timestamp descending.
