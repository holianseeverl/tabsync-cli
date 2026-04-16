# category command

Manage categories on tab sessions. Categories help you organize sessions into broad groups like `work`, `personal`, or `research`.

## Usage

```
tabsync category <subcommand> [options]
```

## Subcommands

### set
```
tabsync category set <name> <category>
```
Assigns a category to the named session.

**Example:**
```
tabsync category set "Morning Tabs" work
```

### clear
```
tabsync category clear <name>
```
Removes the category from the named session.

**Example:**
```
tabsync category clear "Morning Tabs"
```

### show
```
tabsync category show <name>
```
Displays the current category of a session.

**Example:**
```
tabsync category show "Morning Tabs"
# Category: work
```

### filter
```
tabsync category filter <category>
```
Lists all sessions with the given category.

**Example:**
```
tabsync category filter personal
```

### sort
```
tabsync category sort
```
Lists all sessions sorted alphabetically by their category.

## Notes
- Categories are free-form strings; any non-empty string is valid.
- Sessions without a category will appear last when sorting.
