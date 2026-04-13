/**
 * renameSession - rename a session by its id
 * @param {object[]} sessions
 * @param {string} id
 * @param {string} newName
 * @returns {object[]}
 */
function renameSession(sessions, id, newName) {
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('newName must be a non-empty string');
  }
  return sessions.map(session =>
    session.id === id
      ? { ...session, name: newName.trim() }
      : session
  );
}

/**
 * renameSessionByName - rename the first session matching oldName
 * @param {object[]} sessions
 * @param {string} oldName
 * @param {string} newName
 * @returns {object[]}
 */
function renameSessionByName(sessions, oldName, newName) {
  if (!oldName || typeof oldName !== 'string' || oldName.trim() === '') {
    throw new Error('oldName must be a non-empty string');
  }
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('newName must be a non-empty string');
  }
  let renamed = false;
  return sessions.map(session => {
    if (!renamed && session.name === oldName.trim()) {
      renamed = true;
      return { ...session, name: newName.trim() };
    }
    return session;
  });
}

module.exports = { renameSession, renameSessionByName };
