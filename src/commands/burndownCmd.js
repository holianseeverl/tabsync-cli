const {
  recordBurndownByName,
  clearBurndown,
  getBurndown,
  computeBurnRate,
  filterByMinBurnRate,
  sortByBurnRate
} = require('../burndown');

function handleRecord(sessions, name) {
  recordBurndownByName(sessions, name);
  const session = sessions.find(s => s.name === name);
  const latest = session.burndown[session.burndown.length - 1];
  console.log(`Recorded burndown for "${name}": ${latest.tabCount} tabs at ${latest.timestamp}`);
  return sessions;
}

function handleClear(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  clearBurndown(session);
  console.log(`Cleared burndown history for "${name}"`);
  return sessions;
}

function handleShow(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  const entries = getBurndown(session);
  if (entries.length === 0) {
    console.log(`No burndown data for "${name}"`);
    return;
  }
  console.log(`Burndown for "${name}":`);
  entries.forEach(e => console.log(`  ${e.timestamp}  ${e.tabCount} tabs`));
  const rate = computeBurnRate(session);
  if (rate !== null) console.log(`  Burn rate: ${rate} tabs/day`);
}

function handleFilterByMin(sessions, minRate) {
  const results = filterByMinBurnRate(sessions, minRate);
  if (results.length === 0) {
    console.log(`No sessions with burn rate >= ${minRate} tabs/day`);
    return results;
  }
  results.forEach(s => {
    const rate = computeBurnRate(s);
    console.log(`  ${s.name}  (${rate} tabs/day)`);
  });
  return results;
}

function handleSort(sessions) {
  const sorted = sortByBurnRate(sessions);
  sorted.forEach(s => {
    const rate = computeBurnRate(s);
    const label = rate !== null ? `${rate} tabs/day` : 'no data';
    console.log(`  ${s.name}  (${label})`);
  });
  return sorted;
}

function registerBurndownCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('burndown').description('Track tab reduction over time');

  cmd.command('record <name>').description('Record current tab count').action(async name => {
    const sessions = await loadSessions();
    await saveSessions(handleRecord(sessions, name));
  });

  cmd.command('show <name>').description('Show burndown history').action(async name => {
    const sessions = await loadSessions();
    handleShow(sessions, name);
  });

  cmd.command('clear <name>').description('Clear burndown history').action(async name => {
    const sessions = await loadSessions();
    await saveSessions(handleClear(sessions, name));
  });

  cmd.command('filter <minRate>').description('Filter by min burn rate (tabs/day)').action(async minRate => {
    const sessions = await loadSessions();
    handleFilterByMin(sessions, parseFloat(minRate));
  });

  cmd.command('sort').description('Sort sessions by burn rate').action(async () => {
    const sessions = await loadSessions();
    handleSort(sessions);
  });
}

module.exports = { handleRecord, handleClear, handleShow, handleFilterByMin, handleSort, registerBurndownCmd };
