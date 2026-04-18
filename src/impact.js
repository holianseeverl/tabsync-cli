// impact: assign and query impact level for sessions

const VALID_IMPACTS = ['low', 'medium', 'high', 'critical'];

function isValidImpact(impact) {
  return VALID_IMPACTS.includes(impact);
}

function setImpact(session, impact) {
  if (!isValidImpact(impact)) throw new Error(`Invalid impact: ${impact}`);
  return { ...session, impact };
}

function clearImpact(session) {
  const s = { ...session };
  delete s.impact;
  return s;
}

function setImpactByName(sessions, name, impact) {
  return sessions.map(s => s.name === name ? setImpact(s, impact) : s);
}

function getImpact(session) {
  return session.impact || null;
}

function filterByImpact(sessions, impact) {
  return sessions.filter(s => s.impact === impact);
}

function sortByImpact(sessions) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...sessions].sort((a, b) => {
    const ai = order[a.impact] ?? 99;
    const bi = order[b.impact] ?? 99;
    return ai - bi;
  });
}

module.exports = { isValidImpact, setImpact, clearImpact, setImpactByName, getImpact, filterByImpact, sortByImpact, VALID_IMPACTS };
