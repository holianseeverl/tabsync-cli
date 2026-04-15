const { colorSession, uncolorSession, filterByColor, getSessionColor } = require('../color');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleColor(sessionId, color, options = {}) {
  const sessions = loadSessions(options.file);
  let updated;
  try {
    updated = colorSession(sessions, sessionId, color);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  if (updated === sessions) {
    console.error(`Session '${sessionId}' not found.`);
    process.exit(1);
  }
  saveSessions(updated, options.file);
  console.log(`Session '${sessionId}' colored '${color}'.`);
}

function handleUncolor(sessionId, options = {}) {
  const sessions = loadSessions(options.file);
  const updated = uncolorSession(sessions, sessionId);
  saveSessions(updated, options.file);
  console.log(`Color removed from session '${sessionId}'.`);
}

function handleFilterByColor(color, options = {}) {
  const sessions = loadSessions(options.file);
  const results = filterByColor(sessions, color);
  if (results.length === 0) {
    console.log(`No sessions with color '${color}'.`);
    return;
  }
  results.forEach(s => {
    const tabCount = (s.tabs || []).length;
    console.log(`[${s.color}] ${s.name} (${tabCount} tab${tabCount !== 1 ? 's' : ''}) — id: ${s.id}`);
  });
}

function handleGetColor(sessionId, options = {}) {
  const sessions = loadSessions(options.file);
  const color = getSessionColor(sessions, sessionId);
  if (color === null) {
    console.log(`Session '${sessionId}' has no color set.`);
  } else {
    console.log(`Session '${sessionId}' color: ${color}`);
  }
}

function registerColorCmd(program) {
  const cmd = program.command('color').description('Manage session colors');

  cmd
    .command('set <sessionId> <color>')
    .description('Set a color for a session')
    .option('-f, --file <path>', 'sessions file path')
    .action((sessionId, color, opts) => handleColor(sessionId, color, opts));

  cmd
    .command('remove <sessionId>')
    .description('Remove color from a session')
    .option('-f, --file <path>', 'sessions file path')
    .action((sessionId, opts) => handleUncolor(sessionId, opts));

  cmd
    .command('filter <color>')
    .description('List sessions with a given color')
    .option('-f, --file <path>', 'sessions file path')
    .action((color, opts) => handleFilterByColor(color, opts));

  cmd
    .command('get <sessionId>')
    .description('Show the color of a session')
    .option('-f, --file <path>', 'sessions file path')
    .action((sessionId, opts) => handleGetColor(sessionId, opts));
}

module.exports = { registerColorCmd, handleColor, handleUncolor, handleFilterByColor, handleGetColor };
