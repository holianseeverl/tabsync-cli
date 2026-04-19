const { handleSetSentiment, handleClearSentiment, handleShowSentiment, handleFilterBySentiment, handleSortBySentiment } = require('./sentimentCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Work', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

beforeEach(() => jest.clearAllMocks());

test('handleSetSentiment sets sentiment and saves', () => {
  loadSessions.mockReturnValue([makeSession({ name: 'Work' })]);
  handleSetSentiment('Work', 'positive');
  expect(saveSessions).toHaveBeenCalledWith(expect.arrayContaining([
    expect.objectContaining({ name: 'Work', sentiment: 'positive' })
  ]));
});

test('handleSetSentiment rejects invalid sentiment', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleSetSentiment('Work', 'excited');
  expect(saveSessions).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('handleClearSentiment clears sentiment', () => {
  loadSessions.mockReturnValue([makeSession({ sentiment: 'negative' })]);
  handleClearSentiment('Work');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].sentiment).toBeUndefined();
});

test('handleShowSentiment prints sentiment', () => {
  loadSessions.mockReturnValue([makeSession({ sentiment: 'neutral' })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowSentiment('Work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('neutral'));
  spy.mockRestore();
});

test('handleShowSentiment prints none if unset', () => {
  loadSessions.mockReturnValue([makeSession()]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowSentiment('Work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('no sentiment'));
  spy.mockRestore();
});

test('handleFilterBySentiment lists matching sessions', () => {
  loadSessions.mockReturnValue([
    makeSession({ name: 'Work', sentiment: 'positive' }),
    makeSession({ id: 's2', name: 'Play', sentiment: 'negative' }),
  ]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterBySentiment('positive');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Work'));
  spy.mockRestore();
});

test('handleSortBySentiment prints sorted sessions', () => {
  loadSessions.mockReturnValue([
    makeSession({ name: 'A', sentiment: 'negative' }),
    makeSession({ id: 's2', name: 'B', sentiment: 'positive' }),
  ]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortBySentiment();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
