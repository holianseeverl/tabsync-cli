const { setOwnerByName, clearOwner, getOwner, filterByOwner, listOwners, transferOwner } = require('../ownership');

function handleSetOwner(sessions, name, owner, log = console.log) {
  const updated = setOwnerByName(sessions, name, owner);
  const changed = updated.find(s => s.name === name);
  if (!changed) { log(`Session "${name}" not found.`); return sessions; }
  log(`Owner of "${name}" set to "${changed.owner}".`);
  return updated;
}

function handleClearOwner(sessions, name, log = console.log) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { log(`Session "${name}" not found.`); return sessions; }
  const updated = [...sessions];
  updated[idx] = clearOwner(updated[idx]);
  log(`Owner cleared from "${name}".`);
  return updated;
}

function handleShowOwner(sessions, name, log = console.log) {
  const session = sessions.find(s => s.name === name);
  if (!session) { log(`Session "${name}" not found.`); return; }
  const owner = getOwner(session);
  log(owner ? `Owner of "${name}": ${owner}` : `"${name}" has no owner.`);
}

function handleFilterByOwner(sessions, owner, log = console.log) {
  const results = filterByOwner(sessions, owner);
  if (!results.length) { log(`No sessions owned by "${owner}".`); return; }
  results.forEach(s => log(`- ${s.name}`));
}

function handleListOwners(sessions, log = console.log) {
  const owners = listOwners(sessions);
  if (!owners.length) { log('No owners assigned.'); return; }
  owners.forEach(o => log(`- ${o}`));
}

function handleTransferOwner(sessions, from, to, log = console.log) {
  const updated = transferOwner(sessions, from, to);
  const count = updated.filter(s => s.owner === to && sessions.find(o => o.id === s.id && o.owner === from)).length;
  log(`Transferred ${count} session(s) from "${from}" to "${to}".`);
  return updated;
}

function registerOwnershipCmd(program, sessions, saveSessions) {
  const cmd = program.command('owner').description('Manage session ownership');

  cmd.command('set <name> <owner>').action((name, owner) => {
    const updated = handleSetOwner(sessions, name, owner);
    saveSessions(updated);
  });

  cmd.command('clear <name>').action(name => {
    const updated = handleClearOwner(sessions, name);
    saveSessions(updated);
  });

  cmd.command('show <name>').action(name => handleShowOwner(sessions, name));

  cmd.command('filter <owner>').action(owner => handleFilterByOwner(sessions, owner));

  cmd.command('list').action(() => handleListOwners(sessions));

  cmd.command('transfer <from> <to>').action((from, to) => {
    const updated = handleTransferOwner(sessions, from, to);
    saveSessions(updated);
  });
}

module.exports = { handleSetOwner, handleClearOwner, handleShowOwner, handleFilterByOwner, handleListOwners, handleTransferOwner, registerOwnershipCmd };
