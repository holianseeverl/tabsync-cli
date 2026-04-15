const {
  handleSetReminder,
  handleClearReminder,
  handleShowReminder,
  handleListDue
} = require('./reminderCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const baseSessions = [
  { id: '1', name: 'Work', tabs: [] },
  { id: '2', name: 'Personal', tabs: [] }
];

beforeEach(() => {
  jest.clearAllMocks();
  console.log = jest.fn();
});

test('handleSetReminder saves reminder and logs confirmation', () => {
  loadSessions.mockReturnValue([...baseSessions]);
  handleSetReminder('Work', 'Check tabs', '2025-06-01T09:00:00Z');
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].reminder.message).toBe('Check tabs');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Reminder set'));
});

test('handleSetReminder logs error if session not found', () => {
  loadSessions.mockReturnValue([...baseSessions]);
  handleSetReminder('Nonexistent', 'x');
  expect(saveSessions).not.toHaveBeenCalled();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleClearReminder removes reminder', () => {
  const sessions = [
    { id: '1', name: 'Work', tabs: [], reminder: { message: 'hi', dueAt: null, createdAt: '' } }
  ];
  loadSessions.mockReturnValue(sessions);
  handleClearReminder('Work');
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  expect(saved[0].reminder).toBeUndefined();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('cleared'));
});

test('handleClearReminder logs error if session not found', () => {
  loadSessions.mockReturnValue([...baseSessions]);
  handleClearReminder('Ghost');
  expect(saveSessions).not.toHaveBeenCalled();
});

test('handleShowReminder displays reminder details', () => {
  const sessions = [
    { id: '1', name: 'Work', tabs: [], reminder: { message: 'Review', dueAt: '2025-01-01T00:00:00.000Z', createdAt: '2024-12-01T00:00:00.000Z' } }
  ];
  loadSessions.mockReturnValue(sessions);
  handleShowReminder('Work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Review'));
});

test('handleShowReminder logs if no reminder set', () => {
  loadSessions.mockReturnValue([...baseSessions]);
  handleShowReminder('Work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No reminder'));
});

test('handleListDue shows overdue sessions', () => {
  const sessions = [
    { id: '1', name: 'Work', tabs: [], reminder: { message: 'Old', dueAt: '2000-01-01T00:00:00.000Z' } },
    { id: '2', name: 'Personal', tabs: [] }
  ];
  loadSessions.mockReturnValue(sessions);
  handleListDue();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
});

test('handleListDue shows message when none are due', () => {
  loadSessions.mockReturnValue([...baseSessions]);
  handleListDue();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
});
