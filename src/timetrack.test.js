const {
  startTracking, stopTracking, getTrackedTime, clearTracking,
  formatDuration, sortByTrackedTime, filterByMinTime
} = require('./timetrack');

function makeSession(name, totalMs = 0) {
  return { id: name, name, tabs: [], timetrack: totalMs ? { totalMs } : undefined };
}

test('startTracking sets startedAt', () => {
  const s = makeSession('work');
  const result = startTracking(s);
  expect(result.timetrack.startedAt).toBeDefined();
});

test('stopTracking accumulates time', () => {
  let s = makeSession('work');
  s = startTracking(s);
  s = { ...s, timetrack: { ...s.timetrack, startedAt: Date.now() - 5000 } };
  s = stopTracking(s);
  expect(s.timetrack.totalMs).toBeGreaterThanOrEqual(5000);
  expect(s.timetrack.startedAt).toBeNull();
});

test('stopTracking with no startedAt returns unchanged', () => {
  const s = makeSession('idle');
  const result = stopTracking(s);
  expect(result).toEqual(s);
});

test('getTrackedTime returns 0 if no tracking', () => {
  expect(getTrackedTime(makeSession('x'))).toBe(0);
});

test('clearTracking removes timetrack', () => {
  const s = makeSession('work', 3000);
  const result = clearTracking(s);
  expect(result.timetrack).toBeUndefined();
});

test('formatDuration formats correctly', () => {
  expect(formatDuration(500)).toBe('500ms');
  expect(formatDuration(3000)).toBe('3s');
  expect(formatDuration(90000)).toBe('1m 30s');
  expect(formatDuration(3661000)).toBe('1h 1m 1s');
});

test('sortByTrackedTime sorts descending', () => {
  const sessions = [makeSession('a', 100), makeSession('b', 500), makeSession('c', 200)];
  const sorted = sortByTrackedTime(sessions);
  expect(sorted[0].name).toBe('b');
  expect(sorted[2].name).toBe('a');
});

test('filterByMinTime filters correctly', () => {
  const sessions = [makeSession('a', 100), makeSession('b', 5000), makeSession('c', 3000)];
  const result = filterByMinTime(sessions, 3000);
  expect(result.map(s => s.name)).toEqual(['b', 'c']);
});
