// vitality: a composite health score for a session based on activity signals

const VITALITY_WEIGHTS = {
  streak: 0.25,
  pulse: 0.20,
  progress: 0.20,
  rating: 0.15,
  drift: 0.20,
};

const MAX_DRIFT_DAYS = 30;

function computeVitality(session) {
  let score = 0;

  // streak: 0-10 normalized to 0-1
  const streak = session.streak || 0;
  score += VITALITY_WEIGHTS.streak * Math.min(streak / 10, 1);

  // pulse count: 0-20 normalized to 0-1
  const pulseCount = Array.isArray(session.pulses) ? session.pulses.length : 0;
  score += VITALITY_WEIGHTS.pulse * Math.min(pulseCount / 20, 1);

  // progress: already 0-100, normalize to 0-1
  const progress = typeof session.progress === 'number' ? session.progress : 0;
  score += VITALITY_WEIGHTS.progress * (progress / 100);

  // rating: 1-5, normalize to 0-1
  const rating = typeof session.rating === 'number' ? session.rating : 0;
  score += VITALITY_WEIGHTS.rating * (Math.max(rating - 1, 0) / 4);

  // drift: lower drift = higher vitality
  const lastActive = session.lastActive ? new Date(session.lastActive) : null;
  if (lastActive) {
    const driftDays = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    const driftScore = Math.max(0, 1 - driftDays / MAX_DRIFT_DAYS);
    score += VITALITY_WEIGHTS.drift * driftScore;
  }

  return Math.round(score * 100) / 100;
}

function getVitality(session) {
  return session.vitality !== undefined ? session.vitality : computeVitality(session);
}

function scoreVitality(sessions) {
  return sessions.map(s => ({ ...s, vitality: computeVitality(s) }));
}

function sortByVitality(sessions, order = 'desc') {
  const scored = scoreVitality(sessions);
  return scored.sort((a, b) =>
    order === 'asc' ? a.vitality - b.vitality : b.vitality - a.vitality
  );
}

function filterByMinVitality(sessions, min) {
  return scoreVitality(sessions).filter(s => s.vitality >= min);
}

module.exports = {
  computeVitality,
  getVitality,
  scoreVitality,
  sortByVitality,
  filterByMinVitality,
};
