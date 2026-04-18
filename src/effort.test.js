const {
  isValidEffort,
  setEffort,
  clearEffort,
  setEffortByName,
  getEffort,
  sortByEffort,
  filterByEffort,
  filterByMinEffort
} = require('./effort');

const makeSession = (name, effort) => ({ id: name, name, tabs: [], createdAt: new Date().toISOString(), ...(effort ? { effort } : {}) });

test('isValidEffort accepts valid values', () => {
  expect(isValidEffort('low')).toBe(true);
  expect(isValidEffort('high')).toBe(true);
  expect(isValidEffort('very-high')).toBe(true);
});

test('isValidEffort rejects invalid values', () => {
  expect(isValidEffort('extreme')).toBe(false);
  expect(isValidEffort('')).toBe(false);
});

test('setEffort sets effort on session', () => {
  const s = makeSession('a');
  expect(setEffort(s, 'medium').effort).toBe('medium');
});

test('setEffort throws on invalid effort', () => {
  expect(() => setEffort(makeSession('a'), 'extreme')).toThrow();
});

test('clearEffort removes effort', () => {
  const s = makeSession('a', 'high');
  expect(clearEffort(s).effort).toBeUndefined();
});

test('setEffortByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setEffortByName(sessions, 'a', 'low');
  expect(result[0].effort).toBe('low');
  expect(result[1].effort).toBeUndefined();
});

test('getEffort returns effort or null', () => {
  expect(getEffort(makeSession('a', 'high'))).toBe('high');
  expect(getEffort(makeSession('b'))).toBeNull();
});

test('sortByEffort sorts ascending', () => {
  const sessions = [makeSession('a', 'high'), makeSession('b', 'low'), makeSession('c', 'medium')];
  const sorted = sortByEffort(sessions, true);
  expect(sorted.map(s => s.effort)).toEqual(['low', 'medium', 'high']);
});

test('sortByEffort sorts descending', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'very-high')];
  const sorted = sortByEffort(sessions, false);
  expect(sorted[0].effort).toBe('very-high');
});

test('filterByEffort filters correctly', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'high'), makeSession('c', 'low')];
  expect(filterByEffort(sessions, 'low')).toHaveLength(2);
});

test('filterByMinEffort returns sessions at or above threshold', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'medium'), makeSession('c', 'high')];
  expect(filterByMinEffort(sessions, 'medium')).toHaveLength(2);
});
