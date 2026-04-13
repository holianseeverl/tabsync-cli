/**
 * rename.js — utilities for renaming sessions
 */

/**
 * Rename a session by its ID.
 * @param {Array} sessions - array of session objects
 * @param {string} sessionId - the id of the session to rename
 * @param {string} newName - the new name to assign
 * @returns {{ sessions: Array, renamed: boolean }}
 */
function renameSession(sessions, sessionId, newName) {
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('New name must be a non-empty string');
  }

  let renamed = false;
  const updated = sessions.map((session) => {
    if (session.id === sessionId) {
      renamed = true;
      return { ...session, name: newName.trim(), updatedAt: new Date().toISOString() };
    }
    return session;
  });

  return { sessions: updated, renamed };
}

/**
 * Rename a session by its current name (first match).
 * @param {Array} sessions
 * @param {string} currentName
 * @param {string} newName
 * @returns {{ sessions: Array, renamed: boolean }}
 */
function renameSessionByName(sessions, currentName, newName) {
  if (!currentName || typeof currentName !== 'string') {
    throw new Error('Current name must be a non-empty string');
  }
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('New name must be a non-empty string');
  }

  let renamed = false;
  const updated = sessions.map((session) => {
    if (!renamed && session.name === currentName.trim()) {
      renamed = true;
      return { ...session, name: newName.trim(), updatedAt: new Date().toISOString() };
    }
    return session;
  });

  return { sessions: updated, renamed };
}

module.exports = { renameSession, renameSessionByName };
