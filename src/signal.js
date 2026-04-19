// signal.js — mark sessions with a signal strength (1-5) indicating urgency or attention needed

const VALID_SIGNALS = [1, 2, 3, 4, 5];

function isValidSignal(value) {
  return VALID_SIGNALS.includes(Number(value));
}

function setSignal(session, value) {
  const num = Number(value);
  if (!isValidSignal(num)) throw new Error(`Invalid signal: ${value}. Must be 1-5.`);
  return { ...session, signal: num };
}

function clearSignal(session) {
  const s = { ...session };
  delete s.signal;
  return s;
}

function setSignalByName(sessions, name, value) {
  return sessions.map(s => s.name === name ? setSignal(s, value) : s);
}

function getSignal(session) {
  return session.signal ?? null;
}

function filterBySignal(sessions, value) {
  const num = Number(value);
  return sessions.filter(s => s.signal === num);
}

function filterByMinSignal(sessions, min) {
  const num = Number(min);
  return sessions.filter(s => s.signal != null && s.signal >= num);
}

function sortBySignal(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const sa = a.signal ?? 0;
    const sb = b.signal ?? 0;
    return order === 'asc' ? sa - sb : sb - sa;
  });
}

module.exports = { isValidSignal, setSignal, clearSignal, setSignalByName, getSignal, filterBySignal, filterByMinSignal, sortBySignal };
