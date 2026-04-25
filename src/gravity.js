// gravity.js — measures how much a session "pulls" attention based on
// recency, tab count, priority, and rating

const PRIORITY_WEIGHTS = { high: 3, medium: 2, low: 1 };
const RATING_MAX = 5;

function computeGravity(session) {
  const now = Date.now();
  const created = session.createdAt ? new Date(session.createdAt).getTime() : now;
  const ageMs = now - created;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 1 - ageDays / 30); // decays over 30 days

  const tabScore = Math.min((session.tabs || []).length / 20, 1);
  const priorityScore = (PRIORITY_WEIGHTS[session.priority] || 0) / 3;
  const ratingScore = (session.rating || 0) / RATING_MAX;

  const gravity = (recencyScore * 0.4) + (tabScore * 0.2) + (priorityScore * 0.25) + (ratingScore * 0.15);
  return Math.round(gravity * 100) / 100;
}

function getGravity(session) {
  return { id: session.id, name: session.name, gravity: computeGravity(session) };
}

function sortByGravity(sessions) {
  return [...sessions].sort((a, b) => computeGravity(b) - computeGravity(a));
}

function filterByMinGravity(sessions, min) {
  return sessions.filter(s => computeGravity(s) >= min);
}

function gravityLevel(session) {
  const g = computeGravity(session);
  if (g >= 0.7) return 'high';
  if (g >= 0.4) return 'medium';
  return 'low';
}

module.exports = { computeGravity, getGravity, sortByGravity, filterByMinGravity, gravityLevel };
