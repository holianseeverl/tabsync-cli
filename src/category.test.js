const { isValidCategory, setCategory, clearCategory, setCategoryByName, getCategory, filterByCategory, listCategories } = require('./category');

const makeSessions = () => [
  { id: '1', name: 'Work Tabs', tabs: [] },
  { id: '2', name: 'Fun Stuff', tabs: [], category: 'media' },
  { id: '3', name: 'Research', tabs: [], category: 'research' },
];

test('isValidCategory returns true for valid', () => {
  expect(isValidCategory('work')).toBe(true);
  expect(isValidCategory('dev')).toBe(true);
});

test('isValidCategory returns false for invalid', () => {
  expect(isValidCategory('unknown')).toBe(false);
  expect(isValidCategory('')).toBe(false);
});

test('setCategory assigns category by id', () => {
  const sessions = makeSessions();
  const result = setCategory(sessions, '1', 'work');
  expect(result.find(s => s.id === '1').category).toBe('work');
});

test('setCategory throws on invalid category', () => {
  expect(() => setCategory(makeSessions(), '1', 'bogus')).toThrow();
});

test('clearCategory removes category', () => {
  const sessions = makeSessions();
  const result = clearCategory(sessions, '2');
  expect(result.find(s => s.id === '2').category).toBeUndefined();
});

test('setCategoryByName sets category by name', () => {
  const sessions = makeSessions();
  const result = setCategoryByName(sessions, 'Work Tabs', 'dev');
  expect(result.find(s => s.name === 'Work Tabs').category).toBe('dev');
});

test('getCategory returns category for session', () => {
  expect(getCategory(makeSessions(), '2')).toBe('media');
});

test('getCategory returns null if no category', () => {
  expect(getCategory(makeSessions(), '1')).toBeNull();
});

test('filterByCategory returns matching sessions', () => {
  const result = filterByCategory(makeSessions(), 'research');
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('3');
});

test('filterByCategory throws on invalid category', () => {
  expect(() => filterByCategory(makeSessions(), 'nope')).toThrow();
});

test('listCategories returns all valid categories', () => {
  const cats = listCategories();
  expect(cats).toContain('work');
  expect(cats).toContain('other');
  expect(cats.length).toBeGreaterThan(0);
});
