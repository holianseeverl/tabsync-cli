const {
  isValidCooldown,
  setCooldown,
  clearCooldown,
  setCooldownByName,
  getCooldown,
  isOnCooldown,
  filterOnCooldown,
  filterOffCooldown
} = require('./cooldown');

function makeSession(name = 'Test') {
  return { id: '1', name, tabs: [] };
}

test('isValidCooldown accepts valid input', () => {
  expect(isValidCooldown(5, 'minutes')).toBe(true);
  expect(isValidCooldown(2, 'hours')).toBe(true);
  expect(isValidCooldown(1, 'days')).toBe(true);
});

test('isValidCooldown rejects invalid input', () => {
  expect(isValidCooldown(-1, 'hours')).toBe(false);
  expect(isValidCooldown(5, 'weeks')).toBe(false);
  expect(isValidCooldown('5', 'hours')).toBe(false);
});

test('setCooldown sets cooldown on session', () => {
  const s = makeSession();
  const result = setCooldown(s, 30, 'minutes');
  expect(result.cooldown.value).toBe(30);
  expect(result.cooldown.unit).toBe('minutes');
  expect(result.cooldown.setAt).toBeDefined();
});

test('setCooldown throws on invalid input', () => {
  expect(() => setCooldown(makeSession(), -1, 'hours')).toThrow();
});

test('clearCooldown removes cooldown', () => {
  let s = setCooldown(makeSession(), 1, 'hours');
  s = clearCooldown(s);
  expect(s.cooldown).toBeUndefined();
});

test('setCooldownByName updates matching session', () => {
  const sessions = [makeSession('A'), makeSession('B')];
  const result = setCooldownByName(sessions, 'A', 10, 'minutes');
  expect(result[0].cooldown.value).toBe(10);
  expect(result[1].cooldown).toBeUndefined();
});

test('getCooldown returns cooldown or null', () => {
  const s = makeSession();
  expect(getCooldown(s)).toBeNull();
  const s2 = setCooldown(s, 1, 'days');
  expect(getCooldown(s2)).not.toBeNull();
});

test('isOnCooldown returns true for active cooldown', () => {
  const s = setCooldown(makeSession(), 1, 'hours');
  expect(isOnCooldown(s)).toBe(true);
});

test('isOnCooldown returns false for expired cooldown', () => {
  const s = { ...makeSession(), cooldown: { value: 1, unit: 'minutes', setAt: new Date(Date.now() - 120000).toISOString() } };
  expect(isOnCooldown(s)).toBe(false);
});

test('filterOnCooldown and filterOffCooldown partition correctly', () => {
  const active = setCooldown(makeSession('A'), 1, 'hours');
  const expired = { ...makeSession('B'), cooldown: { value: 1, unit: 'minutes', setAt: new Date(Date.now() - 120000).toISOString() } };
  const plain = makeSession('C');
  const sessions = [active, expired, plain];
  expect(filterOnCooldown(sessions)).toHaveLength(1);
  expect(filterOffCooldown(sessions)).toHaveLength(2);
});
