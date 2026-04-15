# `share` / `receive` Commands

Share individual sessions with other users or machines using a compact base64 code or a shareable URL.

---

## Commands

### `tabsync share <sessionName>`

Encodes the named session as a base64 share code and prints it to stdout.

```bash
tabsync share "Work Tabs"
# Share code for "Work Tabs":
# eyJpZCI6ImFiYzEyMyIsIm5hbWUiOiJXb3JrIFRhYnMiLC4uLn0=
```

### `tabsync share <sessionName> --url`

Generates a full shareable URL instead of a raw code.

```bash
tabsync share "Work Tabs" --url
# Share URL:
# https://tabsync.app/import?session=eyJpZCI6ImFiYzEyMyIs...
```

Optionally provide a custom base URL:

```bash
tabsync share "Work Tabs" --url --baseUrl http://localhost:3000/share
```

---

### `tabsync receive <code|url>`

Decodes a share code or URL and imports the session into your local store.

```bash
tabsync receive eyJpZCI6ImFiYzEyMyIs...
# Session "Work Tabs" imported successfully.
```

```bash
tabsync receive "https://tabsync.app/import?session=eyJpZC..."
```

### Flags

| Flag | Description |
|------|-------------|
| `--url` | Output a shareable URL instead of a raw code |
| `--baseUrl <url>` | Custom base URL for the share link |
| `--force` | Overwrite an existing session with the same name or ID |

---

## Notes

- Share codes are plain base64-encoded JSON — no encryption is applied.
- Sessions are matched by both `id` and `name` for duplicate detection.
- Use `--force` carefully; it will replace the existing session.
