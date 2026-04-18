const { handleSetWeight, handleClearWeight, handleShowWeight, handleFilterByMin, handleSortByWeight } = require('./weightCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const makeSession = (name, weight) => ({ id: name, name, ...(weight !== undefined ? { weight } : {}) });

beforeEach(() => jest.clearAllMocks());

test('handleSetWeight sets weight on named session', () => {
  loadSessions.mockReturnValue([makeSession('a'), makeSession('b')]);
  handleSetWeight('a', '70', 'f.json');
  expect(saveSessions).toHaveBeenCalledWith('f.json', expect.arrayContaining([expect.objectContaining({ name: 'a', weight: 70 })]));
});

test('handleSetWeight logs not found for unknown session', () => {
  loadSessions.mockReturnValue([makeSession('a')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSetWeight('z', '10', 'f.json');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  spy.mockRestore();
});

test('handleClearWeight removes weight', () => {
  loadSessions.mockReturnValue([makeSession('a', 50)]);
  handleClearWeight('a', 'f.json');
  const saved = saveSessions.mock.calls[0][1];
  expect(saved[0].weight).toBeUndefined();
});

test('handleShowWeight prints weight', () => {
  loadSessions.mockReturnValue([makeSession('a', 30)]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowWeight('a', 'f.json');
  expect(spy).toHaveBeenCalledWith('Weight: 30');
  spy.mockRestore();
});

test('handleShowWeight prints no weight when unset', () => {
  loadSessions.mockReturnValue([makeSession('a')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowWeight('a', 'f.json');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No weight'));
  spy.mockRestore();
});

test('handleFilterByMin filters sessions', () => {
  loadSessions.mockReturnValue([makeSession('a', 10), makeSession('b', 60), makeSession('c', 90)]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByMin('50', 'f.json');
  const output = spy.mock.calls.map(c => c[0]);
  expect(output.some(o => o.includes('b'))).toBe(true);
  expect(output.some(o => o.includes('a'))).toBe(false);
  spy.mockRestore();
});

test('handleSortByWeight sorts descending', () => {
  loadSessions.mockReturnValue([makeSession('a', 20), makeSession('b', 80), makeSession('c', 50)]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortByWeight('desc', 'f.json');
  const names = spy.mock.calls.map(c => c[0].split(' ')[0]);
  expect(names).toEqual(['b', 'c', 'a']);
  spy.mockRestore();
});
