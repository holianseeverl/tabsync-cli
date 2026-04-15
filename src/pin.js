// pin.js — pin/unpin sessions for quick access

/**
 * Pin a session by id
 * @param {Array} sessions
 * @param {string} sessionId
 * @returns {Array} updated sessions
 */
function pinSession(sessions, sessionId) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error(`Session not found: ${sessionId}`);
  return sessions.map(s =>
    s.id === sessionId ? { ...s, pinned: true } : s
  );
}

/**
 * Unpin a session by id
 * @param {Array} sessions
 * @param {string} sessionId
 * @returns {Array} updated sessions
 */
function unpinSession(sessions, sessionId) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error(`Session not found: ${sessionId}`);
  return sessions.map(s =>
    s.id === sessionId ? { ...s, pinned: false } : s
  );
}

/**
 * List all pinned sessions
 * @param {Array} sessions
 * @returns {Array} pinned sessions
 */
function listPinned(sessions) {
  return sessions.filter(s => s.pinned === true);
}

/**
 * Check if a session is pinned
 * @param {object} session
 * @returns {boolean}
 */
function isPinned(session) {
  return session.pinned === true;
}

module.exports = { pinSession, unpinSession, listPinned, isPinned };
