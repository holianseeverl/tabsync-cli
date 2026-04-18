const {
  setRecurrenceByName,
  clearRecurrence,
  getRecurrence,
  filterByFrequency,
  listRecurring,
  isValidFrequency
} = require('../recurrence');

function handleSetRecurrence(sessions, name, frequency, dayOrDate) {
  if (!isValidFrequency(frequency)) {
    console.error(`Invalid frequency "${frequency}". Use: daily, weekly, monthly`);
    return sessions;
  }
  const updated = setRecurrenceByName(sessions, name, frequency, dayOrDate || null);
  const found = updated.find(s => s.name === name);
  if (!found) {
    console.error(`Session "${name}" not found`);
    return sessions;
  }
  console.log(`Recurrence set: "${name}" → ${frequency}${dayOrDate ? ` (${dayOrDate})` : ''}`);
  return updated;
}

function handleClearRecurrence(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.error(`Session "${name}" not found`);
    return sessions;
  }
  const updated = [...sessions];
  updated[idx] = clearRecurrence(sessions[idx]);
  console.log(`Recurrence cleared for "${name}"`);
  return updated;
}

function handleShowRecurrence(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found`); return; }
  const rec = getRecurrence(session);
  if (!rec) { console.log(`No recurrence set for "${name}"`); return; }
  console.log(`${name}: ${rec.frequency}${rec.dayOrDate ? ` on ${rec.dayOrDate}` : ''} (set ${rec.setAt})`);
}

function handleFilterByFrequency(sessions, frequency) {
  const results = filterByFrequency(sessions, frequency);
  if (!results.length) { console.log(`No sessions with frequency "${frequency}"`); return; }
  results.forEach(s => console.log(`- ${s.name} (${s.recurrence.frequency})`));
}

function handleListRecurring(sessions) {
  const results = listRecurring(sessions);
  if (!results.length) { console.log('No recurring sessions'); return; }
  results.forEach(s => console.log(`- ${s.name}: ${s.recurrence.frequency}${s.recurrence.dayOrDate ? ` on ${s.recurrence.dayOrDate}` : ''}`));
}

function registerRecurrenceCmd(program, sessions, save) {
  const cmd = program.command('recurrence').description('Manage session recurrence schedules');

  cmd.command('set <name> <frequency> [dayOrDate]')
    .description('Set recurrence for a session')
    .action((name, frequency, dayOrDate) => save(handleSetRecurrence(sessions(), name, frequency, dayOrDate)));

  cmd.command('clear <name>')
    .description('Clear recurrence from a session')
    .action(name => save(handleClearRecurrence(sessions(), name)));

  cmd.command('show <name>')
    .description('Show recurrence for a session')
    .action(name => handleShowRecurrence(sessions(), name));

  cmd.command('filter <frequency>')
    .description('Filter sessions by frequency')
    .action(freq => handleFilterByFrequency(sessions(), freq));

  cmd.command('list')
    .description('List all recurring sessions')
    .action(() => handleListRecurring(sessions()));
}

module.exports = { handleSetRecurrence, handleClearRecurrence, handleShowRecurrence, handleFilterByFrequency, handleListRecurring, registerRecurrenceCmd };
