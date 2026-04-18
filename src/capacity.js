// capacity.js — set/get max tab capacity and warn when exceeded

const DEFAULT_CAPACITY = 20;

function isValidCapacity(n) {
  return Number.isInteger(n) && n > 0;
}

function setCapacity(session, limit) {
  if (!isValidCapacity(limit)) throw new Error(`Invalid capacity: ${limit}`);
  return { ...session, capacity: limit };
}

function clearCapacity(session) {
  const s = { ...session };
  delete s.capacity;
  return s;
}

function setCapacityByName(sessions, name, limit) {
  return sessions.map(s => s.name === name ? setCapacity(s, limit) : s);
}

function getCapacity(session) {
  return session.capacity ?? DEFAULT_CAPACITY;
}

function isOverCapacity(session) {
  const tabs = Array.isArray(session.tabs) ? session.tabs.length : 0;
  return tabs > getCapacity(session);
}

function filterOverCapacity(sessions) {
  return sessions.filter(isOverCapacity);
}

function filterUnderCapacity(sessions) {
  return sessions.filter(s => !isOverCapacity(s));
}

function sortByCapacityUsage(sessions) {
  return [...sessions].sort((a, b) => {
    const ra = (Array.isArray(a.tabs) ? a.tabs.length : 0) / getCapacity(a);
    const rb = (Array.isArray(b.tabs) ? b.tabs.length : 0) / getCapacity(b);
    return rb - ra;
  });
}

module.exports = {
  isValidCapacity,
  setCapacity,
  clearCapacity,
  setCapacityByName,
  getCapacity,
  isOverCapacity,
  filterOverCapacity,
  filterUnderCapacity,
  sortByCapacityUsage,
  DEFAULT_CAPACITY,
};
