const {
  computeCohesion,
  setCohesion,
  setCohesionByName,
  getCohesion,
  sortByCohesion,
  filterByMinCohesion,
} = require('./cohesion');

function makeSession(overrides = {}) {
  return {
    id: 's1',
    name: 'Test',
    tabs: [
      { url: 'https://github.com/foo', title: 'foo repo' },
      { url: 'https://github.com/bar', title: 'bar repo' },
    ],
    tags: ['dev', 'open-source'],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

test('computeCohesion returns a number between 0 and 1', () => {
  const s = makeSession();
  const score = computeCohesion(s);
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(1);
});

test('computeCohesion is higher for same-domain tabs', () => {
  const sameDomain = makeSession();
  const diffDomain = makeSession({
    tabs: [
      { url: 'https://github.com/foo', title: 'foo' },
      { url: 'https://npmjs.com/bar', title: 'bar' },
      { url: 'https://stackoverflow.com/q', title: 'question' },
    ],
  });
  expect(computeCohesion(sameDomain)).toBeGreaterThan(computeCohesion(diffDomain));
});

test('setCohesion attaches cohesion field', () => {
  const s = makeSession();
  const result = setCohesion(s);
  expect(typeof result.cohesion).toBe('number');
  expect(result.cohesion).toBe(computeCohesion(s));
});

test('setCohesion does not mutate original', () => {
  const s = makeSession();
  setCohesion(s);
  expect(s.cohesion).toBeUndefined();
});

test('setCohesionByName only updates matching session', () => {
  const sessions = [makeSession({ id: 's1', name: 'A' }), makeSession({ id: 's2', name: 'B' })];
  const result = setCohesionByName(sessions, 'A');
  expect(result[0].cohesion).toBeDefined();
  expect(result[1].cohesion).toBeUndefined();
});

test('getCohesion returns stored value if present', () => {
  const s = { ...makeSession(), cohesion: 0.77 };
  expect(getCohesion(s)).toBe(0.77);
});

test('getCohesion computes if not stored', () => {
  const s = makeSession();
  expect(typeof getCohesion(s)).toBe('number');
});

test('sortByCohesion desc puts highest first', () => {
  const sessions = [
    { ...makeSession({ name: 'low' }), cohesion: 0.2 },
    { ...makeSession({ name: 'high' }), cohesion: 0.9 },
    { ...makeSession({ name: 'mid' }), cohesion: 0.5 },
  ];
  const sorted = sortByCohesion(sessions);
  expect(sorted[0].cohesion).toBe(0.9);
  expect(sorted[2].cohesion).toBe(0.2);
});

test('sortByCohesion asc puts lowest first', () => {
  const sessions = [
    { ...makeSession({ name: 'low' }), cohesion: 0.2 },
    { ...makeSession({ name: 'high' }), cohesion: 0.9 },
  ];
  const sorted = sortByCohesion(sessions, 'asc');
  expect(sorted[0].cohesion).toBe(0.2);
});

test('filterByMinCohesion returns sessions at or above threshold', () => {
  const sessions = [
    { ...makeSession(), cohesion: 0.3 },
    { ...makeSession(), cohesion: 0.7 },
    { ...makeSession(), cohesion: 0.5 },
  ];
  const result = filterByMinCohesion(sessions, 0.5);
  expect(result).toHaveLength(2);
  expect(result.every(s => s.cohesion >= 0.5)).toBe(true);
});
