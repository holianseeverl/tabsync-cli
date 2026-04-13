# rename command

Rename an existing tab session by its ID or by its current name.

## Usage

```bash
tabsync rename <id> <new-name>
tabsync rename --by-name <old-name> <new-name>
```

## Options

| Flag | Description |
|------|-------------|
| `--by-name` | Match session by name instead of ID |

## Examples

### Rename by ID
```bash
tabsync rename abc123 "Work 2024"
# Session renamed to "Work 2024" successfully.
```

### Rename by current name
```bash
tabsync rename --by-name "Old Work" "New Work"
# Session renamed to "New Work" successfully.
```

## Notes

- New name must be a non-empty string.
- If no matching session is found, an error is printed and no changes are saved.
- When using `--by-name`, only the first matching session is renamed.
- Renaming does not affect the session's ID, tags, tabs, or creation date.
