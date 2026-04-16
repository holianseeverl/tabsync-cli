# dependency command

Manage dependencies between sessions. Mark that one session depends on another to model workflows or prerequisites.

## Usage

```
tabsync dependency add <sessionId> <dependsOnId>
tabsync dependency remove <sessionId> <dependsOnId>
tabsync dependency show <sessionId>
tabsync dependency dependents <sessionId>
```

## Subcommands

### add
Link `sessionId` as depending on `dependsOnId`.
```
tabsync dependency add b a
# Session "b" now depends on "a".
```

### remove
Remove a dependency link.
```
tabsync dependency remove b a
# Removed dependency "a" from "b".
```

### show
List all sessions that a given session depends on.
```
tabsync dependency show b
# Dependencies of "b":
#   - [a] Alpha
```

### dependents
List all sessions that depend on a given session.
```
tabsync dependency dependents a
# Sessions depending on "a":
#   - [b] Beta
```

## Notes
- A session cannot depend on itself.
- Dependencies are stored as an array of session IDs on the session object.
- Removing a non-existent dependency is a no-op.
