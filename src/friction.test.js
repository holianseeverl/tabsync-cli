const {
  isValidFriction,
  setFriction,
  clearFriction,
  setFrictionByName,
  getFriction,
  filterByFriction,
  sortByFriction,
  listHighFriction
} = require('./friction');

function makeSession(name, friction) {
  const s = { id: name, name, tabs: [] };
  if (friction) s.friction = friction;
  return s;
}

test('isValidFriction accepts valid levels', () => {
  expect(isValidFriction('none')).toBe(true);
  expect(isValidFriction('low')).toBe(true);
  expect(isValidFriction('blocking')).toBe(true);
});

test('isValidFriction rejects invalid levels', () => {
  expect(isValidFriction('extreme')).toBe(false);
  expect(isValidFriction('')).toBe(false);
});

test('setFriction sets friction on session', () => {
  const s = makeSession('s1');
  const result = setFriction(s, 'medium');
  expect(result.friction).toBe('medium');
  expect(s.friction).toBeUndefined();
});

test('setFriction throws on invalid level', () => {
  expect(() => setFriction(makeSession('s1'), 'extreme')).toThrow();
});

test('clearFriction removes friction', () => {
  const s = makeSession('s1', 'high');
  const result = clearFriction(s);
  expect(result.friction).toBeUndefined();
});

test('setFrictionByName updates matching session', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'none')];
  const result = setFrictionByName(sessions, 'a', 'high');
  expect(result[0].friction).toBe('high');
  expect(result[1].friction).toBe('none');
});

test('getFriction returns friction or null', () => {
  expect(getFriction(makeSession('s1', 'low'))).toBe('low');
  expect(getFriction(makeSession('s1'))).toBeNull();
});

test('filterByFriction returns matching sessions', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'high'), makeSession('c', 'low')];
  expect(filterByFriction(sessions, 'low')).toHaveLength(2);
});

test('sortByFriction orders by severity descending', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'blocking'), makeSession('c', 'medium')];
  const sorted = sortByFriction(sessions);
  expect(sorted[0].friction).toBe('blocking');
  expect(sorted[2].friction).toBe('low');
});

test('listHighFriction returns high and blocking only', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'blocking'), makeSession('c', 'high'), makeSession('d', 'none')];
  const result = listHighFriction(sessions);
  expect(result).toHaveLength(2);
  expect(result.map(s => s.name)).toEqual(['b', 'c']);
});
