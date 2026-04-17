const { isValidIntent, setIntent, clearIntent, setIntentByName, getIntent, filterByIntent, groupByIntent, listValidIntents } = require('./intent');

function makeSession(name, intent) {
  const s = { id: name, name, tabs: [] };
  if (intent) s.intent = intent;
  return s;
}

describe('isValidIntent', () => {
  it('accepts valid intents', () => {
    expect(isValidIntent('work')).toBe(true);
    expect(isValidIntent('research')).toBe(true);
  });
  it('rejects invalid intents', () => {
    expect(isValidIntent('random')).toBe(false);
    expect(isValidIntent('')).toBe(false);
  });
});

describe('setIntent', () => {
  it('sets intent on session', () => {
    const s = makeSession('a');
    expect(setIntent(s, 'work').intent).toBe('work');
  });
  it('throws on invalid intent', () => {
    expect(() => setIntent(makeSession('a'), 'nope')).toThrow();
  });
  it('does not mutate original', () => {
    const s = makeSession('a');
    setIntent(s, 'work');
    expect(s.intent).toBeUndefined();
  });
});

describe('clearIntent', () => {
  it('removes intent', () => {
    const s = makeSession('a', 'work');
    expect(clearIntent(s).intent).toBeUndefined();
  });
});

describe('setIntentByName', () => {
  it('sets intent on matching session', () => {
    const sessions = [makeSession('a'), makeSession('b')];
    const result = setIntentByName(sessions, 'a', 'learning');
    expect(result[0].intent).toBe('learning');
    expect(result[1].intent).toBeUndefined();
  });
});

describe('getIntent', () => {
  it('returns intent or null', () => {
    expect(getIntent(makeSession('a', 'personal'))).toBe('personal');
    expect(getIntent(makeSession('b'))).toBeNull();
  });
});

describe('filterByIntent', () => {
  it('filters sessions by intent', () => {
    const sessions = [makeSession('a', 'work'), makeSession('b', 'personal'), makeSession('c', 'work')];
    expect(filterByIntent(sessions, 'work')).toHaveLength(2);
  });
  it('throws on invalid intent', () => {
    expect(() => filterByIntent([], 'nope')).toThrow();
  });
});

describe('groupByIntent', () => {
  it('groups sessions by intent', () => {
    const sessions = [makeSession('a', 'work'), makeSession('b', 'personal'), makeSession('c', 'work'), makeSession('d')];
    const groups = groupByIntent(sessions);
    expect(groups['work']).toHaveLength(2);
    expect(groups['personal']).toHaveLength(1);
    expect(groups['unset']).toHaveLength(1);
  });
});

describe('listValidIntents', () => {
  it('returns array of valid intents', () => {
    const intents = listValidIntents();
    expect(intents).toContain('work');
    expect(intents).toContain('research');
  });
});
