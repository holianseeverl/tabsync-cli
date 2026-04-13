const { loadSessions } = require('../sessionStore');
const { search } = require('../search');

/**
 * Handle the `search` CLI command
 * @param {Object} args - Parsed CLI arguments
 * @param {string} [args.keyword] - Keyword to match against name/URLs
 * @param {string} [args.from] - Start date (ISO string)
 * @param {string} [args.to] - End date (ISO string)
 * @param {number} [args.minTabs] - Minimum number of tabs
 * @param {string} [args.file] - Path to sessions JSON file
 */
async function handleSearch(args) {
  const filePath = args.file || 'sessions.json';

  let sessions;
  try {
    sessions = await loadSessions(filePath);
  } catch (err) {
    console.error(`Failed to load sessions from "${filePath}": ${err.message}`);
    process.exit(1);
  }

  const criteria = {};
  if (args.keyword) criteria.keyword = args.keyword;
  if (args.from) criteria.from = args.from;
  if (args.to) criteria.to = args.to;
  if (args.minTabs !== undefined) criteria.minTabs = args.minTabs;

  const results = search(sessions, criteria);

  if (results.length === 0) {
    console.log('No sessions matched your search criteria.');
    return;
  }

  console.log(`Found ${results.length} session(s):\n`);
  results.forEach(session => {
    const tabCount = Array.isArray(session.tabs) ? session.tabs.length : 0;
    const tags = Array.isArray(session.tags) && session.tags.length
      ? ` [${session.tags.join(', ')}]`
      : '';
    const date = session.createdAt
      ? ` (${new Date(session.createdAt).toLocaleDateString()})`
      : '';
    console.log(`  • ${session.name}${tags}${date} — ${tabCount} tab(s)`);
    if (Array.isArray(session.tabs)) {
      session.tabs.slice(0, 3).forEach(tab => {
        console.log(`      - ${tab.title || tab.url}`);
      });
      if (session.tabs.length > 3) {
        console.log(`      ... and ${session.tabs.length - 3} more`);
      }
    }
    console.log();
  });
}

module.exports = { handleSearch };
