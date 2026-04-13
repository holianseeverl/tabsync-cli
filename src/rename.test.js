const { renameSession, renameSessionByName } = require('./rename');

describe('renameSession', () => {
  const session = {
    id: 'abc123',
    name: 'Old Name',
    tabs: [],
    tags: [],
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  test('renames session by id', () => {
    const result = renameSession([session], 'abc123', 'New Name');
    expect(result[0].name).toBe('New Name');
  });

  test('does not mutate original session', () => {
    renameSession([session], 'abc123', 'New Name');
    expect(session.name).toBe('Old Name');
  });

  test('returns unchanged list if id not found', () => {
    const result = renameSession([session], 'notreal', 'New Name');
    expect(result[0].name).toBe('Old Name');
  });

  test('throws if newName is empty', () => {
    expect(() => renameSession([session], 'abc123', '')).toThrow();
  });

  test('throws if newName is not a string', () => {
    expect(() => renameSession([session], 'abc123', 42)).toThrow();
  });
});

describe('renameSessionByName', () => {
  const sessions = [
    { id: '1', name: 'Work', tabs: [], tags: [], createdAt: '2024-01-01T00:00:00.000Z' },
    { id: '2', name: 'Personal', tabs: [], tags: [], createdAt: '2024-01-02T00:00:00.000Z' }
  ];

  test('renames first matching session by name', () => {
    const result = renameSessionByName(sessions, 'Work', 'Work 2024');
    expect(result.find(s => s.id === '1').name).toBe('Work 2024');
  });

  test('leaves other sessions unchanged', () => {
    const result = renameSessionByName(sessions, 'Work', 'Work 2024');
    expect(result.find(s => s.id === '2').name).toBe('Personal');
  });

  test('returns unchanged list if name not found', () => {
    const result = renameSessionByName(sessions, 'Nonexistent', 'Whatever');
    expect(result.map(s => s.name)).toEqual(['Work', 'Personal']);
  });

  test('throws if oldName is empty', () => {
    expect(() => renameSessionByName(sessions, '', 'New')).toThrow();
  });

  test('throws if newName is empty', () => {
    expect(() => renameSessionByName(sessions, 'Work', '')).toThrow();
  });
});
