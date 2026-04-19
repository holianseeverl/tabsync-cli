// rhythm.js — track session work rhythm (daily activity pattern)

const VALID_RHYTHMS = ['morning', 'afternoon', 'evening', 'night', 'flexible'];

function isValidRhythm(rhythm) {
  return VALID_RHYTHMS.includes(rhythm);
}

function setRhythm(session, rhythm) {
  if (!isValidRhythm(rhythm)) throw new Error(`Invalid rhythm: ${rhythm}`);
  return { ...session, rhythm };
}

function clearRhythm(session) {
  const s = { ...session };
  delete s.rhythm;
  return s;
}

function setRhythmByName(sessions, name, rhythm) {
  return sessions.map(s => s.name === name ? setRhythm(s, rhythm) : s);
}

function getRhythm(session) {
  return session.rhythm || null;
}

function filterByRhythm(sessions, rhythm) {
  return sessions.filter(s => s.rhythm === rhythm);
}

function sortByRhythm(sessions) {
  return [...sessions].sort((a, b) => {
    const ai = VALID_RHYTHMS.indexOf(a.rhythm || '');
    const bi = VALID_RHYTHMS.indexOf(b.rhythm || '');
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

module.exports = {
  isValidRhythm,
  setRhythm,
  clearRhythm,
  setRhythmByName,
  getRhythm,
  filterByRhythm,
  sortByRhythm,
  VALID_RHYTHMS,
};
