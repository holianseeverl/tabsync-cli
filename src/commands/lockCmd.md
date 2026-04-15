# lockCmd

Handles CLI commands for locking and unlocking sessions.

## Commands

### Lock a session

Prevents a session from being modified or deleted until unlocked.

```
tabsync lock <session-name>
```

**Example:**
```
tabsync lock "Work Tabs"
# Session "Work Tabs" has been locked.
```

### Unlock a session

Removes the lock from a session, allowing edits again.

```
tabsync unlock <session-id>
```

**Example:**
```
tabsync unlock abc123
# Session "abc123" has been unlocked.
```

### List locked sessions

Displays all currently locked sessions.

```
tabsync locked
```

**Example output:**
```
Locked sessions (2):
  [abc123] Work Tabs — 5 tab(s)
  [def456] Research — 3 tab(s)
```

## Notes

- Locking is done by **name**, unlocking by **id** for safety.
- Locked sessions are protected from rename, merge, archive, and delete operations.
- Use `tabsync locked` to review what is currently protected.
