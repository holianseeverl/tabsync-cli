const {
  isValidSurface,
  setSurfaceByName,
  clearSurface,
  getSurface,
  filterBySurface,
  sortBySurface,
  groupBySurface,
  VALID_SURFACES
} = require('../surface');

function handleSetSurface(sessions, name, surface) {
  if (!isValidSurface(surface)) {
    console.error(`Invalid surface '${surface}'. Valid: ${VALID_SURFACES.join(', ')}`);
    return sessions;
  }
  const updated = setSurfaceByName(sessions, name, surface);
  const found = updated.find(s => s.name === name);
  if (!found || found.surface !== surface) {
    console.error(`Session '${name}' not found.`);
    return sessions;
  }
  console.log(`Surface set to '${surface}' for session '${name}'.`);
  return updated;
}

function handleClearSurface(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.error(`Session '${name}' not found.`);
    return sessions;
  }
  const updated = sessions.map(s => s.name === name ? clearSurface(s) : s);
  console.log(`Surface cleared for session '${name}'.`);
  return updated;
}

function handleShowSurface(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session '${name}' not found.`);
    return;
  }
  const surface = getSurface(session);
  console.log(surface ? `Surface: ${surface}` : `No surface set for '${name}'.`);
}

function handleFilterBySurface(sessions, surface) {
  const results = filterBySurface(sessions, surface);
  if (results.length === 0) {
    console.log(`No sessions with surface '${surface}'.`);
  } else {
    results.forEach(s => console.log(`  ${s.name} [${s.surface}]`));
  }
  return results;
}

function handleSortBySurface(sessions) {
  const sorted = sortBySurface(sessions);
  sorted.forEach(s => console.log(`  ${s.name} [${s.surface || 'unset'}]`));
  return sorted;
}

function handleGroupBySurface(sessions) {
  const groups = groupBySurface(sessions);
  for (const [key, group] of Object.entries(groups)) {
    console.log(`${key} (${group.length}):`);
    group.forEach(s => console.log(`  - ${s.name}`));
  }
  return groups;
}

function registerSurfaceCmd(program, getSessions, saveSessions) {
  const cmd = program.command('surface').description('Manage session surfaces');

  cmd.command('set <name> <surface>')
    .description(`Set surface for a session (${VALID_SURFACES.join('|')})`)
    .action((name, surface) => saveSessions(handleSetSurface(getSessions(), name, surface)));

  cmd.command('clear <name>')
    .description('Clear surface from a session')
    .action(name => saveSessions(handleClearSurface(getSessions(), name)));

  cmd.command('show <name>')
    .description('Show surface for a session')
    .action(name => handleShowSurface(getSessions(), name));

  cmd.command('filter <surface>')
    .description('Filter sessions by surface')
    .action(surface => handleFilterBySurface(getSessions(), surface));

  cmd.command('sort')
    .description('Sort sessions by surface')
    .action(() => handleSortBySurface(getSessions()));

  cmd.command('group')
    .description('Group sessions by surface')
    .action(() => handleGroupBySurface(getSessions()));
}

module.exports = {
  handleSetSurface,
  handleClearSurface,
  handleShowSurface,
  handleFilterBySurface,
  handleSortBySurface,
  handleGroupBySurface,
  registerSurfaceCmd
};
