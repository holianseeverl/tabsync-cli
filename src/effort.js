// effort levels: low, medium, high, very-high
const VALID_EFFORTS = ['low', 'medium', 'high', 'very-high'];

function isValidEffort(effort) {
  return VALID_EFFORTS.includes(effort);
}

function setEffort(session, effort) {
  if (!isValidEffort(effort)) throw new Error(`Invalid effort: ${effort}`);
  return { ...session, effort };
}

function clearEffort(session) {
  const s = { ...session };
  delete s.effort;
  return s;
}

function setEffortByName(sessions, name, effort) {
  return sessions.map(s => s.name === name ? setEffort(s, effort) : s);
}

function getEffort(session) {
  return session.effort || null;
}

const EFFORT_ORDER = { 'low': 0, 'medium': 1, 'high': 2, 'very-high': 3 };

function sortByEffort(sessions, asc = true) {
  return [...sessions].sort((a, b) => {
    const av = EFFORT_ORDER[a.effort] ?? -1;
    const bv = EFFORT_ORDER[b.effort] ?? -1;
    return asc ? av - bv : bv - av;
  });
}

function filterByEffort(sessions, effort) {
  return sessions.filter(s => s.effort === effort);
}

function filterByMinEffort(sessions, minEffort) {
  const min = EFFORT_ORDER[minEffort] ?? 0;
  return sessions.filter(s => (EFFORT_ORDER[s.effort] ?? -1) >= min);
}

module.exports = {
  isValidEffort,
  setEffort,
  clearEffort,
  setEffortByName,
  getEffort,
  sortByEffort,
  filterByEffort,
  filterByMinEffort,
  VALID_EFFORTS
};
