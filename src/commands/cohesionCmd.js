const {
  computeCohesion,
  setCohesionByName,
  getCohesion,
  sortByCohesion,
  filterByMinCohesion,
} = require('../cohesion');

function handleShowCohesion(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  const score = computeCohesion(session);
  console.log(`Cohesion for "${name}": ${score} (0 = scattered, 1 = tightly focused)`);
  return sessions;
}

function handleComputeAll(sessions) {
  const updated = sessions.map(s => ({
    ...s,
    cohesion: computeCohesion(s),
  }));
  updated.forEach(s => {
    console.log(`  ${s.name}: ${s.cohesion}`);
  });
  return updated;
}

function handleSortByCohesion(sessions, direction = 'desc') {
  const sorted = sortByCohesion(sessions, direction);
  sorted.forEach(s => {
    const score = getCohesion(s);
    console.log(`  [${score}] ${s.name}`);
  });
  return sorted;
}

function handleFilterByMin(sessions, min) {
  const threshold = parseFloat(min);
  if (isNaN(threshold) || threshold < 0 || threshold > 1) {
    console.log('Min cohesion must be a number between 0 and 1.');
    return sessions;
  }
  const filtered = filterByMinCohesion(sessions, threshold);
  if (filtered.length === 0) {
    console.log(`No sessions with cohesion >= ${threshold}.`);
  } else {
    filtered.forEach(s => console.log(`  [${getCohesion(s)}] ${s.name}`));
  }
  return filtered;
}

function registerCohesionCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('cohesion').description('Analyze session cohesion');

  cmd
    .command('show <name>')
    .description('Show cohesion score for a session')
    .action(name => {
      const sessions = loadSessions();
      handleShowCohesion(sessions, name);
    });

  cmd
    .command('compute-all')
    .description('Compute and store cohesion for all sessions')
    .action(() => {
      const sessions = loadSessions();
      const updated = handleComputeAll(sessions);
      saveSessions(updated);
    });

  cmd
    .command('sort')
    .description('Sort sessions by cohesion')
    .option('--asc', 'Sort ascending')
    .action(opts => {
      const sessions = loadSessions();
      handleSortByCohesion(sessions, opts.asc ? 'asc' : 'desc');
    });

  cmd
    .command('filter <min>')
    .description('Filter sessions with cohesion >= min')
    .action(min => {
      const sessions = loadSessions();
      handleFilterByMin(sessions, min);
    });
}

module.exports = {
  handleShowCohesion,
  handleComputeAll,
  handleSortByCohesion,
  handleFilterByMin,
  registerCohesionCmd,
};
