// accessCmd.js — CLI command handlers for session access control

const { loadSessions, saveSessions } = require('../sessionStore');
const {
  setAccess,
  clearAccess,
  setAccessByName,
  getAccess,
  filterByAccess,
  listReadOnly,
  isValidAccessLevel,
} = require('../access');

function handleSetAccess(name, level, options = {}) {
  const sessions = loadSessions(options.file);
  try {
    const updated = setAccessByName(sessions, name, level);
    saveSessions(updated, options.file);
    console.log(`Access level for "${name}" set to "${level}".`);
  } catch (e) {
    console.error(e.message);
  }
}

function handleClearAccess(name, options = {}) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: "${name}"`);
    return;
  }
  const updated = clearAccess(sessions, session.id);
  saveSessions(updated, options.file);
  console.log(`Access cleared for "${name}" (defaults to write).`);
}

function handleShowAccess(name, options = {}) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: "${name}"`);
    return;
  }
  console.log(`Access level for "${name}": ${getAccess(session)}`);
}

function handleFilterByAccess(level, options = {}) {
  if (!isValidAccessLevel(level)) {
    console.error(`Invalid access level: "${level}"`);
    return;
  }
  const sessions = loadSessions(options.file);
  const results = filterByAccess(sessions, level);
  if (results.length === 0) {
    console.log(`No sessions with access level "${level}".`);
    return;
  }
  results.forEach(s => console.log(`- ${s.name} [${getAccess(s)}]`));
}

function handleListReadOnly(options = {}) {
  const sessions = loadSessions(options.file);
  const results = listReadOnly(sessions);
  if (results.length === 0) {
    console.log('No read-only sessions.');
    return;
  }
  results.forEach(s => console.log(`- ${s.name}`));
}

function registerAccessCmd(program) {
  const access = program.command('access').description('Manage session access levels');

  access
    .command('set <name> <level>')
    .description('Set access level (read, write, none) for a session')
    .action((name, level) => handleSetAccess(name, level));

  access
    .command('clear <name>')
    .description('Clear access level for a session')
    .action(name => handleClearAccess(name));

  access
    .command('show <name>')
    .description('Show access level for a session')
    .action(name => handleShowAccess(name));

  access
    .command('filter <level>')
    .description('List sessions by access level')
    .action(level => handleFilterByAccess(level));

  access
    .command('readonly')
    .description('List all read-only sessions')
    .action(() => handleListReadOnly());
}

module.exports = {
  handleSetAccess,
  handleClearAccess,
  handleShowAccess,
  handleFilterByAccess,
  handleListReadOnly,
  registerAccessCmd,
};
