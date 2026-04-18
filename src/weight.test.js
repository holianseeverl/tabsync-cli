const { isValidWeight, setWeight, clearWeight, setWeightByName, getWeight, filterByMinWeight, filterByMaxWeight, sortByWeight } = require('./weight');

const makeSession = (name, weight) => ({ id: name, name, ...(weight !== undefined ? { weight } : {}) });

test('isValidWeight accepts valid numbers', () => {
  expect(isValidWeight(0)).toBe(true);
  expect(isValidWeight(50)).toBe(true);
  expect(isValidWeight(100)).toBe(true);
});

test('isValidWeight rejects out of range', () => {
  expect(isValidWeight(-1)).toBe(false);
  expect(isValidWeight(101)).toBe(false);
  expect(isValidWeight('high')).toBe(false);
});

test('setWeight assigns weight', () => {
  const s = makeSession('a');
  expect(setWeight(s, 42).weight).toBe(42);
});

test('setWeight throws on invalid weight', () => {
  expect(() => setWeight(makeSession('a'), 200)).toThrow();
});

test('clearWeight removes weight', () => {
  const s = makeSession('a', 10);
  expect(clearWeight(s).weight).toBeUndefined();
});

test('setWeightByName updates matching session', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 20)];
  const result = setWeightByName(sessions, 'a', 55);
  expect(result.find(s => s.name === 'a').weight).toBe(55);
  expect(result.find(s => s.name === 'b').weight).toBe(20);
});

test('getWeight returns weight or null', () => {
  expect(getWeight(makeSession('a', 30))).toBe(30);
  expect(getWeight(makeSession('b'))).toBeNull();
});

test('filterByMinWeight filters correctly', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 50), makeSession('c', 80)];
  expect(filterByMinWeight(sessions, 50).map(s => s.name)).toEqual(['b', 'c']);
});

test('filterByMaxWeight filters correctly', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 50), makeSession('c', 80)];
  expect(filterByMaxWeight(sessions, 50).map(s => s.name)).toEqual(['a', 'b']);
});

test('sortByWeight sorts descending by default', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 80), makeSession('c', 40)];
  const result = sortByWeight(sessions);
  expect(result.map(s => s.name)).toEqual(['b', 'c', 'a']);
});

test('sortByWeight sorts ascending', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 80), makeSession('c', 40)];
  const result = sortByWeight(sessions, 'asc');
  expect(result.map(s => s.name)).toEqual(['a', 'c', 'b']);
});
