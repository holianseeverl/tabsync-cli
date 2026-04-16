const {
  setContext,
  clearContext,
  getContext,
  filterByContextKey,
  filterByContextValue,
  setContextByName,
} = require('./context');

function makeSession(name, context = {}) {
  return { id: name, name, tabs: [], context };
}

test('setContext adds key to session', () => {
  const s = makeSession('work');
  const result = setContext(s, 'device', 'laptop');
  expect(result.context.device).toBe('laptop');
});

test('setContext does not mutate original', () => {
  const s = makeSession('work');
  setContext(s, 'device', 'laptop');
  expect(s.context.device).toBeUndefined();
});

test('setContext merges with existing context', () => {
  const s = makeSession('work', { env: 'prod' });
  const result = setContext(s, 'device', 'laptop');
  expect(result.context.env).toBe('prod');
  expect(result.context.device).toBe('laptop');
});

test('setContext throws on invalid key', () => {
  const s = makeSession('work');
  expect(() => setContext(s, '', 'val')).toThrow();
});

test('clearContext removes key', () => {
  const s = makeSession('work', { device: 'laptop', env: 'prod' });
  const result = clearContext(s, 'device');
  expect(result.context.device).toBeUndefined();
  expect(result.context.env).toBe('prod');
});

test('clearContext returns session unchanged if no context', () => {
  const s = { id: 'x', name: 'x', tabs: [] };
  expect(clearContext(s, 'key')).toEqual(s);
});

test('getContext returns value', () => {
  const s = makeSession('work', { device: 'desktop' });
  expect(getContext(s, 'device')).toBe('desktop');
});

test('getContext returns undefined for missing key', () => {
  const s = makeSession('work');
  expect(getContext(s, 'missing')).toBeUndefined();
});

test('filterByContextKey returns matching sessions', () => {
  const sessions = [
    makeSession('a', { device: 'laptop' }),
    makeSession('b'),
    makeSession('c', { device: 'phone' }),
  ];
  const result = filterByContextKey(sessions, 'device');
  expect(result).toHaveLength(2);
});

test('filterByContextValue returns exact matches', () => {
  const sessions = [
    makeSession('a', { device: 'laptop' }),
    makeSession('b', { device: 'phone' }),
  ];
  const result = filterByContextValue(sessions, 'device', 'laptop');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('a');
});

test('setContextByName updates matching session', () => {
  const sessions = [makeSession('alpha'), makeSession('beta')];
  const result = setContextByName(sessions, 'alpha', 'role', 'admin');
  expect(result.find(s => s.name === 'alpha').context.role).toBe('admin');
  expect(result.find(s => s.name === 'beta').context.role).toBeUndefined();
});
