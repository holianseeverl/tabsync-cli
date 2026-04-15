const { v4: uuidv4 } = require('uuid');

function setExpiry(sessions, sessionId, expiresAt) {
  return sessions.map(s =>
    s.id === sessionId ? { ...s, expiresAt } : s
  );
}

function clearExpiry(sessions, sessionId) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const { expiresAt, ...rest } = s;
    return rest;
  });
}

function isExpired(session, now = new Date()) {
  if (!session.expiresAt) return false;
  return new Date(session.expiresAt) <= now;
}

function listExpired(sessions, now = new Date()) {
  return sessions.filter(s => isExpired(s, now));
}

function listActive(sessions, now = new Date()) {
  return sessions.filter(s => !isExpired(s, now));
}

function setExpiryByName(sessions, name, expiresAt) {
  const session = sessions.find(s => s.name === name);
  if (!session) return sessions;
  return setExpiry(sessions, session.id, expiresAt);
}

function purgeExpired(sessions, now = new Date()) {
  return sessions.filter(s => !isExpired(s, now));
}

module.exports = {
  setExpiry,
  clearExpiry,
  isExpired,
  listExpired,
  listActive,
  setExpiryByName,
  purgeExpired
};
