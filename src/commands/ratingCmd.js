// ratingCmd.js — CLI command handler for session ratings

const { loadSessions, saveSessions } = require('../sessionStore');
const {
  rateSession,
  clearRating,
  rateSessionByName,
  filterByRating,
  sortByRating,
  getRating,
} = require('../rating');

function handleRate(name, rating, opts = {}) {
  const sessions = loadSessions();
  const updated = rateSessionByName(sessions, name, Number(rating));
  saveSessions(updated);
  console.log(`Rated "${name}" ${rating} star(s).`);
}

function handleClearRating(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session not found: ${name}`);
    process.exit(1);
  }
  const updated = clearRating(sessions, session.id);
  saveSessions(updated);
  console.log(`Cleared rating for "${name}".`);
}

function handleFilterByRating(min) {
  const sessions = loadSessions();
  const results = filterByRating(sessions, Number(min));
  if (results.length === 0) {
    console.log(`No sessions rated ${min} or above.`);
    return;
  }
  results.forEach(s => {
    console.log(`[${s.rating}★] ${s.name} (${s.tabs.length} tabs)`);
  });
}

function handleSortByRating(order = 'desc') {
  const sessions = loadSessions();
  const sorted = sortByRating(sessions, order);
  sorted.forEach(s => {
    const stars = s.rating ? `${s.rating}★` : 'unrated';
    console.log(`[${stars}] ${s.name} (${s.tabs.length} tabs)`);
  });
}

function registerRatingCmd(program) {
  const cmd = program.command('rating').description('Manage session star ratings');

  cmd
    .command('set <name> <stars>')
    .description('Rate a session (1–5 stars)')
    .action((name, stars) => handleRate(name, stars));

  cmd
    .command('clear <name>')
    .description('Remove rating from a session')
    .action(name => handleClearRating(name));

  cmd
    .command('filter <minStars>')
    .description('List sessions with rating >= minStars')
    .action(min => handleFilterByRating(min));

  cmd
    .command('sort')
    .description('List sessions sorted by rating')
    .option('--asc', 'Sort ascending')
    .action(opts => handleSortByRating(opts.asc ? 'asc' : 'desc'));
}

module.exports = {
  handleRate,
  handleClearRating,
  handleFilterByRating,
  handleSortByRating,
  registerRatingCmd,
};
