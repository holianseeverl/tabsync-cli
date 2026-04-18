const {
  addRevision,
  getRevisions,
  findRevision,
  restoreRevision,
  removeRevision,
  clearRevisions,
} = require('./revision');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: ['https://example.com'], ...overrides };
}

test('addRevision adds a revision entry', () => {
  const s = makeSession();
  addRevision(s, 'v1');
  expect(s.revisions).toHaveLength(1);
  expect(s.revisions[0].label).toBe('v1');
});

test('getRevisions returns empty array when none', () => {
  const s = makeSession();
  expect(getRevisions(s)).toEqual([]);
});

test('findRevision returns correct revision', () => {
  const s = makeSession();
  addRevision(s, 'v1');
  addRevision(s, 'v2');
  const rev = findRevision(s, 'v1');
  expect(rev).not.toBeNull();
  expect(rev.label).toBe('v1');
});

test('findRevision returns null for missing label', () => {
  const s = makeSession();
  expect(findRevision(s, 'nope')).toBeNull();
});

test('restoreRevision restores snapshot', () => {
  const s = makeSession({ name: 'Original' });
  addRevision(s, 'v1');
  s.name = 'Modified';
  const restored = restoreRevision(s, 'v1');
  expect(restored.name).toBe('Original');
  expect(restored.revisions).toBeDefined();
});

test('restoreRevision returns null for unknown label', () => {
  const s = makeSession();
  expect(restoreRevision(s, 'ghost')).toBeNull();
});

test('removeRevision removes by label', () => {
  const s = makeSession();
  addRevision(s, 'v1');
  addRevision(s, 'v2');
  removeRevision(s, 'v1');
  expect(getRevisions(s)).toHaveLength(1);
  expect(getRevisions(s)[0].label).toBe('v2');
});

test('clearRevisions empties all revisions', () => {
  const s = makeSession();
  addRevision(s, 'v1');
  addRevision(s, 'v2');
  clearRevisions(s);
  expect(getRevisions(s)).toHaveLength(0);
});
