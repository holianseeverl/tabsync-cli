// pinCmd.js — CLI handlers for pin/unpin commands

const { loadSessions, saveSessions } = require('../sessionStore');
const { pinSession, unpinSession, listPinned } = require('../pin');

async function handlePin(sessionId, options = {}) {
  const sessions = await loadSessions(options.file);
  let updated;
  try {
    updated = pinSession(sessions, sessionId);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  await saveSessions(updated, options.file);
  console.log(`Pinned session: ${sessionId}`);
}

async function handleUnpin(sessionId, options = {}) {
  const sessions = await loadSessions(options.file);
  let updated;
  try {
    updated = unpinSession(sessions, sessionId);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  await saveSessions(updated, options.file);
  console.log(`Unpinned session: ${sessionId}`);
}

async function handleListPinned(options = {}) {
  const sessions = await loadSessions(options.file);
  const pinned = listPinned(sessions);
  if (pinned.length === 0) {
    console.log('No pinned sessions.');
    return;
  }
  pinned.forEach(s => {
    const tabCount = Array.isArray(s.tabs) ? s.tabs.length : 0;
    console.log(`[pinned] ${s.id} — ${s.name} (${tabCount} tab${tabCount !== 1 ? 's' : ''})`);
  });
}

module.exports = { handlePin, handleUnpin, handleListPinned };
