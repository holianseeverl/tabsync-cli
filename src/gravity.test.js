const { computeGravity, getGravity, sortByGravity, filterByMinGravity, gravityLevel } = require('./gravity');

function makeSession(overrides = {}) {
  return {
    id: 'abc',
    name: 'Test Session',
    createdAt: new Date().toISOString(),
    tabs: [{ url: 'https://example.com' }],
    priority: 'medium',
    rating: 3,
    ...overrides
  };
}

describe('computeGravity', () => {
  test('returns a number between 0 and 1', () => {
    const g = computeGravity(makeSession());
    expect(g).toBeGreaterThanOrEqual(0);
    expect(g).toBeLessThanOrEqual(1);
  });

  test('high priority and rating increases gravity', () => {
    const low = makeSession({ priority: 'low', rating: 1 });
    const high = makeSession({ priority: 'high', rating: 5 });
    expect(computeGravity(high)).toBeGreaterThan(computeGravity(low));
  });

  test('older sessions have lower recency score', () => {
    const recent = makeSession({ createdAt: new Date().toISOString() });
    const old = makeSession({ createdAt: new Date(Date.now() - 40 * 86400000).toISOString() });
    expect(computeGravity(recent)).toBeGreaterThan(computeGravity(old));
  });

  test('more tabs increases gravity', () => {
    const few = makeSession({ tabs: [{ url: 'a' }] });
    const many = makeSession({ tabs: Array(20).fill({ url: 'a' }) });
    expect(computeGravity(many)).toBeGreaterThan(computeGravity(few));
  });
});

describe('getGravity', () => {
  test('returns id, name, and gravity', () => {
    const s = makeSession({ id: 'x1', name: 'My Session' });
    const result = getGravity(s);
    expect(result.id).toBe('x1');
    expect(result.name).toBe('My Session');
    expect(typeof result.gravity).toBe('number');
  });
});

describe('sortByGravity', () => {
  test('sorts descending by gravity', () => {
    const sessions = [
      makeSession({ priority: 'low', rating: 1 }),
      makeSession({ priority: 'high', rating: 5 })
    ];
    const sorted = sortByGravity(sessions);
    expect(computeGravity(sorted[0])).toBeGreaterThanOrEqual(computeGravity(sorted[1]));
  });
});

describe('filterByMinGravity', () => {
  test('filters sessions below threshold', () => {
    const s1 = makeSession({ priority: 'high', rating: 5 });
    const s2 = makeSession({ priority: 'low', rating: 1, createdAt: new Date(Date.now() - 40 * 86400000).toISOString() });
    const result = filterByMinGravity([s1, s2], 0.5);
    expect(result).toContain(s1);
    expect(result).not.toContain(s2);
  });
});

describe('gravityLevel', () => {
  test('returns high for strong sessions', () => {
    const s = makeSession({ priority: 'high', rating: 5, tabs: Array(20).fill({ url: 'a' }) });
    expect(gravityLevel(s)).toBe('high');
  });

  test('returns low for weak sessions', () => {
    const s = makeSession({
      priority: 'low',
      rating: 0,
      tabs: [],
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
    });
    expect(gravityLevel(s)).toBe('low');
  });
});
