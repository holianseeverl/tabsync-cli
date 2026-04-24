const {
  isValidResonance,
  setResonance,
  clearResonance,
  setResonanceByName,
  getResonance,
  filterByResonance,
  sortByResonance,
} = require('./resonance');

function makeSession(overrides = {}) {
  return {
    id: 'sess-1',
    name: 'Test Session',
    tabs: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('isValidResonance', () => {
  it('accepts valid resonance values', () => {
    expect(isValidResonance('high')).toBe(true);
    expect(isValidResonance('medium')).toBe(true);
    expect(isValidResonance('low')).toBe(true);
    expect(isValidResonance('none')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidResonance('extreme')).toBe(false);
    expect(isValidResonance('')).toBe(false);
    expect(isValidResonance(null)).toBe(false);
  });
});

describe('setResonance', () => {
  it('sets resonance on a session', () => {
    const session = makeSession();
    const updated = setResonance(session, 'high');
    expect(updated.resonance).toBe('high');
  });

  it('throws on invalid resonance', () => {
    const session = makeSession();
    expect(() => setResonance(session, 'extreme')).toThrow();
  });
});

describe('clearResonance', () => {
  it('removes resonance from a session', () => {
    const session = makeSession({ resonance: 'high' });
    const updated = clearResonance(session);
    expect(updated.resonance).toBeUndefined();
  });
});

describe('setResonanceByName', () => {
  it('sets resonance on matching session by name', () => {
    const sessions = [makeSession({ name: 'Alpha' }), makeSession({ id: 'sess-2', name: 'Beta' })];
    const updated = setResonanceByName(sessions, 'Alpha', 'medium');
    expect(updated.find(s => s.name === 'Alpha').resonance).toBe('medium');
    expect(updated.find(s => s.name === 'Beta').resonance).toBeUndefined();
  });
});

describe('getResonance', () => {
  it('returns the resonance value', () => {
    const session = makeSession({ resonance: 'low' });
    expect(getResonance(session)).toBe('low');
  });

  it('returns null if not set', () => {
    const session = makeSession();
    expect(getResonance(session)).toBeNull();
  });
});

describe('filterByResonance', () => {
  it('filters sessions by resonance level', () => {
    const sessions = [
      makeSession({ id: '1', resonance: 'high' }),
      makeSession({ id: '2', resonance: 'low' }),
      makeSession({ id: '3', resonance: 'high' }),
    ];
    const result = filterByResonance(sessions, 'high');
    expect(result).toHaveLength(2);
    expect(result.every(s => s.resonance === 'high')).toBe(true);
  });
});

describe('sortByResonance', () => {
  it('sorts sessions by resonance priority (high > medium > low > none)', () => {
    const sessions = [
      makeSession({ id: '1', resonance: 'low' }),
      makeSession({ id: '2', resonance: 'high' }),
      makeSession({ id: '3', resonance: 'medium' }),
    ];
    const sorted = sortByResonance(sessions);
    expect(sorted[0].resonance).toBe('high');
    expect(sorted[1].resonance).toBe('medium');
    expect(sorted[2].resonance).toBe('low');
  });
});
