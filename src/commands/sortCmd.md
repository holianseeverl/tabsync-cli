# sortCmd — Sort Sessions

Sorts loaded tab sessions by a given field and optional order.

## Usage

```bash
tabsync sort [--by <field>] [--order <asc|desc>] [--save]
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--by` | `date` | Field to sort by: `date`, `name`, `tabs` |
| `--order` | field default | Sort direction: `asc` or `desc` |
| `--save` | `false` | Persist the sorted order back to the store |

## Field Defaults

- `date` → `desc` (newest first)
- `name` → `asc` (A–Z)
- `tabs` → `desc` (most tabs first)

## Examples

```bash
# Sort by date, newest first (default)
tabsync sort

# Sort alphabetically by name
tabsync sort --by name

# Sort by tab count, fewest first, and save
tabsync sort --by tabs --order asc --save
```

## Module API

```js
const { handleSort } = require('./sortCmd');

const sorted = await handleSort({ by: 'name', order: 'asc', save: false });
```
