// lifecycle.js — track session lifecycle events (created, opened, closed, archived)

const VALID_EVENTS = ['created', 'opened', 'closed', 'archived', 'restored'];

function isValidEvent(event) {
  return VALID_EVENTS.includes(event);
}

function logEvent(session, event, meta = {}) {
  if (!isValidEvent(event)) throw new Error(`Invalid lifecycle event: ${event}`);
  const entry = { event, timestamp: meta.timestamp || new Date().toISOString(), ...meta };
  if (!Array.isArray(session.lifecycle)) session.lifecycle = [];
  session.lifecycle.push(entry);
  return session;
}

function getLifecycle(session) {
  return session.lifecycle || [];
}

function clearLifecycle(session) {
  session.lifecycle = [];
  return session;
}

function getLastEvent(session) {
  const lc = getLifecycle(session);
  return lc.length ? lc[lc.length - 1] : null;
}

function filterByEvent(sessions, event) {
  return sessions.filter(s =>
    Array.isArray(s.lifecycle) && s.lifecycle.some(e => e.event === event)
  );
}

function logEventByName(sessions, name, event, meta = {}) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  return logEvent(session, event, meta);
}

module.exports = {
  isValidEvent,
  logEvent,
  getLifecycle,
  clearLifecycle,
  getLastEvent,
  filterByEvent,
  logEventByName,
  VALID_EVENTS,
};
