const { handleSort } = require('./sortCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  { name: 'Work', createdAt: '2024-01-10T09:00:00Z', tabs: [1, 2] },
  { name: 'Research', createdAt: '2024-03-05T14:00:00Z', tabs: [1, 2, 3, 4] },
  { name: 'Personal', createdAt: '2024-02-20T11:00:00Z', tabs: [1] },
];

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockResolvedValue(mockSessions);
  saveSessions.mockResolvedValue();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('handleSort', () => {
  test('sorts by date descending by default', async () => {
    const result = await handleSort();
    expect(result[0].name).toBe('Research');
    expect(result[2].name).toBe('Work');
  });

  test('sorts by name ascending', async () => {
    const result = await handleSort({ by: 'name' });
    expect(result[0].name).toBe('Personal');
    expect(result[1].name).toBe('Research');
  });

  test('sorts by tab count descending', async () => {
    const result = await handleSort({ by: 'tabs' });
    expect(result[0].name).toBe('Research');
    expect(result[2].name).toBe('Personal');
  });

  test('respects explicit order', async () => {
    const result = await handleSort({ by: 'tabs', order: 'asc' });
    expect(result[0].name).toBe('Personal');
  });

  test('saves sorted sessions when save flag is set', async () => {
    await handleSort({ by: 'name', save: true });
    expect(saveSessions).toHaveBeenCalledTimes(1);
    const savedArg = saveSessions.mock.calls[0][0];
    expect(savedArg[0].name).toBe('Personal');
  });

  test('does not save when save flag is false', async () => {
    await handleSort({ by: 'name', save: false });
    expect(saveSessions).not.toHaveBeenCalled();
  });

  test('exits on invalid sort field', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleSort({ by: 'invalid' })).rejects.toThrow('exit');
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });

  test('exits on invalid order', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleSort({ by: 'name', order: 'sideways' })).rejects.toThrow('exit');
    mockExit.mockRestore();
  });

  test('handles empty sessions gracefully', async () => {
    loadSessions.mockResolvedValue([]);
    const result = await handleSort();
    expect(result).toEqual([]);
    expect(console.log).toHaveBeenCalledWith('No sessions found.');
  });
});
