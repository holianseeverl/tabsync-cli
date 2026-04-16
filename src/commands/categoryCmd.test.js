const { handleSetCategory, handleClearCategory, handleShowCategory, handleFilterByCategory } = require('./categoryCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(id, name, extra = {}) {
  return { id, name, tabs: [], createdAt: new Date().toISOString(), ...extra };
}

beforeEach(() => jest.clearAllMocks());

describe('handleSetCategory', () => {
  test('sets category and saves', () => {
    const sessions = [makeSession('1', 'Alpha')];
    loadSessions.mockReturnValue(sessions);
    handleSetCategory('Alpha', 'work');
    expect(saveSessions).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ name: 'Alpha', category: 'work' })
    ]));
  });

  test('logs not found if no match', () => {
    loadSessions.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleSetCategory('Ghost', 'work');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    spy.mockRestore();
  });
});

describe('handleClearCategory', () => {
  test('clears category', () => {
    const sessions = [makeSession('1', 'Alpha', { category: 'work' })];
    loadSessions.mockReturnValue(sessions);
    handleClearCategory('Alpha');
    expect(saveSessions).toHaveBeenCalledWith(expect.arrayContaining([
      expect.not.objectContaining({ category: 'work' })
    ]));
  });

  test('logs not found', () => {
    loadSessions.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleClearCategory('Ghost');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    spy.mockRestore();
  });
});

describe('handleShowCategory', () => {
  test('shows category', () => {
    loadSessions.mockReturnValue([makeSession('1', 'Alpha', { category: 'personal' })]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleShowCategory('Alpha');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('personal'));
    spy.mockRestore();
  });

  test('shows none if unset', () => {
    loadSessions.mockReturnValue([makeSession('1', 'Alpha')]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleShowCategory('Alpha');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No category'));
    spy.mockRestore();
  });
});

describe('handleFilterByCategory', () => {
  test('lists matching sessions', () => {
    loadSessions.mockReturnValue([
      makeSession('1', 'A', { category: 'work' }),
      makeSession('2', 'B', { category: 'personal' }),
    ]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleFilterByCategory('work');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('A'));
    spy.mockRestore();
  });

  test('logs none found', () => {
    loadSessions.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleFilterByCategory('work');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
    spy.mockRestore();
  });
});
