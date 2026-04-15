const { handleSetNote, handleRemoveNote, handleGetNote, handleFilterByNote } = require('./notesCmd');
const sessionStore = require('../sessionStore');

jest.mock('../sessionStore');

const makeSession = (id, name, note = null) => ({
  id,
  name,
  tabs: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  tags: [],
  note
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

describe('handleSetNote', () => {
  it('sets a note on the named session', async () => {
    sessionStore.loadSessions.mockResolvedValue([makeSession('1', 'Work')]);
    sessionStore.saveSessions.mockResolvedValue();
    await handleSetNote('Work', 'project tabs');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved.find(s => s.name === 'Work').note).toBe('project tabs');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  });

  it('exits if session not found', async () => {
    sessionStore.loadSessions.mockResolvedValue([]);
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleSetNote('Missing', 'note')).rejects.toThrow('exit');
    mockExit.mockRestore();
  });
});

describe('handleRemoveNote', () => {
  it('removes the note from a session', async () => {
    sessionStore.loadSessions.mockResolvedValue([makeSession('1', 'Work', 'old note')]);
    sessionStore.saveSessions.mockResolvedValue();
    await handleRemoveNote('Work');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved.find(s => s.name === 'Work').note).toBeNull();
  });

  it('exits if session not found', async () => {
    sessionStore.loadSessions.mockResolvedValue([]);
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleRemoveNote('Missing')).rejects.toThrow('exit');
    mockExit.mockRestore();
  });
});

describe('handleGetNote', () => {
  it('prints the note for a session', async () => {
    sessionStore.loadSessions.mockResolvedValue([makeSession('1', 'Work', 'my note')]);
    await handleGetNote('Work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('my note'));
  });

  it('prints a message if no note set', async () => {
    sessionStore.loadSessions.mockResolvedValue([makeSession('1', 'Work', null)]);
    await handleGetNote('Work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No note'));
  });
});

describe('handleFilterByNote', () => {
  it('prints sessions matching keyword in notes', async () => {
    sessionStore.loadSessions.mockResolvedValue([
      makeSession('1', 'Work', 'important project'),
      makeSession('2', 'Home', 'personal')
    ]);
    await handleFilterByNote('important');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  });

  it('prints no results message if nothing matches', async () => {
    sessionStore.loadSessions.mockResolvedValue([makeSession('1', 'Work', 'stuff')]);
    await handleFilterByNote('xyz');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions found'));
  });
});
