// streak.js — track how many days in a row a session has been accessed

function getStreak(session) {
  return session.streak || { count: 0, lastAccessed: null };
}

function incrementStreak(session, now = new Date().toISOString()) {
  const streak = getStreak(session);
  const last = streak.lastAccessed ? new Date(streak.lastAccessed) : null;
  const today = new Date(now);

  let newCount = 1;
  if (last) {
    const diffMs = today - last;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newCount = streak.count + 1;
    } else if (diffDays === 0) {
      newCount = streak.count; // same day, no change
    }
  }

  return {
    ...session,
    streak: { count: newCount, lastAccessed: now }
  };
}

function clearStreak(session) {
  const s = { ...session };
  delete s.streak;
  return s;
}

function setStreakByName(sessions, name, now) {
  return sessions.map(s => s.name === name ? incrementStreak(s, now) : s);
}

function filterByMinStreak(sessions, min) {
  return sessions.filter(s => (s.streak?.count || 0) >= min);
}

function sortByStreak(sessions) {
  return [...sessions].sort((a, b) => (b.streak?.count || 0) - (a.streak?.count || 0));
}

module.exports = { getStreak, incrementStreak, clearStreak, setStreakByName, filterByMinStreak, sortByStreak };
