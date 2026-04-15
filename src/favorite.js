// favorite.js — mark/unmark sessions as favorites

/**
 * Mark a session as a favorite.
 * @param {object} session
 * @returns {object} updated session
 */
function favoriteSession(session) {
  return { ...session, favorite: true };
}

/**
 * Remove favorite status from a session.
 * @param {object} session
 * @returns {object} updated session
 */
function unfavoriteSession(session) {
  const updated = { ...session };
  delete updated.favorite;
  return updated;
}

/**
 * Return all sessions marked as favorites.
 * @param {object[]} sessions
 * @returns {object[]}
 */
function listFavorites(sessions) {
  return sessions.filter((s) => s.favorite === true);
}

/**
 * Check whether a session is a favorite.
 * @param {object} session
 * @returns {boolean}
 */
function isFavorite(session) {
  return session.favorite === true;
}

/**
 * Toggle favorite status on a session by name.
 * @param {object[]} sessions
 * @param {string} name
 * @returns {object[]} updated sessions array
 */
function toggleFavoriteByName(sessions, name) {
  return sessions.map((s) => {
    if (s.name !== name) return s;
    return isFavorite(s) ? unfavoriteSession(s) : favoriteSession(s);
  });
}

module.exports = {
  favoriteSession,
  unfavoriteSession,
  listFavorites,
  isFavorite,
  toggleFavoriteByName,
};
