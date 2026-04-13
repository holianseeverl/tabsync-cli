const { renameSession, renameSessionByName } = require('./rename');

const makeSessions = () => [
  { id: 'abc1', name: 'Work Tabs', tabs: [], createdAt: '2024-01-01' },
  { id: 'abc2', name: 'Research', tabs: [], createdAt: '2024-01-02' },
  { id: 'abc3', name: 'Shopping', tabs: [], createdAt: '2024-01-03' },
];

describe('renameSession', () => {
  test('renames session by id', () => {
    const sessions = makeSessions();
    const result = renameSession(sessions, 'abc1', 'Work Stuff');
    expect(result[0].name).toBe('Work Stuff');
  });

  test('does not mutate original array', () => {
    const sessions = makeSessions();
    renameSession(sessions, 'abc1', 'New Name');
    expect(sessions[0].name).toBe('Work Tabs');
  });

  test('leaves other sessions unchanged', () => {
    const sessions = makeSessions();
    const result = renameSession(sessions, 'abc1', 'New Name');
    expect(result[1].name).toBe('Research');
    expect(result[2].name).toBe('Shopping');
  });

  test('throws if id not found', () => {
    const sessions = makeSessions();
    expect(() => renameSession(sessions, 'notreal', 'X')).toThrow('not found');
  });

  test('throws if new name is empty', () => {
    const sessions = makeSessions();
    expect(() => renameSession(sessions, 'abc1', '')).toThrow();
  });

  test('trims whitespace from new name', () => {
    const sessions = makeSessions();
    const result = renameSession(sessions, 'abc1', '  Trimmed  ');
    expect(result[0].name).toBe('Trimmed');
  });
});

describe('renameSessionByName', () => {
  test('renames session by current name', () => {
    const sessions = makeSessions();
    const result = renameSessionByName(sessions, 'Research', 'Deep Research');
    expect(result[1].name).toBe('Deep Research');
  });

  test('is case-insensitive for current name', () => {
    const sessions = makeSessions();
    const result = renameSessionByName(sessions, 'work tabs', 'Office');
    expect(result[0].name).toBe('Office');
  });

  test('throws if name not found', () => {
    const sessions = makeSessions();
    expect(() => renameSessionByName(sessions, 'Nope', 'X')).toThrow('not found');
  });

  test('throws if new name is empty string', () => {
    const sessions = makeSessions();
    expect(() => renameSessionByName(sessions, 'Research', '   ')).toThrow();
  });

  test('renames only first match when duplicates exist', () => {
    const sessions = [
      { id: 'x1', name: 'Dupe', tabs: [] },
      { id: 'x2', name: 'Dupe', tabs: [] },
    ];
    const result = renameSessionByName(sessions, 'Dupe', 'First');
    expect(result[0].name).toBe('First');
    expect(result[1].name).toBe('Dupe');
  });
});
