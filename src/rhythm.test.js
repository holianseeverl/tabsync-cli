const {
  isValidRhythm,
  setRhythm,
  clearRhythm,
  setRhythmByName,
  getRhythm,
  filterByRhythm,
  sortByRhythm,
} = require('./rhythm');

const makeSession = (name, rhythm) => ({ id: name, name, rhythm });

describe('isValidRhythm', () => {
  it('accepts valid rhythms', () => {
    expect(isValidRhythm('morning')).toBe(true);
    expect(isValidRhythm('night')).toBe(true);
    expect(isValidRhythm('flexible')).toBe(true);
  });
  it('rejects invalid rhythms', () => {
    expect(isValidRhythm('noon')).toBe(false);
    expect(isValidRhythm('')).toBe(false);
  });
});

describe('setRhythm', () => {
  it('sets rhythm on session', () => {
    const s = makeSession('a', undefined);
    expect(setRhythm(s, 'morning').rhythm).toBe('morning');
  });
  it('throws on invalid rhythm', () => {
    expect(() => setRhythm(makeSession('a'), 'noon')).toThrow();
  });
  it('does not mutate original', () => {
    const s = makeSession('a', 'evening');
    setRhythm(s, 'night');
    expect(s.rhythm).toBe('evening');
  });
});

describe('clearRhythm', () => {
  it('removes rhythm', () => {
    const s = makeSession('a', 'morning');
    expect(clearRhythm(s).rhythm).toBeUndefined();
  });
});

describe('setRhythmByName', () => {
  it('updates matching session', () => {
    const sessions = [makeSession('a', 'morning'), makeSession('b', 'night')];
    const result = setRhythmByName(sessions, 'a', 'evening');
    expect(result[0].rhythm).toBe('evening');
    expect(result[1].rhythm).toBe('night');
  });
});

describe('getRhythm', () => {
  it('returns rhythm or null', () => {
    expect(getRhythm(makeSession('a', 'afternoon'))).toBe('afternoon');
    expect(getRhythm({ name: 'b' })).toBeNull();
  });
});

describe('filterByRhythm', () => {
  it('filters sessions by rhythm', () => {
    const sessions = [makeSession('a', 'morning'), makeSession('b', 'night'), makeSession('c', 'morning')];
    expect(filterByRhythm(sessions, 'morning')).toHaveLength(2);
  });
});

describe('sortByRhythm', () => {
  it('sorts by rhythm order', () => {
    const sessions = [makeSession('c', 'night'), makeSession('a', 'morning'), makeSession('b', 'afternoon')];
    const sorted = sortByRhythm(sessions);
    expect(sorted[0].rhythm).toBe('morning');
    expect(sorted[1].rhythm).toBe('afternoon');
    expect(sorted[2].rhythm).toBe('night');
  });
});
