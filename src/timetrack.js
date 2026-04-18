// Time tracking for sessions

function startTracking(session) {
  return { ...session, timetrack: { ...session.timetrack, startedAt: Date.now() } };
}

function stopTracking(session) {
  const tt = session.timetrack || {};
  if (!tt.startedAt) return session;
  const elapsed = Date.now() - tt.startedAt;
  const totalMs = (tt.totalMs || 0) + elapsed;
  return {
    ...session,
    timetrack: { ...tt, startedAt: null, totalMs, lastStopped: Date.now() }
  };
}

function getTrackedTime(session) {
  return (session.timetrack && session.timetrack.totalMs) || 0;
}

function clearTracking(session) {
  const updated = { ...session };
  delete updated.timetrack;
  return updated;
}

function setTrackingByName(sessions, name, fn) {
  return sessions.map(s => s.name === name ? fn(s) : s);
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return `${m}m ${rs}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m ${rs}s`;
}

function sortByTrackedTime(sessions) {
  return [...sessions].sort((a, b) => getTrackedTime(b) - getTrackedTime(a));
}

function filterByMinTime(sessions, minMs) {
  return sessions.filter(s => getTrackedTime(s) >= minMs);
}

module.exports = {
  startTracking, stopTracking, getTrackedTime, clearTracking,
  setTrackingByName, formatDuration, sortByTrackedTime, filterByMinTime
};
