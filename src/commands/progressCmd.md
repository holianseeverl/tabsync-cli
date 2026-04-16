# progress command

Track reading or completion progress (0–100%) on any session.

## Usage

```
tabsync progress set <name> <value>     Set progress percentage (0-100)
tabsync progress clear <name>           Clear progress from a session
tabsync progress show <name>            Show current progress
tabsync progress filter <min>           List sessions with progress >= min
tabsync progress complete               List all fully completed sessions
tabsync progress sort                   Sort all sessions by progress descending
```

## Examples

```bash
# Mark a session 75% complete
tabsync progress set "Work" 75

# Show progress for a session
tabsync progress show "Work"
# Work: 75%

# Find all sessions at least 50% done
tabsync progress filter 50

# List fully completed sessions
tabsync progress complete

# Sort all sessions by progress
tabsync progress sort
```

## Notes

- Progress is stored as an integer 0–100.
- Sessions with no progress set show as `N/A` in sort output.
- Use `complete` to quickly find sessions marked at 100%.
