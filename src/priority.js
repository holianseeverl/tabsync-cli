const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];

function isValidPriority(priority) {
  return VALID_PRIORITIES.includes(priority);
}

function setPriority(sessions, id, priority) {
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority: ${priority}. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  return sessions.map(s =>
    s.id === id ? { ...s, priority } : s
  );
}

function clearPriority(sessions, id) {
  return sessions.map(s => {
    if (s.id !== id) return s;
    const { priority, ...rest } = s;
    return rest;
  });
}

function setPriorityByName(sessions, name, priority) {
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority: ${priority}. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  return sessions.map(s =>
    s.name === name ? { ...s, priority } : s
  );
}

function filterByPriority(sessions, priority) {
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }
  return sessions.filter(s => s.priority === priority);
}

function sortByPriority(sessions) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...sessions].sort((a, b) => {
    const pa = a.priority !== undefined ? order[a.priority] : 99;
    const pb = b.priority !== undefined ? order[b.priority] : 99;
    return pa - pb;
  });
}

function getSessionPriority(session) {
  return session.priority || null;
}

module.exports = {
  isValidPriority,
  setPriority,
  clearPriority,
  setPriorityByName,
  filterByPriority,
  sortByPriority,
  getSessionPriority,
  VALID_PRIORITIES
};
