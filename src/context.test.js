const { setContext, clearContext, getContext, filterByContextKey, filterByContextValue, setContextByName } = require('./context');

function makeSession(name) {
  return { id: name, name, tabs: [] };
}

test('setContext adds key/value to session', () => {
  const s = makeSession('work');
  setContext(s, 'env', 'production');
  expect(s.context.env).toBe('production');
});

test('setContext throws on invalid key', () => {
  expect(() => setContext(makeSession('a'), '', 'val')).toThrow();
});

test('getContext returns value for key', () => {
  const s = makeSession('work');
  setContext(s, 'region', 'us-east');
  expect(getContext(s, 'region')).toBe('us-east');
});

test('getContext returns all context when no key given', () => {
  const s = makeSession('work');
  setContext(s, 'a', 1);
  setContext(s, 'b', 2);
  expect(getContext(s)).toEqual({ a: 1, b: 2 });
});

test('getContext returns empty object if no context', () => {
  expect(getContext(makeSession('x'))).toEqual({});
});

test('clearContext removes specific key', () => {
  const s = makeSession('work');
  setContext(s, 'env', 'dev');
  setContext(s, 'region', 'eu');
  clearContext(s, 'env');
  expect(s.context.env).toBeUndefined();
  expect(s.context.region).toBe('eu');
});

test('clearContext removes all context when no key given', () => {
  const s = makeSession('work');
  setContext(s, 'env', 'dev');
  clearContext(s);
  expect(s.context).toBeUndefined();
});

test('filterByContextKey returns sessions with key', () => {
  const sessions = [makeSession('a'), makeSession('b'), makeSession('c')];
  setContext(sessions[0], 'env', 'prod');
  setContext(sessions[2], 'env', 'dev');
  const result = filterByContextKey(sessions, 'env');
  expect(result).toHaveLength(2);
});

test('filterByContextValue returns sessions matching key+value', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  setContext(sessions[0], 'env', 'prod');
  setContext(sessions[1], 'env', 'dev');
  const result = filterByContextValue(sessions, 'env', 'prod');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('a');
});

test('setContextByName sets context on named session', () => {
  const sessions = [makeSession('alpha'), makeSession('beta')];
  setContextByName(sessions, 'beta', 'tier', 'free');
  expect(sessions[1].context.tier).toBe('free');
});

test('setContextByName throws if session not found', () => {
  expect(() => setContextByName([], 'missing', 'k', 'v')).toThrow('Session not found: missing');
});
