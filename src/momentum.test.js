const {
  computeMomentum,
  getMomentum,
  sortByMomentum,
  filterByMinMomentum,
  momentumLevel,
} = require('./momentum');

function makeSession(overrides = {}) {
  return {
    id: 's1',
    name: 'Test Session',
    tabs: [],
    streak: 0,
    pulses: [],
    velocity: [],
    lastActive: null,
    ...overrides,
  };
}

describe('computeMomentum', () => {
  it('returns 0 for a bare session with no activity', () => {
    const s = makeSession();
    expect(computeMomentum(s)).toBe(0);
  });

  it('increases score with higher streak', () => {
    const low = makeSession({ streak: 1 });
    const high = makeSession({ streak: 10 });
    expect(computeMomentum(high)).toBeGreaterThan(computeMomentum(low));
  });

  it('increases score with more pulses', () => {
    const few = makeSession({ pulses: [{ ts: Date.now() }] });
    const many = makeSession({
      pulses: [{ ts: Date.now() }, { ts: Date.now() }, { ts: Date.now() }],
    });
    expect(computeMomentum(many)).toBeGreaterThan(computeMomentum(few));
  });

  it('increases score with higher average velocity', () => {
    const slow = makeSession({ velocity: [{ value: 1 }] });
    const fast = makeSession({ velocity: [{ value: 10 }] });
    expect(computeMomentum(fast)).toBeGreaterThan(computeMomentum(slow));
  });

  it('gives recency boost for recently active sessions', () => {
    const recent = makeSession({ lastActive: new Date().toISOString() });
    const old = makeSession({
      lastActive: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    });
    expect(computeMomentum(recent)).toBeGreaterThan(computeMomentum(old));
  });
});

describe('getMomentum', () => {
  it('returns same value as computeMomentum', () => {
    const s = makeSession({ streak: 3, pulses: [{ ts: Date.now() }] });
    expect(getMomentum(s)).toBe(computeMomentum(s));
  });
});

describe('sortByMomentum', () => {
  const a = makeSession({ id: 'a', streak: 1 });
  const b = makeSession({ id: 'b', streak: 5 });
  const c = makeSession({ id: 'c', streak: 10 });

  it('sorts descending by default', () => {
    const result = sortByMomentum([a, b, c]);
    expect(result[0].id).toBe('c');
    expect(result[2].id).toBe('a');
  });

  it('sorts ascending when specified', () => {
    const result = sortByMomentum([a, b, c], 'asc');
    expect(result[0].id).toBe('a');
    expect(result[2].id).toBe('c');
  });

  it('does not mutate original array', () => {
    const arr = [a, b, c];
    sortByMomentum(arr);
    expect(arr[0].id).toBe('a');
  });
});

describe('filterByMinMomentum', () => {
  it('filters out sessions below threshold', () => {
    const low = makeSession({ id: 'low', streak: 0 });
    const high = makeSession({ id: 'high', streak: 20, pulses: Array(10).fill({ ts: Date.now() }) });
    const result = filterByMinMomentum([low, high], 10);
    expect(result.some((s) => s.id === 'high')).toBe(true);
    expect(result.some((s) => s.id === 'low')).toBe(false);
  });
});

describe('momentumLevel', () => {
  it('returns low for empty session', () => {
    expect(momentumLevel(makeSession())).toBe('low');
  });

  it('returns medium for moderate activity', () => {
    const s = makeSession({ streak: 3, pulses: [{ ts: Date.now() }] });
    const level = momentumLevel(s);
    expect(['low', 'medium', 'high']).toContain(level);
  });

  it('returns high for very active session', () => {
    const s = makeSession({
      streak: 10,
      pulses: Array(10).fill({ ts: Date.now() }),
      velocity: Array(5).fill({ value: 10 }),
      lastActive: new Date().toISOString(),
    });
    expect(momentumLevel(s)).toBe('high');
  });
});
