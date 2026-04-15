const { lockSession, unlockSession, listLocked, lockSessionByName } = require('../lock');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleLock(name) {
  const sessions = loadSessions();
  const updated = lockSessionByName(sessions, name);
  if (!updated) {
    console.error(`Session "${name}" not found.`);
    return;
  }
  saveSessions(updated);
  console.log(`Session "${name}" has been locked.`);
}

function handleUnlock(id) {
  const sessions = loadSessions();
  const updated = unlockSession(sessions, id);
  if (!updated) {
    console.error(`Session with id "${id}" not found.`);
    return;
  }
  saveSessions(updated);
  console.log(`Session "${id}" has been unlocked.`);
}

function handleListLocked() {
  const sessions = loadSessions();
  const locked = listLocked(sessions);
  if (locked.length === 0) {
    console.log('No locked sessions found.');
    return;
  }
  console.log(`Locked sessions (${locked.length}):`);
  locked.forEach(s => {
    console.log(`  [${s.id}] ${s.name} — ${s.tabs.length} tab(s)`);
  });
}

module.exports = { handleLock, handleUnlock, handleListLocked };
