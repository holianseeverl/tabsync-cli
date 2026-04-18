// energy level for sessions: 1 (low) to 5 (high)

const VALID_LEVELS = [1, 2, 3, 4, 5];

function isValidEnergy(level) {
  return VALID_LEVELS.includes(level);
}

function setEnergy(session, level) {
  if (!isValidEnergy(level)) throw new Error(`Invalid energy level: ${level}`);
  return { ...session, energy: level };
}

function clearEnergy(session) {
  const s = { ...session };
  delete s.energy;
  return s;
}

function setEnergyByName(sessions, name, level) {
  return sessions.map(s => s.name === name ? setEnergy(s, level) : s);
}

function getEnergy(session) {
  return session.energy ?? null;
}

function filterByEnergy(sessions, level) {
  return sessions.filter(s => s.energy === level);
}

function filterByMinEnergy(sessions, min) {
  return sessions.filter(s => s.energy != null && s.energy >= min);
}

function sortByEnergy(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const ea = a.energy ?? 0;
    const eb = b.energy ?? 0;
    return order === 'asc' ? ea - eb : eb - ea;
  });
}

module.exports = {
  isValidEnergy,
  setEnergy,
  clearEnergy,
  setEnergyByName,
  getEnergy,
  filterByEnergy,
  filterByMinEnergy,
  sortByEnergy,
};
