# cohesion command

Analyze how focused or scattered a session's tabs are based on domain overlap,
shared tags, and title keyword similarity.

## Score Breakdown

| Component       | Weight | Description                                  |
|-----------------|--------|----------------------------------------------|
| Domain overlap  | 50%    | How many tabs share the same hostname        |
| Tag coverage    | 30%    | Number of tags (capped at 5 for full score)  |
| Title similarity| 20%    | Repeated keywords across tab titles          |

Scores range from `0.00` (completely scattered) to `1.00` (tightly focused).

## Usage

```bash
# Show cohesion score for a specific session
tabsync cohesion show "Work Research"

# Compute and store cohesion scores for all sessions
tabsync cohesion compute-all

# Sort all sessions by cohesion (highest first)
tabsync cohesion sort

# Sort ascending (lowest first)
tabsync cohesion sort --asc

# Filter sessions with cohesion score >= 0.6
tabsync cohesion filter 0.6
```

## Examples

```
$ tabsync cohesion show "GitHub Sprint"
Cohesion for "GitHub Sprint": 0.82 (0 = scattered, 1 = tightly focused)

$ tabsync cohesion sort
  [0.82] GitHub Sprint
  [0.61] Reading List
  [0.23] Misc Tabs

$ tabsync cohesion filter 0.5
  [0.82] GitHub Sprint
  [0.61] Reading List
```
