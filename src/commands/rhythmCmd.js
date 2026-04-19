const { setRhythmByName, clearRhythm, getRhythm, filterByRhythm, sortByRhythm, listRhythms, isValidRhythm } = require('../rhythm');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetRhythm(name, rhythm) {
  if (!isValidRhythm(rhythm)) {
    console.error(`Invalid rhythm "${rhythm}". Valid: ${listRhythms().join(', ')}`);
    return;
  }
  const sessions = loadSessions();
  const updated = setRhythmByName(sessions, name, rhythm);
  if (updated.every((s, i) => s === sessions[i])) {
    console.error(`Session "${name}" not found.`);
    return;
  }
  saveSessions(updated);
  console.log(`Rhythm for "${name}" set to "${rhythm}".`);
}

function handleClearRhythm(name) {
  const sessions = loadSessions();
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.error(`Session "${name}" not found.`); return; }
  sessions[idx] = clearRhythm(sessions[idx]);
  saveSessions(sessions);
  console.log(`Rhythm cleared for "${name}".`);
}

function handleShowRhythm(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found.`); return; }
  const r = getRhythm(session);
  console.log(r ? `${name}: ${r}` : `${name}: no rhythm set`);
}

function handleFilterByRhythm(rhythm) {
  const sessions = loadSessions();
  const filtered = filterByRhythm(sessions, rhythm);
  if (!filtered.length) { console.log('No sessions found.'); return; }
  filtered.forEach(s => console.log(`${s.name} [${s.rhythm}]`));
}

function handleSortByRhythm() {
  const sessions = loadSessions();
  const sorted = sortByRhythm(sessions);
  sorted.forEach(s => console.log(`${s.name}: ${s.rhythm || 'none'}`));
}

function handleListRhythms() {
  console.log('Valid rhythms:', listRhythms().join(', '));
}

function registerRhythmCmd(program) {
  const cmd = program.command('rhythm').description('Manage session rhythms');
  cmd.command('set <name> <rhythm>').description('Set rhythm for a session').action(handleSetRhythm);
  cmd.command('clear <name>').description('Clear rhythm from a session').action(handleClearRhythm);
  cmd.command('show <name>').description('Show rhythm of a session').action(handleShowRhythm);
  cmd.command('filter <rhythm>').description('Filter sessions by rhythm').action(handleFilterByRhythm);
  cmd.command('sort').description('Sort sessions by rhythm').action(handleSortByRhythm);
  cmd.command('list').description('List valid rhythms').action(handleListRhythms);
}

module.exports = { handleSetRhythm, handleClearRhythm, handleShowRhythm, handleFilterByRhythm, handleSortByRhythm, registerRhythmCmd };
