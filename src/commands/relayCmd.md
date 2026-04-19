# relay command

Manage relay targets for sessions. A relay target identifies a remote machine or profile that a session is forwarded to.

## Usage

```
tabsync relay set <name> <target>
tabsync relay clear <name>
tabsync relay show <name>
tabsync relay filter <target>
tabsync relay targets
tabsync relay group
```

## Subcommands

### set
Assign a relay target to a session.
```
tabsync relay set "work" home-machine
```

### clear
Remove the relay target from a session.
```
tabsync relay clear "work"
```

### show
Display the relay target for a session.
```
tabsync relay show "work"
```

### filter
List all sessions assigned to a given relay target.
```
tabsync relay filter home-machine
```

### targets
List all unique relay targets currently in use.
```
tabsync relay targets
```

### group
Display sessions grouped by their relay target.
```
tabsync relay group
```
