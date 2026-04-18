// deadline.js — set/clear/check deadlines on sessions

function setDeadline(session, isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${isoDate}`);
  return { ...session, deadline: d.toISOString() };
}

function clearDeadline(session) {
  const s = { ...session };
  delete s.deadline;
  return s;
}

function getDeadline(session) {
  return session.deadline || null;
}

function setDeadlineByName(sessions, name, isoDate) {
  return sessions.map(s => s.name === name ? setDeadline(s, isoDate) : s);
}

function isOverdue(session) {
  if (!session.deadline) return false;
  return new Date(session.deadline) < new Date();
}

function listOverdue(sessions) {
  return sessions.filter(isOverdue);
}

function listUpcoming(sessions, withinMs = 7 * 24 * 60 * 60 * 1000) {
  const now = new Date();
  return sessions.filter(s => {
    if (!s.deadline) return false;
    const d = new Date(s.deadline);
    return d >= now && d - now <= withinMs;
  });
}

function sortByDeadline(sessions) {
  return [...sessions].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
}

module.exports = { setDeadline, clearDeadline, getDeadline, setDeadlineByName, isOverdue, listOverdue, listUpcoming, sortByDeadline };
