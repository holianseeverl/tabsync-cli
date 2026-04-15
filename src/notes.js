/**
 * notes.js
 * Attach, update, remove, and retrieve notes on sessions.
 */

/**
 * Add or update a note on a session.
 * @param {object} session
 * @param {string} note
 * @returns {object} updated session
 */
function setNote(session, note) {
  if (!session || typeof session !== 'object') {
    throw new Error('Invalid session');
  }
  if (typeof note !== 'string') {
    throw new Error('Note must be a string');
  }
  return { ...session, note: note.trim() };
}

/**
 * Remove the note from a session.
 * @param {object} session
 * @returns {object} updated session
 */
function removeNote(session) {
  if (!session || typeof session !== 'object') {
    throw new Error('Invalid session');
  }
  const updated = { ...session };
  delete updated.note;
  return updated;
}

/**
 * Get the note from a session, or null if none.
 * @param {object} session
 * @returns {string|null}
 */
function getNote(session) {
  if (!session || typeof session !== 'object') {
    throw new Error('Invalid session');
  }
  return session.note !== undefined ? session.note : null;
}

/**
 * Filter sessions that have a note containing the given keyword.
 * @param {object[]} sessions
 * @param {string} keyword
 * @returns {object[]}
 */
function filterByNote(sessions, keyword) {
  if (!Array.isArray(sessions)) {
    throw new Error('Sessions must be an array');
  }
  const lower = keyword.toLowerCase();
  return sessions.filter(
    (s) => typeof s.note === 'string' && s.note.toLowerCase().includes(lower)
  );
}

/**
 * Apply a note update to a session identified by name within a list.
 * @param {object[]} sessions
 * @param {string} name
 * @param {string} note
 * @returns {object[]}
 */
function setNoteByName(sessions, name, note) {
  if (!Array.isArray(sessions)) {
    throw new Error('Sessions must be an array');
  }
  const idx = sessions.findIndex((s) => s.name === name);
  if (idx === -1) {
    throw new Error(`Session "${name}" not found`);
  }
  const updated = [...sessions];
  updated[idx] = setNote(updated[idx], note);
  return updated;
}

module.exports = { setNote, removeNote, getNote, filterByNote, setNoteByName };
