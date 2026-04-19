const { handleSetRhythm, handleClearRhythm, handleShowRhythm, handleFilterByRhythm, handleSortByRhythm } = require('./rhythmCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(name, rhythm) {
  const s = { id: name, name, tabs: [] };
  if (rhythm) s.rhythm = rhythm;
  return s;
}

beforeEach(() => jest.clearAllMocks());

test('handleSetRhythm sets rhythm on matching session', () => {
  loadSessions.mockReturnValue([makeSession('work'), makeSession('home', 'daily')]);
  handleSetRhythm('work', 'weekly');
  expect(saveSessions).toHaveBeenCalledWith(expect.arrayContaining([
    expect.objectContaining({ name: 'work', rhythm: 'weekly' })
  ]));
});

test('handleSetRhythm rejects invalid rhythm', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleSetRhythm('work', 'hourly');
  expect(spy).toHaveBeenCalled();
  expect(saveSessions).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('handleSetRhythm errors if session not found', () => {
  loadSessions.mockReturnValue([makeSession('home')]);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleSetRhythm('missing', 'daily');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('handleClearRhythm removes rhythm', () => {
  loadSessions.mockReturnValue([makeSession('work', 'weekly')]);
  handleClearRhythm('work');
  expect(saveSessions).toHaveBeenCalledWith(expect.arrayContaining([
    expect.not.objectContaining({ rhythm: 'weekly' })
  ]));
});

test('handleClearRhythm errors if not found', () => {
  loadSessions.mockReturnValue([]);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleClearRhythm('ghost');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('handleShowRhythm prints rhythm', () => {
  loadSessions.mockReturnValue([makeSession('work', 'monthly')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowRhythm('work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('monthly'));
  spy.mockRestore();
});

test('handleFilterByRhythm prints matching sessions', () => {
  loadSessions.mockReturnValue([makeSession('a', 'daily'), makeSession('b', 'weekly')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByRhythm('daily');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('a'));
  spy.mockRestore();
});

test('handleSortByRhythm prints sessions in order', () => {
  loadSessions.mockReturnValue([makeSession('a', 'monthly'), makeSession('b', 'daily')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortByRhythm();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
