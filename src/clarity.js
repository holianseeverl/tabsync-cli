// clarity: how clear/well-defined a session's purpose is (1-5)

const VALID_CLARITY = [1, 2, 3, 4, 5];

function isValidClarity(value) {
  return VALID_CLARITY.includes(value);
}

function setClarity(session, value) {
  if (!isValidClarity(value)) throw new Error(`Invalid clarity: ${value}. Must be 1-5.`);
  return { ...session, clarity: value };
}

function clearClarity(session) {
  const s = { ...session };
  delete s.clarity;
  return s;
}

function setClarityByName(sessions, name, value) {
  return sessions.map(s => s.name === name ? setClarity(s, value) : s);
}

function getClarity(session) {
  return session.clarity ?? null;
}

function filterByClarity(sessions, value) {
  return sessions.filter(s => s.clarity === value);
}

function filterByMinClarity(sessions, min) {
  return sessions.filter(s => s.clarity != null && s.clarity >= min);
}

function sortByClarity(sessions, dir = 'desc') {
  return [...sessions].sort((a, b) => {
    const ca = a.clarity ?? 0;
    const cb = b.clarity ?? 0;
    return dir === 'asc' ? ca - cb : cb - ca;
  });
}

module.exports = {
  isValidClarity,
  setClarity,
  clearClarity,
  setClarityByName,
  getClarity,
  filterByClarity,
  filterByMinClarity,
  sortByClarity
};
