const { isValidImpact, setImpact, clearImpact, setImpactByName, getImpact, filterByImpact, sortByImpact } = require('./impact');

function makeSession(name, impact) {
  const s = { id: name, name, tabs: [] };
  if (impact) s.impact = impact;
  return s;
}

test('isValidImpact returns true for valid levels', () => {
  expect(isValidImpact('low')).toBe(true);
  expect(isValidImpact('critical')).toBe(true);
  expect(isValidImpact('extreme')).toBe(false);
});

test('setImpact assigns impact to session', () => {
  const s = makeSession('a');
  expect(setImpact(s, 'high').impact).toBe('high');
});

test('setImpact throws on invalid impact', () => {
  expect(() => setImpact(makeSession('a'), 'extreme')).toThrow();
});

test('clearImpact removes impact', () => {
  const s = makeSession('a', 'low');
  expect(clearImpact(s).impact).toBeUndefined();
});

test('setImpactByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setImpactByName(sessions, 'a', 'medium');
  expect(result[0].impact).toBe('medium');
  expect(result[1].impact).toBeUndefined();
});

test('getImpact returns impact or null', () => {
  expect(getImpact(makeSession('a', 'high'))).toBe('high');
  expect(getImpact(makeSession('b'))).toBeNull();
});

test('filterByImpact returns matching sessions', () => {
  const sessions = [makeSession('a', 'high'), makeSession('b', 'low'), makeSession('c', 'high')];
  expect(filterByImpact(sessions, 'high')).toHaveLength(2);
});

test('sortByImpact orders critical first', () => {
  const sessions = [makeSession('a', 'low'), makeSession('b', 'critical'), makeSession('c', 'medium')];
  const sorted = sortByImpact(sessions);
  expect(sorted[0].impact).toBe('critical');
  expect(sorted[2].impact).toBe('low');
});
