const { isValidFlow, setFlow, clearFlow, setFlowByName, getFlow, filterByFlow, sortByFlow } = require('./flow');

function makeSession(overrides = {}) {
  return { id: 'abc', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('isValidFlow', () => {
  it('accepts valid flows', () => {
    expect(isValidFlow('deep')).toBe(true);
    expect(isValidFlow('blocked')).toBe(true);
  });
  it('rejects invalid flows', () => {
    expect(isValidFlow('flying')).toBe(false);
  });
});

describe('setFlow', () => {
  it('sets flow on matching session', () => {
    const sessions = [makeSession({ id: '1' })];
    const result = setFlow(sessions, '1', 'deep');
    expect(result[0].flow).toBe('deep');
  });
  it('throws on invalid flow', () => {
    expect(() => setFlow([], 'x', 'flying')).toThrow();
  });
});

describe('clearFlow', () => {
  it('removes flow from session', () => {
    const sessions = [makeSession({ id: '1', flow: 'active' })];
    const result = clearFlow(sessions, '1');
    expect(result[0].flow).toBeUndefined();
  });
});

describe('setFlowByName', () => {
  it('sets flow by name', () => {
    const sessions = [makeSession({ id: '1', name: 'Work' })];
    const result = setFlowByName(sessions, 'Work', 'idle');
    expect(result[0].flow).toBe('idle');
  });
  it('throws if name not found', () => {
    expect(() => setFlowByName([], 'Missing', 'idle')).toThrow();
  });
});

describe('filterByFlow', () => {
  it('returns only sessions with matching flow', () => {
    const sessions = [
      makeSession({ id: '1', flow: 'deep' }),
      makeSession({ id: '2', flow: 'idle' }),
    ];
    expect(filterByFlow(sessions, 'deep')).toHaveLength(1);
  });
});

describe('sortByFlow', () => {
  it('sorts deep first, blocked last', () => {
    const sessions = [
      makeSession({ id: '1', flow: 'blocked' }),
      makeSession({ id: '2', flow: 'deep' }),
      makeSession({ id: '3', flow: 'active' }),
    ];
    const sorted = sortByFlow(sessions);
    expect(sorted[0].flow).toBe('deep');
    expect(sorted[2].flow).toBe('blocked');
  });
});
