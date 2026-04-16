const { handleShowScore, handleSortByScore, handleFilterByMinScore } = require('./scoreCmd');
const { loadSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], ...overrides };
}

beforeEach(() => jest.clearAllMocks());

test('handleShowScore prints score for found session', () => {
  loadSessions.mockReturnValue([makeSession({ name: 'Work', rating: 4 })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowScore({ name: 'Work' });
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('80'));
  spy.mockRestore();
});

test('handleShowScore prints not found for missing session', () => {
  loadSessions.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowScore({ name: 'Ghost' });
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  spy.mockRestore();
});

test('handleSortByScore prints sessions in desc order', () => {
  loadSessions.mockReturnValue([
    makeSession({ name: 'Low', rating: 1 }),
    makeSession({ name: 'High', rating: 5 }),
  ]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortByScore({});
  expect(spy.mock.calls[0][0]).toContain('High');
  spy.mockRestore();
});

test('handleSortByScore prints no sessions message', () => {
  loadSessions.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortByScore({});
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
  spy.mockRestore();
});

test('handleFilterByMinScore filters and prints results', () => {
  loadSessions.mockReturnValue([
    makeSession({ name: 'Low', rating: 1 }),
    makeSession({ name: 'High', rating: 5 }),
  ]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByMinScore({ min: '50' });
  expect(spy.mock.calls[0][0]).toContain('High');
  spy.mockRestore();
});

test('handleFilterByMinScore handles invalid min', () => {
  loadSessions.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByMinScore({ min: 'abc' });
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Invalid'));
  spy.mockRestore();
});

test('handleFilterByMinScore prints no results message', () => {
  loadSessions.mockReturnValue([makeSession({ name: 'Low', rating: 1 })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByMinScore({ min: '999' });
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
  spy.mockRestore();
});
