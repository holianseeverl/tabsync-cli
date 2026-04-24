const {
  computeVitality,
  getVitality,
  scoreVitality,
  sortByVitality,
  filterByMinVitality,
} = require('./vitality');

function makeSession(overrides = {}) {
  return {
    id: 'session-1',
    name: 'Test Session',
    tabs: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('computeVitality', () => {
  test('returns 0 for empty session', () => {
    const s = makeSession();
    expect(computeVitality(s)).toBe(0);
  });

  test('accounts for streak contribution', () => {
    const s = makeSession({ streak: 10 });
    const v = computeVitality(s);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeCloseTo(0.25, 2);
  });

  test('accounts for progress contribution', () => {
    const s = makeSession({ progress: 100 });
    const v = computeVitality(s);
    expect(v).toBeCloseTo(0.20, 2);
  });

  test('accounts for rating contribution', () => {
    const s = makeSession({ rating: 5 });
    const v = computeVitality(s);
    expect(v).toBeCloseTo(0.15, 2);
  });

  test('accounts for pulse count', () => {
    const s = makeSession({ pulses: new Array(20).fill({ ts: Date.now() }) });
    const v = computeVitality(s);
    expect(v).toBeCloseTo(0.20, 2);
  });

  test('caps streak at 10 for normalization', () => {
    const s1 = makeSession({ streak: 10 });
    const s2 = makeSession({ streak: 50 });
    expect(computeVitality(s1)).toBe(computeVitality(s2));
  });

  test('recent lastActive gives high drift score', () => {
    const s = makeSession({ lastActive: new Date().toISOString() });
    const v = computeVitality(s);
    expect(v).toBeGreaterThanOrEqual(0.19);
  });

  test('old lastActive gives low drift score', () => {
    const old = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const s = makeSession({ lastActive: old });
    const v = computeVitality(s);
    expect(v).toBeLessThan(0.05);
  });
});

describe('getVitality', () => {
  test('returns stored vitality if present', () => {
    const s = makeSession({ vitality: 0.77 });
    expect(getVitality(s)).toBe(0.77);
  });

  test('computes vitality if not stored', () => {
    const s = makeSession({ streak: 5 });
    expect(getVitality(s)).toBe(computeVitality(s));
  });
});

describe('scoreVitality', () => {
  test('attaches vitality to all sessions', () => {
    const sessions = [makeSession({ streak: 3 }), makeSession({ progress: 50 })];
    const scored = scoreVitality(sessions);
    scored.forEach(s => expect(typeof s.vitality).toBe('number'));
  });
});

describe('sortByVitality', () => {
  test('sorts descending by default', () => {
    const sessions = [
      makeSession({ streak: 1 }),
      makeSession({ streak: 10 }),
      makeSession({ streak: 5 }),
    ];
    const sorted = sortByVitality(sessions);
    expect(sorted[0].vitality).toBeGreaterThanOrEqual(sorted[1].vitality);
    expect(sorted[1].vitality).toBeGreaterThanOrEqual(sorted[2].vitality);
  });

  test('sorts ascending when specified', () => {
    const sessions = [
      makeSession({ streak: 1 }),
      makeSession({ streak: 10 }),
    ];
    const sorted = sortByVitality(sessions, 'asc');
    expect(sorted[0].vitality).toBeLessThanOrEqual(sorted[1].vitality);
  });
});

describe('filterByMinVitality', () => {
  test('filters out sessions below threshold', () => {
    const sessions = [
      makeSession({ streak: 0 }),
      makeSession({ streak: 10, progress: 100, rating: 5 }),
    ];
    const result = filterByMinVitality(sessions, 0.3);
    expect(result.length).toBe(1);
    expect(result[0].vitality).toBeGreaterThanOrEqual(0.3);
  });

  test('returns all if threshold is 0', () => {
    const sessions = [makeSession(), makeSession()];
    expect(filterByMinVitality(sessions, 0).length).toBe(2);
  });
});
