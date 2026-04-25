// momentum.js — tracks session activity momentum based on pulse, streak, and time tracking

const MOMENTUM_LEVELS = ['stalled', 'low', 'moderate', 'high', 'peak'];

function computeMomentum(session) {
  let score = 0;

  // streak contribution (0–3 points)
  const streak = session.streak || 0;
  if (streak >= 10) score += 3;
  else if (streak >= 5) score += 2;
  else if (streak >= 1) score += 1;

  // pulse contribution (0–3 points)
  const pulseCount = Array.isArray(session.pulses) ? session.pulses.length : 0;
  if (pulseCount >= 10) score += 3;
  else if (pulseCount >= 5) score += 2;
  else if (pulseCount >= 1) score += 1;

  // tracked time contribution (0–2 points)
  const trackedMs = session.trackedMs || 0;
  const hours = trackedMs / (1000 * 60 * 60);
  if (hours >= 5) score += 2;
  else if (hours >= 1) score += 1;

  // drift penalty (subtract up to 2 points)
  if (session.lastActive) {
    const driftDays = (Date.now() - new Date(session.lastActive).getTime()) / (1000 * 60 * 60 * 24);
    if (driftDays > 14) score -= 2;
    else if (driftDays > 7) score -= 1;
  }

  score = Math.max(0, Math.min(8, score));

  const levelIndex = Math.floor((score / 8) * (MOMENTUM_LEVELS.length - 1));
  return {
    score,
    level: MOMENTUM_LEVELS[levelIndex]
  };
}

function getMomentum(session) {
  return computeMomentum(session);
}

function sortByMomentum(sessions, ascending = false) {
  return [...sessions].sort((a, b) => {
    const diff = computeMomentum(b).score - computeMomentum(a).score;
    return ascending ? -diff : diff;
  });
}

function filterByMinMomentum(sessions, minScore) {
  return sessions.filter(s => computeMomentum(s).score >= minScore);
}

function filterByLevel(sessions, level) {
  if (!MOMENTUM_LEVELS.includes(level)) return [];
  return sessions.filter(s => computeMomentum(s).level === level);
}

module.exports = {
  MOMENTUM_LEVELS,
  computeMomentum,
  getMomentum,
  sortByMomentum,
  filterByMinMomentum,
  filterByLevel
};
