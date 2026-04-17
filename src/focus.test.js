const { setFocus, clearFocus, getFocused, setFocusByName, listByFocusRecency, isFocused } = require('./focus');

function makeSession(overrides = {}) {
  return { id: 'abc', name: 'Test', tabs: [], focused: false, ...overrides };
}

test('setFocus marks correct session as focused', () => {
  const sessions = [makeSession({ id: '1' }), makeSession({ id: '2' })];
  const result = setFocus(sessions, '1');
  expect(result[0].focused).toBe(true);
  expect(result[1].focused).toBe(false);
  expect(result[0].focusedAt).toBeDefined();
});

test('clearFocus removes focus from all sessions', () => {
  const sessions = [makeSession({ id: '1', focused: true }), makeSession({ id: '2' })];
  const result = clearFocus(sessions);
  expect(result.every(s => !s.focused)).toBe(true);
});

test('getFocused returns focused session', () => {
  const sessions = [makeSession({ id: '1' }), makeSession({ id: '2', focused: true })];
  expect(getFocused(sessions).id).toBe('2');
});

test('getFocused returns null when none focused', () => {
  expect(getFocused([makeSession()])).toBeNull();
});

test('setFocusByName focuses by name', () => {
  const sessions = [makeSession({ id: '1', name: 'Alpha' }), makeSession({ id: '2', name: 'Beta' })];
  const result = setFocusByName(sessions, 'Beta');
  expect(result[1].focused).toBe(true);
});

test('setFocusByName returns null if name not found', () => {
  expect(setFocusByName([makeSession()], 'Nope')).toBeNull();
});

test('listByFocusRecency sorts by focusedAt desc', () => {
  const sessions = [
    makeSession({ id: '1', focusedAt: '2024-01-01T00:00:00Z' }),
    makeSession({ id: '2', focusedAt: '2024-06-01T00:00:00Z' })
  ];
  const result = listByFocusRecency(sessions);
  expect(result[0].id).toBe('2');
});

test('isFocused returns correct boolean', () => {
  expect(isFocused(makeSession({ focused: true }))).toBe(true);
  expect(isFocused(makeSession())).toBe(false);
});
