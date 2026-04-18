const {
  isValidEffort,
  setEffortByName,
  getEffort,
  sortByEffort,
  filterByEffort,
  filterByMinEffort,
  VALID_EFFORTS
} = require('../effort');

function handleSetEffort(sessions, name, effort) {
  if (!isValidEffort(effort)) {
    console.error(`Invalid effort. Valid values: ${VALID_EFFORTS.join(', ')}`);
    return sessions;
  }
  const updated = setEffortByName(sessions, name, effort);
  console.log(`Set effort of "${name}" to "${effort}"`);
  return updated;
}

function handleClearEffort(sessions, name) {
  const updated = sessions.map(s => {
    if (s.name !== name) return s;
    const copy = { ...s };
    delete copy.effort;
    return copy;
  });
  console.log(`Cleared effort for "${name}"`);
  return updated;
}

function handleShowEffort(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found`); return; }
  const e = getEffort(session);
  console.log(e ? `Effort for "${name}": ${e}` : `No effort set for "${name}"`);
}

function handleFilterByEffort(sessions, effort) {
  const results = filterByEffort(sessions, effort);
  if (!results.length) { console.log('No sessions found.'); return results; }
  results.forEach(s => console.log(`  ${s.name} [${s.effort}]`));
  return results;
}

function handleFilterByMinEffort(sessions, minEffort) {
  const results = filterByMinEffort(sessions, minEffort);
  if (!results.length) { console.log('No sessions found.'); return results; }
  results.forEach(s => console.log(`  ${s.name} [${s.effort}]`));
  return results;
}

function handleSortByEffort(sessions, asc = true) {
  const sorted = sortByEffort(sessions, asc);
  sorted.forEach(s => console.log(`  ${s.name} [${s.effort || 'none'}]`));
  return sorted;
}

function registerEffortCmd(program, loadSessions, saveSessions) {
  const cmd = program.command('effort').description('Manage session effort levels');

  cmd.command('set <name> <effort>').action(async (name, effort) => {
    const sessions = await loadSessions();
    await saveSessions(handleSetEffort(sessions, name, effort));
  });

  cmd.command('clear <name>').action(async (name) => {
    const sessions = await loadSessions();
    await saveSessions(handleClearEffort(sessions, name));
  });

  cmd.command('show <name>').action(async (name) => {
    handleShowEffort(await loadSessions(), name);
  });

  cmd.command('filter <effort>').action(async (effort) => {
    handleFilterByEffort(await loadSessions(), effort);
  });

  cmd.command('min <effort>').action(async (effort) => {
    handleFilterByMinEffort(await loadSessions(), effort);
  });

  cmd.command('sort').option('--desc', 'Sort descending').action(async (opts) => {
    handleSortByEffort(await loadSessions(), !opts.desc);
  });
}

module.exports = { handleSetEffort, handleClearEffort, handleShowEffort, handleFilterByEffort, handleFilterByMinEffort, handleSortByEffort, registerEffortCmd };
