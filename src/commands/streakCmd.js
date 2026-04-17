const { incrementStreak, clearStreak, filterByMinStreak, sortByStreak, getStreak } = require('../streak');

function handleIncrementStreak(sessions, name, now) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  const updated = sessions.map(s => s.name === name ? incrementStreak(s, now) : s);
  const streak = updated[idx].streak;
  console.log(`Streak for "${name}": ${streak.count} day(s). Last accessed: ${streak.lastAccessed}`);
  return updated;
}

function handleClearStreak(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  const updated = sessions.map(s => s.name === name ? clearStreak(s) : s);
  console.log(`Streak cleared for "${name}".`);
  return updated;
}

function handleShowStreak(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const streak = getStreak(session);
  console.log(`"${name}" streak: ${streak.count} day(s), last accessed: ${streak.lastAccessed || 'never'}`);
}

function handleFilterByMinStreak(sessions, min) {
  const results = filterByMinStreak(sessions, min);
  if (!results.length) {
    console.log(`No sessions with streak >= ${min}.`);
    return;
  }
  results.forEach(s => console.log(`  ${s.name}: ${s.streak.count} day(s)`));
}

function handleSortByStreak(sessions) {
  const sorted = sortByStreak(sessions);
  sorted.forEach(s => console.log(`  ${s.name}: ${s.streak?.count || 0} day(s)`));
  return sorted;
}

function registerStreakCmd(program, sessions, persist) {
  const cmd = program.command('streak').description('Manage session access streaks');

  cmd.command('bump <name>').description('Increment streak for a session').action(name => {
    const updated = handleIncrementStreak(sessions, name);
    persist(updated);
  });

  cmd.command('clear <name>').description('Clear streak for a session').action(name => {
    const updated = handleClearStreak(sessions, name);
    persist(updated);
  });

  cmd.command('show <name>').description('Show streak for a session').action(name => {
    handleShowStreak(sessions, name);
  });

  cmd.command('filter <min>').description('Filter sessions by minimum streak').action(min => {
    handleFilterByMinStreak(sessions, parseInt(min, 10));
  });

  cmd.command('sort').description('Sort sessions by streak descending').action(() => {
    handleSortByStreak(sessions);
  });
}

module.exports = { handleIncrementStreak, handleClearStreak, handleShowStreak, handleFilterByMinStreak, handleSortByStreak, registerStreakCmd };
