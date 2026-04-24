const {
  setTensionByName,
  clearTension,
  getTension,
  filterByTension,
  sortByTension,
  VALID_TENSIONS
} = require('../tension');

function handleSetTension(sessions, name, tension) {
  try {
    const updated = setTensionByName(sessions, name, tension);
    const changed = updated.find(s => s.name === name);
    if (!changed) {
      console.log(`Session "${name}" not found.`);
      return sessions;
    }
    console.log(`Tension for "${name}" set to "${tension}".`);
    return updated;
  } catch (err) {
    console.error(err.message);
    return sessions;
  }
}

function handleClearTension(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  const updated = [...sessions];
  updated[idx] = clearTension(sessions[idx]);
  console.log(`Tension cleared for "${name}".`);
  return updated;
}

function handleShowTension(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const tension = getTension(session);
  console.log(tension ? `Tension: ${tension}` : `No tension set for "${name}".`);
}

function handleFilterByTension(sessions, tension) {
  try {
    const results = filterByTension(sessions, tension);
    if (results.length === 0) {
      console.log(`No sessions with tension "${tension}".`);
    } else {
      results.forEach(s => console.log(`- ${s.name} [${s.tension}]`));
    }
    return results;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

function handleSortByTension(sessions, direction = 'asc') {
  const sorted = sortByTension(sessions, direction);
  sorted.forEach(s => console.log(`- ${s.name}: ${s.tension || 'none'}`));
  return sorted;
}

function registerTensionCmd(program, sessions, saveSessions) {
  const tension = program.command('tension').description('Manage session tension levels');

  tension
    .command('set <name> <level>')
    .description(`Set tension level (${VALID_TENSIONS.join(', ')})`)
    .action((name, level) => saveSessions(handleSetTension(sessions(), name, level)));

  tension
    .command('clear <name>')
    .description('Clear tension from a session')
    .action(name => saveSessions(handleClearTension(sessions(), name)));

  tension
    .command('show <name>')
    .description('Show tension for a session')
    .action(name => handleShowTension(sessions(), name));

  tension
    .command('filter <level>')
    .description('Filter sessions by tension level')
    .action(level => handleFilterByTension(sessions(), level));

  tension
    .command('sort [direction]')
    .description('Sort sessions by tension (asc|desc)')
    .action(direction => handleSortByTension(sessions(), direction));
}

module.exports = {
  handleSetTension,
  handleClearTension,
  handleShowTension,
  handleFilterByTension,
  handleSortByTension,
  registerTensionCmd
};
