const {
  computeMomentum,
  getMomentum,
  sortByMomentum,
  filterByMinMomentum,
  filterByLevel,
  MOMENTUM_LEVELS
} = require('./momentum');

function makeSession(overrides = {}) {
  return {
    id: 's1',
    name: 'Test',
    tabs: [],
    streak: 0,
    pulses: [],
    trackedMs: 0,
    ...overrides
  };
}

describe('computeMomentum', () => {
  test('returns stalled for empty session', () => {
    const s = makeSession();
    const result = computeMomentum(s);
    expect(result.score).toBe(0);
    expect(result.level).toBe('stalled');
  });

  test('high streak contributes 3 points', () => {
    const s = makeSession({ streak: 10 });
    const result = computeMomentum(s);
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  test('many pulses contribute points', () => {
    const s = makeSession({ pulses: new Array(10).fill({ ts: Date.now() }) });
    const result = computeMomentum(s);
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  test('tracked time over 5 hours adds 2 points', () => {
    const s = makeSession({ trackedMs: 6 * 60 * 60 * 1000 });
    const result = computeMomentum(s);
    expect(result.score).toBeGreaterThanOrEqual(2);
  });

  test('old lastActive applies drift penalty', () => {
    const longAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
    const s = makeSession({ streak: 5, lastActive: longAgo });
    const base = computeMomentum(makeSession({ streak: 5 }));
    const drifted = computeMomentum(s);
    expect(drifted.score).toBeLessThan(base.score);
  });

  test('score is capped between 0 and 8', () => {
    const s = makeSession({
      streak: 20,
      pulses: new Array(20).fill({ ts: Date.now() }),
      trackedMs: 10 * 60 * 60 * 1000
    });
    const result = computeMomentum(s);
    expect(result.score).toBeLessThanOrEqual(8);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  test('level is one of MOMENTUM_LEVELS', () => {
    const s = makeSession({ streak: 3, pulses: [1, 2, 3] });
    const result = computeMomentum(s);
    expect(MOMENTUM_LEVELS).toContain(result.level);
  });
});

describe('sortByMomentum', () => {
  test('sorts descending by default', () => {
    const sessions = [
      makeSession({ id: 'a', streak: 0 }),
      makeSession({ id: 'b', streak: 10, pulses: new Array(10).fill({}) })
    ];
    const sorted = sortByMomentum(sessions);
    expect(sorted[0].id).toBe('b');
  });

  test('sorts ascending when flag set', () => {
    const sessions = [
      makeSession({ id: 'a', streak: 0 }),
      makeSession({ id: 'b', streak: 10, pulses: new Array(10).fill({}) })
    ];
    const sorted = sortByMomentum(sessions, true);
    expect(sorted[0].id).toBe('a');
  });
});

describe('filterByMinMomentum', () => {
  test('returns sessions at or above min score', () => {
    const sessions = [
      makeSession({ id: 'low' }),
      makeSession({ id: 'high', streak: 10, pulses: new Array(10).fill({}) })
    ];
    const result = filterByMinMomentum(sessions, 4);
    expect(result.every(s => computeMomentum(s).score >= 4)).toBe(true);
  });
});

describe('filterByLevel', () => {
  test('returns empty array for invalid level', () => {
    const sessions = [makeSession()];
    expect(filterByLevel(sessions, 'invalid')).toEqual([]);
  });

  test('returns sessions matching level', () => {
    const sessions = [makeSession()];
    const level = computeMomentum(sessions[0]).level;
    const result = filterByLevel(sessions, level);
    expect(result.length).toBe(1);
  });
});
