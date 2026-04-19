const { isValidSpike, setSpike, clearSpike, setSpikeByName, getSpike, filterBySpike, sortBySpike } = require('./spike');

function makeSession(name, spike = undefined) {
  const s = { id: name, name, tabs: [] };
  if (spike) s.spike = spike;
  return s;
}

test('isValidSpike accepts valid levels', () => {
  expect(isValidSpike('low')).toBe(true);
  expect(isValidSpike('critical')).toBe(true);
  expect(isValidSpike('extreme')).toBe(false);
});

test('setSpike sets spike on session', () => {
  const s = makeSession('work');
  const updated = setSpike(s, 'high', 'urgent release');
  expect(updated.spike.level).toBe('high');
  expect(updated.spike.note).toBe('urgent release');
  expect(updated.spike.setAt).toBeDefined();
});

test('setSpike throws on invalid level', () => {
  expect(() => setSpike(makeSession('x'), 'extreme')).toThrow();
});

test('clearSpike removes spike', () => {
  const s = setSpike(makeSession('work'), 'medium');
  const cleared = clearSpike(s);
  expect(cleared.spike).toBeUndefined();
});

test('setSpikeByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const updated = setSpikeByName(sessions, 'b', 'low', 'minor');
  expect(updated[0].spike).toBeUndefined();
  expect(updated[1].spike.level).toBe('low');
});

test('getSpike returns null when not set', () => {
  expect(getSpike(makeSession('x'))).toBeNull();
});

test('filterBySpike filters correctly', () => {
  const sessions = [
    setSpike(makeSession('a'), 'high'),
    setSpike(makeSession('b'), 'low'),
    setSpike(makeSession('c'), 'high')
  ];
  expect(filterBySpike(sessions, 'high')).toHaveLength(2);
});

test('sortBySpike sorts critical first', () => {
  const sessions = [
    setSpike(makeSession('a'), 'low'),
    setSpike(makeSession('b'), 'critical'),
    setSpike(makeSession('c'), 'medium')
  ];
  const sorted = sortBySpike(sessions);
  expect(sorted[0].name).toBe('b');
  expect(sorted[2].name).toBe('a');
});
