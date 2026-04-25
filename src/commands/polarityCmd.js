const {
  isValidPolarity,
  setPolarityByName,
  getPolarity,
  filterByPolarity,
  sortByPolarity,
  clearPolarity,
  VALID_POLARITIES,
} = require('../polarity');

function handleSetPolarity(sessions, name, polarity) {
  if (!name) throw new Error('Session name is required');
  if (!isValidPolarity(polarity)) {
    throw new Error(`Invalid polarity "${polarity}". Valid: ${VALID_POLARITIES.join(', ')}`);
  }
  const updated = setPolarityByName(sessions, name, polarity);
  const changed = updated.find(s => s.name === name);
  if (!changed) throw new Error(`Session "${name}" not found`);
  console.log(`Set polarity of "${name}" to ${polarity}`);
  return updated;
}

function handleClearPolarity(sessions, name) {
  if (!name) throw new Error('Session name is required');
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) throw new Error(`Session "${name}" not found`);
  const updated = sessions.map(s => s.name === name ? clearPolarity(s) : s);
  console.log(`Cleared polarity from "${name}"`);
  return updated;
}

function handleShowPolarity(sessions, name) {
  if (!name) throw new Error('Session name is required');
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  const polarity = getPolarity(session);
  if (polarity) {
    console.log(`${name}: ${polarity}`);
  } else {
    console.log(`${name}: (no polarity set)`);
  }
  return polarity;
}

function handleFilterByPolarity(sessions, polarity) {
  if (!isValidPolarity(polarity)) {
    throw new Error(`Invalid polarity "${polarity}". Valid: ${VALID_POLARITIES.join(', ')}`);
  }
  const results = filterByPolarity(sessions, polarity);
  if (results.length === 0) {
    console.log(`No sessions with polarity "${polarity}"`);
  } else {
    results.forEach(s => console.log(`  ${s.name} [${s.polarity}]`));
  }
  return results;
}

function handleSortByPolarity(sessions) {
  const sorted = sortByPolarity(sessions);
  sorted.forEach(s => console.log(`  ${s.name} [${s.polarity || 'none'}]`));
  return sorted;
}

function registerPolarityCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('polarity').description('Manage session polarity');

  cmd.command('set <name> <polarity>')
    .description(`Set polarity (${VALID_POLARITIES.join('|')})`)
    .action((name, polarity) => {
      const sessions = loadSessions();
      const updated = handleSetPolarity(sessions, name, polarity);
      saveSessions(updated);
    });

  cmd.command('clear <name>')
    .description('Clear polarity from a session')
    .action(name => {
      const sessions = loadSessions();
      const updated = handleClearPolarity(sessions, name);
      saveSessions(updated);
    });

  cmd.command('show <name>')
    .description('Show polarity of a session')
    .action(name => {
      handleShowPolarity(loadSessions(), name);
    });

  cmd.command('filter <polarity>')
    .description('Filter sessions by polarity')
    .action(polarity => {
      handleFilterByPolarity(loadSessions(), polarity);
    });

  cmd.command('sort')
    .description('Sort sessions by polarity')
    .action(() => {
      handleSortByPolarity(loadSessions());
    });
}

module.exports = {
  handleSetPolarity,
  handleClearPolarity,
  handleShowPolarity,
  handleFilterByPolarity,
  handleSortByPolarity,
  registerPolarityCmd,
};
