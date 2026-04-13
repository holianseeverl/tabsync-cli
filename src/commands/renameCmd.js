const { renameSession, renameSessionByName } = require('../rename');
const sessionStore = require('../sessionStore');

/**
 * handleRename - renames a session by id or by name
 * @param {object} options
 * @param {string} options.id - session id (or old name if byName is true)
 * @param {string} options.name - new name for the session
 * @param {boolean} [options.byName] - if true, match by session name instead of id
 */
function handleRename(options) {
  const { id, name: newName, byName = false } = options;

  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    console.error('Error: new name must be a non-empty string.');
    return;
  }

  const sessions = sessionStore.loadSessions();

  try {
    let updated;
    if (byName) {
      updated = renameSessionByName(sessions, id, newName.trim());
    } else {
      updated = renameSession(sessions, id, newName.trim());
    }

    const wasChanged = JSON.stringify(updated) !== JSON.stringify(sessions);
    if (!wasChanged) {
      console.error(`Error: no session found with ${byName ? 'name' : 'id'} "${id}".`);
      return;
    }

    sessionStore.saveSessions(updated);
    console.log(`Session renamed to "${newName.trim()}" successfully.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

module.exports = { handleRename };
