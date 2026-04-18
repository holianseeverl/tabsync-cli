const { setOwner, clearOwner, getOwner, setOwnerByName, filterByOwner, listOwners, transferOwner } = require('./ownership');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

test('setOwner assigns owner', () => {
  const s = setOwner(makeSession(), 'alice');
  expect(s.owner).toBe('alice');
});

test('setOwner trims whitespace', () => {
  const s = setOwner(makeSession(), '  bob  ');
  expect(s.owner).toBe('bob');
});

test('setOwner throws on empty string', () => {
  expect(() => setOwner(makeSession(), '')).toThrow();
});

test('clearOwner removes owner', () => {
  const s = clearOwner(makeSession({ owner: 'alice' }));
  expect(s.owner).toBeUndefined();
});

test('getOwner returns owner or null', () => {
  expect(getOwner(makeSession({ owner: 'alice' }))).toBe('alice');
  expect(getOwner(makeSession())).toBeNull();
});

test('setOwnerByName updates matching session', () => {
  const sessions = [makeSession({ name: 'A' }), makeSession({ id: 's2', name: 'B' })];
  const result = setOwnerByName(sessions, 'A', 'carol');
  expect(result[0].owner).toBe('carol');
  expect(result[1].owner).toBeUndefined();
});

test('filterByOwner returns matching sessions', () => {
  const sessions = [
    makeSession({ owner: 'alice' }),
    makeSession({ id: 's2', owner: 'bob' }),
    makeSession({ id: 's3', owner: 'alice' }),
  ];
  expect(filterByOwner(sessions, 'alice')).toHaveLength(2);
});

test('listOwners returns unique owners', () => {
  const sessions = [
    makeSession({ owner: 'alice' }),
    makeSession({ id: 's2', owner: 'bob' }),
    makeSession({ id: 's3', owner: 'alice' }),
    makeSession({ id: 's4' }),
  ];
  const owners = listOwners(sessions);
  expect(owners).toHaveLength(2);
  expect(owners).toContain('alice');
  expect(owners).toContain('bob');
});

test('transferOwner moves all sessions from one owner to another', () => {
  const sessions = [
    makeSession({ owner: 'alice' }),
    makeSession({ id: 's2', owner: 'bob' }),
  ];
  const result = transferOwner(sessions, 'alice', 'carol');
  expect(result[0].owner).toBe('carol');
  expect(result[1].owner).toBe('bob');
});

test('transferOwner throws on invalid target', () => {
  expect(() => transferOwner([], 'alice', '')).toThrow();
});
