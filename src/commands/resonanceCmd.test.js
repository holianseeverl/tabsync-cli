const {
  handleSetResonance,
  handleClearResonance,
  handleShowResonance,
  handleFilterByResonance,
  handleSortByResonance,
} = require('./resonanceCmd');

function makeSession(overrides = {}) {
  return { id: 'sess-1', name: 'Alpha', tabs: [], ...overrides };
}

describe('handleSetResonance', () => {
  it('sets resonance and saves', () => {
    const sessions = [makeSession()];
    const save = jest.fn();
    const log = jest.fn();
    handleSetResonance(sessions, 'Alpha', 'high', { save, log });
    expect(save).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('high'));
  });

  it('rejects invalid level', () => {
    const sessions = [makeSession()];
    const save = jest.fn();
    const log = jest.fn();
    handleSetResonance(sessions, 'Alpha', 'extreme', { save, log });
    expect(save).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Invalid'));
  });
});

describe('handleClearResonance', () => {
  it('clears resonance and saves', () => {
    const sessions = [makeSession({ resonance: 'high' })];
    const save = jest.fn();
    const log = jest.fn();
    const result = handleClearResonance(sessions, 'Alpha', { save, log });
    expect(result[0].resonance).toBeUndefined();
    expect(save).toHaveBeenCalled();
  });
});

describe('handleShowResonance', () => {
  it('logs resonance for existing session', () => {
    const sessions = [makeSession({ resonance: 'medium' })];
    const log = jest.fn();
    handleShowResonance(sessions, 'Alpha', { log });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('medium'));
  });

  it('logs not found for missing session', () => {
    const log = jest.fn();
    handleShowResonance([], 'Ghost', { log });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });
});

describe('handleFilterByResonance', () => {
  it('logs matching sessions', () => {
    const sessions = [
      makeSession({ id: '1', name: 'A', resonance: 'high' }),
      makeSession({ id: '2', name: 'B', resonance: 'low' }),
    ];
    const log = jest.fn();
    handleFilterByResonance(sessions, 'high', { log });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('A'));
  });

  it('logs none found when no matches', () => {
    const sessions = [makeSession({ resonance: 'low' })];
    const log = jest.fn();
    handleFilterByResonance(sessions, 'high', { log });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
  });
});

describe('handleSortByResonance', () => {
  it('returns sessions sorted by resonance', () => {
    const sessions = [
      makeSession({ id: '1', name: 'A', resonance: 'low' }),
      makeSession({ id: '2', name: 'B', resonance: 'high' }),
    ];
    const log = jest.fn();
    const result = handleSortByResonance(sessions, { log });
    expect(result[0].resonance).toBe('high');
  });
});
