const { isValidTheme, setThemeByName, clearTheme, filterByTheme, getTheme, listThemes, sortByTheme } = require('../theme');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetTheme(name, theme) {
  const sessions = loadSessions();
  if (!isValidTheme(theme)) {
    console.error(`Invalid theme "${theme}". Valid: ${listThemes().join(', ')}`);
    return;
  }
  const updated = setThemeByName(sessions, name, theme);
  if (updated.every((s, i) => s === sessions[i])) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  saveSessions(updated);
  console.log(`Theme "${theme}" set for session "${name}".`);
}

function handleClearTheme(name) {
  const sessions = loadSessions();
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.log(`Session "${name}" not found.`); return; }
  sessions[idx] = clearTheme(sessions[idx]);
  saveSessions(sessions);
  console.log(`Theme cleared for session "${name}".`);
}

function handleShowTheme(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) { console.log(`Session "${name}" not found.`); return; }
  const theme = getTheme(session);
  console.log(theme ? `Theme: ${theme}` : `No theme set for "${name}".`);
}

function handleFilterByTheme(theme) {
  const sessions = loadSessions();
  const results = filterByTheme(sessions, theme);
  if (!results.length) { console.log(`No sessions with theme "${theme}".`); return; }
  results.forEach(s => console.log(`- ${s.name}`));
}

function handleSortByTheme() {
  const sessions = loadSessions();
  const sorted = sortByTheme(sessions);
  sorted.forEach(s => console.log(`${s.theme || '(none)'.padEnd(10)} ${s.name}`));
}

function handleListThemes() {
  console.log('Available themes:', listThemes().join(', '));
}

function registerThemeCmd(program) {
  const cmd = program.command('theme').description('Manage session themes');
  cmd.command('set <name> <theme>').description('Set theme for a session').action(handleSetTheme);
  cmd.command('clear <name>').description('Clear theme from a session').action(handleClearTheme);
  cmd.command('show <name>').description('Show theme of a session').action(handleShowTheme);
  cmd.command('filter <theme>').description('Filter sessions by theme').action(handleFilterByTheme);
  cmd.command('sort').description('Sort sessions by theme').action(handleSortByTheme);
  cmd.command('list').description('List all valid themes').action(handleListThemes);
}

module.exports = { handleSetTheme, handleClearTheme, handleShowTheme, handleFilterByTheme, handleSortByTheme, registerThemeCmd };
