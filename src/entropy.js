// entropy.js — measures disorder/chaos level of a session based on various signals

const ENTROPY_LEVELS = ['calm', 'low', 'moderate', 'high', 'chaotic'];

function isValidEntropy(value) {
  return ENTROPY_LEVELS.includes(value);
}

function computeEntropy(session) {
  let score = 0;

  // More tabs = more chaos
  const tabCount = (session.tabs || []).length;
  if (tabCount > 20) score += 3;
  else if (tabCount > 10) score += 2;
  else if (tabCount > 5) score += 1;

  // High friction adds entropy
  if (session.friction === 'high') score += 2;
  else if (session.friction === 'medium') score += 1;

  // High tension adds entropy
  if (session.tension === 'high') score += 2;
  else if (session.tension === 'medium') score += 1;

  // Low clarity adds entropy
  if (session.clarity === 'low') score += 2;
  else if (session.clarity === 'medium') score += 1;

  // No priority set adds entropy
  if (!session.priority) score += 1;

  if (score >= 7) return 'chaotic';
  if (score >= 5) return 'high';
  if (score >= 3) return 'moderate';
  if (score >= 1) return 'low';
  return 'calm';
}

function setEntropy(session, value) {
  if (!isValidEntropy(value)) throw new Error(`Invalid entropy level: ${value}`);
  return { ...session, entropy: value };
}

function clearEntropy(session) {
  const s = { ...session };
  delete s.entropy;
  return s;
}

function setEntropyByName(sessions, name, value) {
  return sessions.map(s => s.name === name ? setEntropy(s, value) : s);
}

function getEntropy(session) {
  return session.entropy || null;
}

function filterByEntropy(sessions, level) {
  return sessions.filter(s => s.entropy === level);
}

function sortByEntropy(sessions) {
  return [...sessions].sort((a, b) => {
    const ai = ENTROPY_LEVELS.indexOf(a.entropy || 'calm');
    const bi = ENTROPY_LEVELS.indexOf(b.entropy || 'calm');
    return bi - ai;
  });
}

module.exports = {
  isValidEntropy,
  computeEntropy,
  setEntropy,
  clearEntropy,
  setEntropyByName,
  getEntropy,
  filterByEntropy,
  sortByEntropy,
  ENTROPY_LEVELS
};
