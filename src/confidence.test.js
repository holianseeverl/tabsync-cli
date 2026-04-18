const {
  isValidConfidence,
  setConfidence,
  clearConfidence,
  setConfidenceByName,
  getConfidence,
} = require('./confidence');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], ...overrides };
}

describe('isValidConfidence', () => {
  it('accepts values 0-100', () => {
    expect(isValidConfidence(0)).toBe(true);
    expect(isValidConfidence(50)).toBe(true);
    expect(isValidConfidence(100)).toBe(true);
  });

  it('rejects out of range', () => {
    expect(isValidConfidence(-1)).toBe(false);
    expect(isValidConfidence(101)).toBe(false);
  });

  it('rejects non-numbers', () => {
    expect(isValidConfidence('high')).toBe(false);
    expect(isValidConfidence(null)).toBe(false);
  });
});

describe('setConfidence', () => {
  it('sets confidence on session', () => {
    const s = makeSession();
    const result = setConfidence(s, 75);
    expect(result.confidence).toBe(75);
  });

  it('throws on invalid value', () => {
    expect(() => setConfidence(makeSession(), 150)).toThrow();
  });
});

describe('clearConfidence', () => {
  it('removes confidence field', () => {
    const s = makeSession({ confidence: 80 });
    const result = clearConfidence(s);
    expect(result.confidence).toBeUndefined();
  });
});

describe('getConfidence', () => {
  it('returns confidence value', () => {
    const s = makeSession({ confidence: 42 });
    expect(getConfidence(s)).toBe(42);
  });

  it('returns null if not set', () => {
    expect(getConfidence(makeSession())).toBeNull();
  });
});

describe('setConfidenceByName', () => {
  it('sets confidence on matching session', () => {
    const sessions = [makeSession({ name: 'Alpha' }), makeSession({ id: 's2', name: 'Beta' })];
    const result = setConfidenceByName(sessions, 'Alpha', 60);
    expect(result.find(s => s.name === 'Alpha').confidence).toBe(60);
    expect(result.find(s => s.name === 'Beta').confidence).toBeUndefined();
  });

  it('returns unchanged list if name not found', () => {
    const sessions = [makeSession({ name: 'Alpha' })];
    const result = setConfidenceByName(sessions, 'Nope', 50);
    expect(result).toEqual(sessions);
  });
});
