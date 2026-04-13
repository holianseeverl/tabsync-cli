# tabsync-cli

> A command-line tool to export, organize, and restore browser tab sessions across machines via a simple JSON format.

---

## Installation

```bash
npm install -g tabsync-cli
```

---

## Usage

### Export your current tabs
```bash
tabsync export --output my-session.json
```

### List saved sessions
```bash
tabsync list
```

### Restore a session
```bash
tabsync restore my-session.json
```

### Example session file (`my-session.json`)
```json
{
  "name": "work-session",
  "created": "2024-06-01T10:00:00Z",
  "tabs": [
    { "title": "GitHub", "url": "https://github.com" },
    { "title": "MDN Web Docs", "url": "https://developer.mozilla.org" }
  ]
}
```

Sync sessions across machines by sharing or version-controlling the exported JSON files.

---

## Requirements

- Node.js >= 16
- A supported browser extension (see [docs](./docs/setup.md) for setup)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](./LICENSE)