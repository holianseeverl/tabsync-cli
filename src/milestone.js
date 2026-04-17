const VALID_MILESTONES = ['draft', 'in-progress', 'review', 'done', 'archived'];

function isValidMilestone(milestone) {
  return VALID_MILESTONES.includes(milestone);
}

function setMilestone(session, milestone) {
  if (!isValidMilestone(milestone)) throw new Error(`Invalid milestone: ${milestone}`);
  return { ...session, milestone };
}

function clearMilestone(session) {
  const s = { ...session };
  delete s.milestone;
  return s;
}

function setMilestoneByName(sessions, name, milestone) {
  return sessions.map(s => s.name === name ? setMilestone(s, milestone) : s);
}

function getMilestone(session) {
  return session.milestone || null;
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

function listMilestones() {
  return [...VALID_MILESTONES];
}

module.exports = { isValidMilestone, setMilestone, clearMilestone, setMilestoneByName, getMilestone, filterByMilestone, sortByMilestone, listMilestones };
