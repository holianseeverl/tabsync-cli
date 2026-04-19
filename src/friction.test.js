const {
  isValidFriction,
  setFriction,
  clearFriction,
  setFrictionByName,
  getFriction,
  filterByFriction,
  filterByMinFriction,
  sortByFriction,
} = require('./friction');

function makeSession(id, name, friction) {
  return { id, name, friction };
}

test('isValidFriction accepts 1–5', () => {
  expect(isValidFriction(1)).toBe(true);
  expect(isValidFriction(5)).toBe(true);
  expect(isValidFriction(0)).toBe(false);
  expect(isValidFriction(6)).toBe(false);
});

test('setFriction sets friction on matching session', () => {
  const sessions = [makeSession('a', 'Alpha', null), makeSession('b', 'Beta', null)];
  const result = setFriction(sessions, 'a', 3);
  expect(result.find(s => s.id === 'a').friction).toBe(3);
  expect(result.find(s => s.id === 'b').friction).toBeNull();
});

test('setFriction throws on invalid value', () => {
  const sessions = [makeSession('a', 'Alpha', null)];
  expect(() => setFriction(sessions, 'a', 7)).toThrow('Invalid friction value');
});

test('clearFriction removes friction', () => {
  const sessions = [makeSession('a', 'Alpha', 4)];
  const result = clearFriction(sessions, 'a');
  expect(result[0].friction).toBeUndefined();
});

test('setFrictionByName finds by name and sets', () => {
  const sessions = [makeSession('a', 'Alpha', null)];
  const result = setFrictionByName(sessions, 'Alpha', 2);
  expect(result[0].friction).toBe(2);
});

test('setFrictionByName throws if not found', () => {
  expect(() => setFrictionByName([], 'Ghost', 1)).toThrow('Session not found');
});

test('getFriction returns value or null', () => {
  expect(getFriction({ friction: 3 })).toBe(3);
  expect(getFriction({})).toBeNull();
});

test('filterByFriction returns matching sessions', () => {
  const sessions = [makeSession('a', 'A', 2), makeSession('b', 'B', 4), makeSession('c', 'C', 2)];
  expect(filterByFriction(sessions, 2).map(s => s.id)).toEqual(['a', 'c']);
});

test('filterByMinFriction returns sessions at or above threshold', () => {
  const sessions = [makeSession('a', 'A', 1), makeSession('b', 'B', 3), makeSession('c', 'C', 5)];
  expect(filterByMinFriction(sessions, 3).map(s => s.id)).toEqual(['b', 'c']);
});

test('sortByFriction sorts descending by default', () => {
  const sessions = [makeSession('a', 'A', 2), makeSession('b', 'B', 5), makeSession('c', 'C', 1)];
  const result = sortByFriction(sessions);
  expect(result.map(s => s.id)).toEqual(['b', 'a', 'c']);
});

test('sortByFriction sorts ascending', () => {
  const sessions = [makeSession('a', 'A', 2), makeSession('b', 'B', 5), makeSession('c', 'C', 1)];
  const result = sortByFriction(sessions, 'asc');
  expect(result.map(s => s.id)).toEqual(['c', 'a', 'b']);
});
