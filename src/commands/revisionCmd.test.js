const {
  handleAddRevision,
  handleRestoreRevision,
  handleListRevisions,
  handleRemoveRevision,
  handleClearRevisions,
} = require('./revisionCmd');

function makeSessions() {
  return [
    { id: '1', name: 'Work', tabs: ['https://github.com'] },
    { id: '2', name: 'Personal', tabs: ['https://reddit.com'] },
  ];
}

test('handleAddRevision saves a revision', () => {
  const sessions = makeSessions();
  const result = handleAddRevision(sessions, 'Work', 'v1');
  expect(result.success).toBe(true);
  expect(sessions[0].revisions).toHaveLength(1);
});

test('handleAddRevision errors on unknown session', () => {
  const sessions = makeSessions();
  const result = handleAddRevision(sessions, 'Ghost', 'v1');
  expect(result.error).toBeDefined();
});

test('handleAddRevision errors on duplicate label', () => {
  const sessions = makeSessions();
  handleAddRevision(sessions, 'Work', 'v1');
  const result = handleAddRevision(sessions, 'Work', 'v1');
  expect(result.error).toBeDefined();
});

test('handleRestoreRevision restores session', () => {
  const sessions = makeSessions();
  sessions[0].name = 'Work';
  handleAddRevision(sessions, 'Work', 'v1');
  sessions[0].name = 'Work-modified';
  const result = handleRestoreRevision(sessions, 'Work-modified', 'v1');
  // session name was changed so lookup fails
  expect(result.error).toBeDefined();
});

test('handleRestoreRevision works correctly', () => {
  const sessions = makeSessions();
  handleAddRevision(sessions, 'Work', 'v1');
  sessions[0].tabs.push('https://newsite.com');
  const result = handleRestoreRevision(sessions, 'Work', 'v1');
  expect(result.success).toBe(true);
  expect(result.sessions[0].tabs).toHaveLength(1);
});

test('handleListRevisions lists revisions', () => {
  const sessions = makeSessions();
  handleAddRevision(sessions, 'Work', 'v1');
  handleAddRevision(sessions, 'Work', 'v2');
  const result = handleListRevisions(sessions, 'Work');
  expect(result.revisions).toHaveLength(2);
});

test('handleListRevisions message when none', () => {
  const sessions = makeSessions();
  const result = handleListRevisions(sessions, 'Work');
  expect(result.message).toBeDefined();
});

test('handleRemoveRevision removes a revision', () => {
  const sessions = makeSessions();
  handleAddRevision(sessions, 'Work', 'v1');
  const result = handleRemoveRevision(sessions, 'Work', 'v1');
  expect(result.success).toBe(true);
  expect(sessions[0].revisions).toHaveLength(0);
});

test('handleClearRevisions clears all', () => {
  const sessions = makeSessions();
  handleAddRevision(sessions, 'Work', 'v1');
  handleAddRevision(sessions, 'Work', 'v2');
  const result = handleClearRevisions(sessions, 'Work');
  expect(result.success).toBe(true);
  expect(sessions[0].revisions).toHaveLength(0);
});
