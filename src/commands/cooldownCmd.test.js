const {
  handleSetCooldown,
  handleClearCooldown,
  handleShowCooldown,
  handleListOnCooldown,
  handleListOffCooldown
} = require('./cooldownCmd');

function makeSession(name, cooldown) {
  return { id: name, name, tabs: [], ...(cooldown ? { cooldown } : {}) };
}

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('handleSetCooldown sets cooldown on named session', () => {
  const sessions = [makeSession('Alpha'), makeSession('Beta')];
  const result = handleSetCooldown(sessions, 'Alpha', '30', 'minutes');
  expect(result[0].cooldown.value).toBe(30);
  expect(result[0].cooldown.unit).toBe('minutes');
  expect(result[1].cooldown).toBeUndefined();
});

test('handleSetCooldown logs error for invalid value', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const sessions = [makeSession('A')];
  handleSetCooldown(sessions, 'A', 'bad', 'hours');
  expect(spy).toHaveBeenCalled();
});

test('handleClearCooldown removes cooldown', () => {
  const sessions = [makeSession('A', { value: 1, unit: 'hours', setAt: new Date().toISOString() })];
  const result = handleClearCooldown(sessions, 'A');
  expect(result[0].cooldown).toBeUndefined();
});

test('handleShowCooldown prints cooldown info', () => {
  const sessions = [makeSession('A', { value: 2, unit: 'hours', setAt: new Date().toISOString() })];
  handleShowCooldown(sessions, 'A');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ACTIVE'));
});

test('handleShowCooldown handles missing session', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleShowCooldown([], 'Ghost');
  expect(spy).toHaveBeenCalled();
});

test('handleShowCooldown handles no cooldown set', () => {
  handleShowCooldown([makeSession('A')], 'A');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No cooldown'));
});

test('handleListOnCooldown lists active sessions', () => {
  const active = makeSession('A', { value: 5, unit: 'hours', setAt: new Date().toISOString() });
  const plain = makeSession('B');
  handleListOnCooldown([active, plain]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('A'));
});

test('handleListOffCooldown lists ready sessions', () => {
  const expired = makeSession('A', { value: 1, unit: 'minutes', setAt: new Date(Date.now() - 120000).toISOString() });
  const plain = makeSession('B');
  handleListOffCooldown([expired, plain]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('A'));
});
