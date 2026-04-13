// renameCmd.js - CLI command handler for renaming sessions

const { loadSessions, saveSessions } = require('../sessionStore');
const { renameSession, renameSessionByName } = require('../rename');

/**
 * Handle the rename command
 * @param {object} argv - parsed CLI args
 *   --id or --name to identify the session
 *   --to for the new name
 *   --file optional path to sessions file
 */
async function handleRename(argv) {
  const { id, name, to: newName, file } = argv;

  if (!newName || newName.trim() === '') {
    console.error('Error: --to <new name> is required');
    process.exit(1);
  }

  if (!id && !name) {
    console.error('Error: provide --id or --name to identify the session');
    process.exit(1);
  }

  let sessions;
  try {
    sessions = await loadSessions(file);
  } catch (err) {
    console.error(`Error loading sessions: ${err.message}`);
    process.exit(1);
  }

  let updated;
  try {
    if (id) {
      updated = renameSession(sessions, id, newName);
    } else {
      updated = renameSessionByName(sessions, name, newName);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  try {
    await saveSessions(updated, file);
    const identifier = id ? `id "${id}"` : `name "${name}"`;
    console.log(`Session with ${identifier} renamed to "${newName.trim()}".`);
  } catch (err) {
    console.error(`Error saving sessions: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { handleRename };
