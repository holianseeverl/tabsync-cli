const {
  isValidClarity,
  setClarity,
  clearClarity,
  setClarityByName,
  getClarity,
  filterByClarity,
  filterByMinClarity,
  sortByClarity
} = require('./clarity');

function makeSession(name, clarity) {
  const s = { id: name, name, tabs: [] };
  if (clarity !== undefined) s.clarity = clarity;
  return s;
}

test('isValidClarity accepts 1-5', () => {
  [1,2,3,4,5].forEach(v => expect(isValidClarity(v)).toBe(true));
});

test('isValidClarity rejects 0 and 6', () => {
  expect(isValidClarity(0)).toBe(false);
  expect(isValidClarity(6)).toBe(false);
});

test('setClarity sets value', () => {
  const s = makeSession('a');
  expect(setClarity(s, 3).clarity).toBe(3);
});

test('setClarity throws on invalid', () => {
  expect(() => setClarity(makeSession('a'), 7)).toThrow();
});

test('clearClarity removes field', () => {
  const s = makeSession('a', 4);
  expect(clearClarity(s).clarity).toBeUndefined();
});

test('setClarityByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setClarityByName(sessions, 'a', 5);
  expect(result[0].clarity).toBe(5);
  expect(result[1].clarity).toBeUndefined();
});

test('getClarity returns null when unset', () => {
  expect(getClarity(makeSession('a'))).toBeNull();
});

test('filterByClarity returns matching sessions', () => {
  const sessions = [makeSession('a', 2), makeSession('b', 4), makeSession('c', 2)];
  expect(filterByClarity(sessions, 2)).toHaveLength(2);
});

test('filterByMinClarity filters correctly', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 3), makeSession('c', 5)];
  expect(filterByMinClarity(sessions, 3)).toHaveLength(2);
});

test('sortByClarity desc', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 5), makeSession('c', 3)];
  const sorted = sortByClarity(sessions);
  expect(sorted[0].clarity).toBe(5);
});

test('sortByClarity asc', () => {
  const sessions = [makeSession('a', 4), makeSession('b', 1), makeSession('c', 3)];
  const sorted = sortByClarity(sessions, 'asc');
  expect(sorted[0].clarity).toBe(1);
});
