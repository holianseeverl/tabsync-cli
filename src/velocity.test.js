const { recordVelocity, recordVelocityByName, getVelocity, clearVelocity, computeRate, sortByVelocity } = require('./velocity');

function makeSession(name) {
  return { id: name, name, tabs: [], velocity: [] };
}

test('recordVelocity adds entry', () => {
  const s = makeSession('A');
  recordVelocity(s, 'add');
  expect(s.velocity).toHaveLength(1);
  expect(s.velocity[0].action).toBe('add');
});

test('recordVelocity throws on invalid action', () => {
  const s = makeSession('A');
  expect(() => recordVelocity(s, 'open')).toThrow('Invalid action');
});

test('recordVelocityByName finds and updates session', () => {
  const sessions = [makeSession('A'), makeSession('B')];
  recordVelocityByName(sessions, 'B', 'remove');
  expect(sessions[1].velocity[0].action).toBe('remove');
});

test('recordVelocityByName throws if not found', () => {
  expect(() => recordVelocityByName([], 'X', 'add')).toThrow('Session not found');
});

test('getVelocity returns entries', () => {
  const s = makeSession('A');
  recordVelocity(s, 'add');
  expect(getVelocity(s)).toHaveLength(1);
});

test('clearVelocity empties entries', () => {
  const s = makeSession('A');
  recordVelocity(s, 'add');
  clearVelocity(s);
  expect(s.velocity).toHaveLength(0);
});

test('computeRate counts adds and removes', () => {
  const s = makeSession('A');
  recordVelocity(s, 'add');
  recordVelocity(s, 'add');
  recordVelocity(s, 'remove');
  const rate = computeRate(s);
  expect(rate.adds).toBe(2);
  expect(rate.removes).toBe(1);
  expect(rate.net).toBe(1);
});

test('computeRate ignores old entries', () => {
  const s = makeSession('A');
  s.velocity = [{ action: 'add', timestamp: Date.now() - 999999 }];
  const rate = computeRate(s, 1000);
  expect(rate.total).toBe(0);
});

test('sortByVelocity orders by total activity', () => {
  const a = makeSession('A');
  const b = makeSession('B');
  recordVelocity(b, 'add');
  recordVelocity(b, 'add');
  recordVelocity(a, 'add');
  const sorted = sortByVelocity([a, b]);
  expect(sorted[0].name).toBe('B');
});
