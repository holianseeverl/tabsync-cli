// rating.js — assign star ratings (1–5) to sessions

const VALID_RATINGS = [1, 2, 3, 4, 5];

function isValidRating(rating) {
  return VALID_RATINGS.includes(Number(rating));
}

function rateSession(sessions, id, rating) {
  const r = Number(rating);
  if (!isValidRating(r)) {
    throw new Error(`Invalid rating: ${rating}. Must be 1–5.`);
  }
  return sessions.map(s =>
    s.id === id ? { ...s, rating: r } : s
  );
}

function clearRating(sessions, id) {
  return sessions.map(s => {
    if (s.id !== id) return s;
    const { rating, ...rest } = s;
    return rest;
  });
}

function rateSessionByName(sessions, name, rating) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  return rateSession(sessions, session.id, rating);
}

function filterByRating(sessions, minRating) {
  const min = Number(minRating);
  return sessions.filter(s => s.rating >= min);
}

function sortByRating(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const ra = a.rating ?? 0;
    const rb = b.rating ?? 0;
    return order === 'asc' ? ra - rb : rb - ra;
  });
}

function getRating(sessions, id) {
  const session = sessions.find(s => s.id === id);
  if (!session) throw new Error(`Session not found: ${id}`);
  return session.rating ?? null;
}

module.exports = {
  isValidRating,
  rateSession,
  clearRating,
  rateSessionByName,
  filterByRating,
  sortByRating,
  getRating,
};
