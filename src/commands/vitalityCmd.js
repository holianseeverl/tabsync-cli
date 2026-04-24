const { scoreVitality, sortByVitality, filterByMinVitality, getVitality } = require('../vitality');

function handleShowVitality(sessions, sessionName) {
  const session = sessions.find(s => s.name === sessionName);
  if (!session) {
    console.log(`Session "${sessionName}" not found.`);
    return;
  }
  const v = getVitality(session);
  console.log(`Vitality for "${session.name}": ${v}`);
}

function handleSortByVitality(sessions) {
  if (!sessions.length) {
    console.log('No sessions found.');
    return;
  }
  const scored = scoreVitality(sessions);
  const sorted = sortByVitality(scored);
  sorted.forEach(s => {
    console.log(`[${s.vitality}] ${s.name}`);
  });
}

function handleFilterByMinVitality(sessions, min) {
  const threshold = parseInt(min, 10);
  if (isNaN(threshold)) {
    console.log('Invalid minimum vitality value.');
    return;
  }
  const scored = scoreVitality(sessions);
  const result = filterByMinVitality(scored, threshold);
  if (!result.length) {
    console.log(`No sessions with vitality >= ${threshold}.`);
    return;
  }
  result.forEach(s => {
    console.log(`[${s.vitality}] ${s.name}`);
  });
}

function registerVitalityCmd(program, loadSessions) {
  const cmd = program.command('vitality').description('Manage session vitality scores');

  cmd
    .command('show <name>')
    .description('Show vitality score for a session')
    .action(name => {
      const sessions = loadSessions();
      handleShowVitality(sessions, name);
    });

  cmd
    .command('sort')
    .description('List all sessions sorted by vitality')
    .action(() => {
      const sessions = loadSessions();
      handleSortByVitality(sessions);
    });

  cmd
    .command('filter <min>')
    .description('Filter sessions by minimum vitality score')
    .action(min => {
      const sessions = loadSessions();
      handleFilterByMinVitality(sessions, min);
    });
}

module.exports = {
  handleShowVitality,
  handleSortByVitality,
  handleFilterByMinVitality,
  registerVitalityCmd
};
