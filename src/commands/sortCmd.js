const { loadSessions, saveSessions } = require('../sessionStore');
const { sort } = require('../sort');

const VALID_SORT_FIELDS = ['date', 'name', 'tabs'];
const VALID_ORDERS = ['asc', 'desc'];

/**
 * Formats a single session entry for display.
 * @param {object} session - The session object.
 * @param {number} index - The 1-based display index.
 * @returns {string} Formatted string for console output.
 */
function formatSessionLine(session, index) {
  const tabCount = session.tabs?.length || 0;
  const date = session.createdAt ?? 'unknown date';
  return `  ${index}. ${session.name} — ${tabCount} tab(s) — ${date}`;
}

async function handleSort(options = {}) {
  const { by = 'date', order, save = false } = options;

  if (!VALID_SORT_FIELDS.includes(by)) {
    console.error(`Invalid sort field: "${by}". Choose from: ${VALID_SORT_FIELDS.join(', ')}`);
    process.exit(1);
  }

  if (order && !VALID_ORDERS.includes(order)) {
    console.error(`Invalid order: "${order}". Choose from: asc, desc`);
    process.exit(1);
  }

  const sessions = await loadSessions();

  if (sessions.length === 0) {
    console.log('No sessions found.');
    return [];
  }

  const sorted = sort(sessions, by, order);

  console.log(`Sorted ${sorted.length} session(s) by ${by}${order ? ` (${order})` : ''}:\n`);
  sorted.forEach((s, i) => {
    console.log(formatSessionLine(s, i + 1));
  });

  if (save) {
    await saveSessions(sorted);
    console.log('\nSession order saved.');
  }

  return sorted;
}

module.exports = { handleSort };
