const { isValidEnergy, setEnergy, clearEnergy, setEnergyByName, getEnergy, filterByEnergy, sortByEnergy } = require('./energy');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('isValidEnergy', () => {
  test('accepts valid levels', () => {
    ['low', 'medium', 'high'].forEach(e => expect(isValidEnergy(e)).toBe(true));
  });
  test('rejects invalid', () => {
    expect(isValidEnergy('extreme')).toBe(false);
    expect(isValidEnergy('')).toBe(false);
  });
});

describe('setEnergy', () => {
  test('sets energy on session', () => {
    const s = makeSession();
    const result = setEnergy(s, 'high');
    expect(result.energy).toBe('high');
  });
  test('throws on invalid energy', () => {
    expect(() => setEnergy(makeSession(), 'extreme')).toThrow();
  });
});

describe('clearEnergy', () => {
  test('removes energy field', () => {
    const s = makeSession({ energy: 'high' });
    const result = clearEnergy(s);
    expect(result.energy).toBeUndefined();
  });
});

describe('setEnergyByName', () => {
  test('sets energy on matching session', () => {
    const sessions = [makeSession({ name: 'Work' }), makeSession({ id: 's2', name: 'Play' })];
    const result = setEnergyByName(sessions, 'Work', 'medium');
    expect(result.find(s => s.name === 'Work').energy).toBe('medium');
    expect(result.find(s => s.name === 'Play').energy).toBeUndefined();
  });
});

describe('getEnergy', () => {
  test('returns energy or null', () => {
    expect(getEnergy(makeSession({ energy: 'low' }))).toBe('low');
    expect(getEnergy(makeSession())).toBeNull();
  });
});

describe('filterByEnergy', () => {
  test('filters sessions by energy level', () => {
    const sessions = [
      makeSession({ energy: 'high' }),
      makeSession({ id: 's2', energy: 'low' }),
      makeSession({ id: 's3', energy: 'high' })
    ];
    expect(filterByEnergy(sessions, 'high')).toHaveLength(2);
  });
});

describe('sortByEnergy', () => {
  test('sorts by energy order low < medium < high', () => {
    const sessions = [
      makeSession({ id: 'a', energy: 'high' }),
      makeSession({ id: 'b', energy: 'low' }),
      makeSession({ id: 'c', energy: 'medium' })
    ];
    const sorted = sortByEnergy(sessions);
    expect(sorted.map(s => s.energy)).toEqual(['low', 'medium', 'high']);
  });
});
