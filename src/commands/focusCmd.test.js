const { handleSetFocus, handleClearFocus, handleShowFocus, handleFocusHistory } = require('./focusCmd');

function makeSession(overrides = {}) {
  return { id: 'id1', name: 'Default', tabs: [], focused: false, ...overrides };
}

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('handleSetFocus sets focus on named session', () => {
  const sessions = [makeSession({ id: '1', name: 'Work' }), makeSession({ id: '2', name: 'Play' })];
  const result = handleSetFocus(sessions, 'Work');
  expect(result.find(s => s.name === 'Work').focused).toBe(true);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
});

test('handleSetFocus logs error if session not found', () => {
  const sessions = [makeSession()];
  const result = handleSetFocus(sessions, 'Unknown');
  expect(result).toBe(sessions);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleClearFocus clears all focus', () => {
  const sessions = [makeSession({ focused: true })];
  const result = handleClearFocus(sessions);
  expect(result[0].focused).toBe(false);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('cleared'));
});

test('handleShowFocus logs focused session', () => {
  const sessions = [makeSession({ focused: true, focusedAt: '2024-01-01T00:00:00Z', name: 'Work' })];
  handleShowFocus(sessions);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
});

test('handleShowFocus logs none when nothing focused', () => {
  handleShowFocus([makeSession()]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No session'));
});

test('handleFocusHistory lists sessions with focusedAt', () => {
  const sessions = [
    makeSession({ name: 'A', focusedAt: '2024-03-01T00:00:00Z' }),
    makeSession({ name: 'B', focusedAt: '2024-06-01T00:00:00Z' })
  ];
  handleFocusHistory(sessions);
  expect(console.log).toHaveBeenCalledTimes(2);
});

test('handleFocusHistory logs empty message when no history', () => {
  handleFocusHistory([makeSession()]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No focus history'));
});
