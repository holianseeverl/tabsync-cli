// progress.js — track tab reading/completion progress on sessions

function isValidProgress(value) {
  return typeof value === 'number' && value >= 0 && value <= 100;
}

function setProgress(sessions, id, value) {
  if (!isValidProgress(value)) throw new Error(`Invalid progress value: ${value}`);
  return sessions.map(s => s.id === id ? { ...s, progress: value } : s);
}

function clearProgress(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, progress: undefined } : s);
}

function setProgressByName(sessions, name, value) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  return setProgress(sessions, session.id, value);
}

function getProgress(sessions, id) {
  const session = sessions.find(s => s.id === id);
  if (!session) throw new Error(`Session not found: ${id}`);
  return session.progress !== undefined ? session.progress : null;
}

function filterByMinProgress(sessions, min) {
  return sessions.filter(s => typeof s.progress === 'number' && s.progress >= min);
}

function filterComplete(sessions) {
  return sessions.filter(s => s.progress === 100);
}

function sortByProgress(sessions) {
  return [...sessions].sort((a, b) => (b.progress ?? -1) - (a.progress ?? -1));
}

module.exports = {
  isValidProgress,
  setProgress,
  clearProgress,
  setProgressByName,
  getProgress,
  filterByMinProgress,
  filterComplete,
  sortByProgress
};
