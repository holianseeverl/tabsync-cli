# pin command

Pin or unpin sessions for quick access. Pinned sessions are flagged in the store and can be listed separately.

## Usage

```
tabsync pin <sessionId> [--file <path>]
tabsync unpin <sessionId> [--file <path>]
tabsync pinned [--file <path>]
```

## Commands

### `pin <sessionId>`
Marks the given session as pinned.

```
tabsync pin a1b2c3
# Pinned session: a1b2c3
```

### `unpin <sessionId>`
Removes the pinned flag from the given session.

```
tabsync unpin a1b2c3
# Unpinned session: a1b2c3
```

### `pinned`
Lists all currently pinned sessions.

```
tabsync pinned
# [pinned] b2c3d4 — Research (5 tabs)
# [pinned] e5f6g7 — Work (12 tabs)
```

## Options

| Flag | Description |
|------|-------------|
| `--file <path>` | Path to session store JSON (defaults to configured store) |

## Notes

- Pinning does not affect session content or ordering.
- Use `pinned` to quickly recall frequently used sessions without searching.
