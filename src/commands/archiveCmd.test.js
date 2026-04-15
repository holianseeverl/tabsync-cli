const { archiveSession, unarchiveSession, listArchived, listActive, purgeArchived } = require('../archive');

const makeSessions = () => [
  { id: 'a1', name: 'Work', tabs: [{ url: 'https://github.com' }], createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'b2', name: 'Personal', tabs: [{ url: 'https://reddit.com' }], createdAt: '2024-01-02T00:00:00.000Z' },
  { id: 'c3', name: 'Research', tabs: [{ url: 'https://arxiv.org' }], createdAt: '2024-01-03T00:00:00.000Z', archived: true, archivedAt: '2024-02-01T00:00:00.000Z' },
];

describe('archiveSession', () => {
  it('marks a session as archived', () => {
    const result = archiveSession(makeSessions(), 'a1');
    const s = result.find(s => s.id === 'a1');
    expect(s.archived).toBe(true);
    expect(s.archivedAt).toBeDefined();
  });

  it('throws if session not found', () => {
    expect(() => archiveSession(makeSessions(), 'missing')).toThrow('Session not found: missing');
  });

  it('does not modify other sessions', () => {
    const result = archiveSession(makeSessions(), 'a1');
    const other = result.find(s => s.id === 'b2');
    expect(other.archived).toBeUndefined();
  });
});

describe('unarchiveSession', () => {
  it('removes archived flag from a session', () => {
    const result = unarchiveSession(makeSessions(), 'c3');
    const s = result.find(s => s.id === 'c3');
    expect(s.archived).toBeUndefined();
    expect(s.archivedAt).toBeUndefined();
  });

  it('throws if session not found', () => {
    expect(() => unarchiveSession(makeSessions(), 'nope')).toThrow('Session not found: nope');
  });
});

describe('listArchived', () => {
  it('returns only archived sessions', () => {
    const result = listArchived(makeSessions());
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c3');
  });
});

describe('listActive', () => {
  it('returns only non-archived sessions', () => {
    const result = listActive(makeSessions());
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toEqual(['a1', 'b2']);
  });
});

describe('purgeArchived', () => {
  it('removes all archived sessions', () => {
    const result = purgeArchived(makeSessions());
    expect(result).toHaveLength(2);
    expect(result.every(s => !s.archived)).toBe(true);
  });

  it('returns same list if nothing archived', () => {
    const sessions = makeSessions().filter(s => !s.archived);
    const result = purgeArchived(sessions);
    expect(result).toHaveLength(2);
  });
});
