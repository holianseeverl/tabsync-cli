const { handleSetImpact, handleClearImpact, handleShowImpact, handleFilterByImpact, handleSortByImpact } = require('./impactCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

function makeSession(name, impact) {
  const s = { id: name, name, tabs: [] };
  if (impact) s.impact = impact;
  return s;
}

beforeEach(() => jest.clearAllMocks());

test('handleSetImpact saves updated session', () => {
  loadSessions.mockReturnValue([makeSession('a')]);
  handleSetImpact('a', 'high');
  expect(saveSessions).toHaveBeenCalledWith([expect.objectContaining({ impact: 'high' })]);
});

test('handleSetImpact logs error on invalid impact', () => {
  loadSessions.mockReturnValue([makeSession('a')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSetImpact('a', 'extreme');
  expect(saveSessions).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('handleClearImpact removes impact', () => {
  loadSessions.mockReturnValue([makeSession('a', 'low')]);
  handleClearImpact('a');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].impact).toBeUndefined();
});

test('handleShowImpact prints impact', () => {
  loadSessions.mockReturnValue([makeSession('a', 'critical')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowImpact('a');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('critical'));
  spy.mockRestore();
});

test('handleShowImpact prints no impact set when missing', () => {
  loadSessions.mockReturnValue([makeSession('a')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleShowImpact('a');
  expect(spy).toHaveBeenCalledWith('No impact set.');
  spy.mockRestore();
});

test('handleFilterByImpact lists matching sessions', () => {
  loadSessions.mockReturnValue([makeSession('a', 'high'), makeSession('b', 'low')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFilterByImpact('high');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('a'));
  spy.mockRestore();
});

test('handleSortByImpact prints sessions in order', () => {
  loadSessions.mockReturnValue([makeSession('a', 'low'), makeSession('b', 'critical')]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleSortByImpact();
  expect(spy.mock.calls[0][0]).toContain('b');
  spy.mockRestore();
});
