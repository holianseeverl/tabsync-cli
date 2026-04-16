// progressCmd.js — CLI handlers for progress feature

const { loadSessions, saveSessions } = require('../sessionStore');
const {
  setProgressByName,
  clearProgress,
  getProgress,
  filterByMinProgress,
  filterComplete,
  sortByProgress
} = require('../progress');

function handleSetProgress(name, value) {
  const sessions = loadSessions();
  const num = parseInt(value, 10);
  const updated = setProgressByName(sessions, name, num);
  saveSessions(updated);
  console.log(`Progress for "${name}" set to ${num}%.`);
}

function handleClearProgress(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session not found: ${name}`);
  const updated = clearProgress(sessions, session.id);
  saveSessions(updated);
  console.log(`Progress cleared for "${name}".`);
}

function handleShowProgress(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session not found: ${name}`);
  const p = getProgress(sessions, session.id);
  console.log(p !== null ? `"${name}": ${p}%` : `"${name}": no progress set`);
}

function handleFilterByMin(min) {
  const sessions = loadSessions();
  const results = filterByMinProgress(sessions, parseInt(min, 10));
  if (!results.length) return console.log('No sessions found.');
  results.forEach(s => console.log(`${s.name}: ${s.progress}%`));
}

function handleFilterComplete() {
  const sessions = loadSessions();
  const results = filterComplete(sessions);
  if (!results.length) return console.log('No completed sessions.');
  results.forEach(s => console.log(`${s.name}: 100%`));
}

function handleSortByProgress() {
  const sessions = loadSessions();
  const sorted = sortByProgress(sessions);
  sorted.forEach(s => console.log(`${s.name}: ${s.progress !== undefined ? s.progress + '%' : 'N/A'}`));
}

function registerProgressCmd(program) {
  const cmd = program.command('progress').description('Manage session progress');
  cmd.command('set <name> <value>').description('Set progress (0-100)').action(handleSetProgress);
  cmd.command('clear <name>').description('Clear progress').action(handleClearProgress);
  cmd.command('show <name>').description('Show progress').action(handleShowProgress);
  cmd.command('filter <min>').description('Filter by min progress').action(handleFilterByMin);
  cmd.command('complete').description('List completed sessions').action(handleFilterComplete);
  cmd.command('sort').description('Sort by progress').action(handleSortByProgress);
}

module.exports = { handleSetProgress, handleClearProgress, handleShowProgress, handleFilterByMin, handleFilterComplete, handleSortByProgress, registerProgressCmd };
