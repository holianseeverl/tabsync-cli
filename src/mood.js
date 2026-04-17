const VALID_MOODS = ['focused', 'relaxed', 'urgent', 'curious', 'overwhelmed'];

function isValidMood(mood) {
  return VALID_MOODS.includes(mood);
}

function setMood(session, mood) {
  if (!isValidMood(mood)) throw new Error(`Invalid mood: ${mood}. Valid: ${VALID_MOODS.join(', ')}`);
  return { ...session, mood };
}

function clearMood(session) {
  const s = { ...session };
  delete s.mood;
  return s;
}

function setMoodByName(sessions, name, mood) {
  return sessions.map(s => s.name === name ? setMood(s, mood) : s);
}

function getMood(session) {
  return session.mood || null;
}

function filterByMood(sessions, mood) {
  return sessions.filter(s => s.mood === mood);
}

function sortByMood(sessions) {
  const order = VALID_MOODS;
  return [...sessions].sort((a, b) => {
    const ai = a.mood ? order.indexOf(a.mood) : order.length;
    const bi = b.mood ? order.indexOf(b.mood) : order.length;
    return ai - bi;
  });
}

module.exports = { isValidMood, setMood, clearMood, setMoodByName, getMood, filterByMood, sortByMood, VALID_MOODS };
