// pulse.js — track session activity pulse (last active timestamp + frequency)

function recordPulse(session) {
  const now = Date.now();
  const pulses = session.pulse ? [...session.pulse, now] : [now];
  return { ...session, pulse: pulses };
}

function clearPulse(session) {
  const s = { ...session };
  delete s.pulse;
  return s;
}

function recordPulseByName(sessions, name) {
  return sessions.map(s => s.name === name ? recordPulse(s) : s);
}

function getLastPulse(session) {
  if (!session.pulse || session.pulse.length === 0) return null;
  return session.pulse[session.pulse.length - 1];
}

function getPulseCount(session) {
  return session.pulse ? session.pulse.length : 0;
}

function getPulseRate(session, windowMs = 86400000) {
  if (!session.pulse || session.pulse.length === 0) return 0;
  const now = Date.now();
  const recent = session.pulse.filter(t => now - t <= windowMs);
  return recent.length;
}

function sortByPulse(sessions) {
  return [...sessions].sort((a, b) => {
    const la = getLastPulse(a) || 0;
    const lb = getLastPulse(b) || 0;
    return lb - la;
  });
}

function filterByMinPulse(sessions, min) {
  return sessions.filter(s => getPulseCount(s) >= min);
}

module.exports = {
  recordPulse,
  clearPulse,
  recordPulseByName,
  getLastPulse,
  getPulseCount,
  getPulseRate,
  sortByPulse,
  filterByMinPulse
};
