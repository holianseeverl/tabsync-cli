// milestone.js — attach milestone markers to sessions

const VALID_MILESTONES = ['draft', 'in-progress', 'review', 'done', 'archived'];

function isValidMilestone(milestone) {
  return VALID_MILESTONES.includes(milestone);
}

function setMilestone(sessions, id, milestone) {
  if (!isValidMilestone(milestone)) {
    throw new Error(`Invalid milestone: "${milestone}". Must be one of: ${VALID_MILESTONES.join(', ')}`);
  }
  return sessions.map(s => s.id === id ? { ...s, milestone } : s);
}

function clearMilestone(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, milestone: undefined } : s);
}

function setMilestoneByName(sessions, name, milestone) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: "${name}"`);
  return setMilestone(sessions, session.id, milestone);
}

function getMilestone(sessions, id) {
  const session = sessions.find(s => s.id === id);
  return session ? session.milestone || null : null;
}

function filterByMilestone(sessions, milestone) {
  return sessions.filter(s => s.milestone === milestone);
}

function sortByMilestone(sessions) {
  return [...sessions].sort((a, b) => {
    const ai = VALID_MILESTONES.indexOf(a.milestone || '');
    const bi = VALID_MILESTONES.indexOf(b.milestone || '');
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

module.exports = {
  isValidMilestone,
  setMilestone,
  clearMilestone,
  setMilestoneByName,
  getMilestone,
  filterByMilestone,
  sortByMilestone,
  VALID_MILESTONES,
};
