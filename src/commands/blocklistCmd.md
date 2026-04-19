# blocklist command

Manage URL/domain blocklists for individual sessions. Blocked patterns are matched as substrings against tab URLs.

## Usage

```
tabsync blocklist add <name> <pattern>
tabsync blocklist remove <name> <pattern>
tabsync blocklist clear <name>
tabsync blocklist show <name>
tabsync blocklist filter <name>
```

## Subcommands

### add
Add a URL pattern to the session's blocklist.
```
tabsync blocklist add Work tracker.com
```

### remove
Remove a pattern from the blocklist.
```
tabsync blocklist remove Work tracker.com
```

### clear
Remove all patterns from the blocklist.
```
tabsync blocklist clear Work
```

### show
List all blocked patterns for a session.
```
tabsync blocklist show Work
```

### filter
Remove any tabs whose URLs match a blocked pattern from the session.
```
tabsync blocklist filter Work
```

## Notes
- Pattern matching is substring-based (e.g. `tracker.com` blocks `https://ads.tracker.com/pixel`).
- `filter` modifies the session in place and saves it.
