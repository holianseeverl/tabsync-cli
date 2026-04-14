const { handleSnapshot } = require('./snapshotCmd');
const { loadSessions, saveSessions } = require('../sessionStore');
const { createSnapshot, findSnapshotByLabel } = require('../snapshot');
const fs = require('fs');

jest.mock('../sessionStore');
jest.mock('fs');

const mockSessions = [
  { id: '1', name: 'Work', tabs: ['https://github.com'], tags: [], createdAt: '2024-01-01T00:00:00.000Z' },
];

const mockSnapshot = createSnapshot(mockSessions, 'test-snap');

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockReturnValue(mockSessions);
  saveSessions.mockImplementation(() => {});
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify([mockSnapshot]));
  fs.writeFileSync.mockImplementation(() => {});
});

describe('handleSnapshot create', () => {
  it('creates a new snapshot', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleSnapshot({ action: 'create', label: 'new-snap' });
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('new-snap'));
    consoleSpy.mockRestore();
  });

  it('exits if label already exists', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(handleSnapshot({ action: 'create', label: 'test-snap' })).rejects.toThrow('exit');
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe('handleSnapshot restore', () => {
  it('restores sessions from an existing snapshot', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleSnapshot({ action: 'restore', label: 'test-snap' });
    expect(saveSessions).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: 'Work' })]));
    consoleSpy.mockRestore();
  });

  it('exits if snapshot not found', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(handleSnapshot({ action: 'restore', label: 'missing' })).rejects.toThrow('exit');
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe('handleSnapshot list', () => {
  it('lists snapshots', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleSnapshot({ action: 'list' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-snap'));
    consoleSpy.mockRestore();
  });

  it('shows message when no snapshots', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleSnapshot({ action: 'list' });
    expect(consoleSpy).toHaveBeenCalledWith('No snapshots found.');
    consoleSpy.mockRestore();
  });
});
