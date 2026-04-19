const { handleSetSignal, handleClearSignal, handleShowSignal, handleFilterBySignal, handleSortBySignal } = require('./signalCmd');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('signalCmd', () => {
  describe('handleSetSignal', () => {
    it('sets signal on session by name', () => {
      const sessions = [makeSession({ name: 'Work' })];
      const result = handleSetSignal(sessions, 'Work', 'high');
      expect(result.signal).toBe('high');
    });

    it('throws if session not found', () => {
      expect(() => handleSetSignal([], 'Missing', 'low')).toThrow('Session "Missing" not found');
    });
  });

  describe('handleClearSignal', () => {
    it('clears signal from session', () => {
      const sessions = [makeSession({ name: 'Work', signal: 'high' })];
      const result = handleClearSignal(sessions, 'Work');
      expect(result.signal).toBeUndefined();
    });

    it('throws if session not found', () => {
      expect(() => handleClearSignal([], 'Ghost')).toThrow('Session "Ghost" not found');
    });
  });

  describe('handleShowSignal', () => {
    it('returns signal message when set', () => {
      const sessions = [makeSession({ name: 'Work', signal: 'medium' })];
      const msg = handleShowSignal(sessions, 'Work');
      expect(msg).toContain('medium');
    });

    it('returns no signal message when unset', () => {
      const sessions = [makeSession({ name: 'Work' })];
      const msg = handleShowSignal(sessions, 'Work');
      expect(msg).toContain('No signal');
    });

    it('throws if session not found', () => {
      expect(() => handleShowSignal([], 'X')).toThrow();
    });
  });

  describe('handleFilterBySignal', () => {
    it('returns sessions matching signal', () => {
      const sessions = [
        makeSession({ id: 's1', name: 'A', signal: 'high' }),
        makeSession({ id: 's2', name: 'B', signal: 'low' }),
      ];
      const result = handleFilterBySignal(sessions, 'high');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('A');
    });
  });

  describe('handleSortBySignal', () => {
    it('returns sessions sorted by signal', () => {
      const sessions = [
        makeSession({ id: 's1', name: 'B', signal: 'low' }),
        makeSession({ id: 's2', name: 'A', signal: 'high' }),
      ];
      const result = handleSortBySignal(sessions);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });
  });
});
