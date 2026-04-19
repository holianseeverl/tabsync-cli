const { handleAdd, handleRemove, handleClear, handleShow, handleFilterTabs } = require('./blocklistCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const makeSession = (overrides = {}) => ({
  id: 's1',
  name: 'Work',
  tabs: [
    { url: 'https://google.com' },
    { url: 'https://ads.tracker.com' }
  ],
  ...overrides
});

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockReturnValue([makeSession()]);
  saveSessions.mockImplementation(() => {});
});

test('handleAdd adds pattern and saves', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleAdd('Work', 'tracker.com', 'file.json');
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].blocklist).toContain('tracker.com');
  spy.mockRestore();
});

test('handleAdd logs error for missing session', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleAdd('Missing', 'x.com', 'file.json');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('handleRemove removes pattern', () => {
  loadSessions.mockReturnValue([makeSession({ blocklist: ['tracker.com'] })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleRemove('Work', 'tracker.com', 'file.json');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].blocklist).not.toContain('tracker.com');
  spy.mockRestore();
});

test('handleClear clears blocklist', () => {
  loadSessions.mockReturnValue([makeSession({ blocklist: ['a.com', 'b.com'] })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleClear('Work', 'file.json');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].blocklist).toEqual([]);
  spy.mockRestore();
});

test('handleShow prints blocklist', () => {
  loadSessions.mockReturnValue([makeSession({ blocklist: ['ads.com'] })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShow('Work', 'file.json');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('ads.com'));
  spy.mockRestore();
});

test('handleFilterTabs removes blocked tabs and saves', () => {
  loadSessions.mockReturnValue([makeSession({ blocklist: ['tracker.com'] })]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterTabs('Work', 'file.json');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].tabs.every(t => !t.url.includes('tracker.com'))).toBe(true);
  spy.mockRestore();
});
