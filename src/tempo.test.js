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
  expect(setTempo(s, 'fast').tempo).toBe('fast');
});

test('setTempo throws on invalid tempo', () => {
  expect(() => setTempo(makeSession('a'), 'warp')).toThrow();
});

test('clearTempo removes tempo', () => {
  const s = makeSession('a', 'slow');
  expect(clearTempo(s).tempo).toBeUndefined();
});

test('setTempoByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setTempoByName(sessions, 'a', 'steady');
  expect(result[0].tempo).toBe('steady');
  expect(result[1].tempo).toBeUndefined();
});

test('getTempo returns tempo or null', () => {
  expect(getTempo(makeSession('a', 'fast'))).toBe('fast');
  expect(getTempo(makeSession('b'))).toBeNull();
});

test('filterByTempo filters correctly', () => {
  const sessions = [makeSession('a', 'fast'), makeSession('b', 'slow'), makeSession('c', 'fast')];
  expect(filterByTempo(sessions, 'fast')).toHaveLength(2);
});

test('sortByTempo orders sprint first', () => {
  const sessions = [makeSession('a', 'slow'), makeSession('b', 'sprint'), makeSession('c', 'fast')];
  const sorted = sortByTempo(sessions);
  expect(sorted[0].tempo).toBe('sprint');
  expect(sorted[1].tempo).toBe('fast');
  expect(sorted[2].tempo).toBe('slow');
});

test('sortByTempo puts sessions without tempo last', () => {
  const sessions = [makeSession('a'), makeSession('b', 'steady')];
  const sorted = sortByTempo(sessions);
  expect(sorted[0].tempo).toBe('steady');
});
