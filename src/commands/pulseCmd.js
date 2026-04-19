const {
  recordPulseByName,
  clearPulse,
  getLastPulse,
  getPulseCount,
  getPulseRate,
  sortByPulse,
  filterByMinPulse
} = require('../pulse');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleRecord(args) {
  const name = args._[1];
  if (!name) return console.error('Usage: pulse record <name>');
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? require('../pulse').recordPulse(s) : s);
  if (!updated.find(s => s.name === name)) return console.error(`Session "${name}" not found`);
  saveSessions(updated);
  console.log(`Pulse recorded for "${name}"`);
}

function handleClear(args) {
  const name = args._[1];
  if (!name) return console.error('Usage: pulse clear <name>');
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? clearPulse(s) : s);
  saveSessions(updated);
  console.log(`Pulse cleared for "${name}"`);
}

function handleShow(args) {
  const name = args._[1];
  if (!name) return console.error('Usage: pulse show <name>');
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session "${name}" not found`);
  const last = getLastPulse(session);
  const count = getPulseCount(session);
  const rate = getPulseRate(session);
  console.log(`Session: ${name}`);
  console.log(`  Total pulses: ${count}`);
  console.log(`  Last pulse: ${last ? new Date(last).toISOString() : 'never'}`);
  console.log(`  Pulses (24h): ${rate}`);
}

function handleSort() {
  const sessions = loadSessions();
  const sorted = sortByPulse(sessions);
  sorted.forEach(s => {
    const last = getLastPulse(s);
    console.log(`${s.name} — last: ${last ? new Date(last).toISOString() : 'never'} (${getPulseCount(s)} total)`);
  });
}

function handleFilterByMin(args) {
  const min = parseInt(args._[1], 10);
  if (isNaN(min)) return console.error('Usage: pulse filter-min <count>');
  const sessions = loadSessions();
  const result = filterByMinPulse(sessions, min);
  if (!result.length) return console.log('No sessions match.');
  result.forEach(s => console.log(`${s.name} (${getPulseCount(s)} pulses)`));
}

function registerPulseCmd(program) {
  program
    .command('pulse <action> [name]')
    .description('Track session activity pulse')
    .action((action, name) => {
      const args = { _: [action, name] };
      if (action === 'record') handleRecord(args);
      else if (action === 'clear') handleClear(args);
      else if (action === 'show') handleShow(args);
      else if (action === 'sort') handleSort();
      else if (action === 'filter-min') handleFilterByMin({ _: ['filter-min', name] });
      else console.error(`Unknown pulse action: ${action}`);
    });
}

module.exports = { handleRecord, handleClear, handleShow, handleSort, handleFilterByMin, registerPulseCmd };
