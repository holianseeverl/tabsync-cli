const { handleTagAdd, handleTagRemove, handleTagList, handleTagFilter } = require('./tagCmd');
const sessionStore = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  { id: 'abc123', name: 'Work', tabs: ['https://github.com'], tags: ['dev'] },
  { id: 'def456', name: 'Personal', tabs: [], tags: ['personal'] },
];

beforeEach(() => {
  jest.clearAllMocks();
  sessionStore.loadSessions.mockResolvedValue(JSON.parse(JSON.stringify(mockSessions)));
  sessionStore.saveSessions.mockResolvedValue(undefined);
});

describe('handleTagAdd', () => {
  it('adds a tag to an existing session', async () => {
    await handleTagAdd('abc123', 'work');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved.find(s => s.id === 'abc123').tags).toContain('work');
  });

  it('exits if session not found', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleTagAdd('notreal', 'work')).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});

describe('handleTagRemove', () => {
  it('removes a tag from an existing session', async () => {
    await handleTagRemove('abc123', 'dev');
    const saved = sessionStore.saveSessions.mock.calls[0][0];
    expect(saved.find(s => s.id === 'abc123').tags).not.toContain('dev');
  });

  it('exits if session not found', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleTagRemove('notreal', 'dev')).rejects.toThrow('exit');
    exitSpy.mockRestore();
  });
});

describe('handleTagList', () => {
  it('prints all unique tags', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleTagList();
    const output = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(output).toContain('dev');
    expect(output).toContain('personal');
    consoleSpy.mockRestore();
  });

  it('prints message when no tags exist', async () => {
    sessionStore.loadSessions.mockResolvedValue([{ id: '1', name: 'Empty', tabs: [] }]);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleTagList();
    expect(consoleSpy).toHaveBeenCalledWith('No tags found.');
    consoleSpy.mockRestore();
  });
});

describe('handleTagFilter', () => {
  it('prints sessions matching the tag', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleTagFilter('dev');
    const output = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(output).toContain('Work');
    expect(output).not.toContain('Personal');
    consoleSpy.mockRestore();
  });

  it('prints message when no sessions match', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleTagFilter('nonexistent');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No sessions found'));
    consoleSpy.mockRestore();
  });
});
