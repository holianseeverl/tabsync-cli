const {
  createHistoryEntry,
  addHistoryEntry,
  getHistoryForSession,
  clearHistory,
  filterHistoryByAction,
  getRecentHistory,
} = require('./history');

describe('createHistoryEntry', () => {
  it('creates a valid history entry', () => {
    const entry = createHistoryEntry('s1', 'Work', 'opened');
    expect(entry).toMatchObject({ sessionId: 's1', sessionName: 'Work', action: 'opened' });
    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeDefined();
  });

  it('throws on missing fields', () => {
    expect(() => createHistoryEntry(null, 'Work', 'opened')).toThrow();
    expect(() => createHistoryEntry('s1', '', 'opened')).toThrow();
  });

  it('throws on invalid action', () => {
    expect(() => createHistoryEntry('s1', 'Work', 'deleted')).toThrow(/Invalid action/);
  });
});

describe('addHistoryEntry', () => {
  it('appends a new entry to history', () => {
    const history = addHistoryEntry([], 's1', 'Work', 'opened');
    expect(history).toHaveLength(1);
    expect(history[0].action).toBe('opened');
  });

  it('does not mutate original array', () => {
    const original = [];
    addHistoryEntry(original, 's1', 'Work', 'opened');
    expect(original).toHaveLength(0);
  });
});

describe('getHistoryForSession', () => {
  const history = [
    { id: '1', sessionId: 's1', sessionName: 'Work', action: 'opened', timestamp: '' },
    { id: '2', sessionId: 's2', sessionName: 'Home', action: 'closed', timestamp: '' },
    { id: '3', sessionId: 's1', sessionName: 'Work', action: 'closed', timestamp: '' },
  ];

  it('returns only entries for given sessionId', () => {
    const result = getHistoryForSession(history, 's1');
    expect(result).toHaveLength(2);
    result.forEach((e) => expect(e.sessionId).toBe('s1'));
  });

  it('returns empty if no match', () => {
    expect(getHistoryForSession(history, 'unknown')).toHaveLength(0);
  });
});

describe('clearHistory', () => {
  const history = [
    { id: '1', sessionId: 's1', action: 'opened' },
    { id: '2', sessionId: 's2', action: 'closed' },
  ];

  it('clears all history when no sessionId given', () => {
    expect(clearHistory(history)).toHaveLength(0);
  });

  it('clears only entries for given sessionId', () => {
    const result = clearHistory(history, 's1');
    expect(result).toHaveLength(1);
    expect(result[0].sessionId).toBe('s2');
  });
});

describe('filterHistoryByAction', () => {
  const history = [
    { id: '1', action: 'opened' },
    { id: '2', action: 'closed' },
    { id: '3', action: 'opened' },
  ];

  it('filters by action', () => {
    expect(filterHistoryByAction(history, 'opened')).toHaveLength(2);
    expect(filterHistoryByAction(history, 'closed')).toHaveLength(1);
  });
});

describe('getRecentHistory', () => {
  it('returns entries sorted by most recent first', () => {
    const history = [
      { id: '1', timestamp: '2024-01-01T10:00:00Z' },
      { id: '2', timestamp: '2024-03-01T10:00:00Z' },
      { id: '3', timestamp: '2024-02-01T10:00:00Z' },
    ];
    const result = getRecentHistory(history, 2);
    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('3');
    expect(result).toHaveLength(2);
  });
});
