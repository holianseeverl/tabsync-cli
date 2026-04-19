const {
  getDriftDays,
  setLastActive,
  setLastActiveByName,
  clearDrift,
  filterByMinDrift,
  sortByDrift,
  formatDrift
} = require('./drift');

function makeSession(name, daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { id: name, name, lastActiveAt: d.toISOString(), tabs: [] };
}

test('getDriftDays returns correct days', () => {
  const s = makeSession('a', 5);
  expect(getDriftDays(s)).toBe(5);
});

test('getDriftDays returns null if no date', () => {
  expect(getDriftDays({ name: 'x', tabs: [] })).toBeNull();
});

test('getDriftDays falls back to createdAt', () => {
  const d = new Date();
  d.setDate(d.getDate() - 3);
  const s = { name: 'x', createdAt: d.toISOString(), tabs: [] };
  expect(getDriftDays(s)).toBe(3);
});

test('setLastActive sets lastActiveAt', () => {
  const s = { name: 'a', tabs: [] };
  const result = setLastActive(s, '2024-01-01T00:00:00.000Z');
  expect(result.lastActiveAt).toBe('2024-01-01T00:00:00.000Z');
});

test('setLastActiveByName updates matching session', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 2)];
  const updated = setLastActiveByName(sessions, 'a', '2024-01-01T00:00:00.000Z');
  expect(updated[0].lastActiveAt).toBe('2024-01-01T00:00:00.000Z');
  expect(updated[1].lastActiveAt).toBe(sessions[1].lastActiveAt);
});

test('clearDrift removes lastActiveAt', () => {
  const s = makeSession('a', 5);
  const result = clearDrift(s);
  expect(result.lastActiveAt).toBeUndefined();
});

test('filterByMinDrift filters correctly', () => {
  const sessions = [makeSession('a', 10), makeSession('b', 2), makeSession('c', 7)];
  const result = filterByMinDrift(sessions, 7);
  expect(result.map(s => s.name)).toEqual(['a', 'c']);
});

test('sortByDrift sorts most inactive first', () => {
  const sessions = [makeSession('a', 1), makeSession('b', 10), makeSession('c', 5)];
  const result = sortByDrift(sessions);
  expect(result[0].name).toBe('b');
  expect(result[2].name).toBe('a');
});

test('formatDrift returns readable string', () => {
  expect(formatDrift(makeSession('a', 0))).toBe('active today');
  expect(formatDrift(makeSession('a', 1))).toBe('1 day inactive');
  expect(formatDrift(makeSession('a', 5))).toBe('5 days inactive');
  expect(formatDrift({ name: 'x', tabs: [] })).toBe('unknown');
});
