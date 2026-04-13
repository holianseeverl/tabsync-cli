const { renameSession, renameSessionByName } = require('./rename');

const mockSessions = () => [
  { id: 'abc123', name: 'Work Tabs', tabs: [], createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'def456', name: 'Personal', tabs: [], createdAt: '2024-01-02T00:00:00.000Z' },
  { id: 'ghi789', name: 'Research', tabs: [], createdAt: '2024-01-03T00:00:00.000Z' },
];

describe('renameSession', () => {
  test('renames a session by id', () => {
    const { sessions, renamed } = renameSession(mockSessions(), 'abc123', 'Office Tabs');
    expect(renamed).toBe(true);
    expect(sessions[0].name).toBe('Office Tabs');
  });

  test('sets updatedAt on renamed session', () => {
    const { sessions } = renameSession(mockSessions(), 'abc123', 'Office Tabs');
    expect(sessions[0].updatedAt).toBeDefined();
  });

  test('does not modify other sessions', () => {
    const { sessions } = renameSession(mockSessions(), 'abc123', 'Office Tabs');
    expect(sessions[1].name).toBe('Personal');
    expect(sessions[2].name).toBe('Research');
  });

  test('returns renamed=false when id not found', () => {
    const { sessions, renamed } = renameSession(mockSessions(), 'notreal', 'Whatever');
    expect(renamed).toBe(false);
    expect(sessions).toHaveLength(3);
  });

  test('throws if new name is empty', () => {
    expect(() => renameSession(mockSessions(), 'abc123', '')).toThrow();
  });

  test('throws if new name is whitespace only', () => {
    expect(() => renameSession(mockSessions(), 'abc123', '   ')).toThrow();
  });

  test('trims whitespace from new name', () => {
    const { sessions } = renameSession(mockSessions(), 'abc123', '  Trimmed  ');
    expect(sessions[0].name).toBe('Trimmed');
  });
});

describe('renameSessionByName', () => {
  test('renames first matching session by name', () => {
    const { sessions, renamed } = renameSessionByName(mockSessions(), 'Personal', 'Home Tabs');
    expect(renamed).toBe(true);
    expect(sessions[1].name).toBe('Home Tabs');
  });

  test('only renames first match', () => {
    const sessions = [
      ...mockSessions(),
      { id: 'dup001', name: 'Personal', tabs: [], createdAt: '2024-01-04T00:00:00.000Z' },
    ];
    const { sessions: updated } = renameSessionByName(sessions, 'Personal', 'Home Tabs');
    expect(updated.filter((s) => s.name === 'Personal')).toHaveLength(1);
    expect(updated.filter((s) => s.name === 'Home Tabs')).toHaveLength(1);
  });

  test('returns renamed=false when name not found', () => {
    const { renamed } = renameSessionByName(mockSessions(), 'Nonexistent', 'New Name');
    expect(renamed).toBe(false);
  });

  test('throws if current name is empty', () => {
    expect(() => renameSessionByName(mockSessions(), '', 'New Name')).toThrow();
  });

  test('throws if new name is empty', () => {
    expect(() => renameSessionByName(mockSessions(), 'Personal', '')).toThrow();
  });
});
