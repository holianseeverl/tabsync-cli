const {
  isValidEvent,
  logEvent,
  getLifecycle,
  clearLifecycle,
  getLastEvent,
  filterByEvent,
  logEventByName,
} = require('./lifecycle');

function makeSession(name = 'Test') {
  return { id: '1', name, tabs: [], createdAt: new Date().toISOString() };
}

test('isValidEvent returns true for valid events', () => {
  expect(isValidEvent('opened')).toBe(true);
  expect(isValidEvent('created')).toBe(true);
});

test('isValidEvent returns false for unknown events', () => {
  expect(isValidEvent('deleted')).toBe(false);
});

test('logEvent adds entry to lifecycle', () => {
  const s = makeSession();
  logEvent(s, 'created');
  expect(s.lifecycle).toHaveLength(1);
  expect(s.lifecycle[0].event).toBe('created');
});

test('logEvent throws for invalid event', () => {
  const s = makeSession();
  expect(() => logEvent(s, 'nuked')).toThrow('Invalid lifecycle event');
});

test('logEvent accepts meta fields', () => {
  const s = makeSession();
  logEvent(s, 'opened', { user: 'alice' });
  expect(s.lifecycle[0].user).toBe('alice');
});

test('getLifecycle returns empty array when no lifecycle', () => {
  const s = makeSession();
  expect(getLifecycle(s)).toEqual([]);
});

test('clearLifecycle empties lifecycle', () => {
  const s = makeSession();
  logEvent(s, 'opened');
  clearLifecycle(s);
  expect(s.lifecycle).toHaveLength(0);
});

test('getLastEvent returns last entry', () => {
  const s = makeSession();
  logEvent(s, 'created');
  logEvent(s, 'opened');
  expect(getLastEvent(s).event).toBe('opened');
});

test('getLastEvent returns null when no events', () => {
  expect(getLastEvent(makeSession())).toBeNull();
});

test('filterByEvent filters sessions by event type', () => {
  const s1 = makeSession('A');
  const s2 = makeSession('B');
  logEvent(s1, 'archived');
  expect(filterByEvent([s1, s2], 'archived')).toEqual([s1]);
});

test('logEventByName logs event on named session', () => {
  const sessions = [makeSession('Alpha')];
  logEventByName(sessions, 'Alpha', 'restored');
  expect(sessions[0].lifecycle[0].event).toBe('restored');
});

test('logEventByName throws if session not found', () => {
  expect(() => logEventByName([], 'Ghost', 'opened')).toThrow('Session not found');
});
