const {
  computeComplexity,
  setComplexity,
  setComplexityByName,
  sortByComplexity,
  filterByMinComplexity,
  complexitySummary
} = require('./complexity');

function makeSession(overrides = {}) {
  return {
    id: 's1',
    name: 'Test',
    tabs: [],
    tags: [],
    ...overrides
  };
}

test('computeComplexity returns 0 for bare session', () => {
  const s = makeSession();
  expect(computeComplexity(s)).toBe(0);
});

test('computeComplexity counts tabs and tags', () => {
  const s = makeSession({ tabs: [{}, {}], tags: ['a', 'b', 'c'] });
  expect(computeComplexity(s)).toBe(7); // 2*2 + 3
});

test('computeComplexity adds bonus for notes and priority', () => {
  const s = makeSession({ notes: 'hello', priority: 'high' });
  expect(computeComplexity(s)).toBe(8); // 5 + 3
});

test('setComplexity attaches _complexity field', () => {
  const s = makeSession({ tabs: [{}] });
  const result = setComplexity(s);
  expect(result._complexity).toBe(2);
});

test('setComplexityByName only updates matching session', () => {
  const sessions = [
    makeSession({ id: 's1', name: 'Alpha', tabs: [{}, {}] }),
    makeSession({ id: 's2', name: 'Beta' })
  ];
  const result = setComplexityByName(sessions, 'Alpha');
  expect(result[0]._complexity).toBe(4);
  expect(result[1]._complexity).toBeUndefined();
});

test('sortByComplexity desc puts highest first', () => {
  const sessions = [
    makeSession({ name: 'Low' }),
    makeSession({ name: 'High', tabs: [{}, {}, {}], tags: ['x'] })
  ];
  const sorted = sortByComplexity(sessions, 'desc');
  expect(sorted[0].name).toBe('High');
});

test('sortByComplexity asc puts lowest first', () => {
  const sessions = [
    makeSession({ name: 'High', tabs: [{}, {}, {}] }),
    makeSession({ name: 'Low' })
  ];
  const sorted = sortByComplexity(sessions, 'asc');
  expect(sorted[0].name).toBe('Low');
});

test('filterByMinComplexity filters correctly', () => {
  const sessions = [
    makeSession({ name: 'A', tabs: [] }),
    makeSession({ name: 'B', tabs: [{}, {}, {}] })
  ];
  const result = filterByMinComplexity(sessions, 5);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('B');
});

test('complexitySummary returns name and score pairs', () => {
  const sessions = [makeSession({ name: 'X', tabs: [{}] })];
  const summary = complexitySummary(sessions);
  expect(summary[0]).toEqual({ name: 'X', complexity: 2 });
});
