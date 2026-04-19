const { handleRecord, handleClear, handleShow, handleSort, handleFilterByMin } = require('./pulseCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(name, pulses) {
  return { id: name, name, tabs: [], pulse: pulses };
}

beforeEach(() => jest.clearAllMocks());

test('handleRecord records pulse for named session', () => {
  const s = makeSession('alpha', undefined);
  loadSessions.mockReturnValue([s]);
  handleRecord({ _: ['record', 'alpha'] });
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].pulse).toHaveLength(1);
});

test('handleRecord errors without name', () => {
  console.error = jest.fn();
  handleRecord({ _: ['record'] });
  expect(console.error).toHaveBeenCalled();
  expect(saveSessions).not.toHaveBeenCalled();
});

test('handleClear removes pulse', () => {
  const s = makeSession('beta', [1000, 2000]);
  loadSessions.mockReturnValue([s]);
  handleClear({ _: ['clear', 'beta'] });
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].pulse).toBeUndefined();
});

test('handleShow prints pulse info', () => {
  console.log = jest.fn();
  const s = makeSession('gamma', [Date.now() - 500]);
  loadSessions.mockReturnValue([s]);
  handleShow({ _: ['show', 'gamma'] });
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('gamma'));
});

test('handleShow errors when session not found', () => {
  console.error = jest.fn();
  loadSessions.mockReturnValue([]);
  handleShow({ _: ['show', 'missing'] });
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleSort lists sessions by pulse', () => {
  console.log = jest.fn();
  const now = Date.now();
  loadSessions.mockReturnValue([
    makeSession('a', [now - 5000]),
    makeSession('b', [now - 100])
  ]);
  handleSort();
  const calls = console.log.mock.calls.map(c => c[0]);
  expect(calls[0]).toContain('b');
});

test('handleFilterByMin filters by count', () => {
  console.log = jest.fn();
  loadSessions.mockReturnValue([
    makeSession('a', [1, 2, 3]),
    makeSession('b', [1])
  ]);
  handleFilterByMin({ _: ['filter-min', '2'] });
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('a'));
});
