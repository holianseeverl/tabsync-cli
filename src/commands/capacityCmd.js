const {
  setCapacityByName,
  clearCapacity,
  getCapacity,
  isOverCapacity,
  filterOverCapacity,
  filterUnderCapacity,
  sortByCapacityUsage,
} = require('../capacity');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetCapacity(name, limit) {
  const sessions = loadSessions();
  const n = parseInt(limit, 10);
  try {
    const updated = setCapacityByName(sessions, name, n);
    saveSessions(updated);
    console.log(`Set capacity of "${name}" to ${n} tabs.`);
  } catch (e) {
    console.error(e.message);
  }
}

function handleClearCapacity(name) {
  const sessions = loadSessions();
  const updated = sessions.map(s =>
    s.name === name ? clearCapacity(s) : s
  );
  saveSessions(updated);
  console.log(`Cleared capacity for "${name}".`);
}

function handleShowCapacity(name) {
  const sessions = loadSessions();
  const s = sessions.find(s => s.name === name);
  if (!s) return console.error(`Session "${name}" not found.`);
  const cap = getCapacity(s);
  const tabs = Array.isArray(s.tabs) ? s.tabs.length : 0;
  const over = isOverCapacity(s) ? ' [OVER CAPACITY]' : '';
  console.log(`${name}: ${tabs}/${cap} tabs${over}`);
}

function handleListOverCapacity() {
  const sessions = loadSessions();
  const over = filterOverCapacity(sessions);
  if (!over.length) return console.log('No sessions over capacity.');
  over.forEach(s => {
    const tabs = Array.isArray(s.tabs) ? s.tabs.length : 0;
    console.log(`${s.name}: ${tabs}/${getCapacity(s)} tabs`);
  });
}

function handleSortByUsage() {
  const sessions = loadSessions();
  const sorted = sortByCapacityUsage(sessions);
  sorted.forEach(s => {
    const tabs = Array.isArray(s.tabs) ? s.tabs.length : 0;
    const cap = getCapacity(s);
    const pct = Math.round((tabs / cap) * 100);
    console.log(`${s.name}: ${tabs}/${cap} (${pct}%)`);
  });
}

function registerCapacityCmd(program) {
  const cmd = program.command('capacity').description('Manage session tab capacity');
  cmd.command('set <name> <limit>').description('Set max tab limit').action(handleSetCapacity);
  cmd.command('clear <name>').description('Clear capacity limit').action(handleClearCapacity);
  cmd.command('show <name>').description('Show capacity info').action(handleShowCapacity);
  cmd.command('over').description('List over-capacity sessions').action(handleListOverCapacity);
  cmd.command('sort').description('Sort sessions by capacity usage').action(handleSortByUsage);
}

module.exports = { handleSetCapacity, handleClearCapacity, handleShowCapacity, handleListOverCapacity, handleSortByUsage, registerCapacityCmd };
