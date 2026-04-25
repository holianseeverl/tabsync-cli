const {
  isValidSurface,
  setSurface,
  clearSurface,
  setSurfaceByName,
  getSurface,
  filterBySurface,
  sortBySurface,
  groupBySurface
} = require('./surface');

function makeSession(name, surface) {
  const s = { id: name, name, tabs: [] };
  if (surface) s.surface = surface;
  return s;
}

describe('isValidSurface', () => {
  it('accepts valid surfaces', () => {
    expect(isValidSurface('browser')).toBe(true);
    expect(isValidSurface('terminal')).toBe(true);
    expect(isValidSurface('other')).toBe(true);
  });

  it('rejects invalid surfaces', () => {
    expect(isValidSurface('cloud')).toBe(false);
    expect(isValidSurface('')).toBe(false);
  });
});

describe('setSurface', () => {
  it('sets a valid surface', () => {
    const s = makeSession('alpha');
    const updated = setSurface(s, 'editor');
    expect(updated.surface).toBe('editor');
  });

  it('does not mutate original', () => {
    const s = makeSession('alpha');
    setSurface(s, 'mobile');
    expect(s.surface).toBeUndefined();
  });

  it('throws on invalid surface', () => {
    expect(() => setSurface(makeSession('x'), 'cloud')).toThrow();
  });
});

describe('clearSurface', () => {
  it('removes surface from session', () => {
    const s = makeSession('alpha', 'browser');
    const updated = clearSurface(s);
    expect(updated.surface).toBeUndefined();
  });
});

describe('setSurfaceByName', () => {
  it('updates only matching session', () => {
    const sessions = [makeSession('a'), makeSession('b')];
    const result = setSurfaceByName(sessions, 'a', 'meeting');
    expect(result[0].surface).toBe('meeting');
    expect(result[1].surface).toBeUndefined();
  });
});

describe('getSurface', () => {
  it('returns surface or null', () => {
    expect(getSurface(makeSession('a', 'terminal'))).toBe('terminal');
    expect(getSurface(makeSession('b'))).toBeNull();
  });
});

describe('filterBySurface', () => {
  it('filters sessions by surface', () => {
    const sessions = [
      makeSession('a', 'browser'),
      makeSession('b', 'editor'),
      makeSession('c', 'browser')
    ];
    const result = filterBySurface(sessions, 'browser');
    expect(result).toHaveLength(2);
    expect(result.every(s => s.surface === 'browser')).toBe(true);
  });
});

describe('sortBySurface', () => {
  it('sorts sessions by surface index', () => {
    const sessions = [makeSession('a', 'other'), makeSession('b', 'browser')];
    const sorted = sortBySurface(sessions);
    expect(sorted[0].surface).toBe('browser');
  });
});

describe('groupBySurface', () => {
  it('groups sessions by surface', () => {
    const sessions = [
      makeSession('a', 'browser'),
      makeSession('b', 'mobile'),
      makeSession('c', 'browser')
    ];
    const groups = groupBySurface(sessions);
    expect(groups.browser).toHaveLength(2);
    expect(groups.mobile).toHaveLength(1);
  });

  it('puts unset sessions under unset key', () => {
    const sessions = [makeSession('x')];
    const groups = groupBySurface(sessions);
    expect(groups.unset).toHaveLength(1);
  });
});
