const { loadSessions, saveSessions } = require('../sessionStore');
const { archiveSession, unarchiveSession, listArchived, listActive, purgeArchived } = require('../archive');

function handleArchive(sessionId, options = {}) {
  const sessions = loadSessions();
  const updated = archiveSession(sessions, sessionId);
  saveSessions(updated);
  console.log(`Session "${sessionId}" archived.`);
}

function handleUnarchive(sessionId, options = {}) {
  const sessions = loadSessions();
  const updated = unarchiveSession(sessions, sessionId);
  saveSessions(updated);
  console.log(`Session "${sessionId}" restored from archive.`);
}

function handleListArchived(options = {}) {
  const sessions = loadSessions();
  const archived = listArchived(sessions);
  if (archived.length === 0) {
    console.log('No archived sessions.');
    return;
  }
  archived.forEach(s => {
    console.log(`[${s.id}] ${s.name} — archived at ${s.archivedAt}`);
  });
}

function handleListActive(options = {}) {
  const sessions = loadSessions();
  const active = listActive(sessions);
  if (active.length === 0) {
    console.log('No active sessions.');
    return;
  }
  active.forEach(s => {
    console.log(`[${s.id}] ${s.name}`);
  });
}

function handlePurge(options = {}) {
  const sessions = loadSessions();
  const before = sessions.length;
  const updated = purgeArchived(sessions);
  saveSessions(updated);
  const removed = before - updated.length;
  console.log(`Purged ${removed} archived session(s).`);
}

module.exports = { handleArchive, handleUnarchive, handleListArchived, handleListActive, handlePurge };
