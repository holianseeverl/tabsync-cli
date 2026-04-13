// rename.js - rename sessions by id or name

/**
 * Rename a session by its id
 * @param {object[]} sessions
 * @param {string} id
 * @param {string} newName
 * @returns {object[]}
 */
function renameSession(sessions, id, newName) {
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('New name must be a non-empty string');
  }
  const idx = sessions.findIndex(s => s.id === id);
  if (idx === -1) {
    throw new Error(`Session with id "${id}" not found`);
  }
  const updated = sessions.map((s, i) =>
    i === idx ? { ...s, name: newName.trim() } : s
  );
  return updated;
}

/**
 * Rename a session by its current name (renames first match)
 * @param {object[]} sessions
 * @param {string} currentName
 * @param {string} newName
 * @returns {object[]}
 */
function renameSessionByName(sessions, currentName, newName) {
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('New name must be a non-empty string');
  }
  const idx = sessions.findIndex(
    s => s.name && s.name.toLowerCase() === currentName.toLowerCase()
  );
  if (idx === -1) {
    throw new Error(`Session with name "${currentName}" not found`);
  }
  const updated = sessions.map((s, i) =>
    i === idx ? { ...s, name: newName.trim() } : s
  );
  return updated;
}

module.exports = { renameSession, renameSessionByName };
