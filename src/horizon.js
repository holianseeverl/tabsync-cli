// horizon: set a future target date/goal for a session

function setHorizon(session, date) {
  if (!date || isNaN(Date.parse(date))) throw new Error('Invalid date');
  return { ...session, horizon: new Date(date).toISOString() };
}

function clearHorizon(session) {
  const s = { ...session };
  delete s.horizon;
  return s;
}

function getHorizon(session) {
  return session.horizon || null;
}

function setHorizonByName(sessions, name, date) {
  return sessions.map(s => s.name === name ? setHorizon(s, date) : s);
}

function isOverdue(session) {
  if (!session.horizon) return false;
  return new Date(session.horizon) < new Date();
}

function listOverdue(sessions) {
  return sessions.filter(isOverdue);
}

function listUpcoming(sessions, days = 7) {
  const now = new Date();
  const limit = new Date(now.getTime() + days * 86400000);
  return sessions.filter(s => {
    if (!s.horizon) return false;
    const h = new Date(s.horizon);
    return h >= now && h <= limit;
  });
}

function sortByHorizon(sessions) {
  return [...sessions].sort((a, b) => {
    if (!a.horizon) return 1;
    if (!b.horizon) return -1;
    return new Date(a.horizon) - new Date(b.horizon);
  });
}

module.exports = { setHorizon, clearHorizon, getHorizon, setHorizonByName, isOverdue, listOverdue, listUpcoming, sortByHorizon };
