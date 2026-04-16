const {
  hideSession,
  unhideSession,
  hideSessionByName,
  listVisible,
  listHidden,
  isHidden
} = require('./visibility');

const makeSession = (id, name, tabs = []) => ({
  id,
  name,
  tabs,
  createdAt: new Date().toISOString()
});

describe('hideSession', () => {
  test('sets hidden flag to true', () => {
    const s = makeSession('1', 'Work');
    const result = hideSession(s);
    expect(result.hidden).toBe(true);
  });

  test('does not mutate original', () => {
    const s = makeSession('1', 'Work');
    hideSession(s);
    expect(s.hidden).toBeUndefined();
  });
});

describe('unhideSession', () => {
  test('removes hidden flag', () => {
    const s = { ...makeSession('1', 'Work'), hidden: true };
    const result = unhideSession(s);
    expect(result.hidden).toBe(false);
  });
});

describe('hideSessionByName', () => {
  test('hides session matching name', () => {
    const sessions = [
      makeSession('1', 'Work'),
      makeSession('2', 'Personal')
    ];
    const result = hideSessionByName(sessions, 'Work');
    expect(result.find(s => s.id === '1').hidden).toBe(true);
    expect(result.find(s => s.id === '2').hidden).toBeUndefined();
  });

  test('returns unchanged list if name not found', () => {
    const sessions = [makeSession('1', 'Work')];
    const result = hideSessionByName(sessions, 'Ghost');
    expect(result).toEqual(sessions);
  });
});

describe('listVisible', () => {
  test('returns only non-hidden sessions', () => {
    const sessions = [
      makeSession('1', 'Work'),
      { ...makeSession('2', 'Hidden'), hidden: true }
    ];
    expect(listVisible(sessions)).toHaveLength(1);
    expect(listVisible(sessions)[0].id).toBe('1');
  });
});

describe('listHidden', () => {
  test('returns only hidden sessions', () => {
    const sessions = [
      makeSession('1', 'Work'),
      { ...makeSession('2', 'Hidden'), hidden: true }
    ];
    expect(listHidden(sessions)).toHaveLength(1);
    expect(listHidden(sessions)[0].id).toBe('2');
  });
});

describe('isHidden', () => {
  test('returns true for hidden session', () => {
    expect(isHidden({ hidden: true })).toBe(true);
  });

  test('returns false for visible session', () => {
    expect(isHidden({ hidden: false })).toBe(false);
    expect(isHidden({})).toBe(false);
  });
});
