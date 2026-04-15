const { handleLock, handleUnlock, handleListLocked } = require('./lockCmd');
const { lockSession, unlockSession, listLocked, lockSessionByName } = require('../lock');

jest.mock('../lock');
jest.mock('../sessionStore');

const { loadSessions, saveSessions } = require('../sessionStore');

const mockSessions = [
  { id: 'abc123', name: 'Work', tabs: [], tags: [], locked: false },
  { id: 'def456', name: 'Research', tabs: [], tags: [], locked: true }
];

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockReturnValue(mockSessions);
  saveSessions.mockImplementation(() => {});
});

describe('handleLock', () => {
  it('locks a session by name and saves', () => {
    const locked = { ...mockSessions[0], locked: true };
    lockSessionByName.mockReturnValue([locked, mockSessions[1]]);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleLock('Work');

    expect(lockSessionByName).toHaveBeenCalledWith(mockSessions, 'Work');
    expect(saveSessions).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('locked'));
    consoleSpy.mockRestore();
  });

  it('prints error if session not found', () => {
    lockSessionByName.mockReturnValue(null);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    handleLock('Nonexistent');
    expect(saveSessions).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('handleUnlock', () => {
  it('unlocks a session by name and saves', () => {
    const unlocked = { ...mockSessions[1], locked: false };
    unlockSession.mockReturnValue([mockSessions[0], unlocked]);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleUnlock('def456');

    expect(unlockSession).toHaveBeenCalledWith(mockSessions, 'def456');
    expect(saveSessions).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('handleListLocked', () => {
  it('lists all locked sessions', () => {
    listLocked.mockReturnValue([mockSessions[1]]);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleListLocked();
    expect(listLocked).toHaveBeenCalledWith(mockSessions);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Research'));
    consoleSpy.mockRestore();
  });

  it('prints message when no sessions are locked', () => {
    listLocked.mockReturnValue([]);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleListLocked();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No locked'));
    consoleSpy.mockRestore();
  });
});
