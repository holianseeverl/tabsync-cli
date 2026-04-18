const {
  isValidEnergy,
  setEnergy,
  clearEnergy,
  setEnergyByName,
  getEnergy,
  filterByEnergy,
  filterByMinEnergy,
  sortByEnergy,
} = require('./energy');

function makeSession(name, energy) {
  const s = { id: name, name, tabs: [] };
  if (energy !== undefined) s.energy = energy;
  return s;
}

test('isValidEnergy accepts 1-5', () => {
  [1, 2, 3, 4, 5].forEach(l => expect(isValidEnergy(l)).toBe(true));
});

test('isValidEnergy rejects 0 and 6', () => {
  expect(isValidEnergy(0)).toBe(false);
  expect(isValidEnergy(6)).toBe(false);
});

test('setEnergy sets level', () => {
  const s = makeSession('a');
  expect(setEnergy(s, 3).energy).toBe(3);
});

test('setEnergy throws on invalid level', () => {
  expect(() => setEnergy(makeSession('a'), 7)).toThrow();
});

test('clearEnergy removes energy', () => {
  const s = makeSession('a', 4);
  expect(clearEnergy(s).energy).toBeUndefined();
});

test('setEnergyByName updates matching session', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 2)];
  const result = setEnergyByName(sessions, 'a', 5);
  expect(result.find(s => s.name === 'a').energy).toBe(5);
  expect(result.find(s => s.name === 'b').energy).toBe(2);
});

test('getEnergy returns null if not set', () => {
  expect(getEnergy(makeSession('a'))).toBeNull();
});

test('filterByEnergy returns matching sessions', () => {
  const sessions = [makeSession('a', 3), makeSession('b', 5), makeSession('c', 3)];
  expect(filterByEnergy(sessions, 3).map(s => s.name)).toEqual(['a', 'c']);
});

test('filterByMinEnergy returns sessions at or above min', () => {
  const sessions = [makeSession('a', 2), makeSession('b', 4), makeSession('c', 5)];
  expect(filterByMinEnergy(sessions, 4).map(s => s.name)).toEqual(['b', 'c']);
});

test('sortByEnergy desc by default', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 5), makeSession('c', 3)];
  const sorted = sortByEnergy(sessions);
  expect(sorted.map(s => s.energy)).toEqual([5, 3, 1]);
});

test('sortByEnergy asc', () => {
  const sessions = [makeSession('a', 4), makeSession('b', 1), makeSession('c', 2)];
  const sorted = sortByEnergy(sessions, 'asc');
  expect(sorted.map(s => s.energy)).toEqual([1, 2, 4]);
});
