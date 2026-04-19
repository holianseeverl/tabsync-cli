const { handleSetRelay, handleClearRelay, handleShowRelay, handleFilterByRelay, handleListTargets, handleGroupByRelay } = require('./relayCmd');

function makeSession(name, relay) {
  const s = { id: name, name, tabs: [] };
  if (relay) s.relay = relay;
  return s;
}

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('handleSetRelay updates session relay', () => {
  const sessions = [makeSession('work')];
  const result = handleSetRelay(sessions, 'work', 'home-pc');
  expect(result[0].relay).toBe('home-pc');
});

test('handleSetRelay logs not found for missing session', () => {
  handleSetRelay([], 'nope', 'x');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleClearRelay removes relay', () => {
  const sessions = [makeSession('work', 'home-pc')];
  const result = handleClearRelay(sessions, 'work');
  expect(result[0].relay).toBeUndefined();
});

test('handleClearRelay logs not found', () => {
  handleClearRelay([], 'nope');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleShowRelay prints relay', () => {
  handleShowRelay([makeSession('work', 'office')], 'work');
  expect(console.log).toHaveBeenCalledWith('Relay: office');
});

test('handleShowRelay prints no relay set', () => {
  handleShowRelay([makeSession('work')], 'work');
  expect(console.log).toHaveBeenCalledWith('No relay set.');
});

test('handleFilterByRelay lists matching sessions', () => {
  const sessions = [makeSession('a', 'home'), makeSession('b', 'office')];
  handleFilterByRelay(sessions, 'home');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('a'));
});

test('handleListTargets shows unique targets', () => {
  const sessions = [makeSession('a', 'home'), makeSession('b', 'office')];
  handleListTargets(sessions);
  expect(console.log).toHaveBeenCalledTimes(2);
});

test('handleGroupByRelay groups sessions', () => {
  const sessions = [makeSession('a', 'home'), makeSession('b')];
  handleGroupByRelay(sessions);
  expect(console.log).toHaveBeenCalledWith('[home]');
  expect(console.log).toHaveBeenCalledWith('[__none__]');
});
