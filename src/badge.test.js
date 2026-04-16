const { isValidBadge, setBadge, clearBadge, setBadgeByName, filterByBadge, getBadge, listBadges } = require('./badge');

const mockSessions = () => [
  { id: '1', name: 'Work', tabs: [] },
  { id: '2', name: 'Research', tabs: [], badge: 'review' },
];

test('isValidBadge returns true for valid badges', () => {
  expect(isValidBadge('new')).toBe(true);
  expect(isValidBadge('done')).toBe(true);
});

test('isValidBadge returns false for unknown badge', () => {
  expect(isValidBadge('unknown')).toBe(false);
});

test('setBadge assigns badge to session by id', () => {
  const result = setBadge(mockSessions(), '1', 'important');
  expect(result.find(s => s.id === '1').badge).toBe('important');
});

test('setBadge throws on invalid badge', () => {
  expect(() => setBadge(mockSessions(), '1', 'bogus')).toThrow();
});

test('clearBadge removes badge from session', () => {
  const result = clearBadge(mockSessions(), '2');
  expect(result.find(s => s.id === '2').badge).toBeUndefined();
});

test('setBadgeByName assigns badge by name', () => {
  const result = setBadgeByName(mockSessions(), 'Work', 'new');
  expect(result.find(s => s.name === 'Work').badge).toBe('new');
});

test('filterByBadge returns only matching sessions', () => {
  const result = filterByBadge(mockSessions(), 'review');
  expect(result.length).toBe(1);
  expect(result[0].name).toBe('Research');
});

test('getBadge returns badge for session', () => {
  expect(getBadge(mockSessions(), '2')).toBe('review');
  expect(getBadge(mockSessions(), '1')).toBeNull();
});

test('listBadges returns all valid badge names', () => {
  const badges = listBadges();
  expect(badges).toContain('new');
  expect(badges).toContain('done');
  expect(badges.length).toBeGreaterThan(0);
});
