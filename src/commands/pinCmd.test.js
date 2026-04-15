const { handlePin, handleUnpin, handleListPinned } = require('./pinCmd');
const sessionStore = require('../sessionStore');
const pin = require('../pin');

jest.mock('../sessionStore');
jest.mock('../pin');

const mockSessions = [
  { id: 'a1', name: 'Work', tabs: [], pinned: false },
  { id: 'b2', name: 'Research', tabs: [{ url: 'https://example.com' }], pinned: true }
];

beforeEach(() => {
  jest.clearAllMocks();
  sessionStore.loadSessions.mockResolvedValue(mockSessions);
  sessionStore.saveSessions.mockResolvedValue();
});

describe('handlePin', () => {
  it('loads, pins, and saves sessions', async () => {
    const updated = [...mockSessions];
    pin.pinSession.mockReturnValue(updated);
    await handlePin('a1', {});
    expect(pin.pinSession).toHaveBeenCalledWith(mockSessions, 'a1');
    expect(sessionStore.saveSessions).toHaveBeenCalledWith(updated, undefined);
  });

  it('exits on error from pinSession', async () => {
    pin.pinSession.mockImplementation(() => { throw new Error('Session not found: zzz'); });
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    await handlePin('zzz', {});
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});

describe('handleUnpin', () => {
  it('loads, unpins, and saves sessions', async () => {
    const updated = [...mockSessions];
    pin.unpinSession.mockReturnValue(updated);
    await handleUnpin('b2', {});
    expect(pin.unpinSession).toHaveBeenCalledWith(mockSessions, 'b2');
    expect(sessionStore.saveSessions).toHaveBeenCalledWith(updated, undefined);
  });

  it('exits on error from unpinSession', async () => {
    pin.unpinSession.mockImplementation(() => { throw new Error('Session not found: nope'); });
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    await handleUnpin('nope', {});
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});

describe('handleListPinned', () => {
  it('prints pinned sessions', async () => {
    pin.listPinned.mockReturnValue([mockSessions[1]]);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleListPinned({});
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('b2'));
    logSpy.mockRestore();
  });

  it('prints message when no pinned sessions', async () => {
    pin.listPinned.mockReturnValue([]);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleListPinned({});
    expect(logSpy).toHaveBeenCalledWith('No pinned sessions.');
    logSpy.mockRestore();
  });
});
