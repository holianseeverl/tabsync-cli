const { isValidEnergy, setEnergy, clearEnergy, setEnergyByName, getEnergy, filterByEnergy, sortByEnergy } = require('../energy');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetEnergy(name, level, file) {
  const sessions = loadSessions(file);
  if (!isValidEnergy(level)) {
    console.error(`Invalid energy level: ${level}. Use low, medium, or high.`);
    return;
  }
  const updated = setEnergyByName(sessions, name, level);
  saveSessions(file, updated);
  console.log(`Energy for "${name}" set to ${level}.`);
}

function handleClearEnergy(name, file) {
  const sessions = loadSessions(file);
  const target = sessions.find(s => s.name === name);
  if (!target) { console.error(`Session "${name}" not found.`); return; }
  const updated = sessions.map(s => s.name === name ? clearEnergy(s) : s);
  saveSessions(file, updated);
  console.log(`Energy cleared for "${name}".`);
}

function handleShowEnergy(name, file) {
  const sessions = loadSessions(file);
  const target = sessions.find(s => s.name === name);
  if (!target) { console.error(`Session "${name}" not found.`); return; }
  const e = getEnergy(target);
  console.log(e ? `${name}: ${e}` : `${name} has no energy set.`);
}

function handleFilterByEnergy(level, file) {
  const sessions = loadSessions(file);
  const results = filterByEnergy(sessions, level);
  if (!results.length) { console.log(`No sessions with energy "${level}".`); return; }
  results.forEach(s => console.log(`- ${s.name} [${s.energy}]`));
}

function handleSortByEnergy(file) {
  const sessions = loadSessions(file);
  const sorted = sortByEnergy(sessions);
  sorted.forEach(s => console.log(`- ${s.name} [${s.energy || 'none'}]`));
}

function registerEnergyCmd(program, file) {
  const cmd = program.command('energy').description('Manage session energy levels');
  cmd.command('set <name> <level>').description('Set energy level (low|medium|high)').action((name, level) => handleSetEnergy(name, level, file));
  cmd.command('clear <name>').description('Clear energy from a session').action(name => handleClearEnergy(name, file));
  cmd.command('show <name>').description('Show energy for a session').action(name => handleShowEnergy(name, file));
  cmd.command('filter <level>').description('Filter sessions by energy').action(level => handleFilterByEnergy(level, file));
  cmd.command('sort').description('Sort sessions by energy').action(() => handleSortByEnergy(file));
}

module.exports = { handleSetEnergy, handleClearEnergy, handleShowEnergy, handleFilterByEnergy, handleSortByEnergy, registerEnergyCmd };
