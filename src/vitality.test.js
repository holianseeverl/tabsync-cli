const {
  computeVitality,
  getVitality,
  scoreVitality,
  sortByVitality,
  filterByMinVitality
} = require('./vitality');

function makeSession(overrides = {}) {
  return {
    id: 'sess-1',
    name: 'Test Session',
    tabs: [{ url: 'https://example.com' }],
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

describe('computeVitality', () => {
  it('returns a numeric score', () => {
    const s = makeSession({ tabs: [{}, {}, {}], rating: 4, streak: 3 });
    const score = computeVitality(s);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('returns 0 for empty session', () => {
    const s = makeSession({ tabs: [] });
    const score = computeVitality(s);
    expect(score).toBe(0);
  });

  it('increases with more tabs', () => {
    const few = makeSession({ tabs: [{}] });
    const many = makeSession({ tabs: [{}, {}, {}, {}, {}] });
    expect(computeVitality(many)).toBeGreaterThan(computeVitality(few));
  });

  it('increases with higher rating', () => {
    const low = makeSession({ tabs: [{}], rating: 1 });
    const high = makeSession({ tabs: [{}], rating: 5 });
    expect(computeVitality(high)).toBeGreaterThan(computeVitality(low));
  });

  it('increases with higher streak', () => {
    const low = makeSession({ tabs: [{}], streak: 0 });
    const high = makeSession({ tabs: [{}], streak: 10 });
    expect(computeVitality(high)).toBeGreaterThan(computeVitality(low));
  });
});

describe('getVitality', () => {
  it('returns cached vitality if present', () => {
    const s = makeSession({ vitality: 42 });
    expect(getVitality(s)).toBe(42);
  });

  it('computes vitality if not cached', () => {
    const s = makeSession({ tabs: [{}, {}], rating: 3 });
    const v = getVitality(s);
    expect(typeof v).toBe('number');
  });
});

describe('scoreVitality', () => {
  it('attaches vitality to each session', () => {
    const sessions = [
      makeSession({ id: 'a', tabs: [{}] }),
      makeSession({ id: 'b', tabs: [{}, {}] })
    ];
    const scored = scoreVitality(sessions);
    scored.forEach(s => expect(typeof s.vitality).toBe('number'));
  });

  it('returns a new array', () => {
    const sessions = [makeSession()];
    const scored = scoreVitality(sessions);
    expect(scored).not.toBe(sessions);
  });
});

describe('sortByVitality', () => {
  it('sorts sessions descending by vitality', () => {
    const sessions = [
      makeSession({ id: 'a', vitality: 10 }),
      makeSession({ id: 'b', vitality: 50 }),
      makeSession({ id: 'c', vitality: 30 })
    ];
    const sorted = sortByVitality(sessions);
    expect(sorted[0].id).toBe('b');
    expect(sorted[1].id).toBe('c');
    expect(sorted[2].id).toBe('a');
  });
});

describe('filterByMinVitality', () => {
  it('filters sessions below threshold', () => {
    const sessions = [
      makeSession({ id: 'a', vitality: 10 }),
      makeSession({ id: 'b', vitality: 50 }),
      makeSession({ id: 'c', vitality: 30 })
    ];
    const result = filterByMinVitality(sessions, 25);
    expect(result.map(s => s.id)).toEqual(['b', 'c']);
  });

  it('returns all if threshold is 0', () => {
    const sessions = [makeSession({ vitality: 5 }), makeSession({ vitality: 0 })];
    expect(filterByMinVitality(sessions, 0)).toHaveLength(2);
  });
});
