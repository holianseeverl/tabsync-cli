const { setHorizonByName, clearHorizon, getHorizon, listOverdue, listUpcoming, sortByHorizon } = require('../horizon');

function handleSetHorizon(sessions, name, date) {
  const updated = setHorizonByName(sessions, name, date);
  const s = updated.find(x => x.name === name);
  if (!s) { console.log(`Session '${name}' not found`); return sessions; }
  console.log(`Horizon set for '${name}': ${s.horizon}`);
  return updated;
}

function handleClearHorizon(sessions, name) {
  const updated = sessions.map(s => s.name === name ? clearHorizon(s) : s);
  console.log(`Horizon cleared for '${name}'`);
  return updated;
}

function handleShowHorizon(sessions, name) {
  const s = sessions.find(x => x.name === name);
  if (!s) { console.log(`Session '${name}' not found`); return; }
  const h = getHorizon(s);
  console.log(h ? `Horizon: ${h}` : 'No horizon set');
}

function handleListOverdue(sessions) {
  const list = listOverdue(sessions);
  if (!list.length) { console.log('No overdue sessions'); return; }
  list.forEach(s => console.log(`[OVERDUE] ${s.name} — ${s.horizon}`));
}

function handleListUpcoming(sessions, days = 7) {
  const list = listUpcoming(sessions, Number(days));
  if (!list.length) { console.log(`No sessions due in next ${days} days`); return; }
  list.forEach(s => console.log(`[UPCOMING] ${s.name} — ${s.horizon}`));
}

function handleSortByHorizon(sessions) {
  const sorted = sortByHorizon(sessions);
  sorted.forEach(s => console.log(`${s.name}: ${s.horizon || '(none)'}`));
  return sorted;
}

function registerHorizonCmd(program, getSessions, saveSessions) {
  const cmd = program.command('horizon').description('Manage session horizons');

  cmd.command('set <name> <date>').action((name, date) => {
    saveSessions(handleSetHorizon(getSessions(), name, date));
  });
  cmd.command('clear <name>').action(name => {
    saveSessions(handleClearHorizon(getSessions(), name));
  });
  cmd.command('show <name>').action(name => handleShowHorizon(getSessions(), name));
  cmd.command('overdue').action(() => handleListOverdue(getSessions()));
  cmd.command('upcoming [days]').action(days => handleListUpcoming(getSessions(), days));
  cmd.command('sort').action(() => handleSortByHorizon(getSessions()));
}

module.exports = { handleSetHorizon, handleClearHorizon, handleShowHorizon, handleListOverdue, handleListUpcoming, handleSortByHorizon, registerHorizonCmd };
