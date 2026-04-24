const {
  handleSetTension,
  handleClearTension,
  handleShowTension,
  handleFilterByTension,
  handleSortByTension
} = require('./tensionCmd');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('handleSetTension', () => {
  it('sets tension on matching session', () => {
    const sessions = [makeSession({ name: 'Alpha' })];
    const result = handleSetTension(sessions, 'Alpha', 'high');
    expect(result[0].tension).toBe('high');
  });

  it('returns unchanged sessions when name not found', () => {
    const sessions = [makeSession({ name: 'Alpha' })];
    const result = handleSetTension(sessions, 'Nope', 'low');
    expect(result).toEqual(sessions);
  });

  it('returns unchanged sessions for invalid tension', () => {
    const sessions = [makeSession({ name: 'Alpha' })];
    const result = handleSetTension(sessions, 'Alpha', 'extreme');
    expect(result[0].tension).toBeUndefined();
  });
});

describe('handleClearTension', () => {
  it('clears tension from session', () => {
    const sessions = [makeSession({ name: 'Alpha', tension: 'critical' })];
    const result = handleClearTension(sessions, 'Alpha');
    expect(result[0].tension).toBeUndefined();
  });

  it('returns unchanged sessions when name not found', () => {
    const sessions = [makeSession({ name: 'Alpha' })];
    const result = handleClearTension(sessions, 'Ghost');
    expect(result).toEqual(sessions);
  });
});

describe('handleShowTension', () => {
  it('logs tension for a session', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleShowTension([makeSession({ name: 'Alpha', tension: 'medium' })], 'Alpha');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('medium'));
    spy.mockRestore();
  });

  it('logs not found for missing session', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleShowTension([], 'Ghost');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    spy.mockRestore();
  });
});

describe('handleFilterByTension', () => {
  it('returns sessions matching tension', () => {
    const sessions = [
      makeSession({ name: 'A', tension: 'low' }),
      makeSession({ id: '2', name: 'B', tension: 'high' })
    ];
    const result = handleFilterByTension(sessions, 'low');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('A');
  });

  it('returns empty array for invalid tension', () => {
    const result = handleFilterByTension([], 'invalid');
    expect(result).toEqual([]);
  });
});

describe('handleSortByTension', () => {
  it('returns sessions sorted by tension ascending', () => {
    const sessions = [
      makeSession({ name: 'A', tension: 'critical' }),
      makeSession({ id: '2', name: 'B', tension: 'low' })
    ];
    const result = handleSortByTension(sessions, 'asc');
    expect(result[0].name).toBe('B');
  });
});
