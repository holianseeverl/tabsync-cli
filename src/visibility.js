// visibility.js — control whether sessions are hidden or visible

/**
 * Hide a session by id
 * @param {object[]} sessions
 * @param {string} id
 * @returns {object[]}
 */
function hideSession(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, hidden: true } : s);
}

/**
 * Unhide a session by id
 * @param {object[]} sessions
 * @param {string} id
 * @returns {object[]}
 */
function unhideSession(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, hidden: false } : s);
}

/**
 * Hide a session by name (first match)
 * @param {object[]} sessions
 * @param {string} name
 * @returns {object[]}
 */
function hideSessionByName(sessions, name) {
  let found = false;
  return sessions.map(s => {
    if (!found && s.name === name) {
      found = true;
      return { ...s, hidden: true };
    }
    return s;
  });
}

/**
 * Return only visible (non-hidden) sessions
 * @param {object[]} sessions
 * @returns {object[]}
 */
function listVisible(sessions) {
  return sessions.filter(s => !s.hidden);
}

/**
 * Return only hidden sessions
 * @param {object[]} sessions
 * @returns {object[]}
 */
function listHidden(sessions) {
  return sessions.filter(s => s.hidden === true);
}

/**
 * Toggle hidden state of a session by id
 * @param {object[]} sessions
 * @param {string} id
 * @returns {object[]}
 */
function toggleVisibility(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, hidden: !s.hidden } : s);
}

module.exports = {
  hideSession,
  unhideSession,
  hideSessionByName,
  listVisible,
  listHidden,
  toggleVisibility,
};
