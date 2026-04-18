// confidence.js — set/get a confidence level (0–100) on sessions

function isValidConfidence(value) {
  return typeof value === 'number' && value >= 0 && value <= 100;
}

function setConfidence(session, value) {
  if (!isValidConfidence(value)) throw new Error(`Invalid confidence value: ${value}`);
  return { ...session, confidence: value };
}

function clearConfidence(session) {
  const s = { ...session };
  delete s.confidence;
  return s;
}

function setConfidenceByName(sessions, name, value) {
  return sessions.map(s => s.name === name ? setConfidence(s, value) : s);
}

function getConfidence(session) {
  return session.confidence ?? null;
}

function filterByMinConfidence(sessions, min) {
  return sessions.filter(s => typeof s.confidence === 'number' && s.confidence >= min);
}

function sortByConfidence(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const ca = a.confidence ?? -1;
    const cb = b.confidence ?? -1;
    return order === 'asc' ? ca - cb : cb - ca;
  });
}

module.exports = {
  isValidConfidence,
  setConfidence,
  clearConfidence,
  setConfidenceByName,
  getConfidence,
  filterByMinConfidence,
  sortByConfidence,
};
