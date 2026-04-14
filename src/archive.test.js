const {
  archiveSession,
  unarchiveSession,
  listArchived,
  listActive,
  purgeArchived,
} = require('./archive');

const makeSessions = () => [
  { id: 'aaa', name: 'Work', tabs: [], createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'bbb', name: 'Research', tabs: [], createdAt: '2024-01-02T00:00:00.000Z' },
  { id: 'ccc', name: 'Shopping', tabs: [], createdAt: '2024-01-03T00:00:00.000Z', archivedAt: '2024-02-01T00:00:00.000Z' },
];

describe('archiveSession', () => {
  it('sets archivedAt on the target session', () => {
    const result = archiveSession(makeSessions(), 'aaa');
    expect(result.find(s => s.id === 'aaa').archivedAt).toBeDefined();
  });

  it('does not modify other sessions', () => {
    const result = archiveSession(makeSessions(), 'aaa');
    expect(result.find(s => s.id === 'bbb').archivedAt).toBeUndefined();
  });

  it('throws if session id not found', () => {
    expect(() => archiveSession(makeSessions(), 'zzz')).toThrow('not found');
  });
});

describe('unarchiveSession', () => {
  it('removes archivedAt from an archived session', () => {
    const result = unarchiveSession(makeSessions(), 'ccc');
    expect(result.find(s => s.id === 'ccc').archivedAt).toBeUndefined();
  });

  it('throws if session id not found', () => {
    expect(() => unarchiveSession(makeSessions(), 'zzz')).toThrow('not found');
  });

  it('leaves other sessions unchanged', () => {
    const result = unarchiveSession(makeSessions(), 'ccc');
    expect(result.find(s => s.id === 'aaa').archivedAt).toBeUndefined();
  });
});

describe('listArchived', () => {
  it('returns only sessions with archivedAt', () => {
    const result = listArchived(makeSessions());
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ccc');
  });

  it('returns empty array when none are archived', () => {
    const sessions = makeSessions().map(({ archivedAt, ...s }) => s);
    expect(listArchived(sessions)).toHaveLength(0);
  });
});

describe('listActive', () => {
  it('returns sessions without archivedAt', () => {
    const result = listActive(makeSessions());
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).not.toContain('ccc');
  });
});

describe('purgeArchived', () => {
  it('removes all archived sessions permanently', () => {
    const result = purgeArchived(makeSessions());
    expect(result).toHaveLength(2);
    expect(result.find(s => s.id === 'ccc')).toBeUndefined();
  });

  it('returns all sessions unchanged if none archived', () => {
    const active = listActive(makeSessions());
    expect(purgeArchived(active)).toHaveLength(2);
  });
});
