const {
  isValidCapacity,
  setCapacity,
  clearCapacity,
  setCapacityByName,
  getCapacity,
  isOverCapacity,
  filterOverCapacity,
  filterUnderCapacity,
  sortByCapacityUsage,
  DEFAULT_CAPACITY,
} = require('./capacity');

const makeSession = (name, tabCount, capacity) => ({
  id: name,
  name,
  tabs: Array(tabCount).fill({ url: 'http://example.com' }),
  ...(capacity !== undefined ? { capacity } : {}),
});

test('isValidCapacity accepts positive integers', () => {
  expect(isValidCapacity(10)).toBe(true);
  expect(isValidCapacity(1)).toBe(true);
});

test('isValidCapacity rejects invalid values', () => {
  expect(isValidCapacity(0)).toBe(false);
  expect(isValidCapacity(-5)).toBe(false);
  expect(isValidCapacity(1.5)).toBe(false);
  expect(isValidCapacity('10')).toBe(false);
});

test('setCapacity sets capacity on session', () => {
  const s = makeSession('a', 5);
  expect(setCapacity(s, 15).capacity).toBe(15);
});

test('setCapacity throws on invalid limit', () => {
  expect(() => setCapacity(makeSession('a', 5), 0)).toThrow();
});

test('clearCapacity removes capacity', () => {
  const s = setCapacity(makeSession('a', 5), 10);
  expect(clearCapacity(s).capacity).toBeUndefined();
});

test('setCapacityByName only updates matching session', () => {
  const sessions = [makeSession('a', 3), makeSession('b', 3)];
  const result = setCapacityByName(sessions, 'a', 8);
  expect(result[0].capacity).toBe(8);
  expect(result[1].capacity).toBeUndefined();
});

test('getCapacity returns default when not set', () => {
  expect(getCapacity(makeSession('a', 5))).toBe(DEFAULT_CAPACITY);
});

test('isOverCapacity detects exceeded capacity', () => {
  const s = setCapacity(makeSession('a', 10), 5);
  expect(isOverCapacity(s)).toBe(true);
});

test('isOverCapacity false when under limit', () => {
  const s = setCapacity(makeSession('a', 3), 10);
  expect(isOverCapacity(s)).toBe(false);
});

test('filterOverCapacity returns only over-capacity sessions', () => {
  const sessions = [
    setCapacity(makeSession('a', 10), 5),
    setCapacity(makeSession('b', 2), 5),
  ];
  expect(filterOverCapacity(sessions).map(s => s.name)).toEqual(['a']);
});

test('sortByCapacityUsage sorts by usage ratio descending', () => {
  const sessions = [
    setCapacity(makeSession('low', 1), 10),
    setCapacity(makeSession('high', 9), 10),
    setCapacity(makeSession('mid', 5), 10),
  ];
  const sorted = sortByCapacityUsage(sessions);
  expect(sorted[0].name).toBe('high');
  expect(sorted[2].name).toBe('low');
});
