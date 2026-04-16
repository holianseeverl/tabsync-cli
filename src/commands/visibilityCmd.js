const { hideSessionByName, unhideSession, listVisible, listHidden } = require('../visibility');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleHide(name, options = {}) {
  const sessions = loadSessions(options.file);
  const updated = hideSessionByName(sessions, name);
  if (updated === sessions) {
    console.log(`No session found with name: ${name}`);
    return;
  }
  saveSessions(updated, options.file);
  console.log(`Session "${name}" is now hidden.`);
}

function handleUnhide(name, options = {}) {
  const sessions = loadSessions(options.file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.log(`No session found with name: ${name}`);
    return;
  }
  const updated = sessions.map(s =>
    s.name === name ? unhideSession(s) : s
  );
  saveSessions(updated, options.file);
  console.log(`Session "${name}" is now visible.`);
}

function handleListVisible(options = {}) {
  const sessions = loadSessions(options.file);
  const visible = listVisible(sessions);
  if (visible.length === 0) {
    console.log('No visible sessions found.');
    return;
  }
  visible.forEach(s => console.log(`[${s.id}] ${s.name} (${s.tabs.length} tabs)`));
}

function handleListHidden(options = {}) {
  const sessions = loadSessions(options.file);
  const hidden = listHidden(sessions);
  if (hidden.length === 0) {
    console.log('No hidden sessions found.');
    return;
  }
  hidden.forEach(s => console.log(`[${s.id}] ${s.name} (${s.tabs.length} tabs)`));
}

function registerVisibilityCmd(program) {
  const vis = program.command('visibility').description('Manage session visibility');

  vis
    .command('hide <name>')
    .description('Hide a session by name')
    .option('-f, --file <path>', 'sessions file path')
    .action((name, opts) => handleHide(name, opts));

  vis
    .command('unhide <name>')
    .description('Unhide a session by name')
    .option('-f, --file <path>', 'sessions file path')
    .action((name, opts) => handleUnhide(name, opts));

  vis
    .command('list-visible')
    .description('List all visible sessions')
    .option('-f, --file <path>', 'sessions file path')
    .action(opts => handleListVisible(opts));

  vis
    .command('list-hidden')
    .description('List all hidden sessions')
    .option('-f, --file <path>', 'sessions file path')
    .action(opts => handleListHidden(opts));
}

module.exports = {
  handleHide,
  handleUnhide,
  handleListVisible,
  handleListHidden,
  registerVisibilityCmd
};
