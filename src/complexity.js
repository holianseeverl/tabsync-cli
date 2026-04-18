// complexity.js — score sessions by structural complexity

function computeComplexity(session) {
  let score = 0;
  score += (session.tabs || []).length * 2;
  score += (session.tags || []).length;
  score += session.notes ? 5 : 0;
  score += session.priority ? 3 : 0;
  score += session.dependencies ? (session.dependencies.length * 2) : 0;
  score += session.labels ? session.labels.length : 0;
  return score;
}

function getComplexity(session) {
  return session._complexity !== undefined ? session._complexity : computeComplexity(session);
}

function setComplexity(session) {
  return { ...session, _complexity: computeComplexity(session) };
}

function setComplexityByName(sessions, name) {
  return sessions.map(s => s.name === name ? setComplexity(s) : s);
}

function sortByComplexity(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const ca = computeComplexity(a);
    const cb = computeComplexity(b);
    return order === 'asc' ? ca - cb : cb - ca;
  });
}

function filterByMinComplexity(sessions, min) {
  return sessions.filter(s => computeComplexity(s) >= min);
}

function complexitySummary(sessions) {
  return sessions.map(s => ({
    name: s.name,
    complexity: computeComplexity(s)
  }));
}

module.exports = {
  computeComplexity,
  getComplexity,
  setComplexity,
  setComplexityByName,
  sortByComplexity,
  filterByMinComplexity,
  complexitySummary
};
