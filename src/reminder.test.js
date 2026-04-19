const {
  setReminder,
  clearReminder,
  getReminder,
  listDue,
  setReminderByName,
  hasReminder
} = require('./reminder');

const makeSessions = () => [
  { id: '1', name: 'Work', tabs: [] },
  { id: '2', name: 'Research', tabs: [] }
];

test('setReminder attaches reminder to session', () => {
  const result = setReminder(makeSessions(), '1', { message: 'Review tabs', dueAt: '2025-12-01T10:00:00Z' });
  expect(result[0].reminder).toBeDefined();
  expect(result[0].reminder.message).toBe('Review tabs');
  expect(result[0].reminder.dueAt).toBe('2025-12-01T10:00:00.000Z');
  expect(result[1].reminder).toBeUndefined();
});

test('setReminder does not affect other sessions', () => {
  const result = setReminder(makeSessions(), '2', { message: 'Check later' });
  expect(result[0].reminder).toBeUndefined();
  expect(result[1].reminder.message).toBe('Check later');
});

test('setReminder overwrites existing reminder', () => {
  let sessions = setReminder(makeSessions(), '1', { message: 'First' });
  sessions = setReminder(sessions, '1', { message: 'Second' });
  expect(sessions[0].reminder.message).toBe('Second');
});

test('clearReminder removes reminder from session', () => {
  let sessions = setReminder(makeSessions(), '1', { message: 'Do it' });
  sessions = clearReminder(sessions, '1');
  expect(sessions[0].reminder).toBeUndefined();
});

test('clearReminder leaves session intact if no reminder', () => {
  const sessions = clearReminder(makeSessions(), '1');
  expect(sessions[0]).toEqual({ id: '1', name: 'Work', tabs: [] });
});

test('getReminder returns reminder for session', () => {
  const sessions = setReminder(makeSessions(), '1', { message: 'Hi' });
  expect(getReminder(sessions, '1').message).toBe('Hi');
});

test('getReminder returns null if no reminder', () => {
  expect(getReminder(makeSessions(), '1')).toBeNull();
});

test('getReminder returns null for unknown session id', () => {
  expect(getReminder(makeSessions(), 'nonexistent')).toBeNull();
});

test('listDue returns sessions with overdue reminders', () => {
  let sessions = setReminder(makeSessions(), '1', { dueAt: '2000-01-01T00:00:00Z' });
  sessions = setReminder(sessions, '2', { dueAt: '2099-01-01T00:00:00Z' });
  const due = listDue(sessions);
  expect(due).toHaveLength(1);
  expect(due[0].id).toBe('1');
});

test('setReminderByName finds session by name', () => {
  const result = setReminderByName(makeSessions(), 'Research', { message: 'Read more' });
  expect(result[1].reminder.message).toBe('Read more');
});

test('setReminderByName returns unchanged if name not found', () => {
  const sessions = makeSessions();
  const result = setReminderByName(sessions, 'Nope', { message: 'x' });
  expect(result).toEqual(sessions);
});

test('hasReminder returns true when reminder exists', () => {
  const session = { id: '1', reminder: { message: 'test' } };
  expect(hasReminder(session)).toBe(true);
});

test('hasReminder returns false when no reminder', () => {
  expect(hasReminder({ id: '1' })).toBe(false);
});
