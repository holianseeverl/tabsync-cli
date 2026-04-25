const {
  isValidPolarity,
  setPolarity,
  clearPolarity,
  setPolarityByName,
  getPolarity,
  filterByPolarity,
  sortByPolarity,
} = require('./polarity');

const makeSession = (name, polarity) => ({
  id: Math.random().toString(36).slice(2),
  name,
  tabs: [],
  createdAt: new Date().toISOString(),
  ...(polarity ? { polarity } : {}),
});

describe('isValidPolarity', () => {
  it('accepts valid polarities', () => {
    expect(isValidPolarity('positive')).toBe(true);
    expect(isValidPolarity('negative')).toBe(true);
    expect(isValidPolarity('neutral')).toBe(true);
  });

  it('rejects invalid polarities', () => {
    expect(isValidPolarity('mixed')).toBe(false);
    expect(isValidPolarity('')).toBe(false);
    expect(isValidPolarity(null)).toBe(false);
  });
});

describe('setPolarity', () => {
  it('sets polarity on a session', () => {
    const s = makeSession('alpha');
    const result = setPolarity(s, 'positive');
    expect(result.polarity).toBe('positive');
  });

  it('does not mutate original session', () => {
    const s = makeSession('alpha');
    setPolarity(s, 'negative');
    expect(s.polarity).toBeUndefined();
  });

  it('throws on invalid polarity', () => {
    const s = makeSession('alpha');
    expect(() => setPolarity(s, 'chaotic')).toThrow();
  });
});

describe('clearPolarity', () => {
  it('removes polarity from session', () => {
    const s = makeSession('alpha', 'negative');
    const result = clearPolarity(s);
    expect(result.polarity).toBeUndefined();
  });
});

describe('setPolarityByName', () => {
  it('updates only the matching session', () => {
    const sessions = [makeSession('a'), makeSession('b'), makeSession('c')];
    const result = setPolarityByName(sessions, 'b', 'neutral');
    expect(result.find(s => s.name === 'b').polarity).toBe('neutral');
    expect(result.find(s => s.name === 'a').polarity).toBeUndefined();
  });
});

describe('getPolarity', () => {
  it('returns polarity when set', () => {
    const s = makeSession('a', 'positive');
    expect(getPolarity(s)).toBe('positive');
  });

  it('returns null when not set', () => {
    const s = makeSession('a');
    expect(getPolarity(s)).toBeNull();
  });
});

describe('filterByPolarity', () => {
  it('filters sessions by polarity', () => {
    const sessions = [
      makeSession('a', 'positive'),
      makeSession('b', 'negative'),
      makeSession('c', 'positive'),
    ];
    const result = filterByPolarity(sessions, 'positive');
    expect(result).toHaveLength(2);
    expect(result.every(s => s.polarity === 'positive')).toBe(true);
  });

  it('throws on invalid polarity', () => {
    expect(() => filterByPolarity([], 'unknown')).toThrow();
  });
});

describe('sortByPolarity', () => {
  it('sorts positive before neutral before negative', () => {
    const sessions = [
      makeSession('a', 'negative'),
      makeSession('b', 'positive'),
      makeSession('c', 'neutral'),
    ];
    const result = sortByPolarity(sessions);
    expect(result[0].polarity).toBe('positive');
    expect(result[1].polarity).toBe('neutral');
    expect(result[2].polarity).toBe('negative');
  });

  it('places unset polarity last', () => {
    const sessions = [makeSession('x'), makeSession('y', 'positive')];
    const result = sortByPolarity(sessions);
    expect(result[0].polarity).toBe('positive');
    expect(result[1].polarity).toBeUndefined();
  });
});
