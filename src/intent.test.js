const { isValidIntent, setIntent, clearIntent, setIntentByName, getIntent, filterByIntent, sortByIntent } = require('./intent');

function makeSession(id, name, extras = {}) {
  return { id, name, tabs: [], createdAt: new Date().toISOString(), ...extras };
}

describe('isValidIntent', () => {
  test('accepts valid intents', () => {
    ['research', 'work', 'personal', 'reference', 'shopping', 'entertainment'].forEach(i => {
      expect(isValidIntent(i)).toBe(true);
    });
  });
  test('rejects invalid intent', () => {
    expect(isValidIntent('unknown')).toBe(false);
    expect(isValidIntent('')).toBe(false);
  });
});

describe('setIntent', () => {
  test('sets intent on session', () => {
    const s = makeSession('1', 'A');
    const result = setIntent(s, 'work');
    expect(result.intent).toBe('work');
  });
  test('throws on invalid intent', () => {
    const s = makeSession('1', 'A');
    expect(() => setIntent(s, 'bad')).toThrow();
  });
});

describe('clearIntent', () => {
  test('removes intent', () => {
    const s = makeSession('1', 'A', { intent: 'work' });
    const result = clearIntent(s);
    expect(result.intent).toBeUndefined();
  });
});

describe('setIntentByName', () => {
  test('sets intent by session name', () => {
    const sessions = [makeSession('1', 'Alpha'), makeSession('2', 'Beta')];
    const result = setIntentByName(sessions, 'Alpha', 'research');
    expect(result.find(s => s.name === 'Alpha').intent).toBe('research');
    expect(result.find(s => s.name === 'Beta').intent).toBeUndefined();
  });
  test('returns unchanged if name not found', () => {
    const sessions = [makeSession('1', 'Alpha')];
    const result = setIntentByName(sessions, 'Missing', 'work');
    expect(result).toEqual(sessions);
  });
});

describe('getIntent', () => {
  test('returns intent value', () => {
    const s = makeSession('1', 'A', { intent: 'personal' });
    expect(getIntent(s)).toBe('personal');
  });
  test('returns null if not set', () => {
    const s = makeSession('1', 'A');
    expect(getIntent(s)).toBeNull();
  });
});

describe('filterByIntent', () => {
  test('filters sessions by intent', () => {
    const sessions = [
      makeSession('1', 'A', { intent: 'work' }),
      makeSession('2', 'B', { intent: 'personal' }),
      makeSession('3', 'C', { intent: 'work' }),
    ];
    const result = filterByIntent(sessions, 'work');
    expect(result).toHaveLength(2);
    expect(result.every(s => s.intent === 'work')).toBe(true);
  });
});

describe('sortByIntent', () => {
  test('sorts sessions alphabetically by intent', () => {
    const sessions = [
      makeSession('1', 'A', { intent: 'work' }),
      makeSession('2', 'B', { intent: 'personal' }),
      makeSession('3', 'C', { intent: 'research' }),
    ];
    const result = sortByIntent(sessions);
    expect(result[0].intent).toBe('personal');
    expect(result[1].intent).toBe('research');
    expect(result[2].intent).toBe('work');
  });
});
