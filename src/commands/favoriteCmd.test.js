const {
  handleFavorite,
  handleUnfavorite,
  handleToggleFavorite,
  handleListFavorites,
} = require('./favoriteCmd');

const sessionStore = require('../sessionStore');

jest.mock('../sessionStore');

const makeSession = (name, extra = {}) => ({
  id: `id-${name}`,
  name,
  tabs: [{ url: 'https://example.com' }],
  createdAt: new Date().toISOString(),
  ...extra,
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

aftEreach(() => {
  console.log.mockRestore?.();
  console.error.mockRestore?.();
});

describe('handleFavorite', () => {
  it('marks a session as favorite', () => {
    const sessions = [makeSession('work')];
    sessionStore.loadSessions.mockReturnValue(sessions);
    handleFavorite('work');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved.find((s) => s.name === 'work').favorite).toBe(true);
  });

  it('exits if session not found', () => {
    sessionStore.loadSessions.mockReturnValue([]);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    expect(() => handleFavorite('ghost')).toThrow('exit');
    exitSpy.mockRestore();
  });
});

describe('handleUnfavorite', () => {
  it('removes favorite from a session', () => {
    const sessions = [makeSession('work', { favorite: true })];
    sessionStore.loadSessions.mockReturnValue(sessions);
    handleUnfavorite('work');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved.find((s) => s.name === 'work').favorite).toBeUndefined();
  });
});

describe('handleToggleFavorite', () => {
  it('toggles favorite on', () => {
    sessionStore.loadSessions.mockReturnValue([makeSession('alpha')]);
    handleToggleFavorite('alpha');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved[0].favorite).toBe(true);
  });

  it('toggles favorite off', () => {
    sessionStore.loadSessions.mockReturnValue([makeSession('alpha', { favorite: true })]);
    handleToggleFavorite('alpha');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved[0].favorite).toBeUndefined();
  });
});

describe('handleListFavorites', () => {
  it('lists favorite sessions', () => {
    const sessions = [
      makeSession('a', { favorite: true }),
      makeSession('b'),
    ];
    sessionStore.loadSessions.mockReturnValue(sessions);
    handleListFavorites();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('a'));
  });

  it('prints message when no favorites', () => {
    sessionStore.loadSessions.mockReturnValue([makeSession('x')]);
    handleListFavorites();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No favorite'));
  });
});
