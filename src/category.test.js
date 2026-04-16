const { isValidCategory, setCategory, clearCategory, setCategoryByName, getCategory, filterByCategory, sortByCategory } = require('./category');

function makeSession(id, name, extra = {}) {
  return { id, name, tabs: [], createdAt: new Date().toISOString(), ...extra };
}

describe('isValidCategory', () => {
  test('accepts valid strings', () => {
    expect(isValidCategory('work')).toBe(true);
    expect(isValidCategory('personal')).toBe(true);
  });
  test('rejects empty or non-string', () => {
    expect(isValidCategory('')).toBe(false);
    expect(isValidCategory(null)).toBe(false);
    expect(isValidCategory(42)).toBe(false);
  });
});

describe('setCategory', () => {
  test('sets category on session', () => {
    const s = makeSession('1', 'Test');
    const result = setCategory(s, 'work');
    expect(result.category).toBe('work');
  });
  test('throws on invalid category', () => {
    expect(() => setCategory(makeSession('1', 'T'), '')).toThrow();
  });
});

describe('clearCategory', () => {
  test('removes category', () => {
    const s = makeSession('1', 'Test', { category: 'work' });
    const result = clearCategory(s);
    expect(result.category).toBeUndefined();
  });
});

describe('setCategoryByName', () => {
  test('sets category on matching session', () => {
    const sessions = [makeSession('1', 'Alpha'), makeSession('2', 'Beta')];
    const result = setCategoryByName(sessions, 'Alpha', 'research');
    expect(result.find(s => s.id === '1').category).toBe('research');
    expect(result.find(s => s.id === '2').category).toBeUndefined();
  });
  test('returns unchanged if no match', () => {
    const sessions = [makeSession('1', 'Alpha')];
    const result = setCategoryByName(sessions, 'Nope', 'work');
    expect(result).toEqual(sessions);
  });
});

describe('getCategory', () => {
  test('returns category', () => {
    const s = makeSession('1', 'T', { category: 'personal' });
    expect(getCategory(s)).toBe('personal');
  });
  test('returns null if unset', () => {
    expect(getCategory(makeSession('1', 'T'))).toBeNull();
  });
});

describe('filterByCategory', () => {
  test('filters sessions by category', () => {
    const sessions = [
      makeSession('1', 'A', { category: 'work' }),
      makeSession('2', 'B', { category: 'personal' }),
      makeSession('3', 'C', { category: 'work' }),
    ];
    expect(filterByCategory(sessions, 'work')).toHaveLength(2);
  });
});

describe('sortByCategory', () => {
  test('sorts alphabetically by category', () => {
    const sessions = [
      makeSession('1', 'A', { category: 'work' }),
      makeSession('2', 'B', { category: 'personal' }),
    ];
    const sorted = sortByCategory(sessions);
    expect(sorted[0].category).toBe('personal');
  });
});
