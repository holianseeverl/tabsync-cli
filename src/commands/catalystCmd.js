// catalystCmd.js — CLI command handler for catalyst feature

const {
  setCatalystByName,
  clearCatalyst,
  getCatalyst,
  filterByCatalyst,
  groupByCatalyst,
  sortByCatalyst,
  VALID_CATALYSTS,
} = require('../catalyst');

function handleSetCatalyst(sessions, name, catalyst) {
  const match = sessions.find(s => s.name === name);
  if (!match) {
    console.error(`Session not found: "${name}"`);
    return sessions;
  }
  const updated = setCatalystByName(sessions, name, catalyst);
  console.log(`Catalyst for "${name}" set to "${catalyst}".`);
  return updated;
}

function handleClearCatalyst(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.error(`Session not found: "${name}"`);
    return sessions;
  }
  const updated = [...sessions];
  updated[idx] = clearCatalyst(sessions[idx]);
  console.log(`Catalyst cleared for "${name}".`);
  return updated;
}

function handleShowCatalyst(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: "${name}"`);
    return;
  }
  const catalyst = getCatalyst(session);
  console.log(catalyst ? `${name}: ${catalyst}` : `${name}: (no catalyst set)`);
}

function handleFilterByCatalyst(sessions, catalyst) {
  const results = filterByCatalyst(sessions, catalyst);
  if (results.length === 0) {
    console.log(`No sessions with catalyst "${catalyst}".`);
  } else {
    results.forEach(s => console.log(`  - ${s.name}`));
  }
  return results;
}

function handleGroupByCatalyst(sessions) {
  const groups = groupByCatalyst(sessions);
  for (const [key, list] of Object.entries(groups)) {
    console.log(`[${key}]`);
    list.forEach(s => console.log(`  - ${s.name}`));
  }
}

function handleSortByCatalyst(sessions) {
  const sorted = sortByCatalyst(sessions);
  sorted.forEach(s => console.log(`  ${s.catalyst ?? 'unset'} — ${s.name}`));
  return sorted;
}

function registerCatalystCmd(program, loadSessions, saveSessions) {
  const cmd = program.command('catalyst').description('Manage session catalysts');

  cmd.command('set <name> <catalyst>')
    .description(`Set catalyst (${VALID_CATALYSTS.join(', ')})`)
    .action((name, catalyst) => {
      const sessions = loadSessions();
      const updated = handleSetCatalyst(sessions, name, catalyst);
      saveSessions(updated);
    });

  cmd.command('clear <name>')
    .description('Clear catalyst from a session')
    .action(name => {
      const sessions = loadSessions();
      const updated = handleClearCatalyst(sessions, name);
      saveSessions(updated);
    });

  cmd.command('show <name>')
    .description('Show catalyst for a session')
    .action(name => handleShowCatalyst(loadSessions(), name));

  cmd.command('filter <catalyst>')
    .description('Filter sessions by catalyst')
    .action(catalyst => handleFilterByCatalyst(loadSessions(), catalyst));

  cmd.command('group')
    .description('Group all sessions by catalyst')
    .action(() => handleGroupByCatalyst(loadSessions()));

  cmd.command('sort')
    .description('Sort sessions by catalyst order')
    .action(() => handleSortByCatalyst(loadSessions()));
}

module.exports = {
  handleSetCatalyst,
  handleClearCatalyst,
  handleShowCatalyst,
  handleFilterByCatalyst,
  handleGroupByCatalyst,
  handleSortByCatalyst,
  registerCatalystCmd,
};
