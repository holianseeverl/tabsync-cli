// weight: assign a numeric weight (importance/effort) to sessions

const MIN_WEIGHT = 0;
const MAX_WEIGHT = 100;

function isValidWeight(w) {
  return typeof w === 'number' && w >= MIN_WEIGHT && w <= MAX_WEIGHT;
}

function setWeight(session, weight) {
  if (!isValidWeight(weight)) throw new Error(`Weight must be a number between ${MIN_WEIGHT} and ${MAX_WEIGHT}`);
  return { ...session, weight };
}

function clearWeight(session) {
  const s = { ...session };
  delete s.weight;
  return s;
}

function setWeightByName(sessions, name, weight) {
  return sessions.map(s => s.name === name ? setWeight(s, weight) : s);
}

function getWeight(session) {
  return session.weight ?? null;
}

function filterByMinWeight(sessions, min) {
  return sessions.filter(s => typeof s.weight === 'number' && s.weight >= min);
}

function filterByMaxWeight(sessions, max) {
  return sessions.filter(s => typeof s.weight === 'number' && s.weight <= max);
}

function sortByWeight(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const wa = a.weight ?? -1;
    const wb = b.weight ?? -1;
    return order === 'asc' ? wa - wb : wb - wa;
  });
}

module.exports = { isValidWeight, setWeight, clearWeight, setWeightByName, getWeight, filterByMinWeight, filterByMaxWeight, sortByWeight };
