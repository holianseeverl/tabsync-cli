const {
  isValidStatus,
  setStatus,
  clearStatus,
  setStatusByName,
  filterByStatus,
  getStatus,
  listByStatus
} = require('./status');

const mockSessions = () => [
  { id: '1', name: 'Work', tabs: [], status: 'active' },
  { id: '2', name: 'Research', tabs: [], status: 'idle' },
  { id: '3', name: 'Personal', tabs: [] }
];

test('isValidStatus returns true for valid statuses', () => {
  expect(isValidStatus('active')).toBe(true);
  expect(isValidStatus('done')).toBe(true);
});

test('isValidStatus returns false for unknown status', () => {
  expect(isValidStatus('unknown')).toBe(false);
  expect(isValidStatus('')).toBe(false);
});

test('setStatus updates a session status by id', () => {
  const result = setStatus(mockSessions(), '3', 'review');
  expect(result.find(s => s.id === '3').status).toBe('review');
});

test('setStatus throws for invalid status', () => {
  expect(() => setStatus(mockSessions(), '1', 'broken')).toThrow('Invalid status');
});

test('setStatus does not mutate original sessions', () => {
  const sessions = mockSessions();
  setStatus(sessions, '1', 'paused');
  expect(sessions[0].status).toBe('active');
});

test('clearStatus removes status from a session', () => {
  const result = clearStatus(mockSessions(), '1');
  expect(result.find(s => s.id === '1').status).toBeUndefined();
});

test('setStatusByName updates by session name', () => {
  const result = setStatusByName(mockSessions(), 'Research', 'done');
  expect(result.find(s => s.name === 'Research').status).toBe('done');
});

test('setStatusByName throws if name not found', () => {
  expect(() => setStatusByName(mockSessions(), 'Ghost', 'idle')).toThrow('not found');
});

test('filterByStatus returns matching sessions', () => {
  const result = filterByStatus(mockSessions(), 'idle');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Research');
});

test('filterByStatus throws for invalid status', () => {
  expect(() => filterByStatus(mockSessions(), 'nope')).toThrow('Invalid status');
});

test('getStatus returns current status', () => {
  expect(getStatus(mockSessions(), '1')).toBe('active');
});

test('getStatus returns null if no status set', () => {
  expect(getStatus(mockSessions(), '3')).toBeNull();
});

test('getStatus throws if session not found', () => {
  expect(() => getStatus(mockSessions(), 'x')).toThrow('not found');
});

test('listByStatus groups sessions correctly', () => {
  const grouped = listByStatus(mockSessions());
  expect(grouped.active).toHaveLength(1);
  expect(grouped.idle).toHaveLength(1);
  expect(grouped.unset).toHaveLength(1);
});
