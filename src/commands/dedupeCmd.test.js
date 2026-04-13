const { handleDedupe } = require('./dedupeCmd');
const sessionStore = require('../sessionStore');

jest.mock('../sessionStore');

const makeSession = (id, name, urls, createdAt = '2024-01-01T00:00:00Z') => ({
  id,
  name,
  createdAt,
  tabs: urls.map((url) => ({ url, title: url })),
  tags: [],
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('handleDedupe', () => {
  it('removes exact duplicate sessions and saves', async () => {
    const sessions = [
      makeSession('1', 'work', ['http://a.com', 'http://b.com']),
      makeSession('2', 'work', ['http://a.com', 'http://b.com']),
      makeSession('3', 'home', ['http://c.com']),
    ];
    sessionStore.loadSessions.mockResolvedValue(sessions);
    sessionStore.saveSessions.mockResolvedValue();

    await handleDedupe({ file: 'sessions.json' });

    expect(sessionStore.saveSessions).toHaveBeenCalledTimes(1);
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved).toHaveLength(2);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Removed 1'));
  });

  it('prints no duplicates message when nothing to remove', async () => {
    const sessions = [
      makeSession('1', 'work', ['http://a.com']),
      makeSession('2', 'home', ['http://b.com']),
    ];
    sessionStore.loadSessions.mockResolvedValue(sessions);

    await handleDedupe({ file: 'sessions.json' });

    expect(sessionStore.saveSessions).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('No duplicates found.');
  });

  it('dry-run does not save', async () => {
    const sessions = [
      makeSession('1', 'work', ['http://a.com']),
      makeSession('2', 'work', ['http://a.com']),
    ];
    sessionStore.loadSessions.mockResolvedValue(sessions);

    await handleDedupe({ file: 'sessions.json', dryRun: true });

    expect(sessionStore.saveSessions).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[dry-run]'));
  });

  it('uses dedupeSessionsByName when byName flag is set', async () => {
    const sessions = [
      makeSession('1', 'work', ['http://a.com'], '2024-01-01T00:00:00Z'),
      makeSession('2', 'work', ['http://b.com'], '2024-06-01T00:00:00Z'),
    ];
    sessionStore.loadSessions.mockResolvedValue(sessions);
    sessionStore.saveSessions.mockResolvedValue();

    await handleDedupe({ file: 'sessions.json', byName: true });

    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved).toHaveLength(1);
    expect(saved[0].tabs[0].url).toBe('http://b.com');
  });
});
