const { handleSetEnergy, handleClearEnergy, handleShowEnergy, handleFilterByEnergy, handleSortByEnergy } = require('./energyCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Work', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

beforeEach(() => jest.clearAllMocks());

test('handleSetEnergy sets energy on session', () => {
  loadSessions.mockReturnValue([makeSession()]);
  handleSetEnergy('Work', 'high', 'f.json');
  expect(saveSessions).toHaveBeenCalledWith('f.json', expect.arrayContaining([expect.objectContaining({ energy: 'high' })]));
});

test('handleSetEnergy rejects invalid level', () => {
  loadSessions.mockReturnValue([makeSession()]);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleSetEnergy('Work', 'turbo', 'f.json');
  expect(saveSessions).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('handleClearEnergy removes energy', () => {
  loadSessions.mockReturnValue([makeSession({ energy: 'low' })]);
  handleClearEnergy('Work', 'f.json');
  expect(saveSessions).toHaveBeenCalledWith('f.json', expect.arrayContaining([expect.not.objectContaining({ energy: expect.anything() })]));
});

test('handleShowEnergy prints energy', () => {
  loadSessions.mockReturnValue([makeSession({ energy: 'medium' })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowEnergy('Work', 'f.json');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('medium'));
  spy.mockRestore();
});

test('handleFilterByEnergy lists matching sessions', () => {
  loadSessions.mockReturnValue([makeSession({ energy: 'high' }), { ...makeSession(), id: 's2', name: 'Play', energy: 'low' }]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByEnergy('high', 'f.json');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Work'));
  spy.mockRestore();
});

test('handleSortByEnergy prints sorted sessions', () => {
  loadSessions.mockReturnValue([
    makeSession({ id: 'a', name: 'A', energy: 'high' }),
    { ...makeSession(), id: 'b', name: 'B', energy: 'low' }
  ]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortByEnergy('f.json');
  const calls = spy.mock.calls.map(c => c[0]);
  expect(calls[0]).toContain('low');
  spy.mockRestore();
});
