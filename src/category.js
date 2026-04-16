// category.js — assign/filter sessions by category

const VALID_CATEGORIES = ['work', 'personal', 'research', 'shopping', 'media', 'dev', 'other'];

function isValidCategory(category) {
  return VALID_CATEGORIES.includes(category);
}

function setCategory(sessions, id, category) {
  if (!isValidCategory(category)) throw new Error(`Invalid category: ${category}`);
  return sessions.map(s => s.id === id ? { ...s, category } : s);
}

function clearCategory(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, category: undefined } : s);
}

function setCategoryByName(sessions, name, category) {
  if (!isValidCategory(category)) throw new Error(`Invalid category: ${category}`);
  return sessions.map(s => s.name === name ? { ...s, category } : s);
}

function getCategory(sessions, id) {
  const s = sessions.find(s => s.id === id);
  return s ? s.category || null : null;
}

function filterByCategory(sessions, category) {
  if (!isValidCategory(category)) throw new Error(`Invalid category: ${category}`);
  return sessions.filter(s => s.category === category);
}

function listCategories() {
  return [...VALID_CATEGORIES];
}

module.exports = { isValidCategory, setCategory, clearCategory, setCategoryByName, getCategory, filterByCategory, listCategories };
