const {
  getBlocklist,
  addToBlocklist,
  removeFromBlocklist,
  clearBlocklist,
  isBlocked,
  filterBlockedTabs,
  addToBlocklistByName
} = require('./blocklist');

const makeSession = (overrides = {}) => ({
  id: 's1',
  name: 'Test',
  tabs: [
    { url: 'https://google.com' },
    { url: 'https://ads.tracker.com' },
    { url: 'https://example.com' }
  ],
  ...overrides
});

test('getBlocklist returns empty array by default', () => {
  expect(getBlocklist(makeSession())).toEqual([]);
});

test('addToBlocklist adds a pattern', () => {
  const s = addToBlocklist(makeSession(), 'tracker.com');
  expect(s.blocklist).toContain('tracker.com');
});

test('addToBlocklist does not duplicate', () => {
  let s = addToBlocklist(makeSession(), 'tracker.com');
  s = addToBlocklist(s, 'tracker.com');
  expect(s.blocklist.length).toBe(1);
});

test('addToBlocklist throws on invalid pattern', () => {
  expect(() => addToBlocklist(makeSession(), '')).toThrow();
});

test('removeFromBlocklist removes a pattern', () => {
  let s = addToBlocklist(makeSession(), 'tracker.com');
  s = removeFromBlocklist(s, 'tracker.com');
  expect(s.blocklist).not.toContain('tracker.com');
});

test('clearBlocklist empties the list', () => {
  let s = addToBlocklist(makeSession(), 'ads.com');
  s = clearBlocklist(s);
  expect(s.blocklist).toEqual([]);
});

test('isBlocked returns true when url matches pattern', () => {
  const s = addToBlocklist(makeSession(), 'tracker.com');
  expect(isBlocked(s, 'https://ads.tracker.com')).toBe(true);
});

test('isBlocked returns false when url does not match', () => {
  const s = addToBlocklist(makeSession(), 'tracker.com');
  expect(isBlocked(s, 'https://google.com')).toBe(false);
});

test('filterBlockedTabs removes blocked tabs', () => {
  const s = addToBlocklist(makeSession(), 'tracker.com');
  const result = filterBlockedTabs(s);
  expect(result.tabs.every(t => !t.url.includes('tracker.com'))).toBe(true);
  expect(result.tabs.length).toBe(2);
});

test('addToBlocklistByName updates correct session', () => {
  const sessions = [makeSession({ name: 'A' }), makeSession({ name: 'B' })];
  const result = addToBlocklistByName(sessions, 'A', 'ads.com');
  expect(result[0].blocklist).toContain('ads.com');
  expect(result[1].blocklist).toBeUndefined();
});
