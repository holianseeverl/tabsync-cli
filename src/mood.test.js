const { isValidMood, setMood, clearMood, setMoodByName, getMood, filterByMood, sortByMood } = require('./mood');

function makeSession(name, mood) {
  const s = { id: name, name, tabs: [] };
  if (mood) s.mood = mood;
  return s;
}

test('isValidMood returns true for valid moods', () => {
  expect(isValidMood('focused')).toBe(true);
  expect(isValidMood('relaxed')).toBe(true);
});

test('isValidMood returns false for invalid mood', () => {
  expect(isValidMood('happy')).toBe(false);
  expect(isValidMood('')).toBe(false);
});

test('setMood sets mood on session', () => {
  const s = makeSession('a');
  const result = setMood(s, 'focused');
  expect(result.mood).toBe('focused');
});

test('setMood throws for invalid mood', () => {
  expect(() => setMood(makeSession('a'), 'hyper')).toThrow();
});

test('clearMood removes mood', () => {
  const s = makeSession('a', 'relaxed');
  const result = clearMood(s);
  expect(result.mood).toBeUndefined();
});

test('setMoodByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setMoodByName(sessions, 'a', 'urgent');
  expect(result[0].mood).toBe('urgent');
  expect(result[1].mood).toBeUndefined();
});

test('getMood returns mood or null', () => {
  expect(getMood(makeSession('a', 'curious'))).toBe('curious');
  expect(getMood(makeSession('b'))).toBeNull();
});

test('filterByMood returns matching sessions', () => {
  const sessions = [makeSession('a', 'focused'), makeSession('b', 'relaxed'), makeSession('c', 'focused')];
  expect(filterByMood(sessions, 'focused')).toHaveLength(2);
});

test('sortByMood sorts by mood order', () => {
  const sessions = [makeSession('c', 'urgent'), makeSession('a', 'focused'), makeSession('b')];
  const sorted = sortByMood(sessions);
  expect(sorted[0].mood).toBe('focused');
  expect(sorted[1].mood).toBe('urgent');
  expect(sorted[2].mood).toBeUndefined();
});
