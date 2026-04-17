const { setAliasByName, clearAlias, findByAlias, getAlias, listAliases } = require('../alias');

function handleSetAlias(sessions, name, alias) {
  const updated = setAliasByName(sessions, name, alias);
  if (!updated) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  console.log(`Alias "${alias}" set for session "${name}".`);
  return updated;
}

function handleClearAlias(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  const updated = sessions.map(s => s.name === name ? clearAlias(s) : s);
  console.log(`Alias cleared for session "${name}".`);
  return updated;
}

function handleShowAlias(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const alias = getAlias(session);
  if (alias) {
    console.log(`Alias for "${name}": ${alias}`);
  } else {
    console.log(`No alias set for "${name}".`);
  }
}

function handleFindByAlias(sessions, alias) {
  const session = findByAlias(sessions, alias);
  if (!session) {
    console.log(`No session found with alias "${alias}".`);
    return;
  }
  console.log(`Found: ${session.name} (alias: ${alias})`);
}

function handleListAliases(sessions) {
  const aliased = listAliases(sessions);
  if (aliased.length === 0) {
    console.log('No sessions have aliases.');
    return;
  }
  aliased.forEach(s => console.log(`  ${s.name} -> ${s.alias}`));
}

function registerAliasCmd(program, sessions, saveSessions) {
  const alias = program.command('alias').description('Manage session aliases');

  alias.command('set <name> <alias>').description('Set alias for a session').action((name, a) => {
    const updated = handleSetAlias(sessions, name, a);
    saveSessions(updated);
  });

  alias.command('clear <name>').description('Clear alias from a session').action(name => {
    const updated = handleClearAlias(sessions, name);
    saveSessions(updated);
  });

  alias.command('show <name>').description('Show alias for a session').action(name => {
    handleShowAlias(sessions, name);
  });

  alias.command('find <alias>').description('Find session by alias').action(a => {
    handleFindByAlias(sessions, a);
  });

  alias.command('list').description('List all sessions with aliases').action(() => {
    handleListAliases(sessions);
  });
}

module.exports = { handleSetAlias, handleClearAlias, handleShowAlias, handleFindByAlias, handleListAliases, registerAliasCmd };
