// spotlight.js — quick-access pinned/favorite sessions summary

function getSpotlight(sessions) {
  return sessions.filter(s => s.pinned || s.favorite);
}

function getSpotlightByTag(sessions, tag) {
  return getSpotlight(sessions).filter(s => Array.isArray(s.tags) && s.tags.includes(tag));
}

function getSpotlightByPriority(sessions, priority) {
  return getSpotlight(sessions).filter(s => s.priority === priority);
}

function formatSpotlightEntry(session) {
  const badges = [];
  if (session.pinned) badges.push('[pinned]');
  if (session.favorite) badges.push('[fav]');
  if (session.priority) badges.push(`[${session.priority}]`);
  const tabCount = Array.isArray(session.tabs) ? session.tabs.length : 0;
  return `${session.name} ${badges.join(' ')} — ${tabCount} tab(s)`;
}

function spotlightSummary(sessions) {
  const items = getSpotlight(sessions);
  if (items.length === 0) return 'No spotlight sessions found.';
  return items.map(formatSpotlightEntry).join('\n');
}

module.exports = { getSpotlight, getSpotlightByTag, getSpotlightByPriority, formatSpotlightEntry, spotlightSummary };
