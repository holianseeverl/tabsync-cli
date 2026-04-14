const { v4: uuidv4 } = require('uuid');

/**
 * Archive (soft-delete) a session by marking it with an archivedAt timestamp.
 * Returns a new sessions array with the session archived.
 */
function archiveSession(sessions, sessionId) {
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index === -1) {
    throw new Error(`Session with id "${sessionId}" not found.`);
  }
  const updated = sessions.map(s =>
    s.id === sessionId ? { ...s, archivedAt: new Date().toISOString() } : s
  );
  return updated;
}

/**
 * Unarchive a session by removing its archivedAt timestamp.
 */
function unarchiveSession(sessions, sessionId) {
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index === -1) {
    throw new Error(`Session with id "${sessionId}" not found.`);
  }
  const updated = sessions.map(s => {
    if (s.id !== sessionId) return s;
    const copy = { ...s };
    delete copy.archivedAt;
    return copy;
  });
  return updated;
}

/**
 * Return only archived sessions.
 */
function listArchived(sessions) {
  return sessions.filter(s => Boolean(s.archivedAt));
}

/**
 * Return only active (non-archived) sessions.
 */
function listActive(sessions) {
  return sessions.filter(s => !s.archivedAt);
}

/**
 * Permanently remove all archived sessions from the list.
 */
function purgeArchived(sessions) {
  return sessions.filter(s => !s.archivedAt);
}

module.exports = {
  archiveSession,
  unarchiveSession,
  listArchived,
  listActive,
  purgeArchived,
};
