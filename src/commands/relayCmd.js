const { setRelayByName, clearRelay, getRelay, filterByRelay, listRelayTargets, groupByRelay } = require('../relay');

function handleSetRelay(sessions, name, relay) {
  const exists = sessions.find(s => s.name === name);
  if (!exists) { console.log(`Session "${name}" not found.`); return sessions; }
  const updated = setRelayByName(sessions, name, relay);
  console.log(`Relay for "${name}" set to "${relay}".`);
  return updated;
}

function handleClearRelay(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.log(`Session "${name}" not found.`); return sessions; }
  const updated = sessions.map(s => s.name === name ? clearRelay(s) : s);
  console.log(`Relay cleared for "${name}".`);
  return updated;
}

function handleShowRelay(sessions, name) {
  const s = sessions.find(s => s.name === name);
  if (!s) { console.log(`Session "${name}" not found.`); return; }
  const relay = getRelay(s);
  console.log(relay ? `Relay: ${relay}` : 'No relay set.');
}

function handleFilterByRelay(sessions, relay) {
  const results = filterByRelay(sessions, relay);
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`  ${s.name}`));
}

function handleListTargets(sessions) {
  const targets = listRelayTargets(sessions);
  if (!targets.length) { console.log('No relay targets defined.'); return; }
  targets.forEach(t => console.log(`  ${t}`));
}

function handleGroupByRelay(sessions) {
  const groups = groupByRelay(sessions);
  for (const [key, items] of Object.entries(groups)) {
    console.log(`[${key}]`);
    items.forEach(s => console.log(`  ${s.name}`));
  }
}

function registerRelayCmd(program, loadSessions, saveSessions) {
  const relay = program.command('relay').description('Manage session relay targets');

  relay.command('set <name> <target>').action((name, target) => {
    const sessions = loadSessions();
    saveSessions(handleSetRelay(sessions, name, target));
  });

  relay.command('clear <name>').action(name => {
    const sessions = loadSessions();
    saveSessions(handleClearRelay(sessions, name));
  });

  relay.command('show <name>').action(name => handleShowRelay(loadSessions(), name));

  relay.command('filter <target>').action(target => handleFilterByRelay(loadSessions(), target));

  relay.command('targets').action(() => handleListTargets(loadSessions()));

  relay.command('group').action(() => handleGroupByRelay(loadSessions()));
}

module.exports = { handleSetRelay, handleClearRelay, handleShowRelay, handleFilterByRelay, handleListTargets, handleGroupByRelay, registerRelayCmd };
