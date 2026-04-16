// access.js — control read/write access level on sessions

const VALID_LEVELS = ['read', 'write', 'none'];

function isValidAccessLevel(level) {
  return VALID_LEVELS.includes(level);
}

function setAccess(sessions, id, level) {
  if (!isValidAccessLevel(level)) {
    throw new Error(`Invalid access level: "${level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
  }
  return sessions.map(s =>
    s.id === id ? { ...s, access: level } : s
  );
}

function clearAccess(sessions, id) {
  return sessions.map(s => {
    if (s.id !== id) return s;
    const copy = { ...s };
    delete copy.access;
    return copy;
  });
}

function setAccessByName(sessions, name, level) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: "${name}"`);
  return setAccess(sessions, session.id, level);
}

function getAccess(session) {
  return session.access || 'write';
}

function filterByAccess(sessions, level) {
  if (!isValidAccessLevel(level)) {
    throw new Error(`Invalid access level: "${level}"`);
  }
  return sessions.filter(s => (s.access || 'write') === level);
}

function listReadOnly(sessions) {
  return filterByAccess(sessions, 'read');
}

module.exports = {
  isValidAccessLevel,
  setAccess,
  clearAccess,
  setAccessByName,
  getAccess,
  filterByAccess,
  listReadOnly,
};
