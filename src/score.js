// Score a session based on various attributes

const WEIGHTS = {
  rating: 20,
  priority: 15,
  favorite: 10,
  pinned: 10,
  progress: 0.3,
  tabCount: 0.5,
};

const PRIORITY_MAP = { high: 3, medium: 2, low: 1 };

function computeScore(session) {
  let score = 0;
  if (session.rating) score += session.rating * WEIGHTS.rating;
  if (session.priority) score += (PRIORITY_MAP[session.priority] || 0) * WEIGHTS.priority;
  if (session.favorite) score += WEIGHTS.favorite;
  if (session.pinned) score += WEIGHTS.pinned;
  if (typeof session.progress === 'number') score += session.progress * WEIGHTS.progress;
  if (Array.isArray(session.tabs)) score += session.tabs.length * WEIGHTS.tabCount;
  return Math.round(score * 10) / 10;
}

function scoreSession(session) {
  return { ...session, score: computeScore(session) };
}

function scoreSessions(sessions) {
  return sessions.map(scoreSession);
}

function sortByScore(sessions, order = 'desc') {
  const scored = scoreSessions(sessions);
  return scored.sort((a, b) =>
    order === 'asc' ? a.score - b.score : b.score - a.score
  );
}

function filterByMinScore(sessions, min) {
  return scoreSessions(sessions).filter(s => s.score >= min);
}

module.exports = { computeScore, scoreSession, scoreSessions, sortByScore, filterByMinScore };
