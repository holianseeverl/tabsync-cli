const { createSnapshot, restoreSnapshot, listSnapshots, findSnapshotByLabel } = require('./snapshot');

const mockSessions = [
  { id: '1', name: 'Work', tabs: ['https://github.com'], tags: [], createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'Research', tabs: ['https://mdn.org'], tags: ['dev'], createdAt: '2024-01-02T00:00:00.000Z' },
];

describe('createSnapshot', () => {
  it('creates a snapshot with a custom label', () => {
    const snap = createSnapshot(mockSessions, 'my-snap');
    expect(snap.label).toBe('my-snap');
    expect(snap.sessions).toHaveLength(2);
    expect(snap.createdAt).toBeDefined();
  });

  it('generates a default label if none provided', () => {
    const snap = createSnapshot(mockSessions);
    expect(snap.label).toMatch(/^snapshot-\d+$/);
  });

  it('deep copies sessions', () => {
    const snap = createSnapshot(mockSessions, 'copy-test');
    snap.sessions[0].name = 'Modified';
    expect(mockSessions[0].name).toBe('Work');
  });

  it('throws if sessions is not an array', () => {
    expect(() => createSnapshot(null)).toThrow();
  });
});

describe('restoreSnapshot', () => {
  it('restores sessions from a valid snapshot', () => {
    const snap = createSnapshot(mockSessions, 'restore-test');
    const restored = restoreSnapshot(snap);
    expect(restored).toHaveLength(2);
    expect(restored[0].name).toBe('Work');
  });

  it('throws on invalid snapshot', () => {
    expect(() => restoreSnapshot({})).toThrow();
    expect(() => restoreSnapshot(null)).toThrow();
  });
});

describe('listSnapshots', () => {
  it('returns a summary list', () => {
    const snaps = [
      createSnapshot(mockSessions, 'snap-a'),
      createSnapshot([mockSessions[0]], 'snap-b'),
    ];
    const list = listSnapshots(snaps);
    expect(list).toHaveLength(2);
    expect(list[0].label).toBe('snap-a');
    expect(list[1].sessionCount).toBe(1);
  });

  it('returns empty array for non-array input', () => {
    expect(listSnapshots(null)).toEqual([]);
  });
});

describe('findSnapshotByLabel', () => {
  it('finds a snapshot by label', () => {
    const snaps = [createSnapshot(mockSessions, 'find-me')];
    const found = findSnapshotByLabel(snaps, 'find-me');
    expect(found).not.toBeNull();
    expect(found.label).toBe('find-me');
  });

  it('returns null if not found', () => {
    expect(findSnapshotByLabel([], 'nope')).toBeNull();
  });
});
