/**
 * priority.js - Set and manage priority levels on sessions
 * Priorities: low, normal, high, critical
 */

const VALID_PRIORITIES = ['low', 'normal', 'high', 'critical'];

function isValidPriority(priority) {
  return VALID_PRIORITIES.includes(priority);
}

function setPriority(sessions, sessionId, priority) {
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority "${priority}". Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  return sessions.map(s =>
    s.id === sessionId ? { ...s, priority } : s
  );
}

function clearPriority(sessions, sessionId) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const { priority, ...rest } = s;
    return rest;
  });
}

function setPriorityByName(sessions, name, priority) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return setPriority(sessions, session.id, priority);
}

function filterByPriority(sessions, priority) {
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority "${priority}". Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  return sessions.filter(s => s.priority === priority);
}

function getSessionPriority(session) {
  return session.priority || 'normal';
}

function sortByPriority(sessions) {
  const order = { critical: 0, high: 1, normal: 2, low: 3 };
  return [...sessions].sort((a, b) => {
    const pa = order[a.priority || 'normal'];
    const pb = order[b.priority || 'normal'];
    return pa - pb;
  });
}

module.exports = {
  VALID_PRIORITIES,
  isValidPriority,
  setPriority,
  clearPriority,
  setPriorityByName,
  filterByPriority,
  getSessionPriority,
  sortByPriority,
};
