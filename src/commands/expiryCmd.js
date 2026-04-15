const { setExpiry, clearExpiry, listExpired, listActive, purgeExpired } = require('../expiry');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetExpiry(name, dateStr, options) {
  const sessions = loadSessions(options.file);
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error(`Invalid date: ${dateStr}`);
    process.exit(1);
  }
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: ${name}`);
    process.exit(1);
  }
  const updated = setExpiry(sessions, session.id, date.toISOString());
  saveSessions(updated, options.file);
  console.log(`Expiry set for "${name}": ${date.toISOString()}`);
}

function handleClearExpiry(name, options) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: ${name}`);
    process.exit(1);
  }
  const updated = clearExpiry(sessions, session.id);
  saveSessions(updated, options.file);
  console.log(`Expiry cleared for "${name}"`);
}

function handleListExpired(options) {
  const sessions = loadSessions(options.file);
  const expired = listExpired(sessions);
  if (expired.length === 0) {
    console.log('No expired sessions.');
    return;
  }
  expired.forEach(s => console.log(`[EXPIRED] ${s.name} — expired: ${s.expiresAt}`));
}

function handleListActive(options) {
  const sessions = loadSessions(options.file);
  const active = listActive(sessions);
  if (active.length === 0) {
    console.log('No active sessions.');
    return;
  }
  active.forEach(s => {
    const expiry = s.expiresAt ? ` (expires: ${s.expiresAt})` : '';
    console.log(`${s.name}${expiry}`);
  });
}

function handlePurgeExpired(options) {
  const sessions = loadSessions(options.file);
  const before = sessions.length;
  const updated = purgeExpired(sessions);
  const removed = before - updated.length;
  saveSessions(updated, options.file);
  console.log(`Purged ${removed} expired session(s).`);
}

function registerExpiryCmd(program) {
  const cmd = program.command('expiry').description('Manage session expiry');

  cmd
    .command('set <name> <date>')
    .description('Set expiry date for a session (ISO 8601 or parseable date)')
    .option('-f, --file <path>', 'sessions file', 'sessions.json')
    .action((name, date, opts) => handleSetExpiry(name, date, opts));

  cmd
    .command('clear <name>')
    .description('Clear expiry from a session')
    .option('-f, --file <path>', 'sessions file', 'sessions.json')
    .action((name, opts) => handleClearExpiry(name, opts));

  cmd
    .command('list-expired')
    .description('List all expired sessions')
    .option('-f, --file <path>', 'sessions file', 'sessions.json')
    .action(opts => handleListExpired(opts));

  cmd
    .command('list-active')
    .description('List all non-expired sessions')
    .option('-f, --file <path>', 'sessions file', 'sessions.json')
    .action(opts => handleListActive(opts));

  cmd
    .command('purge')
    .description('Remove all expired sessions')
    .option('-f, --file <path>', 'sessions file', 'sessions.json')
    .action(opts => handlePurgeExpired(opts));
}

module.exports = {
  handleSetExpiry,
  handleClearExpiry,
  handleListExpired,
  handleListActive,
  handlePurgeExpired,
  registerExpiryCmd
};
