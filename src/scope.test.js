const { isValidScope, setScope, clearScope, setScopeByName, getScope, filterByScope, sortByScope, listScopes } = require('./scope');

function makeSession(name, scope) {
  const s = { id: name, name, tabs: [] };
  if (scope) s.scope = scope;
  return s;
}

test('isValidScope returns true for valid scopes', () => {
  expect(isValidScope('work')).toBe(true);
  expect(isValidScope('personal')).toBe(true);
  expect(isValidScope('other')).toBe(true);
});

test('isValidScope returns false for invalid scope', () => {
  expect(isValidScope('unknown')).toBe(false);
  expect(isValidScope('')).toBe(false);
});

test('setScope assigns scope to session', () => {
  const s = makeSession('a');
  expect(setScope(s, 'work').scope).toBe('work');
});

test('setScope throws on invalid scope', () => {
  expect(() => setScope(makeSession('a'), 'bad')).toThrow();
});

test('clearScope removes scope', () => {
  const s = makeSession('a', 'work');
  expect(clearScope(s).scope).toBeUndefined();
});

test('setScopeByName updates matching session', () => {
  const sessions = [makeSession('a', 'work'), makeSession('b', 'personal')];
  const result = setScopeByName(sessions, 'a', 'research');
  expect(result[0].scope).toBe('research');
  expect(result[1].scope).toBe('personal');
});

test('getScope returns scope or null', () => {
  expect(getScope(makeSession('a', 'health'))).toBe('health');
  expect(getScope(makeSession('b'))).toBeNull();
});

test('filterByScope returns matching sessions', () => {
  const sessions = [makeSession('a', 'work'), makeSession('b', 'personal'), makeSession('c', 'work')];
  expect(filterByScope(sessions, 'work')).toHaveLength(2);
});

test('sortByScope sorts by VALID_SCOPES order', () => {
  const sessions = [makeSession('a', 'other'), makeSession('b', 'personal'), makeSession('c', 'work')];
  const sorted = sortByScope(sessions);
  expect(sorted[0].scope).toBe('personal');
  expect(sorted[1].scope).toBe('work');
});

test('listScopes returns all valid scopes', () => {
  const scopes = listScopes();
  expect(scopes).toContain('work');
  expect(scopes).toContain('personal');
  expect(scopes.length).toBeGreaterThan(0);
});
