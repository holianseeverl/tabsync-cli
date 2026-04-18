const { computeComplexity, getComplexity, setComplexity, setComplexityByName, sortByComplexity, filterByMinComplexity, filterByMaxComplexity } = require('./complexity');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

test('computeComplexity returns 0 for no tabs', () => {
  const s = makeSession({ tabs: [] });
  expect(computeComplexity(s)).toBe(0);
});

test('computeComplexity based on tab count', () => {
  const s = makeSession({ tabs: [1, 2, 3, 4, 5] });
  expect(computeComplexity(s)).toBeGreaterThan(0);
});

test('setComplexity sets value on session', () => {
  const s = makeSession();
  const result = setComplexity(s, 7);
  expect(result.complexity).toBe(7);
});

test('getComplexity returns complexity field', () => {
  const s = makeSession({ complexity: 4 });
  expect(getComplexity(s)).toBe(4);
});

test('getComplexity returns null if not set', () => {
  const s = makeSession();
  expect(getComplexity(s)).toBeNull();
});

test('setComplexityByName updates matching session', () => {
  const sessions = [makeSession({ name: 'Alpha' }), makeSession({ id: 's2', name: 'Beta' })];
  const result = setComplexityByName(sessions, 'Alpha', 9);
  expect(result.find(s => s.name === 'Alpha').complexity).toBe(9);
  expect(result.find(s => s.name === 'Beta').complexity).toBeUndefined();
});

test('sortByComplexity orders ascending', () => {
  const sessions = [
    makeSession({ name: 'A', complexity: 5 }),
    makeSession({ name: 'B', complexity: 2 }),
    makeSession({ name: 'C', complexity: 8 }),
  ];
  const sorted = sortByComplexity(sessions);
  expect(sorted.map(s => s.name)).toEqual(['B', 'A', 'C']);
});

test('filterByMinComplexity filters correctly', () => {
  const sessions = [
    makeSession({ name: 'A', complexity: 3 }),
    makeSession({ name: 'B', complexity: 7 }),
  ];
  expect(filterByMinComplexity(sessions, 5).map(s => s.name)).toEqual(['B']);
});

test('filterByMaxComplexity filters correctly', () => {
  const sessions = [
    makeSession({ name: 'A', complexity: 3 }),
    makeSession({ name: 'B', complexity: 7 }),
  ];
  expect(filterByMaxComplexity(sessions, 5).map(s => s.name)).toEqual(['A']);
});
