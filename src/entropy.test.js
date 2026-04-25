const {
  isValidEntropy,
  computeEntropy,
  setEntropy,
  clearEntropy,
  setEntropyByName,
  getEntropy,
  filterByEntropy,
  sortByEntropy,
  ENTROPY_LEVELS
} = require('./entropy');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], ...overrides };
}

describe('isValidEntropy', () => {
  test('accepts valid levels', () => {
    ENTROPY_LEVELS.forEach(l => expect(isValidEntropy(l)).toBe(true));
  });

  test('rejects invalid level', () => {
    expect(isValidEntropy('extreme')).toBe(false);
    expect(isValidEntropy('')).toBe(false);
  });
});

describe('computeEntropy', () => {
  test('returns calm for minimal session', () => {
    expect(computeEntropy(makeSession())).toBe('calm');
  });

  test('returns high for many tabs + high friction', () => {
    const s = makeSession({ tabs: new Array(25).fill({}), friction: 'high', tension: 'high' });
    expect(['high', 'chaotic']).toContain(computeEntropy(s));
  });

  test('low clarity increases entropy', () => {
    const s = makeSession({ clarity: 'low', tabs: new Array(6).fill({}) });
    const level = computeEntropy(s);
    expect(['moderate', 'high', 'chaotic']).toContain(level);
  });

  test('no priority bumps score', () => {
    const s = makeSession({ tabs: new Array(6).fill({}) });
    const level = computeEntropy(s);
    expect(level).not.toBe('calm');
  });
});

describe('setEntropy', () => {
  test('sets entropy on session', () => {
    const s = setEntropy(makeSession(), 'moderate');
    expect(s.entropy).toBe('moderate');
  });

  test('throws on invalid value', () => {
    expect(() => setEntropy(makeSession(), 'extreme')).toThrow();
  });
});

describe('clearEntropy', () => {
  test('removes entropy field', () => {
    const s = clearEntropy(makeSession({ entropy: 'high' }));
    expect(s.entropy).toBeUndefined();
  });
});

describe('setEntropyByName', () => {
  test('sets entropy on matching session', () => {
    const sessions = [makeSession({ name: 'Alpha' }), makeSession({ id: '2', name: 'Beta' })];
    const result = setEntropyByName(sessions, 'Alpha', 'low');
    expect(result[0].entropy).toBe('low');
    expect(result[1].entropy).toBeUndefined();
  });
});

describe('getEntropy', () => {
  test('returns entropy if set', () => {
    expect(getEntropy(makeSession({ entropy: 'chaotic' }))).toBe('chaotic');
  });

  test('returns null if not set', () => {
    expect(getEntropy(makeSession())).toBeNull();
  });
});

describe('filterByEntropy', () => {
  test('filters sessions by level', () => {
    const sessions = [
      makeSession({ entropy: 'calm' }),
      makeSession({ id: '2', entropy: 'high' }),
      makeSession({ id: '3', entropy: 'high' })
    ];
    expect(filterByEntropy(sessions, 'high')).toHaveLength(2);
  });
});

describe('sortByEntropy', () => {
  test('sorts from most chaotic to calmest', () => {
    const sessions = [
      makeSession({ entropy: 'calm' }),
      makeSession({ id: '2', entropy: 'chaotic' }),
      makeSession({ id: '3', entropy: 'moderate' })
    ];
    const sorted = sortByEntropy(sessions);
    expect(sorted[0].entropy).toBe('chaotic');
    expect(sorted[sorted.length - 1].entropy).toBe('calm');
  });
});
