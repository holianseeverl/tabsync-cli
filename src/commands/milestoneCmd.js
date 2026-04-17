const { setMilestoneByName, clearMilestone, getMilestone, filterByMilestone, sortByMilestone, listMilestones, isValidMilestone } = require('../milestone');

function handleSetMilestone(sessions, name, milestone) {
  if (!isValidMilestone(milestone)) {
    console.error(`Invalid milestone "${milestone}". Valid: ${listMilestones().join(', ')}`);
    return sessions;
  }
  const updated = setMilestoneByName(sessions, name, milestone);
  const found = updated.find(s => s.name === name);
  if (!found) { console.error(`Session "${name}" not found`); return sessions; }
  console.log(`Milestone set to "${milestone}" for "${name}"`);
  return updated;
}

function handleClearMilestone(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.error(`Session "${name}" not found`); return sessions; }
  const updated = sessions.map(s => s.name === name ? clearMilestone(s) : s);
  console.log(`Milestone cleared for "${name}"`);
  return updated;
}

function handleShowMilestone(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found`); return; }
  const m = getMilestone(session);
  console.log(m ? `${name}: ${m}` : `${name}: (no milestone)`);
}

function handleFilterByMilestone(sessions, milestone) {
  const results = filterByMilestone(sessions, milestone);
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`${s.name} [${s.milestone}]`));
}

function handleSortByMilestone(sessions) {
  const sorted = sortByMilestone(sessions);
  sorted.forEach(s => console.log(`${s.name} [${s.milestone || 'none'}]`));
}

function registerMilestoneCmd(program, sessions, persist) {
  const cmd = program.command('milestone').description('Manage session milestones');

  cmd.command('set <name> <milestone>').description('Set milestone for a session')
    .action((name, milestone) => persist(handleSetMilestone(sessions(), name, milestone)));

  cmd.command('clear <name>').description('Clear milestone from a session')
    .action(name => persist(handleClearMilestone(sessions(), name)));

  cmd.command('show <name>').description('Show milestone for a session')
    .action(name => handleShowMilestone(sessions(), name));

  cmd.command('filter <milestone>').description('Filter sessions by milestone')
    .action(milestone => handleFilterByMilestone(sessions(), milestone));

  cmd.command('sort').description('Sort sessions by milestone order')
    .action(() => handleSortByMilestone(sessions()));

  cmd.command('list').description('List valid milestones')
    .action(() => console.log(listMilestones().join(', ')));
}

module.exports = { handleSetMilestone, handleClearMilestone, handleShowMilestone, handleFilterByMilestone, handleSortByMilestone, registerMilestoneCmd };
