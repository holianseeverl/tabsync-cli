// budget: track a numeric "tab budget" (max tabs) per session

function isValidBudget(value) {
  return typeof value === 'number' && value >= 1 && Number.isInteger(value);
}

function setBudget(session, budget) {
  if (!isValidBudget(budget)) throw new Error(`Invalid budget: ${budget}`);
  return { ...session, budget };
}

function clearBudget(session) {
  const s = { ...session };
  delete s.budget;
  return s;
}

function setBudgetByName(sessions, name, budget) {
  return sessions.map(s => s.name === name ? setBudget(s, budget) : s);
}

function getBudget(session) {
  return session.budget ?? null;
}

function isOverBudget(session) {
  if (session.budget == null) return false;
  return (session.tabs || []).length > session.budget;
}

function filterOverBudget(sessions) {
  return sessions.filter(isOverBudget);
}

function filterWithinBudget(sessions) {
  return sessions.filter(s => !isOverBudget(s));
}

function sortByBudget(sessions) {
  return [...sessions].sort((a, b) => (a.budget ?? Infinity) - (b.budget ?? Infinity));
}

module.exports = {
  isValidBudget,
  setBudget,
  clearBudget,
  setBudgetByName,
  getBudget,
  isOverBudget,
  filterOverBudget,
  filterWithinBudget,
  sortByBudget,
};
