const { computeComplexity, getComplexity, setComplexity, setComplexityByName, sortByComplexity, filterByMinComplexity, filterByMaxComplexity } = require('../complexity');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetComplexity(name, value) {
  const sessions = loadSessions();
  const num = Number(value);
  if (isNaN(num) || num < 0) return console.error('Complexity must be a non-negative number.');
  const updated = setComplexityByName(sessions, name, num);
  if (updated === sessions) return console.error(`Session "${name}" not found.`);
  saveSessions(updated);
  console.log(`Set complexity of "${name}" to ${num}.`);
}

function handleShowComplexity(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session "${name}" not found.`);
  const c = getComplexity(session);
  if (c === null) console.log(`"${name}" has no complexity set. Computed: ${computeComplexity(session)}`);
  else console.log(`"${name}" complexity: ${c}`);
}

function handleSortByComplexity() {
  const sessions = loadSessions();
  const sorted = sortByComplexity(sessions);
  sorted.forEach(s => console.log(`${s.name}: ${getComplexity(s) ?? computeComplexity(s)}`));
}

function handleFilterByMin(min) {
  const sessions = loadSessions();
  const filtered = filterByMinComplexity(sessions, Number(min));
  if (!filtered.length) return console.log('No sessions match.');
  filtered.forEach(s => console.log(`${s.name}: ${getComplexity(s)}`) );
}

function handleFilterByMax(max) {
  const sessions = loadSessions();
  const filtered = filterByMaxComplexity(sessions, Number(max));
  if (!filtered.length) return console.log('No sessions match.');
  filtered.forEach(s => console.log(`${s.name}: ${getComplexity(s)}`));
}

function registerComplexityCmd(program) {
  const cmd = program.command('complexity').description('Manage session complexity');

  cmd.command('set <name> <value>').description('Set complexity for a session').action(handleSetComplexity);
  cmd.command('show <name>').description('Show complexity of a session').action(handleShowComplexity);
  cmd.command('sort').description('Sort sessions by complexity').action(handleSortByComplexity);
  cmd.command('min <value>').description('Filter sessions by minimum complexity').action(handleFilterByMin);
  cmd.command('max <value>').description('Filter sessions by maximum complexity').action(handleFilterByMax);
}

module.exports = { handleSetComplexity, handleShowComplexity, handleSortByComplexity, handleFilterByMin, handleFilterByMax, registerComplexityCmd };
