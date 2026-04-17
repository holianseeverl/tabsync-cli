// lifecycleCmd.js — CLI commands for session lifecycle tracking

const { logEventByName, getLifecycle, clearLifecycle, filterByEvent, VALID_EVENTS } = require('../lifecycle');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleLogEvent(name, event, options = {}) {
  const sessions = loadSessions(options.file);
  try {
    logEventByName(sessions, name, event);
  } catch (e) {
    console.error(e.message);
    return;
  }
  saveSessions(sessions, options.file);
  console.log(`Logged event "${event}" for session "${name}".`);
}

function handleShowLifecycle(name, options = {}) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session not found: ${name}`); return; }
  const lc = getLifecycle(session);
  if (!lc.length) { console.log(`No lifecycle events for "${name}".`); return; }
  console.log(`Lifecycle for "${name}":`);
  lc.forEach(e => console.log(`  [${e.timestamp}] ${e.event}`));
}

function handleClearLifecycle(name, options = {}) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session not found: ${name}`); return; }
  clearLifecycle(session);
  saveSessions(sessions, options.file);
  console.log(`Cleared lifecycle for "${name}".`);
}

function handleFilterByEvent(event, options = {}) {
  const sessions = loadSessions(options.file);
  const results = filterByEvent(sessions, event);
  if (!results.length) { console.log(`No sessions with event "${event}".`); return; }
  results.forEach(s => console.log(`  ${s.name}`));
}

function registerLifecycleCmd(program, options = {}) {
  const lc = program.command('lifecycle').description('Manage session lifecycle events');

  lc.command('log <name> <event>')
    .description(`Log a lifecycle event (${VALID_EVENTS.join(', ')})`)
    .action((name, event) => handleLogEvent(name, event, options));

  lc.command('show <name>')
    .description('Show lifecycle history for a session')
    .action(name => handleShowLifecycle(name, options));

  lc.command('clear <name>')
    .description('Clear lifecycle history for a session')
    .action(name => handleClearLifecycle(name, options));

  lc.command('filter <event>')
    .description('List sessions that have a given lifecycle event')
    .action(event => handleFilterByEvent(event, options));
}

module.exports = { handleLogEvent, handleShowLifecycle, handleClearLifecycle, handleFilterByEvent, registerLifecycleCmd };
