// tempo: pace/rhythm level for a session
const VALID_TEMPOS = ['slow', 'steady', 'fast', 'sprint'];

function isValidTempo(tempo) {
  return VALID_TEMPOS.includes(tempo);
}

function setTempo(session, tempo) {
  if (!isValidTempo(tempo)) throw new Error(`Invalid tempo: ${tempo}`);
  return { ...session, tempo };
}

function clearTempo(session) {
  const s = { ...session };
  delete s.tempo;
  return s;
}

function setTempoByName(sessions, name, tempo) {
  return sessions.map(s => s.name === name ? setTempo(s, tempo) : s);
}

function getTempo(session) {
  return session.tempo || null;
}

function filterByTempo(sessions, tempo) {
  return sessions.filter(s => s.tempo === tempo);
}

function sortByTempo(sessions) {
  const order = { sprint: 0, fast: 1, steady: 2, slow: 3 };
  return [...sessions].sort((a, b) => {
    const ao = a.tempo != null ? (order[a.tempo] ?? 99) : 99;
    const bo = b.tempo != null ? (order[b.tempo] ?? 99) : 99;
    return ao - bo;
  });
}

module.exports = { isValidTempo, setTempo, clearTempo, setTempoByName, getTempo, filterByTempo, sortByTempo, VALID_TEMPOS };
