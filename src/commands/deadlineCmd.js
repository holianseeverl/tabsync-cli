const { setDeadlineByName, clearDeadline, getDeadline, listOverdue, listUpcoming, sortByDeadline } = require('../deadline');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetDeadline(name, date) {
  const sessions = loadSessions();
  try {
    const updated = sessions.map(s => s.name === name
      ? require('../deadline').setDeadline(s, date)
      : s);
    saveSessions(updated);
    console.log(`Deadline set for "${name}": ${date}`);
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}

function handleClearDeadline(name) {
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? clearDeadline(s) : s);
  saveSessions(updated);
  console.log(`Deadline cleared for "${name}"`);
}

function handleShowDeadline(name) {
  const sessions = loadSessions();
  const s = sessions.find(s => s.name === name);
  if (!s) return console.error(`Session "${name}" not found.`);
  const d = getDeadline(s);
  console.log(d ? `Deadline: ${d}` : 'No deadline set.');
}

function handleListOverdue() {
  const sessions = loadSessions();
  const overdue = listOverdue(sessions);
  if (!overdue.length) return console.log('No overdue sessions.');
  overdue.forEach(s => console.log(`  [OVERDUE] ${s.name} — ${s.deadline}`));
}

function handleListUpcoming(days = 7) {
  const sessions = loadSessions();
  const ms = days * 24 * 60 * 60 * 1000;
  const upcoming = listUpcoming(sessions, ms);
  if (!upcoming.length) return console.log(`No sessions due within ${days} day(s).`);
  upcoming.forEach(s => console.log(`  ${s.name} — due ${s.deadline}`));
}

function handleSortByDeadline() {
  const sessions = loadSessions();
  const sorted = sortByDeadline(sessions);
  sorted.forEach(s => console.log(`  ${s.name} — ${s.deadline || 'no deadline'}`));
}

function registerDeadlineCmd(program) {
  const cmd = program.command('deadline').description('Manage session deadlines');
  cmd.command('set <name> <date>').description('Set a deadline (ISO date)').action(handleSetDeadline);
  cmd.command('clear <name>').description('Clear deadline').action(handleClearDeadline);
  cmd.command('show <name>').description('Show deadline').action(handleShowDeadline);
  cmd.command('overdue').description('List overdue sessions').action(handleListOverdue);
  cmd.command('upcoming [days]').description('List sessions due within N days (default 7)').action(handleListUpcoming);
  cmd.command('sort').description('Sort sessions by deadline').action(handleSortByDeadline);
}

module.exports = { handleSetDeadline, handleClearDeadline, handleShowDeadline, handleListOverdue, handleListUpcoming, registerDeadlineCmd };
