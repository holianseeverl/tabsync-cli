# rhythm command

Manage the recurring rhythm of tab sessions.

## Usage

```
tabsync rhythm set <name> <rhythm>
tabsync rhythm clear <name>
tabsync rhythm show <name>
tabsync rhythm filter <rhythm>
tabsync rhythm sort
tabsync rhythm list
```

## Valid Rhythms

- `daily`
- `weekly`
- `biweekly`
- `monthly`
- `quarterly`

## Examples

```bash
# Set a session to repeat weekly
tabsync rhythm set "Work Tabs" weekly

# Show the rhythm of a session
tabsync rhythm show "Work Tabs"
# Work Tabs: weekly

# Filter sessions by rhythm
tabsync rhythm filter daily

# Sort all sessions by rhythm order
tabsync rhythm sort

# Clear rhythm from a session
tabsync rhythm clear "Work Tabs"

# List all valid rhythm values
tabsync rhythm list
```

## Notes

- Rhythm is stored as a string field on each session.
- Sorting follows the order: daily → weekly → biweekly → monthly → quarterly.
- Sessions without a rhythm appear last when sorting.
