const { isValidConfidence, setConfidence, clearConfidence, setConfidenceByName, getConfidence } = require('../confidence');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetConfidence(name, value, file) {
  const level = parseInt(value, 10);
  if (!isValidConfidence(level)) {
    console.error(`Invalid confidence value: ${value}. Must be 0-100.`);
    return;
  }
  const sessions = loadSessions(file);
  const updated = setConfidenceByName(sessions, name, level);
  if (updated === sessions) {
    console.error(`Session not found: ${name}`);
    return;
  }
  saveSessions(file, updated);
  console.log(`Set confidence of "${name}" to ${level}.`);
}

function handleClearConfidence(name, file) {
  const sessions = loadSessions(file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.error(`Session not found: ${name}`);
    return;
  }
  const updated = sessions.map(s => s.name === name ? clearConfidence(s) : s);
  saveSessions(file, updated);
  console.log(`Cleared confidence for "${name}".`);
}

function handleShowConfidence(name, file) {
  const sessions = loadSessions(file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: ${name}`);
    return;
  }
  const val = getConfidence(session);
  console.log(val !== null ? `Confidence for "${name}": ${val}` : `No confidence set for "${name}".`);
}

function handleFilterByConfidence(min, max, file) {
  const lo = parseInt(min, 10);
  const hi = max !== undefined ? parseInt(max, 10) : 100;
  const sessions = loadSessions(file);
  const filtered = sessions.filter(s => {
    const c = getConfidence(s);
    return c !== null && c >= lo && c <= hi;
  });
  if (!filtered.length) {
    console.log('No sessions found in that confidence range.');
    return;
  }
  filtered.forEach(s => console.log(`${s.name} — confidence: ${s.confidence}`));
}

function registerConfidenceCmd(program, file) {
  const cmd = program.command('confidence').description('Manage session confidence levels');
  cmd.command('set <name> <value>').description('Set confidence (0-100)').action((name, value) => handleSetConfidence(name, value, file));
  cmd.command('clear <name>').description('Clear confidence').action(name => handleClearConfidence(name, file));
  cmd.command('show <name>').description('Show confidence').action(name => handleShowConfidence(name, file));
  cmd.command('filter <min> [max]').description('Filter sessions by confidence range').action((min, max) => handleFilterByConfidence(min, max, file));
}

module.exports = { handleSetConfidence, handleClearConfidence, handleShowConfidence, handleFilterByConfidence, registerConfidenceCmd };
