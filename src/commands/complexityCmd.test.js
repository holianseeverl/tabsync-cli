const { handleSetComplexity, handleShowComplexity, handleSortByComplexity, handleFilterByMin, handleFilterByMax } = require('./complexityCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

beforeEach(() => jest.clearAllMocks());

test('handleSetComplexity saves updated session', () => {
  loadSessions.mockReturnValue([makeSession({ name: 'Alpha' })]);
  handleSetComplexity('Alpha', '5');
  expect(saveSessions).toHaveBeenCalledWith([expect.objectContaining({ name: 'Alpha', complexity: 5 })]);
});

test('handleSetComplexity rejects invalid value', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  loadSessions.mockReturnValue([makeSession({ name: 'Alpha' })]);
  handleSetComplexity('Alpha', 'abc');
  expect(saveSessions).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('handleShowComplexity prints complexity', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  loadSessions.mockReturnValue([makeSession({ name: 'Alpha', complexity: 6 })]);
  handleShowComplexity('Alpha');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('6'));
  spy.mockRestore();
});

test('handleShowComplexity prints computed if not set', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  loadSessions.mockReturnValue([makeSession({ name: 'Alpha', tabs: [1, 2] })]);
  handleShowComplexity('Alpha');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Computed'));
  spy.mockRestore();
});

test('handleSortByComplexity prints sorted sessions', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  loadSessions.mockReturnValue([
    makeSession({ name: 'B', complexity: 8 }),
    makeSession({ name: 'A', complexity: 2 }),
  ]);
  handleSortByComplexity();
  expect(spy.mock.calls[0][0]).toContain('A');
  spy.mockRestore();
});

test('handleFilterByMin filters correctly', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  loadSessions.mockReturnValue([
    makeSession({ name: 'Low', complexity: 2 }),
    makeSession({ name: 'High', complexity: 9 }),
  ]);
  handleFilterByMin('5');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('High'));
  spy.mockRestore();
});

test('handleFilterByMax filters correctly', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  loadSessions.mockReturnValue([
    makeSession({ name: 'Low', complexity: 2 }),
    makeSession({ name: 'High', complexity: 9 }),
  ]);
  handleFilterByMax('5');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Low'));
  spy.mockRestore();
});
