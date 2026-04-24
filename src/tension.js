// tension: tracks the tension level of a session (low, medium, high, critical)

const VALID_TENSIONS = ['low', 'medium', 'high', 'critical'];

function isValidTension(tension) {
  return VALID_TENSIONS.includes(tension);
}

function setTension(session, tension) {
  if (!isValidTension(tension)) {
    throw new Error(`Invalid tension: "${tension}". Must be one of: ${VALID_TENSIONS.join(', ')}`);
  }
  return { ...session, tension };
}

function clearTension(session) {
  const updated = { ...session };
  delete updated.tension;
  return updated;
}

function setTensionByName(sessions, name, tension) {
  return sessions.map(s => s.name === name ? setTension(s, tension) : s);
}

function getTension(session) {
  return session.tension || null;
}

function filterByTension(sessions, tension) {
  if (!isValidTension(tension)) {
    throw new Error(`Invalid tension: "${tension}"`);
  }
  return sessions.filter(s => s.tension === tension);
}

const TENSION_ORDER = { low: 0, medium: 1, high: 2, critical: 3 };

function sortByTension(sessions, direction = 'asc') {
  return [...sessions].sort((a, b) => {
    const aVal = TENSION_ORDER[a.tension] ?? -1;
    const bVal = TENSION_ORDER[b.tension] ?? -1;
    return direction === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

module.exports = {
  isValidTension,
  setTension,
  clearTension,
  setTensionByName,
  getTension,
  filterByTension,
  sortByTension,
  VALID_TENSIONS
};
