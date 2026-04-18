const {
  setBudgetByName,
  clearBudget,
  getBudget,
  filterOverBudget,
  filterWithinBudget,
  sortByBudget,
  isOverBudget,
} = require('../budget');

function handleSetBudget(sessions, name, budget) {
  const parsed = parseInt(budget, 10);
  const updated = setBudgetByName(sessions, name, parsed);
  const s = updated.find(x => x.name === name);
  if (!s) { console.log(`Session "${name}" not found.`); return sessions; }
  console.log(`Budget for "${name}" set to ${parsed} tab(s).`);
  return updated;
}

function handleClearBudget(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.log(`Session "${name}" not found.`); return sessions; }
  const updated = sessions.map(s => s.name === name ? clearBudget(s) : s);
  console.log(`Budget cleared for "${name}".`);
  return updated;
}

function handleShowBudget(sessions, name) {
  const s = sessions.find(x => x.name === name);
  if (!s) { console.log(`Session "${name}" not found.`); return; }
  const b = getBudget(s);
  const tabCount = (s.tabs || []).length;
  if (b === null) {
    console.log(`"${name}" has no budget set (${tabCount} tabs).`);
  } else {
    const status = isOverBudget(s) ? 'OVER BUDGET' : 'within budget';
    console.log(`"${name}": budget=${b}, tabs=${tabCount} [${status}]`);
  }
}

function handleListOverBudget(sessions) {
  const over = filterOverBudget(sessions);
  if (!over.length) { console.log('No sessions are over budget.'); return; }
  over.forEach(s => console.log(`  ${s.name}: ${(s.tabs||[]).length}/${s.budget} tabs`));
}

function handleListWithinBudget(sessions) {
  const within = filterWithinBudget(sessions);
  if (!within.length) { console.log('No sessions within budget.'); return; }
  within.forEach(s => {
    const b = getBudget(s);
    const label = b !== null ? `${(s.tabs||[]).length}/${b}` : `${(s.tabs||[]).length}/∞`;
    console.log(`  ${s.name}: ${label} tabs`);
  });
}

function handleSortByBudget(sessions) {
  const sorted = sortByBudget(sessions);
  sorted.forEach(s => {
    const b = getBudget(s);
    console.log(`  ${s.name}: budget=${b ?? 'none'}`);
  });
  return sorted;
}

function registerBudgetCmd(program, loadSessions, saveSessions) {
  const cmd = program.command('budget').description('Manage tab budgets for sessions');

  cmd.command('set <name> <budget>').description('Set tab budget').action((name, budget) => {
    const sessions = loadSessions();
    saveSessions(handleSetBudget(sessions, name, budget));
  });
  cmd.command('clear <name>').description('Clear budget').action(name => {
    const sessions = loadSessions();
    saveSessions(handleClearBudget(sessions, name));
  });
  cmd.command('show <name>').description('Show budget').action(name => {
    handleShowBudget(loadSessions(), name);
  });
  cmd.command('over').description('List over-budget sessions').action(() => {
    handleListOverBudget(loadSessions());
  });
  cmd.command('within').description('List within-budget sessions').action(() => {
    handleListWithinBudget(loadSessions());
  });
  cmd.command('sort').description('Sort by budget').action(() => {
    handleSortByBudget(loadSessions());
  });
}

module.exports = {
  handleSetBudget,
  handleClearBudget,
  handleShowBudget,
  handleListOverBudget,
  handleListWithinBudget,
  handleSortByBudget,
  registerBudgetCmd,
};
