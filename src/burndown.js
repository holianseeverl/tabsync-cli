// burndown.js — track session tab reduction over time

function isValidBurndownEntry(entry) {
  return (
    entry &&
    typeof entry.timestamp === 'string' &&
    typeof entry.tabCount === 'number' &&
    entry.tabCount >= 0
  );
}

function recordBurndown(session) {
  if (!session) throw new Error('Session is required');
  const entry = {
    timestamp: new Date().toISOString(),
    tabCount: Array.isArray(session.tabs) ? session.tabs.length : 0
  };
  session.burndown = session.burndown || [];
  session.burndown.push(entry);
  return session;
}

function recordBurndownByName(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  return recordBurndown(session);
}

function clearBurndown(session) {
  if (!session) throw new Error('Session is required');
  session.burndown = [];
  return session;
}

function getBurndown(session) {
  return session.burndown || [];
}

function computeBurnRate(session) {
  const entries = getBurndown(session);
  if (entries.length < 2) return null;
  const first = entries[0];
  const last = entries[entries.length - 1];
  const diffMs = new Date(last.timestamp) - new Date(first.timestamp);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays === 0) return null;
  const tabDiff = first.tabCount - last.tabCount;
  return parseFloat((tabDiff / diffDays).toFixed(2));
}

function filterByMinBurnRate(sessions, minRate) {
  return sessions.filter(s => {
    const rate = computeBurnRate(s);
    return rate !== null && rate >= minRate;
  });
}

function sortByBurnRate(sessions) {
  return [...sessions].sort((a, b) => {
    const rateA = computeBurnRate(a) ?? -Infinity;
    const rateB = computeBurnRate(b) ?? -Infinity;
    return rateB - rateA;
  });
}

module.exports = {
  isValidBurndownEntry,
  recordBurndown,
  recordBurndownByName,
  clearBurndown,
  getBurndown,
  computeBurnRate,
  filterByMinBurnRate,
  sortByBurnRate
};
