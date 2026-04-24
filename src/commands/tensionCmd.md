# tension command

Manage tension levels for sessions. Tension indicates how urgent or stressful a session is.

## Valid Levels

`low` | `medium` | `high` | `critical`

## Usage

```
tabsync tension set <name> <level>
tabsync tension clear <name>
tabsync tension show <name>
tabsync tension filter <level>
tabsync tension sort [asc|desc]
```

## Examples

```bash
# Set tension level
tabsync tension set "Work Research" high

# Clear tension from a session
tabsync tension clear "Work Research"

# Show tension for a session
tabsync tension show "Work Research"
# => Tension: high

# Filter sessions by tension
tabsync tension filter critical
# => - Deadline Sprint [critical]

# Sort all sessions by tension level
tabsync tension sort asc
# => - Personal: none
# => - Work Research: high
# => - Deadline Sprint: critical
```

## Notes

- Sessions without a tension level are treated as lower than `low` when sorting.
- Use `critical` to flag sessions that need immediate attention.
