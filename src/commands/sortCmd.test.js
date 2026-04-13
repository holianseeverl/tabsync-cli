const { handleSort } = require('./sortCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  {
    id: '1',
    name: 'Zebra Session',
    createdAt: '2024-01-15T10:00:00Z',
    tabs: [{ url: 'https://a.com' }, { url: 'https://b.com' }]
  },
  {
    id: '2',
    name: 'Alpha Session',
    createdAt: '2024-03-01T08:00:00Z',
    tabs: [{ url: 'https://c.com' }]
  },
  {
    id: '3',
    name: 'Middle Session',
    createdAt: '2024-02-10T12:00:00Z',
    tabs: [{ url: 'https://d.com' }, { url: 'https://e.com' }, { url: 'https://f.com' }]
  }
];

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockResolvedValue([...mockSessions]);
  saveSessions.mockResolvedValue();
});

describe('handleSort', () => {
  it('sorts by date ascending by default', async () => {
    const result = await handleSort({ by: 'date', order: 'asc' });
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
    expect(result[2].id).toBe('2');
  });

  it('sorts by tabCount descending', async () => {
    const result = await handleSort({ by: 'tabCount', order: 'desc' });
    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('1');
    expect(result[2].id).toBe('2');
  });

  it('sorts by name ascending', async () => {
    const result = await handleSort({ by: 'name', order: 'asc' });
    expect(result[0].name).toBe('Alpha Session');
    expect(result[1].name).toBe('Middle Session');
    expect(result[2].name).toBe('Zebra Session');
  });

  it('saves sorted sessions when save option is true', async () => {
    await handleSort({ by: 'name', order: 'asc', save: true });
    expect(saveSessions).toHaveBeenCalledTimes(1);
    const saved = saveSessions.mock.calls[0][0];
    expect(saved[0].name).toBe('Alpha Session');
  });

  it('does not save when save option is false', async () => {
    await handleSort({ by: 'date', order: 'asc', save: false });
    expect(saveSessions).not.toHaveBeenCalled();
  });

  it('exits with error on invalid sort field', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleSort({ by: 'invalid', order: 'asc' })).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });

  it('returns early and logs when no sessions found', async () => {
    loadSessions.mockResolvedValue([]);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const result = await handleSort({ by: 'date', order: 'asc' });
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });
});
