/**
 * Tag management for sessions
 * Allows sessions to be labeled and filtered by tags
 */

/**
 * Add a tag to a session
 * @param {object} session
 * @param {string} tag
 * @returns {object} updated session
 */
function addTag(session, tag) {
  if (!session || typeof session !== 'object') {
    throw new Error('Invalid session object');
  }
  if (!tag || typeof tag !== 'string' || tag.trim() === '') {
    throw new Error('Tag must be a non-empty string');
  }

  const normalizedTag = tag.trim().toLowerCase();
  const tags = session.tags ? [...session.tags] : [];

  if (!tags.includes(normalizedTag)) {
    tags.push(normalizedTag);
  }

  return { ...session, tags };
}

/**
 * Remove a tag from a session
 * @param {object} session
 * @param {string} tag
 * @returns {object} updated session
 */
function removeTag(session, tag) {
  if (!session || typeof session !== 'object') {
    throw new Error('Invalid session object');
  }

  const normalizedTag = tag.trim().toLowerCase();
  const tags = (session.tags || []).filter(t => t !== normalizedTag);

  return { ...session, tags };
}

/**
 * Filter sessions by a given tag
 * @param {object[]} sessions
 * @param {string} tag
 * @returns {object[]} filtered sessions
 */
function filterByTag(sessions, tag) {
  if (!Array.isArray(sessions)) {
    throw new Error('Sessions must be an array');
  }

  const normalizedTag = tag.trim().toLowerCase();
  return sessions.filter(s => Array.isArray(s.tags) && s.tags.includes(normalizedTag));
}

/**
 * Get all unique tags across all sessions
 * @param {object[]} sessions
 * @returns {string[]} sorted unique tags
 */
function getAllTags(sessions) {
  if (!Array.isArray(sessions)) {
    throw new Error('Sessions must be an array');
  }

  const tagSet = new Set();
  sessions.forEach(s => {
    if (Array.isArray(s.tags)) {
      s.tags.forEach(t => tagSet.add(t));
    }
  });

  return [...tagSet].sort();
}

module.exports = { addTag, removeTag, filterByTag, getAllTags };
