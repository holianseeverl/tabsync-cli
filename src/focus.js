// focus.js — mark a session as the current focus, track focus history

function setFocus(sessions, id) {
  return sessions.map(s => ({
    ...s,
    focused: s.id === id,
    focusedAt: s.id === id ? new Date().toISOString() : s.focusedAt
  }));
}

function clearFocus(sessions) {
  return sessions.map(s => ({ ...s, focused: false }));
}

function getFocused(sessions) {
  return sessions.find(s => s.focused) || null;
}

function setFocusByName(sessions, name) {
  const target = sessions.find(s => s.name === name);
  if (!target) return null;
  return setFocus(sessions, target.id);
}

function listByFocusRecency(sessions) {
  return [...sessions]
    .filter(s => s.focusedAt)
    .sort((a, b) => new Date(b.focusedAt) - new Date(a.focusedAt));
}

function isFocused(session) {
  return session.focused === true;
}

module.exports = { setFocus, clearFocus, getFocused, setFocusByName, listByFocusRecency, isFocused };
