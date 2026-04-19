const { loadSessions, saveSessions } = require('../sessionStore');
const {
  addToBlocklist,
  removeFromBlocklist,
  clearBlocklist,
  getBlocklist,
  filterBlockedTabs
} = require('../blocklist');

function handleAdd(name, pattern, file) {
  const sessions = loadSessions(file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) return console.error(`Session "${name}" not found.`);
  sessions[idx] = addToBlocklist(sessions[idx], pattern);
  saveSessions(sessions, file);
  console.log(`Added "${pattern}" to blocklist of "${name}".`);
}

function handleRemove(name, pattern, file) {
  const sessions = loadSessions(file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) return console.error(`Session "${name}" not found.`);
  sessions[idx] = removeFromBlocklist(sessions[idx], pattern);
  saveSessions(sessions, file);
  console.log(`Removed "${pattern}" from blocklist of "${name}".`);
}

function handleClear(name, file) {
  const sessions = loadSessions(file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) return console.error(`Session "${name}" not found.`);
  sessions[idx] = clearBlocklist(sessions[idx]);
  saveSessions(sessions, file);
  console.log(`Cleared blocklist for "${name}".`);
}

function handleShow(name, file) {
  const sessions = loadSessions(file);
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session "${name}" not found.`);
  const list = getBlocklist(session);
  if (!list.length) return console.log('No blocked patterns.');
  list.forEach(p => console.log(` - ${p}`));
}

function handleFilterTabs(name, file) {
  const sessions = loadSessions(file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) return console.error(`Session "${name}" not found.`);
  const before = (sessions[idx].tabs || []).length;
  sessions[idx] = filterBlockedTabs(sessions[idx]);
  const after = (sessions[idx].tabs || []).length;
  saveSessions(sessions, file);
  console.log(`Filtered ${before - after} blocked tab(s) from "${name}".`);
}

function registerBlocklistCmd(program, file) {
  const cmd = program.command('blocklist').description('Manage URL blocklists for sessions');
  cmd.command('add <name> <pattern>').action((name, pattern) => handleAdd(name, pattern, file));
  cmd.command('remove <name> <pattern>').action((name, pattern) => handleRemove(name, pattern, file));
  cmd.command('clear <name>').action(name => handleClear(name, file));
  cmd.command('show <name>').action(name => handleShow(name, file));
  cmd.command('filter <name>').description('Remove blocked tabs from session').action(name => handleFilterTabs(name, file));
}

module.exports = { handleAdd, handleRemove, handleClear, handleShow, handleFilterTabs, registerBlocklistCmd };
