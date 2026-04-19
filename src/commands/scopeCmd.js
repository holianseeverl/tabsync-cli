const { isValidScope, setScope, clearScope, setScopeByName, getScope, filterByScope, sortByScope, listScopes } = require('../scope');

function handleSetScope(sessions, name, scope) {
  if (!isValidScope(scope)) {
    console.error(`Invalid scope "${scope}". Valid: ${listScopes().join(', ')}`);
    return sessions;
  }
  const updated = setScopeByName(sessions, name, scope);
  const found = updated.find(s => s.name === name);
  if (!found) { console.error(`Session "${name}" not found.`); return sessions; }
  console.log(`Scope set to "${scope}" for session "${name}".`);
  return updated;
}

function handleClearScope(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.error(`Session "${name}" not found.`); return sessions; }
  const updated = sessions.map(s => s.name === name ? clearScope(s) : s);
  console.log(`Scope cleared for session "${name}".`);
  return updated;
}

function handleShowScope(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found.`); return; }
  const scope = getScope(session);
  console.log(scope ? `Scope: ${scope}` : `No scope set for "${name}".`);
}

function handleFilterByScope(sessions, scope) {
  const results = filterByScope(sessions, scope);
  if (!results.length) { console.log(`No sessions with scope "${scope}".`); return; }
  results.forEach(s => console.log(`  ${s.name} [${s.scope}]`));
}

function handleSortByScope(sessions) {
  const sorted = sortByScope(sessions);
  sorted.forEach(s => console.log(`  ${s.name} — ${s.scope || '(none)'}`))
  return sorted;
}

function registerScopeCmd(program, sessions, save) {
  const cmd = program.command('scope').description('Manage session scopes');

  cmd.command('set <name> <scope>').description('Set scope for a session')
    .action((name, scope) => save(handleSetScope(sessions(), name, scope)));

  cmd.command('clear <name>').description('Clear scope from a session')
    .action(name => save(handleClearScope(sessions(), name)));

  cmd.command('show <name>').description('Show scope of a session')
    .action(name => handleShowScope(sessions(), name));

  cmd.command('filter <scope>').description('Filter sessions by scope')
    .action(scope => handleFilterByScope(sessions(), scope));

  cmd.command('sort').description('Sort sessions by scope')
    .action(() => handleSortByScope(sessions()));

  cmd.command('list').description('List valid scopes')
    .action(() => console.log(listScopes().join(', ')));
}

module.exports = { handleSetScope, handleClearScope, handleShowScope, handleFilterByScope, handleSortByScope, registerScopeCmd };
