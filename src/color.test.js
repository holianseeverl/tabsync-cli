const {
  colorSession,
  uncolorSession,
  filterByColor,
  getSessionColor,
  colorSessionByName,
  VALID_COLORS,
} = require('./color');

const baseSessions = [
  { id: '1', name: 'Work', tabs: [], createdAt: '2024-01-01' },
  { id: '2', name: 'Research', tabs: [], createdAt: '2024-01-02', color: 'blue' },
  { id: '3', name: 'Personal', tabs: [], createdAt: '2024-01-03', color: 'green' },
];

test('colorSession assigns a valid color to a session', () => {
  const result = colorSession(baseSessions, '1', 'red');
  expect(result.find(s => s.id === '1').color).toBe('red');
});

test('colorSession normalizes color to lowercase', () => {
  const result = colorSession(baseSessions, '1', 'BLUE');
  expect(result.find(s => s.id === '1').color).toBe('blue');
});

test('colorSession throws on invalid color', () => {
  expect(() => colorSession(baseSessions, '1', 'magenta')).toThrow('Invalid color');
});

test('colorSession does not mutate other sessions', () => {
  const result = colorSession(baseSessions, '1', 'purple');
  expect(result.find(s => s.id === '2').color).toBe('blue');
  expect(result.find(s => s.id === '3').color).toBe('green');
});

test('uncolorSession removes color from session', () => {
  const result = uncolorSession(baseSessions, '2');
  expect(result.find(s => s.id === '2').color).toBeUndefined();
});

test('uncolorSession leaves uncolored sessions unchanged', () => {
  const result = uncolorSession(baseSessions, '1');
  expect(result.find(s => s.id === '1').color).toBeUndefined();
});

test('filterByColor returns sessions matching color', () => {
  const result = filterByColor(baseSessions, 'blue');
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('2');
});

test('filterByColor returns empty array if no matches', () => {
  const result = filterByColor(baseSessions, 'pink');
  expect(result).toHaveLength(0);
});

test('filterByColor throws on invalid color', () => {
  expect(() => filterByColor(baseSessions, 'neon')).toThrow('Invalid color');
});

test('getSessionColor returns color for colored session', () => {
  expect(getSessionColor(baseSessions, '2')).toBe('blue');
});

test('getSessionColor returns null for uncolored session', () => {
  expect(getSessionColor(baseSessions, '1')).toBeNull();
});

test('getSessionColor returns null for unknown session', () => {
  expect(getSessionColor(baseSessions, '99')).toBeNull();
});

test('colorSessionByName colors session by name', () => {
  const result = colorSessionByName(baseSessions, 'Work', 'yellow');
  expect(result.find(s => s.name === 'Work').color).toBe('yellow');
});

test('colorSessionByName throws if session not found', () => {
  expect(() => colorSessionByName(baseSessions, 'Nonexistent', 'red')).toThrow('not found');
});

test('VALID_COLORS exports expected colors', () => {
  expect(VALID_COLORS).toContain('red');
  expect(VALID_COLORS).toContain('blue');
  expect(VALID_COLORS.length).toBeGreaterThan(0);
});
