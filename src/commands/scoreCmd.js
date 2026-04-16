const { sortByScore, filterByMinScore, scoreSession } = require('../score');
const { loadSessions } = require('../sessionStore');

function handleShowScore(argv) {
  const sessions = loadSessions();
  const target = sessions.find(s => s.name === argv.name || s.id === argv.name);
  if (!target) {
    console.log(`Session not found: ${argv.name}`);
    return;
  }
  const scored = scoreSession(target);
  console.log(`Score for "${scored.name}": ${scored.score}`);
}

function handleSortByScore(argv) {
  const sessions = loadSessions();
  const order = argv.asc ? 'asc' : 'desc';
  const sorted = sortByScore(sessions, order);
  if (sorted.length === 0) {
    console.log('No sessions found.');
    return;
  }
  sorted.forEach(s => console.log(`[${s.score}] ${s.name} (${(s.tabs || []).length} tabs)`));
}

function handleFilterByMinScore(argv) {
  const sessions = loadSessions();
  const min = parseFloat(argv.min);
  if (isNaN(min)) {
    console.log('Invalid minimum score.');
    return;
  }
  const results = filterByMinScore(sessions, min);
  if (results.length === 0) {
    console.log(`No sessions with score >= ${min}.`);
    return;
  }
  results.forEach(s => console.log(`[${s.score}] ${s.name}`));
}

function registerScoreCmd(program) {
  const score = program.command('score').description('Score-based session commands');

  score.command('show <name>').description('Show score for a session').action(name => handleShowScore({ name }));

  score.command('sort').description('Sort sessions by score').option('--asc', 'Sort ascending').action(argv => handleSortByScore(argv));

  score.command('filter').description('Filter sessions by minimum score').requiredOption('--min <value>', 'Minimum score').action(argv => handleFilterByMinScore(argv));
}

module.exports = { handleShowScore, handleSortByScore, handleFilterByMinScore, registerScoreCmd };
