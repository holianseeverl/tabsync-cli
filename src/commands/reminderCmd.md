# reminder command

Manage reminders and due dates attached to sessions.

## Usage

```
tabsync reminder set <name> <message> [--due <date>]
tabsync reminder clear <name>
tabsync reminder show <name>
tabsync reminder due
```

## Subcommands

### `set <name> <message>`

Attach a reminder message (and optional due date) to a session.

```
tabsync reminder set "Work" "Review open tabs" --due 2025-06-01T09:00:00Z
```

### `clear <name>`

Remove the reminder from a session.

```
tabsync reminder clear "Work"
```

### `show <name>`

Display the current reminder for a session.

```
tabsync reminder show "Work"
# Reminder for "Work":
#   Message : Review open tabs
#   Due     : 2025-06-01T09:00:00.000Z
#   Created : 2025-05-01T08:00:00.000Z
```

### `due`

List all sessions whose reminder due date has passed.

```
tabsync reminder due
# Overdue reminders:
#   [Work] Review open tabs — due: 2025-06-01T09:00:00.000Z
```

## Notes

- Due dates should be valid ISO 8601 strings.
- Sessions without a reminder are unaffected by `clear` or `due`.
- Reminders are stored in the session JSON file alongside other session data.
