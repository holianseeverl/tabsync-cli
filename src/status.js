// status.js — set, clear, and filter sessions by a custom status string

const VALID_STATUSES = ['active', 'idle', 'paused', 'review', 'done'];

function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

function setStatus(sessions, id, status) {
  if (!isValidStatus(status)) {
    throw new Error(`Invalid status "${status}". Valid options: ${VALID_STATUSES.join(', ')}`);
  }
  return sessions.map(s =>
    s.id === id ? { ...s, status } : s
  );
}

function clearStatus(sessions, id) {
  return sessions.map(s => {
    if (s.id !== id) return s;
    const copy = { ...s };
    delete copy.status;
    return copy;
  });
}

function setStatusByName(sessions, name, status) {
  const match = sessions.find(s => s.name === name);
  if (!match) throw new Error(`Session "${name}" not found`);
  return setStatus(sessions, match.id, status);
}

function filterByStatus(sessions, status) {
  if (!isValidStatus(status)) {
    throw new Error(`Invalid status "${status}". Valid options: ${VALID_STATUSES.join(', ')}`);
  }
  return sessions.filter(s => s.status === status);
}

function getStatus(sessions, id) {
  const session = sessions.find(s => s.id === id);
  if (!session) throw new Error(`Session with id "${id}" not found`);
  return session.status || null;
}

function listByStatus(sessions) {
  return sessions.reduce((acc, s) => {
    const key = s.status || 'unset';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}

module.exports = {
  VALID_STATUSES,
  isValidStatus,
  setStatus,
  clearStatus,
  setStatusByName,
  filterByStatus,
  getStatus,
  listByStatus
};
