const { isValidSignal, setSignal, clearSignal, setSignalByName, getSignal, filterBySignal, filterByMinSignal, sortBySignal } = require('./signal');

function makeSession(name, signal) {
  const s = { id: name, name, tabs: [] };
  if (signal !== undefined) s.signal = signal;
  return s;
}

test('isValidSignal accepts 1-5', () => {
  expect(isValidSignal(1)).toBe(true);
  expect(isValidSignal(5)).toBe(true);
  expect(isValidSignal(3)).toBe(true);
});

test('isValidSignal rejects invalid values', () => {
  expect(isValidSignal(0)).toBe(false);
  expect(isValidSignal(6)).toBe(false);
  expect(isValidSignal('high')).toBe(false);
});

test('setSignal sets signal on session', () => {
  const s = makeSession('a');
  expect(setSignal(s, 3).signal).toBe(3);
});

test('setSignal throws on invalid value', () => {
  expect(() => setSignal(makeSession('a'), 9)).toThrow();
});

test('clearSignal removes signal', () => {
  const s = makeSession('a', 4);
  expect(clearSignal(s).signal).toBeUndefined();
});

test('setSignalByName updates matching session', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 2)];
  const result = setSignalByName(sessions, 'a', 5);
  expect(result.find(s => s.name === 'a').signal).toBe(5);
  expect(result.find(s => s.name === 'b').signal).toBe(2);
});

test('getSignal returns signal or null', () => {
  expect(getSignal(makeSession('a', 3))).toBe(3);
  expect(getSignal(makeSession('b'))).toBeNull();
});

test('filterBySignal returns matching sessions', () => {
  const sessions = [makeSession('a', 2), makeSession('b', 4), makeSession('c', 2)];
  expect(filterBySignal(sessions, 2).map(s => s.name)).toEqual(['a', 'c']);
});

test('filterByMinSignal returns sessions at or above threshold', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 3), makeSession('c', 5)];
  expect(filterByMinSignal(sessions, 3).map(s => s.name)).toEqual(['b', 'c']);
});

test('sortBySignal desc by default', () => {
  const sessions = [makeSession('a', 2), makeSession('b', 5), makeSession('c', 1)];
  const sorted = sortBySignal(sessions);
  expect(sorted.map(s => s.signal)).toEqual([5, 2, 1]);
});

test('sortBySignal asc', () => {
  const sessions = [makeSession('a', 2), makeSession('b', 5), makeSession('c', 1)];
  const sorted = sortBySignal(sessions, 'asc');
  expect(sorted.map(s => s.signal)).toEqual([1, 2, 5]);
});
