const { setSignal, clearSignal, getSignal, setSignalByName, filterBySignal, sortBySignal } = require('../signal');

function handleSetSignal(sessions, id, signal) {
  const updated = setSignalByName(sessions, id, signal);
  if (!updated) throw new Error(`Session "${id}" not found`);
  return updated;
}

function handleClearSignal(sessions, id) {
  const session = sessions.find(s => s.id === id || s.name === id);
  if (!session) throw new Error(`Session "${id}" not found`);
  return clearSignal(session);
}

function handleShowSignal(sessions, id) {
  const session = sessions.find(s => s.id === id || s.name === id);
  if (!session) throw new Error(`Session "${id}" not found`);
  const signal = getSignal(session);
  return signal ? `Signal for "${session.name}": ${signal}` : `No signal set for "${session.name}"`;
}

function handleFilterBySignal(sessions, signal) {
  return filterBySignal(sessions, signal);
}

function handleSortBySignal(sessions) {
  return sortBySignal(sessions);
}

function registerSignalCmd(program, { loadSessions, saveSessions }) {
  const cmd = program.command('signal').description('Manage session signals');

  cmd.command('set <id> <signal>')
    .description('Set signal on a session')
    .action((id, signal) => {
      const sessions = loadSessions();
      const updated = handleSetSignal(sessions, id, signal);
      const idx = sessions.findIndex(s => s.id === updated.id);
      sessions[idx] = updated;
      saveSessions(sessions);
      console.log(`Signal "${signal}" set on "${updated.name}"`);
    });

  cmd.command('clear <id>')
    .description('Clear signal from a session')
    .action((id) => {
      const sessions = loadSessions();
      const updated = handleClearSignal(sessions, id);
      const idx = sessions.findIndex(s => s.id === updated.id);
      sessions[idx] = updated;
      saveSessions(sessions);
      console.log(`Signal cleared from "${updated.name}"`);
    });

  cmd.command('show <id>')
    .description('Show signal for a session')
    .action((id) => {
      const sessions = loadSessions();
      console.log(handleShowSignal(sessions, id));
    });

  cmd.command('filter <signal>')
    .description('Filter sessions by signal')
    .action((signal) => {
      const sessions = loadSessions();
      const results = handleFilterBySignal(sessions, signal);
      results.forEach(s => console.log(`${s.name} [${s.signal}]`));
    });

  cmd.command('sort')
    .description('Sort sessions by signal')
    .action(() => {
      const sessions = loadSessions();
      handleSortBySignal(sessions).forEach(s => console.log(`${s.name} [${s.signal || 'none'}]`));
    });
}

module.exports = { handleSetSignal, handleClearSignal, handleShowSignal, handleFilterBySignal, handleSortBySignal, registerSignalCmd };
