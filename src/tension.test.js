const {
  isValidTension,
  setTension,
  clearTension,
  setTensionByName,
  getTension,
  filterByTension,
  sortByTension
} = require('./tension');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('isValidTension', () => {
  it('returns true for valid tensions', () => {
    expect(isValidTension('low')).toBe(true);
    expect(isValidTension('medium')).toBe(true);
    expect(isValidTension('high')).toBe(true);
    expect(isValidTension('critical')).toBe(true);
  });

  it('returns false for invalid tensions', () => {
    expect(isValidTension('extreme')).toBe(false);
    expect(isValidTension('')).toBe(false);
    expect(isValidTension(null)).toBe(false);
  });
});

describe('setTension', () => {
  it('sets the tension on a session', () => {
    const s = makeSession();
    const result = setTension(s, 'high');
    expect(result.tension).toBe('high');
  });

  it('does not mutate the original session', () => {
    const s = makeSession();
    setTension(s, 'medium');
    expect(s.tension).toBeUndefined();
  });

  it('throws for invalid tension', () => {
    expect(() => setTension(makeSession(), 'extreme')).toThrow();
  });
});

describe('clearTension', () => {
  it('removes tension from session', () => {
    const s = makeSession({ tension: 'critical' });
    const result = clearTension(s);
    expect(result.tension).toBeUndefined();
  });
});

describe('setTensionByName', () => {
  it('sets tension on matching session', () => {
    const sessions = [makeSession({ name: 'Alpha' }), makeSession({ id: '2', name: 'Beta' })];
    const result = setTensionByName(sessions, 'Alpha', 'low');
    expect(result[0].tension).toBe('low');
    expect(result[1].tension).toBeUndefined();
  });
});

describe('getTension', () => {
  it('returns tension if set', () => {
    expect(getTension(makeSession({ tension: 'medium' }))).toBe('medium');
  });

  it('returns null if not set', () => {
    expect(getTension(makeSession())).toBeNull();
  });
});

describe('filterByTension', () => {
  it('filters sessions by tension level', () => {
    const sessions = [
      makeSession({ tension: 'low' }),
      makeSession({ id: '2', tension: 'high' }),
      makeSession({ id: '3', tension: 'low' })
    ];
    expect(filterByTension(sessions, 'low')).toHaveLength(2);
    expect(filterByTension(sessions, 'high')).toHaveLength(1);
  });

  it('throws for invalid tension', () => {
    expect(() => filterByTension([], 'bad')).toThrow();
  });
});

describe('sortByTension', () => {
  it('sorts ascending by default', () => {
    const sessions = [
      makeSession({ tension: 'critical' }),
      makeSession({ id: '2', tension: 'low' }),
      makeSession({ id: '3', tension: 'medium' })
    ];
    const result = sortByTension(sessions);
    expect(result.map(s => s.tension)).toEqual(['low', 'medium', 'critical']);
  });

  it('sorts descending when specified', () => {
    const sessions = [
      makeSession({ tension: 'low' }),
      makeSession({ id: '2', tension: 'high' })
    ];
    const result = sortByTension(sessions, 'desc');
    expect(result[0].tension).toBe('high');
  });
});
