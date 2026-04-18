const {
  addRevision,
  getRevisions,
  findRevision,
  restoreRevision,
  removeRevision,
  clearRevisions,
} = require('../revision');

function handleAddRevision(sessions, sessionName, label) {
  const s = sessions.find(s => s.name === sessionName);
  if (!s) return { error: `Session "${sessionName}" not found` };
  if (findRevision(s, label)) return { error: `Revision "${label}" already exists` };
  addRevision(s, label);
  return { success: true, message: `Revision "${label}" saved for "${sessionName}"` };
}

function handleRestoreRevision(sessions, sessionName, label) {
  const idx = sessions.findIndex(s => s.name === sessionName);
  if (idx === -1) return { error: `Session "${sessionName}" not found`, sessions };
  const restored = restoreRevision(sessions[idx], label);
  if (!restored) return { error: `Revision "${label}" not found`, sessions };
  sessions[idx] = restored;
  return { success: true, sessions, message: `Restored "${sessionName}" to revision "${label}"` };
}

function handleListRevisions(sessions, sessionName) {
  const s = sessions.find(s => s.name === sessionName);
  if (!s) return { error: `Session "${sessionName}" not found` };
  const revs = getRevisions(s);
  if (!revs.length) return { message: `No revisions for "${sessionName}"` };
  return { revisions: revs.map(r => ({ label: r.label, createdAt: r.createdAt })) };
}

function handleRemoveRevision(sessions, sessionName, label) {
  const s = sessions.find(s => s.name === sessionName);
  if (!s) return { error: `Session "${sessionName}" not found` };
  removeRevision(s, label);
  return { success: true, message: `Revision "${label}" removed from "${sessionName}"` };
}

function handleClearRevisions(sessions, sessionName) {
  const s = sessions.find(s => s.name === sessionName);
  if (!s) return { error: `Session "${sessionName}" not found` };
  clearRevisions(s);
  return { success: true, message: `All revisions cleared for "${sessionName}"` };
}

function registerRevisionCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('revision').description('Manage session revisions');

  cmd.command('save <session> <label>').action(async (session, label) => {
    const sessions = await loadSessions();
    const result = handleAddRevision(sessions, session, label);
    if (result.error) return console.error(result.error);
    await saveSessions(sessions);
    console.log(result.message);
  });

  cmd.command('restore <session> <label>').action(async (session, label) => {
    const sessions = await loadSessions();
    const result = handleRestoreRevision(sessions, session, label);
    if (result.error) return console.error(result.error);
    await saveSessions(result.sessions);
    console.log(result.message);
  });

  cmd.command('list <session>').action(async (session) => {
    const sessions = await loadSessions();
    const result = handleListRevisions(sessions, session);
    if (result.error) return console.error(result.error);
    if (result.message) return console.log(result.message);
    result.revisions.forEach(r => console.log(`  ${r.label}  (${r.createdAt})`));
  });

  cmd.command('remove <session> <label>').action(async (session, label) => {
    const sessions = await loadSessions();
    const result = handleRemoveRevision(sessions, session, label);
    if (result.error) return console.error(result.error);
    await saveSessions(sessions);
    console.log(result.message);
  });
}

module.exports = {
  handleAddRevision,
  handleRestoreRevision,
  handleListRevisions,
  handleRemoveRevision,
  handleClearRevisions,
  registerRevisionCmd,
};
