const { loadSessions, saveSessions } = require('../sessionStore');
const { sort } = require('../sort');

async function handleSort(options) {
  const sessions = await loadSessions();

  if (!sessions || sessions.length === 0) {
    console.log('No sessions found.');
    return;
  }

  const { by = 'date', order = 'asc', save = false } = options;

  const validFields = ['date', 'tabCount', 'name'];
  if (!validFields.includes(by)) {
    console.error(`Invalid sort field: "${by}". Valid options: ${validFields.join(', ')}`);
    process.exit(1);
  }

  const validOrders = ['asc', 'desc'];
  if (!validOrders.includes(order)) {
    console.error(`Invalid order: "${order}". Valid options: asc, desc`);
    process.exit(1);
  }

  const sorted = sort(sessions, by, order);

  if (save) {
    await saveSessions(sorted);
    console.log(`Sessions sorted by "${by}" (${order}) and saved.`);
  } else {
    console.log(`Sessions sorted by "${by}" (${order}):\n`);
    sorted.forEach((s, i) => {
      const tabCount = Array.isArray(s.tabs) ? s.tabs.length : 0;
      console.log(`  ${i + 1}. [${s.name}] - ${tabCount} tab(s) - ${s.createdAt}`);
    });
  }

  return sorted;
}

module.exports = { handleSort };
