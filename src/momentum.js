// momentum.js — computes session momentum based on pulse, streak, velocity, and recency

const DAY_MS = 24 * 60 * 60 * 1000;

function computeMomentum(session) {
  const now = Date.now();

  const streak = session.streak || 0;
  const pulseCount = Array.isArray(session.pulses) ? session.pulses.length : 0;

  const velocityEntries = Array.isArray(session.velocity) ? session.velocity : [];
  const avgVelocity =
    velocityEntries.length > 0
      ? velocityEntries.reduce((sum, v) => sum + (v.value || 0), 0) / velocityEntries.length
      : 0;

  const lastActive = session.lastActive ? new Date(session.lastActive).getTime() : null;
  const daysSinceActive = lastActive ? (now - lastActive) / DAY_MS : 30;
  const recencyScore = Math.max(0, 1 - daysSinceActive / 30);

  const raw = streak * 2 + pulseCount * 1.5 + avgVelocity * 1.2 + recencyScore * 10;
  return Math.round(raw * 10) / 10;
}

function getMomentum(session) {
  return computeMomentum(session);
}

function sortByMomentum(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const diff = computeMomentum(a) - computeMomentum(b);
    return order === 'asc' ? diff : -diff;
  });
}

function filterByMinMomentum(sessions, min) {
  return sessions.filter((s) => computeMomentum(s) >= min);
}

function momentumLevel(session) {
  const score = computeMomentum(session);
  if (score >= 20) return 'high';
  if (score >= 8) return 'medium';
  return 'low';
}

module.exports = {
  computeMomentum,
  getMomentum,
  sortByMomentum,
  filterByMinMomentum,
  momentumLevel,
};
