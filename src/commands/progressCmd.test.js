const { handleSetProgress, handleClearProgress, handleShowProgress, handleFilterByMin, handleFilterComplete } = require('./progressCmd');
const sessionStore = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  { id: '1', name: 'Work', tabs: [], progress: 40 },
  { id: '2', name: 'Research', tabs: [], progress: 100 },
  { id: '3', name: 'Shopping', tabs: [] }
];

beforeEach(() => {
  sessionStore.loadSessions.mockReturnValue(JSON.parse(JSON.stringify(mockSessions)));
  sessionStore.saveSessions.mockClear();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

test('handleSetProgress saves updated progress', () => {
  handleSetProgress('Work', '80');
  const saved = sessionStore.saveSessions.mock.calls[0][0];
  expect(saved.find(s => s.id === '1').progress).toBe(80);
});

test('handleSetProgress logs confirmation', () => {
  handleSetProgress('Work', '80');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('80%'));
});

test('handleClearProgress removes progress', () => {
  handleClearProgress('Work');
  const saved = sessionStore.saveSessions.mock.calls[0][0];
  expect(saved.find(s => s.id === '1').progress).toBeUndefined();
});

test('handleClearProgress errors on unknown session', () => {
  handleClearProgress('Unknown');
  expect(console.error).toHaveBeenCalled();
  expect(sessionStore.saveSessions).not.toHaveBeenCalled();
});

test('handleShowProgress prints progress', () => {
  handleShowProgress('Work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('40%'));
});

test('handleShowProgress prints N/A when unset', () => {
  handleShowProgress('Shopping');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('no progress'));
});

test('handleFilterByMin filters correctly', () => {
  handleFilterByMin('50');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Research'));
});

test('handleFilterComplete shows only 100%', () => {
  handleFilterComplete();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Research'));
});
