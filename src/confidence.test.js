const {
  isValidConfidence,
  setConfidence,
  clearConfidence,
  setConfidenceByName,
  getConfidence,
  filterByMinConfidence,
  sortByConfidence,
} = require('./confidence');

const makeSession = (name, confidence) => ({ id: name, name, ...(confidence !== undefined ? { confidence } : {}) });

test('isValidConfidence accepts 0–100', () => {
  expect(isValidConfidence(0)).toBe(true);
  expect(isValidConfidence(50)).toBe(true);
  expect(isValidConfidence(100)).toBe(true);
  expect(isValidConfidence(-1)).toBe(false);
  expect(isValidConfidence(101)).toBe(false);
  expect(isValidConfidence('high')).toBe(false);
});

test('setConfidence sets value', () => {
  const s = makeSession('work');
  const result = setConfidence(s, 80);
  expect(result.confidence).toBe(80);
});

test('setConfidence throws on invalid', () => {
  expect(() => setConfidence(makeSession('x'), 150)).toThrow();
});

test('clearConfidence removes field', () => {
  const s = makeSession('work', 70);
  const result = clearConfidence(s);
  expect(result.confidence).toBeUndefined();
});

test('setConfidenceByName updates matching session', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 20)];
  const result = setConfidenceByName(sessions, 'a', 90);
  expect(result[0].confidence).toBe(90);
  expect(result[1].confidence).toBe(20);
});

test('getConfidence returns value or null', () => {
  expect(getConfidence(makeSession('a', 55))).toBe(55);
  expect(getConfidence(makeSession('b'))).toBeNull();
});

test('filterByMinConfidence filters correctly', () => {
  const sessions = [makeSession('a', 30), makeSession('b', 70), makeSession('c', 50)];
  const result = filterByMinConfidence(sessions, 50);
  expect(result.map(s => s.name)).toEqual(['b', 'c']);
});

test('sortByConfidence sorts desc by default', () => {
  const sessions = [makeSession('a', 40), makeSession('b', 90), makeSession('c', 60)];
  const result = sortByConfidence(sessions);
  expect(result.map(s => s.name)).toEqual(['b', 'c', 'a']);
});

test('sortByConfidence sorts asc', () => {
  const sessions = [makeSession('a', 40), makeSession('b', 90), makeSession('c', 60)];
  const result = sortByConfidence(sessions, 'asc');
  expect(result.map(s => s.name)).toEqual(['a', 'c', 'b']);
});
