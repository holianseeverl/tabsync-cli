const { isValidRelay, setRelay, clearRelay, setRelayByName, getRelay, filterByRelay, listRelayTargets, groupByRelay } = require('./relay');

function makeSession(name, relay) {
  const s = { id: name, name, tabs: [] };
  if (relay) s.relay = relay;
  return s;
}

test('isValidRelay accepts non-empty string', () => {
  expect(isValidRelay('home-machine')).toBe(true);
  expect(isValidRelay('')).toBe(false);
  expect(isValidRelay(null)).toBe(false);
});

test('setRelay attaches relay to session', () => {
  const s = makeSession('work');
  const result = setRelay(s, 'office-pc');
  expect(result.relay).toBe('office-pc');
});

test('setRelay throws on invalid relay', () => {
  expect(() => setRelay(makeSession('a'), '')).toThrow();
});

test('clearRelay removes relay field', () => {
  const s = makeSession('work', 'office-pc');
  const result = clearRelay(s);
  expect(result.relay).toBeUndefined();
});

test('setRelayByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setRelayByName(sessions, 'a', 'home');
  expect(result[0].relay).toBe('home');
  expect(result[1].relay).toBeUndefined();
});

test('getRelay returns relay or null', () => {
  expect(getRelay(makeSession('a', 'x'))).toBe('x');
  expect(getRelay(makeSession('b'))).toBeNull();
});

test('filterByRelay returns matching sessions', () => {
  const sessions = [makeSession('a', 'home'), makeSession('b', 'office'), makeSession('c', 'home')];
  expect(filterByRelay(sessions, 'home')).toHaveLength(2);
});

test('listRelayTargets returns sorted unique targets', () => {
  const sessions = [makeSession('a', 'home'), makeSession('b', 'office'), makeSession('c', 'home')];
  expect(listRelayTargets(sessions)).toEqual(['home', 'office']);
});

test('groupByRelay groups correctly', () => {
  const sessions = [makeSession('a', 'home'), makeSession('b', 'office'), makeSession('c')];
  const groups = groupByRelay(sessions);
  expect(groups['home']).toHaveLength(1);
  expect(groups['__none__']).toHaveLength(1);
});
