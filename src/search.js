/**
 * Search and filter sessions by various criteria
 */

/**
 * Search sessions by title or URL keyword
 * @param {Array} sessions - Array of session objects
 * @param {string} query - Search query string
 * @returns {Array} Matching sessions
 */
function searchByKeyword(sessions, query) {
  if (!query || typeof query !== 'string') return sessions;
  const lower = query.toLowerCase().trim();
  return sessions.filter(session => {
    const titleMatch = session.name && session.name.toLowerCase().includes(lower);
    const urlMatch = Array.isArray(session.tabs) &&
      session.tabs.some(tab => tab.url && tab.url.toLowerCase().includes(lower));
    return titleMatch || urlMatch;
  });
}

/**
 * Search sessions created within a date range
 * @param {Array} sessions - Array of session objects
 * @param {string|null} from - ISO date string start
 * @param {string|null} to - ISO date string end
 * @returns {Array} Matching sessions
 */
function searchByDateRange(sessions, from, to) {
  return sessions.filter(session => {
    if (!session.createdAt) return false;
    const created = new Date(session.createdAt).getTime();
    if (from && created < new Date(from).getTime()) return false;
    if (to && created > new Date(to).getTime()) return false;
    return true;
  });
}

/**
 * Search sessions that have a minimum number of tabs
 * @param {Array} sessions - Array of session objects
 * @param {number} minTabs - Minimum tab count
 * @returns {Array} Matching sessions
 */
function searchByMinTabs(sessions, minTabs) {
  const min = parseInt(minTabs, 10);
  if (isNaN(min)) return sessions;
  return sessions.filter(session =>
    Array.isArray(session.tabs) && session.tabs.length >= min
  );
}

/**
 * Combined search using multiple optional criteria
 * @param {Array} sessions - Array of session objects
 * @param {Object} criteria - { keyword, from, to, minTabs }
 * @returns {Array} Matching sessions
 */
function search(sessions, criteria = {}) {
  let results = [...sessions];
  if (criteria.keyword) results = searchByKeyword(results, criteria.keyword);
  if (criteria.from || criteria.to) results = searchByDateRange(results, criteria.from || null, criteria.to || null);
  if (criteria.minTabs !== undefined) results = searchByMinTabs(results, criteria.minTabs);
  return results;
}

module.exports = { searchByKeyword, searchByDateRange, searchByMinTabs, search };
