const {
  isValidStatus,
  setStatusByName,
  clearStatus,
  filterByStatus,
  getStatus,
  listByStatus,
  VALID_STATUSES
} = require('../status');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetStatus(name, status, options = {}) {
  if (!isValidStatus(status)) {
    console.error(`Invalid status "${status}". Valid options: ${VALID_STATUSES.join(', ')}`);
    return;
  }
  const sessions = loadSessions(options.file);
  const updated = setStatusByName(sessions, name, status);
  saveSessions(updated, options.file);
  console.log(`Status of "${name}" set to "${status}".`);
}

function handleClearStatus(id, options = {}) {
  const sessions = loadSessions(options.file);
  const updated = clearStatus(sessions, id);
  saveSessions(updated, options.file);
  console.log(`Status cleared for session id "${id}".`);
}

function handleFilterByStatus(status, options = {}) {
  if (!isValidStatus(status)) {
    console.error(`Invalid status "${status}". Valid options: ${VALID_STATUSES.join(', ')}`);
    return;
  }
  const sessions = loadSessions(options.file);
  const results = filterByStatus(sessions, status);
  if (results.length === 0) {
    console.log(`No sessions with status "${status}".`);
    return;
  }
  results.forEach(s => console.log(`[${s.status}] ${s.name} (${(s.tabs || []).length} tabs)`));
}

function handleShowStatus(name, options = {}) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session "${name}" not found.`);
    return;
  }
  const status = getStatus(sessions, session.id);
  console.log(status ? `Status: ${status}` : `No status set for "${name}".`);
}

function handleListByStatus(options = {}) {
  const sessions = loadSessions(options.file);
  const grouped = listByStatus(sessions);
  for (const [key, group] of Object.entries(grouped)) {
    console.log(`\n[${key}]`);
    group.forEach(s => console.log(`  - ${s.name}`));
  }
}

function registerStatusCmd(program) {
  const cmd = program.command('status').description('Manage session statuses');

  cmd.command('set <name> <status>')
    .description(`Set status (${VALID_STATUSES.join(', ')})`)
    .action((name, status) => handleSetStatus(name, status));

  cmd.command('clear <id>')
    .description('Clear status from a session by id')
    .action(id => handleClearStatus(id));

  cmd.command('filter <status>')
    .description('List sessions with a given status')
    .action(status => handleFilterByStatus(status));

  cmd.command('show <name>')
    .description('Show status of a session')
    .action(name => handleShowStatus(name));

  cmd.command('list')
    .description('List all sessions grouped by status')
    .action(() => handleListByStatus());
}

module.exports = {
  handleSetStatus,
  handleClearStatus,
  handleFilterByStatus,
  handleShowStatus,
  handleListByStatus,
  registerStatusCmd
};
