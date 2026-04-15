const {
  isValidColor,
  colorSession,
  uncolorSession,
  filterByColor,
  getSessionColor,
} = require('./color');

const makeSession = (id, name, color = null) => ({
  id,
  name,
  tabs: [],
  createdAt: new Date().toISOString(),
  ...(color ? { color } : {}),
});

describe('isValidColor', () => {
  test('accepts known color names', () => {
    expect(isValidColor('red')).toBe(true);
    expect(isValidColor('blue')).toBe(true);
    expect(isValidColor('green')).toBe(true);
  });

  test('accepts hex colors', () => {
    expect(isValidColor('#ff0000')).toBe(true);
    expect(isValidColor('#abc')).toBe(true);
  });

  test('rejects invalid colors', () => {
    expect(isValidColor('notacolor')).toBe(false);
    expect(isValidColor('')).toBe(false);
    expect(isValidColor(null)).toBe(false);
  });
});

describe('colorSession', () => {
  test('sets color on matching session', () => {
    const sessions = [makeSession('1', 'Work'), makeSession('2', 'Home')];
    const result = colorSession(sessions, '1', 'blue');
    expect(result.find(s => s.id === '1').color).toBe('blue');
    expect(result.find(s => s.id === '2').color).toBeUndefined();
  });

  test('returns unchanged sessions if id not found', () => {
    const sessions = [makeSession('1', 'Work')];
    const result = colorSession(sessions, '99', 'red');
    expect(result).toEqual(sessions);
  });

  test('throws on invalid color', () => {
    const sessions = [makeSession('1', 'Work')];
    expect(() => colorSession(sessions, '1', 'notacolor')).toThrow();
  });
});

describe('uncolorSession', () => {
  test('removes color from session', () => {
    const sessions = [makeSession('1', 'Work', 'red')];
    const result = uncolorSession(sessions, '1');
    expect(result.find(s => s.id === '1').color).toBeUndefined();
  });

  test('no-op if session has no color', () => {
    const sessions = [makeSession('1', 'Work')];
    const result = uncolorSession(sessions, '1');
    expect(result.find(s => s.id === '1').color).toBeUndefined();
  });
});

describe('filterByColor', () => {
  test('returns sessions matching color', () => {
    const sessions = [
      makeSession('1', 'A', 'red'),
      makeSession('2', 'B', 'blue'),
      makeSession('3', 'C', 'red'),
    ];
    const result = filterByColor(sessions, 'red');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toEqual(['1', '3']);
  });

  test('returns empty array if no matches', () => {
    const sessions = [makeSession('1', 'A', 'blue')];
    expect(filterByColor(sessions, 'green')).toEqual([]);
  });
});

describe('getSessionColor', () => {
  test('returns color of session', () => {
    const sessions = [makeSession('1', 'Work', 'purple')];
    expect(getSessionColor(sessions, '1')).toBe('purple');
  });

  test('returns null if no color set', () => {
    const sessions = [makeSession('1', 'Work')];
    expect(getSessionColor(sessions, '1')).toBeNull();
  });

  test('returns null if session not found', () => {
    expect(getSessionColor([], '99')).toBeNull();
  });
});
