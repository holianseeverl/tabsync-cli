/**
 * color.js — Assign, remove, and filter sessions by color label
 */

const VALID_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'];

function isValidColor(color) {
  return VALID_COLORS.includes(color.toLowerCase());
}

function colorSession(sessions, sessionId, color) {
  if (!isValidColor(color)) {
    throw new Error(`Invalid color "${color}". Valid colors: ${VALID_COLORS.join(', ')}`);
  }
  return sessions.map(s =>
    s.id === sessionId ? { ...s, color: color.toLowerCase() } : s
  );
}

function uncolorSession(sessions, sessionId) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const updated = { ...s };
    delete updated.color;
    return updated;
  });
}

function filterByColor(sessions, color) {
  if (!isValidColor(color)) {
    throw new Error(`Invalid color "${color}". Valid colors: ${VALID_COLORS.join(', ')}`);
  }
  return sessions.filter(s => s.color === color.toLowerCase());
}

function getSessionColor(sessions, sessionId) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return null;
  return session.color || null;
}

function colorSessionByName(sessions, name, color) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return colorSession(sessions, session.id, color);
}

module.exports = {
  colorSession,
  uncolorSession,
  filterByColor,
  getSessionColor,
  colorSessionByName,
  VALID_COLORS,
};
