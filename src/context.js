// context.js — attach/retrieve contextual metadata to sessions

/**
 * Set a context key/value on a session
 */
function setContext(session, key, value) {
  if (!session || typeof key !== 'string' || !key.trim()) {
    throw new Error('Invalid session or key');
  }
  const context = session.context ? { ...session.context } : {};
  context[key.trim()] = value;
  return { ...session, context };
}

/**
 * Remove a context key from a session
 */
function clearContext(session, key) {
  if (!session || !session.context) return session;
  const context = { ...session.context };
  delete context[key];
  return { ...session, context };
}

/**
 * Get a context value by key
 */
function getContext(session, key) {
  return session && session.context ? session.context[key] : undefined;
}

/**
 * Filter sessions that have a specific context key
 */
function filterByContextKey(sessions, key) {
  return sessions.filter(s => s.context && Object.prototype.hasOwnProperty.call(s.context, key));
}

/**
 * Filter sessions where context key matches value
 */
function filterByContextValue(sessions, key, value) {
  return sessions.filter(s => s.context && s.context[key] === value);
}

/**
 * Set context by session name
 */
function setContextByName(sessions, name, key, value) {
  return sessions.map(s => s.name === name ? setContext(s, key, value) : s);
}

module.exports = {
  setContext,
  clearContext,
  getContext,
  filterByContextKey,
  filterByContextValue,
  setContextByName,
};
