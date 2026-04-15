// label.js — assign, remove, and filter sessions by custom labels

function addLabel(sessions, sessionId, label) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const labels = s.labels ? [...s.labels] : [];
    if (!labels.includes(label)) labels.push(label);
    return { ...s, labels };
  });
}

function removeLabel(sessions, sessionId, label) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const labels = (s.labels || []).filter(l => l !== label);
    return { ...s, labels };
  });
}

function addLabelByName(sessions, name, label) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return addLabel(sessions, session.id, label);
}

function removeLabelByName(sessions, name, label) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return removeLabel(sessions, session.id, label);
}

function filterByLabel(sessions, label) {
  return sessions.filter(s => Array.isArray(s.labels) && s.labels.includes(label));
}

function getAllLabels(sessions) {
  const set = new Set();
  for (const s of sessions) {
    if (Array.isArray(s.labels)) s.labels.forEach(l => set.add(l));
  }
  return [...set].sort();
}

function getLabels(session) {
  return session.labels || [];
}

module.exports = { addLabel, removeLabel, addLabelByName, removeLabelByName, filterByLabel, getAllLabels, getLabels };
