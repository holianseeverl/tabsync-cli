// drift: tracks how long a session has been inactive

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDriftDays(session) {
  const lastActive = session.lastActiveAt || session.createdAt;
  if (!lastActive) return null;
  const diff = Date.now() - new Date(lastActive).getTime();
  return Math.floor(diff / MS_PER_DAY);
}

function setLastActive(session, date = new Date().toISOString()) {
  return { ...session, lastActiveAt: date };
}

function setLastActiveByName(sessions, name, date) {
  return sessions.map(s => s.name === name ? setLastActive(s, date) : s);
}

function clearDrift(session) {
  const s = { ...session };
  delete s.lastActiveAt;
  return s;
}

function filterByMinDrift(sessions, days) {
  return sessions.filter(s => {
    const d = getDriftDays(s);
    return d !== null && d >= days;
  });
}

function sortByDrift(sessions) {
  return [...sessions].sort((a, b) => {
    const da = getDriftDays(a) ?? -1;
    const db = getDriftDays(b) ?? -1;
    return db - da;
  });
}

function formatDrift(session) {
  const d = getDriftDays(session);
  if (d === null) return 'unknown';
  if (d === 0) return 'active today';
  return `${d} day${d === 1 ? '' : 's'} inactive`;
}

module.exports = {
  getDriftDays,
  setLastActive,
  setLastActiveByName,
  clearDrift,
  filterByMinDrift,
  sortByDrift,
  formatDrift
};
