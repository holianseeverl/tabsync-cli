const { recordVelocityByName, getVelocity, clearVelocity, computeRate, sortByVelocity } = require('../velocity');

function handleRecord(sessions, name, action) {
  recordVelocityByName(sessions, name, action);
  console.log(`Recorded '${action}' for session '${name}'.`);
  return sessions;
}

function handleShow(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.log('Session not found: ' + name); return; }
  const rate = computeRate(session);
  const entries = getVelocity(session);
  console.log(`Velocity for '${name}':`);
  console.log(`  Total entries: ${entries.length}`);
  console.log(`  Last hour — adds: ${rate.adds}, removes: ${rate.removes}, net: ${rate.net}`);
}

function handleClear(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.log('Session not found: ' + name); return sessions; }
  clearVelocity(session);
  console.log(`Cleared velocity for '${name}'.`);
  return sessions;
}

function handleSort(sessions) {
  const sorted = sortByVelocity(sessions);
  if (!sorted.length) { console.log('No sessions.'); return; }
  sorted.forEach((s, i) => {
    const rate = computeRate(s);
    console.log(`${i + 1}. ${s.name} (activity: ${rate.total}, net: ${rate.net})`);
  });
}

function registerVelocityCmd(program, sessions, save) {
  const cmd = program.command('velocity').description('Track tab add/remove velocity');

  cmd.command('record <name> <action>')
    .description('Record an add or remove action for a session')
    .action((name, action) => { save(handleRecord(sessions(), name, action)); });

  cmd.command('show <name>')
    .description('Show velocity stats for a session')
    .action((name) => { handleShow(sessions(), name); });

  cmd.command('clear <name>')
    .description('Clear velocity history for a session')
    .action((name) => { save(handleClear(sessions(), name)); });

  cmd.command('sort')
    .description('Sort sessions by velocity')
    .action(() => { handleSort(sessions()); });
}

module.exports = { handleRecord, handleShow, handleClear, handleSort, registerVelocityCmd };
