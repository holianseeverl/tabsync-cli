const { isValidTempo, setTempo, clearTempo, setTempoByName, getTempo, filterByTempo, sortByTempo } = require('./tempo');

function makeSession(name, tempo) {
  const s = { id: name, name, tabs: [] };
  if (tempo) s.tempo = tempo;
  return s;
}

test('isValidTempo accepts valid values', () => {
  expect(isValidTempo('slow')).toBe(true);
  expect(isValidTempo('sprint')).toBe(true);
  expect(isValidTempo('turbo')).toBe(false);
});

test('setTempo sets tempo on session', () => {
  const s = makeSession('a');
  const result = setTempo(s, 'fast');
  expect(result.tempo).toBe('fast');
  expect(s.tempo).toBeUndefined();
});

test('setTempo throws on invalid tempo', () => {
  expect(() => setTempo(makeSession('a'), 'turbo')).toThrow('Invalid tempo');
});

test('clearTempo removes tempo', () => {
  const s = makeSession('a', 'sprint');
  const result = clearTempo(s);
  expect(result.tempo).toBeUndefined();
});

test('setTempoByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setTempoByName(sessions, 'a', 'steady');
  expect(result[0].tempo).toBe('steady');
  expect(result[1].tempo).toBeUndefined();
});

test('getTempo returns tempo or null', () => {
  expect(getTempo(makeSession('a', 'slow'))).toBe('slow');
  expect(getTempo(makeSession('b'))).toBeNull();
});

test('filterByTempo returns matching sessions', () => {
  const sessions = [makeSession('a', 'fast'), makeSession('b', 'slow'), makeSession('c', 'fast')];
  expect(filterByTempo(sessions, 'fast')).toHaveLength(2);
});

test('filterByTempo throws on invalid tempo', () => {
  expect(() => filterByTempo([], 'zoom')).toThrow('Invalid tempo');
});

test('sortByTempo orders sprint first', () => {
  const sessions = [makeSession('a', 'slow'), makeSession('b', 'sprint'), makeSession('c', 'fast')];
  const sorted = sortByTempo(sessions);
  expect(sorted[0].name).toBe('b');
  expect(sorted[1].name).toBe('c');
  expect(sorted[2].name).toBe('a');
});

test('sortByTempo puts sessions without tempo last', () => {
  const sessions = [makeSession('a'), makeSession('b', 'fast')];
  const sorted = sortByTempo(sessions);
  expect(sorted[0].name).toBe('b');
});
