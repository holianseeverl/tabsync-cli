// merge.js - utilities for merging tab sessions

/**
 * Merge two sessions into one, combining their tabs.
 * @param {object} sessionA
 * @param {object} sessionB
 * @param {object} options
 * @returns {object} merged session
 */
function mergeSessions(sessionA, sessionB, options = {}) {
  if (!sessionA || !sessionB) {
    throw new Error('Both sessions are required for merging');
  }

  const { name, dedupe = false } = options;

  let tabs = [...sessionA.tabs, ...sessionB.tabs];

  if (dedupe) {
    const seen = new Set();
    tabs = tabs.filter((tab) => {
      if (seen.has(tab.url)) return false;
      seen.add(tab.url);
      return true;
    });
  }

  return {
    id: `merged-${Date.now()}`,
    name: name || `${sessionA.name} + ${sessionB.name}`,
    tabs,
    tags: Array.from(new Set([...(sessionA.tags || []), ...(sessionB.tags || [])])),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Merge multiple sessions into one.
 * @param {object[]} sessions
 * @param {object} options
 * @returns {object} merged session
 */
function mergeMany(sessions, options = {}) {
  if (!Array.isArray(sessions) || sessions.length < 2) {
    throw new Error('At least two sessions are required');
  }

  return sessions.reduce((acc, session) => mergeSessions(acc, session, options));
}

module.exports = { mergeSessions, mergeMany };
