const {
  loadHistory,
  saveHistory,
  handleLogHistory,
  handleShowHistory,
  handleClearHistory
} = require('./historyCmd');
const { createSession } = require('../session');

const mockSession = (name = 'Test Session') =>
  createSession(name, ['https://example.com', 'https://github.com']);

describe('loadHistory / saveHistory', () => {
  it('returns empty array when no history file exists', () => {
    const history = loadHistory('/nonexistent/path.json');
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBe(0);
  });
});

describe('handleLogHistory', () => {
  it('appends an entry to history', () => {
    const history = [];
    const session = mockSession();
    const updated = handleLogHistory(history, session, 'rename');
    expect(updated.length).toBe(1);
    expect(updated[0].action).toBe('rename');
    expect(updated[0].sessionId).toBe(session.id);
  });

  it('records timestamp on each entry', () => {
    const history = [];
    const session = mockSession();
    const before = Date.now();
    const updated = handleLogHistory(history, session, 'archive');
    const after = Date.now();
    const ts = new Date(updated[0].timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('accumulates multiple entries', () => {
    let history = [];
    const s1 = mockSession('A');
    const s2 = mockSession('B');
    history = handleLogHistory(history, s1, 'create');
    history = handleLogHistory(history, s2, 'delete');
    expect(history.length).toBe(2);
  });
});

describe('handleShowHistory', () => {
  it('returns all entries when no filter applied', () => {
    let history = [];
    const session = mockSession();
    history = handleLogHistory(history, session, 'create');
    history = handleLogHistory(history, session, 'rename');
    const result = handleShowHistory(history, session.id);
    expect(result.length).toBe(2);
  });

  it('returns empty array for unknown session id', () => {
    const history = [];
    const result = handleShowHistory(history, 'unknown-id');
    expect(result).toEqual([]);
  });
});

describe('handleClearHistory', () => {
  it('removes all entries for a given session', () => {
    let history = [];
    const s1 = mockSession('Keep');
    const s2 = mockSession('Clear');
    history = handleLogHistory(history, s1, 'create');
    history = handleLogHistory(history, s2, 'create');
    const updated = handleClearHistory(history, s2.id);
    expect(updated.every(e => e.sessionId !== s2.id)).toBe(true);
    expect(updated.some(e => e.sessionId === s1.id)).toBe(true);
  });

  it('returns unchanged history if session not found', () => {
    let history = [];
    const session = mockSession();
    history = handleLogHistory(history, session, 'create');
    const updated = handleClearHistory(history, 'ghost-id');
    expect(updated.length).toBe(1);
  });
});
