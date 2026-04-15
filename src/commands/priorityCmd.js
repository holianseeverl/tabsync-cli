const {
  setPriority,
  clearPriority,
  setPriorityByName,
  filterByPriority,
  sortByPriority,
  getSessionPriority,
  VALID_PRIORITIES
} = require('../priority');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetPriority(name, priority, options = {}) {
  const sessions = loadSessions(options.file);
  let updated;
  try {
    updated = setPriorityByName(sessions, name, priority);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  const changed = updated.find(s => s.name === name);
  if (!changed) {
    console.error(`Session not found: ${name}`);
    process.exit(1);
  }
  saveSessions(updated, options.file);
  console.log(`Set priority of "${name}" to ${priority}`);
}

function handleClearPriority(name, options = {}) {
  const sessions = loadSessions(options.file);
  const target = sessions.find(s => s.name === name);
  if (!target) {
    console.error(`Session not found: ${name}`);
    process.exit(1);
  }
  const updated = clearPriority(sessions, target.id);
  saveSessions(updated, options.file);
  console.log(`Cleared priority for "${name}"`);
}

function handleFilterByPriority(priority, options = {}) {
  const sessions = loadSessions(options.file);
  let results;
  try {
    results = filterByPriority(sessions, priority);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (results.length === 0) {
    console.log(`No sessions with priority: ${priority}`);
    return;
  }
  results.forEach(s => console.log(`[${s.priority}] ${s.name} (${s.tabs.length} tabs)`));
}

function handleSortByPriority(options = {}) {
  const sessions = loadSessions(options.file);
  const sorted = sortByPriority(sessions);
  sorted.forEach(s => {
    const p = getSessionPriority(s) || 'none';
    console.log(`[${p}] ${s.name} (${s.tabs.length} tabs)`);
  });
}

function registerPriorityCmd(program) {
  const cmd = program.command('priority').description('Manage session priorities');

  cmd
    .command('set <name> <priority>')
    .description(`Set priority (${VALID_PRIORITIES.join(', ')})`)
    .option('-f, --file <path>', 'sessions file')
    .action((name, priority, opts) => handleSetPriority(name, priority, opts));

  cmd
    .command('clear <name>')
    .description('Clear priority from a session')
    .option('-f, --file <path>', 'sessions file')
    .action((name, opts) => handleClearPriority(name, opts));

  cmd
    .command('filter <priority>')
    .description('List sessions with a given priority')
    .option('-f, --file <path>', 'sessions file')
    .action((priority, opts) => handleFilterByPriority(priority, opts));

  cmd
    .command('sort')
    .description('List all sessions sorted by priority')
    .option('-f, --file <path>', 'sessions file')
    .action(opts => handleSortByPriority(opts));
}

module.exports = {
  handleSetPriority,
  handleClearPriority,
  handleFilterByPriority,
  handleSortByPriority,
  registerPriorityCmd
};
