// context.js - attach arbitrary key/value context metadata to sessions

function setContext(session, key, value) {
  if (!key || typeof key !== 'string') throw new Error('Invalid context key');
  session.context = session.context || {};
  session.context[key] = value;
  return session;
}

function clearContext(session, key) {
  if (!session.context) return session;
  if (key) {
    delete session.context[key];
  } else {
    delete session.context;
  }
  return session;
}

function getContext(session, key) {
  if (!session.context) return key ? undefined : {};
  return key ? session.context[key] : { ...session.context };
}

function filterByContextKey(sessions, key) {
  return sessions.filter(s => s.context && key in s.context);
}

function filterByContextValue(sessions, key, value) {
  return sessions.filter(s => s.context && s.context[key] === value);
}

function setContextByName(sessions, name, key, value) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  return setContext(session, key, value);
}

module.exports = { setContext, clearContext, getContext, filterByContextKey, filterByContextValue, setContextByName };
