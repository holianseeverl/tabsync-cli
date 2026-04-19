const { setTempo, clearTempo, getTempo, setTempoByName, filterByTempo, sortByTempo } = require('../tempo');

function handleSetTempo(sessions, name, tempo) {
  const updated = setTempoByName(sessions, name, tempo);
  if (!updated) throw new Error(`Session "${name}" not found`);
  return updated;
}

function handleClearTempo(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return sessions.map(s => s.name === name ? clearTempo(s) : s);
}

function handleShowTempo(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  const tempo = getTempo(session);
  return tempo ? `${name}: ${tempo}` : `${name}: no tempo set`;
}

function handleFilterByTempo(sessions, tempo) {
  return filterByTempo(sessions, tempo);
}

function handleSortByTempo(sessions) {
  return sortByTempo(sessions);
}

function registerTempoCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('tempo').description('Manage session tempo');

  cmd.command('set <name> <tempo>')
    .description('Set tempo for a session')
    .action((name, tempo) => {
      const sessions = loadSessions();
      const updated = handleSetTempo(sessions, name, tempo);
      saveSessions(updated);
      console.log(`Tempo set to "${tempo}" for "${name}"`);
    });

  cmd.command('clear <name>')
    .description('Clear tempo from a session')
    .action((name) => {
      const sessions = loadSessions();
      const updated = handleClearTempo(sessions, name);
      saveSessions(updated);
      console.log(`Tempo cleared for "${name}"`);
    });

  cmd.command('show <name>')
    .description('Show tempo for a session')
    .action((name) => {
      const sessions = loadSessions();
      console.log(handleShowTempo(sessions, name));
    });

  cmd.command('filter <tempo>')
    .description('Filter sessions by tempo')
    .action((tempo) => {
      const sessions = loadSessions();
      const results = handleFilterByTempo(sessions, tempo);
      results.forEach(s => console.log(`${s.name} [${s.tempo}]`));
    });

  cmd.command('sort')
    .description('Sort sessions by tempo')
    .action(() => {
      const sessions = loadSessions();
      const sorted = handleSortByTempo(sessions);
      sorted.forEach(s => console.log(`${s.name} [${s.tempo || 'none'}]`));
    });
}

module.exports = { handleSetTempo, handleClearTempo, handleShowTempo, handleFilterByTempo, handleSortByTempo, registerTempoCmd };
