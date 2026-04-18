const { setImpactByName, clearImpact, getImpact, filterByImpact, sortByImpact, VALID_IMPACTS } = require('../impact');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetImpact(name, impact) {
  const sessions = loadSessions();
  try {
    const updated = setImpactByName(sessions, name, impact);
    if (!updated.find(s => s.name === name)) return console.log(`Session not found: ${name}`);
    saveSessions(updated);
    console.log(`Impact for "${name}" set to ${impact}.`);
  } catch (e) {
    console.log(e.message);
  }
}

function handleClearImpact(name) {
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? clearImpact(s) : s);
  saveSessions(updated);
  console.log(`Impact cleared for "${name}".`);
}

function handleShowImpact(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.log(`Session not found: ${name}`);
  const impact = getImpact(session);
  console.log(impact ? `Impact: ${impact}` : 'No impact set.');
}

function handleFilterByImpact(impact) {
  const sessions = loadSessions();
  const results = filterByImpact(sessions, impact);
  if (!results.length) return console.log('No sessions found.');
  results.forEach(s => console.log(`- ${s.name} [${s.impact}]`));
}

function handleSortByImpact() {
  const sessions = loadSessions();
  const sorted = sortByImpact(sessions);
  sorted.forEach(s => console.log(`- ${s.name} [${s.impact || 'none'}]`));
}

function registerImpactCmd(program) {
  const cmd = program.command('impact').description('Manage session impact levels');
  cmd.command('set <name> <impact>').description(`Set impact (${VALID_IMPACTS.join('|')})`).action(handleSetImpact);
  cmd.command('clear <name>').description('Clear impact').action(handleClearImpact);
  cmd.command('show <name>').description('Show impact').action(handleShowImpact);
  cmd.command('filter <impact>').description('Filter by impact').action(handleFilterByImpact);
  cmd.command('sort').description('Sort by impact').action(handleSortByImpact);
}

module.exports = { handleSetImpact, handleClearImpact, handleShowImpact, handleFilterByImpact, handleSortByImpact, registerImpactCmd };
