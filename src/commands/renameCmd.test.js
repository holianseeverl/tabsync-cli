const { handleRename } = require('./renameCmd');
const sessionStore = require('../sessionStore');

jest.mock('../sessionStore');

describe('handleRename', () => {
  const mockSessions = [
    { id: 'id1', name: 'Old Session', tabs: [], tags: [], createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'id2', name: 'Another', tabs: [], tags: [], createdAt: '2024-01-02T00:00:00.000Z' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStore.loadSessions.mockReturnValue(mockSessions);
    sessionStore.saveSessions.mockImplementation(() => {});
  });

  test('renames session by id and saves', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleRename({ id: 'id1', name: 'New Session' });
    expect(sessionStore.saveSessions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'id1', name: 'New Session' })
      ])
    );
    consoleSpy.mockRestore();
  });

  test('renames session by name when --byName flag is set', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleRename({ id: 'Old Session', name: 'Renamed', byName: true });
    expect(sessionStore.saveSessions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Renamed' })
      ])
    );
    consoleSpy.mockRestore();
  });

  test('logs error if id not found', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    handleRename({ id: 'notreal', name: 'Whatever' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('logs error if new name is empty', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    handleRename({ id: 'id1', name: '' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('prints success message with new name', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleRename({ id: 'id1', name: 'New Session' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('New Session'));
    consoleSpy.mockRestore();
  });
});
