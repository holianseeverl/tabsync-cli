// friction.js — track friction level for a session (1–5 scale)

const VALID_FRICTION = [1, 2, 3, 4, 5];

function isValidFriction(value) {
  return VALID_FRICTION.includes(value);
}

function setFriction(sessions, id, value) {
  if (!isValidFriction(value)) throw new Error(`Invalid friction value: ${value}. Must be 1–5.`);
  return sessions.map(s => s.id === id ? { ...s, friction: value } : s);
}

function clearFriction(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, friction: undefined } : s);
}

function setFrictionByName(sessions, name, value) {
  const match = sessions.find(s => s.name === name);
  if (!match) throw new Error(`Session not found: ${name}`);
  return setFriction(sessions, match.id, value);
}

function getFriction(session) {
  return session.friction ?? null;
}

function filterByFriction(sessions, value) {
  return sessions.filter(s => s.friction === value);
}

function filterByMinFriction(sessions, min) {
  return sessions.filter(s => s.friction != null && s.friction >= min);
}

function sortByFriction(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const fa = a.friction ?? 0;
    const fb = b.friction ?? 0;
    return order === 'asc' ? fa - fb : fb - fa;
  });
}

module.exports = {
  isValidFriction,
  setFriction,
  clearFriction,
  setFrictionByName,
  getFriction,
  filterByFriction,
  filterByMinFriction,
  sortByFriction,
};
