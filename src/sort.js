/**
 * Sort sessions by various criteria
 */

/**
 * Sort sessions by date (newest or oldest first)
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByDate(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort sessions by number of tabs
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByTabCount(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const countA = Array.isArray(a.tabs) ? a.tabs.length : 0;
    const countB = Array.isArray(b.tabs) ? b.tabs.length : 0;
    return order === 'asc' ? countA - countB : countB - countA;
  });
}

/**
 * Sort sessions alphabetically by name
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByName(sessions, order = 'asc') {
  return [...sessions].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    if (nameA < nameB) return order === 'asc' ? -1 : 1;
    if (nameA > nameB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Generic sort dispatcher
 * @param {Array} sessions
 * @param {string} by - 'date' | 'tabs' | 'name'
 * @param {string} order - 'asc' | 'desc'
 * @returns {Array}
 */
function sort(sessions, by = 'date', order = 'desc') {
  if (!Array.isArray(sessions)) return [];
  switch (by) {
    case 'date':
      return sortByDate(sessions, order);
    case 'tabs':
      return sortByTabCount(sessions, order);
    case 'name':
      return sortByName(sessions, order);
    default:
      throw new Error(`Unknown sort field: "${by}". Use 'date', 'tabs', or 'name'.`);
  }
}

module.exports = { sortByDate, sortByTabCount, sortByName, sort };
