# historyCmd

Handles CLI commands for viewing and managing session action history.

## Commands

### `history log <sessionId> <action>`
Record an action taken on a session.

```
tabsync history log abc123 rename
```

### `history show <sessionId>`
Display all history entries for a specific session.

```
tabsync history show abc123
```

Output format:
```
[2024-06-01T10:23:00.000Z] rename — "Work Tabs" (abc123)
[2024-06-01T09:00:00.000Z] create — "Work Tabs" (abc123)
```

### `history clear <sessionId>`
Remove all history entries for a specific session.

```
tabsync history clear abc123
```

## Storage

History is persisted in `~/.tabsync/history.json` as a flat array of entries.

Each entry contains:
- `id` — unique entry id
- `sessionId` — id of the affected session
- `sessionName` — name at time of action
- `action` — string label (e.g. `create`, `rename`, `archive`)
- `timestamp` — ISO 8601 string

## Notes

- History is append-only; individual entries cannot be edited.
- `clear` removes all entries for a session but does not affect the session itself.
- Use `history show` before destructive operations to audit recent changes.
