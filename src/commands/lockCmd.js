// lockCmd.js — CLI handlers for lock/unlock session commands

const { loadSessions, saveSessions } = require('../sessionStore');
const { lockSession, unlockSession, listLocked, lockSessionByName } = require('../lock');

async function handleLock(id, { byName } = {}) {
  let sessions = await loadSessions();
  try {
    if (byName) {
      sessions = lockSessionByName(sessions, id);
      console.log(`Session "${id}" locked.`);
    } else {
      sessions = lockSession(sessions, id);
      console.log(`Session ${id} locked.`);
    }
    await saveSessions(sessions);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

async function handleUnlock(id) {
  let sessions = await loadSessions();
  try {
    sessions = unlockSession(sessions, id);
    await saveSessions(sessions);
    console.log(`Session ${id} unlocked.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

async function handleListLocked() {
  const sessions = await loadSessions();
  const locked = listLocked(sessions);
  if (locked.length === 0) {
    console.log('No locked sessions.');
    return;
  }
  locked.forEach(s => {
    const tabCount = Array.isArray(s.tabs) ? s.tabs.length : 0;
    console.log(`[LOCKED] ${s.id} — ${s.name} (${tabCount} tab${tabCount !== 1 ? 's' : ''})`);
  });
}

module.exports = { handleLock, handleUnlock, handleListLocked };
