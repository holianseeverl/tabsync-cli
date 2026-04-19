// signal.js — assign signal strength/urgency to sessions

const VALID_SIGNALS = ['low', 'medium', 'high', 'critical'];

function isValidSignal(signal) {
  return VALID_SIGNALS.includes(signal);
}

function setSignal(session, signal) {
  if (!isValidSignal(signal)) throw new Error(`Invalid signal: ${signal}`);
  return { ...session, signal };
}

function clearSignal(session) {
  const s = { ...session };
  delete s.signal;
  return s;
}

function setSignalByName(sessions, name, signal) {
  return sessions.map(s => s.name === name ? setSignal(s, signal) : s);
}

function getSignal(session) {
  return session.signal || null;
}

function filterBySignal(sessions, signal) {
  return sessions.filter(s => s.signal === signal);
}

function sortBySignal(sessions) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...sessions].sort((a, b) => {
    const ao = a.signal != null ? order[a.signal] : 99;
    const bo = b.signal != null ? order[b.signal] : 99;
    return ao - bo;
  });
}

module.exports = { isValidSignal, setSignal, clearSignal, setSignalByName, getSignal, filterBySignal, sortBySignal, VALID_SIGNALS };
