const { setAlias, clearAlias, setAliasByName, findByAlias, getAlias, listAliased } = require('./alias');

function makeSession(overrides = {}) {
  return { id: 'abc1', name: 'Work', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('setAlias', () => {
  test('sets alias on matching session', () => {
    const sessions = [makeSession()];
    const result = setAlias(sessions, 'abc1', 'work');
    expect(result[0].alias).toBe('work');
  });

  test('trims whitespace from alias', () => {
    const sessions = [makeSession()];
    const result = setAlias(sessions, 'abc1', '  w  ');
    expect(result[0].alias).toBe('w');
  });

  test('throws on empty alias', () => {
    const sessions = [makeSession()];
    expect(() => setAlias(sessions, 'abc1', '  ')).toThrow();
  });

  test('throws on alias conflict', () => {
    const sessions = [
      makeSession({ id: 'abc1', name: 'Work' }),
      makeSession({ id: 'abc2', name: 'Home', alias: 'home' })
    ];
    expect(() => setAlias(sessions, 'abc1', 'home')).toThrow(/already used/);
  });

  test('allows re-setting same alias on same session', () => {
    const sessions = [makeSession({ alias: 'work' })];
    const result = setAlias(sessions, 'abc1', 'work');
    expect(result[0].alias).toBe('work');
  });
});

describe('clearAlias', () => {
  test('removes alias from session', () => {
    const sessions = [makeSession({ alias: 'work' })];
    const result = clearAlias(sessions, 'abc1');
    expect(result[0].alias).toBeUndefined();
  });
});

describe('setAliasByName', () => {
  test('sets alias by session name', () => {
    const sessions = [makeSession()];
    const result = setAliasByName(sessions, 'Work', 'mywork');
    expect(result[0].alias).toBe('mywork');
  });

  test('throws if name not found', () => {
    expect(() => setAliasByName([], 'Ghost', 'g')).toThrow(/not found/);
  });
});

describe('findByAlias', () => {
  test('returns session with matching alias', () => {
    const sessions = [makeSession({ alias: 'w' })];
    expect(findByAlias(sessions, 'w').id).toBe('abc1');
  });

  test('returns null if not found', () => {
    expect(findByAlias([], 'nope')).toBeNull();
  });
});

describe('getAlias', () => {
  test('returns alias for session', () => {
    const sessions = [makeSession({ alias: 'w' })];
    expect(getAlias(sessions, 'abc1')).toBe('w');
  });

  test('returns null if no alias', () => {
    expect(getAlias([makeSession()], 'abc1')).toBeNull();
  });
});

describe('listAliased', () => {
  test('returns only sessions with aliases', () => {
    const sessions = [makeSession({ alias: 'w' }), makeSession({ id: 'x', name: 'Other' })];
    expect(listAliased(sessions)).toHaveLength(1);
  });
});
