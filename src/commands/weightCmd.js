const { setWeightByName, clearWeight, getWeight, filterByMinWeight, filterByMaxWeight, sortByWeight } = require('../weight');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetWeight(name, weight, file) {
  const sessions = loadSessions(file);
  const w = parseFloat(weight);
  const updated = setWeightByName(sessions, name, w);
  if (updated === sessions) { console.log(`Session "${name}" not found.`); return; }
  saveSessions(file, updated);
  console.log(`Weight for "${name}" set to ${w}.`);
}

function handleClearWeight(name, file) {
  const sessions = loadSessions(file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.log(`Session "${name}" not found.`); return; }
  const updated = sessions.map(s => s.name === name ? clearWeight(s) : s);
  saveSessions(file, updated);
  console.log(`Weight cleared for "${name}".`);
}

function handleShowWeight(name, file) {
  const sessions = loadSessions(file);
  const s = sessions.find(s => s.name === name);
  if (!s) { console.log(`Session "${name}" not found.`); return; }
  const w = getWeight(s);
  console.log(w !== null ? `Weight: ${w}` : `No weight set for "${name}".`);
}

function handleFilterByMin(min, file) {
  const sessions = loadSessions(file);
  const results = filterByMinWeight(sessions, parseFloat(min));
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`${s.name} (weight: ${s.weight})`));
}

function handleFilterByMax(max, file) {
  const sessions = loadSessions(file);
  const results = filterByMaxWeight(sessions, parseFloat(max));
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`${s.name} (weight: ${s.weight})`));
}

function handleSortByWeight(order = 'desc', file) {
  const sessions = loadSessions(file);
  const sorted = sortByWeight(sessions, order);
  sorted.forEach(s => console.log(`${s.name} (weight: ${s.weight ?? 'none'})`));
}

function registerWeightCmd(program, file) {
  const cmd = program.command('weight').description('Manage session weights');
  cmd.command('set <name> <weight>').description('Set weight').action((n, w) => handleSetWeight(n, w, file));
  cmd.command('clear <name>').description('Clear weight').action(n => handleClearWeight(n, file));
  cmd.command('show <name>').description('Show weight').action(n => handleShowWeight(n, file));
  cmd.command('min <value>').description('Filter by min weight').action(v => handleFilterByMin(v, file));
  cmd.command('max <value>').description('Filter by max weight').action(v => handleFilterByMax(v, file));
  cmd.command('sort [order]').description('Sort by weight (asc|desc)').action(o => handleSortByWeight(o, file));
}

module.exports = { handleSetWeight, handleClearWeight, handleShowWeight, handleFilterByMin, handleFilterByMax, handleSortByWeight, registerWeightCmd };
