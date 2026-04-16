const {
  isValidAccessLevel,
  setAccess,
  clearAccess,
  setAccessByName,
  getAccess,
  filterByAccess,
  listReadOnly,
} = require('./access');

const makeSessions = () => [
  { id: '1', name: 'Work', tabs: [] },
  { id: '2', name: 'Research', tabs: [], access: 'read' },
  { id: '3', name: 'Personal', tabs: [], access: 'none' },
];

test('isValidAccessLevel returns true for valid levels', () => {
  expect(isValidAccessLevel('read')).toBe(true);
  expect(isValidAccessLevel('write')).toBe(true);
  expect(isValidAccessLevel('none')).toBe(true);
});

test('isValidAccessLevel returns false for invalid level', () => {
  expect(isValidAccessLevel('admin')).toBe(false);
  expect(isValidAccessLevel('')).toBe(false);
});

test('setAccess sets access level on matching session', () => {
  const sessions = makeSessions();
  const result = setAccess(sessions, '1', 'read');
  expect(result.find(s => s.id === '1').access).toBe('read');
});

test('setAccess does not mutate original', () => {
  const sessions = makeSessions();
  setAccess(sessions, '1', 'read');
  expect(sessions[0].access).toBeUndefined();
});

test('setAccess throws on invalid level', () => {
  expect(() => setAccess(makeSessions(), '1', 'superuser')).toThrow();
});

test('clearAccess removes access field', () => {
  const sessions = makeSessions();
  const result = clearAccess(sessions, '2');
  expect(result.find(s => s.id === '2').access).toBeUndefined();
});

test('setAccessByName updates by name', () => {
  const sessions = makeSessions();
  const result = setAccessByName(sessions, 'Work', 'none');
  expect(result.find(s => s.name === 'Work').access).toBe('none');
});

test('setAccessByName throws if name not found', () => {
  expect(() => setAccessByName(makeSessions(), 'Ghost', 'read')).toThrow();
});

test('getAccess returns write as default when not set', () => {
  expect(getAccess({ id: '1', name: 'X', tabs: [] })).toBe('write');
});

test('getAccess returns stored level', () => {
  expect(getAccess({ id: '1', name: 'X', tabs: [], access: 'read' })).toBe('read');
});

test('filterByAccess returns matching sessions', () => {
  const result = filterByAccess(makeSessions(), 'read');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Research');
});

test('listReadOnly returns only read sessions', () => {
  const result = listReadOnly(makeSessions());
  expect(result.every(s => s.access === 'read')).toBe(true);
});
