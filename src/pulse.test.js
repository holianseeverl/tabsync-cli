const {
  recordPulse,
  clearPulse,
  recordPulseByName,
  getLastPulse,
  getPulseCount,
  getPulseRate,
  sortByPulse,
  filterByMinPulse
} = require('./pulse');

function makeSession(name, pulses = []) {
  return { id: name, name, tabs: [], pulse: pulses.length ? pulses : undefined };
}

test('recordPulse adds timestamp', () => {
  const s = makeSession('a');
  const result = recordPulse(s);
  expect(result.pulse).toHaveLength(1);
  expect(typeof result.pulse[0]).toBe('number');
});

test('recordPulse appends to existing', () => {
  const s = makeSession('a', [1000]);
  const result = recordPulse(s);
  expect(result.pulse).toHaveLength(2);
  expect(result.pulse[0]).toBe(1000);
});

test('clearPulse removes pulse', () => {
  const s = makeSession('a', [1000, 2000]);
  const result = clearPulse(s);
  expect(result.pulse).toBeUndefined();
});

test('recordPulseByName targets correct session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = recordPulseByName(sessions, 'b');
  expect(result[0].pulse).toBeUndefined();
  expect(result[1].pulse).toHaveLength(1);
});

test('getLastPulse returns last timestamp', () => {
  const s = makeSession('a', [100, 200, 300]);
  expect(getLastPulse(s)).toBe(300);
});

test('getLastPulse returns null when no pulse', () => {
  expect(getLastPulse(makeSession('a'))).toBeNull();
});

test('getPulseCount returns count', () => {
  expect(getPulseCount(makeSession('a', [1, 2, 3]))).toBe(3);
  expect(getPulseCount(makeSession('b'))).toBe(0);
});

test('sortByPulse sorts by most recent last pulse', () => {
  const now = Date.now();
  const sessions = [makeSession('a', [now - 5000]), makeSession('b', [now - 1000])];
  const sorted = sortByPulse(sessions);
  expect(sorted[0].name).toBe('b');
});

test('filterByMinPulse filters correctly', () => {
  const sessions = [makeSession('a', [1, 2]), makeSession('b', [1])];
  const result = filterByMinPulse(sessions, 2);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('a');
});
