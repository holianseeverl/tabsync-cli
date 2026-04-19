// spike.js — track short-term intensity bursts for a session

const VALID_LEVELS = ['low', 'medium', 'high', 'critical'];

function isValidSpike(level) {
  return VALID_LEVELS.includes(level);
}

function setSpike(session, level, note = '') {
  if (!isValidSpike(level)) throw new Error(`Invalid spike level: ${level}`);
  return {
    ...session,
    spike: { level, note, setAt: new Date().toISOString() }
  };
}

function clearSpike(session) {
  const updated = { ...session };
  delete updated.spike;
  return updated;
}

function setSpikeByName(sessions, name, level, note = '') {
  return sessions.map(s => s.name === name ? setSpike(s, level, note) : s);
}

function getSpike(session) {
  return session.spike || null;
}

function filterBySpike(sessions, level) {
  return sessions.filter(s => s.spike && s.spike.level === level);
}

function sortBySpike(sessions) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...sessions].sort((a, b) => {
    const la = a.spike ? order[a.spike.level] : 99;
    const lb = b.spike ? order[b.spike.level] : 99;
    return la - lb;
  });
}

module.exports = { isValidSpike, setSpike, clearSpike, setSpikeByName, getSpike, filterBySpike, sortBySpike };
