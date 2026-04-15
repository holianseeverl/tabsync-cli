// expiry.js — set, clear, and check session expiry dates

const { isValidSession } = require('./session');

/**
 * Set an expiry date on a session.
 * @param {object} session
 * @param {string|Date} expiryDate — ISO string or Date object
 * @returns {object} updated session
 */
function setExpiry(session, expiryDate) {
  if (!isValidSession(session)) throw new Error('Invalid session');
  const date = new Date(expiryDate);
  if (isNaN(date.getTime())) throw new Error('Invalid expiry date');
  return { ...session, expiresAt: date.toISOString() };
}

/**
 * Clear the expiry date from a session.
 */
function clearExpiry(session) {
  if (!isValidSession(session)) throw new Error('Invalid session');
  const updated = { ...session };
  delete updated.expiresAt;
  return updated;
}

/**
 * Check whether a session has expired.
 */
function isExpired(session) {
  if (!session.expiresAt) return false;
  return new Date(session.expiresAt) < new Date();
}

/**
 * List all sessions that have expired.
 */
function listExpired(sessions) {
  return sessions.filter(isExpired);
}

/**
 * List all sessions that are still active (not expired).
 */
function listActive(sessions) {
  return sessions.filter(s => !isExpired(s));
}

/**
 * Set expiry by session name.
 */
function setExpiryByName(sessions, name, expiryDate) {
  return sessions.map(s =>
    s.name === name ? setExpiry(s, expiryDate) : s
  );
}

/**
 * Purge all expired sessions from the list.
 */
function purgeExpired(sessions) {
  return sessions.filter(s => !isExpired(s));
}

module.exports = {
  setExpiry,
  clearExpiry,
  isExpired,
  listExpired,
  listActive,
  setExpiryByName,
  purgeExpired,
};
