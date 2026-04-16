const { setBadge, clearBadge, setBadgeByName, filterByBadge, getBadge, listBadges, isValidBadge } = require('../badge');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetBadge(name, badge, file) {
  const sessions = loadSessions(file);
  if (!isValidBadge(badge)) {
    console.error(`Invalid badge "${badge}". Valid: ${listBadges().join(', ')}`);
    return;
  }
  const updated = setBadgeByName(sessions, name, badge);
  saveSessions(file, updated);
  console.log(`Badge "${badge}" set on session "${name}".`);
}

function handleClearBadge(id, file) {
  const sessions = loadSessions(file);
  const updated = clearBadge(sessions, id);
  saveSessions(file, updated);
  console.log(`Badge cleared from session ${id}.`);
}

function handleFilterByBadge(badge, file) {
  const sessions = loadSessions(file);
  const results = filterByBadge(sessions, badge);
  if (results.length === 0) {
    console.log(`No sessions with badge "${badge}".`);
  } else {
    results.forEach(s => console.log(`[${s.badge}] ${s.name} (${s.id})`));
  }
}

function handleShowBadge(id, file) {
  const sessions = loadSessions(file);
  const badge = getBadge(sessions, id);
  console.log(badge ? `Session ${id} badge: ${badge}` : `Session ${id} has no badge.`);
}

function registerBadgeCmd(program, file) {
  const cmd = program.command('badge').description('Manage session badges');

  cmd.command('set <name> <badge>').description('Set a badge on a session by name')
    .action((name, badge) => handleSetBadge(name, badge, file));

  cmd.command('clear <id>').description('Clear badge from a session')
    .action(id => handleClearBadge(id, file));

  cmd.command('filter <badge>').description('List sessions with a given badge')
    .action(badge => handleFilterByBadge(badge, file));

  cmd.command('show <id>').description('Show badge for a session')
    .action(id => handleShowBadge(id, file));

  cmd.command('list-badges').description('List all valid badge types')
    .action(() => console.log(listBadges().join(', ')));
}

module.exports = { handleSetBadge, handleClearBadge, handleFilterByBadge, handleShowBadge, registerBadgeCmd };
