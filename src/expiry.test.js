const {
  setExpiry,
  clearExpiry,
  isExpired,
  listExpired,
  listActive,
  setExpiryByName,
  purgeExpired
} = require('./expiry');

const now = new Date('2024-06-01T12:00:00Z');
const past = '2024-05-01T00:00:00Z';
const future = '2024-07-01T00:00:00Z';

const sessions = [
  { id: '1', name: 'alpha', tabs: [] },
  { id: '2', name: 'beta', tabs: [], expiresAt: past },
  { id: '3', name: 'gamma', tabs: [], expiresAt: future }
];

test('setExpiry sets expiresAt on matching session', () => {
  const result = setExpiry(sessions, '1', future);
  expect(result.find(s => s.id === '1').expiresAt).toBe(future);
  expect(result.find(s => s.id === '2').expiresAt).toBe(past);
});

test('setExpiry does not modify other sessions', () => {
  const result = setExpiry(sessions, '1', future);
  expect(result.find(s => s.id === '3').expiresAt).toBe(future);
});

test('clearExpiry removes expiresAt from session', () => {
  const result = clearExpiry(sessions, '2');
  expect(result.find(s => s.id === '2').expiresAt).toBeUndefined();
});

test('clearExpiry leaves unrelated sessions intact', () => {
  const result = clearExpiry(sessions, '2');
  expect(result.find(s => s.id === '3').expiresAt).toBe(future);
});

test('isExpired returns true for past expiresAt', () => {
  expect(isExpired({ expiresAt: past }, now)).toBe(true);
});

test('isExpired returns false for future expiresAt', () => {
  expect(isExpired({ expiresAt: future }, now)).toBe(false);
});

test('isExpired returns false when no expiresAt', () => {
  expect(isExpired({ id: '1' }, now)).toBe(false);
});

test('listExpired returns only expired sessions', () => {
  const result = listExpired(sessions, now);
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('2');
});

test('listActive returns sessions not expired', () => {
  const result = listActive(sessions, now);
  expect(result.map(s => s.id)).toEqual(['1', '3']);
});

test('setExpiryByName sets expiry by session name', () => {
  const result = setExpiryByName(sessions, 'alpha', past);
  expect(result.find(s => s.name === 'alpha').expiresAt).toBe(past);
});

test('setExpiryByName returns unchanged sessions if name not found', () => {
  const result = setExpiryByName(sessions, 'nonexistent', past);
  expect(result).toEqual(sessions);
});

test('purgeExpired removes expired sessions', () => {
  const result = purgeExpired(sessions, now);
  expect(result.find(s => s.id === '2')).toBeUndefined();
  expect(result).toHaveLength(2);
});
