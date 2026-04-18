const { handleSetDeadline, handleClearDeadline, handleShowDeadline, handleListOverdue, handleListUpcoming } = require('./deadlineCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(name, deadline) {
  return { id: name, name, tabs: [], deadline };
}

beforeEach(() => jest.clearAllMocks());

test('handleSetDeadline saves updated session', () => {
  loadSessions.mockReturnValue([makeSession('Work')]);
  handleSetDeadline('Work', '2099-12-31');
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].deadline).toBeTruthy();
});

test('handleSetDeadline logs error on bad date', () => {
  loadSessions.mockReturnValue([makeSession('Work')]);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleSetDeadline('Work', 'bad-date');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('handleClearDeadline removes deadline', () => {
  loadSessions.mockReturnValue([makeSession('Work', '2099-01-01T00:00:00.000Z')]);
  handleClearDeadline('Work');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].deadline).toBeUndefined();
});

test('handleShowDeadline prints deadline', () => {
  loadSessions.mockReturnValue([makeSession('Work', '2099-01-01T00:00:00.000Z')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowDeadline('Work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('2099'));
  spy.mockRestore();
});

test('handleShowDeadline errors on missing session', () => {
  loadSessions.mockReturnValue([]);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  handleShowDeadline('Ghost');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('handleListOverdue prints overdue sessions', () => {
  loadSessions.mockReturnValue([makeSession('Old', '2000-01-01T00:00:00.000Z'), makeSession('New', '2099-01-01T00:00:00.000Z')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleListOverdue();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Old'));
  spy.mockRestore();
});

test('handleListUpcoming shows nothing when none due soon', () => {
  loadSessions.mockReturnValue([makeSession('Far', '2099-01-01T00:00:00.000Z')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleListUpcoming(1);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
  spy.mockRestore();
});
