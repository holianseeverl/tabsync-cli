const {
  isValidBurndownEntry,
  recordBurndown,
  recordBurndownByName,
  clearBurndown,
  getBurndown,
  computeBurnRate,
  filterByMinBurnRate,
  sortByBurnRate
} = require('./burndown');

function makeSession(name, tabCount, burndown = []) {
  return { id: Math.random().toString(36).slice(2), name, tabs: Array(tabCount).fill({ url: 'https://example.com' }), burndown };
}

test('isValidBurndownEntry accepts valid entry', () => {
  expect(isValidBurndownEntry({ timestamp: new Date().toISOString(), tabCount: 5 })).toBe(true);
});

test('isValidBurndownEntry rejects missing tabCount', () => {
  expect(isValidBurndownEntry({ timestamp: new Date().toISOString() })).toBe(false);
});

test('recordBurndown adds entry with current tab count', () => {
  const s = makeSession('work', 10);
  recordBurndown(s);
  expect(s.burndown).toHaveLength(1);
  expect(s.burndown[0].tabCount).toBe(10);
});

test('recordBurndown initializes burndown array if missing', () => {
  const s = makeSession('work', 3);
  delete s.burndown;
  recordBurndown(s);
  expect(Array.isArray(s.burndown)).toBe(true);
});

test('recordBurndownByName throws if session not found', () => {
  expect(() => recordBurndownByName([], 'ghost')).toThrow('Session not found: ghost');
});

test('recordBurndownByName records on correct session', () => {
  const s = makeSession('proj', 7);
  recordBurndownByName([s], 'proj');
  expect(s.burndown[0].tabCount).toBe(7);
});

test('clearBurndown empties the burndown array', () => {
  const s = makeSession('work', 5, [{ timestamp: new Date().toISOString(), tabCount: 5 }]);
  clearBurndown(s);
  expect(s.burndown).toHaveLength(0);
});

test('getBurndown returns empty array if no burndown', () => {
  const s = makeSession('x', 2);
  expect(getBurndown(s)).toEqual([]);
});

test('computeBurnRate returns null with fewer than 2 entries', () => {
  const s = makeSession('x', 5, [{ timestamp: new Date().toISOString(), tabCount: 5 }]);
  expect(computeBurnRate(s)).toBeNull();
});

test('computeBurnRate calculates rate correctly', () => {
  const now = Date.now();
  const s = makeSession('x', 0, [
    { timestamp: new Date(now - 2 * 86400000).toISOString(), tabCount: 10 },
    { timestamp: new Date(now).toISOString(), tabCount: 4 }
  ]);
  expect(computeBurnRate(s)).toBe(3);
});

test('filterByMinBurnRate filters correctly', () => {
  const now = Date.now();
  const fast = makeSession('fast', 0, [
    { timestamp: new Date(now - 86400000).toISOString(), tabCount: 10 },
    { timestamp: new Date(now).toISOString(), tabCount: 2 }
  ]);
  const slow = makeSession('slow', 0, [
    { timestamp: new Date(now - 86400000).toISOString(), tabCount: 10 },
    { timestamp: new Date(now).toISOString(), tabCount: 9 }
  ]);
  const result = filterByMinBurnRate([fast, slow], 5);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('fast');
});

test('sortByBurnRate sorts descending', () => {
  const now = Date.now();
  const a = makeSession('a', 0, [
    { timestamp: new Date(now - 86400000).toISOString(), tabCount: 5 },
    { timestamp: new Date(now).toISOString(), tabCount: 3 }
  ]);
  const b = makeSession('b', 0, [
    { timestamp: new Date(now - 86400000).toISOString(), tabCount: 10 },
    { timestamp: new Date(now).toISOString(), tabCount: 2 }
  ]);
  const sorted = sortByBurnRate([a, b]);
  expect(sorted[0].name).toBe('b');
});
