const { isValidRhythm, setRhythm, clearRhythm, setRhythmByName, getRhythm, filterByRhythm, sortByRhythm, listRhythms } = require('./rhythm');

function makeSession(name, rhythm) {
  const s = { id: name, name, tabs: [] };
  if (rhythm) s.rhythm = rhythm;
  return s;
}

test('isValidRhythm accepts valid values', () => {
  expect(isValidRhythm('daily')).toBe(true);
  expect(isValidRhythm('weekly')).toBe(true);
  expect(isValidRhythm('monthly')).toBe(true);
});

test('isValidRhythm rejects invalid values', () => {
  expect(isValidRhythm('hourly')).toBe(false);
  expect(isValidRhythm('')).toBe(false);
});

test('setRhythm sets rhythm on session', () => {
  const s = makeSession('a');
  const result = setRhythm(s, 'weekly');
  expect(result.rhythm).toBe('weekly');
});

test('setRhythm throws on invalid rhythm', () => {
  expect(() => setRhythm(makeSession('a'), 'hourly')).toThrow();
});

test('clearRhythm removes rhythm', () => {
  const s = makeSession('a', 'daily');
  const result = clearRhythm(s);
  expect(result.rhythm).toBeUndefined();
});

test('setRhythmByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b', 'daily')];
  const result = setRhythmByName(sessions, 'a', 'monthly');
  expect(result[0].rhythm).toBe('monthly');
  expect(result[1].rhythm).toBe('daily');
});

test('getRhythm returns rhythm or null', () => {
  expect(getRhythm(makeSession('a', 'weekly'))).toBe('weekly');
  expect(getRhythm(makeSession('b'))).toBeNull();
});

test('filterByRhythm filters correctly', () => {
  const sessions = [makeSession('a', 'daily'), makeSession('b', 'weekly'), makeSession('c', 'daily')];
  expect(filterByRhythm(sessions, 'daily')).toHaveLength(2);
});

test('sortByRhythm sorts by rhythm order', () => {
  const sessions = [makeSession('a', 'monthly'), makeSession('b', 'daily'), makeSession('c', 'weekly')];
  const sorted = sortByRhythm(sessions);
  expect(sorted[0].rhythm).toBe('daily');
  expect(sorted[1].rhythm).toBe('weekly');
});

test('listRhythms returns all valid rhythms', () => {
  const list = listRhythms();
  expect(list).toContain('daily');
  expect(list).toContain('quarterly');
});
