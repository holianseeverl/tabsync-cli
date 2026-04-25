const { computeGravity, sortByGravity, filterByMinGravity, gravityLevel } = require('../gravity');

function handleShowGravity(sessions, sessionName) {
  const session = sessions.find(s => s.name === sessionName);
  if (!session) {
    console.log(`Session "${sessionName}" not found.`);
    return;
  }
  const g = computeGravity(session);
  const level = gravityLevel(session);
  console.log(`${session.name}: gravity=${g} (${level})`);
}

function handleSortByGravity(sessions) {
  const sorted = sortByGravity(sessions);
  if (sorted.length === 0) {
    console.log('No sessions found.');
    return;
  }
  sorted.forEach(s => {
    const g = computeGravity(s);
    const level = gravityLevel(s);
    console.log(`${s.name}: ${g} [${level}]`);
  });
}

function handleFilterByMinGravity(sessions, min) {
  const threshold = parseFloat(min);
  if (isNaN(threshold) || threshold < 0 || threshold > 1) {
    console.log('Threshold must be a number between 0 and 1.');
    return;
  }
  const results = filterByMinGravity(sessions, threshold);
  if (results.length === 0) {
    console.log(`No sessions with gravity >= ${threshold}.`);
    return;
  }
  results.forEach(s => console.log(`${s.name}: ${computeGravity(s)}`));
}

function registerGravityCmd(program, loadSessions) {
  const cmd = program.command('gravity').description('Session gravity scoring');

  cmd
    .command('show <name>')
    .description('Show gravity score for a session')
    .action(name => handleShowGravity(loadSessions(), name));

  cmd
    .command('sort')
    .description('Sort all sessions by gravity (descending)')
    .action(() => handleSortByGravity(loadSessions()));

  cmd
    .command('filter <min>')
    .description('Filter sessions by minimum gravity score (0–1)')
    .action(min => handleFilterByMinGravity(loadSessions(), min));
}

module.exports = { handleShowGravity, handleSortByGravity, handleFilterByMinGravity, registerGravityCmd };
