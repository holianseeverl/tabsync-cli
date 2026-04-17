// mood.js — assign a mood/vibe to a session

const VALID_MOODS = ['focused', 'relaxed', 'urgent', 'exploratory', 'archived', 'chaotic'];

function isValidMood(mood) {
  return VALID_MOODS.includes(mood);
}

function setMood(sessions, id, mood) {
  if (!isValidMood(mood)) throw new Error(`Invalid mood: ${mood}`);
  return sessions.map(s => s.id === id ? { ...s, mood } : s);
}

function clearMood(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, mood: undefined } : s);
}

function setMoodByName(sessions, name, mood) {
  if (!isValidMood(mood)) throw new Error(`Invalid mood: ${mood}`);
  return sessions.map(s => s.name === name ? { ...s, mood } : s);
}

function getMood(sessions, id) {
  const s = sessions.find(s => s.id === id);
  return s ? s.mood || null : null;
}

function filterByMood(sessions, mood) {
  return sessions.filter(s => s.mood === mood);
}

function listMoods() {
  return [...VALID_MOODS];
}

module.exports = { isValidMood, setMood, clearMood, setMoodByName, getMood, filterByMood, listMoods };
