// lock.js — pin a session as read-only to prevent accidental edits or deletion

/**
 * Lock a session by id (marks it read-only).
 * @param {object[]} sessions
 * @param {string} id
 * @returns {object[]}
 */
function lockSession(sessions, id) {
  const session = sessions.find(s => s.id === id);
  if (!session) throw new Error(`Session not found: ${id}`);
  if (session.locked) return sessions; // already locked, no-op
  return sessions.map(s => s.id === id ? { ...s, locked: true } : s);
}

/**
 * Unlock a session by id.
 * @param {object[]} sessions
 * @param {string} id
 * @returns {object[]}
 */
function unlockSession(sessions, id) {
  const session = sessions.find(s => s.id === id);
  if (!session) throw new Error(`Session not found: ${id}`);
  if (!session.locked) return sessions; // already unlocked, no-op
  return sessions.map(s => s.id === id ? { ...s, locked: false } : s);
}

/**
 * Returns true if the session with given id is locked.
 * @param {object[]} sessions
 * @param {string} id
 * @returns {boolean}
 */
function isLocked(sessions, id) {
  const session = sessions.find(s => s.id === id);
  if (!session) throw new Error(`Session not found: ${id}`);
  return session.locked === true;
}

/**
 * Returns all locked sessions.
 * @param {object[]} sessions
 * @returns {object[]}
 */
function listLocked(sessions) {
  return sessions.filter(s => s.locked === true);
}

/**
 * Lock session by name (case-insensitive).
 * @param {object[]} sessions
 * @param {string} name
 * @returns {object[]}
 */
function lockSessionByName(sessions, name) {
  const session = sessions.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (!session) throw new Error(`Session not found: ${name}`);
  return lockSession(sessions, session.id);
}

module.exports = { lockSession, unlockSession, isLocked, listLocked, lockSessionByName };
