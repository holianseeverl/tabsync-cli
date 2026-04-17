const { getStreak, incrementStreak, clearStreak, setStreakByName, filterByMinStreak, sortByStreak } = require('./streak');

function makeSession(name, streak) {
  return { id: name, name, tabs: [], createdAt: new Date().toISOString(), ...(streak ? { streak } : {}) };
}

test('getStreak returns default if no streak', () => {
  const s = makeSession('a');
  expect(getStreak(s)).toEqual({ count: 0, lastAccessed: null });
});

test('incrementStreak starts at 1 for new session', () => {
  const s = makeSession('a');
  const result = incrementStreak(s, '2024-01-10T10:00:00.000Z');
  expect(result.streak.count).toBe(1);
});

test('incrementStreak increments on consecutive day', () => {
  const s = makeSession('a', { count: 3, lastAccessed: '2024-01-09T10:00:00.000Z' });
  const result = incrementStreak(s, '2024-01-10T10:00:00.000Z');
  expect(result.streak.count).toBe(4);
});

test('incrementStreak resets on gap', () => {
  const s = makeSession('a', { count: 5, lastAccessed: '2024-01-05T10:00:00.000Z' });
  const result = incrementStreak(s, '2024-01-10T10:00:00.000Z');
  expect(result.streak.count).toBe(1);
});

test('incrementStreak keeps count same day', () => {
  const s = makeSession('a', { count: 3, lastAccessed: '2024-01-10T08:00:00.000Z' });
  const result = incrementStreak(s, '2024-01-10T12:00:00.000Z');
  expect(result.streak.count).toBe(3);
});

test('clearStreak removes streak', () => {
  const s = makeSession('a', { count: 5, lastAccessed: '2024-01-10T10:00:00.000Z' });
  const result = clearStreak(s);
  expect(result.streak).toBeUndefined();
});

test('setStreakByName updates correct session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setStreakByName(sessions, 'a', '2024-01-10T10:00:00.000Z');
  expect(result[0].streak.count).toBe(1);
  expect(result[1].streak).toBeUndefined();
});

test('filterByMinStreak filters correctly', () => {
  const sessions = [
    makeSession('a', { count: 2, lastAccessed: null }),
    makeSession('b', { count: 7, lastAccessed: null }),
    makeSession('c')
  ];
  expect(filterByMinStreak(sessions, 3)).toHaveLength(1);
  expect(filterByMinStreak(sessions, 3)[0].name).toBe('b');
});

test('sortByStreak sorts descending', () => {
  const sessions = [
    makeSession('a', { count: 2, lastAccessed: null }),
    makeSession('b', { count: 9, lastAccessed: null }),
    makeSession('c', { count: 5, lastAccessed: null })
  ];
  const sorted = sortByStreak(sessions);
  expect(sorted.map(s => s.name)).toEqual(['b', 'c', 'a']);
});
