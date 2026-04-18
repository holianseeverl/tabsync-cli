const { loadSessions, saveSessions } = require('../sessionStore');
const { setNoteByName, removeNote, getNote, filterByNote } = require('../notes');

async function handleSetNote(name, note, options = {}) {
  const sessions = await loadSessions(options.file);
  const updated = setNoteByName(sessions, name, note);
  const match = updated.find(s => s.name === name);
  if (!match) {
    console.error(`Session "${name}" not found.`);
    process.exit(1);
  }
  await saveSessions(updated, options.file);
  console.log(`Note set on session "${name}".`);
}

async function handleRemoveNote(name, options = {}) {
  const sessions = await loadSessions(options.file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.error(`Session "${name}" not found.`);
    process.exit(1);
  }
  if (!getNote(sessions[idx])) {
    console.log(`No note to remove for session "${name}".`);
    return;
  }
  const updated = [...sessions];
  updated[idx] = removeNote(sessions[idx]);
  await saveSessions(updated, options.file);
  console.log(`Note removed from session "${name}".`);
}

async function handleGetNote(name, options = {}) {
  const sessions = await loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session "${name}" not found.`);
    process.exit(1);
  }
  const note = getNote(session);
  if (note) {
    console.log(`Note for "${name}": ${note}`);
  } else {
    console.log(`No note set for "${name}".`);
  }
}

async function handleFilterByNote(keyword, options = {}) {
  if (!keyword || keyword.trim() === '') {
    console.error('A keyword is required to filter by note.');
    process.exit(1);
  }
  const sessions = await loadSessions(options.file);
  const results = filterByNote(sessions, keyword);
  if (results.length === 0) {
    console.log(`No sessions found with notes matching "${keyword}".`);
    return;
  }
  console.log(`Sessions matching "${keyword}" in notes:`);
  results.forEach(s => {
    console.log(`  - ${s.name}: ${s.note}`);
  });
}

module.exports = { handleSetNote, handleRemoveNote, handleGetNote, handleFilterByNote };
