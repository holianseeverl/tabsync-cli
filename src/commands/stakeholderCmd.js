const { addStakeholderByName, removeStakeholder, getStakeholders, filterByStakeholder, filterByRole, listAllStakeholders, VALID_ROLES } = require('../stakeholder');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleAddStakeholder(sessionName, name, role) {
  const sessions = loadSessions();
  const target = sessions.find(s => s.name === sessionName);
  if (!target) return console.log(`Session not found: ${sessionName}`);
  const updated = addStakeholderByName(sessions, sessionName, name, role);
  saveSessions(updated);
  console.log(`Added stakeholder '${name}' (${role || 'observer'}) to '${sessionName}'`);
}

function handleRemoveStakeholder(sessionName, name) {
  const sessions = loadSessions();
  const target = sessions.find(s => s.name === sessionName);
  if (!target) return console.log(`Session not found: ${sessionName}`);
  const updated = sessions.map(s => s.name === sessionName ? removeStakeholder(s, name) : s);
  saveSessions(updated);
  console.log(`Removed stakeholder '${name}' from '${sessionName}'`);
}

function handleShowStakeholders(sessionName) {
  const sessions = loadSessions();
  const target = sessions.find(s => s.name === sessionName);
  if (!target) return console.log(`Session not found: ${sessionName}`);
  const list = getStakeholders(target);
  if (!list.length) return console.log('No stakeholders.');
  list.forEach(sh => console.log(`  ${sh.name} — ${sh.role}`));
}

function handleFilterByStakeholder(name) {
  const sessions = loadSessions();
  const results = filterByStakeholder(sessions, name);
  if (!results.length) return console.log('No sessions found.');
  results.forEach(s => console.log(`  ${s.name}`));
}

function handleFilterByRole(role) {
  const sessions = loadSessions();
  const results = filterByRole(sessions, role);
  if (!results.length) return console.log('No sessions found.');
  results.forEach(s => console.log(`  ${s.name}`));
}

function handleListAll() {
  const sessions = loadSessions();
  const list = listAllStakeholders(sessions);
  if (!list.length) return console.log('No stakeholders found.');
  list.forEach(sh => console.log(`  ${sh.name}: ${sh.roles.join(', ')}`))
}

function registerStakeholderCmd(program) {
  const cmd = program.command('stakeholder').description('Manage session stakeholders');
  cmd.command('add <session> <name> [role]').description(`Add stakeholder (roles: ${VALID_ROLES.join(', ')})`).action(handleAddStakeholder);
  cmd.command('remove <session> <name>').description('Remove a stakeholder').action(handleRemoveStakeholder);
  cmd.command('show <session>').description('Show stakeholders for a session').action(handleShowStakeholders);
  cmd.command('filter <name>').description('Filter sessions by stakeholder name').action(handleFilterByStakeholder);
  cmd.command('role <role>').description('Filter sessions by stakeholder role').action(handleFilterByRole);
  cmd.command('list-all').description('List all stakeholders across sessions').action(handleListAll);
}

module.exports = { handleAddStakeholder, handleRemoveStakeholder, handleShowStakeholders, handleFilterByStakeholder, handleFilterByRole, handleListAll, registerStakeholderCmd };
