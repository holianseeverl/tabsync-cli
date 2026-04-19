const { setSpike, clearSpike, setSpikeByName, getSpike, filterBySpike, sortBySpike } = require('../spike');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetSpike(name, level, note) {
  const sessions = loadSessions();
  const match = sessions.find(s => s.name === name);
  if (!match) return console.log(`Session not found: ${name}`);
  try {
    const updated = setSpikeByName(sessions, name, level, note || '');
    saveSessions(updated);
    console.log(`Spike set to "${level}" for session "${name}".`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

function handleClearSpike(name) {
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? clearSpike(s) : s);
  saveSessions(updated);
  console.log(`Spike cleared for session "${name}".`);
}

function handleShowSpike(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.log(`Session not found: ${name}`);
  const spike = getSpike(session);
  if (!spike) return console.log(`No spike set for "${name}".`);
  console.log(`Spike: ${spike.level}${spike.note ? ` — ${spike.note}` : ''} (set ${spike.setAt})`);
}

function handleFilterBySpike(level) {
  const sessions = loadSessions();
  const results = filterBySpike(sessions, level);
  if (!results.length) return console.log(`No sessions with spike level "${level}".`);
  results.forEach(s => console.log(`- ${s.name} [${s.spike.level}]`));
}

function handleSortBySpike() {
  const sessions = loadSessions();
  const sorted = sortBySpike(sessions);
  sorted.forEach(s => {
    const tag = s.spike ? `[${s.spike.level}]` : '[none]';
    console.log(`- ${s.name} ${tag}`);
  });
}

function registerSpikeCmd(program) {
  const cmd = program.command('spike').description('Manage session spike levels');
  cmd.command('set <name> <level> [note]').description('Set spike level').action(handleSetSpike);
  cmd.command('clear <name>').description('Clear spike').action(handleClearSpike);
  cmd.command('show <name>').description('Show spike info').action(handleShowSpike);
  cmd.command('filter <level>').description('Filter by spike level').action(handleFilterBySpike);
  cmd.command('sort').description('Sort by spike level').action(handleSortBySpike);
}

module.exports = { handleSetSpike, handleClearSpike, handleShowSpike, handleFilterBySpike, handleSortBySpike, registerSpikeCmd };
