const { handleSetTempo, handleClearTempo, handleShowTempo, handleFilterByTempo, handleSortByTempo } = require('./tempoCmd');

function makeSession(name, tempo) {
  return { id: name, name, tabs: [], createdAt: new Date().toISOString(), tempo };
}

describe('tempoCmd', () => {
  const sessions = [
    makeSession('alpha', 'fast'),
    makeSession('beta', 'slow'),
    makeSession('gamma', undefined),
  ];

  test('handleSetTempo sets tempo on named session', () => {
    const result = handleSetTempo(sessions, 'gamma', 'medium');
    const s = result.find(s => s.name === 'gamma');
    expect(s.tempo).toBe('medium');
  });

  test('handleSetTempo throws if session not found', () => {
    expect(() => handleSetTempo(sessions, 'nope', 'fast')).toThrow('not found');
  });

  test('handleClearTempo removes tempo', () => {
    const result = handleClearTempo(sessions, 'alpha');
    const s = result.find(s => s.name === 'alpha');
    expect(s.tempo).toBeUndefined();
  });

  test('handleClearTempo throws if session not found', () => {
    expect(() => handleClearTempo(sessions, 'nope')).toThrow('not found');
  });

  test('handleShowTempo returns tempo string', () => {
    const result = handleShowTempo(sessions, 'alpha');
    expect(result).toBe('alpha: fast');
  });

  test('handleShowTempo returns no tempo message', () => {
    const result = handleShowTempo(sessions, 'gamma');
    expect(result).toContain('no tempo set');
  });

  test('handleShowTempo throws if session not found', () => {
    expect(() => handleShowTempo(sessions, 'nope')).toThrow('not found');
  });

  test('handleFilterByTempo filters correctly', () => {
    const result = handleFilterByTempo(sessions, 'fast');
    expect(result.every(s => s.tempo === 'fast')).toBe(true);
  });

  test('handleSortByTempo returns sorted list', () => {
    const result = handleSortByTempo(sessions);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(sessions.length);
  });
});
