const { handleMerge } = require('./mergeCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  {
    id: 's1',
    name: 'Alpha',
    tabs: [
      { url: 'https://example.com', title: 'Example' },
      { url: 'https://github.com', title: 'GitHub' },
    ],
    tags: ['dev'],
    createdAt: '2024-03-01T00:00:00.000Z',
  },
  {
    id: 's2',
    name: 'Beta',
    tabs: [
      { url: 'https://npmjs.com', title: 'npm' },
      { url: 'https://github.com', title: 'GitHub' },
    ],
    tags: ['dev', 'pkg'],
    createdAt: '2024-03-02T00:00:00.000Z',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockResolvedValue(JSON.parse(JSON.stringify(mockSessions)));
  saveSessions.mockResolvedValue(undefined);
});

describe('handleMerge', () => {
  test('merges two sessions and saves result', async () => {
    const result = await handleMerge(['Alpha', 'Beta']);
    expect(result.tabs).toHaveLength(4);
    expect(saveSessions).toHaveBeenCalledTimes(1);
  });

  test('uses custom name when provided', async () => {
    const result = await handleMerge(['Alpha', 'Beta'], { name: 'Combined' });
    expect(result.name).toBe('Combined');
  });

  test('deduplicates tabs when dedupe option is set', async () => {
    const result = await handleMerge(['Alpha', 'Beta'], { dedupe: true });
    expect(result.tabs).toHaveLength(3);
  });

  test('exits if a session name is not found', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleMerge(['Alpha', 'Missing'])).rejects.toThrow('exit');
    mockExit.mockRestore();
  });

  test('exits if fewer than two session names given', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(handleMerge(['Alpha'])).rejects.toThrow('exit');
    mockExit.mockRestore();
  });
});
