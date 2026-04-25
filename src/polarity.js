// polarity: assign a positive/negative/neutral polarity to a session

const VALID_POLARITIES = ['positive', 'negative', 'neutral'];

function isValidPolarity(polarity) {
  return VALID_POLARITIES.includes(polarity);
}

function setPolarity(session, polarity) {
  if (!isValidPolarity(polarity)) {
    throw new Error(`Invalid polarity: "${polarity}". Must be one of: ${VALID_POLARITIES.join(', ')}`);
  }
  return { ...session, polarity };
}

function clearPolarity(session) {
  const updated = { ...session };
  delete updated.polarity;
  return updated;
}

function setPolarityByName(sessions, name, polarity) {
  return sessions.map(s => s.name === name ? setPolarity(s, polarity) : s);
}

function getPolarity(session) {
  return session.polarity || null;
}

function filterByPolarity(sessions, polarity) {
  if (!isValidPolarity(polarity)) {
    throw new Error(`Invalid polarity: "${polarity}"`);
  }
  return sessions.filter(s => s.polarity === polarity);
}

function sortByPolarity(sessions) {
  const order = { positive: 0, neutral: 1, negative: 2 };
  return [...sessions].sort((a, b) => {
    const pa = order[a.polarity] ?? 3;
    const pb = order[b.polarity] ?? 3;
    return pa - pb;
  });
}

module.exports = {
  isValidPolarity,
  setPolarity,
  clearPolarity,
  setPolarityByName,
  getPolarity,
  filterByPolarity,
  sortByPolarity,
  VALID_POLARITIES,
};
