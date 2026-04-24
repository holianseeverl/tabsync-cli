// catalyst.js — track what triggered or initiated a session

const VALID_CATALYSTS = ['manual', 'scheduled', 'triggered', 'imported', 'cloned', 'restored'];

function isValidCatalyst(catalyst) {
  return VALID_CATALYSTS.includes(catalyst);
}

function setCatalyst(session, catalyst) {
  if (!isValidCatalyst(catalyst)) {
    throw new Error(`Invalid catalyst: "${catalyst}". Must be one of: ${VALID_CATALYSTS.join(', ')}`);
  }
  return { ...session, catalyst };
}

function clearCatalyst(session) {
  const updated = { ...session };
  delete updated.catalyst;
  return updated;
}

function setCatalystByName(sessions, name, catalyst) {
  return sessions.map(s => s.name === name ? setCatalyst(s, catalyst) : s);
}

function getCatalyst(session) {
  return session.catalyst || null;
}

function filterByCatalyst(sessions, catalyst) {
  return sessions.filter(s => s.catalyst === catalyst);
}

function groupByCatalyst(sessions) {
  return sessions.reduce((acc, s) => {
    const key = s.catalyst || 'unset';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}

function sortByCatalyst(sessions) {
  return [...sessions].sort((a, b) => {
    const ca = VALID_CATALYSTS.indexOf(a.catalyst ?? '');
    const cb = VALID_CATALYSTS.indexOf(b.catalyst ?? '');
    return ca - cb;
  });
}

module.exports = {
  isValidCatalyst,
  setCatalyst,
  clearCatalyst,
  setCatalystByName,
  getCatalyst,
  filterByCatalyst,
  groupByCatalyst,
  sortByCatalyst,
  VALID_CATALYSTS,
};
