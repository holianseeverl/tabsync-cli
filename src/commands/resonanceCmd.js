const {
  isValidResonance,
  setResonanceByName,
  clearResonance,
  getResonance,
  filterByResonance,
  sortByResonance,
} = require('../resonance');

function handleSetResonance(sessions, name, level, { save, log }) {
  if (!isValidResonance(level)) {
    log(`Invalid resonance level "${level}". Valid: high, medium, low, none`);
    return sessions;
  }
  const updated = setResonanceByName(sessions, name, level);
  save(updated);
  log(`Set resonance of "${name}" to "${level}"`);
  return updated;
}

function handleClearResonance(sessions, name, { save, log }) {
  const updated = sessions.map(s =>
    s.name === name ? clearResonance(s) : s
  );
  save(updated);
  log(`Cleared resonance for "${name}"`);
  return updated;
}

function handleShowResonance(sessions, name, { log }) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    log(`Session "${name}" not found`);
    return;
  }
  const val = getResonance(session);
  log(val ? `Resonance of "${name}": ${val}` : `No resonance set for "${name}"`);
}

function handleFilterByResonance(sessions, level, { log }) {
  if (!isValidResonance(level)) {
    log(`Invalid resonance level "${level}"`);
    return;
  }
  const results = filterByResonance(sessions, level);
  if (!results.length) {
    log(`No sessions with resonance "${level}"`);
    return;
  }
  results.forEach(s => log(`  ${s.name} [${s.resonance}]`));
}

function handleSortByResonance(sessions, { log }) {
  const sorted = sortByResonance(sessions);
  sorted.forEach(s => log(`  ${s.name} — ${s.resonance || 'none'}`))
  return sorted;
}

function registerResonanceCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('resonance').description('Manage session resonance levels');

  cmd.command('set <name> <level>')
    .description('Set resonance level for a session')
    .action((name, level) => {
      const sessions = loadSessions();
      handleSetResonance(sessions, name, level, { save: saveSessions, log: console.log });
    });

  cmd.command('clear <name>')
    .description('Clear resonance for a session')
    .action((name) => {
      const sessions = loadSessions();
      handleClearResonance(sessions, name, { save: saveSessions, log: console.log });
    });

  cmd.command('show <name>')
    .description('Show resonance for a session')
    .action((name) => {
      const sessions = loadSessions();
      handleShowResonance(sessions, name, { log: console.log });
    });

  cmd.command('filter <level>')
    .description('Filter sessions by resonance level')
    .action((level) => {
      const sessions = loadSessions();
      handleFilterByResonance(sessions, level, { log: console.log });
    });

  cmd.command('sort')
    .description('Sort sessions by resonance')
    .action(() => {
      const sessions = loadSessions();
      handleSortByResonance(sessions, { log: console.log });
    });
}

module.exports = {
  handleSetResonance,
  handleClearResonance,
  handleShowResonance,
  handleFilterByResonance,
  handleSortByResonance,
  registerResonanceCmd,
};
