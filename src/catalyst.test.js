const {
  isValidCatalyst,
  setCatalyst,
  clearCatalyst,
  setCatalystByName,
  getCatalyst,
  filterByCatalyst,
  groupByCatalyst,
  sortByCatalyst,
} = require('./catalyst');

const makeSession = (name, catalyst) => ({ id: name, name, tabs: [], catalyst });

describe('isValidCatalyst', () => {
  it('returns true for valid catalysts', () => {
    expect(isValidCatalyst('manual')).toBe(true);
    expect(isValidCatalyst('scheduled')).toBe(true);
    expect(isValidCatalyst('cloned')).toBe(true);
  });

  it('returns false for invalid catalysts', () => {
    expect(isValidCatalyst('random')).toBe(false);
    expect(isValidCatalyst('')).toBe(false);
  });
});

describe('setCatalyst', () => {
  it('sets a valid catalyst on a session', () => {
    const s = makeSession('alpha', undefined);
    const result = setCatalyst(s, 'manual');
    expect(result.catalyst).toBe('manual');
  });

  it('throws on invalid catalyst', () => {
    const s = makeSession('alpha', undefined);
    expect(() => setCatalyst(s, 'unknown')).toThrow();
  });

  it('does not mutate original session', () => {
    const s = makeSession('alpha', undefined);
    setCatalyst(s, 'imported');
    expect(s.catalyst).toBeUndefined();
  });
});

describe('clearCatalyst', () => {
  it('removes catalyst from session', () => {
    const s = makeSession('alpha', 'manual');
    const result = clearCatalyst(s);
    expect(result.catalyst).toBeUndefined();
  });
});

describe('setCatalystByName', () => {
  it('sets catalyst on matching session only', () => {
    const sessions = [makeSession('a', undefined), makeSession('b', undefined)];
    const result = setCatalystByName(sessions, 'a', 'triggered');
    expect(result[0].catalyst).toBe('triggered');
    expect(result[1].catalyst).toBeUndefined();
  });
});

describe('getCatalyst', () => {
  it('returns catalyst if set', () => {
    expect(getCatalyst(makeSession('x', 'restored'))).toBe('restored');
  });

  it('returns null if not set', () => {
    expect(getCatalyst(makeSession('x', undefined))).toBeNull();
  });
});

describe('filterByCatalyst', () => {
  it('filters sessions by catalyst', () => {
    const sessions = [
      makeSession('a', 'manual'),
      makeSession('b', 'cloned'),
      makeSession('c', 'manual'),
    ];
    expect(filterByCatalyst(sessions, 'manual')).toHaveLength(2);
    expect(filterByCatalyst(sessions, 'cloned')).toHaveLength(1);
  });
});

describe('groupByCatalyst', () => {
  it('groups sessions by catalyst key', () => {
    const sessions = [
      makeSession('a', 'manual'),
      makeSession('b', 'manual'),
      makeSession('c', 'imported'),
      makeSession('d', undefined),
    ];
    const groups = groupByCatalyst(sessions);
    expect(groups['manual']).toHaveLength(2);
    expect(groups['imported']).toHaveLength(1);
    expect(groups['unset']).toHaveLength(1);
  });
});

describe('sortByCatalyst', () => {
  it('sorts sessions by catalyst order', () => {
    const sessions = [
      makeSession('a', 'restored'),
      makeSession('b', 'manual'),
    ];
    const sorted = sortByCatalyst(sessions);
    expect(sorted[0].name).toBe('b');
  });
});
