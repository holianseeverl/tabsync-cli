// friction.js - track friction level for sessions

const VALID_FRICTION = ['none', 'low', 'medium', 'high', 'blocking'];

function isValidFriction(level) {
  return VALID_FRICTION.includes(level);
}

function setFriction(session, level) {
  if (!isValidFriction(level)) throw new Error(`Invalid friction level: ${level}`);
  return { ...session, friction: level };
}

function clearFriction(session) {
  const s = { ...session };
  delete s.friction;
  return s;
}

function setFrictionByName(sessions, name, level) {
  return sessions.map(s => s.name === name ? setFriction(s, level) : s);
}

function getFriction(session) {
  return session.friction || null;
}

function filterByFriction(sessions, level) {
  return sessions.filter(s => s.friction === level);
}

function sortByFriction(sessions) {
  return [...sessions].sort((a, b) => {
    const ai = VALID_FRICTION.indexOf(a.friction || 'none');
    const bi = VALID_FRICTION.indexOf(b.friction || 'none');
    return bi - ai;
  });
}

function listHighFriction(sessions) {
  return sessions.filter(s => s.friction === 'high' || s.friction === 'blocking');
}

module.exports = {
  isValidFriction,
  setFriction,
  clearFriction,
  setFrictionByName,
  getFriction,
  filterByFriction,
  sortByFriction,
  listHighFriction,
  VALID_FRICTION
};
