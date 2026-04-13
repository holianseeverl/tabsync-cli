/**
 * Deduplicate sessions and tabs within sessions
 */

/**
 * Remove duplicate tabs (same URL) within a single session
 * @param {Object} session
 * @returns {Object} session with unique tabs
 */
function dedupeTabsInSession(session) {
  const seen = new Set();
  const uniqueTabs = session.tabs.filter((tab) => {
    if (seen.has(tab.url)) return false;
    seen.add(tab.url);
    return true;
  });
  return { ...session, tabs: uniqueTabs };
}

/**
 * Remove duplicate sessions by name (keep the most recent one)
 * @param {Array} sessions
 * @returns {Array} deduplicated sessions
 */
function dedupeSessionsByName(sessions) {
  const map = new Map();
  for (const session of sessions) {
    const existing = map.get(session.name);
    if (!existing || new Date(session.createdAt) > new Date(existing.createdAt)) {
      map.set(session.name, session);
    }
  }
  return Array.from(map.values());
}

/**
 * Remove sessions that are exact duplicates (same name + same tab URLs)
 * @param {Array} sessions
 * @returns {Array} deduplicated sessions
 */
function dedupeExact(sessions) {
  const seen = new Set();
  return sessions.filter((session) => {
    const key = session.name + '|' + session.tabs.map((t) => t.url).sort().join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Run full deduplication: exact session duplicates, then tabs within each session
 * @param {Array} sessions
 * @returns {Array}
 */
function dedupe(sessions) {
  const uniqueSessions = dedupeExact(sessions);
  return uniqueSessions.map(dedupeTabsInSession);
}

module.exports = { dedupeTabsInSession, dedupeSessionsByName, dedupeExact, dedupe };
