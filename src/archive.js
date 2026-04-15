const { v4: uuidv4 } = require('uuid');

function archiveSession(sessions, sessionId) {
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx === -1) throw new Error(`Session not found: ${sessionId}`);
  const updated = sessions.map(s =>
    s.id === sessionId ? { ...s, archived: true, archivedAt: new Date().toISOString() } : s
  );
  return updated;
}

function unarchiveSession(sessions, sessionId) {
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx === -1) throw new Error(`Session not found: ${sessionId}`);
  const updated = sessions.map(s => {
    if (s.id !== sessionId) return s;
    const { archived, archivedAt, ...rest } = s;
    return rest;
  });
  return updated;
}

function listArchived(sessions) {
  return sessions.filter(s => s.archived === true);
}

function listActive(sessions) {
  return sessions.filter(s => !s.archived);
}

function purgeArchived(sessions) {
  return sessions.filter(s => !s.archived);
}

module.exports = { archiveSession, unarchiveSession, listArchived, listActive, purgeArchived };
