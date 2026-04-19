const { isValidTheme, setTheme, clearTheme, setThemeByName, getTheme, filterByTheme, listThemes, sortByTheme } = require('./theme');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

test('isValidTheme returns true for valid themes', () => {
  expect(isValidTheme('dark')).toBe(true);
  expect(isValidTheme('nord')).toBe(true);
});

test('isValidTheme returns false for unknown theme', () => {
  expect(isValidTheme('rainbow')).toBe(false);
});

test('setTheme assigns theme to session', () => {
  const s = makeSession();
  const result = setTheme(s, 'dark');
  expect(result.theme).toBe('dark');
});

test('setTheme throws on invalid theme', () => {
  expect(() => setTheme(makeSession(), 'neon')).toThrow('Invalid theme: neon');
});

test('clearTheme removes theme from session', () => {
  const s = makeSession({ theme: 'dark' });
  const result = clearTheme(s);
  expect(result.theme).toBeUndefined();
});

test('setThemeByName updates matching session', () => {
  const sessions = [makeSession({ name: 'A' }), makeSession({ id: '2', name: 'B' })];
  const result = setThemeByName(sessions, 'A', 'nord');
  expect(result[0].theme).toBe('nord');
  expect(result[1].theme).toBeUndefined();
});

test('getTheme returns theme or null', () => {
  expect(getTheme(makeSession({ theme: 'solarized' }))).toBe('solarized');
  expect(getTheme(makeSession())).toBeNull();
});

test('filterByTheme returns sessions with matching theme', () => {
  const sessions = [
    makeSession({ name: 'A', theme: 'dark' }),
    makeSession({ id: '2', name: 'B', theme: 'light' }),
    makeSession({ id: '3', name: 'C', theme: 'dark' })
  ];
  expect(filterByTheme(sessions, 'dark')).toHaveLength(2);
});

test('listThemes returns all valid themes', () => {
  const themes = listThemes();
  expect(themes).toContain('dark');
  expect(themes).toContain('dracula');
  expect(themes.length).toBeGreaterThan(0);
});

test('sortByTheme sorts sessions alphabetically by theme', () => {
  const sessions = [
    makeSession({ name: 'A', theme: 'solarized' }),
    makeSession({ id: '2', name: 'B', theme: 'dark' }),
    makeSession({ id: '3', name: 'C' })
  ];
  const sorted = sortByTheme(sessions);
  expect(sorted[0].theme).toBeUndefined();
  expect(sorted[1].theme).toBe('dark');
  expect(sorted[2].theme).toBe('solarized');
});
