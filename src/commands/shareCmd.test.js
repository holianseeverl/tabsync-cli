const { handleShare, handleReceive } = require('./shareCmd');
const { encodeSession, generateShareUrl } = require('../share');

const mockSession = {
  id: 'sess-share-1',
  name: 'SharedSession',
  tabs: [{ url: 'https://example.com', title: 'Example' }],
  createdAt: '2024-03-01T12:00:00.000Z'
};

jest.mock('../sessionStore', () => ({
  loadSessions: jest.fn(),
  saveSessions: jest.fn(),
  addSession: jest.fn((sessions, s) => [...sessions, s])
}));

const { loadSessions, saveSessions, addSession } = require('../sessionStore');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

aftereEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('handleShare', () => {
  test('logs a share code for a found session', async () => {
    loadSessions.mockResolvedValue([mockSession]);
    await handleShare('SharedSession', {});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Share code'));
  });

  test('logs a share URL when --url flag is set', async () => {
    loadSessions.mockResolvedValue([mockSession]);
    await handleShare('SharedSession', { url: true });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Share URL'));
  });

  test('logs error when session not found', async () => {
    loadSessions.mockResolvedValue([]);
    await handleShare('Missing', {});
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });
});

describe('handleReceive', () => {
  test('imports session from a valid share code', async () => {
    loadSessions.mockResolvedValue([]);
    saveSessions.mockResolvedValue();
    const code = encodeSession(mockSession);
    await handleReceive(code);
    expect(saveSessions).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('imported successfully'));
  });

  test('imports session from a valid share URL', async () => {
    loadSessions.mockResolvedValue([]);
    saveSessions.mockResolvedValue();
    const url = generateShareUrl(mockSession);
    await handleReceive(url);
    expect(saveSessions).toHaveBeenCalled();
  });

  test('errors on duplicate without --force', async () => {
    loadSessions.mockResolvedValue([mockSession]);
    const code = encodeSession(mockSession);
    await handleReceive(code);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('already exists'));
    expect(saveSessions).not.toHaveBeenCalled();
  });

  test('overwrites duplicate with --force', async () => {
    loadSessions.mockResolvedValue([mockSession]);
    saveSessions.mockResolvedValue();
    const code = encodeSession(mockSession);
    await handleReceive(code, { force: true });
    expect(saveSessions).toHaveBeenCalled();
  });

  test('errors on invalid input', async () => {
    loadSessions.mockResolvedValue([]);
    await handleReceive('!!!notvalid!!!');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to decode'));
  });
});
